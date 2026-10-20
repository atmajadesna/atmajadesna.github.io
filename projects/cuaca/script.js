/* =========================================================
   CUACA — script.js
   Data dari Open-Meteo (gratis, tanpa API key).
   ========================================================= */

(function () {
  "use strict";

  const THEME_KEY = "portfolio-theme";
  const KOTA_KEY = "aza-cuaca-kota";
  const KOTA_DEFAULT = "Surakarta";

  /* =========================================================
     1. KODE CUACA (WMO) → teks & ikon
     ========================================================= */
  const CUACA = {
    0:  { teks: "Cerah",                    ikon: "☀️" },
    1:  { teks: "Sebagian besar cerah",     ikon: "🌤️" },
    2:  { teks: "Sebagian berawan",         ikon: "⛅" },
    3:  { teks: "Mendung",                  ikon: "☁️" },
    45: { teks: "Berkabut",                 ikon: "🌫️" },
    48: { teks: "Kabut membeku",            ikon: "🌫️" },
    51: { teks: "Gerimis ringan",           ikon: "🌦️" },
    53: { teks: "Gerimis sedang",           ikon: "🌦️" },
    55: { teks: "Gerimis lebat",            ikon: "🌧️" },
    56: { teks: "Gerimis membeku",          ikon: "🌧️" },
    57: { teks: "Gerimis membeku lebat",    ikon: "🌧️" },
    61: { teks: "Hujan ringan",             ikon: "🌧️" },
    63: { teks: "Hujan sedang",             ikon: "🌧️" },
    65: { teks: "Hujan lebat",              ikon: "🌧️" },
    66: { teks: "Hujan membeku",            ikon: "🌧️" },
    67: { teks: "Hujan membeku lebat",      ikon: "🌧️" },
    71: { teks: "Salju ringan",             ikon: "🌨️" },
    73: { teks: "Salju sedang",             ikon: "🌨️" },
    75: { teks: "Salju lebat",              ikon: "🌨️" },
    77: { teks: "Butiran salju",            ikon: "🌨️" },
    80: { teks: "Hujan lokal ringan",       ikon: "🌦️" },
    81: { teks: "Hujan lokal sedang",       ikon: "🌦️" },
    82: { teks: "Hujan lokal lebat",        ikon: "⛈️" },
    85: { teks: "Hujan salju ringan",       ikon: "🌨️" },
    86: { teks: "Hujan salju lebat",        ikon: "🌨️" },
    95: { teks: "Hujan petir",              ikon: "⛈️" },
    96: { teks: "Hujan petir + es",         ikon: "⛈️" },
    99: { teks: "Hujan petir + es lebat",   ikon: "⛈️" }
  };

  const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
                 "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  /* ---------- ELEMEN ---------- */
  const form = document.getElementById("searchForm");
  const inputKota = document.getElementById("kotaInput");
  const btnCari = document.getElementById("btnCari");
  const chips = document.getElementById("chips");

  const loading = document.getElementById("loading");
  const errorBox = document.getElementById("errorBox");
  const errorTitle = document.getElementById("errorTitle");
  const errorText = document.getElementById("errorText");
  const btnRetry = document.getElementById("btnRetry");
  const hasil = document.getElementById("hasil");

  const nowLokasi = document.getElementById("nowLokasi");
  const nowIcon = document.getElementById("nowIcon");
  const nowTemp = document.getElementById("nowTemp");
  const nowDesc = document.getElementById("nowDesc");
  const nowFeels = document.getElementById("nowFeels");
  const nowHumid = document.getElementById("nowHumid");
  const nowWind = document.getElementById("nowWind");

  const forecastList = document.getElementById("forecastList");
  const updatedAt = document.getElementById("updatedAt");

  /* ---------- STATE ---------- */
  let kotaTerakhir = KOTA_DEFAULT;

  /* =========================================================
     2. UTILITAS
     ========================================================= */

  function infoCuaca(kode) {
    return CUACA[kode] || { teks: "Tidak diketahui", ikon: "❓" };
  }

  function tampilkanStatus(nama) {
    loading.hidden = nama !== "loading";
    errorBox.hidden = nama !== "error";
    hasil.hidden = nama !== "hasil";
  }

  function tampilkanError(judul, pesan) {
    errorTitle.textContent = judul;
    errorText.textContent = pesan;
    tampilkanStatus("error");
  }

  /** Ambil JSON dari URL, lempar error kalau gagal. */
  async function ambilJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Server membalas " + res.status);
    return res.json();
  }

  /* =========================================================
     3. AMBIL DATA
     ========================================================= */

  async function cariKoordinat(nama) {
    const url = "https://geocoding-api.open-meteo.com/v1/search"
      + "?name=" + encodeURIComponent(nama)
      + "&count=1&language=id&format=json";

    const data = await ambilJSON(url);
    if (!data.results || data.results.length === 0) {
      throw new Error("NOT_FOUND");
    }

    const r = data.results[0];
    return {
      lat: r.latitude,
      lon: r.longitude,
      nama: r.name,
      wilayah: r.admin1 || "",
      negara: r.country_code || ""
    };
  }

  async function ambilCuaca(lat, lon) {
    const url = "https://api.open-meteo.com/v1/forecast"
      + "?latitude=" + lat
      + "&longitude=" + lon
      + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
      + "&daily=weather_code,temperature_2m_max,temperature_2m_min"
      + "&timezone=auto&forecast_days=7";

    return ambilJSON(url);
  }

  async function muatCuaca(namaKota) {
    tampilkanStatus("loading");
    btnCari.disabled = true;

    try {
      const lokasi = await cariKoordinat(namaKota);
      const cuaca = await ambilCuaca(lokasi.lat, lokasi.lon);

      renderSekarang(lokasi, cuaca);
      renderPrakiraan(cuaca);

      kotaTerakhir = namaKota;
      try { localStorage.setItem(KOTA_KEY, namaKota); } catch (e) { /* */ }

      inputKota.value = "";
      tampilkanStatus("hasil");
    } catch (err) {
      if (err.message === "NOT_FOUND") {
        tampilkanError("Kota tidak ditemukan",
          "Coba tulis nama kota lain, contoh: Surakarta, Jakarta, atau Tokyo.");
      } else if (!navigator.onLine) {
        tampilkanError("Tidak ada koneksi",
          "Perangkat lo sedang offline. Sambungkan internet lalu coba lagi.");
      } else {
        tampilkanError("Gagal mengambil data",
          "Terjadi masalah saat menghubungi server cuaca. Coba lagi sebentar.");
      }
    } finally {
      btnCari.disabled = false;
    }
  }

  /* =========================================================
     4. RENDER
     ========================================================= */

  function renderSekarang(lokasi, cuaca) {
    const c = cuaca.current;
    const info = infoCuaca(c.weather_code);

    const tempat = [lokasi.nama, lokasi.wilayah].filter(Boolean).join(", ");
    nowLokasi.textContent = tempat + (lokasi.negara ? " · " + lokasi.negara : "");

    nowIcon.textContent = info.ikon;
    nowTemp.textContent = Math.round(c.temperature_2m);
    nowDesc.textContent = info.teks;

    nowFeels.textContent = Math.round(c.apparent_temperature) + "°C";
    nowHumid.textContent = Math.round(c.relative_humidity_2m) + "%";
    nowWind.textContent = Math.round(c.wind_speed_10m) + " km/j";

    const sekarang = new Date();
    updatedAt.textContent = sekarang.getHours().toString().padStart(2, "0")
      + ":" + sekarang.getMinutes().toString().padStart(2, "0");
  }

  function renderPrakiraan(cuaca) {
    const d = cuaca.daily;
    forecastList.innerHTML = "";

    if (!d || !d.time) return;

    // cari rentang suhu seluruh minggu, buat skala bar
    const semuaMin = Math.min.apply(null, d.temperature_2m_min);
    const semuaMax = Math.max.apply(null, d.temperature_2m_max);
    const rentang = Math.max(semuaMax - semuaMin, 1);

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    d.time.forEach(function (tanggalStr, i) {
      const tgl = new Date(tanggalStr + "T00:00:00");
      const info = infoCuaca(d.weather_code[i]);

      const li = document.createElement("li");
      li.className = "fc-item";

      // tandai hari ini
      if (tgl.getTime() === hariIni.getTime()) li.classList.add("is-today");

      // nama hari
      const hari = document.createElement("div");
      hari.className = "fc-day";
      hari.textContent = i === 0 ? "Hari ini" : HARI[tgl.getDay()];
      const kecil = document.createElement("small");
      kecil.textContent = tgl.getDate() + " " + BULAN[tgl.getMonth()];
      hari.appendChild(kecil);

      // ikon
      const ikon = document.createElement("div");
      ikon.className = "fc-icon";
      ikon.textContent = info.ikon;
      ikon.title = info.teks;

      // bar suhu
      const barWrap = document.createElement("div");
      barWrap.className = "fc-bar-wrap";
      const bar = document.createElement("div");
      bar.className = "fc-bar";

      const min = d.temperature_2m_min[i];
      const max = d.temperature_2m_max[i];
      const kiri = ((min - semuaMin) / rentang) * 100;
      const lebar = Math.max(((max - min) / rentang) * 100, 6);

      bar.style.left = kiri + "%";
      bar.style.width = lebar + "%";
      barWrap.appendChild(bar);

      // suhu min / max
      const suhu = document.createElement("div");
      suhu.className = "fc-temp";
      const strongMin = document.createElement("span");
      strongMin.textContent = Math.round(min) + "°";
      suhu.appendChild(strongMin);
      suhu.appendChild(document.createTextNode(" / " + Math.round(max) + "°"));

      li.appendChild(hari);
      li.appendChild(ikon);
      li.appendChild(barWrap);
      li.appendChild(suhu);

      forecastList.appendChild(li);
    });
  }

  /* =========================================================
     5. EVENT
     ========================================================= */

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nama = inputKota.value.trim();
    if (!nama) {
      inputKota.focus();
      return;
    }
    muatCuaca(nama);
  });

  chips.addEventListener("click", function (e) {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    muatCuaca(btn.dataset.kota);
  });

  btnRetry.addEventListener("click", function () {
    muatCuaca(kotaTerakhir);
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
     7. INIT
     ========================================================= */

  document.addEventListener("DOMContentLoaded", function () {
    initTema();

    let tersimpan = null;
    try { tersimpan = localStorage.getItem(KOTA_KEY); } catch (e) { /* */ }
    kotaTerakhir = tersimpan || KOTA_DEFAULT;

    muatCuaca(kotaTerakhir);
  });
})();
