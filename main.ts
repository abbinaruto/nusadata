// NusaData entrypoint (Node 22, standard library only).
// Hands the site in: copies this repository's app/ and screenshots/ to
// /output and writes /output/dossier.json with the vendored make.fun
// library, exactly as the gate rebuilds it. Outside the grader,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The site itself is plain static files under app/: index.html plus its
// own modules and stylesheet, no build step and no network request.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Copy the site and its screenshots into the output directory.
mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// Write the dossier the judge reads. The caps mirror the gate: at most
// 4 screenshots of 256 KiB each, app/ at most 993 files and 16 MiB,
// dossier text at most 160 KiB.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
