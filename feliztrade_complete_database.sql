-- =====================================================
-- KOMPLETNY SQL DLA BAZY DANYCH FELIZTRADE
-- Utworzenie tabel zgodnie z finalnym modelem
-- + Wszystkie dane z bazy (13 oprogramowań, 14 komponentów, 1 użytkowników)
-- + Wszystkie tłumaczenia angielskie
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
    "categoriesEn" TEXT,
    "demoUrl" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "sales" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descriptionEn" TEXT,
    "featuresEn" TEXT,
    "nameEn" TEXT,

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
    "selectedCategory" TEXT,
    "language" TEXT NOT NULL DEFAULT 'pl',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Tabela Component
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priceFrom" INTEGER NOT NULL,
    "priceTo" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "nameEn" TEXT,
    "notesEn" TEXT,

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
-- DANE OPROGRAMOWANIA (13 oprogramowań z tłumaczeniami)
-- =====================================================

INSERT INTO "Software" ("id", "name", "nameEn", "description", "descriptionEn", "price", "categories", "categoriesEn", "demoUrl", "features", "featuresEn", "rating", "sales", "status", "createdAt") VALUES
(6, 'Aplikacja SaaS (Software as a Service)', 'SaaS Application (Software as a Service)', 'Aplikacja do generowania QR kodów do wystawiania opinii w Google Twojej firmie', 'Application for generating QR codes to post Google reviews for your company', 9000, '["SaaS","QR Kod","Panel Administratora"]', '["SaaS","QR Code","Admin Panel"]', 'https://www.qropinie.pl/', '["Generowanie QR kodu","API Google","Panel analityczny","Program afiliacyjny","Bramka płatności"]', '["QR code generation","Google API","Analytics panel","Affiliate program","Payment gateway"]', 4.9, 41, 'active', '2025-07-24T18:33:03.635Z'),
(7, 'Landing Page Komory hiperbaryczne', 'Hyperbaric Chamber Landing Page', 'Wizytówka, cennik i dane kontaktowe do usług komór hiperbarycznych. Profesjonalna prezentacja usług medycznych.', 'Business card, pricing and contact information for hyperbaric chamber services. Professional presentation of medical services.', 2900, '["Landing Page","Usługi"]', '["Landing Page","Services"]', 'https://heartfelt-tarsier-96534b.netlify.app/', '["Landing Page","Kontakt","Oferta","Zapis rezerwacji w Google"]', '["Landing Page","Contact","Offer","Google Calendar booking"]', 5, 0, 'active', '2025-07-25T14:07:13.794Z'),
(9, 'Wypożyczalnia rowerów elektrycznych', 'Electric Bike Rental', 'Strona internetowa z ofertą rowerów możliwością rezerwacji terminów', 'Website with bike offer and ability to reserve time slots', 3900, '["Wypożyczalnia","Strona Internetowa"]', '["Rental","Website"]', 'https://deft-dolphin-f095e0.netlify.app/', '["Kalendarz","Rezerwacje","Wybór oferty","Płatności online"]', '["Calendar","Reservations","Offer selection","Online payments"]', 5, 0, 'active', '2025-07-25T18:05:11.085Z'),
(13, 'Generator QR kodu do własnego linku', 'QR Code Generator for Custom Link', 'Wygeneruj QR kod do linku lub innych własnych danych i zmodyfikuj jego wygląd zmieniając kształt, kolor lub dodając logo. Pobierz QR kod w różnych formatach i rozdzielczościach.', 'Generate QR code for link or other custom data and modify its appearance by changing shape, color or adding logo. Download QR code in various formats and resolutions.', 15900, '["Monetyzacja CPM","QR Kod"]', '["CPM Monetization", "QR Code"]', 'https://www.kodqr.eu/', '["QR kod","Free","Monetyzacja CPM"]', '["QR code","Free","CPM monetization"]', 5, 0, 'active', '2025-07-29T22:40:11.828Z'),
(3, 'Zarządzanie restauracją', 'Restaurant Management', 'System zarządzania restauracją z zamówieniami online', 'Restaurant management system with online ordering', 2900, '["Restauracja","Strona Internetowa"]', '["Restaurant","Website"]', 'https://piecyk.vercel.app', '["Zamawianie online","Zarządzanie menu","Śledzenie postepu zamówienia","Zamawianie online"]', '["Online ordering","Menu management","Order tracking","Online ordering"]', 4.8, 28, 'active', '2025-07-24T18:33:03.635Z'),
(4, 'Portal Nieruchomości', 'Real Estate Portal', 'Profesjonalna strona internetowa dla biura nieruchomości', 'Professional website for real estate agency', 4400, '["Nieruchomości","Strona Internetowa"]', '["Real Estate","Website"]', 'https://grupaborys.com', '["Lista nieruchomości","Formularz kontaktowy","O firmie"]', '["Property listings","Contact form","About us"]', 4.8, 19, 'active', '2025-07-24T18:33:03.635Z'),
(1, 'Platforma E-commerce', 'E-commerce Platform', 'Kompletna platforma e-commerce z systemem płatności i panelem zarządzania użytkownikami i analizą.', 'Complete e-commerce platform with payment system and user management panel with analytics.', 8900, '["E-commerce","Sklep Internetowy","Panel Administratora"]', '["E-commerce","Website","Admin Panel"]', 'https://youngcoco.pl/', '["Responsywny design","System płatności","Panel admin","SEO friendly"]', '["Responsive design","Payment system","Admin panel","SEO friendly"]', 4.8, 45, 'inactive', '2025-07-24T18:33:03.635Z'),
(8, 'AI Rooms App', 'AI Rooms App', 'Aplikacja do inicjowania rozmów między dwoma modelami AI. Zaawansowany interfejs czatu z konfigurowalnymi osobowościami AI i ustawieniami konwersacji.', 'Application for initiating conversations between two AI models. Advanced chat interface with configurable AI personalities and conversation settings.', 4900, '["Blockchain","AI"]', '["Blockchain","AI"]', 'https://ai-rooms.vercel.app/', '["Blockchain","AI Integration","SaaS","Crypto Payment","Multilingual"]', '["Blockchain","AI Integration","SaaS","Crypto Payment","Multilingual"]', 5, 1, 'active', '2025-07-25T17:22:21.772Z'),
(2, 'Landing page usług Twojej firmy', 'Landing page for your company services', 'Strona lądowania z ofertą usług', 'Landing page with service offer', 2900, '["Landing Page","Usługi"]', '["Landing Page","Services"]', 'https://www.grupaautospectrum.com/', '["Responsywny design","Oferta z cennikiem","Kontakt","Integracja social media"]', '["Responsive design","Service pricing","Contact","Social media integration"]', 4.9, 42, 'active', '2025-07-24T18:33:03.635Z'),
(10, 'Casino Game', 'Casino Game', 'Casino z różnymi typami gier gotowe do rozwoju o kolejne funkcjonalności i gry. Kompletna platforma gamingowa z gotowym systemem użytkowników i nagród.', 'Casino with various types of games ready for development of additional features and games. Complete gaming platform with ready user and reward system.', 24900, '["Gry"]', '["Games"]', 'https://onisac.vercel.app/', '["Rejestracja użytkowników","Punkty i ich wydawanie","Zdobywanie punktów","Poziomy i ranking użytkowników"]', '["User registration","Points and their spending","Earning points","User levels and ranking"]', 5, 0, 'active', '2025-07-25T19:02:54.016Z'),
(5, 'Platforma Learningowa', 'Learning Platform', 'Platforma e-learningowa z kursami online i zarządzaniem ofertą edukacyjną', 'E-learning platform with online courses and educational offer management', 11900, '["Strona Internetowa","Szkolenia","Panel Administratora"]', '["Website","Training","Admin Panel"]', 'https://trawersadr.pl/', '["Kursy i szkolenia","Testy dla studentów","Transfer dokumentów","Certyfikaty","Panel administratora"]', '["Courses and training","Student tests","Document transfer","Certificates","Admin panel"]', 4.9, 41, 'active', '2025-07-24T18:33:03.635Z'),
(11, 'Platforma do zarządzania restauracją', 'Restaurant Management Platform', 'System do zarządzania restauracją - modyfikowalne menu, składanie zamówień online do stolika/na dowóz, modyfikowalna karuzela zdjęć na stronie głównej z poziomu panelu admina.', 'Restaurant management system - modifiable menu, online ordering for table/delivery, modifiable homepage image carousel from admin panel.', 5900, '["Strona Internetowa","Restauracja","Panel Administratora"]', '["Website","Restaurant","Admin Panel"]', 'https://papu.kitchen/', '["Zamawianie online","Zarządzanie menu","Zarządzanie treścią strony głównej","Dodawanie wydarzeń","Dodawanie pop-up''a"]', '["Online ordering","Menu management","Homepage content management","Event management","Popup management"]', 5, 0, 'active', '2025-07-29T22:30:05.074Z'),
(12, 'Transkrypcja wideo z AI', 'AI Video Transcription', 'Generator transkrypcji audio/wideo i notatek oraz ekstrakcja informacji bezpośrednio z linku do youtube/Instagram reels. Możliwość rozmowy z AI na temat transkrypcji. System płatności w credits oraz monetyzacja credits.', 'Audio/video transcription generator and note extraction directly from YouTube/Instagram reels link. Ability to chat with AI about transcription. Credit-based payment system and credit monetization.', 16900, '["Saas","AI","Mikropłatności","API"]', '["SaaS", "AI", "Micropayments", "API"]', 'https://extrac-content', '["SaaS","Credits za mikropłatności","API OpenAI"]', '["SaaS","Micropayment credits","OpenAI API"]', 5, 0, 'active', '2025-07-29T22:36:09.818Z');

-- =====================================================
-- DANE ZDJĘĆ OPROGRAMOWANIA (51 zdjęć)
-- =====================================================

INSERT INTO "SoftwareImage" ("id", "url", "isThumbnail", "softwareId") VALUES
(42, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753467014/tj77gerarfy2dyty7icd.png', false, 9),
(43, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753470201/v54ghu8pa3yfwrfzdjkn.png', true, 9),
(79, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201061/c5zwsyksrvjlop16mytj.png', true, 4),
(80, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624158/eyrsz2pnqmylotdi05yl.png', false, 4),
(81, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624160/jnwn5xne0uyd2ybsoxvy.png', false, 4),
(82, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624186/k35g5ablel0lrobmieyz.png', false, 4),
(85, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201069/mitw1hwjbxqpy9vzjifz.png', true, 2),
(86, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624376/dane8vzvnbw0ldbfaayu.png', false, 2),
(87, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624378/yuig38qpy0vkf9njptly.png', false, 2),
(100, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201086/wk64sshtjei6wgvlgxxu.png', true, 3),
(101, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625505/gencchevgftkfycahj4x.png', false, 3),
(102, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753469943/di7czesrhveotafomidl.png', true, 10),
(103, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753470021/ewfelazn0hknn5f2q6s7.png', false, 10),
(104, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753463833/auhcbfdbrfsyc0cgqwwg.png', true, 8),
(105, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753464124/eqgkkx5gi198bbbxoybb.png', false, 8),
(106, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753452424/emh859lesfo8iklpjjyr.png', true, 7),
(107, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624532/ms5fr7glpw3e6chq7xgx.png', false, 7),
(108, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624533/d58rqppupdzo693bebmz.png', false, 7),
(109, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624534/cgt8ix42xxknyqivkqsb.png', false, 7),
(110, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624534/ucnxdmaookrfyt1anuyf.png', false, 7),
(111, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624535/weiipev36vqcc4kubs4.png', false, 7),
(112, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828154/znhxtjp19vfjjo6iqg0c.png', false, 11),
(113, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828157/q7p4m4bi9j35q7xshjvn.png', false, 11),
(114, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828158/sbrehscslr36e2wtq9jo.png', false, 11),
(115, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828158/jd6h0rhk9rsieaa2ymu1.png', false, 11),
(116, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828161/wvsxuhicujuco1fz6gqd.png', true, 11),
(117, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828555/gqkqma1dky9ozknlj8v8.png', true, 12),
(118, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828556/yasohohruyxn8ni6ejxk.png', false, 12),
(119, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828558/jnshqjtp9qnlnico0spa.png', false, 12),
(120, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828558/iy1bc817x0zq1exfvppb.png', false, 12),
(121, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828560/mbvqo1f2wzp5rtntpfxm.png', false, 12),
(122, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828561/kswociedz1stvlkqsjsu.png', false, 12),
(127, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201045/msvto7zyjjjaxcce2tkx.png', true, 5),
(128, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623543/ckjowqim0lgbk2soznme.png', false, 5),
(129, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623545/ymsx8j78o8itybrgqdsr.png', false, 5),
(130, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623547/qnzl7krmc30whxa0zwia.png', false, 5),
(131, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623547/ahrzemcrjrwy1znp1qdn.png', false, 5),
(132, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623721/ixyy3dl2vxtgjiuxstrx.png', false, 5),
(133, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623727/dcmmnzmeoo1gwhb1y34s.png', false, 5),
(134, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753623908/mafewusoqno9mx7i2gbq.png', false, 5),
(135, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624007/bqdsei16si6bqlwqm1pa.png', false, 5),
(136, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201034/v2w1juabqzud3atcevpz.png', true, 6),
(137, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753624291/t0acvcuece24k7qcohsa.png', false, 6),
(138, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625426/zut5kpdw3jzairw8f4dl.png', false, 6),
(139, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625427/zohcysf3mdxtstpsskcv.png', false, 6),
(140, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625428/etl2pzpcu5nkpjnd47k9.png', false, 6),
(141, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753625429/kljjkjquyujdl4wmzuxk.png', false, 6),
(142, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828801/ycsqhf8tmri72qbeyarh.png', true, 13),
(143, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828802/hn7adqt4shwxhgwpewsc.png', false, 13),
(144, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753828803/vqavudhimoxl1lwqox10.png', false, 13),
(145, 'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201094/a7v2w0qcxvsso6dgq78g.png', true, 1);

-- =====================================================
-- DANE ZAMÓWIEŃ (2 zamówień)
-- =====================================================

INSERT INTO "Order" ("id", "userId", "productId", "email", "phone", "info", "orderType", "status", "createdAt", "stripeSessionId", "termsAccepted", "marketingAccepted", "demoConsentAccepted", "selectedCategory", "language") VALUES
(2, 3, 2, 'admin@feliztradeltd.com', '657835354', NULL, 'demo', 'paid', '2025-07-29T23:31:11.199Z', 'cs_test_a14wDIyRkTyvcOJauyOOm6UMUwrGuyvKH2srUm9ViUjH50QVn1ZgZZmk5M', true, false, true, NULL, 'en'),
(1, 3, 8, 'admin@feliztradeltd.com', '996574445', NULL, 'demo', 'paid', '2025-07-29T23:27:30.851Z', 'cs_test_a1dF7IMxGtThIXjaYZsoY8jJvXS8fcMAPeb9c3ODtOH92w5rnXxj2Y5WY3', true, false, true, NULL, 'en');

-- =====================================================
-- DANE KOMPONENTÓW (14 komponentów z tłumaczeniami)
-- =====================================================

INSERT INTO "Component" ("id", "name", "nameEn", "priceFrom", "priceTo", "notes", "notesEn") VALUES
(1, 'Integracja z API', 'API integration', 10000, 50000, 'Połączenie z zewnętrznymi usługami i interfejsami API innych firm.', 'Connection with external services and third-party APIs'),
(2, 'Integracja Blockchain / Kryptowaluty', 'Blockchain / Cryptocurrency Integration', 4000, 15000, 'Połączenie portfela, wdrożenie par kryptowalutowych, integracja smart kontraktów, połączenie portfela, przetwarzanie płatności krypto, obsługa transakcji blockchain, zarządzanie tokenami, integracja funkcji DeFi.', 'Connect Wallet, cryptocurrency pair implementation, smart contracts integration, wallet connection, crypto payment processing, blockchain transaction handling, token management, DeFi features integration.'),
(3, 'Autoryzacja / Logowanie', 'Authorization / Login', 6000, 40000, 'System użytkowników, logowanie za pomocą e-maila/telefonu, uwierzytelnianie przez media społecznościowe, uwierzytelnianie dwuskładnikowe, odzyskiwanie hasła, zarządzanie profilami użytkowników, zarządzanie sesjami, kontrola dostępu oparta na rolach.', 'User system, email/phone login, social media authentication, two-factor authentication, password recovery, user profile management, session management, role-based access control.'),
(4, 'Panel Administratora', 'Admin Panel', 5000, 30000, 'Panel administracyjny, zarządzanie użytkownikami, zarządzanie treścią, przegląd analityki, ustawienia systemowe, uprawnienia użytkowników, eksport/import danych, narzędzia i kontrolki administracyjne.', 'Dashboard, user management, content management, analytics overview, system settings, user permissions, data export/import, administrative tools and controls.'),
(5, 'Powiadomienia Push/Email', 'Push/Email Notifications', 3000, 20000, 'Powiadomienia push/e-mail/SMS (Firebase / OneSignal), alerty w czasie rzeczywistym, planowanie powiadomień, zarządzanie preferencjami użytkowników, historia powiadomień, komunikacja wielokanałowa.', 'Firebase / OneSignal / email / SMS notifications, real-time alerts, notification scheduling, user preference management, notification history, multi-channel messaging.'),
(6, 'System Płatności', 'Payment System', 5000, 45000, 'Integracja z bramkami płatności (Stripe, PayPal, Przelewy24, BLIK), zarządzanie subskrypcjami, generowanie faktur, śledzenie płatności, przetwarzanie zwrotów, raportowanie finansowe.', 'Stripe, PayPal, Przelewy24, BLIK, payment gateway integration, subscription management, invoice generation, payment tracking, refund processing, financial reporting.'),
(7, 'Geolokalizacja / Mapy', 'Geolocation / Maps', 9000, 50000, 'Integracja z Google Maps / OpenStreetMap, usługi oparte na lokalizacji, planowanie tras, geofencing, śledzenie lokalizacji, dostosowywanie map, punkty POI, zarządzanie danymi przestrzennymi.', 'Google Maps / OpenStreetMap integration, location-based services, route planning, geofencing, location tracking, map customization, points of interest, spatial data management.'),
(8, 'Funkcje AI / ML', 'AI / ML Functions', 10000, 180000, 'Integracja z API OpenAI, integracja modeli lokalnych, agenci AI, systemy rekomendacji, przetwarzanie języka naturalnego, algorytmy uczenia maszynowego, analityka predykcyjna, funkcje oparte na AI.', 'OpenAI API, local model integration, AI agents, recommendation systems, natural language processing, machine learning algorithms, predictive analytics, AI-powered features.'),
(9, 'Chat / Komunikator', 'Chat / Messenger', 12000, 30000, 'Implementacja WebSocket, funkcjonalność czatu na żywo, wiadomości w czasie rzeczywistym, historia czatu, udostępnianie plików, rozmowy grupowe, szyfrowanie wiadomości, narzędzia moderacji czatu.', 'WebSocket implementation, live chat functionality, real-time messaging, chat history, file sharing, group conversations, message encryption, chat moderation tools.'),
(10, 'CMS (Własny)', 'CMS (Custom)', 6000, 40000, 'Niestandardowy system zarządzania treścią (CMS), funkcjonalność bloga, tworzenie i edycja treści, zarządzanie mediami, narzędzia SEO, planowanie treści, współpraca wielu użytkowników, kontrola wersji.', 'Custom content management system, blog functionality, content creation and editing, media management, SEO tools, content scheduling, multi-user collaboration, version control.'),
(11, 'Strona Internetowa Wizytówka', 'Business Card Website', 3000, 12000, 'Statyczna strona internetowa z informacjami o firmie, danymi kontaktowymi, opisami usług, portfolio firmy, profesjonalną prezentacją, responsywnym designem mobilnym, optymalizacją SEO.', 'Static website with company information, contact details, service descriptions, company portfolio, professional presentation, mobile-responsive design, SEO optimization.'),
(12, 'Dodatkowa Podstrona', 'Additional Subpage', 1000, 6000, 'Dodatkowa podstrona na Twojej stronie internetowej, niestandardowe tworzenie treści, projektowanie i układ strony, zarządzanie treścią, optymalizacja SEO, responsywność mobilna, integracja z istniejącą witryną.', 'Additional page on your website, custom content creation, page design and layout, content management, SEO optimization, mobile responsiveness, integration with existing site.'),
(13, 'Strona Kompatybilna z Aplikacją', 'Website Compatible with App', 5000, 20000, 'Zarządzanie produktami, zarządzanie użytkownikami, synchronizacja danych między stroną internetową a aplikacją mobilną, ujednolicone doświadczenie użytkownika, funkcjonalność międzyplatformowa, spójność danych, zintegrowane przepływy pracy.', 'Product management, user management, synchronized data between website and mobile app, unified user experience, cross-platform functionality, data consistency, integrated workflows.'),
(14, 'Asystent AI (z Wiedzą o Biznesie)', 'AI Assistant (with Business Knowledge)', 2500, 20000, 'Widget chatbota AI osadzony na stronie internetowej / oddzielna aplikacja, baza wiedzy specyficzna dla biznesu, automatyzacja obsługi klienta, inteligentne odpowiedzi, historia rozmów, zdolności uczenia się.', 'AI chatbot widget embedded on website / separate application, business-specific knowledge base, customer support automation, intelligent responses, conversation history, learning capabilities.');

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
