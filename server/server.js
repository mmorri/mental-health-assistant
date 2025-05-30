const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/suggestion', async (req, res) => {
  const { challenge } = req.body;
  try {
    const { getSuggestion } = require('../utils/suggestion');
    const suggestion = await getSuggestion(challenge);
    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
