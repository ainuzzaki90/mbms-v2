/* ==========================================================================
   MBMS — config.js  (Supabase Edition)
   Global configuration. Edit APP_CONFIG.SUPABASE_URL / SUPABASE_ANON_KEY
   after creating the Supabase project (see /supabase/schema.sql and
   README.md).
   ========================================================================== */

const APP_CONFIG = {
  APP_NAME: "MOETIAH BOARDING MANAGEMENT SYSTEM",
  APP_SHORT: "MBMS",
  SUBTITLE: "Sistem Manajemen Asrama SMP Islam Moetiah",
  SCHOOL: "SMP Islam Moetiah",
  WALI_ASRAMA: "Abdal Ainuz Zaki, B.A.",
  VERSION: "1.0.0",

  // ---- Backend mode -------------------------------------------------
  // "mock"      -> uses browser localStorage as the database (works instantly,
  //                no setup — great for demo / offline use).
  // "supabase"  -> calls the real Supabase Postgres project defined in
  //                /supabase/schema.sql.
  BACKEND_MODE: "supabase",

  // Project Settings → API in your Supabase dashboard:
  SUPABASE_URL: "https://obwmspwgojnpsnbscben.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_Lksic49Qve-PGlwyL4T_-g_jNF3mP_3",

  IDLE_TIMEOUT_MINUTES: 30,
  DATE_FORMAT: "dd LLL yyyy",
  DATETIME_FORMAT: "dd LLL yyyy, HH:mm",
  LOCALE: "id",
};

// ---- Roles ---------------------------------------------------------------
const ROLES = {
  SUPERADMIN: "Super Admin",
  KEPSEK: "Kepala Sekolah",
  WALI_ASRAMA: "Wali Asrama",
};

// ---- Sidebar / menu registry ----------------------------------------------
// `roles: null` => visible to all roles.
const MENU = [
  { section: "Utama", items: [
    { id: "dashboard", label: "Dashboard", icon: "fa-solid fa-chart-pie", roles: null },
  ]},
  { section: "Kesiswaan", items: [
    { id: "siswa", label: "Data Siswa", icon: "fa-solid fa-user-graduate", roles: null },
    { id: "kamar", label: "Manajemen Kamar", icon: "fa-solid fa-door-open", roles: null },
    { id: "presensi", label: "Presensi Harian", icon: "fa-solid fa-clipboard-check", roles: null },
    { id: "perizinan", label: "Perizinan Siswa", icon: "fa-solid fa-right-from-bracket", roles: null },
    { id: "kebersihan", label: "Kebersihan Kamar", icon: "fa-solid fa-broom", roles: null },
    { id: "piket", label: "Jadwal Piket", icon: "fa-solid fa-rotate", roles: null },
  ]},
  { section: "Akademik", items: [
    { id: "kosakata", label: "Kosakata Harian", icon: "fa-solid fa-language", roles: null },
    { id: "jurnal", label: "Jurnal Mengajar", icon: "fa-solid fa-book-open", roles: null },
  ]},
  { section: "Pembinaan", items: [
    { id: "pelanggaran", label: "Pelanggaran & Pembinaan", icon: "fa-solid fa-triangle-exclamation", roles: null },
    { id: "prestasi", label: "Prestasi Siswa", icon: "fa-solid fa-medal", roles: null },
    { id: "kesehatan", label: "Kesehatan Siswa", icon: "fa-solid fa-kit-medical", roles: null },
    { id: "tumbuhkembang", label: "Tumbuh Kembang", icon: "fa-solid fa-ruler-vertical", roles: null },
  ]},
  { section: "Operasional", items: [
    { id: "inventaris", label: "Inventaris Siswa", icon: "fa-solid fa-box-archive", roles: null },
    { id: "tabungan", label: "Tabungan Siswa", icon: "fa-solid fa-piggy-bank", roles: null },
  ]},
  { section: "Laporan", items: [
    { id: "reports", label: "Laporan & Export", icon: "fa-solid fa-file-export", roles: null },
  ]},
  { section: "Administrasi", items: [
    { id: "users", label: "Manajemen Pengguna", icon: "fa-solid fa-users-gear", roles: [ROLES.SUPERADMIN] },
    { id: "auditlog", label: "Audit Log", icon: "fa-solid fa-shield-halved", roles: [ROLES.SUPERADMIN] },
    { id: "settings", label: "Pengaturan", icon: "fa-solid fa-gear", roles: null },
  ]},
];
