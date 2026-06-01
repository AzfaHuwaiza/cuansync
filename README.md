# 🚀 CuanSync - Solusi Cerdas Manajemen UMKM

## 1. Deskripsi Singkat Project
**CuanSync** adalah aplikasi berbasis *web* (Full-Stack) yang dirancang khusus untuk membantu para pelaku UMKM (Usaha Mikro, Kecil, dan Menengah) dalam mengelola bisnis mereka secara digital. Aplikasi ini memungkinkan pengguna untuk memantau statistik keuangan (pemasukan & pengeluaran), mengelola daftar produk, mencatat laporan transaksi kas, hingga membangun jejaring bisnis antar sesama UMKM. 

Aplikasi ini juga terintegrasi dengan kecerdasan buatan untuk memberikan prediksi arus kas dan rekomendasi bisnis secara pintar.

### ✨ Fitur Utama:
* 🔐 **Autentikasi Aman:** Login & Register berbasis JWT dengan perlindungan Cookie.
* 📊 **Dashboard Keuangan:** Pemantauan grafik pemasukan, pengeluaran, dan saldo bersih.
* 📦 **Manajemen Produk:** Tambah, edit, dan hapus katalog produk UMKM.
* 📒 **Buku Kas & Transaksi:** Pencatatan otomatis transaksi harian.
* 🌐 **Jejaring Bisnis:** Temukan dan pelajari profil UMKM lain dalam satu ekosistem.
* 🤖 **AI Business Assistant:** Prediksi arus kas dan masukan bisnis menggunakan Google Gemini AI.

### 🛠️ Tech Stack:
* **Frontend:** React.js, Vite, Tailwind CSS.
* **Backend:** Node.js, Express.js.
* **Database:** MySQL (Local: XAMPP, Production: Aiven Cloud).
* **Storage:** Cloudinary (Untuk penyimpanan foto profil & produk).
* **AI Integrations:** Google Gemini API.

---

## 📸 *Screenshots* Aplikasi

| Halaman Login | Halaman Register |
| ![Login](<img width="1919" height="873" alt="image" src="https://github.com/user-attachments/assets/bc256088-dfd7-4906-a668-594f6a83be88" />
) | ![Register](<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/cdf6e9e0-23ed-4904-b2ee-fe5c1cc1448d" />

) |

| Dashboard UMKM | Laporan Transaksi |![Uploading image.png…]()

| :---: | :---: |
| ![Dashboard](./path-to-dashboard-image.jpg) | ![Transaksi](./path-to-transaksi-image.jpg) |

*(Catatan: Sesuaikan link gambar di atas dengan letak file gambar di dalam folder repository Anda).*

---

## 2. Petunjuk Setup Environment

Untuk menjalankan aplikasi ini secara lokal di komputer Anda, pastikan Anda telah menginstal perangkat lunak berikut:
1.  [Node.js](https://nodejs.org/) (Versi 18 atau terbaru).
2.  [Git](https://git-scm.com/).
3.  [XAMPP](https://www.apachefriends.org/) atau Laragon (Untuk database MySQL lokal).
4.  Akun [Cloudinary](https://cloudinary.com/) (Untuk penyimpanan gambar).

---

## 3. Cara Menjalankan Aplikasi

Ikuti langkah-langkah detail berikut untuk menjalankan CuanSync di komputer lokal Anda:

### Langkah 1: *Clone Repository*
```bash
git clone [https://github.com/UsernameAnda/cuansync.git](https://github.com/UsernameAnda/cuansync.git)
cd cuansync
