
import React, { useState } from 'react';

const BotROICalculator: React.FC = () => {
  const [hoursSaved, setHoursSaved] = useState(20);
  const [employeeCost, setEmployeeCost] = useState(15);
  const [leadsHandled, setLeadsHandled] = useState(100);
  const [conversionBoost, setConversionBoost] = useState(10);

  const monthlySavings = hoursSaved * employeeCost;
  const recommendedFee = Math.round(monthlySavings * 0.4); // Suggest 40% of the value created as a fee

  return (
    <div className="card p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">Calculadora de Tarifas (ROI)</h2>
        <p className="text-sm text-slate-500">Determina cuánto cobrar a un cliente basándote en el valor que generas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Horas ahorradas al cliente / mes</label>
            <input type="number" value={hoursSaved} onChange={(e)=>setHoursSaved(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl p-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Costo por hora del empleado ($)</label>
            <input type="number" value={employeeCost} onChange={(e)=>setEmployeeCost(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl p-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Leads gestionados / mes</label>
            <input type="number" value={leadsHandled} onChange={(e)=>setLeadsHandled(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl p-3 text-sm" />
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center items-center border border-slate-100">
           <div className="text-center mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ahorro mensual para el cliente</span>
              <div className="text-4xl font-black text-slate-900">${monthlySavings.toLocaleString()}</div>
           </div>
           
           <div className="w-full h-px bg-slate-200 mb-6"></div>

           <div className="text-center">
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Tarifa Mensual Sugerida (Retainer)</span>
              <div className="text-5xl font-black text-green-600">${recommendedFee.toLocaleString()}</div>
              <p className="text-[10px] text-slate-400 mt-2 italic">*Basado en el 40% del valor total de ahorro generado.</p>
           </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-4">
         <div className="bg-green-500 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7 3 5-3 5"/><path d="m19 7-3 5 3 5"/></svg>
         </div>
         <p className="text-xs text-green-800 leading-relaxed">
           <strong>Tip de Venta:</strong> No vendas "un bot", vende "liberar 20 horas de trabajo manual". Los dueños de negocio odian pagar por software, pero aman comprar tiempo y eficiencia.
         </p>
      </div>
    </div>
  );
};

export default BotROICalculator;
