/**
 * Rodamientos rígidos de bolas de una hilera: medidas principales según ISO 15 (iguales en todas las marcas).
 * d = agujero, D = diámetro exterior, B = ancho; en mm.
 */
export type Rodamiento = { codigo: string; serie: string; d: number; D: number; B: number };

// prettier-ignore
const DATOS: [string, string, number, number, number][] = [
  // Miniatura
  ["604", "60", 4, 12, 4], ["605", "60", 5, 14, 5], ["606", "60", 6, 17, 6], ["607", "60", 7, 19, 6], ["608", "60", 8, 22, 7], ["609", "60", 9, 24, 7],
  ["623", "62", 3, 10, 4], ["624", "62", 4, 13, 5], ["625", "62", 5, 16, 5], ["626", "62", 6, 19, 6], ["627", "62", 7, 22, 7], ["628", "62", 8, 24, 8], ["629", "62", 9, 26, 8],
  ["634", "63", 4, 16, 5], ["635", "63", 5, 19, 6], ["636", "63", 6, 22, 7], ["637", "63", 7, 26, 9], ["638", "63", 8, 28, 9], ["639", "63", 9, 30, 10],
  // Serie 618 (sección muy delgada)
  ["6800", "618", 10, 19, 5], ["6801", "618", 12, 21, 5], ["6802", "618", 15, 24, 5], ["6803", "618", 17, 26, 5], ["6804", "618", 20, 32, 7],
  ["6805", "618", 25, 37, 7], ["6806", "618", 30, 42, 7], ["6807", "618", 35, 47, 7], ["6808", "618", 40, 52, 7], ["6809", "618", 45, 58, 7], ["6810", "618", 50, 65, 7],
  // Serie 619 (delgada)
  ["6900", "619", 10, 22, 6], ["6901", "619", 12, 24, 6], ["6902", "619", 15, 28, 7], ["6903", "619", 17, 30, 7], ["6904", "619", 20, 37, 9],
  ["6905", "619", 25, 42, 9], ["6906", "619", 30, 47, 9], ["6907", "619", 35, 55, 10], ["6908", "619", 40, 62, 12], ["6909", "619", 45, 68, 12], ["6910", "619", 50, 72, 12],
  // Serie 60 (ligera)
  ["6000", "60", 10, 26, 8], ["6001", "60", 12, 28, 8], ["6002", "60", 15, 32, 9], ["6003", "60", 17, 35, 10], ["6004", "60", 20, 42, 12],
  ["6005", "60", 25, 47, 12], ["6006", "60", 30, 55, 13], ["6007", "60", 35, 62, 14], ["6008", "60", 40, 68, 15], ["6009", "60", 45, 75, 16],
  ["6010", "60", 50, 80, 16], ["6011", "60", 55, 90, 18], ["6012", "60", 60, 95, 18], ["6013", "60", 65, 100, 18], ["6014", "60", 70, 110, 20],
  ["6015", "60", 75, 115, 20], ["6016", "60", 80, 125, 22], ["6017", "60", 85, 130, 22], ["6018", "60", 90, 140, 24], ["6019", "60", 95, 145, 24], ["6020", "60", 100, 150, 24],
  // Serie 62 (media)
  ["6200", "62", 10, 30, 9], ["6201", "62", 12, 32, 10], ["6202", "62", 15, 35, 11], ["6203", "62", 17, 40, 12], ["6204", "62", 20, 47, 14],
  ["6205", "62", 25, 52, 15], ["6206", "62", 30, 62, 16], ["6207", "62", 35, 72, 17], ["6208", "62", 40, 80, 18], ["6209", "62", 45, 85, 19],
  ["6210", "62", 50, 90, 20], ["6211", "62", 55, 100, 21], ["6212", "62", 60, 110, 22], ["6213", "62", 65, 120, 23], ["6214", "62", 70, 125, 24],
  ["6215", "62", 75, 130, 25], ["6216", "62", 80, 140, 26], ["6217", "62", 85, 150, 28], ["6218", "62", 90, 160, 30], ["6219", "62", 95, 170, 32], ["6220", "62", 100, 180, 34],
  // Serie 63 (pesada)
  ["6300", "63", 10, 35, 11], ["6301", "63", 12, 37, 12], ["6302", "63", 15, 42, 13], ["6303", "63", 17, 47, 14], ["6304", "63", 20, 52, 15],
  ["6305", "63", 25, 62, 17], ["6306", "63", 30, 72, 19], ["6307", "63", 35, 80, 21], ["6308", "63", 40, 90, 23], ["6309", "63", 45, 100, 25],
  ["6310", "63", 50, 110, 27], ["6311", "63", 55, 120, 29], ["6312", "63", 60, 130, 31], ["6313", "63", 65, 140, 33], ["6314", "63", 70, 150, 35],
  ["6315", "63", 75, 160, 37], ["6316", "63", 80, 170, 39], ["6317", "63", 85, 180, 41], ["6318", "63", 90, 190, 43], ["6319", "63", 95, 200, 45], ["6320", "63", 100, 215, 47],
];

export const RODAMIENTOS: Rodamiento[] = DATOS.map(([codigo, serie, d, D, B]) => ({ codigo, serie, d, D, B }));
export const rodamientoPorCodigo = (c: string) => RODAMIENTOS.find((r) => r.codigo === c);

/** Orden de las series para tablas y menús (de más delgada a más pesada). */
export const SERIES = ["618", "619", "60", "62", "63"] as const;

// ── Sufijos ──
export type Proteccion = "abierto" | "tapa1" | "tapas2" | "sello1" | "sellos2";
export type Sufijos = { proteccion: Proteccion; juego?: string; ranura?: "N" | "NR"; precision?: string; otros: string[] };

/** Designaciones habituales de cada marca para la misma versión (verifique siempre en el catálogo de la marca). */
export const EQUIVALENCIAS: Record<"tapas2" | "sellos2" | "tapa1" | "sello1", [string, string][]> = {
  tapas2: [["SKF", "2Z"], ["FAG / Schaeffler", "2ZR"], ["NSK", "ZZ"], ["NTN", "ZZ"], ["Koyo", "ZZ"]],
  sellos2: [["SKF", "2RSH (antes 2RS1)"], ["FAG / Schaeffler", "2RSR"], ["NSK", "DDU"], ["NTN", "LLU"], ["Koyo", "2RS"]],
  tapa1: [["SKF", "Z"], ["FAG / Schaeffler", "ZR"], ["NSK", "Z"], ["NTN", "Z"], ["Koyo", "Z"]],
  sello1: [["SKF", "RSH"], ["FAG / Schaeffler", "RSR"], ["NSK", "DU"], ["NTN", "LU"], ["Koyo", "RS"]],
};

const PROT: [RegExp, Proteccion][] = [
  [/^(2Z|ZZ|2ZR|2ZNR)/, "tapas2"],
  [/^(2RS1|2RSH|2RSR|2RSL|2RS|DDU|LLU|LLB|LLH|VV|DD|2RU|RSRS)/, "sellos2"],
  [/^(RS1|RSH|RSR|RSL|RS|DU|LU|LB|V)/, "sello1"],
  [/^(ZR|Z)/, "tapa1"],
];

/**
 * Lee un código como "6205-2RS C3", "6205ZZ", "62052RSH" o "6205 DDU CM".
 * Devuelve el rodamiento base (si está en la tabla) y lo que significan los sufijos.
 */
export function leerCodigo(texto: string): { rod?: Rodamiento; base: string; sufijos: Sufijos } {
  const limpio = texto.toUpperCase().replace(/[\s\-/.]/g, "");
  const m = limpio.match(/^(\d{3,5})(.*)$/);
  const vacio: Sufijos = { proteccion: "abierto", otros: [] };
  if (!m) return { base: limpio, sufijos: vacio };
  // El código base es el prefijo numérico más largo que existe en la tabla (en "62052RS" el 2 es del sello)
  let base = m[1], resto = m[2];
  let rod: Rodamiento | undefined;
  for (let n = m[1].length; n >= 3; n--) {
    const r = rodamientoPorCodigo(m[1].slice(0, n));
    if (r) { rod = r; base = r.codigo; resto = m[1].slice(n) + m[2]; break; }
  }
  const s: Sufijos = { proteccion: "abierto", otros: [] };
  while (resto.length) {
    const prot = PROT.find(([re]) => re.test(resto));
    if (prot && s.proteccion === "abierto") { s.proteccion = prot[1]; resto = resto.replace(prot[0], ""); continue; }
    const juego = resto.match(/^(C[2-5]|CN|CM)/);
    if (juego) { s.juego = juego[1]; resto = resto.slice(juego[1].length); continue; }
    const ran = resto.match(/^(NR|N)/);
    if (ran) { s.ranura = ran[1] as "N" | "NR"; resto = resto.slice(ran[1].length); continue; }
    const prec = resto.match(/^(P[0-6]|ABEC\d)/);
    if (prec) { s.precision = prec[1]; resto = resto.slice(prec[1].length); continue; }
    const otro = resto.match(/^[A-Z]+\d*|^\d+/);
    s.otros.push(otro ? otro[0] : resto[0]);
    resto = resto.slice(otro ? otro[0].length : 1);
  }
  return { rod, base, sufijos: s };
}

/** Busca por medidas tomadas con pie de metro (cualquier combinación de d, D y B), tolerancia en mm. */
export function buscarPorMedidas(m: { d?: number; D?: number; B?: number }, tol = 0.4): Rodamiento[] {
  const ok = (v: number | undefined, real: number) => v === undefined || Math.abs(v - real) <= tol;
  if (m.d === undefined && m.D === undefined && m.B === undefined) return [];
  return RODAMIENTOS.filter((r) => ok(m.d, r.d) && ok(m.D, r.D) && ok(m.B, r.B)).sort(
    (a, b) => err(a, m) - err(b, m) || a.d - b.d,
  );
}
const err = (r: Rodamiento, m: { d?: number; D?: number; B?: number }) =>
  Math.abs((m.d ?? r.d) - r.d) + Math.abs((m.D ?? r.D) - r.D) + Math.abs((m.B ?? r.B) - r.B);

/** Rodamientos relacionados: mismo agujero en otras series, y vecinos de la misma serie. */
export function relacionados(r: Rodamiento) {
  const mismoAgujero = RODAMIENTOS.filter((o) => o.d === r.d && o.codigo !== r.codigo);
  const serie = RODAMIENTOS.filter((o) => o.serie === r.serie && o.codigo.length === r.codigo.length);
  const i = serie.findIndex((o) => o.codigo === r.codigo);
  return { mismoAgujero, anterior: serie[i - 1], siguiente: serie[i + 1] };
}

/** Explicación del número: 62|05 → serie 62, agujero 05 × 5 = 25 mm. */
export function desgloseCodigo(r: Rodamiento): { serie: string; agujeroCod: string; regla: "x5" | "especial" | "directo" } {
  if (r.codigo.length === 3) return { serie: r.codigo.slice(0, 2), agujeroCod: r.codigo.slice(2), regla: "directo" };
  const cod = r.codigo.slice(-2);
  return { serie: r.codigo.slice(0, -2), agujeroCod: cod, regla: Number(cod) >= 4 ? "x5" : "especial" };
}
