/* =========================================================
   SCRIPT.JS — Atmaja Desna Adinata Portfolio
   Theme toggle, mobile nav, scroll reveal, active nav link
   ========================================================= */

(function () {
  "use strict";

  const root = document.documentElement;
  const STORAGE_KEY = "portfolio-theme";

  /* ---------- 1. TEMA (terang / gelap) ---------- */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap"
      );
    }
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* localStorage bisa diblokir di beberapa browser */
    }

    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else {
      const prefersLight = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;
      applyTheme(prefersLight ? "light" : "dark");
    }
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* abaikan kalau storage tidak tersedia */
    }
  }

  /* ---------- 2. MENU MOBILE ---------- */
  function initNav() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu" : "Buka menu"
      );
    });

    // tutup menu setelah link diklik (mobile)
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 3. ANIMASI SAAT SCROLL ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // kalau browser tidak dukung IntersectionObserver, tampilkan semua
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // jeda kecil bertingkat biar munculnya bergantian
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, i * 70);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- 4. SOROT MENU SESUAI POSISI ---------- */
  function initActiveNav() {
    const sections = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(".menu a");
    if (!sections.length || !links.length) return;

    if (!("IntersectionObserver" in window)) return;

    const map = {};
    links.forEach(function (link) {
      const id = link.getAttribute("href").replace("#", "");
      map[id] = link;
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("active");
            });
            const active = map[entry.target.id];
            if (active) active.classList.add("active");
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- 5. TOMBOL EMAIL ANTI-BOT ---------- */
  /* Alamat disusun saat diklik, jadi tidak ada string email utuh
     di dalam HTML yang bisa dipanen bot spam. */
  function initEmailCard() {
    const card = document.getElementById("emailCard");
    if (!card) return;

    card.addEventListener("click", function () {
      const user = card.getAttribute("data-u");
      const domain = card.getAttribute("data-d");
      if (!user || !domain) return;
      window.location.href = "mailto:" + user + "@" + domain;
    });
  }

  /* ---------- 6. TAHUN DI FOOTER ---------- */
  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- JALANKAN ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNav();
    initReveal();
    initActiveNav();
    initEmailCard();
    initYear();

    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  });
})();
