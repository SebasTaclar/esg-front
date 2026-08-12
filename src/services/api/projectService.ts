import { apiClient } from './apiConfig'
import type {
  Proyecto,
  CreateProyectoRequest,
  UpdateProyectoRequest,
  PaginationParams,
  PaginatedResponse,
  Seguimiento,
  CreateSeguimientoRequest,
  Documento,
  EventoCronologia,
} from '@/types/crmTypes'

class ProjectService {
  private readonly endpoint = '/projects'

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Proyecto>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Proyecto[]>(`${this.endpoint}${query}`)
    return this.normalizeResponse(response.data, response)
  }

  async getById(id: number): Promise<Proyecto> {
    const response = await apiClient.get<Proyecto>(`${this.endpoint}/${id}`)
    return response.data as unknown as Proyecto
  }

  async getByCliente(clienteId: number): Promise<Proyecto[]> {
    const response = await apiClient.get<Proyecto[]>(`${this.endpoint}?clientId=${clienteId}`)
    return Array.isArray(response.data) ? response.data : []
  }

  async create(data: CreateProyectoRequest): Promise<Proyecto> {
    const response = await apiClient.post<Proyecto>(this.endpoint, data)
    return response.data as unknown as Proyecto
  }

  async update(id: number, data: UpdateProyectoRequest): Promise<Proyecto> {
    const response = await apiClient.put<Proyecto>(`${this.endpoint}/${id}`, data)
    return response.data as unknown as Proyecto
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }

  // ====== SEGUIMIENTOS ======

  async getSeguimientos(proyectoId: number): Promise<Seguimiento[]> {
    const response = await apiClient.get<Seguimiento[]>(
      `${this.endpoint}/${proyectoId}/follow-ups`,
    )
    return Array.isArray(response.data) ? response.data : []
  }

  async createSeguimiento(
    proyectoId: number,
    data: CreateSeguimientoRequest,
  ): Promise<Seguimiento> {
    const response = await apiClient.post<Seguimiento>(
      `${this.endpoint}/${proyectoId}/follow-ups`,
      { ...data, proyectoId },
    )
    return response.data as unknown as Seguimiento
  }

  async deleteSeguimiento(proyectoId: number, seguimientoId: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${proyectoId}/follow-ups/${seguimientoId}`)
  }

  // ====== DOCUMENTOS ======

  async getDocumentos(proyectoId: number): Promise<Documento[]> {
    const response = await apiClient.get<Documento[]>(
      `${this.endpoint}/${proyectoId}/documents`,
    )
    return Array.isArray(response.data) ? response.data : []
  }

  async uploadDocumento(proyectoId: number, file: File, tipo: string): Promise<Documento> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tipo', tipo)
    const response = await apiClient.post<Documento>(
      `${this.endpoint}/${proyectoId}/documents`,
      formData,
    )
    return response.data as unknown as Documento
  }

  async deleteDocumento(proyectoId: number, documentoId: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${proyectoId}/documents/${documentoId}`)
  }

  // ====== CRONOLOGÍA ======

  async getCronologia(proyectoId: number): Promise<EventoCronologia[]> {
    const response = await apiClient.get<EventoCronologia[]>(
      `${this.endpoint}/${proyectoId}/timeline`,
    )
    return Array.isArray(response.data) ? response.data : []
  }

  // ====== HELPERS ======

  private buildQuery(params?: PaginationParams): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.pageSize) parts.push(`pageSize=${params.pageSize}`)
    if (params.sortBy) parts.push(`sortBy=${params.sortBy}`)
    if (params.sortOrder) parts.push(`sortOrder=${params.sortOrder}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeResponse(
    data: unknown,
    raw: { statusCode: number; message: string },
  ): PaginatedResponse<Proyecto> {
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
        page: 1,
        pageSize: data.length,
        totalPages: 1,
      }
    }
    if (data && typeof data === 'object' && 'count' in (data as Record<string, unknown>)) {
      const obj = data as Record<string, unknown>
      return {
        data: (obj['projects'] || obj['data'] || []) as Proyecto[],
        total: (obj['count'] as number) || 0,
        page: 1,
        pageSize: (obj['count'] as number) || 0,
        totalPages: 1,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const projectService = new ProjectService()
