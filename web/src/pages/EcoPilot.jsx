// src/pages/EcoPilot.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EcoPilot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Eco-Pilot AI Assistant. How can I help you make more sustainable choices today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // For demonstration, we'll hit the /api/analyze endpoint with a specific prompt format
      // In a real app, you would have a dedicated /api/chat endpoint.
      const response = await axios.post('/api/analyze', {
        title: "User Query",
        fullText: input,
        category: "general",
        material: "unknown"
      });

      const aiMessage = { 
        role: 'assistant', 
        content: `Based on your query, I recommend focusing on ${response.data.alternative}. ${response.data.alt_reason} ${response.data.impact_reason}` 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = { role: 'assistant', content: "I'm sorry, I encountered an error. Please make sure the backend is running and the GROQ API key is set." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto flex flex-col h-[80vh]">
      <div className="glass-card mb-4 p-6 bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-4xl mr-4">🤖</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Eco-Pilot AI Assistant</h1>
            <p className="text-sm text-emerald-400">Powered by Groq Llama-3.3</p>
          </div>
        </div>
        <div className="bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">ONLINE</div>
      </div>

      <div className="flex-1 glass-card p-6 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none shadow-lg' 
                : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-4 rounded-2xl rounded-bl-none border border-white/5 animate-pulse text-gray-400">
               Eco-Pilot is thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="glass-card p-4 flex gap-4 border border-white/10">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about sustainability..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="btn btn-primary px-8 rounded-xl font-bold disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default EcoPilot;
