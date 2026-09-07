---
name: video2dsprite
description: Grok-only dense sprites from a still via image_to_video, ffmpeg frames, chroma key, and sampled strips.
---

# /video2dsprite

Follow [skills/video2dsprite/SKILL.md](../skills/video2dsprite/SKILL.md).

If `image_to_video` is not in the tool list, stop and use `/generate2dsprite` instead.

```bash
python scripts/forge.py process-video process --video <clip.mp4> --out-dir <out> --name <slug> --frame-counts 8,16,24,48
```
