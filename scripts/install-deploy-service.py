#!/usr/bin/env python3
"""Install the reviewed outbound deployer in the current production user's crontab."""
from pathlib import Path
import subprocess
import sys

ROOT = Path.home() / "tsb-portfolio"
ROOT.mkdir(exist_ok=True)
target = ROOT / "pull-release.py"
target.write_bytes(sys.stdin.buffer.read())
target.chmod(0o700)
previous = subprocess.run(["crontab", "-l"], text=True, capture_output=True)
if previous.returncode not in (0, 1):
    raise RuntimeError("Could not read the existing crontab")
marker = "# tsb-portfolio-auto-deploy"
lines = [line for line in previous.stdout.splitlines() if marker not in line]
lines.append(f"*/3 * * * * /usr/bin/python3 {target} >/dev/null 2>&1 {marker}")
subprocess.run(["crontab", "-"], input="\n".join(lines) + "\n", text=True, check=True)
print("Installed portfolio deploy poller: main releases, every 3 minutes; existing cron entries preserved")
