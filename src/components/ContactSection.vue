<template>
  <section class="contact-section">
    <div class="contact-container">
      <!-- Header -->
      <header class="contact-header">
        <span class="contact-label">— CONTÁCTANOS —</span>
        <h2 class="contact-title">¿HABLAMOS DE <span class="highlight">TU PROYECTO</span>?</h2>
      </header>

      <!-- Main Content -->
      <div class="contact-main">
        <!-- Left Side -->
        <div class="contact-left">
          <p class="contact-text">Estamos listos para ayudarte a encontrar la mejor solución eléctrica e industrial. <strong>¡Hablemos!</strong></p>

          <div class="contact-whatsapp">
            <div class="whatsapp-icon">
              <i class="fab fa-whatsapp"></i>
            </div>
            <div class="whatsapp-info">
              <span class="whatsapp-title">¿Necesitas ayuda ahora?</span>
              <span class="whatsapp-text">Escríbenos por WhatsApp y te respondemos rápido.</span>
            </div>
          </div>

          <a href="https://wa.me/573213727442" target="_blank" class="btn-whatsapp">
            <i class="fab fa-whatsapp"></i> ESCRÍBENOS POR WHATSAPP <i class="fas fa-arrow-right"></i>
          </a>

          <!-- Features Grid -->
          <div class="contact-features">
            <div class="feature-box">
              <i class="fas fa-headset"></i>
              <span class="feature-title">ASESORÍA ESPECIALIZADA</span>
              <span class="feature-text">Te asesoramos para seleccionar los productos adecuados para tu proyecto con el respaldo de expertos.</span>
            </div>
            <div class="feature-box">
              <i class="fas fa-bolt"></i>
              <span class="feature-title">RESPUESTA RÁPIDA</span>
              <span class="feature-text">Nuestro equipo está listo para responder tus consultas y brindarte soluciones oportunas.</span>
            </div>
            <div class="feature-box">
              <i class="fas fa-truck-fast"></i>
              <span class="feature-title">COBERTURA NACIONAL</span>
              <span class="feature-text">Enviamos a todo el país con opciones de envío seguras y seguimiento en tiempo real.</span>
            </div>
            <div class="feature-box">
              <i class="fas fa-shield-halved"></i>
              <span class="feature-title">CONFIANZA Y RESPALDO</span>
              <span class="feature-text">Más de 20 años acompañando proyectos eléctricos e industriales de nuestros clientes.</span>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="contact-right">
          <div class="contact-info-list">
            <div class="info-row">
              <div class="info-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="info-content">
                <span class="info-label">Dirección</span>
                <span class="info-value">Bogotá, Colombia</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fas fa-phone"></i>
              </div>
              <div class="info-content">
                <span class="info-label">Teléfono</span>
                <span class="info-value">+57 (601) 123 4567</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon whatsapp">
                <i class="fab fa-whatsapp"></i>
              </div>
              <div class="info-content">
                <span class="info-label">WhatsApp</span>
                <span class="info-value">+57 300 123 4567</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="info-content">
                <span class="info-label">Correo electrónico</span>
                <span class="info-value">contacto@disef.com.co</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="info-content">
                <span class="info-label">Horario de atención</span>
                <span class="info-value">Lunes a Viernes<br/>8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          <div class="contact-image">
            <img src="https://res.cloudinary.com/dlwzazojt/image/upload/v1784053605/WhatsApp_Image_2026-07-04_at_12.02.46_PM_1_sdgzrg.jpg" alt="Productos DISEF" />
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="contact-bottom">
        <div class="bottom-left">
          <i class="fas fa-phone-alt bottom-icon"></i>
          <div>
            <h4>¿No encuentras el producto que buscas?</h4>
            <p>Nuestro equipo puede ayudarte a encontrar la solución ideal para tu necesidad.</p>
          </div>
        </div>
        <div class="bottom-buttons">
          <a href="https://wa.me/573213727442" target="_blank" class="btn btn-yellow">
            <i class="fas fa-file-invoice"></i> SOLICITAR COTIZACIÓN
          </a>
          <a href="tel:+573213727442" class="btn btn-outline">
            <i class="fas fa-phone"></i> LLÁMANOS AHORA
          </a>
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="contact-trust">
        <div class="trust-item">
          <i class="fas fa-certificate"></i>
          <span class="trust-title">Productos certificados</span>
          <span class="trust-text">Normas nacionales e internacionales.</span>
        </div>
        <div class="trust-separator"></div>
        <div class="trust-item">
          <i class="fas fa-users"></i>
          <span class="trust-title">Atención personalizada</span>
          <span class="trust-text">Soluciones a la medida de tu empresa y proyecto.</span>
        </div>
        <div class="trust-separator"></div>
        <div class="trust-item">
          <i class="fas fa-award"></i>
          <span class="trust-title">Marcas líderes</span>
          <span class="trust-text">Distribuidores de fabricantes reconocidos a nivel mundial.</span>
        </div>
        <div class="trust-separator"></div>
        <div class="trust-item">
          <i class="fas fa-check-circle"></i>
          <span class="trust-title">Calidad garantizada</span>
          <span class="trust-text">Equipos confiables para máxima seguridad y rendimiento.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ContactSection'
})
</script>

<style scoped>
.contact-section {
  padding: 80px 0;
  background: #FFFFFF;
}

.contact-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.contact-header {
  text-align: center;
  margin-bottom: 50px;
}

.contact-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #FFC107;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.contact-title {
  margin: 0;
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.5px;
  font-style: italic;
  line-height: 1.2;
}

.contact-title .highlight {
  color: #FFC107;
}

.contact-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 40px;
}

.contact-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-text {
  font-size: 16px;
  color: #555555;
  line-height: 1.7;
  margin: 0;
}

.contact-text strong {
  color: #111111;
}

.contact-whatsapp {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #F7F8FA;
  border-radius: 12px;
}

.whatsapp-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.whatsapp-icon i {
  color: #FFFFFF;
  font-size: 22px;
}

.whatsapp-info {
  display: flex;
  flex-direction: column;
}

.whatsapp-title {
  font-size: 14px;
  font-weight: 700;
  color: #111111;
}

.whatsapp-text {
  font-size: 13px;
  color: #777777;
}

.btn-whatsapp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  background: #25D366;
  color: #FFFFFF;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  width: fit-content;
}

.btn-whatsapp:hover {
  background: #1DA851;
  transform: translateY(-2px);
}

.contact-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 10px;
}

.feature-box {
  padding: 20px;
  background: #F7F8FA;
  border-radius: 12px;
  border: 1px solid #E5E5E5;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-box i {
  font-size: 20px;
  color: #FFC107;
}

.feature-title {
  font-size: 12px;
  font-weight: 700;
  color: #111111;
  letter-spacing: 0.5px;
}

.feature-text {
  font-size: 12px;
  color: #777777;
  line-height: 1.5;
}

.contact-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.info-row .info-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-row .info-icon i {
  font-size: 18px;
  color: #FFC107;
}

.info-row .info-icon.whatsapp {
  background: rgba(37, 211, 102, 0.12);
}

.info-row .info-icon.whatsapp i {
  color: #25D366;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  color: #FFC107;
}

.info-value {
  font-size: 14px;
  color: #555555;
  line-height: 1.5;
}

.contact-image {
  border-radius: 16px;
  overflow: hidden;
  height: 200px;
}

.contact-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  background: #F7F8FA;
  border-radius: 16px;
  border: 1px solid #E5E5E5;
  margin-bottom: 40px;
}

.bottom-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bottom-icon {
  font-size: 28px;
  color: #FFC107;
}

.bottom-left h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #111111;
}

.bottom-left p {
  margin: 0;
  font-size: 13px;
  color: #777777;
}

.bottom-buttons {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  letter-spacing: 0.5px;
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
  border: 1.5px solid #111111;
  color: #111111;
}

.btn-outline:hover {
  background: #111111;
  color: #FFFFFF;
  transform: translateY(-2px);
}

.contact-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 24px 40px;
  border: 1px solid #E5E5E5;
  border-radius: 12px;
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 32px;
  text-align: center;
}

.trust-item i {
  font-size: 20px;
  color: #FFC107;
}

.trust-title {
  font-size: 13px;
  font-weight: 700;
  color: #111111;
}

.trust-text {
  font-size: 11px;
  color: #777777;
}

.trust-separator {
  width: 1px;
  height: 50px;
  background: #E5E5E5;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .contact-main {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .bottom-left {
    flex-direction: column;
  }

  .contact-trust {
    flex-wrap: wrap;
    gap: 20px;
  }

  .trust-separator {
    display: none;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 60px 0;
  }

  .contact-features {
    grid-template-columns: 1fr;
  }

  .bottom-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .contact-trust {
    flex-direction: column;
    align-items: flex-start;
  }

  .trust-item {
    align-items: flex-start;
    text-align: left;
    padding: 0;
  }
}
</style>
