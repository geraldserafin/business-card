import { defineConfig } from "astro/config";

// Strona stoi na własnej domenie (GitHub Pages, custom domain). Stare adresy
// geraldserafin.github.io/business-card/ GitHub przekierowuje na nią sam.
export default defineConfig({
  site: "https://geraldserafin.com",
  trailingSlash: "always",
  build: { format: "directory" },
});
