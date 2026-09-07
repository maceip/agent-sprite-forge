# Agent Sprite Forge

This repository is a **Cursor plugin**, a **Grok/Claude marketplace catalog**, and a set of Agent Skills. Use it to generate engine-ready 2D sprites and maps.

## What to do

1. Pick a skill:
   - Sprites / animation sheets / FX / props → `skills/generate2dsprite/SKILL.md` (`/generate2dsprite`)
   - Maps / tilesets / prop packs / collision → `skills/generate2dmap/SKILL.md` (`/generate2dmap`)
   - Video-dense locomotion → `skills/video2dsprite/SKILL.md` (`/video2dsprite`) only if `image_to_video` exists
2. Generate raw art with the **host image tool**. Do not draw requested art in code.
3. Postprocess with `python scripts/forge.py`. Run `python scripts/forge.py doctor` first if processors fail.
4. Map tool names with `docs/agent-runtime.md` (Cursor `GenerateImage` vs Grok/Codex `image_gen`, `Read` vs `view_image`).

## Setup

```bash
python -m pip install -r requirements.txt
python scripts/forge.py doctor
```

`video2dsprite` also needs `ffmpeg` on `PATH`.

To install skills into the current user account:

```bash
python scripts/install.py --dry-run --target all
python scripts/install.py --target cursor   # ~/.cursor/plugins/local/agent-sprite-forge
python scripts/install.py --target grok     # ~/.grok/plugins and ~/.grok/skills
python scripts/install.py --target codex    # ~/.codex/skills
```

Team rollout: `docs/marketplace.md`.

## Non-negotiables

- Solid `#FF00FF` background on sprite/prop sheets unless the user asked otherwise.
- Scripts never replace `image_gen` / `GenerateImage`.
- Playable maps keep runtime objects off the foundation layer.
- Report output paths. Do not wire game code unless asked.
