import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Acciones del carrito
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
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
      const { id, quantity } = action.payload
      
      if (quantity <= 0) {
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: id })
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0
      }

    default:
      return state
  }
}

// Estado inicial del carrito
const initialCartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
}

// Crear el contexto
const CartContext = createContext()

// Provider del contexto
export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useLocalStorage('bitstore-cart', initialCartState)
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData })
  }, [cartData])

  // Guardar en localStorage cuando el estado cambie
  useEffect(() => {
    if (state !== initialCartState) {
      setCartData(state)
    }
  }, [state, setCartData])

  // Acciones del carrito
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    })
  }

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: productId
    })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity }
    })
  }

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId)
  }

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const value = {
    cart: state,
    addToCart,
    removeFromCart,
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

// Hook para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider')
  }
  
  return context
} 