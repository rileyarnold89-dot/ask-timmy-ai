import {
  PRODUCT_CATALOG,
  LINKS,
  isSeed,
  isLiquid,
  normalizeProductName
} from "../data/domain-products.js";

import {
  getFoodPlotProducts,
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
  buildFeedText,
  isFeedQuestion
} from "../data/feed-logic.js";

import {
  routeQuestion,
  buildOutOfScopeReply,
  buildProductSpecificAnswer
} from "../data/question-router.js";

const DOMAIN_SITE_TOOLS = {
  propertyPlanner: {
    name: "Domain Property Planner",
    keywords: [
      "property planner",
      "property plan",
      "build my property plan",
      "start planning",
      "planner"
    ],
    url: "https://domainoutdoor.com/pages/property-planner",
    description:
      "The main hub for choosing what to plant, when to plant it, building a fertility plan, and asking Timmy for help."
  },

  foodPlotSelector: {
    name: "Food Plot Selector",
    keywords: [
      "food plot selector",
      "seed selector",
      "selection chart",
      "what should i plant",
      "help me pick seed",
      "choose seed",
      "pick a food plot"
    ],
    url: "https://domainoutdoor.com/pages/selection-chart-app",
    description:
      "Helps you choose the right Domain Outdoor seed mix based on soil, sunlight, equipment, pH, and goals."
  },

  plantingDateAdvisor: {
    name: "Planting Date Advisor",
    keywords: [
      "planting date",
      "planting date app",
      "when should i plant",
      "planting advisor",
      "best planting date",
      "planting window",
      "when to plant"
    ],
    url: "https://domainoutdoor.com/pages/planing-date-app",
    description:
      "Helps you find planting timing based on location, seed mix, season, and goal."
  },

  plotEnhancingApp: {
    name: "Plot Enhancing App",
    keywords: [
      "plot enhancing app",
      "fertility app",
      "fertilizer calculator",
      "liquid fertilizer",
      "fertility program",
      "soil test results",
      "phosphorus",
      "potassium",
      "soil ph",
      "build fertility program"
    ],
    url: "https://domainoutdoor.com/pages/plot-enhancing-app",
    description:
      "Helps you build a liquid fertility plan based on soil pH, phosphorus, potassium, acres, and crop."
  },

  askTimmy: {
    name: "Ask Timmy",
    keywords: [
      "ask timmy",
      "timmy",
      "chat",
      "ai help",
      "quick answer"
    ],
    url: "https://domainoutdoor.com/pages/ask-timmy",
    description:
      "Domain Outdoor’s AI helper for food plot, planting, fertility, feed, attractant, and product questions."
  },

  dealerLocator: {
    name: "Dealer Locator",
    keywords: [
      "dealer",
      "dealer locator",
      "find a dealer",
      "retailer",
      "store near me",
      "where to buy",
      "local store"
    ],
    url: "https://domainoutdoor.com/pages/dealer-locator",
    description:
      "Helps you find Domain Outdoor products at local retail dealers."
  }
};

const DOMAIN_PRODUCT_SEARCH_ALIASES = {
  comprehensiveSoilTestKit: {
    productName: "Comprehensive Food Plot Soil Test Kit",
    name: "Comprehensive Food Plot Soil Test Kit",
    keywords: [
      "comprehensive soil test",
      "comprehensive soil test kit",
      "comprehensive food plot soil test",
      "comprehensive food plot soil test kit",
      "soil test",
      "soil test kit",
      "soil testing kit",
      "lab soil test",
      "soil sample",
      "test my soil",
      "phosphorus test",
      "potassium test"
    ],
    url: "https://domainoutdoor.com/products/comprehensive-food-plot-soil-test-kit",
    description:
      "A full soil test option for customers who want pH, phosphorus, potassium, and fertility information before planting."
  },

  instantPhTestKit: {
    productName: "DIY Instant pH Test Kit",
    name: "DIY Instant pH Test Kit",
    keywords: [
      "ph test kit",
      "p h test kit",
      "instant ph",
      "instant ph test",
      "diy ph test",
      "soil ph kit",
      "instant soil test"
    ],
    url: "https://domainoutdoor.com/products/diy-instant-ph-test-kit?variant=43413529264377",
    description:
      "A quick pH test kit for checking soil pH before planting."
  }
};

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
        answer: "<p>Ask me about food plots, planting dates, fertilizer, feed, habitat, soil, or finding a Domain dealer.</p>",
        products: [],
        blogs: [],
        acres: null
      });
    }

    /*
      Website search / product finder mode.
      This runs BEFORE the out-of-scope / “Can’t trick me” logic.
      That way short product-search messages like “soil test kit”
      or “where is the pH test kit” are treated as valid Domain requests.
    */
    const websiteSearchMatch = findWebsiteSearchMatch(safeQuestion);

    if (websiteSearchMatch) {
      return res.status(200).json({
        answer: buildWebsiteSearchResponse(websiteSearchMatch),
        products: websiteSearchMatch.productName
          ? buildProductCards([websiteSearchMatch.productName], safeQuestion, null)
          : [],
        blogs: [],
        acres: null
      });
    }

    const route = routeQuestion(safeQuestion);
    const acres = detectAcres(safeQuestion);
    const region = detectRegion(safeQuestion);
    const intent = route.intent;

    const feedQuestion = isFeedQuestion(safeQuestion);
    const plantingQuestion = isPlantingQuestion(safeQuestion);

    if (!route.isDomainRelated && !feedQuestion && !plantingQuestion) {
      return res.status(200).json({
        answer: buildOutOfScopeReply(safeQuestion),
        products: [],
        blogs: [],
        acres: null
      });
    }

    let products = [];

    if (
      route.mentionedProducts.length > 0 &&
      ["when_to_plant", "product_info", "quantity_help"].includes(route.questionType)
    ) {
      products = route.mentionedProducts;
    } else if (plantingQuestion) {
      products = cleanFoodPlotProducts(getFoodPlotProducts(safeQuestion));
    } else if (intent === "feed" || feedQuestion) {
      products = cleanFeedProducts(getFeedProducts(safeQuestion));
    } else if (intent === "fertility") {
      products = inferFertilityProducts(safeQuestion);
    } else if (intent === "habitat") {
      products = getHabitatProducts(safeQuestion);
    } else {
      products = cleanFoodPlotProducts(getFoodPlotProducts(safeQuestion));
    }

    const effectiveIntent = plantingQuestion ? "food_plot" : intent;

    const timingText = buildTimingText({
      question: safeQuestion,
      region,
      intent: effectiveIntent,
      productNames: products
    });

    if (
      route.mentionedProducts.length > 0 &&
      ["when_to_plant", "product_info", "quantity_help"].includes(route.questionType)
    ) {
      const productName = route.mentionedProducts[0];

      return res.status(200).json({
        answer: buildProductSpecificAnswer({
          question: safeQuestion,
          productName,
          region,
          timingText,
          links: LINKS
        }),
        products: buildProductCards([productName], safeQuestion, acres),
        blogs: [],
        acres: acres || null
      });
    }

    const answer = buildAnswer({
      question: safeQuestion,
      intent: effectiveIntent,
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
    console.error("Timmy API error:", err);

    return res.status(200).json({
      answer: "<p>Timmy hit a rut. Try asking again with your state, acres, and what you’re trying to accomplish.</p>",
      products: [],
      blogs: [],
      acres: null
    });
  }
}

function normalizeSearchText(text = "") {
  return String(text || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[™®']/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isWebsiteSearchQuestion(question = "") {
  const q = normalizeSearchText(question);

  const searchTriggers = [
    "looking for",
    "where is",
    "where are",
    "do you have",
    "can you find",
    "find me",
    "show me",
    "link me",
    "send me",
    "i need",
    "i want",
    "where can i buy",
    "how do i find",
    "take me to",
    "product page",
    "website",
    "page for"
  ];

  return searchTriggers.some(trigger => q.includes(trigger));
}

function findWebsiteSearchMatch(question = "") {
  const q = normalizeSearchText(question);
  if (!q) return null;

  const searchLike = isWebsiteSearchQuestion(q);

  const allTools = Object.values(DOMAIN_SITE_TOOLS);
  const allAliases = Object.values(DOMAIN_PRODUCT_SEARCH_ALIASES);

  const explicitItems = [...allAliases, ...allTools];

  let bestMatch = null;

  explicitItems.forEach(item => {
    const matchedKeyword = item.keywords.find(keyword => {
      const cleanKeyword = normalizeSearchText(keyword);
      return cleanKeyword && q.includes(cleanKeyword);
    });

    if (matchedKeyword) {
      const cleanMatchedKeyword = normalizeSearchText(matchedKeyword);

      if (!bestMatch || cleanMatchedKeyword.length > bestMatch.score) {
        bestMatch = {
          type: item.productName ? "product" : "tool",
          name: item.name,
          productName: item.productName || null,
          url: item.url,
          description: item.description,
          matchedKeyword,
          score: cleanMatchedKeyword.length
        };
      }
    }
  });

  if (bestMatch) return bestMatch;

  /*
    If the user sounds like they are trying to find something on the site,
    search the full product catalog by product name, handle, tag, and type.
    This lets Timmy find products like Big Sexy, Recharge, Crank'd, Bad Habit,
    Stockpile, Dirty Deeds, etc. without treating short searches as trick prompts.
  */
  if (searchLike) {
    Object.entries(PRODUCT_CATALOG || {}).forEach(([catalogName, product]) => {
      const possibleTerms = [
        catalogName,
        product?.name,
        product?.title,
        product?.handle,
        product?.tag,
        product?.type
      ]
        .filter(Boolean)
        .map(normalizeSearchText)
        .filter(Boolean);

      possibleTerms.forEach(term => {
        if (q.includes(term) && term.length >= 3) {
          if (!bestMatch || term.length > bestMatch.score) {
            bestMatch = {
              type: "product",
              name: catalogName,
              productName: catalogName,
              url:
                product.url ||
                (product.handle
                  ? `https://domainoutdoor.com/products/${product.handle}`
                  : "https://domainoutdoor.com"),
              description: getProductFinderDescription(catalogName, product),
              matchedKeyword: term,
              score: term.length
            };
          }
        }
      });
    });
  }

  return bestMatch;
}

function getProductFinderDescription(name, product = {}) {
  if (product.description) return product.description;
  if (product.tag) return product.tag;
  if (product.type) return `A Domain Outdoor ${product.type} product.`;
  return `A Domain Outdoor product page for ${name}.`;
}

function buildWebsiteSearchResponse(match) {
  const itemName = match.name || "that page";
  const itemUrl = match.url || "https://domainoutdoor.com";
  const description = match.description || "Here is the page you were looking for.";

  let extra = "";

  const n = normalizeSearchText(itemName);

  if (n.includes("soil test") || n.includes("ph test")) {
    extra = `
<p>If you're using those results for a food plot, plug your pH, phosphorus, potassium, and acreage into the <a href="${LINKS.plotEnhancing || "https://domainoutdoor.com/pages/plot-enhancing-app"}" target="_blank">Plot Enhancing App</a> to build a fertility plan.</p>`;
  } else if (n.includes("planting")) {
    extra = `
<p>That tool is especially helpful when you already know which seed mix you want to plant and need help narrowing down the best timing.</p>`;
  } else if (n.includes("plot enhancing") || n.includes("fertility")) {
    extra = `
<p>Have your soil pH, phosphorus, potassium, and acreage ready for the best recommendation.</p>`;
  }

  return `
<p>Yep — I can help you find that.</p>
<p><strong>${itemName}</strong><br>${description}</p>
<p><a href="${itemUrl}" target="_blank">View ${itemName}</a></p>
${extra}
`.trim();
}

function detectAcres(question = "") {
  const q = question.toLowerCase();
  const match = q.match(/(\d+(\.\d+)?)\s*(acre|acres|ac)/);
  return match ? Number(match[1]) : null;
}

function isPlantingQuestion(question = "") {
  const q = question.toLowerCase();

  const strongPlantingWords = [
    "plant",
    "planting",
    "planted",
    "seed",
    "seeding",
    "sow",
    "sowing",
    "broadcast",
    "drill",
    "no till",
    "no-till",
    "food plot",
    "plot"
  ];

  const landAndSoilWords = [
    "acre",
    "acres",
    "soil",
    "clay",
    "sandy",
    "sand",
    "loam",
    "rocky",
    "wet soil",
    "dry soil",
    "ph",
    "sun",
    "shade",
    "full sun",
    "partial shade",
    "panhandle",
    "field",
    "ground",
    "property"
  ];

  const explicitFeedWords = [
    "feed",
    "feeding",
    "feeder",
    "mineral",
    "minerals",
    "block",
    "attractant",
    "corn",
    "bait",
    "pre game",
    "bad habit",
    "stockpile",
    "recharge"
  ];

  const hasStrongPlantingIntent = strongPlantingWords.some(word => q.includes(word));
  const hasLandContext = landAndSoilWords.some(word => q.includes(word));
  const hasExplicitFeedIntent = explicitFeedWords.some(word => q.includes(word));

  /*
    Planting override:
    If someone says plant/seed/food plot/plot, Timmy should treat it as a seed/food plot question,
    even if the sentence includes deer, turkey, wildlife, acres, or attraction language.
    Only keep it in feed when the customer clearly asks for feed/mineral/block/attractant/corn.
  */
  if (hasStrongPlantingIntent && !hasExplicitFeedIntent) return true;

  /*
    Land-context fallback:
    Example: "I need something on 120 acres in Oklahoma clay soil for deer and turkey."
    Even without the word "plant," acres + soil + wildlife usually means seed/habitat, not feed.
  */
  if (hasLandContext && !hasExplicitFeedIntent) return true;

  return false;
}

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

function getHabitatProducts(question = "") {
  const q = question.toLowerCase();

  if (
    q.includes("food and cover") ||
    q.includes("cover and food") ||
    q.includes("bedding and food") ||
    q.includes("food and bedding") ||
    q.includes("bedding/food") ||
    q.includes("screening/food") ||
    q.includes("milo") ||
    q.includes("sorghum")
  ) {
    return ["Milo", "Dirty Bird", "Japanese Millet", "Sunflower", "Landing Strip"];
  }

  if (
    q.includes("screen") ||
    q.includes("screening") ||
    q.includes("hide") ||
    q.includes("concealment")
  ) {
    return ["RC Big Rock Switchgrass", "RC Sundance Switchgrass", "Big Bluestem"];
  }

  if (
    q.includes("bedding") ||
    q.includes("cover") ||
    q.includes("sanctuary")
  ) {
    return ["RC Big Rock Switchgrass", "Big Bluestem", "Indian Grass"];
  }

  return ["RC Big Rock Switchgrass", "Big Bluestem", "Indian Grass"];
}

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

  if (!isPlantingQuestion(question) && (intent === "feed" || isFeedQuestion(question))) {
    return `
<p><strong>Goal:</strong> It sounds like you’re looking for feed, mineral, or attractant help.</p>
<p><strong>Best Product Fit:</strong></p>
${buildFeedText({ question, products, region })}
<p><strong>Fertility:</strong> Not needed for feed products.</p>
<p><strong>Next Step:</strong> Use the <a href="${LINKS.dealerLocator}" target="_blank">Dealer Locator</a> to find Domain feed and mineral products near you.</p>
`.trim();
  }

  if (intent === "fertility") {
    return `
<p><strong>Goal:</strong> It sounds like you’re trying to dial in fertility or improve plot performance.</p>
<p><strong>Best Product Fit:</strong> I’d start with ${productLine} based on what you asked.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> ${buildFertilityHtml({ question, productNames: products, acres })}</p>
<p><strong>Next Step:</strong> Use the <a href="${LINKS.plotEnhancing}" target="_blank">Plot Enhancing App</a> for the most accurate rate based on crop, pH, phosphorus, potassium, and acres.</p>
`.trim();
  }

  if (intent === "habitat") {
    return `
<p><strong>Goal:</strong> It sounds like you’re trying to create cover, bedding, screening, concealment, or movement control.</p>
<p><strong>Best Product Fit:</strong> I’d prioritize ${productLine}. These are annual food-and-cover options that can provide seasonal structure, seed-head food value, and wildlife attraction. If you want permanent bedding only, then switchgrass and native grasses become the better fit.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> For permanent bedding and native grass habitat, focus first on seedbed prep, weed control, timing, and moisture. For Milo, a moderate at-plant fertility pass can help because it acts like a warm-season grain sorghum crop.</p>
<p><strong>Next Step:</strong> Review the <a href="${LINKS.habitatProducts}" target="_blank">Habitat Products</a> page, or use the <a href="${LINKS.foodPlotSelector}" target="_blank">Food Plot Selector</a> if you also want a nearby food source.</p>
`.trim();
  }

  return `
<p><strong>Goal:</strong> It sounds like you’re trying to choose the right food plot seed for your property.</p>
<p><strong>Best Product Fit:</strong> I’d start with ${productLine}. These are strong fits based on the goal and conditions you described.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> ${buildFertilityHtml({ question, productNames: products, acres })}</p>
<p><strong>Next Step:</strong> Use the <a href="${LINKS.foodPlotSelector}" target="_blank">Food Plot Selector</a> to refine your seed choice, the <a href="${LINKS.plotEnhancing}" target="_blank">Plot Enhancing App</a> to confirm fertility, and the <a href="${LINKS.plantingDate}" target="_blank">Planting Date Advisor</a> to pick the best window.</p>
`.trim();
}

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
        image: product.image || product.imageUrl || product.imageUrlOverride || "",
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
        card.recommendedQty = Math.max(1, Math.ceil(acres / (product.coveragePerUnit || 1)));
      }

      return card;
    });
}