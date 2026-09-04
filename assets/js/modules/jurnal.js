/* ==========================================================================
   MBMS — modules/jurnal.js  (Jurnal Mengajar)
   ----------------------------------------------------------------------
   Fully dynamic column/field schema — the admin defines what fields exist
   on a journal entry (label, type, options, required) via "Kelola Kolom
   Jurnal" below; the entries table and add/edit form are both generated
   from that live schema. No fields are hardcoded in this file.

   Data model:
     jurnal_fields:   id, label, type ("text"|"textarea"|"date"|"select"),
                       options (comma-separated, only used for "select"),
                       required ("Ya"|"Tidak"), urutan (sort order)
     jurnal_mengajar: id, data (JSON string: { fieldId: value, ... })
   ========================================================================== */
(function(){

  async function loadFields(){
    return (await Api.list("jurnal_fields")).sort((a,b)=>Number(a.urutan)-Number(b.urutan));
  }
  function parseData(json){ try{ const v = JSON.parse(json||"{}"); return v && typeof v==="object" ? v : {}; }catch(e){ return {}; } }

  /* ============================== Kelola Kolom (field manager) ============================== */

  async function renderFieldManager(){
    const fields = await loadFields();
    return `<div class="card-mbms mb-4">
      <div class="card-header-mbms"><h6><i class="fa-solid fa-table-columns me-2" style="color:var(--gold)"></i>Kelola Kolom Jurnal</h6></div>
      <div class="card-body-mbms">
        <p style="font-size:12px;color:var(--muted);margin-bottom:10px">Atur sendiri kolom/field yang ada pada form jurnal — tambah, ubah, hapus, atau urutkan sesuai kebutuhan.</p>
        <div id="fieldList">
          ${fields.map((f,i)=>`<div class="d-flex align-items-center gap-2 mb-2 p-2" style="background:var(--bg);border-radius:8px" data-field-id="${f.id}">
            <div class="d-flex flex-column">
              <button class="btn btn-sm btn-soft-info py-0 px-1" style="font-size:10px" data-move="up" data-id="${f.id}" ${i===0?'disabled':''}><i class="fa-solid fa-chevron-up"></i></button>
              <button class="btn btn-sm btn-soft-info py-0 px-1" style="font-size:10px" data-move="down" data-id="${f.id}" ${i===fields.length-1?'disabled':''}><i class="fa-solid fa-chevron-down"></i></button>
            </div>
            <div class="flex-fill">
              <b style="font-size:13px;color:var(--navy)">${Utils.escapeHtml(f.label)}</b>
              <span class="badge-mbms badge-navy ms-1" style="font-size:10px">${f.type}</span>
              ${f.required==='Ya' ? '<span class="badge-mbms badge-warning ms-1" style="font-size:10px">wajib</span>' : ''}
              ${f.type==='select' ? `<div style="font-size:11px;color:var(--muted)">Opsi: ${Utils.escapeHtml(f.options||'-')}</div>` : ''}
            </div>
            <button class="btn btn-sm btn-soft-info" data-field-edit="${f.id}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-soft-danger" data-field-del="${f.id}"><i class="fa-solid fa-trash"></i></button>
          </div>`).join("") || `<p class="text-muted mb-0" style="font-size:12px">Belum ada kolom. Tambahkan kolom pertama di bawah.</p>`}
        </div>
        <button class="btn btn-outline-navy btn-sm mt-2" id="btnAddField"><i class="fa-solid fa-plus me-1"></i>Tambah Kolom</button>
      </div>
    </div>`;
  }

  function fieldFormHtml(f={}){
    return `<div class="row g-3 text-start">
      <div class="col-12"><label class="form-label-mbms">Nama Kolom</label><input id="ff_label" class="form-control form-control-mbms" style="padding-left:16px" value="${f.label||''}" placeholder="mis. Mata Pelajaran"></div>
      <div class="col-6"><label class="form-label-mbms">Tipe Input</label>
        <select id="ff_type" class="form-select form-control-mbms" style="padding-left:16px">
          <option value="text" ${f.type==='text'?'selected':''}>Teks Singkat</option>
          <option value="textarea" ${f.type==='textarea'?'selected':''}>Teks Panjang</option>
          <option value="date" ${f.type==='date'?'selected':''}>Tanggal</option>
          <option value="select" ${f.type==='select'?'selected':''}>Pilihan (Dropdown)</option>
        </select></div>
      <div class="col-6"><label class="form-label-mbms">Wajib Diisi?</label>
        <select id="ff_required" class="form-select form-control-mbms" style="padding-left:16px">
          <option value="Ya" ${f.required==='Ya'?'selected':''}>Ya</option>
          <option value="Tidak" ${f.required!=='Ya'?'selected':''}>Tidak</option>
        </select></div>
      <div class="col-12" id="ff_optionsWrap" style="${f.type==='select'?'':'display:none'}">
        <label class="form-label-mbms">Pilihan (pisahkan dengan koma)</label>
        <input id="ff_options" class="form-control form-control-mbms" style="padding-left:16px" value="${f.options||''}" placeholder="mis. Fiqih,Hadits,Bahasa Arab,Muhadhoroh,Doa Harian & Praktik Ibadah,Imla">
      </div>
    </div>`;
  }

  async function openFieldForm(field, onSaved){
    const isEdit = !!field;
    const result = await Swal.fire({
      title: isEdit ? "Edit Kolom" : "Tambah Kolom", width:500, showCancelButton:true,
      confirmButtonColor:"#0a2540", confirmButtonText:"Simpan", cancelButtonText:"Batal",
      html: fieldFormHtml(field||{}),
      didOpen: () => {
        document.getElementById("ff_type").onchange = (e) => {
          document.getElementById("ff_optionsWrap").style.display = e.target.value === "select" ? "" : "none";
        };
      },
      preConfirm: () => {
        const label = document.getElementById("ff_label").value.trim();
        const type = document.getElementById("ff_type").value;
        const required = document.getElementById("ff_required").value;
        const options = document.getElementById("ff_options").value.trim();
        if(!label){ Swal.showValidationMessage("Isi nama kolom"); return false; }
        if(type==="select" && !options){ Swal.showValidationMessage("Isi pilihan untuk tipe Dropdown"); return false; }
        return { label, type, required, options: type==="select" ? options : "" };
      }
    });
    if(!result.isConfirmed) return;
    if(isEdit) await Api.update("jurnal_fields", field.id, result.value);
    else{
      const existing = await loadFields();
      await Api.create("jurnal_fields", { ...result.value, urutan: existing.length + 1 });
    }
    Utils.toast("success","Kolom disimpan");
    onSaved();
  }

  function wireFieldManager(onChanged){
    document.getElementById("btnAddField").onclick = () => openFieldForm(null, onChanged);
    document.querySelectorAll("[data-field-edit]").forEach(btn=>{
      btn.onclick = async () => {
        const fields = await loadFields();
        openFieldForm(fields.find(f=>f.id===btn.dataset.fieldEdit), onChanged);
      };
    });
    document.querySelectorAll("[data-field-del]").forEach(btn=>{
      btn.onclick = async () => {
        const ok = await Utils.confirmDelete("kolom ini (data lama pada kolom ini akan tersembunyi, bukan terhapus)");
        if(!ok) return;
        await Api.remove("jurnal_fields", btn.dataset.fieldDel);
        Utils.toast("success","Kolom dihapus");
        onChanged();
      };
    });
    document.querySelectorAll("[data-move]").forEach(btn=>{
      btn.onclick = async () => {
        const fields = await loadFields();
        const idx = fields.findIndex(f=>f.id===btn.dataset.id);
        const swapWith = btn.dataset.move === "up" ? idx-1 : idx+1;
        if(swapWith<0 || swapWith>=fields.length) return;
        const a = fields[idx], b = fields[swapWith];
        await Api.update("jurnal_fields", a.id, { urutan: b.urutan });
        await Api.update("jurnal_fields", b.id, { urutan: a.urutan });
        onChanged();
      };
    });
  }

  /* ============================== Entries table (dynamic columns) ============================== */

  let entryDt = null;
  async function reloadEntries(onChanged){
    const fields = await loadFields();
    const entries = (await Api.list("jurnal_mengajar")).sort((a,b)=>(b.id||"").localeCompare(a.id||""));

    document.querySelector("#jurnalTable thead").innerHTML = `<tr>
      <th style="width:48px">No</th>
      ${fields.map(f=>`<th>${Utils.escapeHtml(f.label)}</th>`).join("")}
      <th>Aksi</th>
    </tr>`;

    if(entryDt){ entryDt.destroy(); entryDt = null; }
    document.querySelector("#jurnalTable tbody").innerHTML = entries.map(e=>{
      const data = parseData(e.data);
      return `<tr>
        <td></td>
        ${fields.map(f=>{
          const val = data[f.id];
          const display = f.type==="date" ? Utils.fmtDate(val) : Utils.escapeHtml(val||"-");
          return `<td>${display}</td>`;
        }).join("")}
        <td class="text-nowrap">
          <button class="btn btn-sm btn-soft-info me-1" data-act="edit" data-id="${e.id}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-soft-danger" data-act="delete" data-id="${e.id}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
    }).join("") || `<tr><td colspan="${fields.length+2}" class="text-center text-muted py-4">Belum ada entri jurnal</td></tr>`;

    document.querySelectorAll("#jurnalTable [data-act]").forEach(btn=>{
      btn.onclick = async () => {
        const entry = entries.find(e=>e.id===btn.dataset.id);
        if(btn.dataset.act==="edit") return openEntryForm(entry, onChanged);
        const ok = await Utils.confirmDelete("entri jurnal ini");
        if(!ok) return;
        await Api.remove("jurnal_mengajar", entry.id);
        Utils.toast("success","Entri jurnal dihapus");
        onChanged();
      };
    });

    if(entries.length){
      entryDt = $("#jurnalTable").DataTable({ pageLength:10, columnDefs:[TableUtil.numberColumnDef(0), {orderable:false,targets:-1}], language:{search:"Cari:",zeroRecords:"Data tidak ditemukan"} });
    }
  }

  function dynamicInput(f, value=""){
    const req = f.required==="Ya" ? "required" : "";
    if(f.type==="select"){
      const opts = (f.options||"").split(",").map(o=>o.trim()).filter(Boolean);
      return `<select class="form-select form-control-mbms" style="padding-left:16px" id="ef_${f.id}" ${req}>
        <option value="">Pilih ${Utils.escapeHtml(f.label)}</option>
        ${opts.map(o=>`<option value="${Utils.escapeHtml(o)}" ${value===o?'selected':''}>${Utils.escapeHtml(o)}</option>`).join("")}
      </select>`;
    }
    if(f.type==="textarea"){
      return `<textarea class="form-control form-control-mbms" style="padding-left:16px;height:auto;padding-top:10px" rows="3" id="ef_${f.id}" ${req}>${Utils.escapeHtml(value)}</textarea>`;
    }
    return `<input type="${f.type}" class="form-control form-control-mbms" style="padding-left:16px" id="ef_${f.id}" value="${Utils.escapeHtml(value)}" ${req}>`;
  }

  async function openEntryForm(entry, onSaved){
    const isEdit = !!entry;
    const fields = await loadFields();
    if(!fields.length){ Utils.toast("error","Tambahkan minimal satu kolom di 'Kelola Kolom Jurnal' terlebih dahulu"); return; }
    const data = parseData(entry?.data);

    const result = await Swal.fire({
      title: isEdit ? "Edit Entri Jurnal" : "Tambah Entri Jurnal", width:620, showCancelButton:true,
      confirmButtonColor:"#0a2540", confirmButtonText: isEdit?"Simpan Perubahan":"Simpan", cancelButtonText:"Batal",
      html:`<div class="row g-3 text-start">
        ${fields.map(f=>`<div class="col-${f.type==='textarea'?12:6}">
          <label class="form-label-mbms">${Utils.escapeHtml(f.label)}${f.required==='Ya'?' <span style="color:var(--danger)">*</span>':''}</label>
          ${dynamicInput(f, data[f.id]||"")}
        </div>`).join("")}
      </div>`,
      preConfirm: () => {
        const newData = {};
        let missing = [];
        fields.forEach(f=>{
          const el = document.getElementById(`ef_${f.id}`);
          newData[f.id] = el.value;
          if(f.required==='Ya' && !el.value) missing.push(f.label);
        });
        if(missing.length){ Swal.showValidationMessage("Lengkapi: " + missing.join(", ")); return false; }
        return { data: JSON.stringify(newData) };
      }
    });
    if(!result.isConfirmed) return;
    if(isEdit) await Api.update("jurnal_mengajar", entry.id, result.value);
    else await Api.create("jurnal_mengajar", result.value);
    Auth.logAudit(isEdit?"UPDATE":"CREATE", "Entri jurnal mengajar");
    Utils.toast("success","Entri jurnal disimpan");
    onSaved();
  }

  /* ============================== Main page ============================== */

  async function render(container){
    await Cache.refresh();
    container.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <div><h3><i class="fa-solid fa-book-open" style="color:var(--gold);margin-right:8px"></i>Jurnal Mengajar</h3>
          <p>Jurnal per sesi mengajar dengan kolom yang bisa diatur sepenuhnya sesuai kebutuhan</p></div>
          <button class="btn btn-navy" id="btnAddEntry"><i class="fa-solid fa-plus me-1"></i>Tambah Entri Jurnal</button>
        </div>
        <div id="fieldManagerWrap"></div>
        <div class="card-mbms">
          <div class="card-header-mbms"><h6>Daftar Entri Jurnal</h6></div>
          <div class="card-body-mbms">
            <div class="table-responsive">
              <table class="table table-hover align-middle" id="jurnalTable" style="width:100%">
                <thead></thead><tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;

    const reloadAll = async () => {
      document.getElementById("fieldManagerWrap").innerHTML = await renderFieldManager();
      wireFieldManager(reloadAll);
      await reloadEntries(reloadAll);
    };
    document.getElementById("btnAddEntry").onclick = () => openEntryForm(null, reloadAll);
    reloadAll();
  }

  Router.register("jurnal", render);
})();
