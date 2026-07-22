<template>
  <section class="purpose">
    <!-- Decorative elements -->
    <div class="purpose__deco purpose__deco--hex-1" aria-hidden="true"></div>
    <div class="purpose__deco purpose__deco--dot-1" aria-hidden="true"></div>
    <div class="purpose__deco purpose__deco--dot-2" aria-hidden="true"></div>

    <div class="purpose__container">
      <!-- LEFT: Image -->
      <div class="purpose__visual">
        <div class="purpose__image-wrapper">
          <img
            src="https://res.cloudinary.com/dlwzazojt/image/upload/v1784587269/WhatsApp_Image_2025-11-11_at_12.40.10_yccmqt.jpg"
            alt="Consultores revisando información en tablet dentro de laboratorio moderno"
            class="purpose__image"
            loading="lazy"
          />
          <div class="purpose__image-overlay" aria-hidden="true"></div>

          <!-- Floating card -->
          <div class="purpose__float-card">
            <div class="purpose__float-icon">
              <i class="fas fa-award" aria-hidden="true"></i>
            </div>
            <div class="purpose__float-content">
              <strong>Más de <span class="purpose__float-gold">15 años</span> transformando organizaciones</strong>
              <span>Experiencia, metodologías probadas y un enfoque práctico que garantiza el éxito de su proyecto.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Content -->
      <div class="purpose__content">
        <p class="purpose__kicker">
          <span class="purpose__kicker-line" aria-hidden="true"></span>
          NUESTRO PROPÓSITO
        </p>

        <h2 class="purpose__title">
          Generamos confianza,<br />
          calidad y resultados<br />
          que impulsan su <span class="purpose__title-gold">crecimiento</span>
        </h2>

        <p class="purpose__description">
          Acompañamos a empresas y laboratorios en cada etapa del ciclo de sus Sistemas
          de Gestión, desde el diagnóstico hasta la mejora continua, asegurando cumplimiento,
          eficiencia y sostenibilidad.
        </p>

        <!-- Value Cards -->
        <div class="purpose__cards">
          <div class="purpose__card" v-for="card in cards" :key="card.title">
            <div class="purpose__card-icon">
              <i :class="card.icon" aria-hidden="true"></i>
            </div>
            <strong class="purpose__card-title">{{ card.title }}</strong>
            <span class="purpose__card-desc">{{ card.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PurposeSection'
})

const cards = [
  {
    title: 'Enfoque estratégico',
    description: 'Analizamos su contexto y objetivos para diseñar soluciones alineadas a su visión.',
    icon: 'fas fa-bullseye'
  },
  {
    title: 'Expertos certificados',
    description: 'Contamos con un equipo altamente capacitado y con experiencia comprobada.',
    icon: 'fas fa-users'
  },
  {
    title: 'Resultados medibles',
    description: 'Implementamos soluciones que generan impacto real y mejora continua.',
    icon: 'fas fa-chart-bar'
  },
  {
    title: 'Compromiso y cercanía',
    description: 'Trabajamos como aliados estratégicos, acompañándolo en cada paso.',
    icon: 'fas fa-shield-alt'
  }
]
</script>

<style scoped>
/* ========================================
   Nuestro Propósito - Premium Section
   ======================================== */

@keyframes purposeFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes purposePulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

/* ---- Section Wrapper ---- */
.purpose {
  position: relative;
  width: 100%;
  padding: 0px 0;
  background: #F4F3F1;
  overflow: hidden;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ---- Decorative Elements ---- */
.purpose__deco {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.purpose__deco--hex-1 {
  top: 10%;
  right: 15%;
  width: 150px;
  height: 150px;
  border: 1px solid rgba(200, 155, 45, 0.08);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: purposePulse 8s ease-in-out infinite;
}

.purpose__deco--dot-1 {
  top: 30%;
  left: 8%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.15);
}

.purpose__deco--dot-2 {
  bottom: 25%;
  right: 10%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.12);
}

/* ---- Main Container ---- */
.purpose__container {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 0;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  align-items: stretch;
}

/* ---- Left Content ---- */
.purpose__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 50px 40px 50px clamp(24px, 5vw, 80px);
}

/* Kicker */
.purpose__kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #C89B2D;
  text-transform: uppercase;
  margin: 0;
}

.purpose__kicker-line {
  display: inline-block;
  width: 36px;
  height: 2px;
  background: #C89B2D;
  border-radius: 1px;
}

/* Title */
.purpose__title {
  margin: 0;
  font-size: clamp(24px, 2.8vw, 34px);
  font-weight: 800;
  line-height: 1.2;
  color: #3F3F3F;
  letter-spacing: -0.5px;
}

.purpose__title-gold {
  color: #C89B2D;
}

/* Description */
.purpose__description {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.7;
  color: #7A7A7A;
  max-width: 400px;
}

/* ---- Value Cards ---- */
.purpose__cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-top: 20px;
}

.purpose__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 36px 5px 32px;
  background: transparent;
  border-radius: 0;
  border: none;
  border-right: 1px solid #D8D5D0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.purpose__card:last-child {
  border-right: none;
}

.purpose__card:hover {
  background: rgba(255, 255, 255, 0.3);
}

.purpose__card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #EDEAE5;
  flex-shrink: 0;
}

.purpose__card-icon i {
  color: #C89B2D;
  font-size: 30px;
}

.purpose__card-title {
  font-size: 14px;
  font-weight: 700;
  color: #3F3F3F;
  letter-spacing: 0.2px;
}

.purpose__card-desc {
  font-size: 12px;
  font-weight: 400;
  color: #8A8A8A;
  line-height: 1.6;
  max-width: 180px;
}

/* ---- Right Visual ---- */
.purpose__visual {
  position: relative;
  display: flex;
  align-items: stretch;
}

.purpose__image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.purpose__image {
  width: 100%;
  height: 80%;
  min-height: 400px;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.purpose__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to left,
    #F4F3F1 0%,
    rgba(244, 243, 241, 0.98) 2%,
    rgba(244, 243, 241, 0.9) 8%,
    rgba(244, 243, 241, 0.7) 18%,
    rgba(244, 243, 241, 0.4) 30%,
    rgba(244, 243, 241, 0.15) 45%,
    transparent 60%
  );
}

/* ---- Floating Card ---- */
.purpose__float-card {
  position: absolute;
  bottom: 50px;
  left: 10px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 40px 24px;
  background: #1E1E1E;
  border-radius: 14px;
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.25),
    0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  animation: purposeFloat 6s ease-in-out infinite;
  z-index: 3;
}

.purpose__float-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(200, 155, 45, 0.2);
  flex-shrink: 0;
}

.purpose__float-icon i {
  color: #C89B2D;
  font-size: 18px;
}

.purpose__float-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.purpose__float-content strong {
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.2px;
  line-height: 1.4;
}

.purpose__float-gold {
  color: #C89B2D;
}

.purpose__float-content > span {
  font-size: 11.5px;
  font-weight: 400;
  color: #AAAAAA;
  line-height: 1.6;
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

/* Tablet */
@media (max-width: 1200px) {
  .purpose__float-card {
    right: 30px;
    bottom: 40px;
    max-width: 280px;
  }
}

/* Mobile Landscape / Small Tablet */
@media (max-width: 992px) {
  .purpose {
    padding: 80px 0;
  }

  .purpose__container {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .purpose__content {
    order: 2;
    text-align: center;
    align-items: center;
    padding: 48px clamp(24px, 5vw, 60px);
  }

  .purpose__kicker {
    justify-content: center;
  }

  .purpose__description {
    text-align: center;
  }

  .purpose__cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .purpose__card:nth-child(2n) {
    border-right: none;
  }

  .purpose__card:nth-last-child(-n+2) {
    border-bottom: none;
  }

  .purpose__visual {
    order: 1;
    width: 100%;
  }

  .purpose__image-wrapper {
    max-width: 100%;
  }

  .purpose__image {
    min-height: 260px;
  }

  .purpose__float-card {
    left: 20px;
    bottom: 20px;
    max-width: 280px;
  }

  .purpose__image-overlay {
    background: linear-gradient(
      to bottom,
      rgba(244, 243, 241, 0.9) 0%,
      rgba(244, 243, 241, 0.6) 20%,
      transparent 50%
    );
  }
}

/* Mobile Portrait */
@media (max-width: 768px) {
  .purpose {
    padding: 60px 0;
  }

  .purpose__title {
    font-size: clamp(22px, 6vw, 30px);
  }

  .purpose__cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
  }

  .purpose__card {
    padding: 26px 16px 24px;
    border-right: 1px solid #D8D5D0;
    border-bottom: 1px solid #D8D5D0;
  }

  .purpose__card:nth-child(2n) {
    border-right: none;
  }

  .purpose__card:nth-last-child(-n+2) {
    border-bottom: none;
  }

  .purpose__card-icon {
    width: 62px;
    height: 62px;
  }

  .purpose__card-icon i {
    font-size: 22px;
  }

  .purpose__image {
    min-height: 260px;
  }

  .purpose__float-card {
    position: relative;
    right: auto;
    bottom: auto;
    margin: -30px 20px 0;
    max-width: none;
    animation: none;
  }

  .purpose__deco {
    display: none;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .purpose {
    padding: 48px 0;
  }

  .purpose__cards {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .purpose__card {
    flex-direction: row;
    text-align: left;
    padding: 16px 18px;
    gap: 14px;
    border-right: none;
    border-bottom: 1px solid #D8D5D0;
  }

  .purpose__card:last-child {
    border-bottom: none;
  }

  .purpose__card-icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
  }

  .purpose__card-icon i {
    font-size: 16px;
  }

  .purpose__card-desc {
    max-width: none;
  }

  .purpose__float-card {
    flex-direction: column;
    margin: -20px 16px 0;
  }
}
</style>
