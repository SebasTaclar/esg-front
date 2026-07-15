<template>
  <div class="category-page">
    <div class="layout">
      <aside class="sidebar">
        <h3 class="sidebar-title">Rango de Precio</h3>

        <div class="radio-list" role="radiogroup" aria-label="Rango de precio">
          <label class="radio-item">
            <input type="radio" name="price" value="all" v-model="selectedPriceRange" />
            <span>Todos</span>
          </label>
          <label class="radio-item">
            <input type="radio" name="price" value="lt100" v-model="selectedPriceRange" />
            <span>Menos de $100.000 COP</span>
          </label>
          <label class="radio-item">
            <input type="radio" name="price" value="100-300" v-model="selectedPriceRange" />
            <span>$100.000 - $300.000 COP</span>
          </label>
          <label class="radio-item">
            <input type="radio" name="price" value="300-500" v-model="selectedPriceRange" />
            <span>$300.000 - $500.000 COP</span>
          </label>
          <label class="radio-item">
            <input type="radio" name="price" value="gt500" v-model="selectedPriceRange" />
            <span>Más de $500.000 COP</span>
          </label>
        </div>

        <button class="clear-btn" type="button" @click="clearFilters">Limpiar Filtros</button>
      </aside>

      <main class="content">
        <header class="category-hero">
          <div class="category-hero-text">
            <h1 class="category-title">Ofertas Especiales</h1>
            <p class="category-description">Descubre nuestras mejores ofertas en soluciones industriales. Productos exclusivos con descuentos por tiempo limitado.</p>
          </div>

          <div class="category-hero-image">
            <img
              src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=900&h=600&fit=crop&q=80"
              alt="Ofertas Especiales"
              loading="lazy"
              decoding="async"
            />
          </div>
        </header>

        <div class="topbar">
          <div class="search">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"
              />
            </svg>
            <input v-model="searchTerm" class="search-input" type="search" placeholder="Buscar productos..." />
          </div>

          <div class="sort">
            <label class="sort-label" for="sort">Ordenar por:</label>
            <select id="sort" v-model="sortBy" class="sort-select">
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <div class="meta">
          <span v-if="isLoadingProducts" class="meta-text">Cargando productos...</span>
          <span v-else class="meta-text">Mostrando {{ filteredOfferProducts.length }} productos</span>
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <div v-else-if="!isLoadingProducts && filteredOfferProducts.length > 0" class="grid">
          <article
            v-for="product in filteredOfferProducts"
            :key="product.id"
            class="card"
            role="button"
            tabindex="0"
            @click="openQuickView(product)"
            @keydown.enter.prevent="openQuickView(product)"
            @keydown.space.prevent="openQuickView(product)"
          >
            <div class="image-wrap">
              <img :src="product.images[0]" :alt="product.name" loading="lazy" decoding="async" />
              <!-- Badge de descuento -->
              <div v-if="hasRealDiscount(product)" class="discount-badge-image">
                -{{ Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) }}%
              </div>
              <!-- Overlay de no disponible -->
              <div v-if="product.status !== 'available'" class="out-of-stock-overlay">
                <span>{{ getStatusText(product.status) }}</span>
              </div>
              <!-- Badge de estado en esquina inferior izquierda -->
              <span :class="['product-status-badge', getStatusClass(product.status)]">
                {{ getStatusText(product.status) }}
              </span>
            </div>

            <div class="card-body">
              <div class="category-label">
                {{ isGlobalSearch ? (hasRealDiscount(product) ? 'OFERTA' : categoryNameById(product.category)) : 'OFERTA' }}
              </div>
              <h3 class="name">{{ product.name }}</h3>
              <div class="price">${{ product.price.toLocaleString() }} COP</div>
              <div v-if="hasRealDiscount(product)" class="original-price">${{ product.originalPrice!.toLocaleString() }} COP</div>

              <button
                v-if="product.status === 'available'"
                class="add"
                type="button"
                @click.stop="addProductToCart(product)"
              >
                <span class="cart">🛒</span>
                Agregar
              </button>
            </div>
          </article>
        </div>
        <div v-else-if="!isLoadingProducts && filteredOfferProducts.length === 0" class="empty">
          <p>No hay productos para mostrar.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCategories } from '@/composables/useCategories'
import { useQuotation } from '@/composables/useQuotation'
import { useProductQuickView } from '@/composables/useProductQuickView'
import type { Product } from '@/types/ProductType'

import { useHead } from '@unhead/vue'

useHead({
  title: 'Ofertas | DISEF Comercializadora Industrial',
  meta: [
    {
      name: 'description',
      content: 'Descubre nuestras ofertas y productos con descuento en DISEF Comercializadora Industrial. Aprovecha precios especiales por tiempo limitado.'
    },
    { property: 'og:title', content: 'Ofertas | DISEF Comercializadora Industrial' },
    { property: 'og:description', content: 'Productos con descuento en DISEF Comercializadora Industrial. Aprovecha precios especiales por tiempo limitado.' },
    { property: 'og:image', content: '/images/logo.jpeg' },
    { property: 'og:url', content: 'https://www.disef.com.co/ofertas' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: '/images/logo.jpeg' }
  ]
})

const { regularProducts, loadProducts, showcaseProducts, loadShowcaseProducts } = useProducts()
const { categories, loadCategories } = useCategories()
const { addToQuotation, openDrawer } = useQuotation()
const quickView = useProductQuickView()

function openQuickView(product: Product) {
  quickView.open(product)
}

const isLoadingProducts = ref(true)
const error = ref<string | null>(null)

const route = useRoute()

// Filtros y búsqueda
const searchTerm = ref('')
const sortBy = ref<'featured' | 'price-asc' | 'price-desc'>('featured')
const selectedPriceRange = ref<'all' | 'lt100' | '100-300' | '300-500' | 'gt500'>('all')

watch(
  () => route.query.q,
  q => {
    searchTerm.value = typeof q === 'string' ? q : ''
  },
  { immediate: true }
)

const isGlobalSearch = computed(() => route.query.scope === 'all' && searchTerm.value.trim().length > 0)

const allProducts = computed(() => {
  const list = [...regularProducts.value, ...showcaseProducts.value]
  const seen = new Set<string>()
  return list.filter(p => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  }) as Product[]
})

// Productos en oferta: solo los que tienen descuento real (originalPrice > price)
const offerProducts = computed(() => {
  if (allProducts.value.length === 0) return []
  return allProducts.value.filter((p: Product) =>
    p.images &&
    p.images.length > 0 &&
    p.status &&
    typeof p.originalPrice === 'number' &&
    p.originalPrice > 0 &&
    p.price > 0 &&
    p.originalPrice > p.price
  )
})

const productsForPage = computed(() => (isGlobalSearch.value ? allProducts.value : offerProducts.value))

// Productos filtrados por búsqueda, precio y ordenamiento
const filteredOfferProducts = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  let list = productsForPage.value

  // Filtro de búsqueda
  if (q) {
    list = list.filter(p => {
      const name = p.name.toLowerCase()
      const desc = (p.description || '').toLowerCase()
      return name.includes(q) || desc.includes(q)
    })
  }

  // Filtro de precio
  list = list.filter(p => {
    const price = p.price
    switch (selectedPriceRange.value) {
      case 'lt100':
        return price < 100000
      case '100-300':
        return price >= 100000 && price <= 300000
      case '300-500':
        return price > 300000 && price <= 500000
      case 'gt500':
        return price > 500000
      default:
        return true
    }
  })

  // Ordenamiento
  if (sortBy.value === 'price-asc') {
    return [...list].sort((a, b) => a.price - b.price)
  }
  if (sortBy.value === 'price-desc') {
    return [...list].sort((a, b) => b.price - a.price)
  }

  return list
})

function categoryNameById(categoryId: string): string {
  return categories.value.find(cat => cat.id === categoryId)?.name?.toUpperCase() || ''
}

function hasRealDiscount(p: Product): boolean {
  return typeof p.originalPrice === 'number' && p.originalPrice > 0 && p.originalPrice > p.price
}

function getStatusText(status: string): string {
  switch (status) {
    case 'available':
      return 'Disponible'
    case 'coming-soon':
      return 'Próximamente'
    case 'out-of-stock':
      return 'Agotado'
    default:
      return 'No disponible'
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'available':
      return 'status-available'
    case 'coming-soon':
      return 'status-coming-soon'
    case 'out-of-stock':
      return 'status-out-of-stock'
    default:
      return 'status-unavailable'
  }
}

function clearFilters() {
  searchTerm.value = ''
  selectedPriceRange.value = 'all'
  sortBy.value = 'featured'
}

function addProductToCart(p: Product) {
  const categoryName = categories.value.find(cat => cat.id === p.category)?.name || 'Ofertas'

  // Construir características del producto
  const characteristics: string[] = []
  if (p.colors && p.colors.length > 0) {
    // Agregar todos los colores disponibles
    characteristics.push(...p.colors)
  }

  addToQuotation({
    id: p.id,
    name: p.name,
    sku: p.sku || 'N/A',
    brand: p.brand || 'N/A',
    price: p.price,
    image: p.images?.[0] || '',
    category: categoryName,
    description: p.description,
    inStock: p.status === 'available',
    originalPrice: p.originalPrice
  }, 1)
  openDrawer()
}

onMounted(async () => {
  try {
    isLoadingProducts.value = true
    error.value = null
    if (categories.value.length === 0) {
      await loadCategories()
    }
    await Promise.all([
      loadProducts(),
      loadShowcaseProducts()
    ])
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al cargar productos'
  } finally {
    isLoadingProducts.value = false
  }
})
</script>

<style scoped>
.category-page {
  width: 100%;
  padding-top: 70px;
  background: #f5f7fb;
  min-height: 100vh;
}

.layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.sidebar {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.sidebar-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 800;
  color: rgba(15, 23, 42, 0.9);
}

.radio-list {
  display: grid;
  gap: 0.5rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.75);
}

.clear-btn {
  margin-top: 1.25rem;
  width: 100%;
  height: 42px;
  border-radius: 999px;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.25);
  color: rgba(15, 23, 42, 0.85);
  font-weight: 700;
  cursor: pointer;
}

.content {
  min-width: 0;
}

.category-hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1rem;
  align-items: center;
  background: white;
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.08);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .category-hero {
    grid-template-columns: 1fr;
  }
}

.category-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.92);
}

.category-description {
  margin: 0.5rem 0 0;
  color: rgba(15, 23, 42, 0.7);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 4;
}

.category-hero-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.04);
}

.category-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 640px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }
}

.search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  padding: 0.6rem 0.9rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  color-scheme: light;
}

.search-icon {
  color: rgba(15, 23, 42, 0.55);
}

.search-input {
  border: 0;
  outline: 0;
  width: 100%;
  font-size: 0.95rem;
  background: transparent;
  color: rgba(15, 23, 42, 0.9);
  -webkit-text-fill-color: rgba(15, 23, 42, 0.9);
  caret-color: rgba(15, 23, 42, 0.9);
}

.search-input::placeholder {
  color: rgba(15, 23, 42, 0.45);
  -webkit-text-fill-color: rgba(15, 23, 42, 0.45);
}

.sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.7);
}

.sort-select {
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 0 0.9rem;
  background: white;
  color: rgba(15, 23, 42, 0.9);
  color-scheme: light;
}

.sort-select option {
  color: rgba(15, 23, 42, 0.92);
  background: white;
}

.meta {
  margin-bottom: 1rem;
}

.meta-text {
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.65);
}

.error {
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.2);
  color: rgba(220, 38, 38, 0.9);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.08);
}

.image-wrap {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: rgba(15, 23, 42, 0.04);
  position: relative;
}

.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Badge de descuento en la imagen */
.discount-badge-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.4rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  z-index: 2;
}

/* Overlay de no disponible */
.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  z-index: 3;
}

/* Badge de estado en esquina inferior izquierda */
.product-status-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.4rem;
  z-index: 2;
  text-transform: uppercase;
}

.product-status-badge.status-available {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.product-status-badge.status-coming-soon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.product-status-badge.status-out-of-stock {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.product-status-badge.status-unavailable {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
}

.card-body {
  padding: 1rem;
}

.category-label {
  font-size: 0.68rem;
  letter-spacing: 0.6px;
  font-weight: 800;
  color: rgba(15, 23, 42, 0.55);
  text-transform: uppercase;
}

.name {
  margin: 0.35rem 0 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: rgba(15, 23, 42, 0.9);
}

.price {
  margin-top: 0.6rem;
  font-weight: 900;
  color: rgba(215, 172, 67, 0.95);
}

.original-price {
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.5);
  text-decoration: line-through;
  margin-top: 0.35rem;
}

.add {
  margin-top: 0.9rem;
  height: 38px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.92);
  color: white;
  border: 0;
  padding: 0 1rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
}

.cart {
  font-size: 0.9rem;
}

.empty {
  text-align: center;
  padding: 2rem 0;
  color: rgba(15, 23, 42, 0.6);
}
</style>
