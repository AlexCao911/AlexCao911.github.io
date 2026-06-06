import { useEffect, useRef } from "react";

type DitherBackgroundProps = {
  waveColor?: [number, number, number];
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  pixelSize?: number;
  colorNum?: number;
};

export function DitherBackground({
  waveColor = [0, 188, 212],
  waveSpeed = 0.018,
  waveFrequency = 3,
  waveAmplitude = 0.32,
  pixelSize = 4,
  colorNum = 5,
}: DitherBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frame = 0;
    let raf = 0;
    let context: CanvasRenderingContext2D | null = null;

    try {
      context = canvas.getContext("2d");
    } catch {
      return;
    }

    if (!context) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(window.innerWidth / pixelSize) * ratio);
      canvas.height = Math.max(1, Math.floor(window.innerHeight / pixelSize) * ratio);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      if (!context) return;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      context.clearRect(0, 0, width, height);

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const wave =
            Math.sin((x / width) * Math.PI * waveFrequency + frame * waveSpeed) +
            Math.cos((y / height) * Math.PI * (waveFrequency + 1) + frame * waveSpeed * 0.8);
          const level = Math.round(((wave * waveAmplitude + 1) / 2) * colorNum) / colorNum;
          const alpha = 0.08 + level * 0.22;
          context.fillStyle = `rgba(${waveColor[0]}, ${waveColor[1]}, ${waveColor[2]}, ${alpha})`;
          context.fillRect(x, y, 1, 1);
        }
      }

      frame += 1;
      raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [colorNum, pixelSize, waveAmplitude, waveColor, waveFrequency, waveSpeed]);

  return <canvas className="dither-background" ref={canvasRef} aria-hidden="true" />;
}
