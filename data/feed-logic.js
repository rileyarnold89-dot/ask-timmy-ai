// data/feed-logic.js

import { PRODUCT_CATALOG } from "./domain-products.js";

// -------------------------------
// KEYWORDS
// -------------------------------
const FEED_KEYWORDS = {
  attract: ["attract", "draw", "bring in", "deer traffic"],
  mineral: ["mineral", "antler", "health", "nutrition", "vitamin"],
  feed: ["feed", "protein", "corn", "bulk feed"],
  block: ["block", "long lasting"]
};

// -------------------------------
// HELPERS
// -------------------------------
function hasKeyword(msg, group) {
  return FEED_KEYWORDS[group].some(word => msg.includes(word));
}

// -------------------------------
// CORE FEED LOGIC
// -------------------------------
export function getFeedProducts(question = "") {
  const msg = question.toLowerCase();

  // Mineral focus
  if (hasKeyword(msg, "mineral")) {
    return ["Recharge", "Stockpile"];
  }

  // Attractant focus
  if (hasKeyword(msg, "attract")) {
    return ["Bad Habit", "Stockpile"];
  }

  // Block focus
  if (hasKeyword(msg, "block")) {
    return ["Stockpile"];
  }

  // Feed / protein focus
  if (hasKeyword(msg, "feed")) {
    return ["Pre Game", "Bad Habit"];
  }

  // Default
  return ["Bad Habit", "Recharge", "Stockpile"];
}

// -------------------------------
// CLEAN PRODUCTS
// -------------------------------
export function cleanFeedProducts(products = []) {
  return [...new Set(products)]
    .filter(name => PRODUCT_CATALOG[name])
    .slice(0, 3);
}

// -------------------------------
// FEED RESPONSE TEXT
// -------------------------------
export function buildFeedText(products = []) {
  if (!products.length) return "";

  const lines = products.map(name => {
    const p = PRODUCT_CATALOG[name];
    return `<strong>${name}</strong> (${p.tag})`;
  });

  return `For your goal, I’d look at ${lines.join(", ")} to help improve deer usage and activity.`;
}