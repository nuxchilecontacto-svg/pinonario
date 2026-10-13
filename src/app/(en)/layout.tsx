import type { Metadata, Viewport } from "next";
import { Esqueleto } from "@/components/Esqueleto";
import { SITIO } from "@/lib/sitio";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: "Free Sprocket Calculator: Every Dimension in Seconds",
    template: `%s | ${SITIO.nombre}`,
  },
  description:
    "Skip the paper catalog: pick ANSI or ISO, pitch and tooth count and get pitch, outside and bottom diameter, hub, tooth width and a DXF for cutting. Free.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITIO.nombre,
    title: "Free Sprocket Calculator: Every Dimension in Seconds",
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
