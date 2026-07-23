<template>
  <main class="clientes-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <span class="hero-label">NUESTROS CLIENTES</span>
          <h1 class="hero-title">
            Organizaciones que confían en<br />
            <span class="highlight">nuestra experiencia</span>
          </h1>
          <p class="hero-desc">
            En ES Gestion Empresarial SAS acompañamos a empresas de diversos sectores a fortalecer sus sistemas de gestión, optimizar procesos y alcanzar el cumplimiento de estándares internacionales.
          </p>

          <!-- Stats -->
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">15+</span>
              <span class="stat-label">Años de<br />experiencia</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">500+</span>
              <span class="stat-label">Proyectos<br />liderados</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">200+</span>
              <span class="stat-label">Clientes<br />confían en nosotros</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">Cobertura<br />Nacional e Internacional</span>
              <span class="stat-label">Presencia en<br />todo el país</span>
            </div>
          </div>

          <a href="#sectores" class="btn-primary">
            Conozca más sobre el proyecto <i class="fas fa-arrow-right"></i>
          </a>
        </div>

        <div class="hero-images">
          <div class="hero-img-main">
            <img
              src="https://gestioncalidadsas.com/wp-content/uploads/2020/05/Gestion-Calidad-01-e1664921517462.jpg"
              alt="Equipo ESG en reunión con cliente"
            />
          </div>
          <div class="hero-img-secondary">
            <img
              src="https://www.csrconsulting.com.mx/wp-content/uploads/2023/06/collage-control-calidad-estandar-2-scaled.jpg"
              alt="Consultores trabajando"
            />
          </div>
          <div class="hero-img-logo">
            <img
              src="/images/LOGO.PNG"
              alt="ESG Logo"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Sectores Section -->
    <section id="sectores" class="sectores">
      <div class="sectores-container">
        <h2 class="section-title">
          Sectores donde hemos <span class="highlight">trabajado</span>
        </h2>
        <div class="sectores-grid">
          <div class="sector-item" v-for="sector in sectores" :key="sector.name">
            <div class="sector-icon">
              <i :class="sector.icon"></i>
            </div>
            <span class="sector-name">{{ sector.name }}</span>
          </div>
        </div>
      </div>
    </section>



    <!-- Acompañamiento Section -->
    <section class="acompanamiento">
      <div class="acompanamiento-container">
        <div class="acompanamiento-header">
          <h2 class="section-title">
            Así acompañamos a nuestros <span class="highlight">clientes</span>
          </h2>
          <div class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['tab-btn', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="cards-grid">
          <div
            v-for="(card, index) in filteredCards"
            :key="card.title"
            class="acompanamiento-card"
            @click="openLightbox(index)"
          >
            <div class="card-image">
              <img :src="card.image" :alt="card.description" />
            </div>
          </div>
        </div>

        <!-- Lightbox -->
        <teleport to="body">
          <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
            <button class="lightbox-close" @click="closeLightbox">
              <i class="fas fa-times"></i>
            </button>
            <button class="lightbox-prev" @click="prevImage">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="lightbox-content">
              <img :src="filteredCards[lightboxIndex]?.image" :alt="filteredCards[lightboxIndex]?.description" />
            </div>
            <button class="lightbox-next" @click="nextImage">
              <i class="fas fa-chevron-right"></i>
            </button>
            <div class="lightbox-counter">
              {{ lightboxIndex + 1 }} / {{ filteredCards.length }}
            </div>
          </div>
        </teleport>

        <div class="view-more">
          <a href="#" class="btn-outline">
            Ver más proyectos <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- Recursos Section -->
    <section class="recursos">
      <div class="recursos-container">
        <div class="recursos-content">
          <div class="recursos-text">
            <h2 class="section-title">
              RECURSOS PARA SU <span class="highlight">ORGANIZACIÓN</span>
            </h2>
            <p class="recursos-desc">
              Acceda a nuestra biblioteca de recursos diseñados para ayudarle a mejorar la gestión de su organización.
            </p>
          </div>

          <div class="recursos-tabs">
            <button
              v-for="tab in recursosTabs"
              :key="tab.id"
              :class="['recurso-tab', { active: activeRecursoTab === tab.id }]"
              @click="activeRecursoTab = tab.id"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
            </button>
          </div>

          <div class="recursos-grid">
            <div
              v-for="recurso in filteredRecursos"
              :key="recurso.title"
              class="recurso-card"
            >
              <div class="recurso-icon">
                <i :class="recurso.icon"></i>
              </div>
              <h3 class="recurso-title">{{ recurso.title }}</h3>
              <p class="recurso-desc">{{ recurso.description }}</p>
              <a href="#" class="recurso-link">
                Descargar <i class="fas fa-download"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <div class="cta-left">
          <h2 class="cta-title">
            Más que clientes, construimos<br />
            <span class="highlight">alianzas estratégicas</span>
          </h2>
          <p class="cta-desc">
            Cada proyecto es una oportunidad para generar valor, fortalecer procesos y acompañar el crecimiento de organizaciones que quieren confiar en su gestión.
          </p>
        </div>
        <div class="cta-right">
          <div class="cta-contact-card">
            <div class="cta-contact-icon">
              <i class="fas fa-headset"></i>
            </div>
            <h3 class="cta-contact-title">¿Necesita asesoría?</h3>
            <p class="cta-contact-desc">
              Nuestro equipo está listo para ayudarle a encontrar la mejor solución para su organización.
            </p>
            <a href="https://wa.me/573242899188?text=Hola,%20cordial%20saludo.%20Me%20interesa%20recibir%20informaci%C3%B3n%20sobre%20sus%20servicios.%20%C2%BFPodr%C3%ADan%20ayudarme?" target="_blank" class="cta-contact-btn">
              <i class="fab fa-whatsapp"></i> Contactar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'ClientesRecursos'
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const prevImage = () => {
  lightboxIndex.value = lightboxIndex.value > 0
    ? lightboxIndex.value - 1
    : filteredCards.value.length - 1
}

const nextImage = () => {
  lightboxIndex.value = lightboxIndex.value < filteredCards.value.length - 1
    ? lightboxIndex.value + 1
    : 0
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const sectores = [
  { name: 'Industrial', icon: 'fas fa-industry' },
  { name: 'Laboratorios de ensayo', icon: 'fas fa-flask' },
  { name: 'Energía y petróleo', icon: 'fas fa-oil-can' },
  { name: 'Farmacéutica', icon: 'fas fa-pills' },
  { name: 'Metalurgia', icon: 'fas fa-hammer' },
  { name: 'Turismo', icon: 'fas fa-plane-departure' },
  { name: 'Agroindustria', icon: 'fas fa-seedling' },
  { name: 'Manufactura', icon: 'fas fa-cogs' }
]

const empresas = [
  { name: 'ISA', logo: 'https://via.placeholder.com/120x50/ffffff/333333?text=ISA' },
  { name: 'Alpina', logo: 'https://via.placeholder.com/120x50/ffffff/333333?text=Alpina' },
  { name: 'Ecopetrol', logo: 'https://via.placeholder.com/120x50/ffffff/333333?text=Ecopetrol' },
  { name: 'Laboratorios Lafrancol', logo: 'https://via.placeholder.com/120x50/ffffff/333333?text=Lafrancol' },
  { name: 'Fazenda', logo: 'https://via.placeholder.com/120x50/ffffff/333333?text=Fazenda' }
]

const tabs = [
  { id: 'todos', label: 'Todos' },
  { id: 'auditorias', label: 'Auditorías' },
  { id: 'capacitacion', label: 'Capacitación' },
  { id: 'implementacion', label: 'Implementación' },
  { id: 'laboratorios', label: 'Laboratorios' },
  { id: 'metrologia', label: 'Metrología' }
]

const activeTab = ref('todos')

const cards = [
  {
    title: 'Implementación SG-SST',
    description: 'Implementación del Sistema de Gestión de Seguridad y Salud en el Trabajo para empresa del sector Industrial.',
    date: 'Febrero 2024',
    category: 'implementacion',
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1784839230/14_20251125_170301_0013_jpndk4.png'
  },
  {
    title: 'Auditoría ISO 9001',
    description: 'Auditoría interna de Sistema de Gestión de Calidad para laboratorio de ensayos.',
    date: 'Enero 2024',
    category: 'auditorias',
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1784839229/5_20251125_170300_0004_iskcay.png'
  },
  {
    title: 'Capacitación ISO 17025',
    description: 'Programa de capacitación en requisitos de la norma para personal de laboratorio.',
    date: 'Diciembre 2023',
    category: 'capacitacion',
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1784839230/8_20251125_170301_0007_qj1qbn.png'
  },
  {
    title: 'Calibración de Equipos',
    description: 'Programa de calibración y trazabilidad metrológica para empresa farmacéutica.',
    date: 'Noviembre 2023',
    category: 'metrologia',
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1784839230/15_20251125_170301_0014_pwra6h.png'
  },
  {
    title: 'Implementación ISO 14001',
    description: 'Sistema de Gestión Ambiental para empresa del sector energía.',
    date: 'Octubre 2023',
    category: 'implementacion',
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1784839020/1_20250317_093039_0000_1_bzedo2.png'
  },
  {
    title: 'Auditoría ISO 45001',
    description: 'Auditoría de segunda parte para proveedor del sector automotriz.',
    date: 'Septiembre 2023',
    category: 'auditorias',
    image: 'https://res.cloudinary.com/dlwzazojt/image/upload/v1784839021/3_20251125_170300_0002_kqjalj.png'
  }
]

const filteredCards = computed(() => {
  if (activeTab.value === 'todos') return cards
  return cards.filter(card => card.category === activeTab.value)
})

const recursosTabs = [
  { id: 'guia', label: 'Guías', icon: 'fas fa-book' },
  { id: 'norma', label: 'Normas', icon: 'fas fa-file-alt' },
  { id: 'manual', label: 'Manuales', icon: 'fas fa-book-open' },
  { id: 'metodo', label: 'Métodos', icon: 'fas fa-flask' },
  { id: 'blog', label: 'Blog', icon: 'fas fa-newspaper' },
  { id: 'programa', label: 'Programas de trabajo', icon: 'fas fa-calendar-alt' }
]

const activeRecursoTab = ref('guia')

const recursos = [
  {
    title: 'Guía de implementación ISO 9001',
    description: 'Paso a paso para implementar un Sistema de Gestión de Calidad.',
    icon: 'fas fa-book',
    category: 'guia'
  },
  {
    title: 'Lista de verificación ISO 14001',
    description: 'Checklist completa para auditorías ambientales.',
    icon: 'fas fa-check-square',
    category: 'guia'
  },
  {
    title: 'Norma ISO 45001:2018',
    description: 'Requisitos para sistemas de gestión de seguridad y salud laboral.',
    icon: 'fas fa-file-alt',
    category: 'norma'
  },
  {
    title: 'Manual de procedimientos',
    description: 'Modelo de manual de procedimientos para su organización.',
    icon: 'fas fa-book-open',
    category: 'manual'
  },
  {
    title: 'Métodos de auditoría',
    description: 'Guía metodológica para realizar auditorías internas.',
    icon: 'fas fa-flask',
    category: 'metodo'
  },
  {
    title: 'Artículos sobre gestión',
    description: 'Publicaciones actualizadas sobre normativas y buenas prácticas.',
    icon: 'fas fa-newspaper',
    category: 'blog'
  }
]

const filteredRecursos = computed(() => {
  return recursos.filter(recurso => recurso.category === activeRecursoTab.value)
})
</script>

<style scoped>
.clientes-page {
  background: #FAFAF8;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===========================
   HERO SECTION
   =========================== */
.hero {
  padding: 120px 0 80px;
  background: #FAFAF8;
  overflow: hidden;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  padding: 40px 0;
}

.hero-label {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  color: #C89B2D;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.hero-title {
  margin: 0 0 24px;
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 800;
  color: #2F2F2F;
  line-height: 1.2;
}

.hero-title .highlight {
  color: #C89B2D;
}

.hero-desc {
  margin: 0 0 32px;
  font-size: 16px;
  color: #6B6B6B;
  line-height: 1.8;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 36px;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #F0F0F0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 19px;
  font-weight: 800;
  color: #C89B2D;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #888888;
  line-height: 1.4;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: #C89B2D;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
}

.btn-primary:hover {
  background: #B8891F;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200, 155, 45, 0.3);
}

.hero-images {
  position: relative;
  height: 500px;
}

.hero-img-main {
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.hero-img-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-img-secondary {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 55%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border: 4px solid #FFFFFF;
}

.hero-img-secondary img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-img-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.hero-img-logo img {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

/* ===========================
   SECTORES SECTION
   =========================== */
.sectores {
  padding: 80px 0;
  background: #FFFFFF;
}

.sectores-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.section-title {
  margin: 0 0 48px;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  color: #2F2F2F;
  text-align: center;
}

.section-title .highlight {
  color: #C89B2D;
}

.sectores-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.sector-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 20px;
  background: #FAFAF8;
  border-radius: 16px;
  border: 1px solid #F0F0F0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.sector-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(200, 155, 45, 0.1);
  border-color: rgba(200, 155, 45, 0.2);
}

.sector-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sector-icon i {
  font-size: 24px;
  color: #C89B2D;
}

.sector-name {
  font-size: 14px;
  font-weight: 600;
  color: #2F2F2F;
  text-align: center;
}

/* ===========================
   EMPRESAS SECTION
   =========================== */
.empresas {
  padding: 60px 0;
  background: #FAFAF8;
}

.empresas-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.empresas-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.empresa-logo {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.empresa-logo:hover {
  opacity: 1;
}

.empresa-logo img {
  height: 40px;
  object-fit: contain;
}

/* ===========================
   ACOMPAÑAMIENTO SECTION
   =========================== */
.acompanamiento {
  padding: 0px 0;
  background: #FFFFFF;
}

.acompanamiento-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.acompanamiento-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 24px;
}

.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6B6B6B;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
}

.tab-btn:hover {
  border-color: #C89B2D;
  color: #C89B2D;
}

.tab-btn.active {
  background: #C89B2D;
  border-color: #C89B2D;
  color: #FFFFFF;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.acompanamiento-card {
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #F0F0F0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.acompanamiento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.card-image {
  height: 230px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.acompanamiento-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
}

.card-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #2F2F2F;
}

.card-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: #888888;
  line-height: 1.6;
}

.card-date {
  font-size: 12px;
  color: #C89B2D;
  font-weight: 600;
}

.view-more {
  text-align: center;
  margin-top: 40px;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: transparent;
  border: 2px solid #C89B2D;
  border-radius: 8px;
  color: #C89B2D;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #C89B2D;
  color: #FFFFFF;
}

/* ===========================
   RECURSOS SECTION
   =========================== */
.recursos {
  padding: 80px 0;
  background: #FAFAF8;
}

.recursos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.recursos-content {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 48px;
  border: 1px solid #F0F0F0;
}

.recursos-text {
  margin-bottom: 32px;
}

.recursos-text .section-title {
  text-align: left;
  margin-bottom: 12px;
}

.recursos-desc {
  margin: 0;
  font-size: 15px;
  color: #6B6B6B;
  line-height: 1.7;
}

.recursos-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.recurso-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #FAFAF8;
  border: 1px solid #F0F0F0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6B6B6B;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
}

.recurso-tab:hover {
  border-color: #C89B2D;
  color: #C89B2D;
}

.recurso-tab.active {
  background: #C89B2D;
  border-color: #C89B2D;
  color: #FFFFFF;
}

.recurso-tab i {
  font-size: 14px;
}

.recursos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.recurso-card {
  padding: 24px;
  background: #FAFAF8;
  border-radius: 12px;
  border: 1px solid #F0F0F0;
  transition: all 0.3s ease;
}

.recurso-card:hover {
  border-color: rgba(200, 155, 45, 0.3);
  box-shadow: 0 8px 24px rgba(200, 155, 45, 0.08);
}

.recurso-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(200, 155, 45, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.recurso-icon i {
  font-size: 20px;
  color: #C89B2D;
}

.recurso-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: #2F2F2F;
}

.recurso-desc {
  margin: 0 0 16px;
  font-size: 13px;
  color: #888888;
  line-height: 1.6;
}

.recurso-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #C89B2D;
  text-decoration: none;
  transition: gap 0.3s ease;
}

.recurso-link:hover {
  gap: 10px;
}

/* ===========================
   CTA SECTION
   =========================== */
.cta-section {
  padding: 80px 0;
  background: #FFFFFF;
}

.cta-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.cta-title {
  margin: 0 0 20px;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  color: #2F2F2F;
  line-height: 1.3;
}

.cta-title .highlight {
  color: #C89B2D;
}

.cta-desc {
  margin: 0;
  font-size: 15px;
  color: #6B6B6B;
  line-height: 1.8;
}

.cta-contact-card {
  background: #FAFAF8;
  border-radius: 16px;
  padding: 40px 32px;
  border: 1px solid #F0F0F0;
  text-align: center;
}

.cta-contact-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.cta-contact-icon i {
  font-size: 24px;
  color: #C89B2D;
}

.cta-contact-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: #2F2F2F;
}

.cta-contact-desc {
  margin: 0 0 24px;
  font-size: 14px;
  color: #888888;
  line-height: 1.7;
}

.cta-contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: #C89B2D;
  color: #FFFFFF;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-contact-btn:hover {
  background: #D4A82F;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200, 155, 45, 0.3);
}

/* ===========================
   LIGHTBOX
   =========================== */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-content {
  max-width: 80vw;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #FFFFFF;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #FFFFFF;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.lightbox-prev { left: 24px; }
.lightbox-next { right: 24px; }

.lightbox-prev:hover,
.lightbox-next:hover {
  background: #C89B2D;
  transform: translateY(-50%) scale(1.1);
}

.lightbox-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
}

/* ===========================
   RESPONSIVE
   =========================== */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-content {
    text-align: center;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-images {
    height: 400px;
    order: -1;
  }

  .sectores-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 0 60px;
  }

  .hero-images {
    height: 300px;
  }

  .hero-img-main {
    width: 90%;
    height: 250px;
  }

  .hero-img-secondary {
    width: 60%;
    height: 150px;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px;
  }

  .stat-number {
    font-size: 22px;
  }

  .sectores-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .sector-item {
    padding: 24px 16px;
  }

  .acompanamiento-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .recursos-content {
    padding: 32px 24px;
  }

  .recursos-grid {
    grid-template-columns: 1fr;
  }

  .lightbox-prev,
  .lightbox-next {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .lightbox-prev { left: 12px; }
  .lightbox-next { right: 12px; }

  .lightbox-close {
    top: 12px;
    right: 12px;
    width: 38px;
    height: 38px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 26px;
  }

  .hero-stats {
    grid-template-columns: 1fr 1fr;
  }

  .sectores-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .sector-icon {
    width: 48px;
    height: 48px;
  }

  .sector-icon i {
    font-size: 18px;
  }

  .tabs {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }

  .tab-btn {
    white-space: nowrap;
  }

  .recursos-tabs {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }

  .recurso-tab {
    white-space: nowrap;
  }
}
</style>
