/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, createPortal, type ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Preload, useFBO, useGLTF } from "@react-three/drei";
import { easing } from "maath";

type ModeProps = Record<string, unknown>;
type GroupProps = ThreeElements["group"];

interface FluidGlassCursorProps {
  lensProps?: ModeProps;
}

interface ModeWrapperProps extends GroupProps {
  children?: ReactNode;
  glb: string;
  geometryKey: string;
  followPointer?: boolean;
  modeProps?: ModeProps;
}

export function FluidGlassCursor({ lensProps = {} }: FluidGlassCursorProps) {
  const isTest = import.meta.env.MODE === "test";
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTest || typeof window === "undefined") return;

    const media = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(media.matches);
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [isTest]);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    document.documentElement.classList.add("fluid-glass-cursor-active");
    return () => document.documentElement.classList.remove("fluid-glass-cursor-active");
  }, [enabled]);

  useEffect(() => {
    if (!enabled || isTest || typeof window === "undefined") return;

    const setCursorVars = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--fluid-cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--fluid-cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", setCursorVars, { passive: true });
    return () => window.removeEventListener("pointermove", setCursorVars);
  }, [enabled, isTest]);

  if (isTest) return <div className="fluid-glass-cursor" aria-hidden="true" />;
  if (!enabled) return null;

  return (
    <div className="fluid-glass-cursor" aria-hidden="true">
      <div className="fluid-glass-cursor-surface" />
      <Canvas
        camera={{ position: [0, 0, 20], fov: 15 }}
        dpr={[1, 2]}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0xffffff), 0)}
      >
        <FluidGlassLens
          lensProps={{
            scale: 0.085,
            ior: 1.2,
            thickness: 0.9,
            anisotropy: 0.01,
            chromaticAberration: 0.08,
            transmission: 1,
            roughness: 0,
            color: "#ffffff",
            attenuationColor: "#ffffff",
            attenuationDistance: 0.12,
            ...lensProps,
          }}
        />
        <Preload />
      </Canvas>
    </div>
  );
}

function FluidGlassLens({ lensProps = {} }: { lensProps?: ModeProps }) {
  return <Lens modeProps={lensProps} />;
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  followPointer = true,
  modeProps = {},
  ...props
}: ModeWrapperProps) {
  const ref = useRef<THREE.Group>(null!);
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const [scene] = useState<THREE.Scene>(() => new THREE.Scene());
  const geoWidthRef = useRef<number>(1);

  useEffect(() => {
    const geo = (nodes[geometryKey] as THREE.Mesh)?.geometry;
    geo.computeBoundingBox();
    geoWidthRef.current = geo.boundingBox!.max.x - geo.boundingBox!.min.x || 1;
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = followPointer ? (pointer.y * v.height) / 2 : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if ((modeProps as { scale?: number }).scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setClearColor(0xffffff, 0);
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps as {
    scale?: number;
    ior?: number;
    thickness?: number;
    anisotropy?: number;
    chromaticAberration?: number;
    [key: string]: unknown;
  };

  return (
    <>
      {createPortal(children, scene)}
      <group ref={ref} scale={scale ?? 0.15} {...props}>
        <mesh rotation-x={Math.PI / 2} geometry={(nodes[geometryKey] as THREE.Mesh)?.geometry}>
          <MeshTransmissionMaterial
            buffer={buffer.texture}
            ior={ior ?? 1.15}
            thickness={thickness ?? 5}
            anisotropy={anisotropy ?? 0.01}
            chromaticAberration={chromaticAberration ?? 0.1}
            {...(typeof extraMat === "object" && extraMat !== null ? extraMat : {})}
          />
        </mesh>
        <mesh rotation-x={Math.PI / 2} geometry={(nodes[geometryKey] as THREE.Mesh)?.geometry} scale={1.03}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.055} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
});

function Lens({ modeProps, ...props }: { modeProps?: ModeProps } & GroupProps) {
  return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...props} />;
}

useGLTF.preload("/assets/3d/lens.glb");
