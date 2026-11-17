/**
 * Chavetas paralelas DIN 6885 hoja 1 (forma alta). Medidas en mm.
 * Rango de eje "más de dMin hasta dMax" → chaveta b × h, profundidad en el eje t1 y en el cubo t2.
 */
export type Chaveta = { dMin: number; dMax: number; b: number; h: number; t1: number; t2: number };

// prettier-ignore
export const CHAVETAS_DIN6885: Chaveta[] = [
  [6, 8, 2, 2, 1.2, 1.0], [8, 10, 3, 3, 1.8, 1.4], [10, 12, 4, 4, 2.5, 1.8], [12, 17, 5, 5, 3.0, 2.3],
  [17, 22, 6, 6, 3.5, 2.8], [22, 30, 8, 7, 4.0, 3.3], [30, 38, 10, 8, 5.0, 3.3], [38, 44, 12, 8, 5.0, 3.3],
  [44, 50, 14, 9, 5.5, 3.8], [50, 58, 16, 10, 6.0, 4.3], [58, 65, 18, 11, 7.0, 4.4], [65, 75, 20, 12, 7.5, 4.9],
  [75, 85, 22, 14, 9.0, 5.4], [85, 95, 25, 14, 9.0, 5.4], [95, 110, 28, 16, 10.0, 6.4], [110, 130, 32, 18, 11.0, 7.4],
  [130, 150, 36, 20, 12.0, 8.4], [150, 170, 40, 22, 13.0, 9.4], [170, 200, 45, 25, 15.0, 10.4], [200, 230, 50, 28, 17.0, 11.4],
  [230, 260, 56, 32, 20.0, 12.4], [260, 290, 63, 32, 20.0, 12.4], [290, 330, 70, 36, 22.0, 14.4], [330, 380, 80, 40, 25.0, 15.4],
  [380, 440, 90, 45, 28.0, 17.4], [440, 500, 100, 50, 31.0, 19.5],
].map(([dMin, dMax, b, h, t1, t2]) => ({ dMin, dMax, b, h, t1, t2 }));

/** Chaveta que corresponde a un eje (null si está fuera de 6–500 mm). */
export const chavetaPara = (d: number) => CHAVETAS_DIN6885.find((c) => d > c.dMin && d <= c.dMax) ?? null;

/** Ajuste del ancho del chavetero en el cubo. */
export const AJUSTES_CHAVETERO = ["JS9", "P9", "D10"] as const;
export type AjusteChavetero = (typeof AJUSTES_CHAVETERO)[number];

/** Tipos de ajuste de la chaveta y tolerancia del ancho del chavetero en eje y cubo (DIN 6885 / ISO R773). */
export const TIPOS_AJUSTE = {
  normal: { eje: "N9", cubo: "JS9" },
  apretado: { eje: "P9", cubo: "P9" },
  deslizante: { eje: "H9", cubo: "D10" },
} as const;
export type TipoAjuste = keyof typeof TIPOS_AJUSTE;
export type Clase = "N9" | "JS9" | "P9" | "H9" | "D10";

// ISO 286: rangos de medida nominal (hasta, mm) y valores en µm
const HASTA = [3, 6, 10, 18, 30, 50, 80, 120];
const IT9 = [25, 30, 36, 43, 52, 62, 74, 87];
const IT10 = [40, 48, 58, 70, 84, 100, 120, 140];
const DESV_D = [20, 30, 40, 50, 65, 80, 100, 120]; // EI de D
const DESV_P = [6, 12, 15, 18, 22, 26, 32, 37]; // ES de P (negativa)

/** Desviaciones superior e inferior (en mm) de un ancho b con la clase ISO 286 dada. */
export function tolerancia(clase: Clase, b: number): { sup: number; inf: number } {
  const i = Math.max(HASTA.findIndex((h) => b <= h), 0);
  const it9 = IT9[i] / 1000, it10 = IT10[i] / 1000;
  switch (clase) {
    case "N9": { const es = b <= 3 ? -0.004 : 0; return { sup: es, inf: es - it9 }; }
    case "JS9": return { sup: it9 / 2, inf: -it9 / 2 };
    case "P9": return { sup: -DESV_P[i] / 1000, inf: -DESV_P[i] / 1000 - it9 };
    case "H9": return { sup: it9, inf: 0 };
    case "D10": return { sup: DESV_D[i] / 1000 + it10, inf: DESV_D[i] / 1000 };
  }
}

/** Largos normalizados de chaveta (mm). */
export const LARGOS_CHAVETA = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45, 50, 56, 63, 70, 80, 90, 100, 110, 125, 140, 160, 180, 200, 220, 250, 280, 320, 360, 400];

/**
 * Par que transmite la chaveta por aplastamiento en el cubo: T = p · (h − t1) · l_ef · d/2.
 * l_ef = l − b para extremos redondeados (forma A) o l para extremos rectos (forma B). Resultado en N·m.
 */
export const parChaveta = (o: { d: number; h: number; t1: number; b: number; l: number; p: number; forma: "A" | "B" }) =>
  (o.p * (o.h - o.t1) * Math.max(o.forma === "A" ? o.l - o.b : o.l, 0) * (o.d / 2)) / 1000;

/** Chavetas cuadradas en pulgadas ANSI B17.1: eje "más de" / "hasta" (in) → lado W de la chaveta. */
export type ChavetaAnsi = { dMin: number; dMax: number; w: number; wTxt: string; dMinTxt: string; dMaxTxt: string };
// prettier-ignore
export const CHAVETAS_ANSI: ChavetaAnsi[] = ([
  ["5/16", "7/16", "3/32"], ["7/16", "9/16", "1/8"], ["9/16", "7/8", "3/16"], ["7/8", "1 1/4", "1/4"], ["1 1/4", "1 3/8", "5/16"],
  ["1 3/8", "1 3/4", "3/8"], ["1 3/4", "2 1/4", "1/2"], ["2 1/4", "2 3/4", "5/8"], ["2 3/4", "3 1/4", "3/4"], ["3 1/4", "3 3/4", "7/8"],
  ["3 3/4", "4 1/2", "1"], ["4 1/2", "5 1/2", "1 1/4"], ["5 1/2", "6 1/2", "1 1/2"],
] as const).map(([a, b, w]) => ({ dMin: frac(a), dMax: frac(b), w: frac(w), wTxt: w, dMinTxt: a, dMaxTxt: b }));
export const chavetaAnsiPara = (dIn: number) => CHAVETAS_ANSI.find((c) => dIn > c.dMin && dIn <= c.dMax) ?? null;

/** "1 3/8" → 1.375 */
function frac(s: string): number {
  return s.split(" ").reduce((t, p) => {
    const [n, d] = p.split("/").map(Number);
    return t + (d ? n / d : n);
  }, 0);
}

/** Prisioneros métricos: rosca gruesa → diámetro de núcleo (para el dibujo) y medida sugerida según el eje. */
const PASO_GRUESO: Record<number, number> = { 4: 0.7, 5: 0.8, 6: 1, 8: 1.25, 10: 1.5, 12: 1.75, 16: 2 };
export const PRISIONEROS = Object.keys(PASO_GRUESO).map(Number);
export const nucleoRosca = (m: number) => m - 1.0825 * (PASO_GRUESO[m] ?? m * 0.15);
export const prisioneroPara = (d: number) => (d <= 10 ? 4 : d <= 17 ? 5 : d <= 30 ? 6 : d <= 44 ? 8 : d <= 65 ? 10 : d <= 95 ? 12 : 16);
