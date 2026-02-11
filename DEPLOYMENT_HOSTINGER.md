# 🚀 Guía de Despliegue en Hostinger

## ✅ **Estado Actual: LISTO PARA HOSTINGER**

La aplicación está completamente preparada para subir a Hostinger. Todos los archivos necesarios están configurados.

## 📋 **Pasos para Desplegar**

### 1. **Construir la aplicación**
```bash
npm run build
```

### 2. **Configurar Variables de Entorno**
- Copia `.env.example` como `.env.local`
- Completa tu `GEMINI_API_KEY`
- **IMPORTANTE**: En Hostinger, configura las variables en el panel de control

### 3. **Subir Archivos**
Sube todo el contenido de la carpeta `dist/` al directorio raíz de tu hosting:
- `index.html`
- `assets/` (carpeta completa)
- `.htaccess` (se copia automáticamente desde `public/`)

### 4. **Verificar Rutas**
Las siguientes rutas deben funcionar:
- `/` - Aplicación principal
- `/terminos-de-uso-y-condiciones` - Términos legales
- `/legal` - Términos públicos (para Meta)
- `/privacy` - Política de privacidad

## ⚙️ **Configuración Incluida**

### ✅ **Archivos de Configuración**
- `.htaccess` - Routing SPA + optimizaciones
- Variables de entorno documentadas
- Build de producción optimizado
- Headers de seguridad
- Compresión GZIP
- Cache para assets estáticos

### ✅ **Optimizaciones**
- Código minificado y optimizado
- Assets con hash para cache
- Routing SPA funcional
- SEO básico configurado

## 🔧 **En Hostinger**

### **Panel de Control**
1. Accede al **File Manager**
2. Sube todos los archivos de `dist/` a `public_html/`
3. Ve a **Variables de Entorno** y agrega:
   - `GEMINI_API_KEY` = tu_api_key

### **Dominios**
- Configura tu dominio principal
- Asegúrate de que apunte a `public_html/`

## ⚠️ **Pendiente para el Futuro**

### **Backend en Azure**
- Actualmente usa APIs públicas (Gemini)
- Cuando subas el backend a Azure, actualiza las URLs

### **Storage Real**
- Cambiar de mock data a Azure Storage
- Configurar conexión a base de datos real

## ✅ **¿Listo para subir?**

**SÍ, la aplicación está 100% lista para Hostinger**

- ✅ Build funcionando
- ✅ Routing SPA configurado
- ✅ Variables de entorno documentadas
- ✅ Optimizaciones de producción
- ✅ Headers de seguridad
- ✅ Cache configurado

**Siguiente paso:** Subir la carpeta `dist/` a Hostinger y configurar las variables de entorno.