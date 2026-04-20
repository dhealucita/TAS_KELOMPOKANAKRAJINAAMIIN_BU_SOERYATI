# Kantin Bu Soeryati 🦭

Aplikasi web responsif untuk pemesanan makanan kantin sekolah dengan tampilan mobile-first.

## ✨ Fitur Utama

- **📱 Mobile-First Design** - Dioptimalkan untuk perangkat mobile dengan bottom navigation
- **🏠 Beranda** - Hero section, promo banner, dan highlight produk/mitra
- **🍽️ Produk** - Daftar lengkap menu dengan fitur pencarian dan filter kategori
- **🤝 Mitra** - Informasi mitra kantin dan jumlah produk tersedia
- **🛒 Keranjang** - Sistem keranjang dengan localStorage
- **🔐 Login** - Autentikasi sederhana untuk checkout
- **📊 Data Integration** - Terintegrasi dengan file JSON untuk produk dan mitra

## 🚀 Cara Menjalankan

### Opsi 1: Browser Langsung
Buka `index.html` di browser modern (Chrome, Firefox, Safari, Edge)

### Opsi 2: Server HTTP (Direkomendasikan)
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js
npx http-server -p 8000
```

Kemudian buka `http://localhost:8000/index.html`

## 📁 Struktur Proyek

```
kantin_bu_soeryati/
├── index.html          # File HTML utama
├── css/
│   └── style.css       # Styling dengan tema biru
├── js/
│   └── app.js          # Logika aplikasi
└── data/
    ├── tabel_produk_rows.json    # Data produk (29 item)
    └── tabel_mitra_rows.json     # Data mitra
```

## 🎨 Tema & Design

- **Warna**: Tema biru segar dengan gradient
- **Typography**: Font Inter dari Google Fonts
- **Icons**: Font Awesome 6
- **Responsive**: Breakpoint di 640px dan 900px
- **Mobile Navigation**: Bottom navigation fixed dengan 3 tab

## 🛠️ Teknologi

- **HTML5** - Semantic markup
- **CSS3** - Modern styling dengan CSS Variables
- **Vanilla JavaScript** - ES6+ tanpa framework
- **Local Storage** - Persistent cart dan user data
- **Fetch API** - Load data dari JSON files

## 📱 Mobile Features

- Bottom navigation dengan icon dan label
- Touch-friendly buttons dan cards
- Optimized grid layouts untuk mobile
- Modal dialogs yang responsive
- Swipe-friendly interface

## 🔧 Development

Data produk dan mitra disimpan dalam format JSON di folder `data/`. Untuk menambah produk baru, edit file `tabel_produk_rows.json` dan `tabel_mitra_rows.json`.

Built with ❤️ for school canteen ordering system
