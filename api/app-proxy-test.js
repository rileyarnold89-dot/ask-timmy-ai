import { getOptionalShopifyCustomerContext } from "../lib/shopify-proxy-auth.js";

export default async function handler(req, res) {
  const customer = getOptionalShopifyCustomerContext(req);

  if (!customer.ok) {
    return res.status(401).json({
      ok: false,
      message: "App proxy is not connected or signature is invalid.",
      details: customer.reason
    });
  }

  return res.status(200).json({
    ok: true,
    message: "Shopify app proxy is working.",
    logged_in_customer_id: customer.customerId,
    email: customer.email
  });
}