
import React, { useState } from 'react';
import { BotConfig, WebWidgetConfig, ChatMessage } from '../types';
import { chatWithTrainedBot } from '../services/botService';
import { ICONS } from '../constants';

interface Props {
  config: BotConfig;
  setConfig: (config: BotConfig) => void;
}

const WebWidgetConfigurator: React.FC<Props> = ({ config, setConfig }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const webConfig = config.webConfig || {
    primaryColor: '#10b981',
    position: 'right',
    welcomeMessage: '¡Hola! ¿En qué puedo asistirte hoy?',
    launcherIcon: 'bubble'
  };

  const updateWebConfig = (updates: Partial<WebWidgetConfig>) => {
    setConfig({
      ...config,
      webConfig: { ...webConfig, ...updates }
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const reply = await chatWithTrainedBot(input, config);
    const aiMsg: ChatMessage = { role: 'ai', content: reply, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const directLink = `https://chat.aliadoia.com/${config.id}`;

  const snippetCode = `<!-- Chat Automático Aliado IA: ${config.name} -->
<script src="https://cdn.aliadoia.com/v1/widget.js"></script>
<script>
  Aliado.init({
    businessId: "${config.id}",
    themeColor: "${webConfig.primaryColor}",
    position: "${webConfig.position}",
    greeting: "${webConfig.welcomeMessage.replace(/"/g, '&quot;')}"
  });
</script>`;

  const copyDirectLink = () => {
    navigator.clipboard.writeText(directLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Configuration Panel */}
      <div className="space-y-6">
        <div className="card p-6 lg:p-8 bg-white">
          <div className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">Personaliza el Canal Web</h2>
            <p className="text-sm text-slate-500 font-medium">Este widget es exclusivo para el negocio: <span className="text-[#10b981]">{config.name}</span></p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Color de Marca</label>
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="color" 
                    value={webConfig.primaryColor}
                    onChange={(e) => updateWebConfig({ primaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-slate-600 uppercase">{webConfig.primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Posición del Botón</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => updateWebConfig({ position: 'left' })}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${webConfig.position === 'left' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                  >
                    Izq
                  </button>
                  <button 
                    onClick={() => updateWebConfig({ position: 'right' })}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${webConfig.position === 'right' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                  >
                    Der
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Mensaje de Bienvenida</label>
              <textarea 
                value={webConfig.welcomeMessage}
                onChange={(e) => updateWebConfig({ welcomeMessage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-green-500/10 outline-none resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Link Directo Section */}
        <div className="card p-6 lg:p-8 bg-blue-50 border-blue-100 border-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <ICONS.Globe className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-tight">Link de Chat Compartible</h3>
          </div>
          <p className="text-xs text-blue-700/70 mb-4 leading-relaxed font-medium">Ideal para tu Bio de Instagram o botones en redes sociales. Abre un chat a pantalla completa.</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-white border border-blue-200 rounded-xl px-4 py-3 text-xs font-mono text-blue-800 truncate">
              {directLink}
            </div>
            <button 
              onClick={copyDirectLink}
              className="bg-blue-600 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all active:scale-95"
            >
              {copiedLink ? '¡Listo!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Script Section */}
        <div className="card p-6 lg:p-8 bg-slate-900 border-none shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em]">Snippet para tu Sitio Web</h3>
            <button 
              onClick={() => navigator.clipboard.writeText(snippetCode)}
              className="text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase border border-white/10 px-3 py-1.5 rounded-lg"
            >
              Copiar Código
            </button>
          </div>
          <pre className="text-[11px] font-mono text-green-100/60 leading-relaxed overflow-x-auto p-4 bg-black/30 rounded-xl border border-white/5">
            {snippetCode}
          </pre>
          <p className="text-[10px] text-white/30 mt-4 italic font-medium">
            * Cada negocio requiere su propio businessId para direccionar el chat correctamente.
          </p>
        </div>
      </div>

      {/* Live Preview - Only visible on LG screens */}
      <div className="hidden lg:block relative h-[650px] bg-slate-200 rounded-[40px] border-8 border-white shadow-inner overflow-hidden group">
        <div className="absolute inset-0 bg-white p-8">
           <div className="w-1/3 h-6 bg-slate-100 rounded-lg mb-6"></div>
           <div className="w-full h-40 bg-slate-50 rounded-[24px] mb-8"></div>
           <div className="grid grid-cols-3 gap-4">
             <div className="h-20 bg-slate-100 rounded-xl"></div>
             <div className="h-20 bg-slate-100 rounded-xl"></div>
             <div className="h-20 bg-slate-100 rounded-xl"></div>
           </div>
           
           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="bg-white/90 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-xl border border-slate-100">Vista Previa del Sitio Web</span>
           </div>
        </div>

        {/* Floating Widget Preview */}
        <div 
          className={`absolute bottom-6 transition-all duration-500 z-50 ${webConfig.position === 'right' ? 'right-6' : 'left-6'}`}
        >
          {isPreviewOpen ? (
            <div className="w-80 h-[480px] bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 border border-slate-100">
              <div className="p-5 flex items-center justify-between text-white" style={{ backgroundColor: webConfig.primaryColor }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 21a9 9 0 1 0-9-9c0 1.48.4 2.87 1.1 4.07L3 21l4.93-1.1c1.2.7 2.59 1.1 4.07 1.1z"/></svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-black truncate uppercase tracking-widest block">{config.name}</span>
                    <span className="text-[8px] opacity-70 uppercase font-bold tracking-tighter">Soporte Virtual</span>
                  </div>
                </div>
                <button onClick={() => setIsPreviewOpen(false)} className="hover:bg-black/10 p-1.5 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="flex-1 bg-slate-50 p-5 overflow-y-auto space-y-4">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[90%]">
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">{webConfig.welcomeMessage}</p>
                </div>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs shadow-sm font-semibold leading-relaxed ${msg.role === 'user' ? 'text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}
                      style={msg.role === 'user' ? { backgroundColor: webConfig.primaryColor } : {}}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none border border-transparent focus:border-slate-200 transition-all"
                  placeholder="Escribre algo..."
                />
                <button 
                  onClick={handleSend}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-all shadow-md"
                  style={{ backgroundColor: webConfig.primaryColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center text-white transform hover:scale-110 active:scale-95 transition-all"
              style={{ backgroundColor: webConfig.primaryColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Preview Information */}
      <div className="lg:hidden p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
          <ICONS.Zap className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-tight mb-1">Dato de Aliado</p>
          <p className="text-[11px] text-amber-800/70 font-medium leading-relaxed">Para ver la vista previa del chat web en tiempo real, te recomendamos usar una tablet o computadora.</p>
        </div>
      </div>
    </div>
  );
};

export default WebWidgetConfigurator;
