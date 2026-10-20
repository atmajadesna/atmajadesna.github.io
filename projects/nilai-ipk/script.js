/* =========================================================
   CATATAN NILAI & IPK — script.js
   Hitung IP semester: IP = total mutu / total SKS
   ========================================================= */

(function () {
  "use strict";

  const STORE_KEY = "aza-nilai-v1";
  const THEME_KEY = "portfolio-theme";

  /* Skala nilai (bobot mutu) — umum dipakai di kampus Indonesia */
  const BOBOT = { A: 4.0, AB: 3.5, B: 3.0, BC: 2.5, C: 2.0, D: 1.0, E: 0.0 };

  /* ---------- ELEMEN ---------- */
  const form = document.getElementById("matkulForm");
  const inputNama = document.getElementById("namaMatkul");
  const inputSks = document.getElementById("sksMatkul");
  const inputNilai = document.getElementById("nilaiMatkul");

  const tbody = document.getElementById("tbodyMatkul");
  const tabel = document.getElementById("tabelMatkul");
  const emptyState = document.getElementById("emptyState");
  const btnHapusSemua = document.getElementById("btnHapusSemua");

  const ipValue = document.getElementById("ipValue");
  const predikatEl = document.getElementById("predikat");
  const totalSksEl = document.getElementById("totalSks");
  const totalMutuEl = document.getElementById("totalMutu");
  const jumlahMatkulEl = document.getElementById("jumlahMatkul");
  const scaleList = document.getElementById("scaleList");

  /* ---------- STATE ---------- */
  let daftar = [];

  /* =========================================================
     1. PENYIMPANAN
     ========================================================= */

  function simpan() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(daftar));
    } catch (e) { /* diabaikan */ }
  }

  function muat() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data)) return [];

      // bersihkan data yang bentuknya aneh
      return data.filter(function (m) {
        return m && typeof m.nama === "string" && BOBOT[m.nilai] !== undefined;
      });
    } catch (e) {
      return [];
    }
  }

  /* =========================================================
     2. HITUNGAN
     ========================================================= */

  function hitung() {
    let totalSks = 0;
    let totalMutu = 0;

    daftar.forEach(function (m) {
      const sks = Number(m.sks) || 0;
      const bobot = BOBOT[m.nilai] !== undefined ? BOBOT[m.nilai] : 0;
      totalSks += sks;
      totalMutu += sks * bobot;
    });

    const ip = totalSks > 0 ? totalMutu / totalSks : 0;
    return { totalSks: totalSks, totalMutu: totalMutu, ip: ip };
  }

  function predikat(ip, adaData) {
    if (!adaData) return "—";
    if (ip >= 3.51) return "Dengan Pujian";
    if (ip >= 3.01) return "Sangat Memuaskan";
    if (ip >= 2.76) return "Memuaskan";
    if (ip >= 2.00) return "Cukup";
    return "Perlu Perbaikan";
  }

  /* =========================================================
     3. RENDER
     ========================================================= */

  function render() {
    const h = hitung();
    const adaData = daftar.length > 0;

    // ringkasan
    ipValue.textContent = h.ip.toFixed(2);
    predikatEl.textContent = predikat(h.ip, adaData);
    totalSksEl.textContent = String(h.totalSks);
    totalMutuEl.textContent = h.totalMutu % 1 === 0
      ? String(h.totalMutu)
      : h.totalMutu.toFixed(2);
    jumlahMatkulEl.textContent = String(daftar.length);

    // tabel
    tbody.innerHTML = "";

    daftar.forEach(function (m) {
      const sks = Number(m.sks) || 0;
      const bobot = BOBOT[m.nilai];
      const mutu = sks * bobot;

      const tr = document.createElement("tr");

      const tdNama = document.createElement("td");
      tdNama.className = "matkul-nama";
      tdNama.textContent = m.nama;

      const tdSks = document.createElement("td");
      tdSks.className = "num";
      tdSks.textContent = String(sks);

      const tdNilai = document.createElement("td");
      tdNilai.className = "num";
      const pill = document.createElement("span");
      pill.className = "nilai-pill nilai-" + m.nilai.toLowerCase();
      pill.textContent = m.nilai;
      tdNilai.appendChild(pill);

      const tdBobot = document.createElement("td");
      tdBobot.className = "num";
      tdBobot.textContent = bobot.toFixed(2);

      const tdMutu = document.createElement("td");
      tdMutu.className = "num";
      tdMutu.textContent = mutu % 1 === 0 ? String(mutu) : mutu.toFixed(2);

      const tdAct = document.createElement("td");
      tdAct.className = "act";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-hapus";
      btn.innerHTML = "&times;";
      btn.setAttribute("aria-label", "Hapus " + m.nama);
      btn.addEventListener("click", function () {
        daftar = daftar.filter(function (x) { return x.id !== m.id; });
        simpan();
        render();
      });
      tdAct.appendChild(btn);

      tr.appendChild(tdNama);
      tr.appendChild(tdSks);
      tr.appendChild(tdNilai);
      tr.appendChild(tdBobot);
      tr.appendChild(tdMutu);
      tr.appendChild(tdAct);

      tbody.appendChild(tr);
    });

    tabel.hidden = !adaData;
    emptyState.hidden = adaData;
    btnHapusSemua.hidden = !adaData;
  }

  function renderSkala() {
    scaleList.innerHTML = "";
    Object.keys(BOBOT).forEach(function (k) {
      const li = document.createElement("li");
      const pill = document.createElement("span");
      pill.className = "nilai-pill nilai-" + k.toLowerCase();
      pill.textContent = k;
      li.appendChild(pill);
      li.appendChild(document.createTextNode("= " + BOBOT[k].toFixed(2)));
      scaleList.appendChild(li);
    });
  }

  /* =========================================================
     4. TAMBAH DATA
     ========================================================= */

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = inputNama.value.trim();
    const sks = parseInt(inputSks.value, 10);
    const nilai = inputNilai.value;

    if (!nama) { inputNama.focus(); return; }
    if (!sks || sks < 1 || sks > 6) {
      alert("SKS harus antara 1 sampai 6.");
      inputSks.focus();
      return;
    }
    if (BOBOT[nilai] === undefined) return;

    daftar.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nama: nama,
      sks: sks,
      nilai: nilai
    });

    simpan();
    render();

    // reset nama biar cepat input berikutnya
    inputNama.value = "";
    inputNama.focus();
  });

  btnHapusSemua.addEventListener("click", function () {
    if (daftar.length === 0) return;
    if (confirm("Hapus semua " + daftar.length + " mata kuliah?")) {
      daftar = [];
      simpan();
      render();
    }
  });

  /* =========================================================
     5. TEMA
     ========================================================= */

  function initTema() {
    let tersimpan = null;
    try { tersimpan = localStorage.getItem(THEME_KEY); } catch (e) { /* */ }

    if (tersimpan === "light" || tersimpan === "dark") {
      document.documentElement.setAttribute("data-theme", tersimpan);
    } else {
      const terang = window.matchMedia("(prefers-color-scheme: light)").matches;
      document.documentElement.setAttribute("data-theme", terang ? "light" : "dark");
    }

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", function () {
        const now = document.documentElement.getAttribute("data-theme") || "dark";
        const next = now === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* */ }
      });
    }
  }

  /* =========================================================
     6. INIT
     ========================================================= */

  document.addEventListener("DOMContentLoaded", function () {
    initTema();
    renderSkala();
    daftar = muat();
    render();
  });
})();
