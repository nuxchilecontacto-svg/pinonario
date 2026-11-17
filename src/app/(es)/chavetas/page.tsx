import type { Metadata } from "next";
import Link from "next/link";
import { CalcChavetas } from "@/components/CalcChavetas";
import { DatosApp } from "@/components/DatosApp";
import { TablaAnsi, TablaDin } from "@/components/TablasChavetas";
import { alternativas } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Chavetas DIN 6885: Medidas y Chavetero por Eje, Gratis" },
  description:
    "Ingresa el diámetro del eje y obtén gratis la chaveta DIN 6885, el ancho y la profundidad del chavetero en eje y cubo con tolerancias y el par que aguanta.",
  alternates: alternativas("/chavetas/", "/en/keyways/", "es"),
};

export default function Chavetas() {
  return (
    <>
      <DatosApp nombre="Calculadora de chavetas DIN 6885" descripcion={metadata.description as string} ruta="/chavetas/" l="es" />
      <div className="intro">
        <span className="ceja">Chavetas y chaveteros</span>
        <h1>Calculadora de chavetas DIN 6885</h1>
        <p>Del diámetro del eje: la chaveta que corresponde, el chavetero en el eje y en el cubo con sus tolerancias, y cuánto par aguanta.</p>
      </div>
      <CalcChavetas />

      <section className="texto">
        <h2>Tabla de chavetas DIN 6885 (hoja 1)</h2>
        <p>
          Chavetas paralelas de forma alta. t1 es la profundidad del chavetero en el eje y t2 en el cubo; en el taller se controla
          d − t1 en el eje y d + t2 en el cubo.
        </p>
        <TablaDin l="es" />
        <h2>Chavetas en pulgadas (ANSI B17.1)</h2>
        <TablaAnsi l="es" />

        <h2>Preguntas frecuentes</h2>
        <details open>
          <summary>¿Qué tolerancia lleva el ancho del chavetero?</summary>
          <p>
            Depende del ajuste. Normal: eje N9 y cubo JS9 (uso general). Apretado: P9 en eje y cubo (cargas alternadas o golpes).
            Deslizante: eje H9 y cubo D10, cuando el cubo debe moverse a lo largo del eje. La calculadora da las desviaciones en mm
            para el ancho que corresponda.
          </p>
        </details>
        <details>
          <summary>¿Cómo se mide la profundidad del chavetero?</summary>
          <p>
            No se mide desde el borde del chavetero sino desde el lado opuesto: en el eje se controla d − t1 y en el cubo d + t2, con
            pie de metro o micrómetro. Por ejemplo, eje de 30 mm con chaveta 8 × 7: d − t1 = 26 mm y d + t2 = 33,3 mm.
          </p>
        </details>
        <details>
          <summary>¿Qué largo de chaveta usar?</summary>
          <p>
            Como regla práctica, entre 1 y 1,5 veces el diámetro del eje, sin pasar el largo del cubo. Si el par transmisible no
            alcanza, se alarga la chaveta o se usan dos a 180°.
          </p>
        </details>
        <details>
          <summary>¿Qué chaveta lleva un piñón?</summary>
          <p>
            La que corresponde al diámetro del eje. En la <Link href="/">calculadora de piñones</Link>, el generador de planos agrega
            el chavetero DIN 6885 automáticamente según el agujero.
          </p>
        </details>
      </section>
    </>
  );
}
