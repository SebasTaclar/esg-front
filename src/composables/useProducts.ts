import { ref, computed, watch } from 'vue'
import { useCategories } from './useCategories'
import { useBackendProducts } from './useBackendProducts'
import { productService } from '@/services/api/productService'
import type { CreateProductRequest, UpdateProductRequest } from '@/types/ProductType'

// Tipos para productos
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  status: 'available' | 'out-of-stock' | 'coming-soon'
  colors?: string[]
  isShowcase?: boolean
  showcaseImage?: string
  sku?: string
  brand?: string
  isAvailable?: boolean
  showPrice?: boolean
  allowQuote?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isOffer?: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: Date
}

// Interface para productos de novedades (ProductShowcase)
export interface ShowcaseProduct {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  createdAt: Date
}

// Estado global de productos de showcase (ahora cargados desde backend)
const showcaseProducts = ref<ShowcaseProduct[]>([])
const isLoadingShowcase = ref(false)
const showcaseError = ref<string | null>(null)

// Usar el composable de productos del backend
const backendProductsComposable = useBackendProducts()
const {
  products: backendProducts,
  loadProducts,
  createProduct,
  updateProduct: updateBackendProduct,
  deleteProduct: deleteBackendProduct
} = backendProductsComposable

// Usar el composable de categorías para obtener las categorías desde el backend
const categoriesComposable = useCategories()
const { categories: backendCategories, loadCategories } = categoriesComposable

// Cache simple para nombres de categorías (evita iteraciones repetidas en filtros y mapeos)
const categoryNameCache = new Map<string, string>()
const getCategoryNameCached = (id: string): string | undefined => {
  if (categoryNameCache.has(id)) return categoryNameCache.get(id)
  const cat = backendCategories.value.find(c => c.id === id)
  if (cat) categoryNameCache.set(id, cat.name)
  return cat?.name
}

export function useProducts() {
  // Computed para productos disponibles (para ProductStore) - EXCLUYE productos showcase/novedades
  const availableProducts = computed(() =>
    backendProducts.value.filter(p =>
      (p.status === 'available' || p.status === 'coming-soon') &&
      !p.isShowcase  // Excluir productos que son novedades
    )
  )

  // Computed para productos regulares (para AdminDashboard) - EXCLUYE productos showcase
  const regularProducts = computed(() =>
    backendProducts.value.filter(p => !p.isShowcase)
  )

  // Funciones para gestionar productos - Ahora usan el backend
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    // Convertir category (string) a categoryId (number) para el backend
    const categoryId = parseInt(productData.category)

    // Construir requestData solo con campos válidos
    const requestData: CreateProductRequest = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      images: productData.images,
      categoryId: categoryId,
      status: productData.status,
      colors: productData.colors,
      isShowcase: productData.isShowcase,
      showcaseImage: productData.showcaseImage
    }

    // Solo agregar originalPrice si tiene un valor válido (mayor que 0)
    if (productData.originalPrice && productData.originalPrice > 0) {
      requestData.originalPrice = productData.originalPrice
    }

    const result = await createProduct(requestData)
    return result.success ? result.data : null
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    // Convertir category (string) a categoryId (number) si está presente
    const updateData: Record<string, unknown> = { ...productData }

    // Limpiar campos que no deben enviarse al backend
    delete updateData.id
    delete updateData.createdAt
    delete updateData.updatedAt

    if (productData.category) {
      updateData.categoryId = parseInt(productData.category)
      delete updateData.category
    }

    // Si originalPrice es 0, undefined, null o vacío, no enviarlo (o enviarlo como null)
    if (updateData.originalPrice !== undefined && (!updateData.originalPrice || updateData.originalPrice === 0)) {
      delete updateData.originalPrice // No enviar si es 0 o vacío
    }

    const result = await updateBackendProduct(parseInt(id), updateData)
    return result.success ? result.data : null
  }

  const deleteProduct = async (id: string) => {
    const result = await deleteBackendProduct(parseInt(id))
    return result.success
  }

  const getProductById = (id: string) => {
    return backendProducts.value.find(p => p.id === id)
  }

  const getProductsByCategory = (categoryId: string) => {
    return backendProducts.value.filter(p => p.category === categoryId)
  }

  const getCategoryById = (id: string) => {
    return backendCategories.value.find(c => c.id === id)
  }

  // Cargar productos de showcase desde el backend
  const loadShowcaseProducts = async () => {
    isLoadingShowcase.value = true
    showcaseError.value = null

    try {
      console.log('🌟 [useProducts] Cargando productos showcase desde API...')
      const response = await productService.getProducts({ showcase: true })

      if (response.success && response.data) {
        // Manejar ambos formatos de respuesta
        const rawProducts = Array.isArray(response.data)
          ? response.data
          : response.data.products

        // Transformar productos del backend a formato ShowcaseProduct
        showcaseProducts.value = rawProducts
          .filter(p => p.isShowcase) // Asegurar que solo sean showcase
          .map(p => ({
            id: p.id.toString(),
            name: p.name,
            description: p.description,
            price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
            image: p.showcaseImage || (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images[0]) || '',
            category: p.categoryId.toString(),
            createdAt: new Date(p.createdAt)
          }))

        console.log('✅ [useProducts] Productos showcase cargados:', showcaseProducts.value.length)
      } else {
        throw new Error('No se pudieron cargar los productos showcase')
      }
    } catch (error) {
      console.error('❌ [useProducts] Error cargando productos showcase:', error)
      showcaseError.value = 'Error al cargar productos destacados'
      // Mantener array vacío en caso de error
      showcaseProducts.value = []
    } finally {
      isLoadingShowcase.value = false
    }
  }

  // Funciones para gestionar showcase products (ahora modifican el backend)
  const addShowcaseProduct = async (productData: Omit<ShowcaseProduct, 'id' | 'createdAt'>) => {
    try {
      // Crear el producto en el backend con isShowcase = true
      const createRequest: CreateProductRequest = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        images: [productData.image],
        categoryId: parseInt(productData.category),
        status: 'available',
        isShowcase: true,
        showcaseImage: productData.image
      }

      const response = await createProduct(createRequest)

      if (response.success && response.data) {
        // Recargar productos showcase
        await loadShowcaseProducts()
        return showcaseProducts.value.find(p => p.id === response.data!.id.toString())
      }

      throw new Error('Error al crear producto showcase')
    } catch (error) {
      console.error('❌ Error creando producto showcase:', error)
      throw error
    }
  }

  const updateShowcaseProduct = async (id: string, productData: Partial<ShowcaseProduct>) => {
    try {
      const updateRequest: UpdateProductRequest = {
        ...(productData.name && { name: productData.name }),
        ...(productData.description && { description: productData.description }),
        ...(productData.price && { price: productData.price }),
        ...(productData.image && { images: [productData.image], showcaseImage: productData.image }),
        ...(productData.category && { categoryId: parseInt(productData.category) }),
        isShowcase: true
      }

      const response = await updateBackendProduct(parseInt(id), updateRequest)

      if (response.success) {
        // Recargar productos showcase
        await loadShowcaseProducts()
        return showcaseProducts.value.find(p => p.id === id)
      }

      throw new Error('Error al actualizar producto showcase')
    } catch (error) {
      console.error('❌ Error actualizando producto showcase:', error)
      throw error
    }
  }

  const deleteShowcaseProduct = async (id: string) => {
    try {
      const response = await deleteBackendProduct(parseInt(id))

      if (response.success) {
        // Recargar productos showcase
        await loadShowcaseProducts()
        return true
      }

      throw new Error('Error al eliminar producto showcase')
    } catch (error) {
      console.error('❌ Error eliminando producto showcase:', error)
      throw error
    }
  }

  // Watchers para limpiar cache cuando las categorías cambien desde el backend
  watch(backendCategories, () => {
    categoryNameCache.clear()
  }, { deep: true })

  return {
    // State
    products: backendProducts, // Productos desde backend (TODOS incluyendo showcase)
    regularProducts, // Productos regulares (SIN showcase) - para Admin Dashboard
    categories: backendCategories, // Categorías desde backend
    showcaseProducts,
    availableProducts,
    isLoadingShowcase,
    showcaseError,

    // Product methods (ahora async)
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    loadProducts, // Exponer para cargar productos inicialmente

    // Category methods from useCategories composable
    addCategory: categoriesComposable.createCategory,
    updateCategory: categoriesComposable.updateCategory,
    deleteCategory: categoriesComposable.deleteCategory,
    getCategoryById,
    getCategoryNameCached,
    loadCategories, // Exponer para cargar categorías inicialmente

    // Showcase product methods
    loadShowcaseProducts,
    addShowcaseProduct,
    updateShowcaseProduct,
    deleteShowcaseProduct
  }
}
