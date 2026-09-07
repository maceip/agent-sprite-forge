# Scene 1 — Bed (wake cycle)

Official clip map: **Clip 1 = this scene.** Falling asleep in bed → alarm clock wake → **spiral out of bed** → **floating coffee**. Recreate the **sticker action**, not the UI chrome.

## Purpose
Primary emotional arc for the agent mascot (soft joke, warmer than Scene 4): go to bed → deep sleep → rude alarm wake → **spiral out of bed** (dizzy spin exit) → **floating coffee** reboot. Failed overnight render clips show this as ~30s of layered sticker interactivity over a live desktop.

## Style contract (quality bar)
- **View:** rich 3/4 isometric (same camera language as `mascot_sleeping.png`, `alarm_bedstyle.png`, `dizzy_bedstyle.png`, `coffee_bedstyle.png` already in this folder).
- **Character:** blue/violet cloud-bot mascot — puffy cumulus head, stubby segmented limbs, dark rectangular face-screen, soft cell-shade volumes, thick clean outlines.
- **Tone:** joking anime emotional beats (Zzz, sleep mask, ring stars, dizzy orbit, spiral exit) without going horror/over-the-top (that’s Scene 4 Super Saiyan).
- **Delivery:** solid `#FF00FF` chroma plates OR clean transparent PNGs matching existing bedstyle refs; props and mascot should be separable layers when possible.
- **Do not:** bake desktop/UI screenshots into sprites; do not invent flat clipart that breaks the soft volumetric look of the bedstyle refs.

## Cast & props
1. **Mascot (body)** — cloud-bot, face-screen expressions: sleeping (closed arcs + blush), startled, dizzy (`^ ^` / swirls), spiral-wake, coffee-chug / hover-sip.
2. **Bed** — white isometric twin bed, patterned light-blue duvet, two pillows; headboard sits upper-right / foot lower-left in sleep orientation.
3. **Pink sleep mask** — girly mask with closed-lash print; can read “SLEEPING” as gag text on mask or duvet (optional; keep optional so mask works without lettering).
4. **Zzz FX** — stacked blocky Z glyphs rising, plus soft sparkle / green wiggle lines around the bed.
5. **Alarm clock** — faceless purple twin-bell clock (tick marks, no Arabic numerals, no smiley face); yellow ring-stars / vibration tears while ringing.
6. **Dizzy / spiral FX** — yellow five-point stars on an orbit ring above head; optional tiny swirl-eyed mini creature on the ring; spiral-exit motion lines stay tight to the body sheet or a separate FX plate.
7. **Coffee mug** — chunky pixel/sticker mug + steam + **full handle**; **can float/hover** as its own plate (not only held). Held-by-mascot is optional secondary. Never glue the mug to the bed.

## Beat timeline (interactivity to cover)
| Beat | Action | Needed sprite coverage |
|------|--------|------------------------|
| A. Bed appear | Empty bed scales/settles into BL corner with light bob | `bed_appear` loop (prop-only) |
| B. Climb / tuck | Mascot climbs or pops into bed under duvet | 4–6 frame tuck / settle |
| C. Sleep hold | Mask on, Zzz rising, gentle breathing bob | idle sleep loop + Zzz FX strip |
| D. Alarm intrusion | Clock pops in, rings hard (shake + yellow ring FX) | alarm appear + ring loop (prop-only) |
| E. Spiral out of bed | Mascot **spirals / corkscrews out of the bed** (wake + spin exit, not a plain sit-up) | 4–6 frame `mascot_spiral_wake` one-shot (body; bed stays a separate layer if possible) |
| F. Dizzy | Stars orbit; mascot wobbles in mid-air / just after the spiral | dizzy body + orbit FX (FX separable) |
| G. Floating coffee | Mug **floats / hovers** in (steam); optional sip once it settles | `prop_coffee_float` hover loop + optional hold pose |

## Sprite list (minimum for good coverage)
- `mascot_sleep_idle` (loop)
- `mascot_tuck_in` (one-shot)
- `mascot_spiral_wake` (one-shot; spiral out of bed — required)
- `mascot_dizzy` (loop, body-only)
- `mascot_coffee_hold` (optional; coffee may float instead)
- `prop_bed_empty` + `prop_bed_appear`
- `prop_sleep_mask`
- `fx_zzz_rise`
- `prop_alarm_faceless` + `prop_alarm_ring`
- `fx_dizzy_orbit_stars`
- `prop_coffee_mug` + `prop_coffee_float` (hover/float — required) + `prop_coffee_appear`

## Evaluation metrics
- Same isometric yaw as bedstyle refs; feet/bed contact stable across sleep frames.
- Alarm stays **faceless**; coffee handle uncropped; bed orientation matches sleep frames.
- Spiral-wake reads as a spin exit from the bed, not a generic stretch.
- Floating coffee reads as hovering (bob + steam), not glued to a table or the bed.
- Mascot identity locked (cloud head + face-screen) across all beats.
- No UI pixels, no `#FF00FF` leaking into art fills.
- Emotional read clear at sticker size (~128–256px on screen).
