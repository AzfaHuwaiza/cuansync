# Data Dictionary — Cuansync
**Proyek Capstone | Analisis Data UMKM Indonesia**

---

## Pendahuluan

Dokumen ini merupakan Data Dictionary dari dataset yang digunakan pada proyek capstone Cuansync. Berfungsi sebagai referensi resmi yang menjelaskan struktur, tipe data, aturan validasi, dan contoh nilai dari setiap kolom pada masing-masing tabel.

### Ringkasan Dataset

| Tabel | Jumlah Baris | Jumlah Kolom | Deskripsi |
|---|---|---|---|
| users | 664 | 7 | Data akun pengguna aplikasi |
| profiles | 647 | 9 | Data profil lengkap pengguna |
| umkms | 731 | 7 | Data UMKM yang terdaftar |
| umkm_members | 682 | 5 | Relasi pengguna dan UMKM |
| products | 2.119 | 7 | Data produk/layanan UMKM |
| transactions | 5.537 | 7 | Catatan transaksi keuangan UMKM |

> Semua data merupakan data dummy yang di-generate untuk keperluan analisis. Foreign key antar tabel telah divalidasi konsistensinya.

---

## Relasi Antar Tabel

| Relasi | Kardinalitas | Join Key | Keterangan |
|---|---|---|---|
| users → profiles | 1 to 1 | `users.id = profiles.user_id` | Setiap user memiliki tepat satu profil |
| users → umkm_members | 1 to Many | `users.id = umkm_members.user_id` | Satu user dapat mengelola banyak UMKM |
| umkms → umkm_members | 1 to 1 | `umkms.id = umkm_members.umkm_id` | Satu UMKM hanya dikelola oleh satu user |
| umkms → products | 1 to Many | `umkms.id = products.umkm_id` | Satu UMKM dapat memiliki banyak produk |
| umkms → transactions | 1 to Many | `umkms.id = transactions.umkm_id` | Satu UMKM dapat memiliki banyak transaksi |

---

## Definisi Tipe Data

| Tipe | Deskripsi |
|---|---|
| `STRING` | Teks. Bertipe object/string di pandas. |
| `INTEGER` | Bilangan bulat. Bertipe int64 di pandas. |
| `FLOAT` | Bilangan desimal. Bertipe float64 di pandas. |
| `DATETIME` | Tanggal dan waktu, format `YYYY-MM-DD HH:MM:SS`. Dikonversi ke datetime64 di pandas. |
| `DATE` | Tanggal saja, format `YYYY-MM-DD`. |

---

## Detail Kolom per Tabel

### 1. Tabel `users`
Menyimpan data akun pengguna aplikasi Cuansync. Setiap baris mewakili satu akun pengguna yang terdaftar.

| Kolom | Tipe Data | Nullable | Deskripsi | Contoh Nilai |
|---|---|---|---|---|
| `id` | `STRING` | No | ID unik pengguna, format berurutan | USR001 |
| `email` | `STRING` | No | Alamat email pengguna, digunakan untuk login | panjikusuma@gmail.com |
| `password_hash` | `STRING` | No | Hash password, tidak disimpan dalam plain text | hashed_97a0e92b6aa8... |
| `name` | `STRING` | No | Nama lengkap pengguna | Panji Kusuma |
| `role` | `STRING` | No | Peran pengguna di aplikasi. Nilai: `user` | user |
| `created_at` | `DATETIME` | No | Waktu akun dibuat | 2022-07-16 18:43:51 |
| `updated_at` | `DATETIME` | No | Waktu terakhir data akun diperbarui | 2023-05-07 18:43:51 |

---

### 2. Tabel `profiles`
Menyimpan data profil lengkap pengguna. Relasi 1-to-1 dengan tabel `users` via `user_id`.

| Kolom | Tipe Data | Nullable | Deskripsi | Contoh Nilai |
|---|---|---|---|---|
| `id` | `STRING` | No | ID unik profil, format berurutan | PRFL001 |
| `user_id` | `STRING` | No | Foreign key ke tabel users | USR001 |
| `gender` | `STRING` | **Yes** | Jenis kelamin. Nilai: `Laki-laki`, `Perempuan`. Kosong jika tidak diketahui | Laki-laki |
| `phone_number` | `STRING` | **Yes** | Nomor telepon Indonesia. Format: `08xxx` atau `+628xxx` | +628570320203 |
| `address` | `STRING` | **Yes** | Alamat lengkap pengguna | Jl. Sudirman No. 10, Jakarta |
| `date_of_birth` | `DATE` | **Yes** | Tanggal lahir. Range: 1965–2007 | 1990-05-21 |
| `photo_url` | `STRING` | No | URL foto profil pengguna | https://cdn.dummyumkm.id/photos/PRFL001.jpg |
| `created_at` | `DATETIME` | No | Waktu profil dibuat | 2022-07-16 18:43:51 |
| `updated_at` | `DATETIME` | No | Waktu terakhir profil diperbarui | 2023-05-07 18:43:51 |

---

### 3. Tabel `umkms`
Menyimpan data UMKM yang terdaftar di aplikasi. Setiap UMKM memiliki satu sektor usaha.

| Kolom | Tipe Data | Nullable | Deskripsi | Contoh Nilai |
|---|---|---|---|---|
| `id` | `STRING` | No | ID unik UMKM, format berurutan | UMKM001 |
| `name` | `STRING` | No | Nama UMKM | Rental Panji |
| `sector` | `STRING` | No | Sektor usaha. Lihat Lampiran A untuk daftar lengkap | Transportasi |
| `description` | `STRING` | **Yes** | Deskripsi singkat UMKM | Penyedia jasa logistik... |
| `created_at` | `DATETIME` | No | Waktu UMKM didaftarkan | 2022-07-17 18:43:51 |
| `updated_at` | `DATETIME` | No | Waktu terakhir data UMKM diperbarui | 2023-02-22 18:43:51 |
| `photo_url` | `STRING` | **Yes** | URL foto/logo UMKM | https://cdn.dummyumkm.id/umkm/UMKM001.jpg |

---

### 4. Tabel `umkm_members`
Menyimpan relasi antara pengguna dan UMKM yang dikelolanya. Satu user dapat mengelola banyak UMKM, tetapi satu UMKM hanya dikelola oleh satu user (`umkm_id` unik).

| Kolom | Tipe Data | Nullable | Deskripsi | Contoh Nilai |
|---|---|---|---|---|
| `id` | `STRING` | No | ID unik member, format berurutan | ROLE001 |
| `user_id` | `STRING` | No | Foreign key ke tabel users. Boleh duplikat (1 user bisa kelola banyak UMKM) | USR001 |
| `umkm_id` | `STRING` | No | Foreign key ke tabel umkms. Harus unik (1 UMKM hanya 1 pengelola) | UMKM001 |
| `role` | `STRING` | No | Peran user di UMKM. Nilai: `owner` | owner |
| `created_at` | `DATETIME` | No | Waktu user bergabung sebagai member UMKM | 2022-07-17 19:09:51 |

---

### 5. Tabel `products`
Menyimpan data produk atau layanan yang dimiliki oleh setiap UMKM. Kategori produk harus sesuai dengan sektor UMKM.

| Kolom | Tipe Data | Nullable | Deskripsi | Contoh Nilai |
|---|---|---|---|---|
| `id` | `STRING` | No | ID unik produk, format berurutan | PRD001 |
| `umkm_id` | `STRING` | No | Foreign key ke tabel umkms | UMKM001 |
| `name` | `STRING` | No | Nama produk atau layanan | Jasa Packing Barang |
| `category` | `STRING` | No | Kategori produk, harus sesuai sektor UMKM. Lihat Lampiran A | Logistik |
| `base_price` | `INTEGER` | No | Harga dasar produk dalam Rupiah. Range: Rp 5.000 – Rp 9.929.000 | 1359000 |
| `created_at` | `DATETIME` | No | Waktu produk ditambahkan | 2022-07-17 18:43:51 |
| `updated_at` | `DATETIME` | No | Waktu terakhir data produk diperbarui | 2022-12-19 18:43:51 |

---

### 6. Tabel `transactions`
Menyimpan catatan transaksi keuangan (pemasukan dan pengeluaran) setiap UMKM.

| Kolom | Tipe Data | Nullable | Deskripsi | Contoh Nilai |
|---|---|---|---|---|
| `id` | `STRING` | No | ID unik transaksi, format berurutan | TRX001 |
| `umkm_id` | `STRING` | No | Foreign key ke tabel umkms | UMKM001 |
| `type` | `STRING` | No | Jenis transaksi. Nilai: `income`, `expense` | income |
| `amount` | `FLOAT` | No | Nominal transaksi dalam Rupiah. Range: Rp 5.000 – Rp 9.512.000 | 105000.0 |
| `note` | `STRING` | **Yes** | Catatan metode pembayaran. Lihat Lampiran B | Transfer BCA |
| `occurred_at` | `DATETIME` | No | Waktu transaksi terjadi | 2023-03-21 18:43:51 |
| `product_name` | `STRING` | **Yes** | Nama produk terkait transaksi. Nullable untuk transaksi `expense` | Jasa Packing Barang |

---

## Lampiran A — Mapping Sektor ke Kategori Produk

| Sektor | Kategori Produk yang Valid |
|---|---|
| Fashion | Pakaian Pria, Pakaian Wanita, Pakaian Anak, Aksesoris, Sepatu |
| Jasa | Konsultasi, Servis, Desain, Freelance, Event Organizer |
| Kerajinan | Dekorasi Rumah, Aksesoris Handmade, Souvenir, Kerajinan Kayu, Daur Ulang |
| Kesehatan | Obat Herbal, Alat Kesehatan, Suplemen, Jasa Medis, Perawatan |
| Kuliner | Makanan Berat, Minuman, Snack, Dessert, Catering |
| Pendidikan | Kursus Online, Kursus Offline, Buku, Pelatihan, Bimbel |
| Pertanian | Hasil Panen, Bibit, Pupuk, Alat Tani, Produk Olahan |
| Properti | Sewa Properti, Jual Beli, Kost, Renovasi, Interior |
| Teknologi | Software, Hardware, Jasa IT, Aplikasi, IoT |
| Transportasi | Sewa Kendaraan, Jasa Antar Jemput, Logistik, Travel, Servis Kendaraan |

---

## Lampiran B — Nilai Enum Tetap

| Tabel | Kolom | Nilai yang Valid |
|---|---|---|
| users | `role` | `user` |
| profiles | `gender` | `Laki-laki`, `Perempuan` |
| umkms | `sector` | Fashion, Jasa, Kerajinan, Kesehatan, Kuliner, Pendidikan, Pertanian, Properti, Teknologi, Transportasi |
| umkm_members | `role` | `owner` |
| transactions | `type` | `income`, `expense` |
| transactions | `note` | Pembayaran tunai, Transfer BCA, Transfer BNI, Transfer BRI, Transfer Mandiri, Gopay, OVO, Dana, Cash, Tunai |

---

## Catatan Kualitas Data (Post-Cleaning)

| Tabel | Kolom | Null Count | Keterangan |
|---|---|---|---|
| profiles | `gender` | 33 | Nilai kosong = tidak diketahui, dibiarkan NaN |
| profiles | `phone_number` | 49 | Nomor tidak tersedia atau tidak dicantumkan user |
| profiles | `address` | 30 | Alamat tidak diisi oleh user |
| profiles | `date_of_birth` | 1 | Tanggal lahir tidak diisi |
| umkms | `description` | 41 | Deskripsi UMKM belum diisi pemilik |
| umkms | `photo_url` | 67 | Foto UMKM belum diunggah |
| transactions | `note` | 1.303 | Catatan pembayaran bersifat opsional |
| transactions | `product_name` | 532 | Nullable untuk transaksi bertipe `expense` |

> Semua kolom yang bukan nullable telah dipastikan tidak mengandung nilai kosong setelah proses cleaning. Foreign key antar tabel telah divalidasi dan tidak ada orphan record.

---

*Data Dictionary — Cuansync | Proyek Capstone Data Science*
