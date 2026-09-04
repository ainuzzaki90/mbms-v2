/* ==========================================================================
   MBMS — mockData.js
   Seed data used the first time the app runs in "mock" backend mode.
   Structure mirrors the Supabase tables 1:1 so switching BACKEND_MODE
   to "supabase" requires no data-shape changes.
   ========================================================================== */

const MOCK_SEED = {

  users: [
    { id: "U-0001", username: "superadmin", password: "admin123", nama: "Muhammad Ilham", role: ROLES.SUPERADMIN, status: "Aktif", email: "ilham@moetiah.sch.id", createdAt: "2025-01-05" },
    { id: "U-0002", username: "kepsek", password: "kepsek123", nama: "Ust. Fauzan Rahman, M.Pd.", role: ROLES.KEPSEK, status: "Aktif", email: "kepsek@moetiah.sch.id", createdAt: "2025-01-05" },
    { id: "U-0003", username: "waliasrama", password: "asrama123", nama: "Abdal Ainuz Zaki, B.A.", role: ROLES.WALI_ASRAMA, status: "Aktif", email: "wali.asrama@moetiah.sch.id", createdAt: "2025-01-05" },
  ],

  siswa: [
    { id: "S-0001", nis: "24001", nama: "Ahmad Fauzan Ramadhan", kelas: "VII A", jk: "L", kamarId: "K-01", tglLahir: "2012-04-11", alamat: "Cepu, Blora", ortu: "Slamet Riyadi", hpOrtu: "081234567801", foto: "", status: "Aktif" },
    { id: "S-0002", nis: "24002", nama: "Muhammad Zidan Al Ghifari", kelas: "VII A", jk: "L", kamarId: "K-01", tglLahir: "2012-06-02", alamat: "Blora", ortu: "Ahmad Zaenuri", hpOrtu: "081234567802", foto: "", status: "Aktif" },
    { id: "S-0003", nis: "24003", nama: "Rizky Maulana Ishaq", kelas: "VII B", jk: "L", kamarId: "K-02", tglLahir: "2012-01-20", alamat: "Cepu", ortu: "Bambang Ishaq", hpOrtu: "081234567803", foto: "", status: "Aktif" },
    { id: "S-0004", nis: "24004", nama: "Nur Aisyah Putri", kelas: "VII A", jk: "P", kamarId: "K-05", tglLahir: "2012-09-15", alamat: "Cepu", ortu: "Hadi Sutrisno", hpOrtu: "081234567804", foto: "", status: "Aktif" },
    { id: "S-0005", nis: "24005", nama: "Siti Khodijah Azzahra", kelas: "VII B", jk: "P", kamarId: "K-05", tglLahir: "2012-03-03", alamat: "Blora", ortu: "Muslimin", hpOrtu: "081234567805", foto: "", status: "Aktif" },
    { id: "S-0006", nis: "23011", nama: "Faisal Abdul Karim", kelas: "VIII A", jk: "L", kamarId: "K-02", tglLahir: "2011-11-08", alamat: "Cepu", ortu: "Karim Hasan", hpOrtu: "081234567806", foto: "", status: "Aktif" },
    { id: "S-0007", nis: "23012", nama: "Salma Nur Fadhila", kelas: "VIII A", jk: "P", kamarId: "K-06", tglLahir: "2011-12-19", alamat: "Blora", ortu: "Rohman Fadhil", hpOrtu: "081234567807", foto: "", status: "Aktif" },
    { id: "S-0008", nis: "22020", nama: "Ilham Dwi Saputra", kelas: "IX A", jk: "L", kamarId: "K-03", tglLahir: "2010-07-27", alamat: "Cepu", ortu: "Saputra Aji", hpOrtu: "081234567808", foto: "", status: "Aktif" },
  ],

  kamar: [
    { id: "K-01", nama: "Kamar Al-Fatih", gedung: "Asrama Putra", lantai: 1, kapasitas: 6, jk: "L" },
    { id: "K-02", nama: "Kamar Al-Farabi", gedung: "Asrama Putra", lantai: 1, kapasitas: 6, jk: "L" },
    { id: "K-03", nama: "Kamar Ibnu Sina", gedung: "Asrama Putra", lantai: 2, kapasitas: 6, jk: "L" },
    { id: "K-04", nama: "Kamar Umar Bin Khattab", gedung: "Asrama Putra", lantai: 2, kapasitas: 6, jk: "L" },
    { id: "K-05", nama: "Kamar Khadijah", gedung: "Asrama Putri", lantai: 1, kapasitas: 6, jk: "P" },
    { id: "K-06", nama: "Kamar Aisyah", gedung: "Asrama Putri", lantai: 1, kapasitas: 6, jk: "P" },
  ],

  presensi: [
    { id: "P-0001", tanggal: "2026-07-21", siswaId: "S-0001", bangun: "Hadir", sholat: "Hadir", mengaji: "Hadir", sekolah: "Hadir", tidur: "Hadir", keterangan: "" },
    { id: "P-0002", tanggal: "2026-07-21", siswaId: "S-0002", bangun: "Hadir", sholat: "Hadir", mengaji: "Alpa", sekolah: "Hadir", tidur: "Hadir", keterangan: "Terlambat bangun" },
    { id: "P-0003", tanggal: "2026-07-21", siswaId: "S-0004", bangun: "Hadir", sholat: "Izin", mengaji: "Izin", sekolah: "Izin", tidur: "Hadir", keterangan: "Sakit" },
  ],

  perizinan: [
    { id: "IZ-0001", siswaId: "S-0003", jenis: "Pulang Akhir Pekan", tglKeluar: "2026-07-18", tglKembali: "2026-07-20", alasan: "Menjenguk keluarga", penjemput: "Bambang Ishaq", status: "Kembali", disetujuiOleh: "Abdal Ainuz Zaki, B.A." },
    { id: "IZ-0002", siswaId: "S-0004", jenis: "Sakit", tglKeluar: "2026-07-21", tglKembali: "2026-07-22", alasan: "Demam, dijemput orang tua ke puskesmas", penjemput: "Hadi Sutrisno", status: "Berjalan", disetujuiOleh: "Abdal Ainuz Zaki, B.A." },
  ],

  kebersihan: [
    { id: "KB-0001", tanggal: "2026-07-20", kamarId: "K-01", petugas: "Ahmad Fauzan Ramadhan", skor: 90, fotoSebelum: "", fotoSesudah: "", catatan: "Rapi, tempat tidur sudah dilipat" },
    { id: "KB-0002", tanggal: "2026-07-20", kamarId: "K-05", petugas: "Nur Aisyah Putri", skor: 75, fotoSebelum: "", fotoSesudah: "", catatan: "Lantai perlu disapu ulang" },
  ],

  piket_putaran: [
    { id: "PK-0001", kamarId: "K-01", putaranKe: 1, tanggalMulai: "2026-07-18", ketuaKamarIds: JSON.stringify(["S-0001"]),
      petugasHarian: JSON.stringify({
        Sabtu: ["S-0002"], Minggu: ["S-0002"], Senin: ["S-0002"],
        Selasa: ["S-0002"], Rabu: ["S-0002"], Kamis: ["S-0002"], Jumat: ["S-0002"],
      }) },
  ],

  tugas_piket: [
    { id: "TP-0001", kategori: "Ketua Kamar", urutan: 1, deskripsi: "Membangunkan teman-temannya setelah musyrif membangunkan ketua kamar untuk persiapan salat Subuh" },
    { id: "TP-0002", kategori: "Ketua Kamar", urutan: 2, deskripsi: "Mengontrol ketertiban salat berjamaah lima waktu termasuk salat sunnah dan dzikir" },
    { id: "TP-0003", kategori: "Ketua Kamar", urutan: 3, deskripsi: "Mengontrol pakaian kotor agar tidak ada pakaian kotor yang lebih dari dua stel" },
    { id: "TP-0004", kategori: "Ketua Kamar", urutan: 4, deskripsi: "Mengontrol petugas piket harian agar menjalankan kewajibannya dengan tertib" },
    { id: "TP-0005", kategori: "Ketua Kamar", urutan: 5, deskripsi: "Mengontrol pencucian handuk, mukena, sandal, dan sepatu di hari yang telah dijadwalkan" },
    { id: "TP-0006", kategori: "Ketua Kamar", urutan: 6, deskripsi: "Menyetorkan hafalan kosakata ke pembina setelah makan malam" },
    { id: "TP-0007", kategori: "Ketua Kamar", urutan: 7, deskripsi: "Menyimak hafalan kosakata teman sejawatnya setelah jam belajar" },
    { id: "TP-0008", kategori: "Ketua Kamar", urutan: 8, deskripsi: "Menghitung jumlah hanger di setiap Hari Minggu" },
    { id: "TP-0009", kategori: "Ketua Kamar", urutan: 9, deskripsi: "Mengisi ceklis jurnal harian kegiatan siswa" },
    { id: "TP-0010", kategori: "Ketua Kamar", urutan: 10, deskripsi: "Melaporkan anak sakit, dan setiap pelanggaran kepada musyrif" },
    { id: "TP-0011", kategori: "Piket", urutan: 1, deskripsi: "Menyapu kamar tiga kali sehari pada pagi, siang, dan sore hari" },
    { id: "TP-0012", kategori: "Piket", urutan: 2, deskripsi: "Membuang sampah kamar dua kali sehari pada pagi dan sore hari" },
    { id: "TP-0013", kategori: "Piket", urutan: 3, deskripsi: "Membersihkan jendela dan pintu dengan kemoceng" },
    { id: "TP-0014", kategori: "Piket", urutan: 4, deskripsi: "Menertibkan barang-barang yang tidak terletak pada tempatnya" },
    { id: "TP-0015", kategori: "Piket", urutan: 5, deskripsi: "Mengontrol ketertiban dan kerapian kasur dan lemari" },
    { id: "TP-0016", kategori: "Piket", urutan: 6, deskripsi: "Memastikan lampu dan kipas angin tidak menyala saat tidak digunakan" },
    { id: "TP-0017", kategori: "Piket", urutan: 7, deskripsi: "Menata piring, sendok garpu, gelas, dan alat prasmanan sebelum makan sarapan, makan siang, dan makan malam" },
    { id: "TP-0018", kategori: "Piket", urutan: 8, deskripsi: "Memastikan kebersihan meja makan setelah makan dengan memindahkan makanan sisa ke wadah kosong lalu menumpuk alat prasmanan di wastafel dan mengelap meja" },
    { id: "TP-0019", kategori: "Piket", urutan: 9, deskripsi: "Mencuci alat prasmanan setelah makan khusus jadwal piket Sabtu dan Minggu dan tanggal merah" },
    { id: "TP-0020", kategori: "Piket", urutan: 10, deskripsi: "Memastikan kipas angin dan lampu telah dimatikan setelah penggunaan ruang makan" },
    { id: "TP-0021", kategori: "Piket", urutan: 11, deskripsi: "Membuka dan menutup jendela di pagi dan malam hari" },
    { id: "TP-0022", kategori: "Piket", urutan: 12, deskripsi: "Mengontrol area jemuran dan memastikan kerapian" },
    { id: "TP-0023", kategori: "Piket", urutan: 13, deskripsi: "Mengontrol kamar mandi dan mengecek barang-barang yang tidak rapi" },
    { id: "TP-0024", kategori: "Piket", urutan: 14, deskripsi: "Mengontrol kerapian lemari dan selorokan" },
  ],

  pelanggaran: [
    { id: "PL-0001", siswaId: "S-0002", tanggal: "2026-07-15", kategori: "Ringan", jenis: "Terlambat sholat berjamaah", poin: 5, tindakan: "Teguran lisan + hafalan tambahan", pembina: "Abdal Ainuz Zaki, B.A.", status: "Selesai" },
    { id: "PL-0002", siswaId: "S-0006", tanggal: "2026-07-10", kategori: "Sedang", jenis: "Membawa HP tanpa izin", poin: 15, tindakan: "Sita barang + surat pernyataan", pembina: "Abdal Ainuz Zaki, B.A.", status: "Selesai" },
  ],

  prestasi: [
    { id: "PR-0001", siswaId: "S-0008", tanggal: "2026-06-10", kategori: "Akademik", nama: "Juara 1 Olimpiade Matematika Kab.", tingkat: "Kabupaten", penghargaan: "Piagam + Uang Pembinaan" },
    { id: "PR-0002", siswaId: "S-0007", tanggal: "2026-05-02", kategori: "Tahfidz", nama: "Khatam 5 Juz", tingkat: "Internal Asrama", penghargaan: "Sertifikat Tahfidz" },
  ],

  kesehatan: [
    { id: "KS-0001", siswaId: "S-0004", tanggal: "2026-07-21", keluhan: "Demam 38.2°C", tindakan: "Diberi obat penurun panas, istirahat di UKS", petugas: "Abdal Ainuz Zaki, B.A.", statusRujuk: "Tidak", lampiran: "[]" },
  ],

  tumbuh_kembang: [
    { id: "TK-0001", siswaId: "S-0001", tanggal: "2026-01-15", tinggiBadan: 150, beratBadan: 42, bmi: 18.7, catatan: "Pengukuran awal semester", petugas: "Abdal Ainuz Zaki, B.A." },
    { id: "TK-0002", siswaId: "S-0001", tanggal: "2026-07-15", tinggiBadan: 154, beratBadan: 45, bmi: 19.0, catatan: "Pengukuran semester genap", petugas: "Abdal Ainuz Zaki, B.A." },
    { id: "TK-0003", siswaId: "S-0004", tanggal: "2026-01-15", tinggiBadan: 145, beratBadan: 33, bmi: 15.7, catatan: "Pengukuran awal semester", petugas: "Abdal Ainuz Zaki, B.A." },
    { id: "TK-0004", siswaId: "S-0004", tanggal: "2026-07-15", tinggiBadan: 148, beratBadan: 35, bmi: 16.0, catatan: "Pengukuran semester genap", petugas: "Abdal Ainuz Zaki, B.A." },
  ],

  inventaris: [
    { id: "INV-0001", siswaId: "S-0001", nama: "Kasur & Bantal", jumlah: 1, kondisi: "Baik", tglMasuk: "2025-07-10" },
    { id: "INV-0002", siswaId: "S-0001", nama: "Lemari Pakaian", jumlah: 1, kondisi: "Baik", tglMasuk: "2025-07-10" },
    { id: "INV-0003", siswaId: "S-0004", nama: "Kipas Angin", jumlah: 1, kondisi: "Rusak Ringan", tglMasuk: "2025-07-10" },
  ],

  tabungan: [
    { id: "TB-0001", siswaId: "S-0001", tanggal: "2026-07-01", jenis: "Setoran", jumlah: 100000, keterangan: "Setoran awal dari orang tua", petugas: "Abdal Ainuz Zaki, B.A.", saldoSetelah: 100000 },
    { id: "TB-0002", siswaId: "S-0001", tanggal: "2026-07-10", jenis: "Penarikan", jumlah: 25000, keterangan: "Beli alat mandi", petugas: "Abdal Ainuz Zaki, B.A.", saldoSetelah: 75000 },
    { id: "TB-0003", siswaId: "S-0002", tanggal: "2026-07-02", jenis: "Setoran", jumlah: 150000, keterangan: "Setoran bulanan", petugas: "Abdal Ainuz Zaki, B.A.", saldoSetelah: 150000 },
    { id: "TB-0004", siswaId: "S-0004", tanggal: "2026-07-03", jenis: "Setoran", jumlah: 80000, keterangan: "Setoran awal dari orang tua", petugas: "Abdal Ainuz Zaki, B.A.", saldoSetelah: 80000 },
    { id: "TB-0005", siswaId: "S-0004", tanggal: "2026-07-18", jenis: "Penarikan", jumlah: 15000, keterangan: "Beli jajan koperasi", petugas: "Abdal Ainuz Zaki, B.A.", saldoSetelah: 65000 },
    { id: "TB-0006", siswaId: "S-0006", tanggal: "2026-07-05", jenis: "Setoran", jumlah: 120000, keterangan: "Setoran bulanan", petugas: "Abdal Ainuz Zaki, B.A.", saldoSetelah: 120000 },
  ],

  kosakata: [
    { id: "KO-0001", kataIndonesia: "sabar", kategori: "Akhlak & Nilai", kataArab: "الصبر", contohArab: "الصبر مفتاح الفرج", kataInggris: "Patience", contohInggris: "Patience is the key to relief." },
    { id: "KO-0002", kataIndonesia: "belajar", kategori: "Aktivitas Harian", kataArab: "الدراسة", contohArab: "أدرس دروسي كل ليلة", kataInggris: "Study", contohInggris: "I study my lessons every night." },
    { id: "KO-0003", kataIndonesia: "sholat", kategori: "Ibadah", kataArab: "الصلاة", contohArab: "نصلي خمس مرات في اليوم", kataInggris: "Prayer", contohInggris: "We pray five times a day." },
  ],

  setoran_hafalan: [
    { id: "SH-0001", tanggal: "2026-07-21", siswaId: "S-0001", kosakataIds: JSON.stringify(["KO-0001","KO-0002","KO-0003"]), nilai: "Lancar", petugas: "Abdal Ainuz Zaki, B.A.", catatan: "" },
  ],

  jurnal_fields: [
    { id: "JF-0001", label: "Tanggal", type: "date", options: "", required: "Ya", urutan: 1 },
    { id: "JF-0002", label: "Mata Pelajaran", type: "select", options: "Fiqih,Hadits,Bahasa Arab,Muhadhoroh,Doa Harian & Praktik Ibadah,Imla", required: "Ya", urutan: 2 },
    { id: "JF-0003", label: "Kelas", type: "select", options: "VII A,VII B,VIII A,VIII B,IX A,IX B", required: "Ya", urutan: 3 },
    { id: "JF-0004", label: "Pengajar", type: "text", options: "", required: "Ya", urutan: 4 },
    { id: "JF-0005", label: "Materi", type: "textarea", options: "", required: "Ya", urutan: 5 },
    { id: "JF-0006", label: "Catatan", type: "textarea", options: "", required: "Tidak", urutan: 6 },
  ],

  jurnal_mengajar: [
    { id: "JM-0001", data: JSON.stringify({ "JF-0001": "2026-07-21", "JF-0002": "Fiqih", "JF-0003": "VII A", "JF-0004": "Abdal Ainuz Zaki, B.A.", "JF-0005": "Tata cara wudhu dan hal-hal yang membatalkannya", "JF-0006": "Siswa antusias, dilanjutkan praktik minggu depan" }) },
  ],

  notifications: [
    { id: "N-0001", tipe: "Pelanggaran", judul: "Pelanggaran baru", pesan: "Salma Nur Fadhila — membawa HP tanpa izin", dibaca: false, waktu: "2026-07-21T08:10:00" },
    { id: "N-0002", tipe: "Perizinan", judul: "Izin sakit", pesan: "Nur Aisyah Putri — izin sakit, dijemput orang tua", dibaca: false, waktu: "2026-07-21T09:40:00" },
    { id: "N-0003", tipe: "Kesehatan", judul: "Pemeriksaan UKS", pesan: "Nur Aisyah Putri demam 38.2°C, sudah ditangani", dibaca: true, waktu: "2026-07-21T09:55:00" },
  ],

  audit_log: [
    { id: "AL-0001", waktu: "2026-07-21T07:00:00", user: "waliasrama", aksi: "LOGIN", detail: "Login berhasil", ip: "-" },
    { id: "AL-0002", waktu: "2026-07-21T08:12:00", user: "waliasrama", aksi: "CREATE", detail: "Menambah data pelanggaran PL-0002", ip: "-" },
  ],
};

/** Deep clone helper so seed data is never mutated across resets */
function cloneSeed(){
  return JSON.parse(JSON.stringify(MOCK_SEED));
}
