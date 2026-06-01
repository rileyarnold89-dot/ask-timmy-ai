import { supabaseAdmin } from "../lib/supabase.js";
import { getShopifyCustomerContext } from "../lib/shopify-proxy-auth.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.DOMAIN_ALLOWED_ORIGIN || "https://domainoutdoor.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
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
      const { data, error } = await supabaseAdmin
        .from("customer_profiles")
        .select("*")
        .eq("shopify_customer_id", customer.customerId)
        .maybeSingle();

      if (error) {
        return res.status(500).json({
          ok: false,
          error: error.message
        });
      }

      return res.status(200).json({
        ok: true,
        profile: data || null
      });
    }

    if (req.method === "POST") {
      const body = getBody(req);

      const profile = {
        shopify_customer_id: customer.customerId,
        email: cleanText(body.email || customer.email),
        first_name: cleanText(body.first_name),
        last_name: cleanText(body.last_name),
        default_state: cleanText(body.default_state),
        default_zip: cleanText(body.default_zip),
        primary_goal: cleanText(body.primary_goal),
        notes: cleanText(body.notes)
      };

      const { data, error } = await supabaseAdmin
        .from("customer_profiles")
        .upsert(profile, { onConflict: "shopify_customer_id" })
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
        profile: data
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