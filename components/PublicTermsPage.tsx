import React from 'react';

const PublicTermsPage: React.FC = () => {
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
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Términos y Condiciones</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Términos de servicio y condiciones de uso para la plataforma Aliado IA
          </p>
          <p className="text-sm text-slate-400 mt-2">Última actualización: 10 de febrero de 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8">
          
          {/* 1. Aceptación de los Términos */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Aceptación de los Términos</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                Al acceder y utilizar Aliado AI ("el Servicio"), usted acepta estar sujeto a estos Términos y Condiciones 
                ("los Términos"). Si no está de acuerdo con alguno de estos términos, no debe usar nuestro servicio.
              </p>
            </div>
          </section>

          {/* 2. Descripción del Servicio */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Descripción del Servicio</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Aliado AI es una plataforma de automatización de conversaciones que permite a las empresas crear 
                y desplegar chatbots inteligentes para WhatsApp Business API utilizando tecnología de inteligencia artificial.
              </p>
              <p className="text-slate-700 leading-relaxed">
                El servicio incluye, pero no se limita a:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Creación y entrenamiento de bots conversacionales</li>
                <li>Integración con WhatsApp Business API</li>
                <li>Análisis y métricas de conversaciones</li>
                <li>Herramientas de configuración y personalización</li>
              </ul>
            </div>
          </section>

          {/* 3. Registro y Cuenta */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Registro y Cuenta de Usuario</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Para utilizar nuestro servicio, debe crear una cuenta proporcionando información precisa y actualizada. 
                Usted es responsable de mantener la confidencialidad de sus credenciales de acceso.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Se compromete a:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Proporcionar información veraz y precisa</li>
                <li>Mantener actualizada su información de cuenta</li>
                <li>Proteger la seguridad de su contraseña</li>
                <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
              </ul>
            </div>
          </section>

          {/* 4. Uso Aceptable */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">4. Política de Uso Aceptable</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                Al utilizar Aliado AI, se compromete a no:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Enviar contenido ilegal, abusivo, amenazante o que viole los derechos de terceros</li>
                <li>Utilizar el servicio para crear o distribuir spam</li>
                <li>Intentar acceder no autorizado a nuestros sistemas</li>
                <li>Interferir con el funcionamiento normal del servicio</li>
                <li>Reproducir, duplicar o copiar cualquier parte del servicio sin autorización</li>
                <li>Utilizar el servicio de manera que viole las políticas de WhatsApp Business</li>
              </ul>
            </div>
          </section>

          {/* 5. Suscripción y Pagos */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">5. Suscripción y Pagos</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Aliado AI ofrece planes de suscripción con diferentes características y limitaciones. Los precios y 
                características están sujetos a cambios con previo aviso.
              </p>
              <p className="text-slate-700 leading-relaxed mb-2">
                <strong>Facturación:</strong> Las suscripciones se facturan por adelantado de manera mensual o anual 
                según el plan seleccionado. Los pagos no son reembolsables excepto cuando la ley lo requiera.
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>Cancelación:</strong> Puede cancelar su suscripción en cualquier momento desde su panel de 
                control. El acceso continuará hasta el final del período de facturación actual.
              </p>
            </div>
          </section>

          {/* 6. Privacidad y Datos */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">6. Privacidad y Protección de Datos</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                El manejo de sus datos personales se rige por nuestra Política de Privacidad. Al usar nuestro servicio, 
                consiente el procesamiento de sus datos según se describe en dicha política.
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>Datos de Conversaciones:</strong> Las conversaciones procesadas a través de nuestro servicio 
                pueden almacenarse temporalmente para mejorar la funcionalidad y generar métricas. No compartimos 
                contenido de conversaciones con terceros sin su consentimiento explícito.
              </p>
            </div>
          </section>

          {/* 7. Propiedad Intelectual */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">7. Propiedad Intelectual</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Aliado AI y todo su contenido, características y funcionalidad son propiedad de nuestra empresa y están 
                protegidos por las leyes de derechos de autor y propiedad intelectual.
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>Licencia de Uso:</strong> Le otorgamos una licencia limitada, no exclusiva y revocable para 
                utilizar nuestro servicio únicamente para sus fines comerciales legítimos.
              </p>
            </div>
          </section>

          {/* 8. Limitación de Responsabilidad */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">8. Limitación de Responsabilidad</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Aliado AI se proporciona "tal como está" sin garantías de ningún tipo. No seremos responsables por 
                daños indirectos, incidentales, especiales o consecuentes que resulten del uso del servicio.
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>Disponibilidad del Servicio:</strong> Aunque nos esforzamos por mantener el servicio disponible 
                24/7, no garantizamos disponibilidad continua y no seremos responsables por interrupciones temporales.
              </p>
            </div>
          </section>

          {/* 9. Terminación */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">9. Terminación del Servicio</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Podemos suspender o terminar su cuenta en cualquier momento por violación de estos términos o por 
                cualquier actividad que consideremos perjudicial para nuestro servicio o usuarios.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Al terminar su cuenta, perderá el acceso a todos los datos y configuraciones almacenadas en el servicio.
              </p>
            </div>
          </section>

          {/* 10. Modificaciones */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">10. Modificaciones a los Términos</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones serán 
                efectivas inmediatamente después de su publicación en nuestro sitio web.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Es su responsabilidad revisar estos términos periódicamente. El uso continuado del servicio después 
                de cualquier modificación constituye su aceptación de los nuevos términos.
              </p>
            </div>
          </section>

          {/* 11. Ley Aplicable */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">11. Ley Aplicable y Jurisdicción</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta en los tribunales 
                competentes de la Ciudad de México.
              </p>
            </div>
          </section>

          {/* 12. Contacto */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">12. Información de Contacto</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:
              </p>
              <div className="bg-slate-50 p-6 rounded-xl">
                <p className="text-slate-700 mb-2"><strong>Email:</strong> legal@aliado.ai</p>
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
            Al utilizar Aliado AI, usted acepta estar sujeto a estos Términos y Condiciones.
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            Ir a Aliado AI
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicTermsPage;