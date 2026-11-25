import { useCallback, useEffect, useRef, useState } from "react";

export const SEQUENCE_STEPS = ["Entradas", "Capa 1", "Capa 2", "Capa 3", "Salida"] as const;

/** Mutable clock read by useFrame; React only sees stage transitions. */
export type SequenceClock = {
  /** -1 = idle, 0..4 = active step, 5 = finished. */
  stage: number;
  progress: number;
  playing: boolean;
  speed: number;
  flash: number;
};

const STAGE_MS = 1100;

export function useNeuralSequence({
  resetKey,
  reducedMotion,
}: {
  resetKey: string;
  reducedMotion: boolean;
}) {
  const clockRef = useRef<SequenceClock>({
    stage: -1,
    progress: 0,
    playing: false,
    speed: 1,
    flash: 0,
  });
  const [stage, setStage] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [complete, setComplete] = useState(false);
  const [speed, setSpeedState] = useState(1);

  const reset = useCallback(() => {
    clockRef.current.stage = -1;
    clockRef.current.progress = 0;
    clockRef.current.playing = false;
    clockRef.current.flash = 0;
    setStage(-1);
    setPlaying(false);
    setComplete(false);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      clockRef.current.stage = 5;
      clockRef.current.progress = 1;
      clockRef.current.playing = false;
      clockRef.current.flash = 0;
      setStage(5);
      setPlaying(false);
      setComplete(true);
      return;
    }
    reset();
  }, [resetKey, reducedMotion, reset]);

  useEffect(() => {
    if (!playing || reducedMotion) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const clock = clockRef.current;
      const delta = Math.min(64, now - last);
      last = now;

      if (!clock.playing) return;
      clock.progress += delta / (STAGE_MS / clock.speed);

      if (clock.progress >= 1) {
        clock.progress = 0;
        const next = clock.stage + 1;
        if (next > 4) {
          clock.stage = 5;
          clock.flash = 1;
          clock.playing = false;
          setStage(5);
          setPlaying(false);
          setComplete(true);
          return;
        }
        clock.stage = next;
        setStage(next);
      }

      if (clock.stage === 4) {
        clock.flash = Math.max(0, (clock.progress - 0.78) / 0.22);
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, reducedMotion]);

  const start = useCallback(() => {
    const clock = clockRef.current;
    if (reducedMotion) {
      clock.stage = 5;
      clock.progress = 1;
      setStage(5);
      setComplete(true);
      return;
    }
    if (clock.stage === -1 || clock.stage === 5) {
      clock.stage = 0;
      clock.progress = 0;
      clock.flash = 0;
      setStage(0);
      setComplete(false);
    }
    clock.playing = true;
    setPlaying(true);
  }, [reducedMotion]);

  const pause = useCallback(() => {
    clockRef.current.playing = false;
    setPlaying(false);
  }, []);

  const resume = useCallback(() => {
    const clock = clockRef.current;
    if (clock.stage < 0 || clock.stage > 4) return;
    clock.playing = true;
    setPlaying(true);
  }, []);

  const setSpeed = useCallback((value: number) => {
    clockRef.current.speed = value;
    setSpeedState(value);
  }, []);

  return {
    stage,
    playing,
    complete,
    speed,
    clockRef,
    start,
    pause,
    resume,
    restart: reset,
    setSpeed,
  };
}
