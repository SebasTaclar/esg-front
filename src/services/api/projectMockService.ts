import type {
  Proyecto,
  CreateProyectoRequest,
  Seguimiento,
  CreateSeguimientoRequest,
  Documento,
  EventoCronologia,
  PaginationParams,
  PaginatedResponse,
  ServicioProyecto,
} from '@/types/crmTypes'
import { mockProyectos } from '@/mock/proyectos'
import { mockClientes } from '@/mock/clientes'
import { mockSeguimientos } from '@/mock/seguimientos'
import { mockDocumentos } from '@/mock/documentos'
import { mockCronologia } from '@/mock/cronologia'

let nextProyectoId = mockProyectos.length + 1
let nextSeguimientoId = mockSeguimientos.length + 1

function mapMockToProyecto(raw: Record<string, unknown>): Proyecto {
  const clienteId = (raw.clientId as number) || (raw.clienteId as number) || 0
  const cliente = mockClientes.find(c => c.id === clienteId)
  return {
    id: raw.id as number,
    consecutive: (raw.consecutive as number) || (raw.consecutivo as number) || 0,
    abbreviation: (raw.abbreviation as string) || (raw.abreviatura as string) || '',
    code: (raw.code as string) || (raw.codigo as string) || '',
    clientId: clienteId,
    client: {
      id: clienteId,
      name: (raw.client?.name as string) || (raw.clienteRazonSocial as string) || '',
      code: (raw.client?.code as string) || cliente?.codigo || '',
    },
    projectType: (raw.projectType as string) || (raw.tipoProyectoNombre as string) || '',
    serviceType: (raw.serviceType as string) || (raw.tipoServicioNombre as string) || '',
    norm: (raw.norm as string) || (raw.normaCodigo as string) || '',
    status: (raw.status as string) || (raw.estadoNombre as string) || '',
    responsible: (raw.responsible as string) || (raw.responsable as string) || '',
    startDate: (raw.startDate as string) || (raw.fechaInicio as string) || '',
    endDate: (raw.endDate as string) || (raw.fechaFin as string) || '',
    description: (raw.description as string) || (raw.descripcion as string) || '',
    observations: (raw.observations as string) || (raw.observaciones as string) || '',
    offer: (raw.offer as string) || (raw.oferta as string) || '',
    totalCost: (raw.totalCost as number) || (raw.costoTotal as number) || 0,
    services: (raw.services as ServicioProyecto[]) || [],
    createdAt: (raw.createdAt as string) || '',
    updatedAt: (raw.updatedAt as string) || '',
  }
}

class ProjectMockService {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Proyecto>> {
    await this.delay()
    let data = mockProyectos.map(mapMockToProyecto)

    if (params?.sortBy) {
      const key = params.sortBy as keyof Proyecto
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

  async getById(id: number): Promise<Proyecto> {
    await this.delay()
    const proyecto = mockProyectos.find((p) => p.id === id)
    if (!proyecto) throw new Error('Proyecto no encontrado')
    return mapMockToProyecto(proyecto as unknown as Record<string, unknown>)
  }

  async getByCliente(clienteId: number): Promise<Proyecto[]> {
    await this.delay()
    return mockProyectos.filter((p) => p.clienteId === clienteId).map(mapMockToProyecto)
  }

  async create(data: CreateProyectoRequest): Promise<Proyecto> {
    await this.delay()

    const cliente = mockClientes.find(c => c.id === data.clientId)
    const consecutive = mockProyectos.length + 1
    const code = `${String(consecutive).padStart(4, '0')}-PRJ`

    const proyecto: Proyecto = {
      id: nextProyectoId++,
      consecutive,
      abbreviation: 'PRJ',
      code,
      clientId: data.clientId,
      client: {
        id: data.clientId,
        name: cliente?.razonSocial || '',
        code: cliente?.codigo || '',
      },
      projectType: data.projectType || '',
      serviceType: data.serviceType || '',
      norm: data.norm || '',
      status: data.status || 'Cotización',
      responsible: data.responsible,
      startDate: data.startDate,
      endDate: data.endDate || '',
      description: data.description || '',
      observations: data.observations || '',
      offer: data.offer || '',
      totalCost: data.totalCost || 0,
      services: data.services || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProyectos.push(proyecto as any)
    return proyecto
  }

  async update(id: number, data: Partial<CreateProyectoRequest>): Promise<Proyecto> {
    await this.delay()
    const index = mockProyectos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Proyecto no encontrado')
    const existing = mockProyectos[index] as any
    const updated = {
      ...existing,
      clientId: data.clientId ?? existing.clientId,
      projectType: data.projectType ?? existing.projectType,
      serviceType: data.serviceType ?? existing.serviceType,
      norm: data.norm ?? existing.norm,
      status: data.status ?? existing.status,
      responsible: data.responsible ?? existing.responsible,
      startDate: data.startDate ?? existing.fechaInicio,
      endDate: data.endDate ?? existing.fechaFin,
      description: data.description ?? existing.descripcion,
      observations: data.observations ?? existing.observaciones,
      offer: data.offer ?? existing.oferta,
      totalCost: data.totalCost ?? existing.costoTotal,
      services: data.services ?? existing.services,
      updatedAt: new Date().toISOString(),
    }
    mockProyectos[index] = updated
    return mapMockToProyecto(updated as unknown as Record<string, unknown>)
  }

  async delete(id: number): Promise<void> {
    await this.delay()
    const index = mockProyectos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Proyecto no encontrado')
    mockProyectos.splice(index, 1)
  }

  async getSeguimientos(proyectoId: number): Promise<Seguimiento[]> {
    await this.delay()
    return mockSeguimientos.filter((s) => s.proyectoId === proyectoId)
  }

  async createSeguimiento(
    proyectoId: number,
    data: CreateSeguimientoRequest,
  ): Promise<Seguimiento> {
    await this.delay()
    const seguimiento: Seguimiento = {
      id: nextSeguimientoId++,
      proyectoId,
      tipo: data.tipo,
      descripcion: data.descripcion,
      fecha: data.fecha,
      proximaActividad: data.proximaActividad,
      fechaProximaActividad: data.fechaProximaActividad,
      usuario: 'Usuario Actual',
      createdAt: new Date().toISOString(),
    }
    mockSeguimientos.push(seguimiento)
    return seguimiento
  }

  async deleteSeguimiento(_proyectoId: number, seguimientoId: number): Promise<void> {
    await this.delay()
    const index = mockSeguimientos.findIndex((s) => s.id === seguimientoId)
    if (index === -1) throw new Error('Seguimiento no encontrado')
    mockSeguimientos.splice(index, 1)
  }

  async getDocumentos(proyectoId: number): Promise<Documento[]> {
    await this.delay()
    return mockDocumentos.filter((d) => d.proyectoId === proyectoId)
  }

  async uploadDocumento(_proyectoId: number, file: File, tipo: string): Promise<Documento> {
    await this.delay()
    const doc: Documento = {
      id: mockDocumentos.length + 1,
      proyectoId: _proyectoId,
      nombre: file.name,
      tipo,
      url: '#',
      tamano: file.size,
      usuario: 'Usuario Actual',
      createdAt: new Date().toISOString(),
    }
    mockDocumentos.push(doc)
    return doc
  }

  async deleteDocumento(_proyectoId: number, documentoId: number): Promise<void> {
    await this.delay()
    const index = mockDocumentos.findIndex((d) => d.id === documentoId)
    if (index === -1) throw new Error('Documento no encontrado')
    mockDocumentos.splice(index, 1)
  }

  async getCronologia(proyectoId: number): Promise<EventoCronologia[]> {
    await this.delay()
    return mockCronologia.filter(
      (e) => e.entidadTipo === 'proyecto' && e.entidadId === proyectoId,
    )
  }

  async getAllCronologia(): Promise<EventoCronologia[]> {
    await this.delay()
    return [...mockCronologia].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    )
  }

  async getClienteCronologia(clienteId: number): Promise<EventoCronologia[]> {
    await this.delay()
    const proyectoIds = mockProyectos.filter((p) => p.clienteId === clienteId).map((p) => p.id)
    return mockCronologia
      .filter(
        (e) =>
          (e.entidadTipo === 'cliente' && e.entidadId === clienteId) ||
          (e.entidadTipo === 'proyecto' && proyectoIds.includes(e.entidadId)),
      )
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }

  private async getTipoProyecto(id: number) {
    const { mockTiposProyecto } = await import('@/mock/catalogos')
    return mockTiposProyecto.find((t) => t.id === id) || mockTiposProyecto[0]
  }

  private delay(ms = 150): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const projectService = new ProjectMockService()
