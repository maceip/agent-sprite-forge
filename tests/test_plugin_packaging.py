from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_json(path: Path) -> object:
    return json.loads(path.read_text(encoding="utf-8"))


class ManifestTests(unittest.TestCase):
    def test_cursor_plugin_manifest(self) -> None:
        payload = read_json(ROOT / ".cursor-plugin" / "plugin.json")
        assert isinstance(payload, dict)
        self.assertEqual(payload["name"], "agent-sprite-forge")
        self.assertRegex(payload["name"], r"^[a-z0-9][a-z0-9.-]*[a-z0-9]$")
        self.assertTrue((ROOT / "skills").is_dir())
        for key in ("skills", "rules", "agents", "commands"):
            rel = payload[key].lstrip("./")
            self.assertTrue((ROOT / rel).exists(), rel)
        self.assertFalse(any(".." in str(payload[key]) for key in ("skills", "rules", "agents", "commands")))

    def test_marketplace_indexes_point_at_this_repo(self) -> None:
        cursor = read_json(ROOT / ".cursor-plugin" / "marketplace.json")
        grok = read_json(ROOT / ".grok-plugin" / "marketplace.json")
        claude = read_json(ROOT / ".claude-plugin" / "marketplace.json")
        self.assertEqual(cursor["plugins"][0]["source"], ".")
        self.assertEqual(grok["plugins"][0]["source"]["path"], ".")
        self.assertEqual(claude["plugins"][0]["source"]["path"], ".")
        self.assertEqual(cursor["plugins"][0]["name"], "agent-sprite-forge")
        self.assertEqual(grok["plugins"][0]["name"], "agent-sprite-forge")

    def test_root_plugin_json_and_mcp_are_relative(self) -> None:
        plugin = read_json(ROOT / "plugin.json")
        mcp = read_json(ROOT / "mcp.json")
        grok_mcp = read_json(ROOT / ".mcp.json")
        self.assertEqual(plugin["name"], "agent-sprite-forge")
        self.assertEqual(plugin["skills"], "./skills/")
        self.assertIn("sprite-forge", mcp["mcpServers"])
        self.assertEqual(mcp["mcpServers"]["sprite-forge"]["args"][0], "mcp/server.py")
        self.assertEqual(grok_mcp["mcpServers"]["sprite-forge"]["args"][0], "mcp/server.py")
        self.assertTrue((ROOT / "mcp" / "server.py").is_file())


class SkillFrontmatterTests(unittest.TestCase):
    def test_each_skill_has_name_and_description(self) -> None:
        pattern = re.compile(r"^---\n(.*?)\n---", re.S)
        for skill_md in sorted((ROOT / "skills").glob("*/SKILL.md")):
            text = skill_md.read_text(encoding="utf-8")
            match = pattern.match(text)
            self.assertIsNotNone(match, skill_md)
            block = match.group(1)
            self.assertIn("name:", block)
            self.assertIn("description:", block)
            self.assertLessEqual(len(block), 4000)
            name_match = re.search(r"^name:\s*([a-z0-9-]+)\s*$", block, re.M)
            self.assertIsNotNone(name_match, skill_md)
            self.assertEqual(name_match.group(1), skill_md.parent.name)

    def test_commands_and_agent_have_frontmatter(self) -> None:
        for path in [
            *(ROOT / "commands").glob("*.md"),
            *(ROOT / "agents").glob("*.md"),
            *(ROOT / "rules").glob("*.mdc"),
        ]:
            text = path.read_text(encoding="utf-8")
            self.assertTrue(text.startswith("---\n"), path)
            self.assertIn("description:", text.split("---", 2)[1])


class DiscoverySymlinkTests(unittest.TestCase):
    def test_runtime_skill_links_resolve(self) -> None:
        for base in (ROOT / ".grok" / "skills", ROOT / ".cursor" / "skills", ROOT / ".agents" / "skills"):
            for name in ("generate2dsprite", "generate2dmap", "video2dsprite"):
                linked = (base / name / "SKILL.md").resolve()
                canonical = (ROOT / "skills" / name / "SKILL.md").resolve()
                self.assertTrue(linked.is_file(), f"{base}/{name}")
                self.assertEqual(linked, canonical)


if __name__ == "__main__":
    unittest.main()
