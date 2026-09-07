# Agent runtime adapter

Agent Sprite Forge is one pipeline with three host names for the same tools.
Read this once, then follow the skill. Do not invent a second workflow per product.

## Hosts this pack supports

| Host | How skills load | Image generation | View a local image | Processors |
| --- | --- | --- | --- | --- |
| **Cursor Cloud Agents / Cursor IDE / grok-bot** | Cursor plugin, Team/Enterprise marketplace, `.cursor/skills/`, or `AGENTS.md` | `GenerateImage` (or any available image-generation tool) | `Read` the image file so it is visible in context | `python scripts/forge.py …` |
| **Grok CLI / Grok Build** | `.grok/skills/`, `~/.grok/skills/`, Grok plugin/marketplace, `GROK.md` | `image_gen` / `image_edit` | `view_image` | `python scripts/forge.py …` via bash |
| **Codex** | `~/.codex/skills/` | `image_gen` | `view_image` | same processors; generated files may also land under `$CODEX_HOME/generated_images/` |
| **Claude Code** | plugin/marketplace or `~/.claude/skills/` | host image tool if present | host image read | same processors |

`video2dsprite` still requires a native `image_to_video` (or `reference_to_video`) tool. That is Grok Build / Grok CLI with video tools. Cursor Cloud Agents and Codex must refuse the video step and offer `generate2dsprite` instead.

## Translation table

Whenever a skill says one of these, use the host equivalent:

| Skill wording | Cursor / grok-bot | Grok CLI / Build | Codex |
| --- | --- | --- | --- |
| `image_gen` | `GenerateImage` | `image_gen` | `image_gen` |
| `image_edit` | `GenerateImage` with the reference already visible | `image_edit` | `image_gen` with reference |
| `view_image` | `Read` the image path | `view_image` | `view_image` |
| `$CODEX_HOME/generated_images/…` | path returned by the image tool, else the workspace | tool output / working directory | Codex generated-images dir, then copy into the run folder |
| `$generate2dsprite` | skill `generate2dsprite` or `/generate2dsprite` | `/generate2dsprite` | `$generate2dsprite` |

Never treat a filesystem path string as a visual reference. The image must be visible in the conversation (or explicitly attached) before asking the image model to preserve identity, style, map layout, or sprite lineage.

## Processor entry point

Do not memorize per-skill script paths. From this repo or an installed plugin:

```bash
python scripts/forge.py doctor
python scripts/forge.py skills
python scripts/forge.py which process-sprite
python scripts/forge.py process-sprite --input <raw.png> --target creature --mode idle --output-dir <out> --rows 2 --cols 2
python scripts/forge.py layout-guide --rows 3 --cols 3 --output <run>/references/3x3-layout-guide.png
python scripts/forge.py extract-props --input <pack.png> --output-dir assets/props --rows 3 --cols 3
python scripts/forge.py process-video process --video <clip.mp4> --out-dir <out> --name <slug>
```

Fallback if `scripts/forge.py` is missing: `python skills/<skill>/scripts/<script>.py …`.

The CLI is the source of truth. MCP (`mcp/server.py`) is optional wrapping for hosts that register stdio MCP servers. If MCP is not attached, run the CLI with the shell tool.

## Non-negotiable pipeline

1. The agent writes the art prompt and chooses sheet geometry.
2. The host image generator creates the raw magenta sheet or map art.
3. Local Python processors only chroma-key, slice, align, QC, and export.
4. Do not draw requested sprite/map art with Canvas, SVG, PIL shapes, Three.js, or screenshots.
5. Solid `#FF00FF` background unless the user asked for a different keying workflow.

## Finding generated images

Check in this order:

1. The path returned by the image-generation tool.
2. Files just written into the workspace run folder.
3. `$CODEX_HOME/generated_images/` on Codex only.
4. Ask the user if nothing landed on disk.

Copy or save the accepted raw PNG into the run folder before postprocessing. Keep the original.

## Grok Bot (Cursor) vs Grok CLI

Grok Bot inside Cursor uses Cursor plugins and `/` skills. Install this repository as a Cursor plugin or Team Marketplace source, then enable the skill on the Bot.

Grok CLI / Grok Build discovers `GROK.md`, `.grok/skills/`, `~/.grok/skills/`, and Grok marketplaces (`.grok-plugin/marketplace.json`). Method 1 in `GROK.md` plus `python scripts/forge.py` is the zero-server path.

## Enterprise / private marketplace

- **Cursor Team or Enterprise:** Dashboard → Settings → Plugins → Import Marketplace → this GitHub repo. The index is `.cursor-plugin/marketplace.json`.
- **Grok org marketplace:** `grok plugin marketplace add <owner/repo>` then `grok plugin install agent-sprite-forge --trust`. The index is `.grok-plugin/marketplace.json`.
- **Claude Code:** `.claude-plugin/marketplace.json` is the same catalog (Grok reads it automatically).
