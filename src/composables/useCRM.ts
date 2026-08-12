import { ref, computed } from 'vue'
import { clientService } from '@/services/api/clientMockService'
import { projectService } from '@/services/api/projectMockService'
import { catalogService } from '@/services/api/catalogMockService'
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
} from '@/types/crmTypes'

// Estado global compartido
const clientes = ref<Cliente[]>([])
const proyectos = ref<Proyecto[]>([])
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

export function useCRM() {
  // ====== COMPUTED ======

  const clientesFiltrados = computed(() => {
    let result = clientes.value

    if (busqueda.value) {
      const term = busqueda.value.toLowerCase()
      result = result.filter(
        (c) =>
          c.razonSocial.toLowerCase().includes(term) ||
          c.nit.includes(term) ||
          c.correo.toLowerCase().includes(term),
      )
    }

    switch (filtroEstado.value) {
      case 'clientes':
        result = result.filter((c) => c.estado === 'activo')
        break
      case 'prospectos':
        const prospectStatuses = ['prospecto', 'nuevo', 'contactado', 'en_diagnostico', 'cotizacion_enviada', 'en_negociacion', 'ganado', 'perdido', 'en_pausa']
        result = result.filter((c) => prospectStatuses.includes(c.estado))
        break
      case 'activos':
        result = result.filter((c) => c.estado === 'activo')
        break
    }

    return result
  })

  const proyectosFiltrados = computed(() => {
    let result = proyectos.value

    if (busqueda.value) {
      const term = busqueda.value.toLowerCase()
      result = result.filter(
        (p) =>
          p.codigo.toLowerCase().includes(term) ||
          (p.clienteRazonSocial && p.clienteRazonSocial.toLowerCase().includes(term)) ||
          p.responsable.toLowerCase().includes(term),
      )
    }

    switch (filtroEstado.value) {
      case 'activos':
        result = result.filter((p) => p.estadoNombre === 'En ejecución')
        break
      case 'finalizados':
        result = result.filter((p) => p.estadoNombre === 'Finalizado')
        break
      case 'en_ejecucion':
        result = result.filter((p) => p.estadoNombre === 'En ejecución')
        break
      case 'suspendidos':
        result = result.filter((p) => p.estadoNombre === 'Suspendido')
        break
    }

    return result
  })

  // ====== CLIENTES ======

  async function fetchClientes() {
    loading.value = true
    error.value = null
    try {
      const response = await clientService.getAll()
      clientes.value = response.data
      const prospectStatuses = ['prospecto', 'nuevo', 'contactado', 'en_diagnostico', 'cotizacion_enviada', 'en_negociacion', 'ganado', 'perdido', 'en_pausa']
      stats.value.totalClientes = response.data.filter((c) => c.estado === 'activo').length
      stats.value.totalProspectos = response.data.filter((c) => prospectStatuses.includes(c.estado)).length
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
      clientes.value.unshift(cliente)
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

  // ====== CONTACTOS ======

  async function fetchContactos(clienteId: number): Promise<Contacto[]> {
    try {
      return await clientService.getContactos(clienteId)
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
      return await clientService.createContacto(clienteId, data)
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

  // ====== PROYECTOS ======

  async function fetchProyectos() {
    loading.value = true
    error.value = null
    try {
      const response = await projectService.getAll()
      proyectos.value = response.data
      stats.value.proyectosActivos = response.data.filter(
        (p) => p.estadoNombre === 'En ejecución',
      ).length
      stats.value.proyectosFinalizados = response.data.filter(
        (p) => p.estadoNombre === 'Finalizado',
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
      await Promise.all([fetchClientes(), fetchProyectos(), fetchCatalogos()])
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
    stats,
    tiposProyecto,
    normas,
    estadosProyecto,
    tiposServicio,
    loading,
    error,
    filtroEstado,
    busqueda,

    // Computed
    clientesFiltrados,
    proyectosFiltrados,

    // Clientes
    fetchClientes,
    fetchCliente,
    createCliente,
    updateCliente,
    deleteCliente,

    // Contactos
    fetchContactos,
    createContacto,
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
