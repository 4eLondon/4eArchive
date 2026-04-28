<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yomite: My Cart</title>
  <link rel="icon" type="image/x-icon" href="/WD3_Project_Sem2_MangaWebsite/Project/images/website-icon.png">
  <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/index.css">
  <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/cart.css">
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
      <a href="#" class="nav-pill-btn" id="wishlist-btn" title="Wishlist">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Wishlist
      </a>
      <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php" class="nav-pill-btn nav-pill-btn--accent" title="My Cart">
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

<div id="toast" class="toast"></div>

<!-- CART PAGE -->
<main class="cart-page">
  <div class="cart-page-inner">
    <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="cart-back-link">
      ← Continue Shopping
    </a>
    <h1 class="cart-page-title">My Cart</h1>
    <span class="cart-page-count" id="cart-count-label"></span>

    <div class="cart-layout">
      <!-- Items -->
      <div class="cart-items-card" id="cart-items-col">
        <div class="cart-empty">
          <div class="cart-empty-title">Loading…</div>
        </div>
      </div>

      <!-- Summary -->
      <div class="cart-summary-card" id="cart-summary-col" style="display:none;">
        <div class="summary-heading">Order Summary</div>
        <div class="summary-row"><span>Subtotal</span><span id="s-subtotal">—</span></div>
        <div class="summary-row"><span>Taxes &amp; fees</span><span>$0.00</span></div>
        <div class="summary-row total"><span>Total</span><span id="s-total">—</span></div>

        <hr class="checkout-divider">
        <div class="checkout-heading">Payment Details</div>

        <div id="pay-error" class="pay-error" style="display:none;"></div>

        <div class="pay-field">
          <label class="pay-label">Cardholder Name</label>
          <input class="pay-input" id="pay-name" type="text" placeholder="Name on card" autocomplete="cc-name">
        </div>
        <div class="pay-field">
          <label class="pay-label">Card Number</label>
          <input class="pay-input" id="pay-card" type="text" placeholder="0000 0000 0000 0000" maxlength="19" autocomplete="cc-number">
        </div>
        <div class="pay-row">
          <div class="pay-field">
            <label class="pay-label">Expiry</label>
            <input class="pay-input" id="pay-expiry" type="text" placeholder="MM/YY" maxlength="5" autocomplete="cc-exp">
          </div>
          <div class="pay-field">
            <label class="pay-label">CVV</label>
            <input class="pay-input" id="pay-cvv" type="text" placeholder="•••" maxlength="4" autocomplete="cc-csc">
          </div>
        </div>
        <button class="pay-confirm" id="pay-btn">Confirm Purchase</button>
        <p class="pay-disclaimer">🔒 Demo only. No real payment is processed.</p>
      </div>
    </div>
  </div>
</main>

<!-- Library popup (nav button) -->
<div class="library-popup" id="library-popup">
  <div class="library-popup-header">
    <span class="library-popup-title">My Library</span>
    <button class="library-popup-close" id="lib-close-btn">✕</button>
  </div>
  <div class="library-popup-body" id="library-body">
    <div class="popup-empty">Your library is empty.</div>
  </div>
</div>
<div class="library-overlay" id="library-overlay"></div>

<!-- Settings drawer -->
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

<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
<script>
// Apply theme immediately
(function() {
  const t = localStorage.getItem('yomite-theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
  document.querySelectorAll('.sp-theme-card').forEach(c =>
    c.classList.toggle('selected', c.dataset.themeTarget === t));
})();

// ---- Helpers ----
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('yomite-theme', theme);
  document.querySelectorAll('.sp-theme-card').forEach(c =>
    c.classList.toggle('selected', c.dataset.themeTarget === theme));
}

// ---- Cart badge ----
async function updateBadge() {
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
  const col     = document.getElementById('cart-items-col');
  const summary = document.getElementById('cart-summary-col');
  const label   = document.getElementById('cart-count-label');

  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-get.php');
    const data = await res.json();
    if (!data.success) throw new Error('bad response');

    updateBadge();

    const count = data.books.length;
    label.textContent = count === 1 ? '1 item' : `${count} items`;

    if (count === 0) {
      summary.style.display = 'none';
      col.innerHTML = `
        <div class="cart-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <div class="cart-empty-title">Your cart is empty</div>
          <div class="cart-empty-sub">Browse the store and add something you like.</div>
          <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="cart-browse-btn">Browse Books</a>
        </div>`;
      return;
    }

    summary.style.display = '';
    const fmt = formatPrice(parseFloat(data.total));
    document.getElementById('s-subtotal').textContent = fmt;
    document.getElementById('s-total').textContent    = fmt;

    col.innerHTML = data.books.map(b => {
      const price = parseFloat(b.price);
      const priceStr = price === 0 ? 'Free' : formatPrice(price);
      return `
        <div class="cart-item-row">
          <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}">
            <img class="cart-item-cover" src="${b.cover_img}" alt="${b.title}">
          </a>
          <div class="cart-item-details">
            <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}" class="cart-item-name">${b.title}</a>
            <div class="cart-item-meta">${b.author} · ${b.genre}</div>
            <div class="cart-item-price">${priceStr}</div>
          </div>
          <button class="cart-remove-btn" onclick="removeItem(${b.id})">Remove</button>
        </div>`;
    }).join('');

  } catch(e) {
    col.innerHTML = `<div class="cart-empty"><div class="cart-empty-title">Could not load cart.</div></div>`;
    console.error(e);
  }
}

// ---- Checkout ----
document.getElementById('pay-btn').addEventListener('click', async () => {
  const name    = document.getElementById('pay-name').value.trim();
  const cardNum = document.getElementById('pay-card').value.replace(/\s/g, '');
  const expiry  = document.getElementById('pay-expiry').value;
  const cvv     = document.getElementById('pay-cvv').value;
  const errEl   = document.getElementById('pay-error');

  errEl.style.display = 'none';

  if (!name)                           { errEl.textContent = 'Enter the cardholder name.'; errEl.style.display = ''; return; }
  if (!/^\d{16}$/.test(cardNum))       { errEl.textContent = 'Card number must be 16 digits.'; errEl.style.display = ''; return; }
  if (!/^\d{2}\/\d{2}$/.test(expiry)) { errEl.textContent = 'Expiry must be MM/YY.'; errEl.style.display = ''; return; }
  if (!/^\d{3,4}$/.test(cvv))         { errEl.textContent = 'CVV must be 3–4 digits.'; errEl.style.display = ''; return; }

  const btn = document.getElementById('pay-btn');
  btn.disabled = true; btn.textContent = 'Processing…';

  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-buy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ book_ids: 'all' })
    });
    const data = await res.json();
    btn.disabled = false; btn.textContent = 'Confirm Purchase';

    if (data.success) {
      document.getElementById('pay-name').value = '';
      document.getElementById('pay-card').value = '';
      document.getElementById('pay-expiry').value = '';
      document.getElementById('pay-cvv').value = '';
      toast(`✓ ${data.purchased} book${data.purchased > 1 ? 's' : ''} added to your library!`);
      loadCart();
    } else {
      errEl.textContent = data.error || 'Something went wrong.';
      errEl.style.display = '';
    }
  } catch(e) {
    btn.disabled = false; btn.textContent = 'Confirm Purchase';
    errEl.textContent = 'Network error. Try again.';
    errEl.style.display = '';
  }
});

// ---- Card input formatting ----
document.getElementById('pay-card').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').slice(0, 16);
  this.value = v.replace(/(.{4})/g, '$1 ').trim();
});
document.getElementById('pay-expiry').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  this.value = v;
});

// ---- Nav scroll ----
window.addEventListener('scroll', () =>
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 10));

// ---- Library panel ----
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
    const body = document.getElementById('library-body');
    if (!data.success) return;
    body.innerHTML = data.books.length === 0
      ? '<div class="popup-empty">Your library is empty.</div>'
      : data.books.map(b => `
          <div class="library-item">
            <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}">
              <img class="library-item-img" src="${b.cover_img}" alt="${b.title}">
            </a>
            <div class="library-item-info">
              <div class="library-item-title">${b.title}</div>
              <div class="library-item-meta">${b.author} · ${b.genre}</div>
              <div class="library-item-owned">✓ Owned</div>
            </div>
          </div>`).join('');
  } catch(e) {}
}

// ---- Settings drawer ----
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

// ---- Wire up events ----
document.getElementById('library-btn').addEventListener('click', e => { e.preventDefault(); openLibrary(); });
document.getElementById('lib-close-btn').addEventListener('click', closeLibrary);
document.getElementById('library-overlay').addEventListener('click', closeLibrary);

document.getElementById('settings-drawer-trigger').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
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
    loadCart(); // refresh prices
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLibrary(); closeSettings(); }
});

// ---- Init ----
updateBadge();
loadCart();
</script>
</body>
</html>