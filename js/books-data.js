// ==================== SHARED BOOK DATA ====================
// Single source of truth used by index.js, book.php, and welcome.js

const BOOKS = [
    {
      id: 1,
      title: "The Greatest Estate Developer",
      author: "BK_Moon",
      genre: "Isekai, Comedy",
      price_usd: 9.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/The-Greatest-Estate-Developer-1 copy.png",
      volumes: 5,
      status: "Ongoing",
      year: 2020,
      synopsis: "When civil engineering student Kim Suho dies and is reincarnated into the body of Lloyd Frontera, the lazy third son of a noble family on the brink of bankruptcy, he decides to use his real-world engineering knowledge to turn his family's fortunes around. But this world runs on mana and swords, not blueprints and machinery — or does it? A hilarious isekai that flips the genre on its head by making construction the ultimate cheat skill."
    },
    {
      id: 2,
      title: "Solo Leveling",
      author: "Chugong",
      genre: "Action, Fantasy",
      price_usd: 14.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/solo-leveling.jpg",
      volumes: 8,
      status: "Completed",
      year: 2018,
      synopsis: "In a world where hunters — humans who possess magical abilities — must battle deadly monsters to protect humanity, Sung Jinwoo is known as the 'World's Weakest Hunter.' After surviving a near-death experience in a double dungeon, he awakens with a mysterious system that allows only him to level up endlessly. What begins as survival becomes a relentless climb to the top of a world where power is everything.",
      soldOut: true
    },
    {
      id: 3,
      title: "The Apothecary Diaries",
      author: "Hyūganatsu",
      genre: "Mystery, Romance",
      price_usd: 13.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/apothecary-diares.jpg",
      volumes: 12,
      status: "Ongoing",
      year: 2017,
      synopsis: "Maomao, a pharmacist's daughter with a sharp mind and sharper tongue, is kidnapped and sold as a servant in the imperial palace. Rather than keeping her head down, she cannot resist investigating a string of mysterious illnesses befalling the Emperor's consorts. Her medical knowledge catches the eye of Jinshi, a beautiful and powerful eunuch, who makes her his personal food taster. A slow-burn mystery set against the backdrop of ancient imperial China."
    },
    {
      id: 4,
      title: "The Beginning After The End",
      author: "TurtleMe",
      genre: "High Fantasy",
      price_usd: 14.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/the-beginning-after-the-end-31381.jpg",
      volumes: 10,
      status: "Ongoing",
      year: 2018,
      synopsis: "King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Reincarnated into a new world filled with magic and monsters, he is given a second chance to relive his life. Correcting the mistakes of his past will not be his only challenge, however. Underneath the peace and prosperity of the new world is an undercurrent threatening to destroy everything he has worked for."
    },
    {
      id: 5,
      title: "Delicious in Dungeon",
      author: "Ryoko Kui",
      genre: "Adventure, Cooking",
      price_usd: 6.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/9781975367985_manga-delicious-in-dungeon-manga-volume-12-primary.jpg",
      volumes: 14,
      status: "Completed",
      year: 2015,
      synopsis: "After his sister is devoured by a Red Dragon deep in a dungeon, adventurer Laios sets out to rescue her before she's fully digested. Running low on gold and supplies, he makes a drastic decision: eat the monsters they defeat. What follows is a uniquely charming adventure that blends dungeon-crawling action with surprisingly detailed fantasy cooking, monster biology, and a cast of delightfully eccentric characters. Winner of multiple manga awards."
    },
    {
      id: 6,
      title: "Omniscient Reader's Viewpoint",
      author: "Sing Shong",
      genre: "Action, Fantasy",
      price_usd: 11.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/omniscient-readers-viewpoint-2.jpeg",
      volumes: 7,
      status: "Ongoing",
      year: 2020,
      synopsis: "Kim Dokja is the sole reader of an obscure web novel called 'Three Ways to Survive the Apocalypse.' When the world suddenly transforms into the story he knows by heart, he alone understands how to survive it. Armed with knowledge of every plot twist and character arc, he sets out to rewrite the ending — but the more he interacts with the story, the more he realises he was never just a reader. A meta-narrative masterpiece that rewards fans of isekai and web fiction culture."
    },
    {
      id: 7,
      title: "Eleceed",
      author: "Son Je-ho",
      genre: "Action, Fantasy",
      price_usd: 14.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/eleceed.jpg",
      volumes: 6,
      status: "Ongoing",
      year: 2019,
      synopsis: "Jiwoo is a kind-hearted young man with extraordinary speed and reflexes who secretly uses his powers to help people and animals in need. One day he takes in an injured, round, fluffy cat — who turns out to be Kayden, one of the world's most powerful awakened agents hiding in animal form. An unlikely partnership forms as Jiwoo is dragged into the hidden world of awakened humans. Packed with kinetic action, great comedy, and surprising heart."
    },
    {
      id: 8,
      title: "Eternally Regressing Knight",
      author: "Lee Hyunmin",
      genre: "Fantasy, Adventure",
      price_usd: 11.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/eternally-regressing-knight.webp",
      volumes: 4,
      status: "Ongoing",
      year: 2022,
      synopsis: "Encrid, an ordinary soldier with no special talent, has one ability that sets him apart: when he dies, he wakes up at the start of the same day. He has lived and died through this single day countless times, spending countless lifetimes mastering swordsmanship and combat purely through repetition. When that day finally changes, he is thrust into a wider world — one where he is perhaps the most experienced warrior alive, in a body that shows none of it."
    },
    {
      id: 9,
      title: "Heaven Official's Blessing",
      author: "Mo Xiang Tong Xiu",
      genre: "Xianxia",
      price_usd: 24.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/heaven-official's-blessing.jpg",
      volumes: 8,
      status: "Completed",
      year: 2017,
      synopsis: "Eight hundred years ago, Xie Lian was the beloved Crown Prince of the Xianle kingdom who ascended to the heavens — twice — before being cast out both times. Now, ascending a third time as a penniless god with zero followers, he encounters Hua Cheng, a devastating ghost king feared across three realms. A sweeping, gorgeous cultivation romance spanning centuries, filled with mystery, myth, and one of the most beloved slow-burn love stories in modern Chinese literature."
    },
    {
      id: 10,
      title: "Grandmaster of Demon Cultivation",
      author: "Mo Xiang Tong Xiu",
      genre: "Xianxia, Danmei",
      price_usd: 19.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/grandmaster-of-demon-cultivation.jpg",
      volumes: 5,
      status: "Completed",
      year: 2015,
      synopsis: "Wei Wuxian was once the most powerful and innovative cultivator of his era — until his controversial methods led to his death at the hands of his own allies. Thirteen years later he is reborn in the body of a lunatic, and crosses paths again with Lan Wangji, the man who was once his greatest rival. Together they unravel a dark conspiracy that has haunted the cultivation world since Wei Wuxian's death. The genre-defining danmei novel that launched a global phenomenon."
    },
    {
      id: 11,
      title: "Frieren: Beyond Journey's End",
      author: "Kanehito Yamada",
      genre: "Adventure, Fantasy",
      price_usd: 13.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/manga-frieren.jpeg",
      volumes: 11,
      status: "Ongoing",
      year: 2020,
      synopsis: "After a decade-long quest to defeat the Demon King, the hero's party returns victorious. For the elf mage Frieren, who will live for centuries, what felt like a brief adventure was a lifetime for her human companions. When the hero Himmel passes away of old age, Frieren is struck by how little she really knew him. She sets out on a new journey — not to save the world, but to understand it, and the people she failed to truly see while she had the chance."
    },
    {
      id: 12,
      title: "Yona of the Dawn",
      author: "Mizuho Kusanagi",
      genre: "Adventure, Romance",
      price_usd: 15.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/yona-of-the-dawn-6725.jpg",
      volumes: 38,
      status: "Ongoing",
      year: 2009,
      synopsis: "Princess Yona has lived a sheltered, privileged life — until the night her beloved father is murdered and her childhood friend Soo-won seizes the throne. Fleeing the palace with only her loyal bodyguard Hak, Yona must survive in a kingdom she never truly knew. Her journey to reclaim her home transforms her from a naive girl into a formidable leader, as she gathers legendary warriors and discovers who she was always meant to be."
    },
    {
      id: 13,
      title: "Snow White with the Red Hair",
      author: "Sorata Akiduki",
      genre: "Romance",
      price_usd: 11.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/Snow-White-with-the-Red-Hair-1-Cover.png",
      volumes: 25,
      status: "Completed",
      year: 2006,
      synopsis: "Shirayuki is an herbalist with a rare and striking head of red hair. When the prince of her kingdom demands she become his concubine, she refuses and flees — only to be rescued by Zen, the second prince of a neighboring land. What follows is a sweet, warm-hearted romance between two people who fall for each other through genuine respect and admiration. A rare shoujo manga that centres not on drama and misunderstanding, but on two capable people choosing each other."
    },
    {
      id: 14,
      title: "Horimiya",
      author: "HERO & Daisuke Hagiwara",
      genre: "Romance",
      price_usd: 11.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/horimiyajpg.jpg",
      volumes: 16,
      status: "Completed",
      year: 2011,
      synopsis: "Kyouko Hori is popular, bright, and admired at school — but at home she's a harried caretaker for her younger brother while her parents work long hours. Izumi Miyamura seems plain and gloomy in class, but outside school he's covered in tattoos and piercings. When their hidden selves collide, an unlikely friendship and eventually romance blossoms. A grounded, genuinely funny slice-of-life manga about the gap between who we show the world and who we really are."
    },
    {
      id: 15,
      title: "Kill the Villainess",
      author: "Haegi & Your April",
      genre: "Drama, Romance",
      price_usd: 11.99,
      cover_img: "/WD3_Project_Sem2_MangaWebsite/Project/images/kill-the-villainess-manhwa.jpg",
      volumes: 3,
      status: "Completed",
      year: 2020,
      synopsis: "A modern Korean woman wakes up in the body of Eris Miserian, the villainess of a romance novel — the cruel noblewoman destined to die so the saintly heroine can have her happy ending. Fully aware of the story's plot, she has no interest in playing her scripted role. Her single goal: escape this fictional world by any means necessary, even if it means engineering her own death before the narrative does it for her. A sharp, darkly funny deconstruction of the isekai villainess genre."
    }
  ];
  
  // Currency config — rates relative to USD
  const CURRENCIES = {
    USD: { symbol: '$',   rate: 1,       label: 'USD — US Dollar' },
    JMD: { symbol: 'J$', rate: 157.5,   label: 'JMD — Jamaican Dollar' },
    YEN: { symbol: '¥',  rate: 149.8,   label: 'JPY — Japanese Yen' }
  };
  
  function getSavedCurrency() {
    return localStorage.getItem('yomite-currency') || 'USD';
  }
  
  function saveCurrency(code) {
    localStorage.setItem('yomite-currency', code);
  }
  
  function formatPrice(priceUSD) {
    if (priceUSD === null || priceUSD === undefined) return '';
    const code = getSavedCurrency();
    const cur  = CURRENCIES[code];
    const val  = priceUSD * cur.rate;
    // YEN never shows decimals; JMD rounds to nearest dollar; USD 2dp
    if (code === 'YEN') return `${cur.symbol}${Math.round(val).toLocaleString()}`;
    if (code === 'JMD') return `${cur.symbol}${Math.round(val).toLocaleString()}`;
    return `${cur.symbol}${val.toFixed(2)}`;
  }
  
  function getBookById(id) {
    return BOOKS.find(b => b.id === parseInt(id));
  }