import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  CylinderGeometry,
  MeshBasicMaterial,
  Object3D,
  Vector3,
  type InstancedMesh,
} from "three";

import type { SequenceClock } from "@/hooks/use-neural-sequence";
import { NEGATIVE_COLOR, POSITIVE_COLOR, type NeuralConnection } from "./neural-layout";

type Props = {
  connections: NeuralConnection[];
  clockRef: React.RefObject<SequenceClock>;
};

const UP = new Vector3(0, 1, 0);

export function Connections({ connections, clockRef }: Props) {
  const meshRef = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => new CylinderGeometry(1, 1, 1, 6, 1, true), []);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new Object3D();
    const direction = new Vector3();
    const positive = new Color(POSITIVE_COLOR);
    const negative = new Color(NEGATIVE_COLOR);

    connections.forEach((connection, index) => {
      const from = new Vector3(...connection.from);
      const to = new Vector3(...connection.to);
      direction.subVectors(to, from);
      const length = direction.length();
      dummy.position.copy(from).addScaledVector(direction, 0.5);
      dummy.quaternion.setFromUnitVectors(UP, direction.normalize());
      const thickness = 0.011 + Math.min(1, Math.abs(connection.weight)) * 0.021;
      dummy.scale.set(thickness, length, thickness);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);

      const color = (connection.weight >= 0 ? positive : negative).clone();
      color.multiplyScalar(0.4 + Math.min(1, Math.abs(connection.weight)) * 0.75);
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [connections]);

  useFrame(() => {
    const clock = clockRef.current;
    material.opacity = clock.stage < 0 ? 0.26 : 0.34 + Math.sin(clock.progress * Math.PI) * 0.14;
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
      args={[geometry, material, connections.length]}
      frustumCulled={false}
      ref={meshRef}
    />
  );
}
