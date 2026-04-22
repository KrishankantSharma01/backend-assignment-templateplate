import { useState } from 'react';
import api from '../utils/api.js';

export default function AiAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const res = await api.post('/ai/study-plan', { prompt });
      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to generate study plan');
      }
      setResponse(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error communicating with AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-3xl mt-12 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">AI Study Plan Assistant</h3>
            <p className="text-sm text-gray-400 mt-1">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., I want to study Computer Science in Canada. I have an IELTS score of 7.0 and a budget of $20,000/year. What are my options?"
            className="w-full bg-darker/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none min-h-[120px]"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute bottom-4 right-4 bg-primary hover:bg-emerald-400 text-darker font-semibold py-2 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Plan'}
          </button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {response && (
          <div className="bg-darker/40 border border-white/5 p-6 rounded-xl prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br/>') }} />
          </div>
        )}
      </div>
    </div>
  );
}
