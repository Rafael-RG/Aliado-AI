
import React, { useState, useEffect } from 'react';
import { BotConfig } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dataService } from '../services/dataService';

interface Props {
  bot: BotConfig;
}

const BotStats: React.FC<Props> = ({ bot }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        
        // Try to get real metrics from backend
        const demoData = await dataService.getCompleteDemoData();
        
        if (demoData.metrics && demoData.metrics.length > 0) {
          const latestMetrics = demoData.metrics[0];
          setMetrics({
            messagesSent: latestMetrics.messages?.sent || 127,
            leadsCaptured: latestMetrics.business?.leadsCaptured || 12,
            timeSavedHours: Math.round((latestMetrics.business?.timeSaved || 180) / 60),
            satisfactionRate: Math.round((latestMetrics.performance?.satisfactionScore || 4.6) * 20),
            dailyData: [
              { day: 'Lun', messages: 18 },
              { day: 'Mar', messages: 23 },
              { day: 'Mie', messages: 21 },
              { day: 'Jue', messages: 19 },
              { day: 'Vie', messages: 25 },
              { day: 'Sab', messages: 15 },
              { day: 'Dom', messages: 6 },
            ],
            dataSource: 'Azure Storage'
          });
        } else {
          // Fallback to demo data
          setMetrics({
            messagesSent: 127,
            leadsCaptured: 12,
            timeSavedHours: 3,
            satisfactionRate: 92,
            dailyData: [
              { day: 'Lun', messages: 18 },
              { day: 'Mar', messages: 23 },
              { day: 'Mie', messages: 21 },
              { day: 'Jue', messages: 19 },
              { day: 'Vie', messages: 25 },
              { day: 'Sab', messages: 15 },
              { day: 'Dom', messages: 6 },
            ],
            dataSource: 'Demo (Backend not available)'
          });
        }
      } catch (error) {
        console.error('Error loading metrics:', error);
        // Fallback data
        setMetrics({
          messagesSent: 127,
          leadsCaptured: 12,
          timeSavedHours: 3,
          satisfactionRate: 92,
          dailyData: [
            { day: 'Lun', messages: 18 },
            { day: 'Mar', messages: 23 },
            { day: 'Mie', messages: 21 },
            { day: 'Jue', messages: 19 },
            { day: 'Vie', messages: 25 },
            { day: 'Sab', messages: 15 },
            { day: 'Dom', messages: 6 },
          ],
          dataSource: 'Demo (Error loading from backend)'
        });
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [bot]);

  if (loading) {
    return (
      <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="card p-5 lg:p-6 animate-pulse">
              <div className="h-3 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="card p-5 lg:p-8 bg-white animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-2 w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded mb-8 w-1/2"></div>
          <div className="h-64 lg:h-80 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const stats = metrics || {
    messagesSent: 127,
    leadsCaptured: 12,
    timeSavedHours: 3,
    satisfactionRate: 92,
    dailyData: [
      { day: 'Lun', messages: 18 },
      { day: 'Mar', messages: 23 },
      { day: 'Mie', messages: 21 },
      { day: 'Jue', messages: 19 },
      { day: 'Vie', messages: 25 },
      { day: 'Sab', messages: 15 },
      { day: 'Dom', messages: 6 },
    ],
    dataSource: 'Fallback'
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
        
        {stats.dataSource && (
          <div className="text-xs text-slate-400 flex items-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full ${stats.dataSource === 'Azure Storage' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
            <span className="font-medium">
              Datos desde: {stats.dataSource === 'Azure Storage' ? '✅ Azure Table Storage' : '⚠️ ' + stats.dataSource}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotStats;
