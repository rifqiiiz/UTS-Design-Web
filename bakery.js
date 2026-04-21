document.addEventListener("DOMContentLoaded", () => {
    /* ================= NAVIGASI AKTIF ================= */
    const navLinks = document.querySelectorAll('.sub-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    /* ================= CAROUSEL / SLIDER HOME ================= */
    const heroSection = document.querySelector('.hero');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    const bgImages = [
        'image/homebgone.jpg',
        'image/homebgtwo.jpg',
        'image/homebgthree.jpg',
        'image/homebgfour.jpg'
    ];

    let currentIndex = 0;
    let slideInterval;

    function updateCarousel(index) {
        heroSection.style.backgroundImage = `url('${bgImages[index]}')`;
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[index]) {
            dots[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % bgImages.length;
        updateCarousel(currentIndex);
        resetAutoSlide();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + bgImages.length) % bgImages.length;
        updateCarousel(currentIndex);
        resetAutoSlide();
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 8000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
            resetAutoSlide();
        });
    });

    startAutoSlide();

    /* ================= SLIDER TESTIMONI ================= */
    const testiCards = document.querySelectorAll('.testimonial-card');
    const testiNext = document.querySelector('.testi-next');
    const testiPrev = document.querySelector('.testi-prev');
    let testiIndex = 0;

    function showTesti(index) {
        testiCards.forEach(card => card.classList.remove('active'));
        testiCards[index].classList.add('active');
    }

    if(testiNext && testiPrev) {
        testiNext.addEventListener('click', () => {
            testiIndex = (testiIndex + 1) % testiCards.length;
            showTesti(testiIndex);
        });

        testiPrev.addEventListener('click', () => {
            testiIndex = (testiIndex - 1 + testiCards.length) % testiCards.length;
            showTesti(testiIndex);
        });
    }
    
    setInterval(() => {
        testiIndex = (testiIndex + 1) % testiCards.length;
        showTesti(testiIndex);
    }, 10000);

    /* ================= MENU FILTER CATEGORY ================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');

    if(filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                filterItems.forEach(item => {
                    if (filterValue === 'semua' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ================= FITUR LOGIN & REGISTER ================= */
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const userIcon = document.getElementById('user-icon');
    
    function updateUserUI() {
        if (currentUser && userIcon) {
            userIcon.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
                    <span class="user-name">${currentUser.name.split(' ')[0]}</span>
                </div>
            `;
        } else if (userIcon) {
            userIcon.innerHTML = '👤';
        }
    }
    
    function openLoginModal() {
        if (loginModal) loginModal.style.display = 'block';
    }
    
    function closeModals() {
        if (loginModal) loginModal.style.display = 'none';
        if (registerModal) registerModal.style.display = 'none';
    }
    
    if (userIcon) {
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) {
                openLoginModal();
            } else {
                if (confirm(`Halo ${currentUser.name}! Apakah Anda ingin logout?`)) {
                    localStorage.removeItem('currentUser');
                    currentUser = null;
                    updateUserUI();
                    alert('Anda telah logout');
                    location.reload();
                }
            }
        });
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateUserUI();
                closeModals();
                alert(`Selamat datang kembali, ${user.name}!`);
                document.getElementById('login-email').value = '';
                document.getElementById('login-password').value = '';
            } else {
                alert('Email atau password salah!');
            }
        });
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Password dan konfirmasi password tidak sama!');
                return;
            }
            if (password.length < 6) {
                alert('Password minimal 6 karakter!');
                return;
            }
            if (users.find(u => u.email === email)) {
                alert('Email sudah terdaftar! Silakan login.');
                return;
            }
            
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                joinDate: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            updateUserUI();
            closeModals();
            alert(`Pendaftaran berhasil! Selamat datang, ${name}!`);
            
            document.getElementById('reg-name').value = '';
            document.getElementById('reg-email').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-confirm-password').value = '';
        });
    }
    
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'block';
        });
    }
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerModal) registerModal.style.display = 'none';
            if (loginModal) loginModal.style.display = 'block';
        });
    }
    
/* ================= FITUR SEARCH BAR (UPDATED) ================= */
const searchInput = document.querySelector('#search-input');
const searchIcon = document.querySelector('.search-icon');

function performSearch() {
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Simpan search term ke localStorage untuk halaman produk
    localStorage.setItem('searchTerm', searchTerm);
    
    // Jika di halaman produk, langsung filter
    if (window.location.pathname.includes('produk.html')) {
        filterProductsOnPage(searchTerm);
    } else {
        // Jika di halaman lain, redirect ke halaman produk
        if (searchTerm !== '') {
            window.location.href = `produk.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
}

function filterProductsOnPage(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    const productsSection = document.getElementById('products-grid') || document.querySelector('.products-grid');
    
    let noResultMsg = document.querySelector('.no-result-message');
    if (noResultMsg) noResultMsg.remove();
    
    if (searchTerm === '') {
        productCards.forEach(card => card.style.display = 'block');
        return;
    }
    
    let matchCount = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3')?.innerText.toLowerCase() || '';
        const isMatch = productName.includes(searchTerm);
        
        if (isMatch) {
            card.style.display = 'block';
            card.style.animation = 'highlight 0.5s ease';
            setTimeout(() => card.style.animation = '', 500);
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (matchCount === 0 && productsSection) {
        noResultMsg = document.createElement('div');
        noResultMsg.className = 'no-result-message';
        noResultMsg.style.cssText = 'text-align: center; padding: 50px; grid-column: 1/-1;';
        noResultMsg.innerHTML = `<p>😢 Tidak ada produk untuk "<strong>${searchTerm}</strong>"</p><p>Coba: roti, donat, kue, croissant</p>`;
        productsSection.appendChild(noResultMsg);
    }
}

// Cek parameter search di URL
const urlParams = new URLSearchParams(window.location.search);
const searchParam = urlParams.get('search');
if (searchParam && window.location.pathname.includes('produk.html')) {
    if (searchInput) searchInput.value = searchParam;
    setTimeout(() => filterProductsOnPage(searchParam), 100);
}

// Cek search term dari localStorage
const savedSearchTerm = localStorage.getItem('searchTerm');
if (savedSearchTerm && window.location.pathname.includes('produk.html')) {
    if (searchInput) searchInput.value = savedSearchTerm;
    setTimeout(() => filterProductsOnPage(savedSearchTerm), 100);
    localStorage.removeItem('searchTerm');
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => { 
        if (e.key === 'Enter') { 
            e.preventDefault(); 
            performSearch(); 
        } 
    });
}
if (searchIcon) {
    searchIcon.addEventListener('click', (e) => { 
        e.preventDefault(); 
        performSearch(); 
    });
}
    
    /* ================= FITUR KERANJANG ================= */
    let cart = JSON.parse(localStorage.getItem('blessCart')) || [];
    const modal = document.getElementById('product-modal');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.querySelector('.close-cart');
    
    function updateCartUI() {
        const cartContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartContainer) return;
        cartContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            totalItems += item.qty;
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString()}</p>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                            <button class="qty-btn" onclick="removeItem(${index})" style="margin-left:10px; color:red;">🗑</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        if (cartCount) cartCount.innerText = totalItems;
        if (cartTotal) cartTotal.innerText = `Rp ${total.toLocaleString()}`;
        localStorage.setItem('blessCart', JSON.stringify(cart));
    }
    
    window.addToCart = function(name, price, image, event) {
        if (!currentUser) {
            if (confirm('Silakan login terlebih dahulu!')) openLoginModal();
            return;
        }
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name, price, image, qty: 1 });
        }
        updateCartUI();
        if (event && event.target) {
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = "✅ Masuk";
            setTimeout(() => btn.innerHTML = originalText, 1000);
        }
        if (cartSidebar) cartSidebar.classList.add('active');
    };
    
    window.changeQty = function(index, delta) {
        if (cart[index]) {
            cart[index].qty += delta;
            if (cart[index].qty < 1) cart[index].qty = 1;
            updateCartUI();
        }
    };
    
    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };
    
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            if (!currentUser) {
                if (confirm('Silakan login terlebih dahulu!')) openLoginModal();
                return;
            }
            if (cartSidebar) cartSidebar.classList.add('active');
        });
    }
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.classList.remove('active');
        });
    }
    
    /* ================= MODAL DETAIL PRODUK ================= */
    const productNameLinks = document.querySelectorAll('.product-name-link');
    
    productNameLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            if (!card) return;
            const name = card.querySelector('h3')?.innerText || '';
            const priceText = card.querySelector('.price-tag')?.innerText || 'Rp 0';
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const img = card.querySelector('.product-image')?.src || '';
            
            const modalTitle = document.getElementById('modal-title');
            const modalPrice = document.getElementById('modal-price');
            const modalImg = document.getElementById('modal-img-src');
            const modalAddBtn = document.getElementById('modal-add-btn');
            
            if (modalTitle) modalTitle.innerText = name;
            if (modalPrice) modalPrice.innerText = priceText;
            if (modalImg) modalImg.src = img;
            if (modalAddBtn) modalAddBtn.onclick = (event) => addToCart(name, price, img, event);
            if (modal) modal.style.display = 'block';
        });
    });
    
    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.product-card');
            if (card) {
                const name = card.querySelector('h3')?.innerText || '';
                const priceText = card.querySelector('.price-tag')?.innerText || 'Rp 0';
                const price = parseInt(priceText.replace(/[^0-9]/g, ''));
                const img = card.querySelector('.product-image')?.src || '';
                addToCart(name, price, img, e);
            }
        });
    });
    
    /* ================= FITUR WISHLIST ================= */
    let wishlist = JSON.parse(localStorage.getItem('blessWishlist')) || [];
    const wishlistIconNav = document.getElementById('wishlist-icon');
    const wishlistSidebar = document.getElementById('wishlist-sidebar');
    const wishlistCountSpan = document.getElementById('wishlist-count');
    const wishlistContainer = document.getElementById('wishlist-items');
    const closeWishlist = document.querySelector('.close-wishlist');
    
    function showToast(message, type) {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = message;
        toast.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: ${type === 'add' ? '#4a5d45' : '#ff4444'}; color: white;
            padding: 12px 24px; border-radius: 30px; font-size: 14px;
            z-index: 10000; animation: slideUp 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
        }, 2000);
    }
    
    function updateWishlistUI() {
        if (!wishlistContainer) return;
        wishlistContainer.innerHTML = '';
        
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = `<div style="text-align: center; padding: 50px; color: #999;"><p>💔 Wishlist masih kosong</p><p style="font-size: 12px;">Klik icon ♡ pada produk untuk menambah ke wishlist</p></div>`;
        } else {
            wishlist.forEach((item, index) => {
                wishlistContainer.innerHTML += `
                    <div class="wishlist-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="wishlist-item-info">
                            <h4>${item.name}</h4>
                            <p class="price">Rp ${item.price.toLocaleString()}</p>
                            <div class="wishlist-item-actions">
                                <button onclick="addToCartFromWishlist(${index})">🛒 Tambah ke Keranjang</button>
                            </div>
                        </div>
                        <button class="remove-wishlist" onclick="removeFromWishlist(${index})">✕</button>
                    </div>
                `;
            });
        }
        
        if (wishlistCountSpan) wishlistCountSpan.innerText = wishlist.length;
        localStorage.setItem('blessWishlist', JSON.stringify(wishlist));
        updateWishlistButtons();
    }
    
    function updateWishlistButtons() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const card = btn.closest('.product-card');
            if (card) {
                const productName = card.querySelector('h3')?.innerText || '';
                const isInWishlist = wishlist.some(item => item.name === productName);
                if (isInWishlist) {
                    btn.classList.add('active');
                    btn.innerHTML = '❤️';
                } else {
                    btn.classList.remove('active');
                    btn.innerHTML = '♡';
                }
            }
        });
    }
    
    window.addToWishlist = function(name, price, image, event) {
        if (event) event.stopPropagation();
        const existingItem = wishlist.find(item => item.name === name);
        if (existingItem) {
            wishlist = wishlist.filter(item => item.name !== name);
            showToast('💔 Dihapus dari Wishlist', 'remove');
        } else {
            wishlist.push({ name, price, image });
            showToast('❤️ Ditambahkan ke Wishlist', 'add');
        }
        updateWishlistUI();
    };
    
    window.removeFromWishlist = function(index) {
        wishlist.splice(index, 1);
        updateWishlistUI();
        showToast('🗑️ Dihapus dari Wishlist', 'remove');
    };
    
    window.addToCartFromWishlist = function(index) {
        const item = wishlist[index];
        if (item) {
            addToCart(item.name, item.price, item.image, null);
            showToast(`✅ ${item.name} ditambahkan ke keranjang`, 'add');
        }
    };
    
    const addAllToCartBtn = document.getElementById('add-all-to-cart');
    if (addAllToCartBtn) {
        addAllToCartBtn.addEventListener('click', () => {
            if (wishlist.length === 0) {
                showToast('Wishlist kosong!', 'remove');
                return;
            }
            wishlist.forEach(item => addToCart(item.name, item.price, item.image, null));
            showToast(`✅ ${wishlist.length} produk ditambahkan ke keranjang`, 'add');
        });
    }
    
    if (wishlistIconNav) {
        wishlistIconNav.addEventListener('click', () => {
            if (wishlistSidebar) wishlistSidebar.classList.add('active');
        });
    }
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            if (wishlistSidebar) wishlistSidebar.classList.remove('active');
        });
    }
    
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            if (card) {
                const name = card.querySelector('h3')?.innerText || '';
                const priceText = card.querySelector('.price-tag')?.innerText || 'Rp 0';
                const price = parseInt(priceText.replace(/[^0-9]/g, ''));
                const img = card.querySelector('.product-image')?.src || '';
                addToWishlist(name, price, img, e);
            }
        });
    });
    
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes slideDown { from { opacity: 1; transform: translateX(-50%) translateY(0); } to { opacity: 0; transform: translateX(-50%) translateY(20px); } }
    `;
    document.head.appendChild(toastStyle);
    
    /* ================= TOMBOL CHECKOUT ================= */
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!currentUser) {
                if (confirm('Silakan login terlebih dahulu untuk checkout!')) openLoginModal();
                return;
            }
            if (cart.length === 0) {
                alert('Keranjang belanja Anda kosong!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
    
    /* ================= TUTUP MODAL & SIDEBAR ================= */
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-cart');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
            if (cartSidebar) cartSidebar.classList.remove('active');
            if (wishlistSidebar) wishlistSidebar.classList.remove('active');
        });
    });
    
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none';
        if (e.target == loginModal) loginModal.style.display = 'none';
        if (e.target == registerModal) registerModal.style.display = 'none';
        if (e.target == wishlistSidebar) wishlistSidebar.classList.remove('active');
        if (e.target == cartSidebar) cartSidebar.classList.remove('active');
    };
    
    /* ================= TOMBOL PROMO ================= */
    const promoButtons = document.querySelectorAll('.btn-promo');
    promoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) {
                if (confirm('Login dulu yuk untuk dapatkan promo spesial!')) openLoginModal();
            } else {
                alert("Promo ini otomatis diterapkan di keranjang belanja Anda!");
            }
        });
    });
    
    /* ================= INIT ================= */
    updateUserUI();
    updateCartUI();
    updateWishlistUI();
    
    console.log('Bless Bakery - All features loaded!');
});

// ================= SECURE COOKIE HANDLING =================
function setSecureCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict; HttpOnly`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Hapus penggunaan localStorage untuk session, gunakan sessionStorage yang lebih aman
// Ganti localStorage dengan sessionStorage untuk data sementara
if (typeof(Storage) !== "undefined") {
    // Migrasi data dari localStorage ke sessionStorage jika perlu
    if (!sessionStorage.getItem('migrated')) {
        const cart = localStorage.getItem('blessCart');
        const wishlist = localStorage.getItem('blessWishlist');
        if (cart) sessionStorage.setItem('blessCart', cart);
        if (wishlist) sessionStorage.setItem('blessWishlist', wishlist);
        sessionStorage.setItem('migrated', 'true');
    }
}