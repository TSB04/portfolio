#!/usr/bin/env python3
"""Promote only the portfolio static release; preserve the shared ingress and rollback."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import tarfile
import time
import urllib.request

ROOT = Path.home() / "tsb-portfolio"
INGRESS_EXTRA = None
INGRESS_CONTAINER = ""


def run(args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def compose():
    run(["docker", "compose", "-p", "tsb-portfolio", "-f", str(ROOT / "compose.yml"), "up", "-d", "--no-deps", "--force-recreate", "portfolio"])


def link(target):
    temporary = ROOT / "current.next"
    temporary.unlink(missing_ok=True)
    temporary.symlink_to(target, target_is_directory=True)
    temporary.replace(ROOT / "current")


def ingress(fragment, backup):
    items = json.loads(subprocess.check_output(["docker", "inspect", INGRESS_CONTAINER], text=True))
    template = Path(next(m["Source"] for m in items[0]["Mounts"] if m["Destination"] == "/etc/nginx/config-templates/default.conf.template"))
    current = subprocess.check_output(["docker", "exec", INGRESS_CONTAINER, "cat", "/etc/nginx/conf.d/default.conf"], text=True)
    paths = [(INGRESS_EXTRA, INGRESS_EXTRA.read_text(), "extra.conf"), (template, template.read_text(), "template.conf")]
    originals = {name: content for _, content, name in paths} | {"live.conf": current}
    for name, content in originals.items():
        path = backup / name; path.write_text(content); path.chmod(0o600)
    pattern = re.compile(r"\n?# BEGIN TSB PORTFOLIO\n.*?# END TSB PORTFOLIO\n?", re.S)
    def merge(content):
        return pattern.sub("\n", content).rstrip() + "\n\n" + fragment.strip() + "\n"
    def write_live(content):
        run(["docker", "exec", "-i", INGRESS_CONTAINER, "sh", "-c", "cat > /etc/nginx/conf.d/default.conf"], input=content, text=True)
    try:
        # Write in place: the active template is a file bind mount.
        for path, content, _ in paths: path.write_text(merge(content))
        write_live(merge(current))
        run(["docker", "exec", INGRESS_CONTAINER, "nginx", "-t"])
        run(["docker", "exec", INGRESS_CONTAINER, "nginx", "-s", "reload"])
    except Exception:
        for path, content, _ in paths: path.write_text(content)
        write_live(current)
        run(["docker", "exec", INGRESS_CONTAINER, "nginx", "-t"])
        run(["docker", "exec", INGRESS_CONTAINER, "nginx", "-s", "reload"])
        raise
    return template, originals


def verify():
    for _ in range(20):
        try:
            for locale in ("en", "fr"):
                request = urllib.request.Request(f"http://127.0.0.1/{locale}/", headers={"Host": "tsb-dev.fr"})
                with urllib.request.urlopen(request, timeout=5) as response:
                    html = response.read().decode()
                    if response.status != 200 or 'id="hero"' not in html or 'id="reading"' not in html or 'id="contact"' not in html:
                        raise ValueError("Portfolio verification failed")
            return
        except Exception:
            time.sleep(1)
    raise RuntimeError("Portfolio did not pass origin checks")


def main():
    global INGRESS_EXTRA, INGRESS_CONTAINER
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["deploy", "tls"])
    parser.add_argument("--release")
    parser.add_argument("--sha256")
    args = parser.parse_args()
    operator = json.loads((ROOT / "operator.json").read_text())
    for field in ("ingress_container", "docker_network"):
        if not isinstance(operator.get(field), str) or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]*", operator[field]):
            raise ValueError("Invalid private operator configuration")
    INGRESS_EXTRA = Path(operator["ingress_extra"]).expanduser()
    if not INGRESS_EXTRA.is_absolute() or not INGRESS_EXTRA.is_file():
        raise ValueError("Private ingress configuration file is unavailable")
    INGRESS_CONTAINER = operator["ingress_container"]
    os.environ["PORTFOLIO_DOCKER_NETWORK"] = operator["docker_network"]
    ROOT.mkdir(mode=0o755, exist_ok=True)
    # Serialize manual and automated promotions on the production host.
    import fcntl
    deployment_lock = (ROOT / ".promotion.lock").open("w")
    fcntl.flock(deployment_lock, fcntl.LOCK_EX)
    backup = ROOT / "backups" / time.strftime("%Y%m%dT%H%M%S")
    backup.mkdir(parents=True, mode=0o700, exist_ok=False)
    if args.action == "tls":
        ingress((ROOT / "ingress-https.conf").read_text(), backup)
        for attempt in range(10):
            result = subprocess.run(["curl", "--fail", "--silent", "--show-error", "--resolve", "tsb-dev.fr:443:127.0.0.1", "https://tsb-dev.fr/en/"], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
            if result.returncode == 0: break
            time.sleep(1)
        else:
            raise RuntimeError("Portfolio TLS verification failed after graceful reload")
        state_file = ROOT / "deployment.json"
        state = json.loads(state_file.read_text())
        state["tls"] = True
        state_file.write_text(json.dumps(state, indent=2))
        print(json.dumps({"status": "tls-configured", "domain": "tsb-dev.fr"}))
        return
    if not args.release or not re.fullmatch(r"[0-9]{8}T[0-9]{6}-[a-f0-9]{12}", args.release):
        raise ValueError("Invalid release")
    archive = sys.stdin.buffer.read(100_000_001)
    if len(archive) > 100_000_000 or hashlib.sha256(archive).hexdigest() != args.sha256:
        raise ValueError("Artifact integrity check failed")
    release = ROOT / "releases" / args.release
    release.mkdir(parents=True, exist_ok=False)
    with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as package:
        members = package.getmembers()
        if len(members) > 10_000 or sum(member.size for member in members) > 200_000_000:
            raise ValueError("Artifact exceeds deployment size limits")
        for member in members:
            path = PurePosixPath(member.name)
            if path.is_absolute() or ".." in path.parts or "\\" in member.name or not member.isfile():
                raise ValueError("Unsafe archive entry")
            if path.parts[0] != "site" and member.name not in ("compose.yml", "nginx.conf", "ingress-http.conf", "ingress-https.conf"):
                raise ValueError("Unexpected archive entry")
            if any(part.startswith(".env") or part in (".git", ".ssh", ".aws", ".azure", ".kube", ".private") for part in path.parts) or path.suffix.lower() in (".pem", ".key", ".p8", ".p12", ".pfx", ".jks", ".keystore", ".db", ".sqlite", ".sqlite3") or path.name.lower() in ("operator.json", ".npmrc", ".netrc", "credentials.json"):
                raise ValueError("Private file in public release")
            target = release.joinpath(*path.parts)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(package.extractfile(member).read()); target.chmod(0o644)
    for locale in ("en", "fr"):
        if not (release / "site" / locale / "index.html").is_file(): raise ValueError("Missing locale")
    previous = (ROOT / "current").resolve() if (ROOT / "current").exists() else None
    old_configs = {}
    for name in ("compose.yml", "nginx.conf", "ingress-http.conf", "ingress-https.conf"):
        path = ROOT / name
        old_configs[name] = path.read_bytes() if path.exists() else None
        if path.exists(): shutil.copy2(path, backup / name)
        shutil.copy2(release / name, path)
    # Retain immutable assets referenced by already-open browsers across a release.
    if previous and (previous / "_astro").is_dir():
        for asset in (previous / "_astro").iterdir():
            destination = release / "site/_astro" / asset.name
            if asset.is_file() and not destination.exists(): shutil.copy2(asset, destination)
    ingress_state = None
    try:
        link(release / "site")
        compose()
        tls_ready = subprocess.run(["docker", "exec", INGRESS_CONTAINER, "test", "-f", "/etc/letsencrypt/live/tsb-dev.fr/fullchain.pem"]).returncode == 0
        ingress_state = ingress((ROOT / ("ingress-https.conf" if tls_ready else "ingress-http.conf")).read_text(), backup)
        if tls_ready:
            for path in ("en/", "fr/", "robots.txt", "sitemap-index.xml", "sitemap-0.xml", "og-image.png", "version.json"):
                run(["docker", "exec", INGRESS_CONTAINER, "wget", "-q", "--spider", f"http://tsb-portfolio-origin/{path}"])
        else:
            verify()
        version = release / "site/version.json"
        commit = json.loads(version.read_text()).get("commit") if version.exists() else None
        state = {"status": "active", "release": args.release, "sha256": args.sha256, "commit": commit, "previous": str(previous) if previous else None, "tls": tls_ready}
        (ROOT / "deployment.json").write_text(json.dumps(state, indent=2))
        print(json.dumps(state))
    except Exception:
        if ingress_state:
            template, originals = ingress_state
            INGRESS_EXTRA.write_text(originals["extra.conf"]); template.write_text(originals["template.conf"])
            run(["docker", "exec", "-i", INGRESS_CONTAINER, "sh", "-c", "cat > /etc/nginx/conf.d/default.conf"], input=originals["live.conf"], text=True)
            run(["docker", "exec", INGRESS_CONTAINER, "nginx", "-t"])
            run(["docker", "exec", INGRESS_CONTAINER, "nginx", "-s", "reload"])
        if previous:
            for name, data in old_configs.items():
                if data is not None: (ROOT / name).write_bytes(data)
            link(previous); compose()
        else:
            run(["docker", "compose", "-p", "tsb-portfolio", "-f", str(ROOT / "compose.yml"), "stop", "portfolio"])
        raise


if __name__ == "__main__": main()
