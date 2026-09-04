import { apiClient } from './apiConfig'
import type {
  Evento,
  CreateEventoRequest,
  EventEntityType,
  PaginatedResponse,
  PaginationParams,
} from '@/types/crmTypes'

class EventService {
  private readonly endpoint = '/events'

  async getAll(params?: PaginationParams & { entityType?: EventEntityType; entityId?: number }): Promise<PaginatedResponse<Evento>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Evento[]>(`${this.endpoint}${query}`)
    return this.normalizeResponse(response.data)
  }

  async getById(id: number): Promise<Evento> {
    const response = await apiClient.get<Evento>(`${this.endpoint}/${id}`)
    return response.data as unknown as Evento
  }

  async getByEntity(entityType: EventEntityType, entityId: number): Promise<Evento[]> {
    const response = await apiClient.get<Evento[]>(
      `${this.endpoint}?entityType=${entityType}&entityId=${entityId}`,
    )
    return Array.isArray(response.data) ? response.data : []
  }

  async create(data: CreateEventoRequest): Promise<Evento> {
    const response = await apiClient.post<Evento>(this.endpoint, data)
    return response.data as unknown as Evento
  }

  async update(id: number, data: CreateEventoRequest): Promise<Evento> {
    const response = await apiClient.patch<Evento>(`${this.endpoint}/${id}`, data)
    return response.data as unknown as Evento
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }

  private buildQuery(params?: Record<string, unknown>): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.pageSize) parts.push(`limit=${params.pageSize}`)
    if (params.entityType) parts.push(`entityType=${params.entityType}`)
    if (params.entityId) parts.push(`entityId=${params.entityId}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeResponse(data: unknown): PaginatedResponse<Evento> {
    if (Array.isArray(data)) {
      return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      return {
        data: (obj['data'] || obj['events'] || []) as Evento[],
        total: (obj['total'] as number) || 0,
        page: (obj['page'] as number) || 1,
        pageSize: (obj['limit'] as number) || 0,
        totalPages: (obj['totalPages'] as number) || 1,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const eventService = new EventService()
