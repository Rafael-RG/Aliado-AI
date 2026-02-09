
import React, { useState } from 'react';
import { getBotStrategy } from '../services/wealthService';
import { ICONS } from '../constants';

const NicheRadar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);

  const scanNiches = async () => {
    setLoading(true);
    const data = await getBotStrategy("Identifica 5 nichos de negocio actuales que desesperadamente necesitan automatización de WhatsApp por alta demanda de mensajes (ej. delivery, salud, real estate). Explica por qué es rentable venderles hoy.");
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="card p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Radar de Oportunidades</h2>
          <p className="text-sm text-slate-500">Sectores calientes para vender bots de WhatsApp ahora mismo.</p>
        </div>
        <button 
          onClick={scanNiches}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-green-200"
        >
          {loading ? 'Analizando mercados...' : 'Escanear Nichos'}
        </button>
      </div>

      {!result && !loading && (
        <div className="border-2 border-dashed border-slate-100 rounded-2xl p-16 text-center text-slate-400">
           Inicia el radar para encontrar tu próximo cliente de alto ticket.
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
          <div className="h-32 bg-slate-50 rounded animate-pulse"></div>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in duration-500">
          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            {result.text.split('\n').map((line, i) => <p key={i} className="mb-3">{line}</p>)}
          </div>
          
          {result.sources.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h4 className="col-span-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuentes de Datos Reales</h4>
              {result.sources.map((s: any, i: number) => s.web && (
                <a key={i} href={s.web.uri} target="_blank" className="text-xs bg-white border border-slate-200 p-4 rounded-xl hover:border-green-400 transition-colors flex items-center justify-between">
                  <span className="font-bold text-slate-700 truncate mr-4">{s.web.title}</span>
                  <ICONS.Globe className="w-4 h-4 text-green-500 flex-shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NicheRadar;
