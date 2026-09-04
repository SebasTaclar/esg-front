import { apiClient, type ApiResponse } from './apiConfig'
import type { LoginCredentials, LoginResponse, DecodedToken, UserInfo } from './authService'

class ClientAuthService {
  private readonly TOKEN_KEY = 'clientAuthToken'
  private readonly USER_INFO_KEY = 'clientUserInfo'

  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/login', credentials)

    if (response.success && response.data.token) {
      this.setToken(response.data.token)
      const userInfo = this.decodeToken(response.data.token)
      if (userInfo) {
        this.setUserInfo(userInfo)
      }
    }

    return response
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_INFO_KEY)
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false
    const userInfo = this.getUserInfo()
    if (!userInfo) return false
    const currentTime = Date.now() / 1000
    return userInfo.exp > currentTime
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  getUserInfo(): DecodedToken | null {
    const userInfoStr = localStorage.getItem(this.USER_INFO_KEY)
    if (!userInfoStr) return null
    try {
      return JSON.parse(userInfoStr)
    } catch {
      return null
    }
  }

  private setUserInfo(userInfo: DecodedToken): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo))
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1]
      const decodedPayload = atob(payload)
      return JSON.parse(decodedPayload)
    } catch {
      return null
    }
  }

  getUserRole(): string | null {
    const userInfo = this.getUserInfo()
    return userInfo?.role || null
  }

  getCurrentUser(): UserInfo | null {
    const userInfo = this.getUserInfo()
    if (!userInfo) return null
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      role: userInfo.role,
      membershipPaid: userInfo.membershipPaid,
      teamId: userInfo.teamId || null,
      clientId: userInfo.clientId || null,
    }
  }
}

export const clientAuthService = new ClientAuthService()
