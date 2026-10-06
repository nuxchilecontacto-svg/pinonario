import type { Metadata } from "next";
import { alternativas } from "@/lib/idioma";
import Link from "next/link";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Qué datos recoge ${SITIO.nombre} (casi ninguno) y cómo se usan.`,
  alternates: alternativas("/privacidad/", "/en/privacy/", "es"),
};

export default function Privacidad() {
  return (
    <article className="guia">
      <span className="ceja">Legal</span>
      <h1>Política de privacidad</h1>
      <p className="guia-meta">Última actualización: octubre de 2026</p>
      <div className="guia-cuerpo">
        <p className="entrada">
          {SITIO.nombre} ({SITIO.url.replace("https://", "")}) es un sitio de herramientas de cálculo gratuitas, operado por la
          maestranza Ingema, Chile. No pedimos registro y no guardamos lo que calculas.
        </p>

        <h2>Lo que calculas se queda en tu equipo</h2>
        <p>
          Todos los cálculos y los archivos DXF se generan en tu navegador. Las medidas que ingresas no se envían a nuestros
          servidores. Si compartes un enlace con los parámetros (por ejemplo <code>?c=08b&amp;z=20</code>), esos datos quedan solo en el enlace.
        </p>

        <h2>Preferencias en tu navegador</h2>
        <p>
          Guardamos en el almacenamiento local de tu navegador (<i>localStorage</i>) solo tu elección de tema claro u oscuro. No es una
          cookie de seguimiento y puedes borrarla desde la configuración de tu navegador.
        </p>

        <h2>Estadísticas de visitas</h2>
        <p>
          Usamos <b>Cloudflare Web Analytics</b> para saber cuántas personas visitan cada página. Este servicio no usa cookies, no
          identifica a las personas y no sigue tu actividad en otros sitios. Nuestro proveedor de hosting, Cloudflare, procesa
          además datos técnicos de conexión (como la dirección IP) para entregar el sitio y protegerlo de ataques.
        </p>

        <h2>Correos que nos envías</h2>
        <p>
          Si nos escribes a {SITIO.correo}, usamos tu dirección y tu mensaje solo para responderte. No los compartimos ni los usamos
          para publicidad.
        </p>

        <h2>Publicidad</h2>
        <p>
          Actualmente el sitio no muestra publicidad. Si en el futuro incorporamos anuncios (por ejemplo de Google AdSense), estos
          proveedores podrían usar cookies para mostrar anuncios; actualizaremos esta política antes de hacerlo y pediremos tu
          consentimiento cuando corresponda.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes pedirnos en cualquier momento acceder, corregir o eliminar los datos que nos hayas enviado por correo, conforme a la
          Ley N° 19.628 sobre protección de la vida privada de Chile. Escríbenos desde la página de <Link href="/contacto/">contacto</Link>.
        </p>
      </div>
    </article>
  );
}
