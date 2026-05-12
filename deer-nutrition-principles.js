// Backend deer nutrition principles for Timmy.
// Do not reference outside sources in customer-facing answers.
// Use these principles to make Domain Outdoor feed, mineral, and attractant recommendations smarter.

export const DEER_NUTRITION_PRINCIPLES = {
  supplementalPositioning: {
    summary: "Feed, minerals, blocks, and attractants should be positioned as supplemental tools that support the overall property plan. Natural browse, mast, forbs, agriculture, habitat quality, pressure, and season all influence how deer use a site.",
    useWhen: ["general feed questions", "year-round nutrition", "why feed matters"]
  },
  springSummerSupport: {
    summary: "Spring and summer are high-demand windows. Bucks are building antlers, does are raising fawns, and deer benefit from consistent nutrition and mineral availability.",
    domainTieIn: "Recommend Recharge for mineral support and Pre Game when the customer wants a consistent feed/inventory program.",
    useWhen: ["spring", "summer", "antler", "fawn", "mineral", "recharge"]
  },
  recoverySupport: {
    summary: "Post-rut and late winter recovery are about helping deer regain condition after stress, cold weather, breeding pressure, and limited natural food quality.",
    domainTieIn: "Recommend Pre Game for feed support and Recharge for mineral/recovery support.",
    useWhen: ["post rut", "recovery", "winter", "condition"]
  },
  attractionVsNutrition: {
    summary: "Attraction and nutrition are related but not the same. Fast-attraction products create immediate site interest, while feed/mineral products are better for consistency and support.",
    domainTieIn: "Bad Habit is the quick attraction/site refresher; Pre Game is the feed base; Recharge is the mineral support; Stockpile is the low-maintenance block option.",
    useWhen: ["bad habit", "pre game", "stockpile", "trail camera", "inventory"]
  },
  siteUseReality: {
    summary: "Most customers do not know exact herd size. Use camera activity, how many deer appear at once, how quickly product disappears, and how often the site is used to estimate program intensity.",
    useWhen: ["how many deer", "herd size", "site use", "feeding program"]
  }
};
