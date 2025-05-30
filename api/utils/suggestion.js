const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getSuggestion(challenge) {
  if (!challenge || typeof challenge !== 'string' || challenge.length < 5) {
    throw new Error('Patient challenge must be a non-empty string.');
  }
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('Missing XAI_API_KEY in environment');

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-3-latest',
        messages: [
          {
            role: 'user',
            content: `You are an experienced mental health counselor. Based on the following patient challenge, generate a concise, empathetic, and actionable suggestion to help the counselor address it. Use a professional tone and draw inspiration from responses like: "It sounds overwhelming. Have you tried mindfulness techniques?" or "Let’s explore what triggers these feelings." Patient challenge: ${challenge}`
          }
        ],
        stream: false,
        temperature: 0.7
      }),
    });
    const data = await response.json();
    console.log('Grok API response:', JSON.stringify(data));
    if (!response.ok) {
      // Grok API error details
      const errorMsg = data?.error?.message || `API request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }
    const suggestion = data.choices?.[0]?.message?.content?.trim();
    if (!suggestion) {
      throw new Error('Grok API did not return a suggestion. Full response: ' + JSON.stringify(data));
    }
    return suggestion;
  } catch (err) {
    console.error('Grok API error:', err);
    throw err;
  }
}

module.exports = { getSuggestion };
