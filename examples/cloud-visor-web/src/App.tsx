import { ScenePlayer } from "./scene-player";

export function App() {
  return (
    <main>
      <h1>Cloud visor mascot</h1>
      <p className="lede">
        Four-scene canvas demo driven by chroma-keyed sprite sheets from the glossy
        four-view body. Bedroom backflip goes <strong>behind</strong> the bed on a
        tall reverse arc.
      </p>
      <ScenePlayer />
    </main>
  );
}
