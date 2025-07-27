// ===== VALIDACIONES PARA FORMULARIOS =====

// Validar nombre (solo letras, espacios y acentos)
export const validateName = (name) => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
  
  if (!name.trim()) {
    return 'El nombre es requerido'
  }
  
  if (name.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres'
  }
  
  if (name.trim().length > 50) {
    return 'El nombre no puede tener más de 50 caracteres'
  }
  
  if (!nameRegex.test(name.trim())) {
    return 'El nombre solo puede contener letras y espacios'
  }
  
  return null
}

// Validar email con formato correcto
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email.trim()) {
    return 'El email es requerido'
  }
  
  if (!emailRegex.test(email.trim())) {
    return 'Ingresa un email válido'
  }
  
  return null
}

// Validar teléfono (solo números, espacios, guiones y símbolos)
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '')
  
  if (!phone.trim()) {
    return 'El teléfono es requerido'
  }
  
  if (!phoneRegex.test(phone.trim())) {
    return 'El teléfono solo puede contener números, espacios, guiones y paréntesis'
  }
  
  if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    return 'El teléfono debe tener entre 8 y 15 dígitos'
  }
  
  return null
}

// Validar dirección
export const validateAddress = (address) => {
  if (!address.trim()) {
    return 'La dirección es requerida'
  }
  
  if (address.trim().length < 5) {
    return 'La dirección debe tener al menos 5 caracteres'
  }
  
  if (address.trim().length > 100) {
    return 'La dirección no puede tener más de 100 caracteres'
  }
  
  return null
}

// Validar ciudad (solo letras y espacios)
export const validateCity = (city) => {
  const cityRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
  
  if (!city.trim()) {
    return 'La ciudad es requerida'
  }
  
  if (city.trim().length < 2) {
    return 'La ciudad debe tener al menos 2 caracteres'
  }
  
  if (!cityRegex.test(city.trim())) {
    return 'La ciudad solo puede contener letras y espacios'
  }
  
  return null
}

// Validar código postal (solo números)
export const validatePostalCode = (postalCode) => {
  const postalCodeRegex = /^\d{4,8}$/
  
  if (!postalCode.trim()) {
    return 'El código postal es requerido'
  }
  
  if (!postalCodeRegex.test(postalCode.trim())) {
    return 'El código postal debe tener entre 4 y 8 números'
  }
  
  return null
}

// Validar formulario completo del checkout
export const validateCheckoutForm = (formData) => {
  const errors = {}
  
  const nameError = validateName(formData.name)
  if (nameError) errors.name = nameError
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  const phoneError = validatePhone(formData.phone)
  if (phoneError) errors.phone = phoneError
  
  const addressError = validateAddress(formData.address)
  if (addressError) errors.address = addressError
  
  const cityError = validateCity(formData.city)
  if (cityError) errors.city = cityError
  
  const postalCodeError = validatePostalCode(formData.postalCode)
  if (postalCodeError) errors.postalCode = postalCodeError
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
} 