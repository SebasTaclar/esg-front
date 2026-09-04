import { apiClient } from './apiConfig'
import { clientAuthService } from './clientAuthService'
import { clientService } from './clientService'
import { projectService } from './projectService'
import { documentService } from './documentService'
import { quoteService } from './quoteService'
import type { Cliente, Proyecto, DocumentoEntity, Cotizacion } from '@/types/crmTypes'

export interface PortalUserData {
  clientId: number
  client: Cliente
  projects: Proyecto[]
  documents: DocumentoEntity[]
  cotizaciones: Cotizacion[]
}

class PortalService {
  async getPortalData(): Promise<PortalUserData> {
    const userInfo = clientAuthService.getUserInfo()
    if (!userInfo) {
      throw new Error('No hay sesión activa')
    }

    let clientId = 0
    let client: Cliente | null = null
    let projectsResult: Proyecto[] = []
    let cotizaciones: Cotizacion[] = []

    try {
      clientId = await this.getClientIdForUser()

      const results = await Promise.all([
        clientService.getById(clientId).catch(() => null),
        projectService.getByCliente(clientId).catch(() => []),
        quoteService.getByClient(clientId).catch(() => []),
      ])

      client = results[0] as unknown as Cliente
      projectsResult = results[1]
      cotizaciones = results[2]
    } catch {
      cotizaciones = await quoteService.getMyQuotes().catch(() => [])
    }

    const documents = client ? await this.getDocumentsForClient(clientId, projectsResult) : []

    return {
      clientId,
      client: client as unknown as Cliente,
      projects: projectsResult,
      documents,
      cotizaciones,
    }
  }

  private async getClientIdForUser(): Promise<number> {
    const userInfo = clientAuthService.getUserInfo()
    if (!userInfo) {
      throw new Error('No hay sesion activa')
    }

    if (userInfo.clientId) {
      return userInfo.clientId
    }

    if (userInfo.teamId) {
      return userInfo.teamId
    }

    const clientList = await clientService.getAll({ search: userInfo.email || '' }).catch(() => null)
    if (clientList && clientList.data.length > 0) {
      return clientList.data[0].id
    }

    throw new Error('No se encontro un cliente asociado a esta cuenta')
  }

  private async getDocumentsForClient(clientId: number, projects: Proyecto[]): Promise<DocumentoEntity[]> {
    const allDocuments: DocumentoEntity[] = []

    try {
      const clientDocs = await documentService.getByEntity('client', clientId)
      allDocuments.push(...clientDocs)
    } catch {
      // Skip failed client document fetch
    }

    for (const project of projects) {
      try {
        const docs = await documentService.getByEntity('project', project.id)
        allDocuments.push(...docs)
      } catch {
        // Skip failed document fetches
      }
    }

    return allDocuments
  }
}

export const portalService = new PortalService()
