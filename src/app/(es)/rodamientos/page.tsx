import type { Metadata } from "next";
import Link from "next/link";
import { BuscadorRodamientos } from "@/components/BuscadorRodamientos";
import { DatosApp } from "@/components/DatosApp";
import { TablaRodamientos } from "@/components/FichaRodamiento";
import { alternativas } from "@/lib/idioma";

export const metadata: Metadata = {
  title: { absolute: "Medidas de Rodamientos por Código o Pie de Metro, Gratis" },
  description:
    "Escribe el código (6205-2RS, 608ZZ…) o mide agujero, exterior y ancho: obtén gratis las medidas, qué significan los sufijos y las equivalencias por marca.",
  alternates: alternativas("/rodamientos/", "/en/bearings/", "es"),
};

export default function Rodamientos() {
  return (
    <>
      <DatosApp nombre="Buscador de medidas de rodamientos" descripcion={metadata.description as string} ruta="/rodamientos/" l="es" />
      <div className="intro">
        <span className="ceja">Rodamientos</span>
        <h1>Medidas de rodamientos por código</h1>
        <p>Escribe el código que trae grabado, o mide agujero, diámetro exterior y ancho con pie de metro, y sabrás qué rodamiento es y cómo pedirlo en cualquier marca.</p>
      </div>
      <BuscadorRodamientos />

      <section className="texto">
        <h2>Tabla de rodamientos rígidos de bolas</h2>
        <p>Medidas en mm: d = agujero, D = diámetro exterior, B = ancho. Toca un código para ver su ficha con versiones y equivalencias.</p>
        <TablaRodamientos l="es" />

        <h2>Preguntas frecuentes</h2>
        <details open>
          <summary>¿Cómo saber el agujero de un rodamiento por su número?</summary>
          <p>
            En los rodamientos de 4 dígitos, los dos últimos multiplicados por 5 dan el agujero en mm: 6205 → 05 × 5 = 25 mm. Las
            excepciones son 00 = 10 mm, 01 = 12 mm, 02 = 15 mm y 03 = 17 mm. En los miniatura de 3 dígitos, el último es el
            agujero: 608 = 8 mm.
          </p>
        </details>
        <details>
          <summary>¿Qué diferencia hay entre 2RS y ZZ?</summary>
          <p>
            ZZ (o 2Z) son tapas metálicas: protegen del polvo grueso y no rozan, por lo que aguantan más rpm. 2RS (DDU, LLU, 2RSH
            según la marca) son sellos de goma que tocan el aro interior: protegen mejor del polvo fino y del agua, con algo más de roce.
          </p>
        </details>
        <details>
          <summary>¿Qué significa C3?</summary>
          <p>
            Que el rodamiento tiene un juego interno mayor que el normal. Se usa cuando el ajuste en el eje es apretado o la
            temperatura de trabajo es alta, por ejemplo en motores eléctricos. Si el original es C3, el repuesto también debe serlo.
          </p>
        </details>
        <details>
          <summary>¿Un 6205 SKF es igual a un 6205 NSK o NTN?</summary>
          <p>
            Las medidas sí: d, D y B están normalizadas (ISO 15) y son idénticas en todas las marcas. Lo que cambia es la designación
            de sellos y tapas, y pueden variar la capacidad de carga, la grasa o el ruido. La tabla de equivalencias de cada ficha
            muestra cómo se pide la misma versión en cada marca.
          </p>
        </details>
        <details>
          <summary>¿Qué chaveta lleva el eje?</summary>
          <p>Usa la <Link href="/chavetas/">calculadora de chavetas DIN 6885</Link>: con el diámetro del eje te da la chaveta y el chavetero con tolerancias.</p>
        </details>
      </section>
    </>
  );
}
