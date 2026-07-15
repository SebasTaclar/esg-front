import { apiClient, type ApiResponse } from './apiConfig'
import type {
  Brand,
  CreateBrandRequest,
  CreateBrandResponse,
  UpdateBrandRequest,
  GetBrandsResponse,
} from '@/types/BrandType'

class BrandService {
  async getBrands(params?: { name?: string }): Promise<ApiResponse<GetBrandsResponse>> {
    try {
      let endpoint = '/brands'

      if (params?.name) {
        endpoint += `?name=${encodeURIComponent(params.name)}`
      }

      console.log('🌐 [brandService] Llamando GET', endpoint)
      const result = await apiClient.get<GetBrandsResponse>(endpoint)
      console.log('📥 [brandService] Respuesta recibida:', result)
      return result
    } catch (error) {
      console.error('❌ [brandService] Error fetching brands:', error)
      throw error
    }
  }

  async getBrandById(id: number): Promise<ApiResponse<Brand>> {
    try {
      console.log('🌐 [brandService] Llamando GET /brands/', id)
      const result = await apiClient.get<Brand>(`/brands/${id}`)
      console.log('📥 [brandService] Marca recibida:', result)
      return result
    } catch (error) {
      console.error('❌ [brandService] Error fetching brand by ID:', error)
      throw error
    }
  }

  async createBrand(brandData: CreateBrandRequest): Promise<ApiResponse<CreateBrandResponse>> {
    try {
      console.log('🌐 [brandService] Llamando POST /brands', brandData)
      const result = await apiClient.post<CreateBrandResponse>('/brands', brandData)
      console.log('📥 [brandService] Marca creada:', result)
      return result
    } catch (error) {
      console.error('❌ [brandService] Error creating brand:', error)
      throw error
    }
  }

  async updateBrand(
    id: number,
    brandData: UpdateBrandRequest,
  ): Promise<ApiResponse<Brand>> {
    try {
      console.log('🌐 [brandService] Llamando PUT /brands/', id, brandData)
      const result = await apiClient.put<Brand>(`/brands/${id}`, brandData)
      console.log('📥 [brandService] Marca actualizada:', result)
      return result
    } catch (error) {
      console.error('❌ [brandService] Error updating brand:', error)
      throw error
    }
  }

  async deleteBrand(id: number): Promise<ApiResponse<{ message: string }>> {
    try {
      console.log('🌐 [brandService] Llamando DELETE /brands/', id)
      const result = await apiClient.delete<{ message: string }>(`/brands/${id}`)
      console.log('📥 [brandService] Marca eliminada:', result)
      return result
    } catch (error) {
      console.error('❌ [brandService] Error deleting brand:', error)
      throw error
    }
  }
}

export const brandService = new BrandService()
