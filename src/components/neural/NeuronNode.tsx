import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, type RefObject } from "react";
import {
  AdditiveBlending,
  Color,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
} from "three";

import type { SequenceClock } from "@/hooks/use-neural-sequence";
import {
  HIDDEN_COLOR,
  INPUT_COLOR,
  OUTPUT_COLOR,
  type NeuralNode as NeuralNodeData,
} from "./neural-layout";

type Props = {
  node: NeuralNodeData;
  isOutput: boolean;
  selected: boolean;
  reducedMotion: boolean;
  clockRef: RefObject<SequenceClock>;
  onSelect: (node: NeuralNodeData) => void;
};

export function NeuronNode({ node, isOutput, selected, reducedMotion, clockRef, onSelect }: Props) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const haloRef = useRef<Mesh>(null);
  const haloMaterialRef = useRef<MeshBasicMaterial>(null);
  const levelRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  const color = useMemo(
    () => new Color(node.layer === 0 ? INPUT_COLOR : isOutput ? OUTPUT_COLOR : HIDDEN_COLOR),
    [node.layer, isOutput],
  );
  const radius = isOutput ? 0.38 : node.layer === 0 ? 0.23 : 0.27;

  useFrame((_, delta) => {
    const clock = clockRef.current;
    const done = clock.stage === 5;
    const lit = done || clock.stage >= node.layer;
    const current = clock.stage === node.layer;
    const target =
      reducedMotion || done ? 1 : lit ? (current ? 0.7 + 0.3 * clock.progress : 1) : 0.08;
    levelRef.current += (target - levelRef.current) * Math.min(1, delta * 7);
    const level = levelRef.current;
    const flash = !reducedMotion && isOutput && current ? clock.flash : 0;

    const mesh = meshRef.current;
    if (mesh) {
      mesh.scale.setScalar(1 + level * 0.16 + (hovered ? 0.22 : 0) + flash * 0.55);
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.15 + level * (isOutput ? 2.2 : 1.25) + flash * 2.5;
    }
    if (haloRef.current && haloMaterialRef.current) {
      const pulse =
        1 + (reducedMotion ? 0 : Math.sin(clock.progress * Math.PI) * 0.15) + flash * 0.6;
      haloRef.current.scale.setScalar(pulse);
      haloMaterialRef.current.opacity =
        (0.08 + level * 0.12 + flash * 0.28) * (reducedMotion ? 0.6 : 1);
    }
  });

  return (
    <group position={node.position}>
      {isOutput ? (
        <mesh ref={haloRef}>
          <sphereGeometry args={[radius * 2.1, 20, 20]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={OUTPUT_COLOR}
            depthWrite={false}
            opacity={0.12}
            ref={haloMaterialRef}
            toneMapped={false}
            transparent
          />
        </mesh>
      ) : null}

      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node);
        }}
        onPointerOut={() => setHovered(false)}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        ref={meshRef}
      >
        <sphereGeometry args={[radius, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.25}
          ref={materialRef}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>

      {selected ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.65, 0.018, 8, 40]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      ) : null}

      {node.layer === 0 || isOutput ? (
        <Html center distanceFactor={10} position={[0, -radius - 0.48, 0]}>
          <div
            className="pointer-events-none whitespace-nowrap rounded-md border border-cyan-300/25 bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-medium text-cyan-100 shadow-lg backdrop-blur-sm"
            style={{ opacity: reducedMotion ? 1 : 0.92 }}
          >
            {node.label}
          </div>
        </Html>
      ) : null}

      {hovered ? (
        <Html center distanceFactor={9} position={[0, radius + 0.52, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-md border border-cyan-300/30 bg-slate-950/90 px-2 py-1 text-[10px] tabular-nums text-cyan-50 shadow-xl">
            {node.label}: <strong>{node.detail}</strong>
          </div>
        </Html>
      ) : null}
    </group>
  );
}
