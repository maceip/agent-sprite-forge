---
name: generate2dmap
description: Generate a playable or editable 2D map with foundation-only art, props, collision, and engine metadata.
---

# /generate2dmap

Follow [skills/generate2dmap/SKILL.md](../skills/generate2dmap/SKILL.md).

1. Choose `map_mode` from the genre, then generate foundation-only base art with the host image tool.
2. Make the base visible before the dressed/stage reference.
3. Extract props and compose a preview with:

```bash
python scripts/forge.py extract-props --input <pack.png> --output-dir assets/props --rows 3 --cols 3
python scripts/forge.py compose-preview --base <base.png> --placements <props.json> --output <preview.png>
```

4. Do not stop at a reference mockup. Ship runtime objects, collision/zones, and a QA preview.
