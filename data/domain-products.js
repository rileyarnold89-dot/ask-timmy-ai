// data/domain-products.js

export const LINKS = {
  propertyPlanner: "https://domainoutdoor.com/pages/feed-selector?view=property-planner",
  foodPlotSelector: "https://domainoutdoor.com/pages/selection-chart-app",
  plotEnhancing: "https://domainoutdoor.com/pages/plot-enhancing-app",
  plantingDate: "https://domainoutdoor.com/pages/planing-date-app",
  dealerLocator: "https://domainoutdoor.com/pages/dealer-locator",
  habitatProducts: "https://domainoutdoor.com/collections/habitat-products"
};

export const REGIONS = {
  north: [
    "washington","oregon","idaho","wyoming","montana","north dakota","south dakota",
    "wisconsin","minnesota","michigan","pennsylvania","new york","connecticut",
    "rhode island","massachusetts","new hampshire","maine","vermont","iowa","new jersey"
  ],
  central: [
    "northern california","nevada","utah","colorado","nebraska","kansas","oklahoma",
    "missouri","illinois","indiana","ohio","maryland","delaware","virginia",
    "west virginia","kentucky","tennessee","north carolina","arkansas"
  ],
  south: [
    "southern california","arizona","new mexico","texas","louisiana","mississippi",
    "alabama","georgia","florida","south carolina"
  ]
};

export const PRODUCT_CATALOG = {
  "3-WAY Grainz": {
    type: "Food Plot Seed",
    category: "grain",
    tag: "Easy Fall Grain Blend",
    handle: "3-way-grainz",
    url: "https://domainoutdoor.com/products/3-way-grainz?variant=45650279694585",
    coveragePerUnit: 0.5,
    summary: "Winter rye, winter wheat, and oats. Fast-growing cereal grain blend for fall and winter attraction. Minimal equipment friendly."
  },

  "Big Sexy": {
    type: "Food Plot Seed",
    category: "brassica",
    tag: "Premium Fall Attraction",
    handle: "big-sexy%E2%84%A2",
    url: "https://domainoutdoor.com/products/big-sexy%E2%84%A2?variant=43413526839545",
    coveragePerUnit: 0.5,
    summary: "Turnip, radish, kale, and forage rape. Premier cold-season fall/winter attraction with heavy graze-pressure tolerance."
  },

  "Bombshell": {
    type: "Food Plot Seed",
    category: "brassica",
    tag: "Brassica Heavy",
    handle: "bombshell%E2%84%A2",
    url: "https://domainoutdoor.com/products/bombshell%E2%84%A2?variant=43413534212345",
    coveragePerUnit: 1,
    summary: "Brassica-heavy annual with Ethiopian cabbage, forage collards, hybrid forage brassica, and forage turnip."
  },

  "Clutch Clover": {
    type: "Food Plot Seed",
    category: "legume",
    tag: "Fast Clover",
    handle: "clutch-clover",
    url: "https://domainoutdoor.com/products/clutch-clover?variant=45649728766201",
    coveragePerUnit: 0.25,
    summary: "Three annual clovers. Fast establishment, protein, biomass, browse tolerance, and soil-building value."
  },

  "Comeback Kid": {
    type: "Food Plot Seed",
    category: "perennial",
    tag: "True Perennial",
    handle: "comeback-kid%E2%84%A2",
    url: "https://domainoutdoor.com/products/comeback-kid%E2%84%A2?variant=43413528543481",
    coveragePerUnit: 0.5,
    summary: "True perennial clover and alfalfa mix. Does not contain chicory. Best for long-term protein and multi-year plots."
  },

  "Forage Factory": {
    type: "Food Plot Seed",
    category: "mixed",
    tag: "Weather-Tolerant Plot",
    handle: "forage-factory",
    url: "https://domainoutdoor.com/products/forage-factory?variant=45650290442489",
    coveragePerUnit: 1,
    summary: "Winter wheat, oats, peas, clover, brassica, and radish. Weather-tolerant fall/winter hunt plot."
  },

  "Green Machine": {
    type: "Food Plot Seed",
    category: "mixed",
    tag: "Late Season Draw",
    handle: "green-machine%E2%84%A2",
    url: "https://domainoutdoor.com/products/green-machine%E2%84%A2?variant=43413526970617",
    coveragePerUnit: 1,
    summary: "Winter rye, oats, winter peas, forage rape, and radish. Cold-weather fall/winter attraction."
  },

  "Hall Pass": {
    type: "Food Plot Seed",
    category: "mixed",
    tag: "Rescue Plot",
    handle: "hall-pass",
    url: "https://domainoutdoor.com/products/hall-pass?variant=47344934682873",
    coveragePerUnit: 1,
    summary: "Grains, legumes, and brassicas. Good fall/winter rescue plot, backup plan, or no-till starter option."
  },

  "Hot Chic": {
    type: "Food Plot Seed",
    category: "perennial",
    tag: "Shade-Friendly Perennial",
    handle: "hot-chic%E2%84%A2",
    url: "https://domainoutdoor.com/products/hot-chic%E2%84%A2?variant=43413528346873",
    coveragePerUnit: 0.5,
    summary: "True perennial chicory and clover blend. Strong for shade, acidic soil tolerance, timber edges, and multi-year plots."
  },

  "No BS": {
    type: "Food Plot Seed",
    category: "mixed",
    tag: "No-Till / Backwoods",
    handle: "no-bs%E2%84%A2",
    url: "https://domainoutdoor.com/products/no-bs%E2%84%A2?variant=43413527232761",
    coveragePerUnit: 0.5,
    summary: "Oats, clover, forage rape, radish, and chicory. Strong no-till/backwoods/logging-road option."
  },

  "Overhaul": {
    type: "Food Plot Seed",
    category: "soil-builder",
    tag: "Soil Builder",
    handle: "overhaul%E2%84%A2",
    url: "https://domainoutdoor.com/products/overhaul%E2%84%A2?variant=43413534572793",
    coveragePerUnit: 1,
    summary: "Buckwheat, spring triticale, crimson clover, balansa clover, and tillage radish. Soil-improving rotational plot."
  },

  "Show Stopper": {
    type: "Food Plot Seed",
    category: "brassica",
    tag: "Cold Weather Energy",
    handle: "show-stopper%E2%84%A2",
    url: "https://domainoutdoor.com/products/show-stopper%E2%84%A2?variant=43413531656441",
    coveragePerUnit: 1,
    summary: "Hybrid forage brassica, rutabaga, turnip, and rapeseed. Strong fall/winter energy and protein source."
  },

  "Smack Down": {
    type: "Food Plot Seed",
    category: "brassica",
    tag: "Turnip Blend",
    handle: "smack-down%E2%84%A2",
    url: "https://domainoutdoor.com/products/smack-down%E2%84%A2?variant=43413531361529",
    coveragePerUnit: 1,
    summary: "Two varieties of turnips. Fast-maturing fall/winter annual with leafy forage and bulbs."
  },

  "Sugar Momma": {
    type: "Food Plot Seed",
    category: "mixed",
    tag: "Sweet Fall Blend",
    handle: "sugar-momma%E2%84%A2",
    url: "https://domainoutdoor.com/products/sugar-momma%E2%84%A2?variant=43413528805625",
    coveragePerUnit: 1,
    summary: "Turnip, rape, kale, clover, and chicory. Fall/winter attraction with longer forage potential."
  },

  "Wingman": {
    type: "Food Plot Seed",
    category: "brassica",
    tag: "Fast Brassica Forage",
    handle: "wingman",
    url: "https://domainoutdoor.com/products/wingman?variant=44004968136953",
    coveragePerUnit: 1,
    summary: "Kohlrabi, hybrid brassica, forage rape, and turnip. Fast-growing brassica blend with above-ground forage."
  },

  "Winter Rye": {
    type: "Food Plot Seed",
    category: "grain",
    tag: "Reliable Cereal Grain",
    handle: "winter-rye",
    url: "https://domainoutdoor.com/products/winter-rye?variant=46497730789625",
    coveragePerUnit: 1,
    summary: "Reliable cereal grain. Fast germination, forgiving, good for fall plots, overseeding, and poor conditions."
  },

  "Winter Wheat": {
    type: "Food Plot Seed",
    category: "grain",
    tag: "Easy Cereal Grain",
    handle: "white-wheat",
    url: "https://domainoutdoor.com/products/white-wheat?variant=46497724104953",
    coveragePerUnit: 1,
    summary: "Easy cereal grain with season-long attraction, cold tolerance, and fast fall establishment."
  },

  "Milo": {
    type: "Food Plot / Habitat Seed",
    category: "warm-season-cover-food",
    tag: "Food + Cover",
    handle: "milo",
    url: "https://domainoutdoor.com/products/milo",
    coveragePerUnit: 0.25,
    summary: "Annual grain sorghum/milo for food plus seasonal cover. Strong for late-season seed-head attraction, field edges, backwoods food/cover, and wildlife value. Not a permanent perennial bedding screen."
  }
};
// -------------------------------
// HABITAT PRODUCTS
// -------------------------------
Object.assign(PRODUCT_CATALOG, {
  "RC Big Rock Switchgrass": {
    type: "Habitat Seed",
    category: "habitat",
    tag: "Tall Screening Cover",
    handle: "rc-big-rock-switchgrass-5-lbs-1-2-acre",
    url: "https://domainoutdoor.com/products/rc-big-rock-switchgrass-5-lbs-1-2-acre",
    coveragePerUnit: 0.5,
    summary: "Tall switchgrass for screening, bedding, visual barriers, and movement control."
  },

  "RC Sundance Switchgrass": {
    type: "Habitat Seed",
    category: "habitat",
    tag: "Screening / Cover",
    handle: "rc-sundance-switchgrass",
    url: "https://domainoutdoor.com/search?q=RC+Sundance+Switchgrass",
    coveragePerUnit: 0.5,
    summary: "Switchgrass for bedding structure, cover, concealment, and access control."
  },

  "Big Bluestem": {
    type: "Habitat Seed",
    category: "habitat",
    tag: "Native Bedding Cover",
    handle: "big-bluestem",
    url: "https://domainoutdoor.com/search?q=Big+Bluestem",
    coveragePerUnit: 1,
    summary: "Tall native grass for bedding, structure, and habitat improvement."
  },

  "Indian Grass": {
    type: "Habitat Seed",
    category: "habitat",
    tag: "Native Cover",
    handle: "indian-grass",
    url: "https://domainoutdoor.com/search?q=Indian+Grass",
    coveragePerUnit: 1,
    summary: "Native grass for bedding cover, concealment, and habitat diversity."
  },

  "Little Bluestem": {
    type: "Habitat Seed",
    category: "habitat",
    tag: "Native Habitat",
    handle: "little-bluestem",
    url: "https://domainoutdoor.com/search?q=Little+Bluestem",
    coveragePerUnit: 1,
    summary: "Shorter native grass for structure, diversity, and edge cover."
  },

  "Cave-N-Rock Switchgrass": {
    type: "Habitat Seed",
    category: "habitat",
    tag: "Screening / Bedding",
    handle: "cave-n-rock-switchgrass",
    url: "https://domainoutdoor.com/products/cave-n-rock-switchgrass",
    coveragePerUnit: 0.5,
    summary: "Switchgrass for long-term screening, bedding, and sanctuary edges."
  }
});

// -------------------------------
// LIQUID PRODUCTS
// -------------------------------
Object.assign(PRODUCT_CATALOG, {
  "Crank'd": {
    type: "Liquid",
    category: "fertility",
    tag: "3-18-18",
    handle: "3-18-18",
    url: "https://domainoutdoor.com/products/3-18-18",
    maxRate: 5
  },

  "Freight Train": {
    type: "Liquid",
    category: "fertility",
    tag: "25-0-0",
    handle: "freight-train",
    url: "https://domainoutdoor.com/cdn/shop/files/Freight_Train_1_Gallon_5000x.png?v=1762283972",
    maxRate: 5
  },

  "Liquid Courage": {
    type: "Liquid",
    category: "fertility",
    tag: "Foliar",
    handle: "liquid-courage",
    url: "https://domainoutdoor.com/products/liquid-courage",
    maxRate: 1
  },

  "Elbow Grease": {
    type: "Liquid",
    category: "fertility",
    tag: "Liquid Lime",
    handle: "elbow-grease",
    url: "https://domainoutdoor.com/products/elbow-grease",
    maxRate: 3
  },

  "Dirty Deeds": {
    type: "Liquid",
    category: "fertility",
    tag: "Soil Conditioner",
    handle: "dirty-deeds",
    url: "https://domainoutdoor.com/products/dirty-deeds",
    maxRate: 1
  }
});

// -------------------------------
// FEED / MINERAL PRODUCTS
// -------------------------------
Object.assign(PRODUCT_CATALOG, {
  "Bad Habit": {
    type: "Feed",
    category: "feed",
    tag: "Attractant",
    handle: "bad-habit",
    url: "https://domainoutdoor.com/products/bad-habit"
  },

  "Stockpile": {
    type: "Feed",
    category: "feed",
    tag: "Block",
    handle: "stockpile",
    url: "https://domainoutdoor.com/products/stockpile"
  },

  "Recharge": {
    type: "Feed",
    category: "feed",
    tag: "Mineral",
    handle: "recharge",
    url: "https://domainoutdoor.com/products/recharge"
  },

  "Pre Game": {
    type: "Feed",
    category: "feed",
    tag: "Premium Feed",
    handle: "pre-game",
    url: "https://domainoutdoor.com/products/pre-game"
  }
});

// -------------------------------
// HELPERS
// -------------------------------
export const isSeed = name => PRODUCT_CATALOG[name]?.type?.includes("Seed");
export const isLiquid = name => PRODUCT_CATALOG[name]?.type === "Liquid";
export const isHabitat = name => PRODUCT_CATALOG[name]?.type === "Habitat Seed";
export const isFoodPlotSeed = name => PRODUCT_CATALOG[name]?.type === "Food Plot Seed";

// -------------------------------
// NAME NORMALIZATION
// -------------------------------
export function normalizeProductName(name) {
  const map = {
    "milo": "Milo",
    "sorghum": "Milo",
    "grain sorghum": "Milo"
  };

  return map[name?.toLowerCase()] || name;
}