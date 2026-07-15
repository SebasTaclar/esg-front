<template>
  <section class="why-section">
    <div class="why-container">
      <header class="why-header">
        <span class="why-label">— POR QUÉ ELEGIR —</span>
        <h2 class="why-title">DISE<span class="highlight">F</span></h2>
        <p class="why-subtitle">Más de 20 años siendo aliados estratégicos de empresas, contratistas e ingenieros, ofreciendo soluciones eléctricas e industriales con calidad, respaldo y confianza.</p>
        <span class="why-title-line"></span>
      </header>

      <div class="why-grid">
        <div
          v-for="reason in reasons"
          :key="reason.id"
          class="why-card"
        >
          <div class="why-card-icon">
            <i :class="reason.icon" aria-hidden="true"></i>
          </div>
          <h3 class="why-card-title">{{ reason.title }}</h3>
          <p class="why-card-desc">{{ reason.description }}</p>
        </div>
      </div>

      <div class="why-badges">
        <div class="why-badge">
          <div class="why-badge-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div>
            <span class="badge-title">Más de 20 años</span>
            <span class="badge-text">de experiencia</span>
          </div>
        </div>
        <div class="why-badge-separator"></div>
        <div class="why-badge">
          <div class="why-badge-icon">
            <i class="fas fa-headset"></i>
          </div>
          <div>
            <span class="badge-title">Atención</span>
            <span class="badge-text">personalizada</span>
          </div>
        </div>
        <div class="why-badge-separator"></div>
        <div class="why-badge">
          <div class="why-badge-icon">
            <i class="fas fa-shield-halved"></i>
          </div>
          <div>
            <span class="badge-title">Soluciones para</span>
            <span class="badge-text">proyectos industriales</span>
          </div>
        </div>
        <div class="why-badge-separator"></div>
        <div class="why-badge">
          <div class="why-badge-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <div>
            <span class="badge-title">Respuesta rápida</span>
            <span class="badge-text">por WhatsApp</span>
          </div>
        </div>
      </div>

      <div class="why-cta">
        <div class="why-cta-left">
          <div class="why-cta-icon-circle">
            <i class="fas fa-headset"></i>
          </div>
          <div class="why-cta-text">
            <h4>¿Necesitas asesoría para tu proyecto?</h4>
            <p>Nuestro equipo está listo para ayudarte a seleccionar los productos adecuados para tus necesidades.</p>
          </div>
        </div>
        <div class="why-cta-right">
          <div class="why-cta-buttons">
            <a href="https://wa.me/573213727442" target="_blank" class="btn btn-yellow">
              <i class="fab fa-whatsapp"></i> Solicitar Cotización
            </a>
            <a href="tel:+573213727442" class="btn btn-outline">
              <i class="fas fa-phone"></i> Contactar un Asesor
            </a>
          </div>
          <img src="https://res.cloudinary.com/dlwzazojt/image/upload/v1784053605/WhatsApp_Image_2026-07-04_at_12.02.46_PM_1_sdgzrg.jpg" alt="Productos DISEF" class="why-cta-image" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Reason {
  id: string
  icon: string
  title: string
  description: string
}

const reasons = ref<Reason[]>([
  {
    id: '1',
    icon: 'fas fa-shield-halved',
    title: 'Productos\nCertificados',
    description: 'Equipos que cumplen normas nacionales e internacionales para garantizar seguridad, calidad y confiabilidad.'
  },
  {
    id: '2',
    icon: 'fas fa-hard-hat',
    title: 'Asesoría Técnica\nEspecializada',
    description: 'Nuestro equipo de expertos te acompañará para elegir la mejor solución según cada necesidad y proyecto.'
  },
  {
    id: '3',
    icon: 'fas fa-truck',
    title: 'Envíos a Todo\nColombia',
    description: 'Llegamos a todas las regiones del país con envíos rápidos, seguros y con seguimiento constante.'
  },
  {
    id: '4',
    icon: 'fas fa-award',
    title: 'Marcas\nLíderes',
    description: 'Distribuidores productos de fabricantes de primer nivel a nivel mundial como Schneider Electric, Honeywell, Fluke, Novax y más.'
  },
  {
    id: '5',
    icon: 'fas fa-city',
    title: 'Atención para\nEmpresas',
    description: 'Soluciones diseñadas para industrias, empresas, contratistas, ingenieros y profesionales del sector eléctrico.'
  },
  {
    id: '6',
    icon: 'fas fa-headset',
    title: 'Respaldo y\nSoporte',
    description: 'Te acompañamos antes, durante y después de tu compra, asegurando el éxito de cada proyecto.'
  }
])
</script>

<style scoped>
.why-section {
  width: 100%;
  padding: 50px 0 0;
  background: #111111;
  overflow: hidden;
  position: relative;
}

.why-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 350px;
  background: #FFC107;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  pointer-events: none;
  z-index: 0;
}

.why-container,
.why-header,
.why-grid,
.why-card,
.why-badges,
.why-badge,
.why-cta,
.why-cta-left,
.why-cta-right,
.why-cta-buttons,
.why-cta-image {
  position: relative;
  z-index: 1;
}

.why-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.why-header {
  text-align: center;
  margin-bottom: 50px;
}

.why-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #FFC107;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.why-title {
  margin: 0;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 900;
  color: #FFFFFF;
  letter-spacing: -0.5px;
  font-style: italic;
  text-transform: uppercase;
  line-height: 1;
}

.why-title .highlight {
  color: #FFC107;
}

.why-subtitle {
  margin: 18px auto 0;
  max-width: 600px;
  color: #888888;
  font-size: 15px;
  line-height: 1.7;
}

.why-title-line {
  display: block;
  width: 50px;
  height: 3px;
  background: #FFC107;
  border-radius: 2px;
  margin: 20px auto 0;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0;
  margin-bottom: 40px;
}

.why-card {
  text-align: center;
  padding: 36px 20px 40px;
  background: transparent;
  border-radius: 0;
  border: none;
  position: relative;
  transition: all 0.3s ease;
}

.why-card:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: 0;
  bottom: 20px;
  width: 1px;
  background: #2A2A2A;
}

.why-card:hover {
  background: rgba(255, 193, 7, 0.03);
}

.why-card-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.why-card-icon i {
  color: #FFC107;
  font-size: 36px;
}

.why-card-title {
  margin: 0 auto 10px;
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.4;
  white-space: pre-line;
  max-width: 140px;
}

.why-card-title::after {
  content: '';
  display: block;
  width: 30px;
  height: 2px;
  background: #FFC107;
  margin: 8px auto 0;
}

.why-card-desc {
  margin: 0;
  font-size: 12px;
  color: #777777;
  line-height: 1.6;
}

.why-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 24px 40px;
  border: 1px solid #FFC107;
  border-radius: 12px;
  margin: 0 auto 30px;
  background: transparent;
  max-width: 1100px;
}

.why-badge {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 28px;
}

.why-badge-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.why-badge-icon i {
  color: #FFC107;
  font-size: 16px;
}

.why-badge div {
  display: flex;
  flex-direction: column;
}

.badge-title {
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
}

.badge-text {
  font-size: 12px;
  color: #777777;
}

.why-badge-separator {
  width: 1px;
  height: 40px;
  background: #FFC107;
  flex-shrink: 0;
}

.why-cta {
  background: #1A1A1A;
  border: 1px solid #333333;
  border-radius: 12px;
  border-left: 4px solid #FFC107;
  padding: 0;
  display: flex;
  align-items: stretch;
  margin-bottom: 60px;
  overflow: hidden;
}

.why-cta-left {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px 32px;
  flex: 1;
}

.why-cta-icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.why-cta-icon-circle i {
  color: #FFC107;
  font-size: 24px;
}

.why-cta-text h4 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}

.why-cta-text p {
  margin: 0;
  font-size: 13px;
  color: #888888;
}

.why-cta-right {
  display: flex;
  align-items: center;
  gap: 0;
}

.why-cta-buttons {
  display: flex;
  gap: 12px;
  padding: 28px 24px;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  white-space: nowrap;
}

.btn-yellow {
  background: #FFC107;
  color: #111111;
}

.btn-yellow:hover {
  background: #E5AC00;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 1.5px solid #FFC107;
  color: #FFC107;
}

.btn-outline:hover {
  background: rgba(255, 193, 7, 0.1);
  transform: translateY(-2px);
}

.why-cta-image {
  height: 140px;
  width: auto;
  object-fit: contain;
  margin-right: -10px;
  align-self: flex-end;
}

@media (max-width: 1200px) {
  .why-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .why-card:nth-child(3)::after {
    display: none;
  }

  .why-badges {
    flex-wrap: wrap;
    gap: 20px;
    padding: 24px;
  }

  .why-badge-separator {
    display: none;
  }

  .why-badge {
    padding: 0 16px;
  }

  .why-cta {
    flex-direction: column;
  }

  .why-cta-right {
    flex-direction: column;
  }

  .why-cta-image {
    height: 120px;
    align-self: center;
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .why-section {
    padding: 60px 0 0;
  }

  .why-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .why-card:nth-child(2)::after {
    display: none;
  }

  .why-card {
    padding: 28px 16px 32px;
  }

  .why-cta-buttons {
    flex-direction: column;
    width: 100%;
    padding: 20px 24px;
  }

  .btn {
    justify-content: center;
    width: 100%;
  }

  .why-cta-left {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .why-grid {
    grid-template-columns: 1fr;
  }

  .why-card::after {
    display: none !important;
  }

  .why-badges {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
