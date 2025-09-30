// Test funkcji tłumaczenia
// Uruchom: node test-translation.js

const { translateToEnglish, translateArrayToEnglish, translateCategoriesToEnglish } = require('./lib/translate.ts');

async function testTranslation() {
  console.log('🧪 Testowanie funkcji tłumaczenia...\n');

  // Test 1: Pojedynczy tekst
  console.log('📝 Test 1: Pojedynczy tekst');
  const name = "Sklep Internetowy";
  const translatedName = await translateToEnglish(name);
  console.log(`Oryginał: ${name}`);
  console.log(`Tłumaczenie: ${translatedName}\n`);

  // Test 2: Opis
  console.log('📝 Test 2: Opis');
  const description = "Profesjonalny sklep internetowy z systemem płatności";
  const translatedDescription = await translateToEnglish(description);
  console.log(`Oryginał: ${description}`);
  console.log(`Tłumaczenie: ${translatedDescription}\n`);

  // Test 3: Funkcje
  console.log('📝 Test 3: Funkcje');
  const features = "Responsywny design, SEO, Integracja z płatnościami";
  const translatedFeatures = await translateToEnglish(features);
  console.log(`Oryginał: ${features}`);
  console.log(`Tłumaczenie: ${translatedFeatures}\n`);

  // Test 4: Kategorie
  console.log('📝 Test 4: Kategorie');
  const categories = '["E-commerce", "Sklepy", "Płatności"]';
  const translatedCategories = await translateCategoriesToEnglish(categories);
  console.log(`Oryginał: ${categories}`);
  console.log(`Tłumaczenie: ${translatedCategories}\n`);

  // Test 5: Komponent
  console.log('📝 Test 5: Komponent');
  const componentName = "System zarządzania treścią";
  const componentNotes = "Zaawansowany CMS z edytorem WYSIWYG";
  const translatedComponentName = await translateToEnglish(componentName);
  const translatedComponentNotes = await translateToEnglish(componentNotes);
  console.log(`Nazwa oryginał: ${componentName}`);
  console.log(`Nazwa tłumaczenie: ${translatedComponentName}`);
  console.log(`Notatki oryginał: ${componentNotes}`);
  console.log(`Notatki tłumaczenie: ${translatedComponentNotes}\n`);

  console.log('✅ Test zakończony!');
}

// Uruchom test
testTranslation().catch(console.error); 