// app.js for Kantin Bu Soeryati

let mitraData = []; // Will be loaded from JSON
let produkData = []; // Will be loaded from JSON

let currentUser = null;
let cart = [];
let wishlist = [];
let pendingProductId = null;

try {
    const userData = localStorage.getItem('kantin_user');
    currentUser = userData ? JSON.parse(userData) : null;
} catch (error) {
    console.warn('Error parsing user data from localStorage:', error);
    localStorage.removeItem('kantin_user');
}

try {
    const cartData = localStorage.getItem('kantin_cart');
    cart = cartData ? JSON.parse(cartData) : [];
} catch (error) {
    console.warn('Error parsing cart data from localStorage:', error);
    localStorage.removeItem('kantin_cart');
}

try {
    const wishlistData = localStorage.getItem('kantin_wishlist');
    wishlist = wishlistData ? JSON.parse(wishlistData) : [];
} catch (error) {
    console.warn('Error parsing wishlist data from localStorage:', error);
    localStorage.removeItem('kantin_wishlist');
}

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const accountLabel = document.getElementById('account-label');
const cartCount = document.getElementById('cart-count');
const loginModal = document.getElementById('login-modal');
const cartModal = document.getElementById('cart-modal');
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('href').substring(1);
        showSection(target);
    });
});

function saveState() {
    localStorage.setItem('kantin_user', JSON.stringify(currentUser));
    localStorage.setItem('kantin_cart', JSON.stringify(cart));
    localStorage.setItem('kantin_wishlist', JSON.stringify(wishlist));
}

function showSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    const targetNav = document.querySelector(`.nav-item[href="#${sectionId}"]`);

    if (targetSection) targetSection.classList.add('active');
    if (targetNav) targetNav.classList.add('active');
}

function updateAccountUI() {
    if (currentUser) {
        accountLabel.textContent = currentUser.name;
    } else {
        accountLabel.textContent = 'Masuk';
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.qty, 0);
    cartCount.textContent = count;
}

function formatRupiah(value) {
    const number = Number(value.toString().replace(/\D/g, '')) || 0;
    return number.toLocaleString('id-ID');
}

function openLoginModal() {
    loginModal.classList.remove('hidden');
}

function closeLoginModal() {
    loginModal.classList.add('hidden');
}

function openCartModal() {
    renderCart();
    cartModal.classList.remove('hidden');
}

function closeCartModal() {
    cartModal.classList.add('hidden');
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartListModal = document.getElementById('cart-list');
    const cartTotalModal = document.getElementById('cart-total');

    if (!cart.length) {
        const emptyHtml = '<p>Keranjang kosong. Tambahkan menu untuk memesan.</p>';
        if (cartItems) cartItems.innerHTML = emptyHtml;
        if (cartListModal) cartListModal.innerHTML = emptyHtml;
        if (cartTotalAmount) cartTotalAmount.textContent = 'Rp 0';
        if (cartTotalModal) cartTotalModal.textContent = 'Rp 0';
        return;
    }

    let total = 0;
    const cartHtml = cart.map(item => {
        const product = produkData.find(p => p.product_id === item.id);
        if (!product) return '';

        const subtotal = Number(product.harga.replace(/\D/g, '')) * item.qty;
        total += subtotal;
        return `
            <div class="cart-item">
                <img src="${convertGoogleDriveUrl(product.foto_url)}" alt="${product.nama_produk}" onerror="this.src='${getPlaceholderImage(product)}'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${product.nama_produk}</div>
                    <div class="cart-item-price">Rp ${formatRupiah(product.harga)}</div>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.qty - 1})">-</button>
                    <span>${item.qty}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.qty + 1})">+</button>
                </div>
                <button onclick="removeCartItem('${item.id}')" style="background: none; border: none; color: #FF6B35; cursor: pointer;">🗑️</button>
            </div>
        `;
    }).join('');

    if (cartItems) cartItems.innerHTML = cartHtml;
    if (cartListModal) cartListModal.innerHTML = cartHtml;
    if (cartTotalAmount) cartTotalAmount.textContent = `Rp ${formatRupiah(total)}`;
    if (cartTotalModal) cartTotalModal.textContent = `Rp ${formatRupiah(total)}`;
}

function updateQuantity(productId, newQty) {
    if (newQty <= 0) {
        removeCartItem(productId);
        return;
    }

    const product = produkData.find(p => p.product_id === productId);
    if (!product) return;

    const maxQty = Number(product.stok) || 1;
    if (newQty > maxQty) {
        alert('Stok tidak cukup.');
        return;
    }

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.qty = newQty;
        saveState();
        updateCartCount();
        renderCart();
    }
}

function renderCheckout() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');

    let total = 0;
    checkoutItems.innerHTML = cart.map(item => {
        const product = produkData.find(p => p.product_id === item.id);
        if (!product) return '';

        const subtotal = Number(product.harga.replace(/\D/g, '')) * item.qty;
        total += subtotal;
        return `
            <div class="checkout-item">
                <span>${product.nama_produk} x ${item.qty}</span>
                <span>Rp ${formatRupiah(subtotal)}</span>
            </div>
        `;
    }).join('');

    checkoutTotal.textContent = `Rp ${formatRupiah(total)}`;
}

function placeOrder() {
    const total = cart.reduce((sum, item) => {
        const product = produkData.find(p => p.product_id === item.id);
        return sum + Number(product.harga.replace(/\D/g, '')) * item.qty;
    }, 0);

    alert(`Terima kasih ${currentUser.name}!\nPesananmu berhasil dibuat dengan total Rp ${formatRupiah(total)}.`);
    cart = [];
    saveState();
    updateCartCount();
    renderCart();
    showSection('order-status');
    // Simulate order progress
    setTimeout(() => document.getElementById('step-1').classList.add('active'), 1000);
    setTimeout(() => {
        document.getElementById('step-1').classList.remove('active');
        document.getElementById('step-2').classList.add('active');
    }, 3000);
    setTimeout(() => {
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-3').classList.add('active');
    }, 6000);
}

function checkoutCart() {
    if (!currentUser) {
        openLoginModal();
        return;
    }

    if (!cart.length) {
        alert('Keranjang masih kosong. Tambahkan produk terlebih dahulu.');
        return;
    }

    closeCartModal();
    showSection('checkout');
    renderCheckout();
}

function getCategoryEmoji(category) {
    const categoryLower = category.toLowerCase().trim();
    if (categoryLower.includes('makanan')) return '🍜';
    if (categoryLower.includes('minuman')) return '🥤';
    return '🍽️';
}

function getCategoryClass(category) {
    const categoryLower = category.toLowerCase().trim();
    if (categoryLower.includes('makanan')) return 'makanan';
    if (categoryLower.includes('minuman')) return 'minuman';
    return 'makanan';
}

function getPlaceholderImage(produk) {
    const category = produk.kategori.toLowerCase().trim();
    const name = produk.nama_produk;
    let bgColor = '#FFE4B5'; // Default light orange
    let textColor = '#8B4513'; // Brown text

    if (category.includes('makanan')) {
        bgColor = '#FFF8DC'; // Cream
        textColor = '#8B4513'; // Brown
    } else if (category.includes('minuman')) {
        bgColor = '#E0F6FF'; // Light blue
        textColor = '#1E40AF'; // Blue
    }

    // Create SVG placeholder inline to avoid external dependencies
    const svg = `
        <svg width="400" height="170" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="170" fill="${bgColor}"/>
            <text x="200" y="85" font-family="Arial, sans-serif" font-size="16" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${name}</text>
        </svg>
    `;

    // Encode SVG as data URL
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function convertGoogleDriveUrl(url) {
    if (!url || typeof url !== 'string') return url;

    const normalizedUrl = url.trim();

    // If it's already lh3.googleusercontent.com format, use it directly
    if (normalizedUrl.includes('lh3.googleusercontent.com')) {
        return normalizedUrl;
    }

    // Extract File ID from various Google Drive URL formats
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)\//,
        /[?&]id=([a-zA-Z0-9_-]+)/,
        /\/d\/([a-zA-Z0-9_-]+)(?:[?#]|$)/
    ];

    for (const pattern of patterns) {
        const match = normalizedUrl.match(pattern);
        if (match) {
            const fileId = match[1];
            // Return direct lh3 format that works in img tags
            return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
    }

    return normalizedUrl;
}

function displayHighlights() {
    const highlightProduk = document.getElementById('highlight-produk');
    const highlightMitra = document.getElementById('highlight-mitra');

    const produkHtml = produkData.slice(0, 3).map(produk => {
        const emoji = getCategoryEmoji(produk.kategori);
        const categoryClass = getCategoryClass(produk.kategori);
        const imageUrl = convertGoogleDriveUrl(produk.foto_url);
        return `
            <div class="card">
                <img src="${imageUrl}" alt="${produk.nama_produk}" onerror="this.src='${getPlaceholderImage(produk)}'">
                <div class="category-badge ${categoryClass}">${emoji} ${produk.kategori}</div>
                <h3>${produk.nama_produk}</h3>
                <p><strong>Rp ${formatRupiah(produk.harga)}</strong></p>
                <p>📦 Stok: ${produk.stok}</p>
                <button class="btn btn-primary" onclick="addToCart('${produk.product_id}')">🛒 Pesan</button>
            </div>
        `;
    }).join('');
    highlightProduk.innerHTML = produkHtml;

    const mitraHtml = mitraData.map(mitra => `
        <div class="card">
            <h3>🏪 ${mitra.nama_mitra}</h3>
            <p><strong>📍 ${mitra.alamat}</strong></p>
            <p>👤 Pemilik: ${mitra.owner_name}</p>
            <p>📧 ${mitra.email}</p>
            <p>🏫 ${mitra.sekolah}</p>
            <button class="btn btn-secondary" onclick="showSection('produk')">🔍 Lihat Produk</button>
        </div>
    `).join('');
    highlightMitra.innerHTML = mitraHtml;
}

function displayProduk() {
    const produkList = document.getElementById('produk-list');
    const searchInput = document.getElementById('search-produk');
    const filterSelect = document.getElementById('filter-kategori');
    const sortSelect = document.getElementById('sort-produk');

    function filterAndSortProduk() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;
        const sortBy = sortSelect.value;

        let filtered = produkData.filter(produk => {
            const matchesSearch = produk.nama_produk.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || produk.kategori.toLowerCase().includes(selectedCategory.toLowerCase());
            return matchesSearch && matchesCategory;
        });

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'termurah':
                    return Number(a.harga.replace(/\D/g, '')) - Number(b.harga.replace(/\D/g, ''));
                case 'termahal':
                    return Number(b.harga.replace(/\D/g, '')) - Number(a.harga.replace(/\D/g, ''));
                case 'terlaris':
                default:
                    return (b.rating || 0) - (a.rating || 0);
            }
        });

        const produkHtml = filtered.map(produk => {
            const emoji = getCategoryEmoji(produk.kategori);
            const categoryClass = getCategoryClass(produk.kategori);
            const imageUrl = convertGoogleDriveUrl(produk.foto_url);
            const rating = produk.rating || 4.5;
            const isWishlisted = wishlist.includes(produk.product_id);
            return `
                <div class="card">
                    <img src="${imageUrl}" alt="${produk.nama_produk}" onerror="this.src='${getPlaceholderImage(produk)}'">
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${produk.product_id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <div class="category-badge ${categoryClass}">${emoji} ${produk.kategori}</div>
                    <h3>${produk.nama_produk}</h3>
                    <div class="product-rating">
                        <div class="stars">${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}</div>
                        <span class="rating-text">${rating} (${Math.floor(Math.random() * 100) + 10})</span>
                    </div>
                    <p><strong>💰 Rp ${formatRupiah(produk.harga)}</strong></p>
                    <p>📦 Stok: ${produk.stok}</p>
                    <button class="add-to-cart-btn" onclick="addToCart('${produk.product_id}')">🛒 Tambah ke Keranjang</button>
                </div>
            `;
        }).join('');
        produkList.innerHTML = produkHtml;
    }

    searchInput.addEventListener('input', filterAndSortProduk);
    filterSelect.addEventListener('change', filterAndSortProduk);
    sortSelect.addEventListener('change', filterAndSortProduk);
    filterAndSortProduk();
}

function displayMitra() {
    const mitraList = document.getElementById('mitra-list');
    const mitraHtml = mitraData.map(mitra => {
        const produkCount = produkData.filter(p => p.mitra_id === mitra.mitra_id).length;
        return `
            <div class="card">
                <h3>🏪 ${mitra.nama_mitra}</h3>
                <p><strong>📍 ${mitra.alamat}</strong></p>
                <p>👤 Pemilik: ${mitra.owner_name}</p>
                <p>📧 ${mitra.email}</p>
                <p>🏫 ${mitra.sekolah}</p>
                <p><strong>📦 ${produkCount} Produk Tersedia</strong></p>
                <button class="btn btn-secondary" onclick="showSection('produk')">🔍 Lihat Semua Produk</button>
            </div>
        `;
    }).join('');
    mitraList.innerHTML = mitraHtml;
}

function displayWishlist() {
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistedProducts = produkData.filter(produk => wishlist.includes(produk.product_id));

    const html = wishlistedProducts.map(produk => {
        const emoji = getCategoryEmoji(produk.kategori);
        const categoryClass = getCategoryClass(produk.kategori);
        const imageUrl = convertGoogleDriveUrl(produk.foto_url);
        const rating = produk.rating || 4.5;
        return `
            <div class="card">
                <img src="${imageUrl}" alt="${produk.nama_produk}" onerror="this.src='${getPlaceholderImage(produk)}'">
                <button class="wishlist-btn active" onclick="toggleWishlist('${produk.product_id}')">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="category-badge ${categoryClass}">${emoji} ${produk.kategori}</div>
                <h3>${produk.nama_produk}</h3>
                <div class="product-rating">
                    <div class="stars">${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}</div>
                    <span class="rating-text">${rating} (${Math.floor(Math.random() * 100) + 10})</span>
                </div>
                <p><strong>💰 Rp ${formatRupiah(produk.harga)}</strong></p>
                <button class="add-to-cart-btn" onclick="addToCart('${produk.product_id}')">🛒 Tambah ke Keranjang</button>
            </div>
        `;
    }).join('');
    wishlistItems.innerHTML = html || '<p>Belum ada item di wishlist.</p>';
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    saveState();
    displayProduk(); // Re-render to update wishlist buttons
    displayWishlist();
}

function addToCart(productId) {
    if (!currentUser) {
        pendingProductId = productId;
        openLoginModal();
        return;
    }

    const product = produkData.find(p => p.product_id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        const maxQty = Number(product.stok) || 1;
        if (cartItem.qty < maxQty) {
            cartItem.qty += 1;
        } else {
            alert('Stok tidak cukup untuk menambahkan lagi.');
            return;
        }
    } else {
        cart.push({ id: productId, qty: 1 });
    }

    saveState();
    updateCartCount();
    renderCart();
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('login-name').value.trim();
    const email = document.getElementById('login-email').value.trim();

    if (!name || !email) {
        alert('Mohon isi nama dan email.');
        return;
    }

    currentUser = { name, email };
    saveState();
    updateAccountUI();
    closeLoginModal();

    if (pendingProductId) {
        const productToAdd = pendingProductId;
        pendingProductId = null;
        addToCart(productToAdd);
    }
});

function logout() {
    currentUser = null;
    cart = [];
    wishlist = [];
    saveState();
    updateAccountUI();
    updateCartCount();
    showSection('home');
}

function initApp() {
    if (currentUser) {
        updateAccountUI();
        document.getElementById('user-name').textContent = currentUser.name;
    }
    updateCartCount();
    loadProdukData().then(() => {
        displayHighlights();
        displayProduk();
        displayMitra();
        displayWishlist();
        renderCart();
    }).catch((error) => {
        console.error('Failed to load app data:', error);
        displayHighlights();
        displayProduk();
        displayMitra();
        displayWishlist();
        renderCart();
    });
}

async function loadProdukData() {
    try {
        const [produkResponse, mitraResponse] = await Promise.all([
            fetch('data/tabel_produk_rows.json'),
            fetch('data/tabel_mitra_rows.json')
        ]);

        const produkDataRaw = await produkResponse.json();
        const mitraDataRaw = await mitraResponse.json();

        // Convert Google Drive URLs to direct image URLs for produk
        produkData = produkDataRaw.map(produk => ({
            ...produk,
            foto_url: convertGoogleDriveUrl(produk.foto_url)
        }));

        mitraData = mitraDataRaw;
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data if JSON fails to load
        produkData = [
            {
                product_id: '11b95748-50ef-4703-ac8a-3ccdcd7f7f11',
                mitra_id: '5e281a24-3894-4700-b327-780d9559c834',
                nama_produk: 'risol coklat',
                harga: '4.000',
                stok: '15',
                kategori: 'makanan',
                foto_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
            },
            {
                product_id: '15565530-c4b9-4751-9702-0190a79212af',
                mitra_id: '5e281a24-3894-4700-b327-780d9559c834',
                nama_produk: 'risol matcha',
                harga: '4.000',
                stok: '15',
                kategori: 'makanan',
                foto_url: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80'
            },
            {
                product_id: '294cca15-5eca-4660-b845-fb432c7ef556',
                mitra_id: '5e281a24-3894-4700-b327-780d9559c834',
                nama_produk: 'chocolatos matcha',
                harga: '5.000',
                stok: '12',
                kategori: 'minuman',
                foto_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'
            },
            {
                product_id: '55c9e83a-675b-4764-b5be-6b019f3e2018',
                mitra_id: '5e281a24-3894-4700-b327-780d9559c834',
                nama_produk: 'pop ice strawberry',
                harga: '4.000',
                stok: '16',
                kategori: 'minuman',
                foto_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80'
            },
            {
                product_id: '5fda82ef-5c6a-4da9-9364-2334ddb5d4b4',
                mitra_id: '5e281a24-3894-4700-b327-780d9559c834',
                nama_produk: 'nasi ayam',
                harga: '10.000',
                stok: '14',
                kategori: 'makanan',
                foto_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
            },
            {
                product_id: '6da522ec-4374-4ad1-a731-9fda765c5cde',
                mitra_id: '5e281a24-3894-4700-b327-780d9559c834',
                nama_produk: 'good day freeze',
                harga: '6.000',
                stok: '19',
                kategori: 'minuman',
                foto_url: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=800&q=80'
            }
        ];

        mitraData = [{
            mitra_id: '5e281a24-3894-4700-b327-780d9559c834',
            nama_mitra: 'kantin_bu_soeryati',
            owner_name: 'bu_soeryati',
            email: 'novanirmalays@gmail.com',
            alamat: 'Griyo pabean 2 blok f 32',
            kategori: 'food & beverage',
            sekolah: 'SMA HANG TUAH 2 SIDOARJO'
        }];
    }
}

window.onload = initApp;
