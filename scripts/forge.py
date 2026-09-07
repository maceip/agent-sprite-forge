#!/usr/bin/env python3
"""Agent-facing CLI for Agent Sprite Forge processors.

Discoverability:
  python scripts/forge.py --help
  python scripts/forge.py doctor
  python scripts/forge.py which process-sprite
  python scripts/forge.py process-sprite --help

Examples:
  python scripts/forge.py process-sprite --input raw.png --target creature --mode idle --output-dir out --rows 2 --cols 2
  python scripts/forge.py layout-guide --rows 3 --cols 3 --output refs/3x3-layout-guide.png
  python scripts/forge.py extract-props --input pack.png --output-dir assets/props --rows 3 --cols 3
  python scripts/forge.py process-video process --video run.mp4 --out-dir sprites/hero --name hero
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Iterable


COMMANDS: dict[str, tuple[str, str, str | None]] = {
    # dest_name: (skill_dir, script_name, default_subcommand_or_None)
    "process-sprite": ("generate2dsprite", "generate2dsprite.py", "process"),
    "sprite": ("generate2dsprite", "generate2dsprite.py", None),
    "layout-guide": ("generate2dsprite", "make_layout_guide.py", None),
    "anchor-layout": ("generate2dsprite", "make_anchor_layout.py", None),
    "extract-props": ("generate2dmap", "extract_prop_pack.py", None),
    "compose-preview": ("generate2dmap", "compose_layered_preview.py", None),
    "extract-terrain": ("generate2dmap", "extract_terrain_tiles.py", None),
    "process-video": ("video2dsprite", "video2dsprite.py", None),
    "video": ("video2dsprite", "video2dsprite.py", None),
}


def plugin_root() -> Path:
    env_keys = (
        "GROK_PLUGIN_ROOT",
        "CLAUDE_PLUGIN_ROOT",
        "CURSOR_PLUGIN_ROOT",
        "AGENT_SPRITE_FORGE_ROOT",
    )
    for key in env_keys:
        value = os.environ.get(key)
        if value:
            path = Path(value).expanduser().resolve()
            if looks_like_root(path):
                return path

    here = Path(__file__).resolve().parent.parent
    if looks_like_root(here):
        return here

    current = Path.cwd().resolve()
    for candidate in (current, *current.parents):
        if looks_like_root(candidate):
            return candidate
    return here


def looks_like_root(path: Path) -> bool:
    return (path / "skills" / "generate2dsprite" / "SKILL.md").is_file()


def skill_script(command: str, root: Path | None = None) -> Path:
    skill_dir, script_name, _default = COMMANDS[command]
    root = root or plugin_root()
    script = root / "skills" / skill_dir / "scripts" / script_name
    if not script.is_file():
        raise FileNotFoundError(f"Processor not found for {command}: {script}")
    return script


def prepend_subcommand(command: str, argv: list[str]) -> list[str]:
    _skill_dir, _script, default = COMMANDS[command]
    if not default:
        return argv
    if not argv or argv[0].startswith("-"):
        return [default, *argv]
    return argv


def run_script(script: Path, argv: list[str]) -> int:
    return subprocess.call([sys.executable, str(script), *argv])


def cmd_which(command: str | None) -> int:
    root = plugin_root()
    payload: dict[str, object] = {"root": str(root)}
    if command:
        if command not in COMMANDS:
            print(f"Error: unknown command {command!r}.", file=sys.stderr)
            print("Available:", ", ".join(COMMANDS), file=sys.stderr)
            return 2
        payload["command"] = command
        payload["script"] = str(skill_script(command, root))
    else:
        payload["commands"] = {
            name: str(skill_script(name, root)) for name in COMMANDS
        }
    print(json.dumps(payload, indent=2))
    return 0


def cmd_doctor() -> int:
    root = plugin_root()
    missing: list[str] = []
    reports: dict[str, object] = {
        "root": str(root),
        "python": sys.executable,
        "python_version": sys.version.split()[0],
    }
    for package in ("PIL", "numpy"):
        try:
            __import__(package if package != "PIL" else "PIL")
            reports[package] = "ok"
        except ImportError:
            reports[package] = "missing"
            missing.append(package)
    ffmpeg = shutil.which("ffmpeg")
    reports["ffmpeg"] = ffmpeg or "missing"
    if not ffmpeg:
        missing.append("ffmpeg (required only for process-video)")

    skills = {}
    for name in ("generate2dsprite", "generate2dmap", "video2dsprite"):
        skill_md = root / "skills" / name / "SKILL.md"
        skills[name] = skill_md.is_file()
        if not skill_md.is_file():
            missing.append(f"skill:{name}")
    reports["skills"] = skills
    reports["ok"] = not any(item for item in missing if not item.startswith("ffmpeg"))
    reports["missing"] = missing
    print(json.dumps(reports, indent=2))
    return 0 if reports["ok"] else 1


def cmd_skills() -> int:
    root = plugin_root()
    rows = []
    for path in sorted((root / "skills").glob("*/SKILL.md")):
        rows.append(
            {
                "name": path.parent.name,
                "path": str(path),
                "slash": f"/{path.parent.name}",
            }
        )
    print(json.dumps({"root": str(root), "skills": rows}, indent=2))
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="forge",
        description="Run Agent Sprite Forge processors without memorizing skill-script paths.",
        epilog=(
            "Processor commands (flags pass through to the Python script):\n"
            "  process-sprite, sprite, layout-guide, anchor-layout,\n"
            "  extract-props, compose-preview, extract-terrain,\n"
            "  process-video, video\n\n"
            "Examples:\n"
            "  python scripts/forge.py process-sprite --help\n"
            "  python scripts/forge.py process-sprite --input raw.png --target creature --mode idle --output-dir out --rows 2 --cols 2"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="forge_command")
    sub.add_parser("doctor", help="Check Python deps, skills, and ffmpeg.")
    sub.add_parser("skills", help="List bundled skills and slash names.")
    which = sub.add_parser("which", help="Print resolved plugin root and script paths.")
    which.add_argument("command", nargs="?", choices=sorted(COMMANDS))
    return parser


def run_processor(command: str, script_args: list[str]) -> int:
    if script_args[:1] == ["--"]:
        script_args = script_args[1:]
    try:
        script = skill_script(command)
    except FileNotFoundError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    return run_script(script, prepend_subcommand(command, script_args))


def main(argv: Iterable[str] | None = None) -> int:
    raw = list(argv) if argv is not None else sys.argv[1:]
    if raw and raw[0] in COMMANDS:
        return run_processor(raw[0], raw[1:])

    parser = build_parser()
    if not raw:
        parser.print_help()
        print("\nProcessor commands:", ", ".join(COMMANDS))
        return 0
    args = parser.parse_args(raw)
    command = args.forge_command
    if command == "doctor":
        return cmd_doctor()
    if command == "skills":
        return cmd_skills()
    if command == "which":
        return cmd_which(args.command)
    parser.print_help()
    print("\nProcessor commands:", ", ".join(COMMANDS))
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
