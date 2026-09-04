/* ==========================================================================
   MBMS — api.js  (Supabase Edition)
   Unified data-access layer. Every module calls Api.list/get/create/update
   /remove(sheetName, ...) — the same call works whether BACKEND_MODE is
   "mock" (browser localStorage, zero setup) or "supabase" (the real
   Supabase Postgres project defined in /supabase/schema.sql).
   ========================================================================== */

const Api = (() => {

  const LS_KEY = "mbms_db_v1";

  // ---- Mock (localStorage) engine ---------------------------------------
  function loadDb(){
    let raw = localStorage.getItem(LS_KEY);
    if(!raw){
      const seed = cloneSeed();
      localStorage.setItem(LS_KEY, JSON.stringify(seed));
      return seed;
    }
    try{ return JSON.parse(raw); }
    catch(e){ const seed = cloneSeed(); localStorage.setItem(LS_KEY, JSON.stringify(seed)); return seed; }
  }
  function saveDb(db){ localStorage.setItem(LS_KEY, JSON.stringify(db)); }

  function genId(prefix){
    return prefix + "-" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random()*90+10);
  }

  function mockList(sheet, params={}){
    const db = loadDb();
    let rows = db[sheet] ? [...db[sheet]] : [];
    if(params.filter){
      Object.entries(params.filter).forEach(([k,v])=>{
        if(v !== undefined && v !== null && v !== "") rows = rows.filter(r => String(r[k]) === String(v));
      });
    }
    return Promise.resolve(rows);
  }
  function mockGet(sheet, id){
    const db = loadDb();
    return Promise.resolve((db[sheet]||[]).find(r=>r.id===id) || null);
  }
  function mockCreate(sheet, data){
    const db = loadDb();
    if(!db[sheet]) db[sheet] = [];
    const row = { id: data.id || genId(sheet.slice(0,2).toUpperCase()), ...data };
    db[sheet].push(row);
    saveDb(db);
    return Promise.resolve(row);
  }
  function mockUpdate(sheet, id, data){
    const db = loadDb();
    const arr = db[sheet]||[];
    const idx = arr.findIndex(r=>r.id===id);
    if(idx===-1) return Promise.reject(new Error("Data tidak ditemukan"));
    arr[idx] = { ...arr[idx], ...data, id };
    saveDb(db);
    return Promise.resolve(arr[idx]);
  }
  function mockRemove(sheet, id){
    const db = loadDb();
    db[sheet] = (db[sheet]||[]).filter(r=>r.id!==id);
    saveDb(db);
    return Promise.resolve({ ok:true });
  }
  function mockReset(){
    localStorage.removeItem(LS_KEY);
    loadDb();
    return Promise.resolve({ ok:true });
  }

  // ---- Real Supabase (PostgreSQL) engine ---------------------------------
  // Table names and column names match assets/js/mockData.js exactly (see
  // /supabase/schema.sql) — no field-mapping layer needed, so every module
  // works identically regardless of BACKEND_MODE.
  let _sb = null;
  function sb(){
    if(_sb) return _sb;
    if(!window.supabase) throw new Error("Library supabase-js belum termuat. Cek koneksi internet / CDN.");
    if(!APP_CONFIG.SUPABASE_URL || APP_CONFIG.SUPABASE_URL.includes("PASTE_")){
      throw new Error("SUPABASE_URL belum diisi di assets/js/config.js");
    }
    _sb = window.supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY);
    return _sb;
  }

  function sbThrow(error, fallbackMsg){
    if(error) throw new Error(error.message || fallbackMsg || "Terjadi kesalahan pada Supabase");
  }

  async function sbList(sheet, params={}){
    let query = sb().from(sheet).select("*");
    if(params.filter){
      Object.entries(params.filter).forEach(([k,v])=>{
        if(v !== undefined && v !== null && v !== "") query = query.eq(k, v);
      });
    }
    const { data, error } = await query;
    sbThrow(error, `Gagal mengambil data ${sheet}`);
    return data || [];
  }
  async function sbGet(sheet, id){
    const { data, error } = await sb().from(sheet).select("*").eq("id", id).maybeSingle();
    sbThrow(error, `Gagal mengambil data ${sheet}`);
    return data || null;
  }
  async function sbCreate(sheet, data){
    const row = { id: data.id || genId(sheet.slice(0,2).toUpperCase()), ...data };
    const { data: inserted, error } = await sb().from(sheet).insert(row).select().single();
    sbThrow(error, `Gagal menambah data ${sheet}`);
    return inserted;
  }
  async function sbUpdate(sheet, id, data){
    const { data: updated, error } = await sb().from(sheet).update(data).eq("id", id).select().single();
    sbThrow(error, `Gagal memperbarui data ${sheet}`);
    return updated;
  }
  async function sbRemove(sheet, id){
    const { error } = await sb().from(sheet).delete().eq("id", id);
    sbThrow(error, `Gagal menghapus data ${sheet}`);
    return { ok:true };
  }
  async function sbLogin(username, password){
    const { data, error } = await sb().from("users").select("*")
      .eq("username", username).eq("password", password).eq("status", "Aktif").maybeSingle();
    sbThrow(error, "Gagal memeriksa akun");
    return data ? { ...data, token: genId("TK") } : null;
  }
  async function sbUploadFile(file){
    // file = { name, type, data (base64 data URL) }
    const commaIdx = file.data.indexOf(",");
    const base64 = commaIdx > -1 ? file.data.substring(commaIdx+1) : file.data;
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const path = `${Date.now()}_${file.name}`.replace(/\s+/g, "_");
    const { error } = await sb().storage.from("lampiran").upload(path, bytes, { contentType: file.type, upsert: false });
    sbThrow(error, "Gagal mengunggah file ke Supabase Storage");
    const { data: pub } = sb().storage.from("lampiran").getPublicUrl(path);
    return { name: file.name, tipe: file.type, url: pub.publicUrl };
  }

  // ---- Public unified API -------------------------------------------------
  const isMock = () => APP_CONFIG.BACKEND_MODE === "mock";

  return {
    list:   (sheet, params) => isMock() ? mockList(sheet, params)      : sbList(sheet, params),
    get:    (sheet, id)     => isMock() ? mockGet(sheet, id)           : sbGet(sheet, id),
    create: (sheet, data)   => isMock() ? mockCreate(sheet, data)      : sbCreate(sheet, data),
    update: (sheet, id, d)  => isMock() ? mockUpdate(sheet, id, d)     : sbUpdate(sheet, id, d),
    remove: (sheet, id)     => isMock() ? mockRemove(sheet, id)        : sbRemove(sheet, id),
    resetMockDb: mockReset,
    uploadFile: (file) => {
      // file = { name, type, data (base64 data URL) }
      if(isMock()){
        // No real storage backend in demo mode — keep the file inline as a data URL.
        return Promise.resolve({ name: file.name, tipe: file.type, url: file.data });
      }
      return sbUploadFile(file);
    },
    login: (username, password) => {
      if(isMock()){
        const db = loadDb();
        const u = (db.users||[]).find(u => u.username===username && u.password===password && u.status==="Aktif");
        return Promise.resolve(u ? { ...u, token: genId("TK") } : null);
      }
      return sbLogin(username, password);
    },
  };
})();
