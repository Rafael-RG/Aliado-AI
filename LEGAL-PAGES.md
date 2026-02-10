# 📋 Páginas Legales - Aliado AI

## 🌐 URLs Públicas Disponibles

Para cumplir con los requisitos de Meta WhatsApp Business API, las siguientes páginas legales están disponibles públicamente:

### **Términos y Condiciones**
```
https://tu-dominio.com/legal
```
- ✅ Página completa de términos y condiciones
- ✅ Compatible con verificación de Meta
- ✅ Accesible sin autenticación
- ✅ Diseño responsivo

### **Política de Privacidad** 
```
https://tu-dominio.com/privacy
```
- ✅ Política completa de privacidad
- ✅ Información sobre manejo de datos
- ✅ Derechos del usuario
- ✅ Contacto para temas de privacidad

## 🔧 Configuración para Producción

### **1. Servidor Web (Nginx)**
Para que las rutas funcionen correctamente en producción, configura tu servidor web para redirigir todas las rutas no-API al `index.html`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### **2. Configuración de Meta WhatsApp Business**

Al registrar tu aplicación en Meta Developers:

- **Terms of Service URL:** `https://tu-dominio.com/legal`
- **Privacy Policy URL:** `https://tu-dominio.com/privacy`

### **3. Verificación Local**

En desarrollo, las rutas estarán disponibles en:
- http://localhost:3000/legal
- http://localhost:3000/privacy

## 📝 Contenido Incluido

### **Términos y Condiciones**
- Aceptación de términos
- Descripción del servicio
- Políticas de uso aceptable
- Información de suscripción y pagos
- Privacidad y protección de datos
- Propiedad intelectual
- Limitación de responsabilidad
- Información de contacto

### **Política de Privacidad**
- Información recopilada
- Cómo se usa la información
- Compartir información
- Seguridad de datos
- Retención de datos
- Derechos del usuario
- Cookies y seguimiento
- Contacto para privacidad

## 🚀 Próximos Pasos

1. **Actualizar dominio:** Reemplaza las URLs con tu dominio real
2. **Configurar servidor:** Implementa las reglas de redirección
3. **Registrar en Meta:** Usa las URLs en tu aplicación de WhatsApp Business
4. **Verificar funcionamiento:** Prueba que Meta pueda acceder a las páginas

## ⚖️ Información Legal

**Empresa:** Aliado AI Technologies S.A. de C.V.  
**Email Legal:** legal@aliado.ai  
**Email Privacidad:** privacidad@aliado.ai  
**Teléfono:** +52 999 123 4567  

---

✅ **Listo para producción:** Las páginas cumplen con los estándares legales y técnicos requeridos por Meta WhatsApp Business API.