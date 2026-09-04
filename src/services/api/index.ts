// Exportar configuración de API
export * from './apiConfig'

// Exportar servicios activos
export * from './authService'
export { clientAuthService } from './clientAuthService'
export * from './categoryService'
export * from './productService'

// Exportar servicios CRM
export { clientService } from './clientService'
export type { ClientListParams } from './clientService'
export { projectService } from './projectService'
export { catalogService } from './catalogService'

// Exportar servicios nuevos
export { quoteService } from './quoteService'
export { tenderService } from './tenderService'
export { eventService } from './eventService'
export { collaboratorService } from './collaboratorService'
export { documentService } from './documentService'
export { paymentService } from './paymentService'
export { orderService } from './orderService'
export { portalService } from './portalService'

// Exportar tipos comunes
export type { ApiResponse, ApiError } from './apiConfig'
export type { LoginCredentials, LoginResponse, DecodedToken, UserInfo } from './authService'
export type {
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
} from '@/types/CategoryType'

// Exportar tipos CRM
export type {
  Cliente,
  Client,
  ClientContact,
  ClientResource,
  CreateClienteRequest,
  UpdateClienteRequest,
  CreateClientRequest,
  UpdateClientRequest,
  Contacto,
  CreateContactoRequest,
  Proyecto,
  CreateProyectoRequest,
  UpdateProyectoRequest,
  Seguimiento,
  CreateSeguimientoRequest,
  TipoSeguimiento,
  Documento,
  EventoCronologia,
  EntidadTipo,
  TipoProyecto,
  Norma,
  EstadoProyecto,
  TipoServicio,
  CRMStats,
  FiltroEstado,
  CRMFilters,
  PaginatedResponse,
  PaginationParams,
  Cotizacion,
  CreateCotizacionRequest,
  UpdateCotizacionRequest,
  Licitacion,
  Tender,
  CreateTenderRequest,
  UpdateTenderRequest,
  TenderServiceItem,
  Evento,
  CreateEventoRequest,
  EventEntityType,
  EventType,
  DocumentoEntity,
  DocumentEntityType,
  DocumentType,
  Pago,
  CreatePagoRequest,
  Orden,
  Colaborador,
  CreateColaboradorRequest,
  UpdateColaboradorRequest,
  CompetenciaColaborador,
  DocumentoColaborador,
  EstadoColaborador,
} from '@/types/crmTypes'
