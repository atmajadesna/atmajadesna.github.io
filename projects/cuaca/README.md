# Cuaca

Aplikasi cek cuaca dan prakiraan **7 hari** untuk kota mana pun. Data diambil langsung dari **Open-Meteo API** — gratis, tanpa API key, tanpa registrasi.

🔗 **Demo:** [atmajadesna.github.io/projects/cuaca](https://atmajadesna.github.io/projects/cuaca/)

---

## Fitur

- 🔍 **Cari kota** — ketik nama kota, dapat koordinatnya otomatis lewat geocoding
- 🌡️ **Cuaca sekarang** — suhu, kondisi, terasa seperti, kelembapan, kecepatan angin
- 📅 **Prakiraan 7 hari** — ikon, suhu min/max, dan bar visual perbandingan suhu
- 🏙️ **Kota cepat** — tombol pintas Surakarta, Yogyakarta, Semarang, Jakarta, Bandung
- 💾 **Ingat kota terakhir** — buka lagi langsung tampil kota yang sama
- ⚠️ **Penanganan error** — pesan jelas kalau kota tidak ditemukan atau koneksi putus
- 🌗 **Mode terang & gelap**

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 semantik |
| Tampilan | CSS3 — grid, gradien, animasi spinner |
| Logika | JavaScript ES6+ — `async`/`await`, `fetch`, DOM API |
| Data | [Open-Meteo](https://open-meteo.com/) — gratis, tanpa API key |

---

## Dua API yang Dipakai

### 1. Geocoding — ubah nama kota jadi koordinat

```
https://geocoding-api.open-meteo.com/v1/search?name=Surakarta&count=1&language=id
```

```json
{
  "results": [{
    "name": "Kota Surakarta",
    "admin1": "Jawa Tengah",
    "latitude": -7.55611,
    "longitude": 110.83167
  }]
}
```

### 2. Forecast — ambil cuaca berdasarkan koordinat

```
https://api.open-meteo.com/v1/forecast?latitude=-7.556&longitude=110.831
  &current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code
  &daily=weather_code,temperature_2m_max,temperature_2m_min
  &timezone=auto&forecast_days=7
```

Kenapa dua langkah? Karena API cuaca butuh **koordinat**, bukan nama kota. Jadi alurnya:

```
"Bandung"  →  geocoding  →  (-6.92, 107.61)  →  forecast  →  cuaca Bandung
```

---

## Kode Cuaca (WMO)

Open-Meteo mengirim **kode angka**, bukan teks. Contoh `3` artinya mendung, `61` artinya hujan ringan.

Kode itu diterjemahkan lewat objek pemetaan:

```js
const CUACA = {
  0:  { teks: "Cerah",        ikon: "☀️" },
  3:  { teks: "Mendung",      ikon: "☁️" },
  61: { teks: "Hujan ringan", ikon: "🌧️" },
  95: { teks: "Hujan petir",  ikon: "⛈️" }
};
```

---

## Struktur Project

```
cuaca/
├── index.html    # form pencarian, kartu cuaca, daftar prakiraan
├── style.css     # tampilan kartu & bar suhu
├── script.js     # fetch API, pemetaan kode cuaca, render
└── README.md
```

---

## Hal yang Dipelajari

1. **`async` / `await`** — menunggu data dari server tanpa membuat halaman nge-freeze
2. **`fetch()`** — mengambil data dari API pihak ketiga
3. **Rantai dua API** — geocoding dulu, baru forecast
4. **Penanganan error** — `try/catch/finally`, bedakan "kota tidak ditemukan" vs "koneksi putus"
5. **State loading** — spinner selama menunggu, tombol dinonaktifkan biar tidak dobel klik
6. **Visualisasi data** — bar suhu berskala dari min/max seluruh minggu
7. **`encodeURIComponent()`** — mengamankan input pengguna sebelum masuk URL

---

## Catatan

API ini **tidak butuh API key**, jadi project bisa jalan langsung dari GitHub Pages tanpa server sendiri. Cocok untuk latihan pertama kali pakai API.

---

<p align="center">
  Dibuat oleh <strong>Atmaja Desna Adinata</strong> · 2026
</p>
