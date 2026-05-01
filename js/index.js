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
  }
  function closePanel() {
    document.getElementById('settings-drawer')?.classList.remove('open');
    document.getElementById('settings-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  // ==================== CART ====================
  async function addToCart(bookId) {
    try {
      const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/cart-add.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ book_id: bookId })
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
    try {
      const res  = await fetch('/WD3_Project_Sem2_MangaWebsite/Project/app/owned-get.php');
      const data = await res.json();
      const body = document.getElementById('library-body');
      if (!body || !data.success) return;
      body.innerHTML = data.books.length === 0
        ? '<div class="popup-empty">Your library is empty.<br><span style="font-size:0.82rem;color:var(--ink-3);">Purchase books from your cart to add them here.</span></div>'
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
    const body = document.getElementById('wishlist-body');
    if (!body) return;
    const wl = getWishlist();
    if (wl.length === 0) {
      body.innerHTML = '<div class="popup-empty">Your wishlist is empty.<br><span style="font-size:0.85rem;color:var(--ink-3);">Click "Add to Wishlist" on any book to save it here.</span></div>';
      return;
    }
    body.innerHTML = wl.map(id => {
      const b = getBookById(id);
      if (!b) return '';
      const price = b.soldOut ? 'Sold Out' : formatPrice(b.price_usd);
      return `
        <div class="wishlist-item">
          <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${b.id}">
            <img class="wishlist-item-img" src="${b.cover_img}" alt="${b.title}">
          </a>
          <div class="wishlist-item-info">
            <div class="wishlist-item-title">${b.title}</div>
            <div class="wishlist-item-meta">${b.author} · ${b.genre}</div>
            <div class="wishlist-item-price">${price}</div>
          </div>
          <div class="wishlist-item-actions">
            ${!b.soldOut ? `<button class="wishlist-add-btn" onclick="addToCart(${b.id})">Add to Cart</button>` : ''}
            <button class="wishlist-remove-btn" onclick="toggleWishlist(${b.id})">Remove</button>
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
              <div style="font-size:0.88rem;font-weight:700;color:var(--ink);flex-shrink:0;">${b.soldOut ? 'Sold Out' : formatPrice(b.price_usd)}</div>
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

  // In your library popup code, add "Read" button:
function renderLibraryItem(book) {
    return `
      <div class="library-item">
        <img src="${book.cover}" class="library-item-img" alt="${book.title}">
        <div class="library-item-info">
          <div class="library-item-title">${book.title}</div>
          <div class="library-item-meta">${book.author}</div>
          <div class="library-item-owned">Owned ✓</div>
        </div>
        <div>
          <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/reader.php?id=${book.id}" 
             class="btn-dark" style="padding:6px 12px;font-size:0.75rem;">Read</a>
          <button class="library-item-remove" onclick="removeFromLibrary(${book.id})">Remove</button>
        </div>
      </div>
    `;
  }