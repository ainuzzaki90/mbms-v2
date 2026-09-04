-- ============================================================================
-- MBMS — Supabase Schema (schema.sql)
-- ----------------------------------------------------------------------------
-- Mirrors the original Google Sheets structure 1:1 — 20 tables, same field
-- names (camelCase, quoted to preserve exact casing so the frontend needs
-- ZERO field-mapping logic), same IDs, same seed data as mockData.js.
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → New query → paste this whole file →
--   Run. It is safe to re-run: every statement uses IF NOT EXISTS /
--   ON CONFLICT DO NOTHING, so re-running never duplicates or wipes data.
--
-- SECURITY NOTE (read before going to production):
--   To keep 1:1 behavioural parity with the original Google Apps Script
--   backend (which also allows any request bearing the deployed URL to
--   read/write, since it does not actually verify the `token` field),
--   this schema enables Row Level Security but attaches a PERMISSIVE
--   policy allowing the public "anon" key full read/write access. That
--   means anyone who has your Supabase URL + anon key (which are public
--   in your deployed frontend JS by design) can read/write every table.
--   This matches the original app's real-world security posture, but if
--   you want it hardened, replace the "anon_all" policies below with
--   policies scoped to Supabase Auth (auth.uid()) and move writes behind
--   a Supabase Edge Function that validates the session token server-side.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------------

create table if not exists "users" (
  "id" text primary key,
  "username" text unique not null,
  "password" text not null,
  "nama" text,
  "role" text,
  "status" text default 'Aktif',
  "email" text,
  "createdAt" text
);

create table if not exists "siswa" (
  "id" text primary key,
  "nis" text,
  "nama" text,
  "kelas" text,
  "jk" text,
  "kamarId" text,
  "tglLahir" text,
  "alamat" text,
  "ortu" text,
  "hpOrtu" text,
  "foto" text,
  "status" text default 'Aktif'
);

create table if not exists "kamar" (
  "id" text primary key,
  "nama" text,
  "gedung" text,
  "lantai" numeric,
  "kapasitas" numeric,
  "jk" text
);

create table if not exists "presensi" (
  "id" text primary key,
  "tanggal" text,
  "siswaId" text,
  "bangun" text,
  "sholat" text,
  "mengaji" text,
  "sekolah" text,
  "tidur" text,
  "keterangan" text
);

create table if not exists "perizinan" (
  "id" text primary key,
  "siswaId" text,
  "jenis" text,
  "tglKeluar" text,
  "tglKembali" text,
  "alasan" text,
  "penjemput" text,
  "status" text,
  "disetujuiOleh" text
);

create table if not exists "kebersihan" (
  "id" text primary key,
  "tanggal" text,
  "kamarId" text,
  "petugas" text,
  "skor" numeric,
  "fotoSebelum" text,
  "fotoSesudah" text,
  "catatan" text
);

create table if not exists "piket_putaran" (
  "id" text primary key,
  "kamarId" text,
  "putaranKe" numeric,
  "tanggalMulai" text,
  "ketuaKamarIds" text,   -- JSON array string, e.g. ["S-0001"]
  "petugasHarian" text    -- JSON object string, e.g. {"Sabtu":["S-0002"], ...}
);

create table if not exists "tugas_piket" (
  "id" text primary key,
  "kategori" text,
  "urutan" numeric,
  "deskripsi" text
);

create table if not exists "pelanggaran" (
  "id" text primary key,
  "siswaId" text,
  "tanggal" text,
  "kategori" text,
  "jenis" text,
  "poin" numeric,
  "tindakan" text,
  "pembina" text,
  "status" text
);

create table if not exists "prestasi" (
  "id" text primary key,
  "siswaId" text,
  "tanggal" text,
  "kategori" text,
  "nama" text,
  "tingkat" text,
  "penghargaan" text
);

create table if not exists "kesehatan" (
  "id" text primary key,
  "siswaId" text,
  "tanggal" text,
  "keluhan" text,
  "tindakan" text,
  "petugas" text,
  "statusRujuk" text,
  "lampiran" text default '[]'  -- JSON array string: [{name,tipe,url}, ...]
);

create table if not exists "tumbuh_kembang" (
  "id" text primary key,
  "siswaId" text,
  "tanggal" text,
  "tinggiBadan" numeric,
  "beratBadan" numeric,
  "bmi" numeric,
  "catatan" text,
  "petugas" text
);

create table if not exists "inventaris" (
  "id" text primary key,
  "siswaId" text,
  "nama" text,
  "jumlah" numeric,
  "kondisi" text,
  "tglMasuk" text
);

create table if not exists "tabungan" (
  "id" text primary key,
  "siswaId" text,
  "tanggal" text,
  "jenis" text,
  "jumlah" numeric,
  "keterangan" text,
  "petugas" text,
  "saldoSetelah" numeric
);

create table if not exists "kosakata" (
  "id" text primary key,
  "kataIndonesia" text,
  "kategori" text,
  "kataArab" text,
  "contohArab" text,
  "kataInggris" text,
  "contohInggris" text
);

create table if not exists "setoran_hafalan" (
  "id" text primary key,
  "tanggal" text,
  "siswaId" text,
  "kosakataIds" text,   -- JSON array string
  "nilai" text,
  "petugas" text,
  "catatan" text
);

create table if not exists "jurnal_fields" (
  "id" text primary key,
  "label" text,
  "type" text,
  "options" text,
  "required" text,
  "urutan" numeric
);

create table if not exists "jurnal_mengajar" (
  "id" text primary key,
  "data" text   -- JSON object string keyed by jurnal_fields.id
);

create table if not exists "notifications" (
  "id" text primary key,
  "tipe" text,
  "judul" text,
  "pesan" text,
  "dibaca" boolean default false,
  "waktu" text
);

create table if not exists "audit_log" (
  "id" text primary key,
  "waktu" text,
  "user" text,
  "aksi" text,
  "detail" text,
  "ip" text
);

-- ---------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (see security note at the top of this file)
-- ---------------------------------------------------------------------------

do $$
declare t text;
begin
  for t in select unnest(array[
    'users','siswa','kamar','presensi','perizinan','kebersihan','piket_putaran',
    'tugas_piket','pelanggaran','prestasi','kesehatan','tumbuh_kembang',
    'inventaris','tabungan','kosakata','setoran_hafalan','jurnal_fields',
    'jurnal_mengajar','notifications','audit_log'
  ])
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists anon_all on %I;', t);
    execute format('create policy anon_all on %I for all to anon, authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3. STORAGE BUCKET for Kesehatan Siswa attachments (surat sakit, rontgen, dll)
--    Equivalent to the "MBMS_Lampiran" Google Drive folder in the GAS version.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('lampiran', 'lampiran', true)
on conflict (id) do nothing;

drop policy if exists "lampiran_public_read" on storage.objects;
create policy "lampiran_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'lampiran');

drop policy if exists "lampiran_public_write" on storage.objects;
create policy "lampiran_public_write" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'lampiran');

-- ---------------------------------------------------------------------------
-- 4. SEED DATA (matches assets/js/mockData.js exactly)
-- ---------------------------------------------------------------------------

insert into "users" ("id","username","password","nama","role","status","email","createdAt") values
('U-0001','superadmin','admin123','Muhammad Ilham','Super Admin','Aktif','ilham@moetiah.sch.id','2025-01-05'),
('U-0002','kepsek','kepsek123','Ust. Fauzan Rahman, M.Pd.','Kepala Sekolah','Aktif','kepsek@moetiah.sch.id','2025-01-05'),
('U-0003','waliasrama','asrama123','Abdal Ainuz Zaki, B.A.','Wali Asrama','Aktif','wali.asrama@moetiah.sch.id','2025-01-05')
on conflict ("id") do nothing;

insert into "kamar" ("id","nama","gedung","lantai","kapasitas","jk") values
('K-01','Kamar Al-Fatih','Asrama Putra',1,6,'L'),
('K-02','Kamar Al-Farabi','Asrama Putra',1,6,'L'),
('K-03','Kamar Ibnu Sina','Asrama Putra',2,6,'L'),
('K-04','Kamar Umar Bin Khattab','Asrama Putra',2,6,'L'),
('K-05','Kamar Khadijah','Asrama Putri',1,6,'P'),
('K-06','Kamar Aisyah','Asrama Putri',1,6,'P')
on conflict ("id") do nothing;

insert into "siswa" ("id","nis","nama","kelas","jk","kamarId","tglLahir","alamat","ortu","hpOrtu","foto","status") values
('S-0001','24001','Ahmad Fauzan Ramadhan','VII A','L','K-01','2012-04-11','Cepu, Blora','Slamet Riyadi','081234567801','','Aktif'),
('S-0002','24002','Muhammad Zidan Al Ghifari','VII A','L','K-01','2012-06-02','Blora','Ahmad Zaenuri','081234567802','','Aktif'),
('S-0003','24003','Rizky Maulana Ishaq','VII B','L','K-02','2012-01-20','Cepu','Bambang Ishaq','081234567803','','Aktif'),
('S-0004','24004','Nur Aisyah Putri','VII A','P','K-05','2012-09-15','Cepu','Hadi Sutrisno','081234567804','','Aktif'),
('S-0005','24005','Siti Khodijah Azzahra','VII B','P','K-05','2012-03-03','Blora','Muslimin','081234567805','','Aktif'),
('S-0006','23011','Faisal Abdul Karim','VIII A','L','K-02','2011-11-08','Cepu','Karim Hasan','081234567806','','Aktif'),
('S-0007','23012','Salma Nur Fadhila','VIII A','P','K-06','2011-12-19','Blora','Rohman Fadhil','081234567807','','Aktif'),
('S-0008','22020','Ilham Dwi Saputra','IX A','L','K-03','2010-07-27','Cepu','Saputra Aji','081234567808','','Aktif')
on conflict ("id") do nothing;

insert into "presensi" ("id","tanggal","siswaId","bangun","sholat","mengaji","sekolah","tidur","keterangan") values
('P-0001','2026-07-21','S-0001','Hadir','Hadir','Hadir','Hadir','Hadir',''),
('P-0002','2026-07-21','S-0002','Hadir','Hadir','Alpa','Hadir','Hadir','Terlambat bangun'),
('P-0003','2026-07-21','S-0004','Hadir','Izin','Izin','Izin','Hadir','Sakit')
on conflict ("id") do nothing;

insert into "perizinan" ("id","siswaId","jenis","tglKeluar","tglKembali","alasan","penjemput","status","disetujuiOleh") values
('IZ-0001','S-0003','Pulang Akhir Pekan','2026-07-18','2026-07-20','Menjenguk keluarga','Bambang Ishaq','Kembali','Abdal Ainuz Zaki, B.A.'),
('IZ-0002','S-0004','Sakit','2026-07-21','2026-07-22','Demam, dijemput orang tua ke puskesmas','Hadi Sutrisno','Berjalan','Abdal Ainuz Zaki, B.A.')
on conflict ("id") do nothing;

insert into "kebersihan" ("id","tanggal","kamarId","petugas","skor","fotoSebelum","fotoSesudah","catatan") values
('KB-0001','2026-07-20','K-01','Ahmad Fauzan Ramadhan',90,'','','Rapi, tempat tidur sudah dilipat'),
('KB-0002','2026-07-20','K-05','Nur Aisyah Putri',75,'','','Lantai perlu disapu ulang')
on conflict ("id") do nothing;

insert into "piket_putaran" ("id","kamarId","putaranKe","tanggalMulai","ketuaKamarIds","petugasHarian") values
('PK-0001','K-01',1,'2026-07-18','["S-0001"]','{"Sabtu":["S-0002"],"Minggu":["S-0002"],"Senin":["S-0002"],"Selasa":["S-0002"],"Rabu":["S-0002"],"Kamis":["S-0002"],"Jumat":["S-0002"]}')
on conflict ("id") do nothing;

insert into "tugas_piket" ("id","kategori","urutan","deskripsi") values
('TP-0001','Ketua Kamar',1,'Membangunkan teman-temannya setelah musyrif membangunkan ketua kamar untuk persiapan salat Subuh'),
('TP-0002','Ketua Kamar',2,'Mengontrol ketertiban salat berjamaah lima waktu termasuk salat sunnah dan dzikir'),
('TP-0003','Ketua Kamar',3,'Mengontrol pakaian kotor agar tidak ada pakaian kotor yang lebih dari dua stel'),
('TP-0004','Ketua Kamar',4,'Mengontrol petugas piket harian agar menjalankan kewajibannya dengan tertib'),
('TP-0005','Ketua Kamar',5,'Mengontrol pencucian handuk, mukena, sandal, dan sepatu di hari yang telah dijadwalkan'),
('TP-0006','Ketua Kamar',6,'Menyetorkan hafalan kosakata ke pembina setelah makan malam'),
('TP-0007','Ketua Kamar',7,'Menyimak hafalan kosakata teman sejawatnya setelah jam belajar'),
('TP-0008','Ketua Kamar',8,'Menghitung jumlah hanger di setiap Hari Minggu'),
('TP-0009','Ketua Kamar',9,'Mengisi ceklis jurnal harian kegiatan siswa'),
('TP-0010','Ketua Kamar',10,'Melaporkan anak sakit, dan setiap pelanggaran kepada musyrif'),
('TP-0011','Piket',1,'Menyapu kamar tiga kali sehari pada pagi, siang, dan sore hari'),
('TP-0012','Piket',2,'Membuang sampah kamar dua kali sehari pada pagi dan sore hari'),
('TP-0013','Piket',3,'Membersihkan jendela dan pintu dengan kemoceng'),
('TP-0014','Piket',4,'Menertibkan barang-barang yang tidak terletak pada tempatnya'),
('TP-0015','Piket',5,'Mengontrol ketertiban dan kerapian kasur dan lemari'),
('TP-0016','Piket',6,'Memastikan lampu dan kipas angin tidak menyala saat tidak digunakan'),
('TP-0017','Piket',7,'Menata piring, sendok garpu, gelas, dan alat prasmanan sebelum makan sarapan, makan siang, dan makan malam'),
('TP-0018','Piket',8,'Memastikan kebersihan meja makan setelah makan dengan memindahkan makanan sisa ke wadah kosong lalu menumpuk alat prasmanan di wastafel dan mengelap meja'),
('TP-0019','Piket',9,'Mencuci alat prasmanan setelah makan khusus jadwal piket Sabtu dan Minggu dan tanggal merah'),
('TP-0020','Piket',10,'Memastikan kipas angin dan lampu telah dimatikan setelah penggunaan ruang makan'),
('TP-0021','Piket',11,'Membuka dan menutup jendela di pagi dan malam hari'),
('TP-0022','Piket',12,'Mengontrol area jemuran dan memastikan kerapian'),
('TP-0023','Piket',13,'Mengontrol kamar mandi dan mengecek barang-barang yang tidak rapi'),
('TP-0024','Piket',14,'Mengontrol kerapian lemari dan selorokan')
on conflict ("id") do nothing;

insert into "pelanggaran" ("id","siswaId","tanggal","kategori","jenis","poin","tindakan","pembina","status") values
('PL-0001','S-0002','2026-07-15','Ringan','Terlambat sholat berjamaah',5,'Teguran lisan + hafalan tambahan','Abdal Ainuz Zaki, B.A.','Selesai'),
('PL-0002','S-0006','2026-07-10','Sedang','Membawa HP tanpa izin',15,'Sita barang + surat pernyataan','Abdal Ainuz Zaki, B.A.','Selesai')
on conflict ("id") do nothing;

insert into "prestasi" ("id","siswaId","tanggal","kategori","nama","tingkat","penghargaan") values
('PR-0001','S-0008','2026-06-10','Akademik','Juara 1 Olimpiade Matematika Kab.','Kabupaten','Piagam + Uang Pembinaan'),
('PR-0002','S-0007','2026-05-02','Tahfidz','Khatam 5 Juz','Internal Asrama','Sertifikat Tahfidz')
on conflict ("id") do nothing;

insert into "kesehatan" ("id","siswaId","tanggal","keluhan","tindakan","petugas","statusRujuk","lampiran") values
('KS-0001','S-0004','2026-07-21','Demam 38.2°C','Diberi obat penurun panas, istirahat di UKS','Abdal Ainuz Zaki, B.A.','Tidak','[]')
on conflict ("id") do nothing;

insert into "tumbuh_kembang" ("id","siswaId","tanggal","tinggiBadan","beratBadan","bmi","catatan","petugas") values
('TK-0001','S-0001','2026-01-15',150,42,18.7,'Pengukuran awal semester','Abdal Ainuz Zaki, B.A.'),
('TK-0002','S-0001','2026-07-15',154,45,19.0,'Pengukuran semester genap','Abdal Ainuz Zaki, B.A.'),
('TK-0003','S-0004','2026-01-15',145,33,15.7,'Pengukuran awal semester','Abdal Ainuz Zaki, B.A.'),
('TK-0004','S-0004','2026-07-15',148,35,16.0,'Pengukuran semester genap','Abdal Ainuz Zaki, B.A.')
on conflict ("id") do nothing;

insert into "inventaris" ("id","siswaId","nama","jumlah","kondisi","tglMasuk") values
('INV-0001','S-0001','Kasur & Bantal',1,'Baik','2025-07-10'),
('INV-0002','S-0001','Lemari Pakaian',1,'Baik','2025-07-10'),
('INV-0003','S-0004','Kipas Angin',1,'Rusak Ringan','2025-07-10')
on conflict ("id") do nothing;

insert into "tabungan" ("id","siswaId","tanggal","jenis","jumlah","keterangan","petugas","saldoSetelah") values
('TB-0001','S-0001','2026-07-01','Setoran',100000,'Setoran awal dari orang tua','Abdal Ainuz Zaki, B.A.',100000),
('TB-0002','S-0001','2026-07-10','Penarikan',25000,'Beli alat mandi','Abdal Ainuz Zaki, B.A.',75000),
('TB-0003','S-0002','2026-07-02','Setoran',150000,'Setoran bulanan','Abdal Ainuz Zaki, B.A.',150000),
('TB-0004','S-0004','2026-07-03','Setoran',80000,'Setoran awal dari orang tua','Abdal Ainuz Zaki, B.A.',80000),
('TB-0005','S-0004','2026-07-18','Penarikan',15000,'Beli jajan koperasi','Abdal Ainuz Zaki, B.A.',65000),
('TB-0006','S-0006','2026-07-05','Setoran',120000,'Setoran bulanan','Abdal Ainuz Zaki, B.A.',120000)
on conflict ("id") do nothing;

insert into "kosakata" ("id","kataIndonesia","kategori","kataArab","contohArab","kataInggris","contohInggris") values
('KO-0001','sabar','Akhlak & Nilai','الصبر','الصبر مفتاح الفرج','Patience','Patience is the key to relief.'),
('KO-0002','belajar','Aktivitas Harian','الدراسة','أدرس دروسي كل ليلة','Study','I study my lessons every night.'),
('KO-0003','sholat','Ibadah','الصلاة','نصلي خمس مرات في اليوم','Prayer','We pray five times a day.')
on conflict ("id") do nothing;

insert into "setoran_hafalan" ("id","tanggal","siswaId","kosakataIds","nilai","petugas","catatan") values
('SH-0001','2026-07-21','S-0001','["KO-0001","KO-0002","KO-0003"]','Lancar','Abdal Ainuz Zaki, B.A.','')
on conflict ("id") do nothing;

insert into "jurnal_fields" ("id","label","type","options","required","urutan") values
('JF-0001','Tanggal','date','','Ya',1),
('JF-0002','Mata Pelajaran','select','Fiqih,Hadits,Bahasa Arab,Muhadhoroh,Doa Harian & Praktik Ibadah,Imla','Ya',2),
('JF-0003','Kelas','select','VII A,VII B,VIII A,VIII B,IX A,IX B','Ya',3),
('JF-0004','Pengajar','text','','Ya',4),
('JF-0005','Materi','textarea','','Ya',5),
('JF-0006','Catatan','textarea','','Tidak',6)
on conflict ("id") do nothing;

insert into "jurnal_mengajar" ("id","data") values
('JM-0001','{"JF-0001":"2026-07-21","JF-0002":"Fiqih","JF-0003":"VII A","JF-0004":"Abdal Ainuz Zaki, B.A.","JF-0005":"Tata cara wudhu dan hal-hal yang membatalkannya","JF-0006":"Siswa antusias, dilanjutkan praktik minggu depan"}')
on conflict ("id") do nothing;

insert into "notifications" ("id","tipe","judul","pesan","dibaca","waktu") values
('N-0001','Pelanggaran','Pelanggaran baru','Salma Nur Fadhila — membawa HP tanpa izin',false,'2026-07-21T08:10:00'),
('N-0002','Perizinan','Izin sakit','Nur Aisyah Putri — izin sakit, dijemput orang tua',false,'2026-07-21T09:40:00'),
('N-0003','Kesehatan','Pemeriksaan UKS','Nur Aisyah Putri demam 38.2°C, sudah ditangani',true,'2026-07-21T09:55:00')
on conflict ("id") do nothing;

insert into "audit_log" ("id","waktu","user","aksi","detail","ip") values
('AL-0001','2026-07-21T07:00:00','waliasrama','LOGIN','Login berhasil','-'),
('AL-0002','2026-07-21T08:12:00','waliasrama','CREATE','Menambah data pelanggaran PL-0002','-')
on conflict ("id") do nothing;

-- ============================================================================
-- Done. Next steps:
--   1. Project Settings → API → copy "Project URL" and "anon public" key.
--   2. Paste them into assets/js/config.js (SUPABASE_URL, SUPABASE_ANON_KEY).
--   3. Set BACKEND_MODE: "supabase" in the same file.
--   See README.md section "Deploy ke Supabase + GitHub + Vercel" for the
--   full walkthrough.
-- ============================================================================
