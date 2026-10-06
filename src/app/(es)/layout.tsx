import type { Metadata, Viewport } from "next";
import { Esqueleto } from "@/components/Esqueleto";
import { SITIO } from "@/lib/sitio";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: "Calculadora de Piñones para Cadena: Olvida el Catálogo",
    template: `%s | ${SITIO.nombre}`,
  },
  description:
    "¿Aún buscas medidas en un catálogo de papel? Elige paso y Z y obtén Dp, De, Df, cubo, ancho de diente y material de corte. ISO y ASA, mm y pulgadas. Gratis.",
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: SITIO.nombre,
    title: "Calculadora de Piñones para Cadena: Olvida el Catálogo",
    description: "Elige paso y Z: todas las medidas del piñón al instante. ISO y ASA, mm y pulgadas. Gratis.",
    images: [{ url: "/img/pinon.jpg", width: 760, height: 570 }],
  },
  // Search Console (no quitar: Google la revisa periódicamente)
  // [pinonario.pages.dev, pinonario.com]
  verification: { google: ["LeXq9zOw8soEpK4bv8jos1elTcCdE82V7t6vllzq5QY", "3-mqe_6EDN8KwlzHvSTPxtr8etZJHlk2NJ179r6gt2A"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121417",
};

export default function LayoutEs({ children }: { children: React.ReactNode }) {
  return <Esqueleto l="es">{children}</Esqueleto>;
}
