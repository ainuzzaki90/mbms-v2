/* ==========================================================================
   MBMS — modules/kosakata.js  (Kosakata Harian)
   ----------------------------------------------------------------------
   Two sections on one page:
   1. Bank Kosakata — the school's saved daily-vocab entries (Indonesia/
      Arab/Inggris + contoh kalimat). The "Generate" button looks up the
      typed Indonesian word in the local dictionary (data/kosakataDictionary
      .js) and auto-fills the Arabic/English translation + example
      sentences — editable before saving. Unknown words simply prompt
      manual entry, which then becomes part of the school's own bank.
   2. Setoran Hafalan Siswa — flexible record of which student recited
      which words on a given day (any number of words per session), with
      a nilai/predikat and free-text petugas (NOT tied to any fixed role
      such as Ketua Kamar).
   ========================================================================== */
(function(){

  /* ============================== Bank Kosakata ============================== */

  async function renderBankSection(){
    return `<div class="card-mbms mb-4">
      <div class="card-header-mbms">
        <h6><i class="fa-solid fa-book-open me-2" style="color:var(--gold)"></i>Bank Kosakata</h6>
        <button class="btn btn-navy btn-sm" id="btnAddKosakata"><i class="fa-solid fa-plus me-1"></i>Tambah Kosakata</button>
      </div>
      <div class="card-body-mbms">
        <div class="table-responsive">
          <table class="table table-hover align-middle" id="kosakataTable" style="width:100%">
            <thead><tr><th style="width:48px">No</th><th>Kategori</th><th>Indonesia</th><th>Arab</th><th>Inggris</th><th>Aksi</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  let bankDt = null;
  async function reloadBank(onChanged){
    const rows = (await Api.list("kosakata")).sort((a,b)=> (b.id||"").localeCompare(a.id||""));
    if(bankDt){ bankDt.destroy(); bankDt = null; }
    document.querySelector("#kosakataTable tbody").innerHTML = rows.map(r=>`<tr>
      <td></td>
      <td><span class="badge-mbms badge-navy">${Utils.escapeHtml(r.kategori||'-')}</span></td>
      <td><b style="color:var(--navy)">${Utils.escapeHtml(r.kataIndonesia)}</b></td>
      <td class="text-arabic">${Utils.escapeHtml(r.kataArab||'-')}</td>
      <td>${Utils.escapeHtml(r.kataInggris||'-')}</td>
      <td class="text-nowrap">
        <button class="btn btn-sm btn-soft-info me-1" data-act="edit" data-id="${r.id}"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-sm btn-soft-danger" data-act="delete" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`).join("") || `<tr><td colspan="6" class="text-center text-muted py-4">Belum ada kosakata. Klik "Tambah Kosakata" untuk mulai.</td></tr>`;

    document.querySelectorAll("#kosakataTable [data-act]").forEach(btn=>{
      btn.onclick = async () => {
        const row = rows.find(r=>r.id===btn.dataset.id);
        if(btn.dataset.act==="edit") return openKosakataForm(row, onChanged);
        const ok = await Utils.confirmDelete(row.kataIndonesia);
        if(!ok) return;
        await Api.remove("kosakata", row.id);
        Utils.toast("success","Kosakata dihapus");
        onChanged();
      };
    });

    if(rows.length){
      bankDt = $("#kosakataTable").DataTable({ pageLength:10, columnDefs:[TableUtil.numberColumnDef(0), {orderable:false,targets:5}], language:{search:"Cari:",zeroRecords:"Data tidak ditemukan"} });
    }
  }

  async function openKosakataForm(row, onSaved){
    const isEdit = !!row;
    let auto = { kategori: row?.kategori||"", arab: row?.kataArab||"", contohArab: row?.contohArab||"", inggris: row?.kataInggris||"", contohInggris: row?.contohInggris||"" };

    const result = await Swal.fire({
      title: isEdit ? "Edit Kosakata" : "Tambah Kosakata", width:600, showCancelButton:true,
      confirmButtonColor:"#0a2540", confirmButtonText: isEdit?"Simpan Perubahan":"Simpan", cancelButtonText:"Batal",
      html:`<div class="row g-3 text-start">
        <div class="col-12">
          <label class="form-label-mbms">Kata Indonesia</label>
          <div class="d-flex gap-2">
            <input id="f_indo" class="form-control form-control-mbms" style="padding-left:16px" value="${row?.kataIndonesia||''}" placeholder="mis. makan, sabar, sekolah...">
            <button type="button" class="btn btn-gold text-nowrap" id="btnGenerate"><i class="fa-solid fa-wand-magic-sparkles me-1"></i>Generate</button>
          </div>
          <small id="genHint" style="font-size:11px;color:var(--muted)"></small>
        </div>
        <div class="col-6"><label class="form-label-mbms">Kategori</label><input id="f_kategori" class="form-control form-control-mbms" style="padding-left:16px" value="${auto.kategori}"></div>
        <div class="col-6"></div>
        <div class="col-6"><label class="form-label-mbms">Kata Arab</label><input id="f_arab" class="form-control form-control-mbms text-arabic" style="padding-left:16px" value="${auto.arab}"></div>
        <div class="col-6"><label class="form-label-mbms">Kata Inggris</label><input id="f_inggris" class="form-control form-control-mbms" style="padding-left:16px" value="${auto.inggris}"></div>
        <div class="col-6"><label class="form-label-mbms">Contoh Kalimat (Arab)</label><textarea id="f_contohArab" class="form-control form-control-mbms text-arabic" style="padding-left:16px;height:auto;padding-top:10px" rows="2">${auto.contohArab}</textarea></div>
        <div class="col-6"><label class="form-label-mbms">Contoh Kalimat (Inggris)</label><textarea id="f_contohInggris" class="form-control form-control-mbms" style="padding-left:16px;height:auto;padding-top:10px" rows="2">${auto.contohInggris}</textarea></div>
      </div>`,
      didOpen: () => {
        document.getElementById("btnGenerate").onclick = () => {
          const kata = document.getElementById("f_indo").value.trim();
          if(!kata){ Utils.toast("error","Ketik kata Indonesia dulu"); return; }
          const found = findTranslation(kata);
          const hint = document.getElementById("genHint");
          if(found){
            document.getElementById("f_kategori").value = found.kategori;
            document.getElementById("f_arab").value = found.arab;
            document.getElementById("f_contohArab").value = found.contohArab;
            document.getElementById("f_inggris").value = found.inggris;
            document.getElementById("f_contohInggris").value = found.contohInggris;
            hint.style.color = "var(--success)";
            hint.textContent = "✓ Ditemukan di kamus lokal — silakan periksa & sesuaikan bila perlu.";
          }else{
            hint.style.color = "var(--warning)";
            hint.textContent = "Kata belum ada di kamus lokal — silakan isi terjemahan secara manual di bawah.";
          }
        };
      },
      preConfirm: () => {
        const data = {
          kataIndonesia: document.getElementById("f_indo").value.trim(),
          kategori: document.getElementById("f_kategori").value.trim(),
          kataArab: document.getElementById("f_arab").value.trim(),
          contohArab: document.getElementById("f_contohArab").value.trim(),
          kataInggris: document.getElementById("f_inggris").value.trim(),
          contohInggris: document.getElementById("f_contohInggris").value.trim(),
        };
        if(!data.kataIndonesia){ Swal.showValidationMessage("Isi kata Indonesia"); return false; }
        return data;
      }
    });
    if(!result.isConfirmed) return;
    if(isEdit) await Api.update("kosakata", row.id, result.value);
    else await Api.create("kosakata", result.value);
    Auth.logAudit(isEdit?"UPDATE":"CREATE", `Kosakata: ${result.value.kataIndonesia}`);
    Utils.toast("success","Kosakata disimpan");
    onSaved();
  }

  /* ============================== Setoran Hafalan ============================== */

  function nilaiBadge(n){
    const cls = n==="Lancar" ? "badge-success" : n==="Cukup" ? "badge-warning" : "badge-danger";
    return `<span class="badge-mbms ${cls}">${n}</span>`;
  }

  async function renderSetoranSection(){
    return `<div class="card-mbms">
      <div class="card-header-mbms">
        <h6><i class="fa-solid fa-clipboard-check me-2" style="color:var(--gold)"></i>Setoran Hafalan Siswa</h6>
        <button class="btn btn-navy btn-sm" id="btnAddSetoran"><i class="fa-solid fa-plus me-1"></i>Tambah Setoran</button>
      </div>
      <div class="card-body-mbms">
        <div class="table-responsive">
          <table class="table table-hover align-middle" id="setoranTable" style="width:100%">
            <thead><tr><th style="width:48px">No</th><th>Tanggal</th><th>Siswa</th><th>Jumlah Kata</th><th>Nilai</th><th>Petugas</th><th>Aksi</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  let setoranDt = null;
  async function reloadSetoran(onChanged){
    const rows = (await Api.list("setoran_hafalan")).sort((a,b)=>b.tanggal.localeCompare(a.tanggal));
    if(setoranDt){ setoranDt.destroy(); setoranDt = null; }
    document.querySelector("#setoranTable tbody").innerHTML = rows.map(r=>{
      let kataIds = []; try{ kataIds = JSON.parse(r.kosakataIds||"[]"); }catch(e){}
      return `<tr>
        <td></td>
        <td>${Utils.fmtDate(r.tanggal)}</td>
        <td><b style="color:var(--navy)">${Cache.siswaName(r.siswaId)}</b></td>
        <td>${kataIds.length} kata</td>
        <td>${nilaiBadge(r.nilai)}</td>
        <td>${Utils.escapeHtml(r.petugas||'-')}</td>
        <td class="text-nowrap">
          <button class="btn btn-sm btn-outline-navy me-1" data-act="lihat" data-id="${r.id}"><i class="fa-solid fa-eye"></i></button>
          <button class="btn btn-sm btn-soft-danger" data-act="delete" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
    }).join("") || `<tr><td colspan="7" class="text-center text-muted py-4">Belum ada setoran hafalan</td></tr>`;

    document.querySelectorAll("#setoranTable [data-act]").forEach(btn=>{
      btn.onclick = async () => {
        const row = rows.find(r=>r.id===btn.dataset.id);
        if(btn.dataset.act==="lihat") return lihatSetoran(row);
        const ok = await Utils.confirmDelete("catatan setoran ini");
        if(!ok) return;
        await Api.remove("setoran_hafalan", row.id);
        Utils.toast("success","Catatan setoran dihapus");
        onChanged();
      };
    });

    if(rows.length){
      setoranDt = $("#setoranTable").DataTable({ pageLength:10, columnDefs:[TableUtil.numberColumnDef(0), {orderable:false,targets:6}], language:{search:"Cari:",zeroRecords:"Data tidak ditemukan"} });
    }
  }

  async function lihatSetoran(row){
    let kataIds = []; try{ kataIds = JSON.parse(row.kosakataIds||"[]"); }catch(e){}
    const bank = await Api.list("kosakata");
    const kataList = kataIds.map(id => bank.find(k=>k.id===id)).filter(Boolean);
    Swal.fire({
      title:`Setoran — ${Cache.siswaName(row.siswaId)}`, confirmButtonColor:"#0a2540", confirmButtonText:"Tutup",
      html:`<div class="text-start">
        <p style="font-size:12.5px;color:var(--muted)">${Utils.fmtDate(row.tanggal)} · ${nilaiBadge(row.nilai)} · Petugas: ${Utils.escapeHtml(row.petugas||'-')}</p>
        <ul style="padding-left:18px;font-size:13px">
          ${kataList.map(k=>`<li><b>${Utils.escapeHtml(k.kataIndonesia)}</b> — <span class="text-arabic">${Utils.escapeHtml(k.kataArab||'-')}</span> / ${Utils.escapeHtml(k.kataInggris||'-')}</li>`).join("") || "<li class='text-muted'>Tidak ada kata tercatat</li>"}
        </ul>
        ${row.catatan ? `<p style="font-size:12.5px"><b>Catatan:</b> ${Utils.escapeHtml(row.catatan)}</p>` : ""}
      </div>`,
    });
  }

  async function openSetoranForm(onSaved){
    const bank = await Api.list("kosakata");
    if(!bank.length){ Utils.toast("error","Tambahkan kosakata ke Bank Kosakata terlebih dahulu"); return; }

    const result = await Swal.fire({
      title:"Tambah Setoran Hafalan", width:560, showCancelButton:true,
      confirmButtonColor:"#0a2540", confirmButtonText:"Simpan", cancelButtonText:"Batal",
      html:`<div class="row g-3 text-start">
        <div class="col-6"><label class="form-label-mbms">Tanggal</label><input type="date" id="f_tgl" class="form-control form-control-mbms" style="padding-left:16px" value="${luxon.DateTime.now().toISODate()}"></div>
        <div class="col-6"><label class="form-label-mbms">Siswa</label><select id="f_siswa" class="form-select form-control-mbms" style="padding-left:16px">${Cache.allSiswa().map(s=>`<option value="${s.id}">${s.nama}</option>`).join("")}</select></div>
        <div class="col-12">
          <label class="form-label-mbms">Kata yang Disetorkan (jumlah bebas, biasanya 3 kata/hari)</label>
          <div style="max-height:180px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:10px">
            ${bank.map(k=>`<div class="form-check">
              <input class="form-check-input" type="checkbox" value="${k.id}" id="kw_${k.id}">
              <label class="form-check-label" for="kw_${k.id}" style="font-size:13px">${Utils.escapeHtml(k.kataIndonesia)} <span class="text-muted">(${Utils.escapeHtml(k.kategori||'-')})</span></label>
            </div>`).join("")}
          </div>
        </div>
        <div class="col-6"><label class="form-label-mbms">Nilai</label><select id="f_nilai" class="form-select form-control-mbms" style="padding-left:16px">
          <option>Lancar</option><option>Cukup</option><option>Perlu Bimbingan</option></select></div>
        <div class="col-6"><label class="form-label-mbms">Petugas</label><input id="f_petugas" class="form-control form-control-mbms" style="padding-left:16px" value="${Session.get().nama}"></div>
        <div class="col-12"><label class="form-label-mbms">Catatan (opsional)</label><input id="f_catatan" class="form-control form-control-mbms" style="padding-left:16px"></div>
      </div>`,
      preConfirm: () => {
        const kosakataIds = bank.filter(k => document.getElementById(`kw_${k.id}`)?.checked).map(k=>k.id);
        if(!kosakataIds.length){ Swal.showValidationMessage("Pilih minimal satu kata yang disetorkan"); return false; }
        return {
          tanggal: document.getElementById("f_tgl").value,
          siswaId: document.getElementById("f_siswa").value,
          kosakataIds: JSON.stringify(kosakataIds),
          nilai: document.getElementById("f_nilai").value,
          petugas: document.getElementById("f_petugas").value,
          catatan: document.getElementById("f_catatan").value,
        };
      }
    });
    if(!result.isConfirmed) return;
    await Api.create("setoran_hafalan", result.value);
    Auth.logAudit("CREATE", `Setoran hafalan ${Cache.siswaName(result.value.siswaId)}`);
    Utils.toast("success","Setoran hafalan disimpan");
    onSaved();
  }

  /* ============================== Main page ============================== */

  async function render(container){
    await Cache.refresh();
    container.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <div><h3><i class="fa-solid fa-language" style="color:var(--gold);margin-right:8px"></i>Kosakata Harian</h3>
          <p>Bank kosakata Arab &amp; Inggris dengan generate otomatis, plus pencatatan setoran hafalan siswa</p></div>
        </div>
        <div id="bankSection"></div>
        <div id="setoranSection"></div>
      </div>`;

    document.getElementById("bankSection").innerHTML = await renderBankSection();
    document.getElementById("setoranSection").innerHTML = await renderSetoranSection();

    const reloadAll = async () => {
      await reloadBank(reloadAll);
      await reloadSetoran(reloadAll);
    };
    document.getElementById("btnAddKosakata").onclick = () => openKosakataForm(null, reloadAll);
    document.getElementById("btnAddSetoran").onclick = () => openSetoranForm(reloadAll);
    reloadAll();
  }

  Router.register("kosakata", render);
})();
