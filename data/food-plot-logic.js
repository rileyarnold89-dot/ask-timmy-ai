// data/food-plot-logic.js

import {
  PRODUCT_CATALOG,
  isFoodPlotSeed,
  isHabitat,
  normalizeProductName
} from "./domain-products.js";

// -------------------------------
// KEYWORD GROUPS
// -------------------------------
const KEYWORDS = {
  shade: ["shade","shaded","woods","timber","logging road","partial sun"],
  perennial: ["perennial","long term","long-term","multi year"],
  fall: ["fall","late season","rut","cold","winter"],
  spring: ["spring","summer","protein","nutrition"],
  noTill: ["no till","no-till","throw and grow","minimal equipment","hand tools"],
  soil: ["poor soil","bad soil","sandy","organic matter"],
  coverFood: ["cover and food","food and cover","both cover and food"],
  milo: ["milo","sorghum","grain sorghum"]
};

// -------------------------------
// HELPER
// -------------------------------
function hasKeyword(msg, group) {
  return KEYWORDS[group].some(word => msg.includes(word));
}

// -------------------------------
// CORE FOOD PLOT LOGIC
// -------------------------------
export function getFoodPlotProducts(question) {
  const msg = question.toLowerCase();

  // ⭐ MILO FIRST — special case
  if (hasKeyword(msg, "milo") || hasKeyword(msg, "coverFood")) {
    return ["Milo", "Forage Factory", "3-WAY Grainz"];
  }

  // SHADE / TIMBER
  if (hasKeyword(msg, "shade")) {
    return ["Hot Chic", "No BS"];
  }

  // TRUE PERENNIAL
  if (hasKeyword(msg, "perennial")) {
    return ["Comeback Kid", "Hot Chic"];
  }

  // FALL / LATE SEASON
  if (hasKeyword(msg, "fall")) {
    return ["Big Sexy", "Green Machine", "Show Stopper"];
  }

  // SPRING / SUMMER
  if (hasKeyword(msg, "spring")) {
    return ["Clutch Clover", "Comeback Kid", "Hot Chic"];
  }

  // NO-TILL / LOW EQUIPMENT
  if (hasKeyword(msg, "noTill")) {
    return ["No BS", "3-WAY Grainz", "Forage Factory"];
  }

  // POOR SOIL
  if (hasKeyword(msg, "soil")) {
    return ["Overhaul", "Clutch Clover"];
  }

  // DEFAULT
  return ["3-WAY Grainz", "Big Sexy", "Clutch Clover"];
}

// -------------------------------
// CLEAN + VALIDATE PRODUCTS
// -------------------------------
export function cleanFoodPlotProducts(products) {
  return [...new Set(products)]
    .map(normalizeProductName)
    .filter(name => PRODUCT_CATALOG[name] && isFoodPlotSeed(name))
    .slice(0, 3);
}

// -------------------------------
// HABITAT FALLBACK (CROSSOVER)
// -------------------------------
export function getFoodPlotWithHabitat(question) {
  const msg = question.toLowerCase();

  if (msg.includes("cover") || msg.includes("bedding")) {
    return ["Milo", "RC Big Rock Switchgrass", "Big Bluestem"];
  }

  return getFoodPlotProducts(question);
}