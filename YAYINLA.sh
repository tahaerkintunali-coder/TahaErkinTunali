#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
remote="$(git remote get-url origin)"
case "$remote" in
  https://github.com/tahaerkintunali-coder/TahaErkinTunali|https://github.com/tahaerkintunali-coder/TahaErkinTunali.git|git@github.com:tahaerkintunali-coder/TahaErkinTunali.git) ;;
  *) echo "Yanlış depo. Taha hesabındaki TahaErkinTunali deposunun Codespaces ortamında çalıştırın."; exit 1 ;;
esac
if [ "$(git branch --show-current)" != "main" ]; then
  echo "Önce main dalına geçin: git switch main"; exit 1
fi
test -f docs/index.html
test -f docs/.nojekyll
git add -- app components data docs hooks lib public scripts .gitignore ASSET_SOURCES.md README.md YAYINLA.sh next-env.d.ts next.config.ts package.json package-lock.json postcss.config.mjs tsconfig.json
if ! git diff --cached --quiet; then
  git -c user.name="Taha Erkin Tunali" -c user.email="270698296+tahaerkintunali-coder@users.noreply.github.com" commit -m "Publish engineering portfolio for GitHub Pages"
fi
git push origin HEAD:main
echo "Dosyalar yüklendi. Settings > Pages > Deploy from a branch > main > /docs > Save seçin."
echo "Yayın adresi: https://tahaerkintunali-coder.github.io/TahaErkinTunali/"
