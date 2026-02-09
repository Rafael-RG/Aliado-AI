
import React from 'react';
import { BotConfig } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  bot: BotConfig;
}

const BotStats: React.FC<Props> = ({ bot }) => {
  const stats = bot.stats || {
    messagesSent: 1240,
    leadsCaptured: 86,
    timeSavedHours: 42,
    satisfactionRate: 98,
    dailyData: [
      { day: 'Lun', messages: 120 },
      { day: 'Mar', messages: 150 },
      { day: 'Mie', messages: 400 },
      { day: 'Jue', messages: 320 },
      { day: 'Vie', messages: 510 },
      { day: 'Sab', messages: 480 },
      { day: 'Dom', messages: 210 },
    ]
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Conversaciones', val: stats.messagesSent.toLocaleString(), sub: '¡Atención total!', color: 'green' },
          { label: 'Posibles Clientes', val: stats.leadsCaptured, sub: 'Gente interesada', color: 'blue' },
          { label: 'Tiempo Ahorrado', val: `${stats.timeSavedHours}h`, sub: 'Libre para ti', color: 'amber' },
          { label: 'Satisfacción', val: `${stats.satisfactionRate}%`, sub: 'Bien atendidos', color: 'purple' }
        ].map((kpi, idx) => (
          <div key={idx} className="card p-5 lg:p-6 group">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
             <p className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{kpi.val}</p>
             <p className={`text-[10px] font-bold mt-2 ${
               kpi.color === 'green' ? 'text-green-600' : 
               kpi.color === 'blue' ? 'text-blue-600' : 
               kpi.color === 'amber' ? 'text-amber-600' : 'text-purple-600'
             }`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="card p-5 lg:p-8 bg-white">
        <div className="mb-8">
          <h3 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">Actividad Semanal</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Mensajes respondidos automáticamente.</p>
        </div>

        <div className="h-64 lg:h-80 w-full">
          <ResponsiveContainer>
            <AreaChart data={stats.dailyData}>
              <defs>
                <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '12px' }}
                itemStyle={{ color: '#059669', fontWeight: 700, fontSize: '13px' }}
              />
              <Area 
                type="monotone" 
                dataKey="messages" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorMsg)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BotStats;
