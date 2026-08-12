import { apiClient } from './apiConfig'
import type {
  Cliente,
  CreateClienteRequest,
  UpdateClienteRequest,
  Contacto,
  CreateContactoRequest,
  UpdateContactoRequest,
  PaginationParams,
  PaginatedResponse,
} from '@/types/crmTypes'

class ClientService {
  private readonly endpoint = '/clients'

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Cliente>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Cliente[]>(`${this.endpoint}${query}`)
    return this.normalizeResponse(response.data, response)
  }

  async getById(id: number): Promise<Cliente> {
    const response = await apiClient.get<Cliente>(`${this.endpoint}/${id}`)
    return response.data as unknown as Cliente
  }

  async create(data: CreateClienteRequest): Promise<Cliente> {
    const response = await apiClient.post<Cliente>(this.endpoint, data)
    return response.data as unknown as Cliente
  }

  async update(id: number, data: UpdateClienteRequest): Promise<Cliente> {
    const response = await apiClient.put<Cliente>(`${this.endpoint}/${id}`, data)
    return response.data as unknown as Cliente
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }

  // ====== CONTACTOS ======

  async getContactos(clienteId: number): Promise<Contacto[]> {
    const response = await apiClient.get<Contacto[]>(`${this.endpoint}/${clienteId}/contacts`)
    return Array.isArray(response.data) ? response.data : []
  }

  async createContacto(clienteId: number, data: CreateContactoRequest): Promise<Contacto> {
    const response = await apiClient.post<Contacto>(
      `${this.endpoint}/${clienteId}/contacts`,
      { ...data, clienteId },
    )
    return response.data as unknown as Contacto
  }

  async updateContacto(
    clienteId: number,
    contactoId: number,
    data: UpdateContactoRequest,
  ): Promise<Contacto> {
    const response = await apiClient.put<Contacto>(
      `${this.endpoint}/${clienteId}/contacts/${contactoId}`,
      data,
    )
    return response.data as unknown as Contacto
  }

  async deleteContacto(clienteId: number, contactoId: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${clienteId}/contacts/${contactoId}`)
  }

  // ====== DOCUMENTOS ======

  async getDocumentos(clienteId: number): Promise<unknown[]> {
    const response = await apiClient.get<unknown[]>(`${this.endpoint}/${clienteId}/documents`)
    return Array.isArray(response.data) ? response.data : []
  }

  async uploadDocumento(clienteId: number, file: File, tipo: string): Promise<unknown> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tipo', tipo)
    const response = await apiClient.post(`${this.endpoint}/${clienteId}/documents`, formData)
    return response.data
  }

  async deleteDocumento(clienteId: number, documentoId: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${clienteId}/documents/${documentoId}`)
  }

  // ====== CRONOLOGÍA ======

  async getCronologia(clienteId: number): Promise<unknown[]> {
    const response = await apiClient.get<unknown[]>(`${this.endpoint}/${clienteId}/timeline`)
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
  ): PaginatedResponse<Cliente> {
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
        data: (obj['clients'] || obj['data'] || []) as Cliente[],
        total: (obj['count'] as number) || 0,
        page: 1,
        pageSize: (obj['count'] as number) || 0,
        totalPages: 1,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const clientService = new ClientService()
