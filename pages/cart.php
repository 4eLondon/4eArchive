<?php session_start(); ?>
<!DOCTYPE html>
<html data-plan="<?= htmlspecialchars($_SESSION['plan'] ?? 'free') ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yomite: My Cart</title>
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

<!-- NAV -->
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

<!-- ========== CART — library-page style ========== -->
<div class="library-page open" id="cart-page">
  <div class="library-page-inner" style="max-width:none;">
    <!-- Header -->
    <div class="library-page-header">
      <div class="library-page-header-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <div>
          <h1 class="library-page-title">My Cart</h1>
          <p class="library-page-subtitle" id="cart-subtitle">Loading…</p>
        </div>
      </div>
      <button class="library-page-close" onclick="window.location.href='/WD3_Project_Sem2_MangaWebsite/Project/index.php'" aria-label="Close cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Two-column layout: items + checkout -->
    <div style="display:flex;gap:2rem;flex:1;overflow:hidden;padding-top:1.25rem;">

      <!-- Items column -->
      <div id="cart-items-col" style="flex:1;overflow-y:auto;padding-bottom:2rem;">
        <div class="library-loading">
          <div class="lib-spinner"></div>
          <span>Loading your cart…</span>
        </div>
      </div>

      <!-- Checkout sidebar -->
      <div id="cart-summary-col" style="display:none;width:340px;flex-shrink:0;overflow-y:auto;padding-bottom:2rem;">
        <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:14px;padding:2.5rem;position:sticky;top:0;">
          <div style="font-size:1.2rem;font-weight:800;color:var(--ink);margin-bottom:2rem;letter-spacing:-0.01em;">Order Summary</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;font-size:1rem;color:var(--ink-3);">
            <span>Subtotal</span><span id="s-subtotal">—</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;font-size:1rem;color:var(--ink-3);">
            <span>Taxes &amp; fees</span><span>$0.00</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:1.3rem;font-weight:800;color:var(--ink);padding-top:1.25rem;border-top:1px solid var(--border);margin-top:1.25rem;margin-bottom:2.5rem;">
            <span>Total</span><span id="s-total">—</span>
          </div>

          <div style="font-size:1rem;font-weight:800;color:var(--ink);margin-bottom:1.5rem;letter-spacing:-0.01em;">Payment Method</div>

          <!-- Payment Method Selector -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:2rem;">
            <button id="pay-method-card" class="pay-method-btn pay-method-active" onclick="switchPaymentMethod('card')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.75rem;padding:1.25rem 0.75rem;border:1.5px solid var(--accent);border-radius:10px;background:rgba(var(--accent-rgb),0.05);cursor:pointer;font-size:0.9rem;font-weight:700;color:var(--ink);transition:all 0.2s;font-family:inherit;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Card
            </button>
            <button id="pay-method-paypal" class="pay-method-btn" onclick="switchPaymentMethod('paypal')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.75rem;padding:1.25rem 0.75rem;border:1.5px solid var(--border);border-radius:10px;background:transparent;cursor:pointer;font-size:0.9rem;font-weight:700;color:var(--ink-3);transition:all 0.2s;font-family:inherit;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9.012 0c-5.066 0-9.612 3.806-9.612 8.487 0 3.425 2.547 6.375 6.117 7.656-.107.951-.607 3.806-1.625 5.688.307 0 2.668-3.563 6.825-3.563 5.066 0 9.612-3.813 9.612-8.494 0-4.688-4.546-8.774-9.612-8.774h-.705z" style="fill:currentColor"/></svg>
              PayPal
            </button>
            <button id="pay-method-bitcoin" class="pay-method-btn" onclick="switchPaymentMethod('bitcoin')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.75rem;padding:1.25rem 0.75rem;border:1.5px solid var(--border);border-radius:10px;background:transparent;cursor:pointer;font-size:0.9rem;font-weight:700;color:var(--ink-3);transition:all 0.2s;font-family:inherit;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 8.5c0-1.657 1.343-3 3-3h1c1.104 0 2 .896 2 2s-.896 2-2 2h-1"></path><path d="M8.5 12h3.5c1.104 0 2 .896 2 2s-.896 2-2 2h-1c-1.657 0-3-1.343-3-3"></path><line x1="10" y1="16" x2="10" y2="8"></line></svg>
              Bitcoin
            </button>
          </div>

          <div id="pay-error" class="pay-error" style="display:none;"></div>

          <!-- Card Payment Form -->
          <div id="card-form" style="display:block;margin-bottom:1.5rem;">
            <div class="pay-field">
              <label class="pay-label">Cardholder Name</label>
              <input class="pay-input" id="pay-name" type="text" placeholder="John Doe" autocomplete="cc-name">
            </div>
            <div class="pay-field">
              <label class="pay-label">Card Number</label>
              <input class="pay-input" id="pay-card" type="text" placeholder="4532 1488 0343 6467" maxlength="19" autocomplete="cc-number">
            </div>
            <div class="pay-row">
              <div class="pay-field">
                <label class="pay-label">Expiry</label>
                <input class="pay-input" id="pay-expiry" type="text" placeholder="12/26" maxlength="5" autocomplete="cc-exp">
              </div>
              <div class="pay-field">
                <label class="pay-label">CVV</label>
                <input class="pay-input" id="pay-cvv" type="text" placeholder="123" maxlength="4" autocomplete="cc-csc">
              </div>
            </div>
          </div>

          <!-- PayPal Form -->
          <div id="paypal-form" style="display:none;margin-bottom:1.5rem;">
            <div class="pay-field">
              <label class="pay-label">PayPal Email</label>
              <input class="pay-input" id="pay-paypal-email" type="email" placeholder="user@example.com" autocomplete="email">
            </div>
            <div style="background:rgba(0,112,192,0.1);border:1px solid rgba(0,112,192,0.3);border-radius:8px;padding:1.25rem;margin-top:1.5rem;font-size:0.95rem;color:var(--ink-3);">
              <strong style="color:var(--ink);">PayPal Secure</strong><br>
              You'll be redirected to PayPal to complete your purchase securely.
            </div>
          </div>

          <!-- Bitcoin Form -->
          <div id="bitcoin-form" style="display:none;margin-bottom:1.5rem;">
            <div style="background:rgba(247,147,26,0.1);border:1px solid rgba(247,147,26,0.3);border-radius:8px;padding:1.25rem;margin-bottom:1.5rem;font-size:0.95rem;color:var(--ink-3);">
              <strong style="color:var(--ink);">Bitcoin Payment</strong><br>
              Send the exact amount to the wallet address below. Transaction will be confirmed within 10 minutes.
            </div>
            <div class="pay-field">
              <label class="pay-label">Bitcoin Wallet Address</label>
              <div style="display:flex;gap:0.75rem;">
                <input class="pay-input" id="pay-bitcoin-addr" type="text" value="1A1z7agoat2PYLST27zXD9aj8GStzATY" readonly style="cursor:pointer;font-family:monospace;font-size:0.85rem;">
                <button onclick="copyBitcoinAddress()" style="background:var(--accent);color:white;border:none;border-radius:6px;padding:0 1.25rem;cursor:pointer;font-weight:700;font-family:inherit;flex-shrink:0;font-size:0.9rem;">Copy</button>
              </div>
            </div>
            <div class="pay-field">
              <label class="pay-label">Amount to Send (BTC)</label>
              <input class="pay-input" id="pay-bitcoin-amount" type="text" readonly placeholder="0.00045 BTC" style="color:var(--ink-2);">
            </div>
          </div>

          <button class="pay-confirm" id="pay-btn">Complete Purchase</button>
        </div>
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
          <p class="library-page-subtitle" id="lib-subtitle">Your owned books</p>
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
      <div class="sp-section-label">Profile</div>
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
      <div class="sp-currency-row" id="sp-currency-row">
        <button class="sp-currency-btn" data-currency="USD">$ USD</button>
        <button class="sp-currency-btn" data-currency="JMD">J$ JMD</button>
        <button class="sp-currency-btn" data-currency="YEN">¥ JPY</button>
      </div>
    </div>
  </div>
</div>

<div id="toast" class="toast"></div>

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

// ---- Wishlist badge ----
function updateWishlistBadge() {
  try {
    const wl    = JSON.parse(localStorage.getItem('yomite-wishlist') || '[]');
    const badge = document.getElementById('wishlist-badge');
    if (!badge) return;
    badge.textContent   = wl.length;
    badge.style.display = wl.length > 0 ? 'inline-flex' : 'none';
  } catch(e) {}
}

// ---- Cart badge ----
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

// ---- Remove from cart ----
async function removeItem(bookId) {
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-remove.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ book_id: bookId })
    });
    const data = await res.json();
    if (data.success) loadCart();
  } catch(e) { console.error(e); }
}

// ---- Load & render cart ----
async function loadCart() {
  const col      = document.getElementById('cart-items-col');
  const summary  = document.getElementById('cart-summary-col');
  const subtitle = document.getElementById('cart-subtitle');

  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-get.php');
    const data = await res.json();
    if (!data.success) throw new Error('bad response');

    updateCartBadge();
    const count = data.books.length;
    subtitle.textContent = count === 0 ? 'Your cart is empty' : count === 1 ? '1 item' : `${count} items`;

    if (count === 0) {
      summary.style.display = 'none';
      col.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;padding:6rem 0;color:var(--ink-3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <div style="font-weight:800;font-size:1.3rem;color:var(--ink);">Your cart is empty</div>
          <div style="font-size:1rem;text-align:center;max-width:320px;color:var(--ink-3);">Browse the store and add something you like.</div>
          <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="btn-dark" style="margin-top:0.5rem;background:var(--accent);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:1rem;">Browse Books</a>
        </div>`;
      return;
    }

    summary.style.display = '';
    
    // Calculate total using BOOKS array with format-specific pricing
    let totalUSD = 0;
    data.books.forEach(b => {
      const bookData = (typeof getBookById === 'function') ? getBookById(b.id) : null;
      if (bookData && bookData.formats) {
        const formatData = bookData.formats.find(f => f.type === b.format);
        const price = formatData ? formatData.price_usd : bookData.price_usd;
        totalUSD += price;
      } else if (bookData) {
        totalUSD += bookData.price_usd;
      }
    });
    
    const fmt = formatPrice(totalUSD);
    document.getElementById('s-subtotal').textContent = fmt;
    document.getElementById('s-total').textContent    = fmt;

    col.innerHTML = data.books.map(b => {
      // Get the book data from BOOKS array
      const bookData = (typeof getBookById === 'function') ? getBookById(b.id) : null;
      
      // Find the price for this specific format
      let price = 0;
      if (bookData && bookData.formats) {
        const formatData = bookData.formats.find(f => f.type === b.format);
        price = formatData ? formatData.price_usd : bookData.price_usd;
      } else if (bookData) {
        price = bookData.price_usd;
      }
      
      const priceStr = price === 0 ? 'Free' : formatPrice(price);
      const formatLabel = b.format === 'collectors' ? "Collector's Edition" : (b.format.charAt(0).toUpperCase() + b.format.slice(1));
      
      return `
        <div style="display:flex;align-items:center;gap:1.5rem;padding:1.75rem 0;border-bottom:1px solid var(--border);">
          <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}" style="flex-shrink:0;">
            <img src="${b.cover_img}" alt="${b.title}" style="width:90px;height:128px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">
          </a>
          <div style="flex:1;min-width:0;">
            <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}" style="font-size:1.15rem;font-weight:800;color:var(--ink);text-decoration:none;display:block;margin-bottom:8px;line-height:1.3;">${b.title}</a>
            <div style="font-size:1rem;color:var(--ink-3);margin-bottom:10px;">${b.author} · ${b.genre}</div>
            <div style="font-size:0.95rem;color:var(--ink-2);margin-bottom:8px;font-weight:600;">${formatLabel}</div>
            <div style="font-size:1.2rem;font-weight:800;color:var(--ink);">${priceStr}</div>
          </div>
          <button onclick="removeItem(${b.id})" style="background:none;border:1.5px solid var(--border);border-radius:8px;padding:8px 14px;font-size:0.9rem;color:var(--ink-3);cursor:pointer;flex-shrink:0;transition:border-color 0.15s,color 0.15s;font-weight:600;font-family:inherit;" onmouseover="this.style.color='#e74c3c';this.style.borderColor='#e74c3c';this.style.backgroundColor='rgba(231,76,60,0.05)'" onmouseout="this.style.color='var(--ink-3)';this.style.borderColor='var(--border)';this.style.backgroundColor='transparent'">Remove</button>
        </div>`;
    }).join('');

  } catch(e) {
    col.innerHTML = `<div style="padding:3rem 0;text-align:center;color:var(--ink-3);">Could not load cart.</div>`;
    console.error(e);
  }
}

// ---- Checkout ----
// Payment method state
let currentPaymentMethod = 'card';

function switchPaymentMethod(method) {
  currentPaymentMethod = method;
  
  // Update button styles
  document.querySelectorAll('.pay-method-btn').forEach(btn => {
    btn.classList.remove('pay-method-active');
    btn.style.borderColor = 'var(--border)';
    btn.style.color = 'var(--ink-3)';
    btn.style.background = 'transparent';
  });
  document.getElementById(`pay-method-${method}`).classList.add('pay-method-active');
  document.getElementById(`pay-method-${method}`).style.borderColor = 'var(--accent)';
  document.getElementById(`pay-method-${method}`).style.color = 'var(--ink)';
  document.getElementById(`pay-method-${method}`).style.background = 'rgba(var(--accent-rgb),0.05)';
  
  // Hide all forms
  document.getElementById('card-form').style.display = 'none';
  document.getElementById('paypal-form').style.display = 'none';
  document.getElementById('bitcoin-form').style.display = 'none';
  
  // Show selected form
  if (method === 'card') document.getElementById('card-form').style.display = 'block';
  if (method === 'paypal') document.getElementById('paypal-form').style.display = 'block';
  if (method === 'bitcoin') {
    document.getElementById('bitcoin-form').style.display = 'block';
    updateBitcoinAmount();
  }
  
  // Update button text
  const btn = document.getElementById('pay-btn');
  if (method === 'card') btn.textContent = 'Complete Purchase';
  if (method === 'paypal') btn.textContent = 'Pay with PayPal';
  if (method === 'bitcoin') btn.textContent = 'I\'ve Sent Bitcoin';
}

function updateBitcoinAmount() {
  // Get current total in USD from the summary
  const totalText = document.getElementById('s-total').textContent;
  // Parse price (remove currency symbol)
  const totalUSD = parseFloat(totalText.replace(/[^0-9.]/g, ''));
  // Convert to BTC (assuming 1 BTC = $43,000 for demo)
  const btcRate = 43000;
  const btcAmount = (totalUSD / btcRate).toFixed(8);
  document.getElementById('pay-bitcoin-amount').value = btcAmount + ' BTC';
}

function copyBitcoinAddress() {
  const addr = document.getElementById('pay-bitcoin-addr');
  addr.select();
  document.execCommand('copy');
  showToast('Bitcoin address copied to clipboard!');
}

document.getElementById('pay-btn').addEventListener('click', async () => {
  const errEl = document.getElementById('pay-error');
  errEl.style.display = 'none';
  const btn = document.getElementById('pay-btn');
  
  // Validate based on payment method
  if (currentPaymentMethod === 'card') {
    const name    = document.getElementById('pay-name').value.trim();
    const cardNum = document.getElementById('pay-card').value.replace(/\s/g, '');
    const expiry  = document.getElementById('pay-expiry').value;
    const cvv     = document.getElementById('pay-cvv').value;

    if (!name)                           { errEl.textContent = 'Enter the cardholder name.'; errEl.style.display = ''; return; }
    if (!/^\d{16}$/.test(cardNum))       { errEl.textContent = 'Card number must be 16 digits.'; errEl.style.display = ''; return; }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { errEl.textContent = 'Expiry must be MM/YY.'; errEl.style.display = ''; return; }
    if (!/^\d{3,4}$/.test(cvv))         { errEl.textContent = 'CVV must be 3–4 digits.'; errEl.style.display = ''; return; }
  } else if (currentPaymentMethod === 'paypal') {
    const email = document.getElementById('pay-paypal-email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errEl.textContent = 'Enter a valid PayPal email.'; errEl.style.display = ''; return;
    }
  } else if (currentPaymentMethod === 'bitcoin') {
    // Bitcoin validation - just confirm they've sent it
    showToast('Bitcoin transaction will be verified within 10 minutes.');
  }

  btn.disabled = true; 
  btn.textContent = currentPaymentMethod === 'card' ? 'Processing…' : 'Verifying…';

  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-buy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ book_ids: 'all', payment_method: currentPaymentMethod })
    });
    const data = await res.json();
    btn.disabled = false; 
    btn.textContent = currentPaymentMethod === 'card' ? 'Complete Purchase' : 'Pay with ' + currentPaymentMethod.charAt(0).toUpperCase() + currentPaymentMethod.slice(1);

    if (data.success) {
      if (currentPaymentMethod === 'card') {
        ['pay-name','pay-card','pay-expiry','pay-cvv'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
      } else if (currentPaymentMethod === 'paypal') {
        document.getElementById('pay-paypal-email').value = '';
      }
      showToast(`✓ ${data.purchased} book${data.purchased > 1 ? 's' : ''} added to your library!`);
      loadCart();
    } else {
      errEl.textContent = data.error || 'Something went wrong.';
      errEl.style.display = '';
    }
  } catch(e) {
    btn.disabled = false; 
    btn.textContent = currentPaymentMethod === 'card' ? 'Complete Purchase' : 'Pay with ' + currentPaymentMethod.charAt(0).toUpperCase() + currentPaymentMethod.slice(1);
    errEl.textContent = 'Network error. Try again.';
    errEl.style.display = '';
  }
});

// ---- Card formatting ----
document.getElementById('pay-card').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').slice(0, 16);
  this.value = v.replace(/(.{4})/g, '$1 ').trim();
});
document.getElementById('pay-expiry').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  this.value = v;
});

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
  fetchPlanBadge();
}
function closeSettings() {
  document.getElementById('settings-drawer').classList.remove('open');
  document.getElementById('settings-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
const PLAN_LABELS = { free: 'Yomite Free', student: 'Yomite Student', regular: 'Yomite Regular' };
async function fetchPlanBadge() {
  const badge = document.getElementById('sp-plan-badge');
  if (!badge) return;
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/subscription-get.php');
    const data = await res.json();
    if (data.success) { const slug = data.subscription.plan_slug; badge.textContent = PLAN_LABELS[slug] || slug; badge.dataset.plan = slug; }
  } catch(e) { badge.textContent = 'Free'; }
}

// ---- Nav scroll ----
window.addEventListener('scroll', () =>
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 10));

// ---- Wire events ----
document.getElementById('library-btn').addEventListener('click', e => { e.preventDefault(); openLibrary(); });
document.getElementById('library-overlay').addEventListener('click', closeLibrary);

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
    loadCart();
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLibrary(); closeSettings(); }
});

// ---- Init ----
updateWishlistBadge();
updateCartBadge();
loadCart();
</script>
</body>
</html>