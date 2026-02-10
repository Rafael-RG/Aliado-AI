import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';

interface Props {
  onClose?: () => void;
}

const TermsAndConditions: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Términos y Condiciones de Uso</h1>
          <p className="text-slate-500">Última actualización: 10 de febrero de 2026</p>
        </div>
        <button
          onClick={handleClose}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
        >
          <ICONS.ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8">
        
        {/* 1. Aceptación de los Términos */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Aceptación de los Términos</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Al acceder y utilizar Aliado AI ("el Servicio"), usted acepta estar sujeto a estos Términos y Condiciones 
              ("los Términos"). Si no está de acuerdo con alguno de estos términos, no debe usar nuestro servicio.
            </p>
          </div>
        </section>

        {/* 2. Descripción del Servicio */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Descripción del Servicio</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Aliado AI es una plataforma de automatización de conversaciones que permite a las empresas crear 
              y desplegar chatbots inteligentes para WhatsApp Business API utilizando tecnología de inteligencia artificial.
            </p>
            <p>
              El servicio incluye, pero no se limita a:
            </p>
            <ul>
              <li>Creación y entrenamiento de bots conversacionales</li>
              <li>Integración con WhatsApp Business API</li>
              <li>Análisis y métricas de conversaciones</li>
              <li>Herramientas de configuración y personalización</li>
            </ul>
          </div>
        </section>

        {/* 3. Registro y Cuenta */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Registro y Cuenta de Usuario</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Para utilizar nuestro servicio, debe crear una cuenta proporcionando información precisa y actualizada. 
              Usted es responsable de mantener la confidencialidad de sus credenciales de acceso.
            </p>
            <p>
              Se compromete a:
            </p>
            <ul>
              <li>Proporcionar información veraz y precisa</li>
              <li>Mantener actualizada su información de cuenta</li>
              <li>Proteger la seguridad de su contraseña</li>
              <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
            </ul>
          </div>
        </section>

        {/* 4. Uso Aceptable */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Política de Uso Aceptable</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Al utilizar Aliado AI, se compromete a no:
            </p>
            <ul>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Suscripción y Pagos</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Aliado AI ofrece planes de suscripción con diferentes características y limitaciones. Los precios y 
              características están sujetos a cambios con previo aviso.
            </p>
            <p>
              <strong>Facturación:</strong> Las suscripciones se facturan por adelantado de manera mensual o anual 
              según el plan seleccionado. Los pagos no son reembolsables excepto cuando la ley lo requiera.
            </p>
            <p>
              <strong>Cancelación:</strong> Puede cancelar su suscripción en cualquier momento desde su panel de 
              control. El acceso continuará hasta el final del período de facturación actual.
            </p>
          </div>
        </section>

        {/* 6. Privacidad y Datos */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Privacidad y Protección de Datos</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              El manejo de sus datos personales se rige por nuestra Política de Privacidad. Al usar nuestro servicio, 
              consiente el procesamiento de sus datos según se describe en dicha política.
            </p>
            <p>
              <strong>Datos de Conversaciones:</strong> Las conversaciones procesadas a través de nuestro servicio 
              pueden almacenarse temporalmente para mejorar la funcionalidad y generar métricas. No compartimos 
              contenido de conversaciones con terceros sin su consentimiento explícito.
            </p>
          </div>
        </section>

        {/* 7. Propiedad Intelectual */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Propiedad Intelectual</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Aliado AI y todo su contenido, características y funcionalidad son propiedad de nuestra empresa y están 
              protegidos por las leyes de derechos de autor y propiedad intelectual.
            </p>
            <p>
              <strong>Licencia de Uso:</strong> Le otorgamos una licencia limitada, no exclusiva y revocable para 
              utilizar nuestro servicio únicamente para sus fines comerciales legítimos.
            </p>
          </div>
        </section>

        {/* 8. Limitación de Responsabilidad */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitación de Responsabilidad</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Aliado AI se proporciona "tal como está" sin garantías de ningún tipo. No seremos responsables por 
              daños indirectos, incidentales, especiales o consecuentes que resulten del uso del servicio.
            </p>
            <p>
              <strong>Disponibilidad del Servicio:</strong> Aunque nos esforzamos por mantener el servicio disponible 
              24/7, no garantizamos disponibilidad continua y no seremos responsables por interrupciones temporales.
            </p>
          </div>
        </section>

        {/* 9. Terminación */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Terminación del Servicio</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Podemos suspender o terminar su cuenta en cualquier momento por violación de estos términos o por 
              cualquier actividad que consideremos perjudicial para nuestro servicio o usuarios.
            </p>
            <p>
              Al terminar su cuenta, perderá el acceso a todos los datos y configuraciones almacenadas en el servicio.
            </p>
          </div>
        </section>

        {/* 10. Modificaciones */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Modificaciones a los Términos</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones serán 
              efectivas inmediatamente después de su publicación en nuestro sitio web.
            </p>
            <p>
              Es su responsabilidad revisar estos términos periódicamente. El uso continuado del servicio después 
              de cualquier modificación constituye su aceptación de los nuevos términos.
            </p>
          </div>
        </section>

        {/* 11. Ley Aplicable */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Ley Aplicable y Jurisdicción</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta en los tribunales 
              competentes de la Ciudad de México.
            </p>
          </div>
        </section>

        {/* 12. Contacto */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Información de Contacto</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl mt-4">
              <p><strong>Email:</strong> legal@aliado.ai</p>
              <p><strong>Teléfono:</strong> +52 999 123 4567</p>
              <p><strong>Dirección:</strong> Ciudad de México, México</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500 text-center">
            Al utilizar Aliado AI, usted acepta estar sujeto a estos Términos y Condiciones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;