import { ref, computed, watch } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  category: string
  selectedColor?: string
  characteristics?: string[] // Array de características del producto
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  inStock: boolean
  originalPrice?: number
}

// Función para cargar el carrito desde localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem('appstorepro_cart')
    return storedCart ? JSON.parse(storedCart) : []
  } catch (error) {
    console.error('Error al cargar el carrito desde localStorage:', error)
    return []
  }
}

// Función para guardar el carrito en localStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('appstorepro_cart', JSON.stringify(items))
  } catch (error) {
    console.error('Error al guardar el carrito en localStorage:', error)
  }
}

// Estado global del carrito (inicializado desde localStorage)
const cartItems = ref<CartItem[]>(loadCartFromStorage())
const isCartOpen = ref(false)

// Observar cambios en el carrito y guardar automáticamente
watch(cartItems, (newCartItems) => {
  saveCartToStorage(newCartItems)
}, { deep: true })

export function useCart() {
  // Computed para el total de items
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Computed para el total del precio
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  // Agregar producto al carrito
  const addToCart = (product: Product, quantity: number = 1, selectedColor?: string, characteristics?: string[]) => {
    const existingItem = cartItems.value.find(item =>
      item.id === product.id && item.selectedColor === selectedColor
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        category: product.category,
        selectedColor,
        characteristics
      })
    }
  }

  // Remover producto del carrito
  const removeFromCart = (productId: string, selectedColor?: string) => {
    const index = cartItems.value.findIndex(item =>
      item.id === productId && item.selectedColor === selectedColor
    )
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  // Actualizar cantidad de un producto
  const updateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
    const item = cartItems.value.find(item =>
      item.id === productId && item.selectedColor === selectedColor
    )
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId, selectedColor)
      } else {
        item.quantity = quantity
      }
    }
  }

  // Limpiar carrito
  const clearCart = () => {
    cartItems.value = []
  }

  // Obtener cantidad de un producto específico
  const getItemQuantity = (productId: string) => {
    const item = cartItems.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  // Toggle carrito
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  // Abrir carrito
  const openCart = () => {
    isCartOpen.value = true
  }

  // Cerrar carrito
  const closeCart = () => {
    isCartOpen.value = false
  }

  return {
    // Estado
    cartItems: computed(() => cartItems.value),
    isCartOpen: computed(() => isCartOpen.value),
    totalItems,
    totalPrice,

    // Métodos
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    toggleCart,
    openCart,
    closeCart
  }
}
