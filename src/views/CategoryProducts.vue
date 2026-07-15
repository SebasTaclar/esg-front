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
            <h1 class="category-title">{{ pageTitle }}</h1>
            <p v-if="pageDescription" class="category-description">{{ pageDescription }}</p>
          </div>

          <div class="category-hero-image">
            <img
              :src="categoryImageSrc"
              :alt="pageTitle"
              loading="lazy"
              decoding="async"
              @error="onCategoryImageError"
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
          <span v-if="loading" class="meta-text">Cargando productos...</span>
          <span v-else class="meta-text">Mostrando {{ filteredProducts.length }} productos</span>
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <div v-else class="grid">
          <article
            v-for="p in filteredProducts"
            :key="p.id"
            class="card"
            role="button"
            tabindex="0"
            @click="openQuickView(p)"
            @keydown.enter.prevent="openQuickView(p)"
            @keydown.space.prevent="openQuickView(p)"
          >
            <div class="image-wrap">
              <img :src="p.images[0]" :alt="p.name" loading="lazy" decoding="async" />
              <div v-if="p.originalPrice" class="discount-badge-image">
                -{{ Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) }}%
              </div>
              <span :class="['product-status-badge', getStatusClass(p.status)]">
                {{ getStatusText(p.status) }}
              </span>
            </div>

            <div class="card-body">
              <div class="category-label">{{ categoryName(p.category) }}</div>
              <h3 class="name">{{ p.name }}</h3>
              <div class="price-section">
                <div class="price">${{ p.price.toLocaleString() }} COP</div>
                <div v-if="p.originalPrice" class="original-price">
                  ${{ p.originalPrice.toLocaleString() }} COP
                </div>
              </div>

              <button 
                v-if="p.status === 'available'" 
                class="add" 
                type="button" 
                @click.stop="addProductToCart(p)"
              >
                <span class="cart">🛒</span>
                Agregar
              </button>
            </div>
          </article>
        </div>

        <div v-if="!loading && !error && filteredProducts.length === 0" class="empty">
          <p>No hay productos para mostrar.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useQuotation } from '@/composables/useQuotation'
import { useProductQuickView } from '@/composables/useProductQuickView'
import type { Product } from '@/types/ProductType'

const props = defineProps<{ slug: string; title?: string }>()

const route = useRoute()

const { availableProducts, categories, loadProducts, loadCategories } = useProducts()
const { addToQuotation, openDrawer } = useQuotation()
const quickView = useProductQuickView()

const loading = ref(false)
const error = ref<string | null>(null)

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

const categoryImageIndex = ref(0)

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const currentCategoryId = computed(() => {
  const slug = props.slug
  const direct = categories.value.find(c => slugify(c.name) === slug)
  if (direct) return direct.id

  const relaxed = categories.value.find(c => {
    const s = slugify(c.name)
    return s.includes(slug) || slug.includes(s)
  })

  return relaxed?.id
})

const currentCategory = computed(() => {
  const id = currentCategoryId.value
  if (id) {
    const byId = categories.value.find(c => c.id === id)
    if (byId) return byId
  }
  return categories.value.find(c => slugify(c.name) === props.slug)
})

const pageTitle = computed(() => props.title || currentCategory.value?.name || props.slug)
const pageDescription = computed(() => currentCategory.value?.description || '')

const categoryImageCandidates = computed(() => {
  const base = `/images/${props.slug}`
  return [
    `${base}.jpg`,
    `${base}.jpeg`,
    `${base}.png`,
    `${base}.webp`,
    'https://placehold.co/900x600?text=CATEGOR%C3%8DA'
  ]
})

const categoryImageSrc = computed(() => {
  return categoryImageCandidates.value[Math.min(categoryImageIndex.value, categoryImageCandidates.value.length - 1)]
})

function onCategoryImageError() {
  const next = categoryImageIndex.value + 1
  categoryImageIndex.value = Math.min(next, categoryImageCandidates.value.length - 1)
}

watch(
  () => props.slug,
  () => {
    categoryImageIndex.value = 0
    clearFilters()
    error.value = null
  }
)

function categoryName(categoryId: string): string {
  return categories.value.find(c => c.id === categoryId)?.name?.toUpperCase() || ''
}

const baseProductsForCategory = computed(() => {
  const id = currentCategoryId.value
  if (!id) return []
  return availableProducts.value.filter(p => p.category === id)
})

const filteredProducts = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()

  let list = baseProductsForCategory.value

  if (q) {
    list = list.filter(p => {
      const name = p.name.toLowerCase()
      const desc = (p.description || '').toLowerCase()
      return name.includes(q) || desc.includes(q)
    })
  }

  // Filtro de precio (sin filtros de categoría/material)
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

  if (sortBy.value === 'price-asc') {
    return [...list].sort((a, b) => a.price - b.price)
  }
  if (sortBy.value === 'price-desc') {
    return [...list].sort((a, b) => b.price - a.price)
  }

  return list
})

function addProductToCart(p: Product) {
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
    category: categoryName(p.category),
    description: p.description,
    inStock: p.status === 'available',
    originalPrice: p.originalPrice
  }, 1)
  openDrawer()
}

function openQuickView(p: Product) {
  quickView.open(p)
}

function getStatusText(status: string) {
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

function getStatusClass(status: string) {
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
  sortBy.value = 'featured'
  selectedPriceRange.value = 'all'
}

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    if (categories.value.length === 0) {
      await loadCategories()
    }
    await loadProducts()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al cargar productos'
  } finally {
    loading.value = false
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

.discount-badge-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
  z-index: 2;
}

.product-status-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.product-status-badge.status-available {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.product-status-badge.status-out-of-stock {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.product-status-badge.status-coming-soon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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

.price-section {
  margin-top: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.price {
  font-weight: 900;
  color: rgba(215, 172, 67, 0.95);
}

.original-price {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: rgba(15, 23, 42, 0.45);
  font-weight: 600;
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
