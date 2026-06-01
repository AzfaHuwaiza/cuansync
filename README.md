# 🚀 CuanSync - Solusi Cerdas Manajemen UMKM

![CuanSync Banner](./link-gambar-banner-atau-login.jpg) ## 1. Deskripsi Singkat Project
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
| :<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/c9bdf0ff-e045-4a3f-a253-f64354b359de" />
: | :<img width="1919" height="872" alt="image" src="https://github.com/user-attachments/assets/0aa1a923-fd41-4612-a75e-ea23fda5f186" />
: |


| Dashboard UMKM | Laporan Transaksi |
| <img width="1557" height="868" alt="image" src="https://github.com/user-attachments/assets/bb1689ba-8406-4634-a6f5-aa0b15a6c794" />
<img width="1558" height="867" alt="image" src="https://github.com/user-attachments/assets/668ebcb2-f62c-4ee0-877c-8ce6ad89b570" />
 | <img width="1560" height="871" alt="image" src="https://github.com/user-attachments/assets/ea771870-7600-466d-934e-830b47b2851c" />
 |
 <img width="1556" height="865" alt="image" src="https://github.com/user-attachments/assets/c5a29bf7-9185-45d4-925d-01046552542d" />
 <img width="1553" height="869" alt="image" src="https://github.com/user-attachments/assets/43ecea86-5f36-48fc-8ca4-f568bb674a3c" />
<img width="1554" height="871" alt="image" src="https://github.com/user-attachments/assets/6fdbfc0f-b2a9-44c2-a15c-32a2f4dd26db" />
<img width="1556" height="867" alt="image" src="https://github.com/user-attachments/assets/e0fb4f98-1c30-4ee0-8687-c0b62a9a4dfa" />
<img width="1559" height="858" alt="image" src="https://github.com/user-attachments/assets/c9d5c408-f634-4929-8136-e042f11e17d7" />


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
git clone [https://github.com/AzfaHuwaiza/cuansync]
cd cuansync

Langkah 2: Setup Database Lokal
Buka aplikasi XAMPP dan jalankan modul MySQL & Apache.

Buka browser dan akses http://localhost/phpmyadmin.

Buat database baru dengan nama: db_cuansync. (Catatan: Anda tidak perlu membuat tabel secara manual, sistem backend akan membuatkannya secara otomatis saat dijalankan).

Langkah 3: Setup & Jalankan Backend
Buka terminal baru dan masuk ke folder server:

Bash
cd server
npm install
Buat file .env di dalam folder server dan isi dengan konfigurasi berikut:

Cuplikan kode
# ENVIRONMENT
NODE_ENV=development
PORT=5000

# DATABASE LOKAL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_cuansync
DB_PORT=3306

# JWT SECRETS (Ganti teks acak sesuai keinginan)
ACCESS_TOKEN=rahasia_access_token_123
REFRESH_TOKEN=rahasia_refresh_token_123

# CLOUDINARY API (Dapatkan dari dashboard Cloudinary)
CLOUDINARY_CLOUD_NAME=nama_cloud_anda
CLOUDINARY_API_KEY=api_key_anda
CLOUDINARY_API_SECRET=api_secret_anda

# GOOGLE GEMINI API
GEMINI_API_KEY=masukkan_api_key_gemini_anda_di_sini
GEMINI_MODEL=gemini-1.5-flash
Jalankan server backend:

Bash
npm run dev
(Pastikan muncul tulisan "Database terhubung" di terminal).

Langkah 4: Setup & Jalankan Frontend
Buka terminal baru dan masuk ke folder client/frontend:

Bash
cd client
npm install
Buat file .env di dalam folder client dan isi dengan konfigurasi berikut:

Cuplikan kode
VITE_API_URL=http://localhost:5000/api
Jalankan aplikasi frontend:

Bash
npm run dev
Buka tautan http://localhost:5173 di browser Anda. Aplikasi siap digunakan!

4. Tautan Model ML (Machine Learning)
Aplikasi ini tidak menggunakan model ML statis (seperti .h5 atau .pkl) yang perlu diunduh. Sebagai gantinya, CuanSync terintegrasi langsung dengan Large Language Model (LLM) tercanggih melalui API.

Model yang digunakan: Google Gemini 1.5 Flash.

Cara mendapatkan akses: Anda harus mendaftar dan men-generate API Key secara mandiri melalui Google AI Studio.

Implementasi: Setelah mendapatkan API Key, masukkan key tersebut ke dalam file .env di bagian backend (GEMINI_API_KEY).

Dibuat oleh [CC26-PSU086]
