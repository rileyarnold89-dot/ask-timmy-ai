import crypto from "crypto";

function safeCompare(left, right) {
  if (!left || !right) return false;

  const leftBuffer = Buffer.from(String(left), "utf8");
  const rightBuffer = Buffer.from(String(right), "utf8");

  if (leftBuffer.length !== rightBuffer.length) return false;

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getQueryPairsFromRequest(req) {
  const rawUrl = req.url || "";
  const queryString = rawUrl.includes("?") ? rawUrl.split("?")[1] : "";
  const params = new URLSearchParams(queryString);

  const pairs = [];

  for (const [key, value] of params.entries()) {
    if (key === "signature" || key === "hmac") continue;
    pairs.push([key, value]);
  }

  return pairs.sort(([a], [b]) => a.localeCompare(b));
}

function calculateShopifyProxySignature(req, secret) {
  const pairs = getQueryPairsFromRequest(req);

  const message = pairs
    .map(([key, value]) => `${key}=${value}`)
    .join("");

  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}

function calculateShopifyHmac(req, secret) {
  const pairs = getQueryPairsFromRequest(req);

  const message = pairs
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}

export function verifyShopifyProxyRequest(req) {
  const secret = process.env.SHOPIFY_APP_PROXY_SECRET;

  if (!secret) {
    return {
      ok: false,
      reason: "SHOPIFY_APP_PROXY_SECRET is not set yet."
    };
  }

  const signature = req.query?.signature;
  const hmac = req.query?.hmac;

  if (signature) {
    const calculated = calculateShopifyProxySignature(req, secret);

    return {
      ok: safeCompare(calculated, signature),
      reason: safeCompare(calculated, signature)
        ? "Valid Shopify app proxy signature."
        : "Invalid Shopify app proxy signature."
    };
  }

  if (hmac) {
    const calculated = calculateShopifyHmac(req, secret);

    return {
      ok: safeCompare(calculated, hmac),
      reason: safeCompare(calculated, hmac)
        ? "Valid Shopify HMAC."
        : "Invalid Shopify HMAC."
    };
  }

  return {
    ok: false,
    reason: "Missing Shopify signature or HMAC."
  };
}

export function getShopifyCustomerContext(req) {
  const verification = verifyShopifyProxyRequest(req);

  if (!verification.ok) {
    return {
      ok: false,
      reason: verification.reason,
      customerId: null,
      email: null
    };
  }

  const customerId = req.query?.logged_in_customer_id || null;
  const email = req.query?.customer_email || null;

  if (!customerId) {
    return {
      ok: false,
      reason: "Customer is not logged in.",
      customerId: null,
      email: null
    };
  }

  return {
    ok: true,
    reason: "Logged-in Shopify customer verified.",
    customerId: String(customerId),
    email: email ? String(email) : null
  };
}

export function getOptionalShopifyCustomerContext(req) {
  const verification = verifyShopifyProxyRequest(req);

  if (!verification.ok) {
    return {
      ok: false,
      reason: verification.reason,
      customerId: null,
      email: null
    };
  }

  const customerId = req.query?.logged_in_customer_id || null;
  const email = req.query?.customer_email || null;

  return {
    ok: true,
    reason: customerId ? "Logged-in Shopify customer verified." : "Valid Shopify proxy request without logged-in customer.",
    customerId: customerId ? String(customerId) : null,
    email: email ? String(email) : null
  };
}