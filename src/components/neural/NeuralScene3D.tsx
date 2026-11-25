"use client";

import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, type RefObject } from "react";

import type { SequenceClock } from "@/hooks/use-neural-sequence";
import type { SimulationResult } from "@/lib/neural-sim";
import { Connections } from "./Connections";
import { NeuronNode } from "./NeuronNode";
import { buildConnections, buildNodes, NEGATIVE_COLOR, POSITIVE_COLOR } from "./neural-layout";
import { SignalPulses } from "./SignalPulses";

type Props = {
  result: SimulationResult;
  clockRef: RefObject<SequenceClock>;
  stage: number;
  selectedKey: string | null;
  reducedMotion: boolean;
  onSelect: (key: string) => void;
};

export function NeuralScene3D({
  result,
  clockRef,
  stage,
  selectedKey,
  reducedMotion,
  onSelect,
}: Props) {
  const nodes = useMemo(() => buildNodes(result), [result]);
  const connections = useMemo(() => buildConnections(result), [result]);

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-cyan-400/15 bg-[radial-gradient(ellipse_at_50%_20%,#12224d_0%,#0a1230_45%,#030716_100%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <Canvas
        camera={{ position: [0, 1.4, 13.5], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#050b1e", 14, 30]} />
        <ambientLight intensity={0.6} />
        <pointLight color="#818cf8" distance={30} intensity={22} position={[-6, 4, 6]} />
        <pointLight color="#22d3ee" distance={30} intensity={16} position={[6, -3, 5]} />

        <Stars
          count={reducedMotion ? 500 : 1100}
          depth={28}
          factor={3}
          fade
          radius={55}
          saturation={0}
          speed={reducedMotion ? 0 : 0.3}
        />

        <Connections clockRef={clockRef} connections={connections} />
        <SignalPulses clockRef={clockRef} connections={connections} reducedMotion={reducedMotion} />

        {nodes.map((node) => (
          <NeuronNode
            clockRef={clockRef}
            isOutput={node.layer === result.layers.length}
            key={node.key}
            node={node}
            onSelect={(selected) => onSelect(selected.key)}
            reducedMotion={reducedMotion}
            selected={selectedKey === node.key}
          />
        ))}

        <OrbitControls
          autoRotate={!reducedMotion && (stage <= 0 || stage === 5)}
          autoRotateSpeed={0.35}
          dampingFactor={0.08}
          enableDamping
          maxDistance={20}
          minDistance={7}
        />

        {reducedMotion ? null : (
          <EffectComposer>
            <Bloom intensity={0.7} luminanceThreshold={0.35} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-wrap items-center justify-center gap-3 text-[10px] font-medium text-cyan-100/70">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan-400" /> Peso positivo
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-fuchsia-400"
            style={{ backgroundColor: NEGATIVE_COLOR }}
          />{" "}
          Peso negativo
        </span>
        <span className="hidden sm:inline">
          Arrastra para girar · rueda para acercar · clic en una neurona
        </span>
      </div>
      <span className="sr-only">
        Conexiones positivas en {POSITIVE_COLOR} y negativas en {NEGATIVE_COLOR}.
      </span>
    </div>
  );
}
