// Apply saved theme immediately
(function() {
    const t = localStorage.getItem('yomite-theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
  })();
  
  document.getElementById('welcome-name').textContent = sessionUsername;
  
  const TOTAL = 6; // 0-5
  let current = 0;
  
  const slides   = document.querySelectorAll('.ob-slide');
  const dots     = document.querySelectorAll('.ob-dot');
  const btnBack  = document.getElementById('btn-back');
  const btnNext  = document.getElementById('btn-next');
  const stepCount = document.getElementById('step-count');
  
  function updateUI() {
    slides.forEach(s => s.classList.remove('active', 'exit'));
    slides[current].classList.add('active');
    dots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i === current) d.classList.add('active');
      else if (i < current) d.classList.add('done');
    });
    btnBack.style.display = current === 0 ? 'none' : 'inline-block';
    btnNext.textContent   = current === TOTAL - 1 ? 'Get Started ✦' : 'Next →';
    stepCount.textContent = `Step ${current + 1} of ${TOTAL}`;
  }
  
  function next() {
    if (current === TOTAL - 1) { finish(); return; }
    slides[current].classList.add('exit');
    setTimeout(() => {
      slides[current].classList.remove('active', 'exit');
      current++;
      slides[current].classList.add('active');
      updateUI();
    }, 300);
  }
  
  function prev() {
    if (current === 0) return;
    slides[current].classList.remove('active');
    current--;
    slides[current].classList.add('active');
    updateUI();
  }
  
  function goTo(index) {
    if (index === current) return;
    slides[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    updateUI();
  }
  
  function finish() {
    window.location.href = '/WD3_Project_Sem2_MangaWebsite/Project/index.php';
  }
  
  function pickTheme(theme) {
    localStorage.setItem('yomite-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('pick-light')?.classList.toggle('selected', theme === 'light');
    document.getElementById('pick-dark')?.classList.toggle('selected', theme === 'dark');
  }
  
  function pickCurrency(code) {
    // Use saveCurrency from books-data.js
    saveCurrency(code);
    document.querySelectorAll('.ob-currency-btn').forEach(b => {
      b.classList.toggle('selected', b.id === `cur-${code}`);
    });
  }
  
  // Sync currency button state on load
  (function() {
    const saved = getSavedCurrency();
    const btn = document.getElementById(`cur-${saved}`);
    if (btn) {
      document.querySelectorAll('.ob-currency-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    }
  })();
  
  updateUI();