Dokumentasi & Panduan Penggunaan Sistem Monitoring Tugas & Penilaian Siswa

Langkah 1: Buat Google Sheets
Buka Google Sheets dan buat spreadsheet baru.

Buat 9 kolom header persis seperti ini di baris pertama (baris 1):

A1: id

B1: nama

C1: kelas

D1: revisi

E1: status

F1: nilai1

G1: nilai2

H1: nilai3

I1: rata_rata

Masukkan data awal siswa di baris 2 dan seterusnya (isi kolom nama dan kelas, kolom lain boleh dikosongkan terlebih dahulu).

Langkah 2: Buat Kode di Google Apps Script
Pada menu atas Google Sheets, klik Ekstensi > Apps Script.

Hapus semua baris teks kode bawaan, lalu tempel kode file Kode.gs

Langkah 3: Konfigurasi Deploy (Penerapan)
Klik tombol Deploy (Terapkan) berwarna biru di kanan atas > pilih New deployment (Penerapan baru).

Klik ikon gerigi di sebelah kiri label Select type > pilih Web app (Aplikasi web).

Atur parameternya:

Description: Isi bebas (contoh: API Revisi).

Execute as: Pilih Me (email Anda).

Who has access: Pilih Anyone (Wajib Anyone agar web bisa membaca/menulis data tanpa hambatan login).

Klik tombol Deploy.

Muncul jendela perizinan:

Klik Authorize access.

Pilih akun Google Anda.

Klik Advanced (Lanjutan) di kiri bawah.

Klik Go to Untitled project (unsafe).

Klik Allow.

Salin tautan pada kolom Web app URL (URL yang berakhiran /exec).

Buka file index.html Anda, lalu tempel URL tersebut pada variabel const API_URL = "...". Selesai.
