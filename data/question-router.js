// data/question-router.js

import { PRODUCT_CATALOG, LINKS, normalizeProductName } from "./domain-products.js";

const DOMAIN_TERMS = [
  "domain", "domain outdoor", "food plot", "plot", "seed", "plant", "planting", "fertilizer",
  "fertility", "soil", "soil test", "soil test kit", "soil sample", "ph", "p h", "lime",
  "calcium", "deer", "whitetail", "turkey", "wildlife", "habitat", "cover",
  "bedding", "screening", "dealer", "retailer", "store", "where to buy", "feed",
  "mineral", "attractant", "milo", "sorghum", "forage", "clover", "brassica",
  "turnip", "radish", "rye", "wheat", "oats", "switchgrass", "bluestem", "crank",
  "crankd", "crank'd", "freight", "freight train", "elbow", "elbow grease", "dirty deeds",
  "liquid courage", "bad habit", "stockpile", "stockpile xl", "recharge", "recharge mineral",
  "pre game", "pre-game", "property planner", "food plot selector", "seed selector",
  "planting date", "planting date advisor", "plot enhancing", "ask timmy", "timmy",
  "barley legal", "barley", "crop rocket", "biological fertilizer", "ripple effect",
  "water hole", "waterhole", "water hole additive", "pre game block", "pre game tub", "125lb tub"
];

const WEBSITE_SEARCH_TERMS = [
  "looking for", "where is", "where are", "where do i find", "where can i find",
  "where can i buy", "do you have", "can you find", "find me", "find", "show me",
  "link me", "send me", "i need", "i want", "take me to", "product page",
  "website", "page", "app", "tool"
];

const RANDOM_TERMS = [
  "golf", "cooler", "yeti", "grizzly", "shotgun", "wife", "truck", "football",
  "baseball", "recipe", "weather tomorrow", "stock market", "politics",
  "dating", "beer", "movie", "music", "vacation"
];

export function routeQuestion(question = "") {
  const q = normalizeText(question);

  const mentionedProducts = findMentionedProducts(question);
  const domainRelated = isDomainRelated(q, mentionedProducts);
  const questionType = detectQuestionType(q, mentionedProducts);

  if (!domainRelated) {
    return {
      isDomainRelated: false,
      questionType: "out_of_scope",
      mentionedProducts,
      shouldRecommendProducts: false,
      intent: "out_of_scope"
    };
  }

  return {
    isDomainRelated: true,
    questionType,
    mentionedProducts,
    shouldRecommendProducts: shouldRecommend(questionType),
    intent: detectIntent(q, questionType, mentionedProducts)
  };
}

function normalizeText(text = "") {
  return String(text || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[™®']/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isDomainRelated(q, mentionedProducts) {
  if (mentionedProducts.length > 0) return true;
  if (DOMAIN_TERMS.some(term => q.includes(normalizeText(term)))) return true;
  if (isWebsiteSearchQuestion(q) && looksLikeDomainWebsiteTarget(q)) return true;
  return false;
}

function isWebsiteSearchQuestion(q = "") {
  const clean = normalizeText(q);
  return WEBSITE_SEARCH_TERMS.some(term => clean.includes(normalizeText(term)));
}

function looksLikeDomainWebsiteTarget(q = "") {
  const clean = normalizeText(q);

  const websiteTargets = [
    "soil test", "soil test kit", "ph test", "ph test kit", "comprehensive soil test",
    "property planner", "food plot selector", "seed selector", "selection chart",
    "planting date", "planting advisor", "plot enhancing", "fertility app",
    "fertilizer calculator", "dealer locator", "dealer", "retailer", "ask timmy", "timmy",
    "barley legal", "crop rocket", "ripple effect", "water hole additive",
    "seed", "feed", "mineral", "fertilizer", "liquid", "product", "products"
  ];

  if (websiteTargets.some(term => clean.includes(normalizeText(term)))) return true;

  return Object.keys(PRODUCT_CATALOG).some(name => {
    const product = PRODUCT_CATALOG[name];
    const terms = [
      name,
      product?.handle,
      product?.tag,
      product?.type,
      product?.category,
      product?.customerCategory,
      ...(product?.aliases || [])
    ]
      .filter(Boolean)
      .map(normalizeText)
      .filter(Boolean);

    return terms.some(term => term.length >= 3 && clean.includes(term));
  });
}

function detectQuestionType(q, mentionedProducts) {
  if (isWebsiteSearchQuestion(q) && looksLikeDomainWebsiteTarget(q)) {
    return "website_search";
  }

  if (q.includes("dealer") || q.includes("retailer") || q.includes("store near me") || q.includes("where can i buy") || q.includes("near me")) {
    return "dealer_help";
  }

  if (
    q.includes("when should i plant") ||
    q.includes("when do i plant") ||
    q.includes("planting date") ||
    q.includes("planting window") ||
    q.startsWith("when ")
  ) {
    return "when_to_plant";
  }

  if (
    q.includes("what should i plant") ||
    q.includes("what do i plant") ||
    q.includes("best seed") ||
    q.includes("recommend a seed") ||
    q.includes("which mix")
  ) {
    return "what_to_plant";
  }

  if (
    q.includes("fertilizer") ||
    q.includes("fertility") ||
    q.includes("what should i spray") ||
    q.includes("crank") ||
    q.includes("freight") ||
    q.includes("elbow grease") ||
    q.includes("dirty deeds") ||
    q.includes("liquid courage") ||
    q.includes("crop rocket") ||
    q.includes("biological fertilizer") ||
    q.includes("soil biology") ||
    q.includes("rooting") ||
    q.includes("soil test") ||
    q.includes("ph") ||
    q.includes("p h")
  ) {
    return "fertility_help";
  }

  if (
    q.includes("didnt grow") ||
    q.includes("didn't grow") ||
    q.includes("did not grow") ||
    q.includes("failed") ||
    q.includes("failure") ||
    q.includes("not coming up") ||
    q.includes("not growing") ||
    q.includes("why")
  ) {
    return "troubleshooting";
  }

  if (
    q.includes("how much") ||
    q.includes("how many bags") ||
    q.includes("how many jugs") ||
    q.includes("acres") ||
    q.includes("acre")
  ) {
    return "quantity_help";
  }

  if (
    q.includes("feed") ||
    q.includes("mineral") ||
    q.includes("block") ||
    q.includes("attractant") ||
    q.includes("bad habit") ||
    q.includes("stockpile") ||
    q.includes("recharge") ||
    q.includes("pre game") ||
    q.includes("pre-game") ||
    q.includes("ripple effect") ||
    q.includes("water hole") ||
    q.includes("waterhole") ||
    q.includes("pre game block") ||
    q.includes("pre game tub") ||
    q.includes("125lb tub")
  ) {
    return "feed_help";
  }

  if (
    q.includes("cover") ||
    q.includes("bedding") ||
    q.includes("screening") ||
    q.includes("habitat") ||
    q.includes("sanctuary") ||
    q.includes("switchgrass") ||
    q.includes("bluestem") ||
    q.includes("milo") ||
    q.includes("sorghum")
  ) {
    return "habitat_help";
  }

  if (mentionedProducts.length > 0) {
    return "product_info";
  }

  return "general_domain";
}

function shouldRecommend(questionType) {
  return [
    "what_to_plant",
    "fertility_help",
    "feed_help",
    "habitat_help"
  ].includes(questionType);
}

function detectIntent(q, questionType, mentionedProducts) {
  if (questionType === "out_of_scope") return "out_of_scope";
  if (questionType === "website_search") return "website_search";
  if (questionType === "dealer_help") return "dealer";
  if (questionType === "feed_help") return "feed";
  if (questionType === "fertility_help") return "fertility";
  if (questionType === "habitat_help") return "habitat";
  if (questionType === "when_to_plant") return "timing";
  if (questionType === "troubleshooting") return "troubleshooting";
  if (questionType === "quantity_help") return "quantity";

  if (mentionedProducts.some(name => PRODUCT_CATALOG[name]?.type === "Habitat Seed")) {
    return "habitat";
  }

  if (mentionedProducts.some(name => PRODUCT_CATALOG[name]?.type === "Liquid" || PRODUCT_CATALOG[name]?.category === "fertility")) {
    return "fertility";
  }

  if (mentionedProducts.some(name => PRODUCT_CATALOG[name]?.type === "Feed" || PRODUCT_CATALOG[name]?.category === "water-hole-additive")) {
    return "feed";
  }

  return "food";
}

export function findMentionedProducts(question = "") {
  const q = normalizeText(question);

  return Object.keys(PRODUCT_CATALOG)
    .filter(name => {
      const product = PRODUCT_CATALOG[name];
      const possibleTerms = [
        name,
        product?.handle,
        product?.handle?.replaceAll("-", " "),
        product?.tag,
        product?.category,
        product?.customerCategory,
      ...(product?.aliases || [])
      ]
        .filter(Boolean)
        .map(normalizeText)
        .filter(Boolean);

      return possibleTerms.some(term => term.length >= 3 && q.includes(term));
    })
    .map(normalizeProductName);
}

export function buildOutOfScopeReply(question = "") {
  const q = normalizeText(question);

  if (q.includes("golf")) {
    return `<p>Timmy respects the golf question, but unless you’re trying to turn a slice into a seedbed, I’m probably not your guy.</p><p>Ask me about food plots, habitat, planting dates, fertilizer, feed, or finding a Domain dealer and I’ll get you dialed in.</p>`;
  }

  if (q.includes("cooler") || q.includes("yeti") || q.includes("grizzly")) {
    return `<p>I’m a turnip, not a cooler salesman. I’m going to stay in my lane before someone tries to put me on ice.</p><p>Ask me about Domain Outdoor seed, fertilizer, feed, habitat, or planting windows and I’ll help you turn your property into a DOMAIN.</p>`;
  }

  if (q.includes("shotgun") || q.includes("wife")) {
    return `<p>That sounds like a household management issue, and Timmy is not licensed for marriage counseling or firearms negotiations.</p><p>But if you need help with food plots, fertilizer, habitat, feed, or planting dates, I’m your turnip.</p>`;
  }

  if (q.includes("shed hunting")) {
    return `<p>I love the shed hunting energy, but I’m built to help with the habitat and nutrition side that helps grow deer worth looking for.</p><p>Ask me about food plots, minerals, feed, bedding cover, or planting strategy and I’ll help you build a better shed-hunting property.</p>`;
  }

  return `<p>Nice try. Timmy may be a turnip, but he knows when he’s being baited.</p><p>I’m here for Domain Outdoor questions: food plots, planting dates, fertilizer, feed, habitat, soil, website tools, product pages, and dealer help. Ask me about your land or what you’re looking for and I’ll get you pointed in the right direction.</p>`;
}

export function buildProductSpecificAnswer({
  question = "",
  productName,
  region = "unknown",
  timingText = "",
  links = LINKS
}) {
  const product = PRODUCT_CATALOG[productName];

  if (!product) {
    return `<p>I recognize you’re asking about a Domain product, but I need a little more detail to answer it right.</p>`;
  }

  const q = normalizeText(question);

  if (
    q.includes("where is") ||
    q.includes("where can i find") ||
    q.includes("looking for") ||
    q.includes("show me") ||
    q.includes("link me") ||
    q.includes("product page")
  ) {
    return `
<p><strong>Yep — I can help you find that.</strong></p>
<p><strong>${productName}</strong><br>${product.summary || `${productName} is a Domain Outdoor product.`}</p>
<p><a href="${product.url}" target="_blank">View ${productName}</a></p>
`.trim();
  }

  if (
    q.includes("when should i plant") ||
    q.includes("when do i plant") ||
    q.includes("planting date") ||
    q.includes("planting window") ||
    q.startsWith("when ")
  ) {
    return `
<p><strong>Goal:</strong> You already have <strong>${productName}</strong> picked out, so the key question is timing.</p>
<p><strong>Planting Window:</strong> ${timingText}</p>
<p><strong>Product Fit:</strong> ${product.summary || `${productName} is a Domain Outdoor product built for food plot and land-management use.`}</p>
<p><strong>Next Step:</strong> For the best day to plant, use the <a href="${links.plantingDate}" target="_blank">Planting Date Advisor</a> and enter your ZIP code with <strong>${productName}</strong>.</p>
`.trim();
  }

  if (q.includes("how much") || q.includes("how many")) {
    return `
<p><strong>Goal:</strong> You’re trying to figure out how much <strong>${productName}</strong> you need.</p>
<p><strong>Coverage:</strong> ${product.coveragePerUnit ? `One unit covers about <strong>${product.coveragePerUnit} acre${product.coveragePerUnit === 1 ? "" : "s"}</strong>.` : "Coverage depends on the package size and product."}</p>
<p><strong>Next Step:</strong> Tell me your total acres and I can help estimate how many units to buy.</p>
`.trim();
  }

  if (product.type === "Soil Test") {
    return `
<p><strong>Goal:</strong> You’re asking about <strong>${productName}</strong>.</p>
<p><strong>Product Fit:</strong> ${product.summary || `${productName} helps you understand your soil before planting.`}</p>
<p><strong>Next Step:</strong> After you have your results, use the <a href="${links.plotEnhancing}" target="_blank">Plot Enhancing App</a> to build a fertility plan from your pH, phosphorus, potassium, and acreage.</p>
<p><a href="${product.url}" target="_blank">View ${productName}</a></p>
`.trim();
  }

  return `
<p><strong>Goal:</strong> You’re asking about <strong>${productName}</strong>.</p>
<p><strong>Product Fit:</strong> ${product.summary || `${productName} is a Domain Outdoor product built for food plot and land-management use.`}</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Next Step:</strong> Use the <a href="${links.plantingDate}" target="_blank">Planting Date Advisor</a> for timing or the <a href="${links.dealerLocator}" target="_blank">Dealer Locator</a> to find it near you.</p>
`.trim();
}