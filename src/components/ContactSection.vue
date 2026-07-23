<template>
  <section id="contacto" class="contact-section">
    <div class="contact-container">
      <header class="contact-header">
        <div class="header-line"></div>
        <h2 class="contact-title">CONTÁCT<span class="highlight">ANOS</span></h2>
        <p class="contact-subtitle">Estamos listos para acompañar a su organización en cada paso hacia la excelencia.</p>
      </header>

      <div class="contact-main">
        <div class="contact-left">
          <h3 class="left-title">HABLEMOS DE CÓMO <span class="highlight">PODEMOS AYUDARLE</span></h3>
          <p class="left-desc">Déjenos sus datos o escríbanos directamente. Nuestro equipo de expertos se pondrá en contacto con usted a la brevedad.</p>

          <div class="contact-info-items">
            <div class="info-item">
              <div class="info-icon-circle">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div class="info-text">
                <span class="info-label">Teléfono</span>
                <span class="info-value">324 289 9188 - 318 388 6699 - 302 226 8128</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon-circle">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="info-text">
                <span class="info-label">Correo</span>
                <span class="info-value">comercial@esgestionempresarial.com<br/>ventas@esgestionempresarial.com</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon-circle">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="info-text">
                <span class="info-label">Dirección</span>
                <span class="info-value">Colombia</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon-circle">
                <i class="fas fa-clock"></i>
              </div>
              <div class="info-text">
                <span class="info-label">Horario de atención</span>
                <span class="info-value">L-V 08:00 a.m - 06:00 p.m</span>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-right">
          <div class="form-card">
            <div class="form-header">
              <div class="form-header-icon">
                <i class="fas fa-comments"></i>
              </div>
              <div class="form-header-text">
                <h4>Envíenos un mensaje</h4>
                <p>Completa el formulario y te responderemos pronto.</p>
              </div>
            </div>

            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-row">
                <div class="form-group">
                  <div class="input-icon">
                    <i class="fas fa-user"></i>
                    <input type="text" v-model="form.name" placeholder="Nombre completo" required />
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-icon">
                    <i class="fas fa-building"></i>
                    <input type="text" v-model="form.company" placeholder="Empresa" />
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <div class="input-icon">
                    <i class="fas fa-envelope"></i>
                    <input type="email" v-model="form.email" placeholder="Correo electrónico" required />
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-icon">
                    <i class="fas fa-phone"></i>
                    <input type="tel" v-model="form.phone" placeholder="Teléfono" />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="input-icon select-icon">
                  <i class="fas fa-list-ul"></i>
                  <select v-model="form.subject" required>
                    <option value="" disabled selected>¿En qué podemos ayudarle?</option>
                    <option value="consultoria">Consultoría</option>
                    <option value="auditoria">Auditoría</option>
                    <option value="certificacion">Certificación ISO</option>
                    <option value="capacitacion">Capacitación</option>
                    <option value="laboratorio">Laboratorios</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <div class="input-icon textarea-icon">
                  <i class="fas fa-pen"></i>
                  <textarea v-model="form.message" placeholder="Cuéntanos más sobre tu necesidad..." rows="4"></textarea>
                </div>
              </div>
              <button type="submit" class="btn-submit">
                Enviar mensaje <i class="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>

          <div class="contact-image-side">
            <img src="https://res.cloudinary.com/dlwzazojt/image/upload/v1784053605/WhatsApp_Image_2026-07-04_at_12.02.46_PM_1_sdgzrg.jpg" alt="ES Gestión Empresarial" />
          </div>
        </div>
      </div>

      <div class="contact-badges">
        <div class="badge-item">
          <div class="badge-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <div class="badge-text">
            <span class="badge-title">Respuesta rápida</span>
            <span class="badge-desc">Nos comprometemos a responder en menos de 24 horas hábiles.</span>
          </div>
        </div>
        <div class="badge-item">
          <div class="badge-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="badge-text">
            <span class="badge-title">Atención personalizada</span>
            <span class="badge-desc">Escuchamos sus necesidades y diseñamos soluciones a su medida.</span>
          </div>
        </div>
        <div class="badge-item">
          <div class="badge-icon">
            <i class="fas fa-handshake"></i>
          </div>
          <div class="badge-text">
            <span class="badge-title">Confidencialidad</span>
            <span class="badge-desc">Manejamos su información con total confidencialidad y profesionalismo.</span>
          </div>
        </div>
        <div class="badge-item">
          <div class="badge-icon">
            <i class="fas fa-bullseye"></i>
          </div>
          <div class="badge-text">
            <span class="badge-title">Soluciones efectivas</span>
            <span class="badge-desc">Enfoque estratégico para generar resultados reales y sostenibles.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

defineOptions({
  name: 'ContactSection'
})

const form = reactive({
  name: '',
  company: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  const phone = '573242899188'
  let text = `*Nuevo mensaje de contacto*\n\n`
  text += `*Nombre:* ${form.name}\n`
  if (form.company) text += `*Empresa:* ${form.company}\n`
  text += `*Correo:* ${form.email}\n`
  if (form.phone) text += `*Teléfono:* ${form.phone}\n`
  text += `*Asunto:* ${form.subject}\n`
  if (form.message) text += `*Mensaje:* ${form.message}\n`

  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}
</script>

<style scoped>
.contact-section {
  padding: 80px 0;
  background: #FFFFFF;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.contact-header {
  text-align: center;
  margin-bottom: 48px;
}

.header-line {
  width: 40px;
  height: 4px;
  background: #C89B2D;
  margin: 0 auto 16px;
  border-radius: 2px;
}

.contact-title {
  margin: 0 0 12px;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  color: #1A1A1A;
  letter-spacing: -0.5px;
}

.contact-title .highlight {
  color: #C89B2D;
}

.contact-subtitle {
  margin: 0;
  font-size: 16px;
  color: #6B6B6B;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.contact-main {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 48px;
  align-items: start;
  margin-bottom: 48px;
}

.contact-left {
  padding-top: 8px;
}

.left-title {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 800;
  color: #1A1A1A;
  line-height: 1.3;
}

.left-title .highlight {
  color: #C89B2D;
}

.left-desc {
  margin: 0 0 32px;
  font-size: 14px;
  color: #6B6B6B;
  line-height: 1.7;
}

.contact-info-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon-circle i {
  font-size: 16px;
  color: #C89B2D;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 13px;
  font-weight: 700;
  color: #C89B2D;
}

.info-value {
  font-size: 14px;
  color: #4A4A4A;
}

.contact-right {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #F0F0F0;
  padding: 32px;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.form-header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(200, 155, 45, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.form-header-icon i {
  font-size: 20px;
  color: #C89B2D;
}

.form-header-text h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
}

.form-header-text p {
  margin: 0;
  font-size: 13px;
  color: #6B6B6B;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  background: #FAFAFA;
  transition: border-color 0.3s ease;
}

.input-icon:focus-within {
  border-color: #C89B2D;
  background: #FFFFFF;
}

.input-icon i {
  font-size: 14px;
  color: #AAAAAA;
  flex-shrink: 0;
}

.input-icon input,
.input-icon select,
.input-icon textarea {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1A1A1A;
  font-family: 'Montserrat', sans-serif;
}

.input-icon input::placeholder,
.input-icon textarea::placeholder {
  color: #AAAAAA;
}

.select-icon select {
  appearance: none;
  cursor: pointer;
  color: #AAAAAA;
}

.select-icon select:valid {
  color: #1A1A1A;
}

.textarea-icon {
  align-items: flex-start;
}

.textarea-icon i {
  margin-top: 4px;
}

.input-icon textarea {
  resize: vertical;
  min-height: 80px;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 32px;
  background: #C89B2D;
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  width: 100%;
}

.btn-submit:hover {
  background: #B8891F;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(200, 155, 45, 0.3);
}

.contact-image-side {
  display: none;
}

.contact-badges {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding-top: 40px;
  border-top: 1px solid #F0F0F0;
}

.badge-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.badge-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(200, 155, 45, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-icon i {
  font-size: 16px;
  color: #C89B2D;
}

.badge-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge-title {
  font-size: 13px;
  font-weight: 700;
  color: #1A1A1A;
}

.badge-desc {
  font-size: 12px;
  color: #6B6B6B;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .contact-main {
    grid-template-columns: 1fr;
  }

  .contact-badges {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 60px 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .contact-badges {
    grid-template-columns: 1fr;
  }
}
</style>
