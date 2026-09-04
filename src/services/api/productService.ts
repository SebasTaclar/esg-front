import { apiClient, type ApiResponse } from './apiConfig'
import type {
  Product,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  GetProductsResponse,
} from '@/types/ProductType'

class ProductService {
  /**
   * Obtiene todos los productos con filtros opcionales
   */
  async getProducts(params?: {
    name?: string
    categoryId?: number
    showcase?: boolean
  }): Promise<ApiResponse<GetProductsResponse>> {
    try {
      let endpoint = '/products'

      // Agregar query params si existen
      if (params) {
        const queryParams = new URLSearchParams()
        if (params.name) queryParams.append('name', params.name)
        if (params.categoryId) queryParams.append('categoryId', String(params.categoryId))
        if (params.showcase !== undefined) queryParams.append('showcase', String(params.showcase))

        const queryString = queryParams.toString()
        if (queryString) {
          endpoint += `?${queryString}`
        }
      }

      console.log('🌐 [productService] Llamando GET', endpoint)
      const result = await apiClient.get<GetProductsResponse>(endpoint)
      console.log('📥 [productService] Respuesta recibida:', result)
      return result
    } catch (error) {
      console.error('❌ [productService] Error fetching products:', error)
      throw error
    }
  }

  /**
   * Obtiene un producto por ID
   */
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      console.log('🌐 [productService] Llamando GET /products/', id)
      const result = await apiClient.get<Product>(`/products/${id}`)
      console.log('📥 [productService] Producto recibido:', result)
      return result
    } catch (error) {
      console.error('❌ [productService] Error fetching product by ID:', error)
      throw error
    }
  }

  /**
   * Crea un nuevo producto
   */
  async createProduct(
    productData: CreateProductRequest,
  ): Promise<ApiResponse<CreateProductResponse>> {
    try {
      console.log('🌐 [productService] Llamando POST /products', productData)
      const result = await apiClient.post<CreateProductResponse>('/products', productData)
      console.log('📥 [productService] Producto creado:', result)
      return result
    } catch (error) {
      console.error('❌ [productService] Error creating product:', error)
      throw error
    }
  }

  /**
   * Actualiza un producto existente
   */
  async updateProduct(
    id: number,
    productData: UpdateProductRequest,
  ): Promise<ApiResponse<Product>> {
    try {
      console.log('🌐 [productService] Llamando PATCH /products/', id, productData)
      const result = await apiClient.patch<Product>(`/products/${id}`, productData)
      console.log('📥 [productService] Producto actualizado:', result)
      return result
    } catch (error) {
      console.error('❌ [productService] Error updating product:', error)
      throw error
    }
  }

  /**
   * Elimina un producto
   */
  async deleteProduct(id: number): Promise<ApiResponse<{ message: string }>> {
    try {
      console.log('🌐 [productService] Llamando DELETE /products/', id)
      const result = await apiClient.delete<{ message: string }>(`/products/${id}`)
      console.log('📥 [productService] Producto eliminado:', result)
      return result
    } catch (error) {
      console.error('❌ [productService] Error deleting product:', error)
      throw error
    }
  }
}

// Instancia singleton del servicio de productos
export const productService = new ProductService()
