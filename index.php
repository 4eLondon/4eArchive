<?php 
    session_start();
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yomite: Home</title>
        <link rel="icon" type="image/x-icon" href="/WD3_Project_Sem2_MangaWebsite/Project/images/website-icon.png">
        <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/index.css">
        <script>
            // Apply theme before paint to prevent flash
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

                <!-- WISHLIST -->
                <a href="#" class="nav-pill-btn" id="wishlist-btn" title="Wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Wishlist
                </a>

                <!-- CART -->
                <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/cart.php" class="nav-pill-btn nav-pill-btn--accent" id="cart-btn" title="My Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Cart
                    <span class="library-badge" id="cart-badge" style="display:none;">0</span>
                </a>

                <!-- LIBRARY (owned books) -->
                <a href="#" class="nav-pill-btn" id="library-btn" title="My Library">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    Library
                </a>

                <span class="nav-divider"></span>

                <div class="nav-icon-group">
                    <!-- SETTINGS -->
                    <a href="#" class="nav-icon-btn" id="settings-drawer-trigger" title="Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                    </a>
                    <!-- HELP -->
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

    <!-- ========== HERO ========== -->
    <section class="hero-section">
        <div class="hero-glow"></div>
        <video class="hero-bg-video" 
            autoplay 
            muted 
            loop 
            playsinline 
            preload="auto">
        <source src="/WD3_Project_Sem2_MangaWebsite/Project/images/bg-video.mp4" type="video/mp4">
        <!-- Fallback image if video fails -->
        <img src="../images/background-2.jpg" alt="Hero background">
        </video>
        <div class="hero-left">
            <h1 class="hero-title">
                Stories made <em>for you.</em>
                <span class="inline">Discover all sorts of books that pique your interest.</span>
            </h1>
            <div class="hero-search" id="hero-search">
                <input type="text" id="search-input" placeholder="Search titles, authors, genres…" autocomplete="off">
                <div id="search-dropdown" style="display:none;position:absolute;top:100%;left:-1px;right:-1px;background:var(--bg-2);border:1px solid var(--border);border-radius:0 0 13px 13px;border-top:none;z-index:999;max-height:420px;overflow-y:auto;opacity:0;transform:translateY(-6px);transition:opacity 0.2s ease,transform 0.2s ease;"></div>
            </div>
        </div>
        <div class="hero-marquee">
            <div class="marquee-track">
                <div class="marquee-item"><strong>Chainsaw Man Vol. 17</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Frieren: Beyond Journey's End</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Dungeon Meshi Vol. 9</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Oshi no Ko Vol. 6</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Solo Leveling Vol. 8</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Berserk Vol. 42</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Kaiju No. 8 Vol. 5</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Blue Lock Vol. 12</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Chainsaw Man Vol. 17</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Frieren: Beyond Journey's End</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Dungeon Meshi Vol. 9</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Oshi no Ko Vol. 6</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Solo Leveling Vol. 8</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Berserk Vol. 42</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Kaiju No. 8 Vol. 5</strong><span class="marquee-sep">✦</span></div>
                <div class="marquee-item"><strong>Blue Lock Vol. 12</strong><span class="marquee-sep">✦</span></div>
            </div>
        </div>
    </section>

    <!-- ========== FEATURED ========== -->
    <div class="featured-wrap">
        <div class="featured-inner">
            <div class="featured-visual">
                <div class="featured-kanji">呪</div>
                <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/heaven-official's-blessing copy.jpg" alt="Featured image cover" class="featured-cover-img">
            </div>
            <div class="featured-content">
                <p class="featured-tag">Staff Pick · Editor's Choice</p>
                <h2 class="featured-title">Heaven Official's Blessing</h2>
                <p class="featured-author">by Mo Xiang Tong Xiu — Vol. 1 of 8</p>
                <p class="featured-desc">Eight hundred years ago, Xie Lian was the Crown Prince of the Xianle. He was loved by his citizens and was considered the darling of the world. He ascended to the Heavens at a young age; however, due to unfortunate circumstances, was quickly banished back to the mortal realm. Years later, he ascends again – only to be banished again a few minutes later. Now, eight hundred years later, Xie Lian ascends to the Heavens for the third time as the laughingstock among all three realms.</p>
                <div class="featured-actions">
                    <button class="btn-dark" onclick="addToCart(9)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(9, 24.99)">Buy Now</button>
                    <button class="btn-line" onclick="openSample()">Read a Sample</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ========== NEW RELEASES ========== -->
    <div style="background:var(--bg);">
        <div class="section">
            <div class="section-head">
                <div>
                    <h2 class="section-title">New <em>Releases</em></h2>
                </div>
            </div>
            <div class="product-grid">

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=1">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/The-Greatest-Estate-Developer-1 copy.png" alt="The Greatest Estate Developer">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(1)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(1, 9.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="1" onclick="toggleWishlist(1, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Isekai, Comedy</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=1" class="product-title-link">The Greatest Estate Developer</a></h3>
                        <p class="product-author">BK_Moon</p>
                        <p class="product-price" data-price-usd="9.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=2">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/solo-leveling.jpg" alt="Solo Leveling">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(2)">Add to Cart</button>
                            <button class="wish-btn" data-book-id="2" onclick="toggleWishlist(2, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Action, Fantasy</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=2" class="product-title-link">Solo Leveling</a></h3>
                        <p class="product-author">Chugong</p>
                        <p class="product-price sold-out-price">SOLD OUT</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=3">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/apothecary-diares.jpg" alt="The Apothecary Diaries">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(3)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(3, 13.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="3" onclick="toggleWishlist(3, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Mystery, Romance</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=3" class="product-title-link">The Apothecary Diaries</a></h3>
                        <p class="product-author">Hyūganatsu</p>
                        <p class="product-price" data-price-usd="13.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=4">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/the-beginning-after-the-end-31381.jpg" alt="The Beginning After The End">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(4)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(4, 14.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="4" onclick="toggleWishlist(4, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">High Fantasy</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=4" class="product-title-link">The Beginning After The End</a></h3>
                        <p class="product-author">TurtleMe</p>
                        <p class="product-price" data-price-usd="14.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=5">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/9781975367985_manga-delicious-in-dungeon-manga-volume-12-primary.jpg" alt="Delicious in Dungeon">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(5)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(5, 6.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="5" onclick="toggleWishlist(5, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Adventure, Cooking</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=5" class="product-title-link">Delicious in Dungeon</a></h3>
                        <p class="product-author">Ryoko Kui</p>
                        <p class="product-price" data-price-usd="6.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=6">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/omniscient-readers-viewpoint-2.jpeg" alt="Omniscient Reader's Viewpoint">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(6)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(6, 11.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="6" onclick="toggleWishlist(6, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Action, Fantasy</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=6" class="product-title-link">Omniscient Reader's Viewpoint</a></h3>
                        <p class="product-author">Sing Shong</p>
                        <p class="product-price" data-price-usd="11.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=7">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/eleceed.jpg" alt="Eleceed">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(7)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(7, 14.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="7" onclick="toggleWishlist(7, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Action, Fantasy</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=7" class="product-title-link">Eleceed</a></h3>
                        <p class="product-author">Son Je-ho</p>
                        <p class="product-price" data-price-usd="14.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=8">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/eternally-regressing-knight.webp" alt="Eternally Regressing Knight">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(8)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(8, 11.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="8" onclick="toggleWishlist(8, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Fantasy, Adventure</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=8" class="product-title-link">Eternally Regressing Knight</a></h3>
                        <p class="product-author">Lee Hyunmin</p>
                        <p class="product-price" data-price-usd="11.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=9">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/heaven-official's-blessing.jpg" alt="Heaven Official's Blessing">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(9)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(9, 24.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="9" onclick="toggleWishlist(9, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Xianxia</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=9" class="product-title-link">Heaven Official's Blessing</a></h3>
                        <p class="product-author">Mo Xiang Tong Xiu</p>
                        <p class="product-price" data-price-usd="24.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=10">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/grandmaster-of-demon-cultivation.jpg" alt="Grandmaster of Demon Cultivation">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(10)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(10, 19.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="10" onclick="toggleWishlist(10, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Xianxia, Danmei</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=10" class="product-title-link">Grandmaster of Demon Cultivation</a></h3>
                        <p class="product-author">Mo Xiang Tong Xiu</p>
                        <p class="product-price" data-price-usd="19.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/manga-frieren.jpeg" alt="Frieren">
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(11)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(11, 13.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="11" onclick="toggleWishlist(11, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Adventure, Fantasy</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=11" class="product-title-link">Frieren: Beyond Journey's End</a></h3>
                        <p class="product-author">Kanehito Yamada</p>
                        <p class="product-price" data-price-usd="13.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=12">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/yona-of-the-dawn-6725.jpg" alt="Yona of the Dawn">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(12)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(12, 15.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="12" onclick="toggleWishlist(12, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Adventure, Romance</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=12" class="product-title-link">Yona of the Dawn</a></h3>
                        <p class="product-author">Mizuho Kusanagi</p>
                        <p class="product-price" data-price-usd="15.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=13">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/Snow-White-with-the-Red-Hair-1-Cover.png" alt="Snow White with the Red Hair">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(13)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(13, 11.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="13" onclick="toggleWishlist(13, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Romance</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=13" class="product-title-link">Snow White with the Red Hair</a></h3>
                        <p class="product-author">Sorata Akiduki</p>
                        <p class="product-price" data-price-usd="11.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=14">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/horimiyajpg.jpg" alt="Horimiya">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(14)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(14, 11.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="14" onclick="toggleWishlist(14, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Romance</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=14" class="product-title-link">Horimiya</a></h3>
                        <p class="product-author">HERO, Daisuke Hagiwara</p>
                        <p class="product-price" data-price-usd="11.99">loading...</p>
                    </div>
                </div>

                <div class="product-card">
                    <div class="product-cover">
                        <a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=15">
                            <img src="/WD3_Project_Sem2_MangaWebsite/Project/images/kill-the-villainess-manhwa.jpg" alt="Kill the Villainess">
                        </a>
                        <div class="cover-actions">
                            <button class="btn-dark" onclick="addToCart(15)">Add to Cart</button>
                            <button class="btn-buy-now" onclick="buyNow(15, 11.99)">Buy Now</button>
                            <button class="wish-btn" data-book-id="15" onclick="toggleWishlist(15, this)">♡</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-series">Drama, Romance</p>
                        <h3 class="product-title"><a href="/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=15" class="product-title-link">Kill the Villainess</a></h3>
                        <p class="product-author">Haegi, Your April</p>
                        <p class="product-price" data-price-usd="11.99">loading...</p>
                    </div>
                </div>

            </div>
        </div>
    </div>

<!-- ========== VIDEO FEATURE ========== -->
<div class="video-section-wrap">
    <div class="video-left">
        <video
            id="feature-video"
            src="/WD3_Project_Sem2_MangaWebsite/Project/images/CharacterDemo.mp4"
            muted
            loop
            playsinline
            preload="metadata">
        </video>
        <div class="play-overlay">▶</div>

        <!-- Mute/Unmute Button -->
    <button class="volume-toggle" title="Toggle Mute">
        <svg class="volume-icon volume-on" viewBox="0 0 24 24" width="20" height="20">
            <path d="M11 5L6 9v6l5 4V5zM18 11a4.49 4.49 0 0 0-2.5-4.12v4.24A4.49 4.49 0 0 0 18 11z"/>
            <path d="M13 3.07a8 8 0 0 1 2.54.87l4.15 2.88A1 1 0 0 1 20 7v10a1 1 0 0 1-1.31.94l-4.15 2.88A8 8 0 0 1 13 21V3.07z"/>
        </svg>
        <svg class="volume-icon volume-off" viewBox="0 0 24 24" width="20" height="20">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.98 8.98 0 0 0 20 12a9 9 0 0 0-1.48-4.84L19 5.64l-3.72 3.72C15.27 8.18 14.45 8 13.5 8v2.86l1.04 1.04.97-.97zM3.41 2.86L2 4.27l4.65 4.65-2.86 2.86A8.98 8.98 0 0 0 3 12a9 9 0 0 0 2.34 5.78l1.41-1.41A7 7 0 0 1 5 12c0-1.27.33-2.46.9-3.5l3.61 3.61-.72.72H5c0-1.77 1.02-3.29 2.5-4.03V7.46L6.35 8.11 3.41 5.17z"/>
        </svg>
    </button>
    </div>

    <div class="video-right">
    <div class="video-kanji">映</div>
    <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="video-logo">Yomite<span>.</span></a>
    <p class="video-book-tag">About Us · Yardiereads</p>
    <h2 class="video-book-title">Built for readers, <em>by readers.</em></h2>
    <p class="video-book-desc">Yomite is the official digital storefront of Yardiereads — a platform built for manga and book lovers who take their reads seriously. Discover new titles, collect your favourites, and build a library that's entirely yours.</p>
    <p class="video-book-desc">Founded by a team of passionate readers, Yardiereads has been curating stories since day one. From shonen classics to obscure hidden gems, every title on Yomite is handpicked with the community in mind.</p>
    <div class="video-contact">
        <a href="mailto:hello@yardiereads.com" class="btn-dark video-contact-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            hello@yardiereads.com
        </a>
        <a href="tel:+18761234567" class="btn-line video-contact-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +1 (876) 123-4567
        </a>
    </div>
</div>
</div>

    <!-- ========== NEWSLETTER ========== -->
    <div class="newsletter-wrap">
        <div class="nl-inner">
            <span class="nl-tag">Stay in the loop</span>
            <h2 class="nl-title">Never miss a<br><em>release.</em></h2>
            <p class="nl-sub">New volumes, exclusive titles, and early access to upcoming series — straight to your inbox. No noise, just ink.</p>
            <div class="nl-form">
                <input type="email" class="nl-input" placeholder="your@email.com">
                <button class="nl-submit">Subscribe</button>
            </div>
        </div>
    </div>

    <!-- ========== FOOTER ========== -->
    <footer>
        <div class="footer-grid">
            <div>
                <div class="footer-logo">Yomite<span>.</span></div>
                <p class="footer-slogan">Ink hits different here.</p>
                <p class="footer-about">An e-commerce platform for manga, light novels, and books — physical and digital. Built for readers, by readers.</p>
                <div class="footer-socials">
                    <a href="#" class="soc-btn">𝕏</a>
                    <a href="#" class="soc-btn">IG</a>
                    <a href="#" class="soc-btn">YT</a>
                    <a href="#" class="soc-btn">DC</a>
                </div>
            </div>
            <div>
                <p class="footer-col-title">Shop</p>
                <ul class="footer-links">
                    <li><a href="#">New Releases</a></li>
                    <li><a href="#">Trending</a></li>
                    <li><a href="#">Collector Editions</a></li>
                    <li><a href="#">Coming Soon</a></li>
                    <li><a href="#">Staff Picks</a></li>
                    <li><a href="#">Browse All</a></li>
                </ul>
            </div>
            <div>
                <p class="footer-col-title">Help</p>
                <ul class="footer-links">
                    <li><a href="#">My Library</a></li>
                    <li><a href="#">Orders & Shipping</a></li>
                    <li><a href="#">Manage Subscription</a></li>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Contact Us</a></li>
                </ul>
            </div>
            <div>
                <p class="footer-col-title">Company</p>
                <ul class="footer-links">
                    <li><a href="#">About Yomite</a></li>
                    <li><a href="#">Publisher Partners</a></li>
                    <li><a href="#">Affiliate Program</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 YardieReads / Yomite. All rights reserved.</p>
        </div>
    </footer>

    <!-- ========== SETTINGS PANEL ========== -->
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

    <!-- ========== LIBRARY POPUP (owned) ========== -->
    <div class="library-popup" id="library-popup">
        <div class="library-popup-header">
            <span class="library-popup-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>My Library
            </span>
            <button class="library-popup-close" onclick="closeLibraryPanel()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="library-popup-body" id="library-body">
            <div class="popup-empty">Your library is empty.</div>
        </div>
    </div>
    <div class="library-overlay" id="library-overlay"></div>

    <!-- pay modal removed — checkout is now embedded in cart panel -->

    <!-- ========== WISHLIST POPUP ========== -->
    <div class="wishlist-popup" id="wishlist-popup">
        <div class="wishlist-popup-header">
            <span class="wishlist-popup-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>My Wishlist
            </span>
            <button class="wishlist-popup-close" onclick="closeWishlist()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="wishlist-popup-body" id="wishlist-body">
            <div class="popup-empty">Your wishlist is empty.</div>
        </div>
    </div>
    <div class="wishlist-overlay" id="wishlist-overlay"></div>

    <!-- ========== TOAST ========== -->
    <div class="toast" id="toast"></div>
    <div class="settings-overlay" id="settings-overlay"></div>

    <!-- BUY NOW MODAL -->
<div class="buy-now-overlay" id="buy-now-overlay"></div>
<div class="buy-now-modal" id="buy-now-modal" role="dialog" aria-modal="true">
    <button class="buy-now-close" onclick="closeBuyNowModal()" aria-label="Close">✕</button>
    <div class="buy-now-inner">
        <img class="buy-now-cover" id="buy-now-cover" src="" alt="Book cover">
        <div class="buy-now-content">
            <p class="buy-now-label">Confirm Purchase</p>
            <h3 class="buy-now-book-title" id="buy-now-title"></h3>
            <p class="buy-now-price-line">Total: <strong id="buy-now-price"></strong></p>
            <p class="buy-now-note">This book will be added directly to your Library.</p>
            <div class="buy-now-actions">
                <button class="btn-dark buy-now-confirm-btn" id="buy-now-confirm">Confirm Purchase</button>
                <button class="btn-line" id="buy-now-cancel">Cancel</button>
            </div>
        </div>
    </div>
</div>

    <!-- ========== SAMPLE READER MODAL ========== -->
    <div class="sample-overlay" id="sample-overlay" onclick="closeSample()"></div>
    <div class="sample-modal" id="sample-modal">
        <button class="sample-close" onclick="closeSample()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
        <div class="sample-book">
            <div class="sample-left">
                <img class="sample-cover" src="/WD3_Project_Sem2_MangaWebsite/Project/images/heaven-official's-blessing copy.jpg" alt="Heaven Official's Blessing">
                <div class="sample-badge">Free Sample</div>
            </div>
            <div class="sample-right">
                <div class="sample-label">Chapter 1 · Preview</div>
                <h2 class="sample-title">Heaven Official's Blessing</h2>
                <p class="sample-author">Mo Xiang Tong Xiu · Vol. 1 of 8</p>
                <div class="sample-divider"></div>
                <div class="sample-text">
                    <p>Eight hundred years ago, Xie Lian was the Crown Prince of the Xianle kingdom — beloved by his people, gifted beyond measure, and destined, it seemed, for eternal glory among the heavens.</p>
                    <p>He ascended as a martial god at a young age, a feat unheard of in living memory. The heavenly court received him with fanfare. Temples were built in his name. Prayers were offered at his feet.</p>
                    <p>Then he was banished.</p>
                    <p>He scraped together enough merit to ascend a second time. He was banished again — within minutes.</p>
                    <p>Now, eight hundred years later, Xie Lian ascends for a third time — threadbare, forgotten, and regarded as a cosmic joke by gods and demons alike. He has no temple. No followers. No divine power to speak of. What he does have is an unshakeable sense of principle, a rusted sword, and the quiet, stubborn belief that he is still, somehow, meant to help people...</p>
                </div>
                <div class="sample-footer">
                    <span class="sample-page">Page 1 of 1 · Sample ends here</span>
                    <button class="sample-cta" onclick="addToCart(9); closeSample();">Add to Cart — $24.99</button>
                </div>
            </div>
        </div>
    </div>

    <script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
    <script src="/WD3_Project_Sem2_MangaWebsite/Project/js/index.js"></script>
    <script>
    function openSample() {
        document.getElementById('sample-overlay').classList.add('open');
        document.getElementById('sample-modal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeSample() {
        document.getElementById('sample-overlay').classList.remove('open');
        document.getElementById('sample-modal').classList.remove('open');
        document.body.style.overflow = '';
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSample(); });

    // Hero background video: autoplay on load, pause when scrolled out of view
    document.addEventListener('DOMContentLoaded', function() {
        const heroBgVideo = document.querySelector('.hero-bg-video');
        if (heroBgVideo) {
            // Attempt autoplay immediately (already has autoplay attr, but trigger via JS too)
            heroBgVideo.play().catch(() => {});

            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        heroBgVideo.play().catch(() => {});
                    } else {
                        heroBgVideo.pause();
                    }
                });
            }, {
                threshold: 0.1
            });

            heroObserver.observe(heroBgVideo);
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const video = document.getElementById('feature-video');
        const videoLeft = video?.closest('.video-left');
        const volumeToggle = videoLeft?.querySelector('.volume-toggle');
        
        if (!video || !videoLeft) return;
        
        // Intersection Observer for scroll-based autoplay
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoLeft.classList.add('playing');
                    video.play().catch(e => {
                        console.log('Autoplay prevented:', e);
                        videoLeft.classList.remove('playing');
                    });
                } else {
                    video.pause();
                    videoLeft.classList.remove('playing');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });
        
        observer.observe(video);
        
        // Play/Pause toggle
        videoLeft.addEventListener('click', (e) => {
            // Don't trigger play/pause when clicking volume button
            if (e.target.closest('.volume-toggle')) return;
            
            if (video.paused) {
                video.play();
                videoLeft.classList.add('playing');
            } else {
                video.pause();
                videoLeft.classList.remove('playing');
            }
        });
        
        // Mute/Unmute toggle
        if (volumeToggle) {
            volumeToggle.addEventListener('click', () => {
                video.muted = !video.muted;
                videoLeft.classList.toggle('muted', video.muted);
            });
        }
    });
    </script>
</body>
</html>