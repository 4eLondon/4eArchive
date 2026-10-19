document.addEventListener('DOMContentLoaded', () => {
  const params       = new URLSearchParams(window.location.search);
  const bookId       = parseInt(params.get('id'));
  const chapterIndex = parseInt(params.get('chapter') || '0');

  const book        = getBookById(bookId);
  const bookUrl     = `/WD3_Project_Sem2_MangaWebsite/Project/pages/book.php?id=${bookId}`;

  if (!book) {
    document.getElementById('reader-loading').textContent = 'Book not found.';
    document.getElementById('reader-main').style.display = '';
    document.getElementById('reader-loading').style.display = '';
    return;
  }

  document.title = `Yomite — ${book.title}`;

  // Nav title (shared)
  document.getElementById('reader-nav-title').innerHTML = `
    <span class="reader-nav-book">${book.title}</span>
  `;

  // ── PDF MODE ───────────────────────────────────────────────
  if (book.reader_type === 'pdf' && book.pdf_url) {
    initPdfReader(book, bookUrl);
    return;
  }

  // ── TEXT MODE ──────────────────────────────────────────────
  initTextReader(book, bookUrl, chapterIndex);
});

// ============================================================
//  PDF READER
// ============================================================
function initPdfReader(book, bookUrl) {
  document.getElementById('pdf-reader-main').style.display = '';
  document.getElementById('reader-main').style.display = 'none';

  // Nav right
  document.getElementById('reader-nav-right').innerHTML = `
    <a class="reader-back-book" href="${bookUrl}">← Book</a>
  `;

  document.getElementById('pdf-back-btn').href = bookUrl;
  document.getElementById('pdf-toolbar-title').textContent = book.title;

  // Load PDF.js from CDN
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  script.onload = () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    loadPdf(book.pdf_url);
  };
  script.onerror = () => {
    document.getElementById('pdf-loading-state').innerHTML =
      '<p style="color:var(--accent)">Could not load PDF viewer. Check your connection.</p>';
  };
  document.head.appendChild(script);
}

let pdfDoc        = null;
let pdfScale      = 1.2;
let pdfRendering  = false;
let pdfPageNum    = 1;
let renderQueue   = [];

async function loadPdf(url) {
  try {
    pdfDoc = await pdfjsLib.getDocument(url).promise;
    const total = pdfDoc.numPages;

    document.getElementById('pdf-total-pages').textContent   = total;
    document.getElementById('pdf-total-pages-2').textContent = total;
    document.getElementById('pdf-page-input').max             = total;

    document.getElementById('pdf-loading-state').style.display = 'none';

    // Render all pages into the scroll container
    await renderAllPages(total);
    updateCurrentPageOnScroll();

  } catch (err) {
    console.error(err);
    document.getElementById('pdf-loading-state').innerHTML =
      `<p style="color:var(--accent)">Failed to load PDF: ${err.message}</p>`;
  }
}

async function renderAllPages(total) {
  const wrapper = document.getElementById('pdf-pages-wrapper');
  // Pre-create page containers
  for (let i = 1; i <= total; i++) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'pdf-page-container';
    pageDiv.id = `pdf-page-${i}`;
    const canvas = document.createElement('canvas');
    canvas.className = 'pdf-canvas';
    pageDiv.appendChild(canvas);
    wrapper.appendChild(pageDiv);
  }

  // Render pages lazily using IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pageDiv = entry.target;
        const pageNum = parseInt(pageDiv.id.replace('pdf-page-', ''));
        if (!pageDiv.dataset.rendered) {
          pageDiv.dataset.rendered = '1';
          renderPage(pageNum, pageDiv.querySelector('canvas'));
          observer.unobserve(pageDiv);
        }
      }
    });
  }, { rootMargin: '300px 0px' });

  wrapper.querySelectorAll('.pdf-page-container').forEach(el => observer.observe(el));
}

async function renderPage(num, canvas) {
  try {
    const page     = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: pdfScale });
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
  } catch (e) {
    console.warn(`Error rendering page ${num}:`, e);
  }
}

function updateCurrentPageOnScroll() {
  const container = document.getElementById('pdf-scroll-container');
  container.addEventListener('scroll', () => {
    // Find which page is most visible
    const pages = container.querySelectorAll('.pdf-page-container');
    let closestPage = 1;
    let closestDist = Infinity;
    pages.forEach(p => {
      const rect = p.getBoundingClientRect();
      const dist = Math.abs(rect.top - 80);
      if (dist < closestDist) { closestDist = dist; closestPage = parseInt(p.id.replace('pdf-page-', '')); }
    });
    document.getElementById('pdf-current-page').textContent = closestPage;
    document.getElementById('pdf-page-input').value = closestPage;
    pdfPageNum = closestPage;
  }, { passive: true });
}

function scrollToPage(num) {
  const el = document.getElementById(`pdf-page-${num}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    pdfPageNum = num;
    document.getElementById('pdf-current-page').textContent = num;
    document.getElementById('pdf-page-input').value = num;
  }
}

function reRenderAll() {
  // Re-render visible pages at new scale
  const wrapper = document.getElementById('pdf-pages-wrapper');
  wrapper.querySelectorAll('.pdf-page-container').forEach(pageDiv => {
    pageDiv.removeAttribute('data-rendered');
    const canvas = pageDiv.querySelector('canvas');
    canvas.width = 0; canvas.height = 0;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pageDiv = entry.target;
        if (!pageDiv.dataset.rendered) {
          pageDiv.dataset.rendered = '1';
          renderPage(parseInt(pageDiv.id.replace('pdf-page-', '')), pageDiv.querySelector('canvas'));
          observer.unobserve(pageDiv);
        }
      }
    });
  }, { rootMargin: '400px 0px' });
  wrapper.querySelectorAll('.pdf-page-container').forEach(el => observer.observe(el));
}

// Toolbar controls
document.getElementById('pdf-zoom-in').addEventListener('click', () => {
  pdfScale = Math.min(pdfScale + 0.25, 3);
  document.getElementById('pdf-zoom-label').textContent = Math.round(pdfScale * 100) + '%';
  reRenderAll();
});
document.getElementById('pdf-zoom-out').addEventListener('click', () => {
  pdfScale = Math.max(pdfScale - 0.25, 0.5);
  document.getElementById('pdf-zoom-label').textContent = Math.round(pdfScale * 100) + '%';
  reRenderAll();
});
document.getElementById('pdf-fit-width').addEventListener('click', () => {
  const container = document.getElementById('pdf-scroll-container');
  // Fit scale to container width (assume first page)
  if (pdfDoc) {
    pdfDoc.getPage(1).then(page => {
      const viewport = page.getViewport({ scale: 1 });
      pdfScale = (container.clientWidth - 48) / viewport.width;
      pdfScale = Math.round(pdfScale * 100) / 100;
      document.getElementById('pdf-zoom-label').textContent = Math.round(pdfScale * 100) + '%';
      reRenderAll();
    });
  }
});
document.getElementById('pdf-prev-page').addEventListener('click', () => {
  if (pdfPageNum > 1) scrollToPage(pdfPageNum - 1);
});
document.getElementById('pdf-next-page').addEventListener('click', () => {
  if (pdfDoc && pdfPageNum < pdfDoc.numPages) scrollToPage(pdfPageNum + 1);
});
document.getElementById('pdf-page-go').addEventListener('click', () => {
  const val = parseInt(document.getElementById('pdf-page-input').value);
  if (pdfDoc && val >= 1 && val <= pdfDoc.numPages) scrollToPage(val);
});
document.getElementById('pdf-page-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('pdf-page-go').click();
});

// Keyboard shortcuts
window.addEventListener('keydown', e => {
  if (!pdfDoc) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (pdfPageNum < pdfDoc.numPages) scrollToPage(pdfPageNum + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (pdfPageNum > 1) scrollToPage(pdfPageNum - 1);
  }
});

// ============================================================
//  TEXT READER
// ============================================================
function initTextReader(book, bookUrl, chapterIndex) {
  document.getElementById('reader-main').style.display = '';

  const bookContent = (typeof BOOK_CONTENT !== 'undefined') ? BOOK_CONTENT[book.id] : null;
  const loading     = document.getElementById('reader-loading');
  const article     = document.getElementById('reader-article');

  document.getElementById('back-bottom-btn').href = bookUrl;

  if (!bookContent || !bookContent.chapters) {
    loading.textContent = 'Chapter not found.';
    return;
  }

  const chapters = bookContent.chapters;
  const chapter  = chapters[chapterIndex];

  if (!chapter) { loading.textContent = 'Chapter not found.'; return; }

  document.title = `Yomite — ${chapter.title}`;

  document.getElementById('reader-nav-title').innerHTML = `
    <span class="reader-nav-book">${book.title}</span>
    <span class="reader-nav-sep">·</span>
    <span class="reader-nav-ch">${chapter.title}</span>
  `;

  document.getElementById('reader-nav-right').innerHTML = `
    <button class="reader-nav-btn" id="prev-chapter-btn" title="Previous chapter">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <span class="reader-chapter-indicator">${chapterIndex + 1} / ${chapters.length}</span>
    <button class="reader-nav-btn" id="next-chapter-btn" title="Next chapter">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
    <a class="reader-back-book" href="${bookUrl}">← Book</a>
  `;

  document.getElementById('reader-book-tag').textContent   = book.title;
  document.getElementById('reader-chapter-title').textContent = chapter.title;

  const paragraphs = chapter.content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const panelsContainer = document.getElementById('reader-panels');
  panelsContainer.innerHTML = paragraphs.map((para, i) => {
    const isDialogue = /^["「『]/.test(para) || /["」』]$/.test(para);
    const isPunchy   = para.length < 80 && !para.includes('. ');
    const cls        = isDialogue ? 'panel panel--dialogue' : isPunchy ? 'panel panel--punchy' : 'panel';
    return `<div class="${cls}" style="animation-delay:${Math.min(i * 0.04, 0.6)}s">${para}</div>`;
  }).join('');

  function goToChapter(idx) {
    window.location.href = `/WD3_Project_Sem2_MangaWebsite/Project/pages/reader.php?id=${book.id}&chapter=${idx}`;
  }

  const prevBtn       = document.getElementById('prev-chapter-btn');
  const nextBtn       = document.getElementById('next-chapter-btn');
  const prevBottomBtn = document.getElementById('prev-bottom-btn');
  const nextBottomBtn = document.getElementById('next-bottom-btn');

  if (chapterIndex <= 0) {
    prevBtn.disabled = true;
    prevBottomBtn.disabled = true;
    prevBottomBtn.style.opacity = '0.35';
    prevBottomBtn.style.pointerEvents = 'none';
  } else {
    prevBtn.onclick       = () => goToChapter(chapterIndex - 1);
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
    nextBtn.onclick       = () => goToChapter(chapterIndex + 1);
    nextBottomBtn.onclick = () => goToChapter(chapterIndex + 1);
    nextBottomBtn.textContent = `${chapters[chapterIndex + 1].title.replace(/^Chapter \d+:\s*/i, 'Ch. ')} →`;
  }

  loading.style.display  = 'none';
  article.style.display  = 'block';

  try { localStorage.setItem(`yomite-reading-${book.id}`, chapterIndex); } catch(e) {}

  let lastScroll = 0;
  const nav = document.getElementById('reader-nav');
  window.addEventListener('scroll', () => {
    const curr = window.scrollY;
    if (curr > lastScroll && curr > 80) nav.classList.add('reader-nav--hidden');
    else nav.classList.remove('reader-nav--hidden');
    lastScroll = curr;
  }, { passive: true });
}