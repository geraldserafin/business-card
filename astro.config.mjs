import { defineConfig } from "astro/config";

// Strona stoi pod /business-card/ na GitHub Pages. Adresy muszą zostać takie
// same jak w wydrukowanych kodach QR: /business-card/ i /business-card/general/.
export default defineConfig({
  site: "https://geraldserafin.github.io",
  base: "/business-card",
  trailingSlash: "always",
  build: { format: "directory" },
});
