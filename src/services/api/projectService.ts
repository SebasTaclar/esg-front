import { apiClient } from './apiConfig'
import type {
  Proyecto,
  CreateProyectoRequest,
  UpdateProyectoRequest,
  PaginatedResponse,
  Seguimiento,
  CreateSeguimientoRequest,
  Documento,
  EventoCronologia,
} from '@/types/crmTypes'

export interface ProjectListParams {
  page?: number
  limit?: number
  search?: string
  clientId?: number
}

class ProjectService {
  private readonly endpoint = '/projects'

  async getAll(params?: ProjectListParams): Promise<PaginatedResponse<Proyecto>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Proyecto[] | { projects: Proyecto[]; count: number }>(
      `${this.endpoint}${query}`,
    )
    return this.normalizeResponse(response.data, params)
  }

  async getById(id: number): Promise<Proyecto> {
    const response = await apiClient.get<Proyecto>(`${this.endpoint}/${id}`)
    return response.data as unknown as Proyecto
  }

  async getByCliente(clienteId: number): Promise<Proyecto[]> {
    const response = await apiClient.get<Proyecto[] | { projects: Proyecto[]; count: number }>(
      `${this.endpoint}?clientId=${clienteId}`,
    )
    const data = response.data
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      return (obj['projects'] || obj['data'] || []) as Proyecto[]
    }
    return []
  }

  async create(data: CreateProyectoRequest): Promise<Proyecto> {
    const response = await apiClient.post<Proyecto>(this.endpoint, data)
    return response.data as unknown as Proyecto
  }

  async update(id: number, data: UpdateProyectoRequest): Promise<Proyecto> {
    const response = await apiClient.patch<Proyecto>(`${this.endpoint}/${id}`, data)
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

  private buildQuery(params?: ProjectListParams): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.limit) parts.push(`limit=${params.limit}`)
    if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`)
    if (params.clientId) parts.push(`clientId=${params.clientId}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeResponse(
    data: unknown,
    params?: ProjectListParams,
  ): PaginatedResponse<Proyecto> {
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
        page: params?.page || 1,
        pageSize: params?.limit || data.length,
        totalPages: params?.limit ? Math.ceil(data.length / params.limit) : 1,
      }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const projects = (obj['projects'] || obj['data'] || []) as Proyecto[]
      const count = (obj['count'] as number) || projects.length
      const page = (obj['page'] as number) || params?.page || 1
      const limit = (obj['limit'] as number) || params?.limit || count
      return {
        data: projects,
        total: count,
        page,
        pageSize: limit,
        totalPages: limit > 0 ? Math.ceil(count / limit) : 1,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const projectService = new ProjectService()
