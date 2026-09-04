# MBMS — Moetiah Boarding Management System
### (Supabase + GitHub + Vercel Edition)

Sistem Manajemen Asrama SMP Islam Moetiah. Aplikasi web modular untuk
mengelola seluruh kehidupan siswa di asrama: data siswa, kamar, presensi,
perizinan, kebersihan, piket, pelanggaran/pembinaan, prestasi, kesehatan,
tumbuh kembang, inventaris, tabungan siswa, kosakata harian, jurnal mengajar,
laporan, dan manajemen pengguna — lengkap dengan AI Assistant, RBAC, audit
log, dan dukungan PWA.

**Duplikat 1:1** dari versi Google Apps Script — seluruh fitur, tampilan,
alur kerja, dan data identik. Satu-satunya perbedaan adalah lapisan backend:
versi ini memakai **Supabase (PostgreSQL)** sebagai database, di-hosting di
**GitHub**, dan di-deploy lewat **Vercel**.

---

## 1. Struktur Folder

```
mbms-supabase/
├── index.html                 # Shell aplikasi (login + SPA)
├── manifest.json              # PWA manifest
├── service-worker.js          # PWA offline cache (app-shell)
├── assets/
│   ├── css/style.css          # Design system (navy/putih/emas + dark mode)
│   ├── img/                   # Ikon PWA
│   └── js/
│       ├── config.js          # Konfigurasi global (Supabase URL/Key, menu, role)
│       ├── mockData.js        # Seed data mode demo (localStorage)
│       ├── data/kosakataDictionary.js  # Kamus lokal ~110 kata utk fitur Generate
│       ├── api.js             # Lapisan akses data (mock ⇄ Supabase)
│       ├── auth.js            # Sesi, login, RBAC, idle auto-logout
│       ├── core.js            # Router SPA, sidebar, notifikasi, CrudModule generik
│       ├── app-init.js        # Bootstrap aplikasi, dark mode, PWA
│       └── modules/            # 15 modul fitur (dashboard, siswa, kamar, piket, dst.)
└── supabase/
    └── schema.sql              # DDL lengkap + RLS + seed data (jalankan sekali di Supabase)
```

Arsitektur frontend **tidak berubah sama sekali** dari versi asli — pola MVC
ringan yang sama (`api.js` = Model, `modules/*.js` = Controller+View,
`core.js` = kerangka kerja bersama). Yang diganti murni implementasi di
dalam `api.js` (dan `config.js` untuk kredensialnya).

---

## 2. Menjalankan Secara Instan (Mode Demo)

Sama seperti versi asli — bisa langsung dicoba **tanpa setup apa pun**
memakai `BACKEND_MODE: "mock"` (default), data tersimpan di `localStorage`.

1. Buka `index.html` langsung, atau jalankan server statis ringan:
   ```bash
   npx serve mbms-supabase
   ```
2. Login dengan akun demo (tampil juga di halaman login):

   | Role            | Username     | Password    |
   |-----------------|--------------|-------------|
   | Super Admin     | `superadmin` | `admin123`  |
   | Kepala Sekolah  | `kepsek`     | `kepsek123` |
   | Wali Asrama     | `waliasrama` | `asrama123` |

---

## 3. Deploy Backend Sungguhan — Supabase

### Langkah A — Buat Project Supabase
1. Buka [supabase.com](https://supabase.com) → **Sign up/Login** (bisa pakai akun GitHub) → **New project**.
2. Isi nama project (mis. `mbms-moetiah`), buat/​catat **Database Password**, pilih region terdekat (mis. Singapore) → **Create new project**. Tunggu 1–2 menit sampai provisioning selesai.

### Langkah B — Jalankan Skema Database
1. Di dashboard Supabase, buka menu **SQL Editor** (ikon `>_` di sidebar kiri) → **New query**.
2. Buka file `supabase/schema.sql` dari proyek ini, salin **seluruh isinya**, tempel ke SQL Editor.
3. Klik **Run** (atau Ctrl+Enter). Skrip ini akan:
   - Membuat 20 tabel (persis seperti 20 sheet di versi Google Sheets).
   - Mengaktifkan Row Level Security + kebijakan akses.
   - Membuat storage bucket `lampiran` (untuk upload surat sakit/rontgen di modul Kesehatan Siswa).
   - Mengisi akun demo & data contoh.
4. Skrip ini **aman dijalankan ulang kapan saja** — semua statement memakai `IF NOT EXISTS` / `ON CONFLICT DO NOTHING`, tidak akan menghapus/menimpa data yang sudah ada.

### Langkah C — Ambil Kredensial API
1. Di dashboard Supabase, buka **Project Settings** (ikon gear) → **API**.
2. Salin dua nilai ini:
   - **Project URL** (bentuknya `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (di bagian "Project API keys" — bukan `service_role`, jangan pernah pakai `service_role` di frontend)

### Langkah D — Hubungkan Frontend
Buka `assets/js/config.js`, ubah:
```js
BACKEND_MODE: "supabase",
SUPABASE_URL: "https://xxxxxxxxxxxx.supabase.co",
SUPABASE_ANON_KEY: "eyJhbGciOi....(anon public key)....",
```
Simpan. Tidak ada perubahan kode lain yang diperlukan — seluruh modul otomatis memakai Supabase.

> **Catatan keamanan**: kebijakan RLS bawaan di `schema.sql` mengizinkan
> akses baca/tulis penuh memakai `anon key` — ini sengaja dibuat setara
> dengan versi Apps Script aslinya (yang juga tidak benar-benar memvalidasi
> token di server). Karena `anon key` memang publik/terlihat di kode
> frontend, siapa pun yang tahu URL+key project Anda bisa membaca/menulis
> data. Untuk pengerasan keamanan produksi, ganti policy `anon_all` di
> `schema.sql` dengan policy berbasis Supabase Auth (`auth.uid()`), dan
> pindahkan operasi tulis ke **Supabase Edge Function** yang memvalidasi
> sesi di server.

---

## 4. Hosting Kode — GitHub

1. Buat repository baru di GitHub (mis. `mbms-supabase`), set **Public** atau **Private**.
2. Upload seluruh isi folder `mbms-supabase` (bukan folder itu sendiri — isinya langsung: `index.html`, `assets/`, `supabase/`, dst.) lewat **uploading an existing file**, atau via `git`:
   ```bash
   cd mbms-supabase
   git init
   git add .
   git commit -m "Initial commit: MBMS Supabase edition"
   git branch -M main
   git remote add origin https://github.com/<username>/mbms-supabase.git
   git push -u origin main
   ```

---

## 5. Deploy — Vercel

1. Buka [vercel.com](https://vercel.com) → **Sign up/Login** (disarankan pakai akun GitHub agar repo otomatis terhubung).
2. Klik **Add New → Project**.
3. Pilih **Import Git Repository**, cari & pilih repo `mbms-supabase` yang baru diupload.
4. Di layar konfigurasi:
   - **Framework Preset**: pilih **Other** (situs ini statis murni, tanpa build step).
   - **Build Command**: kosongkan.
   - **Output Directory**: kosongkan / biarkan default (`.`).
5. Klik **Deploy**. Tunggu ±30 detik.
6. Setelah selesai, Vercel memberi URL seperti `https://mbms-supabase.vercel.app` — situs sudah live.

> Karena aplikasi ini pakai **hash-based routing** (`#dashboard`, `#siswa`, dst — bukan path routing), tidak diperlukan file `vercel.json` untuk rewrite rules. Refresh di halaman modul mana pun akan tetap berfungsi normal.

Setiap kali Anda `git push` perubahan baru ke branch `main`, Vercel otomatis re-deploy (CI/CD bawaan) — tidak perlu upload manual lagi.

---

## 6. Endpoint Data (Supabase)

Tidak ada REST endpoint kustom seperti versi Apps Script — `api.js`
berbicara langsung ke Supabase lewat `supabase-js`, yang di baliknya
memakai **PostgREST** (REST API otomatis dari skema tabel). Operasi yang
dipetakan `Api.*` di frontend:

| Fungsi Frontend      | Operasi Supabase                                         |
|-----------------------|------------------------------------------------------------|
| `Api.list(sheet)`     | `supabase.from(sheet).select('*')` (+ filter `.eq()`)       |
| `Api.get(sheet,id)`   | `.select('*').eq('id',id).maybeSingle()`                    |
| `Api.create(sheet,d)` | `.insert(row).select().single()`                             |
| `Api.update(sheet,id,d)` | `.update(d).eq('id',id).select().single()`               |
| `Api.remove(sheet,id)`| `.delete().eq('id',id)`                                      |
| `Api.login(u,p)`      | Query tabel `users` dengan `.eq()` username+password+status  |
| `Api.uploadFile(f)`   | `supabase.storage.from('lampiran').upload(...)`               |

Nama tabel & kolom **identik persis** dengan `assets/js/mockData.js` —
lihat `supabase/schema.sql` untuk daftar lengkap 20 tabel.

---

## 7. Role & Hak Akses (RBAC)

| Modul                    | Super Admin | Kepala Sekolah | Wali Asrama |
|---------------------------|:-----------:|:---------------:|:-----------:|
| Dashboard & modul operasional | ✅ | ✅ | ✅ |
| Laporan & Export           | ✅ | ✅ | ✅ |
| Manajemen Pengguna         | ✅ | ❌ | ❌ |
| Audit Log                  | ✅ | ❌ | ❌ |

Aturan akses didefinisikan di `assets/js/config.js` (array `MENU`, field
`roles`) dan ditegakkan di router (`core.js` → `Auth.can()`).

---

## 8. Fitur Utama (identik dengan versi asli)

- **Dashboard** — kartu statistik real-time + grafik Chart.js (tabungan siswa, presensi, okupansi kamar).
- **Data Siswa** — foto (drag & drop), kartu ID + QR code, import/export Excel.
- **Manajemen Kamar** — layout visual kapasitas & penghuni per kamar.
- **Presensi Harian**, **Perizinan Siswa**, **Kebersihan Kamar** (checklist + foto sebelum/sesudah).
- **Jadwal Piket** — format Putaran per kamar (Ketua Kamar + Petugas Piket harian dinamis), generator rotasi adil, daftar Tugas yang bisa diedit, cetak PDF.
- **Pelanggaran & Pembinaan**, **Prestasi Siswa**.
- **Kesehatan Siswa** — riwayat penyakit + lampiran dokumen medis (kini via **Supabase Storage**, bukan Google Drive).
- **Tumbuh Kembang Siswa** — tinggi/berat berkala + IMT otomatis + grafik tren.
- **Inventaris**, **Tabungan Siswa** (setoran/penarikan + validasi saldo + buku tabungan digital).
- **Kosakata Harian** — generate terjemahan Arab/Inggris + contoh kalimat dari kamus lokal, setoran hafalan siswa yang fleksibel.
- **Jurnal Mengajar** — kolom/field yang sepenuhnya bisa diatur sendiri dari UI.
- **AI Assistant** (tombol mengambang) — analisis data siswa berbasis rule-engine lokal.
- **Manajemen Pengguna**, **Notifikasi**, **Audit Log**, **Laporan & Export PDF/Excel**.
- **Lainnya** — Dark Mode, PWA, DataTables (sort/paginate/filter), loading skeleton.

---

## 9. Perbedaan Teknis dari Versi Google Apps Script

| Aspek               | Versi Google Sheets/GAS         | Versi Supabase (proyek ini)        |
|----------------------|-----------------------------------|---------------------------------------|
| Database             | Google Sheets                    | PostgreSQL (Supabase)                 |
| API Backend          | Google Apps Script Web App       | Supabase auto-REST (PostgREST) via `supabase-js` |
| Penyimpanan File      | Google Drive (folder `MBMS_Lampiran`) | Supabase Storage (bucket `lampiran`) |
| Setup awal            | Jalankan fungsi `setupDatabase` di Apps Script Editor | Jalankan `supabase/schema.sql` di SQL Editor |
| Hosting frontend       | GitHub Pages                    | Vercel                                |
| Autentikasi            | Kustom (tabel `users`, tanpa hash) | Kustom (tabel `users`, tanpa hash — sama persis) |

Semua fitur, tampilan, dan perilaku aplikasi **sama persis** — hanya cara
data disimpan & diambil yang berbeda di balik layar.

---

Dikelola oleh Wali Asrama **Abdal Ainuz Zaki, B.A.** — SMP Islam Moetiah.
