// Constantes de la aplicación

// Categorías de productos
export const PRODUCT_CATEGORIES = {
  HEADPHONES: 'auriculares',
  PHONES: 'celulares',
  TABLETS: 'tablets',
  LAPTOPS: 'notebooks',
  MONITORS: 'monitores',
  CAMERAS: 'camaras',
  TV: 'smarttv'
}

// Labels para las categorías
export const CATEGORY_LABELS = {
  [PRODUCT_CATEGORIES.HEADPHONES]: 'Auriculares',
  [PRODUCT_CATEGORIES.PHONES]: 'Celulares',
  [PRODUCT_CATEGORIES.TABLETS]: 'Tablets',
  [PRODUCT_CATEGORIES.LAPTOPS]: 'Notebooks',
  [PRODUCT_CATEGORIES.MONITORS]: 'Monitores',
  [PRODUCT_CATEGORIES.CAMERAS]: 'Cámaras',
  [PRODUCT_CATEGORIES.TV]: 'Smart TV'
}

// Iconos para las categorías
export const CATEGORY_ICONS = {
  [PRODUCT_CATEGORIES.HEADPHONES]: '🎧',
  [PRODUCT_CATEGORIES.PHONES]: '📱',
  [PRODUCT_CATEGORIES.TABLETS]: '💊',
  [PRODUCT_CATEGORIES.LAPTOPS]: '💻',
  [PRODUCT_CATEGORIES.MONITORS]: '🖥️',
  [PRODUCT_CATEGORIES.CAMERAS]: '📷',
  [PRODUCT_CATEGORIES.TV]: '📺'
}

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  CATEGORY: '/categoria/:category',
  PRODUCT: '/producto/:id',
  CART: '/carrito',
  CHECKOUT: '/checkout'
}

// Estados de carga
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}

// Configuración de la aplicación
export const APP_CONFIG = {
  STORE_NAME: 'BitStore',
  STORE_DESCRIPTION: 'Tu tienda de tecnología de confianza',
  CURRENCY: 'ARS',
  CURRENCY_SYMBOL: '$'
} 