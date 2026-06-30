// data/domain-products.js

export const LINKS = {
  propertyPlanner: "https://domainoutdoor.com/pages/property-planner",
  askTimmy: "https://domainoutdoor.com/pages/ask-timmy",
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


  "Barley Legal": {
    type: "Food Plot Seed",
    category: "grain",
    tag: "Late Season Grain Mix",
    handle: "barley-legal",
    url: "https://domainoutdoor.com/products/barley-legal?variant=47398429622521",
    image: "https://domainoutdoor.com/cdn/shop/files/BARLEYLEGAL_web_d2b24485-d620-43e4-94c3-5f555245cf1d_5000x.png?v=1782479210",
    coveragePerUnit: 0.5,
    summary: "Premium grain mix for fall attraction. Strong fit for low-input plots, kill plots, sandy soils, lower pH situations, and late-season food where a simple cereal-grain style plot is the goal.",
    aliases: [
      "barley legal",
      "barley",
      "barley seed",
      "fall barley",
      "late season grain",
      "late season grain mix",
      "cereal grain mix",
      "low input fall plot",
      "barley legal food plot"
    ],
    plantingGuide: {
      seedType: "Annual",
      bestUse: "Late-season food, fall attraction, low-input plots, kill plots, sandy soils, and lower-pH situations.",
      location: "Full sun to partial shade",
      soilType: "Well-drained, sandy, dark/rich, clay, loam, and lower-pH soils",
      plantingDates: {
        north: "August–September",
        central: "August–October",
        south: "September–November"
      },
      soilTemp: {
        min: 45,
        ideal: 70,
        max: 80,
        category: "CEREAL_GRAIN"
      },
      tip: "Barley Legal is a fall-focused cereal grain mix. Do not push it as a spring planting recommendation. In the South, wait until heat begins to break and moisture is available."
    }
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

  "Incognito": {
    type: "Food Plot / Habitat Seed",
    category: "screening",
    tag: "Annual Screening",
    handle: "incognito%E2%84%A2",
    url: "https://domainoutdoor.com/products/incognito%E2%84%A2?variant=43413529035001",
    coveragePerUnit: 0.25,
    summary: "Egyptian wheat and two varieties of sorghum built to create fast-growing concealment, protected access, plot screens, and seasonal visual barriers. Can reach 7–10 feet tall in 80–100 days when planted correctly.",
    aliases: [
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
    ],
    plantingGuide: {
      seedType: "Annual",
      varieties: "Egyptian wheat and two varieties of sorghum",
      bestUse: "Screening, concealment, protected access routes, stand entry/exit cover, and visual barriers around food plots.",
      location: "Full sun, open areas, and well-drained soil",
      phRange: "5.5–7.0",
      soilType: "Well-drained, dark/rich, sandy, or clay soils",
      tilling: "Tilled, plowed, disked, or hand-raked soil",
      fertilizer: "100 lbs. of 10-10-10 per acre at planting. Once rooted, a shot of nitrogen can help maximize height, density, and screening performance.",
      seedDepth: "1/2 inch or less",
      seedRate: "13 lbs. per acre",
      plantingDates: {
        north: "May–July",
        central: "May–August",
        south: "June–September"
      },
      maturity: "80–100 days",
      height: "7–10 feet in good conditions",
      tip: "Plant Incognito in strips 10 feet wide or wider when possible for the best visual screen. It is a warm-season annual, so wait for warm soil and adequate moisture before planting."
    }
  },

  "Milo": {
    type: "Food Plot / Habitat Seed",
    category: "warm-season-cover-food",
    tag: "Food + Cover",
    handle: "milo",
    url: "https://domainoutdoor.com/products/milo",
    coveragePerUnit: 0.25,
    summary: "Annual grain sorghum/milo for food plus seasonal cover. Strong for late-season seed-head attraction, field edges, backwoods food/cover, and wildlife value. Not a permanent perennial bedding screen."
  },

  "Dirty Bird": {
    type: "Food Plot / Habitat Seed",
    category: "warm-season-cover-food",
    tag: "Food + Cover",
    handle: "dirty-bird",
    url: "https://domainoutdoor.com/products/dirty-bird",
    coveragePerUnit: 0.25,
    summary: "Warm-season annual blend with millet, sorghum, sunflower, and soybeans. Built for food, cover, structure, birds, turkey, and deer movement."
  },

  "Japanese Millet": {
    type: "Food Plot / Habitat Seed",
    category: "warm-season-cover-food",
    tag: "Food + Cover",
    handle: "japanese-millet",
    url: "https://domainoutdoor.com/products/japanese-millet",
    coveragePerUnit: 0.25,
    summary: "Warm-season annual millet that creates seasonal cover and seed-head food value for wildlife. Strong for wet or lower areas when conditions fit."
  },

  "Sunflower": {
    type: "Food Plot / Habitat Seed",
    category: "warm-season-cover-food",
    tag: "Food + Cover",
    handle: "sunflower",
    url: "https://domainoutdoor.com/products/sunflower",
    coveragePerUnit: 0.25,
    summary: "Warm-season annual that provides structure, seed-head food value, and wildlife attraction. Best used as seasonal food and cover, not permanent bedding."
  },

  "Landing Strip": {
    type: "Food Plot / Habitat Seed",
    category: "warm-season-cover-food",
    tag: "Food + Cover",
    handle: "landing-strip",
    url: "https://domainoutdoor.com/products/landing-strip",
    coveragePerUnit: 0.25,
    summary: "Millet and sorghum blend built for food and cover. Strong for waterfowl, upland birds, turkey, and deer where seasonal structure and seed production matter."
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
    handle: "freight-train%E2%84%A2-25-0-0-liquid-fertilizer",
    url: "https://domainoutdoor.com/products/freight-train%E2%84%A2-25-0-0-liquid-fertilizer",
    maxRate: 5
  },

  "Liquid Courage": {
    type: "Liquid",
    category: "fertility",
    tag: "Foliar",
    handle: "liquid-courage-7-17-4-foliar-fertilizer",
    url: "https://domainoutdoor.com/products/liquid-courage-7-17-4-foliar-fertilizer",
    maxRate: 1
  },

  "Elbow Grease": {
    type: "Liquid",
    category: "fertility",
    tag: "Liquid Lime",
    handle: "elbow-grease%E2%84%A2-advanced-calcium",
    url: "https://domainoutdoor.com/products/elbow-grease%E2%84%A2-advanced-calcium",
    maxRate: 3
  },

  "Dirty Deeds": {
    type: "Liquid",
    category: "fertility",
    tag: "Soil Conditioner",
    handle: "dirty-deeds%E2%84%A2-soil-conditioner",
    url: "https://domainoutdoor.com/products/dirty-deeds%E2%84%A2-soil-conditioner",
    maxRate: 1
  }
,

  "Crop Rocket": {
    type: "Liquid",
    category: "fertility",
    tag: "Biological Fertilizer",
    handle: "crop-rocket-biological-fertilizer",
    url: "https://domainoutdoor.com/products/crop-rocket-biological-fertilizer?variant=47751249690873",
    image: "https://domainoutdoor.com/cdn/shop/files/CropRocketSmall_web_5000x.png?v=1782833372",
    coveragePerUnit: 1,
    maxRate: 0.25,
    summary: "Biological fertilizer and soil-support liquid for biological soil activity, rooting, stress tolerance, and stronger food plot performance. Best used with soil-test information and the Plot Enhancing App.",
    aliases: [
      "crop rocket",
      "crop rocket biological fertilizer",
      "biological fertilizer",
      "bio fertilizer",
      "rooting fertilizer",
      "root growth",
      "stress tolerance",
      "soil biology",
      "soil health liquid"
    ]
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

  "Stockpile XL": {
    type: "Feed",
    category: "feed",
    tag: "Block",
    handle: "stockpile-xl",
    url: "https://domainoutdoor.com/products/stockpile-xl",
    summary: "Larger Stockpile attractant and nutrition block option for longer-lasting sites where legal."
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
,

  "Pre Game 25LB Block": {
    type: "Feed",
    category: "feed",
    tag: "Premium Feed Block",
    handle: "pre-game-25lb-deer-feed-block",
    url: "https://domainoutdoor.com/products/pre-game-25lb-deer-feed-block?variant=47453918298361",
    image: "https://domainoutdoor.com/cdn/shop/files/PREGAME25LBBLOCK_5000x.png?v=1772117099",
    summary: "Pre Game 25LB Block is a premium deer feed block for attraction, herd health, and low-maintenance feed sites where feed, bait, minerals, and attractants are legal.",
    aliases: ["pre game block", "pregame block", "pre-game block", "25 lb block", "25lb block", "pre game 25lb", "pre game 25 lb"]
  },

  "Pre Game 125LB TUB": {
    type: "Feed",
    category: "feed",
    tag: "Premium Feed Tub",
    handle: "pre-game-tub-125lb",
    url: "https://domainoutdoor.com/products/pre-game-tub-125lb?variant=48613014110457",
    image: "https://domainoutdoor.com/cdn/shop/files/PregameTub125_web_e34d7ba6-cb8c-4214-a8a1-ad66e6fa84aa_5000x.png?v=1782835588",
    retailerOnly: true,
    onlineSales: false,
    summary: "Pre Game 125LB Tub is the large-format Pre Game feed option for longer-lasting feed sites, larger properties, inventory, and attraction. This product should push customers to local retailers and the Domain Outdoor Dealer Locator instead of online checkout.",
    aliases: ["pre game tub", "pregame tub", "pre-game tub", "pre game 125", "pre game 125lb", "pre game 125 lb", "125lb tub", "125 lb tub", "bulk pre game", "large feed tub"]
  },

  "Ripple Effect": {
    type: "Feed",
    category: "water-hole-additive",
    customerCategory: "Water Hole Additive",
    tag: "Water Hole Additive",
    handle: "ripple-effect-water-hole-solution",
    url: "https://domainoutdoor.com/products/ripple-effect-water-hole-solution?variant=47751218790649",
    image: "https://domainoutdoor.com/cdn/shop/files/RippleEffect_web_5000x.png?v=1782832524",
    summary: "Ripple Effect is a water-hole additive for wildlife water holes, stagnant water sites, mineral-season water use, trail-camera inventory, and improving deer use of water sources where feed, bait, minerals, attractants, and water-hole additives are legal.",
    aliases: ["ripple effect", "water hole additive", "waterhole additive", "water hole mineral", "waterhole mineral", "water hole solution", "stagnant water", "deer water hole", "wildlife water hole"]
  }
});

// -------------------------------
// SOIL TEST / RESOURCE PRODUCTS
// -------------------------------
Object.assign(PRODUCT_CATALOG, {
  "Comprehensive Food Plot Soil Test Kit": {
    type: "Soil Test",
    category: "soil-test",
    tag: "Full Soil Test",
    handle: "comprehensive-food-plot-soil-test-kit",
    url: "https://domainoutdoor.com/products/comprehensive-food-plot-soil-test-kit",
    coveragePerUnit: null,
    summary: "Full food plot soil test kit for customers who want pH, phosphorus, potassium, and fertility information before planting.",
    aliases: [
      "comprehensive soil test",
      "comprehensive soil test kit",
      "soil test",
      "soil test kit",
      "soil testing kit",
      "lab soil test",
      "soil sample",
      "test my soil",
      "phosphorus test",
      "potassium test"
    ]
  },

  "DIY Instant pH Test Kit": {
    type: "Soil Test",
    category: "soil-test",
    tag: "Instant pH Test",
    handle: "diy-instant-ph-test-kit",
    url: "https://domainoutdoor.com/products/diy-instant-ph-test-kit?variant=43413529264377",
    coveragePerUnit: null,
    summary: "Quick pH test kit for checking soil pH before planting a food plot.",
    aliases: [
      "ph test kit",
      "p h test kit",
      "instant ph",
      "instant ph test",
      "diy ph test",
      "soil ph kit",
      "instant soil test"
    ]
  }
});

// -------------------------------
// HELPERS
// -------------------------------
export const isSeed = name => PRODUCT_CATALOG[name]?.type?.includes("Seed");
export const isLiquid = name => PRODUCT_CATALOG[name]?.type === "Liquid";
export const isHabitat = name => PRODUCT_CATALOG[name]?.type === "Habitat Seed";
export const isFoodPlotSeed = name =>
  PRODUCT_CATALOG[name]?.type === "Food Plot Seed" ||
  PRODUCT_CATALOG[name]?.type === "Food Plot / Habitat Seed";

// -------------------------------
// NAME NORMALIZATION
// -------------------------------
export function normalizeProductName(name) {
  const map = {
    "barley legal": "Barley Legal",
    "barley": "Barley Legal",
    "barley seed": "Barley Legal",
    "crop rocket": "Crop Rocket",
    "crop rocket biological fertilizer": "Crop Rocket",
    "biological fertilizer": "Crop Rocket",
    "pre game block": "Pre Game 25LB Block",
    "pregame block": "Pre Game 25LB Block",
    "pre-game block": "Pre Game 25LB Block",
    "pre game 25lb": "Pre Game 25LB Block",
    "pre game 25 lb": "Pre Game 25LB Block",
    "pre game tub": "Pre Game 125LB TUB",
    "pregame tub": "Pre Game 125LB TUB",
    "pre-game tub": "Pre Game 125LB TUB",
    "pre game 125lb tub": "Pre Game 125LB TUB",
    "pre game 125 lb tub": "Pre Game 125LB TUB",
    "125lb tub": "Pre Game 125LB TUB",
    "125 lb tub": "Pre Game 125LB TUB",
    "ripple effect": "Ripple Effect",
    "water hole additive": "Ripple Effect",
    "waterhole additive": "Ripple Effect",
    "water hole mineral": "Ripple Effect",
    "incognito": "Incognito",
    "in cognito": "Incognito",
    "screening seed": "Incognito",
    "screening mix": "Incognito",
    "annual screen": "Incognito",
    "annual screening": "Incognito",
    "access screen": "Incognito",
    "access screening": "Incognito",
    "blind screen": "Incognito",
    "plot screen": "Incognito",
    "food plot screen": "Incognito",
    "concealment screen": "Incognito",
    "concealment mix": "Incognito",
    "egyptian wheat": "Incognito",
    "sorghum screen": "Incognito",
    "sorghum screening": "Incognito",
    "milo": "Milo",
    "sorghum": "Milo",
    "grain sorghum": "Milo",
    "soil test": "Comprehensive Food Plot Soil Test Kit",
    "soil test kit": "Comprehensive Food Plot Soil Test Kit",
    "comprehensive soil test": "Comprehensive Food Plot Soil Test Kit",
    "comprehensive soil test kit": "Comprehensive Food Plot Soil Test Kit",
    "ph test": "DIY Instant pH Test Kit",
    "ph test kit": "DIY Instant pH Test Kit",
    "p h test kit": "DIY Instant pH Test Kit",
    "instant ph test": "DIY Instant pH Test Kit",
    "stockpile xl": "Stockpile XL",
    "stockpile extra large": "Stockpile XL",
    "pre-game": "Pre Game",
    "pregame": "Pre Game",
    "recharge mineral": "Recharge"
  };

  return map[name?.toLowerCase()] || name;
}