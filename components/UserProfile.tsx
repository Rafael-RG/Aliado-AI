import React, { useState } from 'react';
import { ICONS } from '../constants';

interface Props {
  user: any;
  onUpdateUser: (updates: any) => void;
  onLogout: () => void;
  onNavigate: (page: 'terms' | 'usage') => void;
}

const UserProfile: React.FC<Props> = ({ user, onUpdateUser, onLogout, onNavigate }) => {
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'subscription' | 'support' | 'legal'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Usuario Demo',
    email: user?.email || 'demo@aliado.ai',
    phone: user?.phone || '+52 999 123 4567',
    company: user?.company || 'Mi Empresa',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company
      });
      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (formData.newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Contraseña cambiada exitosamente');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    const confirm = window.confirm(
      '¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso a todas las funciones premium.'
    );
    if (!confirm) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onUpdateUser({ isSubscribed: false, plan: 'free' });
      alert('Suscripción cancelada. Tu plan seguirá activo hasta el final del período de facturación.');
    } catch (error) {
      alert('Error al cancelar la suscripción');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSupport = async () => {
    if (!supportMessage.trim()) {
      alert('Por favor escribe tu mensaje de soporte');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Mensaje enviado exitosamente. Te responderemos en las próximas 24 horas.');
      setSupportMessage('');
    } catch (error) {
      alert('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: <ICONS.User className="w-5 h-5" /> },
    { id: 'security', label: 'Seguridad', icon: <ICONS.Shield className="w-5 h-5" /> },
    { id: 'subscription', label: 'Suscripción', icon: <ICONS.Wallet className="w-5 h-5" /> },
    { id: 'support', label: 'Soporte', icon: <ICONS.MessageCircle className="w-5 h-5" /> },
    { id: 'legal', label: 'Legal', icon: <ICONS.FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mi Perfil</h1>
        <p className="text-slate-500">Administra tu cuenta y configuración de Aliado IA</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        {/* General Section */}
        {activeSection === 'general' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Información General</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium transition-all"
              >
                <ICONS.Edit className="w-4 h-4" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Empresa</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  disabled={!isEditing}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none disabled:bg-slate-50"
                />
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            )}
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Seguridad</h2>

            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Cambiar Contraseña</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Contraseña actual</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Cerrar Sesión</h3>
              <p className="text-red-700 text-sm mb-4">
                Cerrar sesión en todos los dispositivos. Tendrás que volver a iniciar sesión.
              </p>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}

        {/* Subscription Section */}
        {activeSection === 'subscription' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Mi Suscripción</h2>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Plan Actual</h3>
                  <p className="text-slate-500 text-sm">Plan {user?.plan === 'pro' ? 'Profesional' : 'Gratuito'}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  user?.isSubscribed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {user?.isSubscribed ? 'Activo' : 'Inactivo'}
                </div>
              </div>

              {user?.isSubscribed && (
                <>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <div className="text-2xl font-bold text-slate-900">∞</div>
                      <div className="text-sm text-slate-500">Bots</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <div className="text-2xl font-bold text-slate-900">∞</div>
                      <div className="text-sm text-slate-500">Mensajes</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <div className="text-2xl font-bold text-slate-900">24/7</div>
                      <div className="text-sm text-slate-500">Soporte</div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-red-900 mb-2">Cancelar Suscripción</h4>
                    <p className="text-red-700 text-sm mb-4">
                      Tu suscripción seguirá activa hasta el final del período de facturación actual.
                      Después perderás acceso a las funciones premium.
                    </p>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                    >
                      {loading ? 'Cancelando...' : 'Cancelar suscripción'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Support Section */}
        {activeSection === 'support' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Soporte Técnico</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contacto Directo</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <ICONS.Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <div className="font-bold text-slate-900">Email</div>
                      <div className="text-sm text-slate-500">soporte@aliado.ai</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <ICONS.MessageCircle className="w-5 h-5 text-slate-500" />
                    <div>
                      <div className="font-bold text-slate-900">WhatsApp</div>
                      <div className="text-sm text-slate-500">+52 999 123 4567</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <ICONS.Clock className="w-5 h-5 text-slate-500" />
                    <div>
                      <div className="font-bold text-slate-900">Horario</div>
                      <div className="text-sm text-slate-500">Lun-Vie 9:00-18:00</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Enviar Mensaje</h3>
                <div className="space-y-4">
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe tu problema o pregunta..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none h-32 resize-none"
                  />
                  <button
                    onClick={handleSendSupport}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Recursos de Ayuda</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="#" className="flex items-center gap-3 p-3 hover:bg-blue-100 rounded-xl transition-colors">
                  <ICONS.FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Documentación</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 hover:bg-blue-100 rounded-xl transition-colors">
                  <ICONS.Play className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Tutoriales en Video</span>
                </a>
                <button onClick={() => onNavigate('usage')} className="flex items-center gap-3 p-3 hover:bg-blue-100 rounded-xl transition-colors text-left">
                  <ICONS.HelpCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Guía de Uso</span>
                </button>
                <a href="#" className="flex items-center gap-3 p-3 hover:bg-blue-100 rounded-xl transition-colors">
                  <ICONS.Users className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Comunidad</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Legal Section */}
        {activeSection === 'legal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Información Legal</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ICONS.Shield className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Términos y Condiciones</h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Revisa nuestros términos de servicio, políticas de uso y condiciones legales.
                    </p>
                    <button
                      onClick={() => onNavigate('terms')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      Ver términos
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ICONS.HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Guía de Uso</h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Aprende a usar Aliado AI con nuestra guía completa paso a paso.
                    </p>
                    <button
                      onClick={() => onNavigate('usage')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      Ver guía
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Información de la Empresa</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 mb-2"><strong>Razón Social:</strong> Aliado AI Technologies S.A. de C.V.</p>
                  <p className="text-slate-600 mb-2"><strong>RFC:</strong> AAI240101ABC</p>
                  <p className="text-slate-600 mb-2"><strong>Registro:</strong> México, 2024</p>
                </div>
                <div>
                  <p className="text-slate-600 mb-2"><strong>Domicilio:</strong> Ciudad de México, México</p>
                  <p className="text-slate-600 mb-2"><strong>Email Legal:</strong> legal@aliado.ai</p>
                  <p className="text-slate-600 mb-2"><strong>Teléfono:</strong> +52 999 123 4567</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Importante</h3>
              <p className="text-yellow-800 text-sm">
                Al utilizar nuestros servicios, aceptas automáticamente nuestros términos y condiciones. 
                Te recomendamos leer toda la documentación legal para entender tus derechos y obligaciones.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;