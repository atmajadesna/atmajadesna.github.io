/* =========================================================
   KALKULATOR — script.js
   Evaluator ekspresi buatan sendiri (tanpa eval / new Function),
   supaya aman dan sekalian jadi latihan logika.
   ========================================================= */

(function () {
  "use strict";

  const THEME_KEY = "portfolio-theme";
  const HIST_KEY = "aza-calc-history";
  const MAX_HISTORY = 20;

  const exprEl = document.getElementById("expr");
  const resultEl = document.getElementById("result");
  const historyList = document.getElementById("historyList");
  const historyEmpty = document.getElementById("historyEmpty");
  const clearBtn = document.getElementById("clearHistory");

  /* ---------- STATE ---------- */
  let expr = "";            // ekspresi yang sedang diketik
  let barisAtas = "";       // teks baris atas
  let barisHasil = "0";     // teks baris hasil
  let setelahSamaDengan = false;
  let riwayat = [];

  /* =========================================================
     1. EVALUATOR — hitung ekspresi tanpa eval()
     ========================================================= */

  /**
   * Hitung ekspresi matematika sederhana.
   * Didukung: angka desimal, + − × ÷ %, dan minus di awal.
   * Melempar Error kalau ekspresi tidak valid.
   */
  function evaluasi(teks) {
    if (!teks) throw new Error("Kosong");

    // normalisasi simbol tampilan jadi operator biasa
    const raw = teks
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/\s+/g, "");

    // hanya boleh angka, titik, dan operator
    if (!/^[0-9+\-*/.%]+$/.test(raw)) throw new Error("Karakter tidak valid");

    // pecah jadi token: angka (termasuk desimal) atau operator
    const tokens = raw.match(/(?:\d+\.?\d*|\.\d+)|[+\-*/%]/g);
    if (!tokens) throw new Error("Tidak ada angka");

    // --- ubah token jadi deret angka & operator ---
    const deret = [];
    let butuhAngka = true;

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];

      if (/^[\d.]/.test(t)) {
        const n = parseFloat(t);
        if (isNaN(n)) throw new Error("Angka tidak valid");
        deret.push(n);
        butuhAngka = false;
      } else if (t === "%") {
        if (butuhAngka) throw new Error("Persen tanpa angka");
        const prev = deret.pop();
        deret.push(prev / 100);
      } else {
        // operator
        if (butuhAngka) {
          // minus di awal dianggap bilangan negatif
          if (t === "-") {
            deret.push(-1);
            deret.push("*");
            butuhAngka = true;
            continue;
          }
          throw new Error("Operator dobel");
        }
        deret.push(t);
        butuhAngka = true;
      }
    }

    if (butuhAngka) throw new Error("Ekspresi belum lengkap");
    if (deret.length % 2 === 0) throw new Error("Ekspresi tidak valid");

    // --- tahap 1: kali & bagi (prioritas tinggi) ---
    const tahap1 = [deret[0]];
    for (let i = 1; i < deret.length; i += 2) {
      const op = deret[i];
      const val = deret[i + 1];

      if (op === "*") {
        tahap1[tahap1.length - 1] *= val;
      } else if (op === "/") {
        if (val === 0) throw new Error("Tidak bisa dibagi nol");
        tahap1[tahap1.length - 1] /= val;
      } else {
        tahap1.push(op, val);
      }
    }

    // --- tahap 2: tambah & kurang ---
    let hasil = tahap1[0];
    for (let i = 1; i < tahap1.length; i += 2) {
      hasil = tahap1[i] === "+" ? hasil + tahap1[i + 1] : hasil - tahap1[i + 1];
    }

    if (!isFinite(hasil)) throw new Error("Hasil tidak valid");
    return hasil;
  }

  /** Rapikan angka biar nggak kepanjangan. */
  function format(n) {
    if (!isFinite(n)) return "Error";
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);

    // maksimal 10 angka di belakang koma, buang nol berlebih
    let s = n.toFixed(10).replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }

  /* =========================================================
     2. TAMPILAN
     ========================================================= */

  function render() {
    exprEl.innerHTML = barisAtas || "&nbsp;";
    resultEl.textContent = barisHasil;
  }

  /** Hitung pratinjau diam-diam (kalau gagal, abaikan). */
  function pratinjau(teks) {
    try {
      return format(evaluasi(teks));
    } catch (e) {
      return null;
    }
  }

  /* =========================================================
     3. INPUT
     ========================================================= */

  const OPERATOR = ["+", "−", "×", "÷"];

  function adalahOperator(ch) {
    return OPERATOR.indexOf(ch) !== -1;
  }

  function tekan(key) {
    // kalau baru selesai "=", mulai ekspresi baru
    if (setelahSamaDengan && !adalahOperator(key) && key !== "%") {
      expr = "";
      setelahSamaDengan = false;
    } else if (setelahSamaDengan) {
      // lanjut hitung dari hasil sebelumnya
      setelahSamaDengan = false;
    }

    switch (key) {
      case "C":
        expr = "";
        barisAtas = "";
        barisHasil = "0";
        setelahSamaDengan = false;
        render();
        return;

      case "back":
        expr = expr.slice(0, -1);
        barisAtas = expr;
        barisHasil = pratinjau(expr) || "0";
        render();
        return;

      case "=":
        selesaikan();
        return;

      case ".": {
        // cegah dua titik dalam satu angka
        const bagian = expr.split(/[+−×÷%]/).pop();
        if (bagian.indexOf(".") !== -1) return;
        expr = expr === "" || adalahOperator(expr.slice(-1)) ? expr + "0." : expr + ".";
        break;
      }

      case "%":
        if (expr === "" || adalahOperator(expr.slice(-1))) return;
        expr += "%";
        break;

      default:
        if (adalahOperator(key)) {
          if (expr === "") {
            // hanya minus yang boleh di awal
            if (key !== "−") return;
            expr = key;
          } else if (adalahOperator(expr.slice(-1))) {
            // ganti operator terakhir
            expr = expr.slice(0, -1) + key;
          } else if (expr.slice(-1) === "%") {
            expr += key;
          } else {
            expr += key;
          }
        } else {
          // angka
          expr += key;
        }
    }

    barisAtas = expr;
    const p = pratinjau(expr);
    if (p !== null) barisHasil = p;
    render();
  }

  function selesaikan() {
    if (!expr) return;

    // buang operator menggantung di akhir
    let bersih = expr;
    while (bersih && adalahOperator(bersih.slice(-1))) {
      bersih = bersih.slice(0, -1);
    }
    if (!bersih) return;

    try {
      const hasil = evaluasi(bersih);
      const teksHasil = format(hasil);

      barisAtas = bersih + " =";
      barisHasil = teksHasil;

      tambahRiwayat(bersih, teksHasil);

      expr = teksHasil;
      setelahSamaDengan = true;
    } catch (err) {
      barisAtas = bersih + " =";
      barisHasil = err.message === "Tidak bisa dibagi nol" ? "Tidak bisa ÷ 0" : "Error";
      expr = "";
      setelahSamaDengan = false;
    }

    render();
  }

  /* =========================================================
     4. RIWAYAT
     ========================================================= */

  function muatRiwayat() {
    try {
      const raw = localStorage.getItem(HIST_KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function simpanRiwayat() {
    try {
      localStorage.setItem(HIST_KEY, JSON.stringify(riwayat));
    } catch (e) { /* diabaikan */ }
  }

  function tambahRiwayat(ekspresi, hasil) {
    riwayat.unshift({ ekspresi: ekspresi, hasil: hasil });
    if (riwayat.length > MAX_HISTORY) riwayat.length = MAX_HISTORY;
    simpanRiwayat();
    renderRiwayat();
  }

  function renderRiwayat() {
    historyList.innerHTML = "";

    historyEmpty.hidden = riwayat.length > 0;

    riwayat.forEach(function (item) {
      const li = document.createElement("li");
      li.className = "history-item";

      const kiri = document.createElement("span");
      kiri.className = "hist-expr";
      kiri.textContent = item.ekspresi;

      const kanan = document.createElement("span");
      kanan.className = "hist-res";
      kanan.textContent = "= " + item.hasil;

      li.appendChild(kiri);
      li.appendChild(kanan);

      // klik riwayat -> pakai hasilnya sebagai angka baru
      li.addEventListener("click", function () {
        expr = item.hasil;
        barisAtas = item.hasil;
        barisHasil = item.hasil;
        setelahSamaDengan = false;
        render();
      });

      historyList.appendChild(li);
    });
  }

  /* =========================================================
     5. EVENT
     ========================================================= */

  document.querySelectorAll(".key").forEach(function (btn) {
    btn.addEventListener("click", function () {
      tekan(btn.dataset.key);
    });
  });

  clearBtn.addEventListener("click", function () {
    riwayat = [];
    simpanRiwayat();
    renderRiwayat();
  });

  // keyboard
  document.addEventListener("keydown", function (e) {
    const k = e.key;
    let tombol = null;

    if (/^[0-9]$/.test(k)) tombol = k;
    else if (k === "." || k === ",") tombol = ".";
    else if (k === "+") tombol = "+";
    else if (k === "-") tombol = "−";
    else if (k === "*" || k === "x" || k === "X") tombol = "×";
    else if (k === "/") tombol = "÷";
    else if (k === "%") tombol = "%";
    else if (k === "Enter" || k === "=") tombol = "=";
    else if (k === "Backspace") tombol = "back";
    else if (k === "Escape" || k === "c" || k === "C") tombol = "C";

    if (tombol !== null) {
      e.preventDefault();
      tekan(tombol);
    }
  });

  /* =========================================================
     6. TEMA
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
     7. JALANKAN
     ========================================================= */

  function init() {
    initTema();
    riwayat = muatRiwayat();
    renderRiwayat();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
