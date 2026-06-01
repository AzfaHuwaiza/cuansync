---
title: CuanSync Cash Flow API
emoji: 💰
colorFrom: green
colorTo: green
sdk: gradio
sdk_version: 6.14.0
python_version: 3.11
app_file: app.py
pinned: false
---

# 🧠 CUAN-SYN: Modul Prediksi Arus Kas Bersih UMKM

Modul ini merupakan bagian dari sistem cerdas **CUAN-SYN** yang berfokus pada prediksi arus kas bersih (*net cash flow*) harian UMKM secara multivariat. Dengan memanfaatkan teknologi *Deep Learning*, model ini dirancang untuk membantu pelaku usaha menganalisis risiko likuiditas dan merencanakan keuangan esok hari secara lebih terukur.

---

## 🚀 Fitur & Keunggulan Model

* **Arsitektur Sekuensial Lanjutan**: Menggabungkan lapisan **LSTM (64 Units)** untuk menangkap pola jangka panjang dalam data runtun waktu (*time series*) dengan **Mekanisme Atensi Temporal (Simple Attention)** untuk memprioritaskan jendela waktu historis yang paling berpengaruh.
* **Fitur Multivariat Berbasis Sektor**: Model tidak hanya membaca tren kas historis (`total_income`, `total_expense`), tetapi juga mengintegrasikan karakteristik sektor usaha (seperti Kuliner dan Fashion) menggunakan *One-Hot Encoding*.
* **Asymmetric MSE Loss (Custom Loss)**: Fungsi kerugian kustom yang memberikan penalti **2.5x lebih berat** jika model memberikan prediksi yang terlalu optimis, memastikan manajemen risiko keuangan UMKM tetap aman dan konservatif.
* **Akurasi Tinggi**: Model berhasil mencapai konvergensi cepat berkat optimasi *Custom Training Loop* (`tf.GradientTape`) dengan hasil **Validation MAE sebesar 0.01856** (setara dengan **Akurasi Regresi 98.16%**).

---

## 📂 Struktur Modul

```text
📂 deep-learning/
├── 📂 notebook/
│   └── CUAN-SYN-PREDIKSI_KAS_BERSIH.ipynb  # Notebook pelatihan & Custom Loop
├── 📜 README.md                             # Dokumentasi teknis ini
└── 📜 requirements.txt                      # Dependensi library Python