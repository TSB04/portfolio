#!/usr/bin/env python3
"""Confirm the public site serves the expected validated commit."""
import argparse
import json
import os
import time
import urllib.request


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--wait", type=int, default=0)
    args = parser.parse_args()
    expected = os.environ["EXPECTED_COMMIT"]
    deadline = time.monotonic() + args.wait
    while True:
        try:
            request = urllib.request.Request(f"https://tsb-dev.fr/version.json?commit={expected}", headers={"Cache-Control": "no-cache"})
            with urllib.request.urlopen(request, timeout=15) as response:
                version = json.load(response)
                if version.get("commit") != expected or (os.environ.get("EXPECTED_BUILD") and version.get("build") != os.environ["EXPECTED_BUILD"]):
                    raise ValueError("Production is still serving an earlier release")
            for path in ("en/", "fr/", "robots.txt", "sitemap-index.xml", "sitemap-0.xml", "og-image.png"):
                with urllib.request.urlopen(f"https://tsb-dev.fr/{path}", timeout=15) as response:
                    if response.status != 200:
                        raise ValueError("Production resource check failed")
            print(f"Verified production commit {expected}"); return
        except Exception as error:
            if time.monotonic() >= deadline:
                raise RuntimeError("Production deployment could not be confirmed") from error
            print("Waiting for the production deployment service...", flush=True)
            time.sleep(15)


if __name__ == "__main__":
    main()
