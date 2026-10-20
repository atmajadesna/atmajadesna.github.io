/* =========================================================
   TASK MANAGER — script.js
   Aplikasi pencatat tugas: tambah, selesai, hapus, filter.
   Data disimpan di localStorage browser (tanpa server).
   ========================================================= */

(function () {
  "use strict";

  /* ---------- KONSTANTA ---------- */
  const STORAGE_KEY = "aza-tasks-v1";
  const THEME_KEY = "portfolio-theme";

  const PRIORITY_WEIGHT = { tinggi: 3, sedang: 2, rendah: 1 };
  const PRIORITY_LABEL = { tinggi: "Tinggi", sedang: "Sedang", rendah: "Rendah" };

  /* ---------- STATE ---------- */
  let tasks = [];          // daftar semua tugas
  let currentFilter = "all"; // "all" | "active" | "done"

  /* ---------- ELEMEN ---------- */
  const form = document.getElementById("taskForm");
  const inputText = document.getElementById("taskInput");
  const inputPriority = document.getElementById("taskPriority");
  const inputDeadline = document.getElementById("taskDeadline");
  const list = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");

  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const progressNote = document.getElementById("progressNote");

  const countAll = document.getElementById("countAll");
  const countActive = document.getElementById("countActive");
  const countDone = document.getElementById("countDone");

  const filterButtons = document.querySelectorAll(".filter-btn");

  /* =========================================================
     1. PENYIMPANAN (localStorage)
     ========================================================= */

  function simpan() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
    }
  }

  function muat() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      // pastikan bentuknya array, kalau rusak abaikan
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn("Data tersimpan rusak, mulai dari kosong.", e);
      return [];
    }
  }

  /* =========================================================
     2. UTILITAS
     ========================================================= */

  function buatId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /** Hitung selisih hari dari hari ini ke tanggal deadline (YYYY-MM-DD). */
  function selisihHari(tanggal) {
    if (!tanggal) return null;

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const target = new Date(tanggal + "T00:00:00");
    if (isNaN(target.getTime())) return null;

    const ms = target.getTime() - hariIni.getTime();
    return Math.round(ms / (1000 * 60 * 60 * 24));
  }

  /** Ubah selisih hari jadi teks yang enak dibaca. */
  function labelDeadline(tanggal) {
    const sisa = selisihHari(tanggal);
    if (sisa === null) return null;

    if (sisa < 0) return { teks: "Terlambat " + Math.abs(sisa) + " hari", kelas: "overdue" };
    if (sisa === 0) return { teks: "Hari ini", kelas: "soon" };
    if (sisa === 1) return { teks: "Besok", kelas: "soon" };
    if (sisa <= 3) return { teks: "H-" + sisa, kelas: "soon" };
    return { teks: "H-" + sisa, kelas: "" };
  }

  /* =========================================================
     3. RENDER
     ========================================================= */

  /** Urutkan: yang belum selesai dulu, lalu deadline terdekat, lalu prioritas. */
  function urutkan(daftar) {
    return daftar.slice().sort(function (a, b) {
      // 1. selesai selalu di bawah
      if (a.done !== b.done) return a.done ? 1 : -1;

      // 2. deadline terdekat dulu (yang tanpa deadline paling akhir)
      const da = a.deadline ? selisihHari(a.deadline) : Infinity;
      const db = b.deadline ? selisihHari(b.deadline) : Infinity;
      if (da !== db) return da - db;

      // 3. prioritas tinggi dulu
      const pa = PRIORITY_WEIGHT[a.priority] || 0;
      const pb = PRIORITY_WEIGHT[b.priority] || 0;
      if (pa !== pb) return pb - pa;

      // 4. yang paling baru di atas
      return b.createdAt - a.createdAt;
    });
  }

  function tugasTampil() {
    if (currentFilter === "active") return tasks.filter(function (t) { return !t.done; });
    if (currentFilter === "done") return tasks.filter(function (t) { return t.done; });
    return tasks;
  }

  function render() {
    const tampil = urutkan(tugasTampil());

    list.innerHTML = "";

    tampil.forEach(function (task) {
      list.appendChild(buatElemenTugas(task));
    });

    // state kosong
    emptyState.hidden = tampil.length > 0;
    if (tampil.length === 0) {
      const judul = emptyState.querySelector(".empty-title");
      const sub = emptyState.querySelector(".empty-sub");
      if (currentFilter === "done") {
        judul.textContent = "Belum ada yang selesai";
        sub.textContent = "Coba selesaikan satu tugas dulu.";
      } else if (currentFilter === "active") {
        judul.textContent = "Semua tugas beres! 🎉";
        sub.textContent = "Nggak ada tugas yang tersisa.";
      } else {
        judul.textContent = "Belum ada tugas";
        sub.textContent = "Tambahin tugas pertama lo di form atas.";
      }
    }

    perbaruiStatistik();
  }

  /** Bikin satu <li> untuk satu tugas. */
  function buatElemenTugas(task) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " is-done" : "");
    li.dataset.priority = task.priority;
    li.dataset.id = task.id;

    // --- checkbox ---
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "task-check";
    check.checked = task.done;
    check.setAttribute("aria-label", "Tandai selesai: " + task.text);
    check.addEventListener("change", function () {
      task.done = check.checked;
      simpan();
      render();
    });

    // --- isi ---
    const body = document.createElement("div");
    body.className = "task-body";

    const teks = document.createElement("div");
    teks.className = "task-text";
    teks.textContent = task.text; // pakai textContent, aman dari XSS
    body.appendChild(teks);

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const badgePrio = document.createElement("span");
    badgePrio.className = "badge badge-prio-" + task.priority;
    badgePrio.textContent = PRIORITY_LABEL[task.priority] || "Sedang";
    meta.appendChild(badgePrio);

    const dl = labelDeadline(task.deadline);
    if (dl) {
      const badgeDate = document.createElement("span");
      badgeDate.className = "badge badge-date" + (dl.kelas ? " " + dl.kelas : "");
      badgeDate.textContent = dl.teks;
      meta.appendChild(badgeDate);
    }

    body.appendChild(meta);

    // --- tombol hapus ---
    const del = document.createElement("button");
    del.type = "button";
    del.className = "task-del";
    del.innerHTML = "&times;";
    del.setAttribute("aria-label", "Hapus tugas: " + task.text);
    del.addEventListener("click", function () {
      tasks = tasks.filter(function (t) { return t.id !== task.id; });
      simpan();
      render();
    });

    li.appendChild(check);
    li.appendChild(body);
    li.appendChild(del);

    return li;
  }

  /* =========================================================
     4. STATISTIK & PROGRESS
     ========================================================= */

  function perbaruiStatistik() {
    const total = tasks.length;
    const selesai = tasks.filter(function (t) { return t.done; }).length;
    const aktif = total - selesai;

    countAll.textContent = String(total);
    countActive.textContent = String(aktif);
    countDone.textContent = String(selesai);

    const persen = total === 0 ? 0 : Math.round((selesai / total) * 100);
    progressFill.style.width = persen + "%";
    progressText.textContent = persen + "%";

    if (total === 0) {
      progressNote.textContent = "Belum ada tugas.";
    } else if (selesai === total) {
      progressNote.textContent = "Semua tugas selesai. Mantap! 🎉";
    } else {
      progressNote.textContent = selesai + " dari " + total + " tugas selesai · " + aktif + " tersisa";
    }
  }

  /* =========================================================
     5. TAMBAH TUGAS
     ========================================================= */

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const teks = inputText.value.trim();
    if (!teks) {
      inputText.focus();
      return;
    }

    tasks.push({
      id: buatId(),
      text: teks,
      priority: inputPriority.value,
      deadline: inputDeadline.value || "",
      done: false,
      createdAt: Date.now()
    });

    simpan();

    // reset form, tapi prioritas & deadline dibiarkan biar cepat input banyak
    inputText.value = "";
    inputText.focus();

    // kalau sedang filter "Selesai", pindah ke "Semua" biar tugas baru keliatan
    if (currentFilter === "done") {
      currentFilter = "all";
      sinkronFilter();
    }

    render();
  });

  /* =========================================================
     6. FILTER
     ========================================================= */

  function sinkronFilter() {
    filterButtons.forEach(function (btn) {
      const aktif = btn.dataset.filter === currentFilter;
      btn.classList.toggle("is-active", aktif);
      btn.setAttribute("aria-pressed", String(aktif));
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentFilter = btn.dataset.filter;
      sinkronFilter();
      render();
    });
  });

  /* =========================================================
     7. TEMA TERANG / GELAP
     ========================================================= */

  function terapkanTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
  }

  function initTema() {
    let tersimpan = null;
    try { tersimpan = localStorage.getItem(THEME_KEY); } catch (e) { /* diabaikan */ }

    if (tersimpan === "light" || tersimpan === "dark") {
      terapkanTema(tersimpan);
    } else {
      const sukaTerang = window.matchMedia("(prefers-color-scheme: light)").matches;
      terapkanTema(sukaTerang ? "light" : "dark");
    }

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", function () {
        const sekarang = document.documentElement.getAttribute("data-theme") || "dark";
        const baru = sekarang === "dark" ? "light" : "dark";
        terapkanTema(baru);
        try { localStorage.setItem(THEME_KEY, baru); } catch (e) { /* diabaikan */ }
      });
    }
  }

  /* =========================================================
     8. JALANKAN
     ========================================================= */

  function init() {
    initTema();
    tasks = muat();
    sinkronFilter();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
