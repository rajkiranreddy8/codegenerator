import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [description, setDescription] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');
  const [language, setLanguage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratedCode('');
    setError('');
    setLoading(true);

    if (!description || !timeComplexity || !language) {
      setError('All fields are required!');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://e83b-34-16-203-238.ngrok-free.app/generate-code', {
        description,
        time_complexity: timeComplexity,
        language,
      });
      setGeneratedCode(response.data.generated_code);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while generating code.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Optimized Code Generator</h1>
        <p className="subtitle">Generate high-quality, efficient code in your favorite programming language.</p>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter code description (e.g., Implement a binary search algorithm)"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Time Complexity</label>
            <input
              type="text"
              value={timeComplexity}
              onChange={(e) => setTimeComplexity(e.target.value)}
              placeholder="e.g., O(n), O(log n)"
              required
            />
          </div>

          <div className="form-group">
            <label>Programming Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g., Python, JavaScript, Java"
              required
            />
          </div>

          <button type="submit" className="generate-button" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Code'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {generatedCode && (
          <div className="output-container">
            <h2>Generated Code</h2>
            <textarea
              value={generatedCode}
              readOnly
              rows="10"
              className="output-textarea"
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
