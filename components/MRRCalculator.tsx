
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MRRCalculator: React.FC = () => {
  const [price, setPrice] = useState(29);
  const [newUsers, setNewUsers] = useState(50);
  const [churn, setChurn] = useState(5);
  const [months, setMonths] = useState(12);

  const data = useMemo(() => {
    let users = 0;
    const points = [];
    const churnRate = churn / 100;

    for (let i = 0; i <= months; i++) {
      points.push({
        month: i,
        mrr: Math.round(users * price),
        users: Math.round(users)
      });
      // Cada mes sumamos nuevos y restamos los que se van
      users = (users + newUsers) * (1 - churnRate);
    }
    return points;
  }, [price, newUsers, churn, months]);

  const finalMRR = data[data.length - 1].mrr;

  return (
    <div className="card p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Proyección de MRR</h2>
          <p className="text-sm text-slate-500">Calcula tus ingresos recurrentes basados en retención.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
          <span className="text-xs font-bold text-indigo-600 uppercase">MRR Final</span>
          <div className="text-2xl font-black text-indigo-700">${finalMRR.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 uppercase">Precio ($)</label>
          <input type="number" value={price} onChange={(e)=>setPrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 uppercase">Nuevos Usuarios / mes</label>
          <input type="number" value={newUsers} onChange={(e)=>setNewUsers(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 uppercase">Churn (%)</label>
          <input type="number" value={churn} onChange={(e)=>setChurn(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 uppercase">Periodo (Meses)</label>
          <input type="number" value={months} onChange={(e)=>setMonths(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val)=>`$${val}`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, 'MRR Estimado']}
            />
            <Area type="monotone" dataKey="mrr" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MRRCalculator;
