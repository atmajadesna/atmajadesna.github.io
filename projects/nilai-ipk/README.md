# Catatan Nilai & IPK

Aplikasi untuk mencatat nilai mata kuliah dan menghitung **Indeks Prestasi (IP)** secara otomatis. Data tersimpan di browser, tidak perlu daftar akun.

🔗 **Demo:** [atmajadesna.github.io/projects/nilai-ipk](https://atmajadesna.github.io/projects/nilai-ipk/)

---

## Fitur

- ➕ **Tambah mata kuliah** — nama, jumlah SKS, dan nilai
- 🧮 **Hitung IP otomatis** — langsung berubah tiap ada data masuk
- 🎓 **Predikat** — Dengan Pujian / Sangat Memuaskan / Memuaskan / Cukup / Perlu Perbaikan
- 📋 **Tabel lengkap** — SKS, nilai, bobot, dan mutu per mata kuliah
- 🗑️ **Hapus per baris** atau **hapus semua**
- 💾 **Tersimpan otomatis** di `localStorage`
- 🌗 **Mode terang & gelap**

---

## Cara Menghitung IP

```
mutu  = SKS × bobot nilai
IP    = total mutu ÷ total SKS
```

**Contoh:**

| Mata Kuliah | SKS | Nilai | Bobot | Mutu |
|---|---|---|---|---|
| Big Data | 2 | A | 4.00 | 8.00 |
| Cloud Computing | 3 | AB | 3.50 | 10.50 |
| IoT | 3 | B | 3.00 | 9.00 |
| **Total** | **8** | | | **27.50** |

```
IP = 27.50 ÷ 8 = 3.44
```

Perhatikan: **mata kuliah 3 SKS lebih berpengaruh** daripada 2 SKS.
Itu sebabnya IP bukan rata-rata nilai biasa — tapi rata-rata berbobot.

---

## Skala Nilai

| Nilai | Bobot |
|---|---|
| A | 4.00 |
| AB | 3.50 |
| B | 3.00 |
| BC | 2.50 |
| C | 2.00 |
| D | 1.00 |
| E | 0.00 |

> Skala ini umum dipakai di kampus Indonesia. Kalau kampus lo beda, tinggal ubah objek `BOBOT` di baris atas `script.js`.

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 — `<form>`, `<table>` semantik |
| Tampilan | CSS3 — tabel responsif, pill nilai berwarna |
| Logika | JavaScript ES6+ — array, `reduce` manual, `localStorage` |

---

## Struktur Project

```
nilai-ipk/
├── index.html    # form, ringkasan, tabel
├── style.css     # tampilan tabel & kartu ringkasan
├── script.js     # hitung IP, simpan data
└── README.md
```

---

## Hal yang Dipelajari

1. **Rata-rata berbobot** — konsep di balik IP, bukan sekadar rata-rata biasa
2. **Struktur data** — array of object sebagai "database" sederhana
3. **Render tabel dinamis** — membangun `<tr>` dan `<td>` lewat JavaScript
4. **Validasi input** — menolak SKS kosong atau di luar 1–6
5. **Penyimpanan lokal** — data tetap ada setelah browser ditutup
6. **Pemisahan logika & tampilan** — `hitung()` murni menghitung, `render()` murni menggambar

---

## Ide Pengembangan Lanjutan

- Target IP: "kalau mau IP 3.5, nilai minimal matkul ini berapa?"
- Simpan per semester, lalu hitung IPK kumulatif
- Grafik tren IP antar semester
- Ekspor ke CSV / cetak sebagai transkrip

---

<p align="center">
  Dibuat oleh <strong>Atmaja Desna Adinata</strong> · 2026
</p>
