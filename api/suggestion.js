// api/suggestion.js
// Vercel serverless function to call xAI Grok API

const { getSuggestion } = require('./utils/suggestion');

module.exports = async (req, res) => {
  const { challenge } = req.body;
  try {
    const suggestion = await getSuggestion(challenge);
    res.status(200).json({ suggestion });
  } catch (err) {
    console.error('API Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate suggestion' });
  }
};
