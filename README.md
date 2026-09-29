# Bel Cerdas Cermat — Real-Time

Aplikasi web buzzer lomba cerdas cermat menggunakan Node.js, Express, dan Socket.IO.

## Fitur
- Peserta dapat membuat tim.
- Peserta dapat bergabung ke tim dengan nama masing-masing.
- Peserta mendapatkan tombol BUZZ di HP/laptop.
- Juri memulai dan mereset ronde.
- Buzzer menggunakan server timestamp/urutan penerimaan event di server.
- Tim hanya dihitung sekali dalam satu ronde.
- Panel juri menampilkan pemencet tercepat dan seluruh urutan pemencet secara real-time.
- Bisa dijalankan di laptop/server lokal sehingga HP peserta mengakses melalui Wi-Fi yang sama.

## Menjalankan

Pastikan Node.js terpasang.

```bash
npm install
npm start
```

Kemudian buka:

- Peserta: `http://IP-SERVER:3000/`
- Juri: `http://IP-SERVER:3000/judge.html`

Contoh jika laptop/server memiliki IP `192.168.1.10`:

`http://192.168.1.10:3000/`

## Skenario lomba

1. Juri membuka `/judge.html` di laptop yang tersambung ke layar/proyektor.
2. Peserta membuka `/` dari HP.
3. Salah satu peserta membuat tim.
4. Peserta lain dapat memilih tim tersebut dan memasukkan nama.
5. Juri menekan **Mulai / Ronde Baru**.
6. Semua peserta melihat tombol BUZZ aktif.
7. Peserta menekan BUZZ.
8. Server menerima event dan mencatat urutannya.
9. Panel juri langsung menampilkan #1, #2, #3, dst.
10. Juri dapat memulai ronde baru untuk menghapus urutan lama.

## Catatan penting
Untuk lomba yang membutuhkan fairness sangat ketat, letakkan server pada jaringan lokal yang stabil dan gunakan koneksi Wi-Fi yang sama. Urutan yang dicatat adalah urutan event yang diterima server, bukan waktu fisik tombol disentuh.
