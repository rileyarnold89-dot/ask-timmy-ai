import { supabaseAdmin } from "../lib/supabase.js";
import { getShopifyCustomerContext } from "../lib/shopify-proxy-auth.js";

const PLAN_TABLES = {
  properties: "saved_properties",
  property: "saved_properties",
  soil_tests: "saved_soil_tests",
  soil_test: "saved_soil_tests",
  fertility: "saved_fertility_plans",
  planting: "saved_planting_plans",
  food_plot: "saved_food_plot_plans",
  food_plots: "saved_food_plot_plans",
  timmy_answers: "saved_timmy_answers",
  timmy: "saved_timmy_answers"
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.DOMAIN_ALLOWED_ORIGIN || "https://domainoutdoor.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function cleanText(value) {
  if (value === null || value === undefined) return null;
  return String(value).trim() || null;
}

function cleanNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function stripHtml(value) {
  if (!value) return null;
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPlanType(req, body = {}) {
  return cleanText(req.query?.type || body.type || "fertility");
}

function getPlanPayload(body) {
  return body.plan && typeof body.plan === "object" ? body.plan : body;
}

function getNameFields(plan) {
  return {
    property_name: cleanText(plan.property_name || plan.propertyName),
    plot_name: cleanText(plan.plot_name || plan.plotName),
    notes: cleanText(plan.notes || plan.plan_notes || plan.planNotes)
  };
}

function buildPlanName(plan, fallback) {
  const propertyName = cleanText(plan.property_name || plan.propertyName);
  const plotName = cleanText(plan.plot_name || plan.plotName);
  const planName = cleanText(plan.plan_name || plan.planName);

  if (planName) return planName;

  const parts = [propertyName, plotName, fallback].filter(Boolean);
  return parts.length ? parts.join(" — ") : fallback;
}

function mapPropertyPlan(customerId, plan) {
  return {
    shopify_customer_id: customerId,
    property_name: cleanText(plan.property_name || plan.propertyName || plan.name || "My Property") || "My Property",
    state: cleanText(plan.state),
    zip: cleanText(plan.zip),
    county: cleanText(plan.county),
    acres: cleanNumber(plan.acres),
    food_plot_acres: cleanNumber(plan.food_plot_acres || plan.foodPlotAcres),
    equipment: cleanText(plan.equipment),
    soil_type: cleanText(plan.soil_type || plan.soilType),
    sunlight: cleanText(plan.sunlight),
    moisture: cleanText(plan.moisture),
    deer_goals: cleanText(plan.deer_goals || plan.deerGoals || plan.goal),
    property_notes: cleanText(plan.property_notes || plan.propertyNotes || plan.notes),
    plan_data: plan
  };
}

function mapSoilTest(customerId, plan) {
  const names = getNameFields(plan);

  return {
    shopify_customer_id: customerId,
    property_id: cleanText(plan.property_id || plan.propertyId),
    property_name: names.property_name,
    plot_name: names.plot_name,
    test_name: cleanText(plan.test_name || plan.testName || plan.name || "Soil Test") || "Soil Test",
    test_date: cleanText(plan.test_date || plan.testDate),
    crop_or_plot: cleanText(plan.crop_or_plot || plan.cropOrPlot || plan.crop),
    soil_ph: cleanNumber(plan.soil_ph || plan.soilPh),
    phosphorus_ppm: cleanNumber(plan.phosphorus_ppm || plan.phosphorusPpm || plan.soilP),
    potassium_ppm: cleanNumber(plan.potassium_ppm || plan.potassiumPpm || plan.soilK),
    organic_matter_percent: cleanNumber(plan.organic_matter_percent || plan.organicMatterPercent || plan.organicMatter),
    nitrogen_ppm: cleanNumber(plan.nitrogen_ppm || plan.nitrogenPpm),
    calcium_ppm: cleanNumber(plan.calcium_ppm || plan.calciumPpm),
    magnesium_ppm: cleanNumber(plan.magnesium_ppm || plan.magnesiumPpm),
    notes: names.notes,
    raw_data: plan
  };
}

function mapFertilityPlan(customerId, plan) {
  const names = getNameFields(plan);

  return {
    shopify_customer_id: customerId,
    property_id: cleanText(plan.property_id || plan.propertyId),
    soil_test_id: cleanText(plan.soil_test_id || plan.soilTestId),
    property_name: names.property_name,
    plot_name: names.plot_name,
    notes: names.notes,
    plan_name: buildPlanName(plan, `${plan.crop || plan.selectedLabel || "Fertility"} Plan`),
    crop: cleanText(plan.crop || plan.selectedLabel),
    acres: cleanNumber(plan.acres),
    soil_ph: cleanNumber(plan.soilPh || plan.soil_ph),
    phosphorus_ppm: cleanNumber(plan.soilP || plan.phosphorus_ppm),
    potassium_ppm: cleanNumber(plan.soilK || plan.potassium_ppm),
    organic_matter_percent: cleanNumber(plan.organicMatter || plan.organic_matter_percent),
    target_ph: cleanNumber(plan.targetPh || plan.target_ph),
    dry_goal: cleanText(plan.dryGoal || plan.dry_goal),
    total_liquid_gallons: cleanNumber(plan.totalGallons || plan.total_liquid_gallons),
    starter_program: stripHtml(plan.starterHtml || plan.starter_program || plan.starterText),
    in_season_program: stripHtml(plan.inSeasonHtml || plan.in_season_program || plan.inSeasonText),
    support_program: stripHtml(plan.supportHtml || plan.support_program || plan.supportText),
    products: plan.products || {},
    full_plan: plan
  };
}

function getArrayValue(...values) {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

function buildPlantingFullPlan(plan) {
  const latestRecommendation = getObject(plan.latestRecommendation || plan.latest_recommendation);
  const existingFullPlan = getObject(plan.full_plan);

  const bestDates = getArrayValue(
    plan.best_dates,
    plan.bestDates,
    plan.top_dates,
    plan.topDates,
    latestRecommendation.topDates,
    latestRecommendation.bestDates,
    existingFullPlan.best_dates,
    existingFullPlan.bestDates,
    existingFullPlan.top_dates,
    existingFullPlan.topDates
  );

  const weatherNote = firstCleanText(
    plan.moisture_notes,
    plan.moistureNotes,
    plan.weather_note,
    plan.weatherNote,
    latestRecommendation.weatherNote,
    latestRecommendation.weather_note,
    existingFullPlan.moisture_notes,
    existingFullPlan.moistureNotes,
    existingFullPlan.weather_note,
    existingFullPlan.weatherNote
  );

  return {
    ...existingFullPlan,
    ...plan,
    best_dates: bestDates,
    bestDates,
    top_dates: bestDates,
    topDates: bestDates,
    moisture_notes: weatherNote,
    moistureNotes: weatherNote,
    weather_note: weatherNote,
    weatherNote,
    latestRecommendation: {
      ...latestRecommendation,
      topDates: getArrayValue(latestRecommendation.topDates, bestDates),
      weatherNote: firstCleanText(latestRecommendation.weatherNote, weatherNote)
    }
  };
}

function hydratePlantingPlan(row) {
  if (!row || typeof row !== "object") return row;

  const fullPlan = buildPlantingFullPlan(row.full_plan || row);
  const bestDates = getArrayValue(row.best_dates, row.bestDates, row.top_dates, row.topDates, fullPlan.best_dates, fullPlan.bestDates, fullPlan.top_dates, fullPlan.topDates);
  const moistureNotes = firstCleanText(row.moisture_notes, row.moistureNotes, row.weather_note, row.weatherNote, fullPlan.moisture_notes, fullPlan.moistureNotes, fullPlan.weather_note, fullPlan.weatherNote);

  return {
    ...row,
    best_dates: bestDates,
    bestDates,
    top_dates: bestDates,
    topDates: bestDates,
    moisture_notes: moistureNotes,
    moistureNotes,
    weather_note: moistureNotes,
    weatherNote: moistureNotes,
    full_plan: fullPlan
  };
}

function mapPlantingPlan(customerId, plan) {
  const names = getNameFields(plan);
  const fullPlan = buildPlantingFullPlan(plan);
  const latestRecommendation = getObject(plan.latestRecommendation || plan.latest_recommendation || fullPlan.latestRecommendation);
  const bestDates = getArrayValue(plan.best_dates, plan.bestDates, plan.top_dates, plan.topDates, latestRecommendation.topDates, fullPlan.best_dates, fullPlan.bestDates, fullPlan.top_dates, fullPlan.topDates);
  const moistureNotes = firstCleanText(plan.moisture_notes, plan.moistureNotes, plan.weather_note, plan.weatherNote, latestRecommendation.weatherNote, fullPlan.moisture_notes, fullPlan.moistureNotes, fullPlan.weather_note, fullPlan.weatherNote);

  return {
    shopify_customer_id: customerId,
    property_id: cleanText(plan.property_id || plan.propertyId),
    property_name: names.property_name,
    plot_name: names.plot_name,
    notes: names.notes,
    plan_name: buildPlanName(plan, `${plan.product_name || plan.product || plan.crop || latestRecommendation.productName || "Planting"} Plan`),
    product_name: cleanText(plan.product_name || plan.product || plan.crop || plan.productName || latestRecommendation.productName),
    state: cleanText(plan.state || fullPlan.state),
    zip: cleanText(plan.zip || fullPlan.zip),
    region: cleanText(plan.region || fullPlan.region),
    acres: cleanNumber(plan.acres || fullPlan.acres),
    planting_window: cleanText(plan.planting_window || plan.plantingWindow || plan.window || latestRecommendation.plantingWindow || fullPlan.plantingWindow || fullPlan.planting_window),
    best_dates: bestDates,
    moisture_notes: moistureNotes,
    timing_score: cleanText(plan.timing_score || plan.timingScore),
    full_plan: {
      ...fullPlan,
      best_dates: bestDates,
      bestDates,
      top_dates: bestDates,
      topDates: bestDates,
      moisture_notes: moistureNotes,
      moistureNotes,
      weather_note: moistureNotes,
      weatherNote: moistureNotes
    }
  };
}

function mapFoodPlotPlan(customerId, plan) {
  const names = getNameFields(plan);

  return {
    shopify_customer_id: customerId,
    property_id: cleanText(plan.property_id || plan.propertyId),
    property_name: names.property_name,
    plot_name: names.plot_name,
    notes: names.notes,
    plan_name: buildPlanName(plan, "Food Plot Plan"),
    goal: cleanText(plan.goal),
    state: cleanText(plan.state),
    zip: cleanText(plan.zip),
    acres: cleanNumber(plan.acres),
    soil_condition: cleanText(plan.soil_condition || plan.soilCondition || plan.soil),
    sunlight: cleanText(plan.sunlight),
    equipment: cleanText(plan.equipment),
    recommendations: Array.isArray(plan.recommendations) ? plan.recommendations : [],
    full_plan: plan
  };
}

function mapPlan(customerId, type, plan) {
  if (type === "properties" || type === "property") return mapPropertyPlan(customerId, plan);
  if (type === "soil_tests" || type === "soil_test") return mapSoilTest(customerId, plan);
  if (type === "fertility") return mapFertilityPlan(customerId, plan);
  if (type === "planting") return mapPlantingPlan(customerId, plan);
  if (type === "food_plot" || type === "food_plots") return mapFoodPlotPlan(customerId, plan);
  return null;
}

function tableForType(type) {
  return PLAN_TABLES[type] || null;
}

async function getAllPlans(customerId) {
  const readableTypes = {
    properties: "saved_properties",
    soil_tests: "saved_soil_tests",
    fertility: "saved_fertility_plans",
    planting: "saved_planting_plans",
    food_plot: "saved_food_plot_plans",
    timmy_answers: "saved_timmy_answers"
  };

  const result = {};

  for (const [type, table] of Object.entries(readableTypes)) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select("*")
      .eq("shopify_customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`${table}: ${error.message}`);
    }

    result[type] = data || [];
  }

  return result;
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const customer = getShopifyCustomerContext(req);

  if (!customer.ok) {
    return res.status(401).json({
      ok: false,
      error: "Customer login required.",
      details: customer.reason
    });
  }

  try {
    if (req.method === "GET") {
      const type = getPlanType(req);

      if (type === "all") {
        const plans = await getAllPlans(customer.customerId);

        return res.status(200).json({
          ok: true,
          plans
        });
      }

      const table = tableForType(type);

      if (!table) {
        return res.status(400).json({
          ok: false,
          error: "Invalid plan type."
        });
      }

      const { data, error } = await supabaseAdmin
        .from(table)
        .select("*")
        .eq("shopify_customer_id", customer.customerId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        return res.status(500).json({
          ok: false,
          error: error.message
        });
      }

      return res.status(200).json({
        ok: true,
        type,
        plans: data || []
      });
    }

    if (req.method === "POST") {
      const body = getBody(req);
      const type = getPlanType(req, body);
      const table = tableForType(type);

      if (!table) {
        return res.status(400).json({
          ok: false,
          error: "Invalid plan type."
        });
      }

      if (type === "timmy" || type === "timmy_answers") {
        return res.status(400).json({
          ok: false,
          error: "Timmy answers should be saved through /api/timmy-log."
        });
      }

      const plan = getPlanPayload(body);
      const mappedPlan = mapPlan(customer.customerId, type, plan);

      if (!mappedPlan) {
        return res.status(400).json({
          ok: false,
          error: "Could not map plan."
        });
      }

      const { data, error } = await supabaseAdmin
        .from(table)
        .insert(mappedPlan)
        .select()
        .single();

      if (error) {
        return res.status(500).json({
          ok: false,
          error: error.message
        });
      }

      return res.status(200).json({
        ok: true,
        type,
        plan: data
      });
    }

    if (req.method === "DELETE") {
      const type = getPlanType(req);
      const table = tableForType(type);
      const id = cleanText(req.query?.id);

      if (!table) {
        return res.status(400).json({
          ok: false,
          error: "Invalid plan type."
        });
      }

      if (!id) {
        return res.status(400).json({
          ok: false,
          error: "Missing plan id."
        });
      }

      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("id", id)
        .eq("shopify_customer_id", customer.customerId);

      if (error) {
        return res.status(500).json({
          ok: false,
          error: error.message
        });
      }

      return res.status(200).json({
        ok: true,
        deleted: id
      });
    }

    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}