// ====== CATÁLOGOS ======

export interface TipoProyecto {
  id: number
  abreviatura: string
  nombre: string
  activo: boolean
}

export interface Norma {
  id: number
  codigo: string
  nombre: string
  activa: boolean
}

export interface EstadoProyecto {
  id: number
  codigo: string
  nombre: string
  color: string
  orden: number
}

export interface TipoServicio {
  id: number
  nombre: string
  activo: boolean
}

// ====== CLIENTE ======

export interface Cliente {
  id: number
  razonSocial: string
  nit: string
  codigo?: string
  tipoOrganizacion?: string
  norma?: string
  ciudad: string
  departamento: string
  direccion: string
  telefono: string
  correo: string
  paginaWeb?: string
  estado: 'activo' | 'inactivo' | 'prospecto' | 'nuevo' | 'contactado' | 'en_diagnostico' | 'cotizacion_enviada' | 'en_negociacion' | 'ganado' | 'perdido' | 'en_pausa'
  observaciones?: string
  contactosCount?: number
  proyectosCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateClienteRequest {
  razonSocial: string
  nit: string
  ciudad: string
  departamento: string
  direccion: string
  telefono: string
  correo: string
  paginaWeb?: string
  estado?: 'activo' | 'inactivo' | 'prospecto'
  observaciones?: string
}

export interface UpdateClienteRequest extends Partial<CreateClienteRequest> {}

// ====== CONTACTO ======

export interface Contacto {
  id: number
  clienteId: number
  nombre: string
  cargo: string
  celular: string
  correo: string
  esPrincipal: boolean
  createdAt: string
}

export interface CreateContactoRequest {
  clienteId: number
  nombre: string
  cargo: string
  celular: string
  correo: string
  esPrincipal?: boolean
}

export interface UpdateContactoRequest extends Partial<Omit<CreateContactoRequest, 'clienteId'>> {}

// ====== PROYECTO ======

export interface Proyecto {
  id: number
  consecutivo: number
  abreviatura: string
  codigo: string
  clienteId: number
  clienteRazonSocial?: string
  tipoProyectoId: number
  tipoProyectoNombre?: string
  tipoServicioId?: number
  tipoServicioNombre?: string
  normaId: number
  normaCodigo?: string
  estadoId: number
  estadoNombre?: string
  estadoColor?: string
  responsable: string
  fechaInicio: string
  fechaFin?: string
  descripcion: string
  observaciones?: string
  oferta?: string
  costoTotal?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProyectoRequest {
  clienteId: number
  tipoProyectoId: number
  tipoServicioId?: number
  normaId: number
  estadoId: number
  responsable: string
  fechaInicio: string
  fechaFin?: string
  descripcion: string
  observaciones?: string
}

export interface UpdateProyectoRequest extends Partial<CreateProyectoRequest> {}

// ====== SEGUIMIENTO ======

export type TipoSeguimiento = 'llamada' | 'correo' | 'reunion' | 'visita' | 'compromiso'

export interface Seguimiento {
  id: number
  proyectoId: number
  tipo: TipoSeguimiento
  descripcion: string
  fecha: string
  proximaActividad?: string
  fechaProximaActividad?: string
  usuario: string
  createdAt: string
}

export interface CreateSeguimientoRequest {
  proyectoId: number
  tipo: TipoSeguimiento
  descripcion: string
  fecha: string
  proximaActividad?: string
  fechaProximaActividad?: string
}

// ====== DOCUMENTO ======

export interface Documento {
  id: number
  proyectoId: number
  nombre: string
  tipo: string
  url: string
  tamano: number
  usuario: string
  createdAt: string
}

// ====== CRONOLOGÍA ======

export type EntidadTipo = 'cliente' | 'proyecto' | 'cotizacion'

export interface EventoCronologia {
  id: number
  entidadTipo: EntidadTipo
  entidadId: number
  tipo: string
  descripcion: string
  usuario: string
  fecha: string
}

// ====== DASHBOARD ======

export interface CRMStats {
  totalClientes: number
  totalProspectos: number
  proyectosActivos: number
  proyectosFinalizados: number
  cotizacionesPendientes: number
  seguimientosProgramados: number
}

// ====== FILTROS ======

export type FiltroEstado = 'todos' | 'clientes' | 'prospectos' | 'activos' | 'finalizados' | 'en_ejecucion' | 'suspendidos'

export interface CRMFilters {
  busqueda: string
  estado: FiltroEstado
}

// ====== PAGINACIÓN ======

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ====== SERVICIOS DE PROYECTO ======

export interface ServicioProyecto {
  id: number
  proyectoId: number
  nombre: string
  norma: string
  cantidad: number
  valorUnitario: number
  valorTotal: number
  colaborador: string
}

// ====== CONTACTOS DE PROYECTO ======

export interface ContactoProyecto {
  id: number
  proyectoId: number
  clienteId: number
  nombre: string
  cargo: string
  telefono: string
  correo: string
  esPrincipal: boolean
}

// ====== DOCUMENTOS DE PROYECTO ======

export interface DocumentoProyecto {
  id: number
  proyectoId: number
  nombre: string
  tipo: 'oferta' | 'contrato' | 'informe' | 'certificado' | 'acta' | 'presentacion'
  fecha: string
  usuario: string
  tamano: number
}

// ====== LICITACIONES ======

export type TipoLicitacion = 'minima_cuantia' | 'solicitud_informacion' | 'contratacion_especial'

export type EstadoLicitacion = 'publicada' | 'en_curso' | 'cerrada' | 'adjudicada' | 'desierta' | 'cancelada'

export interface Licitacion {
  id: number
  oferta: string
  tipo: TipoLicitacion
  tipoLabel: string
  numeroProceso: string
  clienteNombre: string
  servicio: string
  norma: string
  estado: EstadoLicitacion
  fechaPublicacion: string
  fechaCierre?: string
  valorEstimado?: number
  observaciones?: string
  createdAt: string
}

// ====== ACTIVIDADES DE PROYECTO ======

export interface ActividadProyecto {
  id: number
  proyectoId: number
  tipo: 'proyecto_creado' | 'oferta_enviada' | 'oferta_aprobada' | 'reunion' | 'documento_agregado' | 'visita' | 'proyecto_finalizado' | 'proyecto_actualizado'
  descripcion: string
  usuario: string
  fecha: string
}

// ====== COLABORADORES ======

export type EstadoColaborador = 'disponible' | 'asignado' | 'no_disponible' | 'documentacion_pendiente' | 'inactivo'

export interface Colaborador {
  id: number
  nombre: string
  estudios: string
  areaPrincipal: string
  normasCount: number
  ciudad: string
  estado: EstadoColaborador
  celular: string
  correo: string
  competencias: CompetenciaColaborador[]
  documentos: DocumentoColaborador[]
}

export interface CompetenciaColaborador {
  id: number
  area: string
  norma: string
  descripcion: string
}

export interface DocumentoColaborador {
  id: number
  nombre: string
  tipo: 'hoja_de_vida' | 'soportes_estudio' | 'soportes_experiencia' | 'certificado'
  estado: 'completo' | 'pendiente' | 'faltante'
}
