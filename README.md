# 🤖 Aliado AI - WhatsApp Business Automation

**El asistente inteligente que automatiza completamente tus conversaciones de WhatsApp para vender más y atender mejor a tus clientes.**

## ✨ Características

### 🚀 **INTEGRACIÓN REAL DE WHATSAPP**
- ✅ **WhatsApp Business API** oficial de Meta
- ✅ **Webhooks reales** para recibir mensajes
- ✅ **Respuestas automáticas** con IA Gemini
- ✅ **Conversaciones con memoria** y contexto
- ✅ **Escalamiento inteligente** a humanos

### 🧠 **IA Avanzada**
- ✅ **Gemini AI** para respuestas naturales
- ✅ **Detección de intenciones** (precios, quejas, saludos)
- ✅ **Personalización por negocio** (tono, rol, conocimiento)
- ✅ **Soporte multimodal** (texto, imágenes)

### 💼 **Gestión de Negocios**
- ✅ **Múltiples bots** para diferentes negocios
- ✅ **Configuración visual** sin código
- ✅ **Métricas en tiempo real** de conversaciones
- ✅ **Widget web** para sitios web

## 🚀 Instalación y Configuración

### Paso 1: Dependencias
```bash
npm install
cd backend && npm install
```

### Paso 2: Variables de Entorno
```bash
# Frontend (.env.local)
GEMINI_API_KEY=tu-gemini-api-key

# Backend (backend/.env)  
GEMINI_API_KEY=tu-gemini-api-key
WHATSAPP_ACCESS_TOKEN=tu-meta-access-token
WHATSAPP_PHONE_NUMBER_ID=tu-phone-number-id
```

### Paso 3: Ejecutar
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
cd backend && npm run dev
```

## 📱 Configuración de WhatsApp

### 1. Meta Business Setup
1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Crea una nueva app Business
3. Agrega el producto WhatsApp
4. Obtén tu Access Token y Phone Number ID

### 2. Webhook Configuration
1. Usa `ngrok http 3001` para exponer tu servidor local
2. Configura webhook en Meta con tu URL de ngrok
3. Verify Token: `aliado_webhook_verify_token_2024`

### 3. Configuración Guiada
1. Abre la app en http://localhost:3000
2. Ve a "Conectar WhatsApp" 
3. Sigue el asistente paso a paso
4. ¡Tu bot estará funcionando!

## 🏗️ Arquitectura

### Frontend (React + TypeScript)
- **App.tsx** - Aplicación principal
- **ConnectGuide.tsx** - Configuración de WhatsApp
- **BotTrainer.tsx** - Entrenamiento de bots
- **BotTester.tsx** - Pruebas de conversación

### Backend (Node.js + Express)
- **server.js** - Servidor principal con webhooks
- **message-processor.js** - IA para procesar mensajes  
- **meta-business.js** - Integración con Meta Business
- **response-manager.js** - Envío de mensajes con reintentos

### Servicios
- **geminiService.ts** - Integración con Gemini AI
- **whatsappIntegration.ts** - Cliente para backend

## 📊 Características Técnicas

### Procesamiento de Mensajes
- ✅ **Webhooks en tiempo real** de Meta Business
- ✅ **Detección automática de intención** del usuario
- ✅ **Escalamiento inteligente** cuando se requiere humano
- ✅ **Sistema de reintentos** para mensajes fallidos
- ✅ **Gestión de conversaciones** con contexto temporal

### Tipos de Respuestas
- ✅ **Mensajes de texto** con emojis
- ✅ **Botones interactivos** para opciones
- ✅ **Listas de selección** para muchas opciones
- ✅ **Imágenes con caption** para productos
- ✅ **Documentos PDF** para catálogos

## 🎯 Casos de Uso

### Para Negocios
- **Restaurantes** - Tomar pedidos, horarios, menú
- **E-commerce** - Consultas de productos, seguimiento de pedidos
- **Servicios** - Agendar citas, cotizaciones, soporte
- **Real Estate** - Información de propiedades, visitas
- **Salud** - Agendar consultas, recordatorios

### Para Desarrolladores/Agencias
- **SaaS WhatsApp** para múltiples clientes
- **Automatización de atención al cliente**
- **Generación de leads** automática
- **Integración con CRMs** existentes

## 📈 Beneficios

### Para el Negocio
- ⚡ **Respuesta inmediata** 24/7 a clientes
- 💰 **Aumento en ventas** por atención rápida
- 🕒 **Ahorro de tiempo** en tareas repetitivas  
- 📊 **Métricas detalladas** de conversaciones
- 🏆 **Mejor experiencia** de cliente

### Para Desarrolladores
- 🔧 **Arquitectura escalable** y bien documentada
- 🎨 **UI/UX profesional** lista para producción
- 🧪 **Fácil testing** y configuración
- 📚 **Código bien comentado** y estructurado
- 🔒 **Seguridad integrada** y validaciones

## 📚 Documentación

- **[WHATSAPP_SETUP_REAL.md](./WHATSAPP_SETUP_REAL.md)** - Guía completa de configuración
- **[backend/README.md](./backend/README.md)** - Documentación del backend
- **Código comentado** - Todas las funciones documentadas

## 🛡️ Producción

### Recomendaciones
- ✅ Usar dominio real con HTTPS (no ngrok)
- ✅ Base de datos para persistir configuraciones
- ✅ Rate limiting para evitar abuse
- ✅ Monitoring y alertas de errores
- ✅ Backup de conversaciones importantes

### Escalabilidad
- ✅ **Microservicios** separados por funcionalidad
- ✅ **Queue system** para mensajes de alta volumetría
- ✅ **LoadBalancer** para múltiples instancias
- ✅ **Redis** para cache y sesiones
- ✅ **Database** para persistencia

## 💡 Próximas Funcionalidades

- 🔄 **Integración con CRMs** (Hubspot, Salesforce)
- 📊 **Dashboard de Analytics** avanzado 
- 🎯 **Campañas automáticas** de marketing
- 🗣️ **Soporte de voz** para audio messages
- 🌐 **Multi-idioma** automático
- 🤖 **Entrenamientos personalizados** por industria

## 🤝 Contribución

Este proyecto está abierto a contribuciones. Si quieres agregar funcionalidades:

1. Fork del repositorio
2. Crea una rama feature
3. Realiza tus cambios
4. Prueba todo funcionando
5. Crea un Pull Request

## 📞 Soporte

¿Necesitas ayuda con la implementación?

- 📧 **Email**: soporte@aliadoia.com  
- 💬 **WhatsApp**: +54 9 11 1234-5678
- 📋 **Issues**: GitHub Issues de este repo
- 📖 **Docs**: Revisa los archivos README

---

**🎉 ¡Felicidades! Ahora tienes una solución completa y profesional de automatización de WhatsApp Business!** 

*Made with ❤️ by the Aliado AI Team*
