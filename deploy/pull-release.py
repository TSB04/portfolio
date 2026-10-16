#!/usr/bin/env python3
"""Pull only a validated release for the current main commit, over outbound HTTPS."""
import fcntl
import hashlib
import json
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request

ROOT = Path.home() / "tsb-portfolio"
REPO = "TSB04/portfolio2"
API = f"https://api.github.com/repos/{REPO}"
HEADERS = {"Accept": "application/vnd.github+json", "User-Agent": "tsb-portfolio-deployer"}


def download(url, limit):
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read(limit + 1)
    if len(data) > limit:
        raise ValueError("Release response exceeds size limit")
    return data


def deploy():
    commit = json.loads(download(f"{API}/commits/main", 1_000_000))["sha"]
    if not re.fullmatch(r"[a-f0-9]{40}", commit):
        raise ValueError("Invalid main commit")
    state_file = ROOT / "deployment.json"
    if state_file.exists() and json.loads(state_file.read_text()).get("commit") == commit:
        return
    try:
        release = json.loads(download(f"{API}/releases/tags/portfolio-{commit}", 1_000_000))
    except urllib.error.HTTPError as error:
        if error.code == 404:
            logging.info("Main %s is waiting for a validated CI release", commit[:12]); return
        raise
    if release.get("draft") or release.get("tag_name") != f"portfolio-{commit}":
        raise ValueError("Unexpected release")
    assets = {asset["name"]: asset["browser_download_url"] for asset in release["assets"]}
    required = ("release.json", "portfolio.tar.gz", "promote.py")
    if not all(name in assets for name in required):
        logging.info("CI release assets are still uploading"); return
    prefix = f"https://github.com/{REPO}/releases/download/portfolio-{commit}/"
    if not all(assets[name].startswith(prefix) for name in required):
        raise ValueError("Unexpected release asset origin")
    manifest = json.loads(download(assets["release.json"], 10_000))
    if manifest.get("commit") != commit:
        raise ValueError("Release commit mismatch")
    if not re.fullmatch(r"\d{8}T\d{6}-[a-f0-9]{12}", manifest.get("release", "")):
        raise ValueError("Invalid deployment release name")
    archive = download(assets["portfolio.tar.gz"], 100_000_000)
    promoter = download(assets["promote.py"], 100_000)
    if hashlib.sha256(archive).hexdigest() != manifest.get("sha256") or hashlib.sha256(promoter).hexdigest() != manifest.get("promoter_sha256"):
        raise ValueError("Release checksum mismatch")
    # Do not promote a superseded build while a newer main revision is pending.
    if json.loads(download(f"{API}/commits/main", 1_000_000))["sha"] != commit:
        logging.info("Skipping superseded release %s", commit[:12]); return
    with tempfile.TemporaryDirectory(prefix="portfolio-promote-", dir=ROOT) as temporary:
        script = Path(temporary) / "promote.py"; script.write_bytes(promoter)
        result = subprocess.run([sys.executable, str(script), "deploy", "--release", manifest["release"], "--sha256", manifest["sha256"]],
                                input=archive, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=180)
        logging.info("Promotion output: %s", result.stdout.decode(errors="replace")[-12000:])
        result.check_returncode()
    logging.info("Deployed main %s", commit)


def main():
    ROOT.mkdir(exist_ok=True)
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
                        handlers=[RotatingFileHandler(ROOT / "pull-release.log", maxBytes=1_000_000, backupCount=2)])
    with (ROOT / ".pull-release.lock").open("w") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        try:
            deploy()
        except Exception:
            logging.exception("Deployment pull failed; active release retained")
            raise


if __name__ == "__main__":
    main()
