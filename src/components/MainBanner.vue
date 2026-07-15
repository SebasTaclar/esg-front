<template>
  <section class="hero-banner-wrapper">
    <section class="hero-banner">
      <div class="hero-bg">
        <img :src="slides[currentSlide].image" :alt="slides[currentSlide].alt" class="hero-bg-img" />
      </div>

      <div class="hero-overlay-left"></div>
      <div class="hero-diagonal-lines"></div>

      <button class="hero-arrow hero-arrow--left" @click="prevSlide" aria-label="Slide anterior">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="hero-arrow hero-arrow--right" @click="nextSlide" aria-label="Siguiente slide">
        <i class="fas fa-chevron-right"></i>
      </button>

      <div class="hero-content">
        <div class="hero-copy">
          <p class="hero-kicker">
            <i class="fas fa-bolt" aria-hidden="true"></i>
            Soluciones industriales y eléctricas
          </p>
          <h1 class="hero-title">
            Más de <span class="hero-highlight">20 años</span><br />
            ofreciendo soluciones<br />
            eléctricas e industriales
          </h1>
          <p class="hero-subtitle">Calidad, seguridad y eficiencia en cada proyecto.</p>

          <div class="hero-actions">
            <button class="btn-hero btn-hero--primary" @click="scrollToProducts">
              <i class="fas fa-clipboard-list" aria-hidden="true"></i>
              <span>Solicitar cotización</span>
            </button>
            <button class="btn-hero btn-hero--secondary" @click="scrollToContact">
              <i class="fas fa-file-lines" aria-hidden="true"></i>
              <span>Solicitar cotización</span>
            </button>
          </div>
        </div>
      </div>

      <div class="hero-indicators">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="hero-dot"
          :class="{ active: index === currentSlide }"
          @click="goToSlide(index)"
          :aria-label="`Slide ${index + 1}`"
        ></button>
      </div>
    </section>
    <div class="benefits-bar">
      <div class="benefit-item" v-for="benefit in benefits" :key="benefit.title">
        <div class="benefit-icon">
          <i :class="benefit.icon" aria-hidden="true"></i>
        </div>
        <div class="benefit-text">
          <strong>{{ benefit.title }}</strong>
          <span>{{ benefit.description }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const slides = [
  {
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1783533124/ChatGPT_Image_8_jul_2026_12_45_14_plultb.png',
    alt: 'Técnico electricista trabajando en tablero eléctrico industrial'
  },
  {
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1783533912/ChatGPT_Image_8_jul_2026_13_05_00_pmnahb.png',
    alt: 'Equipo de trabajo en instalaciones eléctricas industriales'
  },
  {
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1783519773/ChatGPT_Image_8_jul_2026_09_09_13_g2nws1.png',
    alt: 'Soluciones eléctricas industriales de alta calidad'
  }
]

const benefits = [
  { icon: 'fas fa-certificate', title: 'Productos certificados', description: 'Cumplimiento de normas' },
  { icon: 'fas fa-truck-fast', title: 'Envíos a todo el país', description: 'Cobertura nacional' },
  { icon: 'fas fa-headset', title: 'Asesoría técnica', description: 'Especialistas a tu servicio' },
  { icon: 'fas fa-award', title: 'Marcas líderes', description: 'Distribuidores autorizados' },
  { icon: 'fas fa-shield-halved', title: 'Pagos seguros', description: 'Compra protegida' }
]

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
  resetAutoplay()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
  resetAutoplay()
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetAutoplay()
}

const resetAutoplay = () => {
  if (autoplayTimer) clearInterval(autoplayTimer)
  autoplayTimer = setInterval(nextSlide, 6000)
}

const scrollToSection = (selector: string) => {
  const target = document.querySelector(selector)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToProducts = () => scrollToSection('#products')
const scrollToContact = () => scrollToSection('#contact')

onMounted(() => {
  autoplayTimer = setInterval(nextSlide, 6000)
})

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})

defineOptions({
  name: 'MainBanner'
})
</script>

<style scoped>
@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slowZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.08);
  }
}

.hero-banner-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 0;
}

.hero-banner {
  position: relative;
  width: 100%;
  height: 580px;
  overflow: hidden;
  background: transparent;
  margin: 0;
  padding: 0;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #0B0B0B;
}

.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  animation: slowZoom 12s ease-in-out infinite alternate;
  filter: brightness(0.85) saturate(1.1);
}

.hero-overlay-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 45%;
  height: 100%;
  background: rgba(11, 11, 11, 0.45);
  z-index: 1;
  overflow: hidden;
}

.hero-diagonal-lines {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: 
    linear-gradient(180deg, rgba(11, 11, 11, 0.1) 0%, rgba(11, 11, 11, 0.25) 100%),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 80px,
      rgba(255, 193, 7, 0.05) 80px,
      rgba(255, 193, 7, 0.05) 82px
    );
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: clamp(40px, 6vw, 100px);
}

.hero-copy {
  max-width: 520px;
  animation: slideFromLeft 0.7s ease both;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px;
  padding: 8px 16px;
  border-radius: 6px;
  background: rgba(255, 193, 7, 0.12);
  border: 1px solid rgba(255, 193, 7, 0.25);
  color: #FFC107;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hero-kicker i {
  font-size: 0.9rem;
}

.hero-title {
  margin: 0 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 46px;
  font-weight: 700;
  line-height: 1.1;
  color: #FFFFFF;
  letter-spacing: -0.5px;
}

.hero-highlight {
  color: #FFC107;
  display: inline;
}

.hero-subtitle {
  margin: 0 0 28px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 400;
  color: #B5B5B5;
  line-height: 1.5;
  max-width: 420px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  animation: fadeIn 0.7s ease 0.3s both;
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
}

.btn-hero--primary {
  background: #FFC107;
  color: #0B0B0B;
}

.btn-hero--primary:hover {
  background: #E0A800;
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.3);
}

.btn-hero--secondary {
  background: transparent;
  color: #FFFFFF;
  border: 2px solid #FFFFFF;
}

.btn-hero--secondary:hover {
  background: #FFFFFF;
  color: #0B0B0B;
}

.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0B0B0B;
  border: 1px solid #555555;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 16px;
}

.hero-arrow:hover {
  background: #FFC107;
  border-color: #FFC107;
  color: #0B0B0B;
}

.hero-arrow--left {
  left: 24px;
}

.hero-arrow--right {
  right: 24px;
}

.hero-indicators {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  gap: 10px;
}

.hero-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 0;
}

.hero-dot.active {
  background: #FFC107;
  border-color: #FFC107;
}

.hero-dot:hover:not(.active) {
  border-color: #FFC107;
}

.benefits-bar {
  position: relative;
  width: calc(100% - 80px);
  max-width: 1320px;
  margin: -60px auto 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: #1A1A1A;
  border-radius: 16px;
  padding: 28px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.benefit-item:last-child {
  border-right: none;
}

.benefit-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(255, 193, 7, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-icon i {
  color: #FFC107;
  font-size: 18px;
}

.benefit-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.benefit-text strong {
  color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.benefit-text span {
  color: #B5B5B5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 12px;
  font-weight: 400;
}

@media (max-width: 1200px) {
  .hero-title {
    font-size: 56px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .benefits-bar {
    width: calc(100% - 40px);
  }
}

@media (max-width: 768px) {
  .hero-banner {
    height: auto;
    min-height: auto;
  }

  .hero-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
  }

  .hero-overlay-left {
    width: 100%;
    height: 500px;
    background: rgba(11, 11, 11, 0.7);
  }

  .hero-diagonal-lines {
    height: 500px;
  }

  .hero-content {
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 120px;
    padding-bottom: 60px;
    min-height: 500px;
  }

  .hero-title {
    font-size: clamp(28px, 7vw, 36px);
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-hero {
    width: 100%;
    justify-content: center;
  }

  .hero-arrow {
    display: none;
  }

  .hero-indicators {
    bottom: auto;
    top: 460px;
  }

  .benefits-bar {
    width: calc(100% - 32px);
    margin-top: -40px;
    grid-template-columns: 1fr;
    gap: 0;
    border-radius: 16px;
    padding: 0;
    overflow: hidden;
  }

  .benefit-item {
    padding: 16px 20px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .benefit-item:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: clamp(22px, 6vw, 28px);
  }

  .hero-subtitle {
    font-size: 16px;
  }
}
</style>
