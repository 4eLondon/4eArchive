<?php 
    session_start();
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yomite: Welcome</title>
        <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/welcome.css">
        <link rel="icon" type="image/x-icon" href="/WD3_Project_Sem2_MangaWebsite/Project/images/website-icon.png">
    </head>
    <body>

    <div class="ob-watermark">読み手</div>

    <div class="onboarding">

        <!-- TOP BAR --> 
        <div class="ob-topbar"> 
            <div class="ob-logo">Yomite<span>.</span></div> 
            <div class="ob-progress"> 
                <div class="ob-dot active" onclick="goTo(0)"></div> 
                <div class="ob-dot" onclick="goTo(1)"></div> 
                <div class="ob-dot" onclick="goTo(2)"></div> 
                <div class="ob-dot" onclick="goTo(3)"></div> 
                <div class="ob-dot" onclick="goTo(4)"></div>
                <div class="ob-dot" onclick="goTo(5)"></div>
                <div class="ob-dot" onclick="goTo(6)"></div> 
            </div> 
            <button class="ob-skip" onclick="finish()">Skip →</button> </div>

        <!-- SLIDES -->
        <div class="ob-slides">

            <!-- SLIDE 0: Welcome -->
            <div class="ob-slide ob-welcome active" id="slide-0">
                <div class="ob-slide-inner">
                    <div class="ob-illustration">
                        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="60" cy="60" r="56" fill="#fdf0ee" stroke="#e8c5c1" stroke-width="1.5"/>
                            <text x="60" y="80" text-anchor="middle" font-size="56" font-family="'Hiragino Mincho ProN', serif" fill="#c0392b" opacity="0.85">読</text>
                        </svg>
                    </div>
                    <div class="ob-step-label">Welcome to Yomite</div>
                    <h1 class="ob-title">Hey, <span class="ob-username-highlight" id="welcome-name">reader</span>!</h1>
                    <p class="ob-desc">Your new favourite place to buy books, manga, and more — all in one storefront. Let us show you what's waiting for you.</p>
                </div>
            </div>

            <!-- SLIDE 1: What We Sell -->
            <div class="ob-slide" id="slide-1">
                <div class="ob-slide-inner">
                    <div class="ob-illustration">
                        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Stack of books -->
                            <rect x="60" y="160" width="160" height="12" rx="3" fill="#e8c5c1"/>
                            <rect x="50" y="100" width="140" height="68" rx="6" fill="#fdf0ee" stroke="#e8c5c1" stroke-width="1.5"/>
                            <rect x="70" y="80" width="140" height="68" rx="6" fill="#f5e6e4" stroke="#dab0ab" stroke-width="1.5"/>
                            <rect x="90" y="60" width="140" height="68" rx="6" fill="#fff" stroke="#e0e0e0" stroke-width="1.5"/>
                            <!-- Lines on top book -->
                            <line x1="106" y1="78" x2="214" y2="78" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="106" y1="88" x2="190" y2="88" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="106" y1="98" x2="200" y2="98" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round"/>
                            <!-- Red accent spine -->
                            <rect x="90" y="60" width="8" height="68" rx="3" fill="#c0392b" opacity="0.7"/>
                            <!-- Price tag -->
                            <rect x="170" y="185" width="64" height="30" rx="6" fill="#c0392b" opacity="0.9"/>
                            <line x1="178" y1="200" x2="226" y2="200" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            <circle cx="186" cy="193" r="3" fill="white" opacity="0.8"/>
                        </svg>
                    </div>
                    <div class="ob-text">
                        <div class="ob-step-label">Step 1 of 4</div>
                        <h2 class="ob-title">Every format. <span>One storefront.</span></h2>
                        <p class="ob-desc">Yomite stocks manga, light novels, graphic novels, comics, and general books — in physical and digital formats. Whether you're a collector chasing a hardcover or grabbing an eBook on the go, we've got you covered.</p>
                        <div class="ob-chips">
                            <span class="ob-chip">📦 Physical Copies</span>
                            <span class="ob-chip">📱 Instant eBooks</span>
                            <span class="ob-chip">✨ Collector Editions</span>
                            <span class="ob-chip">📖 Light Novels</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SLIDE 2: Noteworthy Thursdays & Deals -->
            <div class="ob-slide" id="slide-2">
                <div class="ob-slide-inner">
                    <div class="ob-illustration">
                        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Calendar base -->
                            <rect x="60" y="80" width="160" height="140" rx="8" fill="#fff" stroke="#e0e0e0" stroke-width="1.5"/>
                            <rect x="60" y="80" width="160" height="36" rx="8" fill="#c0392b"/>
                            <rect x="60" y="100" width="160" height="16" fill="#c0392b"/>
                            <!-- Calendar rings -->
                            <rect x="96" y="70" width="8" height="20" rx="4" fill="#dab0ab"/>
                            <rect x="176" y="70" width="8" height="20" rx="4" fill="#dab0ab"/>
                            <!-- TH label -->
                            <text x="140" y="104" text-anchor="middle" font-size="13" font-family="serif" fill="white" font-weight="bold">THU</text>
                            <!-- Day grid -->
                            <circle cx="90" cy="140" r="10" fill="#fdf0ee"/>
                            <circle cx="120" cy="140" r="10" fill="#fdf0ee"/>
                            <circle cx="150" cy="140" r="10" fill="#fdf0ee"/>
                            <circle cx="180" cy="140" r="10" fill="#fdf0ee"/>
                            <circle cx="90" cy="170" r="10" fill="#fdf0ee"/>
                            <circle cx="120" cy="170" r="10" fill="#fdf0ee"/>
                            <!-- Highlighted Thursday -->
                            <circle cx="150" cy="170" r="12" fill="#c0392b"/>
                            <text x="150" y="175" text-anchor="middle" font-size="10" fill="white" font-weight="bold">★</text>
                            <circle cx="180" cy="170" r="10" fill="#fdf0ee"/>
                            <!-- Sale badge -->
                            <circle cx="200" cy="230" r="28" fill="#fdf0ee" stroke="#e8c5c1" stroke-width="1.5"/>
                            <text x="200" y="226" text-anchor="middle" font-size="9" fill="#c0392b" font-weight="bold">UP TO</text>
                            <text x="200" y="238" text-anchor="middle" font-size="13" fill="#c0392b" font-weight="bold">60% OFF</text>
                        </svg>
                    </div>
                    <div class="ob-text">
                        <div class="ob-step-label">Step 2 of 4</div>
                        <h2 class="ob-title">New drops, every <span>Thursday.</span></h2>
                        <p class="ob-desc">Noteworthy Thursdays brings fresh arrivals, eBook deals up to 60% off, pre-order windows, and free shipping on orders $40 or more — every single week. Mark your calendar.</p>
                        <div class="ob-chips">
                            <span class="ob-chip">🗓 Weekly Drops</span>
                            <span class="ob-chip">💸 eBook Deals</span>
                            <span class="ob-chip">📬 Pre-Orders</span>
                            <span class="ob-chip">🚚 Free Shipping $40+</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SLIDE 3: Wishlist & Bookshelf -->
            <div class="ob-slide" id="slide-3">
                <div class="ob-slide-inner">
                    <div class="ob-illustration">
                        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Bookshelf card -->
                            <rect x="60" y="60" width="160" height="200" rx="8" fill="#fff" stroke="#e0e0e0" stroke-width="1.5"/>
                            <!-- Book cover placeholder -->
                            <rect x="72" y="72" width="136" height="90" rx="4" fill="#fdf0ee"/>
                            <rect x="72" y="72" width="10" height="90" rx="3" fill="#c0392b" opacity="0.7"/>
                            <!-- Title lines -->
                            <line x1="84" y1="178" x2="184" y2="178" stroke="#e0e0e0" stroke-width="2" stroke-linecap="round"/>
                            <line x1="84" y1="192" x2="160" y2="192" stroke="#e0e0e0" stroke-width="2" stroke-linecap="round"/>
                            <!-- Heart wishlist icon -->
                            <path d="M176 64 C176 60, 172 58, 169 61 C166 58, 162 60, 162 64 C162 68, 169 74, 169 74 C169 74, 176 68, 176 64 Z" fill="#c0392b"/>
                            <!-- Bell icon for notifications -->
                            <path d="M200 215 C200 215, 196 208, 196 204 C196 200, 198 197, 200 197 C202 197, 204 200, 204 204 C204 208, 200 215, 200 215 Z" fill="#c0392b" opacity="0.8"/>
                            <circle cx="200" cy="216" r="3" fill="#c0392b"/>
                            <!-- Rating stars -->
                            <text x="84" y="210" font-size="12" fill="#c0392b">★★★★☆</text>
                        </svg>
                    </div>
                    <div class="ob-text">
                        <div class="ob-step-label">Step 3 of 4</div>
                        <h2 class="ob-title">Your shelf, <span>your way.</span></h2>
                        <p class="ob-desc">Save titles to your wishlist, get notified when new volumes drop, and fine-tune your personal bookshelf for recommendations built around what you actually read. Never miss a volume from a series you follow.</p>
                        <div class="ob-chips">
                            <span class="ob-chip">❤️ Wishlist</span>
                            <span class="ob-chip">🔔 Release Alerts</span>
                            <span class="ob-chip">📚 Your Bookshelf</span>
                            <span class="ob-chip">🎯 Recommendations</span>
                        </div>
                    </div>
                </div>
            </div>


            <!-- SLIDE 4: Currency -->
            <div class="ob-slide" id="slide-4">
                <div class="ob-slide-inner">
                    <div class="ob-illustration">
                        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="140" cy="110" r="54" fill="#fdf0ee" stroke="#e8c5c1" stroke-width="1.5"/>
                            <text x="140" y="128" text-anchor="middle" font-size="44" font-family="serif" fill="#c0392b" opacity="0.85">$</text>
                            <circle cx="90" cy="185" r="36" fill="#f5e6e4" stroke="#dab0ab" stroke-width="1.5"/>
                            <text x="90" y="196" text-anchor="middle" font-size="28" font-family="serif" fill="#c0392b" opacity="0.7">¥</text>
                            <circle cx="190" cy="195" r="32" fill="#fdf0ee" stroke="#e8c5c1" stroke-width="1.5"/>
                            <text x="190" y="205" text-anchor="middle" font-size="22" font-family="serif" fill="#c0392b" opacity="0.7">J$</text>
                        </svg>
                    </div>
                    <div class="ob-text">
                        <div class="ob-step-label">Step 4 of 5</div>
                        <h2 class="ob-title">Pick your <span>currency.</span></h2>
                        <p class="ob-desc">All prices across Yomite will display in your chosen currency. You can change this anytime from Settings.</p>
                        <div class="ob-currency-pick">
                            <button class="ob-currency-btn selected" id="cur-USD" onclick="pickCurrency('USD')">$ USD</button>
                            <button class="ob-currency-btn" id="cur-JMD" onclick="pickCurrency('JMD')">J$ JMD</button>
                            <button class="ob-currency-btn" id="cur-YEN" onclick="pickCurrency('YEN')">¥ JPY</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SLIDE 5: Theme -->
            <div class="ob-slide ob-theme-slide" id="slide-5">
                <div class="ob-slide-inner">
                    <div class="ob-illustration">
                        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="140" cy="140" r="60" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1.5"/>
                            <path d="M140 80 A60 60 0 0 1 140 200 Z" fill="#111111"/>
                            <circle cx="140" cy="140" r="20" fill="#c0392b"/>
                        </svg>
                    </div>
                    <div class="ob-text">
                        <div class="ob-step-label">Step 5 of 5</div>
                        <h2 class="ob-title">Pick your <span>look.</span></h2>
                        <p class="ob-desc">Choose the theme that feels right for you. You can always change it later in settings.</p>
                        <div class="ob-theme-pick">
                            <button class="ob-theme-btn" id="pick-light" onclick="pickTheme('light')">
                                <div class="ob-theme-preview ob-theme-light">
                                    <div class="ob-tp-bar"></div>
                                    <div class="ob-tp-lines">
                                        <div class="ob-tp-line"></div>
                                        <div class="ob-tp-line ob-tp-short"></div>
                                    </div>
                                </div>
                                <span>Light</span>
                            </button>
                            <button class="ob-theme-btn" id="pick-dark" onclick="pickTheme('dark')">
                                <div class="ob-theme-preview ob-theme-dark">
                                    <div class="ob-tp-bar"></div>
                                    <div class="ob-tp-lines">
                                        <div class="ob-tp-line"></div>
                                        <div class="ob-tp-line ob-tp-short"></div>
                                    </div>
                                </div>
                                <span>Dark</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SLIDE 6: Yomite Pass -->
            <div class="ob-slide ob-subscribe-slide" id="slide-6">
                <div class="ob-slide-inner ob-subscribe-inner">
                    <div class="ob-step-label">One last thing</div>
                    <h2 class="ob-title">Choose your <span>Yomite Pass.</span></h2>
                    <p class="ob-desc">Unlock the full catalog with a subscription, or start free — no pressure. You can always upgrade later.</p>

                    <div class="ob-tier-grid">

                        <!-- FREE -->
                        <div class="ob-tier-card" id="ob-card-free">
                            <div class="ob-tier-name">Free</div>
                            <div class="ob-tier-price">$0<span>/mo</span></div>
                            <ul class="ob-tier-feats">
                                <li><span class="ob-feat-y">✦</span> Vol. 1 of rotating titles</li>
                                <li><span class="ob-feat-y">✦</span> 1 device · No ads</li>
                                <li><span class="ob-feat-n">✕</span> Full catalog</li>
                                <li><span class="ob-feat-n">✕</span> Early chapters</li>
                            </ul>
                            <button class="ob-tier-btn" onclick="pickPlan('free')">Start Free</button>
                        </div>

                        <!-- STUDENT -->
                        <div class="ob-tier-card ob-tier-featured" id="ob-card-student">
                            <div class="ob-tier-popular">Most Popular</div>
                            <div class="ob-tier-name">Student</div>
                            <div class="ob-tier-price">$5<span>/mo</span></div>
                            <ul class="ob-tier-feats">
                                <li><span class="ob-feat-y">✦</span> Full catalog</li>
                                <li><span class="ob-feat-y">✦</span> 1 device · No ads</li>
                                <li><span class="ob-feat-y">✦</span> Early chapter access</li>
                                <li><span class="ob-feat-n">✕</span> Studio events</li>
                            </ul>
                            <button class="ob-tier-btn ob-tier-btn--primary" onclick="pickPlan('student')">Subscribe — $5/mo</button>
                        </div>

                        <!-- REGULAR -->
                        <div class="ob-tier-card" id="ob-card-regular">
                            <div class="ob-tier-name">Regular</div>
                            <div class="ob-tier-price">$10<span>/mo</span></div>
                            <ul class="ob-tier-feats">
                                <li><span class="ob-feat-y">✦</span> Full catalog</li>
                                <li><span class="ob-feat-y">✦</span> 3 devices · No ads</li>
                                <li><span class="ob-feat-y">✦</span> Early chapter access</li>
                                <li><span class="ob-feat-y">✦</span> Studio events & Q&As</li>
                            </ul>
                            <button class="ob-tier-btn" onclick="pickPlan('regular')">Subscribe — $10/mo</button>
                        </div>

                    </div><!-- /.ob-tier-grid -->

                    <button class="ob-not-now" onclick="finish()">Not now — continue with Free →</button>
                </div>
            </div>

        </div>

        <!-- BOTTOM BAR -->
        <div class="ob-bottombar">
            <span class="ob-step-count" id="step-count">Step 1 of 4</span>
            <div class="ob-nav">
                <button class="ob-btn-back" id="btn-back" onclick="prev()" style="display:none;">← Back</button>
                <button class="ob-btn-next" id="btn-next" onclick="next()">Next →</button>
            </div>
        </div>

    </div>

    <script>
        const sessionUsername = "<?= htmlspecialchars($_SESSION['username'] ?? 'reader') ?>";
    </script>
    <script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
    <script src="/WD3_Project_Sem2_MangaWebsite/Project/js/welcome.js"></script>        
    </body>
</html>