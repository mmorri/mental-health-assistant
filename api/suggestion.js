// api/suggestion.js
// Vercel serverless function to call xAI Grok API

module.exports = async (req, res) => {
  const { challenge } = req.body;

  if (!challenge) {
    return res.status(400).json({ error: 'Patient challenge is required' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/grok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-3',
        prompt: `You are an experienced mental health counselor. Based on the following patient challenge, generate a concise, empathetic, and actionable suggestion to help the counselor address it. Use a professional tone and draw inspiration from responses like: "It sounds overwhelming. Have you tried mindfulness techniques?" or "Let’s explore what triggers these feelings." Patient challenge: ${challenge}`,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const suggestion = data.choices[0]?.text?.trim() || 'Try discussing coping strategies with the patient.';
    res.status(200).json({ suggestion });
  } catch (err) {
    console.error('API Error:', err.message);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
};
