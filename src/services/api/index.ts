// Exportar configuración de API
export * from './apiConfig'

// Exportar servicios activos
export * from './authService'
export * from './categoryService'
export * from './productService'

// Exportar tipos comunes
export type { ApiResponse, ApiError } from './apiConfig'
export type { LoginCredentials, LoginResponse, DecodedToken, UserInfo } from './authService'
export type {
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
} from '@/types/CategoryType'
