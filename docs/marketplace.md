# Private marketplace setup

This repository is both a **plugin** and a **marketplace catalog**. Cursor Team/Enterprise and Grok can import the GitHub URL directly. You do not need a second repo unless you want to bundle additional plugins later.

## What is already in this repo

| Host | Catalog file | Plugin manifest |
| --- | --- | --- |
| Cursor Cloud Agents, Cursor IDE, grok-bot | `.cursor-plugin/marketplace.json` | `.cursor-plugin/plugin.json` |
| Grok CLI / Grok Build | `.grok-plugin/marketplace.json` | `plugin.json` |
| Claude Code (and Grok's Claude-compat loader) | `.claude-plugin/marketplace.json` | `plugin.json` |

The plugin source is this repository root (`.`). Skills live in `skills/`. Processors are invoked with `python scripts/forge.py`.

## Cursor Team / Enterprise marketplace

Requires a Cursor **Teams** or **Enterprise** plan and admin access.

1. Push this repository to GitHub (private is fine for Enterprise).
2. Open the Cursor dashboard → **Settings** → **Plugins** → **Team Marketplaces**.
3. **Import Marketplace** and paste the repo URL, for example `https://github.com/maceip/agent-sprite-forge`.
4. Confirm Cursor parsed `agent-sprite-forge`.
5. Optionally mark it **Required** for a distribution group so Cloud Agents and grok-bots get it automatically.
6. Install the Cursor GitHub App on the org if you want push webhooks to auto-refresh the catalog.

Local / no-admin alternative:

```bash
python scripts/install.py --target cursor
```

That copies the plugin to `~/.cursor/plugins/local/agent-sprite-forge/`, which Cursor loads without a marketplace.

## Grok marketplace

From a machine with Grok CLI:

```bash
grok plugin marketplace add maceip/agent-sprite-forge
grok plugin install agent-sprite-forge --trust
```

Or point at a local checkout:

```bash
grok plugin marketplace add ./agent-sprite-forge
grok plugin install agent-sprite-forge --trust
```

Org-wide rollout (managed config):

```toml
[[marketplace.sources]]
name = "Agent Sprite Forge"
git = "https://github.com/maceip/agent-sprite-forge.git"

[plugins]
enabled = ["agent-sprite-forge"]
```

Zero-marketplace Grok path (Method 1):

```bash
python scripts/install.py --target grok
# or keep files in-repo and rely on GROK.md + .grok/skills/ symlinks
```

## Grok Bot in Cursor

Grok Bot loads Cursor plugins. After the Cursor marketplace import (or local plugin install):

1. Settings → Plugins → Yours → enable **Agent Sprite Forge** for the Bot.
2. Type `/generate2dsprite`, `/generate2dmap`, or `/video2dsprite` in the composer.
3. If a skill is missing from `/`, enable it on the current Bot.

## Cloud Agents working inside this repo

No marketplace is required. `AGENTS.md`, `GROK.md`, `.cursor/skills/`, and `.grok/skills/` are in the checkout. Run `python scripts/forge.py doctor` after `pip install -r requirements.txt`.

## Cloud Agents working inside a game repo

Install the plugin (marketplace or `python scripts/install.py --target cursor`), **or** copy `GROK.md` / `AGENTS.md` plus `scripts/` and `skills/` into that project. The plugin install is the lower-friction path.
