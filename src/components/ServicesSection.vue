<template>
  <section class="services">
    <!-- Decorative elements -->
    <div class="services__deco services__deco--hex-1" aria-hidden="true"></div>
    <div class="services__deco services__deco--hex-2" aria-hidden="true"></div>
    <div class="services__deco services__deco--dot-1" aria-hidden="true"></div>
    <div class="services__deco services__deco--dot-2" aria-hidden="true"></div>

    <div class="services__container">
      <!-- Header -->
      <div class="services__header">
        <p class="services__kicker">
          <span class="services__kicker-line" aria-hidden="true"></span>
          NUESTROS SERVICIOS
          <span class="services__kicker-line" aria-hidden="true"></span>
        </p>

        <h2 class="services__title">
          Soluciones que fortalecen<br />
          su <span class="services__title-gold">organización</span>
        </h2>

        <p class="services__description">
          Acompañamos a empresas y laboratorios con servicios especializados para
          implementar, fortalecer y optimizar sus Sistemas de Gestión, impulsando
          el cumplimiento normativo y la mejora continua.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="services__grid">
        <div
          class="services__card"
          v-for="service in services"
          :key="service.title"
        >
          <div class="services__card-header">
            <div class="services__card-icon">
              <i :class="service.icon" aria-hidden="true"></i>
            </div>
            <h3 class="services__card-title">{{ service.title }}</h3>
          </div>
          <p class="services__card-desc">{{ service.description }}</p>
          <a href="#" class="services__card-link">
            Conocer más <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>

      <!-- Centered last card -->
      <div class="services__centered-wrapper">
        <div class="services__card services__card--centered">
          <div class="services__card-header">
            <div class="services__card-icon">
              <i class="fas fa-user-tie" aria-hidden="true"></i>
            </div>
            <h3 class="services__card-title">Administración In House</h3>
          </div>
          <p class="services__card-desc">
            Integramos un profesional ESG dentro de su organización
            para acompañar la gestión de forma permanente.
          </p>
          <a href="#" class="services__card-link">
            Conocer más <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Premium CTA Banner -->
    <div class="services__cta-wrapper">
      <div class="services__cta-banner">
        <!-- Background image -->
        <div class="services__cta-bg" aria-hidden="true"></div>
        <div class="services__cta-overlay" aria-hidden="true"></div>

        <!-- Content -->
        <div class="services__cta-content">
          <!-- Left -->
          <div class="services__cta-left">
            <div class="services__cta-icon">
              <i class="fas fa-shield-alt" aria-hidden="true"></i>
            </div>
            <div class="services__cta-text">
              <h3 class="services__cta-title">
                Más que consultores,<br />
                somos <span class="services__cta-gold">aliados estratégicos</span>
              </h3>
              <p class="services__cta-desc">
                Acompañamos a nuestros clientes en cada etapa para fortalecer
                sus procesos, optimizar su gestión y convertir el cumplimiento
                normativo en una ventaja competitiva.
              </p>
            </div>
          </div>

          <!-- Right -->
          <div class="services__cta-right">
            <div class="services__cta-features">
              <div class="services__cta-feature">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>Soluciones a la medida</span>
              </div>
              <div class="services__cta-feature">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>Enfoque en resultados</span>
              </div>
              <div class="services__cta-feature">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>Experiencia y compromiso</span>
              </div>
              <div class="services__cta-feature">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>Acompañamiento continuo</span>
              </div>
            </div>

            <a href="#" class="services__cta-btn">
              Solicitar asesoría
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ServicesSection'
})

const services = [
  {
    title: 'Consultoría',
    description: 'Diseñamos e implementamos Sistemas de Gestión adaptados a su organización.',
    icon: 'fas fa-building'
  },
  {
    title: 'Auditorías',
    description: 'Evaluamos la eficacia de su Sistema de Gestión y preparamos su organización para auditorías internas y externas.',
    icon: 'fas fa-clipboard-check'
  },
  {
    title: 'Gestión del SG',
    description: 'Fortalecemos y optimizamos Sistemas de Gestión existentes para mejorar su desempeño.',
    icon: 'fas fa-cogs'
  },
  {
    title: 'Formación',
    description: 'Capacitamos a su equipo en normativas, metodologías y buenas prácticas.',
    icon: 'fas fa-graduation-cap'
  },
  {
    title: 'Gestión de proyectos',
    description: 'Planificamos y acompañamos proyectos de implementación y mejora continua.',
    icon: 'fas fa-project-diagram'
  },
  {
    title: 'Supervisión de personal',
    description: 'Acompañamos técnicamente a su equipo para asegurar el cumplimiento de los procesos.',
    icon: 'fas fa-users-cog'
  },
  {
    title: 'Gestión de proveedores',
    description: 'Fortalecemos los procesos de evaluación, selección y control de proveedores.',
    icon: 'fas fa-handshake'
  },
  {
    title: 'Gestión metrológica',
    description: 'Desarrollamos programas de calibración, aseguramiento metrológico y trazabilidad.',
    icon: 'fas fa-ruler-combined'
  }
]
</script>

<style scoped>
/* ========================================
   Services Section - Premium
   ======================================== */

@keyframes servicesPulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

/* ---- Section Wrapper ---- */
.services {
  position: relative;
  width: 100%;
  padding: 70px 0 0;
  background: #FFFFFF;
  overflow: hidden;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ---- Decorative Elements ---- */
.services__deco {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.services__deco--hex-1 {
  top: 8%;
  left: 5%;
  width: 140px;
  height: 140px;
  border: 1px solid rgba(200, 155, 45, 0.08);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: servicesPulse 8s ease-in-out infinite;
}

.services__deco--hex-2 {
  bottom: 20%;
  right: 8%;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(200, 155, 45, 0.06);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: servicesPulse 10s ease-in-out infinite 1s;
}

.services__deco--dot-1 {
  top: 20%;
  right: 12%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.15);
}

.services__deco--dot-2 {
  bottom: 30%;
  left: 8%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.12);
}

/* ---- Container ---- */
.services__container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(24px, vw, 80px);
}

/* ---- Header ---- */
.services__header {
  text-align: center;
  margin-bottom: 30px;
}

.services__kicker {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #C89B2D;
  text-transform: uppercase;
  margin: 0 0 20px;
}

.services__kicker-line {
  display: inline-block;
  width: 30px;
  height: 2px;
  background: #C89B2D;
  border-radius: 1px;
}

.services__title {
  margin: 0 0 18px;
  font-size: clamp(28px, 3.2vw, 38px);
  font-weight: 800;
  line-height: 1.2;
  color: #3F3F3F;
  letter-spacing: -0.5px;
}

.services__title-gold {
  color: #C89B2D;
}

.services__description {
  margin: 0 auto;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
  color: #6B6B6B;
  max-width: 600px;
}

/* ---- Services Grid ---- */
.services__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 0;
}

.services__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 24px 20px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #EBEBEB;
  border-bottom: 3px solid #C89B2D;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.services__card:hover {
  border-color: rgba(200, 155, 45, 0.3);
  border-bottom-color: #C89B2D;
  box-shadow: 0 8px 32px rgba(200, 155, 45, 0.08);
  transform: translateY(-2px);
}

.services__card-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.services__card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: rgba(200, 155, 45, 0.1);
  flex-shrink: 0;
}

.services__card-icon i {
  color: #C89B2D;
  font-size: 19px;
}

.services__card-title {
  margin: 0;
  font-size: 14.5px;
  font-weight: 700;
  color: #3F3F3F;
  letter-spacing: 0.2px;
}

.services__card-desc {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #8A8A8A;
  line-height: 1.55;
  flex: 1;
}

.services__card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: #C89B2D;
  text-decoration: none;
  transition: gap 0.3s ease;
  margin-top: 2px;
}

.services__card-link:hover {
  gap: 12px;
}

.services__card-link i {
  font-size: 10px;
  transition: transform 0.3s ease;
}

.services__card-link:hover i {
  transform: translateX(2px);
}

/* Centered Card Wrapper */
.services__centered-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.services__card--centered {
  max-width: 820px;
  width: 100%;
  border: 1px solid #EBEBEB;
  border-bottom: 3px solid #C89B2D;
  background: #FFFFFF;
  text-align: center;
  align-items: center;
}

.services__card--centered .services__card-header {
  justify-content: center;
}

.services__card--centered .services__card-link {
  justify-content: center;
}

/* ---- Premium CTA Banner ---- */
.services__cta-wrapper {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px clamp(24px, 3vw, 20px);
}

.services__cta-banner {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #1A1A1A;
}

.services__cta-bg {
  position: absolute;
  inset: 0;
  background-image: url('https://www.csrconsulting.com.mx/wp-content/uploads/2023/06/collage-control-calidad-estandar-1-1024x683.jpg');
  background-size: cover;
  background-position: center right;
  opacity: 0.3;
}

.services__cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(26, 26, 26, 1) 0%,
    rgba(26, 26, 26, 0.98) 30%,
    rgba(26, 26, 26, 0.92) 50%,
    rgba(26, 26, 26, 0.7) 70%,
    rgba(26, 26, 26, 0.4) 100%
  );
}

.services__cta-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 48px 56px;
}

/* Left */
.services__cta-left {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
}

.services__cta-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.15);
  flex-shrink: 0;
}

.services__cta-icon i {
  color: #C89B2D;
  font-size: 24px;
}

.services__cta-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.services__cta-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.35;
}

.services__cta-gold {
  color: #C89B2D;
}

.services__cta-desc {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  color: #AAAAAA;
  line-height: 1.7;
  max-width: 440px;
}

/* Right */
.services__cta-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
}

.services__cta-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 36px;
}

.services__cta-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #FFFFFF;
}

.services__cta-feature i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.15);
  color: #C89B2D;
  font-size: 9px;
  flex-shrink: 0;
}

.services__cta-btn {
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
}

.services__cta-btn:hover {
  background: #D4A82F;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200, 155, 45, 0.35);
}

.services__cta-btn i {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.services__cta-btn:hover i {
  transform: translateX(3px);
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

/* Tablet */
@media (max-width: 1200px) {
  .services__grid {
    gap: 16px;
  }

  .services__card {
    padding: 24px 20px;
  }
}

/* Mobile Landscape / Small Tablet */
@media (max-width: 992px) {
  .services {
    padding: 70px 0 0;
  }

  .services__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .services__centered-wrapper {
    margin-top: 16px;
  }

  .services__card--centered {
    max-width: none;
  }

  .services__cta-wrapper {
    padding: 60px clamp(24px, 5vw, 60px);
  }

  .services__cta-content {
    flex-direction: column;
    text-align: center;
    padding: 40px 36px;
    gap: 32px;
  }

  .services__cta-left {
    flex-direction: column;
    align-items: center;
  }

  .services__cta-right {
    align-items: center;
    width: 100%;
  }

  .services__cta-features {
    justify-items: center;
  }
}

/* Mobile Portrait */
@media (max-width: 768px) {
  .services {
    padding: 60px 0 0;
  }

  .services__title {
    font-size: clamp(24px, 6vw, 32px);
  }

  .services__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .services__card {
    padding: 22px 20px;
  }

  .services__cta-wrapper {
    padding: 48px clamp(24px, 5vw, 32px);
  }

  .services__cta-content {
    padding: 32px 24px;
  }

  .services__cta-title {
    font-size: 19px;
  }

  .services__cta-features {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .services__deco {
    display: none;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .services {
    padding: 48px 0 0;
  }

  .services__card-icon {
    width: 42px;
    height: 42px;
  }

  .services__card-icon i {
    font-size: 18px;
  }

  .services__cta-icon {
    width: 50px;
    height: 50px;
  }

  .services__cta-icon i {
    font-size: 20px;
  }

  .services__cta-btn {
    padding: 12px 24px;
    font-size: 13px;
  }
}
</style>
