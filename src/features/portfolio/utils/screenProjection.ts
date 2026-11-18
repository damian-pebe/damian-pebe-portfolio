import type { ScreenCorners } from "../types/devices";

/** Map a rectangle to a photographed display without changing its pixels. */
export function screenProjection(corners: ScreenCorners, scale: number) {
  const points = corners.map(([x, y]) => [x * scale, y * scale]);
  const width = Math.hypot(
    points[1][0] - points[0][0],
    points[1][1] - points[0][1],
  );
  const height =
    (Math.hypot(points[3][0] - points[0][0], points[3][1] - points[0][1]) +
      Math.hypot(points[2][0] - points[1][0], points[2][1] - points[1][1])) /
    2;
  const source = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];
  const rows = source.flatMap(([x, y], i) => {
    const [u, v] = points[i];
    return [
      [x, y, 1, 0, 0, 0, -u * x, -u * y, u],
      [0, 0, 0, x, y, 1, -v * x, -v * y, v],
    ];
  });
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let row = col + 1; row < 8; row++)
      if (Math.abs(rows[row][col]) > Math.abs(rows[pivot][col])) pivot = row;
    [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
    const divisor = rows[col][col];
    for (let j = col; j <= 8; j++) rows[col][j] /= divisor;
    for (let row = 0; row < 8; row++) {
      if (row === col) continue;
      const factor = rows[row][col];
      for (let j = col; j <= 8; j++) rows[row][j] -= factor * rows[col][j];
    }
  }
  const [a, b, c, d, e, f, g, h] = rows.map((row) => row[8]);
  return {
    width,
    height,
    transform: `matrix3d(${[a, d, 0, g, b, e, 0, h, 0, 0, 1, 0, c, f, 0, 1].join(",")})`,
  };
}
