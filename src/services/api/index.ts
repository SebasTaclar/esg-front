// Exportar configuración de API
export * from './apiConfig'

// Exportar servicios activos
export * from './authService'
export * from './categoryService'
export * from './productService'

// Exportar servicios CRM
export { clientService } from './clientService'
export { projectService } from './projectService'
export { catalogService } from './catalogService'

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
  CreateClienteRequest,
  UpdateClienteRequest,
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
} from '@/types/crmTypes'
