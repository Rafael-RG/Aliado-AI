
import React, { useState } from 'react';
// Corrected the import name to match the exported member in wealthService
import { getBotStrategy } from '../services/wealthService';
import { ICONS } from '../constants';

const OpportunityRadar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ text: string, sources: any[] } | null>(null);

  const scanMarkets = async () => {
    setLoading(true);
    // Request location for localized opportunities - not used in this specific text tool call
    try {
      await new Promise<GeolocationPosition>((res, rej) => 
        navigator.geolocation.getCurrentPosition(res, rej)
      );
    } catch (e) {
      console.log("Location denied, using global signals.");
    }

    // Call the correct function from wealthService which handles strategy generation with Search Grounding
    // Use the correctly imported getBotStrategy function instead of the non-existent getSubscriptionAdvice
    const result = await getBotStrategy("Identify top 3 high-profit low-competition business niches or investment trends for this quarter.");
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-dark p-6 rounded-2xl gold-border shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-cinzel text-xl font-bold gold-gradient tracking-widest">Market Opportunity Radar</h2>
          <button 
            onClick={scanMarkets}
            disabled={loading}
            className="btn-gold px-6 py-2 rounded-full text-xs transition-all flex items-center gap-2"
          >
            {loading ? 'Scanning Aether...' : <><ICONS.Zap className="w-4 h-4" /> Initialize Scan</>}
          </button>
        </div>

        {!data && !loading && (
          <div className="text-center py-12 text-slate-500 italic">
            "Fortune favors the prepared mind. Scan to identify high-yield market signals."
          </div>
        )}

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-32 bg-slate-800 rounded"></div>
          </div>
        )}

        {data && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-slate-300">
              {data.text.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
            
            {data.sources.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-[10px] uppercase tracking-widest text-gold-500 font-bold mb-3 opacity-60">Verified Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {data.sources.map((s: any, i: number) => s.web && (
                    <a 
                      key={i} 
                      href={s.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full hover:border-gold-500 transition-colors text-slate-400 truncate max-w-[200px]"
                    >
                      {s.web.title || s.web.uri}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityRadar;
