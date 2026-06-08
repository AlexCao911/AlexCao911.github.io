import { useEffect, useId, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import "./MetaBalls.css";

type MetaBallsProps = {
  color?: string;
  cursorBallColor?: string;
  ballCount?: number;
  animationSize?: number;
  speed?: number;
  clumpFactor?: number;
  hoverSmoothness?: number;
  enableMouseInteraction?: boolean;
  className?: string;
  style?: CSSProperties;
};

type Ball = {
  angle: number;
  drift: number;
  orbit: number;
  phase: number;
  radius: number;
  size: number;
  speed: number;
};

const TAU = Math.PI * 2;

function createBalls(count: number): Ball[] {
  return Array.from({ length: count }, (_, index) => {
    const ratio = index / Math.max(1, count);
    return {
      angle: ratio * TAU,
      drift: 0.08 + (index % 4) * 0.025,
      orbit: 0.21 + (index % 5) * 0.035,
      phase: index * 1.73,
      radius: 0.18 + (index % 6) * 0.012,
      size: 76 + (index % 5) * 18,
      speed: 0.34 + (index % 7) * 0.045,
    };
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function MetaBalls({
  color = "#111111",
  cursorBallColor = "#111111",
  ballCount = 16,
  animationSize = 28,
  speed = 1,
  clumpFactor = 1,
  hoverSmoothness = 0.16,
  enableMouseInteraction = true,
  className = "",
  style,
}: MetaBallsProps) {
  const filterId = useId().replace(/:/g, "");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cursorCircleRef = useRef<SVGCircleElement | null>(null);
  const circleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const pointerRef = useRef({ active: false, x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const balls = useMemo(() => createBalls(ballCount), [ballCount]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let frame = 0;
    const startedAt = performance.now();

    const handlePointerMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const width = rect.width || 1;
      const height = rect.height || 1;
      pointerRef.current.active = true;
      pointerRef.current.targetX = clamp((event.clientX - rect.left) / width, 0, 1);
      pointerRef.current.targetY = clamp((event.clientY - rect.top) / height, 0, 1);
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.targetX = 0.5;
      pointerRef.current.targetY = 0.5;
    };

    if (enableMouseInteraction) {
      wrapper.addEventListener("pointermove", handlePointerMove);
      wrapper.addEventListener("pointerleave", handlePointerLeave);
    }

    const animate = (now: number) => {
      const elapsed = ((now - startedAt) / 1000) * speed;
      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * hoverSmoothness;
      pointer.y += (pointer.targetY - pointer.y) * hoverSmoothness;

      balls.forEach((ball, index) => {
        const circle = circleRefs.current[index];
        if (!circle) return;

        const wave = elapsed * ball.speed + ball.phase;
        const orbit = ball.orbit * clumpFactor;
        let x = 0.5 + Math.cos(ball.angle + wave) * orbit + Math.sin(wave * 0.73) * ball.drift;
        let y = 0.5 + Math.sin(ball.angle + wave * 0.92) * orbit + Math.cos(wave * 0.61) * ball.drift;

        if (enableMouseInteraction && pointer.active) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const distance = Math.hypot(dx, dy);
          const pull = clamp(1 - distance / 0.62, 0, 1) * 0.28;
          x += dx * pull;
          y += dy * pull;
        }

        circle.setAttribute("cx", String(clamp(x, 0.06, 0.94) * 1000));
        circle.setAttribute("cy", String(clamp(y, 0.06, 0.94) * 1000));
      });

      const cursorCircle = cursorCircleRef.current;
      if (cursorCircle) {
        cursorCircle.setAttribute("cx", String(pointer.x * 1000));
        cursorCircle.setAttribute("cy", String(pointer.y * 1000));
        cursorCircle.setAttribute("r", String(pointer.active ? animationSize * 3.1 : 0));
      }

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      wrapper.removeEventListener("pointermove", handlePointerMove);
      wrapper.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [animationSize, balls, clumpFactor, enableMouseInteraction, hoverSmoothness, speed]);

  return (
    <div
      ref={wrapperRef}
      className={`meta-balls ${className}`.trim()}
      style={style}
      data-reactbits-component="meta-balls"
    >
      <svg className="meta-balls__stage" viewBox="0 0 1000 1000" role="presentation" aria-hidden="true">
        <defs>
          <filter id={`${filterId}-goo`} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={animationSize} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
        <g filter={`url(#${filterId}-goo)`}>
          {balls.map((ball, index) => (
            <circle
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              ref={(node) => {
                circleRefs.current[index] = node;
              }}
              className="meta-balls__circle"
              cx={500 + Math.cos(ball.angle) * ball.radius * 1000}
              cy={500 + Math.sin(ball.angle) * ball.radius * 1000}
              r={ball.size}
              fill={color}
            />
          ))}
          <circle ref={cursorCircleRef} cx="500" cy="500" r="0" fill={cursorBallColor} />
        </g>
      </svg>
    </div>
  );
}

export default MetaBalls;
