/**
 * Engranajes cilíndricos rectos de evolvente, perfil de referencia ISO 53 (cremallera básica):
 * altura de cabeza 1·m, de pie 1,25·m, radio de pie de la herramienta 0,38·m.
 * Todas las medidas en mm, ángulos en grados salvo indicación.
 */

export const MODULOS_SERIE1 = [0.5, 0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25];
export const MODULOS_SERIE2 = [0.7, 0.9, 1.125, 1.375, 1.75, 2.25, 2.75, 3.5, 4.5, 5.5, 7, 9, 11, 14, 18, 22];
export const DIAMETRAL_PITCH = [32, 24, 20, 16, 12, 10, 8, 6, 5, 4, 3, 2.5, 2, 1.5, 1.25, 1];

const rad = (g: number) => (g * Math.PI) / 180;
const inv = (a: number) => Math.tan(a) - a; // involuta (a en radianes)

/** Resuelve inv(a) = v (Newton). */
function invInversa(v: number) {
  let a = Math.cbrt(3 * v);
  for (let i = 0; i < 30; i++) a -= (inv(a) - v) / Math.tan(a) ** 2;
  return a;
}

export type Engranaje = {
  m: number; z: number; alfa: number; x: number;
  d: number; da: number; df: number; db: number;
  p: number; pb: number;
  s: number; // espesor del diente en el diámetro primitivo (arco)
  ha: number; hf: number; h: number; c: number;
  k: number; wk: number; // medida sobre k dientes
  sCordal: number; hCordal: number; // para calibre de dientes
  zMinSinRebaje: number; xMinSinRebaje: number; rebaje: boolean;
  puntaAguda: boolean; sa: number; // espesor en la cabeza
};

export function calcularEngranaje(o: { m: number; z: number; alfa?: number; x?: number }): Engranaje {
  const { m, z } = o;
  const alfa = o.alfa ?? 20;
  const x = o.x ?? 0;
  const a = rad(alfa);
  const d = m * z;
  const ha = m * (1 + x);
  const hf = m * (1.25 - x);
  const da = d + 2 * ha;
  const df = d - 2 * hf;
  const db = d * Math.cos(a);
  const p = Math.PI * m;
  const s = m * (Math.PI / 2 + 2 * x * Math.tan(a));

  // Medida sobre k dientes (Wildhaber). Con x = 0 se reduce a k = z·α/180° + 0,5
  const kReal = (z / Math.PI) * (Math.sqrt((1 + (2 * x) / z) ** 2 - Math.cos(a) ** 2) / Math.cos(a) - inv(a) - ((2 * x) / z) * Math.tan(a)) + 0.5;
  const kFinal = Math.max(1, Math.round(kReal));
  const wk = m * Math.cos(a) * (Math.PI * (kFinal - 0.5) + z * inv(a)) + 2 * x * m * Math.sin(a);

  // Espesor y altura cordal (calibre de dientes)
  const psi = s / d;
  const sCordal = d * Math.sin(psi);
  const hCordal = ha + (d / 2) * (1 - Math.cos(psi));

  // Rebaje (socavado) por la herramienta
  const zMin = 2 / Math.sin(a) ** 2;
  const xMin = 1 - (z * Math.sin(a) ** 2) / 2;

  // Espesor en la cabeza
  const aa = Math.acos(db / da);
  const sa = da * (s / d + inv(a) - inv(aa));

  return {
    m, z, alfa, x, d, da, df, db, p, pb: p * Math.cos(a), s, ha, hf, h: ha + hf, c: 0.25 * m,
    k: kFinal, wk, sCordal, hCordal,
    zMinSinRebaje: zMin, xMinSinRebaje: xMin, rebaje: x < xMin - 1e-9,
    puntaAguda: sa < 0.2 * m, sa,
  };
}

export type Pareja = { a0: number; a: number; alfaW: number; relacion: number; razonContacto: number };

/** Pareja de engranajes exteriores: distancia entre centros (con desplazamientos) y razón de contacto. */
export function calcularPareja(g1: Engranaje, g2: Engranaje): Pareja {
  const a = rad(g1.alfa);
  const a0 = (g1.m * (g1.z + g2.z)) / 2;
  const invW = (2 * (g1.x + g2.x) * Math.tan(a)) / (g1.z + g2.z) + inv(a);
  const aw = invInversa(invW);
  const dist = (a0 * Math.cos(a)) / Math.cos(aw);
  const rb1 = g1.db / 2, rb2 = g2.db / 2, ra1 = g1.da / 2, ra2 = g2.da / 2;
  const largoContacto = Math.sqrt(ra1 * ra1 - rb1 * rb1) + Math.sqrt(ra2 * ra2 - rb2 * rb2) - dist * Math.sin(aw);
  return { a0, a: dist, alfaW: (aw * 180) / Math.PI, relacion: g2.z / g1.z, razonContacto: largoContacto / g1.pb };
}

/* ───────── Perfil para dibujo y DXF ─────────
 * Se simula el tallado: la cremallera de referencia rueda sobre el círculo primitivo y el
 * contorno del engranaje es lo que queda sin cortar (incluye pie redondeado y rebaje real).
 */
function cuchilla(m: number, alfa: number): [number, number][] {
  const a = rad(alfa);
  const p = Math.PI * m;
  const rho = 0.38 * m;
  const hP = 1.25 * m; // profundidad de la cuchilla bajo la línea de referencia
  const vc = hP - rho;
  const uc = p / 4 - vc * Math.tan(a) - rho / Math.cos(a);
  const der: [number, number][] = [[p / 4 + 2 * m * Math.tan(a), -2 * m]];
  const tf: [number, number] = [uc + rho * Math.cos(a), vc + rho * Math.sin(a)];
  der.push(tf);
  const n = 10;
  for (let i = 1; i <= n; i++) {
    const t = a + ((Math.PI / 2 - a) * i) / n;
    der.push([uc + rho * Math.cos(t), vc + rho * Math.sin(t)]);
  }
  // Polígono cerrado: arriba-der → flanco → redondeo → punta → redondeo → flanco → arriba-izq
  const izq = der.map(([u, v]) => [-u, v] as [number, number]).reverse();
  return [...der, ...izq];
}

/** Contorno (puntos) de un engranaje recto, centrado en 0,0. */
export function contornoEngranaje(g: Engranaje, giro = 0, puntosPorHueco = 160, pasosTallado = 700): [number, number][] {
  const { m, z, x } = g;
  const rp = g.d / 2;
  const ra = g.da / 2;
  const poli = cuchilla(m, g.alfa);
  const yRef = rp + x * m;
  const medio = Math.PI / z;
  const thMax = (4 * m) / rp + medio * 1.5;
  const NT = pasosTallado;

  // Radio del borde para cada ángulo (hueco centrado en 90°)
  const radios: number[] = [];
  for (let i = 0; i < puntosPorHueco; i++) {
    const phi = Math.PI / 2 - medio + (2 * medio * i) / puntosPorHueco;
    const dx = Math.cos(phi), dy = Math.sin(phi);
    let rMin = ra;
    for (let j = 0; j <= NT; j++) {
      const th = -thMax + (2 * thMax * j) / NT;
      const c = Math.cos(-th), s = Math.sin(-th);
      let prev: [number, number] | null = null;
      for (let q = 0; q <= poli.length; q++) {
        const [u, v] = poli[q % poli.length];
        const X = u - rp * th, Y = yRef - v;
        const P: [number, number] = [c * X - s * Y, s * X + c * Y];
        if (prev) {
          // intersección del rayo (0,0)+t(dx,dy) con el segmento prev→P
          const ex = P[0] - prev[0], ey = P[1] - prev[1];
          const den = dx * ey - dy * ex;
          if (Math.abs(den) > 1e-12) {
            const t = (prev[0] * ey - prev[1] * ex) / den;
            const w = (prev[0] * dy - prev[1] * dx) / den;
            if (t > 0 && w >= 0 && w <= 1 && t < rMin) rMin = t;
          }
        }
        prev = P;
      }
    }
    radios.push(rMin);
  }

  const pts: [number, number][] = [];
  for (let k = 0; k < z; k++) {
    for (let i = 0; i < puntosPorHueco; i++) {
      const phi = giro + Math.PI / 2 - medio + (2 * medio * i) / puntosPorHueco + (2 * Math.PI * k) / z;
      pts.push([radios[i] * Math.cos(phi), radios[i] * Math.sin(phi)]);
    }
  }
  return pts;
}
