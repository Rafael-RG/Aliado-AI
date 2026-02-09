
import React, { useState, useEffect } from 'react';
import { BotConfig, KnowledgeAsset } from '../types';
import { dataService } from '../services/dataService';

interface Props {
  config: BotConfig;
  setConfig: (config: BotConfig) => void;
}

const BotTrainer: React.FC<Props> = ({ config, setConfig }) => {
  const [trainingData, setTrainingData] = useState<any[]>([]);
  const [demoBot, setDemoBot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setLoading(true);
        const demoData = await dataService.getCompleteDemoData();
        
        if (demoData.bot) {
          setDemoBot(demoData.bot);
          // Update config with demo data if it's empty
          if (!config.name || config.name === "Mi Aliado de Ventas") {
            setConfig({
              ...config,
              name: demoData.bot.name,
              businessType: demoData.bot.businessType,
              role: demoData.bot.role,
              tone: demoData.bot.tone,
              knowledgeBase: demoData.bot.knowledgeBase
            });
          }
        }
        
        if (demoData.trainingData) {
          setTrainingData(demoData.trainingData);
        }
      } catch (error) {
        console.error('Error loading demo data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const simulateUpload = (type: 'pdf' | 'image') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAsset: KnowledgeAsset = {
      id,
      type,
      name: type === 'pdf' ? `Documento_Negocio_${id.toUpperCase()}.pdf` : `Imagen_Producto_${id.toUpperCase()}.jpg`,
      contentSummary: type === 'pdf' 
        ? "Información importante sobre tus productos y precios." 
        : "Imagen que el bot usará como referencia."
    };
    setConfig({ ...config, assets: [...(config.assets || []), newAsset] });
  };

  const removeAsset = (id: string) => {
    setConfig({ ...config, assets: config.assets.filter(a => a.id !== id) });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="card p-8">
        <div className="mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-black text-slate-900">¿Cómo debe ser tu Bot?</h2>
          <p className="text-sm text-slate-500">Dile a tu asistente quién es y cómo quieres que trate a tus clientes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre de tu Negocio</label>
              <input name="name" value={config.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ej. Sushi Palace" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">¿Cómo quieres que hable?</label>
              <select name="tone" value={config.tone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-green-500 outline-none">
                <option value="professional">Serio y Profesional</option>
                <option value="friendly">Amigable y Alegre</option>
                <option value="empathetic">Cercano y Comprensivo</option>
                <option value="aggressive">Enfocado a cerrar ventas rápido</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lo que el Bot debe saber (Sus instrucciones)</label>
            <textarea name="knowledgeBase" value={config.knowledgeBase} onChange={handleChange} className="w-full h-[120px] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none resize-none font-mono" placeholder="Ej. Los envíos cuestan $500, no abrimos los domingos, vendemos ropa de hombre..." />
          </div>
        </div>
      </div>

      <div className="card p-8 border-dashed border-2 border-slate-200 bg-slate-50/30">
        <div className="mb-6">
          <h3 className="text-lg font-black text-slate-900">Documentos de Ayuda para el Bot</h3>
          <p className="text-xs text-slate-500">Sube tus listas de precios o catálogos para que el bot aprenda de ellos.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {config.assets?.map((asset) => (
            <div key={asset.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between group">
              <div className="flex items-center gap-3 truncate">
                <div className={`p-2 rounded-lg ${asset.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  {asset.type === 'pdf' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  )}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-700 truncate">{asset.name}</p>
                  <p className="text-[9px] text-green-600 font-bold uppercase">Aprendido correctamente</p>
                </div>
              </div>
              <button onClick={() => removeAsset(asset.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}

          <button onClick={() => simulateUpload('pdf')} className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-all text-slate-400 hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            <span className="text-[10px] font-black uppercase tracking-tighter">Subir Lista de Precios (PDF)</span>
          </button>

          <button onClick={() => simulateUpload('image')} className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-all text-slate-400 hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="text-[10px] font-black uppercase tracking-tighter">Subir Foto de Producto</span>
          </button>
        </div>
      </div>

      {/* Sección de Datos de Entrenamiento desde Azure Storage */}
      {trainingData.length > 0 && (
        <div className="card p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900">Datos de Entrenamiento Cargados</h3>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Azure Storage</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Preguntas y respuestas cargadas desde Azure Table Storage para entrenar a tu bot.
            </p>
          </div>

          <div className="grid gap-4">
            {trainingData.slice(0, 3).map((item, index) => (
              <div key={index} className="bg-white border border-green-200 rounded-xl p-4">
                <div className="mb-2">
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                    {item.category || 'General'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-bold text-slate-700">Pregunta:</p>
                    <p className="text-sm text-slate-900 font-medium">{item.question}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Respuesta:</p>
                    <p className="text-sm text-slate-600">{item.answer}</p>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {item.tags.map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {trainingData.length > 3 && (
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Y {trainingData.length - 3} preguntas más cargadas desde Azure Storage...
              </p>
            </div>
          )}

          {!loading && (
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-4 pt-4 border-t border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-medium">
                ✅ Datos sincronizados con Azure Table Storage - Total: {trainingData.length} preguntas
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BotTrainer;
