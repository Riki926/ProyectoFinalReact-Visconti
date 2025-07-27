# 🛒 **BitStore - E-commerce React + Firebase**

> E-commerce moderno desarrollado con React y Firebase, diseñado para ofrecer una experiencia de compra fluida y profesional.

![BitStore Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=BitStore+-+E-commerce+Profesional)

## 🚀 **Características**

- ✅ **Navegación intuitiva** con React Router DOM
- ✅ **Gestión de estado** con Context API y localStorage
- ✅ **Base de datos** Firebase Firestore (SIN productos hardcodeados)
- ✅ **Carrito persistente** que conserva productos al refrescar
- ✅ **Validaciones robustas** de formularios (nombres solo letras, teléfonos solo números)
- ✅ **Diseño responsivo** y moderno
- ✅ **Componentes modulares** con CSS independiente
- ✅ **Comprobante completo** con datos del cliente y productos
- ✅ **Deploy optimizado** para Netlify

## 🛠️ **Tecnologías Utilizadas**

- **Frontend**: React 18 + Vite
- **Router**: React Router DOM v6
- **Base de datos**: Firebase Firestore
- **Estilos**: CSS Modules organizados por componente
- **Validación**: Funciones personalizadas robustas
- **Deployment**: Netlify con configuración SPA

## 📁 **Estructura del Proyecto**

```
src/
├── components/
│   ├── Navbar.jsx
│   └── ProductCard.jsx
├── context/
│   └── CartContext.jsx
├── firebase/
│   ├── config.js
│   └── services.js
├── pages/
│   ├── Home.jsx
│   ├── Category.jsx
│   ├── ProductDetail.jsx
│   ├── Checkout.jsx
│   └── OrderConfirmation.jsx
├── styles/
│   ├── global.css
│   ├── Navbar.css
│   ├── ProductCard.css
│   ├── Home.css
│   ├── Category.css
│   ├── ProductDetail.css
│   ├── Checkout.css
│   └── OrderConfirmation.css
├── utils/
│   ├── validations.js
│   └── helpers.js
├── App.jsx
└── main.jsx
```

## 📦 **Instalación y Configuración**

### **1. Clonar el Repositorio**
```bash
# Limpiar tu repo actual
rm -rf .git
git init
git add .
git commit -m "Initial commit: BitStore refactored"

# Crear nuevo repositorio en GitHub y conectar
git remote add origin https://github.com/TU-USUARIO/bitstore-ecommerce.git
git push -u origin main
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Configurar Firebase**

El proyecto ya está configurado con Firebase. Las colecciones necesarias son:

#### **Productos (`products`)**
```javascript
{
  id: "unique-product-id",
  name: "Nombre del producto",
  description: "Descripción detallada",
  price: 50000,
  category: "auriculares", // auriculares, notebooks, celulares, tablets
  image: "https://url-imagen.jpg",
  stock: 10,
  featured: true // para productos destacados
}
```

#### **Órdenes (`orders`)**
```javascript
{
  orderNumber: "BS-1234567890-123",
  customer: {
    name: "Juan Pérez",
    email: "juan@email.com", 
    phone: "1234567890",
    address: "Calle 123",
    city: "Buenos Aires",
    postalCode: "1001"
  },
  items: [
    {
      id: "product-id",
      name: "Producto",
      price: 50000,
      quantity: 2,
      category: "auriculares",
      total: 100000
    }
  ],
  summary: {
    totalItems: 2,
    totalPrice: 100000
  },
  createdAt: Timestamp,
  status: "pending"
}
```

### **4. Ejecutar el Proyecto**
```bash
npm run dev
```

## 🔧 **Scripts Disponibles**

- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción

## 🌐 **Deploy en Netlify**

### **Método 1: Deploy Automático desde GitHub**

1. **Conectar repositorio a Netlify:**
   - Ir a [netlify.com](https://netlify.com)
   - "New site from Git" → Conectar GitHub
   - Seleccionar tu repositorio `bitstore-ecommerce`

2. **Configuración de build:**
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 18
   ```

3. **Variables de entorno (opcional):**
   - Si usas variables de entorno, configurarlas en Netlify

### **Método 2: Deploy Manual**

```bash
# Construir el proyecto
npm run build

# Subir carpeta dist/ a Netlify manualmente
```

### **Configuración Automática**

El proyecto incluye `netlify.toml` que configura automáticamente:
- Redirects para SPA
- Headers de cache
- Versión de Node.js

## ✨ **Características Implementadas**

### **🔒 Validaciones Correctas**
- **Nombres**: Solo acepta letras, espacios y acentos
- **Teléfonos**: Solo acepta números, espacios, guiones y paréntesis
- **Emails**: Validación RFC compliant
- **Direcciones**: Longitud mínima y máxima
- **Códigos postales**: Solo números de 4-8 dígitos

### **🛒 Carrito Persistente**
- Mantiene productos al refrescar la página
- Gestión segura con localStorage
- Recuperación automática de datos

### **📱 Diseño Responsivo**
- Mobile-first approach
- Breakpoints optimizados (480px, 768px)
- Interfaz adaptiva en todos los dispositivos

### **🎨 UX/UI Profesional**
- Transiciones suaves
- Estados de carga informativos
- Feedback visual inmediato
- Navegación intuitiva con React Router

### **📋 Comprobante Completo**
Al finalizar la compra se muestra:
- ✅ ID de la orden
- ✅ Datos completos del cliente
- ✅ Lista detallada de productos comprados
- ✅ Precios unitarios y totales
- ✅ Información de entrega
- ✅ Opción de imprimir comprobante

## 🚨 **Diferencias con el Código Anterior**

### **❌ Problemas Corregidos:**
1. **Router mal implementado** → ✅ BrowserRouter correcto con rutas funcionales
2. **Productos hardcodeados** → ✅ 100% desde Firebase Firestore
3. **Carrito sin persistencia** → ✅ localStorage funcional
4. **Validaciones incorrectas** → ✅ Validaciones robustas por tipo de dato
5. **Comprobante incompleto** → ✅ Comprobante con TODOS los datos
6. **CSS desorganizado** → ✅ CSS modular por componente
7. **Navegación rota** → ✅ Navegación fluida entre categorías

### **✅ Nuevas Características:**
- Context API profesional con useReducer
- Servicios de Firebase organizados
- Componentes completamente modulares
- Manejo de errores robusto
- Estados de carga profesionales
- SEO optimizado

## 🔗 **Enlaces Importantes**

- **Demo Live**: [bitstore.netlify.app](https://bitstore.netlify.app) *(actualizar con tu URL)*
- **Repositorio**: [GitHub](https://github.com/TU-USUARIO/bitstore-ecommerce)
- **Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com)

## 📞 **Soporte**

Si tienes alguna consulta:
- **Email**: soporte@bitstore.com
- **Issues**: [GitHub Issues](https://github.com/TU-USUARIO/bitstore-ecommerce/issues)

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**BitStore** - E-commerce profesional desarrollado con React + Firebase  
*Desarrollado con ❤️ para demostrar mejores prácticas de desarrollo web* 