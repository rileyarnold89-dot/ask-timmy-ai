// data/planting-date-logic.js

import { REGIONS } from "./domain-products.js";

// -------------------------------
// REGION DETECTION
// -------------------------------
export function detectRegion(question = "") {
  const q = question.toLowerCase();

  for (const [region, states] of Object.entries(REGIONS)) {
    if (states.some(state => q.includes(state))) {
      return region;
    }
  }

  return "unknown";
}

// -------------------------------
// GENERAL TIMING (SIMPLE)
// -------------------------------
export function getGeneralTiming(region, intent) {
  if (intent === "habitat") {
    if (region === "north") return "Plant warm-season grasses in spring once soil temps rise, or dormant seed late fall/winter.";
    if (region === "central") return "Plant warm-season grasses in spring when soils warm, with dormant seeding as a secondary option.";
    if (region === "south") return "Plant warm-season grasses in spring based on moisture and soil temps.";
    return "Habitat timing depends on soil temps, moisture, and planting method.";
  }

  if (region === "north") return "Fall plots: late July–late August. Spring plots: April–May.";
  if (region === "central") return "Fall plots: August–mid September. Spring: March–May.";
  if (region === "south") return "Fall plots: September–October. Spring: February–April.";

  return "Timing depends on rainfall, soil moisture, and forecast.";
}

// -------------------------------
// MILO-SPECIFIC TIMING
// -------------------------------
export function getMiloTiming(region) {
  if (region === "north") {
    return "Plant Milo after frost once soil temps are warm. Best window is May through August.";
  }

  if (region === "central") {
    return "Plant Milo after frost. Best windows are May or July–August depending on moisture.";
  }

  if (region === "south") {
    return "Plant Milo after frost. Best windows are May or July–September depending on rainfall.";
  }

  return "Plant Milo after frost when soils are warm and moisture is available.";
}

// -------------------------------
// SOIL TEMP GUIDANCE (OPTIONAL)
// -------------------------------
export function getSoilTempHint(productNames = []) {
  const names = productNames.join(" ").toLowerCase();

  if (names.includes("clover")) {
    return "Clover establishes best once soil temps reach ~50°F.";
  }

  if (names.includes("brassica") || names.includes("turnip") || names.includes("radish")) {
    return "Brassicas establish best around 55–65°F soil temps.";
  }

  if (names.includes("grain") || names.includes("rye") || names.includes("wheat")) {
    return "Cereal grains can germinate in cooler soils (~45°F+).";
  }

  if (names.includes("milo") || names.includes("sorghum")) {
    return "Milo needs warm soils (~60–65°F+) for proper germination.";
  }

  return "";
}

// -------------------------------
// FULL TIMING RESPONSE BUILDER
// -------------------------------
export function buildTimingText({
  question = "",
  region = "unknown",
  intent = "food",
  productNames = []
} = {}) {
  const q = question.toLowerCase();

  // Milo-specific override
  if (q.includes("milo") || q.includes("sorghum")) {
    return `${getMiloTiming(region)} ${getSoilTempHint(productNames)}`;
  }

  return `${getGeneralTiming(region, intent)} ${getSoilTempHint(productNames)}`;
}