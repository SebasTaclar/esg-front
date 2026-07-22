<template>
  <!-- WhatsApp flotante a la derecha -->
  <div class="floating-whatsapp">
    <a
      :href="whatsappLink"
      target="_blank"
      rel="noopener"
      class="social-btn whatsapp"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
        alt="WhatsApp"
        class="social-icon"
      >
      <span class="social-tooltip left">Compra aquí</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Número de WhatsApp de ESG Gestión Empresarial
const rawNumber = '3242899188'
// Normaliza a formato internacional (prepend 57 para Colombia)
const whatsappNumber = '57' + rawNumber.replace(/[^\d]/g, '')

// Validación mínima: debe empezar por 57 y tener al menos 12 dígitos (57 + 10)
const isValidWhatsAppNumber = /^57\d{10}$/.test(whatsappNumber)

const { t } = useI18n()
const defaultMessage = computed(() => t('whatsapp.defaultMessage'))
// Endpoint WhatsApp
const whatsappLink = isValidWhatsAppNumber
  ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(defaultMessage.value)}`
  : '#'


defineOptions({ name: 'SocialFloating' })
</script>

<style scoped>
/* === WHATSAPP FLOTANTE DERECHA === */
.floating-whatsapp {
  position: fixed;
  bottom: 40px;
  right: 20px;
  z-index: 1000;
}

.floating-whatsapp .social-btn.whatsapp {
  background: #25d366;
  border: 2px solid #25d366;
  opacity: 1 !important;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
}

.floating-whatsapp .social-btn.whatsapp:hover {
  background: #20b858;
  border-color: #20b858;
  box-shadow: 0 12px 35px rgba(37, 211, 102, 0.6);
  transform: scale(1.15);
}

.floating-whatsapp .social-icon {
  opacity: 1 !important;
  filter: none !important;
}

.social-btn {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.05);
  opacity: 0.15;
}

.social-btn:hover {
  opacity: 1 !important;
  transform: scale(1.2) rotate(5deg);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
}

.social-icon {
  width: 32px;
  height: 32px;
  transition: all 0.4s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.social-btn:hover .social-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Tooltip para WhatsApp */
.social-tooltip {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  pointer-events: none;
}

.floating-whatsapp .social-tooltip.left {
  right: 70px;
}

.floating-whatsapp .social-tooltip.left::after {
  content: '';
  position: absolute;
  left: 100%;
  right: auto;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
  border-right-color: transparent;
}

.social-btn:hover .social-tooltip {
  opacity: 1;
  visibility: visible;
}

.floating-whatsapp .social-btn:hover .social-tooltip {
  transform: translateY(-50%) translateX(5px);
}

.floating-whatsapp .social-btn {
  animation: slideInLeft 0.6s ease;
  animation-fill-mode: both;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Efecto de pulso sutil en WhatsApp */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
  }
  50% {
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.6);
  }
}

.floating-whatsapp .social-btn.whatsapp {
  animation: slideInLeft 0.6s ease, pulse 2s ease-in-out infinite;
}

/* Responsivo */
@media (max-width: 768px) {
  .floating-whatsapp {
    bottom: 15px;
    right: 15px;
  }

  .social-btn {
    width: 52px;
    height: 52px;
  }

  .social-icon {
    width: 28px;
    height: 28px;
  }

  .social-tooltip {
    font-size: 12px;
    padding: 6px 10px;
  }

  .floating-whatsapp .social-tooltip.left {
    right: 62px;
  }
}

@media (max-width: 480px) {
  .floating-whatsapp {
    bottom: 10px;
    right: 10px;
  }

  .social-btn {
    width: 48px;
    height: 48px;
  }

  .social-icon {
    width: 26px;
    height: 26px;
  }
}
</style>
