# Kalkulator

Kalkulator web dengan dukungan keyboard dan riwayat perhitungan. Mesin hitungnya **dibuat sendiri** — tanpa `eval()` dan tanpa library.

🔗 **Demo:** [atmajadesna.github.io/projects/kalkulator](https://atmajadesna.github.io/projects/kalkulator/)

---

## Fitur

- 🔢 **Operasi dasar** — tambah, kurang, kali, bagi
- 📊 **Persen** — `200 × 15%` langsung dihitung
- ⌨️ **Dukungan keyboard** — angka, operator, Enter, Backspace, Esc
- 🕘 **Riwayat** — 20 perhitungan terakhir, tersimpan di `localStorage`, bisa diklik untuk dipakai ulang
- ➖ **Bilangan negatif** — bisa mulai dari `−5`
- 🛡️ **Anti-crash** — bagi nol, operator dobel, dan ekspresi tidak lengkap ditolak dengan pesan jelas
- 🌗 **Mode terang & gelap**

---

## Kenapa Tidak Pakai `eval()`?

`eval()` mengeksekusi teks sebagai kode JavaScript. Kalau teks itu berasal dari input pengguna, celahnya besar — bisa dipakai menjalankan kode berbahaya.

Karena itu project ini punya **parser sendiri**:

```
"12 + 3 × 4"
     ↓ tokenize
[12] [+] [3] [×] [4]
     ↓ ubah ke bentuk angka & operator
[12] [+] [3] [*] [4]
     ↓ tahap 1: kali & bagi dulu (prioritas)
[12] [+] [12]
     ↓ tahap 2: tambah & kurang
24
```

Ini cara kerja yang sama dipakai kalkulator sungguhan: **operator perkalian didahulukan** sebelum penjumlahan.

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 — `<button>`, `<output>` |
| Tampilan | CSS Grid 4 kolom, custom properties |
| Logika | JavaScript ES6+ — parser ekspresi, event delegation |

---

## Struktur Project

```
kalkulator/
├── index.html    # tombol & layar
├── style.css     # tampilan keypad
├── script.js     # parser + logika kalkulator
└── README.md
```

---

## Hasil Pengujian

Mesin hitung diuji dengan 19 kasus:

| Ekspresi | Hasil | Status |
|---|---|---|
| `12 + 3` | 15 | ✅ |
| `12 + 3 × 4` | 24 | ✅ |
| `10 ÷ 4` | 2.5 | ✅ |
| `200 × 15%` | 30 | ✅ |
| `−5 + 3` | −2 | ✅ |
| `5 − −3` | 8 | ✅ |
| `2 + 3 × 4 − 6 ÷ 2` | 11 | ✅ |
| `1 ÷ 0` | error | ✅ |
| `12 +` | error | ✅ |

---

## Hal yang Dipelajari

1. **Parsing teks** — memecah string jadi token bermakna dengan regex
2. **Prioritas operator** — kenapa `2+3×4` bukan 20
3. **Keamanan** — kenapa `eval()` berbahaya untuk input pengguna
4. **Validasi** — menolak input tidak valid dengan pesan yang jelas
5. **Event keyboard** — `keydown`, `preventDefault()`
6. **Penyimpanan riwayat** — `localStorage` + `JSON`

---

<p align="center">
  Dibuat oleh <strong>Atmaja Desna Adinata</strong> · 2026
</p>
