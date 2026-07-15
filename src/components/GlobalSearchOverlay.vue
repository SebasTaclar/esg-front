<template>
  <div v-if="open" class="search-overlay" @keydown.esc.prevent.stop="close">
    <div class="search-overlay-inner" role="dialog" aria-label="Buscador" aria-modal="true">
      <div class="search-top">
        <form class="search-overlay-form" role="search" @submit.prevent>
          <input
            ref="inputEl"
            v-model="query"
            class="search-overlay-input"
            type="search"
            placeholder="Buscar en nuestra tienda"
            aria-label="Buscar en nuestra tienda"
            autocomplete="off"
            spellcheck="false"
          />

          <button
            v-if="query.trim().length"
            class="search-overlay-clear"
            type="button"
            aria-label="Limpiar búsqueda"
            @click="query = ''"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"
              />
            </svg>
          </button>

          <button class="search-overlay-submit" type="button" aria-label="Buscar" @click="inputEl?.focus()">
            <svg class="search-overlay-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"
              />
            </svg>
          </button>
        </form>

        <button class="search-overlay-close" type="button" aria-label="Cerrar" @click="close">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"
            />
          </svg>
        </button>
      </div>

      <div v-if="suggestions.length" class="search-suggestions" aria-label="Sugerencias">
        <span class="search-suggestions-label">Sugerencias:</span>
        <button
          v-for="s in suggestions"
          :key="s"
          type="button"
          class="search-suggestion"
          @click="applySuggestion(s)"
        >
          {{ s }}
        </button>
      </div>

      <div class="search-results" aria-label="Resultados">
        <div v-if="isLoading" class="search-state">Cargando…</div>
        <div v-else-if="trimmedQuery.length && filteredProducts.length === 0" class="search-state">
          Sin resultados
        </div>

        <div v-else class="results-grid" :class="{ 'results-grid--empty': !trimmedQuery.length }">
          <button
            v-for="product in visibleProducts"
            :key="product.id"
            type="button"
            class="result-card"
            @click="openProduct(product)"
          >
            <div class="result-image">
              <img :src="firstImage(product)" :alt="product.name" loading="lazy" decoding="async" />
            </div>
            <div class="result-info">
              <div class="result-name">{{ product.name }}</div>
              <div class="result-category">{{ categoryNameById(product.category).toUpperCase() }}</div>
              <div class="result-price">${{ formatPrice(product.price) }} COP</div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <button class="search-overlay-backdrop" type="button" aria-label="Cerrar buscador" @click="close"></button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useProducts, type Product as ProductType } from '@/composables/useProducts'
import { useProductQuickView } from '@/composables/useProductQuickView'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const query = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

const { regularProducts, categories, getCategoryById, loadProducts, loadCategories } = useProducts()
const quickView = useProductQuickView()

const isLoading = ref(false)

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const trimmedQuery = computed(() => query.value.trim())

const categoryNameById = (categoryId: string): string => {
  return (getCategoryById(categoryId)?.name || 'Sin categoría')
}

const firstImage = (product: ProductType): string => {
  return product?.images?.[0] || '/images/banner1.jpg'
}

const formatPrice = (value: number): string => {
  try {
    return Number(value || 0).toLocaleString()
  } catch {
    return String(value || 0)
  }
}

const ensureLoaded = async () => {
  isLoading.value = true
  try {
    if (!categories.value.length) {
      await loadCategories()
    }
    if (!regularProducts.value.length) {
      await loadProducts()
    }
  } finally {
    isLoading.value = false
  }
}

const filteredProducts = computed(() => {
  const q = normalizeText(trimmedQuery.value)
  if (!q) return []

  const limit = 48
  const results: ProductType[] = []

  for (const p of regularProducts.value) {
    // En caso de que lleguen productos showcase por error
    if (p.isShowcase) continue

    const name = normalizeText(String(p.name || ''))
    const description = normalizeText(String(p.description || ''))
    const catName = normalizeText(categoryNameById(String(p.category || '')))

    if (name.includes(q) || description.includes(q) || catName.includes(q)) {
      results.push(p)
      if (results.length >= limit) break
    }
  }

  return results
})

const visibleProducts = computed(() => filteredProducts.value.slice(0, 12))

const suggestions = computed(() => {
  const base = trimmedQuery.value
  if (!base) return []

  const normalizedBase = normalizeText(base)
  const out: string[] = []

  // 1) El término tal cual (como en la captura)
  out.push(base.toUpperCase())

  // 2) Top categorías dentro de resultados
  const counts = new Map<string, number>()
  for (const p of filteredProducts.value.slice(0, 24)) {
    const key = categoryNameById(p.category).toUpperCase()
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  const topCategories = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .filter(name => name && name !== out[0])
    .slice(0, 2)

  out.push(...topCategories)

  // 3) Frase sugerida a partir de nombres (q + palabra siguiente)
  const baseToken = normalizedBase.split(' ')[0]
  const phrases = new Set<string>()
  for (const p of filteredProducts.value.slice(0, 24)) {
    const tokens = normalizeText(String(p.name || '')).split(' ')
    const idx = tokens.indexOf(baseToken)
    if (idx >= 0 && tokens[idx + 1]) {
      const phrase = `${tokens[idx]} ${tokens[idx + 1]}`.toUpperCase()
      if (phrase !== out[0]) phrases.add(phrase)
    }
  }

  for (const phrase of phrases) {
    if (out.length >= 4) break
    if (!out.includes(phrase)) out.push(phrase)
  }

  // Únicos
  return out.filter((v, i) => out.indexOf(v) === i)
})

const applySuggestion = (value: string) => {
  query.value = value
  nextTick(() => inputEl.value?.focus())
}

const close = () => {
  emit('update:open', false)
}

const openProduct = (product: ProductType) => {
  // Importante: en la búsqueda NO agregamos al carrito.
  // Abrimos el modal global de producto para que el cliente decida allí.
  quickView.open(product)
  close()
}

// Cerrar con Escape aunque el foco esté fuera del input
const onKeyDown = (e: KeyboardEvent) => {
  if (!props.open) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

watch(
  () => props.open,
  async (value) => {
    if (value) {
      window.addEventListener('keydown', onKeyDown)
      await ensureLoaded()
      await nextTick()
      inputEl.value?.focus()
    } else {
      window.removeEventListener('keydown', onKeyDown)
      query.value = ''
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 84px 16px 16px;
}

.search-overlay-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
}

.search-overlay-inner {
  position: relative;
  width: min(1100px, calc(100% - 32px));
  z-index: 1;
  padding: 18px;
  display: grid;
  gap: 12px;
  background: var(--app-bg-primary);
  border: 1px solid var(--app-border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-medium);
}

.search-top {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 18px;
}

.search-overlay-form {
  position: relative;
  width: 100%;
}

.search-overlay-input {
  width: 100%;
  height: 46px;
  border-radius: 8px;
  border: 1px solid var(--app-border-color);
  background: var(--app-input-bg);
  padding: 0 92px 0 14px;
  font-size: 1rem;
  color: var(--app-text-primary);
  outline: none;
}

.search-overlay-input::placeholder {
  color: var(--app-text-muted);
}

.search-overlay-input:focus {
  border-color: rgba(201, 168, 89, 0.55);
  box-shadow: 0 0 0 3px rgba(201, 168, 89, 0.18);
}

.search-overlay-submit {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  color: var(--app-text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.search-overlay-clear {
  position: absolute;
  right: 44px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  color: var(--app-text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.search-overlay-close {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid var(--app-border-color);
  background: rgba(255, 255, 255, 0.92);
  color: var(--app-text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.search-suggestions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 2px 2px;
}

.search-suggestions-label {
  font-size: 0.9rem;
  color: var(--app-text-muted);
}

.search-suggestion {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--app-text-secondary);
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.search-suggestion:hover {
  text-decoration: underline;
  color: var(--app-text-primary);
}

.search-results {
  min-height: 120px;
}

.search-state {
  padding: 18px 4px;
  color: var(--app-text-muted);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  padding-top: 6px;
}

.results-grid--empty {
  display: none;
}

.result-card {
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: var(--border-radius-md);
  transition: transform var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
}

.result-card:hover {
  transform: var(--card-hover-lift);
  background: var(--app-hover-bg);
  box-shadow: var(--shadow-light);
}

.result-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--app-bg-secondary);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--app-border-color);
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.result-info {
  padding-top: 10px;
}

.result-name {
  font-size: 0.95rem;
  color: var(--app-text-primary);
}

.result-category {
  font-size: 0.78rem;
  color: var(--app-text-muted);
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.result-price {
  font-size: 0.92rem;
  color: var(--app-text-secondary);
  margin-top: 6px;
}

@media (max-width: 980px) {
  .results-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
