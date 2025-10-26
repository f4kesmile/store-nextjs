# Store Next.js 🛒

Sebuah aplikasi e-commerce sederhana yang dibangun dengan Next.js, Prisma, dan NextAuth. Aplikasi ini menyediakan *interface* publik untuk menampilkan produk dan keranjang belanja, serta panel admin untuk mengelola berbagai aspek toko.

---

## ✨ Fitur Utama

### Publik:
* **Daftar Produk**: Menampilkan produk yang aktif.
* **Detail Produk**: Melihat detail, varian, dan stok.
* **Keranjang Belanja**: Menambah, mengubah kuantitas, menghapus item, dan menambahkan catatan.
* **Checkout via WhatsApp**: Mengirim pesanan langsung ke WhatsApp admin atau reseller.
* **Dukungan Reseller**: Memungkinkan checkout melalui link unik reseller.
* **Halaman Kontak**: Menampilkan informasi kontak toko (email, WhatsApp, lokasi) dan deskripsi "Tentang Kami".

### Admin Panel:
* **Dashboard**: Ringkasan statistik toko.
* **Manajemen Produk**: CRUD (Create, Read, Update, Delete) produk, termasuk pengelolaan varian, stok, status (Aktif/Nonaktif), dan opsi catatan per produk.
* **Manajemen Reseller**: CRUD reseller, pembuatan ID unik, dan pembuatan link produk khusus reseller.
* **Manajemen Transaksi**: Melihat, mengedit status/detail customer, menghapus transaksi, filter berdasarkan status, dan ekspor data ke CSV.
* **Manajemen Pengaturan**: Mengubah nama toko, deskripsi, kontak support (WA & Email), lokasi, dan teks "Tentang Kami".
* **(Developer Only)** **Manajemen User**: CRUD pengguna admin.
* **(Developer Only)** **Manajemen Role & Permission**: Membuat dan mengelola peran beserta hak aksesnya (permissions).
* **(Developer Only)** **Activity Logs**: Melihat catatan aktivitas yang dilakukan oleh pengguna admin.
* **Autentikasi**: Login aman menggunakan NextAuth.js.

---

## 🚀 Teknologi yang Digunakan

* **Framework**: Next.js (App Router)
* **Bahasa**: TypeScript
* **Styling**: Tailwind CSS
* **ORM**: Prisma
* **Database**: MySQL (dapat diganti melalui konfigurasi Prisma)
* **Autentikasi**: NextAuth.js

---

## ⚙️ Variabel Lingkungan (.env)

Buat file `.env` di *root* proyek dan isi variabel berikut berdasarkan file `.env.example`:

```env
DATABASE_URL="your_database_connection_string" # Contoh: mysql://user:password@host:port/database

NEXTAUTH_URL="http://localhost:3000" # Ganti dengan URL aplikasi Anda saat deployment
NEXTAUTH_SECRET="your_strong_secret_key" # Buat secret key yang kuat (openssl rand -base64 32)

# Opsional: Jika menggunakan fitur Google Sheets atau Email
# GOOGLE_SHEETS_SPREADSHEET_ID="your_spreadsheet_id"
# GOOGLE_SHEETS_CLIENT_EMAIL="your_client_email"
# GOOGLE_SHEETS_PRIVATE_KEY="your_private_key"

# SMTP_HOST="your_smtp_host"
# SMTP_PORT="your_smtp_port"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASSWORD="your-app-password"
# SUPPORT_EMAIL="support@yourstore.com" # Digunakan jika fitur kontak email diaktifkan
🏁 Memulai Proyek
Clone repository:

Bash

git clone <url-repository-anda>
cd store-nextjs
Install dependencies:

Bash

npm install
# atau
yarn install
# atau
pnpm install
Setup file .env: Salin .env.example menjadi .env dan isi nilainya sesuai konfigurasi Anda.

Jalankan migrasi Prisma: Ini akan membuat tabel database sesuai skema.

Bash

npx prisma migrate dev
Seed database (opsional tapi direkomendasikan): Ini akan mengisi data awal seperti role default dan user admin/developer.

Bash

npx prisma db seed
User Default:

Developer: developer@store.com / developer123

Admin: admin@store.com / admin123

Jalankan development server:

Bash

npm run dev
# atau
yarn dev
# atau
pnpm dev
Buka http://localhost:3000 di browser Anda untuk melihat hasilnya. Halaman login admin ada di /login.

📜 Skrip yang Tersedia
Dalam file package.json, Anda akan menemukan beberapa skrip:

npm run dev: Menjalankan aplikasi dalam mode development.

npm run build: Mem-build aplikasi untuk production.

npm run start: Menjalankan aplikasi hasil build production.

npm run prisma:generate: Meng-generate Prisma Client berdasarkan skema.

npm run prisma:migrate: Menjalankan migrasi database.

npm run prisma:studio: Membuka Prisma Studio (GUI untuk database).
