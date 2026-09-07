# Skill: Agent Sprite Forge

Grok operating guide for this repository. Load the matching skill under `skills/` for the full contract. This file is the always-on routing layer for Grok CLI, Grok Build, and grok-bot sessions that see `GROK.md`.

## When to use

- 2D sprites, animation sheets, characters, monsters, props, spells, projectiles, impacts, GIF/PNG exports → `/generate2dsprite`
- Layered maps, tilesets, prop packs, collision, Godot/Unity scene maps → `/generate2dmap`
- Dense run/walk cycles from video (`image_to_video`) → `/video2dsprite` only if that tool exists

## Execution tools

Sprite generation and slicing scripts live under `skills/*/scripts/`. Prefer the unified CLI so you do not hard-code skill paths:

```bash
python scripts/forge.py doctor
python scripts/forge.py process-sprite --input <raw.png> --target <target> --mode <mode> --output-dir <out> --rows <r> --cols <c>
python scripts/forge.py layout-guide --rows <rows> --cols <cols> --output <run>/references/<rows>x<cols>-layout-guide.png
python scripts/forge.py anchor-layout --input <master.png> --rows 2 --cols 3 --output <run>/references/anchor.png
python scripts/forge.py extract-props --input <pack.png> --output-dir assets/props --rows 3 --cols 3
python scripts/forge.py compose-preview --base <base.png> --placements <props.json> --output <preview.png>
python scripts/forge.py extract-terrain --input <atlas.png> --output-dir assets/tilesets/<name> --rows 2 --cols 3 --terrain-row plain=0
python scripts/forge.py process-video process --video <clip.mp4> --out-dir <out> --name <slug> --frame-counts 8,16,24,48
```

Grok has bash. Run those commands directly. Optional MCP wrapping is `python mcp/server.py` (stdio), registered in `.mcp.json`. Do not start an MCP server if the CLI already works.

## Host tools

- Raw art: `image_gen` / `image_edit`. On Cursor grok-bot, `GenerateImage`.
- Make a local reference visible before editing: `view_image` (Grok/Codex) or `Read` the image (Cursor).
- Video motion: `image_to_video` only. If missing, refuse `video2dsprite` and use `generate2dsprite`.
- Never treat a path string as the visual reference.

Full mapping: `docs/agent-runtime.md`.

## Hard constraints

1. You write the creative prompt. Scripts do not invent art direction.
2. Requested sprite/map pixels come from the image generator, never Canvas/SVG/PIL/Three.js/screenshots.
3. Solid `#FF00FF` background unless the user asked for a different keying workflow.
4. One raw sheet = one action family, one continuous sequence, one directional locomotion sheet, or one compact prop pack.
5. Animated bodies use multi-row grids (`2x2`, `2x3`, `3x3`, …). Do not raw-generate `1xN` character strips.
6. Processors only chroma-key, slice, align, QC, and export.
7. Playable maps are not a single baked image. Foundation-only base, then separate props/objects/collision.
8. Save every accepted image prompt next to the asset.

## Skill files (read these)

- `skills/generate2dsprite/SKILL.md`
- `skills/generate2dmap/SKILL.md`
- `skills/video2dsprite/SKILL.md`

Discovery copies also live at `.grok/skills/<name>/` in this checkout.

## Install / marketplace

If skills are missing in another folder:

```bash
python scripts/install.py --target grok
grok plugin marketplace add maceip/agent-sprite-forge
grok plugin install agent-sprite-forge --trust
```

Details: `docs/marketplace.md`.
