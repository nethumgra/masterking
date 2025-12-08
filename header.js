// ==========================================
// 🛒 Mudalali Mama - Header & Drawers Component
// ==========================================

import { auth, db, usersPath, onAuthStateChanged, signOut, doc, getDoc, collection, onSnapshot } from '../config/firebase.js';

export async function loadHeader(containerId = 'main-header') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. HTML Structure (Header + Mobile Nav + Drawers)
    container.innerHTML = `
        <!-- Top Header (Desktop) -->
        <header class="bg-white shadow-md sticky top-0 z-40 hidden md:block">
            <div class="container mx-auto px-4 py-3 flex justify-between items-center">
                <a href="index.html" class="flex items-center gap-2">
                    <img id="header-logo-img" src="https://i.ibb.co/1tCywvyP/logo.png" class="h-10" alt="Mudalali Mama">
                </a>

                <div class="flex-grow max-w-xl mx-4">
                    <form action="shop.html" class="flex">
                        <input type="text" name="search" placeholder="Search for products..." class="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-mudalali-green">
                        <button type="submit" class="bg-mudalali-green text-white px-4 py-2 rounded-r-md hover:bg-mudalali-green-dark">
                            <i class="fa fa-search"></i>
                        </button>
                    </form>
                </div>

                <div class="flex items-center space-x-6">
                    <div class="text-right hidden lg:block">
                        <div class="text-xs text-gray-500">Hotline</div>
                        <div id="header-hotline-display" class="text-sm font-bold text-mudalali-green-dark">...</div>
                    </div>
                    
                    <!-- Currency Switcher (New Feature) -->
                    <select id="currency-switcher" class="text-sm border-none focus:ring-0 cursor-pointer bg-transparent font-semibold text-gray-700">
                        <option value="LKR">LKR</option>
                        <option value="USD">USD</option>
                    </select>

                    <a href="account.html" id="header-account-btn" class="flex flex-col items-center text-gray-600 hover:text-mudalali-green">
                        <i class="fa fa-user text-xl"></i>
                        <span class="text-xs">Account</span>
                    </a>
                    <a href="wishlist.html" class="relative flex flex-col items-center text-gray-600 hover:text-mudalali-green">
                        <i class="fa fa-heart text-xl"></i>
                        <span id="header-wishlist-count" class="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 hidden">0</span>
                        <span class="text-xs">Wishlist</span>
                    </a>
                    <button id="header-cart-btn" class="flex flex-col items-center text-gray-600 hover:text-mudalali-green relative">
                        <i class="fa fa-shopping-cart text-xl"></i>
                        <span id="header-cart-count" class="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 hidden">0</span>
                        <span class="text-xs">Cart</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Mobile Header -->
        <header class="bg-white shadow-md sticky top-0 z-40 flex md:hidden items-center justify-between p-4">
            <button id="mobile-menu-toggle" class="text-2xl text-gray-700">
                <i class="fa fa-bars"></i>
            </button>
            <a href="index.html">
                <img src="https://i.ibb.co/1tCywvyP/logo.png" class="h-8" alt="Logo">
            </a>
            <div class="w-8"></div> <!-- Spacer -->
        </header>

        <!-- Desktop Navbar -->
        <nav class="bg-gray-100 shadow-sm hidden md:block border-b">
            <div class="container mx-auto px-4 flex items-center space-x-6">
                <div class="relative group">
                    <button class="flex items-center bg-mudalali-green text-white px-4 py-2.5 font-bold hover:bg-mudalali-green-dark transition">
                        <i class="fa fa-bars mr-2"></i> Categories
                    </button>
                    <!-- Dropdown (Dynamic) -->
                    <div id="desktop-category-dropdown" class="absolute left-0 top-full w-56 bg-white shadow-lg z-50 hidden group-hover:block">
                        <p class="p-2 text-gray-400 text-sm">Loading...</p>
                    </div>
                </div>
                <a href="index.html" class="font-medium hover:text-mudalali-green">Home</a>
                <a href="shop.html" class="font-medium hover:text-mudalali-green">Shop</a>
                <a href="stories.html" class="font-medium hover:text-mudalali-green">Stories</a>
                <a href="offers.html" class="font-medium hover:text-mudalali-green text-red-600">Offers</a>
            </div>
        </nav>

        <!-- Mobile Bottom Nav -->
        <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center z-50 md:hidden">
            <a href="index.html" class="flex flex-col items-center text-gray-600 hover:text-mudalali-green text-xs">
                <i class="fa fa-home text-xl mb-1"></i> Home
            </a>
            <a href="shop.html" class="flex flex-col items-center text-gray-600 hover:text-mudalali-green text-xs">
                <i class="fa fa-search text-xl mb-1"></i> Shop
            </a>
            <button id="mobile-cart-btn" class="flex flex-col items-center text-gray-600 hover:text-mudalali-green text-xs relative">
                <div class="relative">
                    <i class="fa fa-shopping-bag text-xl mb-1"></i>
                    <span id="mobile-cart-badge" class="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full px-1.5 hidden">0</span>
                </div>
                Cart
            </button>
            <a href="account.html" class="flex flex-col items-center text-gray-600 hover:text-mudalali-green text-xs">
                <i class="fa fa-user text-xl mb-1"></i> Account
            </a>
        </nav>

        <!-- Drawers (Cart & Mobile Menu) -->
        <div id="global-cart-drawer" class="fixed inset-0 z-[60] hidden">
            <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" id="cart-overlay"></div>
            <div class="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform translate-x-full flex flex-col" id="cart-panel">
                <div class="p-4 border-b flex justify-between items-center">
                    <h2 class="font-bold text-lg">Shopping Cart</h2>
                    <button id="close-cart-btn" class="text-gray-500 hover:text-red-500"><i class="fa fa-times text-xl"></i></button>
                </div>
                <div id="cart-items-container" class="flex-grow overflow-y-auto p-4">
                    <p class="text-center text-gray-500 mt-10">Your cart is empty.</p>
                </div>
                <div class="p-4 border-t bg-gray-50">
                    <div class="flex justify-between mb-4 font-bold text-lg">
                        <span>Total:</span>
                        <span id="cart-total-price">Rs. 0.00</span>
                    </div>
                    <a href="checkout.html" class="block w-full bg-mudalali-green text-white text-center py-3 rounded-lg font-bold hover:bg-mudalali-green-dark">Checkout</a>
                </div>
            </div>
        </div>
        
        <!-- Mobile Menu Drawer -->
        <div id="mobile-menu-drawer" class="fixed inset-0 z-[60] hidden">
             <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" id="mobile-menu-overlay"></div>
             <div class="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl transform -translate-x-full transition-transform flex flex-col" id="mobile-menu-panel">
                <div class="p-4 border-b flex justify-between items-center bg-mudalali-green text-white">
                    <span class="font-bold text-lg">Menu</span>
                    <button id="close-mobile-menu" class="text-white"><i class="fa fa-times text-xl"></i></button>
                </div>
                <div class="flex-grow overflow-y-auto p-4 space-y-4">
                    <a href="index.html" class="block text-gray-700 font-medium py-2 border-b">Home</a>
                    <a href="shop.html" class="block text-gray-700 font-medium py-2 border-b">Shop</a>
                    <a href="stories.html" class="block text-gray-700 font-medium py-2 border-b">Seller Stories</a>
                    <a href="offers.html" class="block text-red-600 font-medium py-2 border-b">Special Offers</a>
                    <a href="account.html" class="block text-gray-700 font-medium py-2 border-b">My Account</a>
                    <button id="mobile-logout-btn" class="block w-full text-left text-gray-500 py-2 hidden">Logout</button>
                </div>
             </div>
        </div>
    `;

    // 2. Logic Initialization
    initializeInteractions();
    initializeAuthListener();
}

function initializeInteractions() {
    // Drawers Logic
    const cartDrawer = document.getElementById('global-cart-drawer');
    const cartPanel = document.getElementById('cart-panel');
    const mobileMenu = document.getElementById('mobile-menu-drawer');
    const mobilePanel = document.getElementById('mobile-menu-panel');

    function openDrawer(drawer, panel, direction = 'right') {
        drawer.classList.remove('hidden');
        // Small timeout to allow CSS transition
        setTimeout(() => {
            panel.classList.remove(direction === 'left' ? '-translate-x-full' : 'translate-x-full');
        }, 10);
    }

    function closeDrawer(drawer, panel, direction = 'right') {
        panel.classList.add(direction === 'left' ? '-translate-x-full' : 'translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');
        }, 300);
    }

    // Cart Listeners
    document.getElementById('header-cart-btn')?.addEventListener('click', () => openDrawer(cartDrawer, cartPanel));
    document.getElementById('mobile-cart-btn')?.addEventListener('click', () => openDrawer(cartDrawer, cartPanel));
    document.getElementById('close-cart-btn')?.addEventListener('click', () => closeDrawer(cartDrawer, cartPanel));
    document.getElementById('cart-overlay')?.addEventListener('click', () => closeDrawer(cartDrawer, cartPanel));

    // Mobile Menu Listeners
    document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => openDrawer(mobileMenu, mobilePanel, 'left'));
    document.getElementById('close-mobile-menu')?.addEventListener('click', () => closeDrawer(mobileMenu, mobilePanel, 'left'));
    document.getElementById('mobile-menu-overlay')?.addEventListener('click', () => closeDrawer(mobileMenu, mobilePanel, 'left'));

    // Currency Switcher
    const currencySelect = document.getElementById('currency-switcher');
    if(currencySelect) {
        const savedCurrency = localStorage.getItem('selectedCurrency') || 'LKR';
        currencySelect.value = savedCurrency;
        currencySelect.addEventListener('change', (e) => {
            localStorage.setItem('selectedCurrency', e.target.value);
            window.location.reload(); // Reload to apply currency change
        });
    }
}

function initializeAuthListener() {
    onAuthStateChanged(auth, (user) => {
        const cartCount = document.getElementById('header-cart-count');
        const mobileCartBadge = document.getElementById('mobile-cart-badge');
        const accountBtn = document.getElementById('header-account-btn');
        const mobileLogout = document.getElementById('mobile-logout-btn');

        if (user) {
            // Update Account Link logic could go here (e.g., change icon)
            if(mobileLogout) {
                mobileLogout.classList.remove('hidden');
                mobileLogout.addEventListener('click', () => {
                    signOut(auth).then(() => window.location.href = 'index.html');
                });
            }

            // Listen to Cart
            const cartRef = collection(db, usersPath, user.uid, 'cart');
            onSnapshot(cartRef, (snapshot) => {
                const count = snapshot.size;
                if (cartCount) {
                    cartCount.textContent = count;
                    cartCount.classList.remove('hidden');
                }
                if (mobileCartBadge) {
                    mobileCartBadge.textContent = count;
                    mobileCartBadge.classList.remove('hidden');
                }
                renderCartItems(snapshot);
            });

            // Listen to Wishlist
            const wishlistRef = collection(db, usersPath, user.uid, 'wishlist');
            onSnapshot(wishlistRef, (snap) => {
                const count = snap.size;
                const badge = document.getElementById('header-wishlist-count');
                if(badge) {
                    badge.textContent = count;
                    badge.classList.remove('hidden');
                }
            });

        } else {
            if (cartCount) cartCount.classList.add('hidden');
            if (mobileCartBadge) mobileCartBadge.classList.add('hidden');
            if (mobileLogout) mobileLogout.classList.add('hidden');
            
            // Clear Cart UI
            const container = document.getElementById('cart-items-container');
            if(container) container.innerHTML = '<div class="text-center py-10"><p class="text-gray-500 mb-4">Please login to view cart</p><a href="account.html" class="bg-mudalali-green text-white px-4 py-2 rounded">Login</a></div>';
        }
    });
}

function renderCartItems(snapshot) {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    if (!container) return;

    if (snapshot.empty) {
        container.innerHTML = '<p class="text-center text-gray-500 mt-10">Your cart is empty.</p>';
        if(totalEl) totalEl.textContent = 'Rs. 0.00';
        return;
    }

    let total = 0;
    let html = '';

    snapshot.forEach(doc => {
        const item = doc.data();
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        total += itemTotal;

        html += `
            <div class="flex items-center gap-3 mb-4 border-b pb-2">
                <img src="${item.imageUrl || 'https://placehold.co/50'}" class="w-16 h-16 object-cover rounded-md border">
                <div class="flex-grow">
                    <h4 class="text-sm font-semibold line-clamp-1">${item.name}</h4>
                    <p class="text-xs text-gray-500">Qty: ${item.quantity}</p>
                    <p class="text-sm font-bold text-mudalali-green">Rs. ${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if(totalEl) totalEl.textContent = `Rs. ${total.toFixed(2)}`;
}