import { cpSync, rmSync, writeFileSync } from "node:fs";
rmSync("docs", { recursive: true, force: true });
cpSync("out", "docs", { recursive: true });
writeFileSync("docs/.nojekyll", "");
console.log("GitHub Pages files are ready in docs/");
