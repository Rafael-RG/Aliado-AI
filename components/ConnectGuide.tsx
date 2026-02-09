
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { BotConfig } from '../types';
import { whatsappIntegration } from '../services/whatsappIntegration';

interface Props {
  bot: BotConfig;
}

const ConnectGuide: React.FC<Props> = ({ bot }) => {
  const [copied, setCopied] = useState<'webhook' | 'token' | null>(null);
  const [metaToken, setMetaToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [setupStage, setSetupStage] = useState<'config' | 'validate' | 'test' | 'complete'>('config');
  const [validationResults, setValidationResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const webhookUrl = whatsappIntegration.getWebhookUrl(bot.id);
  const verifyToken = whatsappIntegration.getVerifyToken();

  useEffect(() => {
    syncBotWithBackend();
  }, [bot]);

  const syncBotWithBackend = async () => {
    await whatsappIntegration.syncBotWithBackend(bot);
  };

  const copyToClipboard = async (text: string, type: 'webhook' | 'token') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleValidateToken = async () => {
    if (!metaToken.trim()) {
      alert('Por favor ingresa tu Access Token de Meta');
      return;
    }

    setIsLoading(true);
    try {
      const validation = await whatsappIntegration.validateMetaToken(metaToken);
      
      if (validation.valid) {
        setSetupStage('validate');
        
        // Get WhatsApp accounts
        const accounts = await whatsappIntegration.getWhatsAppAccounts(metaToken);
        setValidationResults({ tokenValid: true, accounts });
      } else {
        // Handle error message properly
        let errorMsg = 'Token inválido';
        if (validation.error) {
          if (typeof validation.error === 'object') {
            errorMsg = `Token inválido: ${JSON.stringify(validation.error)}`;
          } else {
            errorMsg = `Token inválido: ${validation.error}`;
          }
        }
        alert(errorMsg);
      }
    } catch (error) {
      let errorMsg = 'Error validando token';
      if (error instanceof Error) {
        errorMsg = `Error validando token: ${error.message}`;
      } else if (typeof error === 'object') {
        errorMsg = `Error validando token: ${JSON.stringify(error)}`;
      } else {
        errorMsg = `Error validando token: ${error}`;
      }
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSetup = async () => {
    if (!phoneNumberId.trim()) {
      alert('Por favor selecciona un Phone Number ID');
      return;
    }

    setIsLoading(true);
    try {
      const testData = {
        accessToken: metaToken,
        phoneNumberId: phoneNumberId,
        testPhoneNumber: testPhone,
        webhookUrl: webhookUrl
      };

      const result = await whatsappIntegration.testMetaSetup(testData);
      
      if (result.success) {
        setSetupStage('test');
        setValidationResults(prev => ({ ...prev, testResults: result }));
        
        if (testPhone) {
          // Send test message
          const testMessage = await whatsappIntegration.sendTestMessage(
            testPhone, 
            `🎉 ¡Conectado! Tu bot "${bot.name}" está funcionando correctamente.`
          );
          
          if (testMessage.success) {
            setSetupStage('complete');
          }
        }
      } else {
        alert(`Error en pruebas: ${result.error}`);
      }
    } catch (error) {
      alert(`Error durante pruebas: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const CompletionBadge = ({ stage, currentStage }: { stage: string, currentStage: string }) => {
    const stages = ['config', 'validate', 'test', 'complete'];
    const stageIndex = stages.indexOf(stage);
    const currentIndex = stages.indexOf(currentStage);
    
    const isCompleted = currentIndex > stageIndex;
    const isCurrent = currentIndex === stageIndex;
    
    return (
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
        isCompleted ? 'bg-green-500 text-white' : 
        isCurrent ? 'bg-blue-500 text-white' : 
        'bg-slate-100 text-slate-400'
      }`}>
        {isCompleted ? '✓' : stageIndex + 1}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Main Setup Card */}
      <div className="card p-8 lg:p-10 bg-white">
        <div className="mb-10 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Conecta WhatsApp: {bot.name}
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 font-medium leading-relaxed">
            Configuración completa para WhatsApp Business API con Meta
          </p>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { id: 'config', title: 'Config', desc: 'Token Meta' },
            { id: 'validate', title: 'Validar', desc: 'Verificar cuenta' },
            { id: 'test', title: 'Probar', desc: 'Test mensajes' },
            { id: 'complete', title: 'Listo', desc: 'Funcionando' }
          ].map((step) => (
            <div key={step.id} className="text-center">
              <CompletionBadge stage={step.id} currentStage={setupStage} />
              <h4 className="font-bold text-slate-900 text-xs mt-2">{step.title}</h4>
              <p className="text-xs text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Stage 1: Configuration */}
        {setupStage === 'config' && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-2">
                Meta Access Token <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={metaToken}
                onChange={(e) => setMetaToken(e.target.value)}
                placeholder="EAABwzLixnj..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Obténlo en developers.facebook.com → Tu App → WhatsApp → API Setup
              </p>
            </div>
            
            <button
              onClick={handleValidateToken}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Validando...' : 'Validar Token y Continuar'}
            </button>
          </div>
        )}

        {/* Stage 2: Validation Results */}
        {setupStage === 'validate' && validationResults && (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</div>
                <span className="font-bold text-green-800">Token válido</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Cuenta: {validationResults.accounts?.businesses?.[0]?.name || 'Meta Business'}
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 block mb-2">
                Phone Number ID <span className="text-red-500">*</span>
              </label>
              <select
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Selecciona un número de WhatsApp</option>
                {validationResults.accounts?.businesses?.[0]?.whatsapp_business_accounts?.[0]?.phone_numbers?.map((phone: any) => (
                  <option key={phone.id} value={phone.id}>
                    {phone.display_phone_number} ({phone.verified_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 block mb-2">
                Teléfono de Prueba (opcional)
              </label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="5491234567890"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Para enviar mensaje de prueba (formato: código país + número)
              </p>
            </div>

            <button
              onClick={handleTestSetup}
              disabled={isLoading || !phoneNumberId}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Probando configuración...' : 'Probar Configuración'}
            </button>
          </div>
        )}

        {/* Stage 3 & 4: Test Results and Webhook Info */}
        {(setupStage === 'test' || setupStage === 'complete') && (
          <div className="space-y-6">
            {setupStage === 'complete' && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  🎉
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2">¡WhatsApp Conectado!</h3>
                <p className="text-sm text-green-600">
                  Tu bot "{bot.name}" está funcionando correctamente y puede recibir mensajes.
                </p>
              </div>
            )}

            {/* Webhook Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Configuración del Webhook en Meta</h3>
              
              <div className="p-6 bg-slate-900 rounded-xl border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-green-400 uppercase tracking-wide">URL de Webhook</span>
                  <button 
                    onClick={() => copyToClipboard(webhookUrl, 'webhook')}
                    className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase flex items-center gap-2"
                  >
                    {copied === 'webhook' ? '¡Copiado!' : 'Copiar URL'}
                    <ICONS.Code className="w-3 h-3" />
                  </button>
                </div>
                <code className="text-xs font-mono text-green-100/60 block break-all bg-black/30 p-4 rounded-xl border border-white/5">
                  {webhookUrl}
                </code>
              </div>

              <div className="p-6 bg-slate-900 rounded-xl border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-green-400 uppercase tracking-wide">Verify Token</span>
                  <button 
                    onClick={() => copyToClipboard(verifyToken, 'token')}
                    className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase flex items-center gap-2"
                  >
                    {copied === 'token' ? '¡Copiado!' : 'Copiar Token'}
                    <ICONS.Code className="w-3 h-3" />
                  </button>
                </div>
                <code className="text-xs font-mono text-green-100/60 block break-all bg-black/30 p-4 rounded-xl border border-white/5">
                  {verifyToken}
                </code>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <h4 className="font-bold text-blue-800 text-sm mb-2">Pasos finales en Meta:</h4>
              <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
                <li>Ve a tu App en developers.facebook.com</li>
                <li>WhatsApp → Configuration → Webhook</li>
                <li>Pega la URL y Verify Token de arriba</li>
                <li>Selecciona "messages" en webhook fields</li>
                <li>Guarda y verifica el webhook</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-green-50 rounded-[32px] border border-green-100 p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-green-900 mb-1 tracking-tight">¿Necesitas ayuda?</h3>
          <p className="text-sm text-green-700/70 font-medium leading-relaxed">
            Nuestro equipo puede configurar todo por ti por un pago único de $49.
          </p>
        </div>
        <button 
          className="bg-[#10b981] text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-green-200 hover:bg-green-600 transition-all flex items-center gap-3 active:scale-95"
          onClick={() => window.open('https://wa.me/5491234567890?text=Hola,%20necesito%20ayuda%20con%20la%20configuración%20de%20WhatsApp', '_blank')}
        >
          Hablar con Soporte <ICONS.Zap className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ConnectGuide;
