<template>
  <section class="testimonials-section">
    <div class="testimonials-container">
      <header class="testimonials-header">
        <h2 class="testimonials-title">Lo que dicen nuestros clientes</h2>
        <p class="testimonials-subtitle">La confianza de las principales empresas del país.</p>
      </header>

      <div class="testimonials-carousel">
        <button class="testimonials-arrow testimonials-arrow--left" @click="prevSlide" aria-label="Anterior">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="testimonials-track" ref="trackRef">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="testimonials-card"
          >
            <div class="testimonials-card-header">
              <div class="testimonials-avatar">
                <img :src="testimonial.avatar" :alt="testimonial.name" />
              </div>
              <div class="testimonials-info">
                <h4 class="testimonials-name">{{ testimonial.name }}</h4>
                <span class="testimonials-company">{{ testimonial.company }}</span>
              </div>
            </div>
            <div class="testimonials-rating">
              <i v-for="i in 5" :key="i" class="fas fa-star"></i>
            </div>
            <p class="testimonials-text">{{ testimonial.text }}</p>
          </div>
        </div>

        <button class="testimonials-arrow testimonials-arrow--right" @click="nextSlide" aria-label="Siguiente">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const trackRef = ref<HTMLElement | null>(null)

interface Testimonial {
  id: string
  name: string
  company: string
  avatar: string
  text: string
}

const testimonials = ref<Testimonial[]>([
  {
    id: '1',
    name: 'Carlos Méndez',
    company: 'Constructora ABC',
    avatar: 'https://placehold.co/100x100/FFC107/0B0B0B?text=CM',
    text: 'Excelente servicio y productos de alta calidad. DISEF siempre nos brinda la mejor asesoría técnica.'
  },
  {
    id: '2',
    name: 'María González',
    company: 'Industrias XYZ',
    avatar: 'https://placehold.co/100x100/FFC107/0B0B0B?text=MG',
    text: 'Llevamos más de 10 años trabajando con ellos. Su confiabilidad es incomparable.'
  },
  {
    id: '3',
    name: 'Roberto Díaz',
    company: 'Minera del Norte',
    avatar: 'https://placehold.co/100x100/FFC107/0B0B0B?text=RD',
    text: 'Los mejores precios del mercado con la garantía que necesitamos para nuestra operación.'
  },
  {
    id: '4',
    name: 'Ana Rodríguez',
    company: 'Energía Verde',
    avatar: 'https://placehold.co/100x100/FFC107/0B0B0B?text=AR',
    text: 'Su catálogo de energía solar es impresionante. Nos ayudaron a reducir costos operativos.'
  }
])

function prevSlide() {
  if (trackRef.value) {
    trackRef.value.scrollBy({ left: -400, behavior: 'smooth' })
  }
}

function nextSlide() {
  if (trackRef.value) {
    trackRef.value.scrollBy({ left: 400, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.testimonials-section {
  width: 100%;
  padding: 100px 0;
  background: #F7F8FA;
}

.testimonials-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.testimonials-header {
  text-align: center;
  margin-bottom: 60px;
}

.testimonials-title {
  margin: 0;
  font-size: clamp(28px, 3.5vw, 40px);
  font-weight: 800;
  color: #0B0B0B;
  letter-spacing: -0.5px;
  font-style: italic;
}

.testimonials-subtitle {
  margin: 12px auto 0;
  max-width: 520px;
  color: #666666;
  font-size: 16px;
  line-height: 1.6;
}

.testimonials-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
}

.testimonials-track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 20px 0;
}

.testimonials-track::-webkit-scrollbar {
  display: none;
}

.testimonials-card {
  flex: 0 0 380px;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #E5E5E5;
  transition: all 0.3s ease;
  scroll-snap-align: start;
}

.testimonials-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.testimonials-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.testimonials-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: #F5F5F5;
}

.testimonials-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonials-info {
  flex: 1;
}

.testimonials-name {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #0B0B0B;
}

.testimonials-company {
  font-size: 13px;
  color: #999999;
}

.testimonials-rating {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.testimonials-rating i {
  color: #FFC107;
  font-size: 14px;
}

.testimonials-text {
  margin: 0;
  font-size: 15px;
  color: #666666;
  line-height: 1.6;
}

.testimonials-arrow {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  color: #0B0B0B;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.testimonials-arrow:hover {
  background: #FFC107;
  border-color: #FFC107;
}

@media (max-width: 1024px) {
  .testimonials-card {
    flex: 0 0 340px;
  }
}

@media (max-width: 768px) {
  .testimonials-section {
    padding: 60px 0;
  }

  .testimonials-arrow {
    display: none;
  }

  .testimonials-card {
    flex: 0 0 300px;
    padding: 24px;
  }
}
</style>
