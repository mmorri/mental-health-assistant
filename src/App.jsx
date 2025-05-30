import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a description of the patient challenge.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Use relative path for API to support both local and Vercel deployments
      const response = await fetch('/api/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge: input }),
      });
      const data = await response.json();
      setSuggestion(data.suggestion || 'Try discussing coping strategies with the patient.');
    } catch (err) {
      setError('Error generating suggestion. Please try again.');
      setSuggestion('');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mental Health Counselor Assistant</h1>
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 mb-2" htmlFor="challenge-textarea">
          Describe the challenge you are facing with a patient:
        </label>
        <textarea
          id="challenge-textarea"
          aria-label="Describe the patient challenge"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Patient reports feeling anxious about work and struggles to cope."
          required
        />
        <button
          type="submit"
          aria-busy={loading}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              Generating...
            </span>
          ) : 'Get Suggestion'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {suggestion && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">Suggestion:</h2>
          <p className="text-gray-700">{suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default App;
