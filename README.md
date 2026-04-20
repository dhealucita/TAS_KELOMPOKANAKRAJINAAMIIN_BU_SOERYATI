<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kantin Bu Soeryati - Menu Enak & Segar</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="header-content">
            <div class="logo">
                <span class="brand-icon">🦭</span>
                <div class="brand-copy">
                    <span class="brand-label">Kantin Sekolah</span>
                    <h1>Kantin Bu Soeryati</h1>
                </div>
            </div>
            <div class="header-actions">
                <button id="cart-button" class="icon-btn" onclick="openCartModal()">
                    <span class="icon">🛒</span>
                    <span class="icon-label">Keranjang</span>
                    <span id="cart-count" class="badge-count">0</span>
                </button>
                <button id="account-button" class="icon-btn" onclick="openLoginModal()">
                    <span class="icon">🦭</span>
                    <span id="account-label">Masuk</span>
                </button>
            </div>
        </div>
    </header>

    <main>
        <section id="home" class="section active">
            <div class="hero">
                <div class="hero-copy">
                    <span class="hero-tag">Login dulu untuk akses promo spesial</span>
                    <h2>Order makanan kantin lebih cepat dan mudah</h2>
                    <p>Tambahkan menu favorit ke keranjang, checkout, dan nikmati promo diskon setiap hari. Pastikan kamu login lebih dulu sebelum memesan.</p>
                    <div class="hero-buttons">
                        <button class="btn btn-primary" onclick="openLoginModal()">Login Akun</button>
                        <button class="btn btn-secondary" onclick="showSection('produk')">Lihat Menu</button>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="seal-card">
                        <div class="seal-face">🦭</div>
                        <p class="seal-text">Si Sealera</p>
                    </div>
                </div>
            </div>

            <div class="dashboard-cards">
                <div class="stat-card">
                    <h4>Pesanan Hari Ini</h4>
                    <strong>128</strong>
                </div>
                <div class="stat-card">
                    <h4>Menu Populer</h4>
                    <strong>24</strong>
                </div>
                <div class="stat-card">
                    <h4>Waktu Cepat</h4>
                    <strong>10–15 menit</strong>
                </div>
            </div>

            <div class="promo-banner">
                <div>
                    <span class="promo-tag">PROMO HARI INI</span>
                    <p><strong>Diskon 15%</strong> untuk 2 item pertama + gratis minuman hangat.</p>
                </div>
                <button class="btn btn-primary-sm" onclick="showSection('produk')">Order Sekarang</button>
            </div>

            <div class="promo-grid">
                <article class="promo-card">
                    <span class="promo-icon">🔥</span>
                    <h3>Beli 2 Gratis 1</h3>
                    <p>Pilih menu snack favorit dan dapatkan satu minuman gratis.</p>
                </article>
                <article class="promo-card">
                    <span class="promo-icon">⭐</span>
                    <h3>Member Spesial</h3>
                    <p>Login sekarang untuk akses promo eksklusif dan notifikasi pesanan.</p>
                </article>
                <article class="promo-card">
                    <span class="promo-icon">⏰</span>
                    <h3>Express Pickup</h3>
                    <p>Order sekarang, ambil makananmu di kantin dalam 15 menit.</p>
                </article>
            </div>

            <div class="highlights">
                <h3>Produk Terpopuler</h3>
                <div id="highlight-produk" class="grid"></div>
                <h3>Mitra Terpercaya</h3>
                <div id="highlight-mitra" class="grid"></div>
            </div>
        </section>

        <section id="produk" class="section">
            <h2>🍽️ Daftar Produk Kami</h2>
            <div class="search-filter">
                <input type="text" id="search-produk" placeholder="🔍 Cari produk...">
                <select id="filter-kategori">
                    <option value="">Semua Kategori</option>
                    <option value="makanan">🍖 Makanan</option>
                    <option value="minuman">🥤 Minuman</option>
                    <option value="snack">🍿 Snack</option>
                </select>
                <select id="sort-produk">
                    <option value="terlaris">Terlaris</option>
                    <option value="termurah">Termurah</option>
                    <option value="termahal">Termahal</option>
                </select>
            </div>
            <div id="produk-list" class="grid"></div>
        </section>

        <section id="mitra" class="section">
            <h2>🏪 Mitra Kami</h2>
            <div id="mitra-list" class="grid"></div>
        </section>

        <section id="cart" class="section">
            <h2>🛒 Keranjang</h2>
            <div id="cart-items" class="cart-items"></div>
            <div class="cart-summary">
                <div class="cart-total">
                    <span>Total</span>
                    <strong id="cart-total-amount">Rp 0</strong>
                </div>
                <textarea id="cart-notes" placeholder="Catatan pesanan (opsional)"></textarea>
                <button class="btn btn-primary" onclick="showSection('checkout')">Checkout</button>
            </div>
        </section>

        <section id="checkout" class="section">
            <h2>💳 Checkout</h2>
            <div class="checkout-summary">
                <h3>Ringkasan Pesanan</h3>
                <div id="checkout-items"></div>
                <div class="checkout-total">
                    <span>Total</span>
                    <strong id="checkout-total">Rp 0</strong>
                </div>
            </div>
            <div class="payment-method">
                <h3>Metode Pembayaran</h3>
                <label><input type="radio" name="payment" value="cash" checked> Cash</label>
                <label><input type="radio" name="payment" value="ewallet"> E-wallet</label>
            </div>
            <div class="estimated-time">
                <p>Estimasi waktu: 10–15 menit</p>
            </div>
            <button class="btn btn-primary" onclick="placeOrder()">Buat Pesanan</button>
        </section>

        <section id="order-status" class="section">
            <h2>📋 Status Pesanan</h2>
            <div class="order-progress">
                <div class="progress-step active" id="step-1">
                    <div class="step-icon">📝</div>
                    <span>Diproses</span>
                </div>
                <div class="progress-step" id="step-2">
                    <div class="step-icon">👨‍🍳</div>
                    <span>Sedang dibuat</span>
                </div>
                <div class="progress-step" id="step-3">
                    <div class="step-icon">✅</div>
                    <span>Siap diambil</span>
                </div>
            </div>
            <div class="order-details">
                <p>Nomor pesanan: #12345</p>
                <p>Estimasi selesai: 10 menit lagi</p>
            </div>
        </section>

        <section id="profile" class="section">
            <h2>👤 Profile</h2>
            <div class="profile-info">
                <div class="user-avatar">🦭</div>
                <h3 id="user-name">Nama User</h3>
            </div>
            <div class="profile-menu">
                <button class="profile-item" onclick="showSection('order-history')">Riwayat Pesanan</button>
                <button class="profile-item" onclick="showSection('wishlist')">Wishlist</button>
                <button class="profile-item" onclick="logout()">Logout</button>
            </div>
        </section>

        <section id="order-history" class="section">
            <h2>📜 Riwayat Pesanan</h2>
            <div id="history-list"></div>
        </section>

        <section id="wishlist" class="section">
            <h2>❤️ Wishlist</h2>
            <div id="wishlist-items" class="grid"></div>
        </section>
    </main>

    <nav class="bottom-nav">
        <a href="#home" class="nav-item active" onclick="showSection('home')"><i class="fas fa-home"></i><span>Beranda</span></a>
        <a href="#produk" class="nav-item" onclick="showSection('produk')"><i class="fas fa-utensils"></i><span>Produk</span></a>
        <a href="#cart" class="nav-item" onclick="showSection('cart')"><i class="fas fa-shopping-cart"></i><span>Keranjang</span></a>
        <a href="#profile" class="nav-item" onclick="showSection('profile')"><i class="fas fa-user"></i><span>Profile</span></a>
    </nav>

    <div id="login-modal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Login Akun</h3>
                <button class="close-btn" onclick="closeLoginModal()">×</button>
            </div>
            <div class="modal-body">
                <p>Masuk dulu untuk memesan dan menggunakan keranjang.</p>
                <form id="login-form">
                    <label for="login-name">Nama</label>
                    <input id="login-name" type="text" placeholder="Nama kamu" required>
                    <label for="login-email">Email</label>
                    <input id="login-email" type="email" placeholder="email@domain.com" required>
                    <div class="hero-buttons" style="margin-top:1rem;">
                        <button class="btn btn-primary" type="submit">Login</button>
                        <button class="btn btn-secondary" type="button" onclick="closeLoginModal()">Batal</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="cart-modal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Keranjang Pesanan</h3>
                <button class="close-btn" onclick="closeCartModal()">×</button>
            </div>
            <div class="modal-body">
                <div id="cart-list" class="cart-list"></div>
                <div class="cart-total">
                    <span>Total</span>
                    <strong id="cart-total">Rp 0</strong>
                </div>
                <div class="hero-buttons" style="margin-top:1rem;">
                    <button class="btn btn-primary" onclick="checkoutCart()">Checkout</button>
                    <button class="btn btn-secondary" onclick="closeCartModal()">Lanjutkan Belanja</button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>
