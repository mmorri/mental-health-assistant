const { getSuggestion } = require('../api/utils/suggestion');

describe('getSuggestion', () => {
  it('throws error for empty input', async () => {
    await expect(getSuggestion('')).rejects.toThrow('Patient challenge must be a non-empty string.');
  });
  it('throws error if API key is missing', async () => {
    const oldEnv = process.env.XAI_API_KEY;
    delete process.env.XAI_API_KEY;
    await expect(getSuggestion('a long enough test challenge')).rejects.toThrow('Missing XAI_API_KEY in environment');
    process.env.XAI_API_KEY = oldEnv;
  });
});
