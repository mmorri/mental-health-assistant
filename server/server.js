const express = require('express');
const cors = require('cors');
const app = express();

// Restrict CORS to the configured app origin instead of allowing any site
// to POST patient-challenge text to this endpoint.
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '32kb' }));

// Minimal in-memory rate limiter (per-IP sliding window) so one client can't
// burn through the paid xAI/Grok quota. For multi-instance deploys use Redis.
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 20;
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const entry = hits.get(req.ip) || { count: 0, reset: now + RATE_WINDOW_MS };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + RATE_WINDOW_MS;
  }
  entry.count += 1;
  hits.set(req.ip, entry);
  if (entry.count > RATE_MAX) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  next();
}

// Optional shared-secret gate: set SUGGESTION_API_KEY to require callers to
// send it as an `x-api-key` header.
function requireApiKey(req, res, next) {
  const expected = process.env.SUGGESTION_API_KEY;
  if (!expected) return next();
  if (req.headers['x-api-key'] !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

const MAX_CHALLENGE_LENGTH = 2000;

app.post('/api/suggestion', rateLimit, requireApiKey, async (req, res) => {
  const { challenge } = req.body;
  if (typeof challenge !== 'string' || challenge.length > MAX_CHALLENGE_LENGTH) {
    return res.status(400).json({ error: 'Challenge must be a string of at most 2000 characters.' });
  }
  try {
    const { getSuggestion } = require('../api/utils/suggestion');
    const suggestion = await getSuggestion(challenge);
    res.json({ suggestion });
  } catch (err) {
    console.error('Suggestion error:', err.message);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
