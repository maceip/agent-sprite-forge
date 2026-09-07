# Scene sprite todo

Scene requirement writeups live in `1/bed.md`, `2/smoke.md`, `3/sonic.md`, `4/demon.md`.

Next: use `$generate2dsprite` (primary) and `$video2dsprite` (Grok Build denser-motion path only) from this repo to produce the sprite lists in each scene file. Expect iterative generate → visual QC against the metrics → redo until the quality bar matches `tests/scene/1/*_bedstyle.png` / `mascot_sleeping.png` richness (isometric volume, anime emotional FX, joking aesthetic).

Do not bake desktop UI into assets. Prefer mascot/prop/FX separation. Chroma plates use solid `#FF00FF`.
