<template>
  <div v-if="open" class="qv-overlay" role="dialog" aria-modal="true" aria-label="Detalle del producto" @click="emit('close')">
    <div class="qv-modal" @click.stop>
      <button class="qv-close" type="button" aria-label="Cerrar" @click="emit('close')">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"
          />
        </svg>
      </button>

      <div v-if="product" class="qv-body">
        <div class="qv-media">
          <div class="qv-hero">
            <img :src="activeImage" :alt="product.name" loading="lazy" decoding="async" />
          </div>

          <div v-if="product.images?.length" class="qv-thumbs" aria-label="Galería">
            <button
              v-for="(img, idx) in product.images"
              :key="img + idx"
              type="button"
              class="qv-thumb"
              :class="{ active: idx === activeImageIndex }"
              @click="activeImageIndex = idx"
              :aria-label="`Ver imagen ${idx + 1}`"
            >
              <img :src="img" :alt="`${product.name} - ${idx + 1}`" loading="lazy" decoding="async" />
            </button>
          </div>
        </div>

        <div class="qv-info">
          <div class="qv-title">{{ product.name }}</div>
          <div class="qv-meta">{{ categoryLabel }}</div>

          <div v-if="product.brand" class="qv-brand">Marca: {{ product.brand }}</div>
          <div v-if="product.sku" class="qv-sku">SKU: {{ product.sku }}</div>

          <div class="qv-price">
            <span class="qv-price-current">${{ formatPrice(product.price) }} COP</span>
            <span v-if="product.originalPrice" class="qv-price-original">${{ formatPrice(product.originalPrice) }} COP</span>
          </div>

          <div v-if="product.description" class="qv-description">{{ product.description }}</div>

          <div v-if="product.colors?.length" class="qv-colors">
            <div class="qv-colors-title">Características</div>
            <div class="qv-colors-list">
              <button
                v-for="c in product.colors"
                :key="c"
                type="button"
                class="qv-color active"
                disabled
              >
                {{ c }}
              </button>
            </div>
          </div>

          <div class="qv-observations">
            <label class="obs-label">Observaciones (opcional)</label>
            <input
              v-model="observations"
              type="text"
              class="obs-input"
              placeholder="Ej: Necesito talla XL, Curva C, Entrega urgente"
            />
          </div>

          <div class="qv-actions">
            <button
              type="button"
              class="qv-add"
              :disabled="isAddDisabled"
              @click="addToQuotationFromModal"
            >
              {{ product.status === 'available' ? 'Agregar a cotización' : 'No disponible' }}
            </button>
          </div>

          <div class="qv-status" v-if="product.status !== 'available'">
            {{ statusText(product.status) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useQuotation, type QuotationProduct } from '@/composables/useQuotation'
import { useProducts } from '@/composables/useProducts'
import type { Product } from '@/types/ProductType'

const props = defineProps<{
  open: boolean
  product: Product | null
}>()

const emit = defineEmits<{ close: [] }>()

const { addToQuotation, openDrawer } = useQuotation()
const { categories, loadCategories, getCategoryById } = useProducts()

const activeImageIndex = ref(0)
const selectedColor = ref<string | null>(null)
const observations = ref('')

const categoryLabel = computed(() => {
  if (!props.product) return ''
  const id = String(props.product.category || '')
  const name = getCategoryById(id)?.name
  return (name || 'Sin categoría').toUpperCase()
})

const activeImage = computed(() => {
  const p = props.product
  if (!p) return ''
  const imgs = p.images || []
  return imgs[activeImageIndex.value] || imgs[0] || '/images/banner1.jpg'
})

const isAddDisabled = computed(() => {
  const p = props.product
  if (!p) return true
  if (p.status !== 'available') return true
  return false
})

const formatPrice = (value: number): string => {
  try {
    return Number(value || 0).toLocaleString()
  } catch {
    return String(value || 0)
  }
}

const statusText = (status: Product['status']): string => {
  switch (status) {
    case 'out-of-stock':
      return 'Agotado'
    case 'coming-soon':
      return 'Próximamente'
    default:
      return ''
  }
}

const ensureCategoriesLoaded = async () => {
  if (!categories.value.length) {
    await loadCategories()
  }
}

const addToQuotationFromModal = () => {
  if (!props.product) return

  const mapped: QuotationProduct = {
    id: props.product.id,
    name: props.product.name,
    sku: props.product.sku || 'N/A',
    brand: props.product.brand || 'N/A',
    price: props.product.price,
    image: props.product.images?.[0] || '',
    category: getCategoryById(String(props.product.category || ''))?.name || '',
    description: props.product.description,
    inStock: props.product.status === 'available',
    originalPrice: props.product.originalPrice
  }

  addToQuotation(mapped, 1, observations.value || undefined)
  observations.value = ''
  emit('close')
  openDrawer()
}

const onKeyDown = (e: KeyboardEvent) => {
  if (!props.open) return
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  }
}

watch(
  () => props.open,
  async (value) => {
    if (value) {
      window.addEventListener('keydown', onKeyDown)
      await ensureCategoriesLoaded()
    } else {
      window.removeEventListener('keydown', onKeyDown)
    }
  },
  { immediate: true }
)

watch(
  () => props.product?.id,
  () => {
    activeImageIndex.value = 0
    selectedColor.value = null
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.qv-overlay {
  position: fixed;
  inset: 0;
  z-index: 2200;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.qv-modal {
  width: min(1100px, calc(100% - 24px));
  max-height: 86vh;
  overflow: auto;
  background: var(--app-bg-primary);
  border: 1px solid var(--app-border-color);
  border-radius: 14px;
  position: relative;
  box-shadow: var(--shadow-heavy);
}

.qv-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--app-border-color);
  background: rgba(255, 255, 255, 0.92);
  color: var(--app-text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.qv-body {
  padding: 18px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
}

.qv-hero {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 12px;
  background: var(--app-bg-secondary);
  border: 1px solid var(--app-border-color);
}

.qv-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.qv-thumbs {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.qv-thumb {
  border: 1px solid var(--app-border-color);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 10px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
}

.qv-thumb.active {
  border-color: rgba(201, 168, 89, 0.85);
}

.qv-thumb img {
  width: 100%;
  height: 58px;
  object-fit: cover;
  display: block;
}

.qv-title {
  font-size: 1.25rem;
  color: var(--app-text-primary);
  line-height: 1.2;
}

.qv-meta {
  margin-top: 6px;
  font-size: 0.85rem;
  color: var(--app-text-muted);
  letter-spacing: 0.06em;
}

.qv-price {
  margin-top: 12px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.qv-price-current {
  font-size: 1.2rem;
  color: var(--app-text-primary);
}

.qv-price-original {
  font-size: 0.95rem;
  color: var(--app-text-muted);
  text-decoration: line-through;
}

.qv-description {
  margin-top: 12px;
  color: var(--app-text-secondary);
  line-height: 1.55;
}

.qv-colors {
  margin-top: 14px;
}

.qv-colors-title {
  color: var(--app-text-secondary);
  font-size: 0.92rem;
}

.qv-colors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.qv-color {
  border: 1px solid var(--app-border-color);
  background: rgba(255, 255, 255, 0.92);
  color: var(--app-text-primary);
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.qv-color.active {
  border-color: rgba(201, 168, 89, 0.85);
  box-shadow: 0 0 0 3px rgba(201, 168, 89, 0.14);
}

.qv-actions {
  margin-top: 16px;
}

.qv-add {
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: 0;
  background: linear-gradient(135deg, rgb(201, 168, 89) 0%, rgb(180, 145, 65) 100%);
  color: var(--black);
  cursor: pointer;
  box-shadow: var(--shadow-light);
}

.qv-add:hover {
  background: linear-gradient(135deg, rgb(180, 145, 65) 0%, rgb(201, 168, 89) 100%);
  box-shadow: var(--shadow-medium);
}

.qv-add:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.qv-status {
  margin-top: 10px;
  color: var(--app-text-muted);
  font-size: 0.9rem;
}

@media (max-width: 980px) {
  .qv-body {
    grid-template-columns: 1fr;
  }

  .qv-thumbs {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
