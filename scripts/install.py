#!/usr/bin/env python3
"""Install Agent Sprite Forge into Cursor, Grok, Codex, Claude Code, or ~/.agents.

Examples:
  python scripts/install.py --help
  python scripts/install.py --dry-run --target all
  python scripts/install.py --target cursor
  python scripts/install.py --target grok --method copy
  python scripts/install.py --target grok --method path
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path


SKILLS = ("generate2dsprite", "generate2dmap", "video2dsprite")
PLUGIN_FILES = (
    "plugin.json",
    "mcp.json",
    ".mcp.json",
    "requirements.txt",
    "LICENSE",
    "README.md",
    "AGENTS.md",
    "GROK.md",
    "CLAUDE.md",
)
PLUGIN_DIRS = (
    "skills",
    "scripts",
    "mcp",
    "rules",
    "commands",
    "agents",
    "docs",
)


def repo_root() -> Path:
    here = Path(__file__).resolve().parent.parent
    if not (here / "skills" / "generate2dsprite" / "SKILL.md").is_file():
        raise SystemExit(f"Cannot find Agent Sprite Forge skills under {here}")
    return here


def home() -> Path:
    return Path.home()


def copy_or_link(src: Path, dest: Path, *, method: str, dry_run: bool) -> str:
    dest.parent.mkdir(parents=True, exist_ok=True)
    action = f"{method} {src} -> {dest}"
    if dry_run:
        return action
    if dest.exists() or dest.is_symlink():
        if dest.is_dir() and not dest.is_symlink():
            shutil.rmtree(dest)
        else:
            dest.unlink()
    if method == "link":
        dest.symlink_to(src, target_is_directory=src.is_dir())
        return action
    if src.is_dir():
        shutil.copytree(src, dest, symlinks=True, dirs_exist_ok=True)
    else:
        shutil.copy2(src, dest)
    return action


def install_skill_tree(dest_root: Path, *, method: str, dry_run: bool) -> list[str]:
    root = repo_root()
    actions = []
    dest_root.mkdir(parents=True, exist_ok=True)
    for name in SKILLS:
        src = root / "skills" / name
        dest = dest_root / name
        actions.append(copy_or_link(src, dest, method=method, dry_run=dry_run))
    return actions


def install_cursor_plugin(*, method: str, dry_run: bool) -> list[str]:
    root = repo_root()
    dest = home() / ".cursor" / "plugins" / "local" / "agent-sprite-forge"
    actions = [f"prepare {dest}"]
    if not dry_run:
        dest.mkdir(parents=True, exist_ok=True)
    if method == "link":
        actions.append(copy_or_link(root, dest, method="link", dry_run=dry_run))
        return actions
    for rel in PLUGIN_DIRS:
        src = root / rel
        if src.exists():
            actions.append(copy_or_link(src, dest / rel, method="copy", dry_run=dry_run))
    for rel in PLUGIN_FILES:
        src = root / rel
        if src.exists():
            actions.append(copy_or_link(src, dest / rel, method="copy", dry_run=dry_run))
    plugin_manifest = root / ".cursor-plugin" / "plugin.json"
    if plugin_manifest.is_file():
        actions.append(
            copy_or_link(
                plugin_manifest,
                dest / ".cursor-plugin" / "plugin.json",
                method="copy",
                dry_run=dry_run,
            )
        )
    banner = root / "src" / "banner.png"
    if banner.is_file():
        actions.append(
            copy_or_link(banner, dest / "src" / "banner.png", method="copy", dry_run=dry_run)
        )
    return actions


def install_grok_plugin(*, method: str, dry_run: bool) -> list[str]:
    root = repo_root()
    dest = home() / ".grok" / "plugins" / "agent-sprite-forge"
    actions = [f"prepare {dest}"]
    if method == "link":
        actions.append(copy_or_link(root, dest, method="link", dry_run=dry_run))
    else:
        if not dry_run:
            dest.mkdir(parents=True, exist_ok=True)
        for rel in PLUGIN_DIRS + ("skills",):
            src = root / rel
            if src.exists():
                actions.append(copy_or_link(src, dest / rel, method="copy", dry_run=dry_run))
        for rel in PLUGIN_FILES:
            src = root / rel
            if src.exists():
                actions.append(copy_or_link(src, dest / rel, method="copy", dry_run=dry_run))
        grok_plugin_json = root / "plugin.json"
        if grok_plugin_json.is_file():
            actions.append(
                copy_or_link(grok_plugin_json, dest / "plugin.json", method="copy", dry_run=dry_run)
            )
    actions.extend(
        install_skill_tree(home() / ".grok" / "skills", method=method, dry_run=dry_run)
    )
    return actions


def install_codex(*, method: str, dry_run: bool) -> list[str]:
    return install_skill_tree(home() / ".codex" / "skills", method=method, dry_run=dry_run)


def install_claude(*, method: str, dry_run: bool) -> list[str]:
    return install_skill_tree(home() / ".claude" / "skills", method=method, dry_run=dry_run)


def install_agents(*, method: str, dry_run: bool) -> list[str]:
    return install_skill_tree(home() / ".agents" / "skills", method=method, dry_run=dry_run)


def maybe_write_grok_path(*, dry_run: bool) -> list[str]:
    """Append this repo to Grok extra skill paths without copying files."""
    root = repo_root()
    config = home() / ".grok" / "config.toml"
    snippet = f'\n# Agent Sprite Forge\n[skills]\npaths = ["{root / "skills"}"]\n'
    action = f"append skill path {root / 'skills'} to {config}"
    if dry_run:
        return [action]
    config.parent.mkdir(parents=True, exist_ok=True)
    existing = config.read_text(encoding="utf-8") if config.exists() else ""
    marker = str(root / "skills")
    if marker in existing:
        return [f"already present: {marker}"]
    with config.open("a", encoding="utf-8") as handle:
        handle.write(snippet)
    return [action]


TARGETS = {
    "cursor": install_cursor_plugin,
    "grok": install_grok_plugin,
    "codex": install_codex,
    "claude": install_claude,
    "agents": install_agents,
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--target",
        action="append",
        choices=[*TARGETS, "all"],
        default=[],
        help="Install destination. Repeat, or pass all. Default: all.",
    )
    parser.add_argument(
        "--method",
        choices=("copy", "link", "path"),
        default="copy",
        help="copy files, symlink, or (grok only) add a config path. Default: copy.",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--json", action="store_true", help="Print actions as JSON.")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    targets = args.target or ["all"]
    if "all" in targets:
        selected = list(TARGETS)
    else:
        selected = list(dict.fromkeys(targets))

    actions: list[str] = []
    if args.method == "path":
        if selected != ["grok"]:
            print("Error: --method path is only valid with --target grok.", file=sys.stderr)
            print("Example: python scripts/install.py --target grok --method path", file=sys.stderr)
            return 2
        actions.extend(maybe_write_grok_path(dry_run=args.dry_run))
    else:
        for name in selected:
            actions.extend(TARGETS[name](method=args.method, dry_run=args.dry_run))

    payload = {
        "root": str(repo_root()),
        "targets": selected,
        "method": args.method,
        "dry_run": args.dry_run,
        "actions": actions,
    }
    if args.json:
        print(json.dumps(payload, indent=2))
    else:
        print(f"root: {payload['root']}")
        print(f"targets: {', '.join(selected)}")
        print(f"method: {args.method}{' (dry-run)' if args.dry_run else ''}")
        for action in actions:
            print(f"- {action}")
        if not args.dry_run:
            print("Done. Start a new Cursor / Grok / Codex session so skills reload.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
