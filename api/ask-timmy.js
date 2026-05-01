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
  cleanFoodPlotProducts
} from "../data/food-plot-logic.js";

import { buildFertilityHtml } from "../data/fertility-logic.js";

import {
  detectRegion,
  buildTimingText
} from "../data/planting-date-logic.js";

import {
  getFeedProducts,
  cleanFeedProducts,
  buildFeedText
} from "../data/feed-logic.js";

import {
  routeQuestion,
  buildOutOfScopeReply,
  buildProductSpecificAnswer
} from "../data/question-router.js";

export default async function handler(req, res) {
  try {
    const { question } = req.body || {};
    const safeQuestion = String(question || "").trim();

    if (!safeQuestion) {
      return res.status(200).json({
        answer: "<p>Ask me about your property and I’ll help you dial it in.</p>",
        products: [],
        blogs: [],
        acres: null
      });
    }

    const route = routeQuestion(safeQuestion);
    const region = detectRegion(safeQuestion);

    if (!route.isDomainRelated) {
      return res.status(200).json({
        answer: buildOutOfScopeReply(safeQuestion),
        products: [],
        blogs: [],
        acres: null
      });
    }

    const products = route.mentionedProducts.length
      ? route.mentionedProducts
      : cleanFoodPlotProducts(getFoodPlotProducts(safeQuestion));

    const timingText = buildTimingText({
      question: safeQuestion,
      region,
      intent: route.intent,
      productNames: products
    });

    // PRODUCT-SPECIFIC ANSWERS
    if (
      route.mentionedProducts.length > 0 &&
      ["when_to_plant", "product_info", "quantity_help"].includes(route.questionType)
    ) {
      return res.status(200).json({
        answer: buildProductSpecificAnswer({
          question: safeQuestion,
          productName: route.mentionedProducts[0],
          region,
          timingText,
          links: LINKS
        }),
        products: [],
        blogs: [],
        acres: null
      });
    }

    // NORMAL ANSWER
    const productLine = products.map(p => `<strong>${p}</strong>`).join(", ");

    const answer = `
<p><strong>Goal:</strong> It sounds like you’re trying to choose the right approach for your property.</p>
<p><strong>Best Product Fit:</strong> I’d start with ${productLine} based on what you told me.</p>
<p><strong>Timing:</strong> ${timingText}</p>
<p><strong>Fertility:</strong> ${buildFertilityHtml({ question: safeQuestion, productNames: products })}</p>
<p><strong>Next Step:</strong> Use the <a href="${LINKS.foodPlotSelector}" target="_blank">Food Plot Selector</a> or <a href="${LINKS.plotEnhancing}" target="_blank">Plot Enhancing App</a> to refine your plan.</p>
`.trim();

    return res.status(200).json({
      answer,
      products: [],
      blogs: [],
      acres: null
    });

  } catch (err) {
    console.error(err);

    return res.status(200).json({
      answer: "<p>Something went wrong. Try again.</p>",
      products: [],
      blogs: [],
      acres: null
    });
  }
}