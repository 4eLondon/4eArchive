<?php 
session_start();
?>
<!DOCTYPE html>
<html data-plan="<?= htmlspecialchars($_SESSION['plan'] ?? 'free') ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yomite: Wishlist</title>
    <link rel="icon" type="image/x-icon" href="/WD3_Project_Sem2_MangaWebsite/Project/images/website-icon.png">
    <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/index.css">
    <script>
        (function() {
            const t = localStorage.getItem('yomite-theme') || 'light';
            document.documentElement.setAttribute('data-theme', t);
        })();
    </script>
</head>
<body>

<!-- ========== NAVIGATION ========== -->
<nav class="nav" id="nav">
    <div class="nav-inner">
        <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="nav-logo">Yomite<span>.</span></a>
        <div class="nav-actions">
            <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/wishlist.php" class="nav-pill-btn" id="wishlist-btn" title="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Wishlist
                <span class="wishlist-badge" id="wishlist-badge" style="display:none;">0</span>
            </a>
            <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php" class="nav-pill-btn nav-pill-btn--accent" id="cart-btn" title="My Cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Cart
                <span class="library-badge" id="cart-badge" style="display:none;">0</span>
            </a>
            <a href="#" class="nav-pill-btn" id="library-btn" title="My Library">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                Library
            </a>
            <span class="nav-divider"></span>
            <div class="nav-icon-group">
                <a href="#" class="nav-icon-btn" id="settings-drawer-trigger" title="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                </a>
                <a href="#" class="nav-icon-btn" title="Help">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </a>
            </div>
            <span class="nav-divider"></span>
            <a href="/WD3_Project_Sem2_MangaWebsite/Project/app/logout.php" class="nav-logout-icon" title="Log Out">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
            </a>
        </div>
    </div>
</nav>

<!-- ========== WISHLIST — library-page style ========== -->
<div class="library-page open" id="wishlist-page">
    <div class="library-page-inner">
        <div class="library-page-header">
            <div class="library-page-header-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <div>
                    <h1 class="library-page-title">My Wishlist</h1>
                    <p class="library-page-subtitle" id="wishlist-subtitle">
                        <?php if (isset($_SESSION['first_name'])): ?>
                            <?= htmlspecialchars($_SESSION['first_name']) ?>'s wishlist
                        <?php else: ?>
                            Your saved books
                        <?php endif; ?>
                    </p>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;">
                <button class="btn-dark" id="clear-wishlist-btn" style="display:none;font-size:0.8rem;padding:0.4rem 0.9rem;">Clear All</button>
                <button class="library-page-close" onclick="window.location.href='/WD3_Project_Sem2_MangaWebsite/Project/index.php'" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        </div>

        <div class="library-controls">
            <div class="library-search-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="library-search-icon">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="library-search-input" id="wishlist-search" placeholder="Search your wishlist…" oninput="renderWishlistGrid()">
            </div>
            <div class="library-sort-wrap">
                <select class="library-sort-select" id="wishlist-sort" onchange="renderWishlistGrid()">
                    <option value="recent">Recently Added</option>
                    <option value="title">Title A–Z</option>
                    <option value="author">Author A–Z</option>
                    <option value="price">Price</option>
                </select>
            </div>
        </div>

        <div class="library-grid" id="wishlist-grid">
            <div class="library-loading">
                <div class="lib-spinner"></div>
                <span>Loading your wishlist…</span>
            </div>
        </div>
    </div>
</div>

<!-- LIBRARY POPUP (nav btn) -->
<div class="library-page" id="library-popup">
    <div class="library-page-inner">
        <div class="library-page-header">
            <div class="library-page-header-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <div>
                    <h1 class="library-page-title">My Library</h1>
                    <p class="library-page-subtitle">Your owned books</p>
                </div>
            </div>
            <button class="library-page-close" onclick="closeLibrary()" aria-label="Close library">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="library-controls">
            <div class="library-search-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="library-search-icon">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="library-search-input" id="lib-search" placeholder="Search your library…" oninput="filterLibrary()">
            </div>
            <div class="library-sort-wrap">
                <select class="library-sort-select" id="lib-sort" onchange="filterLibrary()">
                    <option value="recent">Recently Acquired</option>
                    <option value="title">Title A–Z</option>
                    <option value="author">Author A–Z</option>
                </select>
            </div>
        </div>
        <div class="library-grid" id="library-body">
            <div class="library-loading">
                <div class="lib-spinner"></div>
                <span>Loading your books…</span>
            </div>
        </div>
    </div>
</div>
<div class="library-overlay" id="library-overlay"></div>

<!-- SETTINGS PANEL -->
<div class="settings-overlay" id="settings-overlay"></div>
<div class="settings-panel" id="settings-drawer">
    <div class="sp-header">
        <span class="sp-heading">Settings</span>
        <button class="sp-close" id="drawer-close" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    </div>
    <div class="sp-body">
        <div class="sp-section">
                <div class="sp-plan-row" id="sp-plan-row">
            <div class="sp-plan-info">
                <span class="sp-plan-label">Your plan</span>
                <span class="sp-plan-badge" id="sp-plan-badge">Loading…</span>
            </div>
        </div>
        <div class="sp-plan-switcher" id="sp-plan-switcher">
            <button class="sp-plan-opt" data-plan="free">Free</button>
            <button class="sp-plan-opt" data-plan="student">Student</button>
            <button class="sp-plan-opt" data-plan="regular">Regular</button>
        </div>
            <div class="sp-section-label">Profile</div>
            <div class="sp-two-col">
                <div class="sp-field">
                    <div class="sp-field-label">Display name</div>
                    <input class="sp-input" type="text" value="<?= htmlspecialchars(($_SESSION['first_name'] ?? '') . ' ' . ($_SESSION['last_name'] ?? '')) ?>" disabled>
                </div>
                <div class="sp-field">
                    <div class="sp-field-label">Username</div>
                    <input class="sp-input" type="text" value="@<?= htmlspecialchars($_SESSION['username'] ?? '') ?>" disabled>
                </div>
            </div>
        </div>
        <div class="sp-section">
            <div class="sp-section-label">Appearance</div>
            <div class="sp-theme-row">
                <button class="sp-theme-card" data-theme-target="dark">
                    <div class="sp-theme-preview sp-dark-p"><div class="sp-tp-bar"></div><div class="sp-tp-content"><div class="sp-tp-dot"></div><div class="sp-tp-lines"><div class="sp-tp-line"></div><div class="sp-tp-line sp-short"></div></div></div></div>
                    <div class="sp-theme-foot"><div class="sp-theme-check"></div> Dark</div>
                </button>
                <button class="sp-theme-card" data-theme-target="light">
                    <div class="sp-theme-preview sp-light-p"><div class="sp-tp-bar"></div><div class="sp-tp-content"><div class="sp-tp-dot"></div><div class="sp-tp-lines"><div class="sp-tp-line"></div><div class="sp-tp-line sp-short"></div></div></div></div>
                    <div class="sp-theme-foot sp-light-foot"><div class="sp-theme-check"></div> Light</div>
                </button>
            </div>
        </div>
        <div class="sp-section">
            <div class="sp-section-label">Currency</div>
            <div class="sp-currency-row">
                <button class="sp-currency-btn" data-currency="USD">$ USD</button>
                <button class="sp-currency-btn" data-currency="JMD">J$ JMD</button>
                <button class="sp-currency-btn" data-currency="YEN">¥ JPY</button>
            </div>
        </div>
    </div>
</div>

<div class="toast" id="toast"></div>

<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
<script>
(function() {
    const t = localStorage.getItem('yomite-theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('.sp-theme-card').forEach(c =>
        c.classList.toggle('selected', c.dataset.themeTarget === t));
})();

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yomite-theme', theme);
    document.querySelectorAll('.sp-theme-card').forEach(c =>
        c.classList.toggle('selected', c.dataset.themeTarget === theme));
}

function getSavedCurrency() { return localStorage.getItem('yomite-currency') || 'USD'; }
function saveCurrency(code) { localStorage.setItem('yomite-currency', code); }
function formatPrice(usd) {
    const cur = getSavedCurrency();
    if (cur === 'JMD') return 'J$' + (usd * 157).toFixed(2);
    if (cur === 'YEN') return '¥' + Math.round(usd * 149);
    return '$' + usd.toFixed(2);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function getWishlist() {
    try { return JSON.parse(localStorage.getItem('yomite-wishlist') || '[]'); } catch(e) { return []; }
}
function saveWishlist(wl) { localStorage.setItem('yomite-wishlist', JSON.stringify(wl)); }

function removeFromWishlist(bookId) {
    let wl = getWishlist().filter(id => id !== bookId);
    saveWishlist(wl);
    showToast('Removed from Wishlist.');
    renderWishlistGrid();
}

async function addToCart(bookId) {
    try {
        const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-add.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ book_id: bookId })
        });
        const data = await res.json();
        if (data.owned)   { showToast('Already in your library.'); return; }
        if (data.success) showToast(data.already ? 'Already in your cart.' : '✓ Added to Cart!');
        else              showToast(data.error || 'Could not add to cart.');
        updateCartBadge();
    } catch(e) { showToast('Network error.'); }
}

async function updateCartBadge() {
    try {
        const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-get.php');
        const data = await res.json();
        const badge = document.getElementById('cart-badge');
        if (!badge || !data.success) return;
        badge.textContent   = data.count;
        badge.style.display = data.count > 0 ? 'inline-flex' : 'none';
    } catch(e) {}
}

function updateWishlistBadge() {
    const wl    = getWishlist();
    const badge = document.getElementById('wishlist-badge');
    if (!badge) return;
    badge.textContent   = wl.length;
    badge.style.display = wl.length > 0 ? 'inline-flex' : 'none';
}

function renderWishlistGrid() {
    const grid     = document.getElementById('wishlist-grid');
    const clearBtn = document.getElementById('clear-wishlist-btn');
    const subtitle = document.getElementById('wishlist-subtitle');
    const wl       = getWishlist();

    updateWishlistBadge();

    if (wl.length === 0) {
        clearBtn.style.display = 'none';
        subtitle.textContent   = 'Your wishlist is empty';
        grid.innerHTML = `
            <div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:5rem 0;color:var(--ink-3);">
                <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <div style="font-weight:700;font-size:1rem;color:var(--ink);">Your wishlist is empty</div>
                <div style="font-size:0.85rem;text-align:center;max-width:280px;">Browse our collection and save titles you're interested in.</div>
                <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="btn-dark" style="margin-top:0.5rem;">Start Shopping</a>
            </div>`;
        return;
    }

    clearBtn.style.display = 'inline-flex';
    const n = wl.length;
    subtitle.textContent = n === 1 ? '1 item saved' : `${n} items saved`;

    const query = (document.getElementById('wishlist-search')?.value || '').toLowerCase();
    const sort  = document.getElementById('wishlist-sort')?.value || 'recent';

    let books = wl.map(id => (typeof getBookById === 'function' ? getBookById(id) : null)).filter(Boolean);

    if (query) {
        books = books.filter(b =>
            b.title?.toLowerCase().includes(query) ||
            b.author?.toLowerCase().includes(query) ||
            b.genre?.toLowerCase().includes(query));
    }
    if (sort === 'title')  books.sort((a,b) => (a.title||'').localeCompare(b.title||''));
    if (sort === 'author') books.sort((a,b) => (a.author||'').localeCompare(b.author||''));
    if (sort === 'price')  books.sort((a,b) => (a.price_usd||0) - (b.price_usd||0));

    if (books.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--ink-3);font-size:0.9rem;">No results match your search.</div>`;
        return;
    }

    grid.innerHTML = books.map(b => {
        const price = b.soldOut ? 'Sold Out' : formatPrice(b.price_usd || 0);
        return `
        <div style="display:flex;flex-direction:column;gap:0.6rem;">
            <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}">
                <img src="${b.cover_img || b.image || ''}" alt="${b.title}" style="width:100%;aspect-ratio:2/3;object-fit:cover;display:block;border-radius:8px;border:1px solid var(--border);">
            </a>
            <div style="flex:1;min-width:0;">
                <div style="font-size:0.75rem;color:var(--ink-3);margin-bottom:2px;">${b.genre || ''}</div>
                <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}" style="font-size:0.88rem;font-weight:700;color:var(--ink);text-decoration:none;display:block;line-height:1.3;margin-bottom:2px;">${b.title}</a>
                <div style="font-size:0.78rem;color:var(--ink-3);margin-bottom:0.4rem;">${b.author || ''}</div>
                <div style="font-size:0.85rem;font-weight:700;color:var(--ink);margin-bottom:0.5rem;">${price}</div>
                <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                    ${!b.soldOut ? `<button class="wishlist-add-btn" style="font-size:0.75rem;padding:0.3rem 0.6rem;" onclick="addToCart(${b.id})">Add to Cart</button>` : ''}
                    <button class="wishlist-remove-btn" style="font-size:0.75rem;padding:0.3rem 0.6rem;" onclick="removeFromWishlist(${b.id})">Remove</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ---- Library panel ----
let _libBooks = [];
function openLibrary() {
    document.getElementById('library-popup').classList.add('open');
    document.getElementById('library-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    fetchLibrary();
}
function closeLibrary() {
    document.getElementById('library-popup').classList.remove('open');
    document.getElementById('library-overlay').classList.remove('open');
    document.body.style.overflow = '';
}
async function fetchLibrary() {
    try {
        const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/owned-get.php');
        const data = await res.json();
        _libBooks  = data.success ? data.books : [];
        filterLibrary();
    } catch(e) {}
}
function filterLibrary() {
    const body  = document.getElementById('library-body');
    const query = (document.getElementById('lib-search')?.value || '').toLowerCase();
    const sort  = document.getElementById('lib-sort')?.value || 'recent';
    let books   = [..._libBooks];
    if (query) books = books.filter(b => b.title?.toLowerCase().includes(query) || b.author?.toLowerCase().includes(query));
    if (sort === 'title')  books.sort((a,b) => a.title.localeCompare(b.title));
    if (sort === 'author') books.sort((a,b) => a.author.localeCompare(b.author));
    body.innerHTML = books.length === 0
        ? `<div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--ink-3);">Your library is empty.</div>`
        : books.map(b => `
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
                <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}">
                    <img src="${b.cover_img}" alt="${b.title}" style="width:100%;aspect-ratio:2/3;object-fit:cover;border-radius:8px;border:1px solid var(--border);">
                </a>
                <div>
                    <div style="font-size:0.85rem;font-weight:700;color:var(--ink);line-height:1.3;">${b.title}</div>
                    <div style="font-size:0.75rem;color:var(--ink-3);">${b.author}</div>
                    <div style="font-size:0.75rem;color:var(--ink-3);margin-top:2px;">✓ Owned</div>
                </div>
            </div>`).join('');
}

// ---- Settings ----
function openSettings() {
    document.getElementById('settings-drawer').classList.add('open');
    document.getElementById('settings-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeSettings() {
    document.getElementById('settings-drawer').classList.remove('open');
    document.getElementById('settings-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

// ---- Nav scroll ----
window.addEventListener('scroll', () =>
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 10));

// ---- Wire events ----
document.getElementById('library-btn').addEventListener('click', e => { e.preventDefault(); openLibrary(); });
document.getElementById('library-overlay').addEventListener('click', closeLibrary);
document.getElementById('clear-wishlist-btn').addEventListener('click', function() {
    if (confirm('Clear entire wishlist? This cannot be undone.')) {
        saveWishlist([]);
        showToast('Wishlist cleared.');
        renderWishlistGrid();
    }
});
document.getElementById('settings-drawer-trigger').addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    document.getElementById('settings-drawer').classList.contains('open') ? closeSettings() : openSettings();
});
document.getElementById('drawer-close').addEventListener('click', closeSettings);
document.getElementById('settings-overlay').addEventListener('click', closeSettings);
document.querySelectorAll('.sp-theme-card').forEach(c =>
    c.addEventListener('click', () => applyTheme(c.dataset.themeTarget)));
document.querySelectorAll('.sp-currency-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.currency === getSavedCurrency());
    b.addEventListener('click', () => {
        saveCurrency(b.dataset.currency);
        document.querySelectorAll('.sp-currency-btn').forEach(x =>
            x.classList.toggle('selected', x.dataset.currency === b.dataset.currency));
        renderWishlistGrid();
    });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLibrary(); closeSettings(); }
});

// ---- Init ----
updateCartBadge();
renderWishlistGrid();
</script>
</body>
</html>