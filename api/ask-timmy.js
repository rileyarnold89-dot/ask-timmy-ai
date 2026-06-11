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
        acres: null,
        savePayload: null
      });
    }

    const websiteSearchMatch = findWebsiteSearchMatch(safeQuestion);

    if (websiteSearchMatch) {
      const answer = buildWebsiteSearchResponse(websiteSearchMatch);
      const responseProducts = websiteSearchMatch.productName
        ? buildProductCards([websiteSearchMatch.productName], safeQuestion, null)
        : [];

      logTimmyQuestion({
        question: safeQuestion,
        intent: "website_search",
        questionType: "website_search",
        products: responseProducts.map(p => p.name),
        acres: null,
        region: "unknown",
        blogIdeas: buildBlogIdeas({
          question: safeQuestion,
          intent: "website_search",
          products: responseProducts.map(p => p.name)
        })
      });

      const blogs = buildBlogIdeas({
        question: safeQuestion,
        intent: "website_search",
        products: responseProducts.map(p => p.name)
      });

      return res.status(200).json({
        answer,
        products: responseProducts,
        blogs,
        acres: null,
        savePayload: buildTimmySavePayload({
          question: safeQuestion,
          answer,
          intent: "website_search",
          questionType: "website_search",
          products: responseProducts,
          blogs,
          acres: null,
          region: "unknown"
        })
      });
    }

    const route = routeQuestion(safeQuestion);
    const acres = detectAcres(safeQuestion);
    const region = detectRegion(safeQuestion);
    const intent = route.intent;

    const feedQuestion = isFeedQuestion(safeQuestion);
    const plantingQuestion = isPlantingQuestion(safeQuestion);
    const exactProductName = findExactProductMention(safeQuestion);

    if (exactProductName && shouldAnswerExactProductFirst(safeQuestion, route)) {
      const exactIntent = getExactProductIntent({
        question: safeQuestion,
        productName: exactProductName,
        route,
        plantingQuestion,
        feedQuestion
      });

      const exactTimingText = buildTimingText({
        question: safeQuestion,
        region,
        intent: exactIntent === "timing" ? "food_plot" : exactIntent,
        productNames: [exactProductName]
      });

      const exactProductAnswer = buildExactProductAnswer({
        question: safeQuestion,
        productName: exactProductName,
        region,
        timingText: exactTimingText,
        links: LINKS
      });

      const answer = addTimmyNextStep({
        html: exactProductAnswer,
        question: safeQuestion,
        intent: exactIntent,
        products: [exactProductName],
        acres,
        region
      });

      const responseProducts = buildProductCards([exactProductName], safeQuestion, acres);
      const blogs = buildBlogIdeas({
        question: safeQuestion,
        intent: exactIntent,
        products: [exactProductName]
      });

      logTimmyQuestion({
        question: safeQuestion,
        intent: exactIntent,
        questionType: "exact_product",
        products: [exactProductName],
        acres,
        region,
        blogIdeas: blogs
      });

      return res.status(200).json({
        answer,
        products: responseProducts,
        blogs,
        acres: acres || null,
        savePayload: buildTimmySavePayload({
          question: safeQuestion,
          answer,
          intent: exactIntent,
          questionType: "exact_product",
          products: responseProducts,
          blogs,
          acres: acres || null,
          region
        })
      });
    }

    if (!route.isDomainRelated && !feedQuestion && !plantingQuestion && !exactProductName) {
      logTimmyQuestion({
        question: safeQuestion,
        intent: "out_of_scope",
        questionType: "out_of_scope",
        products: [],
        acres: null,
        region: "unknown",
        blogIdeas: []
      });

      const answer = buildOutOfScopeReply(safeQuestion);

      return res.status(200).json({
        answer,
        products: [],
        blogs: [],
        acres: null,
        savePayload: buildTimmySavePayload({
          question: safeQuestion,
          answer,
          intent: "out_of_scope",
          questionType: "out_of_scope",
          products: [],
          blogs: [],
          acres: null,
          region: "unknown"
        })
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

      const productSpecificAnswer = buildProductSpecificAnswer({
        question: safeQuestion,
        productName,
        region,
        timingText,
        links: LINKS
      });

      const answer = addTimmyNextStep({
        html: productSpecificAnswer,
        question: safeQuestion,
        intent: effectiveIntent,
        products: [productName],
        acres,
        region
      });

      const responseProducts = buildProductCards([productName], safeQuestion, acres);
      const blogs = buildBlogIdeas({
        question: safeQuestion,
        intent: effectiveIntent,
        products: [productName]
      });

      logTimmyQuestion({
        question: safeQuestion,
        intent: effectiveIntent,
        questionType: route.questionType,
        products: [productName],
        acres,
        region,
        blogIdeas: blogs
      });

      return res.status(200).json({
        answer,
        products: responseProducts,
        blogs,
        acres: acres || null,
        savePayload: buildTimmySavePayload({
          question: safeQuestion,
          answer,
          intent: effectiveIntent,
          questionType: route.questionType,
          products: responseProducts,
          blogs,
          acres: acres || null,
          region
        })
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

    const responseProducts = buildProductCards(products, safeQuestion, acres);
    const blogs = buildBlogIdeas({
      question: safeQuestion,
      intent: effectiveIntent,
      products
    });

    logTimmyQuestion({
      question: safeQuestion,
      intent: effectiveIntent,
      questionType: route.questionType,
      products,
      acres,
      region,
      blogIdeas: blogs
    });

    return res.status(200).json({
      answer,
      products: responseProducts,
      blogs,
      acres: acres || null,
      savePayload: buildTimmySavePayload({
        question: safeQuestion,
        answer,
        intent: effectiveIntent,
        questionType: route.questionType,
        products: responseProducts,
        blogs,
        acres: acres || null,
        region
      })
    });
  } catch (err) {
    console.error("Timmy API error:", err);

    return res.status(200).json({
      answer: "<p>Timmy hit a rut. Try asking again with your state, acres, and what you’re trying to accomplish.</p>",
      products: [],
      blogs: [],
      acres: null,
      savePayload: null
    });
  }
}

function buildTimmySavePayload({
  question = "",
  answer = "",
  intent = "food_plot",
  questionType = "general",
  products = [],
  blogs = [],
  acres = null,
  region = "unknown"
}) {
  const productNames = (products || [])
    .map(product => typeof product === "string" ? product : product?.name)
    .filter(Boolean);

  const productLinks = (products || [])
    .map(product => {
      if (typeof product === "string") {
        const catalogProduct = PRODUCT_CATALOG[product];
        return catalogProduct?.url ? { name: product, url: catalogProduct.url } : null;
      }

      if (product?.name && product?.url) {
        return { name: product.name, url: product.url };
      }

      return null;
    })
    .filter(Boolean);

  return {
    plan_type: "timmy",
    answer_title: buildTimmyAnswerTitle({ question, intent, productNames }),
    question,
    answer,
    intent,
    question_type: questionType,
    products: productNames,
    product_links: productLinks,
    blogs: (blogs || []).map(item => ({
      title: item?.title || "",
      angle: item?.angle || ""
    })).filter(item => item.title),
    acres: acres || null,
    region: region || "unknown",
    saved_from: "ask-timmy",
    saved_at: new Date().toISOString()
  };
}

function buildTimmyAnswerTitle({ question = "", intent = "food_plot", productNames = [] }) {
  if (productNames.length) {
    return `Timmy Answer: ${productNames.slice(0, 2).join(" + ")}`;
  }

  const cleanQuestion = String(question || "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanQuestion) {
    const shortQuestion = cleanQuestion.length > 58
      ? `${cleanQuestion.slice(0, 58).trim()}...`
      : cleanQuestion;

    return `Timmy Answer: ${shortQuestion}`;
  }

  const labels = {
    food_plot: "Food Plot Help",
    fertility: "Fertility Help",
    feed: "Feed Help",
    habitat: "Habitat Help",
    website_search: "Website Help",
    out_of_scope: "General Question"
  };

  return `Timmy Answer: ${labels[intent] || "Property Help"}`;
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


const PRODUCT_INTENT_WORDS = [
  "plant", "planting", "planted", "seed", "seeding", "sow", "sowing",
  "broadcast", "drill", "no till", "no-till", "rate", "depth", "fertilizer",
  "ph", "soil", "when", "where", "how", "guide", "directions", "instructions",
  "product", "tell me about", "what is", "find", "link", "buy", "order"
];

const PRODUCT_ALIAS_OVERRIDES = {
  Incognito: [
    "incognito",
    "in cognito",
    "concealment screen",
    "concealment mix",
    "access screen",
    "access screening",
    "blind screen",
    "plot screen",
    "food plot screen",
    "screening seed",
    "screening mix",
    "annual screen",
    "annual screening",
    "egyptian wheat",
    "sorghum screen",
    "sorghum screening",
    "hide access",
    "hide my access"
  ]
};

function hasNormalizedPhrase(haystack = "", needle = "") {
  const q = ` ${normalizeSearchText(haystack)} `;
  const term = normalizeSearchText(needle);
  if (!term || term.length < 3) return false;

  return q.includes(` ${term} `);
}

function findExactProductMention(question = "") {
  const q = normalizeSearchText(question);
  if (!q) return null;

  const candidates = [];

  Object.entries(PRODUCT_CATALOG || {}).forEach(([catalogName, product]) => {
    const overrideAliases = PRODUCT_ALIAS_OVERRIDES[catalogName] || [];
    const possibleTerms = [
      catalogName,
      product?.name,
      product?.title,
      product?.handle,
      ...(product?.aliases || []),
      ...overrideAliases
    ]
      .filter(Boolean)
      .map(normalizeSearchText)
      .filter(term => term.length >= 3);

    possibleTerms.forEach(term => {
      if (hasNormalizedPhrase(q, term)) {
        candidates.push({ name: catalogName, score: term.length });
      }
    });
  });

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.name || null;
}

function isExactProductIntentQuestion(question = "") {
  const q = normalizeSearchText(question);
  return PRODUCT_INTENT_WORDS.some(word => hasNormalizedPhrase(q, word));
}

function shouldAnswerExactProductFirst(question = "", route = {}) {
  const q = normalizeSearchText(question);

  if (route?.mentionedProducts?.length > 0) return true;
  if (isExactProductIntentQuestion(q)) return true;

  return [
    "planting guide",
    "seed rate",
    "planting rate",
    "seed depth",
    "how deep",
    "when to plant",
    "when should i plant",
    "how should i plant",
    "how do i plant",
    "product page",
    "view product"
  ].some(phrase => q.includes(normalizeSearchText(phrase)));
}

function getExactProductIntent({
  question = "",
  productName = "",
  route = {},
  plantingQuestion = false,
  feedQuestion = false
}) {
  const product = PRODUCT_CATALOG[productName] || {};
  const q = normalizeSearchText(question);

  if (product.type === "Feed" || feedQuestion) return "feed";
  if (product.type === "Liquid" || product.type === "Soil Test") return "fertility";

  if (
    route?.questionType === "when_to_plant" ||
    q.includes("when to plant") ||
    q.includes("planting date") ||
    q.includes("planting window")
  ) {
    return "timing";
  }

  if (plantingQuestion || (product.type?.includes("Seed") && isProductPlantingGuideQuestion(question))) {
    return "food_plot";
  }

  if (
    q.includes("screen") ||
    q.includes("screening") ||
    q.includes("conceal") ||
    q.includes("hide") ||
    q.includes("access") ||
    q.includes("bedding") ||
    q.includes("cover")
  ) {
    return "habitat";
  }

  if (product.type?.includes("Seed")) return "food_plot";

  return route?.intent || "food_plot";
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

  if (searchLike) {
    Object.entries(PRODUCT_CATALOG || {}).forEach(([catalogName, product]) => {
      const possibleTerms = [
        catalogName,
        product?.name,
        product?.title,
        product?.handle,
        product?.tag,
        product?.type,
        product?.category,
        ...(product?.aliases || [])
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
  if (product.summary) return product.summary;
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
<p><strong>Recommended Next Step:</strong> After you have your results, plug your pH, phosphorus, potassium, and acreage into the <a href="${LINKS.plotEnhancing || "https://domainoutdoor.com/pages/plot-enhancing-app"}" target="_blank">Plot Enhancing App</a> to build a fertility plan.</p>
<p><strong>Want Timmy to narrow it down?</strong> Tell me what you’re planting, how many acres, and your soil test numbers when you have them.</p>`;
  } else if (n.includes("planting")) {
    extra = `
<p><strong>Recommended Next Step:</strong> Use this when you already know your seed mix and want to narrow down the best planting window.</p>
<p><strong>Want Timmy to narrow it down?</strong> Tell me your state, seed mix, acres, and planting goal.</p>`;
  } else if (n.includes("plot enhancing") || n.includes("fertility")) {
    extra = `
<p><strong>Recommended Next Step:</strong> Have your soil pH, phosphorus, potassium, acreage, and crop ready for the best recommendation.</p>
<p><strong>Want Timmy to narrow it down?</strong> Tell me what you’re planting, your acres, and your soil test numbers.</p>`;
  } else if (n.includes("dealer")) {
    extra = `
<p><strong>Recommended Next Step:</strong> Use the Dealer Locator to find Domain Outdoor products at local retail dealers.</p>
<p><strong>Want Timmy to narrow it down?</strong> Tell me what product you’re trying to find and your location.</p>`;
  } else {
    extra = `
<p><strong>Recommended Next Step:</strong> View the page above, or ask Timmy how this fits into your property plan.</p>`;
  }

  return `
<p>Yep — I can help you find that.</p>
<p><strong>${itemName}</strong><br>${description}</p>
<p><a href="${itemUrl}" target="_blank">View ${itemName}</a></p>
${extra}
`.trim();
}

function isProductPlantingGuideQuestion(question = "") {
  const q = normalizeSearchText(question);

  return [
    "plant",
    "planting",
    "planted",
    "seed",
    "seeding",
    "sow",
    "sowing",
    "broadcast",
    "drill",
    "rate",
    "depth",
    "fertilizer",
    "ph",
    "soil",
    "guide",
    "directions",
    "instructions",
    "how should i plant",
    "how do i plant",
    "when should i plant",
    "when do i plant"
  ].some(phrase => hasNormalizedPhrase(q, phrase) || q.includes(phrase));
}

function buildExactProductAnswer({
  question = "",
  productName = "",
  region = "unknown",
  timingText = "",
  links = LINKS
}) {
  const product = PRODUCT_CATALOG[productName] || {};
  const guide = product.plantingGuide;
  const shouldUseGuide = guide && (productName === "Incognito" || isProductPlantingGuideQuestion(question));

  if (!shouldUseGuide) {
    return buildProductSpecificAnswer({
      question,
      productName,
      region,
      timingText,
      links
    });
  }

  const regionKey = ["north", "central", "south"].includes(region) ? region : null;
  const regionPlantingWindow = regionKey && guide.plantingDates
    ? guide.plantingDates[regionKey]
    : null;

  const plantingWindows = guide.plantingDates
    ? `North: ${guide.plantingDates.north || "—"}; Central: ${guide.plantingDates.central || "—"}; South: ${guide.plantingDates.south || "—"}`
    : timingText;

  const detailRows = [
    ["Seed Type", guide.seedType],
    ["Plant Varieties", guide.varieties],
    ["Best Use", guide.bestUse],
    ["Location", guide.location],
    ["pH Range", guide.phRange],
    ["Soil Type", guide.soilType],
    ["Tilling / Seedbed", guide.tilling],
    ["Fertilizer", guide.fertilizer],
    ["Seed Depth", guide.seedDepth],
    ["Seed Rate", guide.seedRate],
    ["Maturity", guide.maturity],
    ["Expected Height", guide.height]
  ].filter(([, value]) => value);

  return `
<p><strong>${productName} is the product you’re looking for.</strong> ${product.summary || "This is a Domain Outdoor product built for the use case you asked about."}</p>
<p><strong>Best Product Fit:</strong> ${productName}</p>
<p><strong>Planting Window:</strong> ${regionPlantingWindow ? `${regionPlantingWindow} for your region.` : plantingWindows}</p>
<ul>
${detailRows.map(([label, value]) => `<li><strong>${label}:</strong> ${value}</li>`).join("\n")}
</ul>
${guide.tip ? `<p><strong>Timmy Tip:</strong> ${guide.tip}</p>` : ""}
<p><strong>Product Page:</strong> <a href="${product.url || links.propertyPlanner}" target="_blank">View ${productName}</a></p>
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

  if (hasStrongPlantingIntent && !hasExplicitFeedIntent) return true;
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
    q.includes("incognito") ||
    q.includes("screen") ||
    q.includes("screening") ||
    q.includes("hide") ||
    q.includes("concealment") ||
    q.includes("access") ||
    q.includes("egyptian wheat") ||
    q.includes("sorghum")
  ) {
    return ["Incognito", "Milo", "Dirty Bird", "RC Big Rock Switchgrass", "RC Sundance Switchgrass", "Big Bluestem"];
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

  let html = "";

  if (!isPlantingQuestion(question) && (intent === "feed" || isFeedQuestion(question))) {
    html = `
<p><strong>Goal:</strong> It sounds like you’re looking for feed, mineral, or attractant help.</p>
<p><strong>Best Product Fit:</strong></p>
${buildFeedText({ question, products, region })}
<p><strong>Fertility:</strong> Not needed for feed products.</p>
`.trim();

    return addTimmyNextStep({
      html,
      question,
      intent: "feed",
      products,
      acres,
      region
    });
  }

  if (intent === "fertility") {
    html = `
<p><strong>Goal:</strong> It sounds like you’re trying to dial in fertility or improve plot performance.</p>
<p><strong>Best Product Fit:</strong> I’d start with ${productLine} based on what you asked.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> ${buildFertilityHtml({ question, productNames: products, acres })}</p>
`.trim();

    return addTimmyNextStep({
      html,
      question,
      intent: "fertility",
      products,
      acres,
      region
    });
  }

  if (intent === "habitat") {
    const hasIncognito = products.includes("Incognito");
    const habitatFitCopy = hasIncognito
      ? `For annual screening or access concealment, I’d start with ${productLine}. Incognito should be the first choice when the goal is a fast seasonal screen, plot edge, blind screen, or protected entry/exit route.`
      : `I’d prioritize ${productLine}. These options can provide seasonal structure, seed-head food value, bedding, screening, concealment, or wildlife attraction depending on your goal.`;
    const habitatFertilityCopy = hasIncognito
      ? "For Incognito, focus on full sun, warm soils, good seed-to-soil contact, and moisture. A basic 10-10-10 application at planting and a nitrogen shot after rooting can help maximize height and density."
      : "For permanent bedding and native grass habitat, focus first on seedbed prep, weed control, timing, and moisture. For Milo, a moderate at-plant fertility pass can help because it acts like a warm-season grain sorghum crop.";

    html = `
<p><strong>Goal:</strong> It sounds like you’re trying to create cover, bedding, screening, concealment, or movement control.</p>
<p><strong>Best Product Fit:</strong> ${habitatFitCopy}</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> ${habitatFertilityCopy}</p>
`.trim();

    return addTimmyNextStep({
      html,
      question,
      intent: "habitat",
      products,
      acres,
      region
    });
  }

  html = `
<p><strong>Goal:</strong> It sounds like you’re trying to choose the right food plot seed for your property.</p>
<p><strong>Best Product Fit:</strong> I’d start with ${productLine}. These are strong fits based on the goal and conditions you described.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> ${buildFertilityHtml({ question, productNames: products, acres })}</p>
`.trim();

  return addTimmyNextStep({
    html,
    question,
    intent: "food_plot",
    products,
    acres,
    region
  });
}

function addTimmyNextStep({
  html = "",
  question = "",
  intent = "food_plot",
  products = [],
  acres = null,
  region = "unknown"
}) {
  const nextStep = buildRecommendedNextStep({ question, intent, products, acres, region });
  const followUp = buildGuidedFollowUp({ question, intent, products, acres, region });

  return `
${html}
${nextStep}
${followUp}
`.trim();
}

function buildRecommendedNextStep({
  intent = "food_plot",
  products = []
}) {
  if (intent === "feed") {
    return `<p><strong>Recommended Next Step:</strong> Use the <a href="${LINKS.dealerLocator}" target="_blank">Dealer Locator</a> to find Domain feed, mineral, and attractant products near you. Always check local regulations before using feed, mineral, or attractants.</p>`;
  }

  if (intent === "fertility") {
    return `<p><strong>Recommended Next Step:</strong> Use the <a href="${LINKS.plotEnhancing}" target="_blank">Plot Enhancing App</a> to dial in the best fertility plan based on crop, pH, phosphorus, potassium, and acres.</p>`;
  }

  if (intent === "habitat") {
    return `<p><strong>Recommended Next Step:</strong> Review the <a href="${LINKS.habitatProducts}" target="_blank">Habitat Products</a> page, or use the <a href="${LINKS.propertyPlanner}" target="_blank">Property Planner</a> if you want to connect cover, bedding, food, and movement control.</p>`;
  }

  if (intent === "timing") {
    return `<p><strong>Recommended Next Step:</strong> Use the <a href="${LINKS.plantingDate}" target="_blank">Planting Date Advisor</a> to check your ZIP code, seed mix, and planting goal before putting seed in the ground.</p>`;
  }

  if (products.some(name => PRODUCT_CATALOG[name]?.type === "Soil Test")) {
    return `<p><strong>Recommended Next Step:</strong> Use your soil test results in the <a href="${LINKS.plotEnhancing}" target="_blank">Plot Enhancing App</a> to build the right fertility plan.</p>`;
  }

  return `<p><strong>Recommended Next Step:</strong> Use the <a href="${LINKS.foodPlotSelector}" target="_blank">Food Plot Selector</a> to confirm your seed choice, then use the <a href="${LINKS.plantingDate}" target="_blank">Planting Date Advisor</a> to pick the best planting window.</p>`;
}

function buildGuidedFollowUp({
  intent = "food_plot",
  acres = null,
  region = "unknown"
}) {
  if (intent === "feed") {
    return `<p><strong>Want Timmy to narrow it down?</strong> Tell me if your goal is attraction, mineral support, inventory, post-season recovery, or a longer-lasting feed site.</p>`;
  }

  if (intent === "fertility") {
    return `<p><strong>Want Timmy to narrow it down?</strong> Tell me what you’re planting, how many acres, your pH, phosphorus, potassium, and whether the plot is sandy, clay, wet, dry, or low organic matter.</p>`;
  }

  if (intent === "habitat") {
    return `<p><strong>Want Timmy to narrow it down?</strong> Tell me if your goal is bedding, screening, access concealment, food-and-cover, waterfowl, upland birds, or movement control.</p>`;
  }

  const missing = [];

  if (!region || region === "unknown") missing.push("state");
  if (!acres) missing.push("acres");
  missing.push("sunlight");
  missing.push("soil type");
  missing.push("equipment");

  return `<p><strong>Want Timmy to narrow it down?</strong> Tell me your ${missing.join(", ")}, and whether your goal is a kill plot, perennial plot, fall attraction, poor soil fix, or long-term food source.</p>`;
}

function buildBlogIdeas({
  question = "",
  intent = "food_plot",
  products = []
}) {
  const q = normalizeSearchText(question);
  const ideas = [];

  if (intent === "fertility" || q.includes("fertilizer") || q.includes("soil test") || q.includes("ph")) {
    ideas.push({
      title: "How To Fertilize A Deer Food Plot",
      angle: "Explains pH, phosphorus, potassium, nitrogen, soil tests, and liquid fertilizer timing."
    });

    ideas.push({
      title: "How To Fix A Food Plot That Isn’t Growing",
      angle: "Covers poor pH, bad timing, no rain, weed pressure, poor seed-to-soil contact, and fertility issues."
    });
  }

  if (intent === "feed" || q.includes("feed") || q.includes("mineral") || q.includes("attractant")) {
    ideas.push({
      title: "Mineral, Feed, And Attractants For Deer: What’s The Difference?",
      angle: "Helps customers understand where Recharge, Pre Game, Bad Habit, Stockpile, and Stockpile XL fit."
    });
  }

  if (intent === "habitat" || q.includes("screen") || q.includes("bedding") || q.includes("cover")) {
    ideas.push({
      title: "Best Screening Seed For Deer Hunting Properties",
      angle: "Covers screening access routes, stand entry and exit, switchgrass, native grasses, and annual screens."
    });

    ideas.push({
      title: "How To Build Better Deer Bedding Cover",
      angle: "Explains native grasses, switchgrass, security cover, thermal cover, and sanctuary design."
    });
  }

  if (q.includes("no till") || q.includes("no-till") || q.includes("no equipment")) {
    ideas.push({
      title: "Best Food Plot Seed With No Equipment",
      angle: "Helps customers understand realistic no-till and minimal-equipment food plot options."
    });
  }

  if (q.includes("shade") || q.includes("logging road") || q.includes("woods")) {
    ideas.push({
      title: "What To Plant In A Shady Food Plot",
      angle: "Explains partial shade, logging roads, timber edges, and realistic growth expectations."
    });
  }

  products.forEach(productName => {
    if (PRODUCT_CATALOG[productName]) {
      ideas.push({
        title: `${productName} Food Plot Guide`,
        angle: `Covers when to plant ${productName}, where it works, fertility support, and best use cases.`
      });
    }
  });

  if (!ideas.length) {
    ideas.push({
      title: "What Should I Plant For Deer On My Property?",
      angle: "Main pillar article covering seed choice by goal, region, soil, sunlight, and equipment."
    });

    ideas.push({
      title: "When Should I Plant A Deer Food Plot?",
      angle: "Covers spring, summer, fall, and regional planting windows."
    });
  }

  return ideas.slice(0, 3);
}

function logTimmyQuestion({
  question,
  intent,
  questionType,
  products = [],
  acres = null,
  region = "unknown",
  blogIdeas = []
}) {
  const logPayload = {
    source: "ask-timmy",
    event: "timmy_question",
    timestamp: new Date().toISOString(),
    question,
    intent,
    questionType,
    products,
    acres,
    region,
    blogIdeas: blogIdeas.map(item => item.title)
  };

  console.log(JSON.stringify(logPayload));
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
        summary: product.summary || product.description || product.tag || "",
        bestUseTag: product.tag || product.category || product.type || "",
        coveragePerUnit: product.coveragePerUnit || null,
        recommendedQty: null,
        primaryButtonLabel: "View Product",
        primaryButtonUrl: product.url,
        secondaryButtonLabel: getSecondaryButtonLabel(name),
        secondaryButtonUrl: getSecondaryButtonUrl(name)
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

function getSecondaryButtonLabel(productName) {
  const product = PRODUCT_CATALOG[productName];

  if (!product) return "Start Planning";
  if (product.type === "Liquid") return "Build Fertility Program";
  if (product.type === "Feed") return "Find A Dealer";
  if (product.type === "Soil Test") return "Build Fertility Program";
  if (product.type?.includes("Seed")) return "Check Planting Date";

  return "Start Planning";
}

function getSecondaryButtonUrl(productName) {
  const product = PRODUCT_CATALOG[productName];

  if (!product) return LINKS.propertyPlanner;
  if (product.type === "Liquid") return LINKS.plotEnhancing;
  if (product.type === "Feed") return LINKS.dealerLocator;
  if (product.type === "Soil Test") return LINKS.plotEnhancing;
  if (product.type?.includes("Seed")) return LINKS.plantingDate;

  return LINKS.propertyPlanner;
}