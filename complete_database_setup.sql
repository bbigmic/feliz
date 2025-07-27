-- =====================================================
-- KOMPLETNY SQL DLA BAZY DANYCH FELIZTRADE
-- Utworzenie tabel zgodnie z finalnym modelem
-- + Wszystkie dane z bazy
-- =====================================================

-- Usuń istniejące tabele (jeśli istnieją)
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
DROP TABLE IF EXISTS "SoftwareImage" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Software" CASCADE;
DROP TABLE IF EXISTS "Component" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- =====================================================
-- TWORZENIE TABEL
-- =====================================================

-- Tabela User
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "marketingAccepted" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Tabela Software
CREATE TABLE "Software" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "categories" TEXT NOT NULL DEFAULT '[]',
    "demoUrl" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "sales" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- Tabela SoftwareImage
CREATE TABLE "SoftwareImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "isThumbnail" BOOLEAN NOT NULL DEFAULT false,
    "softwareId" INTEGER NOT NULL,

    CONSTRAINT "SoftwareImage_pkey" PRIMARY KEY ("id")
);

-- Tabela Order
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "productId" INTEGER,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "info" TEXT,
    "orderType" TEXT NOT NULL DEFAULT 'demo',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeSessionId" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "marketingAccepted" BOOLEAN NOT NULL DEFAULT false,
    "demoConsentAccepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Tabela Component
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priceFrom" INTEGER NOT NULL,
    "priceTo" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- INDEKSY I KLUCZE OBCE
-- =====================================================

-- Indeksy
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Klucze obce
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SoftwareImage" ADD CONSTRAINT "SoftwareImage_softwareId_fkey" 
    FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- =====================================================
-- DANE UŻYTKOWNIKÓW
-- =====================================================

INSERT INTO "User" ("id", "email", "passwordHash", "createdAt", "termsAccepted", "marketingAccepted", "isAdmin") VALUES
(3, 'admin@feliztradeltd.com', '$2b$10$a3o9QmleLbtnGfEB4wo9ruwEtpXyOJAPViMvVlrY9WkbqcLPTjTt2', '2025-07-25T09:07:42.968Z', true, true, true);

-- =====================================================
-- DANE OPROGRAMOWANIA
-- =====================================================

INSERT INTO "Software" ("id", "name", "description", "price", "categories", "demoUrl", "features", "rating", "sales", "status", "createdAt") VALUES
(1, 'Platforma E-commerce', 'Kompletna platforma e-commerce z systemem płatności i panelem zarządzania użytkownikami i analizą', 8900, '["E-commerce","Strona Internetowa"]', 'https://youngcoco.pl/', '["Responsywny design","System płatności","Panel admin","SEO friendly"]', 4.8, 45, 'inactive', '2025-07-24T18:33:03.635Z'),
(2, 'Landing page usług Twojej firmy', 'Strona lądowania z ofertą usług', 2900, '["Landing Page","Usługi"]', 'https://www.grupaautospectrum.com/', '["Responsywny design","Oferta z cennikiem","Kontakt","Integracja social media"]', 4.9, 41, 'active', '2025-07-24T18:33:03.635Z'),
(3, 'Zarządzanie restauracją', 'System zarządzania restauracją z zamówieniami online', 2900, '["Restauracja","Strona Internetowa"]', 'https://piecyk.vercel.app', '["Zamawianie online","Zarządzanie menu","Śledzenie postepu zamówienia","Zamawianie online"]', 4.8, 28, 'active', '2025-07-24T18:33:03.635Z'),
(4, 'Portal Nieruchomości', 'Profesjonalna strona internetowa dla biura nieruchomości', 4400, '["Nieruchomości","Strona Internetowa"]', 'https://grupaborys.com', '["Lista nieruchomości","Formularz kontaktowy","O firmie"]', 4.8, 19, 'active', '2025-07-24T18:33:03.635Z'),
(5, 'Platforma Learningowa', 'Platforma e-learningowa z kursami online i zarządzaniem ofertą edukacyjną', 11900, '["Strona Internetowa","Szkolenia"]', 'https://trawersadr.pl/', '["Kursy i szkolenia","Testy dla studentów","Transfer dokumentów","Certyfikaty","Panel administratora"]', 4.9, 41, 'active', '2025-07-24T18:33:03.635Z'),
(6, 'Aplikacja SaaS (Software as a Service)', 'Aplikacja do generowania QR kodów do wystawiania opinii w Google Twojej firmie', 9000, '["SaaS","QR kod"]', 'https://www.qropinie.pl/', '["Generowanie QR kodu","API Google","Panel analityczny","Program afiliacyjny","Bramka płatności"]', 4.9, 41, 'active', '2025-07-24T18:33:03.635Z'),
(7, 'Landing Page Komory hiperbaryczne', 'Strona wizytówka, cennik i kontakt', 2900, '["Landing Page","Usługi"]', 'https://heartfelt-tarsier-96534b.netlify.app/', '["Landing Page","Kontakt","Oferta","Zapis rezerwacji w Google"]', 5, 0, 'active', '2025-07-25T14:07:13.794Z'),
(8, 'AI Rooms App', 'Aplikacja do uruchamiania rozmowy między dwoma modelami AI', 4900, '["Blockchain","AI"]', 'https://ai-rooms.vercel.app/', '["Blockchain","AI Integration","SaaS","Crypto Payment","Multilingual"]', 5, 0, 'active', '2025-07-25T17:22:21.772Z'),
(9, 'Wypożyczalnia rowerów elektrycznych', 'Strona internetowa z ofertą rowerów możliwością rezerwacji terminów', 3900, '["Wypożyczalnia","Strona Internetowa"]', 'https://deft-dolphin-f095e0.netlify.app/', '["Kalendarz","Rezerwacje","Wybór oferty","Płatności online"]', 5, 0, 'active', '2025-07-25T18:05:11.085Z'),
(10, 'Pseudo Casino', 'Pseudo-casino z różnymi typami gier gotowe do rozwoju o kolejne', 24900, '["Gry"]', 'https://onisac.vercel.app/', '["Rejestracja użytkowników","Punkty i ich wydawanie","Zdobywanie punktów","Poziomy i ranking użytkowników"]', 5, 0, 'active', '2025-07-25T19:02:54.016Z');

-- =====================================================
-- DANE ZDJĘĆ OPROGRAMOWANIA
-- =====================================================

INSERT INTO "SoftwareImage" ("id", "url", "isThumbnail", "softwareId") VALUES
(27, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753469943/di7czesrhveotafomidl.png', true, 10),
(28, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753470021/ewfelazn0hknn5f2q6s7.png', false, 10),
(29, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753463833/auhcbfdbrfsyc0cgqwwg.png', true, 8),
(30, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753464124/eqgkkx5gi198bbbxoybb.png', false, 8),
(37, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201094/a7v2w0qcxvsso6dgq78g.png', true, 1),
(42, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753467014/tj77gerarfy2dyty7icd.png', false, 9),
(43, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753470201/v54ghu8pa3yfwrfzdjkn.png', true, 9),
(70, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201045/msvto7zyjjjaxcce2tkx.png', true, 5),
(71, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623543/ckjowqim0lgbk2soznme.png', false, 5),
(72, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623545/ymsx8j78o8itybrgqdsr.png', false, 5),
(73, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623547/qnzl7krmc30whxa0zwia.png', false, 5),
(74, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623547/ahrzemcrjrwy1znp1qdn.png', false, 5),
(75, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623721/ixyy3dl2vxtgjiuxstrx.png', false, 5),
(76, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623727/dcmmnzmeoo1gwhb1y34s.png', false, 5),
(77, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623908/mafewusoqno9mx7i2gbq.png', false, 5),
(78, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624007/bqdsei16si6bqlwqm1pa.png', false, 5),
(79, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201061/c5zwsyksrvjlop16mytj.png', true, 4),
(80, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624158/eyrsz2pnqmylotdi05yl.png', false, 4),
(81, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624160/jnwn5xne0uyd2ybsoxvy.png', false, 4),
(82, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624186/k35g5ablel0lrobmieyz.png', false, 4),
(85, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201069/mitw1hwjbxqpy9vzjifz.png', true, 2),
(86, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624376/dane8vzvnbw0ldbfaayu.png', false, 2),
(87, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624378/yuig38qpy0vkf9njptly.png', false, 2),
(88, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753452424/emh859lesfo8iklpjjyr.png', true, 7),
(89, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624532/ms5fr7glpw3e6chq7xgx.png', false, 7),
(90, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624533/d58rqppupdzo693bebmz.png', false, 7),
(91, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624534/cgt8ix42xxknyqivkqsb.png', false, 7),
(92, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624534/ucnxdmaookrfyt1anuyf.png', false, 7),
(93, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624535/weiipev36vqcc4kubs4.png', false, 7),
(94, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201034/v2w1juabqzud3atcevpz.png', true, 6),
(95, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624291/t0acvcuece24k7qcohsa.png', false, 6),
(96, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625426/zut5kpdw3jzairw8f4dl.png', false, 6),
(97, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625427/zohcysf3mdxtstpsskcv.png', false, 6),
(98, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625428/etl2pzpcu5nkpjnd47k9.png', false, 6),
(99, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625429/kljjkjquyujdl4wmzuxk.png', false, 6),
(100, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201086/wk64sshtjei6wgvlgxxu.png', true, 3),
(101, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625505/gencchevgftkfycahj4x.png', false, 3);

-- =====================================================
-- DANE ZAMÓWIEŃ
-- =====================================================

INSERT INTO "Order" ("id", "userId", "productId", "email", "phone", "info", "orderType", "status", "createdAt", "stripeSessionId", "termsAccepted", "marketingAccepted", "demoConsentAccepted") VALUES
(1, 3, NULL, 'admin@feliztradeltd.com', '23423', 'eadfcc', 'consultation', 'pending', '2025-07-25T09:32:16.260Z', 'cs_test_a1ePJLefcuNJq1W4YDUORyu3yDRsv3cgiUzYkw4eq0UfpqMEZqZsBFcoMy', true, false, false),
(2, NULL, 7, 'borys.michal.8.8@gmail.com', '3243324', '23423', 'demo', 'pending', '2025-07-25T14:15:28.482Z', 'cs_test_a1F2cm0VdfeZOn703woB84UTAgvQIz8pAkNbgnDgTqWvMcXYgHA7mv5n7g', true, true, false),
(3, 3, 7, 'admin@feliztradeltd.com', '423234', 'fsdv', 'demo', 'pending', '2025-07-25T14:23:22.502Z', 'cs_test_a14uVDgoe7XLCPe2QUdsM0mArGmT9tEvkdGWlF9nS8te6gUnOQfhL6ejcr', true, false, false),
(4, NULL, 7, 'borys.michal.8.8@gmail.com', '233223', 'sdfasdf', 'demo', 'pending', '2025-07-25T14:27:46.326Z', 'cs_test_a1xgNFymDW1nxdV0Hu5Cms5KzmW0IWrYOuNO66ZvaWT6K6qf4xJolYrM3', true, true, false),
(5, NULL, NULL, 'user1@example.com', '669999933', 'Potrzebuje chatbot na moja stronę ', 'consultation', 'pending', '2025-07-26T22:05:33.215Z', 'cs_test_a1hfzUJa0i9kdiAt7jhwvNqOO9AiIHuzkgQDlTVIwrvVmo4HOJgmsaTyfM', true, false, false),
(6, NULL, 3, 'adradriaanoo@gmail.com', '222222222', '<3', 'demo', 'pending', '2025-07-27T05:41:52.937Z', 'cs_test_a1v8DZJhWWftxyjtRfDRDgldu8e6oDFrTcybAi14V8TiC9VxfECmzu4HL1', true, true, false),
(7, NULL, NULL, 'adradriaanoo@gmail.com', '2222222222', '12334', 'consultation', 'pending', '2025-07-27T05:42:29.628Z', 'cs_test_a1f4eZxKu0diJQlArAYPU9SWiZ7UgLfbIyjBZTZaDHCfZ7ZNqEaBQYXTPn', true, true, false),
(8, NULL, NULL, 'lamariia.gangsta@gmail.com', '802811799', 'Co tu się odjaniepawla', 'consultation', 'pending', '2025-07-27T08:19:17.001Z', 'cs_test_a1z8qfC5JburGnIohETIbNaj3IPjqYqM64zsovwZq1uO9ZpyfNgX4fRt4l', true, false, false),
(9, NULL, NULL, 'adradriaanoo@gmail.com', '54151515', NULL, 'consultation', 'pending', '2025-07-27T08:20:11.045Z', 'cs_test_a1e19DGoKWgm4axKxWpqn309KE0ZPcOGepS7ij73saXBzo4tpXwXKI1RUu', true, true, false),
(10, 3, 4, 'admin@feliztradeltd.com', '43343434', NULL, 'demo', 'pending', '2025-07-27T12:06:15.211Z', 'cs_test_a1Od3WVPKXQw2SfPGG0XOGwEjHrqmAyxYzyG31ps0PgF32zVmv1aVjACrC', true, false, false),
(11, NULL, 6, 'borysm32@gmail.com', '342423', NULL, 'demo', 'pending', '2025-07-27T12:30:57.556Z', 'cs_test_a1R9CkyqNx3A7lmX7TVVYt5cNZhb5FEurPJOO84dSF2h4QhlMM3zJIW6a0', true, false, false),
(12, NULL, NULL, 'domink.xxx@interia.pl', '785785786', NULL, 'consultation', 'pending', '2025-07-27T12:46:01.788Z', 'cs_test_a1bp6JHgCVVS9Tj4X3bNGHBrep8HJqEG1MDKG27nibTnchDd0JjDsneL7a', true, false, false),
(13, NULL, NULL, 'user@example.com', '888666543', 'chciałbym stronę do sprzedaży mojego produktu fizycznego', 'consultation', 'pending', '2025-07-27T15:53:19.725Z', 'cs_test_a1VFLC3nxtNyl4RfSDAAllT6UWon9S8t1Xuz32lSbq1h46uL3DTdQ8BHYF', true, false, true),
(14, 3, 2, 'admin@feliztradeltd.com', '78966896987', 'chcialbym taka strone tylko dla moich uslug', 'demo', 'pending', '2025-07-27T16:02:31.823Z', 'cs_test_a1S6eNyMJsXGUb3p0QfWs5xhp5MbLVY4RmWzl0Hq3nGfRZSLyWX3IGmfVm', true, false, true),
(15, NULL, 6, 'user5@example.com', '99942384', 'Chcialem cos podobnego, opowiem przez telefon', 'demo', 'pending', '2025-07-27T16:14:04.559Z', 'cs_test_a1emIzZ5DV1M4nZSjzcSN32VRaZ7PCDXt92VZBQfBH280TNwjIj5Wdg4BV', true, false, true),
(16, 3, NULL, 'admin@feliztradeltd.com', '32323', 'asdfsdf', 'consultation', 'pending', '2025-07-27T16:43:41.373Z', 'cs_test_a1GeLjEstOAtSooFUCRfFYddgoV0L4YcOTVQFBxAYE1m1vmcmq2iQigxXx', true, false, true),
(17, NULL, 6, 'borysm32@gmail.com', '234r23', 'asdvfsfda', 'demo', 'pending', '2025-07-27T16:48:32.384Z', 'cs_test_a1qTjhPxJn6caUfjxV1RyDCIUhEwOxdJ5UcFT5b6Qo3yUUjkdWd5HgN24S', true, false, true);

-- =====================================================
-- DANE KOMPONENTÓW
-- =====================================================

INSERT INTO "Component" ("id", "name", "priceFrom", "priceTo", "notes") VALUES
(1, 'Integracja Blockchain / Kryptowaluty', 10000, 50000, 'Connect Wallet, wdrożenie pary kryptowalutowej'),
(2, 'Autoryzacja / logowanie', 4000, 15000, 'System użytkowników, logowanie emailem / telefonem / Z OTP / social login'),
(3, 'Integracja z API', 6000, 40000, 'Zależnie od liczby i trudności'),
(4, 'Panel administratora', 5000, 30000, 'Dashboard, zarządzanie użytkownikami'),
(5, 'Powiadomienia push/email', 3000, 20000, 'Firebase / OneSignal / mail / sms'),
(6, 'System płatności', 5000, 45000, 'Stripe, PayPal, Przelewy24, BLIK'),
(7, 'Geolokalizacja / mapy', 9000, 50000, 'Mapy Google / OpenStreetMap'),
(8, 'AI / ML funkcje', 10000, 180000, 'np. OpenAI API, lokalny model, agenci AI, rekomendacje'),
(9, 'Chat / komunikator', 12000, 30000, 'WebSocket, live chat'),
(10, 'CMS (własny)', 6000, 40000, 'custom - blogi, dodawanie i edycja treści'),
(11, 'Strona internetowa wizytówka', 3000, 12000, 'Strona ze statycznymi danymi'),
(12, 'Dodatkowa podstrona', 1000, 6000, 'Dodatkowa podstrona na Twojej stronie internetowej.'),
(13, 'Strona kompatybilna z aplikacją', 5000, 20000, 'Zarządzanie produktami, użytkownikami'),
(14, 'Asystent AI (z wiedzą o twoim biznesie)', 2500, 20000, 'Widżet chatbot AI osadzony na stronie / osobna aplikacja Chat (jak ChatGPT)');

-- =====================================================
-- RESET SEKWENCJI ID
-- =====================================================

-- Reset sekwencji dla wszystkich tabel
SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"), true);
SELECT setval('"Software_id_seq"', (SELECT MAX(id) FROM "Software"), true);
SELECT setval('"SoftwareImage_id_seq"', (SELECT MAX(id) FROM "SoftwareImage"), true);
SELECT setval('"Order_id_seq"', (SELECT MAX(id) FROM "Order"), true);
SELECT setval('"Component_id_seq"', (SELECT MAX(id) FROM "Component"), true);

-- =====================================================
-- KONIEC
-- =====================================================

-- Sprawdź czy wszystko zostało utworzone poprawnie
SELECT 'Database setup completed successfully!' as status; 