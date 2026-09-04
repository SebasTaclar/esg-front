import { apiClient } from './apiConfig'

export interface User {
  id: number
  clientId?: number
  clientName?: string
  email?: string
  name?: string
  role: string
  isActive?: boolean
  membershipPaid?: boolean
  teamId?: number | null
  createdAt?: string
}

export interface CreateUserRequest {
  clientId?: number
  password: string
  email?: string
  name?: string
  role?: string
}

export interface UpdateUserRequest {
  clientId?: number
  email?: string
  name?: string
  role?: string
}

export interface UserListResponse {
  data: User[]
  total: number
}

class UserService {
  private readonly endpoint = '/users'

  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[] | { users: User[]; data: User[]; count: number }>(this.endpoint)
    const raw = response.data as unknown as Record<string, unknown> | User[]
    if (Array.isArray(raw)) return raw
    const obj = raw as Record<string, unknown>
    if (obj['users']) return (obj['users'] as User[]) || []
    if (obj['data']) {
      const d = obj['data']
      return Array.isArray(d) ? d : ((d as Record<string, unknown>)['users'] as User[]) || []
    }
    return []
  }

  async create(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<{ user: User } | User>('/user/create', data)
    const raw = response.data as unknown as Record<string, unknown> | User
    if (raw && typeof raw === 'object' && 'user' in raw) return (raw as { user: User }).user
    return raw as User
  }

  async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<{ user: User } | User>(`${this.endpoint}/${id}`, data)
    const raw = response.data as unknown as Record<string, unknown> | User
    if (raw && typeof raw === 'object' && 'user' in raw) return (raw as { user: User }).user
    return raw as User
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
    await apiClient.patch('/user/change-password', { userId, newPassword })
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }
}

export const userService = new UserService()
