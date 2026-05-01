// reader.js
if (typeof BOOK_CONTENT === 'undefined') {
    document.getElementById('chapter-content').innerHTML = '<p>Error: Book content not found.</p>';
  } else {
    const bookId = <?= $book_id ?>;
    const bookData = BOOK_CONTENT[bookId];
    
    if (!bookData || !bookData.chapters) {
      document.getElementById('chapter-content').innerHTML = '<p>Content not available.</p>';
      return;
    }
  
    let currentChapter = 0;
  
    function loadChapter(chap = 0) {
      currentChapter = chap;
      const chapter = bookData.chapters[chap];
      
      document.getElementById('chapter-content').innerHTML = `
        <h2>${chapter.title}</h2>
        <div class="chapter-text">${chapter.content.replace(/\n/g, '<br><br>')}</div>
      `;
      
      // Update nav
      document.querySelectorAll('.chapter-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === chap);
      });
      
      // Update progress
      const progress = ((chap + 1) / bookData.chapters.length) * 100;
      document.querySelector('.progress-fill').style.width = progress + '%';
      document.querySelector('.progress-text').textContent = Math.round(progress) + '%';
      
      // Scroll to top
      document.querySelector('.chapter-content').scrollIntoView({ behavior: 'smooth' });
    }
  
    // Nav events
    document.querySelectorAll('.chapter-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => loadChapter(index));
    });
  
    document.querySelector('.prev').addEventListener('click', () => {
      if (currentChapter > 0) loadChapter(currentChapter - 1);
    });
  
    document.querySelector('.next').addEventListener('click', () => {
      if (currentChapter < bookData.chapters.length - 1) loadChapter(currentChapter + 1);
    });
  
    // Load first chapter
    loadChapter(0);
  
    // Close button
    document.querySelector('.close-btn').addEventListener('click', () => {
      history.back();
    });
  
    // Bookmark (placeholder)
    document.querySelector('.bookmark-btn').addEventListener('click', () => {
      // Add bookmark API call here
      showToast('Bookmarked!');
    });
  }
  
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast show';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }