<?php 
session_start();
?>
<!DOCTYPE html>
<html>
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
                <!-- WISHLIST - Now links to page -->
                <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/wishlist.php" class="nav-pill-btn active-page" id="wishlist-btn" title="Wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Wishlist
                    <span class="wishlist-badge" id="wishlist-badge" style="display:none;">0</span>
                </a>

                <!-- CART -->
                <a href="#" class="nav-pill-btn nav-pill-btn--accent" id="cart-btn" title="My Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Cart
                    <span class="library-badge" id="cart-badge" style="display:none;">0</span>
                </a>

                <!-- LIBRARY -->
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

    <!-- ========== WISHLIST PAGE CONTENT ========== -->
    <div class="wishlist-page">
        <div class="section">
            <div class="section-head">
                <div>
                    <h1 class="section-title">My <em>Wishlist</em></h1>
                    <p class="section-sub">
                        <?php if (isset($_SESSION['first_name'])): ?>
                            <?= htmlspecialchars($_SESSION['first_name']) ?>'s wishlist
                        <?php else: ?>
                            Your wishlist
                        <?php endif; ?>
                        <span class="wishlist-count" id="wishlist-count"> (0 items)</span>
                    </p>
                </div>
                <div class="wishlist-actions">
                    <button class="btn-dark wishlist-clear-btn" id="clear-wishlist-btn" style="display:none;">
                        Clear Wishlist
                    </button>
                    <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="view-all">Continue Shopping →</a>
                </div>
            </div>

            <!-- Empty State -->
            <div class="wishlist-empty" id="wishlist-empty">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </div>
                <h2>Your wishlist is empty</h2>
                <p>Browse our collection and add titles you're interested in. They'll appear here.</p>
                <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="btn-dark">Start Shopping</a>
            </div>

            <!-- Wishlist Items -->
            <div class="wishlist-grid" id="wishlist-grid" style="display:none;">
                <!-- Items populated by JavaScript -->
            </div>
        </div>
    </div>

    <!-- ========== Same modals as before (Cart, Library, Settings) ========== -->
    <!-- [Include all the existing cart-panel, library-popup, settings-panel HTML from index.php] -->
    
    <!-- CART PANEL -->
    <div class="cart-panel" id="cart-popup">
        <!-- [Same cart panel HTML from index.php] -->
        <div class="cart-panel-inner">
            <div class="cart-panel-left">
                <div class="cart-panel-header">
                    <span class="cart-panel-title">My Cart</span>
                    <button class="cart-panel-close" onclick="closeCart()">✕</button>
                </div>
                <div class="cart-panel-items" id="cart-body">
                    <div class="popup-empty">Your cart is empty.</div>
                </div>
            </div>
            <div class="cart-panel-right" id="cart-payment-section" style="display:none;">
                <div class="cart-pay-heading">Checkout</div>
                <div class="cart-pay-total-row">
                    <span class="cart-pay-total-label">Total</span>
                    <span class="cart-pay-total-val" id="cart-total">$0.00</span>
                </div>
                <div id="pay-error" class="pay-error" style="display:none;"></div>
                <form id="pay-form" onsubmit="return false;">
                    <div class="pay-field"><label class="pay-label">Cardholder Name</label><input class="pay-input" id="pay-name" type="text" placeholder="Name on card" autocomplete="cc-name"></div>
                    <div class="pay-field"><label class="pay-label">Card Number</label><input class="pay-input" id="pay-card" type="text" placeholder="0000 0000 0000 0000" maxlength="19" autocomplete="cc-number"></div>
                    <div class="pay-row">
                        <div class="pay-field"><label class="pay-label">Expiry</label><input class="pay-input" id="pay-expiry" type="text" placeholder="MM/YY" maxlength="5" autocomplete="cc-exp"></div>
                        <div class="pay-field"><label class="pay-label">CVV</label><input class="pay-input" id="pay-cvv" type="text" placeholder="•••" maxlength="4" autocomplete="cc-csc"></div>
                    </div>
                    <button class="pay-confirm" id="pay-confirm-btn" onclick="confirmPurchase()">Confirm Purchase</button>
                </form>
                <p class="pay-disclaimer">🔒 Demo only. No real payment is processed.</p>
            </div>
        </div>
    </div>
    <div class="library-overlay" id="cart-overlay"></div>

    <!-- LIBRARY POPUP -->
    <div class="library-popup" id="library-popup">
        <!-- [Same library popup HTML from index.php] -->
    </div>
    <div class="library-overlay" id="library-overlay"></div>

    <!-- SETTINGS PANEL -->
    <div class="settings-panel" id="settings-drawer">
        <!-- [Same settings panel HTML from index.php] -->
    </div>
    <div class="settings-overlay" id="settings-overlay"></div>

    <!-- TOAST -->
    <div class="toast" id="toast"></div>

    <script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
    <script src="/WD3_Project_Sem2_MangaWebsite/Project/js/wishlist.js"></script>
</body>
</html>