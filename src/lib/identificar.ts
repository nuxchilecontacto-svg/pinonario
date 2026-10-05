import { CADENAS, type Cadena } from "./cadenas";
import { calcularPinon } from "./calculo";

/* ───────────── Identificar la cadena ─────────────
 * Con pie de metro: largo sobre N pasos (borde izquierdo de un rodillo al borde izquierdo
 * de otro, N rodillos más allá), Ø del rodillo y, opcional, ancho interior.
 */
export type CandidatoCadena = {
  cadena: Cadena;
  estiramiento: number; // % respecto del paso nominal (+ = cadena estirada)
  difRodillo: number; // mm
  difAncho?: number; // mm
  puntaje: number; // menor = mejor
  confianza: "alta" | "media" | "baja";
};

export function identificarCadena(o: { largo: number; pasos: number; rodillo?: number; ancho?: number }): CandidatoCadena[] {
  const pMedido = o.largo / o.pasos;
  const out: CandidatoCadena[] = [];
  for (const c of CADENAS) {
    const e = ((pMedido - c.p) / c.p) * 100;
    // Una cadena usada se estira (hasta ~3 %); más corta que el nominal casi no ocurre
    if (e < -2 || e > 6) continue;
    const difRodillo = o.rodillo ? o.rodillo - c.d1 : 0;
    const difAncho = o.ancho ? o.ancho - c.b1 : undefined;
    const pen = e < 0 ? Math.abs(e) * 2 : Math.max(0, e - 3); // dentro de 0..3 % no castiga
    const puntaje = pen + Math.abs(difRodillo) * 4 + (difAncho !== undefined ? Math.abs(difAncho) * 2 : 0);
    out.push({ cadena: c, estiramiento: e, difRodillo, difAncho, puntaje, confianza: "baja" });
  }
  out.sort((a, b) => a.puntaje - b.puntaje);
  marcarConfianza(
    out,
    (c) =>
      c.estiramiento > -1.5 && c.estiramiento < 4 &&
      (o.rodillo === undefined || Math.abs(c.difRodillo) < 0.25) &&
      (c.difAncho === undefined || Math.abs(c.difAncho) < 0.4),
  );
  return out.slice(0, 3);
}

export function estadoDesgaste(e: number): { nivel: "ok" | "ojo" | "mal"; texto: string } {
  if (e < 1) return { nivel: "ok", texto: "Cadena en buen estado (estiramiento bajo 1 %)." };
  if (e < 2) return { nivel: "ojo", texto: "Desgaste medio. Revísela de nuevo en la próxima mantención." };
  if (e < 3) return { nivel: "ojo", texto: "Desgaste alto: planifique el cambio. Sobre 2 % ya daña los piñones." };
  return { nivel: "mal", texto: "Cadena gastada (sobre 3 %): cámbiela, y revise los piñones, porque una cadena así los come." };
}

/* ───────────── Identificar el piñón ─────────────
 * Con pie de metro: Z (contar dientes), medida sobre las puntas y medida de fondo a fondo.
 * En Z impar el pie de metro no queda diametral: se corrige con cos(90°/Z).
 */
export type CandidatoPinon = {
  cadena: Cadena;
  esperadoPuntas: [number, number]; // rango ISO medido con pie de metro
  esperadoFondo: number; // medida de fondo con pie de metro
  difPuntas?: number; // 0 si cae dentro del rango
  difFondo?: number;
  puntaje: number;
  confianza: "alta" | "media" | "baja";
};

export function identificarPinon(o: { z: number; puntas?: number; fondo?: number }): CandidatoPinon[] {
  const corr = o.z % 2 === 0 ? 1 : Math.cos(Math.PI / (2 * o.z));
  const out: CandidatoPinon[] = [];
  for (const c of CADENAS) {
    const r = calcularPinon(c, o.z);
    const rango: [number, number] = [r.deMin * corr, r.deMax * corr];
    let difPuntas: number | undefined;
    if (o.puntas) {
      // Puntas gastadas o rebajadas: se tolera hasta 3 % bajo el mínimo sin mucho castigo
      difPuntas = o.puntas < rango[0] ? o.puntas - rango[0] : o.puntas > rango[1] ? o.puntas - rango[1] : 0;
    }
    const difFondo = o.fondo ? o.fondo - r.dCalibre : undefined;
    const penP = difPuntas === undefined ? 0 : difPuntas < 0 ? Math.max(0, -difPuntas - 0.03 * rango[0]) * 3 + -difPuntas * 0.3 : difPuntas * 3;
    const penF = difFondo === undefined ? 0 : Math.abs(difFondo) * 4;
    const puntaje = (penP + penF) / c.p;
    if (puntaje > 3) continue;
    out.push({ cadena: c, esperadoPuntas: rango, esperadoFondo: r.dCalibre, difPuntas, difFondo, puntaje, confianza: "baja" });
  }
  out.sort((a, b) => a.puntaje - b.puntaje);
  marcarConfianza(out, (c) => (c.difFondo === undefined ? (c.difPuntas ?? 1) === 0 : Math.abs(c.difFondo) < 0.35));
  return out.slice(0, 3);
}

/** Alta: el primero calza y ningún otro calza. Media: calza pero hay otro que también. Baja: no calza. */
function marcarConfianza<T extends { confianza: "alta" | "media" | "baja" }>(lista: T[], calza: (c: T) => boolean) {
  const calzan = lista.filter(calza).length;
  lista.forEach((c) => {
    c.confianza = !calza(c) ? "baja" : calzan === 1 ? "alta" : "media";
  });
}
