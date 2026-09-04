/* ==========================================================================
   MBMS — modules/piket.js  (Jadwal Piket)
   ----------------------------------------------------------------------
   v3 design:
     - A "Putaran" (round) is scoped to ONE KAMAR (room), not a whole
       gender wing — this matches what "Ketua KAMAR" actually means.
     - The Ketua Kamar (room leader/leaders) is EXCLUDED from the Petugas
       Piket candidate pool for that same putaran — a room leader
       oversees the duty roster, they don't rotate through it themselves.
     - "Tugas Ketua Kamar" and "Tugas Piket" checklists are fully
       editable in the UI (stored in sheet `tugas_piket`), not hardcoded.
   Data model:
     piket_putaran: id, kamarId, putaranKe, tanggalMulai, ketuaKamarIds
                    (JSON array of siswaId), petugasHarian (JSON object
                    { "Sabtu":[siswaId,...], ... })
     tugas_piket:   id, kategori ("Ketua Kamar" | "Piket"), deskripsi, urutan
   ========================================================================== */
(function(){

  const HARI = ["Sabtu","Minggu","Senin","Selasa","Rabu","Kamis","Jumat"];

  function parseHarian(json){ try{ const v = JSON.parse(json||"{}"); return v && typeof v==="object" ? v : {}; }catch(e){ return {}; } }
  function getKetuaIds(row){
    if(row.ketuaKamarIds){
      try{ const v = JSON.parse(row.ketuaKamarIds); if(Array.isArray(v)) return v; }catch(e){}
    }
    return row.ketuaKamarId ? [row.ketuaKamarId] : []; // backward-compat
  }
  function periodeLabel(tanggalMulai){
    const start = luxon.DateTime.fromISO(tanggalMulai);
    const end = start.plus({days:6});
    return `${Utils.fmtDate(start.toISODate())} – ${Utils.fmtDate(end.toISODate())}`;
  }
  function checkboxList(idPrefix, pool, selectedIds){
    return `<div style="max-height:230px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:10px;text-align:left">
      ${pool.map(s=>`<div class="form-check">
        <input class="form-check-input" type="checkbox" value="${s.id}" id="${idPrefix}_${s.id}" ${selectedIds.includes(s.id)?'checked':''}>
        <label class="form-check-label" for="${idPrefix}_${s.id}" style="font-size:13px">${s.nama}</label>
      </div>`).join("") || `<span class="text-muted" style="font-size:12.5px">Tidak ada siswa tersedia</span>`}
    </div>`;
  }
  function readCheckboxList(idPrefix, pool){
    return pool.filter(s => document.getElementById(`${idPrefix}_${s.id}`)?.checked).map(s=>s.id);
  }
  function roomPool(kamarId){
    return Cache.allSiswa().filter(s=>s.kamarId===kamarId && s.status==="Aktif");
  }

  /* ============================== Tugas (editable checklists) ============================== */

  async function renderTugasCard(kategori, title, icon){
    const items = (await Api.list("tugas_piket", { filter:{ kategori } })).sort((a,b)=>Number(a.urutan)-Number(b.urutan));
    return `<div class="card-mbms h-100">
      <div class="card-header-mbms"><h6><i class="${icon} me-2" style="color:var(--gold)"></i>${title}</h6></div>
      <div class="card-body-mbms">
        <div id="tugasList_${kategori.replace(/\s/g,'')}" style="max-height:190px;overflow-y:auto">
          ${items.map((it,i)=>`<div class="d-flex align-items-start gap-2 mb-2" data-tugas-id="${it.id}">
            <span style="font-size:12px;color:var(--muted);min-width:16px">${i+1}.</span>
            <span style="font-size:12.5px;flex:1">${Utils.escapeHtml(it.deskripsi)}</span>
            <button class="btn btn-sm btn-soft-info py-0 px-2" data-tugas-edit="${it.id}"><i class="fa-solid fa-pen" style="font-size:10px"></i></button>
            <button class="btn btn-sm btn-soft-danger py-0 px-2" data-tugas-del="${it.id}"><i class="fa-solid fa-trash" style="font-size:10px"></i></button>
          </div>`).join("") || `<p class="text-muted mb-0" style="font-size:12px">Belum ada item</p>`}
        </div>
        <div class="d-flex gap-2 mt-2">
          <input type="text" class="form-control form-control-mbms form-control-sm" style="padding-left:12px" placeholder="Tambah item tugas..." id="tugasInput_${kategori.replace(/\s/g,'')}">
          <button class="btn btn-navy btn-sm" id="tugasAdd_${kategori.replace(/\s/g,'')}"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    </div>`;
  }

  function wireTugasCard(kategori, onChanged){
    const key = kategori.replace(/\s/g,'');
    const input = document.getElementById(`tugasInput_${key}`);
    document.getElementById(`tugasAdd_${key}`).onclick = async () => {
      const teks = input.value.trim();
      if(!teks) return;
      const existing = await Api.list("tugas_piket", { filter:{ kategori } });
      await Api.create("tugas_piket", { kategori, deskripsi: teks, urutan: existing.length + 1 });
      input.value = "";
      Utils.toast("success","Item ditambahkan");
      onChanged();
    };
    document.querySelectorAll(`#tugasList_${key} [data-tugas-edit]`).forEach(btn=>{
      btn.onclick = async () => {
        const id = btn.dataset.tugasEdit;
        const row = document.querySelector(`[data-tugas-id="${id}"] span:nth-child(2)`);
        const result = await Swal.fire({
          title:"Edit Item Tugas", input:"textarea", inputValue: row.textContent,
          showCancelButton:true, confirmButtonText:"Simpan", cancelButtonText:"Batal", confirmButtonColor:"#0a2540",
        });
        if(!result.isConfirmed || !result.value.trim()) return;
        await Api.update("tugas_piket", id, { deskripsi: result.value.trim() });
        Utils.toast("success","Item diperbarui");
        onChanged();
      };
    });
    document.querySelectorAll(`#tugasList_${key} [data-tugas-del]`).forEach(btn=>{
      btn.onclick = async () => {
        const ok = await Utils.confirmDelete("item tugas ini");
        if(!ok) return;
        await Api.remove("tugas_piket", btn.dataset.tugasDel);
        Utils.toast("success","Item dihapus");
        onChanged();
      };
    });
  }

  /* ============================== Main page ============================== */

  async function render(container){
    await Cache.refresh();
    container.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <div><h3><i class="fa-solid fa-rotate" style="color:var(--gold);margin-right:8px"></i>Jadwal Piket</h3>
          <p>Rotasi Ketua Kamar &amp; Petugas Piket per kamar, per putaran (7 hari, Sabtu–Jumat)</p></div>
          <button class="btn btn-outline-navy" id="btnGenerate"><i class="fa-solid fa-wand-magic-sparkles me-1"></i>Generate Putaran</button>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6" id="cardTugasKetua"></div>
          <div class="col-md-6" id="cardTugasPiket"></div>
        </div>

        <div class="card-mbms">
          <div class="card-header-mbms"><h6>Daftar Putaran</h6></div>
          <div class="card-body-mbms">
            <div class="table-responsive">
              <table class="table table-hover align-middle" id="piketTable" style="width:100%">
                <thead><tr><th style="width:48px">No</th><th>Kamar</th><th>Putaran Ke</th><th>Periode</th><th>Ketua Kamar</th><th>Petugas (ringkas)</th><th>Aksi</th></tr></thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;

    async function reloadTugas(){
      document.getElementById("cardTugasKetua").innerHTML = await renderTugasCard("Ketua Kamar", "Tugas Ketua Kamar", "fa-solid fa-user-tie");
      document.getElementById("cardTugasPiket").innerHTML = await renderTugasCard("Piket", "Tugas Piket", "fa-solid fa-broom");
      wireTugasCard("Ketua Kamar", reloadTugas);
      wireTugasCard("Piket", reloadTugas);
    }

    let dt = null;
    async function reload(){
      const rows = (await Api.list("piket_putaran")).sort((a,b)=> Cache.kamarName(a.kamarId).localeCompare(Cache.kamarName(b.kamarId)) || Number(a.putaranKe)-Number(b.putaranKe));
      if(dt) dt.destroy();
      document.querySelector("#piketTable tbody").innerHTML = rows.map(r=>{
        const harian = parseHarian(r.petugasHarian);
        const kamar = Cache.kamarObj(r.kamarId);
        const ketuaNames = getKetuaIds(r).map(id=>Cache.siswaName(id)).join(", ") || "-";
        const ringkas = HARI.slice(0,3).map(h => (harian[h]||[]).map(id=>Cache.siswaName(id).split(" ")[0]).join("/")).join(" · ") + " ...";
        return `<tr>
          <td></td>
          <td><span class="badge-mbms ${kamar?.jk==='L'?'badge-info':'badge-warning'}">${Cache.kamarName(r.kamarId)}</span></td>
          <td><b style="color:var(--navy)">Putaran ${r.putaranKe}</b></td>
          <td>${periodeLabel(r.tanggalMulai)}</td>
          <td>${ketuaNames}</td>
          <td style="font-size:12px;color:var(--muted)">${ringkas}</td>
          <td class="text-nowrap">
            <button class="btn btn-sm btn-outline-navy" data-act="detail" data-id="${r.id}"><i class="fa-solid fa-list-check me-1"></i>Detail</button>
            <button class="btn btn-sm btn-soft-danger" data-act="delete" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>`;
      }).join("") || `<tr><td colspan="7" class="text-center text-muted py-4">Belum ada putaran piket. Klik "Generate Putaran" untuk membuat otomatis.</td></tr>`;

      document.querySelectorAll("#piketTable [data-act]").forEach(btn=>{
        btn.onclick = async () => {
          const row = rows.find(r=>r.id===btn.dataset.id);
          if(btn.dataset.act==="detail") return openDetail(row, reload);
          if(btn.dataset.act==="delete"){
            const ok = await Utils.confirmDelete(`Putaran ${row.putaranKe} (${Cache.kamarName(row.kamarId)})`);
            if(!ok) return;
            await Api.remove("piket_putaran", row.id);
            Auth.logAudit("DELETE", `Menghapus putaran piket ${Cache.kamarName(row.kamarId)} #${row.putaranKe}`);
            Utils.toast("success","Putaran dihapus");
            reload();
          }
        };
      });

      if(rows.length){
        dt = $("#piketTable").DataTable({ pageLength:10, columnDefs:[TableUtil.numberColumnDef(0), {orderable:false,targets:6}], language:{search:"Cari:",zeroRecords:"Data tidak ditemukan"} });
      }
    }

    document.getElementById("btnGenerate").onclick = () => generatePutaran(reload);
    await reloadTugas();
    reload();
  }

  async function generatePutaran(onDone){
    const kamarList = Cache.allKamar();
    if(!kamarList.length){ Utils.toast("error","Belum ada data kamar"); return; }

    const cfg = await Swal.fire({
      title:"Generate Putaran Piket", width:480,
      html:`<div class="row g-3 text-start">
        <div class="col-12"><label class="form-label-mbms">Kamar</label>
          <select id="f_kamar" class="form-select form-control-mbms" style="padding-left:16px">
            ${kamarList.map(k=>`<option value="${k.id}">${k.nama} (${roomPool(k.id).length} siswa aktif)</option>`).join("")}
          </select></div>
        <div class="col-6"><label class="form-label-mbms">Jumlah Ketua Kamar</label><input type="number" id="f_jmlKetua" class="form-control form-control-mbms" style="padding-left:16px" min="1" value="1"></div>
        <div class="col-6"><label class="form-label-mbms">Jumlah Petugas / Hari</label><input type="number" id="f_jmlPetugas" class="form-control form-control-mbms" style="padding-left:16px" min="1" value="2"></div>
        <div class="col-12" style="font-size:12px;color:var(--muted)">Ketua Kamar tidak akan ikut dijadwalkan sebagai Petugas Piket. Orang-orangnya dipilih otomatis dengan rotasi adil, bisa diedit manual sesudahnya.</div>
      </div>`,
      showCancelButton:true, confirmButtonText:"Generate", cancelButtonText:"Batal", confirmButtonColor:"#0a2540",
      preConfirm: () => {
        const kamarId = document.getElementById("f_kamar").value;
        const jmlKetua = Number(document.getElementById("f_jmlKetua").value);
        const jmlPetugas = Number(document.getElementById("f_jmlPetugas").value);
        const pool = roomPool(kamarId);
        if(pool.length < 2){ Swal.showValidationMessage("Minimal 2 siswa aktif di kamar ini diperlukan"); return false; }
        if(!jmlKetua || jmlKetua<1){ Swal.showValidationMessage("Isi jumlah Ketua Kamar (minimal 1)"); return false; }
        if(!jmlPetugas || jmlPetugas<1){ Swal.showValidationMessage("Isi jumlah Petugas (minimal 1)"); return false; }
        if(jmlKetua >= pool.length){ Swal.showValidationMessage(`Jumlah Ketua Kamar harus lebih sedikit dari total siswa (${pool.length}) agar masih ada calon Petugas`); return false; }
        return { kamarId, jmlKetua, jmlPetugas, pool };
      }
    });
    if(!cfg.isConfirmed) return;
    const { kamarId, jmlKetua, jmlPetugas, pool } = cfg.value;

    const existing = (await Api.list("piket_putaran")).filter(p=>p.kamarId===kamarId);
    const putaranKe = existing.length ? Math.max(...existing.map(e=>Number(e.putaranKe))) + 1 : 1;

    const ketuaCount = {}, petugasCount = {};
    pool.forEach(s => { ketuaCount[s.id]=0; petugasCount[s.id]=0; });
    existing.forEach(p => {
      getKetuaIds(p).forEach(id => { if(ketuaCount[id] !== undefined) ketuaCount[id]++; });
      Object.values(parseHarian(p.petugasHarian)).flat().forEach(id => { if(petugasCount[id] !== undefined) petugasCount[id]++; });
    });

    const ketuaKamarIds = [...pool].sort((a,b)=>ketuaCount[a.id]-ketuaCount[b.id]).slice(0, jmlKetua).map(s=>s.id);

    // Petugas pool EXCLUDES whoever was just picked as Ketua Kamar for this putaran.
    const petugasPool = pool.filter(s => !ketuaKamarIds.includes(s.id));
    const petugasQueue = [...petugasPool].sort((a,b)=>petugasCount[a.id]-petugasCount[b.id]);
    let qi = 0;
    const nextPetugas = () => petugasQueue[qi++ % petugasQueue.length].id;
    const petugasHarian = {};
    const jmlPetugasEfektif = Math.min(jmlPetugas, petugasPool.length) || 1;
    HARI.forEach(h => { petugasHarian[h] = Array.from({length:jmlPetugasEfektif}).map(()=>nextPetugas()); });

    let tanggalMulai;
    if(existing.length){
      const lastStart = existing.map(e=>luxon.DateTime.fromISO(e.tanggalMulai)).sort((a,b)=>b-a)[0];
      tanggalMulai = lastStart.plus({days:7});
    }else{
      let d = luxon.DateTime.now();
      while(d.weekday !== 6) d = d.plus({days:1}); // next Saturday
      tanggalMulai = d;
    }

    await Api.create("piket_putaran", {
      kamarId, putaranKe, tanggalMulai: tanggalMulai.toISODate(),
      ketuaKamarIds: JSON.stringify(ketuaKamarIds), petugasHarian: JSON.stringify(petugasHarian),
    });
    Auth.logAudit("CREATE", `Generate putaran piket ${Cache.kamarName(kamarId)} #${putaranKe}`);
    Utils.toast("success", `Putaran ke-${putaranKe} untuk ${Cache.kamarName(kamarId)} berhasil dibuat`);
    onDone();
  }

  async function openDetail(putaran, onChanged){
    const pool = roomPool(putaran.kamarId);
    const harian = parseHarian(putaran.petugasHarian);
    const ketuaIds = getKetuaIds(putaran);

    const renderBody = () => `
      <div class="text-start">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span class="badge-mbms badge-navy">${Cache.kamarName(putaran.kamarId)}</span>
            <b style="margin-left:6px;color:var(--navy)">Putaran ${putaran.putaranKe}</b>
            <div style="font-size:12px;color:var(--muted)">${periodeLabel(putaran.tanggalMulai)}</div>
          </div>
          <div class="text-end">
            <div style="font-size:11px;color:var(--muted)">Ketua Kamar (${ketuaIds.length})</div>
            <b style="color:var(--navy)">${ketuaIds.map(id=>Cache.siswaName(id)).join(", ") || '-'}</b>
            <button class="btn btn-sm btn-soft-info ms-2" id="btnEditKetua"><i class="fa-solid fa-pen"></i></button>
          </div>
        </div>
        <p style="font-size:11.5px;color:var(--muted);margin-bottom:6px"><i class="fa-solid fa-circle-info me-1"></i>Ketua Kamar tidak muncul di pilihan Petugas Piket.</p>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead><tr><th>Hari</th><th>Petugas Piket</th><th></th></tr></thead>
            <tbody>
              ${HARI.map(h => `<tr>
                <td>${h}</td>
                <td>${(harian[h]||[]).map(id=>Cache.siswaName(id)).join(", ") || '<span class="text-muted">-</span>'} <span class="badge-mbms badge-navy" style="font-size:10px">${(harian[h]||[]).length} orang</span></td>
                <td class="text-end"><button class="btn btn-sm btn-soft-info" data-hari="${h}"><i class="fa-solid fa-pen"></i></button></td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>`;

    const result = await Swal.fire({
      title:"Detail Putaran Piket", html: renderBody(), width:640,
      showDenyButton:true, confirmButtonText:"Tutup", denyButtonText:'<i class="fa-solid fa-print me-1"></i>Cetak PDF', confirmButtonColor:"#0a2540",
      didOpen: () => {
        document.getElementById("btnEditKetua").onclick = () => editKetua(putaran, pool, onChanged);
        document.querySelectorAll("[data-hari]").forEach(btn=>{
          btn.onclick = () => editHari(putaran, btn.dataset.hari, pool, onChanged);
        });
      }
    });
    if(result.isDenied){
      const rows = HARI.map(h => [h, (harian[h]||[]).map(id=>Cache.siswaName(id)).join(", ") || "-"]);
      Reports.exportPdf(`Jadwal Piket - ${Cache.kamarName(putaran.kamarId)} Putaran ${putaran.putaranKe}`, ["Hari","Petugas Piket"], rows);
    }
  }

  async function editKetua(putaran, pool, onChanged){
    const current = getKetuaIds(putaran);
    const result = await Swal.fire({
      title:"Ubah Ketua Kamar", width:420, showCancelButton:true, confirmButtonColor:"#0a2540",
      confirmButtonText:"Simpan", cancelButtonText:"Batal",
      html:`<p style="font-size:12px;color:var(--muted);text-align:left;margin-bottom:8px">Centang siapa saja yang menjadi Ketua Kamar pada putaran ini (bisa lebih dari satu). Mereka otomatis tidak akan muncul di pilihan Petugas Piket.</p>${checkboxList("ketua", pool, current)}`,
      preConfirm: () => readCheckboxList("ketua", pool),
    });
    if(!result.isConfirmed) return;
    if(!result.value.length){ Utils.toast("error","Pilih minimal satu Ketua Kamar"); return; }

    // Remove any newly-selected ketua from the existing daily petugas lists to keep the exclusion rule intact.
    const harian = parseHarian(putaran.petugasHarian);
    Object.keys(harian).forEach(h => { harian[h] = (harian[h]||[]).filter(id => !result.value.includes(id)); });

    await Api.update("piket_putaran", putaran.id, { ketuaKamarIds: JSON.stringify(result.value), petugasHarian: JSON.stringify(harian) });
    Auth.logAudit("UPDATE", `Mengubah ketua kamar putaran ${Cache.kamarName(putaran.kamarId)} #${putaran.putaranKe}`);
    Utils.toast("success","Ketua kamar diperbarui");
    onChanged();
  }

  async function editHari(putaran, hari, pool, onChanged){
    const harian = parseHarian(putaran.petugasHarian);
    const current = harian[hari] || [];
    const ketuaIds = getKetuaIds(putaran);
    const petugasPool = pool.filter(s => !ketuaIds.includes(s.id));
    const result = await Swal.fire({
      title:`Petugas Piket — ${hari}`, width:420, showCancelButton:true, confirmButtonColor:"#0a2540",
      confirmButtonText:"Simpan", cancelButtonText:"Batal",
      html:`<p style="font-size:12px;color:var(--muted);text-align:left;margin-bottom:8px">Centang siapa saja yang bertugas piket hari ${hari} (jumlah bebas). Ketua Kamar tidak ditampilkan di sini.</p>${checkboxList("petugas", petugasPool, current)}`,
      preConfirm: () => readCheckboxList("petugas", petugasPool),
    });
    if(!result.isConfirmed) return;
    harian[hari] = result.value;
    await Api.update("piket_putaran", putaran.id, { petugasHarian: JSON.stringify(harian) });
    Auth.logAudit("UPDATE", `Mengubah petugas piket ${hari} — putaran ${Cache.kamarName(putaran.kamarId)} #${putaran.putaranKe}`);
    Utils.toast("success","Petugas piket diperbarui");
    onChanged();
  }

  Router.register("piket", render);
})();
