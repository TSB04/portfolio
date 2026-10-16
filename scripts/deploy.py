#!/usr/bin/env python3
"""Deliver the reviewed static build over verified SSH without changing Git history."""
import argparse
import hashlib
import io
import json
import re
from pathlib import Path
import shlex
import subprocess
import tarfile
import time
import shutil
import os
import sys

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("package", "deploy", "tls"))
    parser.add_argument("--host", default=os.environ.get("PORTFOLIO_SSH_HOST", ""))
    parser.add_argument("--jump", default=os.environ.get("PORTFOLIO_SSH_JUMP", ""))
    args = parser.parse_args()
    if args.action != "package" and not args.host:
        parser.error("Set PORTFOLIO_SSH_HOST or pass --host; keep operator settings outside the repository")
    if args.action != "tls":
        subprocess.run([sys.executable, "scripts/check-public-repo.py", "--build"], cwd=ROOT, check=True)
        subprocess.run(["node", "scripts/check-seo.mjs"], cwd=ROOT, check=True)
    for target in (args.host, args.jump):
        if target and (target.startswith("-") or not re.fullmatch(r"[A-Za-z0-9_.@:-]+", target)):
            raise ValueError("Invalid SSH target")
    ssh = Path("C:/Windows/System32/OpenSSH/ssh.exe")
    command = [str(ssh) if ssh.exists() else "ssh", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=yes", "-o", "ConnectTimeout=15"]
    if args.jump: command += ["-J", args.jump]
    command.append(args.host)

    def remote(arguments, data=None):
        subprocess.run([*command, shlex.join(arguments)], input=data, check=True)

    if args.action == "tls":
        remote(["python3", "-c", "import pathlib,sys; p=pathlib.Path.home()/'tsb-portfolio'; p.mkdir(exist_ok=True); (p/'promote.py').write_bytes(sys.stdin.buffer.read())"], (ROOT / "deploy/promote.py").read_bytes())
        remote(["python3", "tsb-portfolio/promote.py", "tls"])
        return

    dist = ROOT / "dist"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    build = f"{os.environ.get('GITHUB_RUN_ID', 'manual')}-{os.environ.get('GITHUB_RUN_ATTEMPT', '1')}"
    (dist / "version.json").write_text(json.dumps({"commit": commit, "build": build}) + "\n")
    for locale in ("en", "fr"):
        if not (dist / locale / "index.html").is_file(): raise RuntimeError("Build both locales before deployment")
    buffer = io.BytesIO()
    with tarfile.open(fileobj=buffer, mode="w:gz") as archive:
        for source in sorted(dist.rglob("*")):
            if source.is_symlink(): raise ValueError("Do not deploy symlinked output")
            if not source.is_file(): continue
            relative = source.relative_to(dist)
            if any(part.startswith(".env") or part in (".git", ".ssh", ".aws", ".azure", ".kube", ".private") for part in relative.parts) or source.suffix.lower() in (".pem", ".key", ".p8", ".p12", ".pfx", ".jks", ".keystore", ".db", ".sqlite", ".sqlite3") or source.name.lower() in ("operator.json", ".npmrc", ".netrc", "credentials.json"):
                raise ValueError("Private file in output")
            if b"PRIVATE KEY-----" in source.read_bytes(): raise ValueError("Signing material in output")
            archive.add(source, arcname="site/" + relative.as_posix(), recursive=False)
        for name in ("compose.yml", "nginx.conf", "ingress-http.conf", "ingress-https.conf"):
            archive.add(ROOT / "deploy" / name, arcname=name, recursive=False)
    data = buffer.getvalue()
    digest = hashlib.sha256(data).hexdigest()
    release = time.strftime("%Y%m%dT%H%M%S", time.gmtime()) + "-" + digest[:12]
    output = ROOT / ".deploy"; output.mkdir(exist_ok=True)
    (output / f"{release}.tar.gz").write_bytes(data)
    (output / "latest.json").write_text(json.dumps({"release": release, "sha256": digest, "bytes": len(data)}, indent=2))
    (output / "portfolio.tar.gz").write_bytes(data)
    shutil.copy2(ROOT / "deploy/promote.py", output / "promote.py")
    manifest = {"release": release, "commit": commit, "sha256": digest,
                "promoter_sha256": hashlib.sha256((output / "promote.py").read_bytes()).hexdigest()}
    (output / "release.json").write_text(json.dumps(manifest, indent=2) + "\n")
    if args.action == "package":
        print(json.dumps(manifest)); return
    remote(["python3", "-c", "import pathlib,sys; p=pathlib.Path.home()/'tsb-portfolio'; p.mkdir(exist_ok=True); (p/'promote.py').write_bytes(sys.stdin.buffer.read())"], (ROOT / "deploy/promote.py").read_bytes())
    print(f"Uploading {len(data):,} bytes, release {release}", flush=True)
    remote(["python3", "tsb-portfolio/promote.py", "deploy", "--release", release, "--sha256", digest], data)


if __name__ == "__main__": main()
