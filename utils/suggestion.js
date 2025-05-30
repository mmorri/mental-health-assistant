const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getSuggestion(challenge) {
  if (!challenge || typeof challenge !== 'string' || challenge.length < 5) {
    throw new Error('Patient challenge must be a non-empty string.');
  }
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('Missing XAI_API_KEY in environment');

  const response = await fetch('https://api.x.ai/v1/grok', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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
  return data.choices?.[0]?.text?.trim() || 'Try discussing coping strategies with the patient.';
}

module.exports = { getSuggestion };
