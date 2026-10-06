import type { Metadata } from "next";
import { alternativas } from "@/lib/idioma";
import { Identificador } from "@/components/Identificador";

export const metadata: Metadata = {
  title: { absolute: "¿Qué Cadena o Piñón Tengo? Identifícalo con Pie de Metro" },
  description:
    "¿Piñón gastado y sin marca? Cuenta dientes, mide con pie de metro y descubre si es 08B o ASA 40, su paso y cuánto está estirada tu cadena.",
  alternates: alternativas("/identificar/", "/en/identify/", "es"),
  openGraph: {
    title: "¿Qué Cadena o Piñón Tengo? Identifícalo con Pie de Metro",
    description: "Identifica cadenas y piñones de rodillos (ISO y ASA) con tres medidas de pie de metro.",
    images: [{ url: "/img/taller-pinon-simple.jpg", width: 570, height: 760 }],
  },
};

export default function Identificar() {
  return (
    <>
      <div className="intro">
        <span className="ceja">Identificador</span>
        <h1>¿Qué cadena o piñón tengo?</h1>
        <p>Para piezas gastadas o sin marca: con un pie de metro y contando dientes, te decimos la cadena, si es europea o americana, y si ya está para cambio.</p>
      </div>
      <Identificador />

      <section className="texto">
        <h2>Preguntas frecuentes</h2>
        <details open>
          <summary>¿Cómo sé si mi cadena es europea (08B) o americana (ASA 40)?</summary>
          <p>
            Tienen el mismo paso (1/2"), pero el rodillo es distinto: 8,51 mm en la 08B y 7,92 mm en la ASA 40. Mide el rodillo con pie de
            metro; esa diferencia de 0,6 mm se nota bien. En el piñón, la diferencia aparece en la medida de fondo a fondo.
          </p>
        </details>
        <details>
          <summary>¿Por qué medir el paso sobre varios eslabones?</summary>
          <p>
            Un error de 0,1 mm en un solo paso es casi 1 % del paso de 1/2". Midiendo 10 pasos, el mismo error se reparte entre 10 y la
            medida es diez veces más precisa. Además así se ve el estiramiento real de la cadena.
          </p>
        </details>
        <details>
          <summary>¿Cuándo hay que cambiar la cadena?</summary>
          <p>
            Cuando se estira más de 2 a 3 % respecto del paso nominal. Con más estiramiento, la cadena se sube en los dientes, salta y
            gasta los piñones. Lo correcto es cambiar cadena y piñones juntos si los dientes ya tienen forma de gancho.
          </p>
        </details>
        <details>
          <summary>¿Por qué el fondo es más confiable que las puntas?</summary>
          <p>
            Las puntas de los dientes se gastan y además cada fabricante las tornea a un diámetro algo distinto dentro de la norma. El fondo
            del diente casi no se desgasta y su medida está fija por la norma: diámetro primitivo menos el rodillo.
          </p>
        </details>
      </section>
    </>
  );
}
