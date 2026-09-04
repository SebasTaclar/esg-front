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
  isActive?: boolean
  isProspect?: boolean
  showResources?: boolean
  contacts?: ClientContact[]
  resources?: ClientResource[]
  createdAt: string
  updatedAt: string
}

export interface CreateClienteRequest {
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
  estado?: 'activo' | 'inactivo' | 'prospecto'
  showResources?: boolean
  observaciones?: string
  contacts?: Array<{
    name: string
    position?: string
    phone?: string
    email?: string
    isPrimary?: boolean
  }>
}

export interface UpdateClienteRequest extends Partial<CreateClienteRequest> {}

// ====== CLIENTE API (backend) ======

export interface ClientContact {
  id?: number
  name: string
  position?: string
  phone?: string
  email?: string
  isPrimary?: boolean
}

export interface ClientResource {
  id?: number
  name: string
  url: string
  type: string
  uploadedAt?: string
}

export interface Client {
  id: number
  name: string
  nit?: string
  code?: string
  organizationType?: string
  norm?: string
  city?: string
  department?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  isActive: boolean
  isProspect: boolean
  observations?: string
  showResources?: boolean
  contacts?: ClientContact[]
  resources?: ClientResource[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateClientRequest {
  name: string
  nit?: string
  code?: string
  organizationType?: string
  norm?: string
  city?: string
  department?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  isActive?: boolean
  isProspect?: boolean
  observations?: string
  showResources?: boolean
  contacts?: Omit<ClientContact, 'id'>[]
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

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

export interface ServicioProyecto {
  name: string
  customName?: string
  norm: string
  customNorm?: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
  subtotalWithDiscount: number
  iva: number
  totalPrice: number
  collaborator: string
  applyIva?: boolean
  providerRole?: string
  providerCollaborator?: string
  providerBillingAccount?: string
  providerUnitPrice?: number
  providerTotalPrice?: number
  pretaxProfit?: number
  ica?: number
  simpleTax?: number
  entryDate?: string
  billingDate?: string
  purchaseOrderDate?: string
  purchaseOrderNumber?: string
  _showCost?: boolean
  _showProvider?: boolean
  _showTaxes?: boolean
  _showUtilities?: boolean
  _collapsed?: boolean
}

export interface ProjectClient {
  id: number
  name: string
  code?: string
  email?: string
  phone?: string
  nit?: string
}

export interface Proyecto {
  id: number
  consecutive: number
  abbreviation: string
  code: string
  clientId: number
  client?: ProjectClient
  projectType: string
  serviceType?: string
  norm: string
  status: string
  responsible: string
  startDate: string
  endDate?: string
  description: string
  observations?: string
  offer?: string
  totalCost?: number
  services?: ServicioProyecto[]
  createdAt: string
  updatedAt: string
}

export interface CreateProyectoRequest {
  clientId: number
  consecutive?: number
  abbreviation?: string
  code?: string
  projectType: string
  serviceType?: string
  norm: string
  status?: string
  responsible: string
  startDate: string
  endDate?: string
  description: string
  observations?: string
  offer?: string
  totalCost?: number
  services?: ServicioProyecto[]
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

// ====== LICITACIONES ======

export type TipoLicitacion = 'publica' | 'minima_cuantia' | 'solicitud_informacion' | 'contratacion_especial'

export type EstadoLicitacion = 'publicada' | 'en_curso' | 'cerrada' | 'adjudicada' | 'desierta' | 'cancelada'

export interface TenderServiceItem {
  name: string
  norm: string
  rol?: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
  subtotalWithDiscount: number
  iva: number
  totalPrice: number
  collaborator?: string
  collaboratorUnitPrice?: number
  collaboratorTotalPrice?: number
  ica: number
  simpleTax: number
  netProfit: number
  pretaxProfit: number
  finalProfit?: number
  entryDate?: string
  billingDate?: string
  purchaseOrderDate?: string
  purchaseOrderNumber?: string
  billingAccountNumber?: string
  bonds?: number
  stamps?: number
  otherFees?: number
  travelExpenses?: number
  withholdingTax?: number
  observations?: string
}

export interface Tender {
  id: number
  offerCode: string
  type: string
  processNumber: string
  clientName: string
  service: string
  norm: string
  status: string
  publicationDate: string
  closingDate?: string
  estimatedValue?: number
  observations?: string
  services?: TenderServiceItem[]
  createdAt: string
  updatedAt?: string
}

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
  servicios?: TenderServiceItem[]
  createdAt: string
}

export interface CreateTenderRequest {
  offerCode: string
  type: string
  processNumber: string
  clientName: string
  service: string
  norm: string
  status?: string
  publicationDate: string
  closingDate?: string
  estimatedValue?: number
  observations?: string
  services?: TenderServiceItem[]
}

export type UpdateTenderRequest = Partial<CreateTenderRequest>

// ====== COTIZACIONES ======

export type EstadoCotizacion = 'pendiente' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'

export interface CotizacionServicio {
  name: string
  quantity: number
  billingType: 'ONETIME' | 'MONTHLY'
  description?: string
  value: number
}

export interface Cotizacion {
  id: number
  code: string
  clientId: number
  client?: { id: number; name: string; email?: string; phone?: string; nit?: string }
  clientName?: string
  projectId?: number
  project?: { id: number; code: string; description?: string }
  status: EstadoCotizacion
  totalAmount: number
  validUntil?: string
  observations?: string
  services?: CotizacionServicio[]
  isVisible?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCotizacionRequest {
  code: string
  clientId: number
  clientName?: string
  projectId?: number
  status?: EstadoCotizacion
  totalAmount: number
  validUntil?: string
  observations?: string
  services?: CotizacionServicio[]
  isVisible?: boolean
}

export interface UpdateCotizacionRequest extends Partial<CreateCotizacionRequest> {}

// ====== EVENTOS ======

export type EventEntityType = 'client' | 'project' | 'quote' | 'tender' | null
export type EventType = string

export interface Evento {
  id: number
  entityType: EventEntityType
  entityId: number | null
  type: EventType
  typeOtro?: string
  title?: string
  client?: string
  modalidad?: string
  modalidadOtro?: string
  location?: string
  personaContacto?: string
  description: string
  user: string
  userOtro?: string
  date: string
  endDate?: string
  leadAuditor?: string
  coAuditors?: string
  normas?: string
  createdAt?: string
}

export interface CreateEventoRequest {
  entityType: EventEntityType
  entityId: number | null
  type: EventType
  typeOtro?: string
  title?: string
  client?: string
  modalidad?: string
  modalidadOtro?: string
  location?: string
  personaContacto?: string
  description: string
  user: string
  userOtro?: string
  date: string
  endDate?: string
  leadAuditor?: string
  coAuditors?: string
  normas?: string
}

// ====== DOCUMENTOS ======

export type DocumentEntityType = 'client' | 'project' | 'quote' | 'tender' | 'collaborator'
export type DocumentType = 'contrato' | 'cotizacion' | 'informe' | 'certificado' | 'acta' | 'presentacion' | 'hoja_de_vida' | 'soportes_estudio'

export interface DocumentoEntity {
  id: number
  entityType: DocumentEntityType
  entityId: number
  name: string
  type: DocumentType
  url: string
  size: number
  user: string
  isVisible?: boolean
  createdAt: string
}

export interface CreateDocumentoRequest {
  entityType: DocumentEntityType
  entityId: number
  type: DocumentType
  file: File
}

// ====== ÓRDENES ======

export type EstadoOrden = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface OrdenItem {
  productId: number
  quantity: number
  selectedColor?: string
  price: number
}

export interface Orden {
  id: number
  userId: number
  items: OrdenItem[]
  totalAmount: number
  status: EstadoOrden
  shippingAddress: string
  paymentId?: number
  createdAt: string
  updatedAt: string
}

// ====== PAGOS ======

export type EstadoPago = 'pending' | 'approved' | 'declined' | 'error'

export interface Pago {
  id: number
  transactionId: string
  reference: string
  amount: number
  status: EstadoPago
  buyerEmail: string
  buyerName: string
  paymentMethod?: string
  orderId?: number
  createdAt: string
  updatedAt: string
}

export interface CreatePagoRequest {
  buyerEmail: string
  buyerName: string
  buyerIdentificationNumber: string
  buyerContactNumber?: string
  shippingAddress: string
  items: { productId: number; quantity: number; selectedColor?: string }[]
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

export interface CreateColaboradorRequest {
  name: string
  studies: string
  mainArea: string
  city: string
  phone: string
  email: string
  status: 'available' | 'assigned' | 'unavailable' | 'pending_docs' | 'inactive'
  competencies: { area: string; norm: string; description: string }[]
}

export interface UpdateColaboradorRequest extends Partial<CreateColaboradorRequest> {}
