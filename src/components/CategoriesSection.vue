<template>
  <section class="categories-section">
    <div class="categories-container">
      <header class="categories-header">
        <h2 class="categories-title">Nuestras Categorías</h2>
      </header>

      <div class="categories-grid" role="list">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="category-card"
          role="listitem"
          @click="goToCategory(category)"
        >
          <div class="category-card-image">
            <img
              :src="category.image"
              :alt="category.name"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="category-card-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <span class="category-cta">
              Ver productos
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface CategoryItem {
  id: string
  name: string
  image: string
  slug: string
}

const categories = ref<CategoryItem[]>([
  {
    id: '1',
    name: 'Herramientas dieléctricas',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgOM1zyl5Yt6gMdUIvgNJSTR6F1IDyMYE-OOa6GM_B4ndloTNMR1ksP3rF&s=10',
    slug: 'herramientas-dielectricas'
  },
  {
    id: '2',
    name: 'Equipos de protección personal',
    image: 'https://placehold.co/200x200/F5F5F5/333333?text=EPP',
    slug: 'equipos-proteccion-personal'
  },
  {
    id: '3',
    name: 'Automatización industrial',
    image: 'https://placehold.co/200x200/F5F5F5/333333?text=Automatizacion',
    slug: 'automatizacion-industrial'
  },
  {
    id: '4',
    name: 'Trabajo en alturas',
    image: 'https://placehold.co/200x200/F5F5F5/333333?text=Alturas',
    slug: 'trabajo-en-alturas'
  },
  {
    id: '5',
    name: 'Ferretería industrial',
    image: 'https://placehold.co/200x200/F5F5F5/333333?text=Ferreteria',
    slug: 'ferreteria-industrial'
  },

])

function goToCategory(category: CategoryItem) {
  router.push(`/productos?categoria=${category.slug}`)
}
</script>

<style scoped>
.categories-section {
  width: 100%;
  padding: 60px 0 80px;
  background: #FFFFFF;
  margin-top: -60px;
  position: relative;
  z-index: 5;
}

.categories-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.categories-header {
  text-align: center;
  margin-bottom: 40px;
}

.categories-title {
  margin: 0;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 700;
  color: #0B0B0B;
}

.categories-subtitle {
  margin: 8px auto 0;
  color: #666666;
  font-size: 15px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.category-card {
  appearance: none;
  border: 0;
  padding: 0;
  text-align: left;
  border-radius: 12px;
  cursor: pointer;
  background: #F5F5F5;
  border: 1px solid #E5E5E5;
  transition: all 0.25s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.category-card:hover {
  border-color: #FFC107;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.category-card-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  overflow: hidden;
  background: #FFFFFF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.category-card:hover .category-card-image img {
  transform: scale(1.06);
}

.category-card-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 600;
  color: #0B0B0B;
  line-height: 1.3;
}

.category-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #888888;
  font-size: 11px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.category-card:hover .category-cta {
  color: #FFC107;
}

.category-cta i {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.category-card:hover .category-cta i {
  transform: translateX(3px);
}

@media (max-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-section {
    padding: 48px 0 60px;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .category-card {
    padding: 10px;
    gap: 10px;
  }

  .category-card-image {
    width: 60px;
    height: 60px;
  }

  .category-name {
    font-size: 12px;
  }

  .category-cta {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
