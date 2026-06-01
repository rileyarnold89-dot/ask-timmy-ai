export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  return res.status(200).send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Domain Property Planner</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            background: #eef0f2;
            color: #111827;
            padding: 40px 18px;
          }
          .card {
            max-width: 720px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #d7dce3;
            border-radius: 24px;
            padding: 28px;
            box-shadow: 0 10px 30px rgba(0,0,0,.06);
          }
          h1 {
            margin: 0 0 10px;
            font-size: 34px;
            line-height: 1;
          }
          p {
            color: #4b5563;
            line-height: 1.55;
          }
          .status {
            display: inline-block;
            background: #e9f2eb;
            color: #234b2d;
            border-radius: 999px;
            padding: 8px 12px;
            font-weight: 800;
            font-size: 13px;
            margin-bottom: 16px;
          }
          a {
            display: inline-block;
            margin-top: 12px;
            background: #234b2d;
            color: #fff;
            padding: 12px 16px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 800;
          }
          code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="status">App is running</div>
          <h1>Domain Property Planner</h1>
          <p>This Vercel app is connected and ready to support the Domain Outdoor Property Planner save system.</p>
          <p>The Shopify app proxy should point to:</p>
          <p><code>https://project-882kb.vercel.app/api</code></p>
          <a href="/api/app-proxy-test">Test Vercel Endpoint</a>
        </div>
      </body>
    </html>
  `);
}