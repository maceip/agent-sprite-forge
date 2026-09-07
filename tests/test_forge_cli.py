from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FORGE_PATH = ROOT / "scripts" / "forge.py"
INSTALL_PATH = ROOT / "scripts" / "install.py"
MCP_PATH = ROOT / "mcp" / "server.py"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


FORGE = load_module("forge_cli", FORGE_PATH)
INSTALL = load_module("forge_install", INSTALL_PATH)


class ForgeCliTests(unittest.TestCase):
    def test_which_resolves_process_sprite(self) -> None:
        result = subprocess.run(
            [sys.executable, str(FORGE_PATH), "which", "process-sprite"],
            check=True,
            capture_output=True,
            text=True,
            cwd=str(ROOT),
        )
        payload = json.loads(result.stdout)
        self.assertEqual(Path(payload["root"]), ROOT)
        self.assertTrue(Path(payload["script"]).is_file())
        self.assertTrue(payload["script"].endswith("generate2dsprite.py"))

    def test_skills_lists_three_slash_commands(self) -> None:
        result = subprocess.run(
            [sys.executable, str(FORGE_PATH), "skills"],
            check=True,
            capture_output=True,
            text=True,
            cwd=str(ROOT),
        )
        payload = json.loads(result.stdout)
        names = {row["name"] for row in payload["skills"]}
        self.assertEqual(names, {"generate2dsprite", "generate2dmap", "video2dsprite"})

    def test_doctor_finds_skills(self) -> None:
        result = subprocess.run(
            [sys.executable, str(FORGE_PATH), "doctor"],
            capture_output=True,
            text=True,
            cwd=str(ROOT),
        )
        payload = json.loads(result.stdout)
        self.assertTrue(payload["skills"]["generate2dsprite"])
        self.assertIn(result.returncode, (0, 1))

    def test_process_sprite_help_reaches_processor(self) -> None:
        result = subprocess.run(
            [sys.executable, str(FORGE_PATH), "process-sprite", "--help"],
            check=True,
            capture_output=True,
            text=True,
            cwd=str(ROOT),
        )
        self.assertIn("--input", result.stdout)
        self.assertIn("--target", result.stdout)

    def test_process_sprite_prepending_process(self) -> None:
        self.assertEqual(
            FORGE.prepend_subcommand("process-sprite", ["--input", "raw.png"]),
            ["process", "--input", "raw.png"],
        )
        self.assertEqual(
            FORGE.prepend_subcommand("process-sprite", ["process", "--input", "raw.png"]),
            ["process", "--input", "raw.png"],
        )
        self.assertEqual(
            FORGE.prepend_subcommand("layout-guide", ["--rows", "3"]),
            ["--rows", "3"],
        )

    def test_install_dry_run_json(self) -> None:
        result = subprocess.run(
            [
                sys.executable,
                str(INSTALL_PATH),
                "--dry-run",
                "--json",
                "--target",
                "grok",
                "--target",
                "cursor",
            ],
            check=True,
            capture_output=True,
            text=True,
            cwd=str(ROOT),
        )
        payload = json.loads(result.stdout)
        self.assertEqual(payload["targets"], ["grok", "cursor"])
        self.assertTrue(payload["dry_run"])
        blob = "\n".join(payload["actions"])
        self.assertIn(".grok/skills", blob)
        self.assertIn(".cursor/plugins/local/agent-sprite-forge", blob)


class McpServerTests(unittest.TestCase):
    def test_initialize_and_tools_list(self) -> None:
        messages = [
            json.dumps(
                {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "initialize",
                    "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test"}},
                }
            ),
            json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}),
            json.dumps({"jsonrpc": "2.0", "id": 2, "method": "tools/list"}),
        ]
        result = subprocess.run(
            [sys.executable, str(MCP_PATH)],
            input="\n".join(messages) + "\n",
            capture_output=True,
            text=True,
            cwd=str(ROOT),
            check=True,
        )
        replies = [json.loads(line) for line in result.stdout.splitlines() if line.strip()]
        self.assertEqual(replies[0]["id"], 1)
        self.assertEqual(replies[0]["result"]["serverInfo"]["name"], "sprite-forge")
        names = {tool["name"] for tool in replies[1]["result"]["tools"]}
        self.assertEqual(names, {"forge_doctor", "forge_which", "forge_skills", "forge_run"})

    def test_forge_which_tool(self) -> None:
        message = json.dumps(
            {
                "jsonrpc": "2.0",
                "id": 3,
                "method": "tools/call",
                "params": {"name": "forge_which", "arguments": {"command": "extract-props"}},
            }
        )
        result = subprocess.run(
            [sys.executable, str(MCP_PATH)],
            input=message + "\n",
            capture_output=True,
            text=True,
            cwd=str(ROOT),
            check=True,
        )
        reply = json.loads(result.stdout.strip())
        body = json.loads(reply["result"]["content"][0]["text"])
        self.assertEqual(body["exit_code"], 0)
        inner = json.loads(body["stdout"])
        self.assertTrue(inner["script"].endswith("extract_prop_pack.py"))


class InstallCopyTests(unittest.TestCase):
    def test_copy_skills_into_temp_home(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            dest = Path(temporary) / "skills"
            actions = INSTALL.install_skill_tree(dest, method="copy", dry_run=False)
            self.assertTrue((dest / "generate2dsprite" / "SKILL.md").is_file())
            self.assertTrue(actions)


if __name__ == "__main__":
    unittest.main()
