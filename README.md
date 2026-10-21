# Taha Erkin Tunalı — Engineering in Motion

GitHub Pages için hazırlanmış 3D mühendislik portfolyosu.

## Codespaces ile tek ZIP yükleme

1. Bu ZIP'i `tahaerkintunali-coder/TahaErkinTunali` deposunun Codespaces dosya alanına yükleyin.
2. Terminalde çalıştırın:

```sh
unzip -o Taha-CV-GitHub-Pages-Hazir.zip
bash YAYINLA.sh
```

3. GitHub deposunda Settings → Pages → Source: Deploy from a branch → Branch: main → Folder: /docs → Save.

Adres: https://tahaerkintunali-coder.github.io/TahaErkinTunali/

`docs/` hazır yayın dosyalarıdır; ilk yayın için kurulum veya derleme gerekmez. YAYINLA.sh doğru depoyu ve main dalını denetler, yalnızca bu projenin dosyalarını kaydeder ve normal git push kullanır. ZIP, node_modules, ortam dosyaları ve yerel derleme önbelleği depoya eklenmez.

## Geliştirme

Node.js 22.13+ ile:

```sh
npm ci
npm run dev
```

Güncelleme sonrası:

```sh
npm run build:pages
bash YAYINLA.sh
```

3D valvetrain, kariyer çizelgesi, proje/yayın kartları, dört sayfalı CV önizlemesi ve CV indirme korunmuştur. İletişim formu ziyaretçinin e-posta uygulamasında taslak açar. Telefon numarası eklenmemiştir.

Derleme, TypeScript ve statik dosya bağlantıları kontrol edildi. GitHub Pages yayını henüz etkinleştirilmedi; tarayıcı etkileşim testi yapılmadı.

Görsel kaynakları ve atıflar: ASSET_SOURCES.md
