#!/usr/bin/env python3
"""Reject private files and infrastructure identifiers without printing their values."""
import argparse
import ipaddress
from pathlib import Path, PurePosixPath
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
PRIVATE_DIRECTORIES = {".ssh", ".aws", ".azure", ".kube", ".gcloud", ".private", ".direnv", ".cache", ".deploy"}
PRIVATE_SUFFIXES = {".pem", ".key", ".p8", ".p12", ".pfx", ".jks", ".keystore", ".der", ".crt", ".cer", ".pub", ".db", ".sqlite", ".sqlite3", ".dump", ".backup", ".bak", ".log"}
TEXT_SUFFIXES = {".md", ".txt", ".py", ".ts", ".js", ".mjs", ".astro", ".json", ".yml", ".yaml", ".toml", ".conf", ".sh", ".html"}
KEY_HEADER = re.compile(r"-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----")
HOME_PATH = re.compile(r"(?:/home/[A-Za-z0-9_.-]+|[A-Za-z]:[/\\]Users[/\\][A-Za-z0-9_.-]+)")
IP = re.compile(r"(?<![\w.])(?:\d{1,3}\.){3}\d{1,3}(?![\w.])")


def private_path(name):
    path = PurePosixPath(name.replace("\\", "/"))
    if any(part in PRIVATE_DIRECTORIES for part in path.parts):
        return True
    if len(path.parts) >= 2 and path.parts[:2] == ("docs", "private"):
        return True
    base = path.name.lower()
    if base == ".env.example" or base == "operator.example.json":
        return False
    return (base == ".env" or base.startswith(".env.") or base == ".envrc"
            or path.suffix.lower() in PRIVATE_SUFFIXES
            or base in {"operator.json", ".npmrc", ".pypirc", ".netrc", "credentials.json"}
            or (base.startswith("operator.") and base.endswith(".json"))
            or bool(re.match(r"id_(rsa|dsa|ecdsa|ed25519)(\.|$)", base))
            or bool(re.search(r"\.local\.(json|toml|ya?ml)$", base))
            or bool(re.match(r"(?:credentials-|service-account).*\.json$", base)))


def content_findings(text):
    findings = []
    if KEY_HEADER.search(text):
        findings.append("private key material")
    if HOME_PATH.search(text):
        findings.append("operator home path")
    for match in IP.finditer(text):
        try:
            address = ipaddress.ip_address(match.group())
        except ValueError:
            continue
        if address.is_private and not address.is_loopback and not address.is_unspecified:
            findings.append("private infrastructure address"); break
    return findings


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--build", action="store_true", help="Also scan the public build output")
    args = parser.parse_args()
    tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
    files = [(name, ROOT / name) for name in tracked if name and (ROOT / name).is_file()]
    if args.build:
        dist = ROOT / "dist"
        if not dist.is_dir():
            raise SystemExit("Build the site before checking public output")
        files.extend(("dist/" + path.relative_to(dist).as_posix(), path) for path in dist.rglob("*") if path.is_file())
    errors = []
    for name, path in files:
        if private_path(name):
            errors.append((name, "private file path"))
        if path.suffix.lower() in TEXT_SUFFIXES or path.name in {"LICENSE", "NOTICE", ".env.example"}:
            for finding in content_findings(path.read_text(encoding="utf-8", errors="replace")):
                errors.append((name, finding))
    if errors:
        for name, reason in errors:
            print(f"Blocked: {name} ({reason})")
        raise SystemExit(1)
    print(f"Public repository checks passed ({len(files)} files; sensitive values are never printed)")


if __name__ == "__main__":
    main()
