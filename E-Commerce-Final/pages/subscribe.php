<?php
    session_start();
    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
        header('Location: /WD3_Project_Sem2_MangaWebsite/Project/pages/login.html');
        exit();
    }
?>
<!DOCTYPE html>
<html data-plan="<?= htmlspecialchars($_SESSION['plan'] ?? 'free') ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yomite: Subscribe</title>
    <link rel="icon" type="image/x-icon" href="/WD3_Project_Sem2_MangaWebsite/Project/images/website-icon.png">
    <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/index.css">
    <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/subscribe.css">
    <script>
        (function() {
            const t = localStorage.getItem('yomite-theme') || 'light';
            document.documentElement.setAttribute('data-theme', t);
        })();
    </script>
</head>
<body>

<!-- ========== NAV ========== -->
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

<!-- ========== SUBSCRIBE PAGE ========== -->
<main class="subscribe-page">
    <div class="subscribe-inner">

        <!-- Header -->
        <div class="subscribe-header">
            <h1>Choose your <em>Yomite Pass.</em></h1>
            <p>Read more, spend less. Pick the plan that fits your reading life.</p>
        </div>

        <!-- Current plan banner -->
        <div class="current-plan-banner" id="current-plan-banner" style="display:none;">
            <span>Your current plan:</span>
            <strong id="banner-plan-name">—</strong>
            <span class="current-plan-badge" id="banner-plan-badge">Active</span>
            <span style="color:var(--ink-3);font-size:0.85rem;" id="banner-renews"></span>
        </div>

        <!-- Tier cards -->
        <div class="tier-grid">

            <!-- FREE -->
            <div class="tier-card" id="card-free">
                <div class="tier-name">Yomite Free</div>
                <div class="tier-price">
                    <span class="tier-price-amount">$0</span>
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
                <button class="tier-cta" id="cta-free" onclick="switchPlan('free', 'Yomite Free')">
                    Get Started Free
                </button>
            </div>

            <!-- STUDENT (featured) -->
            <div class="tier-card featured" id="card-student">
                <div class="tier-popular-badge">Most Popular</div>
                <div class="tier-name">Yomite Student</div>
                <div class="tier-price">
                    <span class="tier-price-amount">$5</span>
                    <span class="tier-price-period">/ month</span>
                </div>
                <p class="tier-tagline">Full access for readers who want more without breaking the budget.</p>
                <hr class="tier-divider">
                <ul class="tier-features">
                    <li><span class="feat-icon yes">✦</span> Full catalog — manga & light novels</li>
                    <li><span class="feat-icon yes">✦</span> 1 device (switchable monthly)</li>
                    <li><span class="feat-icon yes">✦</span> No ads — ever</li>
                    <li><span class="feat-icon yes">✦</span> Early chapter access</li>
                    <li><span class="feat-icon yes">✦</span> Ink Box: early releases</li>
                    <li class="feat-disabled"><span class="feat-icon no">✕</span> Studio events & author Q&As</li>
                </ul>
                <button class="tier-cta cta-primary" id="cta-student" onclick="switchPlan('student', 'Yomite Student')">
                    Subscribe — $5/mo
                </button>
            </div>

            <!-- REGULAR -->
            <div class="tier-card" id="card-regular">
                <div class="tier-name">Yomite Regular</div>
                <div class="tier-price">
                    <span class="tier-price-amount">$10</span>
                    <span class="tier-price-period">/ month</span>
                </div>
                <p class="tier-tagline">Everything Yomite has — for the reader who's all-in.</p>
                <hr class="tier-divider">
                <ul class="tier-features">
                    <li><span class="feat-icon yes">✦</span> Full catalog — manga & light novels</li>
                    <li><span class="feat-icon yes">✦</span> Up to 3 devices</li>
                    <li><span class="feat-icon yes">✦</span> No ads — ever</li>
                    <li><span class="feat-icon yes">✦</span> Early chapter access</li>
                    <li><span class="feat-icon yes">✦</span> Ink Box: early releases</li>
                    <li><span class="feat-icon yes">✦</span> Studio events & author Q&As</li>
                </ul>
                <button class="tier-cta" id="cta-regular" onclick="switchPlan('regular', 'Yomite Regular')">
                    Subscribe — $10/mo
                </button>
            </div>

        </div><!-- /.tier-grid -->

        <!-- Ink Box section -->
        <div class="inkbox-section">
            <h2>★ <span>Ink Box</span> Perks</h2>
            <p>Subscriber benefits inspired by the Patreon model — unlocked automatically with your plan.</p>
            <div class="inkbox-perks">
                <div class="inkbox-perk">
                    <div class="inkbox-perk-icon">📖</div>
                    <div class="inkbox-perk-info">
                        <h4>Early Chapter Access</h4>
                        <p>Read new chapters before they're available to the general public.</p>
                        <div class="inkbox-perk-tier">Student &amp; Regular</div>
                    </div>
                </div>
                <div class="inkbox-perk">
                    <div class="inkbox-perk-icon">🎤</div>
                    <div class="inkbox-perk-info">
                        <h4>Studio Events &amp; Author Q&amp;As</h4>
                        <p>Exclusive access to live events hosted by popular studios and creators.</p>
                        <div class="inkbox-perk-tier">Regular only</div>
                    </div>
                </div>
            </div>
        </div>

    </div><!-- /.subscribe-inner -->
</main>


<!-- ========== LIBRARY PANEL ========== -->
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

<!-- ========== SETTINGS DRAWER ========== -->
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
            <div class="sp-plan-row" id="sp-plan-row">
                <div class="sp-plan-info">
                    <span class="sp-plan-label">Your plan</span>
                    <span class="sp-plan-badge" id="sp-plan-badge">Loading…</span>
                </div>
                <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/subscribe.php" class="sp-plan-manage">Manage →</a>
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

<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/index.js"></script>
<script>
const BASE = '/WD3_Project_Sem2_MangaWebsite/Project';

let _currentPlan  = 'free';
let _pendingPlan  = null;
let _pendingName  = null;
let _pendingPrice = null;

// ── Load current subscription ──
async function loadCurrentPlan() {
    try {
        const res  = await fetch(`${BASE}/app/subscription-get.php`);
        const data = await res.json();
        if (!data.success) return;

        const sub = data.subscription;
        _currentPlan = sub.plan_slug;

        // Banner
        const banner = document.getElementById('current-plan-banner');
        document.getElementById('banner-plan-name').textContent = sub.name;
        if (sub.renews_at) {
            document.getElementById('banner-renews').textContent =
                `· Renews ${new Date(sub.renews_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        banner.style.display = 'flex';

        // Mark active card & disable its button
        markActivePlan(_currentPlan);
    } catch(e) { console.error(e); }
}

function markActivePlan(slug) {
    ['free', 'student', 'regular'].forEach(s => {
        const card = document.getElementById(`card-${s}`);
        const btn  = document.getElementById(`cta-${s}`);
        const isActive = (s === slug);
        card.classList.toggle('active-plan', isActive);
        if (isActive) {
            btn.disabled    = true;
            btn.textContent = '✓ Current Plan';
        } else {
            btn.disabled = false;
            // Restore default label
            if (s === 'free')    btn.textContent = 'Get Started Free';
            if (s === 'student') btn.textContent = 'Subscribe — $5/mo';
            if (s === 'regular') btn.textContent = 'Subscribe — $10/mo';
        }
    });
}

function switchPlan(slug, name) {
    _currentPlan = slug;
    markActivePlan(_currentPlan);
    document.documentElement.dataset.plan = slug;
    window._userPlan = slug;

    const bannerNames = { free: 'Yomite Free', student: 'Yomite Student', regular: 'Yomite Regular' };
    document.getElementById('banner-plan-name').textContent = bannerNames[slug];
    const renews = new Date();
    renews.setMonth(renews.getMonth() + 1);
    document.getElementById('banner-renews').textContent =
        `· Renews ${renews.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    document.getElementById('current-plan-banner').style.display = 'flex';

    showToast(`Plan updated to ${bannerNames[slug]}`);

    fetch(`${BASE}/app/subscription-set.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ plan: slug })
    });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentPlan();
    updateCartBadge();
});
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