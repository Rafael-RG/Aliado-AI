
import React, { useState } from 'react';

interface Props {
  onSuccess: () => void;
}

const SubscriptionGate: React.FC<Props> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="card p-10 lg:p-14 text-center max-w-2xl mx-auto border-none shadow-xl animate-in fade-in zoom-in-95 duration-500 mt-6 bg-white">
      <div className="relative z-10">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Activa tu Negocio Automático</h2>
        <p className="text-slate-500 mb-10 leading-relaxed max-w-sm mx-auto font-medium">
          Elige el nivel de crecimiento que quieres para tu empresa hoy mismo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors cursor-pointer">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Emprendedor</span>
            <div className="text-3xl font-bold text-slate-900 mt-2">$29 <span className="text-sm font-normal text-slate-400">/mes</span></div>
            <ul className="mt-6 space-y-3 text-[11px] text-slate-600 font-semibold uppercase tracking-tight">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Hasta 5 Bots</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> WhatsApp y Web</li>
            </ul>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border-2 border-green-500 relative shadow-lg cursor-pointer">
            <div className="absolute top-3 right-3 bg-green-500 text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">El más elegido</div>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Plan Profesional</span>
            <div className="text-3xl font-bold text-slate-900 mt-2">$290 <span className="text-sm font-normal text-slate-400">/año</span></div>
            <p className="text-[10px] text-green-600 font-bold mt-2 uppercase">Ahorra 2 meses de suscripción</p>
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={loading}
          className="w-full btn-primary py-5 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>Quiero empezar ahora <span className="text-sm opacity-60 font-medium">con Mercado Pago</span></>
          )}
        </button>
        
        <p className="mt-8 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
           🔒 Pago 100% seguro y garantizado
        </p>
      </div>
    </div>
  );
};

export default SubscriptionGate;
