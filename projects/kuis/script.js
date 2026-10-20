/* =========================================================
   KUIS DASAR WEB — script.js
   Bank soal, acak soal & pilihan, pembahasan, skor.
   ========================================================= */

(function () {
  "use strict";

  const THEME_KEY = "portfolio-theme";

  /* =========================================================
     1. BANK SOAL
     benar = index jawaban benar pada array opsi
     ========================================================= */
  const BANK_SOAL = [
    {
      topik: "HTML",
      tanya: "Apa kepanjangan dari HTML?",
      opsi: [
        "HyperText Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink Text Manager"
      ],
      benar: 0,
      bahas: "HTML = HyperText Markup Language. 'Markup' artinya bahasa penanda — kita menandai bagian teks dengan tag seperti <h1> atau <p>."
    },
    {
      topik: "HTML",
      tanya: "Tag mana yang dipakai untuk membuat paragraf?",
      opsi: ["<par>", "<p>", "<paragraph>", "<text>"],
      benar: 1,
      bahas: "Tag <p> adalah singkatan dari paragraph. Contoh: <p>Halo dunia</p>."
    },
    {
      topik: "HTML",
      tanya: "Atribut apa yang dipakai pada <img> untuk menentukan alamat gambar?",
      opsi: ["href", "link", "src", "url"],
      benar: 2,
      bahas: "<img src=\"foto.jpg\" alt=\"Deskripsi\">. Atribut 'src' = source (sumber). Sedangkan 'href' dipakai di tag <a> untuk link."
    },
    {
      topik: "CSS",
      tanya: "CSS adalah singkatan dari...",
      opsi: [
        "Creative Style System",
        "Cascading Style Sheets",
        "Computer Styled Sections",
        "Cascading Simple Sheets"
      ],
      benar: 1,
      bahas: "CSS = Cascading Style Sheets. 'Cascading' artinya aturan bisa saling menimpa — aturan yang lebih spesifik menang."
    },
    {
      topik: "CSS",
      tanya: "Properti CSS apa yang mengatur warna teks?",
      opsi: ["text-color", "font-color", "color", "background"],
      benar: 2,
      bahas: "Cukup 'color'. Contoh: h1 { color: red; }. Kalau 'background-color' itu untuk warna latar."
    },
    {
      topik: "CSS",
      tanya: "Bagaimana cara memilih elemen dengan id=\"judul\" di CSS?",
      opsi: [".judul", "#judul", "judul", "*judul"],
      benar: 1,
      bahas: "Tanda # untuk id, tanda . untuk class. Jadi #judul untuk id, .judul untuk class."
    },
    {
      topik: "JavaScript",
      tanya: "Kata kunci mana yang membuat variabel yang nilainya tidak bisa diubah?",
      opsi: ["var", "let", "const", "static"],
      benar: 2,
      bahas: "const = constant (tetap). Varibel 'let' masih bisa diubah, 'const' tidak bisa diisi ulang setelah dideklarasikan."
    },
    {
      topik: "JavaScript",
      tanya: "Manakah yang BUKAN tipe data di JavaScript?",
      opsi: ["number", "string", "boolean", "float"],
      benar: 3,
      bahas: "JavaScript cuma punya 'number' — tidak membedakan integer dan float seperti bahasa lain. Jadi 'float' bukan tipe data di JS."
    },
    {
      topik: "JavaScript",
      tanya: "Fungsi apa yang dipakai untuk menampilkan pesan di console browser?",
      opsi: ["print()", "echo()", "console.log()", "log.console()"],
      benar: 2,
      bahas: "console.log(\"halo\") akan menampilkan pesan di tab Console DevTools. Ini cara paling dasar untuk mencari bug."
    },
    {
      topik: "JavaScript",
      tanya: "Apa fungsi localStorage di browser?",
      opsi: [
        "Mengirim data ke server",
        "Menyimpan data di browser walau halaman ditutup",
        "Menghapus cache otomatis",
        "Menyimpan data hanya selama halaman terbuka"
      ],
      benar: 1,
      bahas: "localStorage menyimpan data sebagai teks di browser dan tetap ada walau tab ditutup. Data hilang hanya kalau dihapus manual atau browser dibersihkan."
    }
  ];

  /* ---------- ELEMEN ---------- */
  const screenStart = document.getElementById("screenStart");
  const screenQuiz = document.getElementById("screenQuiz");
  const screenResult = document.getElementById("screenResult");

  const btnStart = document.getElementById("btnStart");
  const btnNext = document.getElementById("btnNext");
  const btnRestart = document.getElementById("btnRestart");
  const btnReview = document.getElementById("btnReview");

  const qNum = document.getElementById("qNum");
  const qTotal = document.getElementById("qTotal");
  const qScore = document.getElementById("qScore");
  const qProgress = document.getElementById("qProgress");
  const qTopic = document.getElementById("qTopic");
  const qText = document.getElementById("qText");
  const optionsBox = document.getElementById("options");

  const feedback = document.getElementById("feedback");
  const fbTitle = document.getElementById("fbTitle");
  const fbText = document.getElementById("fbText");

  const scoreNum = document.getElementById("scoreNum");
  const resultTitle = document.getElementById("resultTitle");
  const resultMsg = document.getElementById("resultMsg");
  const statBenar = document.getElementById("statBenar");
  const statSalah = document.getElementById("statSalah");
  const statPersen = document.getElementById("statPersen");

  const reviewBox = document.getElementById("reviewBox");
  const reviewList = document.getElementById("reviewList");

  /* ---------- STATE ---------- */
  let daftar = [];      // soal yang sudah diacak
  let indeks = 0;
  let skor = 0;
  let catatan = [];     // riwayat jawaban untuk pembahasan
  let sudahJawab = false;

  /* =========================================================
     2. UTILITAS
     ========================================================= */

  /** Acak array (Fisher–Yates), mengembalikan array baru. */
  function acak(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  const HURUF = ["A", "B", "C", "D"];

  /* =========================================================
     3. ALUR KUIS
     ========================================================= */

  function mulai() {
    daftar = acak(BANK_SOAL).map(function (soal) {
      // acak juga urutan pilihannya, simpan posisi jawaban benar yang baru
      const berpasangan = soal.opsi.map(function (teks, i) {
        return { teks: teks, benar: i === soal.benar };
      });
      const diacak = acak(berpasangan);

      return {
        topik: soal.topik,
        tanya: soal.tanya,
        bahas: soal.bahas,
        opsi: diacak.map(function (o) { return o.teks; }),
        benar: diacak.findIndex(function (o) { return o.benar; })
      };
    });

    indeks = 0;
    skor = 0;
    catatan = [];

    qTotal.textContent = String(daftar.length);

    tampilLayar("quiz");
    renderSoal();
  }

  function tampilLayar(nama) {
    screenStart.hidden = nama !== "start";
    screenQuiz.hidden = nama !== "quiz";
    screenResult.hidden = nama !== "result";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderSoal() {
    const soal = daftar[indeks];
    sudahJawab = false;

    // header
    qNum.textContent = String(indeks + 1);
    qScore.textContent = "Skor " + skor;
    qProgress.style.width = ((indeks) / daftar.length) * 100 + "%";

    // soal
    qTopic.textContent = soal.topik;
    qText.textContent = soal.tanya;

    // pilihan
    optionsBox.innerHTML = "";
    soal.opsi.forEach(function (teks, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";

      const kunci = document.createElement("span");
      kunci.className = "option-key";
      kunci.textContent = HURUF[i] || String(i + 1);

      const isi = document.createElement("span");
      isi.className = "option-text";
      isi.textContent = teks;

      btn.appendChild(kunci);
      btn.appendChild(isi);

      btn.addEventListener("click", function () {
        jawab(i, btn);
      });

      optionsBox.appendChild(btn);
    });

    // reset feedback & tombol
    feedback.hidden = true;
    feedback.className = "feedback";
    btnNext.hidden = true;
    btnNext.textContent = indeks === daftar.length - 1 ? "Lihat Hasil →" : "Soal Berikutnya →";
  }

  function jawab(pilihan, tombol) {
    if (sudahJawab) return;
    sudahJawab = true;

    const soal = daftar[indeks];
    const benar = pilihan === soal.benar;

    // nonaktifkan semua pilihan & tandai
    Array.prototype.forEach.call(optionsBox.children, function (btn, i) {
      btn.disabled = true;
      if (i === soal.benar) btn.classList.add("is-correct");
      if (i === pilihan && !benar) btn.classList.add("is-wrong");
    });

    // feedback
    feedback.hidden = false;
    feedback.className = "feedback " + (benar ? "is-correct" : "is-wrong");
    fbTitle.textContent = benar ? "✅ Benar!" : "❌ Belum tepat";
    fbText.textContent = soal.bahas;

    if (benar) skor++;
    qScore.textContent = "Skor " + skor;

    catatan.push({
      tanya: soal.tanya,
      benar: soal.opsi[soal.benar],
      dipilih: soal.opsi[pilihan],
      tepat: benar,
      bahas: soal.bahas
    });

    btnNext.hidden = false;
    btnNext.focus();
  }

  function lanjut() {
    indeks++;
    if (indeks >= daftar.length) {
      tampilHasil();
    } else {
      renderSoal();
    }
  }

  function tampilHasil() {
    const total = daftar.length;
    const persen = Math.round((skor / total) * 100);

    scoreNum.textContent = String(skor);
    statBenar.textContent = String(skor);
    statSalah.textContent = String(total - skor);
    statPersen.textContent = persen + "%";

    let judul, pesan;
    if (skor === total) {
      judul = "Sempurna! 🏆";
      pesan = "Semua benar. Dasar web lo udah kuat.";
    } else if (skor >= total * 0.8) {
      judul = "Mantap! 🎉";
      pesan = "Hampir sempurna. Cek pembahasan buat yang kelewat.";
    } else if (skor >= total * 0.6) {
      judul = "Lumayan 💪";
      pesan = "Dasar udah masuk, tinggal dirapikan sedikit lagi.";
    } else {
      judul = "Perlu diulang 📚";
      pesan = "Nggak apa-apa — baca pembahasannya, terus ulangi.";
    }

    resultTitle.textContent = judul;
    resultMsg.textContent = pesan;

    reviewBox.hidden = true;
    btnReview.textContent = "Lihat Pembahasan";

    tampilLayar("result");
  }

  function renderPembahasan() {
    reviewList.innerHTML = "";

    catatan.forEach(function (c, i) {
      const li = document.createElement("li");
      li.className = "review-item " + (c.tepat ? "ok" : "no");

      const q = document.createElement("p");
      q.className = "review-q";
      q.textContent = (i + 1) + ". " + c.tanya;

      const a = document.createElement("p");
      a.className = "review-a";

      if (c.tepat) {
        a.innerHTML = "Jawaban lo: <strong></strong> ✅<br>";
      } else {
        a.innerHTML = "Jawaban lo: <span class=\"salah\"></span> ❌<br>Jawaban benar: <strong></strong><br>";
      }

      // isi teks aman lewat textContent
      if (c.tepat) {
        a.querySelector("strong").textContent = c.dipilih;
      } else {
        a.querySelector(".salah").textContent = c.dipilih;
        a.querySelector("strong").textContent = c.benar;
      }

      const bahas = document.createElement("span");
      bahas.textContent = c.bahas;
      a.appendChild(document.createElement("br"));
      a.appendChild(bahas);

      li.appendChild(q);
      li.appendChild(a);
      reviewList.appendChild(li);
    });
  }

  /* =========================================================
     4. TEMA
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
     5. EVENT & INIT
     ========================================================= */

  btnStart.addEventListener("click", mulai);
  btnNext.addEventListener("click", lanjut);
  btnRestart.addEventListener("click", mulai);

  btnReview.addEventListener("click", function () {
    if (reviewBox.hidden) {
      renderPembahasan();
      reviewBox.hidden = false;
      btnReview.textContent = "Sembunyikan Pembahasan";
    } else {
      reviewBox.hidden = true;
      btnReview.textContent = "Lihat Pembahasan";
    }
  });

  // keyboard: A/B/C/D buat jawab, Enter buat lanjut
  document.addEventListener("keydown", function (e) {
    if (screenQuiz.hidden) return;

    if (!sudahJawab) {
      const idx = HURUF.indexOf(e.key.toUpperCase());
      if (idx !== -1 && idx < optionsBox.children.length) {
        e.preventDefault();
        optionsBox.children[idx].click();
      }
    } else if (e.key === "Enter" && !btnNext.hidden) {
      e.preventDefault();
      lanjut();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    initTema();
    tampilLayar("start");
  });
})();
