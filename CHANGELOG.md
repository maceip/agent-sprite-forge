# Changelog

## 2.0.0

- Ship as a Cursor plugin and as Cursor / Grok / Claude marketplace catalogs.
- Add `AGENTS.md`, `GROK.md`, and `CLAUDE.md` so Cloud Agents, Grok CLI, and grok-bot load the workflow without copying skill folders by hand.
- Add `scripts/forge.py` as the single processor entry point and `scripts/install.py` for Cursor, Grok, Codex, Claude, and `~/.agents`.
- Add an optional stdio MCP server at `mcp/server.py`.
- Document host tool mapping (Cursor `GenerateImage`, Grok `image_gen`, Codex generated-images) in `docs/agent-runtime.md`.
- Keep Codex `skills/` copy-install working.
