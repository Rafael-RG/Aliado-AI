
import React, { useState, useRef, useEffect } from 'react';
import { BotConfig, ChatMessage } from '../types';
import { chatWithTrainedBot } from '../services/botService';

interface Props {
  config: BotConfig;
}

const BotTester: React.FC<Props> = ({ config }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ data: string; mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingImage({
          data: reader.result as string,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingImage) || isTyping) return;
    
    const userMsg: ChatMessage = { 
      role: 'user', 
      content: input, 
      timestamp: new Date(),
      media: pendingImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = pendingImage;
    
    setInput('');
    setPendingImage(null);
    setIsTyping(true);

    const reply = await chatWithTrainedBot(currentInput, config, currentImage || undefined);
    
    setIsTyping(false);
    const aiMsg: ChatMessage = { role: 'ai', content: reply, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-[70vh] lg:h-[600px] w-full max-w-md mx-auto bg-[#e5ddd5] rounded-3xl overflow-hidden shadow-2xl border-4 lg:border-8 border-slate-900 relative">
      <div className="bg-[#075e54] p-3 lg:p-4 flex items-center gap-3 text-white">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold uppercase overflow-hidden text-xs">
          {config.name.substring(0,2)}
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-sm font-bold truncate">{config.name || 'Bot Preview'}</h3>
          <span className="text-[9px] opacity-80 block uppercase tracking-tighter">en línea</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 pattern-bg">
        {messages.length === 0 && (
          <div className="flex justify-center my-10">
            <span className="bg-white/40 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase">Hoy</span>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in zoom-in-95 duration-200`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm shadow-sm relative ${
              msg.role === 'user' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'
            }`}>
              {msg.media && (
                <img src={msg.media.data} alt="Adjunto" className="rounded-lg mb-2 max-w-full h-auto border border-slate-200/50" />
              )}
              <p className="leading-tight text-slate-800 text-sm lg:text-base">{msg.content}</p>
              <div className="text-[9px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1 font-bold">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.role === 'user' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2.5"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-3 py-2 rounded-lg rounded-tl-none shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {pendingImage && (
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-3 animate-in slide-in-from-bottom-2">
           <div className="relative">
              <img src={pendingImage.data} className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg object-cover border border-slate-200" />
              <button onClick={() => setPendingImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md">
                 <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
           </div>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Imagen lista</span>
        </div>
      )}

      <div className="p-3 bg-[#f0f0f0] flex items-center gap-2">
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="text-slate-500 p-2 hover:bg-slate-200 rounded-full transition-colors active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center shadow-sm">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Mensaje..." 
            className="w-full text-sm outline-none bg-transparent" 
          />
        </div>
        <button onClick={handleSend} className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center text-white shadow-md active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>
    </div>
  );
};

export default BotTester;
