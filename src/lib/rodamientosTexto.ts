import type { Idioma } from "./idioma";
import { EQUIVALENCIAS, type Rodamiento, type Sufijos } from "./rodamientos";

/** Textos de rodamientos compartidos por el buscador (cliente) y las fichas (estáticas). */
export const TXR = {
  es: {
    tipo: "Rígido de bolas de una hilera",
    serie: (s: string, mini: boolean) =>
      mini ? `miniatura, serie ${s}` : `serie ${s} (${({ "618": "sección muy delgada", "619": "sección delgada", "60": "ligera", "62": "media, la más común", "63": "pesada" } as Record<string, string>)[s] ?? ""})`,
    d: "Agujero (d)", D: "Diámetro exterior (D)", B: "Ancho (B)",
    prot: {
      abierto: "Abierto: sin tapas ni sellos. Se lubrica con la grasa o el aceite de la máquina.",
      tapa1: "Tapa metálica en un lado (Z). Protege del polvo grueso sin roce; el otro lado queda abierto.",
      tapas2: "Tapas metálicas en ambos lados (2Z / ZZ). Vienen engrasados de por vida; protegen del polvo grueso sin roce, aptos para altas rpm.",
      sello1: "Sello de goma en un lado (RS). Mejor contra polvo fino y humedad; el otro lado queda abierto.",
      sellos2: "Sellos de goma en ambos lados (2RS / DDU / LLU). Engrasados de por vida; la mejor protección contra polvo fino y agua, con algo más de roce y menos rpm máximas que con tapas.",
    },
    juego: (j: string) =>
      ({
        C2: "C2: juego interno menor que el normal (para mayor precisión de giro).",
        CN: "CN: juego interno normal.",
        C3: "C3: juego interno mayor que el normal. Para ajustes apretados o temperatura elevada; muy común en motores eléctricos.",
        C4: "C4: juego interno bastante mayor que el normal (altas temperaturas o ajustes muy apretados).",
        C5: "C5: juego interno muy superior al normal (casos especiales).",
        CM: "CM: juego especial para motores eléctricos (designación de NSK y otras).",
      })[j] ?? `${j}: juego interno especial.`,
    ranura: { N: "N: ranura para anillo de retención en el aro exterior.", NR: "NR: ranura con el anillo de retención incluido." },
    precision: (p: string) => `${p}: precisión de fabricación superior a la normal.`,
    otros: (o: string) => `${o}: sufijo propio de la marca (jaula, grasa, ruido, etc.). Consulte su catálogo.`,
    marca: "Marca", conTapas: "Con tapas metálicas", conSellos: "Con sellos de goma",
    equivNota: "Designaciones habituales de cada fabricante; la medida es la misma en todas. Verifique en el catálogo de la marca.",
    pulg: "en pulgadas",
    leer: (r: Rodamiento, serie: string, cod: string, regla: string) =>
      regla === "directo"
        ? `${serie} = serie · ${cod} = agujero de ${r.d} mm (en los rodamientos miniatura el último dígito es el agujero).`
        : regla === "x5"
          ? `${serie} = serie · ${cod} × 5 = agujero de ${r.d} mm.`
          : `${serie} = serie · ${cod} = agujero de ${r.d} mm (códigos 00, 01, 02 y 03 equivalen a 10, 12, 15 y 17 mm).`,
  },
  en: {
    tipo: "Single row deep groove ball bearing",
    serie: (s: string, mini: boolean) =>
      mini ? `miniature, ${s} series` : `${s} series (${({ "618": "ultra-thin section", "619": "thin section", "60": "light", "62": "medium, the most common", "63": "heavy" } as Record<string, string>)[s] ?? ""})`,
    d: "Bore (d)", D: "Outside diameter (D)", B: "Width (B)",
    prot: {
      abierto: "Open: no shields or seals. Lubricated by the machine's grease or oil.",
      tapa1: "Metal shield on one side (Z). Keeps out coarse dirt with no drag; the other side is open.",
      tapas2: "Metal shields on both sides (2Z / ZZ). Greased for life; keep out coarse dirt with no drag, good for high rpm.",
      sello1: "Rubber seal on one side (RS). Better against fine dust and moisture; the other side is open.",
      sellos2: "Rubber seals on both sides (2RS / DDU / LLU). Greased for life; best protection against fine dust and water, with slightly more drag and lower max rpm than shields.",
    },
    juego: (j: string) =>
      ({
        C2: "C2: internal clearance smaller than normal (for higher running accuracy).",
        CN: "CN: normal internal clearance.",
        C3: "C3: internal clearance greater than normal. For tight fits or high temperature; very common in electric motors.",
        C4: "C4: internal clearance well above normal (high temperature or very tight fits).",
        C5: "C5: internal clearance far above normal (special cases).",
        CM: "CM: special clearance for electric motors (NSK and others).",
      })[j] ?? `${j}: special internal clearance.`,
    ranura: { N: "N: snap ring groove in the outer ring.", NR: "NR: snap ring groove with the snap ring included." },
    precision: (p: string) => `${p}: higher than normal precision class.`,
    otros: (o: string) => `${o}: manufacturer-specific suffix (cage, grease, noise, etc.). Check their catalog.`,
    marca: "Brand", conTapas: "With metal shields", conSellos: "With rubber seals",
    equivNota: "Usual designations of each manufacturer; the size is the same in all of them. Check the brand's catalog.",
    pulg: "in inches",
    leer: (r: Rodamiento, serie: string, cod: string, regla: string) =>
      regla === "directo"
        ? `${serie} = series · ${cod} = ${r.d} mm bore (on miniature bearings the last digit is the bore).`
        : regla === "x5"
          ? `${serie} = series · ${cod} × 5 = ${r.d} mm bore.`
          : `${serie} = series · ${cod} = ${r.d} mm bore (codes 00, 01, 02 and 03 mean 10, 12, 15 and 17 mm).`,
  },
};

/** Lista de explicaciones de los sufijos leídos. */
export function explicarSufijos(s: Sufijos, l: Idioma): string[] {
  const t = TXR[l];
  const out = [t.prot[s.proteccion]];
  if (s.juego) out.push(t.juego(s.juego));
  if (s.ranura) out.push(t.ranura[s.ranura]);
  if (s.precision) out.push(t.precision(s.precision));
  for (const o of s.otros) out.push(t.otros(o));
  return out;
}

/** Filas marca → (tapas, sellos) para la tabla de equivalencias. */
export const filasEquivalencias = () =>
  EQUIVALENCIAS.tapas2.map(([marca, tapas], i) => ({ marca, tapas, sellos: EQUIVALENCIAS.sellos2[i][1] }));

export const esMiniatura = (r: Rodamiento) => r.codigo.length === 3;
export const pulgadas = (mm: number) => (mm / 25.4).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
