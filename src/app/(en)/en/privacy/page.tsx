import type { Metadata } from "next";
import Link from "next/link";
import { alternativas } from "@/lib/idioma";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `What data ${SITIO.nombre} collects (almost none) and how it is used.`,
  alternates: alternativas("/privacidad/", "/en/privacy/", "en"),
};

export default function Privacy() {
  return (
    <article className="guia">
      <span className="ceja">Legal</span>
      <h1>Privacy policy</h1>
      <p className="guia-meta">Last updated: October 2026</p>
      <div className="guia-cuerpo">
        <p className="entrada">
          {SITIO.nombre} ({SITIO.url.replace("https://", "")}) is a free calculation tool site operated by Ingema, a machine shop in
          Chile. There is no sign-up and we do not store what you calculate.
        </p>

        <h2>Your calculations stay on your device</h2>
        <p>
          All calculations and DXF files are generated in your browser. The values you enter are not sent to our servers. If you share a
          link with parameters (for example <code>?c=asa40&amp;z=20</code>), that data lives only in the link.
        </p>

        <h2>Preferences in your browser</h2>
        <p>
          We store only your light or dark theme choice in your browser&apos;s local storage (<i>localStorage</i>). It is not a tracking
          cookie and you can clear it from your browser settings.
        </p>

        <h2>Visit statistics</h2>
        <p>
          We use <b>Cloudflare Web Analytics</b> to count how many people visit each page. It uses no cookies, does not identify people and
          does not follow you across other sites. Our hosting provider, Cloudflare, also processes technical connection data (such as IP
          addresses) to deliver the site and protect it from attacks.
        </p>

        <h2>Emails you send us</h2>
        <p>If you write to {SITIO.correo}, we use your address and message only to reply. We don&apos;t share them or use them for advertising.</p>

        <h2>Advertising</h2>
        <p>
          The site currently shows no ads. If we add advertising in the future (for example Google AdSense), those providers may use cookies
          to serve ads; we will update this policy before doing so and ask for your consent where required.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us at any time to access, correct or delete any data you sent us by email, under Chilean Law No. 19,628 on the
          protection of private life and, where applicable, the laws of your country. Reach us from the <Link href="/en/contact/">contact page</Link>.
        </p>
      </div>
    </article>
  );
}
