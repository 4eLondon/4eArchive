-- Insert books with realistic prices
INSERT INTO books (id, title, author, genre, cover_img, price) VALUES
(1, 'The Greatest Estate Developer', 'BK_Moon', 'Isekai, Comedy', '/WD3_Project_Sem2_MangaWebsite/Project/images/The-Greatest-Estate-Developer-1 copy.png', 9.99),
(2, 'Solo Leveling', 'Chugong', 'Action, Fantasy', '/images/solo-leveling.jpg', 14.99),
(3, 'The Apothecary Diaries', 'Hyūganatsu', 'Mystery, Romance', '/WD3_Project_Sem2_MangaWebsite/Project/images/apothecary-diares.jpg', 13.99),
(4, 'The Beginning After The End', 'TurtleMe', 'High Fantasy', '/WD3_Project_Sem2_MangaWebsite/Project/images/the-beginning-after-the-end-31381.jpg', 14.99),
(5, 'Delicious in Dungeon', 'Ryoko Kui', 'Adventure, Cooking', '/images/delicious-in-dungeon.jpg', 6.99),
(6, 'Omniscient Reader\'s Viewpoint', 'Sing-Shong', 'Action, Fantasy', '/images/omniscient-readers-viewpoint.jpg', 11.99),
(7, 'Eleceed', 'Jeon Geuk-Jin', 'Action, Supernatural', '/images/eleceed.jpg', 14.99),
(8, 'Eternally Regressing Knight', 'Toika', 'Action, Fantasy', '/images/eternally-regressing-knight.jpg', 11.99),
(9, 'Heaven Official\'s Blessing', 'Mo Xiang Tong Xiu', 'Fantasy, Romance', '/images/heaven-officials-blessing.jpg', 24.99),
(10, 'Grandmaster of Demon Cultivation', 'Mo Xiang Tong Xiu', 'Fantasy, Romance', '/images/grandmaster-of-demon-cultivation.jpg', 19.99),
(11, 'Frieren: Beyond Journey\'s End', 'Kanehito Yamada', 'Adventure, Fantasy', '/images/frieren-beyond-journeys-end.jpg', 13.99),
(12, 'Yona of the Dawn', 'Mizuho Kusanagi', 'Adventure, Romance', '/images/yona-of-the-dawn.jpg', 15.99),
(13, 'Snow White with the Red Hair', 'Sorata Akiduki', 'Romance, Fantasy', '/images/snow-white-with-red-hair.jpg', 11.99),
(14, 'Horimiya', 'HERO & Daisuke Hagiwara', 'Romance, Comedy', '/images/horimiya.jpg', 11.99),
(15, 'Kill the Villainess', 'Lee Ina', 'Fantasy, Reverse Harem', '/images/kill-the-villainess.jpg', 11.99),
(16, 'Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka', 'J.C.Staff', 'Action, Adventure', '/images/is-it-wrong-to-try-to-pick-up-girls-in-a-dungeon.jpg', 10.99),
(17, 'Jujutsu Kaisen', 'Gege Akutami', 'Action, Supernatural', '/images/jujutsu-kaisen.jpg', 18.99),
(18, 'Attack on Titan', 'Hajime Isayama', 'Action, Fantasy', '/images/attack-on-titan.jpg', 17.99),
(19, 'Demon Slayer', 'Koyoharu Gotouge', 'Action, Supernatural', '/images/demon-slayer.jpg', 16.99),
(20, 'Chainsaw Man', 'Tatsuki Fujimoto', 'Action, Supernatural', '/images/chainsaw-man.jpg', 15.99);

-- If books already exist, update their prices instead
-- Uncomment if you want to use UPDATE instead:
-- UPDATE books SET price = 9.99 WHERE id = 1;
-- UPDATE books SET price = 14.99 WHERE id = 2;
-- etc...