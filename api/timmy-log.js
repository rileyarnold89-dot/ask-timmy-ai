import { supabaseAdmin } from "../lib/supabase.js";
import { getShopifyCustomerContext } from "../lib/shopify-proxy-auth.js";

function setCors(res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.DOMAIN_ALLOWED_ORIGIN || "https://domainoutdoor.com"
  );
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

function stripHtml(html = "") {
  return String(html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];

  return products
    .map(product => {
      if (typeof product === "string") return product;

      if (product && typeof product === "object") {
        return product.name || product.title || product.productName || null;
      }

      return null;
    })
    .filter(Boolean);
}

function normalizeProductLinks(productLinks, products) {
  const links = [];

  if (Array.isArray(productLinks)) {
    productLinks.forEach(item => {
      if (!item) return;

      if (typeof item === "string") {
        links.push({ name: item, url: item });
        return;
      }

      if (typeof item === "object" && item.url) {
        links.push({
          name: item.name || item.title || item.productName || item.url,
          url: item.url
        });
      }
    });
  }

  if (Array.isArray(products)) {
    products.forEach(product => {
      if (product && typeof product === "object" && product.url) {
        links.push({
          name: product.name || product.title || product.productName || product.url,
          url: product.url
        });
      }
    });
  }

  return links;
}

function normalizeBlogIdeas(body) {
  const blogIdeas = Array.isArray(body.blog_ideas)
    ? body.blog_ideas
    : Array.isArray(body.blogIdeas)
      ? body.blogIdeas
      : Array.isArray(body.blogs)
        ? body.blogs
        : [];

  return blogIdeas
    .map(item => {
      if (!item) return null;

      if (typeof item === "string") {
        return {
          title: item,
          angle: ""
        };
      }

      return {
        title: item.title || "",
        angle: item.angle || item.description || "",
        url: item.url || ""
      };
    })
    .filter(item => item && item.title);
}

function buildAnswerTitle(body, products) {
  const providedTitle = cleanText(
    body.answer_title ||
      body.answerTitle ||
      body.plan_name ||
      body.planName
  );

  if (providedTitle) return providedTitle;

  if (products.length) {
    return `Timmy Answer: ${products.slice(0, 2).join(" + ")}`;
  }

  const question = cleanText(body.question);

  if (question) {
    const shortQuestion =
      question.length > 58
        ? `${question.slice(0, 58).trim()}...`
        : question;

    return `Timmy Answer: ${shortQuestion}`;
  }

  return "Timmy Answer";
}

function buildTimmyLog(customerId, body) {
  const products = normalizeProducts(body.products);
  const productLinks = normalizeProductLinks(body.product_links || body.productLinks, body.products);
  const blogIdeas = normalizeBlogIdeas(body);

  const answer = cleanText(body.answer);
  const answerText = stripHtml(answer || "");

  return {
    shopify_customer_id: customerId,
    property_id: cleanText(body.property_id || body.propertyId),
    property_name: cleanText(body.property_name || body.propertyName),
    plot_name: cleanText(body.plot_name || body.plotName),
    answer_title: buildAnswerTitle(body, products),
    notes: cleanText(body.notes),
    question: cleanText(body.question) || "Unknown question",
    answer,
    intent: cleanText(body.intent),
    question_type: cleanText(body.question_type || body.questionType),
    products,
    acres: cleanNumber(body.acres),
    region: cleanText(body.region),
    blog_ideas: blogIdeas,
    full_log: {
      ...body,
      products,
      product_links: productLinks,
      blog_ideas: blogIdeas,
      answer_text: answerText,
      saved_from: body.saved_from || body.savedFrom || "ask-timmy",
      saved_at: new Date().toISOString()
    }
  };
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
    const customer = getShopifyCustomerContext(req);

    if (!customer.ok) {
      return res.status(401).json({
        ok: false,
        error: "Customer login required.",
        details: customer.reason
      });
    }

    const body = getBody(req);
    const log = buildTimmyLog(customer.customerId, body);

    if (!log.question && !log.answer) {
      return res.status(400).json({
        ok: false,
        error: "Missing Timmy question or answer."
      });
    }

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
      message: "Timmy answer saved.",
      log: data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Unable to save Timmy answer."
    });
  }
}