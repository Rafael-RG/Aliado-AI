
import React from 'react';
import { Asset } from '../types';

interface AssetListProps {
  assets: Asset[];
}

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <div 
          key={asset.id} 
          className="glass p-4 rounded-xl flex items-center justify-between hover:border-cyan-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:bg-cyan-900 group-hover:border-cyan-400 transition-colors">
              <span className="text-xs font-bold font-orbitron text-cyan-400">{asset.ticker}</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100">{asset.name}</h4>
              <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 uppercase">
                {asset.type}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-orbitron text-lg font-bold text-slate-50">
              {asset.value.toLocaleString()} <span className="text-cyan-400 font-normal">Ȼ</span>
            </div>
            <div className={`text-xs font-medium ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetList;
