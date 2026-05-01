// data/fertility-logic.js

import { PRODUCT_CATALOG } from "./domain-products.js";

// -------------------------------
// HARD LIMITS / DOMAIN RULES
// -------------------------------
const MAX_RATES = {
  crank: 5,
  freight: 5,
  elbow: 3,
  dirty: 1,
  courage: 1
};

const PAIL_SIZES = {
  crank: [5, 2.5, 1],
  freight: [5, 2.5, 1],
  elbow: [5, 2.5, 1],
  dirty: [4, 1],
  courage: [0.5]
};

// -------------------------------
// CROP FAMILY DETECTION
// -------------------------------
export function detectCropFamily(question = "", productNames = []) {
  const q = question.toLowerCase();
  const joined = productNames.join(" ").toLowerCase();

  const text = `${q} ${joined}`;

  if (text.includes("milo") || text.includes("sorghum") || text.includes("grain sorghum")) {
    return "warm-season";
  }

  if (
    text.includes("big sexy") ||
    text.includes("bombshell") ||
    text.includes("show stopper") ||
    text.includes("smack down") ||
    text.includes("wingman") ||
    text.includes("brassica") ||
    text.includes("turnip") ||
    text.includes("radish")
  ) {
    return "brassica";
  }

  if (
    text.includes("clover") ||
    text.includes("comeback kid") ||
    text.includes("hot chic") ||
    text.includes("alfalfa") ||
    text.includes("legume")
  ) {
    return "legume";
  }

  if (
    text.includes("3-way") ||
    text.includes("grainz") ||
    text.includes("winter rye") ||
    text.includes("winter wheat") ||
    text.includes("oats") ||
    text.includes("cereal")
  ) {
    return "grain";
  }

  if (
    text.includes("switchgrass") ||
    text.includes("bluestem") ||
    text.includes("indian grass") ||
    text.includes("habitat grass") ||
    text.includes("prairie")
  ) {
    return "habitat";
  }

  return "mixed";
}

// -------------------------------
// RATE ENGINE
// -------------------------------
export function buildFertilityProgram({
  question = "",
  productNames = [],
  acres = 1,
  soilPh = null,
  soilP = null,
  soilK = null,
  soilType = null
} = {}) {
  const crop = detectCropFamily(question, productNames);

  let crank = 3;
  let freight = 3;
  let elbow = 0;
  let dirty = 1;
  let courage = 0;

  // Crop-specific logic
  if (crop === "brassica") {
    crank = 3;
    freight = 3.5;
  }

  if (crop === "grain") {
    crank = 3;
    freight = 3;
  }

  if (crop === "warm-season") {
    // Milo / sorghum
    crank = 2.5;
    freight = 2.5;
  }

  if (crop === "legume") {
    crank = 3;
    freight = 0;
  }

  if (crop === "habitat") {
    crank = 0;
    freight = 0;
    courage = 0;
    dirty = 0;
  }

  if (crop === "mixed") {
    crank = 3;
    freight = 2.5;
  }

  // Soil test adjustments
  if (soilP !== null && soilK !== null) {
    if (soilP > 25 && soilK > 150) {
      crank = Math.min(crank, 2.5);
    }

    if (soilP < 15 || soilK < 100) {
      crank = Math.max(crank, 3.5);
    }
  }

  // pH / Elbow Grease logic
  if (soilPh !== null && !Number.isNaN(Number(soilPh))) {
    const ph = Number(soilPh);

    if (ph < 5.8) elbow = 3;
    else if (ph >= 5.8 && ph < 6.2) elbow = 2.5;
    else if (ph >= 6.2 && ph < 6.8) elbow = 2;
    else elbow = 0;
  }

  // Dirty Deeds priority
  if (soilType) {
    const s = soilType.toLowerCase();

    if (
      s.includes("poor") ||
      s.includes("sandy") ||
      s.includes("tired") ||
      s.includes("low organic") ||
      s.includes("hard")
    ) {
      dirty = 1;
    }
  }

  // Apply hard caps
  crank = cap(crank, MAX_RATES.crank);
  freight = cap(freight, MAX_RATES.freight);
  elbow = cap(elbow, MAX_RATES.elbow);
  dirty = cap(dirty, MAX_RATES.dirty);
  courage = cap(courage, MAX_RATES.courage);

  const rates = {
    "Crank'd": crank,
    "Freight Train": freight,
    "Elbow Grease": elbow,
    "Dirty Deeds": dirty,
    "Liquid Courage": courage
  };

  return Object.fromEntries(
    Object.entries(rates).map(([name, rate]) => {
      const key = productKey(name);
      const totalGallons = round(rate * acres, 2);
      const pailLayout = rate > 0 ? buildPailLayout(key, totalGallons) : "Not needed";

      return [
        name,
        {
          name,
          crop,
          ratePerAcre: rate,
          totalGallons,
          totalPailGallons: pailLayout.totalPailGallons,
          pailLayout: pailLayout.text,
          url: PRODUCT_CATALOG[name]?.url || ""
        }
      ];
    })
  );
}

// -------------------------------
// PAIL MATH
// -------------------------------
function buildPailLayout(key, gallonsNeeded) {
  const sizes = PAIL_SIZES[key] || [5, 2.5, 1];

  if (!gallonsNeeded || gallonsNeeded <= 0) {
    return {
      text: "Not needed",
      totalPailGallons: 0
    };
  }

  let remaining = gallonsNeeded;
  const counts = {};

  for (const size of sizes) {
    const count = Math.floor(remaining / size);
    if (count > 0) {
      counts[size] = count;
      remaining = round(remaining - count * size, 2);
    }
  }

  if (remaining > 0) {
    const smallest = sizes[sizes.length - 1];
    counts[smallest] = (counts[smallest] || 0) + 1;
  }

  const totalPailGallons = Object.entries(counts)
    .reduce((sum, [size, count]) => sum + Number(size) * count, 0);

  const text = Object.entries(counts)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([size, count]) => `${count}× ${size}-gal`)
    .join(" + ");

  return {
    text,
    totalPailGallons
  };
}

// -------------------------------
// CUSTOMER-FACING HTML
// -------------------------------
export function buildFertilityHtml({
  question = "",
  productNames = [],
  acres = null,
  soilPh = null,
  soilP = null,
  soilK = null,
  soilType = null
} = {}) {
  if (!acres) {
    return `Tell me your plot size in acres and I can size gallons and pails correctly.`;
  }

  const program = buildFertilityProgram({
    question,
    productNames,
    acres,
    soilPh,
    soilP,
    soilK,
    soilType
  });

  const rows = Object.values(program)
    .filter(item => item.ratePerAcre > 0)
    .map(item => {
      return `<li><strong>${item.name}:</strong> ${item.ratePerAcre} gal/ac · ${item.totalGallons} gal total · ${item.pailLayout}</li>`;
    })
    .join("");

  if (!rows) {
    return `For this habitat-style recommendation, do not push liquid fertility at seeding. Focus on seedbed prep, timing, and weed control first.`;
  }

  return `
<ul>${rows}</ul>
<p><strong>Tank mix:</strong> Elbow Grease must run alone in water. Do not tank-mix it with Crank'd, Freight Train, Dirty Deeds, phosphate, potassium, sulfur/sulfate micros, glyphosate, or Liberty + AMS.</p>
<p><strong>At-plant pass:</strong> Crank'd + Freight Train + Dirty Deeds usually mix safely together, but jar-test first.</p>
<p><strong>Water carrier:</strong> Use 15–20 gallons of water per acre for Crank'd, Freight Train, and Elbow Grease. Dirty Deeds needs at least 5 gallons total spray solution per acre.</p>
`.trim();
}

// -------------------------------
// HELPERS
// -------------------------------
function cap(value, max) {
  return Math.min(Number(value) || 0, max);
}

function round(value, places = 2) {
  return Number(Number(value).toFixed(places));
}

function productKey(name) {
  const map = {
    "Crank'd": "crank",
    "Freight Train": "freight",
    "Elbow Grease": "elbow",
    "Dirty Deeds": "dirty",
    "Liquid Courage": "courage"
  };

  return map[name] || "crank";
}