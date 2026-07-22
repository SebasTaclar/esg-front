import { ref, computed, watch } from 'vue'

export interface QuotationItem {
  id: string
  name: string
  sku: string
  brand: string
  image: string
  quantity: number
  category: string
  observations?: string
  price?: number
}

export interface QuotationProduct {
  id: string
  name: string
  sku: string
  brand: string
  price: number
  image: string
  category: string
  description: string
  inStock: boolean
  originalPrice?: number
}

const STORAGE_KEY = 'disef_quotation'

const loadFromStorage = (): QuotationItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error al cargar cotización desde localStorage:', error)
    return []
  }
}

const saveToStorage = (items: QuotationItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error al guardar cotización en localStorage:', error)
  }
}

const quotationItems = ref<QuotationItem[]>(loadFromStorage())
const isDrawerOpen = ref(false)

watch(quotationItems, (newItems) => {
  saveToStorage(newItems)
}, { deep: true })

function buildWhatsAppMessage(items: QuotationItem[]): string {
  const lines: string[] = []
  lines.push('Hola ESG.')
  lines.push('')
  lines.push('Estoy interesado en recibir una cotización de los siguientes productos:')
  lines.push('')

  items.forEach((item, index) => {
    lines.push('━━━━━━━━━━━━━━━━━━━━━━')
    lines.push('')
    lines.push(`${index + 1}.`)
    lines.push(`${item.name}`)
    lines.push('')
    lines.push(`SKU: ${item.sku}`)
    lines.push(`Marca: ${item.brand}`)
    lines.push(`Cantidad: ${item.quantity}`)
    if (item.observations && item.observations.trim()) {
      lines.push(`Observación: ${item.observations}`)
    }
    lines.push('')
  })

  lines.push('━━━━━━━━━━━━━━━━━━━━━━')
  lines.push('')
  lines.push('Nombre: ')
  lines.push('Empresa: ')
  lines.push('Ciudad: ')
  lines.push('Teléfono: ')
  lines.push('')
  lines.push('Muchas gracias.')

  return lines.join('\n')
}

export function useQuotation() {
  const totalItems = computed(() => {
    return quotationItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const addToQuotation = (
    product: QuotationProduct,
    quantity: number = 1,
    observations?: string
  ) => {
    const existing = quotationItems.value.find(item => item.id === product.id)

    if (existing) {
      existing.quantity += quantity
      if (observations && observations.trim()) {
        existing.observations = observations
      }
    } else {
      quotationItems.value.push({
        id: product.id,
        name: product.name,
        sku: product.sku || 'N/A',
        brand: product.brand || 'N/A',
        image: product.image,
        quantity,
        category: product.category,
        observations,
        price: product.price
      })
    }
  }

  const removeFromQuotation = (productId: string) => {
    const index = quotationItems.value.findIndex(item => item.id === productId)
    if (index > -1) {
      quotationItems.value.splice(index, 1)
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = quotationItems.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromQuotation(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const updateObservations = (productId: string, observations: string) => {
    const item = quotationItems.value.find(item => item.id === productId)
    if (item) {
      item.observations = observations
    }
  }

  const clearQuotation = () => {
    quotationItems.value = []
  }

  const getItemQuantity = (productId: string) => {
    const item = quotationItems.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  const openDrawer = () => {
    isDrawerOpen.value = true
  }

  const closeDrawer = () => {
    isDrawerOpen.value = false
  }

  const sendToWhatsApp = () => {
    const message = buildWhatsAppMessage(quotationItems.value)
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/573229118168?text=${encoded}`, '_blank')
  }

  return {
    quotationItems: computed(() => quotationItems.value),
    isDrawerOpen: computed(() => isDrawerOpen.value),
    totalItems,
    addToQuotation,
    removeFromQuotation,
    updateQuantity,
    updateObservations,
    clearQuotation,
    getItemQuantity,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    sendToWhatsApp
  }
}
