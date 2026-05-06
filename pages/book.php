<?php session_start(); ?>
<!DOCTYPE html>
<html data-plan="<?= htmlspecialchars($_SESSION['plan'] ?? 'free') ?>">
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

      <!-- WISHLIST -->
      <a href="#" class="nav-pill-btn" id="wishlist-btn" title="Wishlist">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Wishlist
      </a>

      <!-- CART -->
      <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php" class="nav-pill-btn nav-pill-btn--accent" id="cart-btn" title="My Cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Cart
        <span class="library-badge" id="cart-badge" style="display:none;">0</span>
      </a>

      <!-- LIBRARY -->
      <a href="#" class="nav-pill-btn" id="library-btn" title="My Library">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        Library
      </a>

      <!-- YOMITE PASS -->
      <a href="#" class="nav-pill-btn nav-pill-btn--pass" id="pass-nav-btn" title="Yomite Pass">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
        Pass
      </a>

      <span class="nav-divider"></span>

      <div class="nav-icon-group">
        <!-- SETTINGS -->
        <a href="#" class="nav-icon-btn" id="settings-drawer-trigger" title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </a>
        <!-- HELP -->
        <a href="#" class="nav-icon-btn" title="Help">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </a>
      </div>

      <span class="nav-divider"></span>

      <a href="/WD3_Project_Sem2_MangaWebsite/Project/app/logout.php" class="nav-logout-icon" title="Log Out">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </a>
    </div>
  </div>
</nav>

<!-- BOOK PAGE CONTENT — filled by JS -->
<main class="book-page" id="book-page">
  <!-- Floating background deco panels -->
  <div class="book-bg-deco" aria-hidden="true">
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
    <div class="book-bg-panel"></div>
  </div>
  <div class="book-loading">Loading…</div>
</main>

<!-- ========== LIBRARY POPUP (owned) ========== -->
<!-- ========== LIBRARY FULL-PAGE OVERLAY ========== -->
<div class="library-page" id="library-popup">
    <div class="library-page-inner">
        <!-- Header -->
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
            <button class="library-page-close" onclick="closeLibraryPanel()" aria-label="Close library">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>

        <!-- Controls: search + filters -->
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
                    <option value="genre">By Genre</option>
                </select>
            </div>
        </div>

        <!-- Genre filter pills -->
        <div class="library-genre-pills" id="lib-genre-pills">
            <button class="lib-genre-pill active" data-genre="all" onclick="setGenreFilter(this, 'all')">All</button>
        </div>

        <!-- Book grid -->
        <div class="library-grid" id="library-body">
            <div class="library-loading">
                <div class="lib-spinner"></div>
                <span>Loading your books…</span>
            </div>
        </div>
    </div>
</div>
<div class="library-overlay" id="library-overlay"></div>

<!-- ========== WISHLIST POPUP ========== -->
<div class="library-page" id="wishlist-popup">
    <div class="library-page-inner">
        <!-- Header -->
        <div class="library-page-header">
            <div class="library-page-header-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <div>
                    <h1 class="library-page-title">My Wishlist</h1>
                    <p class="library-page-subtitle" id="wishlist-subtitle">Your saved books</p>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;">
                <button class="btn-dark" id="clear-wishlist-btn" style="display:none;font-size:0.8rem;padding:0.4rem 0.9rem;">Clear All</button>
                <button class="library-page-close" onclick="closeWishlist()" aria-label="Close wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Controls: search + sort -->
        <div class="library-controls">
            <div class="library-search-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="library-search-icon">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="library-search-input" id="wishlist-search" placeholder="Search your wishlist…" oninput="renderWishlist()">
            </div>
            <div class="library-sort-wrap">
                <select class="library-sort-select" id="wishlist-sort" onchange="renderWishlist()">
                    <option value="recent">Recently Added</option>
                    <option value="title">Title A–Z</option>
                    <option value="author">Author A–Z</option>
                    <option value="price">Price</option>
                </select>
            </div>
        </div>

        <!-- Book grid -->
        <div class="library-grid" id="wishlist-body">
            <div class="library-loading">
                <div class="lib-spinner"></div>
                <span>Loading your wishlist…</span>
            </div>
        </div>
    </div>
</div>
<div class="library-overlay" id="wishlist-overlay"></div>

<!-- ========== SETTINGS PANEL ========== -->
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
                    <div class="sp-theme-preview sp-dark-p">
                        <div class="sp-tp-bar"></div>
                        <div class="sp-tp-content"><div class="sp-tp-dot"></div><div class="sp-tp-lines"><div class="sp-tp-line"></div><div class="sp-tp-line sp-short"></div></div></div>
                    </div>
                    <div class="sp-theme-foot"><div class="sp-theme-check"></div> Dark</div>
                </button>
                <button class="sp-theme-card" data-theme-target="light">
                    <div class="sp-theme-preview sp-light-p">
                        <div class="sp-tp-bar"></div>
                        <div class="sp-tp-content"><div class="sp-tp-dot"></div><div class="sp-tp-lines"><div class="sp-tp-line"></div><div class="sp-tp-line sp-short"></div></div></div>
                    </div>
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

<!-- ========== TOAST ========== -->
<div class="toast" id="toast"></div>

<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-content.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/index.js"></script>
<script>
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const book = getBookById(id);
  const page = document.getElementById('book-page');

  if (!book) {
    page.innerHTML = '<div class="book-not-found"><h2>Book not found.</h2><a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php">← Back to store</a></div>';
    return;
  }

  document.title = `Yomite — ${book.title}`;

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

        <div class="book-access-block">
          <button class="book-btn-read book-btn-library" id="book-add-library-btn" data-in-library="false" onclick="bookPageToggleLibrary(${book.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>
            <span id="book-add-library-label">Add to Library</span>
          </button>
          <a class="book-btn-read" id="book-read-btn" href="/WD3_Project_Sem2_MangaWebsite/Project/pages/reader.php?id=${book.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span id="book-read-btn-label">Start Reading</span>
          </a>
        </div>
      </div>
    </div>

    ${chaptersHTML}

    <!-- REVIEWS SECTION -->
    <div class="book-reviews-section">
      <div class="book-reviews-header">
        <div>
          <h2 class="book-reviews-title">Reviews</h2>
          <button class="book-btn-add-review" id="review-toggle-btn" onclick="toggleReviewForm()">+ Write a Review</button>
        </div>
        <div class="book-reviews-stats">
          <span class="book-avg-rating" id="book-avg-rating">—</span>
          <span class="book-review-count" id="book-review-count">0 reviews</span>
        </div>
      </div>

      <!-- Add Review Form -->
      <div class="review-form" id="review-form-section" style="display:none;">
        <h3 class="review-form-title">Share Your Thoughts</h3>
        <form id="add-review-form" onsubmit="submitReview(event, ${book.id})">
          <div class="review-form-group">
            <label class="review-form-label">Rating</label>
            <div class="review-stars" id="review-stars-input">
              <button type="button" class="review-star" data-rating="1" onclick="setRating(1)">★</button>
              <button type="button" class="review-star" data-rating="2" onclick="setRating(2)">★</button>
              <button type="button" class="review-star" data-rating="3" onclick="setRating(3)">★</button>
              <button type="button" class="review-star" data-rating="4" onclick="setRating(4)">★</button>
              <button type="button" class="review-star" data-rating="5" onclick="setRating(5)">★</button>
            </div>
            <input type="hidden" id="review-rating-input" name="rating" value="0">
          </div>
          <div class="review-form-group">
            <label class="review-form-label">Your Review</label>
            <textarea class="review-textarea" id="review-comment-input" name="comment" placeholder="What did you think about this book? (min 3 chars)" rows="4" required></textarea>
            <div class="review-char-count"><span id="review-char-count">0</span>/1000</div>
          </div>
          <div class="review-form-actions">
            <button type="submit" class="review-btn-submit">Post Review</button>
            <button type="button" class="review-btn-cancel" onclick="toggleReviewForm()">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Reviews List -->
      <div class="review-list" id="review-list">
        <div class="review-loading" style="text-align:center;padding:2rem;color:var(--ink-3);">
          <div class="lib-spinner" style="width:30px;height:30px;margin:0 auto 1rem;"></div>
          <span>Loading reviews…</span>
        </div>
      </div>
    </div>`;

  // Check reading progress — swap "Start Reading" → "Continue Reading"
  const hasStarted = localStorage.getItem(`yomite-reading-${book.id}`);
  if (hasStarted) {
    const lbl = document.getElementById('book-read-btn-label');
    const btn = document.getElementById('book-read-btn');
    if (lbl) lbl.textContent = 'Continue Reading';
    if (btn) {
      // Update icon to a play/arrow icon for continue
      btn.querySelector('svg').innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    }
  }

  // Check if already in library
  checkBookInLibrary(book.id);
});


function toggleCartDropdown(e) {
  e.stopPropagation();
  const menu = document.getElementById('book-cart-dropdown-menu');
  const btn  = document.getElementById('book-cart-toggle-btn');
  if (!menu) return;
  const isOpen = menu.classList.contains('open');
  menu.classList.toggle('open', !isOpen);
  btn.classList.toggle('active', !isOpen);
}

document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('book-cart-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    const menu = document.getElementById('book-cart-dropdown-menu');
    const btn  = document.getElementById('book-cart-toggle-btn');
    if (menu) menu.classList.remove('open');
    if (btn)  btn.classList.remove('active');
  }
});

async function addToCartWithEdition(bookId, edition, e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('book-cart-dropdown-menu');
  const btn  = document.getElementById('book-cart-toggle-btn');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('active');
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-add.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ book_id: bookId, edition: edition })
    });
    const data = await res.json();
    if (data.owned)   { showToast('Already in your library.'); return; }
    if (data.success) {
      updateCartBadge();
      showToast(data.already ? 'Already in your cart.' : '✓ Added to Cart!');
    } else {
      showToast(data.error || 'Could not add to cart.');
    }
  } catch(e) { showToast('Network error.'); console.error(e); }
}

function buyNow(bookId, priceUSD) {
  addToCart(bookId).then(() => {
    setTimeout(() => {
      window.location.href = '/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php';
    }, 400);
  });
}

async function bookPageToggleLibrary(bookId) {
  const btn = document.getElementById('book-add-library-btn');
  const lbl = document.getElementById('book-add-library-label');
  if (!btn) return;

  const isInLibrary = btn.dataset.inLibrary === 'true';

  const endpoint = isInLibrary
    ? '/WD3_Project_Sem2_MangaWebsite/Project/app/library-remove.php'
    : '/WD3_Project_Sem2_MangaWebsite/Project/app/library-add.php';

  btn.disabled = true;
  lbl.textContent = isInLibrary ? 'Removing…' : 'Adding…';

  try {
    const res  = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ book_id: bookId })
    });
    const data = await res.json();

    if (data.success) {
      if (isInLibrary) {
        setLibraryBtnDefault(btn, lbl);
        showToast('Removed from library.');
      } else {
        setLibraryBtnInLibrary(btn, lbl);
        showToast(data.already ? 'Already in your library.' : '✓ Added to library!');
      }
    } else {
      lbl.textContent = isInLibrary ? 'Remove from Library' : 'Add to Library';
      btn.disabled = false;
      showToast(data.error || 'Could not update library.');
    }
  } catch (e) {
    lbl.textContent = isInLibrary ? 'Remove from Library' : 'Add to Library';
    btn.disabled = false;
    showToast('Something went wrong.');
  }
}

function setLibraryBtnDefault(btn, lbl) {
  btn.dataset.inLibrary = 'false';
  btn.disabled = false;
  btn.classList.remove('in-library');
  const svg = btn.querySelector('svg');
  if (svg) svg.innerHTML = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/>';
  if (lbl) lbl.textContent = 'Add to Library';
}

function setLibraryBtnInLibrary(btn, lbl) {
  btn.dataset.inLibrary = 'true';
  btn.disabled = false;
  btn.classList.add('in-library');
  const svg = btn.querySelector('svg');
  if (svg) svg.innerHTML = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><polyline points="9 11 12 14 22 4"/>';
  if (lbl) lbl.textContent = 'Remove from Library';
}

async function checkBookInLibrary(bookId) {
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/owned-get.php');
    const data = await res.json();
    if (data.success && Array.isArray(data.books)) {
      const owned = data.books.some(b => String(b.id) === String(bookId));
      if (owned) {
        const btn = document.getElementById('book-add-library-btn');
        const lbl = document.getElementById('book-add-library-label');
        setLibraryBtnInLibrary(btn, lbl);
      }
    }
  } catch (e) { /* silent */ }
}

// ===== REVIEWS =====
function getReviews(bookId) {
  try {
    return JSON.parse(localStorage.getItem(`yomite-reviews-${bookId}`) || '[]');
  } catch (e) {
    return [];
  }
}

function saveReviews(bookId, reviews) {
  localStorage.setItem(`yomite-reviews-${bookId}`, JSON.stringify(reviews));
}

function toggleReviewForm() {
  const form = document.getElementById('review-form-section');
  if (!form) return;
  const isOpen = form.style.display !== 'none';
  form.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    document.getElementById('review-comment-input')?.focus();
  }
}

function setRating(rating) {
  document.getElementById('review-rating-input').value = rating;
  document.querySelectorAll('.review-star').forEach(star => {
    star.classList.toggle('active', parseInt(star.dataset.rating) <= rating);
  });
}

async function submitReview(e, bookId) {
  e.preventDefault();
  const rating = parseInt(document.getElementById('review-rating-input').value);
  const comment = document.getElementById('review-comment-input').value.trim();

  if (rating === 0) {
    showToast('Please select a rating');
    return;
  }

  if (comment.length < 3 || comment.length > 1000) {
    showToast('Review must be 3-1000 characters');
    return;
  }

  try {
    const res = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/review-add.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ book_id: bookId, rating, comment })
    });
    const data = await res.json();

    if (!data.success) {
      showToast(data.error || 'Error posting review');
      return;
    }

    // Save review to localStorage
    const reviews = getReviews(bookId);
    reviews.unshift(data.review);
    saveReviews(bookId, reviews);

    // Reset form
    document.getElementById('add-review-form').reset();
    document.getElementById('review-rating-input').value = '0';
    document.querySelectorAll('.review-star').forEach(s => s.classList.remove('active'));
    document.getElementById('review-char-count').textContent = '0';
    toggleReviewForm();

    showToast('✓ Review posted!');
    renderReviews(bookId);
  } catch (e) {
    showToast('Network error');
  }
}

function renderReviews(bookId) {
  const list = document.getElementById('review-list');
  const reviews = getReviews(bookId);
  const toggleBtn = document.getElementById('review-toggle-btn');

  if (!list) return;

  // Update stats
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';
  document.getElementById('book-avg-rating').textContent = avgRating !== '—' ? `${avgRating} ★` : '—';
  document.getElementById('book-review-count').textContent = reviews.length === 1 ? '1 review' : `${reviews.length} reviews`;

  // Show button
  if (toggleBtn) toggleBtn.style.display = 'block';

  if (reviews.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:3rem 0;color:var(--ink-3);">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="opacity:0.5;margin-bottom:1rem;">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <div>No reviews yet. Be the first to share your thoughts!</div>
    </div>`;
    return;
  }

  list.innerHTML = reviews.map(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const date = new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `
      <div class="review-card">
        <div class="review-card-header">
          <div class="review-card-meta">
            <span class="review-author">@${review.username}</span>
            <span class="review-date">${date}</span>
          </div>
          <span class="review-rating">${stars}</span>
        </div>
        <p class="review-text">${review.comment}</p>
      </div>`;
  }).join('');
}

// Load reviews after page renders
document.addEventListener('DOMContentLoaded', () => {
  const bookId = new URLSearchParams(window.location.search).get('id');
  if (bookId) {
    setTimeout(() => renderReviews(bookId), 500);
  }
  // Update char count on input
  document.getElementById('review-comment-input')?.addEventListener('input', (e) => {
    document.getElementById('review-char-count').textContent = e.target.value.length;
  });
});

async function addToCartAndRedirect(bookId) {
  await addToCart(bookId);
  window.location.href = '/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php';
}

function openSubscribeTiers() {
  if (typeof openPassModal === 'function') openPassModal();
}
</script>

<!-- ===== SUBSCRIPTION MODAL ===== -->
<link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/subscribe.css">
<div class="pass-modal-overlay" id="pass-modal-overlay">
    <div class="pass-modal" id="pass-modal">
        <button class="pass-modal-close" id="pass-modal-close" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
        <div class="pass-modal-header">
            <h2>Choose your <em>Yomite Pass.</em></h2>
            <p>Read more, spend less. Pick the plan that fits your reading life.</p>
        </div>
        <div class="current-plan-banner" id="pm-current-banner" style="display:none;">
            <span>Your current plan:</span>
            <strong id="pm-banner-name">—</strong>
            <span class="current-plan-badge">Active</span>
            <span style="color:var(--ink-3);font-size:0.85rem;" id="pm-banner-renews"></span>
        </div>
        <div class="tier-grid">
            <div class="tier-card" id="pm-card-free">
                <div class="tier-name">Yomite Free</div>
                <div class="tier-price">
                    <span class="tier-price-amount">$0.00</span>
                    <span class="tier-price-period">/ month</span>
                </div>
                <p class="tier-tagline">A taste of what Yomite has to offer — no commitment needed.</p>
                <hr class="tier-divider">
                <ul class="tier-features">
                    <li><span class="feat-icon yes">✦</span> Vol. 1 of ~20–30 rotating titles</li>
                    <li><span class="feat-icon yes">✦</span> 1 device</li>
                    <li><span class="feat-icon yes">✦</span> No ads — ever</li>
                    <li class="feat-disabled"><span class="feat-icon no">✕</span> Full catalog access</li>
                    <li class="feat-disabled"><span class="feat-icon no">✕</span> Early chapter access</li>
                    <li class="feat-disabled"><span class="feat-icon no">✕</span> Ink Box perks</li>
                </ul>
                <button class="tier-cta" id="pm-cta-free" onclick="pmConfirmPlan('free','Yomite Free','$0/mo')">Get Started Free</button>
            </div>
            <div class="tier-card featured" id="pm-card-student">
                <div class="tier-popular-badge">Most Popular</div>
                <div class="tier-name">Yomite Student</div>
                <div class="tier-price">
                    <span class="tier-price-amount">$4.99</span>
                    <span class="tier-price-period">/ month</span>
                </div>
                <p class="tier-tagline">Full access for readers who want more without breaking the budget.</p>
                <hr class="tier-divider">
                <ul class="tier-features">
                    <li><span class="feat-icon yes">✦</span> Full catalog — manga &amp; light novels</li>
                    <li><span class="feat-icon yes">✦</span> 1 device (switchable monthly)</li>
                    <li><span class="feat-icon yes">✦</span> No ads — ever</li>
                    <li><span class="feat-icon yes">✦</span> Early chapter access</li>
                    <li><span class="feat-icon yes">✦</span> Ink Box: early releases</li>
                    <li class="feat-disabled"><span class="feat-icon no">✕</span> Studio events &amp; author Q&amp;As</li>
                </ul>
                <button class="tier-cta cta-primary" id="pm-cta-student" onclick="pmConfirmPlan('student','Yomite Student','$4.99/mo')">Subscribe — $4.99/mo</button>
            </div>
            <div class="tier-card" id="pm-card-regular">
                <div class="tier-name">Yomite Regular</div>
                <div class="tier-price">
                    <span class="tier-price-amount">$9.99</span>
                    <span class="tier-price-period">/ month</span>
                </div>
                <p class="tier-tagline">Everything Yomite has — for the reader who's all-in.</p>
                <hr class="tier-divider">
                <ul class="tier-features">
                    <li><span class="feat-icon yes">✦</span> Full catalog — manga &amp; light novels</li>
                    <li><span class="feat-icon yes">✦</span> Up to 3 devices</li>
                    <li><span class="feat-icon yes">✦</span> No ads — ever</li>
                    <li><span class="feat-icon yes">✦</span> Early chapter access</li>
                    <li><span class="feat-icon yes">✦</span> Ink Box: early releases</li>
                    <li><span class="feat-icon yes">✦</span> Studio events &amp; author Q&amp;As</li>
                </ul>
                <button class="tier-cta" id="pm-cta-regular" onclick="pmConfirmPlan('regular','Yomite Regular','$9.99/mo')">Subscribe — $9.99/mo</button>
            </div>
        </div>
        <div class="pm-payment-step" id="pm-payment-step" style="display:none;">
            <button class="sub-modal-back" onclick="pmGoToTiers()">← Back to plans</button>
            <h3 class="sub-modal-pay-title">Payment Details</h3>
            <p class="sub-modal-pay-sub">Billed <strong id="pm-pay-label"></strong> · Cancel anytime.</p>
            <div id="pm-pay-error" class="sub-pay-error" style="display:none;"></div>
            <div class="sub-pay-field">
                <label class="sub-pay-label">Cardholder Name</label>
                <input class="sub-pay-input" id="pm-pay-name" type="text" placeholder="Name on card" autocomplete="cc-name">
            </div>
            <div class="sub-pay-field">
                <label class="sub-pay-label">Card Number</label>
                <div class="sub-pay-card-wrap">
                    <input class="sub-pay-input" id="pm-pay-card" type="text" placeholder="0000 0000 0000 0000" maxlength="19" autocomplete="cc-number">
                    <span class="sub-pay-card-icons">
                        <svg viewBox="0 0 38 24" width="32"><rect width="38" height="24" rx="4" fill="#1a1f71"/><rect y="7" width="38" height="6" fill="#f7a600"/></svg>
                        <svg viewBox="0 0 38 24" width="32"><rect width="38" height="24" rx="4" fill="#fff" stroke="#e0e0e0"/><circle cx="15" cy="12" r="7" fill="#eb001b"/><circle cx="23" cy="12" r="7" fill="#f79e1b"/><path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#ff5f00"/></svg>
                    </span>
                </div>
            </div>
            <div class="sub-pay-row">
                <div class="sub-pay-field">
                    <label class="sub-pay-label">Expiry</label>
                    <input class="sub-pay-input" id="pm-pay-expiry" type="text" placeholder="MM/YY" maxlength="5" autocomplete="cc-exp">
                </div>
                <div class="sub-pay-field">
                    <label class="sub-pay-label">CVV</label>
                    <input class="sub-pay-input" id="pm-pay-cvv" type="text" placeholder="•••" maxlength="4" autocomplete="cc-csc">
                </div>
            </div>
            <button class="sub-pay-confirm" id="pm-pay-confirm-btn" onclick="pmExecuteChange()">
                Subscribe — <span id="pm-pay-btn-price"></span>
            </button>
            <p class="sub-pay-disclaimer">🔒 Demo only. No real payment is processed.</p>
        </div>
    </div>
</div>

<script>
var _pmCurrentPlan='free',_pmPending=null;
function openPassModal(){
  document.getElementById('pass-modal-overlay').style.display='flex';
  document.body.style.overflow='hidden';
  pmGoToTiers(); pmLoadPlan();
}
function closePassModal(){
  document.getElementById('pass-modal-overlay').style.display='none';
  document.body.style.overflow='';
  _pmPending=null;
}
function pmLoadPlan(){
  fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/subscription-get.php')
  .then(function(r){return r.json();})
  .then(function(d){
    if(!d.success)return;
    _pmCurrentPlan=d.subscription.plan_slug;
    var n=document.getElementById('pm-banner-name');
    var b=document.getElementById('pm-current-banner');
    if(n) n.textContent=d.subscription.name;
    if(b) b.style.display='flex';
    pmMarkActive(_pmCurrentPlan);
  }).catch(function(){});
}
function pmMarkActive(slug){
  ['free','student','regular'].forEach(function(s){
    var card=document.getElementById('pm-card-'+s);
    var btn=document.getElementById('pm-cta-'+s);
    if(!card||!btn)return;
    card.classList.toggle('active-plan',s===slug);
    btn.disabled=s===slug;
    btn.textContent=s===slug?'✓ Current Plan':s==='free'?'Get Started Free':s==='student'?'Subscribe — $4.99/mo':'Subscribe — $9.99/mo';
  });
}
function pmGoToTiers(){
  var grid=document.querySelector('#pass-modal .tier-grid');
  var step=document.getElementById('pm-payment-step');
  var banner=document.getElementById('pm-current-banner');
  if(grid) grid.style.display='';
  if(step) step.style.display='none';
  if(banner) banner.style.display='none';
  ['pm-pay-name','pm-pay-card','pm-pay-expiry','pm-pay-cvv'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.value='';
  });
}
function pmConfirmPlan(slug,name,price){
  if(slug===_pmCurrentPlan)return;
  _pmPending={slug:slug,name:name,price:price};
  pmExecuteChange();
}
function pmExecuteChange(){
  if(!_pmPending)return;
  var slug=_pmPending.slug,name=_pmPending.name;
  _pmCurrentPlan=slug;
  window._userPlan=slug;
  closePassModal();
  if(typeof showToast==='function') showToast('Switched to '+name+'!');
  fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/subscription-set.php',{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({plan:slug})
  });
}
(function(){
  var ov=document.getElementById('pass-modal-overlay');
  if(ov) ov.addEventListener('click',function(e){if(e.target===ov) closePassModal();});
  var cb=document.getElementById('pass-modal-close');
  if(cb) cb.addEventListener('click',closePassModal);
  var card=document.getElementById('pm-pay-card');
  if(card) card.addEventListener('input',function(e){
    var v=e.target.value.replace(/\D/g,'').slice(0,16);
    e.target.value=v.match(/.{1,4}/g)?v.match(/.{1,4}/g).join(' '):v;
  });
  var exp=document.getElementById('pm-pay-expiry');
  if(exp) exp.addEventListener('input',function(e){
    var v=e.target.value.replace(/\D/g,'').slice(0,4);
    if(v.length>=3) v=v.slice(0,2)+'/'+v.slice(2);
    e.target.value=v;
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&document.getElementById('pass-modal-overlay').style.display==='flex') closePassModal();
  });
})();
</script>
<!-- ===== LOGOUT CONFIRMATION MODAL ===== -->
<div id="logout-modal-overlay" class="logout-overlay">
  <div class="logout-modal">
    <button class="logout-modal-close" id="logout-modal-close-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <p class="logout-modal-eyebrow">Your session</p>
    <h2 class="logout-modal-title">Leaving so <em>soon?</em></h2>
    <p class="logout-modal-sub">Are you sure you want to log out of Yomite?</p>
    <div class="logout-modal-actions">
      <button class="logout-cancel-btn" id="logout-cancel-btn">Stay</button>
      <a href="/WD3_Project_Sem2_MangaWebsite/Project/app/logout.php" class="logout-confirm-btn">Log Out</a>
    </div>
  </div>
</div>
<style>
.logout-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.logout-modal {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 48px 44px 44px;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 32px 80px rgba(0,0,0,0.18);
  text-align: center;
  animation: logoutSlideIn 0.22s ease;
}
@keyframes logoutSlideIn {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.logout-modal-close {
  position: absolute;
  top: 16px; right: 16px;
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-2);
  color: var(--ink-3);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}
.logout-modal-close:hover { color: var(--ink); border-color: var(--ink-3); }
.logout-modal-eyebrow {
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 10px;
}
.logout-modal-title {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.5px;
  margin: 0 0 10px;
}
.logout-modal-title em {
  font-style: italic;
  color: var(--accent);
}
.logout-modal-sub {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--ink-3);
  margin: 0 0 32px;
}
.logout-modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.logout-cancel-btn {
  padding: 0.65rem 1.6rem;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--bg-2);
  color: var(--ink-2);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.logout-cancel-btn:hover { background: var(--bg-3); color: var(--ink); }
.logout-confirm-btn {
  padding: 0.65rem 1.6rem;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: background 0.15s, transform 0.15s;
}
.logout-confirm-btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
</style>
<script>
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var overlay = document.getElementById("logout-modal-overlay");
    function openModal() { overlay.style.display = "flex"; document.body.style.overflow = "hidden"; }
    function closeModal() { overlay.style.display = "none"; document.body.style.overflow = ""; }
    document.querySelectorAll("a.nav-logout-icon").forEach(function(a){
      a.addEventListener("click", function(e){ e.preventDefault(); openModal(); });
    });
    document.getElementById("logout-cancel-btn").addEventListener("click", closeModal);
    document.getElementById("logout-modal-close-btn").addEventListener("click", closeModal);
    overlay.addEventListener("click", function(e){ if(e.target === overlay) closeModal(); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeModal(); });
  });
})();
</script>


</body>
</html>