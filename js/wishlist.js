// Wishlist page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadWishlistPage();
});

function loadWishlistPage() {
    const wishlist = JSON.parse(localStorage.getItem('yomite-wishlist') || '[]');
    const grid = document.getElementById('wishlist-grid');
    const empty = document.getElementById('wishlist-empty');
    const count = document.getElementById('wishlist-count');
    const clearBtn = document.getElementById('clear-wishlist-btn');
    const badge = document.getElementById('wishlist-badge');

    updateWishlistUI(wishlist, grid, empty, count, clearBtn, badge);
    
    // Clear wishlist
    clearBtn.addEventListener('click', function() {
        if (confirm('Clear entire wishlist? This cannot be undone.')) {
            localStorage.removeItem('yomite-wishlist');
            loadWishlistPage();
            showToast('Wishlist cleared');
        }
    });
}

function updateWishlistUI(wishlist, grid, empty, count, clearBtn, badge) {
    const countEl = document.getElementById('wishlist-count');
    const badgeEl = document.getElementById('wishlist-badge');

    if (wishlist.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        clearBtn.style.display = 'none';
        count.textContent = ' (0 items)';
        badgeEl.style.display = 'none';
        return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';
    clearBtn.style.display = 'inline-flex';
    count.textContent = ` (${wishlist.length} items)`;
    badgeEl.textContent = wishlist.length;
    badgeEl.style.display = 'inline-flex';

    // Populate grid
    grid.innerHTML = wishlist.map(item => createWishlistCard(item)).join('');
}

function createWishlistCard(book) {
    const price = getFormattedPrice(book.price);
    return `
        <div class="wishlist-card" data-book-id="${book.id}">
            <div class="wishlist-card-image">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
            </div>
            <div class="wishlist-card-body">
                <div class="wishlist-card-series">${book.series}</div>
                <h3 class="wishlist-card-title">
                    <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${book.id}">${book.title}</a>
                </h3>
                <div class="wishlist-card-author">${book.author}</div>
                <div class="wishlist-card-actions">
                    <div class="wishlist-card-price">${price}</div>
                    <button class="btn-dark" onclick="addToCart(${book.id})">Add to Cart</button>
                    <button class="btn-buy-now" onclick="buyNow(${book.id}, ${book.price})">Buy Now</button>
                    <button class="wish-btn wishlisted" onclick="removeFromWishlist(${book.id})" title="Remove from wishlist">♡</button>
                </div>
            </div>
        </div>
    `;
}

// Update badge on page load
document.addEventListener('DOMContentLoaded', function() {
    const wishlist = JSON.parse(localStorage.getItem('yomite-wishlist') || '[]');
    const badge = document.getElementById('wishlist-badge');
    if (badge && wishlist.length > 0) {
        badge.textContent = wishlist.length;
        badge.style.display = 'inline-flex';
    }
});

// Include other shared functions (addToCart, buyNow, etc.) from index.js
// [Copy relevant functions from your existing index.js]