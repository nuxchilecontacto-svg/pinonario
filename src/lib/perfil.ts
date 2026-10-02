/**
 * Contorno del piñón (en mm, centrado en 0,0): punta de diente a De/2 y
 * asientos de rodillo circulares de radio 0,505·d1 sobre el círculo primitivo.
 */
export function contornoPinon(z: number, dp: number, de: number, d1: number, rot = 0): [number, number][] {
  const R = dp / 2;
  const rho = 0.505 * d1;
  const rExt = de / 2;
  const N = Math.max(720, z * 24);
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const phi = (2 * Math.PI * i) / N;
    let r = rExt;
    const k = Math.round(((phi - rot) * z) / (2 * Math.PI));
    for (const j of [k - 1, k, k + 1]) {
      const delta = phi - rot - (2 * Math.PI * j) / z;
      const s = R * Math.sin(delta);
      if (Math.abs(s) <= rho) r = Math.min(r, R * Math.cos(delta) - Math.sqrt(rho * rho - s * s));
    }
    pts.push([r * Math.cos(phi), r * Math.sin(phi)]);
  }
  return pts;
}

export const aPuntos = (pts: [number, number][], escala = 1, dx = 0, dy = 0) =>
  pts.map(([x, y]) => `${(x * escala + dx).toFixed(2)},${(y * escala + dy).toFixed(2)}`).join(" ");
