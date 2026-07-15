export type Brand = {
  id: string
  name: string
  description?: string
  imageUrls?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateBrandRequest {
  name: string
  description?: string
  imageUrls?: string[]
}

export interface UpdateBrandRequest {
  name?: string
  description?: string
  imageUrls?: string[] | null
}

export interface CreateBrandResponse {
  id: number
  name: string
  description?: string
  imageUrls?: string
  createdAt: string
  updatedAt: string
}

export type GetBrandsResponse =
  | Array<CreateBrandResponse>
  | { count: number; brands: Array<CreateBrandResponse> }
