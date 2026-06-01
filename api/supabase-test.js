import { supabaseAdmin } from "../lib/supabase.js";

export default async function handler(req, res) {
  const allowedOrigin = process.env.DOMAIN_ALLOWED_ORIGIN || "https://domainoutdoor.com";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("customer_profiles")
      .select("id")
      .limit(1);

    if (error) {
      return res.status(500).json({
        ok: false,
        message: "Supabase connected, but the query failed.",
        error: error.message
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Supabase connection is working.",
      data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Supabase connection failed.",
      error: error.message
    });
  }
}