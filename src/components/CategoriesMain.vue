<template>
  <section class="categories-main">
    <div class="categories-main-container">
      <header class="categories-main-header">
        <span class="categories-main-label">CATEGORÍAS PRINCIPALES</span>
        <h2 class="categories-main-title">Encuentra la solución ideal para <span class="highlight">cada proyecto</span></h2>
        <span class="categories-main-title-line"></span>
        <p class="categories-main-subtitle">Comercializamos productos certificados para el sector eléctrico e industrial, garantizando seguridad, calidad y respaldo en cada trabajo.</p>
      </header>

      <div class="categories-main-grid">
        <div v-if="loading" class="categories-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Cargando categorías...</span>
        </div>
        <template v-else>
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="category-main-card"
            :class="{ 'has-bg': category.image }"
            :style="category.image ? { backgroundImage: `url(${category.image})` } : {}"
            @click="goToCategory(category)"
          >
            <div v-if="category.image" class="category-main-bg-overlay"></div>
            <div class="category-main-icon">
              <i :class="category.icon" aria-hidden="true"></i>
            </div>
            <div class="category-main-content">
              <h3 class="category-main-name">{{ category.name }}</h3>
              <div class="category-main-divider"></div>
              <p class="category-main-desc">{{ category.description }}</p>
              <span class="category-main-btn">
                Explorar
                <i class="fas fa-arrow-right" aria-hidden="true"></i>
              </span>
            </div>
          </button>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '@/composables/useCategories'

const router = useRouter()
const { categories: backendCategories, loading, loadCategories } = useCategories()

interface CategoryMain {
  id: string
  name: string
  description: string
  icon: string
  slug: string
  image?: string
}

const categories = ref<CategoryMain[]>([])

const iconMap: Record<string, string> = {
  'dieléctrica': 'fas fa-bolt',
  'di electrica': 'fas fa-bolt',
  'epp': 'fas fa-hard-hat',
  'protección personal': 'fas fa-hard-hat',
  'proteccion personal': 'fas fa-hard-hat',
  'automatización': 'fas fa-cogs',
  'automatizacion': 'fas fa-cogs',
  'control': 'fas fa-cogs',
  'altura': 'fas fa-mountain',
  'alturas': 'fas fa-mountain',
  'herramienta': 'fas fa-tools',
  'herramientas': 'fas fa-tools',
  'ferretería': 'fas fa-tools',
  'ferreteria': 'fas fa-tools',
  'energía': 'fas fa-solar-panel',
  'energia': 'fas fa-solar-panel',
  'renovable': 'fas fa-solar-panel',
  'solar': 'fas fa-solar-panel'
}

const defaultIcon = 'fas fa-box'

function getIconForCategory(name: string): string {
  const lowerName = name.toLowerCase()
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(keyword)) {
      return icon
    }
  }
  return defaultIcon
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

onMounted(async () => {
  await loadCategories()
  categories.value = backendCategories.value.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description || '',
    icon: getIconForCategory(cat.name),
    slug: createSlug(cat.name),
    image: cat.imageUrls && cat.imageUrls.length > 0 ? cat.imageUrls[0] : undefined
  }))
})

function goToCategory(category: CategoryMain) {
  router.push(`/productos?categoria=${category.slug}`)
}
</script>

<style scoped>
.categories-main {
  width: 100%;
  padding: 60px 0 80px;
  background: #FFFFFF;
}

.categories-main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.categories-main-header {
  text-align: center;
  margin-bottom: 60px;
}

.categories-main-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #FFC107;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.categories-main-title {
  margin: 0;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 900;
  color: #0B0B0B;
  letter-spacing: -0.5px;
  font-style: italic;
  line-height: 1.2;
}

.categories-main-title .highlight {
  color: #FFC107;
}

.categories-main-title-line {
  display: block;
  width: 60px;
  height: 4px;
  background: #F4B400;
  border-radius: 2px;
  margin: 16px auto 0;
}

.categories-main-subtitle {
  margin: 16px auto 0;
  max-width: 600px;
  color: #666666;
  font-size: 16px;
  line-height: 1.6;
}

.categories-main-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.category-main-card {
  appearance: none;
  border: 0;
  padding: 20px;
  text-align: left;
  border-radius: 12px;
  cursor: pointer;
  background: #1A1A1A;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.category-main-card.has-bg {
  justify-content: flex-end;
  min-height: 220px;
}

.category-main-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(26, 26, 26, 0.2) 0%, rgba(26, 26, 26, 0.65) 100%);
  z-index: 1;
}

.category-main-card.has-bg .category-main-icon,
.category-main-card.has-bg .category-main-content {
  position: relative;
  z-index: 2;
}

.category-main-card:hover {
  background-color: #252525;
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.category-main-card.has-bg:hover {
  background-color: #1A1A1A;
}

.category-main-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B0B0B;
  border: 2px solid #FFC107;
  border-radius: 12px;
  color: #FFC107;
  font-size: 20px;
}

.category-main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.category-main-name {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.3;
}

.category-main-divider {
  width: 40px;
  height: 3px;
  background: #FFC107;
  margin-bottom: 12px;
}

.category-main-desc {
  margin: 0 0 16px;
  font-size: 13px;
  color: #D0D0D0;
  line-height: 1.5;
  flex: 1;
}

.category-main-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  background: transparent;
  border: 2px solid #FFC107;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ease;
  width: fit-content;
}

.category-main-card:hover .category-main-btn {
  background: #FFC107;
  color: #0B0B0B;
}

.category-main-btn i {
  font-size: 12px;
  transition: transform 0.2s ease;
}

.category-main-card:hover .category-main-btn i {
  transform: translateX(4px);
}

@media (max-width: 1200px) {
  .categories-main-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-main {
    padding: 60px 0;
  }

  .categories-main-grid {
    gap: 12px;
  }

  .category-main-card {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .categories-main-grid {
    grid-template-columns: 1fr;
  }
}

.categories-loading {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  color: #666666;
  font-size: 14px;
}

.categories-loading i {
  font-size: 24px;
  color: #FFC107;
}
</style>
