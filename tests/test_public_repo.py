import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("public_policy", Path(__file__).resolve().parents[1] / "scripts/check-public-repo.py")
policy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(policy)


class PublicRepositoryTests(unittest.TestCase):
    def test_private_files_are_blocked_in_nested_directories(self):
        for name in (".env", "deploy/.env.staging", "keys/app.pem", "tls/server.pfx", ".ssh/id_ed25519", "deploy/operator.json", "docs/private/runbook.md", "deploy/settings.local.json", "credentials-build.json"):
            with self.subTest(name=name):
                self.assertTrue(policy.private_path(name))

    def test_public_templates_and_code_remain_allowed(self):
        for name in (".env.example", "deploy/operator.example.json", "deploy/nginx.conf", "src/config/SiteConfig.ts", "LICENSE"):
            with self.subTest(name=name):
                self.assertFalse(policy.private_path(name))

    def test_reports_do_not_contain_detected_values(self):
        address = ".".join(["192", "168", "40", "15"])
        home = "/".join(["", "home", "fixture-operator", "keys"])
        findings = policy.content_findings(address + " " + home)
        self.assertIn("private infrastructure address", findings)
        self.assertIn("operator home path", findings)
        self.assertNotIn(address, " ".join(findings))
        self.assertNotIn(home, " ".join(findings))

    def test_loopback_examples_are_allowed(self):
        self.assertEqual(policy.content_findings("http://127.0.0.1:4321"), [])


if __name__ == "__main__":
    unittest.main()
