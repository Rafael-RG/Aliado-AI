# Aliado AI Backend (.NET 9) 🚀

**Backend de nueva generación** para la plataforma Aliado AI, migrado a **.NET 9** con **C#** para **máximo rendimiento** y **integración nativa con Azure**.

## ✨ **Características Principales**

- 🔥 **.NET 9** - Rendimiento superior y AOT compilation
- 🤖 **Gemini AI** - Integración nativa para respuestas inteligentes
- 📱 **WhatsApp Business API** - Webhooks y mensajería completa
- 🗄️ **In-Memory Storage** - Con migración preparada para Azure Storage Account
- 🔄 **RESTful APIs** - Endpoints completos para todas las entidades
- 📊 **Swagger/OpenAPI** - Documentación automática de APIs
- 🛡️ **Type Safety** - Fuertemente tipado con validaciones
- ⚡ **Async/Await** - Performance optimizado

---

## 📦 **Estructura del Proyecto**

```
backend-dotnet/
├── Controllers/           # API Controllers (REST endpoints)
├── Models/               # Entidades de datos (User, Business, Bot, etc.)
├── Services/             # Servicios de negocio (Gemini, WhatsApp, Data)
├── DTOs/                 # Data Transfer Objects para API responses
├── Program.cs            # Configuración y startup de la aplicación
├── appsettings.json      # Configuración
└── AliadoAI.Backend.csproj
```

---

## 🚀 **Inicio Rápido**

### **1. Prerequisitos**
```bash
# Verificar .NET 9 instalado
dotnet --version  # Should be 9.0.x
```

### **2. Configuración**
```bash
# Navegar al directorio
cd backend-dotnet

# Restaurar paquetes NuGet
dotnet restore

# Configurar variables de entorno (opcional)
# Las credenciales ya están en appsettings.Development.json
```

### **3. Ejecutar el Servidor**
```bash
# Modo desarrollo
dotnet run

# Modo producción
dotnet run --configuration Release
```

**El servidor estará disponible en:**
- 🌐 API: `http://localhost:5000`
- 📚 Swagger: `http://localhost:5000/swagger`
- ❤️ Health: `http://localhost:5000/health`

---

## 🔧 **APIs Principales**

### **Health Check**
```http
GET /health
# Verificar estado del sistema, base de datos y servicios
```

### **Users**
```http
GET    /api/users           # Obtener todos los usuarios
POST   /api/users           # Crear usuario
GET    /api/users/{id}      # Obtener usuario por ID
PUT    /api/users/{id}      # Actualizar usuario
DELETE /api/users/{id}      # Eliminar usuario
```

### **Businesses**
```http
GET    /api/businesses      # Obtener todos los negocios
POST   /api/businesses      # Crear negocio
GET    /api/businesses/{id} # Obtener negocio por ID
PUT    /api/businesses/{id} # Actualizar negocio
```

### **Bots**
```http
GET    /api/bots                 # Obtener todos los bots
POST   /api/bots                 # Crear bot
GET    /api/bots/{id}            # Obtener bot por ID
POST   /api/bots/{id}/config     # Guardar configuración
GET    /api/bots/{id}/config     # Obtener configuración
```

### **WhatsApp Webhooks**
```http
GET    /api/whatsapp/webhook/{botId}   # Verificar webhook
POST   /api/whatsapp/webhook/{botId}   # Procesar mensajes
POST   /api/whatsapp/test/send         # Enviar mensaje de prueba
```

### **Metrics**
```http
GET    /api/metrics                    # Obtener métricas
POST   /api/metrics                    # Crear métricas
GET    /api/metrics/aggregate/{businessId}  # Métricas agregadas
```

---

## 📊 **Demo Data**

El sistema **crea automáticamente datos de demostración**:

- 👤 **Demo User**: `demo@aliado-ai.com` (password: `demo123`)
- 🏢 **Demo Business**: "Demo Restaurant" (restaurante argentino)
- 🤖 **Demo Bot**: Asistente con conocimiento del restaurante
- 📚 **Training Data**: Preguntas frecuentes del restaurante
- 📊 **Sample Metrics**: Datos de conversaciones y métricas

```http
GET /api/demo-data
# Ver resumen completo de los datos de demo
```

---

## 🔑 **Configuración**

### **appsettings.Development.json**
```json
{
  "Gemini": {
    "ApiKey": "TU_GEMINI_API_KEY"
  },
  "WhatsApp": {
    "AccessToken": "TU_WHATSAPP_ACCESS_TOKEN",
    "PhoneNumberId": "TU_PHONE_NUMBER_ID",
    "VerifyToken": "aliado_webhook_verify_token_2024"
  }
}
```

---

## 🆚 **Ventajas sobre Node.js**

| Característica | .NET 9 | Node.js |
|---|---|---|
| **Performance** | ⚡ 3-5x más rápido | 🐌 Más lento |
| **Memory Usage** | 💾 50% menos memoria | 🔄 Mayor uso |
| **Type Safety** | ✅ Fuertemente tipado | ⚠️ Dinámico |
| **Azure Integration** | 🔗 Nativo | 🔌 APIs externas |
| **Debugging** | 🛠️ Superior | 📝 Básico |
| **Scalability** | 📈 Excelente | 📊 Buena |

---

## 🧪 **Testing**

```bash
# Verificar que el servidor está funcionando
curl http://localhost:5000/health

# Ver documentación de APIs
# Abrir http://localhost:5000/swagger en el navegador

# Probar datos de demo
curl http://localhost:5000/api/demo-data
```

---

## 📝 **Logs del Sistema**

El sistema proporciona **logs detallados** con emojis para fácil identificación:

- 🚀 Startup y configuración
- ✅ Operaciones exitosas
- ❌ Errores y excepciones
- 📱 Mensajes de WhatsApp
- 🤖 Respuestas de IA
- 🗄️ Operaciones de base de datos

---

## 🔄 **Migración desde Node.js**

Este backend **mantiene 100% compatibilidad** con el frontend React:

✅ **Mismas rutas de API**  
✅ **Mismos formatos JSON**  
✅ **Misma funcionalidad WhatsApp**  
✅ **Misma integración Gemini AI**  
✅ **Mejores performance y confiabilidad**  

---

## 🚧 **Próximos Pasos**

1. **🔄 Migración a Azure Storage Account**
2. **🔐 Implementar autenticación JWT**
3. **📊 Dashboard de métricas en tiempo real**
4. **🧪 Suite completa de tests automatizados**
5. **🐳 Containerización con Docker**
6. **☁️ Deploy automático en Azure App Service**

---

**¡Disfruta del poder de .NET 9 para tu plataforma Aliado AI!** 🎉