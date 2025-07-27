import React, { createContext, useContext, useReducer, useEffect } from 'react'

// ===== CONTEXTO DEL CARRITO =====
const CartContext = createContext()

// Acciones del carrito
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
}

// Estado inicial del carrito
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
}

// Reducer para manejar el estado del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return action.payload

    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(item => item.id === product.id)

      let newItems
      if (existingItemIndex >= 0) {
        // Actualizar cantidad del producto existente
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Agregar nuevo producto
        newItems = [...state.items, { ...product, quantity }]
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload
      const newItems = state.items.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }

    case CART_ACTIONS.CLEAR_CART:
      return initialState

    default:
      return state
  }
}

// Hook personalizado para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider')
  }
  return context
}

// Provider del carrito
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('bitstore-cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('bitstore-cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  // Funciones del carrito
  const addItem = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    })
  }

  const removeItem = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: productId
    })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    })
  }

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }

  const isInCart = (productId) => {
    return cart.items.some(item => item.id === productId)
  }

  const getItemQuantity = (productId) => {
    const item = cart.items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}



