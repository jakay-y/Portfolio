import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  DoubleSide,
  Group,
  LessEqualDepth,
  PerspectiveCamera,
  Quaternion,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { heroVertexShader, pearlFragmentShader, wireFragmentShader } from "./heroShaders";
import { HINGE_PER_SEPARATION, OBJECT_FILL, SEPARATION_GAP, type HeroControls, type HeroPointer } from "./heroControls";

const SEGMENTS_HIGH = 160;
const SEGMENTS_LOW = 96;
const X_AXIS = new Vector3(1, 0, 0);
const DOWN_AXIS = new Vector3(0, -1, 0);
const Z_AXIS = new Vector3(0, 0, 1);

/** Frame-rate independent version of "lerp by `perFrame` at 60fps". */
function damp(current: number, target: number, perFrame: number, delta: number) {
  return current + (target - current) * (1 - Math.pow(1 - perFrame, delta * 60));
}

export interface HeroSceneProps {
  controls: RefObject<HeroControls>;
  pointer: RefObject<HeroPointer>;
  anchor: RefObject<HTMLElement | null>;
  active: boolean;
  touch: boolean;
  onReady: () => void;
}

interface RigProps extends Omit<HeroSceneProps, "active"> {
  segments: number;
  onSlowFrames: () => void;
}

function PebbleRig({ controls, pointer, anchor, touch, onReady, segments, onSlowFrames }: RigProps) {
  const root = useRef<Group>(null);
  const designHalf = useRef<Group>(null);
  const buildHalf = useRef<Group>(null);
  const { gl, camera, scene, size } = useThree();

  const geometry = useMemo(() => {
    const g = new SphereGeometry(1, segments, Math.round(segments * 0.66));
    // Park the UV seam at the back so it never crosses the visible silhouette.
    g.rotateY(-Math.PI / 2);
    return g;
  }, [segments]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseAmp: { value: 0.035 },
      uPointer: { value: new Vector3(0, 0, 5) },
      uPointerAmp: { value: 0 },
      uAxis: { value: new Vector3(1, 0, 0) },
      uSplit: { value: 0.12 },
      uBand: { value: 0.36 },
      uSolidity: { value: 0 },
      uOpacity: { value: 1 },
    }),
    [],
  );

  const [pearl, wire] = useMemo(() => {
    const pearlMat = new ShaderMaterial({
      vertexShader: heroVertexShader,
      fragmentShader: pearlFragmentShader,
      uniforms,
      transparent: true,
      side: DoubleSide,
    });
    // Drawn after the pearl on identical depth, so lines on the shared surface pass
    // while back-side lines hidden behind solid pearl are rejected.
    const wireMat = new ShaderMaterial({
      vertexShader: heroVertexShader,
      fragmentShader: wireFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthFunc: LessEqualDepth,
      side: DoubleSide,
    });
    return [pearlMat, wireMat];
  }, [uniforms]);
  useEffect(
    () => () => {
      pearl.dispose();
      wire.dispose();
    },
    [pearl, wire],
  );

  // Damped state — everything eases, nothing snaps.
  const state = useRef({ split: 0.12, tiltX: 0, tiltY: 0, pointerAmp: 0, sep: 0, solidity: 0, opacity: 1, axis: 0, rotX: 0, rotY: 0 });
  const frames = useRef({ count: 0, slow: 0, sampled: 0 });
  // Separation can exceed 1 on mobile (halves travel further apart vertically).
  const tmp = useMemo(() => ({ dir: new Vector3(), hinge: new Vector3(), q: new Quaternion(), p: new Vector3() }), []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const c = controls.current;
    const ptr = pointer.current;
    const s = state.current;
    const g = root.current;
    const el = anchor.current;
    if (!c || !ptr || !g || !designHalf.current || !buildHalf.current) return;
    const t = (uniforms.uTime.value += delta);

    // Pointer input, or a slow autonomous loop on touch devices.
    let px = 0;
    let py = 0;
    let engaged = 0;
    if (touch) {
      px = Math.sin(t * 0.35) * 0.6;
      py = Math.sin(t * 0.23) * 0.3;
      engaged = 1;
    } else if (ptr.inside) {
      px = ptr.x;
      py = ptr.y;
      engaged = 1;
    }
    const w = c.cursor * engaged;

    // Moving left reveals more design (wireframe), moving right more build (pearl).
    s.split = damp(s.split, c.split * (1 - w) + -px * 0.75 * w, 0.06, delta);
    s.tiltY = damp(s.tiltY, px * 0.38 * w + Math.sin(t * 0.3) * 0.06 * (1 - w), 0.05, delta);
    s.tiltX = damp(s.tiltX, -py * 0.26 * w, 0.05, delta);
    s.pointerAmp = damp(s.pointerAmp, 0.075 * w, 0.05, delta);
    s.sep = damp(s.sep, c.separation, 0.12, delta);
    s.solidity = damp(s.solidity, c.solidity, 0.12, delta);
    s.opacity = damp(s.opacity, c.opacity, 0.15, delta);
    s.axis = damp(s.axis, c.axis, 0.12, delta);
    s.rotX = damp(s.rotX, c.rotateX, 0.1, delta);
    s.rotY = damp(s.rotY, c.rotateY, 0.1, delta);

    uniforms.uSplit.value = s.split;
    uniforms.uSolidity.value = s.solidity;
    uniforms.uOpacity.value = s.opacity;
    uniforms.uPointerAmp.value = s.pointerAmp;
    uniforms.uNoiseAmp.value = 0.032 + s.pointerAmp * 0.25;
    tmp.dir.copy(X_AXIS).lerp(DOWN_AXIS, s.axis).normalize();
    uniforms.uAxis.value.copy(tmp.dir);

    // Place and size the object over its DOM anchor so poster and canvas line up exactly.
    if (el) {
      const rect = el.getBoundingClientRect();
      const box = gl.domElement.getBoundingClientRect();
      const cam = camera as PerspectiveCamera;
      const halfH = Math.tan((cam.fov * Math.PI) / 360) * cam.position.z;
      const halfW = halfH * cam.aspect;
      const ndcX = ((rect.left + rect.width / 2 - box.left) / box.width) * 2 - 1;
      const ndcY = -(((rect.top + rect.height / 2 - box.top) / box.height) * 2 - 1);
      g.position.set(ndcX * halfW, ndcY * halfH, 0);
      const pxPerWorld = box.height / (2 * halfH);
      g.scale.setScalar(((rect.width * OBJECT_FILL) / 2 / pxPerWorld) * c.scale);
    }
    g.rotation.set(s.tiltX + s.rotX, s.tiltY + s.rotY, 0);

    // Pointer bulge target: the pointer projected onto the front of the object, in object space.
    const r2 = Math.min(px * px + py * py, 0.95);
    tmp.p.set(px * 0.95, py * 0.95, Math.sqrt(1 - r2)).applyQuaternion(tmp.q.copy(g.quaternion).invert());
    uniforms.uPointer.value.copy(tmp.p);

    // Separation: halves slide apart along the split axis and hinge open like a book.
    const gap = s.sep * SEPARATION_GAP;
    const hinge = Math.min(s.sep, 1) * HINGE_PER_SEPARATION;
    designHalf.current.position.copy(tmp.dir).multiplyScalar(-gap);
    buildHalf.current.position.copy(tmp.dir).multiplyScalar(gap);
    tmp.hinge.copy(tmp.dir).cross(Z_AXIS).normalize();
    designHalf.current.quaternion.setFromAxisAngle(tmp.hinge, hinge);
    buildHalf.current.quaternion.setFromAxisAngle(tmp.hinge, -hinge);

    // Signal readiness after the first couple of real frames.
    const f = frames.current;
    f.count += 1;
    if (f.count === 2) onReady();
    // Frame-budget guard: if sustained frames exceed ~22ms, drop geometry detail once.
    if (f.count > 30 && segments === SEGMENTS_HIGH) {
      f.sampled += 1;
      if (rawDelta > 0.022) f.slow += 1;
      if (f.sampled === 120) {
        if (f.slow > 60) onSlowFrames();
        f.sampled = 0;
        f.slow = 0;
      }
    }
  });

  // Dev only: press P to capture the anchor area at 2x as a drop-in poster.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "p" || e.metaKey || e.ctrlKey || !anchor.current) return;
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      const rect = anchor.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const box = gl.domElement.getBoundingClientRect();
      const prevRatio = gl.getPixelRatio();
      gl.setPixelRatio(2);
      gl.setSize(size.width, size.height, false);
      gl.render(scene, camera);
      const out = document.createElement("canvas");
      out.width = Math.round(rect.width * 2);
      out.height = Math.round(rect.height * 2);
      out.getContext("2d")?.drawImage(
        gl.domElement,
        (rect.left - box.left) * 2,
        (rect.top - box.top) * 2,
        out.width,
        out.height,
        0,
        0,
        out.width,
        out.height,
      );
      gl.setPixelRatio(prevRatio);
      gl.setSize(size.width, size.height, false);
      out.toBlob(
        (blob) => {
          if (!blob) return;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "hero-poster.webp";
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        },
        "image/webp",
        0.9,
      );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anchor, camera, gl, scene, size]);

  return (
    <group ref={root}>
      <group ref={buildHalf}>
        <mesh geometry={geometry} material={pearl} renderOrder={0} />
      </group>
      <group ref={designHalf}>
        <mesh geometry={geometry} material={wire} renderOrder={1} />
      </group>
    </group>
  );
}

/** Compiles the shaders in parallel (KHR_parallel_shader_compile) instead of blocking the main thread on first render. */
function ShaderWarmup({ onCompiled }: { onCompiled: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let cancelled = false;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => !cancelled && onCompiled());
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, onCompiled]);
  return null;
}

/** The WebGL scene. Default export so it can be code-split with React.lazy. */
export default function HeroScene({ active, ...props }: HeroSceneProps) {
  const [segments, setSegments] = useState(SEGMENTS_HIGH);
  const [compiled, setCompiled] = useState(false);
  const markCompiled = useCallback(() => setCompiled(true), []);
  return (
    <Canvas
      // No frames until the shaders are compiled — the poster stays up meanwhile.
      frameloop={active && compiled ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ fov: 30, position: [0, 0, 6], near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: import.meta.env.DEV }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <PebbleRig {...props} segments={segments} onSlowFrames={() => setSegments(SEGMENTS_LOW)} />
      <ShaderWarmup onCompiled={markCompiled} />
    </Canvas>
  );
}
