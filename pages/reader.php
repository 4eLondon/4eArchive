<?php session_start(); ?>
<!DOCTYPE html>
<html>
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
    <div class="reader-nav-center" id="reader-nav-title">
      <!-- filled by JS -->
    </div>
    <div class="reader-nav-right">
      <button class="reader-nav-btn" id="prev-chapter-btn" title="Previous chapter">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="reader-chapter-indicator" id="chapter-indicator">—</span>
      <button class="reader-nav-btn" id="next-chapter-btn" title="Next chapter">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <a class="reader-back-book" id="back-to-book-btn" href="#">← Book</a>
    </div>
  </div>
</nav>

<!-- READER MAIN -->
<main class="reader-main" id="reader-main">
  <div class="reader-loading" id="reader-loading">Loading chapter…</div>
  <article class="reader-article" id="reader-article" style="display:none;">
    <header class="reader-chapter-header">
      <div class="reader-book-tag" id="reader-book-tag"></div>
      <h1 class="reader-chapter-title" id="reader-chapter-title"></h1>
    </header>
    <div class="reader-panels" id="reader-panels">
      <!-- panels injected here -->
    </div>
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

<div class="toast" id="toast"></div>

<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-data.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/books-content.js"></script>
<script src="/WD3_Project_Sem2_MangaWebsite/Project/js/index.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(params.get('id'));
  const chapterIndex = parseInt(params.get('chapter') || '0');

  const book = getBookById(bookId);
  const bookContent = (typeof BOOK_CONTENT !== 'undefined') ? BOOK_CONTENT[bookId] : null;

  const loading = document.getElementById('reader-loading');
  const article = document.getElementById('reader-article');

  const bookUrl = `/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${bookId}`;

  // Set back-to-book links
  document.getElementById('back-to-book-btn').href = bookUrl;
  document.getElementById('back-bottom-btn').href = bookUrl;

  if (!book || !bookContent || !bookContent.chapters) {
    loading.textContent = 'Chapter not found.';
    return;
  }

  const chapters = bookContent.chapters;
  const chapter = chapters[chapterIndex];

  if (!chapter) {
    loading.textContent = 'Chapter not found.';
    return;
  }

  document.title = `Yomite — ${chapter.title}`;

  // Nav title
  document.getElementById('reader-nav-title').innerHTML = `
    <span class="reader-nav-book">${book.title}</span>
    <span class="reader-nav-sep">·</span>
    <span class="reader-nav-ch">${chapter.title}</span>
  `;

  // Chapter indicator
  document.getElementById('chapter-indicator').textContent = `${chapterIndex + 1} / ${chapters.length}`;

  // Book tag + title
  document.getElementById('reader-book-tag').textContent = book.title;
  document.getElementById('reader-chapter-title').textContent = chapter.title;

  // Split content into paragraphs and render as panels
  const paragraphs = chapter.content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const panelsContainer = document.getElementById('reader-panels');

  panelsContainer.innerHTML = paragraphs.map((para, i) => {
    // Detect dialogue (starts/ends with quote)
    const isDialogue = /^["「『]/.test(para) || /["」』]$/.test(para);
    // Detect short punchy lines (under 80 chars, no period mid-sentence)
    const isPunchy = para.length < 80 && !para.includes('. ');
    const panelClass = isDialogue ? 'panel panel--dialogue' : isPunchy ? 'panel panel--punchy' : 'panel';
    return `<div class="${panelClass}" style="animation-delay:${Math.min(i * 0.04, 0.6)}s">${para}</div>`;
  }).join('');

  // Prev/next navigation
  const prevBtn = document.getElementById('prev-chapter-btn');
  const nextBtn = document.getElementById('next-chapter-btn');
  const prevBottomBtn = document.getElementById('prev-bottom-btn');
  const nextBottomBtn = document.getElementById('next-bottom-btn');

  function goToChapter(idx) {
    window.location.href = `/WD3_Project_Sem2_MangaWebsite/Project/pages/reader.php?id=${bookId}&chapter=${idx}`;
  }

  if (chapterIndex <= 0) {
    prevBtn.disabled = true;
    prevBottomBtn.disabled = true;
    prevBottomBtn.style.opacity = '0.35';
    prevBottomBtn.style.pointerEvents = 'none';
  } else {
    prevBtn.onclick = () => goToChapter(chapterIndex - 1);
    prevBottomBtn.onclick = () => goToChapter(chapterIndex - 1);
    prevBottomBtn.textContent = `← ${chapters[chapterIndex - 1].title.replace(/^Chapter \d+:\s*/i, 'Ch. ')}`;
  }

  if (chapterIndex >= chapters.length - 1) {
    nextBtn.disabled = true;
    nextBottomBtn.disabled = true;
    nextBottomBtn.style.opacity = '0.35';
    nextBottomBtn.style.pointerEvents = 'none';
    nextBottomBtn.textContent = 'No more chapters';
  } else {
    nextBtn.onclick = () => goToChapter(chapterIndex + 1);
    nextBottomBtn.onclick = () => goToChapter(chapterIndex + 1);
    nextBottomBtn.textContent = `${chapters[chapterIndex + 1].title.replace(/^Chapter \d+:\s*/i, 'Ch. ')} →`;
  }

  // Show content
  loading.style.display = 'none';
  article.style.display = 'block';

  // Hide nav on scroll down, show on scroll up
  let lastScroll = 0;
  const nav = document.getElementById('reader-nav');
  window.addEventListener('scroll', () => {
    const curr = window.scrollY;
    if (curr > lastScroll && curr > 80) {
      nav.classList.add('reader-nav--hidden');
    } else {
      nav.classList.remove('reader-nav--hidden');
    }
    lastScroll = curr;
  }, { passive: true });
});
</script>
</body>
</html>