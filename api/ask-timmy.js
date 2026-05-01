// api/ask-timmy.js
import {
  routeQuestion,
  buildOutOfScopeReply,
  buildProductSpecificAnswer
} from "../data/question-router.js";

import {
  PRODUCT_CATALOG,
  LINKS,
  isSeed,
  isLiquid,
  isHabitat,
  normalizeProductName
} from "../data/domain-products.js";

import {
  getFoodPlotProducts,
  getFoodPlotWithHabitat,
  cleanFoodPlotProducts
} from "../data/food-plot-logic.js";

import {
  buildFertilityHtml,
  buildFertilityProgram
} from "../data/fertility-logic.js";

import {
  detectRegion,
  buildTimingText
} from "../data/planting-date-logic.js";

import {
  getFeedProducts,
  cleanFeedProducts,
  buildFeedText
} from "../data/feed-logic.js";

export default async function handler(req, res) {
  const allowedOrigins = [
    "https://domainoutdoor.com",
    "https://www.domainoutdoor.com"
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST." });
  }

  try {
    const { question } = req.body || {};
    const safeQuestion = String(question || "").trim();

    if (!safeQuestion) {
      return res.status(200).json({
        answer:
          "<p>Ask Timmy what you’re trying to accomplish, and include your state, acres, goal, and equipment if you can.</p>",
        products: [],
        blogs: [],
        acres: null
      });
    }

const route = routeQuestion(safeQuestion);
const acres = detectAcres(safeQuestion);
const region = detectRegion(safeQuestion);
const intent = route.intent;

if (!route.isDomainRelated) {
  return res.status(200).json({
    answer: buildOutOfScopeReply(safeQuestion),
    products: [],
    blogs: [],
    acres: null
  });
}

    let products = [];

    if (intent === "feed") {
      products = cleanFeedProducts(getFeedProducts(safeQuestion));
    } else if (intent === "fertility") {
      products = inferFertilityProducts(safeQuestion);
    } else if (intent === "habitat") {
      products = getHabitatProducts(safeQuestion);
    } else {
      products = cleanFoodPlotProducts(getFoodPlotProducts(safeQuestion));
    }

    const timingText = buildTimingText({
      question: safeQuestion,
      region,
      intent,
      productNames: products
    });

    const answer = buildAnswer({
      question: safeQuestion,
      intent,
      products,
      acres,
      region,
      timingText
    });

    return res.status(200).json({
      answer,
      products: buildProductCards(products, safeQuestion, acres),
      blogs: [],
      acres: acres || null
    });
  } catch (err) {
    return res.status(200).json({
      answer:
        "<p><strong>Timmy hit a little rut.</strong> Try asking again with your state, acres, and what you’re trying to accomplish.</p>",
      products: [],
      blogs: [],
      acres: null
    });
  }
}

// -------------------------------
// INTENT DETECTION
// -------------------------------
function detectIntent(question = "") {
  const q = question.toLowerCase();

  const feedWords = [
    "feed",
    "mineral",
    "attractant",
    "block",
    "protein",
    "antler",
    "bad habit",
    "stockpile",
    "recharge",
    "pre game"
  ];

  const fertilityWords = [
    "fertilizer",
    "fertility",
    "soil test",
    "ph",
    "lime",
    "calcium",
    "nitrogen",
    "phosphorus",
    "potassium",
    "spray",
    "crank",
    "freight",
    "elbow grease",
    "dirty deeds",
    "liquid courage"
  ];

  const habitatWords = [
    "bedding",
    "cover",
    "screen",
    "screening",
    "sanctuary",
    "concealment",
    "hide",
    "travel corridor",
    "movement",
    "switchgrass",
    "native grass",
    "warm season grass",
    "bluestem",
    "indian grass",
    "milo",
    "sorghum",
    "grain sorghum"
  ];

  const foodWords = [
    "food plot",
    "what should i plant",
    "seed",
    "plant",
    "plot",
    "clover",
    "brassica",
    "grain",
    "turnip",
    "radish",
    "rye",
    "wheat"
  ];

  if (feedWords.some(word => q.includes(word))) return "feed";
  if (fertilityWords.some(word => q.includes(word))) return "fertility";
  if (habitatWords.some(word => q.includes(word))) return "habitat";
  if (foodWords.some(word => q.includes(word))) return "food";

  return "food";
}

// -------------------------------
// ACRE DETECTION
// -------------------------------
function detectAcres(question = "") {
  const q = question.toLowerCase();
  const match = q.match(/(\d+(\.\d+)?)\s*(acre|acres|ac)/);

  if (!match) return null;

  return Number(match[1]);
}

// -------------------------------
// HABITAT PRODUCTS
// -------------------------------
function getHabitatProducts(question = "") {
  const q = question.toLowerCase();

  if (
    q.includes("milo") ||
    q.includes("sorghum") ||
    (q.includes("food") && q.includes("cover"))
  ) {
    return [
      "Milo",
      "RC Big Rock Switchgrass",
      "Big Bluestem"
    ];
  }

  if (
    q.includes("screen") ||
    q.includes("screening") ||
    q.includes("hide") ||
    q.includes("concealment")
  ) {
    return [
      "RC Big Rock Switchgrass",
      "RC Sundance Switchgrass",
      "Big Bluestem"
    ];
  }

  if (
    q.includes("bedding") ||
    q.includes("cover") ||
    q.includes("sanctuary")
  ) {
    return [
      "RC Big Rock Switchgrass",
      "Big Bluestem",
      "Indian Grass"
    ];
  }

  return [
    "RC Big Rock Switchgrass",
    "Big Bluestem",
    "Indian Grass"
  ];
}

// -------------------------------
// FERTILITY PRODUCT DETECTION
// -------------------------------
function inferFertilityProducts(question = "") {
  const q = question.toLowerCase();
  const products = new Set();

  products.add("Crank'd");

  if (
    q.includes("nitrogen") ||
    q.includes("growth") ||
    q.includes("brassica") ||
    q.includes("milo") ||
    q.includes("sorghum") ||
    q.includes("corn")
  ) {
    products.add("Freight Train");
  }

  if (
    q.includes("ph") ||
    q.includes("lime") ||
    q.includes("calcium") ||
    q.includes("acidic")
  ) {
    products.add("Elbow Grease");
  }

  if (
    q.includes("poor") ||
    q.includes("sandy") ||
    q.includes("organic matter") ||
    q.includes("soil health") ||
    q.includes("hard soil")
  ) {
    products.add("Dirty Deeds");
  }

  if (
    q.includes("foliar") ||
    q.includes("stress") ||
    q.includes("boost")
  ) {
    products.add("Liquid Courage");
  }

  return [...products];
}

// -------------------------------
// ANSWER BUILDER
// -------------------------------
function buildAnswer({
  question,
  intent,
  products,
  acres,
  region,
  timingText
}) {
  const productLine = products
    .map(name => `<strong>${name}</strong>`)
    .join(", ");

  if (intent === "feed") {
    const feedText = buildFeedText(products);

    return `
<p><strong>Goal:</strong> It sounds like you’re looking for feed, mineral, or attractant help.</p>
<p><strong>Best Product Fit:</strong> ${feedText}</p>
<p><strong>Timing:</strong> Feed and mineral strategy depends on season, pressure, and local regulations. Use them where legal and where deer are already comfortable moving.</p>
<p><strong>Fertility:</strong> Not needed for feed products.</p>
<p><strong>Next Step:</strong> Use the <a href="${LINKS.dealerLocator}" target="_blank">Dealer Locator</a> to find Domain feed and mineral products near you.</p>
`.trim();
  }

  if (intent === "fertility") {
    const fertilityHtml = buildFertilityHtml({
      question,
      productNames: products,
      acres
    });

    return `
<p><strong>Goal:</strong> It sounds like you’re trying to dial in fertility or improve plot performance.</p>
<p><strong>Best Product Fit:</strong> I’d start with ${productLine} based on what you asked.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> ${fertilityHtml}</p>
<p><strong>Next Step:</strong> Use the <a href="${LINKS.plotEnhancing}" target="_blank">Plot Enhancing App</a> for the most accurate rate based on crop, pH, phosphorus, potassium, and acres.</p>
`.trim();
  }

  if (intent === "habitat") {
    return `
<p><strong>Goal:</strong> It sounds like you’re trying to create cover, bedding, screening, concealment, or movement control.</p>
<p><strong>Best Product Fit:</strong> I’d prioritize ${productLine}. Milo belongs in the conversation when you want seasonal cover plus seed-head food, but it is not a permanent perennial bedding screen.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> For permanent bedding and native grass habitat, focus first on seedbed prep, weed control, timing, and moisture. For Milo, a moderate at-plant fertility pass can help because it acts like a warm-season grain sorghum crop.</p>
<p><strong>Next Step:</strong> Review the <a href="${LINKS.habitatProducts}" target="_blank">Habitat Products</a> page, or use the <a href="${LINKS.foodPlotSelector}" target="_blank">Food Plot Selector</a> if you also want a nearby food source.</p>
`.trim();
  }

  const fertilityHtml = acres
    ? buildFertilityHtml({
        question,
        productNames: products,
        acres
      })
    : `Tell me your plot size in acres and I can size liquid gallons and pails correctly.`;

  return `
<p><strong>Goal:</strong> It sounds like you’re trying to choose the right food plot seed for your property.</p>
<p><strong>Best Product Fit:</strong> I’d start with ${productLine}. These are strong fits based on the goal and conditions you described.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> ${fertilityHtml}</p>
<p><strong>Next Step:</strong> Use the <a href="${LINKS.foodPlotSelector}" target="_blank">Food Plot Selector</a> to refine your seed choice, the <a href="${LINKS.plotEnhancing}" target="_blank">Plot Enhancing App</a> to confirm fertility, and the <a href="${LINKS.plantingDate}" target="_blank">Planting Date Advisor</a> to pick the best window.</p>
`.trim();
}

// -------------------------------
// PRODUCT CARDS FOR FRONT END
// -------------------------------
function buildProductCards(products = [], question = "", acres = null) {
  const fertilityProgram = buildFertilityProgram({
    question,
    productNames: products,
    acres: acres || 1
  });

  return [...new Set(products)]
    .map(normalizeProductName)
    .filter(name => PRODUCT_CATALOG[name])
    .slice(0, 8)
    .map(name => {
      const product = PRODUCT_CATALOG[name];

      const card = {
        name,
        type: product.type,
        tag: product.tag,
        handle: product.handle,
        url: product.url,
        coveragePerUnit: product.coveragePerUnit || 1,
        recommendedQty: null
      };

      if (isLiquid(name) && acres) {
        const liquid = fertilityProgram[name];

        if (liquid && liquid.ratePerAcre > 0) {
          card.recommendedQty = Math.max(1, Math.ceil(liquid.totalPailGallons || liquid.totalGallons));
          card.liquidDetails = liquid;
        } else {
          card.recommendedQty = 0;
          card.liquidDetails = liquid || null;
        }
      }

      if (isSeed(name) && acres) {
        card.recommendedQty = Math.max(
          1,
          Math.ceil(acres / (product.coveragePerUnit || 1))
        );
      }

      return card;
    });
}
