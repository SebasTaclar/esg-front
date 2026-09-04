import { apiClient } from './apiConfig'
import type {
  Cotizacion,
  CreateCotizacionRequest,
  UpdateCotizacionRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types/crmTypes'

class QuoteService {
  private readonly endpoint = '/quotes'

  async getAll(params?: PaginationParams & { clientId?: number; projectId?: number; search?: string }): Promise<PaginatedResponse<Cotizacion>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Cotizacion[]>(`${this.endpoint}${query}`)
    return this.normalizeResponse(response.data)
  }

  async getById(id: number): Promise<Cotizacion> {
    const response = await apiClient.get<Cotizacion>(`${this.endpoint}/${id}`)
    return response.data as unknown as Cotizacion
  }

  async getByClient(clientId: number): Promise<Cotizacion[]> {
    const response = await apiClient.get<Cotizacion[]>(`${this.endpoint}?clientId=${clientId}`)
    const data = response.data
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      return (obj['quotes'] || obj['cotizaciones'] || obj['data'] || []) as Cotizacion[]
    }
    return []
  }

  async getMyQuotes(): Promise<Cotizacion[]> {
    const response = await apiClient.get<Cotizacion[]>(`${this.endpoint}/my`)
    const data = response.data
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      return (obj['quotes'] || obj['cotizaciones'] || obj['data'] || []) as Cotizacion[]
    }
    return []
  }

  async getByProject(projectId: number): Promise<Cotizacion[]> {
    const response = await apiClient.get<Cotizacion[]>(`${this.endpoint}?projectId=${projectId}`)
    const data = response.data
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      return (obj['quotes'] || obj['cotizaciones'] || obj['data'] || []) as Cotizacion[]
    }
    return []
  }

  async create(data: CreateCotizacionRequest): Promise<Cotizacion> {
    const response = await apiClient.post<Cotizacion>(this.endpoint, data)
    return response.data as unknown as Cotizacion
  }

  async update(id: number, data: UpdateCotizacionRequest): Promise<Cotizacion> {
    const response = await apiClient.patch<Cotizacion>(`${this.endpoint}/${id}`, data)
    return response.data as unknown as Cotizacion
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }

  private buildQuery(params?: Record<string, unknown>): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.pageSize) parts.push(`limit=${params.pageSize}`)
    if (params.search) parts.push(`search=${encodeURIComponent(params.search as string)}`)
    if (params.clientId) parts.push(`clientId=${params.clientId}`)
    if (params.projectId) parts.push(`projectId=${params.projectId}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeResponse(data: unknown): PaginatedResponse<Cotizacion> {
    if (Array.isArray(data)) {
      return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const items = (obj['data'] || obj['quotes'] || obj['cotizaciones'] || []) as Cotizacion[]
      const total = (obj['total'] as number) || (obj['count'] as number) || items.length
      return {
        data: items,
        total,
        page: (obj['page'] as number) || 1,
        pageSize: (obj['limit'] as number) || (obj['pageSize'] as number) || items.length,
        totalPages: (obj['totalPages'] as number) || 1,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const quoteService = new QuoteService()
