import React from 'react';

const PublicPrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#10b981] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-100">
              A
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Aliado IA</h1>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Política de Privacidad</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Cómo recopilamos, usamos y protegemos su información personal
          </p>
          <p className="text-sm text-slate-400 mt-2">Última actualización: 10 de febrero de 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8">
          
          {/* 1. Introducción */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Introducción</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                En Aliado AI valoramos su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de Privacidad 
                explica cómo recopilamos, usamos, almacenamos y protegemos su información cuando utiliza nuestros servicios.
              </p>
            </div>
          </section>

          {/* 2. Información que Recopilamos */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Información que Recopilamos</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Recopilamos diferentes tipos de información para brindarle nuestros servicios:
              </p>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Información de Registro</h4>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>Nombre completo y dirección de email</li>
                <li>Número de teléfono y información de empresa</li>
                <li>Credenciales de acceso (contraseña encriptada)</li>
              </ul>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Datos de Uso</h4>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>Conversaciones procesadas a través de chatbots</li>
                <li>Métricas y estadísticas de uso</li>
                <li>Configuraciones y preferencias del bot</li>
              </ul>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Información Técnica</h4>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Dirección IP y datos de conexión</li>
                <li>Tipo de navegador y sistema operativo</li>
                <li>Registros de actividad en la plataforma</li>
              </ul>
            </div>
          </section>

          {/* 3. Cómo Usamos su Información */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Cómo Usamos su Información</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Utilizamos su información para los siguientes propósitos:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Proporcionar y mantener nuestros servicios de chatbot</li>
                <li>Procesar pagos y gestionar suscripciones</li>
                <li>Enviar comunicaciones importantes sobre el servicio</li>
                <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
                <li>Proporcionar soporte técnico y atención al cliente</li>
                <li>Detectar y prevenir fraudes o uso indebido</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
              </ul>
            </div>
          </section>

          {/* 4. Compartir Información */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">4. Compartir su Información</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información en las siguientes situaciones:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li><strong>Proveedores de Servicios:</strong> Con terceros que nos ayudan a operar nuestra plataforma</li>
                <li><strong>WhatsApp Business API:</strong> Datos necesarios para el funcionamiento del servicio de mensajería</li>
                <li><strong>Cumplimiento Legal:</strong> Cuando sea requerido por ley o autoridades competentes</li>
                <li><strong>Protección de Derechos:</strong> Para proteger nuestros derechos, propiedad o seguridad</li>
              </ul>
            </div>
          </section>

          {/* 5. Seguridad de Datos */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">5. Seguridad de Datos</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Actualización regular de sistemas de seguridad</li>
                <li>Auditorías de seguridad periódicas</li>
              </ul>
            </div>
          </section>

          {/* 6. Retención de Datos */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">6. Retención de Datos</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta política:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li><strong>Dados de Cuenta:</strong> Mientras mantenga una cuenta activa</li>
                <li><strong>Conversaciones:</strong> Hasta 90 días después del procesamiento</li>
                <li><strong>Registros de Facturación:</strong> Por el período requerido por ley fiscal</li>
                <li><strong>Datos de Soporte:</strong> Hasta 3 años después de la resolución</li>
              </ul>
            </div>
          </section>

          {/* 7. Sus Derechos */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">7. Sus Derechos de Privacidad</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Usted tiene los siguientes derechos respecto a su información personal:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li><strong>Acceso:</strong> Solicitar una copia de su información personal</li>
                <li><strong>Corrección:</strong> Actualizar o corregir información inexacta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de su información</li>
                <li><strong>Portabilidad:</strong> Obtener sus datos en formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                <li><strong>Limitación:</strong> Solicitar limitación del procesamiento</li>
              </ul>
            </div>
          </section>

          {/* 8. Cookies y Tecnologías de Seguimiento */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies y Tecnologías de Seguimiento</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestra plataforma:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico</li>
                <li><strong>Cookies de Rendimiento:</strong> Para analizar el uso de la plataforma</li>
                <li><strong>Cookies de Funcionalidad:</strong> Para recordar sus preferencias</li>
              </ul>
            </div>
          </section>

          {/* 9. Transferencias Internacionales */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">9. Transferencias Internacionales</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                Sus datos pueden ser procesados en servidores ubicados fuera de México. Cuando esto ocurra, 
                implementamos salvaguardas apropiadas para proteger su información de acuerdo con esta política 
                y las leyes aplicables de protección de datos.
              </p>
            </div>
          </section>

          {/* 10. Cambios a esta Política */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">10. Cambios a esta Política</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios 
                significativos a través de email o mediante un aviso prominente en nuestro servicio. 
                Su uso continuado del servicio después de los cambios constituye su aceptación de la nueva política.
              </p>
            </div>
          </section>

          {/* 11. Contacto */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">11. Contacto para Privacidad</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, contáctenos en:
              </p>
              <div className="bg-slate-50 p-6 rounded-xl">
                <p className="text-slate-700 mb-2"><strong>Email de Privacidad:</strong> privacidad@aliado.ai</p>
                <p className="text-slate-700 mb-2"><strong>Email Legal:</strong> legal@aliado.ai</p>
                <p className="text-slate-700 mb-2"><strong>Teléfono:</strong> +52 999 123 4567</p>
                <p className="text-slate-700 mb-2"><strong>Dirección:</strong> Ciudad de México, México</p>
                <p className="text-slate-700"><strong>Sitio Web:</strong> https://aliado.ai</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-600 mb-4">
            Esta Política de Privacidad es efectiva a partir del 10 de febrero de 2026.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="/legal"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Términos y Condiciones
            </a>
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Ir a Aliado AI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPrivacyPage;