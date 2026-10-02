# DESIGN.md — Opung Sari Basah Bang 5.0

Dokumen identitas desain. Sumber kebenaran untuk keputusan visual. Baca sebelum menambah UI baru.

## Produk

Bank Sampah digital / platform eco-theology untuk madrasah (MTs) di Deli Serdang.
Pengguna: siswa, pengajar, dan pengelola bank sampah. Nuansa: hangat, membumi, terpercaya.

## Palet

Semua warna HARUS lewat token (didefinisikan di `src/index.css`), bukan utility palet mentah.

- **Primer: emerald/green** — identitas ekologis. Bukan gradasi biru-ungu khas AI.
  Token: `--primary: oklch(0.65 0.15 150)`. Pakai `bg-primary`, `text-primary`,
  `border-primary`; turunannya `--accent` dan `--secondary` (tint hijau).
- **Basis neutral** — permukaan `bg-background`, teks `text-foreground`, kartu
  `bg-card text-card-foreground`, teks sekunder `text-muted-foreground`, garis
  `border-border`. Bukan utility palet mentah (`bg-stone-100`, `text-stone-900`, dst).
- **Aturan aksen tunggal** — satu warna aksen untuk satu makna: hijau (`--primary`) =
  aksi/eco, merah (`--destructive`) = bahaya. Status lain (mis. peringatan) diturunkan
  dari token, bukan palette mentah. Jangan pakai banyak warna semantik sekaligus dalam
  satu layar.

## Tipografi

- **Plus Jakarta Sans** — body & heading UI. Dimuat via Google Fonts di `index.html`,
  dipetakan ke token `--font-sans` (dan `--font-heading = var(--font-sans)`).
- **Amiri** — teks Arab (ayat, dalil, doa). Dimuat via Google Fonts (400, 700).
- **font-mono** — stack sistem untuk data/angka/kode, bukan font dekoratif.
  Selalu bungkus teks Arab dengan class `.font-arabic`:
  ```css
  .font-arabic { font-family: "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif; }
  ```
  Class ini wajib dipakai untuk semua konten Arab agar override default serif konsisten.

## Motion

- Tidak ada loop dekoratif tanpa akhir. Animasi hanya dipicu aksi pengguna
  (klik, submit, perubahan status).
- Status dot statis — warna/pulse hanya berubah saat status benar-benar berubah.
- Hormati `prefers-reduced-motion`.

## Ikon

- Hanya `lucide-react`. Pilih ikon yang relevan dengan makna, bukan hiasan.
- Tanpa emoji dekoratif di UI.
- Konten Arab memakai `.font-arabic`.
- Ikon kategori sampah, item, destinasi penarikan, dan badge dipetakan terpusat di
  `src/lib/appIcons.tsx` (`WasteCategoryIcon`, `WasteItemIcon`, `DestinationIcon`,
  `BadgeIcon`) — JANGAN render ikon mentah atau emoji langsung dari data.

## Avatar

- Avatar pengguna memakai **DiceBear `open-peeps`** (kartun sketsa netral), via
  `StudentAvatar` di `src/lib/appIcons.tsx`. Seed = nama siswa, sehingga tiap pengguna
  punya karakter unik yang stabil (tidak berubah saat reload).
- Sumber: `https://api.dicebear.com/9.x/open-peeps/svg` (SVG, `loading="lazy"`, `alt` = nama).
- Ini dependensi jaringan eksternal; untuk mode offline penuh, ganti ke `@dicebear/core`
  yang dibundel lokal.

## Keputusan Anti-Slop

- **Tidak ada ambient blur orb** (blob gradasi mengambang) sebagai latar.
- **Glassmorphism hanya pada overlay modal** — bukan pada kartu, header, atau konten biasa.
- **Tidak ada panah/centang dekoratif** yang tidak punya fungsi.
- **Tidak ada uppercase eyebrow label** di atas judul.
- **Hindari** gradasi AI biru-ungu, glow berlebih, dan shadow berwarna acak.
