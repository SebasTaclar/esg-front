<template>
  <section class="brands-section">
    <div class="brands-container">
      <header class="brands-header">
        <h2 class="brands-title">Trabajamos con marcas líderes</h2>
        <span class="brands-title-line"></span>
        <p class="brands-subtitle">Distribuidores autorizados de las mejores marcas del mercado industrial.</p>
      </header>

      <div v-if="loading" class="brands-loading">
        <p>Cargando marcas...</p>
      </div>

      <div v-else-if="error" class="brands-error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="brands.length === 0" class="brands-empty">
        <p>No hay marcas disponibles</p>
      </div>

      <div v-else class="brands-carousel" @mouseenter="paused = true" @mouseleave="paused = false">
        <div class="brands-track" :class="{ paused }">
          <div
            v-for="(brand, i) in duplicatedBrands"
            :key="`${brand.id}-${i}`"
            class="brand-item"
          >
            <div class="brand-logo">
              <img
                v-if="brand.imageUrls && brand.imageUrls.length > 0"
                :src="brand.imageUrls[0]"
                :alt="brand.name"
                class="brand-image"
              />
              <span v-else class="brand-text">{{ brand.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onMounted } from 'vue'
import { useBrands } from '@/composables/useBrands'

const { brands, loading, error, loadBrands } = useBrands()
const paused = ref(false)

const duplicatedBrands = computed(() => [...brands.value, ...brands.value])

onMounted(() => {
  loadBrands()
})
</script>

<style scoped>
.brands-section {
  width: 100%;
  padding: 20px 0 100px;
  background: #FFFFFF;
  overflow: hidden;
}

.brands-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.brands-header {
  text-align: center;
  margin-bottom: 60px;
}

.brands-title {
  margin: 0;
  font-size: clamp(28px, 3.5vw, 40px);
  font-weight: 800;
  color: #0B0B0B;
  letter-spacing: -0.5px;
  font-style: italic;
}

.brands-title-line {
  display: block;
  width: 60px;
  height: 4px;
  background: #F4B400;
  border-radius: 2px;
  margin: 1px auto 0;
}

.brands-subtitle {
  margin: 12px auto 0;
  max-width: 520px;
  color: #666666;
  font-size: 16px;
  line-height: 1.6;
}

.brands-carousel {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
}

.brands-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: scroll-right 30s linear infinite;
}

.brands-track.paused {
  animation-play-state: paused;
}

@keyframes scroll-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

.brand-item {
  flex: 0 0 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background: #F7F8FA;
  border-radius: 12px;
  border: 1px solid #E5E5E5;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.brand-item:hover {
  border-color: #FFC107;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.brand-image {
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
}

.brand-text {
  font-size: 16px;
  font-weight: 700;
  color: #999999;
  text-align: center;
}

.brand-item:hover .brand-text {
  color: #0B0B0B;
}

@media (max-width: 768px) {
  .brands-section {
    padding: 60px 0;
  }

  .brand-item {
    flex: 0 0 150px;
    padding: 24px 16px;
  }

  .brand-text {
    font-size: 14px;
  }
}

.brands-loading,
.brands-error,
.brands-empty {
  text-align: center;
  padding: 40px 0;
}

.brands-loading p,
.brands-error p,
.brands-empty p {
  font-size: 16px;
  color: #666666;
}

.brands-error p {
  color: #DC2626;
}
</style>
