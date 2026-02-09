# 🤖 Aliado AI - WhatsApp Business Automation Platform

**Plataforma de automatización inteligente para WhatsApp Business con IA de nueva generación. Migrado a **.NET 9** para máximo rendimiento y escalabilidad.**

---

## ✨ **Características Principales**

### 🚀 **INTEGRACIÓN WHATSAPP REAL**
- ✅ **WhatsApp Business API** oficial de Meta
- ✅ **Webhooks en tiempo real** para mensajes
- ✅ **Respuestas automáticas** con Gemini AI
- ✅ **Conversaciones con memoria** y contexto
- ✅ **Escalamiento inteligente** a humanos

### 🧠 **IA GEMINI AVANZADA**
- ✅ **Gemini 1.5 Flash** para respuestas naturales
- ✅ **Detección de intenciones** (ventas, soporte, info)
- ✅ **Personalización por negocio** (tono, rol, conocimiento)
- ✅ **Entrenamiento personalizado** con FAQs
- ✅ **Multi-idioma** y contextual

### 💼 **GESTIÓN EMPRESARIAL**
- ✅ **Multi-bot** para diferentes negocios
- ✅ **Dashboard visual** sin código
- ✅ **Métricas en tiempo real** y analytics
- ✅ **Widget web embebible** para sitios
- ✅ **Sistema de suscripciones** y planes

### 🔥 **ARQUITECTURA MODERNA**
- ✅ **Frontend React 19** con TypeScript
- ✅ **Backend .NET 9** de alto rendimiento
- ✅ **Azure-ready** para producción
- ✅ **RESTful APIs** completamente documentadas
- ✅ **In-memory storage** con migración Azure preparada

---

## 🚀 **Instalación Rápida**

### **1. Prerequisitos**
```bash
# Verificar versiones
node --version   # v18+
dotnet --version # 9.0+
```

### **2. Instalar Dependencias**
```bash
# Frontend React
npm install

# Backend .NET 9
cd backend
dotnet restore
cd ..
```

### **3. Configuración**
```bash
# Frontend - .env.local (crear si no existe)
VITE_API_URL=http://localhost:5000

# Backend - backend/appsettings.Development.json (ya configurado)
# Gemini API Key: AIzaSyCtlYLwS6UtkR_anqMpAa4_pHXDTRKo7j0
# WhatsApp Token: [Ya configurado para demo]
```

### **4. Ejecutar Aplicación**
```bash
# Terminal 1 - Backend .NET 9 (puerto 5000)
cd backend
dotnet run

# Terminal 2 - Frontend React (puerto 3000)
npm run dev
```

---

## 🌐 **URLs de la Aplicación**

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interfaz principal React |
| **Backend API** | http://localhost:5000 | APIs REST .NET 9 |
| **Swagger Docs** | http://localhost:5000/swagger | Documentación automática |
| **Health Check** | http://localhost:5000/health | Estado del sistema |
| **Demo Data** | http://localhost:5000/api/demo-data | Datos de muestra |

---

## 📁 **Estructura del Proyecto**

```
Aliado-AI/
├── 📱 Frontend (React 19 + TypeScript)
│   ├── components/          # Componentes UI reutilizables
│   ├── services/           # Servicios y APIs
│   ├── App.tsx             # App principal
│   └── vite.config.ts      # Configuración Vite
│
├── 🔥 Backend (.NET 9 + C#)
│   ├── Controllers/        # API REST endpoints
│   ├── Services/           # Lógica de negocio
│   ├── Models/             # Entidades de datos
│   ├── DTOs/               # Data Transfer Objects
│   └── Program.cs          # Configuración servidor
│
└── 📦 Archive
    └── backend-nodejs/     # Backend Node.js anterior
```

---

## 🎯 **APIs Principales**

### **🔍 Sistema**
```bash
GET  /health                    # Estado del servidor
GET  /api/demo-data            # Datos de demostración
GET  /swagger                  # Documentación API
```

### **👥 Usuarios**
```bash
GET    /api/users              # Listar usuarios
POST   /api/users              # Crear usuario
GET    /api/users/{id}         # Obtener usuario
PUT    /api/users/{id}         # Actualizar usuario
DELETE /api/users/{id}         # Eliminar usuario
```

### **🏢 Negocios**
```bash
GET  /api/businesses           # Listar negocios
POST /api/businesses           # Crear negocio
GET  /api/businesses/{id}      # Obtener negocio
PUT  /api/businesses/{id}      # Actualizar negocio
```

### **🤖 Bots**
```bash
GET  /api/bots                 # Listar bots
POST /api/bots                 # Crear bot
GET  /api/bots/{id}/config     # Configuración bot
POST /api/bots/{id}/config     # Guardar configuración
```

### **📱 WhatsApp**
```bash
GET  /api/whatsapp/webhook/{botId}     # Verificar webhook
POST /api/whatsapp/webhook/{botId}     # Procesar mensajes
POST /api/whatsapp/test/send           # Enviar mensaje prueba
```

---

## 🧪 **Datos de Demo**

El sistema **inicializa automáticamente** datos de demostración:

- 👤 **Usuario Demo**: `demo@aliado-ai.com` (plan pro)
- 🍴 **Restaurante Demo**: "Demo Restaurant" (argentino)
- 🤖 **Bot Demo**: Asistente entrenado para restaurante
- 📚 **FAQs**: Horarios, especialidades, reservas
- 📊 **Métricas**: Conversaciones y performance

---

## 🔧 **Desarrollo**

### **VS Code (Recomendado)**
```bash
# Extensiones recomendadas
ext install ms-dotnettools.csharp        # C# support
ext install bradlc.vscode-tailwindcss    # Tailwind CSS
ext install ms-vscode.vscode-typescript  # TypeScript
```

### **Testing APIs**
```bash
# Swagger UI
http://localhost:5000/swagger

# Ejemplos curl
curl http://localhost:5000/health
curl http://localhost:5000/api/users
curl http://localhost:5000/api/demo-data
```

---

## 📦 **Deploy & Producción**

### **Frontend (Vercel/Netlify)**
```bash
npm run build
# Deploy carpeta dist/
```

### **Backend (Azure App Service)**
```bash
dotnet publish -c Release
# Deploy a Azure App Service
```

### **Variables de Producción**
```json
{
  "Gemini": { "ApiKey": "tu-gemini-key-production" },
  "WhatsApp": {
    "AccessToken": "tu-whatsapp-token",
    "PhoneNumberId": "tu-phone-number-id"
  }
}
```

---

## 🎉 **Features Implementados**

✅ **Sistema completo de usuarios y autenticación**  
✅ **Gestión multi-negocio con bots personalizados**  
✅ **Integración WhatsApp Business API real**  
✅ **IA Gemini con entrenamiento personalizado**  
✅ **APIs REST completamente documentadas**  
✅ **Storage abstracto con migración Azure preparada**  
✅ **Sistema de métricas y analytics**  
✅ **Frontend responsive con componentes modernos**  

---

## 🚀 **Próximas Features**

🔄 **Autenticación JWT**  
☁️ **Migración a Azure Storage Account**  
📊 **Dashboard analytics avanzado**  
🔔 **Sistema de notificaciones**  
🐳 **Containerización Docker**  
🌍 **Deploy automatizado CI/CD**  

---

**¡Potencia tu negocio con Aliado AI! 🚀**
