ASK TIMMY AI - VERCEL BACKEND

Folder structure:
ask-timmy-ai
  api
    ask-timmy.js
  package.json

After uploading/deploying to Vercel:
1. Add Environment Variable:
   OPENAI_API_KEY = your OpenAI API key
2. Redeploy the project.
3. Your Shopify backend URL will be:
   https://YOUR-PROJECT.vercel.app/api

Shopify snippet should use:
const TIMMY_BACKEND_URL = "https://YOUR-PROJECT.vercel.app/api";
