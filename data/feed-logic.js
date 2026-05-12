// data/feed-logic.js
// Domain Outdoor feed, mineral, attractant, and feed-program logic for Timmy The Turnip.

import { PRODUCT_CATALOG } from "./domain-products.js";

// -------------------------------
// PRODUCT KNOWLEDGE
// -------------------------------
const FEED_PRODUCTS = {
  "Pre Game": {
    aliases: ["pre game", "pregame", "pre-game"],
    type: "Feed",
    primaryRole: "Daily feed / nutrition / inventory",
    bestUses: ["Year-round nutrition", "Trail camera inventory", "Feed site attraction"],
    packageSizes: ["5 lb bag", "20 lb bag", "40 lb bag"],
    pairsWith: ["Recharge", "Bad Habit"],
    bestSeason: "Year-round, especially pre-season and inventory periods",
    shortAnswer: "Pre Game is Domain’s go-to feed option for customers who want consistent nutrition, attraction, and trail camera inventory.",
    howToUse: "Use as the base feed in a feeder, feeding area, or inventory site. It is the main choice when a customer wants steady use instead of just a quick attraction bump.",
    doNotRecommendWhen: "Customer wants mineral-only support or a long-lasting block.",
    catalogName: "Pre Game"
  },
  "Bad Habit": {
    aliases: ["bad habit", "badhabit", "corn topper", "topper", "attractant"],
    type: "Attractant",
    primaryRole: "Fast attraction / corn topper / site refresher",
    bestUses: ["Trail camera inventory", "Pre-season", "In-season", "Quick site refresh"],
    packageSizes: ["3 lb bag", "7 lb bag", "20 lb bag"],
    pairsWith: ["Pre Game", "Corn"],
    bestSeason: "Pre-season, in-season, and trail camera inventory periods",
    shortAnswer: "Bad Habit is the fast-attraction option for trail cameras, quick site refreshes, and mixing with corn or feed.",
    howToUse: "Use when you want to get deer interested fast, freshen up a site, or add attraction to corn or feed.",
    doNotRecommendWhen: "Customer wants a complete daily nutrition feed.",
    catalogName: "Bad Habit"
  },
  "Recharge": {
    aliases: ["recharge", "mineral", "minerals", "mineral site"],
    type: "Mineral",
    primaryRole: "Mineral support / recovery / herd nutrition",
    bestUses: ["Pre-season", "Recovery", "Trail camera inventory", "Spring/summer mineral support"],
    packageSizes: ["Mineral package"],
    pairsWith: ["Pre Game", "Stockpile"],
    bestSeason: "Spring, summer, post-rut recovery, and year-round mineral support",
    shortAnswer: "Recharge is Domain’s mineral product for mineral support, recovery, and year-round mineral sites.",
    howToUse: "Use as the mineral-support piece near feed sites, trail camera inventory locations, or established mineral locations. It supports the program differently than a calorie-based feed.",
    doNotRecommendWhen: "Customer wants high-energy feed, calories, or a quick corn topper.",
    catalogName: "Recharge"
  },
  "Stockpile": {
    aliases: ["stockpile", "stock pile", "block", "deer block", "attractant block"],
    type: "Attractant block",
    primaryRole: "Long-lasting attractant block",
    bestUses: ["Trail camera inventory", "Pre-season", "In-season", "Low-maintenance attraction"],
    packageSizes: ["20 lb block"],
    pairsWith: ["Recharge", "Bad Habit", "Corn"],
    bestSeason: "Pre-season, in-season, and low-maintenance attraction periods",
    shortAnswer: "Stockpile is a long-lasting attractant block built for trail cameras, feed sites, and low-maintenance attraction.",
    howToUse: "Use when a customer wants longer-lasting attraction with less frequent refreshing than loose feed or powdered attractant.",
    doNotRecommendWhen: "Customer wants loose feed for a feeder.",
    catalogName: "Stockpile"
  },
  "Stockpile XL": {
    aliases: ["stockpile xl", "stock pile xl", "33 lb block", "33lb block", "large block"],
    type: "Attractant block",
    primaryRole: "Larger long-lasting attractant block",
    bestUses: ["Trail camera inventory", "Pre-season", "In-season", "Low-maintenance attraction"],
    packageSizes: ["33 lb block"],
    pairsWith: ["Recharge", "Bad Habit", "Corn"],
    bestSeason: "Pre-season, in-season, and low-maintenance attraction periods",
    shortAnswer: "Stockpile XL is the bigger long-lasting block option for customers who want low-maintenance attraction with less frequent refreshing.",
    howToUse: "Use when the site is getting heavier activity or the customer wants a longer-lasting block option.",
    doNotRecommendWhen: "Customer wants loose feed for a feeder.",
    catalogName: "Stockpile XL"
  },
  "Pre Game 125lb Tub": {
    aliases: ["pre game tub", "pregame tub", "125lb tub", "125 lb tub", "bulk feed", "large feed tub"],
    type: "Bulk feed",
    primaryRole: "Bulk feed / long-duration feed site",
    bestUses: ["Year-round nutrition", "Trail camera inventory", "Bulk feed site", "Long-duration feed site"],
    packageSizes: ["125 lb tub"],
    pairsWith: ["Recharge", "Bad Habit"],
    bestSeason: "Year-round, especially larger feed sites and inventory periods",
    shortAnswer: "Pre Game 125lb Tub is the bulk feed option for customers running a larger feed site or wanting a longer-lasting feed setup with less frequent refilling.",
    howToUse: "Use as a large-format feeding option. Place the tub in feeding areas, inventory sites, or established feed locations. Best for customers who want a longer-lasting feed option with less frequent refilling.",
    doNotRecommendWhen: "Customer wants online direct purchase or a small bag option.",
    availabilityNotes: "Dealer / retail store item. Product image and online product page coming soon. Direct online purchase may not be available yet.",
    catalogName: null
  }
};

const FEED_INTENT_KEYWORDS = [
  "feed", "feeding", "deer feed", "protein", "corn", "bulk feed", "feeder",
  "mineral", "minerals", "recharge", "antler", "health", "nutrition", "vitamin", "recovery",
  "attract", "attractant", "draw", "bring in", "deer traffic", "trail camera", "inventory",
  "block", "stockpile", "long lasting", "pre game", "bad habit", "125lb", "125 lb", "tub"
];

const GOAL_ALIASES = {
  inventory: ["inventory", "trail camera", "camera", "pictures", "photos"],
  fastAttraction: ["fast", "quick", "attract", "draw", "bring in", "topper"],
  nutrition: ["year round", "year-round", "nutrition", "protein", "feed program", "feeding program"],
  mineral: ["mineral", "recharge", "antler", "spring", "summer"],
  recovery: ["post rut", "post-rut", "recovery", "winter", "stress"],
  block: ["block", "long lasting", "low maintenance", "stockpile"],
  bulk: ["bulk", "125", "tub", "large feed"]
};

const STATE_NAMES = [
  "alabama","alaska","arizona","arkansas","california","colorado","connecticut","delaware","florida","georgia","hawaii","idaho","illinois","indiana","iowa","kansas","kentucky","louisiana","maine","maryland","massachusetts","michigan","minnesota","mississippi","missouri","montana","nebraska","nevada","new hampshire","new jersey","new mexico","new york","north carolina","north dakota","ohio","oklahoma","oregon","pennsylvania","rhode island","south carolina","south dakota","tennessee","texas","utah","vermont","virginia","washington","west virginia","wisconsin","wyoming"
];

// -------------------------------
// HELPERS
// -------------------------------
function includesAny(msg, terms = []) {
  return terms.some(term => msg.includes(term));
}

function esc(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function list(items = []) {
  return items.filter(Boolean).map(item => `<li>${esc(item)}</li>`).join("");
}

function productByName(name) {
  return FEED_PRODUCTS[name] || null;
}

function catalogName(name) {
  const p = productByName(name);
  if (!p || !p.catalogName) return null;
  return PRODUCT_CATALOG[p.catalogName] ? p.catalogName : null;
}

function detectState(question = "") {
  const q = question.toLowerCase();
  return STATE_NAMES.find(state => q.includes(state)) || "";
}

function detectDuration(question = "") {
  const q = question.toLowerCase();
  if (q.includes("2 week") || q.includes("two week")) return "2 weeks";
  if (q.includes("60 day") || q.includes("two month")) return "60 days";
  if (q.includes("90 day") || q.includes("three month")) return "90 days";
  if (q.includes("season")) return "Seasonal program";
  if (q.includes("year") || q.includes("year-round") || q.includes("year round")) return "Year-round program";
  return "30 days";
}

function detectSiteUse(question = "") {
  const q = question.toLowerCase();
  if (q.includes("not sure") || q.includes("don't know") || q.includes("dont know") || q.includes("help me estimate")) return "not sure";
  if (q.includes("16+") || q.includes("16 plus") || q.includes("very heavy")) return "very heavy";
  if (q.includes("9") || q.includes("10") || q.includes("11") || q.includes("12") || q.includes("15") || q.includes("heavy")) return "heavy";
  if (q.includes("4") || q.includes("5") || q.includes("6") || q.includes("7") || q.includes("8") || q.includes("moderate")) return "moderate";
  if (q.includes("1") || q.includes("2") || q.includes("3") || q.includes("few") || q.includes("couple") || q.includes("light")) return "light";
  if (q.includes("every day") || q.includes("multiple deer groups") || q.includes("disappears quickly")) return "heavy";
  return "moderate";
}

function detectGoal(question = "") {
  const q = question.toLowerCase();
  if (includesAny(q, GOAL_ALIASES.bulk)) return "Bulk feed site";
  if (includesAny(q, GOAL_ALIASES.mineral)) return "Spring/summer mineral support";
  if (includesAny(q, GOAL_ALIASES.recovery)) return "Post-rut recovery";
  if (includesAny(q, GOAL_ALIASES.block)) return "Low-maintenance block site";
  if (includesAny(q, GOAL_ALIASES.fastAttraction)) return "Fast attraction";
  if (includesAny(q, GOAL_ALIASES.nutrition)) return "Year-round nutrition";
  if (includesAny(q, GOAL_ALIASES.inventory)) return "Trail camera inventory";
  return "Trail camera inventory";
}

function detectStyle(question = "") {
  const q = question.toLowerCase();
  if (q.includes("feeder") || q.includes("feeder-ready") || q.includes("feeder ready")) return "Feeder-ready feed";
  if (q.includes("ground")) return "Ground feeding";
  if (q.includes("mineral")) return "Mineral site";
  if (q.includes("block") || q.includes("low maintenance")) return "Block / low-maintenance";
  if (q.includes("corn") || q.includes("topper") || q.includes("attractant")) return "Attractant / corn topper";
  return "Not sure";
}

function findMentionedFeedProducts(question = "") {
  const q = question.toLowerCase();
  return Object.entries(FEED_PRODUCTS)
    .filter(([, product]) => product.aliases.some(alias => q.includes(alias)))
    .map(([name]) => name);
}

function hasComparison(question = "") {
  const q = question.toLowerCase();
  return q.includes("difference") || q.includes(" vs ") || q.includes(" versus ") || q.includes("compare");
}

function productSummaryHtml(name) {
  const p = productByName(name);
  if (!p) return "";

  const productLink = p.catalogName && PRODUCT_CATALOG[p.catalogName]?.url
    ? PRODUCT_CATALOG[p.catalogName].url
    : null;

  return `
    <div class="timmy-feed-note">
      <p><strong>${esc(name)}:</strong> ${esc(p.shortAnswer)}</p>
      <ul>
        <li><strong>Primary role:</strong> ${esc(p.primaryRole)}</li>
        <li><strong>Best uses:</strong> ${esc(p.bestUses.join(", "))}</li>
        <li><strong>Best season:</strong> ${esc(p.bestSeason)}</li>
        <li><strong>Pairs with:</strong> ${esc(p.pairsWith.length ? p.pairsWith.join(", ") : "No primary pairing needed")}</li>
      </ul>
      ${p.howToUse ? `<p><strong>How to use:</strong> ${esc(p.howToUse)}</p>` : ""}
      ${productLink ? `<p><a href="${productLink}" target="_blank">View ${esc(name)}</a></p>` : ""}
      ${!productLink && p.availabilityNotes ? `<p><strong>Availability:</strong> ${esc(p.availabilityNotes)}</p>` : ""}
    </div>
  `.trim();
}

function estimateHelpHtml() {
  return `
    <p><strong>No problem — don’t guess your whole herd size.</strong> Use site activity instead.</p>
    <ul>
      <li><strong>Light use:</strong> A few deer every couple days, or 1–3 deer at a time.</li>
      <li><strong>Moderate use:</strong> Deer on camera almost every day, or 4–8 deer at a time.</li>
      <li><strong>Heavy use:</strong> Multiple deer groups using the site, or 9–15 deer at a time.</li>
      <li><strong>Very heavy use:</strong> 16+ deer at a time, or product disappears quickly after you put it out.</li>
    </ul>
    <p>Once you know which bucket fits, Timmy can build the feed program around that site-use level.</p>
  `.trim();
}

function selectFeedProductNames(goal = "", style = "") {
  const g = goal.toLowerCase();
  const s = style.toLowerCase();

  if (g.includes("bulk")) return ["Pre Game", "Recharge", "Bad Habit"];
  if (g.includes("mineral") || s.includes("mineral")) return ["Recharge", "Pre Game", "Stockpile"];
  if (g.includes("post-rut") || g.includes("recovery")) return ["Pre Game", "Recharge", "Stockpile"];
  if (g.includes("block") || g.includes("low-maintenance") || s.includes("block")) return ["Stockpile", "Recharge", "Bad Habit"];
  if (g.includes("fast") || s.includes("attractant") || s.includes("corn topper")) return ["Bad Habit", "Pre Game", "Stockpile"];
  if (g.includes("year-round") || g.includes("nutrition")) return ["Pre Game", "Recharge", "Stockpile"];
  return ["Pre Game", "Recharge", "Bad Habit"];
}

function timelineFor(duration = "30 days", products = []) {
  const d = String(duration).toLowerCase();
  const primary = products[0] || "Pre Game";
  const support = products[1] || "Recharge";
  const boost = products[2] || "Bad Habit";

  if (d.includes("2 week")) {
    return [
      `Days 1–3: Start the site with ${primary}. Keep the setup simple and consistent.`,
      `Days 4–7: Add ${support} nearby if mineral/recovery support fits the goal.`,
      `Days 8–14: Use ${boost} as a site refresher if camera activity slows or you want a quick attraction bump.`
    ];
  }

  if (d.includes("60")) {
    return [
      `Weeks 1–2: Establish the site with ${primary}. Focus on consistency, not overcomplicating the setup.`,
      `Weeks 3–4: Add or maintain ${support} as the mineral/recovery piece.`,
      `Weeks 5–6: Refresh activity with ${boost} when deer traffic slows or when you want to build camera inventory.`,
      `Weeks 7–8: Evaluate how fast product disappears and move up or down in program intensity.`
    ];
  }

  if (d.includes("90") || d.includes("season")) {
    return [
      `Month 1: Build the habit with ${primary}. The goal is steady use and repeat visits.`,
      `Month 2: Layer in ${support} so the program supports more than just attraction.`,
      `Month 3: Use ${boost} or Stockpile as the maintenance/refresh piece depending on how often you can visit the site.`
    ];
  }

  if (d.includes("year")) {
    return [
      `Spring: Prioritize ${support} for mineral support and recovery as demand increases.`,
      `Summer: Use ${primary} for consistent nutrition and inventory where it fits your setup.`,
      `Pre-season: Add ${boost} or Stockpile to build camera activity and site consistency.`,
      `Fall/Winter: Keep the program simple: maintain the base feed, use blocks for low-maintenance attraction, and adjust based on site use.`
    ];
  }

  return [
    `Week 1: Start the site with ${primary}.`,
    `Week 2: Keep ${primary} consistent and add ${support} nearby if mineral support is part of the goal.`,
    `Week 3: Use ${boost} as a refresher or attraction boost.`,
    `Week 4: Review camera activity and product disappearance. Increase program intensity if the site is getting heavy use.`
  ];
}

function buildFeedProgramHtml({ question = "", state = "", goal = "", siteUse = "", duration = "", style = "" } = {}) {
  const detectedState = state || detectState(question);
  const detectedGoal = goal || detectGoal(question);
  const detectedSiteUse = siteUse || detectSiteUse(question);
  const detectedDuration = duration || detectDuration(question);
  const detectedStyle = style || detectStyle(question);

  if (detectedSiteUse === "not sure") return estimateHelpHtml();

  const selected = selectFeedProductNames(detectedGoal, detectedStyle);
  const timeline = timelineFor(detectedDuration, selected);
  const setupLine = selected.map(name => `<strong>${esc(name)}</strong>`).join(" + ");

  return `
    <p><strong>${esc(detectedDuration)} ${esc(detectedGoal)} Program${detectedState ? ` for ${esc(detectedState)}` : ""}</strong></p>
    <p><strong>Site use level:</strong> ${esc(detectedSiteUse)}.</p>
    <p><strong>Recommended Domain setup:</strong> ${setupLine}.</p>

    <p><strong>Why this setup fits:</strong></p>
    <ul>
      ${list(selected.map(name => `${name}: ${productByName(name)?.primaryRole || "Recommended feed-side product"}`))}
    </ul>

    <p><strong>Timeline:</strong></p>
    <ul>
      ${list(timeline)}
    </ul>

    <p><strong>Product notes:</strong></p>
    <ul>
      ${list(selected.map(name => `${name}: ${productByName(name)?.shortAnswer || "Recommended option"}`))}
    </ul>

    ${detectedGoal.toLowerCase().includes("bulk") ? `<p><strong>Pre Game 125lb Tub note:</strong> ${esc(FEED_PRODUCTS["Pre Game 125lb Tub"].shortAnswer)} ${esc(FEED_PRODUCTS["Pre Game 125lb Tub"].availabilityNotes)}</p>` : ""}
  `.trim();
}

function buildProductSpecificHtml(question = "") {
  const mentioned = findMentionedFeedProducts(question);
  if (!mentioned.length) return "";

  if (hasComparison(question) && mentioned.length >= 2) {
    return `
      <p><strong>Here’s the simple difference:</strong></p>
      ${mentioned.slice(0, 3).map(productSummaryHtml).join("")}
      <p><strong>Timmy’s take:</strong> If you want a base feed, start with <strong>Pre Game</strong>. If you want mineral support, use <strong>Recharge</strong>. If you want a fast topper or refresher, use <strong>Bad Habit</strong>. If you want longer-lasting attraction, use <strong>Stockpile</strong>.</p>
    `.trim();
  }

  return mentioned.slice(0, 2).map(productSummaryHtml).join("");
}

// -------------------------------
// PUBLIC API USED BY ask-timmy.js
// -------------------------------
export function isFeedQuestion(question = "") {
  const msg = String(question).toLowerCase();
  return FEED_INTENT_KEYWORDS.some(word => msg.includes(word));
}

export function getFeedProducts(question = "") {
  const mentioned = findMentionedFeedProducts(question)
    .map(name => catalogName(name))
    .filter(Boolean);

  if (mentioned.length) return mentioned;

  const goal = detectGoal(question);
  const style = detectStyle(question);
  return selectFeedProductNames(goal, style)
    .map(name => catalogName(name))
    .filter(Boolean);
}

export function cleanFeedProducts(products = []) {
  return [...new Set(products)]
    .filter(name => PRODUCT_CATALOG[name])
    .slice(0, 4);
}

export function buildFeedText(input = []) {
  const question = Array.isArray(input) ? "" : (input.question || "");
  const products = Array.isArray(input) ? input : (input.products || []);

  if (question && detectSiteUse(question) === "not sure") {
    return estimateHelpHtml();
  }

  const productSpecific = question ? buildProductSpecificHtml(question) : "";
  if (productSpecific) return productSpecific;

  const isProgram = question && (
    question.toLowerCase().includes("program") ||
    question.toLowerCase().includes("30 day") ||
    question.toLowerCase().includes("60 day") ||
    question.toLowerCase().includes("90 day") ||
    question.toLowerCase().includes("2 week") ||
    question.toLowerCase().includes("year-round") ||
    question.toLowerCase().includes("year round") ||
    question.toLowerCase().includes("site use") ||
    question.toLowerCase().includes("deer using")
  );

  if (isProgram || question) {
    return buildFeedProgramHtml({ question });
  }

  if (!products.length) return "";

  const lines = products.map(name => {
    const p = PRODUCT_CATALOG[name];
    return `<strong>${esc(name)}</strong>${p?.tag ? ` (${esc(p.tag)})` : ""}`;
  });

  return `For your goal, I’d look at ${lines.join(", ")} to help improve deer usage and activity.`;
}
