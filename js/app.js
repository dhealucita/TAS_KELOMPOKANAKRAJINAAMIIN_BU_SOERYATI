// app.js for Warung Bu Soeryati

let mitraData = []; // Will be loaded from JSON
let produkData = []; // Will be loaded from JSON

let currentUser = null;
let cart = [];
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
    if (!cart.length) {
        cartList.innerHTML = '<p>Keranjang kosong. Tambahkan menu untuk memesan.</p>';
        cartTotal.textContent = 'Rp 0';
        return;
    }

    let total = 0;
    cartList.innerHTML = cart.map(item => {
        const product = produkData.find(p => p.product_id === item.id);
        const subtotal = Number(product.harga.replace(/\D/g, '')) * item.qty;
        total += subtotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${product.nama_produk}</div>
                    <div>${item.qty} x Rp ${formatRupiah(product.harga)}</div>
                    <div>Subtotal: Rp ${formatRupiah(subtotal)}</div>
                </div>
                <div class="cart-item-actions">
                    <button onclick="removeCartItem('${item.id}')">Hapus</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = `Rp ${formatRupiah(total)}`;
}

function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveState();
    updateCartCount();
    renderCart();
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

    const total = cart.reduce((sum, item) => {
        const product = produkData.find(p => p.product_id === item.id);
        return sum + Number(product.harga.replace(/\D/g, '')) * item.qty;
    }, 0);

    alert(`Terima kasih ${currentUser.name}!\nPesananmu berhasil dibuat dengan total Rp ${formatRupiah(total)}.`);
    cart = [];
    saveState();
    updateCartCount();
    renderCart();
    closeCartModal();
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
    const name = encodeURIComponent(produk.nama_produk);
    let bgColor = 'FFE4B5'; // Default light orange
    let textColor = '8B4513'; // Brown text

    if (category.includes('makanan')) {
        bgColor = 'FFF8DC'; // Cream
        textColor = '8B4513'; // Brown
    } else if (category.includes('minuman')) {
        bgColor = 'E0F6FF'; // Light blue
        textColor = '1E40AF'; // Blue
    }

    return `https://via.placeholder.com/400x170/${bgColor}/${textColor}?text=${name}`;
}

function convertGoogleDriveUrl(url) {
    // Convert Google Drive share link to direct image link
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\/view/);
    if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
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

    function filterProduk() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        const filtered = produkData.filter(produk => {
            const matchesSearch = produk.nama_produk.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || produk.kategori.toLowerCase().includes(selectedCategory.toLowerCase());
            return matchesSearch && matchesCategory;
        });

        const produkHtml = filtered.map(produk => {
            const emoji = getCategoryEmoji(produk.kategori);
            const categoryClass = getCategoryClass(produk.kategori);
            const imageUrl = convertGoogleDriveUrl(produk.foto_url);
            return `
                <div class="card">
                    <img src="${imageUrl}" alt="${produk.nama_produk}" onerror="this.src='${getPlaceholderImage(produk)}'">
                    <div class="category-badge ${categoryClass}">${emoji} ${produk.kategori}</div>
                    <h3>${produk.nama_produk}</h3>
                    <p><strong>💰 Rp ${formatRupiah(produk.harga)}</strong></p>
                    <p>📦 Stok: ${produk.stok}</p>
                    <button class="btn btn-primary" onclick="addToCart('${produk.product_id}')">🛒 Masukkan Keranjang</button>
                </div>
            `;
        }).join('');
        produkList.innerHTML = produkHtml;
    }

    searchInput.addEventListener('input', filterProduk);
    filterSelect.addEventListener('change', filterProduk);
    filterProduk();
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
    // Removed alert for better UX - cart count badge will show the update
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

function initApp() {
    if (currentUser) {
        updateAccountUI();
    }
    updateCartCount();
    loadProdukData().then(() => {
        displayHighlights();
        displayProduk();
        displayMitra();
    }).catch((error) => {
        console.error('Failed to load app data:', error);
        // Still try to display with fallback data
        displayHighlights();
        displayProduk();
        displayMitra();
    });
}

async function loadProdukData() {
    try {
        const [produkResponse, mitraResponse] = await Promise.all([
            fetch('../data/tabel_produk_rows.json'),
            fetch('../data/tabel_mitra_rows.json')
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
