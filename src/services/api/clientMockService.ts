import type {
  Cliente,
  Contacto,
  CreateClienteRequest,
  CreateContactoRequest,
  PaginationParams,
  PaginatedResponse,
} from '@/types/crmTypes'
import { mockClientes } from '@/mock/clientes'
import { mockContactos } from '@/mock/contactos'

let nextClienteId = mockClientes.length + 1
let nextContactoId = mockContactos.length + 1

class ClientMockService {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Cliente>> {
    await this.delay()
    let data = [...mockClientes]

    if (params?.sortBy) {
      const key = params.sortBy as keyof Cliente
      data.sort((a, b) => {
        const aVal = a[key] ?? ''
        const bVal = b[key] ?? ''
        const cmp = String(aVal).localeCompare(String(bVal))
        return params.sortOrder === 'desc' ? -cmp : cmp
      })
    }

    const total = data.length
    if (params?.page && params?.pageSize) {
      const start = (params.page - 1) * params.pageSize
      data = data.slice(start, start + params.pageSize)
    }

    return {
      data,
      total,
      page: params?.page || 1,
      pageSize: params?.pageSize || total,
      totalPages: params?.pageSize ? Math.ceil(total / params.pageSize) : 1,
    }
  }

  async getById(id: number): Promise<Cliente> {
    await this.delay()
    const cliente = mockClientes.find((c) => c.id === id)
    if (!cliente) throw new Error('Cliente no encontrado')
    return { ...cliente }
  }

  async create(data: CreateClienteRequest): Promise<Cliente> {
    await this.delay()
    const cliente: Cliente = {
      id: nextClienteId++,
      ...data,
      estado: data.estado || 'activo',
      contactosCount: 0,
      proyectosCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockClientes.push(cliente)
    return cliente
  }

  async update(id: number, data: Partial<CreateClienteRequest>): Promise<Cliente> {
    await this.delay()
    const index = mockClientes.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Cliente no encontrado')
    mockClientes[index] = { ...mockClientes[index], ...data, updatedAt: new Date().toISOString() }
    return mockClientes[index]
  }

  async delete(id: number): Promise<void> {
    await this.delay()
    const index = mockClientes.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Cliente no encontrado')
    mockClientes.splice(index, 1)
  }

  async getContactos(clienteId: number): Promise<Contacto[]> {
    await this.delay()
    return mockContactos.filter((c) => c.clienteId === clienteId)
  }

  async createContacto(clienteId: number, data: CreateContactoRequest): Promise<Contacto> {
    await this.delay()
    const contacto: Contacto = {
      id: nextContactoId++,
      clienteId,
      nombre: data.nombre,
      cargo: data.cargo,
      celular: data.celular,
      correo: data.correo,
      esPrincipal: data.esPrincipal || false,
      createdAt: new Date().toISOString(),
    }
    mockContactos.push(contacto)
    return contacto
  }

  async updateContacto(
    clienteId: number,
    contactoId: number,
    data: Partial<CreateContactoRequest>,
  ): Promise<Contacto> {
    await this.delay()
    const index = mockContactos.findIndex((c) => c.id === contactoId && c.clienteId === clienteId)
    if (index === -1) throw new Error('Contacto no encontrado')
    mockContactos[index] = { ...mockContactos[index], ...data }
    return mockContactos[index]
  }

  async deleteContacto(clienteId: number, contactoId: number): Promise<void> {
    await this.delay()
    const index = mockContactos.findIndex((c) => c.id === contactoId && c.clienteId === clienteId)
    if (index === -1) throw new Error('Contacto no encontrado')
    mockContactos.splice(index, 1)
  }

  async getDocumentos(): Promise<unknown[]> {
    await this.delay()
    return []
  }

  async uploadDocumento(): Promise<unknown> {
    await this.delay()
    return {}
  }

  async deleteDocumento(): Promise<void> {
    await this.delay()
  }

  async getCronologia(): Promise<unknown[]> {
    await this.delay()
    return []
  }

  private delay(ms = 150): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const clientService = new ClientMockService()
