# Scene sprite todo

Scene requirement writeups live in `1/bed.md`, `2/smoke.md`, `3/sonic.md`, `4/demon.md`.

## Official clip → scene map
1. **Clip 1 = Scene 1 Bed** — falling asleep in bed → alarm clock wake → spiral out of bed → floating coffee
2. **Clip 2 = Scene 2 Smoke** — cell / flip phone + smoking a cigarette (core). Optional modular slot for a forgotten beat.
3. **Clip 3 = Scene 3 Sonic** — drone attack (drone + megaphone blast)
4. **Clip 4 = Scene 4 Demon** — background mascot going **Super Saiyan** (power-up / aura outbreak); optional tombstone gag

Do not OCR or bake desktop UI from the clips. Prefer mascot/prop/FX separation. Chroma plates use solid `#FF00FF`.

**PRIORITY: MASCOT MOTION ONLY.** Do not generate beds, alarms, coffee, drones, megaphones, or other props until the blue-guy body sheets pass.

Active deliverable:
- `tests/scene/1/gen/v1/mascot_bedtime_body_only/` — 3x3 (9-frame) body-only bedtime: stand → settle → pink mask → snore/Zzz bob. Preview: `animation.gif`

Next: use `$generate2dsprite` (primary) and `$video2dsprite` (Grok Build denser-motion path only) from this repo for more **mascot body action** sheets. Expect iterative generate → visual QC → redo until identity matches turn_front (cloud head, face-screen `> _`, stubby limbs).

## Scene 1 first-pass status (`tests/scene/1/gen/v1/`)
Done (v1 generated + processed with `$generate2dsprite`; QC notes in PR):
- `mascot_sleep_idle` — pass (sleep + mask + bed; breathing subtle)
- `prop_alarm_faceless` — pass (tick marks only)
- `prop_alarm_ring` — pass (shake + yellow tears)
- `mascot_dizzy` — pass (body-only, spiral eyes)
- `fx_dizzy_orbit_stars` — pass (mascot-free orbit)
- `prop_coffee_mug` — pass-with-notes (full handle; steam; source-edge on one raw cell, subject complete; `--allow-source-edge-touch` after visual review)
- `prop_bed_empty` — pass (headboard upper-right, no lettering)
- `mascot_spiral_wake` — pass (body-only corkscrew / tornado-exit; not a sit-up)
- `prop_coffee_float` — pass (hovering mug, full handle, no table/bed; bob is steam-led)

Still remaining Scene 1 (not blocking first-pass review):
- `mascot_tuck_in`, `prop_bed_appear`, `prop_sleep_mask`, `fx_zzz_rise`, `prop_coffee_appear`, `mascot_coffee_hold` (optional if float covers the reboot)

Scenes 2–4: docs locked to clip map; do not generate until Scene 1 first-pass QC is reviewed.
