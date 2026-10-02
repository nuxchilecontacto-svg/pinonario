export type Unidad = "mm" | "in";

const fmt = (n: number, dec: number) =>
  n.toLocaleString("es-CL", { minimumFractionDigits: dec, maximumFractionDigits: dec });

/** Longitud en la unidad elegida: mm con 2 decimales, pulgadas con 3. */
export const largo = (mm: number, u: Unidad) => (u === "mm" ? fmt(mm, 2) : fmt(mm / 25.4, 3));

export const unidad = (u: Unidad) => (u === "mm" ? "mm" : "in");

export const grados = (g: number) => `${fmt(g, 2)}°`;

export const kg = (n: number) => `${fmt(n, 2)} kg`;
