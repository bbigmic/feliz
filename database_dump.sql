PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('d0c58538-eab0-4803-aa86-c598ad58657c','aba4e27e171b40e22850145c88007a7cf7eed91c004104016364c4bab442389e',1753113726379,'20250721160206_init_users',NULL,NULL,1753113726378,1);
INSERT INTO _prisma_migrations VALUES('2c74e96c-5844-46d7-93ca-bedad9734da8','f6c94016916409582c7a283872e80ac5cca59234b0c90d054ceceebe1b99bd06',1753119119235,'20250721173159_add_order_model',NULL,NULL,1753119119234,1);
INSERT INTO _prisma_migrations VALUES('83d9ef6f-1a71-4110-b977-d76cfdc969dc','f620de4ca062ad26996ef617541bc60c729217c6c5d411c02ef6c0779fb73258',1753120471135,'20250721175431_add_software_model',NULL,NULL,1753120471134,1);
INSERT INTO _prisma_migrations VALUES('580441d5-33be-4aae-a83c-0b331b877859','c2684dc6563977c19e4bdcfc6ecf1b3a1ffded0b801b3badc936f2cfb8260246',1753120511773,'20250721175511_software_images_array',NULL,NULL,1753120511771,1);
INSERT INTO _prisma_migrations VALUES('86aa3037-2439-46aa-b247-e138b7ae40e7','15d17537c7897ed1d1221639e9668a87d4dd285012c8cd83f1d5a3ecd94e3a03',1753169585220,'20250722073305_add_software_images',NULL,NULL,1753169585218,1);
INSERT INTO _prisma_migrations VALUES('515fb7aa-7da9-4c26-986e-9e9f72df3b2c','22ef5a1b3b02f70c1a32a90314d639a565635aadfdc2468af2f328e156d331a9',1753194332166,'20250722142532_add_component_model',NULL,NULL,1753194332165,1);
INSERT INTO _prisma_migrations VALUES('48a47f12-c8ff-43de-9970-1bc3eab6422f','d687f81fd5d0aa80b9fa2b69b57dae54ccbfab177b045bd416e8f31b6ef04986',1753202516622,'20250722164156_multi_categories_default',NULL,NULL,1753202516619,1);
INSERT INTO _prisma_migrations VALUES('fd347857-67ad-4b4d-80cc-97bc1a3af388','3286b3fc0bf1f4a9a47f0287916384f310de17fc316f55329c398bd704f979d7',1753215400695,'20250722201640_productid_optional',NULL,NULL,1753215400694,1);
INSERT INTO _prisma_migrations VALUES('06161991-0874-4954-b421-f964ada1f692','cfe3c795fabb345023754b693ce6b20c1a34cf8137ec244c1635450fe602da6c',1753225862000,'20250722231101_add_email_to_orders',NULL,NULL,1753225861999,1);
INSERT INTO _prisma_migrations VALUES('422c2466-28a6-42ec-a514-982001977364','bfc2ad74767e4985aae15fc7114445ca0f852633bca66aa1f38f9a0610f0ae4c',1753226464247,'20250722232104_add_order_type',NULL,NULL,1753226464245,1);
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO User VALUES(1,'user1@example.com','$2b$10$zKY00wUdRG2LZdWsUjrPUuB0Qc33Y8zzbtmKi/G1MkBgWgN5w90BC',1753114208606);
INSERT INTO User VALUES(2,'user2@example.com','$2b$10$j0tBKC3607pjy5ljTUVWT.dP463Q3pPdI01WFDYwhNPP6uhuaHQwG',1753226089711);
CREATE TABLE IF NOT EXISTS "SoftwareImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "isThumbnail" BOOLEAN NOT NULL DEFAULT false,
    "softwareId" INTEGER NOT NULL,
    CONSTRAINT "SoftwareImage_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO SoftwareImage VALUES(4,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201034/v2w1juabqzud3atcevpz.png',1,7);
INSERT INTO SoftwareImage VALUES(5,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201045/msvto7zyjjjaxcce2tkx.png',1,6);
INSERT INTO SoftwareImage VALUES(6,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201061/c5zwsyksrvjlop16mytj.png',1,5);
INSERT INTO SoftwareImage VALUES(7,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201069/mitw1hwjbxqpy9vzjifz.png',1,3);
INSERT INTO SoftwareImage VALUES(8,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201086/wk64sshtjei6wgvlgxxu.png',1,4);
INSERT INTO SoftwareImage VALUES(10,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201224/ot5jtxavdlxr6xcann2g.png',1,8);
INSERT INTO SoftwareImage VALUES(11,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753201094/a7v2w0qcxvsso6dgq78g.png',1,2);
INSERT INTO SoftwareImage VALUES(12,'https://res.cloudinary.com/dd0dqviwc/image/upload/v1753212668/vtgjmtccy8jcgikg1ddy.png',0,2);
CREATE TABLE IF NOT EXISTS "Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "priceFrom" INTEGER NOT NULL,
    "priceTo" INTEGER NOT NULL,
    "notes" TEXT NOT NULL
);
INSERT INTO Component VALUES(1,'Integracja Blockchain',10000,50000,'Connect Wallet, wdrożenie pary kryptowalutowej');
INSERT INTO Component VALUES(2,'Autoryzacja / logowanie',8000,30000,'System użytkowników, logowanie emailem / telefonem / Z OTP / social login');
INSERT INTO Component VALUES(3,'Integracja z API',12000,40000,'Zależnie od liczby i trudności');
INSERT INTO Component VALUES(4,'Panel administratora',20000,60000,'Dashboard, zarządzanie użytkownikami');
INSERT INTO Component VALUES(5,'Powiadomienia push/email',6000,20000,'Firebase / OneSignal / mail / sms');
INSERT INTO Component VALUES(6,'System płatności',15000,45000,'Stripe, PayPal, Przelewy24, BLIK');
INSERT INTO Component VALUES(7,'Geolokalizacja / mapy',18000,50000,'Mapy Google / OpenStreetMap');
INSERT INTO Component VALUES(8,'AI / ML funkcje',40000,180000,'np. OpenAI API, lokalny model, agenci AI, rekomendacje');
INSERT INTO Component VALUES(9,'Chat / komunikator',25000,70000,'WebSocket, live chat');
INSERT INTO Component VALUES(10,'CMS (własny/headless)',12000,40000,'custom - blogi, dodawanie i edycja produktów');
CREATE TABLE IF NOT EXISTS "Software" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "categories" TEXT NOT NULL DEFAULT '[]',
    "demoUrl" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "sales" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Software VALUES(2,'Platforma E-commerce','Kompletna platforma e-commerce z systemem płatności i panelem zarządzania użytkownikami i analizą',8999,'["E-commerce", "Strona internetowa"]','https://youngcoco.pl/','["Responsywny design","System płatności","Panel admin","SEO friendly"]',4.799999999999999823,45,'active',1753200847196);
INSERT INTO Software VALUES(3,'Landing page usług Twojej firmy','Strona lądowania z ofertą usług',7999,'["Landing Page","Usługi"]','https://www.grupaautospectrum.com/','["Responsywny design","Oferta z cennikiem","Kontakt","Integracja social media"]',4.900000000000000355,41,'active',1753200926438);
INSERT INTO Software VALUES(4,'Zarządzanie restauracją','System zarządzania restauracją z zamówieniami online',8999,'["Restauracja"]','https://piecyk.vercel.app','["Zamawianie online","Zarządzanie menu","Śledzenie postepu zamówienia","Zamawianie online"]',4.599999999999999644,28,'active',1753200928500);
INSERT INTO Software VALUES(5,'Portal Nieruchomości','Profesjonalna strona internetowa dla biura nieruchomości',4499,'["Nieruchomości","Strona internetowa"]','https://grupaborys.com','["Lista nieruchomości","Formularz kontaktowy","O firmie"]',4.799999999999999823,19,'active',1753200931324);
INSERT INTO Software VALUES(6,'Platforma Learningowa','Platforma e-learningowa z kursami online i zarządzaniem ofertą edukacyjną',11999,'["Strona internetowa","Szkolenia"]','https://trawersadr.pl/','["Kursy i szkolenia","Testy dla studentów","Transfer dokumentów","Certyfikaty"]',4.900000000000000355,41,'active',1753200961778);
INSERT INTO Software VALUES(7,'Aplikacja SaaS (Software as a Service)','Aplikacja do generowania QR kodów do wystawiania opinii w Google Twojej firmie',9999,'["SaaS","QR kod"]','https://www.qropinie.pl/','["Generowanie QR kodu","API Google","Panel analityczny","Program afiliacyjny"]',4.900000000000000355,41,'active',1753200963666);
INSERT INTO Software VALUES(8,'AI Rooms','Platforma do rozmowy dwóch modeli AI między sobą zintegrowana z blockchain.',5900,'["Blockchain","SaaS"]','https://ai-rooms.vercel.app/','["Connect Wallet","Płatność w kryptowalucie","Implementacja AI","Wielojęzyczność"]',5.0,1,'active',1753201234373);
CREATE TABLE IF NOT EXISTS "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "productId" INTEGER,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "info" TEXT,
    "orderType" TEXT NOT NULL DEFAULT 'demo',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeSessionId" TEXT,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "Order" VALUES(1,1,3,NULL,'7656756','jhftkhfh','demo','pending',1753119940874,'cs_test_a1QlibN0iTJZE2LvGJsrpemwgyDZguUrUc8UbFRg5zjVoViJgus9Xc9Ocn');
INSERT INTO "Order" VALUES(2,1,3,NULL,'32423424','asgasdgfasfa','demo','pending',1753119991954,'cs_test_a1HtVom6IOv8YV6YoJlHLafi2rHLXcA9D23kjflhkfvneXa6TnIc0Jirqd');
INSERT INTO "Order" VALUES(3,1,5,NULL,'2435345','chce tak apke i taka','demo','pending',1753120305731,'cs_test_a1DtazAaQwGhFfbn415TWLqVjNwsM25RWqEl8RrRLZ8c5ohYTgWQbuvCzn');
INSERT INTO "Order" VALUES(4,1,6,NULL,'999999',NULL,'demo','pending',1753214429330,'cs_test_a1Q6R7Dpl4UlGtVr8TXa7rPFkutkkNI7fs7dKW4SMJ50jKqPrbn9Pckj7G');
INSERT INTO "Order" VALUES(5,1,7,NULL,'3243242342',NULL,'demo','pending',1753214982109,'cs_test_a1HMwuNkADya01TNix4F4qa6MXjaE3pcevKohhp2PZfUJ07RxtWvZ9D7Zl');
INSERT INTO "Order" VALUES(6,1,NULL,NULL,'43534523453',NULL,'consultation','pending',1753215414626,'cs_test_a105HsJLEunxQWRWFyHrKPlmxxSsRffL6dX7vqJf7cWSAsEBH9Tbb6tvSs');
INSERT INTO "Order" VALUES(7,NULL,7,NULL,'876867867',NULL,'demo','pending',1753225425835,'cs_test_a1xI8Dc0yfuOet57iZBrbhX72uyUl8gAqvzBGGo1PUCYnI6uZrH1nu3f5e');
INSERT INTO "Order" VALUES(8,NULL,2,'borysm32@gmail.com','87887878787',NULL,'demo','pending',1753226010833,'cs_test_a1JTDJ9xYLWwWdS3Sj481joioxAnUqrAyTycJ8bi1k179UErwTlFzWU2u2');
INSERT INTO "Order" VALUES(9,2,4,'user2@example.com','uy788787',NULL,'demo','pending',1753226162093,'cs_test_a1uowhzfcEEqkk5fTzdNxdkn3mmd7agTkRv27u2HhFENzZYxa4Z3xn6BsP');
INSERT INTO "Order" VALUES(10,2,NULL,'user2@example.com','8787',NULL,'consultation','pending',1753226310136,'cs_test_a1iEMkAruDJObWmhwPycnAEXwHOLPbs8EaAdfMuKdhBD7X1zZRkgtBQ1XV');
INSERT INTO "Order" VALUES(11,2,NULL,'user2@example.com','76',NULL,'consultation','pending',1753227071546,'cs_test_a1xAokT5rG7JSyFeDlam0VBiCVFwGEbEBqMK1vWRIBcuxKzCs5a1YcCXOY');
INSERT INTO "Order" VALUES(12,2,7,'user2@example.com','76676',NULL,'demo','pending',1753227123670,'cs_test_a1T1LmAMyPtkbkgsB93AOXsHhTave3QM3pV1JlGMCoV5Sxf8mMPuZLc8lm');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('User',2);
INSERT INTO sqlite_sequence VALUES('SoftwareImage',12);
INSERT INTO sqlite_sequence VALUES('Component',10);
INSERT INTO sqlite_sequence VALUES('Software',8);
INSERT INTO sqlite_sequence VALUES('Order',12);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
COMMIT;
