<template>
  <main class="servicios-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <span class="hero-label">SERVICIOS</span>
          <h1 class="hero-title">
            Soluciones que fortalecen su <span class="highlight">organización</span>
          </h1>
          <p class="hero-desc">
            Acompañamos a empresas, laboratorios y organismos evaluadores de la conformidad mediante soluciones especializadas que impulsan la eficiencia, el cumplimiento normativo y la mejora continua.
          </p>
          <div class="hero-badges">
            <span class="badge"><i class="fas fa-check"></i> Más de 15 años de experiencia</span>
            <span class="badge"><i class="fas fa-check"></i> Soluciones a la medida</span>
            <span class="badge"><i class="fas fa-check"></i> Acompañamiento integral</span>
            <span class="badge"><i class="fas fa-check"></i> Enfoque en resultados</span>
          </div>
          <a href="/#contacto" class="btn-primary">Solicitar asesoría <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="hero-image">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=900&fit=crop&q=80"
            alt="Consultores revisando documentación en laboratorio moderno"
          />
          <div class="hero-image-overlay"></div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services">
      <div class="services-container">
        <div class="section-header">
          <div class="header-line"></div>
          <h2 class="section-title">NUESTROS <span class="highlight">SERVICIOS</span></h2>
          <p class="section-subtitle">Soluciones integrales para cada etapa de su organización</p>
        </div>

        <div class="services-grid">
          <div
            v-for="service in services"
            :key="service.id"
            class="service-card"
          >
            <div class="service-card-gold-line"></div>
            <div class="service-icon">
              <i :class="service.icon"></i>
            </div>
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-desc">{{ service.description }}</p>
            <div class="service-hover-content">
              <p class="service-summary">{{ service.summary }}</p>
              <a :href="`https://wa.me/573242899188?text=${encodeURIComponent(`Hola, cordial saludo.\n\nMe interesa el servicio de *${service.name}*.\n\n¿Podrían enviarme información detallada, alcances, tiempos de ejecución y costos?\n\nQuedo atento(a).`)}`" target="_blank" class="service-btn">Solicitar asesoría <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA Section -->
    <section class="bottom-cta">
      <div class="bottom-cta-container">
        <div class="bottom-cta-image">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=700&fit=crop&q=80"
            alt="Equipo ESG reunido en ambiente corporativo"
          />
        </div>
        <div class="bottom-cta-content">
          <h2 class="bottom-cta-title">
            Más que consultores, somos <span class="highlight">aliados estratégicos</span>.
          </h2>
          <p class="bottom-cta-text">
            Trabajamos junto a nuestros clientes para fortalecer sus procesos, optimizar su gestión y convertir el cumplimiento normativo en una ventaja competitiva.
          </p>
          <div class="bottom-cta-benefits">
            <div class="benefit">
              <i class="fas fa-check-circle"></i>
              <span>Atención personalizada</span>
            </div>
            <div class="benefit">
              <i class="fas fa-check-circle"></i>
              <span>Equipo multidisciplinario</span>
            </div>
            <div class="benefit">
              <i class="fas fa-check-circle"></i>
              <span>Cobertura nacional</span>
            </div>
            <div class="benefit">
              <i class="fas fa-check-circle"></i>
              <span>Resultados sostenibles</span>
            </div>
          </div>
          <a href="/#contacto" class="btn-primary">Solicitar asesoría <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </section>

    <!-- Trust Strip -->
    <section class="trust-strip">
      <div class="trust-container">
        <div class="trust-item">
          <div class="trust-icon"><i class="fas fa-shield-halved"></i></div>
          <span class="trust-label">Calidad y confianza</span>
        </div>
        <div class="trust-divider"></div>
        <div class="trust-item">
          <div class="trust-icon"><i class="fas fa-trophy"></i></div>
          <span class="trust-label">Experiencia comprobada</span>
        </div>
        <div class="trust-divider"></div>
        <div class="trust-item">
          <div class="trust-icon"><i class="fas fa-handshake"></i></div>
          <span class="trust-label">Aliados estratégicos</span>
        </div>
        <div class="trust-divider"></div>
        <div class="trust-item">
          <div class="trust-icon"><i class="fas fa-earth-americas"></i></div>
          <span class="trust-label">Cobertura nacional</span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ServiciosView'
})

const services = [
  {
    id: 1,
    name: 'Consultoría',
    icon: 'fas fa-building',
    description: 'Diseño e implementación de Sistemas de Gestión adaptados a cada organización.',
    summary: 'Desarrollamos sistemas de gestión personalizados que se alinean con los objetivos estratégicos de su empresa, asegurando cumplimiento normativo y eficiencia operativa.'
  },
  {
    id: 2,
    name: 'Auditorías',
    icon: 'fas fa-clipboard-check',
    description: 'Auditorías diagnósticas, internas, de segunda parte y de preparación.',
    summary: 'Realizamos auditorías rigurosas que identifican oportunidades de mejora y garantizan el cumplimiento de los estándares internacionales.'
  },
  {
    id: 3,
    name: 'Gestión del SG',
    icon: 'fas fa-cogs',
    description: 'Mantenimiento, fortalecimiento y mejora continua de Sistemas de Gestión.',
    summary: 'Acompañamos el ciclo de vida de su sistema de gestión para asegurar su efectividad y evolución continua.'
  },
  {
    id: 4,
    name: 'Formaciones',
    icon: 'fas fa-graduation-cap',
    description: 'Capacitación especializada en normas internacionales y buenas prácticas.',
    summary: 'Programas de formación diseñados para fortalecer las competencias de su equipo en áreas críticas de gestión.'
  },
  {
    id: 5,
    name: 'Gestión de Proyectos',
    icon: 'fas fa-chart-line',
    description: 'Planeación y ejecución de proyectos estratégicos de implementación.',
    summary: 'Lideramos proyectos de transformación digital y optimización de procesos con resultados medibles.'
  },
  {
    id: 6,
    name: 'Supervisión de Personal',
    icon: 'fas fa-users',
    description: 'Acompañamiento técnico para fortalecer la operación.',
    summary: 'Brindamos supervisión especializada para ensure que su equipo operativo cumpla con los estándares de calidad.'
  },
  {
    id: 7,
    name: 'Gestión de Proveedores',
    icon: 'fas fa-handshake',
    description: 'Evaluación y desarrollo de proveedores.',
    summary: 'Implementamos procesos de evaluación y desarrollo que fortalecen la cadena de suministro de su organización.'
  },
  {
    id: 8,
    name: 'Gestión Metrológica',
    icon: 'fas fa-ruler-combined',
    description: 'Aseguramiento metrológico y trazabilidad de equipos.',
    summary: 'Garantizamos la trazabilidad y calibración de sus equipos de medición conforme a normas internacionales.'
  },
  {
    id: 9,
    name: 'Administración In House',
    icon: 'fas fa-user-tie',
    description: 'Un consultor ESG trabajando directamente dentro de la organización.',
    summary: 'Nuestro equipo se integra a su organización para liderar la gestión interna con un enfoque de excelencia.'
  }
]
</script>

<style scoped>
.servicios-page {
  background: #FAFAF8;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===========================
   HERO SECTION
   =========================== */
.hero {
  padding: 120px 0 0;
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
  padding: 40px 0 60px;
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

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 36px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  color: #2F2F2F;
  transition: all 0.3s ease;
}

.badge i {
  color: #C89B2D;
  font-size: 12px;
}

.badge:hover {
  border-color: rgba(200, 155, 45, 0.3);
  box-shadow: 0 2px 12px rgba(200, 155, 45, 0.1);
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

.hero-image {
  position: relative;
  height: 520px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(200, 155, 45, 0.08) 0%, transparent 60%);
  pointer-events: none;
}

/* ===========================
   SERVICES SECTION
   =========================== */
.services {
  padding: 80px 0 100px;
  background: #FAFAF8;
}

.services-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.header-line {
  width: 40px;
  height: 4px;
  background: #C89B2D;
  margin: 0 auto 20px;
  border-radius: 2px;
}

.section-title {
  margin: 0 0 12px;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  color: #2F2F2F;
  letter-spacing: 1px;
}

.section-title .highlight {
  color: #C89B2D;
}

.section-subtitle {
  margin: 0;
  font-size: 16px;
  color: #888888;
  font-weight: 400;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.service-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 40px 32px 36px;
  border: 1px solid #F0F0F0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  cursor: default;
}

.service-card-gold-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #C89B2D;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04);
  border-color: transparent;
}

.service-card:hover .service-card-gold-line {
  transform: scaleX(1);
}

.service-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(200, 155, 45, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.service-icon i {
  font-size: 24px;
  color: #C89B2D;
  transition: transform 0.3s ease;
}

.service-card:hover .service-icon {
  background: #C89B2D;
  transform: scale(1.05);
}

.service-card:hover .service-icon i {
  color: #FFFFFF;
  transform: scale(1.1);
}

.service-name {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: #2F2F2F;
  line-height: 1.3;
}

.service-desc {
  margin: 0;
  font-size: 14px;
  color: #888888;
  line-height: 1.6;
}

.service-hover-content {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0;
}

.service-card:hover .service-hover-content {
  opacity: 1;
  max-height: 200px;
  margin-top: 20px;
}

.service-summary {
  margin: 0 0 16px;
  font-size: 13px;
  color: #6B6B6B;
  line-height: 1.7;
  padding-top: 16px;
  border-top: 1px solid #F0F0F0;
}

.service-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: #C89B2D;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
}

.service-btn:hover {
  background: #B8891F;
  transform: translateX(4px);
}

.service-btn i {
  font-size: 11px;
  transition: transform 0.3s ease;
}

.service-btn:hover i {
  transform: translateX(3px);
}

/* ===========================
   BOTTOM CTA SECTION
   =========================== */
.bottom-cta {
  padding: 0 0 100px;
  background: #FAFAF8;
}

.bottom-cta-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.bottom-cta-image {
  height: 480px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.bottom-cta-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.bottom-cta-content {
  padding: 20px 0;
}

.bottom-cta-title {
  margin: 0 0 20px;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  color: #2F2F2F;
  line-height: 1.3;
}

.bottom-cta-title .highlight {
  color: #C89B2D;
}

.bottom-cta-text {
  margin: 0 0 32px;
  font-size: 16px;
  color: #6B6B6B;
  line-height: 1.8;
}

.bottom-cta-benefits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 36px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2F2F2F;
}

.benefit i {
  color: #C89B2D;
  font-size: 16px;
  flex-shrink: 0;
}

/* ===========================
   TRUST STRIP
   =========================== */
.trust-strip {
  padding: 48px 0;
  background: #FFFFFF;
  border-top: 1px solid #F0F0F0;
  border-bottom: 1px solid #F0F0F0;
}

.trust-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 32px;
  flex: 1;
  justify-content: center;
}

.trust-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trust-icon i {
  font-size: 20px;
  color: #C89B2D;
}

.trust-label {
  font-size: 14px;
  font-weight: 600;
  color: #2F2F2F;
  white-space: nowrap;
}

.trust-divider {
  width: 1px;
  height: 40px;
  background: #E8E8E8;
  flex-shrink: 0;
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
    padding: 40px 0 20px;
    text-align: center;
  }

  .hero-badges {
    justify-content: center;
  }

  .hero-image {
    height: 400px;
    order: -1;
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bottom-cta-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .bottom-cta-image {
    height: 360px;
    order: -1;
  }

  .bottom-cta-content {
    text-align: center;
  }

  .bottom-cta-benefits {
    justify-items: center;
  }

  .trust-container {
    flex-wrap: wrap;
    gap: 20px;
  }

  .trust-divider {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 0 0;
  }

  .hero-image {
    height: 320px;
  }

  .services {
    padding: 60px 0 80px;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .service-card {
    padding: 32px 28px 28px;
  }

  .bottom-cta {
    padding: 0 0 80px;
  }

  .bottom-cta-image {
    height: 280px;
  }

  .bottom-cta-benefits {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .trust-item {
    flex: 0 0 calc(50% - 10px);
    padding: 12px 16px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 26px;
  }

  .hero-badges {
    flex-direction: column;
    align-items: stretch;
  }

  .badge {
    justify-content: center;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .section-title {
    font-size: 22px;
  }

  .service-card {
    padding: 28px 24px 24px;
  }

  .service-icon {
    width: 48px;
    height: 48px;
  }

  .service-icon i {
    font-size: 20px;
  }

  .trust-item {
    flex: 0 0 100%;
  }

  .trust-strip {
    padding: 32px 0;
  }
}
</style>
