# Kuis Dasar Web

Kuis interaktif 10 soal tentang **HTML, CSS, dan JavaScript**. Tiap jawaban langsung dapat pembahasan, jadi salah pun tetap belajar.

🔗 **Demo:** [atmajadesna.github.io/projects/kuis](https://atmajadesna.github.io/projects/kuis/)

---

## Fitur

- 🎲 **Soal & pilihan diacak** — tiap kali dimainkan urutannya beda
- 💬 **Pembahasan langsung** — muncul begitu soal dijawab, bukan cuma di akhir
- 📊 **Progress bar** — posisi soal & skor berjalan
- 🏆 **Layar hasil** — skor, persentase, jumlah benar/salah, plus pesan sesuai nilai
- 📖 **Review lengkap** — daftar semua soal, jawaban lo, jawaban benar, dan penjelasannya
- ⌨️ **Keyboard** — tekan `A`/`B`/`C`/`D` buat jawab, `Enter` buat lanjut
- 🔁 **Ulangi kapan saja** — soal diacak ulang dari awal
- 🌗 **Mode terang & gelap**

---

## Topik Soal

| Topik | Jumlah |
|---|---|
| HTML | 3 soal |
| CSS | 3 soal |
| JavaScript | 4 soal |

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 — tiga layar (mulai, soal, hasil) |
| Tampilan | CSS3 — custom properties, transisi, progress bar |
| Logika | JavaScript ES6+ — array, objek, `Math.random` |

---

## Struktur Project

```
kuis/
├── index.html    # 3 layar: mulai, soal, hasil
├── style.css     # tampilan soal, pilihan, hasil
├── script.js     # bank soal + alur kuis
└── README.md
```

---

## Cara Soal Diacak

Setiap soal menyimpan index jawaban benar:

```js
{
  tanya: "Apa kepanjangan HTML?",
  opsi: ["HyperText Markup Language", "High Tech...", ...],
  benar: 0        // index 0 = pilihan pertama
}
```

Kalau pilihannya diacak begitu saja, index `benar` jadi salah. Solusinya:
tiap pilihan dibungkus dulu dengan penanda benar/salah, **baru** diacak.

```js
// 1. beri penanda
opsi.map((teks, i) => ({ teks, benar: i === soal.benar }))

// 2. acak
acak(berpasangan)

// 3. cari ulang posisi jawaban benar setelah diacak
diacak.findIndex(o => o.benar)
```

Ini pola yang sering dipakai di aplikasi kuis sungguhan.

---

## Alur Aplikasi

```
Mulai
  ↓
Acak soal + acak pilihan
  ↓
Tampilkan soal ke-1
  ↓
User pilih jawaban
  ↓
Tandai benar/salah → tampilkan pembahasan
  ↓
Soal berikutnya (ulangi sampai habis)
  ↓
Layar hasil: skor, persentase, review
  ↓
Ulangi / Lihat pembahasan
```

---

## Hal yang Dipelajari

1. **Manipulasi array** — `map`, `filter`, `findIndex`, `slice`
2. **Algoritma pengacakan** — Fisher–Yates shuffle
3. **State management** — `daftar`, `indeks`, `skor`, `catatan`
4. **Multi-layar** — menampilkan/menyembunyikan `<section>` dengan atribut `hidden`
5. **Membuat elemen dinamis** — `createElement` untuk tiap pilihan jawaban
6. **Keamanan** — memakai `textContent` supaya teks soal tidak bisa jadi celah XSS
7. **Event keyboard** — mendukung input tanpa mouse

---

<p align="center">
  Dibuat oleh <strong>Atmaja Desna Adinata</strong> · 2026
</p>
