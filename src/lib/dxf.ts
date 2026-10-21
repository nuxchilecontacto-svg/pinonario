import { barrido, segmentosPinon } from "./perfil";
import type { Plano } from "./plano";

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

/**
 * DXF R12 del plano de fabricación, en mm reales (escala 1:1): el dibujo, las cotas, la tabla y el
 * rótulo quedan editables en cualquier CAD. Capas CONTORNO, ACHURADO, EJES, COTAS, TEXTO.
 */
export function dxfPlano(pl: Plano): string {
  const L: string[] = [];
  const fmt = (n: number) => (Math.abs(n) < 1e-9 ? "0" : n.toFixed(4).replace(/\.?0+$/, ""));
  const g = (c: number, v: string | number) => L.push(String(c), typeof v === "number" ? fmt(v) : v);
  const k = 1 / pl.escala;
  // hoja → mundo (mm reales, y hacia arriba, origen en el eje de la pieza)
  const wx = (x: number) => (x - pl.ox) * k;
  const wy = (y: number) => (pl.oy - y) * k;
  // Texto: Ø como %%c y caracteres no ASCII como \U+XXXX (lo entienden AutoCAD, LibreCAD, etc.)
  const txt = (s: string) =>
    s.replace(/Ø/g, "%%c").replace(/[^\x20-\x7e]/g, (ch) => `\\U+${ch.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`);
  const capa = { grueso: "CONTORNO", fino: "COTAS", achura: "ACHURADO", eje: "EJES" } as const;

  g(0, "SECTION"); g(2, "HEADER");
  g(9, "$ACADVER"); g(1, "AC1009");
  g(9, "$INSUNITS"); g(70, 4);
  g(9, "$MEASUREMENT"); g(70, 1);
  g(9, "$LTSCALE"); g(40, 1);
  g(0, "ENDSEC");

  g(0, "SECTION"); g(2, "TABLES");
  g(0, "TABLE"); g(2, "LTYPE"); g(70, 2);
  g(0, "LTYPE"); g(2, "CONTINUOUS"); g(70, 0); g(3, "Solid line"); g(72, 65); g(73, 0); g(40, 0);
  const patron = [8, -1.2, 1.2, -1.2].map((v) => v * k); // en mm de papel, llevado a la escala del modelo
  g(0, "LTYPE"); g(2, "CENTER"); g(70, 0); g(3, "Center ____ _ ____"); g(72, 65); g(73, patron.length);
  g(40, patron.reduce((s, v) => s + Math.abs(v), 0));
  for (const v of patron) g(49, v);
  g(0, "ENDTAB");
  const capas: [string, number, string][] = [
    ["CONTORNO", 7, "CONTINUOUS"], ["ACHURADO", 8, "CONTINUOUS"], ["EJES", 1, "CENTER"], ["COTAS", 3, "CONTINUOUS"], ["TEXTO", 7, "CONTINUOUS"],
  ];
  g(0, "TABLE"); g(2, "LAYER"); g(70, capas.length);
  for (const [nombre, color, tipo] of capas) { g(0, "LAYER"); g(2, nombre); g(70, 0); g(62, color); g(6, tipo); }
  g(0, "ENDTAB");
  g(0, "ENDSEC");

  g(0, "SECTION"); g(2, "ENTITIES");
  for (const e of pl.ents) {
    if (e.t === "linea") {
      g(0, "LINE"); g(8, capa[e.e]); g(10, wx(e.x1)); g(20, wy(e.y1)); g(30, 0); g(11, wx(e.x2)); g(21, wy(e.y2)); g(31, 0);
    } else if (e.t === "poli") {
      g(0, "POLYLINE"); g(8, capa[e.e]); g(66, 1); g(10, 0); g(20, 0); g(30, 0); g(70, e.cerrado ? 1 : 0);
      for (const [x, y] of e.pts) { g(0, "VERTEX"); g(8, capa[e.e]); g(10, wx(x)); g(20, wy(y)); g(30, 0); }
      g(0, "SEQEND"); g(8, capa[e.e]);
    } else if (e.t === "flecha") {
      const [p1, p2, p3] = e.pts;
      g(0, "SOLID"); g(8, "COTAS");
      g(10, wx(p1[0])); g(20, wy(p1[1])); g(30, 0);
      g(11, wx(p2[0])); g(21, wy(p2[1])); g(31, 0);
      g(12, wx(p3[0])); g(22, wy(p3[1])); g(32, 0);
      g(13, wx(p3[0])); g(23, wy(p3[1])); g(33, 0);
    } else {
      const just = e.ancla === "middle" ? 1 : e.ancla === "end" ? 2 : 0;
      g(0, "TEXT"); g(8, "TEXTO");
      g(10, wx(e.x)); g(20, wy(e.y)); g(30, 0);
      g(40, e.h * k * 0.72); // altura de mayúsculas ≈ 0,72 del tamaño de letra del SVG
      g(1, txt(e.s));
      if (e.rot) g(50, -e.rot);
      if (just) { g(72, just); g(11, wx(e.x)); g(21, wy(e.y)); g(31, 0); }
    }
  }
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
