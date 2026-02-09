
import React, { useState, useRef, useEffect } from 'react';
import { getBotStrategy } from '../services/wealthService';
import { ChatMessage } from '../types';
import { ICONS } from '../constants';

const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: "Bienvenido al centro de estrategia de Aliado. ¿En qué podemos mejorar tu negocio hoy?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const advice = await getBotStrategy(input);
    const aiMsg: ChatMessage = { role: 'ai', content: advice.text, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="card flex flex-col h-[600px] overflow-hidden border-none shadow-xl">
      <div className="px-6 py-4 bg-[#10b981] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <ICONS.Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest">Tu Aliado Estratégico</h3>
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
               <span className="text-[9px] font-bold opacity-80 uppercase">Consultor Activo</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-[#10b981] text-white rounded-br-none shadow-md shadow-green-100' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <div className={`text-[8px] mt-2 font-bold uppercase opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 flex items-center gap-2">
               <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase">Aliado está pensando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Hazme una pregunta sobre tu negocio..."
          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-green-500/20"
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading} 
          className="bg-[#10b981] text-white p-4 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>
    </div>
  );
};

export default AIAdvisor;
