// ==================== THEME ====================
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('yomite-theme', theme);
  document.querySelectorAll('.sp-theme-card').forEach(c =>
    c.classList.toggle('selected', c.dataset.themeTarget === theme));
}
applyTheme(localStorage.getItem('yomite-theme') || 'light');

// ==================== CURRENCY ====================
function applyCurrency(code) {
  saveCurrency(code);
  document.querySelectorAll('.sp-currency-btn').forEach(b =>
    b.classList.toggle('selected', b.dataset.currency === code));
  refreshAllPrices();
  window.dispatchEvent(new Event('currency-changed'));
}

function refreshAllPrices() {
  document.querySelectorAll('[data-price-usd]').forEach(el => {
    el.textContent = formatPrice(parseFloat(el.dataset.priceUsd));
  });
  if (document.getElementById('wishlist-popup')?.classList.contains('open')) renderWishlist();
}

// ==================== NAV SCROLL ====================
window.addEventListener('scroll', () =>
  document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 10));

// ==================== TOAST ====================
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ==================== SETTINGS ====================
// NOTE: HTML uses id="settings-drawer" (the panel) and id="settings-overlay"
function openPanel() {
  closeLibraryPanel();
  closeWishlist();
  document.getElementById('settings-drawer').classList.add('open');
  document.getElementById('settings-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchPlanBadge();
}
function closePanel() {
  document.getElementById('settings-drawer')?.classList.remove('open');
  document.getElementById('settings-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ==================== PLAN BADGE ====================
const PLAN_LABELS = { free: 'Yomite Free', student: 'Yomite Student', regular: 'Yomite Regular' };
async function fetchPlanBadge() {
  const badge = document.getElementById('sp-plan-badge');
  if (!badge) return;
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/subscription-get.php');
    const data = await res.json();
    if (data.success) {
      const slug = data.subscription.plan_slug;
      badge.textContent = PLAN_LABELS[slug] || slug;
      badge.dataset.plan = slug;
      window._userPlan = slug;
      document.documentElement.dataset.plan = slug;
      highlightDrawerPlan(slug);
    }
  } catch(e) { badge.textContent = 'Free'; }
}

function highlightDrawerPlan(slug) {
  document.querySelectorAll('.sp-plan-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.plan === slug);
  });
}

function drawerSwitchPlan(slug) {
  const BASE = '/WD3_Project_Sem2_MangaWebsite/Project';
  window._userPlan = slug;
  document.documentElement.dataset.plan = slug;
  const badge = document.getElementById('sp-plan-badge');
  if (badge) { badge.textContent = PLAN_LABELS[slug] || slug; badge.dataset.plan = slug; }
  highlightDrawerPlan(slug);
  showToast(`Plan updated to ${PLAN_LABELS[slug]}`);
  if (typeof markActivePlan === 'function') markActivePlan(slug);
  fetch(`${BASE}/app/subscription-set.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ plan: slug })
  });
}


// ==================== CART ====================
async function addToCart(bookId, format = 'paperback') {
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-add.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ book_id: bookId, format: format })
    });
    const data = await res.json();
    if (data.success) {
      updateCartBadge();
      window.location.href = '/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php';
    } else {
      showToast(data.error || 'Could not add to cart.');
    }
  } catch(e) { showToast('Network error.'); console.error(e); }
}

async function updateCartBadge() {
  try {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-get.php');
    const data = await res.json();
    if (!data.success) return;
    badge.textContent   = data.count;
    badge.style.display = data.count > 0 ? 'inline-flex' : 'none';
  } catch(e) {}
}

// ==================== BUY NOW (direct purchase) ====================
function buyNow(bookId, priceUsd) {
  const book  = (typeof getBookById === 'function') ? getBookById(bookId) : null;
  const title = book ? book.title : 'this book';
  const cover = book ? book.cover_img : '';
  const price = formatPrice(priceUsd || (book ? book.price_usd : 0));

  document.getElementById('buy-now-cover').src          = cover;
  document.getElementById('buy-now-cover').style.display = cover ? '' : 'none';
  document.getElementById('buy-now-title').textContent   = title;
  document.getElementById('buy-now-price').textContent   = price;
  document.getElementById('buy-now-confirm').onclick     = () => executeBuyNow(bookId);

  document.getElementById('buy-now-overlay').classList.add('open');
  document.getElementById('buy-now-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBuyNowModal() {
  document.getElementById('buy-now-overlay').classList.remove('open');
  document.getElementById('buy-now-modal').classList.remove('open');
  document.body.style.overflow = '';
}

async function executeBuyNow(bookId) {
  const btn = document.getElementById('buy-now-confirm');
  btn.disabled    = true;
  btn.textContent = 'Processing…';
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/buy-now.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ book_id: bookId })
    });
    const data = await res.json();
    closeBuyNowModal();
    if (data.success)                    showToast('🎉 Purchase successful! Added to your Library.');
    else if (data.error === 'already_owned') showToast('You already own this book.');
    else if (data.error === 'Not logged in.') showToast('Please log in to purchase.');
    else                                 showToast(data.error || 'Purchase failed. Try again.');
  } catch(e) {
    closeBuyNowModal();
    showToast('Network error. Please try again.');
    console.error(e);
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Confirm Purchase';
  }
}

// ==================== LIBRARY ====================
// ==================== LIBRARY (FULL-PAGE) ====================
let _libAllBooks = [];
let _libActiveGenre = 'all';

function openLibraryPanel() {
  closePanel();
  closeWishlist();
  document.getElementById('library-popup').classList.add('open');
  document.getElementById('library-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchOwnedLibrary();
}
function closeLibraryPanel() {
  document.getElementById('library-popup')?.classList.remove('open');
  document.getElementById('library-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

async function fetchOwnedLibrary() {
  const body = document.getElementById('library-body');
  if (!body) return;
  body.innerHTML = '<div class="library-loading"><div class="lib-spinner"></div><span>Loading your books…</span></div>';
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/owned-get.php');
    const data = await res.json();
    if (!data.success) { body.innerHTML = '<div class="library-empty-state"><p>Could not load your library.</p></div>'; return; }
    _libAllBooks = data.books || [];
    buildGenrePills(_libAllBooks);
    filterLibrary();
  } catch(e) {
    body.innerHTML = '<div class="library-empty-state"><p>Something went wrong loading your library.</p></div>';
    console.error(e);
  }
}

function buildGenrePills(books) {
  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();
  const wrap = document.getElementById('lib-genre-pills');
  if (!wrap) return;
  wrap.innerHTML = `<button class="lib-genre-pill active" data-genre="all" onclick="setGenreFilter(this,'all')">All</button>`;
  genres.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'lib-genre-pill';
    btn.dataset.genre = g;
    btn.textContent = g;
    btn.onclick = () => setGenreFilter(btn, g);
    wrap.appendChild(btn);
  });
}

function setGenreFilter(btn, genre) {
  _libActiveGenre = genre;
  document.querySelectorAll('.lib-genre-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  filterLibrary();
}

function filterLibrary() {
  const q     = (document.getElementById('lib-search')?.value || '').toLowerCase();
  const sort  = document.getElementById('lib-sort')?.value || 'recent';
  let books   = _libAllBooks.filter(b => {
    if (_libActiveGenre !== 'all' && b.genre !== _libActiveGenre) return false;
    if (q && !b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) return false;
    return true;
  });
  if (sort === 'title')  books.sort((a,b) => a.title.localeCompare(b.title));
  if (sort === 'author') books.sort((a,b) => a.author.localeCompare(b.author));
  if (sort === 'genre')  books.sort((a,b) => (a.genre||'').localeCompare(b.genre||''));
  // 'recent' keeps server order (DESC by purchased_at)

  const sub = document.getElementById('lib-subtitle');
  if (sub) sub.textContent = books.length === 1 ? '1 book' : `${books.length} book${books.length === 0 ? 's' : 's'}`;

  const body = document.getElementById('library-body');
  if (!body) return;
  if (books.length === 0) {
    body.innerHTML = _libAllBooks.length === 0
      ? `<div class="library-empty-state">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.25;margin-bottom:1rem;">
             <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
           </svg>
           <p style="font-size:1.05rem;font-weight:700;margin-bottom:0.4rem;">Your library is empty</p>
           <p style="color:var(--ink-3);font-size:0.88rem;">Books you purchase will appear here, ready to read anytime.</p>
         </div>`
      : `<div class="library-empty-state"><p>No books match your search.</p></div>`;
    return;
  }
  body.innerHTML = books.map(b => renderLibraryCard(b)).join('');
}

function renderLibraryCard(b) {
  const purchasedDate = b.purchased_at ? new Date(b.purchased_at).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : '';
  return `
    <div class="lib-card" id="lib-card-${b.id}">
      <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}" class="lib-card-cover-wrap">
        <img class="lib-card-cover" src="${b.cover_img}" alt="${b.title}" loading="lazy">
        <div class="lib-card-hover-read">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Read
        </div>
      </a>
      <div class="lib-card-body">
        <div class="lib-card-genre">${b.genre || 'Book'}</div>
        <div class="lib-card-title" title="${b.title}">${b.title}</div>
        <div class="lib-card-author">${b.author}</div>
        ${purchasedDate ? `<div class="lib-card-date">Acquired ${purchasedDate}</div>` : ''}
        <div class="lib-card-actions">
          <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/reader.php?id=${b.id}" class="lib-btn-read">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Read
          </a>
          <button class="lib-btn-remove" onclick="removeFromLibrary(${b.id})" title="Remove from library">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
}

async function removeFromLibrary(bookId) {
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/library-remove.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: bookId })
    });
    const data = await res.json();
    if (data.success) {
      _libAllBooks = _libAllBooks.filter(b => b.id !== bookId);
      filterLibrary();
      showToast('Removed from library.');
    }
  } catch(e) { console.error(e); }
}

// ==================== WISHLIST ====================
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('yomite-wishlist') || '[]'); }
  catch(e) { return []; }
}
function saveWishlist(list) {
  localStorage.setItem('yomite-wishlist', JSON.stringify(list));
}

function toggleWishlist(bookId) {
  bookId = parseInt(bookId);
  let wl = getWishlist();
  const idx = wl.indexOf(bookId);
  if (idx === -1) { wl.push(bookId); showToast('✓ Added to Wishlist!'); }
  else            { wl.splice(idx, 1); showToast('Removed from Wishlist.'); }
  saveWishlist(wl);
  syncWishlistButtons();
  if (document.getElementById('wishlist-popup')?.classList.contains('open')) renderWishlist();
}

function syncWishlistButtons() {
  const wl = getWishlist();
  document.querySelectorAll('.wish-btn[data-book-id]').forEach(btn => {
    const wished = wl.includes(parseInt(btn.dataset.bookId));
    btn.textContent = wished ? 'Remove from Wishlist' : 'Add to Wishlist';
    btn.classList.toggle('wishlisted', wished);
  });
}

function openWishlist() {
  const popup = document.getElementById('wishlist-popup');
  if (!popup) return;
  closePanel();
  closeLibraryPanel();
  popup.classList.add('open');
  document.getElementById('wishlist-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderWishlist();
}
function closeWishlist() {
  document.getElementById('wishlist-popup')?.classList.remove('open');
  document.getElementById('wishlist-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderWishlist() {
  const body      = document.getElementById('wishlist-body');
  const subtitle  = document.getElementById('wishlist-subtitle');
  const clearBtn  = document.getElementById('clear-wishlist-btn');
  if (!body) return;

  const wl = getWishlist();

  // Update badge
  const badge = document.getElementById('wishlist-badge');
  if (badge) { badge.textContent = wl.length; badge.style.display = wl.length > 0 ? 'inline-flex' : 'none'; }

  if (wl.length === 0) {
    if (clearBtn) clearBtn.style.display = 'none';
    if (subtitle) subtitle.textContent = 'Your saved books';
    body.innerHTML = `
      <div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:5rem 0;color:var(--ink-3);">
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <div style="font-weight:700;font-size:1rem;color:var(--ink);">Your wishlist is empty</div>
        <div style="font-size:0.85rem;text-align:center;max-width:280px;">Browse the collection and save titles you're interested in.</div>
      </div>`;
    return;
  }

  if (clearBtn) clearBtn.style.display = 'inline-flex';
  const n = wl.length;
  if (subtitle) subtitle.textContent = n === 1 ? '1 item saved' : `${n} items saved`;

  const query = (document.getElementById('wishlist-search')?.value || '').toLowerCase();
  const sort  = document.getElementById('wishlist-sort')?.value || 'recent';

  let books = wl.map(id => getBookById(id)).filter(Boolean);
  if (query) books = books.filter(b =>
    b.title?.toLowerCase().includes(query) ||
    b.author?.toLowerCase().includes(query) ||
    b.genre?.toLowerCase().includes(query));
  if (sort === 'title')  books.sort((a, b) => (a.title||'').localeCompare(b.title||''));
  if (sort === 'author') books.sort((a, b) => (a.author||'').localeCompare(b.author||''));
  if (sort === 'price')  books.sort((a, b) => (a.price_usd||0) - (b.price_usd||0));

  if (books.length === 0) {
    body.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--ink-3);font-size:0.9rem;">No results match your search.</div>`;
    return;
  }

  body.innerHTML = books.map(b => {
    const price = b.soldOut ? 'Sold Out' : (isRegular() ? formatPrice(b.price_usd) : null);
    return `
      <div class="lib-card">
        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}" class="lib-card-cover-wrap">
          <img class="lib-card-cover" src="${b.cover_img}" alt="${b.title}" loading="lazy">
        </a>
        <div class="lib-card-body">
          <div class="lib-card-genre">${b.genre || ''}</div>
          <div class="lib-card-title" title="${b.title}">${b.title}</div>
          <div class="lib-card-author">${b.author || ''}</div>
          ${price ? `<div class="lib-card-date" style="font-weight:700;color:var(--ink);font-size:0.8rem;margin-top:0.2rem;">${price}</div>` : ''}
          <div class="lib-card-actions">
            ${!b.soldOut && isRegular() ? `<button class="lib-btn-read" onclick="addToCart(${b.id})">Add to Cart</button>` : ''}
            <button class="lib-btn-remove" onclick="toggleWishlist(${b.id})" title="Remove from wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ==================== DOM READY ====================
document.addEventListener('DOMContentLoaded', () => {
  // Safety: clear any stale scroll lock on every page load
  document.body.style.overflow = '';

  // Settings panel — check actual ID in DOM
  const settingsPanel = document.getElementById('settings-drawer');

  document.getElementById('settings-drawer-trigger')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    settingsPanel?.classList.contains('open') ? closePanel() : openPanel();
  });
  document.getElementById('drawer-close')?.addEventListener('click', closePanel);
  document.getElementById('settings-overlay')?.addEventListener('click', closePanel);

  // Theme
  document.querySelectorAll('.sp-theme-card').forEach(c =>
    c.addEventListener('click', () => applyTheme(c.dataset.themeTarget)));

  // Currency
  document.querySelectorAll('.sp-currency-btn').forEach(b =>
    b.addEventListener('click', () => applyCurrency(b.dataset.currency)));
  document.querySelectorAll('.sp-currency-btn').forEach(b =>
    b.classList.toggle('selected', b.dataset.currency === getSavedCurrency()));

  // Nav buttons
  document.getElementById('library-btn')?.addEventListener('click', e => { e.preventDefault(); openLibraryPanel(); });
  document.getElementById('wishlist-btn')?.addEventListener('click', e => { e.preventDefault(); openWishlist(); });

  document.getElementById('clear-wishlist-btn')?.addEventListener('click', () => {
    if (confirm('Clear entire wishlist? This cannot be undone.')) {
      saveWishlist([]);
      renderWishlist();
    }
  });

  // Overlay clicks
  document.getElementById('library-overlay')?.addEventListener('click', closeLibraryPanel);
  document.getElementById('wishlist-overlay')?.addEventListener('click', closeWishlist);

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePanel(); closeLibraryPanel(); closeWishlist(); }
  });

  // Init
  refreshAllPrices();
  updateCartBadge();
  syncWishlistButtons();

  // ==================== SEARCH ====================
  const input    = document.getElementById('search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  const srchOverlay = document.createElement('div');
  srchOverlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);backdrop-filter:blur(4px);z-index:9;opacity:0;pointer-events:none;transition:opacity 0.2s ease;';
  document.body.appendChild(srchOverlay);

  function highlight(text, q) {
    if (!q) return text;
    return text.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi'),
      '<span style="color:#c0392b;font-weight:700;">$1</span>');
  }
  function openDD() {
    dropdown.style.display = 'block';
    srchOverlay.style.display = 'block';
    srchOverlay.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
      dropdown.style.opacity = '1';
      dropdown.style.transform = 'translateY(0)';
      srchOverlay.style.opacity = '1';
    });
  }
  function closeDD() {
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-6px)';
    srchOverlay.style.opacity = '0';
    srchOverlay.style.pointerEvents = 'none';
    setTimeout(() => { dropdown.style.display = 'none'; srchOverlay.style.display = 'none'; }, 200);
    input.value = '';
  }
  function render() {
    const q = input.value.trim();
    if (!q) { closeDD(); return; }
    const results = BOOKS.filter(b =>
      b.title.toLowerCase().includes(q.toLowerCase()) ||
      b.author.toLowerCase().includes(q.toLowerCase()) ||
      b.genre.toLowerCase().includes(q.toLowerCase())
    );
    dropdown.innerHTML = results.length === 0
      ? `<div style="padding:18px;color:var(--ink-3);text-align:center;">No results for <em>"${q}"</em></div>`
      : results.map(b => `
          <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}" style="display:flex;align-items:center;gap:16px;padding:14px 18px;border-bottom:1px solid var(--border);cursor:pointer;text-decoration:none;" onmouseover="this.style.background='var(--bg-2)'" onmouseout="this.style.background=''">
            <img src="${b.cover_img}" style="width:60px;height:84px;object-fit:cover;border-radius:5px;flex-shrink:0;border:1px solid var(--border);">
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.95rem;font-weight:700;color:var(--ink);margin-bottom:3px;">${highlight(b.title, q)}</div>
              <div style="font-size:0.82rem;color:var(--ink-3);">${highlight(b.author, q)} · ${b.genre}</div>
            </div>
            <div style="font-size:0.88rem;font-weight:700;color:var(--ink);flex-shrink:0;">${isRegular() ? (b.soldOut ? 'Sold Out' : formatPrice(b.price_usd)) : '<span style="font-size:0.72rem;color:var(--ink-3);font-style:italic;font-weight:500;">🔒 Regular</span>'}</div>
          </a>`).join('');
    openDD();
  }
  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  document.addEventListener('click', e => { if (!e.target.closest('#hero-search')) closeDD(); });
  srchOverlay.addEventListener('click', closeDD);

  document.getElementById('buy-now-overlay')?.addEventListener('click', closeBuyNowModal);
  document.getElementById('buy-now-cancel')?.addEventListener('click', closeBuyNowModal);
});

// renderLibraryItem is now handled by renderLibraryCard() in the library section above
// ==================== PLAN-AWARE STOREFRONT ====================
// Fetches the user's subscription plan once on load, then reveals
// prices, Buy Now buttons, and Collector's Edition content ONLY
// for Yomite Regular (highest tier) subscribers.

window._userPlan = null; // cached after first fetch

async function fetchUserPlan() {
  try {
    const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/subscription-get.php');
    const data = await res.json();
    window._userPlan = data.success ? (data.subscription.plan_slug || 'free') : 'free';
  } catch(e) { window._userPlan = 'free'; }
  return window._userPlan;
}

function isRegular() { return window._userPlan === 'regular'; }

/**
 * Renders the price slot for a book.
 * All logged-in users can add to cart.
 */
function renderPriceSlot(slotEl, book) {
  if (!book) { slotEl.innerHTML = ''; return; }

  const formats = book.formats || [];
  const ceFormat = formats.find(f => f.type === 'collectors');

  const editionPills = formats.map(f => {
    const price = formatPrice(f.price_usd);
    return `<button class="edition-pill edition-pill--${f.type}" onclick="addToCart(${book.id}, '${f.type}')" title="${f.note || f.label}">
      <span class="edition-pill-label">${f.label}</span>
      <span class="edition-pill-price">${price}</span>
    </button>`;
  }).join('');

  slotEl.innerHTML = `
    <div class="slot-free-row">
      ${ceFormat ? `<span class="ce-badge">✦ Collector's Ed.</span>` : ''}
    </div>
    <div class="slot-editions-wrap">${editionPills}</div>`;
}

/**
 * Renders the featured hero price slot.
 */
function renderFeaturedSlot(plan) {
  const slot = document.querySelector('.featured-price-slot');
  if (!slot) return;
  const book = (typeof getBookById === 'function') ? getBookById(9) : null;
  if (!book) return;

  const hc = (book.formats || []).find(f => f.type === 'hardcover');
  const price = hc ? formatPrice(hc.price_usd) : formatPrice(book.price_usd);
  slot.innerHTML = `<button class="btn-buy-now" onclick="addToCart(9, 'hardcover')">Own it · ${price}</button>`;
}

/**
 * Main initialiser — called once DOM is ready.
 * Populates every .product-price-slot on the page.
 */
async function initStorefrontAccess() {
  const plan = await fetchUserPlan();

  // Product grid slots
  document.querySelectorAll('.product-price-slot[data-book-id]').forEach(slot => {
    const id   = parseInt(slot.dataset.bookId);
    const book = (typeof getBookById === 'function') ? getBookById(id) : null;
    renderPriceSlot(slot, book);
  });

  // Featured section slot
  renderFeaturedSlot(plan);

  // Search dropdown — patch price display
  // (search re-renders on each keystroke; we intercept formatPrice via override)
}

// Override search result price display based on plan
const _origFormatPrice = typeof formatPrice === 'function' ? formatPrice : null;
// We don't override formatPrice globally; instead we patch the search render
// function inside the DOMContentLoaded block via a data attribute on results.

// Hook into existing DOMContentLoaded — safe to call initStorefrontAccess after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initStorefrontAccess();
});
// ==================== NOTEWORTHY THURSDAY COUNTDOWN ====================
(function () {
  function pad(n) { return String(n).padStart(2, '0'); }

  function ntTick() {
    const hEl = document.getElementById('nt-h');
    const mEl = document.getElementById('nt-m');
    const sEl = document.getElementById('nt-s');
    if (!hEl) return;

    const now = new Date();
    const next = new Date(now);
    // Find next Thursday (day 4)
    const daysUntil = (4 - now.getDay() + 7) % 7 || 7;
    next.setDate(now.getDate() + daysUntil);
    next.setHours(0, 0, 0, 0);

    const diff = Math.max(0, next - now);
    const totalHours = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    hEl.textContent = pad(totalHours);
    mEl.textContent = pad(m);
    sEl.textContent = pad(s);
  }

  // Apply currency formatting to NT sale prices
  function ntApplyCurrency() {
    if (typeof formatPrice !== 'function') return;
    document.querySelectorAll('.nt-price-sale, .nt-price-orig').forEach(el => {
      const base = parseFloat(el.dataset.base);
      if (!isNaN(base)) el.textContent = formatPrice(base);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    ntTick();
    setInterval(ntTick, 1000);
    ntApplyCurrency();
  });
})();
// ==================== SEARCH + FILTER BAR ====================
(function () {
  const BASE = '/WD3_Project_Sem2_MangaWebsite/Project';

  document.addEventListener('DOMContentLoaded', () => {
    const input      = document.getElementById('sfbar-input');
    const dropdown   = document.getElementById('sfbar-dropdown');
    const chips      = document.querySelectorAll('.sfbar-chip');
    const cards      = document.querySelectorAll('.product-card[data-genres]');
    let activeGenre  = 'all';

    // ---- Search suggestions ----
    function renderDropdown() {
      const q = input.value.trim().toLowerCase();
      if (!q) { closeDropdown(); return; }

      const results = BOOKS.filter(b =>
        b.title.toLowerCase().includes(q) && b.cover_img
      ).slice(0, 6);

      if (!results.length) {
        dropdown.innerHTML = `<div class="sfbar-no-results">No titles found for <em>"${input.value.trim()}"</em></div>`;
      } else {
        dropdown.innerHTML = results.map(b => `
          <a href="${BASE}/pages/book.php?id=${b.id}" class="sfbar-suggestion">
            <img src="${b.cover_img}" alt="${b.title}" class="sfbar-sug-img">
            <div class="sfbar-sug-info">
              <span class="sfbar-sug-title">${highlight(b.title, q)}</span>
              <span class="sfbar-sug-meta">${b.author} · ${b.genre}</span>
            </div>
          </a>`).join('');
      }
      dropdown.classList.add('open');
    }

    function highlight(text, q) {
      return text.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'),
        '<mark>$1</mark>');
    }

    function closeDropdown() {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
    }

    input.addEventListener('input', renderDropdown);
    input.addEventListener('focus', renderDropdown);
    document.addEventListener('click', e => {
      if (!e.target.closest('#sfbar-search-wrap')) closeDropdown();
    });

    // ---- Genre filter ----
    function applyFilter() {
      cards.forEach(card => {
        const cardGenres = card.dataset.genres.split(',').map(g => g.trim());
        const show = activeGenre === 'all' || cardGenres.includes(activeGenre);
        card.style.display = show ? '' : 'none';
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeGenre = chip.dataset.genre;
        applyFilter();
      });
    });
  });
})();