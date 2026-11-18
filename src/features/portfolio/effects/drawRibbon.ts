/**
 * Ribbon geometry adapted from Kokonut UI Background Paths by Dorian Baffier.
 * MIT — see docs/THIRD_PARTY_NOTICES.md. Rendering and lifecycle are local.
 */
export interface RibbonFrame {
  width: number;
  height: number;
  time: number;
  pointerX: number;
  pointerY: number;
  influence: number;
}
export function drawRibbon(ctx: CanvasRenderingContext2D, frame: RibbonFrame) {
  const { width, height, time, pointerX, pointerY, influence } = frame;
  ctx.clearRect(0, 0, width, height);
  const band = Math.min(height, width * 0.8);
  const gradient = ctx.createLinearGradient(
    0,
    height * 0.8,
    width,
    height * 0.1,
  );
  gradient.addColorStop(0, "rgba(155,180,207,0)");
  gradient.addColorStop(0.28, "rgba(162,178,198,0.35)");
  gradient.addColorStop(0.53, "rgba(240,243,252,0.95)");
  gradient.addColorStop(0.78, "rgba(182,197,232,0.6)");
  gradient.addColorStop(1, "rgba(175,195,226,0)");
  ctx.strokeStyle = gradient;
  ctx.lineCap = "round";
  for (let layer = 0; layer < 3; layer++) {
    const phase = layer * 0.3;
    const t = time * (0.7 + layer * 0.15);
    ctx.lineWidth = 0.7 + layer * 0.22;
    for (let i = 0; i < 16; i++) {
      const s = i / 15 - 0.5;
      ctx.globalAlpha =
        (0.26 + layer * 0.13) * (0.5 + 0.5 * (1 - Math.abs(s) * 2));
      ctx.beginPath();
      for (let k = 0; k <= 72; k++) {
        const u = -0.1 + (k / 72) * 1.2;
        const x = u * width;
        const center =
          height * 0.57 -
          0.33 * (x - width / 2) +
          band *
            0.1 *
            Math.sin(Math.PI * 2 * (0.75 * u + 0.1) + phase + t * 0.35);
        const turn = 0.22 + 0.09 * Math.sin(t * 0.21 + phase);
        const twist = Math.cos(
          Math.PI * (u - turn) +
            s * (0.6 + 0.3 * Math.sin(t * 0.5 + s * 4 + phase)) +
            phase,
        );
        let y = center + s * 1.6 * band * twist;
        const dy = y - pointerY;
        const falloff = Math.exp(-((x - pointerX) ** 2 + dy ** 2) / 22500);
        y += (dy / (Math.abs(dy) + 24)) * falloff * 50 * influence;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}
