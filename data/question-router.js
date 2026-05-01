// data/question-router.js

import { PRODUCT_CATALOG, normalizeProductName } from "./domain-products.js";

const DOMAIN_TERMS = [
  "domain", "food plot", "plot", "seed", "plant", "planting", "fertilizer",
  "soil", "ph", "lime", "calcium", "deer", "whitetail", "turkey", "wildlife",
  "habitat", "cover", "bedding", "screening", "dealer", "feed", "mineral",
  "attractant", "milo", "sorghum", "forage", "clover", "brassica", "turnip",
  "radish", "rye", "wheat", "oats", "switchgrass", "bluestem", "crank",
  "freight", "elbow", "dirty deeds", "liquid courage", "bad habit",
  "stockpile", "recharge", "pre game"
];

const RANDOM_TERMS = [
  "golf", "cooler", "yeti", "grizzly", "shotgun", "wife", "truck", "football",
  "baseball", "recipe", "weather tomorrow", "stock market", "politics",
  "dating", "beer", "movie", "music", "vacation"
];

export function routeQuestion(question = "") {
  const q = question.toLowerCase();

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

function isDomainRelated(q, mentionedProducts) {
  if (mentionedProducts.length > 0) return true;
  if (DOMAIN_TERMS.some(term => q.includes(term))) return true;
  return false;
}

function detectQuestionType(q, mentionedProducts) {
  if (q.includes("dealer") || q.includes("where can i buy") || q.includes("near me")) {
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
    q.includes("soil test") ||
    q.includes("ph")
  ) {
    return "fertility_help";
  }

  if (
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
    q.includes("pre game")
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
  if (questionType === "feed_help") return "feed";
  if (questionType === "fertility_help") return "fertility";
  if (questionType === "habitat_help") return "habitat";
  if (questionType === "when_to_plant") return "timing";
  if (questionType === "troubleshooting") return "troubleshooting";
  if (questionType === "quantity_help") return "quantity";

  if (mentionedProducts.some(name => PRODUCT_CATALOG[name]?.type === "Habitat Seed")) {
    return "habitat";
  }

  return "food";
}

export function findMentionedProducts(question = "") {
  const q = question.toLowerCase();

  return Object.keys(PRODUCT_CATALOG)
    .filter(name => {
      const product = PRODUCT_CATALOG[name];
      const nameMatch = q.includes(name.toLowerCase());
      const handleMatch = product.handle && q.includes(product.handle.toLowerCase().replaceAll("-", " "));
      return nameMatch || handleMatch;
    })
    .map(normalizeProductName);
}

export function buildOutOfScopeReply(question = "") {
  const q = question.toLowerCase();

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

  return `<p>Nice try. Timmy may be a turnip, but he knows when he’s being baited.</p><p>I’m here for Domain Outdoor questions: food plots, planting dates, fertilizer, feed, habitat, soil, and dealer help. Ask me about your land and I’ll get you pointed in the right direction.</p>`;
}

export function buildProductSpecificAnswer({
  question = "",
  productName,
  region = "unknown",
  timingText = "",
  links = {}
}) {
  const product = PRODUCT_CATALOG[productName];

  if (!product) {
    return `<p>I recognize you’re asking about a Domain product, but I need a little more detail to answer it right.</p>`;
  }

  const q = question.toLowerCase();

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

  return `
<p><strong>Goal:</strong> You’re asking about <strong>${productName}</strong>.</p>
<p><strong>Product Fit:</strong> ${product.summary || `${productName} is a Domain Outdoor product built for food plot and land-management use.`}</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Next Step:</strong> Use the <a href="${links.plantingDate}" target="_blank">Planting Date Advisor</a> for timing or the <a href="${links.dealerLocator}" target="_blank">Dealer Locator</a> to find it near you.</p>
`.trim();
}