// Cloudflare Pages: redirige pinonario.pages.dev y www.pinonario.com al dominio principal (301),
// para que los buscadores vean un solo sitio. Las vistas previas (*.pinonario.pages.dev) no se tocan.
const PRINCIPAL = "pinonario.com";
const ALIAS = new Set(["pinonario.pages.dev", "www.pinonario.com"]);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (ALIAS.has(url.hostname)) {
    url.hostname = PRINCIPAL;
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
