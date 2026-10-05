/**
 * Cremallera recta de evolvente, perfil ISO 53 (cabeza 1·m, pie 1,25·m, radio de pie 0,38·m).
 * Coordenadas del contorno: x a lo largo de la barra, y desde la base (mm).
 */
export type Cremallera = {
  m: number; alfa: number; n: number;
  p: number; largo: number; alto: number; altoPrimitivo: number;
  ha: number; hf: number; h: number;
  espesorRef: number; anchoPunta: number;
  avancePorVuelta?: number; centroPinon?: number; dPinon?: number;
  pesoBarra: number; // kg, barra antes de dentar
};

export function calcularCremallera(o: { m: number; alfa?: number; n: number; alto: number; ancho: number; zPinon?: number; xPinon?: number }): Cremallera {
  const alfa = o.alfa ?? 20;
  const a = (alfa * Math.PI) / 180;
  const p = Math.PI * o.m;
  const largo = o.n * p;
  const altoPrimitivo = o.alto - o.m;
  const dPinon = o.zPinon ? o.m * o.zPinon : undefined;
  return {
    m: o.m, alfa, n: o.n, p, largo, alto: o.alto, altoPrimitivo,
    ha: o.m, hf: 1.25 * o.m, h: 2.25 * o.m,
    espesorRef: p / 2, anchoPunta: p / 2 - 2 * o.m * Math.tan(a),
    avancePorVuelta: o.zPinon ? p * o.zPinon : undefined,
    dPinon,
    centroPinon: dPinon ? altoPrimitivo + dPinon / 2 + (o.xPinon ?? 0) * o.m : undefined,
    pesoBarra: (largo * o.ancho * o.alto * 7.85) / 1e6,
  };
}

/** Contorno cerrado (antihorario): base, extremo derecho, dentado de derecha a izquierda, extremo izquierdo. */
export function contornoCremallera(c: Cremallera, nTramo = 8): [number, number][] {
  const { m, p } = c;
  const a = (c.alfa * Math.PI) / 180;
  const rho = 0.38 * m;
  const yRef = c.altoPrimitivo;
  // Medio hueco (lado derecho), relativo al centro del hueco y a la línea de referencia
  const vc = -1.25 * m + rho;
  const uc = p / 4 + vc * Math.tan(a) - rho / Math.cos(a);
  const medio: [number, number][] = [[0, -1.25 * m], [uc, -1.25 * m]];
  for (let i = 1; i <= nTramo; i++) {
    const t = -Math.PI / 2 + ((Math.PI / 2 - a) * i) / nTramo;
    medio.push([uc + rho * Math.cos(t), vc + rho * Math.sin(t)]);
  }
  medio.push([p / 4 + m * Math.tan(a), m]); // fin del flanco en la punta

  // Un paso: hueco k (mitad derecha) + punta + hueco k+1 (mitad izquierda)
  const paso: [number, number][] = [...medio];
  const izqSig = medio.map(([u, v]) => [p - u, v] as [number, number]).reverse();
  paso.push(...izqSig.slice(0, -1)); // sin repetir el centro del hueco siguiente

  const dentado: [number, number][] = [];
  for (let k = 0; k < c.n; k++) for (const [u, v] of paso) dentado.push([k * p + u, yRef + v]);
  dentado.push([c.n * p, yRef - 1.25 * m]);

  return [[0, 0], [c.largo, 0], ...dentado.reverse()];
}
