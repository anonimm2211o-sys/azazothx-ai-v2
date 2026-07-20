# AZAZOTHX AI — Cara Deploy ke Vercel

## Struktur
```
azazothx/
├── api/chat.js      ← backend proxy (nyimpen API key aman)
├── public/index.html ← frontend (UI chat)
├── vercel.json
└── package.json
```

## Langkah deploy

1. **Regenerate API key OpenRouter dulu** (key yang lama udah pernah keliatan di luar, jangan dipake lagi).
   → https://openrouter.ai/keys

2. Push folder ini ke GitHub repo baru (atau upload manual via Vercel dashboard).

3. Di Vercel dashboard:
   - Import project dari repo tsb.
   - Masuk ke **Settings → Environment Variables**, tambahin:
     - `OPENROUTER_API_KEY` = (key baru lo, JANGAN taro di kode)
     - `SITE_URL` = URL vercel lo (misal `https://azazothx.vercel.app`)
   - Deploy.

4. Selesai — frontend (`public/index.html`) manggil `/api/chat`, backend yang pegang key dan nembak ke OpenRouter. Key gak pernah muncul di browser / View Source.

## Ganti model AI
Di `api/chat.js`, default model `openai/gpt-4o`. Bisa diganti ke model OpenRouter lain (Claude, Llama, Gemini, dll) — tinggal ganti string model di `askAI()` (frontend) atau default di backend.

## Kalau mau test lokal
```
npm i -g vercel
vercel dev
```
Butuh file `.env` lokal berisi `OPENROUTER_API_KEY=...` (jangan di-commit ke git — tambahin ke `.gitignore`).
