<template>
  <section id="metodologia" class="methodology">
    <!-- Background image overlay -->
    <div class="methodology__bg" aria-hidden="true"></div>
    <div class="methodology__bg-overlay" aria-hidden="true"></div>

    <div class="methodology__container">
      <!-- LEFT: Content -->
      <div class="methodology__content">
        <p class="methodology__kicker">
          <span class="methodology__kicker-line" aria-hidden="true"></span>
          NUESTRA METODOLOGÍA
        </p>

        <h2 class="methodology__title">
          Un proceso claro,<br />
          estructurado y <span class="methodology__title-gold">efectivo</span>
        </h2>

        <p class="methodology__description">
          Aplicamos un enfoque integral que asegura resultados sostenibles y la mejora continua
          de su organización.
        </p>

      </div>

      <!-- RIGHT: Timeline -->
      <div class="methodology__timeline">
        <!-- Timeline connecting line -->
        <div class="methodology__timeline-line" aria-hidden="true"></div>

        <div
          class="methodology__step"
          v-for="step in steps"
          :key="step.number"
        >
          <div class="methodology__step-circle">
            <div class="methodology__step-icon">
              <i :class="step.icon" aria-hidden="true"></i>
            </div>
          </div>
          <span class="methodology__step-number">{{ step.number }}</span>
          <div class="methodology__step-info">
            <strong class="methodology__step-title">{{ step.title }}</strong>
            <span class="methodology__step-desc">{{ step.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MethodologySection'
})

const steps = [
  {
    number: '01',
    title: 'Entender',
    description: 'Comprendemos su organización, contexto, necesidades y objetivos.',
    icon: 'fas fa-search'
  },
  {
    number: '02',
    title: 'Diseñar',
    description: 'Diseñamos soluciones personalizadas y alineadas a los estándares.',
    icon: 'fas fa-pencil-ruler'
  },
  {
    number: '03',
    title: 'Ejecutar',
    description: 'Implementamos y acompañamos cada actividad del plan establecido.',
    icon: 'fas fa-cogs'
  },
  {
    number: '04',
    title: 'Resultados',
    description: 'Evaluamos y aseguramos el logro de los resultados esperados.',
    icon: 'fas fa-chart-bar'
  },
  {
    number: '05',
    title: 'Mejora continua',
    description: 'Promovemos la innovación y la mejora permanente para sostenir el éxito.',
    icon: 'fas fa-sync-alt'
  }
]
</script>

<style scoped>
/* ========================================
   Methodology Section - Premium Dark
   Exact match to reference design
   ======================================== */

@keyframes methLineGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* ---- Section Wrapper ---- */
.methodology {
  position: relative;
  width: 100%;
  padding: 50px 0;
  background: #1E1E1E;
  overflow: hidden;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ---- Background ---- */
.methodology__bg {
  position: absolute;
  inset: 0;
  background-image: url('https://www.tiqal.com/wp-content/uploads/2017/11/O6JTUC0-min.jpg');
  background-size: cover;
  background-position: center;
}

.methodology__bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    #1E1E1E 0%,
    #1E1E1E 25%,
    rgba(30, 30, 30, 0.85) 45%,
    rgba(30, 30, 30, 0.65) 70%,
    rgba(30, 30, 30, 0.5) 100%
  );
}

/* ---- Main Container ---- */
.methodology__container {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 60px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 80px);
  align-items: center;
}

/* ---- Left Content ---- */
.methodology__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Kicker */
.methodology__kicker {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #C89B2D;
  text-transform: uppercase;
  margin: 0;
}

.methodology__kicker-line {
  display: inline-block;
  width: 40px;
  height: 2px;
  background: #C89B2D;
  border-radius: 1px;
}

/* Title */
.methodology__title {
  margin: 0;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  line-height: 1.2;
  color: #FFFFFF;
  letter-spacing: -0.5px;
}

.methodology__title-gold {
  color: #C89B2D;
}

/* Description */
.methodology__description {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
  max-width: 360px;
}

/* CTA */
.methodology__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: transparent;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: fit-content;
}

.methodology__cta:hover {
  background: #C89B2D;
  border-color: #C89B2D;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200, 155, 45, 0.3);
}

.methodology__cta i {
  font-size: 11px;
  transition: transform 0.3s ease;
}

.methodology__cta:hover i {
  transform: translateX(4px);
}

/* ---- Timeline ---- */
.methodology__timeline {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-top: 10px;
}

.methodology__timeline-line {
  position: absolute;
  top: 44px;
  left: 40px;
  right: 40px;
  height: 2px;
  background: rgba(200, 155, 45, 0.3);
  transform-origin: left;
  animation: methLineGrow 1s ease both 0.3s;
}

/* ---- Step ---- */
.methodology__step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  position: relative;
}

.methodology__step-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.methodology__step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.methodology__step-icon i {
  font-size: 22px;
  color: #C89B2D;
}

.methodology__step-number {
  position: absolute;
  top: 56px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #C89B2D;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(200, 155, 45, 0.5);
  z-index: 3;
  letter-spacing: 0.5px;
}

.methodology__step-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 130px;
  margin-top: 12px;
}

.methodology__step-title {
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.3px;
}

.methodology__step-desc {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

/* Tablet */
@media (max-width: 1200px) {
  .methodology__container {
    gap: 40px;
  }

  .methodology__step-circle {
    width: 68px;
    height: 68px;
  }

  .methodology__step-icon i {
    font-size: 20px;
  }

  .methodology__timeline-line {
    top: 38px;
    left: 34px;
    right: 34px;
  }

  .methodology__step-number {
    top: 50px;
    width: 26px;
    height: 26px;
    font-size: 9px;
  }
}

/* Mobile Landscape / Small Tablet */
@media (max-width: 992px) {
  .methodology {
    padding: 60px 0;
  }

  .methodology__container {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .methodology__content {
    order: 1;
    text-align: center;
    align-items: center;
  }

  .methodology__kicker {
    justify-content: center;
  }

  .methodology__description {
    text-align: center;
  }

  .methodology__timeline {
    order: 2;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    padding-top: 0;
  }

  .methodology__timeline-line {
    display: none;
  }

  .methodology__step {
    flex: 0 0 calc(33.33% - 16px);
    min-width: 110px;
  }
}

/* Mobile Portrait */
@media (max-width: 768px) {
  .methodology {
    padding: 48px 0;
  }

  .methodology__title {
    font-size: clamp(22px, 5vw, 30px);
  }

  .methodology__step {
    flex: 0 0 calc(50% - 12px);
    min-width: 130px;
  }

  .methodology__step-circle {
    width: 60px;
    height: 60px;
  }

  .methodology__step-icon i {
    font-size: 18px;
  }

  .methodology__step-number {
    top: 44px;
    width: 24px;
    height: 24px;
    font-size: 9px;
  }

  .methodology__step-title {
    font-size: 12px;
  }

  .methodology__step-desc {
    font-size: 10px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .methodology {
    padding: 40px 0;
  }

  .methodology__step {
    flex: 0 0 100%;
    flex-direction: row;
    text-align: left;
    gap: 16px;
  }

  .methodology__step-circle {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
  }

  .methodology__step-number {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    width: 22px;
    height: 22px;
    font-size: 8px;
    margin-top: -12px;
    margin-left: -12px;
  }

  .methodology__step-info {
    max-width: none;
    margin-top: 0;
  }
}
</style>
