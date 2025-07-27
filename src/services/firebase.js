import { initializeApp } from 'firebase/app'
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc,
  setDoc,
  query, 
  where, 
  orderBy,
  writeBatch
} from 'firebase/firestore'

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaEa2NiDIydHjcqZVgMXaNFTtiS2Si2RM",
  authDomain: "tienda-react-visconti.firebaseapp.com",
  projectId: "tienda-react-visconti",
  storageBucket: "tienda-react-visconti.appspot.com",
  messagingSenderId: "674278032128",
  appId: "1:674278032128:web:a06215a1ece59e381d69e5",
  measurementId: "G-K3XVQFEWRV"
}

// Inicialización
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Datos de productos reales para inicializar la base de datos
const INITIAL_PRODUCTS = [
  {
    id: 'auricular-apple-airpods-pro',
    name: 'Apple AirPods Pro (2ª generación)',
    description: 'Auriculares inalámbricos con cancelación activa de ruido, audio espacial personalizado y hasta 6 horas de autonomía.',
    price: 249999,
    category: 'auriculares',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
    stock: 25,
    featured: true
  },
  {
    id: 'auricular-sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    description: 'Auriculares inalámbricos con la mejor cancelación de ruido de la industria y hasta 30 horas de batería.',
    price: 179999,
    category: 'auriculares',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    stock: 18,
    featured: false
  },
  {
    id: 'auricular-bose-quietcomfort-45',
    name: 'Bose QuietComfort 45',
    description: 'Auriculares con cancelación de ruido líder mundial y comodidad excepcional para uso prolongado.',
    price: 159999,
    category: 'auriculares',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
    stock: 12,
    featured: false
  },
  {
    id: 'notebook-macbook-air-m2',
    name: 'MacBook Air M2 13"',
    description: 'Laptop ultraportátil con chip M2, pantalla Liquid Retina de 13.6", hasta 18 horas de batería y diseño ultra delgado.',
    price: 899999,
    category: 'notebooks',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    stock: 8,
    featured: true
  },
  {
    id: 'notebook-dell-xps-13',
    name: 'Dell XPS 13',
    description: 'Ultrabook premium con procesador Intel Core i7, 16GB RAM, SSD 512GB y pantalla InfinityEdge 13.4".',
    price: 749999,
    category: 'notebooks',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    stock: 15,
    featured: false
  },
  {
    id: 'celular-iphone-15-pro',
    name: 'iPhone 15 Pro 128GB',
    description: 'El iPhone más avanzado con chip A17 Pro, sistema de cámaras Pro y estructura de titanio resistente y ligera.',
    price: 999999,
    category: 'celulares',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    stock: 20,
    featured: true
  },
  {
    id: 'celular-samsung-galaxy-s24',
    name: 'Samsung Galaxy S24 256GB',
    description: 'Smartphone flagship con IA Galaxy, cámara de 50MP, pantalla Dynamic AMOLED 2X de 6.2" y carga rápida.',
    price: 749999,
    category: 'celulares',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    stock: 30,
    featured: false
  },
  {
    id: 'tablet-ipad-air',
    name: 'iPad Air 11" M2',
    description: 'Tablet potente con chip M2, pantalla Liquid Retina de 11", compatibilidad con Apple Pencil y Magic Keyboard.',
    price: 549999,
    category: 'tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    stock: 22,
    featured: false
  }
]

// Servicio de productos
export const productService = {
  // Inicializar productos en Firebase (solo para setup inicial)
  async initializeProducts() {
    try {
      const batch = writeBatch(db)
      INITIAL_PRODUCTS.forEach(product => {
        const docRef = doc(db, 'products', product.id)
        batch.set(docRef, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
      await batch.commit()
      console.log('Productos inicializados correctamente')
    } catch (error) {
      console.error('Error inicializando productos:', error)
    }
  },

  // Obtener todos los productos
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return products.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      throw new Error('Error al cargar productos')
    }
  },

  // Obtener producto por ID
  async getById(id) {
    try {
      const docRef = doc(db, 'products', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Producto no encontrado')
      }
    } catch (error) {
      console.error('Error obteniendo producto:', error)
      throw error
    }
  },

  // Obtener productos por categoría
  async getByCategory(category) {
    try {
      const q = query(
        collection(db, 'products'),
        where('category', '==', category)
      )
      const querySnapshot = await getDocs(q)
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return products.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error)
      throw new Error('Error al cargar productos de la categoría')
    }
  },

  // Obtener productos destacados
  async getFeatured() {
    try {
      const q = query(
        collection(db, 'products'),
        where('featured', '==', true)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo productos destacados:', error)
      throw new Error('Error al cargar productos destacados')
    }
  },

  // Obtener categorías disponibles
  async getCategories() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const categories = [...new Set(
        querySnapshot.docs.map(doc => doc.data().category).filter(Boolean)
      )]
      return categories.sort()
    } catch (error) {
      console.error('Error obteniendo categorías:', error)
      throw new Error('Error al cargar categorías')
    }
  }
}

// Servicio de órdenes
export const orderService = {
  // Crear nueva orden
  async create(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: new Date(),
        status: 'confirmed',
        orderNumber: `ORD-${Date.now()}`
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando orden:', error)
      throw new Error('Error al crear la orden')
    }
  },

  // Obtener orden por ID
  async getById(id) {
    try {
      const docRef = doc(db, 'orders', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Orden no encontrada')
      }
    } catch (error) {
      console.error('Error obteniendo orden:', error)
      throw error
    }
  }
}

export { db } 