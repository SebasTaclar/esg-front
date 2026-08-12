import type {
  Proyecto,
  CreateProyectoRequest,
  Seguimiento,
  CreateSeguimientoRequest,
  Documento,
  EventoCronologia,
  PaginationParams,
  PaginatedResponse,
} from '@/types/crmTypes'
import { mockProyectos } from '@/mock/proyectos'
import { mockSeguimientos } from '@/mock/seguimientos'
import { mockDocumentos } from '@/mock/documentos'
import { mockCronologia } from '@/mock/cronologia'

let nextProyectoId = mockProyectos.length + 1
let nextSeguimientoId = mockSeguimientos.length + 1

class ProjectMockService {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Proyecto>> {
    await this.delay()
    let data = [...mockProyectos]

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
    return { ...proyecto }
  }

  async getByCliente(clienteId: number): Promise<Proyecto[]> {
    await this.delay()
    return mockProyectos.filter((p) => p.clienteId === clienteId)
  }

  async create(data: CreateProyectoRequest): Promise<Proyecto> {
    await this.delay()

    const tipoProyecto = await this.getTipoProyecto(data.tipoProyectoId)
    const consecutivo = mockProyectos.filter((p) => p.abreviatura === tipoProyecto.abreviatura).length + 1
    const codigo = `${String(consecutivo).padStart(4, '0')}-${tipoProyecto.abreviatura}`

    const proyecto: Proyecto = {
      id: nextProyectoId++,
      consecutivo,
      abreviatura: tipoProyecto.abreviatura,
      codigo,
      clienteId: data.clienteId,
      tipoProyectoId: data.tipoProyectoId,
      tipoProyectoNombre: tipoProyecto.nombre,
      tipoServicioId: data.tipoServicioId,
      normaId: data.normaId,
      estadoId: data.estadoId,
      responsable: data.responsable,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      descripcion: data.descripcion,
      observaciones: data.observaciones,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProyectos.push(proyecto)
    return proyecto
  }

  async update(id: number, data: Partial<CreateProyectoRequest>): Promise<Proyecto> {
    await this.delay()
    const index = mockProyectos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Proyecto no encontrado')
    mockProyectos[index] = { ...mockProyectos[index], ...data, updatedAt: new Date().toISOString() }
    return mockProyectos[index]
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
