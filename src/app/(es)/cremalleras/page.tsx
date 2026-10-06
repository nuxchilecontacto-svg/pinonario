import type { Metadata } from "next";
import { alternativas } from "@/lib/idioma";
import { CalcCremallera } from "@/components/CalcCremallera";

export const metadata: Metadata = {
  title: { absolute: "Calculadora de Cremalleras por Módulo: Paso, Largo y DXF" },
  description:
    "Módulo y largo: paso, número de dientes, altura al primitivo, avance por vuelta del piñón y DXF de la barra para cortar o fresar. ISO 53 o DP.",
  alternates: alternativas("/cremalleras/", "/en/racks/", "es"),
};

export default function Cremalleras() {
  return (
    <>
      <div className="intro">
        <span className="ceja">Cremalleras</span>
        <h1>Calculadora de cremalleras</h1>
        <p>Del módulo y el largo que necesitas: dientes, paso exacto, alturas, la posición del piñón y el DXF de la barra.</p>
      </div>
      <CalcCremallera />
      <section className="texto">
        <h2>Preguntas frecuentes</h2>
        <details open>
          <summary>¿Cuánto avanza una cremallera por cada vuelta del piñón?</summary>
          <p>Avance = π · módulo · dientes del piñón. Por ejemplo, módulo 2 y piñón de 20 dientes: 3,1416 × 2 × 20 = 125,66 mm por vuelta.</p>
        </details>
        <details>
          <summary>¿Cómo se ubica el piñón respecto de la cremallera?</summary>
          <p>
            El centro del piñón queda a una distancia de la base de la barra igual a la altura al primitivo (alto total − módulo) más el
            radio primitivo del piñón (módulo × dientes ÷ 2).
          </p>
        </details>
        <details>
          <summary>¿Cómo se unen dos tramos de cremallera?</summary>
          <p>
            Cada tramo debe medir un número entero de pasos y cortarse en el centro de un hueco. Al unirlos, use un trozo de cremallera
            como guía para que el paso se mantenga en la junta.
          </p>
        </details>
      </section>
    </>
  );
}
