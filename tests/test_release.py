import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import Mock, patch


spec = importlib.util.spec_from_file_location("pull_release", Path(__file__).resolve().parents[1] / "deploy/pull-release.py")
pull = importlib.util.module_from_spec(spec)
with patch.dict(sys.modules, {"fcntl": types.SimpleNamespace()} if sys.platform == "win32" else {}):
    spec.loader.exec_module(pull)


class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.root_patch = patch.object(pull, "ROOT", self.root)
        self.root_patch.start(); self.addCleanup(self.root_patch.stop)
        self.commit = "a" * 40
        self.archive = b"fixture archive"
        self.promoter = b"fixture promoter"
        self.prefix = f"https://github.com/{pull.REPO}/releases/download/portfolio-{self.commit}/"
        self.manifest = {"commit": self.commit, "release": "20261016T120000-" + "b" * 12,
                         "sha256": hashlib.sha256(self.archive).hexdigest(),
                         "promoter_sha256": hashlib.sha256(self.promoter).hexdigest()}
        self.release = {"tag_name": f"portfolio-{self.commit}", "draft": False,
                        "assets": [{"name": name, "browser_download_url": self.prefix + name}
                                   for name in ("release.json", "portfolio.tar.gz", "promote.py")]}

    def download(self, url, limit):
        if url.endswith("/commits/main"):
            return json.dumps({"sha": self.commit}).encode()
        if "/releases/tags/" in url:
            return json.dumps(self.release).encode()
        if url.endswith("release.json"):
            return json.dumps(self.manifest).encode()
        return self.archive if url.endswith(".tar.gz") else self.promoter

    def test_already_deployed_bundle_does_not_download_archive(self):
        (self.root / "deployment.json").write_text(json.dumps({"commit": self.commit, "sha256": self.manifest["sha256"]}))
        with patch.object(pull, "download", side_effect=self.download) as download:
            pull.deploy()
        self.assertEqual(download.call_count, 3)

    def test_failed_release_can_retry_without_overwriting_its_files(self):
        (self.root / "releases" / self.manifest["release"]).mkdir(parents=True)
        result = Mock(stdout=b"retry complete")
        with patch.object(pull, "download", side_effect=self.download), patch.object(pull.subprocess, "run", return_value=result) as run:
            pull.deploy()
        arguments = run.call_args.args[0]
        self.assertNotEqual(arguments[arguments.index("--release") + 1], self.manifest["release"])

    def test_rebuild_of_same_commit_is_promoted_when_bundle_changes(self):
        (self.root / "deployment.json").write_text(json.dumps({"commit": self.commit, "sha256": "0" * 64}))
        with patch.object(pull, "download", side_effect=self.download), patch.object(pull.subprocess, "run", return_value=Mock(stdout=b"refreshed")) as run:
            pull.deploy()
        run.assert_called_once()

    def test_verified_release_is_promoted_from_the_exact_main_commit(self):
        result = Mock(stdout=b"promotion complete")
        with patch.object(pull, "download", side_effect=self.download), patch.object(pull.subprocess, "run", return_value=result) as run:
            pull.deploy()
        self.assertEqual(run.call_args.kwargs["input"], self.archive)
        self.assertIn(self.manifest["sha256"], run.call_args.args[0])
        result.check_returncode.assert_called_once()

    def test_changed_archive_is_rejected_without_executing_code(self):
        self.manifest["sha256"] = "0" * 64
        with patch.object(pull, "download", side_effect=self.download), patch.object(pull.subprocess, "run") as run:
            with self.assertRaisesRegex(ValueError, "checksum"):
                pull.deploy()
        run.assert_not_called()

    def test_foreign_asset_origin_is_rejected(self):
        self.release["assets"][0]["browser_download_url"] = "https://example.com/release.json"
        with patch.object(pull, "download", side_effect=self.download):
            with self.assertRaisesRegex(ValueError, "origin"):
                pull.deploy()

    def test_superseded_main_commit_is_not_promoted(self):
        calls = 0
        def download(url, limit):
            nonlocal calls
            if url.endswith("/commits/main"):
                calls += 1
                if calls > 1:
                    return json.dumps({"sha": "c" * 40}).encode()
            return self.download(url, limit)
        with patch.object(pull, "download", side_effect=download), patch.object(pull.subprocess, "run") as run:
            pull.deploy()
        run.assert_not_called()


if __name__ == "__main__":
    unittest.main()
