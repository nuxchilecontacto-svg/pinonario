/**
 * Transmisión por cadena de rodillos entre dos piñones (fórmulas estándar de catálogo, ISO 10823).
 *  z1 = piñón motriz (normalmente el chico), z2 = conducido, p = paso (mm), c = distancia entre centros (mm)
 */
export type Transmision = {
  relacion: number; // z2 / z1
  dp1: number;
  dp2: number;
  eslabonesExactos: number; // largo teórico en pasos para la distancia pedida
  eslabones: number; // redondeado al par superior
  largoMm: number;
  cReal: number; // distancia entre centros exacta con los eslabones elegidos
  ajusteC: number; // cuánto hay que mover un piñón respecto de lo pedido (mm)
  abrazamiento: number; // ángulo de contacto en el piñón chico (°)
  cEnPasos: number;
  rpm2?: number;
  velocidad?: number; // m/s
};

const dp = (p: number, z: number) => p / Math.sin(Math.PI / z);

/** Eslabones (en pasos) para una distancia entre centros. */
export function eslabonesPara(p: number, z1: number, z2: number, c: number) {
  const k = (z2 - z1) / (2 * Math.PI);
  return (2 * c) / p + (z1 + z2) / 2 + (p * k * k) / c;
}

/** Distancia entre centros exacta para un número de eslabones. */
export function distanciaPara(p: number, z1: number, z2: number, eslabones: number) {
  const a = eslabones - (z1 + z2) / 2;
  const k = (z2 - z1) / (2 * Math.PI);
  const disc = a * a - 8 * k * k;
  if (disc < 0) return NaN;
  return (p / 4) * (a + Math.sqrt(disc));
}

export function calcularTransmision(o: { p: number; z1: number; z2: number; c: number; rpm1?: number; eslabonesFijos?: number }): Transmision {
  const { p, z1, z2, c } = o;
  const exactos = eslabonesPara(p, z1, z2, c);
  const eslabones = o.eslabonesFijos ?? Math.ceil(exactos / 2) * 2;
  const cReal = distanciaPara(p, z1, z2, eslabones);
  const d1 = dp(p, z1);
  const d2 = dp(p, z2);
  const chico = Math.min(d1, d2);
  const grande = Math.max(d1, d2);
  const abrazamiento = 180 - (2 * Math.asin(Math.min(1, (grande - chico) / (2 * cReal))) * 180) / Math.PI;
  return {
    relacion: z2 / z1,
    dp1: d1,
    dp2: d2,
    eslabonesExactos: exactos,
    eslabones,
    largoMm: eslabones * p,
    cReal,
    ajusteC: cReal - c,
    abrazamiento,
    cEnPasos: cReal / p,
    rpm2: o.rpm1 ? (o.rpm1 * z1) / z2 : undefined,
    velocidad: o.rpm1 ? (z1 * p * o.rpm1) / 60000 : undefined,
  };
}

export type Aviso = { nivel: "ok" | "ojo" | "mal"; texto: string };

/** Recomendaciones habituales de diseño de transmisiones por cadena. */
export function avisos(t: Transmision, z1: number, z2: number): Aviso[] {
  const a: Aviso[] = [];
  const chico = Math.min(z1, z2);
  if (chico < 9) a.push({ nivel: "mal", texto: `Piñón de ${chico} dientes: muy chico, la cadena trabaja a golpes y se desgasta rápido. Use 17 o más si puede.` });
  else if (chico < 17) a.push({ nivel: "ojo", texto: `Piñón chico de ${chico} dientes: aceptable a baja velocidad. Para marcha suave se recomiendan 17 o más.` });
  else a.push({ nivel: "ok", texto: `Piñón chico de ${chico} dientes: marcha suave.` });

  if (t.relacion > 7 || t.relacion < 1 / 7) a.push({ nivel: "mal", texto: "Relación mayor a 7:1. Conviene hacerla en dos etapas." });

  if (t.cEnPasos < 30) a.push({ nivel: "ojo", texto: `Distancia entre centros corta (${t.cEnPasos.toFixed(0)} pasos). Lo ideal es 30 a 50 pasos.` });
  else if (t.cEnPasos > 80) a.push({ nivel: "ojo", texto: `Distancia larga (${t.cEnPasos.toFixed(0)} pasos): use guía o tensor para que la cadena no flamee.` });
  else a.push({ nivel: "ok", texto: `Distancia entre centros de ${t.cEnPasos.toFixed(0)} pasos: dentro del rango ideal (30 a 50 recomendado, hasta 80).` });

  if (t.abrazamiento < 120) a.push({ nivel: "mal", texto: `Ángulo de contacto en el piñón chico de ${t.abrazamiento.toFixed(0)}°: menor a 120°. Aumente la distancia o reduzca la relación.` });

  if (t.eslabones % 2 === 1) a.push({ nivel: "ojo", texto: "Número impar de eslabones: necesita un medio eslabón (acodado), que debilita la cadena. Prefiera un número par." });

  if (t.velocidad !== undefined && t.velocidad > 12) a.push({ nivel: "ojo", texto: `Velocidad de cadena ${t.velocidad.toFixed(1)} m/s: alta. Requiere buena lubricación (baño de aceite o bomba).` });
  return a;
}
