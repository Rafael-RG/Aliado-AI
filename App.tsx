
import React, { useState, useEffect } from 'react';
import { ICONS } from './constants';
import BotTrainer from './components/BotTrainer';
import BotTester from './components/BotTester';
import ConnectGuide from './components/ConnectGuide';
import WebWidgetConfigurator from './components/WebWidgetConfigurator';
import BotStats from './components/BotStats';
import Auth from './components/Auth';
import SubscriptionGate from './components/SubscriptionGate';
import { BotConfig, User } from './types';
import { dataService } from './services/dataService';

// Modal de Confirmación Interno
const ConfirmDeleteModal: React.FC<{ 
  botName: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  isLast: boolean;
}> = ({ botName, onConfirm, onCancel, isLast }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCancel}></div>
    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 lg:p-10 animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
        <ICONS.Trash className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 text-center mb-2 tracking-tight">¿Eliminar negocio?</h3>
      <p className="text-sm text-slate-500 text-center mb-8 font-medium leading-relaxed">
        Estás a punto de borrar <span className="text-slate-900 font-bold">"{botName}"</span>. 
        {isLast ? " Al ser tu último negocio, volverás a la pantalla de configuración inicial." : " Esta acción no se puede deshacer y perderás toda la configuración."}
      </p>
      <div className="flex flex-col gap-3">
        <button 
          onClick={onConfirm}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-red-100 transition-all active:scale-95"
        >
          Sí, eliminar definitivamente
        </button>
        <button 
          onClick={onCancel}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'train' | 'test' | 'deploy' | 'web-deploy' | 'billing' | 'stats'>('dashboard');
  const [botToDelete, setBotToDelete] = useState<BotConfig | null>(null);
  
  const [bots, setBots] = useState<BotConfig[]>([
    {
      id: 'b1-ventas-premium',
      name: "Mi Aliado de Ventas",
      businessType: "Comercio",
      role: "Vendedor y Atención",
      tone: 'friendly',
      knowledgeBase: "Horarios: Lunes a Sábado 9:00 - 19:00. Hacemos envíos a todo el país.",
      assets: [],
      status: 'active',
      webConfig: {
        primaryColor: '#10b981',
        position: 'right',
        welcomeMessage: '¡Hola! Soy tu Aliado. ¿En qué puedo ayudarte hoy?',
        launcherIcon: 'bubble'
      }
    }
  ]);
  const [activeBotId, setActiveBotId] = useState<string | null>('b1-ventas-premium');
  const [demoDataLoaded, setDemoDataLoaded] = useState(false);

  useEffect(() => {
    if (user && !user.isSubscribed) {
      setActiveTab('billing');
    }
  }, [user?.isSubscribed]);

  // Cargar datos demo desde Azure Storage
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        const demoData = await dataService.getCompleteDemoData();
        
        if (demoData.bot && demoData.business) {
          // Update the default bot with demo data from Azure Storage
          setBots(prev => prev.map(bot => 
            bot.id === 'b1-ventas-premium' ? {
              ...bot,
              name: demoData.business.name,
              businessType: demoData.bot.businessType,
              role: demoData.bot.role,
              tone: demoData.bot.tone,
              knowledgeBase: demoData.bot.knowledgeBase,
              webConfig: {
                ...bot.webConfig,
                welcomeMessage: demoData.bot.webConfig?.welcomeMessage || bot.webConfig?.welcomeMessage || '¡Hola! ¿Cómo puedo ayudarte?',
                primaryColor: demoData.bot.webConfig?.primaryColor || bot.webConfig?.primaryColor || '#10b981'
              }
            } : bot
          ));
          setDemoDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading demo data:', error);
        setDemoDataLoaded(true); // Mark as loaded even on error
      }
    };

    loadDemoData();
  }, []);

  const activeBot = bots.find(b => b.id === activeBotId) || bots[0] || null;

  const updateActiveBot = (updated: BotConfig) => {
    setBots(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const toggleBotStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBots(prev => prev.map(b => 
      b.id === id ? { ...b, status: b.status === 'active' ? 'paused' : 'active' } : b
    ));
  };

  const confirmDelete = () => {
    if (!botToDelete) return;
    const remainingBots = bots.filter(b => b.id !== botToDelete.id);
    setBots(remainingBots);
    
    if (remainingBots.length > 0) {
      if (activeBotId === botToDelete.id) {
        setActiveBotId(remainingBots[0].id);
      }
    } else {
      setActiveBotId(null);
      setActiveTab('dashboard');
    }
    
    setBotToDelete(null);
  };

  const createNewBot = () => {
    if (!user?.isSubscribed) return;
    const newId = `bot-${Math.random().toString(36).substr(2, 9)}`;
    const newBot: BotConfig = {
      id: newId,
      name: "Nuevo Aliado",
      businessType: "Servicios",
      role: "Atención al Cliente",
      tone: 'friendly',
      knowledgeBase: "Escribe aquí qué debe saber tu nuevo Aliado...",
      assets: [],
      status: 'active',
      webConfig: {
        primaryColor: '#10b981',
        position: 'right',
        welcomeMessage: '¡Hola! ¿Cómo podemos ayudarte?',
        launcherIcon: 'bubble'
      }
    };
    setBots([...bots, newBot]);
    setActiveBotId(newId);
    setActiveTab('train');
  };

  if (!user) return <Auth onLogin={setUser} />;

  const isSubscribed = user.isSubscribed;
  const isBotSection = ['train', 'test', 'deploy', 'web-deploy', 'stats'].includes(activeTab);

  const handleTabChange = (tab: typeof activeTab) => {
    if (!isSubscribed && tab !== 'billing') return;
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'dashboard', icon: <ICONS.Globe className="w-5 h-5" />, label: 'Negocios' },
    { id: 'stats', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, label: 'Métricas' },
    { id: 'train', icon: <ICONS.Bot className="w-5 h-5" />, label: 'Entrenar' },
    { id: 'test', icon: <ICONS.Zap className="w-5 h-5" />, label: 'Probar' },
    { id: 'deploy', icon: <ICONS.Shield className="w-5 h-5" />, label: 'WhatsApp' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Modal de Confirmación */}
      {botToDelete && (
        <ConfirmDeleteModal 
          botName={botToDelete.name}
          onConfirm={confirmDelete}
          onCancel={() => setBotToDelete(null)}
          isLast={bots.length === 1}
        />
      )}

      {/* Sidebar Aliado - Desktop Only */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-100">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Aliado IA</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Panel de Control</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          {navItems.map(item => (
            <button 
              key={item.id}
              disabled={!isSubscribed || (bots.length === 0 && item.id !== 'dashboard')}
              onClick={() => handleTabChange(item.id as any)} 
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === item.id ? 'sidebar-active shadow-sm' : isSubscribed ? 'sidebar-item' : 'opacity-30 cursor-not-allowed'}`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-6 pb-2 px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Web</span>
          </div>
          <button 
            disabled={!isSubscribed || bots.length === 0}
            onClick={() => handleTabChange('web-deploy')} 
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'web-deploy' ? 'sidebar-active shadow-sm' : isSubscribed ? 'sidebar-item' : 'opacity-30 cursor-not-allowed'}`}
          >
            <ICONS.Code className="w-5 h-5" /> 
            <span className="font-medium">Bot en mi Web</span>
          </button>
          <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'billing' ? 'bg-blue-50 text-blue-700 font-semibold' : 'sidebar-item'}`}>
            <ICONS.Wallet className="w-5 h-5" /> 
            <span className="font-medium">Suscripción</span>
          </button>
        </nav>

        <div className="p-6">
          <button onClick={() => setUser(null)} className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Bottom Nav - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center p-2 z-50 pb-safe">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => isSubscribed && handleTabChange(item.id as any)}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === item.id ? 'text-[#10b981]' : isSubscribed ? 'text-slate-400' : 'opacity-20'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Aliado IA</span>
        </div>
        <button onClick={() => setActiveTab('billing')} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <ICONS.Wallet className="w-4 h-4" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-10 pb-24 lg:pb-10 overflow-y-auto w-full">
        {!isSubscribed ? (
          <SubscriptionGate onSuccess={() => setUser({...user, isSubscribed: true, plan: 'pro'})} />
        ) : (
          <div className="max-w-5xl mx-auto">
            {isBotSection && (activeTab !== 'dashboard') && activeBot && (
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${activeBot.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <ICONS.Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-slate-900 leading-tight">{activeBot.name}</h2>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{activeBot.businessType}</span>
                      <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${activeBot.status === 'active' ? 'text-green-500' : 'text-slate-300'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${activeBot.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        {activeBot.status === 'active' ? 'Online' : 'Pausa'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <select 
                    value={activeBotId || ''} 
                    onChange={(e) => setActiveBotId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
                  >
                    {bots.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 lg:mb-10 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Mis Negocios</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Gestiona múltiples canales desde un solo lugar.</p>
                  </div>
                  <button onClick={createNewBot} className="w-full sm:w-auto bg-[#10b981] text-white px-6 py-4 lg:py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-100 active:scale-95 transition-all">
                    Nuevo Aliado
                  </button>
                </div>

                {bots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {bots.map(bot => (
                      <div key={bot.id} onClick={() => { setActiveBotId(bot.id); setActiveTab('stats'); }} className="card p-5 lg:p-6 cursor-pointer relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
                            <ICONS.Bot className="w-6 h-6" />
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={(e) => toggleBotStatus(bot.id, e)} className={`w-10 h-5 rounded-full relative transition-all duration-300 flex items-center px-0.5 ${bot.status === 'active' ? 'bg-green-500' : 'bg-slate-200'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${bot.status === 'active' ? 'translate-x-5' : 'translate-x-0 shadow-sm'}`}></div>
                            </button>
                            
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setBotToDelete(bot); }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <ICONS.Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{bot.name}</h3>
                        <p className="text-[10px] text-slate-400 mb-6 font-bold uppercase tracking-widest">{bot.businessType}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                           <span className="text-[10px] font-bold text-green-600 uppercase">Configurar</span>
                           <div className={`w-1.5 h-1.5 rounded-full ${bot.status === 'active' ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <ICONS.Bot className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No tienes negocios activos</h3>
                    <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto font-medium">Crea tu primer Aliado IA para empezar a automatizar tus ventas por WhatsApp.</p>
                    <button onClick={createNewBot} className="bg-[#10b981] text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-green-100 hover:bg-green-600 transition-all">
                      Crear mi Primer Aliado
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && activeBot && <BotStats bot={activeBot} />}
            {activeTab === 'train' && activeBot && <BotTrainer config={activeBot} setConfig={updateActiveBot} />}
            {activeTab === 'test' && activeBot && <BotTester config={activeBot} />}
            {activeTab === 'deploy' && activeBot && <ConnectGuide bot={activeBot} />}
            {activeTab === 'web-deploy' && activeBot && <WebWidgetConfigurator config={activeBot} setConfig={updateActiveBot} />}
            {activeTab === 'billing' && <SubscriptionGate onSuccess={() => setUser({...user, isSubscribed: true, plan: 'pro'})} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
