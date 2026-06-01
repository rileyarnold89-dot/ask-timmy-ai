import { supabaseAdmin } from "../lib/supabase.js";
import { getOptionalShopifyCustomerContext } from "../lib/shopify-proxy-auth.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.DOMAIN_ALLOWED_ORIGIN || "https://domainoutdoor.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
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

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const body = getBody(req);
    const customer = getOptionalShopifyCustomerContext(req);

    const log = {
      shopify_customer_id: customer.customerId || cleanText(body.shopify_customer_id),
      property_id: cleanText(body.property_id),
      question: cleanText(body.question) || "Unknown question",
      answer: cleanText(body.answer),
      intent: cleanText(body.intent),
      question_type: cleanText(body.question_type || body.questionType),
      products: Array.isArray(body.products) ? body.products : [],
      acres: cleanNumber(body.acres),
      region: cleanText(body.region),
      blog_ideas: Array.isArray(body.blog_ideas) ? body.blog_ideas : Array.isArray(body.blogIdeas) ? body.blogIdeas : [],
      full_log: body
    };

    const { data, error } = await supabaseAdmin
      .from("saved_timmy_answers")
      .insert(log)
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
      log: data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}