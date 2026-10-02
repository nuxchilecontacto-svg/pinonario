/**
 * Dimensiones de cadenas de rodillos según ISO 606 (serie B europea = DIN 8187)
 * y ANSI/ASME B29.1 (serie A americana = "ASA").
 *
 *  p  = paso
 *  b1 = ancho interior mínimo entre placas interiores
 *  d1 = diámetro máximo del rodillo (casquillo en 25 y 35)
 *  h2 = altura máxima de la placa interior (define el cubo máximo)
 *  pt = paso transversal entre hileras (cadena doble/triple)
 * Todos los valores en mm.
 */
export type Norma = "ISO" | "ASA";

export type Cadena = {
  id: string; // usado en la URL: /tabla/08b/
  norma: Norma;
  codigo: string; // 08B, ASA 40...
  equivalente?: string; // denominación alternativa
  medida: string; // como se pide en el taller: 1/2" x 5/16"
  p: number;
  b1: number;
  d1: number;
  h2: number;
  pt: number;
};

export const CADENAS: Cadena[] = [
  // ── ISO 606 serie B (europea / DIN 8187) ──
  { id: "05b", norma: "ISO", codigo: "05B", medida: '8 x 3 mm', p: 8.0, b1: 3.0, d1: 5.0, h2: 7.11, pt: 5.64 },
  { id: "06b", norma: "ISO", codigo: "06B", medida: '3/8" x 7/32"', p: 9.525, b1: 5.72, d1: 6.35, h2: 8.26, pt: 10.24 },
  { id: "08b", norma: "ISO", codigo: "08B", medida: '1/2" x 5/16"', p: 12.7, b1: 7.75, d1: 8.51, h2: 11.81, pt: 13.92 },
  { id: "10b", norma: "ISO", codigo: "10B", medida: '5/8" x 3/8"', p: 15.875, b1: 9.65, d1: 10.16, h2: 14.73, pt: 16.59 },
  { id: "12b", norma: "ISO", codigo: "12B", medida: '3/4" x 7/16"', p: 19.05, b1: 11.68, d1: 12.07, h2: 16.13, pt: 19.46 },
  { id: "16b", norma: "ISO", codigo: "16B", medida: '1" x 17,02 mm', p: 25.4, b1: 17.02, d1: 15.88, h2: 21.08, pt: 31.88 },
  { id: "20b", norma: "ISO", codigo: "20B", medida: '1 1/4" x 3/4"', p: 31.75, b1: 19.56, d1: 19.05, h2: 26.42, pt: 36.45 },
  { id: "24b", norma: "ISO", codigo: "24B", medida: '1 1/2" x 1"', p: 38.1, b1: 25.4, d1: 25.4, h2: 33.4, pt: 48.36 },
  { id: "28b", norma: "ISO", codigo: "28B", medida: '1 3/4" x 1 1/4"', p: 44.45, b1: 30.99, d1: 27.94, h2: 37.08, pt: 59.56 },
  { id: "32b", norma: "ISO", codigo: "32B", medida: '2" x 1 1/4"', p: 50.8, b1: 30.99, d1: 29.21, h2: 42.29, pt: 58.55 },
  { id: "40b", norma: "ISO", codigo: "40B", medida: '2 1/2" x 1 1/2"', p: 63.5, b1: 38.1, d1: 39.37, h2: 52.96, pt: 72.29 },
  { id: "48b", norma: "ISO", codigo: "48B", medida: '3" x 1 3/4"', p: 76.2, b1: 45.72, d1: 48.26, h2: 63.88, pt: 91.21 },

  // ── ANSI B29.1 / ASA (serie A americana) ──
  { id: "asa25", norma: "ASA", codigo: "ASA 25", equivalente: "04C", medida: '1/4" x 1/8"', p: 6.35, b1: 3.18, d1: 3.3, h2: 6.02, pt: 6.4 },
  { id: "asa35", norma: "ASA", codigo: "ASA 35", equivalente: "06C", medida: '3/8" x 3/16"', p: 9.525, b1: 4.77, d1: 5.08, h2: 9.05, pt: 10.13 },
  { id: "asa40", norma: "ASA", codigo: "ASA 40", equivalente: "08A", medida: '1/2" x 5/16"', p: 12.7, b1: 7.85, d1: 7.92, h2: 12.07, pt: 14.38 },
  { id: "asa50", norma: "ASA", codigo: "ASA 50", equivalente: "10A", medida: '5/8" x 3/8"', p: 15.875, b1: 9.4, d1: 10.16, h2: 15.09, pt: 18.11 },
  { id: "asa60", norma: "ASA", codigo: "ASA 60", equivalente: "12A", medida: '3/4" x 1/2"', p: 19.05, b1: 12.57, d1: 11.91, h2: 18.08, pt: 22.78 },
  { id: "asa80", norma: "ASA", codigo: "ASA 80", equivalente: "16A", medida: '1" x 5/8"', p: 25.4, b1: 15.75, d1: 15.88, h2: 24.13, pt: 29.29 },
  { id: "asa100", norma: "ASA", codigo: "ASA 100", equivalente: "20A", medida: '1 1/4" x 3/4"', p: 31.75, b1: 18.9, d1: 19.05, h2: 30.18, pt: 35.76 },
  { id: "asa120", norma: "ASA", codigo: "ASA 120", equivalente: "24A", medida: '1 1/2" x 1"', p: 38.1, b1: 25.22, d1: 22.23, h2: 36.2, pt: 45.44 },
  { id: "asa140", norma: "ASA", codigo: "ASA 140", equivalente: "28A", medida: '1 3/4" x 1"', p: 44.45, b1: 25.22, d1: 25.4, h2: 42.24, pt: 48.87 },
  { id: "asa160", norma: "ASA", codigo: "ASA 160", equivalente: "32A", medida: '2" x 1 1/4"', p: 50.8, b1: 31.55, d1: 28.58, h2: 48.26, pt: 58.55 },
  { id: "asa200", norma: "ASA", codigo: "ASA 200", equivalente: "40A", medida: '2 1/2" x 1 1/2"', p: 63.5, b1: 37.85, d1: 39.68, h2: 60.33, pt: 71.55 },
  { id: "asa240", norma: "ASA", codigo: "ASA 240", equivalente: "48A", medida: '3" x 1 7/8"', p: 76.2, b1: 47.35, d1: 47.63, h2: 72.39, pt: 87.83 },
];

export const cadenaPorId = (id: string) => CADENAS.find((c) => c.id === id);

/** Nombre corto para títulos: "08B — 1/2" x 5/16"" */
export const nombreCadena = (c: Cadena) =>
  `${c.codigo}${c.equivalente ? ` (${c.equivalente})` : ""} — ${c.medida}`;
