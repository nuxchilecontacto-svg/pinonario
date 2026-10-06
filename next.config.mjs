/** Sitio 100% estático: se publica gratis en Cloudflare Pages / Vercel / GitHub Pages. */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { globalNotFound: true }, // 404 propia con dos layouts raíz (es / en)
};

export default nextConfig;
