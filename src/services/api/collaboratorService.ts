import { apiClient } from './apiConfig'
import type {
  Colaborador,
  CreateColaboradorRequest,
  UpdateColaboradorRequest,
  EstadoColaborador,
  CompetenciaColaborador,
} from '@/types/crmTypes'

interface BackendColaborador {
  id: number
  name: string
  studies: string
  mainArea: string
  city: string
  phone: string
  email: string
  status: string
  competencies: { area: string; norm: string; description: string }[]
  documents?: { id: number; name: string; type: string; status: string }[]
}

const statusMap: Record<string, EstadoColaborador> = {
  available: 'disponible',
  assigned: 'asignado',
  unavailable: 'no_disponible',
  pending_docs: 'documentacion_pendiente',
  inactive: 'inactivo',
}

const statusMapReverse: Record<EstadoColaborador, string> = {
  disponible: 'available',
  asignado: 'assigned',
  no_disponible: 'unavailable',
  documentacion_pendiente: 'pending_docs',
  inactivo: 'inactive',
}

function mapFromBackend(b: BackendColaborador): Colaborador {
  const competencias: CompetenciaColaborador[] = (b.competencies || []).map((c, i) => ({
    id: i + 1,
    area: c.area,
    norma: c.norm,
    descripcion: c.description,
  }))
  return {
    id: b.id,
    nombre: b.name,
    estudios: b.studies,
    areaPrincipal: b.mainArea,
    normasCount: competencias.length,
    ciudad: b.city,
    estado: statusMap[b.status] || 'disponible',
    celular: b.phone,
    correo: b.email,
    competencias,
    documentos: (b.documents || []).map((d) => ({
      id: d.id,
      nombre: d.name,
      tipo: d.type as 'hoja_de_vida' | 'soportes_estudio' | 'soportes_experiencia' | 'certificado',
      estado: d.status as 'completo' | 'pendiente' | 'faltante',
    })),
  }
}

function toBackendPayload(data: CreateColaboradorRequest) {
  return {
    name: data.name,
    studies: data.studies || '-',
    mainArea: data.mainArea || '-',
    city: data.city || '-',
    phone: data.phone || '-',
    email: data.email || '-',
    status: data.status,
    competencies: data.competencies.map(c => ({
      area: c.area,
      norm: c.norm,
      description: c.description,
    })),
  }
}

class CollaboratorService {
  private readonly endpoint = '/collaborators'

  async getAll(): Promise<Colaborador[]> {
    const response = await apiClient.get<{ count: number; collaborators: BackendColaborador[] }>(this.endpoint)
    const raw = (response.data as unknown as { count: number; collaborators: BackendColaborador[] }) || { collaborators: [] }
    const list = raw.collaborators || []
    return list.map(mapFromBackend)
  }

  async getById(id: number): Promise<Colaborador> {
    const response = await apiClient.get<{ collaborator: BackendColaborador }>(`${this.endpoint}/${id}`)
    const raw = response.data as unknown as { collaborator: BackendColaborador } | BackendColaborador
    const b = (raw as any).collaborator || raw
    return mapFromBackend(b as BackendColaborador)
  }

  async create(data: CreateColaboradorRequest): Promise<Colaborador> {
    const response = await apiClient.post<{ collaborator: BackendColaborador }>(this.endpoint, toBackendPayload(data))
    const raw = response.data as unknown as { collaborator: BackendColaborador } | BackendColaborador
    const b = (raw as any).collaborator || raw
    return mapFromBackend(b as BackendColaborador)
  }

  async update(id: number, data: UpdateColaboradorRequest): Promise<Colaborador> {
    const payload: Record<string, unknown> = {}
    if (data.name !== undefined) payload.name = data.name
    if (data.studies !== undefined) payload.studies = data.studies || '-'
    if (data.mainArea !== undefined) payload.mainArea = data.mainArea || '-'
    if (data.city !== undefined) payload.city = data.city || '-'
    if (data.phone !== undefined) payload.phone = data.phone || '-'
    if (data.email !== undefined) payload.email = data.email || '-'
    if (data.status !== undefined) payload.status = data.status
    if (data.competencies !== undefined) payload.competencies = data.competencies.map(c => ({ area: c.area, norm: c.norm, description: c.description }))
    const response = await apiClient.patch<{ collaborator: BackendColaborador }>(`${this.endpoint}/${id}`, payload)
    const raw = response.data as unknown as { collaborator: BackendColaborador } | BackendColaborador
    const b = (raw as any).collaborator || raw
    return mapFromBackend(b as BackendColaborador)
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }
}

export const collaboratorService = new CollaboratorService()
