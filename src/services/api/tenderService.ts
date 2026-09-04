import { apiClient } from './apiConfig'
import type {
  Tender,
  Licitacion,
  CreateTenderRequest,
  UpdateTenderRequest,
  PaginatedResponse,
  PaginationParams,
  TenderServiceItem,
} from '@/types/crmTypes'

const tipoLabels: Record<string, string> = {
  publica: 'Pública',
  minima_cuantia: 'Mínima Cuantía',
  solicitud_informacion: 'Solicitud de Información',
  contratacion_especial: 'Contratación Especial',
}

const estadoLabels: Record<string, string> = {
  publicada: 'Publicada',
  en_curso: 'En curso',
  cerrada: 'Cerrada',
  adjudicada: 'Adjudicada',
  desierta: 'Desierta',
  cancelada: 'Cancelada',
}

function mapTenderToLicitacion(t: Tender): Licitacion {
  return {
    id: t.id,
    oferta: t.offerCode || '',
    tipo: (t.type as Licitacion['tipo']) || 'publica',
    tipoLabel: tipoLabels[t.type] || t.type,
    numeroProceso: t.processNumber || '',
    clienteNombre: t.clientName || '',
    servicio: t.service || '',
    norma: t.norm || '',
    estado: (t.status as Licitacion['estado']) || 'publicada',
    fechaPublicacion: t.publicationDate || '',
    fechaCierre: t.closingDate,
    valorEstimado: t.estimatedValue,
    observaciones: t.observations,
    servicios: t.services || [],
    createdAt: t.createdAt,
  }
}

class TenderService {
  private readonly endpoint = '/tenders'

  async getAll(params?: PaginationParams & { search?: string }): Promise<PaginatedResponse<Licitacion>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Tender[]>(`${this.endpoint}${query}`)
    const raw = response.data as unknown

    let items: Tender[] = []
    let total = 0
    let page = 1
    let pageSize = 10
    let totalPages = 1

    if (Array.isArray(raw)) {
      items = raw
      total = raw.length
      totalPages = 1
    } else if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      items = (obj['data'] || obj['tenders'] || []) as Tender[]
      total = (obj['total'] as number) || items.length
      page = (obj['page'] as number) || params?.page || 1
      pageSize = (obj['limit'] as number) || params?.pageSize || 10
      totalPages = (obj['totalPages'] as number) || Math.ceil(total / pageSize) || 1
    }

    return {
      data: items.map(mapTenderToLicitacion),
      total,
      page,
      pageSize,
      totalPages,
    }
  }

  async getById(id: number): Promise<Licitacion> {
    const response = await apiClient.get<Tender>(`${this.endpoint}/${id}`)
    return mapTenderToLicitacion(response.data as unknown as Tender)
  }

  async create(data: CreateTenderRequest): Promise<Licitacion> {
    const response = await apiClient.post<Tender>(this.endpoint, data)
    return mapTenderToLicitacion(response.data as unknown as Tender)
  }

  async update(id: number, data: UpdateTenderRequest): Promise<Licitacion> {
    const response = await apiClient.patch<Tender>(`${this.endpoint}/${id}`, data)
    return mapTenderToLicitacion(response.data as unknown as Tender)
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
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }
}

export const tenderService = new TenderService()
