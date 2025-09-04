# Landing Page Node Hosting

Sebuah halaman landing page hosting dan server backend sederhana yang dibuat menggunakan **Node.js** dan **Express.js**. Proyek ini berfungsi sebagai _proxy_ yang aman untuk mengambil data dari API monitoring eksternal, memfilter data tersebut, dan menyediakannya melalui sebuah endpoint JSON untuk digunakan oleh halaman frontend.


## \#\# Fitur Utama ✨

- **API Proxy Aman**: Menyembunyikan kunci API rahasia di sisi server untuk mencegah eksposur di sisi klien.
- **Filter Data**: Mengolah data mentah dari API eksternal dan hanya menyajikan informasi yang relevan (Uptime, Rata-rata Waktu Respons, Lokasi).
- **Server File Statis**: Dapat menyajikan file HTML, CSS, dan JavaScript untuk halaman frontend dari direktori `public`.
- **Konfigurasi Mudah**: Menggunakan variabel lingkungan (`.env`) untuk manajemen kunci API yang aman.


## \#\# Teknologi yang Digunakan 🛠️

- **Node.js**: Lingkungan eksekusi JavaScript.
- **Express.js**: Framework web minimalis untuk membuat server dan API.
- **Axios**: Library untuk melakukan permintaan HTTP ke API eksternal.
- **Dotenv**: Modul untuk memuat variabel lingkungan dari file `.env`.


## \#\# Endpoint API

Proyek ini menyediakan satu endpoint utama:

#### `GET /api/get-status`

Mengambil data status terbaru dari API eksternal, memfilternya, dan mengembalikannya dalam format JSON.

- **Contoh Respons Sukses:**

  ```json
  {
    "uptime": "99.987",
    "average_response_time": 123.75,
    "location": "Singapore, SG"
  }
  ```

- **Contoh Respons Gagal:**

  ```json
  {
    "message": "Gagal mengambil data."
  }
  ```
