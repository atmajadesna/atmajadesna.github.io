# Website Portfolio — Atmaja Desna Adinata

Website portofolio pribadi yang dibangun dari nol menggunakan **HTML, CSS, dan JavaScript** murni — tanpa framework, tanpa library eksternal.

🔗 **Live:** [atmajadesna.github.io](https://atmajadesna.github.io)

---

## Fitur

- 🌗 **Mode terang & gelap** — tersimpan di `localStorage`, otomatis mengikuti preferensi sistem
- 📱 **Responsif** — tampil rapi di HP, tablet, dan desktop
- ✨ **Animasi scroll** — elemen muncul bertahap menggunakan `IntersectionObserver`
- 🧭 **Navigasi aktif** — menu otomatis menyorot bagian yang sedang dilihat
- ⚡ **Tanpa dependensi** — nol CDN, nol framework, loading cepat
- ♿ **Aksesibel** — struktur semantik, `aria-label`, dan dukungan keyboard

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 semantik |
| Tampilan | CSS3 — custom properties, grid, flexbox, `clamp()` |
| Interaksi | JavaScript (ES6+) — vanilla, tanpa library |

---

## Struktur Project

```
.
├── index.html      # struktur halaman
├── style.css       # seluruh tampilan & tema
├── script.js       # tema, menu mobile, animasi scroll
└── README.md
```

---

## Menjalankan Secara Lokal

Tidak perlu instalasi apa pun — cukup buka file `index.html` di browser.

Atau lewat server lokal:

```bash
# Python 3
python3 -m http.server 8000

# lalu buka http://localhost:8000
```

---

## Cara Kerja Tema

Tema dikontrol lewat atribut `data-theme` pada elemen `<html>`:

```html
<html lang="id" data-theme="dark">
```

Seluruh warna didefinisikan sebagai CSS variable, sehingga pergantian tema
cukup mengganti satu atribut tanpa menyentuh satu pun aturan CSS.

```css
:root                 { --bg: #0b0f19; --text: #e2e8f0; }
[data-theme="light"]  { --bg: #f8fafc; --text: #0f172a; }
```

---

## Lisensi

Kode bebas dipelajari dan dipakai sebagai referensi belajar.

---

<p align="center">
  Dibuat oleh <strong>Atmaja Desna Adinata</strong> · 2026
</p>
