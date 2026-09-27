import { useRef, useState } from "react";
import { createHeroControls, type HeroControls } from "@/components/hero/heroControls";
import { HeroCanvasLayer, HeroPoster } from "@/components/hero/HeroObject";
import { useHeroPointer, useHeroSupport } from "@/components/hero/useHero";

const SLIDERS: { key: keyof HeroControls; min: number; max: number; step: number }[] = [
  { key: "cursor", min: 0, max: 1, step: 0.01 },
  { key: "split", min: -1, max: 1, step: 0.01 },
  { key: "separation", min: 0, max: 1, step: 0.01 },
  { key: "solidity", min: 0, max: 1, step: 0.01 },
  { key: "axis", min: 0, max: 1, step: 0.01 },
  { key: "rotateY", min: -1, max: 1, step: 0.01 },
  { key: "scale", min: 0.5, max: 1.4, step: 0.01 },
  { key: "opacity", min: 0, max: 1, step: 0.01 },
];

/** Dev-only: the hero object in isolation, with live controls. Press P to capture a poster. */
export function HeroLab() {
  const stageRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const controls = useRef<HeroControls>(createHeroControls());
  const pointer = useHeroPointer(stageRef);
  const { mode, touch } = useHeroSupport();
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState(createHeroControls);

  function set(key: keyof HeroControls, value: number) {
    controls.current[key] = value;
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div ref={stageRef} className="relative h-[100dvh] overflow-hidden">
      {mode === "webgl" && (
        <HeroCanvasLayer controls={controls} pointer={pointer} anchor={anchorRef} touch={touch} onReady={() => setReady(true)} />
      )}
      <div className="mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-24 md:grid-cols-[55fr_45fr] md:px-12">
        <div>
          <p className="font-mono text-eyebrow uppercase text-muted-foreground">Hero object — lab</p>
          <p className="mt-3 text-sm text-muted-foreground">
            mode: {mode} · touch: {String(touch)} · scene ready: {String(ready)} · press P to capture a poster
          </p>
          <div className="mt-6 grid max-w-sm gap-3">
            {SLIDERS.map(({ key, min, max, step }) => (
              <label key={key} className="grid grid-cols-[6rem_1fr_3rem] items-center gap-3 font-mono text-xs">
                {key}
                <input type="range" min={min} max={max} step={step} value={values[key]} onChange={(e) => set(key, Number(e.target.value))} />
                <span className="tabular-nums">{values[key].toFixed(2)}</span>
              </label>
            ))}
          </div>
        </div>
        <div ref={anchorRef} className="mx-auto aspect-square w-full max-w-[520px]">
          <HeroPoster hidden={mode === "webgl" && ready} />
        </div>
      </div>
    </div>
  );
}
