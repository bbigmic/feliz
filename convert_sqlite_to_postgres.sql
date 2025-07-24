-- Tworzenie tabel (jeśli nie istnieją)
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Component" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    "priceFrom" INTEGER NOT NULL,
    "priceTo" INTEGER NOT NULL,
    notes TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Software" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    categories TEXT NOT NULL DEFAULT '[]',
    "demoUrl" TEXT NOT NULL,
    features TEXT NOT NULL,
    rating REAL NOT NULL,
    sales INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SoftwareImage" (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    "isThumbnail" BOOLEAN NOT NULL DEFAULT false,
    "softwareId" INTEGER NOT NULL REFERENCES "Software"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Order" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
    "productId" INTEGER,
    email TEXT,
    phone TEXT NOT NULL,
    info TEXT,
    "orderType" TEXT NOT NULL DEFAULT 'demo',
    status TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeSessionId" TEXT
);

-- Konwersja dump SQLite na PostgreSQL
-- Uruchom to w bazie PostgreSQL po utworzeniu tabel

-- Wstaw dane użytkowników
INSERT INTO "User" (id, email, "passwordHash", "createdAt") VALUES
(1,'user1@example.com','$2b$10$zKY00wUdRG2LZdWsUjrPUuB0Qc33Y8zzbtmKi/G1MkBgWgN5w90BC','2024-07-21 16:30:08.606'),
(2,'user2@example.com','$2b$10$j0tBKC3607pjy5ljTUVWT.dP463Q3pPdI01WFDYwhNPP6uhuaHQwG','2024-07-22 23:21:29.711');

-- Wstaw komponenty
INSERT INTO "Component" (id, name, "priceFrom", "priceTo", notes) VALUES
(1,'Integracja Blockchain',10000,50000,'Connect Wallet, wdrożenie pary kryptowalutowej'),
(2,'Autoryzacja / logowanie',8000,30000,'System użytkowników, logowanie emailem / telefonem / Z OTP / social login'),
(3,'Integracja z API',12000,40000,'Zależnie od liczby i trudności'),
(4,'Panel administratora',20000,60000,'Dashboard, zarządzanie użytkownikami'),
(5,'Powiadomienia push/email',6000,20000,'Firebase / OneSignal / mail / sms'),
(6,'System płatności',15000,45000,'Stripe, PayPal, Przelewy24, BLIK'),
(7,'Geolokalizacja / mapy',18000,50000,'Mapy Google / OpenStreetMap'),
(8,'AI / ML funkcje',40000,180000,'np. OpenAI API, lokalny model, agenci AI, rekomendacje'),
(9,'Chat / komunikator',25000,70000,'WebSocket, live chat'),
(10,'CMS (własny/headless)',12000,40000,'custom - blogi, dodawanie i edycja produktów');

-- Wstaw oprogramowania
INSERT INTO "Software" (id, name, description, price, categories, "demoUrl", features, rating, sales, status, "createdAt") VALUES
(2,'Platforma E-commerce','Kompletna platforma e-commerce z systemem płatności i panelem zarządzania użytkownikami i analizą',8999,'["E-commerce", "Strona internetowa"]','https://youngcoco.pl/','["Responsywny design","System płatności","Panel admin","SEO friendly"]',4.8,45,'active','2024-07-21 20:47:27.196'),
(3,'Landing page usług Twojej firmy','Strona lądowania z ofertą usług',7999,'["Landing Page","Usługi"]','https://www.grupaautospectrum.com/','["Responsywny design","Oferta z cennikiem","Kontakt","Integracja social media"]',4.9,41,'active','2024-07-21 20:48:46.438'),
(4,'Zarządzanie restauracją','System zarządzania restauracją z zamówieniami online',8999,'["Restauracja"]','https://piecyk.vercel.app','["Zamawianie online","Zarządzanie menu","Śledzenie postepu zamówienia","Zamawianie online"]',4.6,28,'active','2024-07-21 20:48:48.500'),
(5,'Portal Nieruchomości','Profesjonalna strona internetowa dla biura nieruchomości',4499,'["Nieruchomości","Strona internetowa"]','https://grupaborys.com','["Lista nieruchomości","Formularz kontaktowy","O firmie"]',4.8,19,'active','2024-07-21 20:48:51.324'),
(6,'Platforma Learningowa','Platforma e-learningowa z kursami online i zarządzaniem ofertą edukacyjną',11999,'["Strona internetowa","Szkolenia"]','https://trawersadr.pl/','["Kursy i szkolenia","Testy dla studentów","Transfer dokumentów","Certyfikaty"]',4.9,41,'active','2024-07-21 20:49:21.778'),
(7,'Aplikacja SaaS (Software as a Service)','Aplikacja do generowania QR kodów do wystawiania opinii w Google Twojej firmie',9999,'["SaaS","QR kod"]','https://www.qropinie.pl/','["Generowanie QR kodu","API Google","Panel analityczny","Program afiliacyjny"]',4.9,41,'active','2024-07-21 20:49:23.666'),
(8,'AI Rooms','Platforma do rozmowy dwóch modeli AI między sobą zintegrowana z blockchain.',5900,'["Blockchain","SaaS"]','https://ai-rooms.vercel.app/','["Connect Wallet","Płatność w kryptowalucie","Implementacja AI","Wielojęzyczność"]',5.0,1,'active','2024-07-21 20:53:54.373');

-- Wstaw obrazy oprogramowań
INSERT INTO "SoftwareImage" (id, url, "isThumbnail", "softwareId") VALUES
(4,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201034/v2w1juabqzud3atcevpz.png',true,7),
(5,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201045/msvto7zyjjjaxcce2tkx.png',true,6),
(6,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201061/c5zwsyksrvjlop16mytj.png',true,5),
(7,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201069/mitw1hwjbxqpy9vzjifz.png',true,3),
(8,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201086/wk64sshtjei6wgvlgxxu.png',true,4),
(10,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201224/ot5jtxavdlxr6xcann2g.png',true,8),
(11,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201094/a7v2w0qcxvsso6dgq78g.png',true,2),
(12,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753212668/vtgjmtccy8jcgikg1ddy.png',false,2);

-- Wstaw zamówienia
INSERT INTO "Order" (id, "userId", "productId", email, phone, info, "orderType", status, "createdAt", "stripeSessionId") VALUES
(1,1,3,NULL,'7656756','jhftkhfh','demo','pending','2024-07-21 18:25:40.874','cs_test_a1QlibN0iTJZE2LvGJsrpemwgyDZguUrUc8UbFRg5zjVoViJgus9Xc9Ocn'),
(2,1,3,NULL,'32423424','asgasdgfasfa','demo','pending','2024-07-21 18:26:31.954','cs_test_a1HtVom6IOv8YV6YoJlHLafi2rHLXcA9D23kjflhkfvneXa6TnIc0Jirqd'),
(3,1,5,NULL,'2435345','chce tak apke i taka','demo','pending','2024-07-21 18:31:45.731','cs_test_a1DtazAaQwGhFfbn415TWLqVjNwsM25RWqEl8RrRLZ8c5ohYTgWQbuvCzn'),
(4,1,6,NULL,'999999',NULL,'demo','pending','2024-07-22 16:00:29.330','cs_test_a1Q6R7Dpl4UlGtVr8TXa7rPFkutkkNI7fs7dKW4SMJ50jKqPrbn9Pckj7G'),
(5,1,7,NULL,'3243242342',NULL,'demo','pending','2024-07-22 16:16:22.109','cs_test_a1HMwuNkADya01TNix4F4qa6MXjaE3pcevKohhp2PZfUJ07RxtWvZ9D7Zl');

-- Zresetuj sekwencje (ważne dla PostgreSQL)
SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"));
SELECT setval('"Component_id_seq"', (SELECT MAX(id) FROM "Component"));
SELECT setval('"Software_id_seq"', (SELECT MAX(id) FROM "Software"));
SELECT setval('"SoftwareImage_id_seq"', (SELECT MAX(id) FROM "SoftwareImage"));
SELECT setval('"Order_id_seq"', (SELECT MAX(id) FROM "Order")); 