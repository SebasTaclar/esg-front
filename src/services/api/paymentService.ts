import { apiClient } from './apiConfig'
import type {
  Pago,
  CreatePagoRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types/crmTypes'

class PaymentService {
  async createPayment(data: CreatePagoRequest): Promise<Pago> {
    const response = await apiClient.post<Pago>('/payment/create', data)
    return response.data as unknown as Pago
  }

  async getPaymentById(id: number): Promise<Pago> {
    const response = await apiClient.get<Pago>(`/payment/${id}`)
    return response.data as unknown as Pago
  }

  async getAllPayments(params?: PaginationParams): Promise<PaginatedResponse<Pago>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Pago[]>(`/payments${query}`)
    return this.normalizeResponse(response.data)
  }

  private buildQuery(params?: PaginationParams): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.pageSize) parts.push(`limit=${params.pageSize}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeResponse(data: unknown): PaginatedResponse<Pago> {
    if (Array.isArray(data)) {
      return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      return {
        data: (obj['data'] || obj['payments'] || []) as Pago[],
        total: (obj['total'] as number) || 0,
        page: (obj['page'] as number) || 1,
        pageSize: (obj['limit'] as number) || 0,
        totalPages: (obj['totalPages'] as number) || 1,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const paymentService = new PaymentService()
