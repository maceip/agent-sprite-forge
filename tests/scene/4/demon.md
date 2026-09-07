# Scene 4 — Demon (rage outbreak → tombstone)

## Purpose
The **anti-kawaii** emotional outbreak. Ridiculously over-the-top rage demon energy that can fill the viewport, then vanish into a RIP tombstone gag. Existing note in-repo: particle illumination should be extreme; this is **not** a cute scene.

Failed render clips show: demon emerges with aura → flourish/spin → energy burst vanish → tombstone hold. Recreate that interactivity and intensity.

## Style contract
- Same project line art / saturation language, but pushed to anime rage: grit teeth, vein pops, crimson/violet aura, heavy particles.
- Full-viewport allowed — silhouettes can be huge; FX may dominate frame.
- Tombstone end-card is dark comedy, not horror-realistic.
- `#FF00FF` chroma plates; **no mascot** in the demon plate (demon is the star).

## Cast & props
1. **Rage demon** — aggressive creature form (horns/aura OK); wide grit-teeth mouth; red anger-vein marks; high-contrast lighting.
2. **Aura / particles** — violet-crimson glow, embers, shock diamonds, screen-filling illumination.
3. **Vanish burst** — energy detonation that clears the demon.
4. **Tombstone** — black isometric RIP stone, optional spindly hands / purple outline aura for joke horror.
5. **Optional angry mascot cameo** — separate small grit-teeth cloud-bot with red X / vein pops (chat-reaction size); must not dilute the demon plate.

## Beat timeline
| Beat | Action | Needed sprite coverage |
|------|--------|------------------------|
| A. Emerge | Demon rises with expanding aura | emerge one-shot |
| B. Flourish | Spin / roar / pose flex, particles maxed | 4–8 frame rage loop |
| C. Overwhelm | Aura fills most of frame | hold / pulse |
| D. Vanish | Burst dissolve | explode FX |
| E. Tombstone | RIP stone appears + holds | tomb appear + hold |

## Sprite list (minimum)
- `creature_rage_demon_emerge`
- `creature_rage_demon_flourish` (loop)
- `fx_rage_aura_particles`
- `fx_demon_vanish_burst`
- `prop_tombstone_rip` + `prop_tombstone_appear`
- `mascot_anger_reaction` (optional small separate)

## Evaluation metrics
- Immediately reads as **not** Scene 1 cute; intensity is the feature.
- Demon → tombstone continuity clear in under 2 seconds of playback.
- Particles/illumination feel over-the-top without turning into illegible noise at sticker scale.
- No accidental kawaii redesign; no sleep/coffee props in this scene pack.
