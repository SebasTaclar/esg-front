import type { TipoProyecto, Norma, EstadoProyecto, TipoServicio } from '@/types/crmTypes'
import { mockTiposProyecto, mockNormas, mockEstadosProyecto, mockTiposServicio } from '@/mock/catalogos'

class CatalogMockService {
  async getTiposProyecto(): Promise<TipoProyecto[]> {
    await this.delay()
    return [...mockTiposProyecto]
  }

  async createTipoProyecto(data: Omit<TipoProyecto, 'id'>): Promise<TipoProyecto> {
    await this.delay()
    return { id: mockTiposProyecto.length + 1, ...data }
  }

  async updateTipoProyecto(id: number, data: Partial<TipoProyecto>): Promise<TipoProyecto> {
    await this.delay()
    const item = mockTiposProyecto.find((t) => t.id === id)
    if (!item) throw new Error('Tipo no encontrado')
    return { ...item, ...data }
  }

  async deleteTipoProyecto(): Promise<void> {
    await this.delay()
  }

  async getNormas(): Promise<Norma[]> {
    await this.delay()
    return [...mockNormas]
  }

  async createNorma(data: Omit<Norma, 'id'>): Promise<Norma> {
    await this.delay()
    return { id: mockNormas.length + 1, ...data }
  }

  async updateNorma(id: number, data: Partial<Norma>): Promise<Norma> {
    await this.delay()
    const item = mockNormas.find((n) => n.id === id)
    if (!item) throw new Error('Norma no encontrada')
    return { ...item, ...data }
  }

  async deleteNorma(): Promise<void> {
    await this.delay()
  }

  async getEstadosProyecto(): Promise<EstadoProyecto[]> {
    await this.delay()
    return [...mockEstadosProyecto]
  }

  async createEstadoProyecto(data: Omit<EstadoProyecto, 'id'>): Promise<EstadoProyecto> {
    await this.delay()
    return { id: mockEstadosProyecto.length + 1, ...data }
  }

  async updateEstadoProyecto(
    id: number,
    data: Partial<EstadoProyecto>,
  ): Promise<EstadoProyecto> {
    await this.delay()
    const item = mockEstadosProyecto.find((e) => e.id === id)
    if (!item) throw new Error('Estado no encontrado')
    return { ...item, ...data }
  }

  async deleteEstadoProyecto(): Promise<void> {
    await this.delay()
  }

  async getTiposServicio(): Promise<TipoServicio[]> {
    await this.delay()
    return [...mockTiposServicio]
  }

  async createTipoServicio(data: Omit<TipoServicio, 'id'>): Promise<TipoServicio> {
    await this.delay()
    return { id: mockTiposServicio.length + 1, ...data }
  }

  async updateTipoServicio(id: number, data: Partial<TipoServicio>): Promise<TipoServicio> {
    await this.delay()
    const item = mockTiposServicio.find((t) => t.id === id)
    if (!item) throw new Error('Tipo de servicio no encontrado')
    return { ...item, ...data }
  }

  async deleteTipoServicio(): Promise<void> {
    await this.delay()
  }

  private delay(ms = 100): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const catalogService = new CatalogMockService()
