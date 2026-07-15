import { ref } from 'vue'
import { brandService } from '@/services/api'
import type {
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '@/types/BrandType'

const brands = ref<Brand[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

function normalizeBrand(input: unknown): Brand {
  if (typeof input === 'object' && input !== null) {
    const any = input as Record<string, unknown>

    const id = any.id !== undefined ? String(any.id) : crypto.randomUUID()
    const name = String(any.name || '')
    const description = any.description ? String(any.description) : undefined

    let imageUrls: string[] | undefined
    if (any.imageUrls) {
      if (typeof any.imageUrls === 'string') {
        try {
          imageUrls = JSON.parse(any.imageUrls)
        } catch {
          imageUrls = [any.imageUrls]
        }
      } else if (Array.isArray(any.imageUrls)) {
        imageUrls = any.imageUrls.map(String)
      }
    }

    return {
      id,
      name,
      description,
      imageUrls,
      createdAt: any.createdAt ? new Date(String(any.createdAt)) : undefined,
      updatedAt: any.updatedAt ? new Date(String(any.updatedAt)) : undefined,
    }
  }

  return {
    id: crypto.randomUUID(),
    name: '',
  }
}

export function useBrands() {
  const loadBrands = async (filters?: { name?: string }) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 [loadBrands] Iniciando carga de marcas...', filters)
      const response = await brandService.getBrands(filters)
      console.log('📥 [loadBrands] Respuesta del backend:', response)

      if (response.success) {
        const raw = response.data as unknown
        let items: unknown[] = []

        if (Array.isArray(raw)) {
          items = raw
        } else if (raw && typeof raw === 'object' && 'brands' in raw) {
          const dataObj = raw as { brands?: unknown[] }
          if (Array.isArray(dataObj.brands)) {
            items = dataObj.brands
          }
        }

        const normalized = items.map(normalizeBrand)
        console.log('✅ [loadBrands] Marcas normalizadas:', normalized)
        brands.value = normalized
        return { success: true, data: response.data }
      } else {
        error.value = response.message
        console.error('❌ [loadBrands] Error del backend:', response.message)
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar marcas'
      error.value = errorMessage
      console.error('❌ [loadBrands] Excepción:', err)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const createBrand = async (brandData: CreateBrandRequest) => {
    loading.value = true
    error.value = null

    try {
      console.log('📝 [useBrands] Creando marca:', brandData)
      const response = await brandService.createBrand(brandData)

      if (response.success) {
        const normalized = normalizeBrand(response.data)
        brands.value.push(normalized)
        return { success: true, data: normalized, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear marca'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const updateBrand = async (id: number, brandData: UpdateBrandRequest) => {
    loading.value = true
    error.value = null

    try {
      console.log('📝 [useBrands] Actualizando marca:', id, brandData)
      const response = await brandService.updateBrand(id, brandData)

      if (response.success) {
        const normalized = normalizeBrand(response.data)
        const index = brands.value.findIndex((b) => b.id === String(id))
        if (index !== -1) {
          brands.value[index] = normalized
        }
        return { success: true, data: normalized, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar marca'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const deleteBrand = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      console.log('🗑️ [useBrands] Eliminando marca:', id)
      const response = await brandService.deleteBrand(id)

      if (response.success) {
        brands.value = brands.value.filter((b) => b.id !== String(id))
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar marca'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const getBrandById = (id: number | string): Brand | undefined => {
    return brands.value.find((b) => b.id === String(id))
  }

  const clearError = () => {
    error.value = null
  }

  const refreshBrands = async () => {
    return await loadBrands()
  }

  return {
    brands,
    loading,
    error,
    loadBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    getBrandById,
    clearError,
    refreshBrands,
  }
}
