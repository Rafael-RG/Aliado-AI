
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WealthCalculator: React.FC = () => {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    let current = initial;
    const points = [];
    const monthlyRate = rate / 100 / 12;

    for (let i = 0; i <= years * 12; i++) {
      if (i % 12 === 0) {
        points.push({
          year: i / 12,
          value: Math.round(current)
        });
      }
      current = (current + monthly) * (1 + monthlyRate);
    }
    return points;
  }, [initial, monthly, rate, years]);

  const finalWealth = data[data.length - 1].value;
  const isMillionaire = finalWealth >= 1000000;

  return (
    <div className="glass-dark p-6 rounded-2xl gold-border">
      <h2 className="font-cinzel text-lg font-bold mb-6 gold-gradient">Compound Trajectory</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500">Capital Inicial ($)</label>
          <input 
            type="number" 
            value={initial} 
            onChange={(e) => setInitial(Number(e.target.value))}
            className="w-full bg-black border border-slate-800 rounded p-2 text-sm focus:border-gold-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500">Inversión Mensual ($)</label>
          <input 
            type="number" 
            value={monthly} 
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full bg-black border border-slate-800 rounded p-2 text-sm focus:border-gold-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500">Retorno Anual (%)</label>
          <input 
            type="number" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full bg-black border border-slate-800 rounded p-2 text-sm focus:border-gold-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500">Plazo (Años)</label>
          <input 
            type="number" 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full bg-black border border-slate-800 rounded p-2 text-sm focus:border-gold-500 outline-none"
          />
        </div>
      </div>

      <div className="h-64 w-full mb-6">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#475569" fontSize={10} />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #d4af37' }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, 'Total Wealth']}
            />
            <Area type="monotone" dataKey="value" stroke="#d4af37" fillOpacity={1} fill="url(#colorWealth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/40 border border-slate-800">
         <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">Resultado Proyectado</div>
         <div className={`text-3xl font-cinzel font-black ${isMillionaire ? 'gold-gradient' : 'text-slate-100'}`}>
           ${finalWealth.toLocaleString()}
         </div>
         {isMillionaire && (
           <div className="text-[10px] text-emerald-400 font-bold uppercase mt-2 animate-pulse-gold tracking-widest">
             Status: Millionaire Achieved
           </div>
         )}
      </div>
    </div>
  );
};

export default WealthCalculator;
