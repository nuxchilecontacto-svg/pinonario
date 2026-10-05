import { barrido, segmentosPinon } from "./perfil";

/**
 * Archivo DXF (R12, el formato que leen todos los CAD y software de corte) con el perfil
 * del piñón en mm. Capas:
 *  CONTORNO   polilínea cerrada con arcos exactos (bulge)
 *  AGUJERO    círculo del agujero
 *  REFERENCIA círculos primitivo y de fondo (opcional, no cortar)
 */
export function dxfPinon(o: {
  z: number;
  dp: number;
  de: number;
  df: number;
  d1: number;
  agujero?: number;
  referencias?: boolean;
}): string {
  const L: string[] = [];
  const g = (codigo: number, valor: string | number) => {
    L.push(String(codigo), typeof valor === "number" ? fmt(valor) : valor);
  };
  const fmt = (n: number) => (Math.abs(n) < 1e-9 ? "0" : n.toFixed(6).replace(/\.?0+$/, ""));

  g(0, "SECTION"); g(2, "HEADER");
  g(9, "$ACADVER"); g(1, "AC1009");
  g(9, "$INSUNITS"); g(70, 4); // mm
  g(9, "$MEASUREMENT"); g(70, 1); // métrico
  g(0, "ENDSEC");

  g(0, "SECTION"); g(2, "ENTITIES");

  // Contorno
  const segs = segmentosPinon(o.z, o.dp, o.de, o.d1);
  g(0, "POLYLINE"); g(8, "CONTORNO"); g(62, 7); g(66, 1); g(10, 0); g(20, 0); g(30, 0); g(70, 1);
  for (const s of segs) {
    g(0, "VERTEX"); g(8, "CONTORNO");
    g(10, s.x0); g(20, s.y0); g(30, 0);
    g(42, Math.tan(barrido(s) / 4));
  }
  g(0, "SEQEND"); g(8, "CONTORNO");

  const circulo = (capa: string, color: number, r: number) => {
    g(0, "CIRCLE"); g(8, capa); g(62, color); g(10, 0); g(20, 0); g(30, 0); g(40, r);
  };
  if (o.agujero && o.agujero > 0) circulo("AGUJERO", 1, o.agujero / 2);
  if (o.referencias) {
    circulo("REFERENCIA", 5, o.dp / 2);
    circulo("REFERENCIA", 8, o.df / 2);
  }

  g(0, "ENDSEC");
  g(0, "EOF");
  return L.join("\r\n") + "\r\n";
}

/**
 * DXF R12 genérico: un contorno cerrado de puntos (capa CONTORNO), agujero opcional y
 * círculos de referencia opcionales. Para piezas cuyo perfil no es solo de arcos
 * (engranajes de evolvente, cremalleras).
 */
export function dxfContorno(o: { puntos: [number, number][]; agujero?: number; referencias?: number[]; cerrado?: boolean }): string {
  const L: string[] = [];
  const fmt = (n: number) => (Math.abs(n) < 1e-9 ? "0" : n.toFixed(5).replace(/\.?0+$/, ""));
  const g = (c: number, v: string | number) => L.push(String(c), typeof v === "number" ? fmt(v) : v);
  g(0, "SECTION"); g(2, "HEADER"); g(9, "$ACADVER"); g(1, "AC1009"); g(9, "$INSUNITS"); g(70, 4); g(9, "$MEASUREMENT"); g(70, 1); g(0, "ENDSEC");
  g(0, "SECTION"); g(2, "ENTITIES");
  g(0, "POLYLINE"); g(8, "CONTORNO"); g(62, 7); g(66, 1); g(10, 0); g(20, 0); g(30, 0); g(70, o.cerrado === false ? 0 : 1);
  for (const [x, y] of o.puntos) { g(0, "VERTEX"); g(8, "CONTORNO"); g(10, x); g(20, y); g(30, 0); }
  g(0, "SEQEND"); g(8, "CONTORNO");
  const circulo = (capa: string, color: number, r: number) => { g(0, "CIRCLE"); g(8, capa); g(62, color); g(10, 0); g(20, 0); g(30, 0); g(40, r); };
  if (o.agujero && o.agujero > 0) circulo("AGUJERO", 1, o.agujero / 2);
  for (const r of o.referencias ?? []) circulo("REFERENCIA", 5, r);
  g(0, "ENDSEC"); g(0, "EOF");
  return L.join("\r\n") + "\r\n";
}

export function descargar(nombre: string, contenido: string, tipo = "application/dxf") {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
