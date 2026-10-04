import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CADENAS, cadenaPorId, nombreCadena } from "@/lib/cadenas";
import { calcularPinon } from "@/lib/calculo";
import { largo } from "@/lib/formato";

const Z_TABLA = Array.from({ length: 113 }, (_, i) => i + 8); // Z 8 a 120

export function generateStaticParams() {
  return CADENAS.map((c) => ({ cadena: c.id }));
}

type Props = { params: Promise<{ cadena: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = cadenaPorId((await params).cadena);
  if (!c) return {};
  // Gancho con un dato real: el Z20 de esa cadena
  const z20 = calcularPinon(c, 20);
  const L = (n: number) => largo(n, "mm");
  return {
    title: { absolute: `Tabla Piñón ${c.codigo} ${c.medida}: Z8 a Z120 Listo para Tornear` },
    description: `¿Piñón ${c.codigo} de 20 dientes? Dp ${L(z20.dp)} mm y De ${L(z20.deRec)} mm. Aquí tienes Z8 a Z120 con diámetros, medida de control y cubo máximo, sin hojear catálogos.`,
    alternates: { canonical: `/tablas/${c.id}/` },
  };
}

export default async function TablaCadena({ params }: Props) {
  const c = cadenaPorId((await params).cadena);
  if (!c) notFound();
  const filas = Z_TABLA.map((z) => calcularPinon(c, z, 1));
  const L = (n: number) => largo(n, "mm");

  return (
    <div className="pagina">
      <p className="miga no-print"><Link href="/tablas/">Tablas</Link> / {c.codigo}</p>
      <h1>Tabla de piñones {c.medida} — {c.codigo}{c.equivalente ? ` (${c.equivalente})` : ""}</h1>
      <p className="sub">
        Cadena {c.norma === "ISO" ? "europea ISO 606 / DIN 8187" : "americana ANSI B29.1 (ASA)"} · paso {L(c.p)} mm ·
        rodillo Ø {L(c.d1)} mm · ancho interior {L(c.b1)} mm · ancho de diente simple {L(calcularPinon(c, 20).bf1)} mm.
        Medidas en mm. Toca una fila para abrirla en la calculadora (doble, triple, pulgadas, material).
      </p>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>Z</th>
              <th title="Diámetro primitivo">Dp</th>
              <th title="Diámetro exterior torneado">De</th>
              <th title="Diámetro de fondo">Df</th>
              <th title="Medida con pie de metro">Mc</th>
              <th title="Diámetro máximo de cubo">Cubo máx</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((r) => (
              <tr key={r.z}>
                <td><Link href={`/?c=${c.id}&z=${r.z}`}>{r.z}</Link></td>
                <td>{L(r.dp)}</td>
                <td>{L(r.deRec)}</td>
                <td>{L(r.df)}</td>
                <td>{L(r.dCalibre)}</td>
                <td>{r.dCuboMax > 0 ? L(r.dCuboMax) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aviso">Dp = p / sen(180°/Z) · De = {c.norma === "ISO" ? "práctica europea dentro del rango ISO 606" : "p·(0,6 + cot(180°/Z))"} · Df = Dp − Ø rodillo · Mc = Df (Z par) o Dp·cos(90°/Z) − Ø rodillo (Z impar).</p>
      <p className="aviso">Ver también: {CADENAS.filter((o) => o.p === c.p && o.id !== c.id).map((o) => (
        <Link key={o.id} href={`/tablas/${o.id}/`}>{nombreCadena(o)}</Link>
      ))}</p>
    </div>
  );
}
