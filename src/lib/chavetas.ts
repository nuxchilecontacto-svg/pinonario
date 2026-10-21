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

/** Prisioneros métricos: rosca gruesa → diámetro de núcleo (para el dibujo) y medida sugerida según el eje. */
const PASO_GRUESO: Record<number, number> = { 4: 0.7, 5: 0.8, 6: 1, 8: 1.25, 10: 1.5, 12: 1.75, 16: 2 };
export const PRISIONEROS = Object.keys(PASO_GRUESO).map(Number);
export const nucleoRosca = (m: number) => m - 1.0825 * (PASO_GRUESO[m] ?? m * 0.15);
export const prisioneroPara = (d: number) => (d <= 10 ? 4 : d <= 17 ? 5 : d <= 30 ? 6 : d <= 44 ? 8 : d <= 65 ? 10 : d <= 95 ? 12 : 16);
