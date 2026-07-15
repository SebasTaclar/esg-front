import { ref, computed } from 'vue'
import type { Product } from '@/types/ProductType'

// Singleton state (shared across the whole app)
const selectedProduct = ref<Product | null>(null)
const isOpen = ref(false)

export function useProductQuickView() {
  const open = (product: Product) => {
    selectedProduct.value = product
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const clear = () => {
    isOpen.value = false
    selectedProduct.value = null
  }

  const product = computed(() => selectedProduct.value)

  return {
    isOpen,
    product,
    open,
    close,
    clear
  }
}
