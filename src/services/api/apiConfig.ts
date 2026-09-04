// Configuración base para la API
export const API_CONFIG = {
  baseURL: import.meta.env.DEV
    ? 'http://localhost:7071/api/v1'
    : 'https://esg-back-cve6gyd9fgfnh5f3.centralus-01.azurewebsites.net/api/v1',
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

    const token = localStorage.getItem('authToken') || localStorage.getItem('clientAuthToken')
    const isClientToken = !localStorage.getItem('authToken') && !!localStorage.getItem('clientAuthToken')

    let headers = { ...this.defaultHeaders }

    if (options.body instanceof FormData) {
      headers = {}
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

      if (
        (response.status === 401 || response.status === 403 || response.status === 500) &&
        (data.message?.toLowerCase().includes('token has expired') ||
          data.message?.toLowerCase().includes('token expired') ||
          data.message?.toLowerCase().includes('jwt expired') ||
          data.message?.toLowerCase().includes('unauthorized'))
      ) {
        if (isClientToken) {
          localStorage.removeItem('clientAuthToken')
          localStorage.removeItem('clientUserInfo')
          setTimeout(() => {
            window.location.href = '/login-clientes'
          }, 300)
        } else {
          localStorage.removeItem('authToken')
          localStorage.removeItem('userInfo')
          localStorage.removeItem('user')
          setTimeout(() => {
            window.location.href = '/login'
          }, 300)
        }

        throw new Error('Sesión expirada')
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`)
      }

      return data
    } catch (error) {
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

    if (body instanceof FormData) {
      requestOptions.body = body
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

    if (body instanceof FormData) {
      requestOptions.body = body
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

  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const requestOptions: RequestInit = {
      ...options,
      method: 'PATCH',
    }

    if (body instanceof FormData) {
      requestOptions.body = body
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
