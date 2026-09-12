# Product Requirement Document (PRD)
## Opung Sari Basah Bang 5.0 Web Platform

| Parameter | Detail |
| :--- | :--- |
| **Dokumen** | Product Requirement Document (PRD) |
| **Nama Produk** | Opung Sari Basah Bang 5.0 |
| **Kategori** | Web Platform & IoT Ingestion Service |
| **Target Rilis** | v1.0 (MVP) |
| **Wilayah Implementasi** | Kabupaten Deli Serdang, Sumatera Utara |
| **Status** | Approved / Ready for Development |

---

## 1. Executive Summary & Problem Statement

### 1.1 Latar Belakang & Konteks Lapangan
Berdasarkan data Sistem Informasi Pengelolaan Sampah Nasional (SIPSN, 2026), timbulan sampah harian di Kabupaten Deli Serdang mencapai **1.024 ton/hari**, dengan tingkat sampah yang belum terkelola optimal berada di angka **77,10%**. Pemerintah Kabupaten Deli Serdang sebelumnya telah menggagas program inovasi *"Opung Sari Basah Bang"* di lingkungan sekolah:
- **Opung Sari:** Operasi Pungut Sampah Setiap Hari (Pembiasaan perilaku / habituasi LISA - *Lihat Sampah Ambil*).
- **Basah:** Pengelolaan sampah berbasis Bank Sampah Sekolah.
- **Bang:** Pembinaan secara berjenjang.

### 1.2 Masalah yang Dihadapi (Problem Statement)
Meskipun fondasi pembiasaan sudah terbentuk, operasional di lapangan menghadapi kendala struktural:
1. **Pencatatan Manual yang Rentan:** Data timbangan fisik sampah dan konversi saldo kas kelas masih dicatat di buku konvensional, rentan hilang, salah hitung, serta minim transparansi.
2. **Ketiadaan Monitoring Real-Time:** Guru dan pengawas tidak memiliki visibilitas atas frekuensi pembuangan sampah maupun status keterisian tong sampah per kelas secara terpusat.
3. **Silo Data Antar-Sekolah:** Mekanisme "Pembinaan Berjenjang" belum optimal karena ketiadaan media komparasi kinerja dan pelaporan rutin yang transparan antar-sekolah di Deli Serdang.
4. **Potensi Ekonomi Sampah Terbatas:** Hasil karya daur ulang siswa sulit dipasarkan ke luar lingkungan kelas/sekolah.

### 1.3 Solusi Produk
Mengembangkan platform web **Opung Sari Basah Bang 5.0** yang mengintegrasikan telemetri perangkat pintar (*Smart Trash Can* IoT), sistem pencatatan transaksi bank sampah digital, modul dompet kas kelas, gamifikasi LISA (leaderboard & misi Adiwiyata), serta portal pelaporan terbuka antar-sekolah (pembinaan berjenjang). Fokus utama diarahkan pada 2 pilar tematik: Pendidikan Ekologis & Energi/Lingkungan Hidup.

---

## 2. User Personas & Role-Based Access Control (RBAC)

| Role | Identitas Persona | Kebutuhan Utama | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Siswa / Pengurus Kas Kelas** | Perwakilan kelas / bendahara kelas yang mengelola kebersihan dan kas. | Ingin memantau saldo kas kelas, mengajukan pencairan dana, melihat posisi kelas di papan peringkat, menyelesaikan misi Adiwiyata, dan belajar dari modul edukasi. | - Akses Dashboard Kelas<br>- Pengajuan Penarikan Saldo (*Payout Request*)<br>- Lihat Leaderboard & Misi Adiwiyata<br>- Akses Materi Edukasi 3R & Bank Sampah |
| **Koordinator Bank Sampah Sekolah** | Guru pembina atau petugas kebersihan yang bertugas saat jam setor sampah. | Membutuhkan antarmuka timbang-setor sampah yang cepat, akurat, dan validasi kas kelas tanpa selisih hitung. | - Input Transaksi Timbangan Sampah<br>- Verifikasi & Persetujuan Penarikan Saldo Kas<br>- Unggah & Pengesahan Laporan Bulanan Sekolah |
| **Kepala Sekolah / Admin Sekolah** | Pimpinan satuan pendidikan. | Mengawasi efektivitas program, audit kas sekolah, dan membandingkan performa kelas. | - Read-only Audit Finansial Sekolah<br>- Persetujuan Final Laporan Bulanan Sekolah<br>- Manajemen Akun Guru/Kelas di Sekolah |
| **Dinas Lingkungan Hidup / Dinas Pendidikan Deli Serdang** | Regulator & Pengawas Tingkat Kabupaten. | Mengagregasi metrik timbulan sampah sekolah, memantau tingkat kepatuhan pelaporan bulanan, dan audit transparansi. | - Akses Seluruh Laporan Lintas Sekolah<br>- Leaderboard Agregat Kabupaten<br>- Master Data Tarif Sampah (Rp/kg) Regional |

---

## 3. System Architecture & Information Architecture (IA)

### 3.1 Diagram Alur Sistem Terintegrasi
```text
┌────────────────────────┐
│ Smart Trash Can (IoT)  │
│ (ESP32 / Ultrasonic)   │
└───────────┬────────────┘
            │ Telemetri Volume & Frekuensi (HTTP POST / MQTT)
            ▼
┌────────────────────────┐      ┌─────────────────────────┐
│ Ingestion API Service  │      │ Timbangan Fisik Manual  │
└───────────┬────────────┘      └────────────┬────────────┘
            │                                │ Input Data Setor (Koordinator)
            ▼                                ▼
┌─────────────────────────────────────────────────────────┐
│               Core Backend Application                  │
│       (Business Logic, Auth, Ledger, Scoring)           │
└───────────────────────────┬─────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     PostgreSQL Database   │ │    Cloud Object Storage   │
│ (Relational Data, Ledger) │ │ (Foto Produk, PDF Laporan)│
└───────────────────────────┘ └───────────────────────────┘
              │                           │
              └─────────────┬─────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│               Web Frontend Application                  │
│  - Portal Siswa & Kas Kelas                             │
│  - Portal Koordinator & Input Timbangan                 │
│  - Portal Dinas & Benchmarking Terbuka                  │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Struktur Peta Situs (Sitemap)
1. **Laman Publik & Autentikasi**
   - Beranda / Edukasi Publik
   - Form Registrasi (Hierarkis: Sekolah > Kelas)
   - Form Login Multi-Role
2. **Dashboard Siswa / Kelas**
   - Overview Status Keterisian Tong Sampah IoT & FAB Setor Sampah Cepat
   - Dompet Kas Kelas & Formulir Penarikan Saldo
   - Riwayat Transaksi Setor Sampah
   - Modul Gamifikasi & Misi LISA Adiwiyata
   - Modul Edukasi (Artikel & Video Bank Sampah)
3. **Portal Operasional Koordinator**
   - Kasir / Input Timbangan Sampah
   - Manajemen Antrean Pencairan Saldo
   - Generator & Pengesahan Laporan Bulanan
4. **Modul Gamifikasi & Pembinaan Berjenjang**
   - Leaderboard Inter-Class (Tingkat Sekolah)
   - Leaderboard Inter-School (Tingkat Deli Serdang)
   - Repositori Laporan Bulanan Terbuka (Benchmarking Ekologis)

### 3.3 Technology Stack (PoC Phase vs Target)
**Fase PoC (Saat Ini):**
- **Frontend Framework:** React 19 + Vite (TypeScript).
- **Styling & UI:** Tailwind CSS v4 + shadcn/ui.
- **State Management:** React Context (Mocking database, IoT, dan ledger).
- **Package Manager:** npm.
- *Catatan:* Fokus pada interaktivitas UI dan alur sistem. Backend dan Database sesungguhnya belum diimplementasikan.

**Fase Target (Produksi):**
- **Backend:** Express / Node.js.
- **Database:** PostgreSQL.
- **IoT Target:** ESP32 via HTTP POST / MQTT.

---

## 4. Functional Requirements (FR)

### Modul 1: Autentikasi & Manajemen Akun
- **FR-AUTH-01:** Pengguna dapat mendaftar dengan memetakan entitas secara hierarkis (Kabupaten Deli Serdang $ightarrow$ Nama Sekolah $ightarrow$ Tingkat/Nama Kelas).
- **FR-AUTH-02:** Sistem menerapkan autentikasi berbasis role (RBAC) dengan sesi yang aman dan auto-logout setelah masa inaktif.
- **FR-AUTH-03:** Koordinator sekolah memiliki wewenang untuk mereset akun perwakilan kelas yang mengalami kendala akses.

### Modul 2: Dashboard Edukasi Ekologis
- **FR-EDU-01:** Menyajikan katalog modul edukasi berupa artikel panduan pemilahan 3R (Reuse, Reduce, Recycle) dan video teknik pengolahan sampah.
- **FR-EDU-02:** Menampilkan widget ringkasan dampak ekologis per kelas: total kg sampah terpilah, estimasi reduksi emisi karbon, dan konversi total nominal kas yang terkumpul.

### Modul 3: Integrasi Telemetri IoT (Smart Trash Can)
- **FR-IOT-01:** Menerima payload telemetri dari mikrokontroler tempat sampah kelas yang mencakup: `device_id`, `class_id`, `fill_percentage` (persentase volume), dan `event_counter` (frekuensi pembukaan tong sampah).
- **FR-IOT-02:** Visualisasi status tong sampah secara real-time pada dashboard kelas dengan indikator warna:
  - Hijau: Keterisian $< 50\%$
  - Kuning: Keterisian $50\% - 79\%$
  - Merah: Keterisian $\ge 80\%$ (Notifikasi otomatis butuh pengangkutan/pemilahan)
- **FR-IOT-03 (Anti-Spam Filter):** Menerapkan mekanisme debouncing data telemetri (pembukaan sensor dengan jeda kurang dari 30 detik dari pembukaan sebelumnya tidak dihitung sebagai penambahan frekuensi baru).
### Modul 4: Pencatatan Transaksi Bank Sampah & Kas Kelas
- **FR-BS-01 (Input Setoran):** Koordinator sekolah dapat mencatat setoran dengan memilih kelas, memilih jenis kategori sampah (Plastik PET, Kertas/Karton, Dupleks, Logam, Botol Kaca), dan memasukkan bobot timbangan aktual (kg). Tombol akses cepat (FAB "Setor Sampah") ditempatkan di tengah navigasi mobile untuk kemudahan operasional.
- **FR-BS-02 (Kalkulasi Otomatis):** Sistem menghitung nilai rupiah otomatis berdasarkan formula: `Total Nominal = Berat (kg) × Tarif Kategori Aktif (Rp/kg)`.
- **FR-BS-03 (Buku Besar Transparan):** Riwayat setoran tersimpan sebagai catatan mutasi kredit (*credit entry*) yang dapat dilihat oleh siswa perwakilan kelas kapan saja.
- **FR-BS-04 (Penarikan Kas / Payout):** Perwakilan kelas dapat mengajukan pencairan saldo kas kelas dengan menyertakan keterangan peruntukan (misal: kas kebersihan, pembelian tanaman hijau kelas). Pencairan berstatus *Pending* hingga diverifikasi dan disetujui koordinator secara fisik.

### Modul 5: Gamifikasi, Misi Adiwiyata & Leaderboard
- **FR-LEAD-01 (Leaderboard Antar-Kelas):** Menampilkan pemeringkatan kelas dalam satu sekolah berdasarkan akumulasi bobot sampah terpilah (70%) dan konsistensi frekuensi pembuangan teratur terverifikasi IoT (30%).
- **FR-LEAD-02 (Misi & Lencana LISA):** Sistem memberikan tantangan mingguan dan lencana Adiwiyata (misal: "Eco Ranger", "Pilah Master") untuk mendorong habituasi pemilahan sampah.
- **FR-LEAD-03 (Leaderboard Antar-Sekolah):** Menampilkan pemeringkatan sekolah se-Deli Serdang dalam volume reduksi sampah dan konsistensi sirkular ekonomi bank sampah (Pembinaan Berjenjang).

### Modul 6: Pelaporan Bulanan & Pembinaan Berjenjang
- **FR-REP-01 (Generator Laporan):** Sistem menyediakan template laporan bulanan otomatis yang mengompilasi total tonase sampah tereduksi, rekapitulasi finansial bank sampah, dan tingkat partisipasi kelas.
- **FR-REP-02 (Siklus Pengunggahan):** Koordinator sekolah wajib mengonfirmasi dan menerbitkan laporan bulanan paling lambat tanggal 5 pada siklus bulan berikutnya.
- **FR-REP-03 (Cross-School Benchmarking):** Setiap sekolah dan dinas terkait dapat mengunduh serta membaca laporan bulanan sekolah lain untuk membandingkan implementasi dan praktik terbaik pengelolaan sampah.
---

## 5. Non-Functional Requirements (NFR)

1. **Ketersediaan & Keandalan (Reliability):** 
   - Sistem menjamin ketersediaan minimal 99,5% selama jam operasional sekolah (07.00 – 17.00 WIB).
   - Arsitektur web dirancang *fault-tolerant*; kegagalan sensor atau koneksi IoT di lapangan tidak boleh memblokir pencatatan timbangan fisik dan mutasi keuangan bank sampah.
2. **Kinerja & Responsivitas (Performance):**
   - Waktu muat halaman pertama (*First Contentful Paint*) $< 2$ detik pada jaringan 4G standar.
   - Endpoint penerima telemetri IoT mampu menangani *burst request* dengan latensi respons $< 500$ ms.
3. **Aksesibilitas & UI/UX:**
   - Desain antarmuka responsif (*Mobile-First Design*) dengan layout adaptif untuk smartphone, tablet, maupun layar desktop operator.
   - **Bahasa Desain Ramah Anak & Siswa (*Friendly-Looking Design*):**
     - Menggunakan tipografi humanis/bulat (*Nunito font-sans*) dengan bobot yang tegas dan bersahabat.
     - Menghindari tipografi teknikal *monospace* (`font-mono`) pada antarmuka pengguna siswa (dashboard, tabungan, mutasi).
     - Prinsip kejelasan sekilas (*at-a-glance clarity*): kartu mutasi arus kas disajikan ringkas dan ramah (hanya menampilkan jenis transaksi, waktu/tanggal, status, dan nominal rupiah). Rincian teknis seperti kode referensi unik dan audit trail diakses melalui modal tanda terima/kuitansi.
4. **Keamanan & Integritas Data (Security):**
   - Transmisi data terenkripsi end-to-end menggunakan HTTPS / TLS 1.3.
   - Ingestion IoT dilindungi autentikasi API Key/Token per unit perangkat.
   - Seluruh mutasi kas dan pengubahan timbangan memiliki riwayat *audit trail* (mencatat User ID, Timestamp, dan Nilai Sebelum/Sesudah).

---

## 6. Scenario Planning & Analisis Risiko

### Skenario A: Kecurangan Frekuensi Pembuangan pada Sensor IoT
* **Kondisi:** Siswa sengaja memicu sensor tong sampah berulang-ulang tanpa membuang sampah demi menaikkan peringkat kelas di leaderboard.
* **Dampak:** Data aktivitas sampah menjadi bias dan merusak nilai kompetisi sehat.
* **Mitigasi Teknis:**
  - Penerapan filter *rate limiting* dan *debouncing* pada firmware dan backend API (maksimal 1 pencatatan frekuensi per 2 menit).
  - Penilaian leaderboard tidak bertumpu tunggal pada frekuensi, melainkan menggunakan formula terbobot: 70% dari akumulasi timbangan fisik terverifikasi koordinator dan 30% dari konsistensi telemetri tong sampah.

### Skenario B: Gangguan Koneksi Internet Sekolah
* **Kondisi:** Sekolah di area dengan fluktuasi sinyal mengalami gangguan konektivitas saat jam operasional bank sampah berlangsung.
* **Dampak:** Antrean penimbangan terhambat jika sistem mengharuskan koneksi konstan.
* **Mitigasi Teknis:**
  - PWA (*Progressive Web App*) dengan penyimpanan lokal (*IndexedDB* / Local Cache). Koordinator tetap dapat mencatat penimbangan saat offline, dan sistem otomatis melakukan sinkronisasi (*bulk sync*) saat koneksi internet kembali pulih.

### Skenario C: Sengketa Pencairan Saldo Kas Kelas
* **Kondisi:** Terjadi klaim bahwa saldo kas kelas berkurang tanpa persetujuan seluruh anggota kelas.
* **Dampak:** Konflik internal antar-siswa dan penurunan kepercayaan terhadap transparansi digital.
* **Mitigasi Prosedural & Sistem:**
  - Penerapan *Two-Party Approval*: Setiap pencairan wajib diajukan oleh akun kelas dan ditandatangani/diverifikasi secara digital oleh Koordinator/Wali Kelas.
  - Riwayat log mutasi kas bersifat *append-only* (tidak dapat diedit atau dihapus secara sepihak).

---

## 7. Metrics & Key Performance Indicators (KPI)

| Metrik | Target Keberhasilan (3 Bulan Pertama) |
| :--- | :--- |
| **Tingkat Adopsi Kelas** | $\ge 85\%$ kelas di sekolah percontohan aktif menyetor sampah minimal 1x per minggu. |
| **Akurasi Pembukuan Kas** | $0\%$ selisih antara pencatatan sistem web dengan kas fisik bank sampah sekolah. |
| **Kepatuhan Pelaporan Berjenjang** | $100\%$ sekolah pilot mengunggah laporan bulanan sebelum tanggal 5 tiap bulannya. |
| **Reduksi Timbulan Sampah Sekolah** | Peningkatan sampah bernilai ekonomi yang dialihkan dari TPA (*landfill diversion rate*) sebesar $\ge 25\%$. |

---

## 8. Release Roadmap (MVP Phase)

- **Sprint 0 (PoC - Current):** Setup React frontend, Shadcn UI, dan Tailwind. Pembuatan mock state (React Context) untuk interaktivitas UI tanpa backend. Simulasi RBAC (Student/Coordinator/Admin).
- **Sprint 1 - 2:** Setup database relasional, RBAC auth sesungguhnya, modul input timbangan koordinator, dan ledger kas kelas.
- **Sprint 3:** Pembangunan ingestion endpoint telemetri IoT, algoritma anti-spam sensor, dan widget dashboard status tong sampah.
- **Sprint 4:** Modul pengajuan penarikan saldo (*payout*), leaderboard kelas & Deli Serdang, serta quest gamifikasi Adiwiyata.
- **Sprint 5:** Modul pelaporan bulanan otomatis, repositori terbuka lintas sekolah Deli Serdang, testing performa PWA offline, dan final UAT.