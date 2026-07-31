// check-og.mjs — CI guard for redesign brief §critical-1.
// Fails if any og:image / og:url / twitter:image meta resolves to localhost,
// so the broken-social-preview bug can never ship again.
//
// Usage:
//   node scripts/check-og.mjs [baseUrl]
//   (baseUrl defaults to $CHECK_URL or http://localhost:3000 — in CI point it
//    at the Vercel preview URL after `next start` or against the deploy.)

const base = (process.argv[2] || process.env.CHECK_URL || "http://localhost:3000").replace(/\/$/, "");
const routes = ["/", "/wire", "/election-lens"];

const offenders = [];
for (const route of routes) {
  try {
    const res = await fetch(base + route, { headers: { "user-agent": "tsr-og-check" } });
    const html = await res.text();
    const metas = html.match(/<meta[^>]+>/gi) || [];
    for (const m of metas) {
      const isSocial = /(property|name)=["'](og:image|og:image:url|og:url|twitter:image)["']/i.test(m);
      if (isSocial && /localhost/i.test(m)) offenders.push(`${route}  ${m.trim()}`);
    }
  } catch (err) {
    console.error(`! could not fetch ${base}${route}: ${err.message}`);
  }
}

if (offenders.length) {
  console.error("❌  localhost found in social meta tags:\n" + offenders.map((o) => "   " + o).join("\n"));
  process.exit(1);
}
console.log(`✓  no localhost in og/twitter meta across: ${routes.join(", ")}  (base ${base})`);
