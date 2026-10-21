import type { AjusteChavetero, Chaveta } from "./chavetas";
import { nucleoRosca } from "./chavetas";
import type { Hileras } from "./calculo";
import { LOCALE, type Idioma } from "./idioma";
import type { Unidad } from "./formato";

/**
 * Plano de fabricación de un piñón: vista en corte con achurado, cotas, tabla de datos y notas,
 * en una hoja A4 apaisada. Todo se calcula aquí una sola vez y se dibuja igual en SVG (pantalla/PDF)
 * y en DXF, para que el plano y el archivo nunca se contradigan.
 *
 * Coordenadas: el modelo se arma en "mundo" (mm reales, x a lo largo del eje, y radial hacia arriba)
 * y se pasa a "hoja" (mm de papel, y hacia abajo) con la escala elegida.
 */

export type Estilo = "grueso" | "fino" | "achura" | "eje";
export type Ent =
  | { t: "linea"; x1: number; y1: number; x2: number; y2: number; e: Estilo }
  | { t: "poli"; pts: [number, number][]; cerrado: boolean; e: Estilo }
  | { t: "texto"; x: number; y: number; s: string; h: number; rot?: number; ancla?: "start" | "middle" | "end"; negrita?: boolean }
  | { t: "flecha"; pts: [number, number][] };

export type Plano = { ancho: number; alto: number; escala: number; escalaTxt: string; ox: number; oy: number; ents: Ent[] };

export type OpcionesPlano = {
  l: Idioma;
  u: Unidad;
  // Cadena y piñón
  codigo: string; // "ASA 60", "08B"
  normaTxt: string; // "ANSI B29.1", "ISO 606"
  medida: string; // 3/4" x 1/2"
  p: number;
  d1: number;
  pt: number;
  z: number;
  hileras: Hileras;
  dp: number;
  de: number;
  deMin: number;
  deMax: number;
  df: number;
  dCalibre: number;
  bf1: number;
  ba: number;
  rx: number;
  // Cuerpo
  cubo: "uno" | "ambos" | "no";
  dCubo: number;
  largoTotal: number;
  agujero: number;
  tolAgujero: string;
  dRanura: number; // Ø de fondo de las ranuras entre hileras
  chaveta: (Chaveta & { ajuste: AjusteChavetero }) | null;
  prisionero: number | null; // métrica, p. ej. 6 → M6
  // Notas
  cantidad: number;
  material: string;
  tratamiento: string;
  referencia: string;
  fecha: string;
};

const HOJA = { ancho: 297, alto: 210, margen: 10 };
const ZONA = { x0: 14, x1: 204, y0: 14, y1: 196 }; // zona del dibujo (a la derecha va la tabla)
const ESCALAS = [10, 5, 4, 2, 1, 1 / 2, 1 / 2.5, 1 / 4, 1 / 5, 1 / 10, 1 / 20, 1 / 50];
const H_TXT = 2.6; // altura de texto de cotas (mm de papel)
const FLECHA = { largo: 2.6, ancho: 0.55 };

const TX = {
  es: {
    z: "Z (dientes)", paso: "Paso", rodillo: "Ø rodillo", norma: "Norma", hileras: "Hileras", hil: ["", "Simple", "Doble", "Triple"],
    dp: "Ø primitivo", de: "Ø exterior", ranura: "Ø fondo ranuras", prof: "prof.", rango: "Rango De norma", df: "Ø fondo", mc: "Medida pie de metro",
    cantidad: "Cantidad", material: "Material", tratamiento: "Tratamiento", agujero: "Agujero",
    chavetero: (b: number, aj: string, t2: string, dt2: string) => `Chavetero DIN 6885: ${b} ${aj}, t2 = ${t2} (d + t2 = ${dt2})`,
    prisionero: (m: number, x: string) => `Prisionero M${m} sobre el chavetero, a ${x} de la cara del cubo`,
    prisioneroSin: (m: number, x: string) => `Prisionero M${m} a ${x} de la cara del cubo`,
    unaPieza: "Piñón de una sola pieza", cotas: (u: string) => `Cotas en ${u}`, escala: "Escala", hoja: "Hoja A4",
    titulo: (c: string, z: number, h: number) => `Piñón ${c} · Z${z}${h > 1 ? ` · ${h === 2 ? "doble" : "triple"}` : ""}`,
    ref: "Referencia", fecha: "Fecha", gen: "Plano generado en pinonario.com · verifique contra la cadena real antes de fabricar",
    impar: "(Z impar)", mm: "mm", pulg: "pulgadas",
  },
  en: {
    z: "N (teeth)", paso: "Pitch", rodillo: "Roller Ø", norma: "Standard", hileras: "Strands", hil: ["", "Simplex", "Duplex", "Triplex"],
    dp: "Pitch Ø", de: "Outside Ø", ranura: "Groove bottom Ø", prof: "depth", rango: "Standard OD range", df: "Bottom Ø", mc: "Caliper diameter",
    cantidad: "Quantity", material: "Material", tratamiento: "Heat treatment", agujero: "Bore",
    chavetero: (b: number, aj: string, t2: string, dt2: string) => `Keyway DIN 6885: ${b} ${aj}, t2 = ${t2} (d + t2 = ${dt2})`,
    prisionero: (m: number, x: string) => `M${m} set screw over the keyway, ${x} from the hub face`,
    prisioneroSin: (m: number, x: string) => `M${m} set screw, ${x} from the hub face`,
    unaPieza: "One-piece sprocket", cotas: (u: string) => `Dimensions in ${u}`, escala: "Scale", hoja: "A4 sheet",
    titulo: (c: string, z: number, h: number) => `${c} sprocket · ${z}T${h > 1 ? ` · ${h === 2 ? "duplex" : "triplex"}` : ""}`,
    ref: "Reference", fecha: "Date", gen: "Drawing generated at pinonario.com · check against the actual chain before manufacturing",
    impar: "(odd N)", mm: "mm", pulg: "inches",
  },
};

/** Número para cotas: hasta 2 decimales en mm, 3 en pulgadas, sin ceros de sobra. */
export function cotaTxt(mm: number, u: Unidad, l: Idioma) {
  const v = u === "mm" ? mm : mm / 25.4;
  return v.toLocaleString(LOCALE[l], { minimumFractionDigits: 0, maximumFractionDigits: u === "mm" ? 2 : 3 });
}

export function generarPlano(o: OpcionesPlano): Plano {
  const t = TX[o.l];
  const C = (mm: number) => cotaTxt(mm, o.u, o.l);
  const n = o.hileras;

  // ── Geometría en mundo ──
  const W = (n - 1) * o.pt + o.bf1; // ancho del dentado
  const hayCubo = o.cubo !== "no" && o.largoTotal > W + 0.01;
  const a = hayCubo && o.cubo === "ambos" ? (o.largoTotal - W) / 2 : 0; // cubo izquierdo
  const b = hayCubo ? (o.cubo === "ambos" ? (o.largoTotal - W) / 2 : o.largoTotal - W) : 0; // cubo derecho
  const T = a + W + b;
  const ra = o.de / 2, rf = o.df / 2, rp = o.dp / 2;
  const rh = hayCubo ? o.dCubo / 2 : rf;
  const rg = n > 1 ? Math.min(o.dRanura / 2, rf) : rf;
  const rbInf = o.agujero / 2;
  const rbSup = o.chaveta ? rbInf + o.chaveta.t2 : rbInf;

  // ── Escala: la mayor normalizada que deja espacio para las cotas ──
  const nDer = 1 + (o.chaveta ? 1 : 0) + (hayCubo ? 1 : 0);
  const nArr = (n > 1 ? 1 : 0) + 1 + (hayCubo ? 1 : 0);
  const anchoUtil = ZONA.x1 - ZONA.x0 - 20 - 8 * nDer - 6;
  const altoUtil = ZONA.y1 - ZONA.y0 - 8 * nArr - 15;
  const sMax = Math.min(anchoUtil / T, altoUtil / o.de);
  const s = ESCALAS.find((e) => e <= sMax + 1e-9) ?? ESCALAS[ESCALAS.length - 1];
  const escalaTxt = s >= 1 ? `${s}:1` : `1:${+(1 / s).toFixed(1)}`;

  // Centrar el bloque (cotas izquierda 20 mm, derecha 8 por cota)
  const anchoBloque = 20 + T * s + 6 + 8 * nDer;
  const ox = ZONA.x0 + (ZONA.x1 - ZONA.x0 - anchoBloque) / 2 + 20;
  const altoBloque = 8 * nArr + 7 + o.de * s;
  const oy = ZONA.y0 + (ZONA.y1 - ZONA.y0 - altoBloque) / 2 + 8 * nArr + 7 + ra * s;
  const X = (x: number) => ox + x * s;
  const Y = (y: number) => oy - y * s;
  const P = (x: number, y: number): [number, number] => [X(x), Y(y)];

  const ents: Ent[] = [];
  const linea = (p1: [number, number], p2: [number, number], e: Estilo) => ents.push({ t: "linea", x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], e });
  const texto = (x: number, y: number, s: string, h = H_TXT, extra: Partial<Extract<Ent, { t: "texto" }>> = {}) =>
    ents.push({ t: "texto", x, y, s, h, ancla: "middle", ...extra });

  // ── Sección (mitad superior e inferior) ──
  const seccion = (rb: number, sg: 1 | -1): [number, number][] => {
    const pts: [number, number][] = [];
    const add = (x: number, y: number) => {
      const q = P(x, sg * y);
      const u = pts[pts.length - 1];
      if (!u || Math.abs(u[0] - q[0]) > 1e-6 || Math.abs(u[1] - q[1]) > 1e-6) pts.push(q);
    };
    add(0, rb);
    if (a > 0) { add(0, rh); add(a, rh); }
    for (let i = 0; i < n; i++) {
      const x0 = a + i * o.pt, x1 = x0 + o.bf1;
      if (i > 0) add(x0, rg);
      add(x0, rf);
      add(x1, rf);
      if (i < n - 1) add(x1, rg);
    }
    if (b > 0) { add(a + W, rh); add(T, rh); }
    add(T, rb);
    return pts;
  };
  const sup = seccion(rbSup, 1);
  const inf = seccion(rbInf, -1);

  // Agujero roscado del prisionero (mitad superior, centro del cubo)
  const mPris = hayCubo && o.prisionero ? o.prisionero : null;
  const hx = b > 0 ? a + W + b / 2 : a / 2;
  const huecos: [number, number][][] = [];
  if (mPris) {
    const r1 = nucleoRosca(mPris) / 2;
    huecos.push([P(hx - r1, rbSup), P(hx + r1, rbSup), P(hx + r1, rh), P(hx - r1, rh)]);
  }

  // Achurado a 45° (líneas x + y = c en la hoja), descontando el agujero roscado
  for (const seg of achurado([sup, inf], huecos, 2.4)) linea(seg[0], seg[1], "achura");

  // Contornos de la sección; el prisionero interrumpe las líneas del cubo y del agujero
  for (const poli of [sup, inf]) {
    for (let i = 0; i < poli.length; i++) {
      const p1 = poli[i], p2 = poli[(i + 1) % poli.length];
      if (mPris && poli === sup && Math.abs(p1[1] - p2[1]) < 1e-6) {
        const h = huecos[0];
        const [xa, xb] = [Math.min(p1[0], p2[0]), Math.max(p1[0], p2[0])];
        const hx0 = h[0][0], hx1 = h[1][0];
        if ((Math.abs(p1[1] - h[0][1]) < 1e-6 || Math.abs(p1[1] - h[2][1]) < 1e-6) && xa < hx0 && xb > hx1) {
          linea([xa, p1[1]], [hx0, p1[1]], "grueso");
          linea([hx1, p1[1]], [xb, p1[1]], "grueso");
          continue;
        }
      }
      linea(p1, p2, "grueso");
    }
  }
  if (mPris) {
    const r1 = nucleoRosca(mPris) / 2, r2 = mPris / 2;
    for (const sg of [-1, 1]) {
      linea(P(hx + sg * r1, rbSup), P(hx + sg * r1, rh), "grueso"); // núcleo (agujero taladrado)
      linea(P(hx + sg * r2, rbSup), P(hx + sg * r2, rh), "fino"); // diámetro de rosca
    }
    linea([X(hx), Y(rh) - 3], [X(hx), Y(rbSup) + 2], "eje");
  }

  // ── Dientes (por encima del fondo, sin achurar, con chaflán lateral rx/ba) ──
  const alturaDiente = ra - rf;
  let hCh = Math.sqrt(Math.max(2 * o.rx * o.ba - o.ba * o.ba, 0));
  if (hCh > alturaDiente) hCh = alturaDiente;
  const ys = ra - hCh;
  for (const sg of [1, -1] as const) {
    for (let i = 0; i < n; i++) {
      const x0 = a + i * o.pt, x1 = x0 + o.bf1;
      const izq: [number, number][] = [];
      for (let k = 0; k <= 8; k++) {
        const y = ys + (hCh * k) / 8;
        izq.push([x0 + o.rx - Math.sqrt(Math.max(o.rx * o.rx - (y - ys) ** 2, 0)), y]);
      }
      const der = izq.map(([x, y]) => [x1 - (x - x0), y] as [number, number]).reverse();
      const pts: [number, number][] = [[x0, rf], ...izq, ...der, [x1, rf]];
      ents.push({ t: "poli", pts: pts.map(([x, y]) => P(x, sg * y)), cerrado: false, e: "grueso" });
      // Línea de primitivo a través del diente
      linea([X(x0) - 2.5, Y(sg * rp)], [X(x1) + 2.5, Y(sg * rp)], "eje");
    }
  }

  // Eje de la pieza
  linea([X(0) - 5, Y(0)], [X(T) + 5, Y(0)], "eje");

  // ── Cotas ──
  const flecha = (x: number, y: number, ang: number) => {
    const c = Math.cos(ang), sn = Math.sin(ang);
    const bx = x - FLECHA.largo * c, by = y - FLECHA.largo * sn;
    ents.push({ t: "flecha", pts: [[x, y], [bx - FLECHA.ancho * sn, by + FLECHA.ancho * c], [bx + FLECHA.ancho * sn, by - FLECHA.ancho * c]] });
  };
  const anchoTxt = (s: string, h = H_TXT) => s.length * h * 0.62;

  /**
   * Cota horizontal entre xa y xb (hoja), línea de cota a la altura yd (por encima de la pieza).
   * pos: texto centrado, centrado y levantado (para alternar en cadenas apretadas) o fuera a la derecha.
   */
  const cotaH = (xa: number, ya: number, xb: number, yb: number, yd: number, s: string, pos: "centro" | "alto" | "der" = "centro") => {
    linea([xa, ya - 1], [xa, yd - 1.5], "fino");
    linea([xb, yb - 1], [xb, yd - 1.5], "fino");
    const largo = xb - xa;
    if (largo >= 2 * FLECHA.largo + 1) {
      linea([xa, yd], [xb, yd], "fino");
      flecha(xa, yd, Math.PI); flecha(xb, yd, 0);
    } else {
      linea([xa - 5, yd], [xb + 5, yd], "fino");
      flecha(xa, yd, 0); flecha(xb, yd, Math.PI);
    }
    if (pos === "der") texto(xb + 6, yd - 0.9, s, H_TXT, { ancla: "start" });
    else texto((xa + xb) / 2, yd - 0.9 - (pos === "alto" ? 3.3 : 0), s);
  };
  const cabe = (s: string, largo: number) => anchoTxt(s) + 1 <= largo;
  /** Cota vertical entre ya y yb (hoja) en x = xd; el texto va girado, a la izquierda de la línea. */
  const cotaV = (ya: number, xa: number, yb: number, xb: number, xd: number, s: string, ext = true) => {
    if (ext) {
      const dir = xd > xa ? 1 : -1;
      linea([xa + dir * 1, ya], [xd + dir * 1.5, ya], "fino");
      linea([xb + dir * 1, yb], [xd + dir * 1.5, yb], "fino");
    }
    const [y0, y1] = [Math.min(ya, yb), Math.max(ya, yb)];
    if (y1 - y0 >= 2 * FLECHA.largo + 1) {
      linea([xd, y0], [xd, y1], "fino");
      flecha(xd, y0, -Math.PI / 2); flecha(xd, y1, Math.PI / 2);
    } else {
      linea([xd, y0 - 5], [xd, y1 + 5], "fino");
      flecha(xd, y0, Math.PI / 2); flecha(xd, y1, -Math.PI / 2);
    }
    texto(xd - 0.9, (y0 + y1) / 2, s, H_TXT, { rot: -90 });
  };

  const xT0 = X(a), yTop = Y(ra);
  // Izquierda: Ø exterior y Ø primitivo
  cotaV(Y(ra), xT0, Y(-ra), xT0, X(0) - 15, `Ø${C(o.de)}`);
  cotaV(Y(rp), xT0, Y(-rp), xT0, X(0) - 8, `Ø${C(o.dp)}`);

  // Derecha: agujero, d + t2, cubo
  const xR = X(T);
  let xd = xR + 8;
  cotaV(Y(rbInf), xR, Y(-rbInf), xR, xd, `Ø${C(o.agujero)}${o.tolAgujero ? ` ${o.tolAgujero}` : ""}`);
  if (o.chaveta) {
    xd += 8;
    cotaV(Y(rbSup), xR, Y(-rbInf), xR, xd, C(o.agujero + o.chaveta.t2));
  }
  if (hayCubo) {
    xd += 8;
    cotaV(Y(rh), xR, Y(-rh), xR, xd, `Ø${C(o.dCubo)}`);
  }

  // Arriba: cadena de dientes y ranuras, luego dentado + cubos, luego total
  let yd = yTop - 7;
  // Las líneas auxiliares salen del cubo en los extremos con cubo, y de la punta del diente en el resto
  const yObj = (x: number) => ((x < 1e-6 && a > 0) || (x > T - 1e-6 && b > 0) ? Y(rh) : yTop);
  if (n > 1) {
    // Dientes y separaciones; si los textos no caben, se alternan a dos alturas
    const cadena: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const x0 = a + i * o.pt;
      cadena.push([x0, x0 + o.bf1]);
      if (i < n - 1) cadena.push([x0 + o.bf1, x0 + o.pt]);
    }
    const apretado = cadena.some(([x0, x1]) => !cabe(C(x1 - x0), (x1 - x0) * s));
    cadena.forEach(([x0, x1], i) => cotaH(X(x0), yTop, X(x1), yTop, yd, C(x1 - x0), apretado && i % 2 ? "alto" : "centro"));
    yd -= apretado ? 11 : 8;
  }
  const tramos: [number, number][] = [];
  if (a > 0) tramos.push([0, a]);
  tramos.push([a, a + W]);
  if (b > 0) tramos.push([a + W, T]);
  tramos.forEach(([x0, x1], i) => {
    const s1 = C(x1 - x0);
    const pos = cabe(s1, (x1 - x0) * s) ? "centro" : i === tramos.length - 1 ? "der" : "alto";
    cotaH(X(x0), yObj(x0), X(x1), yObj(x1), yd, s1, pos);
  });
  if (tramos.length > 1) {
    yd -= 8;
    cotaH(X(0), yObj(0), X(T), yObj(T), yd, C(T));
  }

  // Profundidad de las ranuras entre hileras (en la primera ranura, si el texto cabe; si no, va en la tabla)
  if (n > 1) {
    const x1 = a + o.bf1, x2 = a + o.pt;
    const prof = C(ra - rg);
    if ((x2 - x1) * s >= 5 && cabe(prof, (ra - rg) * s)) {
      const xm = X((x1 + x2) / 2) + 1.3;
      linea([X(x1) + 0.5, yTop], [X(x2) - 0.5, yTop], "fino");
      cotaV(yTop, xm, Y(rg), xm, xm, prof, false);
    }
  }

  // ── Tabla de datos, notas y rótulo (columna derecha) ──
  const tx0 = 210, tx1 = HOJA.ancho - HOJA.margen - 3, tc = 244;
  let ty = 16;
  const fila = (etq: string, val: string, alto = 6) => {
    ents.push({ t: "poli", pts: [[tx0, ty], [tx1, ty], [tx1, ty + alto], [tx0, ty + alto]], cerrado: true, e: "fino" });
    linea([tc, ty], [tc, ty + alto], "fino");
    texto(tx0 + 1.5, ty + alto - 1.8, etq, 2.5, { ancla: "start" });
    texto(tc + 1.5, ty + alto - 1.8, val, 2.5, { ancla: "start", negrita: true });
    ty += alto;
  };
  const pasoTxt = o.medida.includes('"') ? `${o.medida.split(" x ")[0]} (${C(o.p)})` : C(o.p);
  fila(t.z, String(o.z));
  fila(t.paso, pasoTxt);
  fila(t.rodillo, C(o.d1));
  fila(t.norma, `${o.normaTxt} · ${o.codigo}`);
  fila(t.hileras, t.hil[n]);
  ty += 3;
  fila(t.dp, C(o.dp));
  fila(t.de, C(o.de));
  fila(t.rango, `${C(o.deMin)} – ${C(o.deMax)}`);
  fila(t.df, C(o.df));
  fila(`${t.mc}${o.z % 2 ? ` ${t.impar}` : ""}`, C(o.dCalibre));
  if (n > 1) fila(t.ranura, `${C(2 * rg)} (${t.prof} ${C(ra - rg)})`);

  // Notas
  ty += 7;
  const notas: string[] = [
    `${t.cantidad}: ${o.cantidad}`,
    `${t.material}: ${o.material}`,
    `${t.tratamiento}: ${o.tratamiento}`,
    `${t.agujero}: Ø${C(o.agujero)}${o.tolAgujero ? ` ${o.tolAgujero}` : ""}`,
  ];
  if (o.chaveta) notas.push(t.chavetero(o.chaveta.b, o.chaveta.ajuste, C(o.chaveta.t2), C(o.agujero + o.chaveta.t2)));
  if (mPris) {
    const dist = C(b > 0 ? b / 2 : a / 2);
    notas.push(o.chaveta ? t.prisionero(mPris, dist) : t.prisioneroSin(mPris, dist));
  }
  notas.push(t.unaPieza, t.cotas(o.u === "mm" ? t.mm : t.pulg));
  for (const nota of notas) {
    for (const parte of partir(nota, 44)) {
      texto(tx0, ty, parte, 2.5, { ancla: "start" });
      ty += 4;
    }
    ty += 0.8;
  }

  // Rótulo
  const ry0 = 172, ry1 = HOJA.alto - HOJA.margen;
  ents.push({ t: "poli", pts: [[tx0, ry0], [HOJA.ancho - HOJA.margen, ry0], [HOJA.ancho - HOJA.margen, ry1], [tx0, ry1]], cerrado: true, e: "grueso" });
  texto(tx0 + 2, ry0 + 6, t.titulo(o.codigo, o.z, n), 3.2, { ancla: "start", negrita: true });
  linea([tx0, ry0 + 9], [HOJA.ancho - HOJA.margen, ry0 + 9], "fino");
  texto(tx0 + 2, ry0 + 14, `${t.ref}: ${o.referencia || "—"}`, 2.5, { ancla: "start" });
  texto(tx0 + 2, ry0 + 19.5, `${t.fecha}: ${o.fecha}`, 2.5, { ancla: "start" });
  texto(tx0 + 2, ry0 + 25, `${t.escala} ${escalaTxt} · ${t.hoja}`, 2.5, { ancla: "start" });
  texto(HOJA.ancho - HOJA.margen - 2, ry0 + 25, "pinonario.com", 2.5, { ancla: "end", negrita: true });

  // Marco y pie
  const m = HOJA.margen;
  ents.push({ t: "poli", pts: [[m, m], [HOJA.ancho - m, m], [HOJA.ancho - m, HOJA.alto - m], [m, HOJA.alto - m]], cerrado: true, e: "grueso" });
  linea([tx0 - 3, m], [tx0 - 3, HOJA.alto - m], "fino");
  texto(m + 2, HOJA.alto - m - 2, t.gen, 2, { ancla: "start" });

  return { ancho: HOJA.ancho, alto: HOJA.alto, escala: s, escalaTxt, ox, oy, ents };
}

/** SVG de la hoja completa (fondo blanco, en mm), para la vista previa y para imprimir o guardar como PDF. */
export function svgPlano(pl: Plano): string {
  const f = (n: number) => +n.toFixed(3);
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const trazo: Record<Estilo, string> = {
    grueso: 'stroke="#000" stroke-width="0.5"',
    fino: 'stroke="#000" stroke-width="0.18"',
    achura: 'stroke="#000" stroke-width="0.15"',
    eje: 'stroke="#000" stroke-width="0.18" stroke-dasharray="8 1.2 1.2 1.2"',
  };
  const out: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.ancho} ${pl.alto}" width="${pl.ancho}mm" height="${pl.alto}mm" font-family="Arial, Helvetica, sans-serif">`,
    `<rect width="${pl.ancho}" height="${pl.alto}" fill="#fff"/>`,
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round">`,
  ];
  for (const e of pl.ents) {
    if (e.t === "linea") out.push(`<line x1="${f(e.x1)}" y1="${f(e.y1)}" x2="${f(e.x2)}" y2="${f(e.y2)}" ${trazo[e.e]}/>`);
    else if (e.t === "poli") out.push(`<${e.cerrado ? "polygon" : "polyline"} points="${e.pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" ${trazo[e.e]}/>`);
  }
  out.push(`</g><g fill="#000">`);
  for (const e of pl.ents) {
    if (e.t === "flecha") out.push(`<polygon points="${e.pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}"/>`);
    else if (e.t === "texto") {
      const rot = e.rot ? ` transform="rotate(${e.rot} ${f(e.x)} ${f(e.y)})"` : "";
      out.push(`<text x="${f(e.x)}" y="${f(e.y)}" font-size="${e.h}" text-anchor="${e.ancla ?? "start"}"${e.negrita ? ' font-weight="700"' : ""}${rot}>${esc(e.s)}</text>`);
    }
  }
  out.push(`</g></svg>`);
  return out.join("");
}

/** Parte un texto en líneas de hasta n caracteres, por palabras. */
function partir(s: string, n: number): string[] {
  const out: string[] = [];
  let lin = "";
  for (const w of s.split(" ")) {
    if (lin && (lin + " " + w).length > n) { out.push(lin); lin = w; } else lin = lin ? `${lin} ${w}` : w;
  }
  if (lin) out.push(lin);
  return out;
}

/** Segmentos de achurado a 45° dentro de los polígonos, sin pasar por los huecos. Coordenadas de hoja. */
function achurado(polis: [number, number][][], huecos: [number, number][][], paso: number): [[number, number], [number, number]][] {
  const todos = polis.flat();
  const cMin = Math.min(...todos.map(([x, y]) => x + y)), cMax = Math.max(...todos.map(([x, y]) => x + y));
  const dc = paso * Math.SQRT2;
  const cortes = (poli: [number, number][], c: number) => {
    const xs: number[] = [];
    for (let i = 0; i < poli.length; i++) {
      const [x1, y1] = poli[i], [x2, y2] = poli[(i + 1) % poli.length];
      const f1 = x1 + y1 - c, f2 = x2 + y2 - c;
      if (f1 > 0 !== f2 > 0) {
        const tt = f1 / (f1 - f2);
        xs.push(x1 + tt * (x2 - x1));
      }
    }
    return xs.sort((p, q) => p - q);
  };
  const segs: [[number, number], [number, number]][] = [];
  for (let c = Math.ceil(cMin / dc) * dc + 1e-7; c < cMax; c += dc) {
    for (const poli of polis) {
      const xs = cortes(poli, c);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        let tramos: [number, number][] = [[xs[i], xs[i + 1]]];
        for (const h of huecos) {
          const hx = cortes(h, c);
          for (let j = 0; j + 1 < hx.length; j += 2) {
            tramos = tramos.flatMap(([u, v]) => {
              const r: [number, number][] = [];
              if (hx[j] > u) r.push([u, Math.min(v, hx[j])]);
              if (hx[j + 1] < v) r.push([Math.max(u, hx[j + 1]), v]);
              return r.filter(([p, q]) => q - p > 1e-6);
            });
          }
        }
        for (const [u, v] of tramos) segs.push([[u, c - u], [v, c - v]]);
      }
    }
  }
  return segs;
}
