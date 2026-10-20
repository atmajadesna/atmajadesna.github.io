# Task Manager

Aplikasi pencatat tugas dengan **deadline**, **prioritas**, dan **progress bar**. Dibuat dengan HTML, CSS, dan JavaScript murni — tanpa framework, tanpa server, tanpa database.

🔗 **Demo:** [atmajadesna.github.io/projects/todo-app](https://atmajadesna.github.io/projects/todo-app/)

---

## Fitur

- ➕ **Tambah tugas** — isi teks, prioritas, dan deadline (opsional)
- ✅ **Tandai selesai** — klik lingkaran di kiri, teks otomatis dicoret
- 🗑️ **Hapus tugas** — tombol × di kanan
- 🎯 **Prioritas** — Rendah / Sedang / Tinggi, ditandai warna strip di kiri
- 📅 **Badge deadline** — otomatis jadi `H-3`, `Besok`, `Hari ini`, atau `Terlambat 2 hari`
- 📊 **Progress bar** — persentase tugas yang sudah selesai
- 🔍 **Filter** — Semua / Aktif / Selesai, lengkap dengan jumlahnya
- 🔀 **Urutan otomatis** — belum selesai dulu → deadline terdekat → prioritas tertinggi
- 💾 **Tersimpan otomatis** — data tetap ada walau browser ditutup (`localStorage`)
- 🌗 **Mode terang & gelap**

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 semantik |
| Tampilan | CSS3 — custom properties, flexbox, animasi |
| Logika | JavaScript ES6+ — DOM API, `localStorage`, `Date` |
| Penyimpanan | `localStorage` (tanpa backend) |

---

## Struktur Project

```
todo-app/
├── index.html    # struktur halaman
├── style.css     # tampilan & tema
├── script.js     # seluruh logika aplikasi
└── README.md
```

---

## Cara Data Disimpan

Setiap tugas adalah objek JavaScript:

```js
{
  id: "m8x2k1a",              // id unik
  text: "Laporan praktikum",  // isi tugas
  priority: "tinggi",         // rendah | sedang | tinggi
  deadline: "2026-10-25",     // format YYYY-MM-DD (boleh kosong)
  done: false,                // status selesai
  createdAt: 1760000000000    // waktu dibuat
}
```

Seluruh daftar diubah jadi teks JSON lalu disimpan:

```js
localStorage.setItem("aza-tasks-v1", JSON.stringify(tasks));
```

Saat halaman dibuka lagi, datanya dibaca balik dengan `JSON.parse()`.

---

## Hal yang Dipelajari dari Project Ini

1. **Manipulasi DOM** — membuat elemen baru dengan `createElement()` dan memasukkannya ke halaman
2. **Event handling** — submit form, klik tombol, perubahan checkbox
3. **State management** — satu variabel `tasks` sebagai sumber kebenaran, lalu `render()` menggambar ulang
4. **Penyimpanan lokal** — `localStorage` + `JSON.stringify` / `JSON.parse`
5. **Operasi tanggal** — menghitung selisih hari untuk badge `H-3`
6. **Keamanan dasar** — memakai `textContent` (bukan `innerHTML`) supaya input pengguna tidak bisa jadi celah XSS
7. **Sorting** — mengurutkan array dengan banyak kriteria

---

## Menjalankan Secara Lokal

Cukup buka `index.html` di browser. Atau lewat server lokal:

```bash
python3 -m http.server 8000
# buka http://localhost:8000/projects/todo-app/
```

---

<p align="center">
  Dibuat oleh <strong>Atmaja Desna Adinata</strong> · 2026
</p>
