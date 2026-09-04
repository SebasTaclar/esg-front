import { apiClient } from './apiConfig'
import type {
  Cliente,
  Client,
  ClientContact,
  CreateClienteRequest,
  UpdateClienteRequest,
  CreateClientRequest,
  UpdateClientRequest,
  PaginatedResponse,
} from '@/types/crmTypes'

export interface ClientListParams {
  page?: number
  limit?: number
  search?: string
}

class ClientService {
  private readonly endpoint = '/clients'

  async getAll(params?: ClientListParams): Promise<PaginatedResponse<Cliente>> {
    const query = this.buildListQuery(params)
    const response = await apiClient.get<Client[] | { clients: Client[]; count: number }>(
      `${this.endpoint}${query}`,
    )
    return this.normalizeListResponse(response.data, params)
  }

  async getById(id: number): Promise<Cliente> {
    const response = await apiClient.get<Client>(`${this.endpoint}/${id}`)
    return this.mapClientToCliente(response.data as unknown as Client)
  }

  async create(data: CreateClienteRequest): Promise<Cliente> {
    const payload = this.mapClientePayloadToClient(data)
    const response = await apiClient.post<Client>(this.endpoint, payload)
    return this.mapClientToCliente(response.data as unknown as Client)
  }

  async update(id: number, data: UpdateClienteRequest): Promise<Cliente> {
    const payload = this.mapClientePayloadToClient(data)
    const response = await apiClient.patch<Client>(`${this.endpoint}/${id}`, payload)
    return this.mapClientToCliente(response.data as unknown as Client)
  }

  async patch(id: number, data: UpdateClientRequest): Promise<Cliente> {
    const response = await apiClient.patch<Client>(`${this.endpoint}/${id}`, data)
    return this.mapClientToCliente(response.data as unknown as Client)
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }

  // ====== CONTACTOS ======

  async getContactos(clienteId: number): Promise<ClientContact[]> {
    const response = await apiClient.get<ClientContact[]>(`${this.endpoint}/${clienteId}/contacts`)
    return Array.isArray(response.data) ? response.data : []
  }

  async createContacto(clienteId: number, data: Omit<ClientContact, 'id'>): Promise<ClientContact> {
    const response = await apiClient.post<ClientContact>(
      `${this.endpoint}/${clienteId}/contacts`,
      data,
    )
    return response.data as unknown as ClientContact
  }

  async updateContacto(
    clienteId: number,
    contactoId: number,
    data: Partial<ClientContact>,
  ): Promise<ClientContact> {
    const response = await apiClient.put<ClientContact>(
      `${this.endpoint}/${clienteId}/contacts/${contactoId}`,
      data,
    )
    return response.data as unknown as ClientContact
  }

  async deleteContacto(clienteId: number, contactoId: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${clienteId}/contacts/${contactoId}`)
  }

  // ====== DOCUMENTOS / RESOURCES ======

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

  // ====== MAPPERS ======

  private mapClientToCliente(client: Client): Cliente {
    return {
      id: client.id,
      razonSocial: client.name || '',
      nit: client.nit || '',
      codigo: client.code,
      tipoOrganizacion: client.organizationType,
      norma: client.norm,
      ciudad: client.city || '',
      departamento: client.department || '',
      direccion: client.address || '',
      telefono: client.phone || '',
      correo: client.email || '',
      paginaWeb: client.website,
      estado: client.isProspect
        ? 'prospecto'
        : client.isActive
          ? 'activo'
          : 'inactivo',
      observaciones: client.observations,
      isActive: client.isActive,
      isProspect: client.isProspect,
      showResources: client.showResources,
      contacts: client.contacts,
      resources: client.resources,
      createdAt: client.createdAt || new Date().toISOString(),
      updatedAt: client.updatedAt || new Date().toISOString(),
    }
  }

  private mapClientePayloadToClient(
    data: CreateClienteRequest | UpdateClienteRequest,
  ): CreateClientRequest {
    const payload: CreateClientRequest = {
      name: (data as CreateClienteRequest).razonSocial || '',
      nit: (data as CreateClienteRequest).nit,
      code: (data as CreateClienteRequest).codigo,
      organizationType: (data as CreateClienteRequest).tipoOrganizacion,
      norm: (data as CreateClienteRequest).norma,
      city: (data as CreateClienteRequest).ciudad,
      department: (data as CreateClienteRequest).departamento,
      address: (data as CreateClienteRequest).direccion,
      phone: (data as CreateClienteRequest).telefono,
      email: (data as CreateClienteRequest).correo,
      website: (data as CreateClienteRequest).paginaWeb,
      observations: (data as CreateClienteRequest).observaciones,
      contacts: (data as CreateClienteRequest).contacts,
    }

    if ('estado' in data && data.estado) {
      if (data.estado === 'prospecto') {
        payload.isProspect = true
        payload.isActive = false
      } else if (data.estado === 'activo') {
        payload.isActive = true
        payload.isProspect = false
      } else {
        payload.isActive = false
        payload.isProspect = false
      }
    }

    if ('showResources' in data) {
      (payload as Record<string, unknown>)['show_resources'] = data.showResources
    }

    return payload
  }

  // ====== HELPERS ======

  private buildListQuery(params?: ClientListParams): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.limit) parts.push(`limit=${params.limit}`)
    if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeListResponse(
    data: unknown,
    params?: ClientListParams,
  ): PaginatedResponse<Cliente> {
    if (Array.isArray(data)) {
      return {
        data: data.map((c) => this.mapClientToCliente(c as Client)),
        total: data.length,
        page: params?.page || 1,
        pageSize: params?.limit || data.length,
        totalPages: params?.limit ? Math.ceil(data.length / params.limit) : 1,
      }
    }

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>

      const clients = (obj['clients'] || obj['data'] || []) as Client[]
      const count = (obj['count'] as number) || clients.length
      const page = (obj['page'] as number) || params?.page || 1
      const limit = (obj['limit'] as number) || params?.limit || count

      return {
        data: clients.map((c) => this.mapClientToCliente(c)),
        total: count,
        page,
        pageSize: limit,
        totalPages: limit > 0 ? Math.ceil(count / limit) : 1,
      }
    }

    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const clientService = new ClientService()
