/** Sitio 100% estático: se publica gratis en Cloudflare Pages / Vercel / GitHub Pages. */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
