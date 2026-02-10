import React from 'react';
import { ICONS } from '../constants';

interface Props {
  onClose: () => void;
}

const UsageGuidePage: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Guía de Uso</h1>
          <p className="text-slate-500">Aprende a sacar el máximo provecho de Aliado AI</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
        >
          <ICONS.ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8">
        
        {/* Introducción */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">¡Bienvenido a Aliado AI!</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg">
              Esta guía te ayudará a configurar y optimizar tu chatbot de WhatsApp para automatizar 
              tus ventas y atención al cliente de manera efectiva.
            </p>
          </div>
        </section>

        {/* Paso 1: Configuración Inicial */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <span className="text-green-600">1.</span> Configuración Inicial
          </h2>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-2">Crear tu Primer Bot</h3>
              <p className="text-green-800">
                Ve a la sección "Negocios" y haz clic en "Crear mi Primer Aliado". Define el nombre de tu negocio, 
                tipo de industria y el rol que desempeñará tu bot (ventas, soporte, etc.).
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-2">💼 Tipo de Negocio</h4>
                <p className="text-sm text-slate-600">
                  Selecciona la categoría que mejor describe tu empresa: Comercio, Servicios, Restaurante, etc.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-2">🎭 Tono de Conversación</h4>
                <p className="text-sm text-slate-600">
                  Elige el estilo de comunicación: Amigable, Profesional, Casual o Formal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Paso 2: Entrenar tu Bot */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <span className="text-blue-600">2.</span> Entrenar tu Bot
          </h2>
          <div className="space-y-4">
            <p>
              Ve a la sección "Entrenar" para personalizar el conocimiento de tu bot:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <ICONS.FileText className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Base de Conocimiento</h4>
                <p className="text-sm text-slate-600">
                  Agrega información sobre productos, servicios, horarios, políticas y cualquier dato relevante.
                </p>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <ICONS.MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Respuestas Comunes</h4>
                <p className="text-sm text-slate-600">
                  Configura respuestas para preguntas frecuentes como precios, disponibilidad y métodos de pago.
                </p>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-3">
                  <ICONS.Settings className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Personalidad</h4>
                <p className="text-sm text-slate-600">
                  Define cómo debe comportarse tu bot, su personalidad y estilo de comunicación.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Paso 3: Probar el Bot */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <span className="text-purple-600">3.</span> Probar tu Bot
          </h2>
          <div className="space-y-4">
            <p>
              Antes de conectar con WhatsApp, prueba tu bot en la sección "Probar":
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 mb-3">🧪 Simulador de Conversaciones</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-purple-800">Simula conversaciones reales con clientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-purple-800">Verifica que las respuestas sean adecuadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-purple-800">Ajusta el conocimiento según sea necesario</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Paso 4: Conectar WhatsApp */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <span className="text-green-600">4.</span> Conectar WhatsApp
          </h2>
          <div className="space-y-4">
            <p>
              Una vez que tu bot esté entrenado y probado, conéctalo a WhatsApp Business:
            </p>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-3">📱 Requisitos Previos</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Cuenta de Meta Business verificada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>WhatsApp Business API configurado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Access Token de Meta</span>
                  </li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-bold text-yellow-900 mb-2">⚠️ Importante</h3>
                <p className="text-yellow-800">
                  Sigue las políticas de WhatsApp Business para evitar restricciones. 
                  No envíes spam y siempre obtén consentimiento antes de contactar clientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Paso 5: Monitorear Métricas */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <span className="text-orange-600">5.</span> Monitorear y Optimizar
          </h2>
          <div className="space-y-4">
            <p>
              Utiliza la sección "Métricas" para analizar el rendimiento de tu bot:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-2">📊 Métricas Clave</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Total de conversaciones</li>
                  <li>• Tasa de resolución</li>
                  <li>• Tiempo de respuesta promedio</li>
                  <li>• Satisfacción del cliente</li>
                </ul>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-2">🎯 Optimización</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Actualiza respuestas frecuentes</li>
                  <li>• Mejora la base de conocimiento</li>
                  <li>• Ajusta el tono según feedback</li>
                  <li>• Revisa conversaciones problemáticas</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Consejos Adicionales */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">💡 Consejos para el Éxito</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">✅ Mejores Prácticas</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">Mantén la información siempre actualizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">Responde de manera clara y concisa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">Incluye opciones de contacto humano</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">Monitorea las métricas regularmente</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">❌ Evita Estos Errores</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">No pongas información desactualizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">No hagas el bot demasiado complejo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">No ignores las políticas de WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-slate-700">No olvides revisar las conversaciones</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Soporte */}
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">🆘 ¿Necesitas Ayuda?</h2>
          <p className="text-blue-800 mb-4">
            Si tienes dudas o problemas, nuestro equipo de soporte está aquí para ayudarte.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <ICONS.Mail className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900">soporte@aliado.ai</span>
            </div>
            <div className="flex items-center gap-3">
              <ICONS.MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900">WhatsApp: +52 999 123 4567</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UsageGuidePage;