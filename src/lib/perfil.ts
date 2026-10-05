/**
 * Perfil del diente según ISO 606 (en mm, centro del piñón en 0,0), formado solo por arcos:
 *  - asiento del rodillo: radio ri centrado en el centro del rodillo, abarca el ángulo α
 *  - flanco: radio re, tangente al asiento, hasta el diámetro exterior
 *  - punta: arco del diámetro exterior entre dos flancos
 * Se usan los valores medios entre la forma mínima y máxima de la norma, así el perfil
 * queda dentro de la tolerancia ISO 606.
 */

export type Arco = {
  x0: number; y0: number; // inicio
  x1: number; y1: number; // fin
  cx: number; cy: number; // centro
  r: number;
  ccw: boolean; // sentido antihorario
};

export type ParamPerfil = { ri: number; re: number; alfa: number /* grados */ };

export function paramPerfil(z: number, d1: number): ParamPerfil {
  const riMin = 0.505 * d1;
  const riMax = riMin + 0.069 * Math.cbrt(d1);
  const reMin = 0.12 * d1 * (z + 2);
  const reMax = 0.008 * d1 * (z * z + 180);
  return { ri: (riMin + riMax) / 2, re: (reMin + reMax) / 2, alfa: 130 - 90 / z };
}

const rot = (x: number, y: number, a: number): [number, number] => [
  x * Math.cos(a) - y * Math.sin(a),
  x * Math.sin(a) + y * Math.cos(a),
];

function rotarArco(s: Arco, a: number): Arco {
  const [x0, y0] = rot(s.x0, s.y0, a);
  const [x1, y1] = rot(s.x1, s.y1, a);
  const [cx, cy] = rot(s.cx, s.cy, a);
  return { x0, y0, x1, y1, cx, cy, r: s.r, ccw: s.ccw };
}

/** Contorno cerrado (recorrido antihorario) como lista de arcos. */
export function segmentosPinon(z: number, dp: number, de: number, d1: number, giro = 0): Arco[] {
  const { ri, re, alfa } = paramPerfil(z, d1);
  const R = dp / 2;
  const ra = de / 2;
  const tau = Math.PI / z; // medio paso angular: eje del diente

  // Hueco centrado en el eje +x. El centro del asiento se desplaza hacia afuera (ri − d1/2)
  // para que el fondo quede exactamente en Df = Dp − d1, con holgura lateral para el rodillo.
  const cAsiento = R + (ri - d1 / 2);
  const phi1 = Math.PI - (alfa * Math.PI) / 360;
  const u: [number, number] = [Math.cos(phi1), Math.sin(phi1)];
  const P1: [number, number] = [cAsiento + ri * u[0], ri * u[1]];
  // Centro del flanco: sobre la recta asiento → P1, dentro del diente (flanco convexo,
  // tangente al asiento), así el diente se angosta hacia la punta.
  const F: [number, number] = [P1[0] + re * u[0], P1[1] + re * u[1]];
  const enFlanco = (psi: number): [number, number] => [F[0] + re * Math.cos(psi), F[1] + re * Math.sin(psi)];

  // Avanza por el flanco (ψ creciente desde P1) hasta el diámetro exterior o el eje del diente
  const fuera = (psi: number) => {
    const [x, y] = enFlanco(psi);
    return Math.hypot(x, y) >= ra || Math.atan2(y, x) >= tau;
  };
  const psi0 = phi1 - Math.PI; // ángulo de P1 visto desde F
  let a = psi0;
  let b = psi0;
  const paso = 0.002;
  while (!fuera(b) && b < psi0 + Math.PI) {
    a = b;
    b += paso;
  }
  for (let i = 0; i < 50; i++) {
    const m = (a + b) / 2;
    if (fuera(m)) b = m;
    else a = m;
  }
  let E = enFlanco(b);
  let puntiagudo = Math.atan2(E[1], E[0]) >= tau - 1e-9 && Math.hypot(E[0], E[1]) < ra - 1e-6;
  if (!puntiagudo) {
    // Ajuste exacto al diámetro exterior
    const ang = Math.atan2(E[1], E[0]);
    E = [ra * Math.cos(ang), ra * Math.sin(ang)];
    puntiagudo = ang >= tau - 1e-9;
  }

  const espejo = (p: [number, number]): [number, number] => [p[0], -p[1]];
  const P1m = espejo(P1);
  const Fm = espejo(F);
  const Em = espejo(E);

  // Segmentos de un hueco (recorrido antihorario alrededor del piñón)
  const hueco: Arco[] = [
    { x0: Em[0], y0: Em[1], x1: P1m[0], y1: P1m[1], cx: Fm[0], cy: Fm[1], r: re, ccw: true }, // flanco inferior
    { x0: P1m[0], y0: P1m[1], x1: P1[0], y1: P1[1], cx: cAsiento, cy: 0, r: ri, ccw: false }, // asiento
    { x0: P1[0], y0: P1[1], x1: E[0], y1: E[1], cx: F[0], cy: F[1], r: re, ccw: true }, // flanco superior
  ];
  // Punta: de E hasta el inicio del hueco siguiente
  const EmSig = rot(Em[0], Em[1], 2 * tau);
  const punta: Arco | null = puntiagudo
    ? null
    : { x0: E[0], y0: E[1], x1: EmSig[0], y1: EmSig[1], cx: 0, cy: 0, r: ra, ccw: true };

  const out: Arco[] = [];
  for (let k = 0; k < z; k++) {
    const ak = giro + 2 * tau * k;
    for (const s of hueco) out.push(rotarArco(s, ak));
    if (punta) out.push(rotarArco(punta, ak));
  }
  return out;
}

/** Ángulo barrido (radianes, con signo: + antihorario) de un arco. */
export function barrido(s: Arco): number {
  const a0 = Math.atan2(s.y0 - s.cy, s.x0 - s.cx);
  const a1 = Math.atan2(s.y1 - s.cy, s.x1 - s.cx);
  let d = a1 - a0;
  if (s.ccw) while (d <= 0) d += 2 * Math.PI;
  else while (d >= 0) d -= 2 * Math.PI;
  return d;
}

/** Puntos del contorno para dibujar en pantalla. */
export function contornoPinon(z: number, dp: number, de: number, d1: number, giro = 0): [number, number][] {
  const pts: [number, number][] = [];
  for (const s of segmentosPinon(z, dp, de, d1, giro)) {
    const a0 = Math.atan2(s.y0 - s.cy, s.x0 - s.cx);
    const d = barrido(s);
    const n = Math.max(2, Math.ceil(Math.abs(d) / 0.05));
    for (let i = 0; i < n; i++) {
      const a = a0 + (d * i) / n;
      pts.push([s.cx + s.r * Math.cos(a), s.cy + s.r * Math.sin(a)]);
    }
  }
  return pts;
}

export const aPuntos = (pts: [number, number][], escala = 1, dx = 0, dy = 0) =>
  pts.map(([x, y]) => `${(x * escala + dx).toFixed(2)},${(y * escala + dy).toFixed(2)}`).join(" ");
