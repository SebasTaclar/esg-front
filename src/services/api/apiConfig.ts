// Configuración base para la API
export const API_CONFIG = {
  baseURL: import.meta.env.DEV
    ? 'http://localhost:7071/api/v1'
    : 'https://disef-back-ayd6bccmbhc4etak.centralus-01.azurewebsites.net/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Tipos de respuesta de la API
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  timestamp: string
  statusCode: number
}

// Tipos de error de la API
export interface ApiError {
  success: false
  message: string
  timestamp: string
  statusCode: number
  error?: string
}

// Cliente HTTP base
export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(
    baseURL: string = API_CONFIG.baseURL,
    headers: Record<string, string> = API_CONFIG.headers,
  ) {
    this.baseURL = baseURL
    this.defaultHeaders = headers
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    // Obtener token del localStorage si existe
    const token = localStorage.getItem('authToken')
    if (import.meta.env.DEV) {
      console.log(
        '🔑 [apiClient] Token presente:',
        token ? '✅ Sí' : '❌ No',
        token ? `(${token.substring(0, 20)}...)` : '',
      )
    }

    // Preparar headers
    let headers = { ...this.defaultHeaders }

    // Si el body es FormData, no incluir Content-Type por defecto
    if (options.body instanceof FormData) {
      headers = {} // No incluir Content-Type para FormData
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      // Verificar si el token ha expirado (status 401 o mensaje específico)
      if (
        (response.status === 401 || response.status === 403) &&
        (data.message?.toLowerCase().includes('token has expired') ||
          data.message?.toLowerCase().includes('token expired') ||
          data.message?.toLowerCase().includes('jwt expired') ||
          data.message?.toLowerCase().includes('unauthorized'))
      ) {
        console.error('🔑 [apiConfig] Token expirado o inválido, cerrando sesión...')
        // Limpiar token y datos de usuario
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')

        // Mostrar alerta al usuario
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')

        // Redirigir al login después de un pequeño delay
        setTimeout(() => {
          window.location.href = '/login'
        }, 500)

        throw new Error('Sesión expirada')
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const requestOptions: RequestInit = {
      ...options,
      method: 'POST',
    }

    // Si el body es FormData, no lo serialices ni pongas Content-Type
    if (body instanceof FormData) {
      requestOptions.body = body
      // Remover Content-Type de los headers para FormData
      if (requestOptions.headers) {
        const headers = { ...requestOptions.headers }
        delete (headers as Record<string, string>)['Content-Type']
        requestOptions.headers = headers
      }
    } else if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    return this.request<T>(endpoint, requestOptions)
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const requestOptions: RequestInit = {
      ...options,
      method: 'PUT',
    }

    // Si el body es FormData, no lo serialices ni pongas Content-Type
    if (body instanceof FormData) {
      requestOptions.body = body
      // Remover Content-Type de los headers para FormData
      if (requestOptions.headers) {
        const headers = { ...requestOptions.headers }
        delete (headers as Record<string, string>)['Content-Type']
        requestOptions.headers = headers
      }
    } else if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    return this.request<T>(endpoint, requestOptions)
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  getBaseUrl(): string {
    return this.baseURL
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient()
