import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  Color,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
  type InstancedMesh,
} from "three";

import type { SequenceClock } from "@/hooks/use-neural-sequence";
import { NEGATIVE_COLOR, POSITIVE_COLOR, type NeuralConnection } from "./neural-layout";

type Props = {
  connections: NeuralConnection[];
  clockRef: RefObject<SequenceClock>;
  reducedMotion: boolean;
};

const TRAIL = 2;

export function SignalPulses({ connections, clockRef, reducedMotion }: Props) {
  const meshRef = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => new SphereGeometry(0.085, 8, 8), []);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const positive = new Color(POSITIVE_COLOR);
    const negative = new Color(NEGATIVE_COLOR);

    connections.forEach((connection, index) => {
      const color = connection.weight >= 0 ? positive : negative;
      for (let copy = 0; copy < TRAIL; copy += 1) {
        mesh.setColorAt(index * TRAIL + copy, color);
      }
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [connections]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const clock = clockRef.current;
    const dummy = new Object3D();
    const from = new Vector3();
    const to = new Vector3();
    const position = new Vector3();

    connections.forEach((connection, index) => {
      const active =
        !reducedMotion && clock.stage > 0 && clock.stage <= 4 && connection.toLayer === clock.stage;

      for (let copy = 0; copy < TRAIL; copy += 1) {
        const instance = index * TRAIL + copy;
        if (!active) {
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          mesh.setMatrixAt(instance, dummy.matrix);
          return;
        }

        const stagger = (index % 7) * 0.012 + copy * 0.14;
        const progress = Math.max(0, Math.min(1, clock.progress - stagger));
        if (progress === 0 || progress === 1) {
          dummy.scale.setScalar(0);
        } else {
          from.set(...connection.from);
          to.set(...connection.to);
          position.lerpVectors(from, to, progress);
          dummy.position.copy(position);
          const fade = Math.sin(progress * Math.PI);
          dummy.scale.setScalar(
            (0.6 + Math.min(1, Math.abs(connection.weight))) * fade * (copy ? 0.6 : 1),
          );
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(instance, dummy.matrix);
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return (
    <instancedMesh
      args={[geometry, material, connections.length * TRAIL]}
      frustumCulled={false}
      ref={meshRef}
    />
  );
}
