// Avisa a Bing (y demás buscadores IndexNow) de todas las URLs del sitemap publicado.
// Uso, después de que Cloudflare termine de publicar:  npm run indexnow
const HOST = "pinonario.pages.dev";
const KEY = "17057859ddb6db57496c1c25e960f266"; // archivo public/<KEY>.txt

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URLs → HTTP ${res.status} ${res.statusText}`);
if (!res.ok) console.log(await res.text());
