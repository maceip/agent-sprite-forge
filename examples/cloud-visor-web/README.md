# Cloud visor web demo

Standalone Vite + React canvas player for the glossy cloud-robot mascot.

Identity lock: four-side turnaround (front / right / left / back). Props (bed, alarm, drone, mug) are layered separately. Bedroom flip uses a **backwards bezier arc behind the bed** — the mascot is drawn under the bed sprite while airborne.

## Run

```bash
cd examples/cloud-visor-web
npm install
npm run dev
```

Open the printed local URL. Tabs: Bedroom, Window, Drone, Phone idle.

## Pipeline used to build the sheets

See [PIPELINE.md](./PIPELINE.md). Sheets live in `public/sprites/mascot/` (body) and `public/sprites/kit/` (props).

## Beats

1. Bedroom — sleep → alarm → backflip **behind** the bed → land → dizzy coffee walk
2. Window — walk in → smoke → phone pull → hold
3. Drone — idle → 4-view turn → dash → hit
4. Phone idle — idle → pull → talk
