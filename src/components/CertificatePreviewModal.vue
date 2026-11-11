<template>
  <div class="cert-preview-overlay" @click.self="emit('close')">
    <div class="cert-preview-modal">
      <div class="cert-preview-header">
        <div class="cert-preview-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
          <h3>Vista previa del certificado</h3>
        </div>
        <button class="cert-close-btn" title="Cerrar" @click="emit('close')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="cert-preview-body">
        <div class="cert-frame-wrap">
          <iframe :srcdoc="html" class="cert-frame" title="Vista previa del certificado"></iframe>
        </div>
      </div>

      <div class="cert-preview-footer">
        <span class="cert-hint">Así se verá el PDF que se descargará</span>
        <div class="cert-actions">
          <button class="btn-cert-cancel" @click="emit('close')">Cerrar</button>
          <button class="btn-cert-download" :disabled="downloading" @click="download">
            <span v-if="downloading" class="cert-spinner"></span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {{ downloading ? 'Generando PDF...' : 'Descargar PDF' }}
          </button>
        </div>
      </div>

      <div v-if="errorMessage" class="cert-preview-error">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  buildCertificateHtml,
  generateCertificatePdf,
  type CertificatePayload,
} from '@/utils/certificatePdf'

const props = defineProps<{ payload: CertificatePayload }>()
const emit = defineEmits<{ close: [] }>()

const downloading = ref(false)
const errorMessage = ref('')

const html = computed(() => buildCertificateHtml(props.payload))

async function download() {
  downloading.value = true
  errorMessage.value = ''
  try {
    await generateCertificatePdf(props.payload)
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Error al generar el PDF'
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
.cert-preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 15, 0.62);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 24px;
}

.cert-preview-modal {
  position: relative;
  background: var(--c-white, #fff);
  border-radius: 14px;
  width: 100%;
  max-width: 1040px;
  max-height: 94vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
}

.cert-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border, #e5e7eb);
}

.cert-preview-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--c-primary, #b8912f);
}

.cert-preview-title h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-black, #1a1a1a);
}

.cert-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--c-gray, #6b7280);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.cert-close-btn:hover {
  background: var(--c-light, #f3f4f6);
  color: var(--c-black, #111);
}

.cert-preview-body {
  padding: 18px;
  background: #eceae3;
  overflow: auto;
}

.cert-frame-wrap {
  width: 100%;
  aspect-ratio: 2432 / 1728;
  background: #fdfbf4;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
}

.cert-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #fdfbf4;
}

.cert-preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid var(--c-border, #e5e7eb);
}

.cert-hint {
  font-size: 0.8rem;
  color: var(--c-gray, #6b7280);
}

.cert-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.btn-cert-cancel {
  padding: 9px 18px;
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 8px;
  background: var(--c-white, #fff);
  color: var(--c-dark, #374151);
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cert-cancel:hover {
  background: var(--c-light, #f3f4f6);
}

.btn-cert-download {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: var(--c-primary, #b8912f);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-cert-download:hover:not(:disabled) {
  opacity: 0.9;
}
.btn-cert-download:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cert-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: cert-spin 0.8s linear infinite;
}
@keyframes cert-spin {
  to {
    transform: rotate(360deg);
  }
}

.cert-preview-error {
  position: absolute;
  left: 20px;
  bottom: 70px;
  padding: 8px 14px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 0.82rem;
}

@media (max-width: 768px) {
  .cert-preview-overlay {
    padding: 10px;
  }
  .cert-preview-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .cert-hint {
    text-align: center;
  }
  .cert-actions {
    margin-left: 0;
  }
  .btn-cert-cancel,
  .btn-cert-download {
    flex: 1;
    justify-content: center;
  }
}
</style>
