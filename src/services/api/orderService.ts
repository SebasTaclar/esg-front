import { apiClient } from './apiConfig'
import type {
  Orden,
  PaginatedResponse,
  PaginationParams,
} from '@/types/crmTypes'

class OrderService {
  async getOrderById(id: number): Promise<Orden> {
    const response = await apiClient.get<Orden>(`/order/${id}`)
    return response.data as unknown as Orden
  }

  async getAllOrders(params?: PaginationParams): Promise<PaginatedResponse<Orden>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Orden[]>(`/orders${query}`)
    return this.normalizeResponse(response.data)
  }

  async getPurchases(params?: PaginationParams): Promise<PaginatedResponse<Orden>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Orden[]>(`/purchases${query}`)
    return this.normalizeResponse(response.data)
  }

  private buildQuery(params?: PaginationParams): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.pageSize) parts.push(`limit=${params.pageSize}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeResponse(data: unknown): PaginatedResponse<Orden> {
    if (Array.isArray(data)) {
      return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      return {
        data: (obj['data'] || obj['orders'] || []) as Orden[],
        total: (obj['total'] as number) || 0,
        page: (obj['page'] as number) || 1,
        pageSize: (obj['limit'] as number) || 0,
        totalPages: (obj['totalPages'] as number) || 1,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const orderService = new OrderService()
