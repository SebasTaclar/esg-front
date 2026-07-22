<template>
  <section class="why-choose">
    <!-- Decorative elements -->
    <div class="why-choose__deco why-choose__deco--hex-1" aria-hidden="true"></div>
    <div class="why-choose__deco why-choose__deco--hex-2" aria-hidden="true"></div>
    <div class="why-choose__deco why-choose__deco--dot-1" aria-hidden="true"></div>
    <div class="why-choose__deco why-choose__deco--dot-2" aria-hidden="true"></div>
    <div class="why-choose__deco why-choose__deco--dot-3" aria-hidden="true"></div>

    <div class="why-choose__container">
      <!-- Header -->
      <div class="why-choose__header">
        <h2 class="why-choose__title">
          ¿POR QUÉ ELEGIR<br />
          ES GESTIÓN <span class="why-choose__title-gold">EMPRESARIAL</span>?
        </h2>
        <p class="why-choose__subtitle">
          Combinamos experiencia, metodología y compromiso<br />
          para generar resultados que impulsan su organización.
        </p>
      </div>

      <!-- Stats Row -->
      <div class="why-choose__stats">
        <div class="why-choose__stat" v-for="stat in stats" :key="stat.label">
          <div class="why-choose__stat-icon">
            <i :class="stat.icon" aria-hidden="true"></i>
          </div>
          <div class="why-choose__stat-info">
            <span class="why-choose__stat-number">{{ stat.number }}</span>
            <span class="why-choose__stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Benefits Row -->
      <div class="why-choose__benefits">
        <div class="why-choose__benefit" v-for="benefit in benefits" :key="benefit.title">
          <div class="why-choose__benefit-icon">
            <i :class="benefit.icon" aria-hidden="true"></i>
          </div>
          <h3 class="why-choose__benefit-title">{{ benefit.title }}</h3>
          <p class="why-choose__benefit-desc">{{ benefit.description }}</p>
        </div>
      </div>


    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'WhyChooseSection'
})

const stats = [
  { number: '+15', label: 'Años de experiencia', icon: 'fas fa-award' },
  { number: '+500', label: 'Proyectos ejecutados', icon: 'fas fa-briefcase' },
  { number: '+200', label: 'Clientes atendidos', icon: 'fas fa-users' },
  { number: '', label: 'Cobertura nacional', icon: 'fas fa-map-marker-alt' }
]

const benefits = [
  {
    title: 'Soluciones a la medida',
    description: 'Diseñamos estrategias adaptadas a las necesidades y objetivos de su organización.',
    icon: 'fas fa-bullseye'
  },
  {
    title: 'Acompañamiento integral',
    description: 'Estamos con usted en cada etapa del proceso, desde el diagnóstico hasta la mejora continua.',
    icon: 'fas fa-handshake'
  },
  {
    title: 'Enfoque en resultados',
    description: 'Generamos eficiencia, cumplimiento y valor para su negocio.',
    icon: 'fas fa-chart-line'
  },
  {
    title: 'Compromiso y confianza',
    description: 'Trabajamos con ética, transparencia y altos estándares de calidad.',
    icon: 'fas fa-shield-alt'
  }
]
</script>

<style scoped>
/* ========================================
   Why Choose Section - Premium
   ======================================== */

@keyframes whyChoosePulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

/* ---- Section Wrapper ---- */
.why-choose {
  position: relative;
  width: 100%;
  padding: 90px 0;
  background: #FAFAFA;
  overflow: hidden;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ---- Decorative Elements ---- */
.why-choose__deco {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.why-choose__deco--hex-1 {
  top: 10%;
  right: 8%;
  width: 140px;
  height: 140px;
  border: 1px solid rgba(200, 155, 45, 0.08);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: whyChoosePulse 8s ease-in-out infinite;
}

.why-choose__deco--hex-2 {
  bottom: 15%;
  left: 5%;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(200, 155, 45, 0.06);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: whyChoosePulse 10s ease-in-out infinite 1s;
}

.why-choose__deco--dot-1 {
  top: 20%;
  left: 10%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.15);
}

.why-choose__deco--dot-2 {
  top: 40%;
  right: 12%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.12);
}

.why-choose__deco--dot-3 {
  bottom: 25%;
  left: 15%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.1);
}

/* ---- Container ---- */
.why-choose__container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 80px);
}

/* ---- Header ---- */
.why-choose__header {
  text-align: center;
  margin-bottom: 50px;
}

.why-choose__title {
  margin: 0 0 18px;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  line-height: 1.2;
  color: #3F3F3F;
  letter-spacing: -0.5px;
}

.why-choose__title-gold {
  color: #C89B2D;
}

.why-choose__subtitle {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
  color: #6B6B6B;
}

/* ---- Stats Row ---- */
.why-choose__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.why-choose__stat {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #EBEBEB;
}

.why-choose__stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(200, 155, 45, 0.1);
  flex-shrink: 0;
}

.why-choose__stat-icon i {
  color: #C89B2D;
  font-size: 20px;
}

.why-choose__stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.why-choose__stat-number {
  font-size: 22px;
  font-weight: 800;
  color: #3F3F3F;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.why-choose__stat-label {
  font-size: 12px;
  font-weight: 500;
  color: #8A8A8A;
  line-height: 1.4;
}

/* ---- Benefits Row ---- */
.why-choose__benefits {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}

.why-choose__benefit {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px 24px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #EBEBEB;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.why-choose__benefit:hover {
  border-color: rgba(200, 155, 45, 0.3);
  box-shadow: 0 8px 32px rgba(200, 155, 45, 0.08);
  transform: translateY(-2px);
}

.why-choose__benefit-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.1);
  flex-shrink: 0;
}

.why-choose__benefit-icon i {
  color: #C89B2D;
  font-size: 18px;
}

.why-choose__benefit-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #3F3F3F;
  letter-spacing: 0.2px;
}

.why-choose__benefit-desc {
  margin: 0;
  font-size: 12.5px;
  font-weight: 400;
  color: #8A8A8A;
  line-height: 1.6;
}

/* ---- Bottom CTA ---- */
.why-choose__bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #EBEBEB;
}

.why-choose__bottom-image {
  position: relative;
  overflow: hidden;
}

.why-choose__bottom-img {
  width: 100%;
  height: 100%;
  min-height: 300px;
  object-fit: cover;
  display: block;
}

.why-choose__bottom-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.why-choose__bottom-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.why-choose__bottom-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.1);
}

.why-choose__bottom-icon i {
  color: #C89B2D;
  font-size: 22px;
}

.why-choose__bottom-title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #3F3F3F;
  line-height: 1.25;
}

.why-choose__bottom-gold {
  color: #C89B2D;
}

.why-choose__bottom-desc {
  margin: 0;
  font-size: 13.5px;
  font-weight: 400;
  color: #6B6B6B;
  line-height: 1.7;
}

.why-choose__bottom-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: #C89B2D;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  align-self: flex-start;
}

.why-choose__bottom-btn:hover {
  background: #D4A82F;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200, 155, 45, 0.3);
}

.why-choose__bottom-btn i {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.why-choose__bottom-btn:hover i {
  transform: translateX(3px);
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

/* Tablet */
@media (max-width: 1200px) {
  .why-choose__stats,
  .why-choose__benefits {
    gap: 16px;
  }
}

/* Mobile Landscape / Small Tablet */
@media (max-width: 992px) {
  .why-choose {
    padding: 70px 0;
  }

  .why-choose__stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .why-choose__benefits {
    grid-template-columns: repeat(2, 1fr);
  }

  .why-choose__bottom {
    grid-template-columns: 1fr;
  }

  .why-choose__bottom-image {
    order: 1;
  }

  .why-choose__bottom-content {
    order: 2;
    padding: 32px;
  }
}

/* Mobile Portrait */
@media (max-width: 768px) {
  .why-choose {
    padding: 60px 0;
  }

  .why-choose__title {
    font-size: clamp(24px, 6vw, 30px);
  }

  .why-choose__stats {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .why-choose__stat {
    padding: 20px 18px;
  }

  .why-choose__benefits {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .why-choose__benefit {
    padding: 24px 20px;
  }

  .why-choose__bottom-img {
    min-height: 220px;
  }

  .why-choose__bottom-content {
    padding: 28px 24px;
  }

  .why-choose__bottom-title {
    font-size: 20px;
  }

  .why-choose__deco {
    display: none;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .why-choose {
    padding: 48px 0;
  }

  .why-choose__stat-icon {
    width: 46px;
    height: 46px;
  }

  .why-choose__stat-icon i {
    font-size: 18px;
  }

  .why-choose__stat-number {
    font-size: 20px;
  }

  .why-choose__benefit-icon {
    width: 44px;
    height: 44px;
  }

  .why-choose__benefit-icon i {
    font-size: 16px;
  }
}
</style>
