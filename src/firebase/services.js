import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore'
import { db } from './config'

// ===== SERVICIOS DE PRODUCTOS =====
export const productService = {
  // Obtener todos los productos
  async getAll() {
    try {
      const productsRef = collection(db, 'products')
      const snapshot = await getDocs(productsRef)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      throw new Error('No se pudieron cargar los productos')
    }
  },

  // Obtener producto por ID
  async getById(id) {
    try {
      const productRef = doc(db, 'products', id)
      const snapshot = await getDoc(productRef)
      
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        }
      } else {
        throw new Error('Producto no encontrado')
      }
    } catch (error) {
      console.error('Error obteniendo producto:', error)
      throw new Error('No se pudo cargar el producto')
    }
  },

  // Obtener productos por categoría - Mejorado con debugging y caso insensitive
  async getByCategory(category) {
    try {
      console.log(`🔍 Buscando productos para categoría: "${category}"`)
      
      // Normalizar la categoría (lowercase y trim)
      const normalizedCategory = category.toLowerCase().trim()
      
      // Primero intentar búsqueda exacta (case-sensitive)
      const productsRef = collection(db, 'products')
      let q = query(productsRef, where('category', '==', category))
      let snapshot = await getDocs(q)
      
      console.log(`📊 Búsqueda exacta para "${category}": ${snapshot.docs.length} productos`)
      
      // Si no encuentra nada, intentar búsqueda con lowercase
      if (snapshot.docs.length === 0) {
        q = query(productsRef, where('category', '==', normalizedCategory))
        snapshot = await getDocs(q)
        console.log(`📊 Búsqueda lowercase para "${normalizedCategory}": ${snapshot.docs.length} productos`)
      }
      
      // Si aún no encuentra nada, obtener todos los productos y filtrar manualmente
      if (snapshot.docs.length === 0) {
        console.log('🔄 Intentando filtrado manual...')
        const allSnapshot = await getDocs(productsRef)
        const allProducts = allSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        console.log(`📦 Total de productos en la base: ${allProducts.length}`)
        
        // Log de todas las categorías disponibles
        const availableCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))]
        console.log('🏷️ Categorías disponibles:', availableCategories)
        
        // Filtrar manualmente (case-insensitive)
        const filteredProducts = allProducts.filter(product => 
          product.category && product.category.toLowerCase().trim() === normalizedCategory
        )
        
        console.log(`✅ Productos filtrados manualmente: ${filteredProducts.length}`)
        return filteredProducts.sort((a, b) => a.title?.localeCompare(b.title) || a.name?.localeCompare(b.name))
      }
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      console.log(`✅ Productos encontrados: ${products.length}`)
      return products.sort((a, b) => a.title?.localeCompare(b.title) || a.name?.localeCompare(b.name))
      
    } catch (error) {
      console.error('❌ Error obteniendo productos por categoría:', error)
      throw new Error('No se pudieron cargar los productos de esta categoría')
    }
  },

  // Obtener productos destacados
  async getFeatured() {
    try {
      const productsRef = collection(db, 'products')
      const q = query(productsRef, where('featured', '==', true))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo productos destacados:', error)
      throw new Error('No se pudieron cargar los productos destacados')
    }
  },

  // Obtener categorías únicas
  async getCategories() {
    try {
      const products = await this.getAll()
      const categories = [...new Set(products.map(product => product.category).filter(Boolean))]
      return categories.sort()
    } catch (error) {
      console.error('Error obteniendo categorías:', error)
      throw new Error('No se pudieron cargar las categorías')
    }
  }
}

// ===== SERVICIOS DE ÓRDENES =====
export const orderService = {
  // Crear nueva orden
  async create(orderData) {
    try {
      const ordersRef = collection(db, 'orders')
      const docRef = await addDoc(ordersRef, {
        ...orderData,
        createdAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando orden:', error)
      throw new Error('No se pudo crear la orden')
    }
  },

  // Obtener orden por ID
  async getById(id) {
    try {
      const orderRef = doc(db, 'orders', id)
      const snapshot = await getDoc(orderRef)
      
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        }
      } else {
        throw new Error('Orden no encontrada')
      }
    } catch (error) {
      console.error('Error obteniendo orden:', error)
      throw new Error('No se pudo cargar la orden')
    }
  }
} 