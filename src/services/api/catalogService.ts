import { apiClient } from './apiConfig'
import type {
  TipoProyecto,
  Norma,
  EstadoProyecto,
  TipoServicio,
} from '@/types/crmTypes'

class CatalogService {
  // ====== TIPOS DE PROYECTO ======

  async getTiposProyecto(): Promise<TipoProyecto[]> {
    const response = await apiClient.get<TipoProyecto[]>('/catalogs/project-types')
    return Array.isArray(response.data) ? response.data : []
  }

  async createTipoProyecto(data: Omit<TipoProyecto, 'id'>): Promise<TipoProyecto> {
    const response = await apiClient.post<TipoProyecto>('/catalogs/project-types', data)
    return response.data as unknown as TipoProyecto
  }

  async updateTipoProyecto(id: number, data: Partial<TipoProyecto>): Promise<TipoProyecto> {
    const response = await apiClient.put<TipoProyecto>(`/catalogs/project-types/${id}`, data)
    return response.data as unknown as TipoProyecto
  }

  async deleteTipoProyecto(id: number): Promise<void> {
    await apiClient.delete(`/catalogs/project-types/${id}`)
  }

  // ====== NORMAS ======

  async getNormas(): Promise<Norma[]> {
    const response = await apiClient.get<Norma[]>('/catalogs/norms')
    return Array.isArray(response.data) ? response.data : []
  }

  async createNorma(data: Omit<Norma, 'id'>): Promise<Norma> {
    const response = await apiClient.post<Norma>('/catalogs/norms', data)
    return response.data as unknown as Norma
  }

  async updateNorma(id: number, data: Partial<Norma>): Promise<Norma> {
    const response = await apiClient.put<Norma>(`/catalogs/norms/${id}`, data)
    return response.data as unknown as Norma
  }

  async deleteNorma(id: number): Promise<void> {
    await apiClient.delete(`/catalogs/norms/${id}`)
  }

  // ====== ESTADOS DE PROYECTO ======

  async getEstadosProyecto(): Promise<EstadoProyecto[]> {
    const response = await apiClient.get<EstadoProyecto[]>('/catalogs/project-statuses')
    return Array.isArray(response.data) ? response.data : []
  }

  async createEstadoProyecto(data: Omit<EstadoProyecto, 'id'>): Promise<EstadoProyecto> {
    const response = await apiClient.post<EstadoProyecto>('/catalogs/project-statuses', data)
    return response.data as unknown as EstadoProyecto
  }

  async updateEstadoProyecto(id: number, data: Partial<EstadoProyecto>): Promise<EstadoProyecto> {
    const response = await apiClient.put<EstadoProyecto>(
      `/catalogs/project-statuses/${id}`,
      data,
    )
    return response.data as unknown as EstadoProyecto
  }

  async deleteEstadoProyecto(id: number): Promise<void> {
    await apiClient.delete(`/catalogs/project-statuses/${id}`)
  }

  // ====== TIPOS DE SERVICIO ======

  async getTiposServicio(): Promise<TipoServicio[]> {
    const response = await apiClient.get<TipoServicio[]>('/catalogs/service-types')
    return Array.isArray(response.data) ? response.data : []
  }

  async createTipoServicio(data: Omit<TipoServicio, 'id'>): Promise<TipoServicio> {
    const response = await apiClient.post<TipoServicio>('/catalogs/service-types', data)
    return response.data as unknown as TipoServicio
  }

  async updateTipoServicio(id: number, data: Partial<TipoServicio>): Promise<TipoServicio> {
    const response = await apiClient.put<TipoServicio>(`/catalogs/service-types/${id}`, data)
    return response.data as unknown as TipoServicio
  }

  async deleteTipoServicio(id: number): Promise<void> {
    await apiClient.delete(`/catalogs/service-types/${id}`)
  }
}

export const catalogService = new CatalogService()
