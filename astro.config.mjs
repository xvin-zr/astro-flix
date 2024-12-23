// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import deno from "@deno/astro-adapter";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  adapter: deno(),
});
