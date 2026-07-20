// api/chat.js
// Serverless function (Vercel) — jadi perantara antara frontend dan OpenRouter.
// API key disimpan di Environment Variable server, TIDAK pernah dikirim ke browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server belum diconfig: OPENROUTER_API_KEY kosong.' });
  }

  const { messages, model } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Payload "messages" wajib diisi (array).' });
  }

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Ganti sesuai domain asli lo kalau sudah live
        'HTTP-Referer': process.env.SITE_URL || 'https://azazothx.vercel.app',
        'X-Title': 'AZAZOTHX AI',
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-4o',
        messages,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data.error?.message || 'Upstream error' });
    }

    const reply = data.choices?.[0]?.message?.content || '(kosong)';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghubungi OpenRouter: ' + err.message });
  }
}
