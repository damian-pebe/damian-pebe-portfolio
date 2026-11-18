export interface RibbonFrame {
  width: number;
  height: number;
  time: number;
  pointerX: number;
  pointerY: number;
  influence: number;
}
/** A quiet, continuous silk wave. No DOM nodes or external animation runtime. */
export function drawRibbon(ctx: CanvasRenderingContext2D, frame: RibbonFrame) {
  const { width, height, time, pointerX, influence } = frame;
  ctx.clearRect(0, 0, width, height);
  if (!width || !height) return;
  const dark = document.documentElement.dataset.theme === "dark";
  const rgb = dark ? "255,255,255" : "0,0,0";
  const shift = (pointerX / width - 0.5) * influence * 0.3;
  for (let line = 0; line < 36; line++) {
    const p = line / 35;
    ctx.beginPath();
    for (let x = 0; x <= width + 8; x += 8) {
      const u = x / width;
      const envelope = Math.pow(Math.abs(u - 0.5) * 2, 1.1);
      const wave = Math.sin(u * 7 + time * 0.3 + p * 2 + shift) * 0.17;
      const y =
        height *
        (0.52 +
          (p - 0.5) * 0.23 +
          wave * envelope +
          Math.sin(u * 4 - time * 0.22) * 0.08);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${rgb},${0.025 + Math.sin(p * Math.PI) * 0.07})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
}
