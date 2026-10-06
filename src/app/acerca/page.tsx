import type { Metadata } from "next";
import Link from "next/link";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Acerca de",
  description: `${SITIO.nombre} nació en Ingema, una maestranza en Chile, para dejar de buscar medidas en catálogos de papel. Herramientas gratuitas para talleres.`,
  alternates: { canonical: "/acerca/" },
};

export default function Acerca() {
  return (
    <article className="guia">
      <span className="ceja">Acerca de</span>
      <h1>Hecho en una maestranza, para maestranzas</h1>
      <div className="guia-cuerpo">
        <p className="entrada">
          {SITIO.nombre} nació en <b>Ingema</b>, una maestranza en Chile donde fabricamos piñones, engranajes, ejes y piezas a
          medida.
        </p>
        <p>
          Para cotizar y fabricar un piñón había que buscar sus medidas en un catálogo de papel: la tabla según el paso,
          la fila según el número de dientes, y otra tabla si la cadena era europea o americana. Varias personas consultando el mismo
          libro gastado, con el riesgo de leer la fila equivocada.
        </p>
        <p>
          Nos dimos cuenta de que no éramos los únicos: el mismo problema lo tienen otras maestranzas, tornerías y equipos de
          mantenimiento. Así que en vez de digitalizar un catálogo, construimos herramientas que <b>calculan las medidas directamente
          desde las normas</b> (ISO 606, ANSI B29.1, ISO 53), para cualquier número de dientes y en mm o pulgadas.
        </p>

        <h2>Qué encontrarás aquí</h2>
        <ul>
          <li><Link href="/">Calculadora de piñones</Link> con dibujo y archivo DXF para corte.</li>
          <li><Link href="/transmision/">Largo de cadena</Link> y diseño de la transmisión.</li>
          <li><Link href="/identificar/">Identificador</Link> de cadenas y piñones con pie de metro.</li>
          <li><Link href="/engranajes/">Engranajes por módulo</Link> y <Link href="/cremalleras/">cremalleras</Link>.</li>
          <li><Link href="/guias/">Guías prácticas</Link> escritas desde el taller.</li>
        </ul>

        <h2>Cómo trabajamos</h2>
        <p>
          Las fórmulas siguen las normas internacionales y las contrastamos con catálogos de fabricantes y con piezas reales hechas en
          el taller. Aun así, cada fabricante tiene sus propias tolerancias: antes de fabricar, verifica las medidas con la cadena o el
          engranaje real.
        </p>
        <p>
          Las herramientas son y seguirán siendo <b>gratuitas</b>. Si encuentras un error, tienes una sugerencia o necesitas una
          herramienta que no está, <Link href="/contacto/">escríbenos</Link>.
        </p>
      </div>
    </article>
  );
}
