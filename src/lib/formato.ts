import { LOCALE, type Idioma } from "./idioma";

export type Unidad = "mm" | "in";

export const num = (n: number, dec: number, l: Idioma = "es") =>
  n.toLocaleString(LOCALE[l], { minimumFractionDigits: dec, maximumFractionDigits: dec });

/** Longitud en la unidad elegida: mm con 2 decimales, pulgadas con 3. */
export const largo = (mm: number, u: Unidad, l: Idioma = "es") => (u === "mm" ? num(mm, 2, l) : num(mm / 25.4, 3, l));

export const unidad = (u: Unidad) => (u === "mm" ? "mm" : "in");

export const grados = (g: number, l: Idioma = "es") => `${num(g, 2, l)}°`;

export const kg = (n: number, l: Idioma = "es") => `${num(n, 2, l)} kg`;
