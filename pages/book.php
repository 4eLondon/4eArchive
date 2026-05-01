<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yomite — Book</title>
  <link rel="icon" href="/WD3_Project_Sem2_MangaWebsite/Project/images/website-icon.png">
  <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/index.css">
  <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/book.css">
  <script>
    (function(){
      const t = localStorage.getItem('yomite-theme') || 'light';
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
</head>
<body>

<!-- NAV (same as index) -->
<nav class="nav" id="nav">
  <div class="nav-inner">
    <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="nav-logo">Yomite<span>.</span></a>
    <div class="nav-actions">
      <a href="#" class="nav-pill-btn" id="wishlist-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Wishlist
      </a>
      <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php" class="nav-pill-btn nav-pill-btn--accent" id="cart-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Cart
        <span class="library-badge" id="cart-badge" style="display:none;">0</span>
      </a>
      <a href="#" class="nav-pill-btn" id="library-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        Library
      </a>
      <span class="nav-divider"></span>
      <div class="nav-icon-group">
        <a href="#" class="nav-icon-btn" id="settings-drawer-trigger">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </a>
      </div>
      <span class="nav-divider"></span>
      <a href="/WD3_Project_Sem2_MangaWebsite/Project/app/logout.php" class="nav-logout-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </a>
    </div>
  </div>
</nav>

<!-- BOOK PAGE CONTENT — filled by JS -->
<main class="book-page" id="book-page">
  <div class="book-loading">Loading…</div>
</main>

<!-- LIBRARY POPUP -->
<div class="library-popup" id="library-popup">
  <div class="library-popup-header">
    <span class="library-popup-title">My Library</span>
    <button class="library-popup-close" onclick="closeLibraryPanel()">✕</button>
  </div>
  <div class="library-popup-body" id="library-body"><div class="popup-empty">Your library is empty.</div></div>
</div>
<div class="library-overlay" id="library-overlay"></div>

<!-- SETTINGS PANEL -->
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
<div class="settings-overlay" id="settings-overlay"></div>

<div class="toast" id="toast"></div>

<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-content.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/index.js"></script>
<script>
// Render book from URL param
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const book = getBookById(id);
  const page = document.getElementById('book-page');

  if (!book) {
    page.innerHTML = '<div class="book-not-found"><h2>Book not found.</h2><a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php">← Back to store</a></div>';
    return;
  }

  document.title = `Yomite — ${book.title}`;
  const price = book.soldOut ? 'Sold Out' : formatPrice(book.price_usd);
  const priceClass = book.soldOut ? 'book-price sold-out' : 'book-price';

  // Build chapters section if content exists
  const bookContent = (typeof BOOK_CONTENT !== 'undefined') ? BOOK_CONTENT[book.id] : null;
  let chaptersHTML = '';
  if (bookContent && bookContent.chapters && bookContent.chapters.length > 0) {
    const chapterItems = bookContent.chapters.map((ch, i) => `
      <a class="chapter-row" href="/WD3_Project_Sem2_MangaWebsite/Project/pages/reader.php?id=${book.id}&chapter=${i}">
        <div class="chapter-row-left">
          <span class="chapter-num">Ch. ${i + 1}</span>
          <span class="chapter-title">${ch.title.replace(/^Chapter \d+:\s*/i, '')}</span>
        </div>
        <span class="chapter-read-btn">Read →</span>
      </a>
    `).join('');
    chaptersHTML = `
      <div class="book-chapters-section">
        <div class="book-chapters-header">
          <h2 class="book-chapters-title">Chapters</h2>
          <span class="book-chapters-count">${bookContent.chapters.length} available</span>
        </div>
        <div class="chapter-list">${chapterItems}</div>
      </div>
    `;
  }

  page.innerHTML = `
    <div class="book-hero">
      <div class="book-cover-wrap">
        <img class="book-cover" src="${book.cover_img}" alt="${book.title}">
      </div>
      <div class="book-info">
        <a class="book-back" href="/WD3_Project_Sem2_MangaWebsite/Project/index.php">← Back to store</a>
        <div class="book-genre-tag">${book.genre}</div>
        <h1 class="book-title">${book.title}</h1>
        <p class="book-author">by ${book.author}</p>
        <div class="book-meta-row">
          <span class="book-meta-pill">${book.volumes} Volumes</span>
          <span class="book-meta-pill">${book.status}</span>
          <span class="book-meta-pill">Since ${book.year}</span>
        </div>
        <p class="book-synopsis">${book.synopsis}</p>
        <div class="${priceClass}" id="book-price-display">${price}</div>
        ${book.soldOut ? '' : `
        <div class="book-actions">
          <button class="book-btn-cart" onclick="addToCart(${book.id})">Add to Cart</button>
          <button class="book-btn-buy" onclick="buyNow(${book.id}, ${book.price_usd})">Buy Now</button>
        </div>`}
      </div>
    </div>
    ${chaptersHTML}`;

  // Update price if currency changes
  window.addEventListener('currency-changed', () => {
    const p = book.soldOut ? 'Sold Out' : formatPrice(book.price_usd);
    document.getElementById('book-price-display').textContent = p;
  });
});

function buyNow(bookId, priceUSD) {
  addToCart(bookId).then(() => {
    setTimeout(() => {
      window.location.href = '/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php';
    }, 400);
  });
}
</script>
</body>
</html>