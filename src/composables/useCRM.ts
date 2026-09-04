import { ref, computed } from 'vue'
import { clientService } from '@/services/api/clientService'
import { projectService } from '@/services/api/projectService'
import { catalogService } from '@/services/api/catalogService'
import { quoteService } from '@/services/api/quoteService'
import type {
  Cliente,
  Proyecto,
  Contacto,
  Seguimiento,
  Documento,
  EventoCronologia,
  TipoProyecto,
  Norma,
  EstadoProyecto,
  TipoServicio,
  CRMStats,
  FiltroEstado,
  CreateClienteRequest,
  UpdateClienteRequest,
  CreateContactoRequest,
  CreateProyectoRequest,
  UpdateProyectoRequest,
  CreateSeguimientoRequest,
  Cotizacion,
  CreateCotizacionRequest,
  UpdateCotizacionRequest,
  ClientContact,
} from '@/types/crmTypes'

// Estado global compartido
const clientes = ref<Cliente[]>([])
const proyectos = ref<Proyecto[]>([])
const cotizaciones = ref<Cotizacion[]>([])
const stats = ref<CRMStats>({
  totalClientes: 0,
  totalProspectos: 0,
  proyectosActivos: 0,
  proyectosFinalizados: 0,
  cotizacionesPendientes: 0,
  seguimientosProgramados: 0,
})

const tiposProyecto = ref<TipoProyecto[]>([])
const normas = ref<Norma[]>([])
const estadosProyecto = ref<EstadoProyecto[]>([])
const tiposServicio = ref<TipoServicio[]>([])

const loading = ref(false)
const error = ref<string | null>(null)
const filtroEstado = ref<FiltroEstado>('todos')
const busqueda = ref('')

// Paginación server-side para clientes
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(10)

export function useCRM() {
  // ====== COMPUTED ======

  const clientesFiltrados = computed(() => {
    return clientes.value
  })

  const proyectosFiltrados = computed(() => {
    let result = proyectos.value

    if (busqueda.value) {
      const term = busqueda.value.toLowerCase()
      result = result.filter(
        (p) =>
          p.code.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term)) ||
          p.responsible.toLowerCase().includes(term),
      )
    }

    switch (filtroEstado.value) {
      case 'activos':
        result = result.filter((p) => p.status === 'En Ejecucion')
        break
      case 'finalizados':
        result = result.filter((p) => p.status === 'Finalizado')
        break
      case 'en_ejecucion':
        result = result.filter((p) => p.status === 'En Ejecucion')
        break
      case 'suspendidos':
        result = result.filter((p) => p.status === 'Suspendido')
        break
    }

    return result
  })

  // ====== CLIENTES ======

  async function fetchClientes(params?: { page?: number; limit?: number; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const page = params?.page || currentPage.value
      const limit = params?.limit || pageSize.value
      const search = params?.search

      const response = await clientService.getAll({ page, limit, search })
      clientes.value = response.data
      currentPage.value = response.page
      totalPages.value = response.totalPages
      totalItems.value = response.total

      stats.value.totalClientes = response.data.filter((c) => !c.isProspect && c.isActive).length
      stats.value.totalProspectos = response.data.filter((c) => c.isProspect).length
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar clientes'
    } finally {
      loading.value = false
    }
  }

  async function fetchCliente(id: number): Promise<Cliente | null> {
    loading.value = true
    error.value = null
    try {
      return await clientService.getById(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar cliente'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createCliente(data: CreateClienteRequest): Promise<Cliente | null> {
    loading.value = true
    error.value = null
    try {
      const cliente = await clientService.create(data)
      return cliente
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al crear cliente'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateCliente(id: number, data: UpdateClienteRequest): Promise<Cliente | null> {
    loading.value = true
    error.value = null
    try {
      const cliente = await clientService.update(id, data)
      const index = clientes.value.findIndex((c) => c.id === id)
      if (index !== -1) clientes.value[index] = cliente
      return cliente
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar cliente'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteCliente(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await clientService.delete(id)
      clientes.value = clientes.value.filter((c) => c.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al eliminar cliente'
      return false
    } finally {
      loading.value = false
    }
  }

  async function convertProspecto(id: number): Promise<Cliente | null> {
    loading.value = true
    error.value = null
    try {
      const cliente = await clientService.patch(id, { isProspect: false, isActive: true })
      const index = clientes.value.findIndex((c) => c.id === id)
      if (index !== -1) clientes.value[index] = cliente
      return cliente
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al convertir prospecto'
      return null
    } finally {
      loading.value = false
    }
  }

  // ====== CONTACTOS ======

  async function fetchContactos(clienteId: number): Promise<Contacto[]> {
    try {
      const contacts = await clientService.getContactos(clienteId)
      return contacts.map((c, i) => ({
        id: c.id || i,
        clienteId,
        nombre: c.name || '',
        cargo: c.position || '',
        celular: c.phone || '',
        correo: c.email || '',
        esPrincipal: c.isPrimary || false,
        createdAt: new Date().toISOString(),
      }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar contactos'
      return []
    }
  }

  async function createContacto(
    clienteId: number,
    data: CreateContactoRequest,
  ): Promise<Contacto | null> {
    loading.value = true
    error.value = null
    try {
      const contacto = await clientService.createContacto(clienteId, {
        name: data.nombre,
        position: data.cargo,
        phone: data.celular,
        email: data.correo,
        isPrimary: data.esPrincipal,
      })
      return {
        id: contacto.id || Date.now(),
        clienteId,
        nombre: contacto.name || '',
        cargo: contacto.position || '',
        celular: contacto.phone || '',
        correo: contacto.email || '',
        esPrincipal: contacto.isPrimary || false,
        createdAt: new Date().toISOString(),
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al crear contacto'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteContacto(clienteId: number, contactoId: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await clientService.deleteContacto(clienteId, contactoId)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al eliminar contacto'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateContacto(
    clienteId: number,
    contactoId: number,
    data: Partial<CreateContactoRequest>,
  ): Promise<Contacto | null> {
    loading.value = true
    error.value = null
    try {
      const updated = await clientService.updateContacto(clienteId, contactoId, data as Partial<ClientContact>)
      return {
        id: updated.id || 0,
        clienteId,
        nombre: updated.name || '',
        cargo: updated.position || '',
        celular: updated.phone || '',
        correo: updated.email || '',
        esPrincipal: updated.isPrimary || false,
        createdAt: new Date().toISOString(),
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar contacto'
      return null
    } finally {
      loading.value = false
    }
  }

  // ====== PROYECTOS ======

  async function fetchProyectos(params?: { limit?: number }) {
    loading.value = true
    error.value = null
    try {
      const response = await projectService.getAll(params)
      proyectos.value = response.data
      stats.value.proyectosActivos = response.data.filter(
        (p) => p.status === 'En Ejecucion',
      ).length
      stats.value.proyectosFinalizados = response.data.filter(
        (p) => p.status === 'Finalizado',
      ).length
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar proyectos'
    } finally {
      loading.value = false
    }
  }

  async function fetchProyectosByCliente(clienteId: number): Promise<Proyecto[]> {
    try {
      return await projectService.getByCliente(clienteId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar proyectos'
      return []
    }
  }

  async function fetchProyecto(id: number): Promise<Proyecto | null> {
    loading.value = true
    error.value = null
    try {
      return await projectService.getById(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar proyecto'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createProyecto(data: CreateProyectoRequest): Promise<Proyecto | null> {
    loading.value = true
    error.value = null
    try {
      const proyecto = await projectService.create(data)
      proyectos.value.unshift(proyecto)
      return proyecto
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al crear proyecto'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateProyecto(
    id: number,
    data: UpdateProyectoRequest,
  ): Promise<Proyecto | null> {
    loading.value = true
    error.value = null
    try {
      const proyecto = await projectService.update(id, data)
      const index = proyectos.value.findIndex((p) => p.id === id)
      if (index !== -1) proyectos.value[index] = proyecto
      return proyecto
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar proyecto'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteProyecto(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await projectService.delete(id)
      proyectos.value = proyectos.value.filter((p) => p.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al eliminar proyecto'
      return false
    } finally {
      loading.value = false
    }
  }

  // ====== SEGUIMIENTOS ======

  async function fetchSeguimientos(proyectoId: number): Promise<Seguimiento[]> {
    try {
      return await projectService.getSeguimientos(proyectoId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar seguimientos'
      return []
    }
  }

  async function createSeguimiento(
    proyectoId: number,
    data: CreateSeguimientoRequest,
  ): Promise<Seguimiento | null> {
    loading.value = true
    error.value = null
    try {
      return await projectService.createSeguimiento(proyectoId, data)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al crear seguimiento'
      return null
    } finally {
      loading.value = false
    }
  }

  // ====== DOCUMENTOS ======

  async function fetchDocumentosProyecto(proyectoId: number): Promise<Documento[]> {
    try {
      return await projectService.getDocumentos(proyectoId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar documentos'
      return []
    }
  }

  async function uploadDocumento(
    proyectoId: number,
    file: File,
    tipo: string,
  ): Promise<Documento | null> {
    loading.value = true
    error.value = null
    try {
      return await projectService.uploadDocumento(proyectoId, file, tipo)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al subir documento'
      return null
    } finally {
      loading.value = false
    }
  }

  // ====== COTIZACIONES ======

  async function fetchCotizaciones(params?: { page?: number; limit?: number; search?: string; clientId?: number; projectId?: number }) {
    loading.value = true
    error.value = null
    try {
      const response = await quoteService.getAll({
        page: params?.page || 1,
        pageSize: params?.limit || 9999,
        search: params?.search,
        clientId: params?.clientId,
        projectId: params?.projectId,
      })
      cotizaciones.value = response.data
      stats.value.cotizacionesPendientes = response.data.filter((c) => c.status === 'pendiente').length
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar cotizaciones'
    } finally {
      loading.value = false
    }
  }

  async function fetchCotizacion(id: number): Promise<Cotizacion | null> {
    loading.value = true
    error.value = null
    try {
      return await quoteService.getById(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar cotización'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createCotizacion(data: CreateCotizacionRequest): Promise<Cotizacion | null> {
    loading.value = true
    error.value = null
    try {
      const cotizacion = await quoteService.create(data)
      cotizaciones.value.unshift(cotizacion)
      return cotizacion
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al crear cotización'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateCotizacion(id: number, data: UpdateCotizacionRequest): Promise<Cotizacion | null> {
    loading.value = true
    error.value = null
    try {
      const cotizacion = await quoteService.update(id, data)
      const index = cotizaciones.value.findIndex((c) => c.id === id)
      if (index !== -1) cotizaciones.value[index] = cotizacion
      return cotizacion
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar cotización'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteCotizacion(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await quoteService.delete(id)
      cotizaciones.value = cotizaciones.value.filter((c) => c.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al eliminar cotización'
      return false
    } finally {
      loading.value = false
    }
  }

  // ====== CRONOLOGÍA ======

  async function fetchCronologia(
    tipo: 'cliente' | 'proyecto',
    id: number,
  ): Promise<EventoCronologia[]> {
    try {
      if (tipo === 'cliente') {
        return await projectService.getClienteCronologia(id)
      }
      return await projectService.getCronologia(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar cronología'
      return []
    }
  }

  // ====== CATÁLOGOS ======

  async function fetchCatalogos() {
    loading.value = true
    error.value = null
    try {
      const [tipos, norms, estados, servicios] = await Promise.all([
        catalogService.getTiposProyecto(),
        catalogService.getNormas(),
        catalogService.getEstadosProyecto(),
        catalogService.getTiposServicio(),
      ])
      tiposProyecto.value = tipos
      normas.value = norms
      estadosProyecto.value = estados
      tiposServicio.value = servicios
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar catálogos'
    } finally {
      loading.value = false
    }
  }

  // ====== DASHBOARD ======

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      await Promise.all([fetchClientes({ page: 1, limit: 9999 }), fetchProyectos({ limit: 9999 }), fetchCatalogos()])
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar dashboard'
    } finally {
      loading.value = false
    }
  }

  // ====== FILTROS ======

  function setFiltro(estado: FiltroEstado) {
    filtroEstado.value = estado
  }

  function setBusqueda(term: string) {
    busqueda.value = term
  }

  function clearError() {
    error.value = null
  }

  return {
    // Estado
    clientes,
    proyectos,
    cotizaciones,
    stats,
    tiposProyecto,
    normas,
    estadosProyecto,
    tiposServicio,
    loading,
    error,
    filtroEstado,
    busqueda,

    // Paginación
    currentPage,
    totalPages,
    totalItems,
    pageSize,

    // Computed
    clientesFiltrados,
    proyectosFiltrados,

    // Clientes
    fetchClientes,
    fetchCliente,
    createCliente,
    updateCliente,
    deleteCliente,
    convertProspecto,

    // Contactos
    fetchContactos,
    createContacto,
    updateContacto,
    deleteContacto,

    // Proyectos
    fetchProyectos,
    fetchProyectosByCliente,
    fetchProyecto,
    createProyecto,
    updateProyecto,
    deleteProyecto,

    // Seguimientos
    fetchSeguimientos,
    createSeguimiento,

    // Documentos
    fetchDocumentosProyecto,
    uploadDocumento,

    // Cronología
    fetchCronologia,

    // Cotizaciones
    fetchCotizaciones,
    fetchCotizacion,
    createCotizacion,
    updateCotizacion,
    deleteCotizacion,

    // Catálogos
    fetchCatalogos,

    // Dashboard
    fetchDashboard,

    // Filtros
    setFiltro,
    setBusqueda,
    clearError,
  }
}
