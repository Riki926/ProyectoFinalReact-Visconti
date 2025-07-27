import { useState, useEffect } from 'react'
import { productService } from '../services/firebase'

// Hook para todos los productos
export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message)
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return {
    products,
    loading,
    error,
    refetch: loadProducts
  }
}

// Hook para un producto específico
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      setLoading(false)
      return
    }

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getById(productId)
        setProduct(data)
      } catch (err) {
        setError(err.message)
        console.error('Error loading product:', err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  return { product, loading, error }
}

// Hook para productos por categoría
export const useProductsByCategory = (categoryId) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!categoryId) {
      setProducts([])
      setLoading(false)
      return
    }

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getByCategory(categoryId)
        setProducts(data)
      } catch (err) {
        setError(err.message)
        console.error('Error loading products by category:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [categoryId])

  return { products, loading, error }
}

// Hook para productos destacados
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getFeatured()
        setProducts(data)
      } catch (err) {
        setError(err.message)
        console.error('Error loading featured products:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  return { products, loading, error }
}

// Hook para categorías
export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getCategories()
        setCategories(data)
      } catch (err) {
        setError(err.message)
        console.error('Error loading categories:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return { categories, loading, error }
} 