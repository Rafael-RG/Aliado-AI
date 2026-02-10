
import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(email || 'hola@aliadoia.com', name || 'Emprendedor');
  };

  const handleAuth = (userEmail: string, userName: string, isPro: boolean = false) => {
    const mockUser: User = {
      id: 'u' + Math.random().toString(36).substr(2, 5),
      email: userEmail,
      name: userName,
      isSubscribed: isPro,
      plan: isPro ? 'pro' : 'free'
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="max-w-[440px] w-full bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100 p-8 lg:p-12">
        
        {/* Header con Logo Aliado */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#10b981] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-green-100 mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            A
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {view === 'login' ? 'Bienvenido a Aliado' : 'Tu Negocio Inteligente'}
          </h1>
          <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">
            {view === 'login' 
              ? 'Accede para gestionar tus asistentes y ventas.' 
              : 'Empieza a automatizar tu negocio en pocos minutos.'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {view === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Tu Nombre</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all"
                placeholder="Ej. Juan Gómez"
              />
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Tu Correo</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-5 rounded-2xl font-bold text-base shadow-lg shadow-green-100 mt-4 active:scale-[0.98] transition-all">
            {view === 'login' ? 'Entrar al Panel' : 'Crear mi Aliado'}
          </button>
        </form>

        {/* Acceso Rápido Demos */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-300 font-bold tracking-widest">O prueba el sistema</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAuth('socio@aliadoia.com', 'Socio Premium', true)}
            className="flex flex-col items-center justify-center p-5 bg-green-50/50 border border-green-100 rounded-[24px] hover:bg-green-100/50 hover:shadow-md transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter text-center">Plan Socio Pro</span>
          </button>
          
          <button 
            onClick={() => handleAuth('hola@aliadoia.com', 'Invitado', false)}
            className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-100 rounded-[24px] hover:bg-slate-100 hover:shadow-md transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center mb-3 shadow-lg shadow-slate-100 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter text-center">Demo Gratis</span>
          </button>
        </div>

        <div className="mt-8 text-center space-y-4">
          <button 
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
            className="text-sm font-bold text-slate-400 hover:text-[#10b981] transition-colors block mx-auto"
          >
            {view === 'login' ? '¿Eres nuevo? Regístrate aquí' : '¿Ya tienes cuenta? Entra'}
          </button>
          
          <a 
            href="/terminos-de-uso-y-condiciones"
            className="text-xs font-medium text-slate-300 hover:text-slate-500 transition-colors inline-block"
          >
            Términos y Condiciones de Uso
          </a>
        </div>

        <p className="text-[9px] text-slate-200 font-bold uppercase tracking-[0.4em] text-center mt-8">ALIADO IA</p>
      </div>
    </div>
  );
};

export default Auth;
