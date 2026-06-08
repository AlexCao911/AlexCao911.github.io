import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from "@rive-app/react-canvas";

type GalleryRiveCanvasProps = {
  artboard: string;
  buffer?: ArrayBuffer;
  hoverInput: string;
  src?: string;
  stateMachine: string;
};

export default function GalleryRiveCanvas({ artboard, buffer, hoverInput, src, stateMachine }: GalleryRiveCanvasProps) {
  const releaseTimerRef = useRef<number | null>(null);
  const { rive, RiveComponent } = useRive({
    buffer,
    src: buffer ? undefined : src,
    artboard,
    autoplay: true,
    stateMachines: stateMachine,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  const hoverState = useStateMachineInput(rive, stateMachine, hoverInput);

  const clearReleaseTimer = useCallback(() => {
    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  }, []);

  const setHover = useCallback(
    (value: boolean) => {
      clearReleaseTimer();
      if (hoverState) {
        hoverState.value = value;
      }
    },
    [clearReleaseTimer, hoverState]
  );

  const releaseHover = useCallback(
    (delay = 0) => {
      clearReleaseTimer();

      if (!hoverState) return;

      if (delay <= 0) {
        hoverState.value = false;
        return;
      }

      releaseTimerRef.current = window.setTimeout(() => {
        hoverState.value = false;
        releaseTimerRef.current = null;
      }, delay);
    },
    [clearReleaseTimer, hoverState]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        releaseHover(700);
        return;
      }

      setHover(true);
    },
    [releaseHover, setHover]
  );

  const handleTouchStart = useCallback(
    (event: ReactTouchEvent) => {
      event.preventDefault();
      setHover(true);
    },
    [setHover]
  );

  const handleTouchEnd = useCallback(
    (event: ReactTouchEvent) => {
      event.preventDefault();
      releaseHover(700);
    },
    [releaseHover]
  );

  useEffect(() => {
    return () => clearReleaseTimer();
  }, [clearReleaseTimer]);

  return (
    <RiveComponent
      className="gallery-rive-canvas"
      onPointerDown={() => setHover(true)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => releaseHover()}
      onPointerMove={() => setHover(true)}
      onPointerCancel={() => releaseHover()}
      onPointerUp={handlePointerUp}
      onTouchCancel={handleTouchEnd}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchStart}
      onTouchStart={handleTouchStart}
    />
  );
}
