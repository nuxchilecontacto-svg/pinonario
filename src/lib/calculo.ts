import type { Cadena } from "./cadenas";

/**
 * Geometría de piñones para cadena de rodillos según ISO 606 / ANSI B29.1.
 * Todas las medidas en mm, ángulos en grados.
 */
export type Hileras = 1 | 2 | 3;

export type Resultado = {
  z: number;
  // Diámetros
  dp: number; // primitivo
  deRec: number; // exterior recomendado (torneado)
  deMax: number;
  deMin: number;
  df: number; // fondo / raíz
  dCalibre: number; // medida de control con pie de metro (Z impar ≠ df)
  mRodillos: number; // medida sobre rodillos de control (Ø = d1)
  dCuboMax: number; // diámetro máximo del cubo / resalte
  // Perfil del diente
  riMin: number; // radio de asiento del rodillo
  riMax: number;
  reMin: number; // radio de flanco
  reMax: number;
  alfaMin: number; // ángulo de asiento del rodillo
  alfaMax: number;
  // Ancho del dentado
  bf1: number; // ancho de diente (por hilera)
  bfTotal: number; // ancho total del dentado (doble/triple)
  ba: number; // chaflán lateral del diente
  rx: number; // radio lateral del diente
  // Ángulo entre dientes
  paso_angular: number;
};

const rad = (g: number) => (g * Math.PI) / 180;

export function calcularPinon(c: Cadena, z: number, hileras: Hileras = 1): Resultado {
  const tau = 180 / z;
  const dp = c.p / Math.sin(rad(tau));
  const cot = 1 / Math.tan(rad(tau));

  const df = dp - c.d1;
  const deMax = dp + 1.25 * c.p - c.d1;
  const deMin = dp + c.p * (1 - 1.6 / z) - c.d1;
  // ISO: práctica de catálogos europeos ≈ 35 % del rango de la norma (contrastado con catálogo, ±0,4 mm).
  // ASA: fórmula de diámetro exterior torneado de ANSI B29.1.
  const deRec = c.norma === "ISO" ? deMin + 0.35 * (deMax - deMin) : c.p * (0.6 + cot);

  const par = z % 2 === 0;
  const cosMedio = Math.cos(rad(90 / z));
  const dCalibre = par ? df : dp * cosMedio - c.d1;
  const mRodillos = par ? dp + c.d1 : dp * cosMedio + c.d1;

  const dCuboMax = c.p * cot - 1.04 * c.h2 - 0.76;

  const riMin = 0.505 * c.d1;
  const riMax = 0.505 * c.d1 + 0.069 * Math.cbrt(c.d1);
  const reMin = 0.12 * c.d1 * (z + 2);
  const reMax = 0.008 * c.d1 * (z * z + 180);
  const alfaMin = 120 - 90 / z;
  const alfaMax = 140 - 90 / z;

  const k = c.p <= 12.7 ? (hileras === 1 ? 0.93 : 0.91) : hileras === 1 ? 0.95 : 0.93;
  const bf1 = k * c.b1;
  const bfTotal = (hileras - 1) * c.pt + bf1;

  return {
    z,
    dp,
    deRec,
    deMax,
    deMin,
    df,
    dCalibre,
    mRodillos,
    dCuboMax,
    riMin,
    riMax,
    reMin,
    reMax,
    alfaMin,
    alfaMax,
    bf1,
    bfTotal,
    ba: 0.13 * c.p,
    rx: c.p,
    paso_angular: 360 / z,
  };
}

/** Material de partida y peso aproximado (acero 7,85 kg/dm³). */
export type Material = {
  dCorte: number; // Ø del disco/barra a cortar
  largoCorte: number; // espesor del disco / largo de barra
  pesoBruto: number; // kg
  pesoNeto: number; // kg aprox. pieza terminada
};

export function calcularMaterial(opts: {
  de: number;
  df: number;
  anchoDentado: number;
  conCubo: boolean;
  dCubo: number;
  largoTotal: number;
  agujero: number;
  sobremedida: number;
  densidad?: number; // kg/dm³
}): Material {
  const rho = (opts.densidad ?? 7.85) / 1e6; // kg/mm³
  const area = (d: number) => (Math.PI / 4) * d * d;
  const largo = opts.conCubo ? Math.max(opts.largoTotal, opts.anchoDentado) : opts.anchoDentado;
  const dCorte = opts.de + opts.sobremedida;
  const largoCorte = largo + opts.sobremedida;
  const pesoBruto = area(dCorte) * largoCorte * rho;

  // Pieza terminada: disco dentado (≈ área media entre De y Df) + cubo − agujero
  const dMedio = (opts.de + opts.df) / 2;
  let vol = area(dMedio) * opts.anchoDentado;
  if (opts.conCubo && opts.largoTotal > opts.anchoDentado) {
    vol += area(opts.dCubo) * (opts.largoTotal - opts.anchoDentado);
  }
  vol -= area(opts.agujero) * largo;
  return { dCorte, largoCorte, pesoBruto, pesoNeto: Math.max(vol, 0) * rho };
}

export const Z_MIN = 6;
export const Z_MAX = 150;
