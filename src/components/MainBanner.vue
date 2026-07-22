<template>
  <section class="esg-hero">
    <!-- Geometric decorative elements -->
    <div class="esg-hero__geo esg-hero__geo--1" aria-hidden="true"></div>
    <div class="esg-hero__geo esg-hero__geo--2" aria-hidden="true"></div>
    <div class="esg-hero__geo esg-hero__geo--3" aria-hidden="true"></div>

    <div class="esg-hero__container">
      <!-- LEFT: Content -->
      <div class="esg-hero__content">


        <p class="esg-hero__kicker">
          <span class="esg-hero__kicker-line" aria-hidden="true"></span>
          CONSULTORÍA ESPECIALIZADA
        </p>

        <h1 class="esg-hero__title">
          EXPERTOS EN <br />
          SISTEMAS DE<br />
          <span class="esg-hero__title-gold">GESTIÓN</span>
        </h1>

        <p class="esg-hero__description">
          Implementamos, fortalecemos y optimizamos Sistemas de Gestión para empresas y laboratorios, impulsando el cumplimiento de estándares, la eficiencia operativa y la mejora continua.
        </p>

        <blockquote class="esg-hero__quote">
          «Lo que no se puede medir no se puede controlar; lo que no se puede controlar no se puede gestionar; lo que no se puede gestionar no se puede mejorar.»
        </blockquote>



        <!-- CTA Buttons -->
        <div class="esg-hero__actions">
          <a href="#contacto" class="esg-hero__btn esg-hero__btn--primary">
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
            Solicitar asesoría
          </a>
          <a
            href="https://wa.me/573213727442"
            target="_blank"
            rel="noopener noreferrer"
            class="esg-hero__btn esg-hero__btn--secondary"
          >
            <i class="fab fa-whatsapp" aria-hidden="true"></i>
            Hablar por WhatsApp
          </a>
        </div>
      </div>

      <!-- RIGHT: Image -->
      <div class="esg-hero__visual">
        <div class="esg-hero__image-wrapper">
          <img
            src="https://res.cloudinary.com/dlwzazojt/image/upload/v1784583890/esg_yxcmsw.jpg"
            alt="Profesionales revisando tablet en laboratorio moderno"
            class="esg-hero__image"
            loading="eager"
          />
          <div class="esg-hero__image-overlay" aria-hidden="true"></div>
        </div>


      </div>
    </div>

    <!-- Bottom Value Propositions -->
    <div class="esg-hero__values-bar">
      <div class="esg-hero__values-container">
        <div class="esg-hero__value" v-for="val in values" :key="val.title">
          <div class="esg-hero__value-icon">
            <i :class="val.icon" aria-hidden="true"></i>
          </div>
          <div class="esg-hero__value-info">
            <strong class="esg-hero__value-title">{{ val.title }}</strong>
            <span class="esg-hero__value-desc">{{ val.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MainBanner'
})

const certifications = [
  {
    iso: 'ISO/IEC 17025',
    description: 'Laboratorios de ensayo y calibración',
    icon: 'fas fa-flask'
  },
  {
    iso: 'ISO 9001',
    description: 'Sistema de Gestión de Calidad',
    icon: 'fas fa-award'
  },
  {
    iso: 'ISO 45001',
    description: 'Seguridad y Salud en el Trabajo',
    icon: 'fas fa-hard-hat'
  },
  {
    iso: 'ISO 14001',
    description: 'Gestión Ambiental',
    icon: 'fas fa-leaf'
  }
]

const values = [
  { title: 'Crecimiento', description: 'Explotamos al máximo las capacidades de su organización', icon: 'fas fa-chart-line' },
  { title: 'Apoyo', description: 'Ponemos nuestra experiencia a su disposición', icon: 'fas fa-handshake' },
  { title: 'Misión', description: 'Acompañar como aliado estratégico en el logro de objetivos', icon: 'fas fa-gem' },
  { title: 'Flexibilidad', description: 'Nos ajustamos a sus necesidades', icon: 'fas fa-puzzle-piece' }
]
</script>

<style scoped>
/* ========================================
   ESG Premium Hero Banner
   Ultra realistic, Fortune 500 quality
   ======================================== */

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroSlideLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes heroSlideRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes heroFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes heroPulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes heroCountUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---- Hero Wrapper ---- */
.esg-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FAFAFA;
  overflow: hidden;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ---- Geometric Decorative Elements ---- */
.esg-hero__geo {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.esg-hero__geo--1 {
  top: 10%;
  left: -5%;
  width: 400px;
  height: 400px;
  border: 1px solid rgba(200, 155, 45, 0.08);
  border-radius: 50%;
  animation: heroPulse 6s ease-in-out infinite;
}

.esg-hero__geo--2 {
  bottom: 20%;
  right: -3%;
  width: 250px;
  height: 250px;
  border: 1px solid rgba(200, 155, 45, 0.06);
  transform: rotate(45deg);
  animation: heroPulse 8s ease-in-out infinite 1s;
}

.esg-hero__geo--3 {
  top: 60%;
  left: 45%;
  width: 120px;
  height: 120px;
  border: 1px solid rgba(200, 155, 45, 0.05);
  border-radius: 50%;
  animation: heroPulse 7s ease-in-out infinite 0.5s;
}

/* ---- Main Container ---- */
.esg-hero__container {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  flex: 1;
  align-items: stretch;
}

/* ---- Left Content ---- */
.esg-hero__content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 130px clamp(24px, 5vw, 80px);
  animation: heroSlideLeft 0.8s ease both;
}

/* Logo */
.esg-hero__logo {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.esg-hero__logo-img {
  height: 64px;
  width: auto;
  object-fit: contain;
}

/* Kicker */
.esg-hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #C89B2D;
  text-transform: uppercase;
  margin: 0;
}

.esg-hero__kicker-line {
  display: inline-block;
  width: 40px;
  height: 2px;
  background: #C89B2D;
  border-radius: 1px;
}

/* Title */
.esg-hero__title {
  margin: 0;
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.05;
  color: #1A1A1A;
  letter-spacing: -1.5px;
}

.esg-hero__title-gold {
  color: #C89B2D;
  display: inline-block;
}

/* Description */
.esg-hero__description {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
  color: #757575;
  max-width: 480px;
}

/* Quote */
.esg-hero__quote {
  margin: 0;
  padding: 16px 0 16px 20px;
  border-left: 3px solid #C89B2D;
  font-size: 13px;
  font-weight: 500;
  font-style: italic;
  line-height: 1.7;
  color: #9A9A9A;
  max-width: 480px;
}

.esg-hero__quote-author {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  font-style: normal;
  color: #C89B2D;
  letter-spacing: 0.5px;
}

/* ---- Certification Cards ---- */
.esg-hero__certifications {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.esg-hero__cert-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #ECECEC;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.esg-hero__cert-card:hover {
  border-color: rgba(200, 155, 45, 0.3);
  box-shadow: 0 4px 16px rgba(200, 155, 45, 0.08);
  transform: translateY(-2px);
}

.esg-hero__cert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(200, 155, 45, 0.08);
  flex-shrink: 0;
}

.esg-hero__cert-icon i {
  color: #C89B2D;
  font-size: 16px;
}

.esg-hero__cert-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.esg-hero__cert-iso {
  font-size: 12px;
  font-weight: 700;
  color: #4A4A4A;
  letter-spacing: 0.3px;
}

.esg-hero__cert-desc {
  font-size: 11px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.3;
}

/* ---- CTA Buttons ---- */
.esg-hero__actions {
  display: flex;
  gap: 14px;
  margin-top: 4px;
}

.esg-hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 28px;
  border-radius: 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  border: none;
  letter-spacing: 0.2px;
}

.esg-hero__btn--primary {
  background: #C89B2D;
  color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(200, 155, 45, 0.3);
}

.esg-hero__btn--primary:hover {
  background: #B8891F;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(200, 155, 45, 0.35);
}

.esg-hero__btn--secondary {
  background: transparent;
  color: #4A4A4A;
  border: 2px solid #4A4A4A;
}

.esg-hero__btn--secondary:hover {
  background: #4A4A4A;
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(74, 74, 74, 0.2);
}

/* ---- Right Visual ---- */
.esg-hero__visual {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  animation: heroSlideRight 0.8s ease both 0.2s;
}

.esg-hero__image-wrapper {
  position: relative;
  width: 100%;
  max-width: 560px;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
}

.esg-hero__image {
  width: 100%;
  height: 100%;
  min-height: 100%;
  object-fit: cover;
  display: block;
}

.esg-hero__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    #FAFAFA 0%,
    rgba(250, 250, 250, 0.85) 15%,
    rgba(250, 250, 250, 0.4) 35%,
    rgba(250, 250, 250, 0) 55%
  );
}

/* ---- Floating Card ---- */
.esg-hero__float-card {
  position: absolute;
  bottom: 40px;
  left: -30px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 22px 26px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.04);
  max-width: 320px;
  animation: heroFloat 5s ease-in-out infinite;
  z-index: 3;
}

.esg-hero__float-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(200, 155, 45, 0.1);
  flex-shrink: 0;
}

.esg-hero__float-icon i {
  color: #C89B2D;
  font-size: 18px;
}

.esg-hero__float-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.esg-hero__float-content strong {
  font-size: 14px;
  font-weight: 700;
  color: #1A1A1A;
  letter-spacing: 0.2px;
}

.esg-hero__float-content span {
  font-size: 13px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.5;
}

/* ---- Bottom Value Propositions ---- */
.esg-hero__values-bar {
  position: relative;
  z-index: 3;
  width: 100%;
  background: #1A1A1A;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;
}

.esg-hero__values-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 80px);
}

.esg-hero__value {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  animation: heroCountUp 0.6s ease both;
}

.esg-hero__value:last-child {
  border-right: none;
}

.esg-hero__value:nth-child(1) { animation-delay: 0.1s; }
.esg-hero__value:nth-child(2) { animation-delay: 0.2s; }
.esg-hero__value:nth-child(3) { animation-delay: 0.3s; }
.esg-hero__value:nth-child(4) { animation-delay: 0.4s; }

.esg-hero__value-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(200, 155, 45, 0.15);
  flex-shrink: 0;
}

.esg-hero__value-icon i {
  color: #C89B2D;
  font-size: 20px;
}

.esg-hero__value-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.esg-hero__value-title {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.esg-hero__value-desc {
  font-size: 13px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.4;
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

/* Tablet */
@media (max-width: 1200px) {
  .esg-hero__container {
    gap: 0;
  }

  .esg-hero__title {
    font-size: clamp(36px, 4.5vw, 52px);
  }

  .esg-hero__float-card {
    left: -20px;
    bottom: 30px;
  }
}

/* Mobile Landscape / Small Tablet */
@media (max-width: 992px) {
  .esg-hero__container {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .esg-hero__content {
    order: 1;
    text-align: center;
    align-items: center;
    padding: 40px clamp(24px, 5vw, 80px);
  }

  .esg-hero__kicker {
    justify-content: center;
  }

  .esg-hero__description {
    text-align: center;
  }

  .esg-hero__actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .esg-hero__visual {
    order: 0;
    width: 100%;
  }

  .esg-hero__image-wrapper {
    max-width: 100%;
    margin: 0 auto;
  }

  .esg-hero__image {
    height: 360px;
  }

  .esg-hero__float-card {
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    max-width: 300px;
  }

  .esg-hero__image-overlay {
    background: linear-gradient(
      to bottom,
      #FAFAFA 0%,
      rgba(250, 250, 250, 0.7) 15%,
      rgba(250, 250, 250, 0) 40%
    );
  }

  .esg-hero__values-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .esg-hero__value {
    border-right: none;
    border-bottom: 1px solid #ECECEC;
  }

  .esg-hero__value:nth-child(odd) {
    border-right: 1px solid #ECECEC;
  }
}

/* Mobile Portrait */
@media (max-width: 768px) {
  .esg-hero {
    min-height: auto;
  }

  .esg-hero__container {
    gap: 0;
  }

  .esg-hero__content {
    padding: 36px 20px 24px;
  }

  .esg-hero__title {
    font-size: clamp(28px, 7vw, 40px);
    letter-spacing: -1px;
  }

  .esg-hero__description {
    font-size: 15px;
  }

  .esg-hero__certifications {
    grid-template-columns: 1fr;
  }

  .esg-hero__actions {
    flex-direction: column;
    width: 100%;
  }

  .esg-hero__btn {
    width: 100%;
    justify-content: center;
  }

  .esg-hero__image {
    height: 300px;
  }

  .esg-hero__float-card {
    position: relative;
    left: 0;
    transform: none;
    bottom: auto;
    margin-top: -40px;
    margin-left: 20px;
    margin-right: 20px;
    max-width: none;
    animation: none;
  }

  .esg-hero__image-overlay {
    background: linear-gradient(
      to bottom,
      #FAFAFA 0%,
      rgba(250, 250, 250, 0.6) 20%,
      rgba(250, 250, 250, 0) 45%
    );
  }

  .esg-hero__values-container {
    grid-template-columns: 1fr;
  }

  .esg-hero__value {
    border-right: none;
    border-bottom: 1px solid #ECECEC;
    padding: 20px 24px;
  }

  .esg-hero__value:last-child {
    border-bottom: none;
  }

  .esg-hero__geo {
    display: none;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .esg-hero__container {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 28px;
  }

  .esg-hero__logo-img {
    height: 48px;
  }

  .esg-hero__title {
    font-size: clamp(24px, 8vw, 34px);
  }

  .esg-hero__cert-card {
    padding: 14px 16px;
  }

  .esg-hero__cert-icon {
    width: 36px;
    height: 36px;
  }

  .esg-hero__cert-icon i {
    font-size: 14px;
  }

  .esg-hero__value-title {
    font-size: 14px;
  }

  .esg-hero__value-desc {
    font-size: 12px;
  }
}
</style>
