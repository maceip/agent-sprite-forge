---
name: generate2dsprite
description: Generate a 2D sprite sheet or animation bundle with Agent Sprite Forge, then chroma-key, slice, QC, and export locally.
---

# /generate2dsprite

Follow [skills/generate2dsprite/SKILL.md](../skills/generate2dsprite/SKILL.md).

1. Infer the asset plan from the user request.
2. Generate the raw magenta sheet with the host image tool (`GenerateImage` on Cursor, `image_gen` on Grok/Codex).
3. Postprocess with:

```bash
python scripts/forge.py process-sprite --input <raw.png> --target <target> --mode <mode> --output-dir <out> --rows <r> --cols <c>
```

4. QC frames, regenerate if edges clip or scale drifts, then report output paths.
