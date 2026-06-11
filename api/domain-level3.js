// api/domain-level3.js
// LEVEL 3 Supabase ingest + saved-plans endpoint for Domain Outdoor.
// Deploy this in the same Vercel project as Timmy, then set each Shopify section's
// LEVEL 3 Supabase API URL to: https://YOUR-VERCEL-DOMAIN.vercel.app/api/domain-level3

const ALLOWED_ORIGINS = new Set([
  "https://domainoutdoor.com",
  "https://www.domainoutdoor.com"
]);

function json(res, status, payload) {
  return res.status(status).json(payload);
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
  return { url: url.replace(/\/$/, ""), key };
}

async function supabaseFetch(path, options = {}) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Supabase ${response.status}: ${text || response.statusText}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function cleanString(value) {
  return String(value ?? "").trim();
}

function extractCustomer(body = {}, query = {}) {
  const customer = body.customer || {};
  return {
    shopify_customer_id: customer.shopify_customer_id ? String(customer.shopify_customer_id) : null,
    email: cleanString(customer.email || query.email || body.email).toLowerCase() || null,
    first_name: cleanString(customer.first_name) || null,
    last_name: cleanString(customer.last_name) || null,
    logged_in: Boolean(customer.logged_in)
  };
}

function normalizePlanBody(body = {}, query = {}) {
  const type = cleanString(query.type || body.type || body.plan_type || "complete_plan");
  const plan = body.plan && typeof body.plan === "object" ? body.plan : body;
  const customer = extractCustomer(body, query);

  return {
    type,
    plan,
    customer,
    source: cleanString(body.source || plan.saved_from || plan.source || "property_planner"),
    page_url: cleanString(body.page_url || "") || null,
    property_name: cleanString(plan.property_name || plan.propertyName || plan.property),
    plot_name: cleanString(plan.plot_name || plan.plotName || plan.plot),
    plan_name: cleanString(plan.plan_name || plan.planName || plan.plan || plan.answer_title),
    product_name: cleanString(plan.product_name || plan.productName || plan.crop || plan.selected_mix || plan.selectedMix),
    state: cleanString(plan.state || plan.region_state),
    zip: cleanString(plan.zip || plan.zip_code),
    acres: plan.acres === "" || plan.acres === undefined ? null : Number(plan.acres),
    created_at: cleanString(plan.created_at || plan.saved_at) || new Date().toISOString()
  };
}

async function upsertCustomer(customer = {}) {
  if (!customer.email && !customer.shopify_customer_id) return null;
  const payload = {
    shopify_customer_id: customer.shopify_customer_id,
    email: customer.email,
    first_name: customer.first_name,
    last_name: customer.last_name,
    last_seen_at: new Date().toISOString()
  };

  const rows = await supabaseFetch("level3_customers?on_conflict=email", {
    method: "POST",
    headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(payload)
  });

  return Array.isArray(rows) ? rows[0] : null;
}

async function createPropertyPlan(body, query) {
  const normalized = normalizePlanBody(body, query);
  const customerRow = await upsertCustomer(normalized.customer);
  const row = {
    customer_id: customerRow?.id || null,
    shopify_customer_id: normalized.customer.shopify_customer_id,
    customer_email: normalized.customer.email,
    type: normalized.type,
    source: normalized.source,
    property_name: normalized.property_name || null,
    plot_name: normalized.plot_name || null,
    plan_name: normalized.plan_name || null,
    product_name: normalized.product_name || null,
    state: normalized.state || null,
    zip: normalized.zip || null,
    acres: Number.isFinite(normalized.acres) ? normalized.acres : null,
    page_url: normalized.page_url,
    plan: normalized.plan,
    created_at: normalized.created_at
  };

  const inserted = await supabaseFetch("property_plans", {
    method: "POST",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify(row)
  });

  return Array.isArray(inserted) ? inserted[0] : inserted;
}

async function listPropertyPlans(query) {
  const type = cleanString(query.type || "all");
  const email = cleanString(query.email).toLowerCase();
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("order", "created_at.desc");
  params.set("limit", "500");
  if (email) params.set("customer_email", `eq.${email}`);
  if (type && type !== "all") params.set("type", `eq.${type}`);

  const rows = await supabaseFetch(`property_plans?${params.toString()}`, { method: "GET" });
  const grouped = {};
  (rows || []).forEach(row => {
    const plan = {
      id: row.id,
      ...(row.plan || {}),
      type: row.type,
      created_at: row.created_at,
      property_name: row.property_name || row.plan?.property_name || row.plan?.propertyName || "",
      plot_name: row.plot_name || row.plan?.plot_name || row.plan?.plotName || "",
      plan_name: row.plan_name || row.plan?.plan_name || row.plan?.planName || "",
      product_name: row.product_name || row.plan?.product_name || row.plan?.crop || "",
      acres: row.acres || row.plan?.acres || "",
      state: row.state || row.plan?.state || "",
      zip: row.zip || row.plan?.zip || "",
      full_plan: row.plan?.full_plan || row.plan?.fullPlan || row.plan || {}
    };
    if (!grouped[row.type]) grouped[row.type] = [];
    grouped[row.type].push(plan);
  });
  return grouped;
}

async function deletePropertyPlan(query) {
  const id = cleanString(query.id);
  if (!id) throw new Error("Missing saved plan id.");
  await supabaseFetch(`property_plans?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Prefer": "return=minimal" }
  });
}

async function createAppEvent(body = {}) {
  const customer = extractCustomer(body, {});
  const customerRow = await upsertCustomer(customer);
  const payload = body.payload && typeof body.payload === "object" ? body.payload : body;
  const row = {
    customer_id: customerRow?.id || null,
    shopify_customer_id: customer.shopify_customer_id,
    customer_email: customer.email,
    event_name: cleanString(body.event_name || body.event || "app_event"),
    app_name: cleanString(body.app_name || body.source || "unknown"),
    source: cleanString(body.source || body.app_name || "unknown"),
    page_url: cleanString(body.page_url || "") || null,
    property_name: cleanString(payload.property_name || payload.propertyName || payload.property) || null,
    plot_name: cleanString(payload.plot_name || payload.plotName || payload.plot) || null,
    product_name: cleanString(payload.product_name || payload.productName || payload.crop || payload.selected_mix) || null,
    state: cleanString(payload.state || payload.region_state) || null,
    zip: cleanString(payload.zip || payload.zip_code) || null,
    acres: payload.acres === "" || payload.acres === undefined ? null : Number(payload.acres),
    payload,
    created_at: new Date().toISOString()
  };

  await supabaseFetch("app_events", {
    method: "POST",
    headers: { "Prefer": "return=minimal" },
    body: JSON.stringify(row)
  });
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.has(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const resource = cleanString(req.query.resource || "property-plans");

    if (resource === "property-plans") {
      if (req.method === "GET") {
        const plans = await listPropertyPlans(req.query || {});
        return json(res, 200, { ok: true, plans });
      }
      if (req.method === "POST") {
        const saved = await createPropertyPlan(req.body || {}, req.query || {});
        return json(res, 200, { ok: true, saved });
      }
      if (req.method === "DELETE") {
        await deletePropertyPlan(req.query || {});
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "app-events" || resource === "events") {
      if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST for app events." });
      await createAppEvent(req.body || {});
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { ok: false, error: "Unknown LEVEL 3 resource." });
  } catch (error) {
    console.error("LEVEL 3 API error:", error);
    return json(res, 200, { ok: false, error: error.message || "LEVEL 3 API error" });
  }
}
