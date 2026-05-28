# Penjelasan Profiles (Backend)

Dokumen ini menjelaskan fitur **Profiles** yang kita buat di backend (Express + MySQL) berdasarkan tabel `profiles`:

- `id` (varchar(36))
- `user_id` (varchar(36))
- `gender` (enum('Laki-laki','Perempuan'))
- `phone_number` (varchar(20), boleh NULL)
- `address` (text, boleh NULL)
- `date_of_birth` (DATE, NOT NULL)
- `photo_url` (varchar(255), boleh NULL)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Tujuan fitur:
1. User bisa menyimpan biodata (gender, tanggal lahir, dll).
2. User bisa upload foto profil.
3. Yang disimpan ke database untuk foto **bukan file-nya**, tapi cukup **alamat URL** file (`photo_url`).

---

## 1) Ringkasan Endpoint

Semua endpoint berada di prefix `/api/profile` dan membutuhkan login (Bearer token).

### A. Ambil profil
- **GET** `/api/profile`
- Hasil: data profile untuk user yang sedang login.

### B. Buat/Update profil (smart upsert)
- **PUT** `/api/profile`
- Input JSON:
  - `gender` (wajib)
  - `date_of_birth` (wajib, format `YYYY-MM-DD`)
  - `phone_number` (opsional)
  - `address` (opsional)
- Perilaku:
  - Kalau profil belum ada → **INSERT**
  - Kalau profil sudah ada → **UPDATE**

### C. Upload foto profil (smart upsert)
- **PUT** `/api/profile/picture`
- Input `multipart/form-data`:
  - `picture` = file gambar (jpg/png)
  - Jika profil **belum ada**, kamu juga harus kirim field wajib:
    - `gender`
    - `date_of_birth` (format `YYYY-MM-DD`)
  - Field opsional juga boleh ikut:
    - `phone_number`, `address`

Perilaku:
- Kalau profil sudah ada → update `photo_url` saja.
- Kalau profil belum ada → otomatis buat profil baru **sekaligus** isi `photo_url`.

Kenapa butuh `gender` dan `date_of_birth` saat insert? Karena kolom `gender` dan `date_of_birth` di tabel bersifat **NOT NULL**. Ibarat formulir sekolah yang mewajibkan “jenis kelamin” dan “tanggal lahir”, kamu tidak bisa mengumpulkan formulir kalau dua kolom itu kosong.

---

## 2) File yang Dibuat/Diubah

- `src/routes/profile.js` → router endpoint profile
- `src/services/profileService.js` → logika database profiles
- `src/validator/profileValidator.js` → validasi input untuk PUT profile
- `src/middleware/uploadConfig.js` → konfigurasi upload gambar (multer)
- `src/routes/index.js` → mendaftarkan router `/profile`
- `server.js` → mengaktifkan static file `/uploads`

---

## 3) Konsep Penting Sekali (Tidak Diulang Terus)

- **`const`**: dipakai untuk variabel yang referensinya tidak diganti. Kita pakai agar kode lebih aman (tidak mudah “ke-ubah” tanpa sengaja).
- **`async/await`**: dipakai karena query database itu butuh waktu (seperti menunggu kasir menghitung total belanja).
- **`throw new ClientError(...)`**: cara kita memberi pesan error yang jelas ke frontend (misal: “profil belum ada”).

---

## 4) Penjelasan Kode: `src/services/profileService.js`

Bayangkan database itu seperti **lemari arsip**.
- Setiap user punya **map** (folder) bernama `profiles`.
- Di dalam map itu ada biodata.

Service ini adalah “petugas arsip” yang tugasnya:
- Memeriksa apakah user ada.
- Mengambil biodata.
- Membuat biodata baru kalau belum ada.
- Memperbarui biodata kalau sudah ada.

### A. Import
- `db`: koneksi ke MySQL.
- `ClientError`: error yang pesannya aman untuk user.
- `crypto`: dipakai untuk membuat `UUID` (`randomUUID()`), cocok untuk `varchar(36)`.

Kenapa pakai UUID?
- Tabel `profiles.id` tipe `varchar(36)` cocok untuk UUID.
- UUID itu seperti nomor KTP acak yang unik, kecil kemungkinan tabrakan.

### B. `ensureUserExists(user_id)`
Fungsi ini memastikan `user_id` benar-benar ada di tabel `users`.

Analogi: sebelum mengisi biodata siswa, sekolah memastikan siswa itu benar-benar terdaftar.

Kenapa harus dicek?
- Supaya tidak ada data profil “yatim” (punya `user_id` yang tidak ada).
- Kalau user tidak ada, kita stop lebih cepat dengan error yang jelas.

### C. `normalizeNullableString(value)`

Ini fungsi kecil untuk merapikan nilai string opsional (misalnya `phone_number`, `address`).

Analogi dunia nyata:
- Di formulir, kolom “Alamat” boleh kosong.
- Kalau orang menulis **kosong** atau hanya spasi, itu sama artinya **tidak mengisi**.

Fungsinya:
- Mengubah string kosong menjadi `null` supaya database menyimpan “tidak ada nilai” (NULL), bukan “string kosong”.

Baris per baris:

1) `if (value === undefined) return undefined;`
- **Kenapa `undefined` dibedakan?**
  - `undefined` artinya: field-nya tidak dikirim sama sekali.
  - Ini penting kalau suatu saat kamu mau membedakan antara:
    - “aku tidak mengubah field ini” (tidak mengirim)
    - vs “aku mengosongkan field ini” (mengirim kosong)
- Saat ini kita memang update field-field itu ketika upsert, tapi pola ini membuat fungsi aman dan fleksibel.

2) `if (value === null) return null;`
- Kalau frontend memang mengirim `null`, kita biarkan `null`.
- Analogi: siswa menulis “-” di kolom alamat, artinya memang tidak ada.

3) `if (typeof value === 'string' && value.trim() === '') return null;`
- Kalau nilai string hanya spasi/kosong, kita ubah ke `null`.
- Kenapa?
  - Database lebih enak menyimpan “kosong” sebagai NULL.
  - Query dan validasi di masa depan juga lebih mudah.

4) `return value;`
- Kalau nilainya valid (misal nomor HP benar), kita kembalikan apa adanya.

### D. `getProfileByUserId(user_id)`
Tugas: ambil 1 profil berdasarkan user.

Kenapa ada `DATE_FORMAT(date_of_birth, '%Y-%m-%d')`?
- Kolom `date_of_birth` tipe DATE.
- Frontend biasanya nyaman menerima format string `YYYY-MM-DD`.
- Jadi kita rapikan dari SQL supaya konsisten.

Analogi: kamu minta dokumen lahir, petugas arsip memfotokopi dengan format tanggal yang rapi.

### E. `upsertProfileByUserId(user_id, payload)`

Ini inti “PUT yang lebih pinter” untuk biodata.

Makna “upsert”:
- **UP**date jika ada
- in**SERT** jika tidak ada

Alur:
1) Pastikan user ada.
2) Siapkan data (gender, phone, address, date_of_birth).
3) Cek apakah row profile sudah ada.
4) Kalau belum ada → INSERT.
5) Kalau sudah ada → UPDATE.
6) Kembalikan hasil terbaru dari database.

Analogi dunia nyata:
- Kalau siswa belum punya map biodata → buat map baru.
- Kalau sudah punya map → perbarui isinya.

### F. `upsertProfilePhotoByUserId(user_id, photo_url, payload = {})`

Ini yang membuat endpoint upload foto jadi “smart”.

Kenapa perlu `payload`?
- Karena saat profil belum ada, kita tidak bisa insert hanya dengan foto.
- Tabel mewajibkan `gender` dan `date_of_birth`.
- Jadi saat upload pertama kali, frontend bisa kirim dua field itu sekaligus (di multipart).

Alur:
1) Pastikan user ada.
2) Cek apakah profil sudah ada.

Jika belum ada:
- Ambil `gender` & `date_of_birth` dari `payload`.
- Kalau salah satu tidak ada → lempar error dengan instruksi yang jelas.
- Kalau ada → INSERT profil baru sambil isi `photo_url`.

Jika sudah ada:
- UPDATE `photo_url` saja.

Analogi dunia nyata:
- Kamu mau menempel foto ke kartu pelajar.
- Tapi kalau kartu pelajarnya belum dicetak (profil belum ada), kamu harus isi data wajib dulu supaya kartu bisa dibuat, baru foto bisa ditempel.

---

## 5) Penjelasan Kode: Upload dan URL

### A. `src/middleware/uploadConfig.js`
- Menggunakan `multer` untuk menyimpan file ke folder: `public/uploads/profiles`.
- Kita buat folder otomatis dengan `fs.mkdirSync(..., { recursive: true })`.

Kenapa folder dibuat otomatis?
- Biar server tidak error saat folder belum ada.
- Analogi: sebelum menyimpan arsip, petugas memastikan lemari-nya sudah tersedia.

File filter:
- Hanya menerima JPG/PNG.
- Kalau format salah, kita lempar `ClientError` supaya frontend dapat pesan yang rapi.

### B. `server.js` static
- `app.use('/uploads', express.static(...))`

Kenapa?
- Karena file fisik disimpan di server.
- Browser/FE butuh URL untuk akses file itu.

Analogi:
- Kamu simpan foto di rak (folder).
- Static route itu seperti “pintu layanan” agar orang bisa melihat isi rak lewat alamat tertentu.

`photo_url` yang disimpan ke DB akan berbentuk:
- `http://<host>/uploads/profiles/<nama_file>`

---

## 6) Contoh Request (Frontend)

### A. Buat/Update profile (JSON)
`PUT /api/profile`

Body:
```json
{
  "gender": "Laki-laki",
  "date_of_birth": "2006-05-01",
  "phone_number": "08123456789",
  "address": "Jl. Mawar No. 1"
}
```

### B. Upload foto (multipart)
`PUT /api/profile/picture`

FormData:
- `picture`: (file)
- `gender`: `Perempuan` (wajib jika profil belum ada)
- `date_of_birth`: `2006-05-01` (wajib jika profil belum ada)

---

## 7) Kenapa Desainnya Begini? (Sebab → Akibat)

- Memakai **upsert** di PUT profile
  - Sebab: frontend cukup panggil 1 endpoint tanpa pusing “profile sudah ada atau belum”.
  - Akibat: UX lebih simpel, backend menangani logika.

- Menyimpan **URL** di `photo_url`, bukan file
  - Sebab: database bukan tempat ideal untuk file besar.
  - Akibat: query DB tetap cepat; file disimpan di filesystem.

- Wajib `gender` & `date_of_birth` untuk insert
  - Sebab: aturan tabel `NOT NULL`.
  - Akibat: kita harus menjaga konsistensi data (tidak boleh ada profil tanpa data wajib).

---

Kalau kamu mau, aku bisa bantu bikin service frontend (misal `profileServices.js`) dan contoh pemakaian `FormData` di React supaya nyambung ke endpoint di atas.
