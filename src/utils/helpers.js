// ===== FUNCIONES AUXILIARES =====

// Formatear precio en pesos argentinos
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Formatear fecha
export const formatDate = (date) => {
  const dateObj = date?.seconds ? new Date(date.seconds * 1000) : new Date(date)
  
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

// Capitalizar primera letra
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Generar número de orden único
export const generateOrderNumber = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `BS-${timestamp}-${random}`
}

// Obtener información de categoría
export const getCategoryInfo = (categoryId) => {
  const categories = {
    auriculares: {
      name: 'Auriculares',
      icon: '🎧',
      description: 'Audio de alta calidad con la mejor tecnología'
    },
    notebooks: {
      name: 'Notebooks',
      icon: '💻',
      description: 'Computadoras portátiles de alto rendimiento'
    },
    celulares: {
      name: 'Celulares',
      icon: '📱',
      description: 'Smartphones con la última tecnología'
    },
    tablets: {
      name: 'Tablets',
      icon: '📱',
      description: 'Tablets versátiles para trabajo y entretenimiento'
    },
    smarttv: {
      name: 'Smart TV',
      icon: '📺',
      description: 'Televisores inteligentes con tecnología avanzada'
    },
    monitores: {
      name: 'Monitores',
      icon: '🖥️',
      description: 'Pantallas profesionales y gaming'
    }
  }
  
  return categories[categoryId] || {
    name: capitalize(categoryId),
    icon: '📦',
    description: 'Productos de tecnología'
  }
} 