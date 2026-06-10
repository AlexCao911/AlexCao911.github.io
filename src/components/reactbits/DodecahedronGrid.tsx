import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./DodecahedronGrid.css";

type Gap = number | { row: number; col: number };

type Duration = {
  enter: number;
  leave: number;
  ripple: number;
};

export interface DodecahedronGridProps {
  gridSize?: number;
  compactGridSize?: number;
  shapeSize?: number;
  compactShapeSize?: number;
  cellGap?: Gap;
  compactCellGap?: Gap;
  maxAngle?: number;
  radius?: number;
  easing?: gsap.EaseString;
  duration?: Duration;
  faceColor?: string;
  edgeColor?: string;
  autoAnimate?: boolean;
  rippleOnClick?: boolean;
}

type FaceConfig = {
  index: number;
  transform: string;
  shadow?: string;
};

const PENTAGON_POINTS = "50,0 97.55,34.55 79.39,90.45 20.61,90.45 2.45,34.55";

function getGap(gap: Gap | undefined, axis: "row" | "col") {
  if (typeof gap === "number") return `${gap}px`;
  if (gap && typeof gap[axis] === "number") return `${gap[axis]}px`;
  return "5%";
}

function getDodecahedronFaces(size: number): FaceConfig[] {
  const tz = size * 0.6545085;
  const foldAngle = -63.43495;
  const faces: FaceConfig[] = [{ transform: `translateZ(${tz}px)`, index: 0 }];

  for (let i = 0; i < 5; i += 1) {
    faces.push({
      transform: `rotateZ(${i * 72}deg) rotateX(${foldAngle}deg) translateZ(${tz}px) rotateZ(180deg)`,
      index: i + 1,
    });
  }

  faces.push({
    transform: `rotateX(180deg) translateZ(${tz}px)`,
    index: 6,
    shadow: "drop-shadow(0 14px 18px rgba(17, 17, 17, 0.28))",
  });

  for (let i = 0; i < 5; i += 1) {
    faces.push({
      transform: `rotateX(180deg) rotateZ(${i * 72}deg) rotateX(${foldAngle}deg) translateZ(${tz}px) rotateZ(180deg)`,
      index: i + 7,
    });
  }

  return faces;
}

export const DodecahedronGrid: React.FC<DodecahedronGridProps> = ({
  gridSize = 8,
  shapeSize,
  cellGap,
  maxAngle = 70,
  radius = 2.5,
  easing = "power3.out",
  duration = { enter: 0.28, leave: 0.7, ripple: 0.72 },
  faceColor = "#120f17",
  edgeColor = "#f7f7f4",
  autoAnimate = true,
  rippleOnClick = true,
}) => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userActiveRef = useRef(false);
  const simPosRef = useRef({ x: 0, y: 0 });
  const simTargetRef = useRef({ x: 0, y: 0 });
  const simRAFRef = useRef<number | null>(null);
  const [measuredShapeSize, setMeasuredShapeSize] = useState(shapeSize ?? 38);

  const rowGap = getGap(cellGap, "row");
  const colGap = getGap(cellGap, "col");
  const resolvedGridSize = gridSize;
  const resolvedShapeSize = shapeSize ?? measuredShapeSize;
  const facesConfig = useMemo(() => getDodecahedronFaces(resolvedShapeSize), [resolvedShapeSize]);

  useEffect(() => {
    if (shapeSize) {
      setMeasuredShapeSize(shapeSize);
      return;
    }

    const scene = sceneRef.current;
    if (!scene) return;

    const updateMeasuredShapeSize = () => {
      const shape = scene.querySelector<HTMLDivElement>(".dodecahedron");
      const nextSize = shape?.getBoundingClientRect().width ?? 38;

      setMeasuredShapeSize((currentSize) => (Math.abs(currentSize - nextSize) < 0.5 ? currentSize : nextSize));
    };

    updateMeasuredShapeSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateMeasuredShapeSize);
      return () => window.removeEventListener("resize", updateMeasuredShapeSize);
    }

    const resizeObserver = new ResizeObserver(updateMeasuredShapeSize);
    resizeObserver.observe(scene);
    return () => resizeObserver.disconnect();
  }, [shapeSize]);

  const tiltAt = useCallback(
    (rowCenter: number, colCenter: number) => {
      if (!sceneRef.current) return;

      sceneRef.current.querySelectorAll<HTMLDivElement>(".dodecahedron").forEach((shape) => {
        const row = Number(shape.dataset.row);
        const col = Number(shape.dataset.col);
        const dx = col + 0.5 - colCenter;
        const dy = row + 0.5 - rowCenter;
        const distance = Math.hypot(dx, dy);

        if (distance <= radius) {
          const intensity = Math.max(0, 1 - distance / radius);
          const ease = 1 - (1 - intensity) ** 3;

          gsap.to(shape, {
            duration: duration.enter,
            ease: easing,
            overwrite: true,
            rotateX: dy * maxAngle * ease,
            rotateY: -dx * maxAngle * ease,
          });
        } else {
          gsap.to(shape, {
            duration: duration.leave,
            ease: "power3.out",
            overwrite: true,
            rotateX: 0,
            rotateY: 0,
          });
        }
      });
    },
    [duration.enter, duration.leave, easing, maxAngle, radius]
  );

  const tiltFromClientPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!sceneRef.current) return;

      const rect = sceneRef.current.getBoundingClientRect();
      const cellW = rect.width / resolvedGridSize;
      const cellH = rect.height / resolvedGridSize;
      const colCenter = (clientX - rect.left) / cellW;
      const rowCenter = (clientY - rect.top) / cellH;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));
    },
    [resolvedGridSize, tiltAt]
  );

  const markUserActive = useCallback(() => {
    userActiveRef.current = true;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      userActiveRef.current = false;
    }, 3000);
  }, []);

  const resetAll = useCallback(() => {
    if (!sceneRef.current) return;

    sceneRef.current.querySelectorAll<HTMLDivElement>(".dodecahedron").forEach((shape) => {
      gsap.to(shape, {
        duration: duration.leave,
        ease: "power3.out",
        overwrite: true,
        rotateX: 0,
        rotateY: 0,
      });
    });
  }, [duration.leave]);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      markUserActive();
      tiltFromClientPoint(event.clientX, event.clientY);
    },
    [markUserActive, tiltFromClientPoint]
  );

  const onTouchStart = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;

      markUserActive();
      tiltFromClientPoint(touch.clientX, touch.clientY);
    },
    [markUserActive, tiltFromClientPoint]
  );

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();

      const touch = event.touches[0];
      if (!touch) return;

      markUserActive();
      tiltFromClientPoint(touch.clientX, touch.clientY);
    },
    [markUserActive, tiltFromClientPoint]
  );

  const onTouchEnd = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (!rippleOnClick || !sceneRef.current) return;

      const rect = sceneRef.current.getBoundingClientRect();
      const cellW = rect.width / resolvedGridSize;
      const cellH = rect.height / resolvedGridSize;
      const colHit = (event.clientX - rect.left) / cellW;
      const rowHit = (event.clientY - rect.top) / cellH;

      sceneRef.current.querySelectorAll<HTMLDivElement>(".dodecahedron").forEach((shape) => {
        const row = Number(shape.dataset.row);
        const col = Number(shape.dataset.col);
        const distance = Math.hypot(row + 0.5 - rowHit, col + 0.5 - colHit);

        gsap.to(shape, {
          delay: distance * 0.045,
          duration: duration.ripple,
          ease: "power3.out",
          overwrite: true,
          rotateX: "+=360",
          rotateY: "+=180",
        });
      });
    },
    [duration.ripple, resolvedGridSize, rippleOnClick]
  );

  useEffect(() => {
    if (!autoAnimate || !sceneRef.current) return;

    simPosRef.current = {
      x: Math.random() * resolvedGridSize,
      y: Math.random() * resolvedGridSize,
    };
    simTargetRef.current = {
      x: Math.random() * resolvedGridSize,
      y: Math.random() * resolvedGridSize,
    };

    const speed = 0.018;
    const loop = () => {
      if (!userActiveRef.current) {
        const pos = simPosRef.current;
        const target = simTargetRef.current;

        pos.x += (target.x - pos.x) * speed;
        pos.y += (target.y - pos.y) * speed;
        tiltAt(pos.y, pos.x);

        if (Math.hypot(pos.x - target.x, pos.y - target.y) < 0.1) {
          simTargetRef.current = {
            x: Math.random() * resolvedGridSize,
            y: Math.random() * resolvedGridSize,
          };
        }
      }

      simRAFRef.current = requestAnimationFrame(loop);
    };

    simRAFRef.current = requestAnimationFrame(loop);
    return () => {
      if (simRAFRef.current != null) cancelAnimationFrame(simRAFRef.current);
    };
  }, [autoAnimate, resolvedGridSize, tiltAt]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", resetAll);
    el.addEventListener("click", onClick);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", resetAll);
      el.removeEventListener("click", onClick);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);

      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      gsap.killTweensOf(el.querySelectorAll(".dodecahedron"));
    };
  }, [onClick, onPointerMove, onTouchEnd, onTouchMove, onTouchStart, resetAll]);

  const cells = Array.from({ length: resolvedGridSize });
  const wrapperStyle = {
    "--dodecahedron-size": `${resolvedShapeSize}px`,
    "--dodecahedron-face-bg": faceColor,
    "--dodecahedron-face-stroke": edgeColor,
  } as React.CSSProperties;
  const sceneStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${resolvedGridSize}, 1fr)`,
    gridTemplateRows: `repeat(${resolvedGridSize}, 1fr)`,
    columnGap: colGap,
    rowGap,
    gridAutoRows: "1fr",
  };

  return (
    <div
      className="dodecahedron-grid"
      data-gallery-geometry="regular-dodecahedron"
      data-mobile-touch-interaction="true"
      style={wrapperStyle}
    >
      <div ref={sceneRef} className="dodecahedron-grid__scene" style={sceneStyle}>
        {cells.map((_, row) =>
          cells.map((__, col) => (
            <div className="dodecahedron-grid__cell" key={`${row}-${col}`}>
              <div className="dodecahedron" data-row={row} data-col={col}>
                {facesConfig.map((face) => (
                  <div
                    className="dodecahedron-face"
                    key={face.index}
                    style={{
                      filter: face.shadow,
                      transform: face.transform,
                    }}
                  >
                    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                      <polygon points={PENTAGON_POINTS} strokeWidth="2.5" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DodecahedronGrid;
