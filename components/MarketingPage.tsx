import React from 'react';
import { ICONS } from '../constants';

interface Props {
  onClose?: () => void;
}

const MarketingPage: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-xl font-bold text-slate-900">Aliado IA</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              <ICONS.ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Tu <span className="text-[#10b981]">Aliado IA</span> para 
            <br />Atención al Cliente
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Brinda atención excepcional 24/7 con el asistente inteligente que nunca descansa. 
            Responde consultas, resuelve dudas y mejora la experiencia de tus clientes con IA especializada en tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/"
              className="bg-[#10b981] hover:bg-[#059669] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 transition-all text-center"
            >
              Empezar Gratis
            </a>
            <button className="bg-white border-2 border-slate-200 hover:border-[#10b981] text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">¿Por qué Aliado IA?</h2>
          <p className="text-xl text-slate-600">La solución completa para mejorar la atención de tu negocio</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <ICONS.Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">IA Especializada</h3>
            <p className="text-slate-600">
              Entrena tu asistente con información específica de tu negocio. 
              Conoce tus productos, servicios y protocolos de atención como un experto.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <ICONS.Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">WhatsApp Business</h3>
            <p className="text-slate-600">
              Integración directa con WhatsApp Business API. 
              Atiende a tus clientes donde prefieren comunicarse contigo.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Respuesta Instantánea</h3>
            <p className="text-slate-600">
              Atiende consultas al instante, 24 horas los 7 días de la semana. 
              Tus clientes siempre reciben la atención que merecen.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#10b981] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">97%</div>
              <div className="text-green-100">Satisfacción Cliente</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3x</div>
              <div className="text-green-100">Más Consultas Atendidas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Disponibilidad</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-green-100">Resolución Inmediata</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Planes Simple y Transparente</h2>
          <p className="text-xl text-slate-600">Elige el plan perfecto para tu negocio</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Gratis */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Plan Gratis</h3>
              <div className="text-4xl font-bold text-slate-900 mb-2">$0</div>
              <div className="text-slate-500">Para empezar</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-slate-600">1 Asistente IA</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-slate-600">100 mensajes/mes</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-slate-600">Entrenamiento básico</span>
              </li>
            </ul>
            <a 
              href="/"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all text-center block"
            >
              Empezar Gratis
            </a>
          </div>

          {/* Plan Pro */}
          <div className="bg-[#10b981] p-8 rounded-3xl shadow-xl text-white relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#10b981] px-4 py-2 rounded-xl text-sm font-bold">
              Más Popular
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Plan Pro</h3>
              <div className="text-4xl font-bold mb-2">$29</div>
              <div className="text-green-100">por mes</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 text-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>5 Asistentes IA</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 text-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Mensajes ilimitados</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 text-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Entrenamiento avanzado</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 text-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Analytics avanzados</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 text-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Soporte prioritario</span>
              </li>
            </ul>
            <a 
              href="/"
              className="w-full bg-white hover:bg-slate-50 text-[#10b981] py-4 rounded-2xl font-bold transition-all text-center block"
            >
              Empezar Plan Pro
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Lo que dicen nuestros clientes</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "Aliado IA transformó completamente la atención de mi negocio. Ahora mis clientes reciben respuestas inmediatas y mi equipo puede enfocarse en tareas más importantes."
              </p>
              <div className="font-semibold text-slate-900">María González</div>
              <div className="text-sm text-slate-500">Boutique Luna</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "La configuración fue súper fácil y en 30 minutos ya tenía mi asistente brindando atención profesional a mis clientes."
              </p>
              <div className="font-semibold text-slate-900">Carlos Mendoza</div>
              <div className="text-sm text-slate-500">Reparaciones Tech</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "Mis clientes no pueden creer lo útil y rápido que es el asistente. Realmente conoce todos los detalles de mis productos y servicios."
              </p>
              <div className="font-semibold text-slate-900">Ana García</div>
              <div className="text-sm text-slate-500">Farmacia San José</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-[#10b981] to-[#059669] p-12 rounded-3xl text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ¿Listo para Mejorar tu Atención al Cliente?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a cientos de empresarios que ya están brindando atención excepcional con Aliado IA
          </p>
          <div className="flex justify-center">
            <a 
              href="/"
              className="bg-white hover:bg-slate-50 text-[#10b981] px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Empezar Gratis Ahora
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <span className="text-xl font-bold">Aliado IA</span>
            </div>
            <p className="text-slate-400 mb-6">Tu aliado inteligente para brindar atención excepcional por WhatsApp</p>
            <div className="flex justify-center gap-6 text-sm text-slate-400">
              <a href="/terminos-de-uso-y-condiciones" className="hover:text-white transition-colors">Términos y Condiciones</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacidad</a>
              <a href="/legal" className="hover:text-white transition-colors">Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingPage;