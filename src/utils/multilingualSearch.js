// Comprehensive multilingual search utility for Uzbek (Latin & Cyrillic), Russian, and English

// Cyrillic to Latin transliteration map for Uzbek & Russian
const CYRILLIC_TO_LATIN = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': "'",
  'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': "o'", 'ғ': "g'",
  'ҳ': 'h', 'қ': 'q'
};

// Common cross-language aliases and transliterations
const DICTIONARY_ALIASES = {
  'ayfon': 'iphone',
  'ayfonlar': 'iphone',
  'айфон': 'iphone',
  'айфоны': 'iphone',
  'самсунг': 'samsung',
  'галакси': 'galaxy',
  'сяоми': 'xiaomi',
  'ксиаоми': 'xiaomi',
  'редми': 'redmi',
  'макбук': 'macbook',
  'эйрподс': 'airpods',
  'найк': 'nike',
  'адидас': 'adidas',
  'сони': 'sony',
  'бозе': 'bose',
  'маршалл': 'marshall',
  'гармин': 'garmin',
  'тиссот': 'tissot',
  'лавацца': 'lavazza',
  'роборок': 'roborock'
};

// Category mapping for multilingual category intent
const CATEGORY_MAP = {
  'cat-1': ['smartfon', 'smartfonlar', 'telefon', 'telefonlar', 'phone', 'phones', 'smartphone', 'smartphones', 'телефон', 'телефоны', 'смартфон', 'смартфоны', 'сотка', 'уяли'],
  'cat-2': ['noutbuk', 'noutbuklar', 'laptop', 'laptops', 'notebook', 'notebooks', 'kompyuter', 'ноутбук', 'ноутбуки', 'компьютер', 'компьютеры', 'лэптоп'],
  'cat-3': ['soat', 'soatlar', 'smartwatch', 'smart watch', 'aqlli soat', 'часы', 'смарт часы', 'смарт-часы', 'соат'],
  'cat-4': ['quloqchin', 'quloqchinlar', 'naushnik', 'naushniklar', 'headphones', 'earphones', 'headset', 'наушники', 'гарнитура', 'кулокчин'],
  'cat-5': ['aksessuar', 'aksessuarlar', 'kabel', 'zaryadnik', 'quvvatlagich', 'powerbank', 'power bank', 'adapter', 'аксессуары', 'кабель', 'зарядка', 'повербанк'],
  'cat-6': ['kiyim', 'kiyimlar', 'poyabzal', 'krossovka', 'krossovkalar', 'oyoq kiyim', 'futbolka', 'xudi', 'shim', 'tufli', 'clothes', 'clothing', 'shoes', 'sneakers', 'shirt', 'hoodie', 'одежда', 'обувь', 'кроссовки', 'футболка', 'худи', 'штаны', 'туфли'],
  'cat-7': ['uy', 'oshxona', 'changyutgich', 'choynak', 'tova', 'qozon', 'blender', 'kitchen', 'home', 'кухня', 'посуда', 'пылесос', 'чайник', 'сковорода', 'блендер', 'дом'],
  'cat-8': ['sport', 'fitnes', 'fitness', 'gantel', 'dumbbell', 'yoga', 'raketka', 'trenajor', 'спорт', 'фитнес', 'гантели', 'тренажер', 'йога'],
  'cat-9': ['kitob', 'kitoblar', 'roman', 'darslik', 'badiiy', 'book', 'books', 'книга', 'книги', 'литература', 'учебник', 'роман'],
  'cat-10': ["go'zallik", 'parvarish', 'krem', 'atir', 'parfyum', 'shampun', 'kosmetika', 'beauty', 'care', 'perfume', 'shampoo', 'cream', 'косметика', 'уход', 'крем', 'духи', 'парфюм', 'шампунь'],
  'cat-11': ['qahva', 'kofe', 'choy', 'asal', 'oziq-ovqat', 'oziq ovqat', 'coffee', 'tea', 'honey', 'food', 'кофе', 'чай', 'мед', 'мёд', 'продукты', 'еда'],
  'cat-12': ['avto', 'avtotovar', 'avtotovarlar', 'mashina', 'avtomobil', 'videoregistrator', 'nasos', 'auto', 'car', 'авто', 'машина', 'автомобиль', 'видеорегистратор', 'насос'],
  'cat-13': ['bola', 'bolalar', "o'yinchoq", 'aravacha', 'kolyaska', 'kids', 'baby', 'toy', 'toys', 'stroller', 'дети', 'ребенок', 'игрушки', 'коляска', 'болалар', 'уйинчок']
};

// Specific model series to ensure precision (e.g. iphone vs macbook)
const SPECIFIC_MODELS = [
  { id: 'iphone', terms: ['iphone', 'ayfon', 'айфон', 'айфоны'] },
  { id: 'macbook', terms: ['macbook', 'макбук', 'makbuk'] },
  { id: 'airpods', terms: ['airpods', 'эйрподс', 'airpod'] },
  { id: 'galaxy', terms: ['galaxy', 'галакси'] },
  { id: 'redmi', terms: ['redmi', 'редми'] },
  { id: 'zephyrus', terms: ['zephyrus', 'rog'] },
  { id: 'jordan', terms: ['jordan', 'джордан'] }
];

// Known brands to avoid rival brand cross-contamination
const KNOWN_BRANDS = [
  { id: 'apple', keywords: ['apple', 'эппл'] },
  { id: 'samsung', keywords: ['samsung', 'самсунг'] },
  { id: 'xiaomi', keywords: ['xiaomi', 'сяоми', 'ксиаоми'] },
  { id: 'asus', keywords: ['asus', 'асус'] },
  { id: 'dell', keywords: ['dell', 'xps', 'делл'] },
  { id: 'sony', keywords: ['sony', 'сони'] },
  { id: 'bose', keywords: ['bose', 'бозе'] },
  { id: 'marshall', keywords: ['marshall', 'маршалл'] },
  { id: 'nike', keywords: ['nike', 'air force', 'найк'] },
  { id: 'adidas', keywords: ['adidas', 'samba', 'адидас'] },
  { id: 'garmin', keywords: ['garmin', 'гармин'] },
  { id: 'tissot', keywords: ['tissot', 'тиссот'] },
  { id: 'lavazza', keywords: ['lavazza', 'лавацца'] }
];

// Normalize text: lowercase, remove punctuation, trim
export function normalizeText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[`'ʼʻ’]/g, "'")
    .replace(/[^\w\s\u0400-\u04FF']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Convert any Cyrillic letters to Latin equivalent
export function cyrillicToLatin(text) {
  if (!text) return '';
  const normalized = text.toLowerCase();
  let result = '';
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    result += CYRILLIC_TO_LATIN[ch] !== undefined ? CYRILLIC_TO_LATIN[ch] : ch;
  }
  return result;
}

// Find related search tags based on multilingual query (safely bounded)
export function getRelatedTerms(query) {
  const norm = normalizeText(query);
  if (norm.length < 2) return [];
  const latinNorm = cyrillicToLatin(norm);
  const relatedTags = new Set();

  for (const [_, terms] of Object.entries(CATEGORY_MAP)) {
    const matches = terms.some(t => {
      const termNorm = normalizeText(t);
      return termNorm === norm || termNorm === latinNorm ||
        (norm.length >= 3 && termNorm.startsWith(norm)) ||
        (latinNorm.length >= 3 && termNorm.startsWith(latinNorm)) ||
        (norm.length >= 4 && norm.includes(termNorm));
    });
    if (matches) {
      terms.slice(0, 4).forEach(t => relatedTags.add(normalizeText(t)));
    }
  }

  for (const b of KNOWN_BRANDS) {
    const matches = b.keywords.some(kw => {
      const kwNorm = normalizeText(kw);
      return kwNorm === norm || kwNorm === latinNorm || (norm.length >= 4 && kwNorm.startsWith(norm));
    });
    if (matches) {
      b.keywords.forEach(kw => relatedTags.add(normalizeText(kw)));
    }
  }

  return Array.from(relatedTags);
}

// Filter and score products based on multilingual query
export function filterProductsMultilingual(products = [], query = '', categories = []) {
  const clean = normalizeText(query);
  if (!clean) return products;
  const latin = cyrillicToLatin(clean);

  // Single character special case: only match products whose title has a word starting with that letter
  if (clean.length === 1) {
    return products.filter(p => {
      const words = normalizeText(p.title).split(' ');
      return words.some(w => w.startsWith(clean) || w.startsWith(latin));
    });
  }

  // Tokenize & expand aliases
  const rawTokens = clean.split(' ').filter(Boolean);
  const searchTokens = new Set();
  for (const t of rawTokens) {
    searchTokens.add(t);
    const lat = cyrillicToLatin(t);
    searchTokens.add(lat);
    if (DICTIONARY_ALIASES[t]) searchTokens.add(DICTIONARY_ALIASES[t]);
    if (DICTIONARY_ALIASES[lat]) searchTokens.add(DICTIONARY_ALIASES[lat]);
  }
  const tokenList = Array.from(searchTokens);

  // Check if query is targeting a specific model (e.g. iphone vs macbook)
  const targetModelIds = new Set();
  for (const m of SPECIFIC_MODELS) {
    for (const term of m.terms) {
      const termNorm = normalizeText(term);
      if (clean === termNorm || latin === termNorm || rawTokens.includes(termNorm) || tokenList.includes(termNorm)) {
        targetModelIds.add(m.id);
        break;
      }
    }
  }

  // Check if query is targeting a specific brand (e.g. samsung vs apple)
  const targetBrandIds = new Set();
  for (const b of KNOWN_BRANDS) {
    for (const kw of b.keywords) {
      const kwNorm = normalizeText(kw);
      if (clean === kwNorm || latin === kwNorm || rawTokens.includes(kwNorm) || tokenList.includes(kwNorm)) {
        targetBrandIds.add(b.id);
        break;
      }
    }
  }

  // Detect category intent
  const matchedCategoryIds = new Set();
  for (const [catId, terms] of Object.entries(CATEGORY_MAP)) {
    for (const term of terms) {
      const termNorm = normalizeText(term);
      if (tokenList.includes(termNorm) || clean === termNorm || latin === termNorm) {
        matchedCategoryIds.add(catId);
        break;
      }
      if (clean.length >= 3 && termNorm.startsWith(clean)) {
        matchedCategoryIds.add(catId);
        break;
      }
    }
  }

  // Map category names if passed
  const catNamesMap = new Map();
  if (Array.isArray(categories)) {
    categories.forEach(c => {
      catNamesMap.set(c.id, {
        name: normalizeText(c.name),
        nameLatin: cyrillicToLatin(normalizeText(c.name))
      });
    });
  }

  const scored = [];

  for (const p of products) {
    const title = normalizeText(p.title);
    const titleLat = cyrillicToLatin(title);
    const desc = normalizeText(p.description);
    const descLat = cyrillicToLatin(desc);
    const catInfo = catNamesMap.get(p.categoryId) || { name: '', nameLatin: '' };

    let score = 0;
    let matchedTokenCount = 0;

    // 1. Direct full query match in title
    if (title.includes(clean) || titleLat.includes(latin)) {
      score += 200;
      if (title.startsWith(clean) || titleLat.startsWith(latin)) {
        score += 60;
      }
    }

    // 2. Token matches in title & description
    for (const token of tokenList) {
      if (token.length < 2) continue;
      if (title.includes(token) || titleLat.includes(token)) {
        matchedTokenCount++;
        score += 50;
        const words = title.split(' ');
        if (words.includes(token) || words.includes(cyrillicToLatin(token))) {
          score += 30; // Exact word match bonus
        }
      } else if (desc.includes(token) || descLat.includes(token)) {
        score += 15;
      }
    }

    // 3. Category match
    if (matchedCategoryIds.has(p.categoryId)) {
      score += 45;
    }
    if (catInfo.name.includes(clean) || catInfo.nameLatin.includes(latin)) {
      score += 50;
    }

    // 4. Model enforcement: if query targeted e.g. iphone, require product to match iphone
    if (targetModelIds.size > 0) {
      let matchesModel = false;
      for (const modelId of targetModelIds) {
        const modelDef = SPECIFIC_MODELS.find(m => m.id === modelId);
        if (modelDef) {
          for (const term of modelDef.terms) {
            if (title.includes(term) || titleLat.includes(term) || desc.includes(term) || descLat.includes(term)) {
              matchesModel = true;
              score += 100;
              break;
            }
          }
        }
      }
      if (!matchesModel) {
        score = 0; // Filter out products not matching requested model
      }
    }

    // 5. Brand enforcement: if query targeted a specific brand, penalize/exclude products of other brands
    if (targetBrandIds.size > 0) {
      let matchesTargetBrand = false;
      for (const brandId of targetBrandIds) {
        const brandDef = KNOWN_BRANDS.find(b => b.id === brandId);
        if (brandDef) {
          for (const kw of brandDef.keywords) {
            if (title.includes(kw) || titleLat.includes(kw) || desc.includes(kw) || descLat.includes(kw)) {
              matchesTargetBrand = true;
              score += 70;
              break;
            }
          }
        }
      }
      if (!matchesTargetBrand && !title.includes(clean) && !titleLat.includes(latin)) {
        score = 0; // Filter out products not matching the requested brand
      }
    }

    // 6. Multi-token queries: must have token match
    if (rawTokens.length > 1 && matchedTokenCount === 0 && !title.includes(clean) && !titleLat.includes(latin)) {
      score = 0;
    }

    if (score >= 35) {
      scored.push({ product: p, score });
    }
  }

  return scored.sort((a, b) => b.score - a.score).map(s => s.product);
}
