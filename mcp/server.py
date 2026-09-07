#!/usr/bin/env python3
"""Minimal stdio MCP server wrapping scripts/forge.py.

No extra Python packages. Agents that cannot run MCP should call
`python scripts/forge.py` directly instead.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any


PROTOCOL_VERSION = "2024-11-05"
SERVER_NAME = "sprite-forge"
SERVER_VERSION = "2.0.0"


def repo_root() -> Path:
    env = os.environ.get("GROK_PLUGIN_ROOT") or os.environ.get("CLAUDE_PLUGIN_ROOT")
    if env:
        return Path(env).resolve()
    return Path(__file__).resolve().parent.parent


def forge_py() -> Path:
    return repo_root() / "scripts" / "forge.py"


def run_forge(args: list[str]) -> dict[str, Any]:
    cmd = [sys.executable, str(forge_py()), *args]
    proc = subprocess.run(cmd, capture_output=True, text=True, cwd=str(repo_root()))
    return {
        "command": cmd,
        "exit_code": proc.returncode,
        "stdout": proc.stdout,
        "stderr": proc.stderr,
    }


TOOLS = [
    {
        "name": "forge_doctor",
        "description": "Check Agent Sprite Forge Python deps, skill files, and ffmpeg.",
        "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "forge_which",
        "description": "Resolve the plugin root and processor script paths.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "Optional forge command, for example process-sprite.",
                }
            },
            "additionalProperties": False,
        },
    },
    {
        "name": "forge_skills",
        "description": "List bundled generate2dsprite / generate2dmap / video2dsprite skills.",
        "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "forge_run",
        "description": (
            "Run a Sprite Forge processor. command is a forge subcommand such as "
            "process-sprite, layout-guide, extract-props, compose-preview, "
            "extract-terrain, or process-video. args are passed through."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "command": {"type": "string"},
                "args": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Flags for the underlying Python script.",
                },
            },
            "required": ["command"],
            "additionalProperties": False,
        },
    },
]


def handle_tool(name: str, arguments: dict[str, Any] | None) -> dict[str, Any]:
    arguments = arguments or {}
    if name == "forge_doctor":
        return run_forge(["doctor"])
    if name == "forge_skills":
        return run_forge(["skills"])
    if name == "forge_which":
        cmd = ["which"]
        if arguments.get("command"):
            cmd.append(str(arguments["command"]))
        return run_forge(cmd)
    if name == "forge_run":
        command = str(arguments.get("command") or "").strip()
        if not command:
            raise ValueError("forge_run requires command")
        args = [str(item) for item in arguments.get("args") or []]
        return run_forge([command, *args])
    raise ValueError(f"Unknown tool: {name}")


def result_text(payload: dict[str, Any]) -> dict[str, Any]:
    text = json.dumps(payload, indent=2)
    is_error = int(payload.get("exit_code") or 0) != 0
    return {
        "content": [{"type": "text", "text": text}],
        "isError": is_error,
    }


def respond(message_id: Any, **kwargs: Any) -> dict[str, Any]:
    return {"jsonrpc": "2.0", "id": message_id, **kwargs}


def handle(message: dict[str, Any]) -> dict[str, Any] | None:
    method = message.get("method")
    message_id = message.get("id")
    params = message.get("params") or {}

    if method == "initialize":
        return respond(
            message_id,
            result={
                "protocolVersion": PROTOCOL_VERSION,
                "capabilities": {"tools": {}},
                "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
            },
        )
    if method == "notifications/initialized":
        return None
    if method == "tools/list":
        return respond(message_id, result={"tools": TOOLS})
    if method == "tools/call":
        name = params.get("name")
        arguments = params.get("arguments") or {}
        try:
            payload = handle_tool(str(name), arguments)
            return respond(message_id, result=result_text(payload))
        except Exception as exc:  # noqa: BLE001 — surface tool errors to the client
            return respond(
                message_id,
                result={
                    "content": [{"type": "text", "text": str(exc)}],
                    "isError": True,
                },
            )
    if method == "ping":
        return respond(message_id, result={})
    if message_id is None:
        return None
    return respond(
        message_id,
        error={"code": -32601, "message": f"Method not found: {method}"},
    )


def main() -> int:
    for raw in sys.stdin:
        line = raw.strip()
        if not line:
            continue
        try:
            message = json.loads(line)
        except json.JSONDecodeError:
            continue
        reply = handle(message)
        if reply is not None:
            sys.stdout.write(json.dumps(reply) + "\n")
            sys.stdout.flush()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
