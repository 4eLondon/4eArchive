<?php session_start(); ?>
<!DOCTYPE html>
<html data-plan="<?= htmlspecialchars($_SESSION['plan'] ?? 'free') ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yomite — Reader</title>
  <link rel="icon" href="/WD3_Project_Sem2_MangaWebsite/Project/images/website-icon.png">
  <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/index.css">
  <link rel="stylesheet" href="/WD3_Project_Sem2_MangaWebsite/Project/css/reader.css">
  <script>
    (function(){
      const t = localStorage.getItem('yomite-theme') || 'light';
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
</head>
<body>

<!-- SLIM READER NAV -->
<nav class="reader-nav" id="reader-nav">
  <div class="reader-nav-inner">
    <a href="/WD3_Project_Sem2_MangaWebsite/Project/index.php" class="nav-logo">Yomite<span>.</span></a>
    <div class="reader-nav-center" id="reader-nav-title"><!-- filled by JS --></div>
    <div class="reader-nav-right" id="reader-nav-right">
      <!-- filled by JS depending on mode -->
    </div>
  </div>
</nav>

<!-- TEXT READER MAIN -->
<main class="reader-main" id="reader-main" style="display:none;">
  <div class="reader-loading" id="reader-loading">Loading chapter…</div>
  <article class="reader-article" id="reader-article" style="display:none;">
    <header class="reader-chapter-header">
      <div class="reader-book-tag" id="reader-book-tag"></div>
      <h1 class="reader-chapter-title" id="reader-chapter-title"></h1>
    </header>
    <div class="reader-panels" id="reader-panels"></div>
    <div class="reader-chapter-end">
      <div class="reader-end-line"></div>
      <span class="reader-end-label">End of Chapter</span>
      <div class="reader-end-line"></div>
    </div>
    <div class="reader-nav-bottom">
      <button class="reader-bottom-btn" id="prev-bottom-btn">← Previous</button>
      <a class="reader-bottom-btn reader-bottom-back" id="back-bottom-btn" href="#">All Chapters</a>
      <button class="reader-bottom-btn reader-bottom-next" id="next-bottom-btn">Next →</button>
    </div>
  </article>
</main>

<!-- PDF READER MAIN -->
<main class="pdf-reader-main" id="pdf-reader-main" style="display:none;">
  <!-- Toolbar -->
  <div class="pdf-toolbar" id="pdf-toolbar">
    <div class="pdf-toolbar-left">
      <a href="#" id="pdf-back-btn" class="pdf-back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </a>
      <div class="pdf-toolbar-title" id="pdf-toolbar-title"></div>
    </div>
    <div class="pdf-toolbar-center">
      <button class="pdf-tool-btn" id="pdf-zoom-out" title="Zoom out">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <span class="pdf-zoom-label" id="pdf-zoom-label">100%</span>
      <button class="pdf-tool-btn" id="pdf-zoom-in" title="Zoom in">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <span class="pdf-toolbar-divider"></span>
      <button class="pdf-tool-btn" id="pdf-fit-width" title="Fit to width">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
      </button>
    </div>
    <div class="pdf-toolbar-right">
      <span class="pdf-page-indicator">
        Page <span id="pdf-current-page">—</span> of <span id="pdf-total-pages">—</span>
      </span>
    </div>
  </div>

  <!-- Canvas scroll container -->
  <div class="pdf-scroll-container" id="pdf-scroll-container">
    <div class="pdf-pages-wrapper" id="pdf-pages-wrapper">
      <div class="pdf-loading-state" id="pdf-loading-state">
        <div class="pdf-spinner"></div>
        <p>Loading manga…</p>
      </div>
    </div>
  </div>

  <!-- Page jump footer -->
  <div class="pdf-footer" id="pdf-footer">
    <button class="pdf-foot-btn" id="pdf-prev-page">← Prev</button>
    <div class="pdf-page-jump">
      <input type="number" class="pdf-page-input" id="pdf-page-input" min="1" value="1">
      <span class="pdf-page-jump-label">/ <span id="pdf-total-pages-2">—</span></span>
      <button class="pdf-page-go" id="pdf-page-go">Go</button>
    </div>
    <button class="pdf-foot-btn pdf-next-btn" id="pdf-next-page">Next →</button>
  </div>
</main>

<div class="toast" id="toast"></div>

<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-content.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/index.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/reader.js"></script>
</body>
</html>