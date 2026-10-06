import type { Metadata, Viewport } from "next";
import { Esqueleto } from "@/components/Esqueleto";
import { SITIO } from "@/lib/sitio";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: "Sprocket Calculator: Every Dimension, No Catalog Needed",
    template: `%s | ${SITIO.nombre}`,
  },
  description:
    "Free sprocket calculator: pitch, outside and bottom diameter, caliper and over-pin size, hub, tooth width and DXF for cutting. ANSI and ISO, inch or mm.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITIO.nombre,
    title: "Sprocket Calculator: Every Dimension, No Catalog Needed",
    description: "Pick the chain and tooth count: every sprocket dimension plus a DXF for cutting. ANSI and ISO, inch and mm. Free.",
    images: [{ url: "/img/pinon.jpg", width: 760, height: 570 }],
  },
  verification: { google: ["LeXq9zOw8soEpK4bv8jos1elTcCdE82V7t6vllzq5QY", "3-mqe_6EDN8KwlzHvSTPxtr8etZJHlk2NJ179r6gt2A"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121417",
};

export default function LayoutEn({ children }: { children: React.ReactNode }) {
  return <Esqueleto l="en">{children}</Esqueleto>;
}
