// ── HTML Dataset Hydration ────────────────────────────────────────────────────
// During generation Claude sees a truncated sample of each dataset (to avoid
// rate limits). It marks every data array it embeds with sentinel comments:
//
//   /*DASHY_DATA:dataset_name*/[...sample rows...]/*END_DASHY_DATA*/
//
// On save, hydrateHtml() replaces each marked array with the full dataset so
// the saved dashboard renders with all the real data.

const staticData  = require("./staticData");
const richData    = require("./mockData");

const ALL_DATA = { ...staticData, ...richData };

const SENTINEL_RE = /\/\*DASHY_DATA:(\w+)\*\/[\s\S]*?\/\*END_DASHY_DATA\*\//g;

function hydrateHtml(html) {
  if (!html || !html.includes("/*DASHY_DATA:")) return html;
  return html.replace(SENTINEL_RE, (_, key) => {
    const full = ALL_DATA[key];
    if (!full) return _;
    return `/*DASHY_DATA:${key}*/${JSON.stringify(full)}/*END_DASHY_DATA*/`;
  });
}

module.exports = { hydrateHtml };
