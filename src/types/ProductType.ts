// Tipo de producto interno del frontend
export type Product = {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  status: 'available' | 'out-of-stock' | 'coming-soon'
  colors?: string[]
  isShowcase?: boolean
  showcaseImage?: string
  sku?: string
  brand?: string
  isAvailable?: boolean
  showPrice?: boolean
  allowQuote?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isOffer?: boolean
  createdAt: Date
  updatedAt?: Date
}

// Request para crear producto (lo que enviamos al backend)
export interface CreateProductRequest {
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  categoryId: number
  status?: 'available' | 'out-of-stock' | 'coming-soon'
  colors?: string[]
  isShowcase?: boolean
  showcaseImage?: string
  sku?: string
  brand?: string
  isAvailable?: boolean
  showPrice?: boolean
  allowQuote?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isOffer?: boolean
}

// Request para actualizar producto (todos los campos opcionales)
export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  originalPrice?: number
  images?: string[]
  categoryId?: number
  status?: 'available' | 'out-of-stock' | 'coming-soon'
  colors?: string[]
  isShowcase?: boolean
  showcaseImage?: string
  sku?: string
  brand?: string
  isAvailable?: boolean
  showPrice?: boolean
  allowQuote?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isOffer?: boolean
}

// Response del backend al crear/obtener un producto
export interface CreateProductResponse {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string
  categoryId: number
  status: string
  colors?: string
  isShowcase: boolean
  showcaseImage?: string
  sku?: string
  brand?: string
  isAvailable?: boolean
  showPrice?: boolean
  allowQuote?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isOffer?: boolean
  createdAt: string
  updatedAt: string
}

// Tipo para la respuesta de getProducts que puede venir en dos formatos:
// 1. Array directo: Product[]
// 2. Objeto con metadata: { count: number, products: Product[] }
export type GetProductsResponse =
  | Array<CreateProductResponse>
  | { count: number; products: Array<CreateProductResponse> }
