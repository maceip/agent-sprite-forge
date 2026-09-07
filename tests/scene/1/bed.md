# Scene 1 — Bed (wake cycle)

## Purpose
Primary emotional arc for the agent mascot: go to bed → deep sleep → rude alarm wake → dizzy recovery → coffee reboot. This is the “soft joke” scene — still rich isometric and sticker-ready, but warmer and cuter than Scene 4. Failed overnight render clips show this as ~30s of layered sticker interactivity over a live desktop; recreate the **sticker action**, not the UI chrome.

## Style contract (quality bar)
- **View:** rich 3/4 isometric (same camera language as `mascot_sleeping.png`, `alarm_bedstyle.png`, `dizzy_bedstyle.png`, `coffee_bedstyle.png` already in this folder).
- **Character:** blue/violet cloud-bot mascot — puffy cumulus head, stubby segmented limbs, dark rectangular face-screen, soft cell-shade volumes, thick clean outlines.
- **Tone:** joking anime emotional beats (Zzz, sleep mask, ring stars, dizzy orbit) without going horror/over-the-top (that’s Scene 4).
- **Delivery:** solid `#FF00FF` chroma plates OR clean transparent PNGs matching existing bedstyle refs; props and mascot should be separable layers when possible.
- **Do not:** bake desktop/UI screenshots into sprites; do not invent flat clipart that breaks the soft volumetric look of the bedstyle refs.

## Cast & props
1. **Mascot (body)** — cloud-bot, face-screen expressions: sleeping (closed arcs + blush), startled, dizzy (`^ ^` / swirls), coffee-chug.
2. **Bed** — white isometric twin bed, patterned light-blue duvet, two pillows; headboard sits upper-right / foot lower-left in sleep orientation.
3. **Pink sleep mask** — girly mask with closed-lash print; can read “SLEEPING” as gag text on mask or duvet (optional; keep optional so mask works without lettering).
4. **Zzz FX** — stacked blocky Z glyphs rising, plus soft sparkle / green wiggle lines around the bed.
5. **Alarm clock** — faceless purple twin-bell clock (tick marks, no Arabic numerals, no smiley face); yellow ring-stars / vibration tears while ringing.
6. **Dizzy stars** — yellow five-point stars on an orbit ring above head; optional tiny swirl-eyed mini creature on the ring.
7. **Coffee mug** — chunky pixel/sticker mug + steam + **full handle**; held by mascot or as separate prop plate (not glued to the bed).

## Beat timeline (interactivity to cover)
| Beat | Action | Needed sprite coverage |
|------|--------|------------------------|
| A. Bed appear | Empty bed scales/settles into BL corner with light bob | `bed_appear` loop (prop-only) |
| B. Climb / tuck | Mascot climbs or pops into bed under duvet | 4–6 frame tuck / settle |
| C. Sleep hold | Mask on, Zzz rising, gentle breathing bob | idle sleep loop + Zzz FX strip |
| D. Alarm intrusion | Clock pops in, rings hard (shake + yellow ring FX) | alarm appear + ring loop (prop-only) |
| E. Wake / stretch | Mascot jolts upright / flails out of bed | 4–6 frame wake |
| F. Dizzy | Stars orbit; mascot wobbles | dizzy body + orbit FX (FX separable) |
| G. Coffee reboot | Mug appears; steam; mascot steadies while sipping | coffee appear + hold pose |

## Sprite list (minimum for good coverage)
- `mascot_sleep_idle` (loop)
- `mascot_tuck_in` (one-shot)
- `mascot_wake_jolt` (one-shot)
- `mascot_dizzy` (loop, body-only)
- `mascot_coffee_hold` (loop)
- `prop_bed_empty` + `prop_bed_appear`
- `prop_sleep_mask`
- `fx_zzz_rise`
- `prop_alarm_faceless` + `prop_alarm_ring`
- `fx_dizzy_orbit_stars`
- `prop_coffee_mug` + `prop_coffee_appear`

## Evaluation metrics
- Same isometric yaw as bedstyle refs; feet/bed contact stable across frames.
- Alarm stays **faceless**; coffee handle uncropped; bed orientation matches sleep frames.
- Mascot identity locked (cloud head + face-screen) across all beats.
- No UI pixels, no `#FF00FF` leaking into art fills.
- Emotional read clear at sticker size (~128–256px on screen).
