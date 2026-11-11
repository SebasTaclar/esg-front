<template>
  <div class="svc-cert-overlay" @click.self="emit('close')">
    <div class="svc-cert-modal">
      <div class="svc-cert-header">
        <div class="svc-cert-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
          <div class="svc-cert-title-text">
            <h3>Certificados del servicio</h3>
            <p>{{ servicio.name }} · {{ servicio.norm }}</p>
          </div>
        </div>
        <button class="svc-close-btn" title="Cerrar" @click="emit('close')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="svc-cert-body">
        <div class="svc-meta">
          <span><strong>Colaborador:</strong> {{ servicio.collaborator || '-' }}</span>
          <span><strong>Participantes:</strong> {{ participantes.length }}</span>
        </div>

        <p class="svc-hint">
          Indica a qué nombres y cédulas se emite certificado para este servicio. Cada participante generará un certificado propio.
        </p>

        <div v-if="mensajeError" class="svc-msg svc-msg-error">{{ mensajeError }}</div>
        <div v-else-if="duplicadoIds" class="svc-msg svc-msg-warn">
          Hay cédulas duplicadas. Corrige o elimina las filas repetidas antes de continuar.
        </div>
        <div v-else-if="filasInvalidas > 0" class="svc-msg svc-msg-warn">
          Completa el nombre y la cédula de todas las filas, o elimina las filas vacías.
        </div>

        <div class="svc-part-list">
          <div class="svc-part-head">
            <span class="svc-part-idx">#</span>
            <span>Nombre completo</span>
            <span>Cédula</span>
            <span class="svc-part-actions-label">Acciones</span>
          </div>
          <div v-if="participantes.length === 0" class="svc-part-empty">
            Sin participantes. Agrega al menos uno para generar certificados.
          </div>
          <div v-for="(p, idx) in participantes" :key="idx" class="svc-part-row">
            <span class="svc-part-idx">{{ idx + 1 }}</span>
            <input v-model="p.name" class="svc-input" placeholder="Nombre completo" />
            <input v-model="p.documentId" class="svc-input svc-input-doc" placeholder="Cédula" />
            <div class="svc-part-actions">
              <button
                class="svc-icon-btn"
                title="Vista previa del certificado"
                :disabled="!filaValida(p)"
                @click="verPreview(idx)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button
                class="svc-icon-btn"
                title="Descargar certificado individual"
                :disabled="!filaValida(p) || descargandoIdx !== null"
                @click="descargarIndividual(idx)"
              >
                <span v-if="descargandoIdx === idx" class="svc-spinner"></span>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button class="svc-icon-btn svc-icon-danger" title="Quitar participante" @click="quitarParticipante(idx)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="svc-add-row">
          <button class="svc-add-btn" @click="agregarParticipante">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar participante
          </button>
        </div>
      </div>

      <div class="svc-cert-footer">
        <span class="svc-foot-hint">Usa "Guardar" para conservar los participantes con el proyecto.</span>
        <div class="svc-foot-actions">
          <button class="svc-btn svc-btn-cancel" @click="emit('close')">Cerrar</button>
          <button class="svc-btn svc-btn-save" :disabled="saving || !puedeGuardar" @click="guardar">
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
          <button class="svc-btn svc-btn-download" :disabled="descargandoTodos || !puedeGenerar" @click="descargarTodos">
            <span v-if="descargandoTodos" class="svc-spinner"></span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {{ descargandoTodos ? 'Generando PDF...' : `Descargar todos (${validos.length})` }}
          </button>
        </div>
      </div>

      <CertificatePreviewModal
        v-if="previewPayload"
        :payload="previewPayload"
        @close="previewPayload = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CertificatePreviewModal from '@/components/CertificatePreviewModal.vue'
import {
  generateCertificatePdf,
  generateCertificatesPdf,
  type CertificateBaseData,
  type CertificatePayload,
} from '@/utils/certificatePdf'
import type { ServicioParticipante, ServicioProyecto } from '@/types/crmTypes'

const props = defineProps<{
  servicio: ServicioProyecto
  serviceIndex: number
  base: CertificateBaseData
  saving?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{ save: [participants: ServicioParticipante[]]; close: [] }>()

const participantes = ref<ServicioParticipante[]>(
  (props.servicio.participants || []).map((p) => ({ ...p })),
)
const previewPayload = ref<CertificatePayload | null>(null)
const descargandoIdx = ref<number | null>(null)
const descargandoTodos = ref(false)
const errorLocal = ref('')

const mensajeError = computed(() => props.errorMessage || errorLocal.value)

function filaValida(p: ServicioParticipante): boolean {
  return p.name.trim().length > 0 && p.documentId.trim().length > 0
}

function normalizarDoc(valor: string): string {
  return valor.trim().replace(/[^0-9a-zA-Z]/g, '').toLowerCase()
}

const filasInvalidas = computed(() => participantes.value.filter((p) => !filaValida(p)).length)

const duplicadoIds = computed(() => {
  const vistos = new Set<string>()
  for (const p of participantes.value) {
    const n = normalizarDoc(p.documentId)
    if (!n) continue
    if (vistos.has(n)) return true
    vistos.add(n)
  }
  return false
})

const validos = computed(() => participantes.value.filter((p) => filaValida(p)))

const puedeGuardar = computed(() => filasInvalidas.value === 0 && !duplicadoIds.value)

const puedeGenerar = computed(() => validos.value.length > 0 && !duplicadoIds.value)

function agregarParticipante() {
  participantes.value.push({ name: '', documentId: '' })
}

function quitarParticipante(idx: number) {
  participantes.value.splice(idx, 1)
}

function payloadPara(p: ServicioParticipante, idx: number): CertificatePayload {
  return {
    ...props.base,
    scope: props.servicio.name || 'Servicio',
    activityDescription: (props.servicio.activityDescription || '').trim() || undefined,
    modality: (props.servicio.modality || '').trim() || undefined,
    hoursIntensity: props.servicio.hoursIntensity || undefined,
    implementationDate: (props.servicio.implementationDate || '').trim() || undefined,
    certificateNumber: `CERT-${props.base.projectCode}-${props.serviceIndex + 1}-${idx + 1}`,
    participantName: p.name.trim(),
    participantDocumentId: p.documentId.trim(),
    signatureUrl: (props.servicio.signatureUrl || '').trim() || undefined,
    signer: (props.servicio.collaborator || '').trim() || undefined,
  }
}

function guardar() {
  if (!puedeGuardar.value) return
  emit(
    'save',
    participantes.value.map((p) => ({ name: p.name.trim(), documentId: p.documentId.trim() })),
  )
}

function verPreview(idx: number) {
  errorLocal.value = ''
  previewPayload.value = payloadPara(participantes.value[idx], idx)
}

async function descargarIndividual(idx: number) {
  errorLocal.value = ''
  descargandoIdx.value = idx
  try {
    await generateCertificatePdf(payloadPara(participantes.value[idx], idx))
  } catch (e) {
    errorLocal.value = e instanceof Error ? e.message : 'Error al generar el PDF'
  } finally {
    descargandoIdx.value = null
  }
}

async function descargarTodos() {
  errorLocal.value = ''
  descargandoTodos.value = true
  try {
    const payloads = participantes.value
      .map((p, idx) => ({ p, idx }))
      .filter((x) => filaValida(x.p))
      .map((x) => payloadPara(x.p, x.idx))
    await generateCertificatesPdf(payloads)
  } catch (e) {
    errorLocal.value = e instanceof Error ? e.message : 'Error al generar los PDF'
  } finally {
    descargandoTodos.value = false
  }
}
</script>

<style scoped>
.svc-cert-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 15, 0.62);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 24px;
}

.svc-cert-modal {
  position: relative;
  background: var(--c-white, #fff);
  border-radius: 14px;
  width: 100%;
  max-width: 860px;
  max-height: 94vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
}

.svc-cert-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border, #e5e7eb);
}

.svc-cert-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--c-primary, #b8912f);
}

.svc-cert-title-text h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-black, #1a1a1a);
}

.svc-cert-title-text p {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: var(--c-gray, #6b7280);
}

.svc-close-btn {
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
.svc-close-btn:hover {
  background: var(--c-light, #f3f4f6);
  color: var(--c-black, #111);
}

.svc-cert-body {
  padding: 16px 20px;
  overflow-y: auto;
}

.svc-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  font-size: 0.82rem;
  color: var(--c-dark, #374151);
  background: var(--c-light, #f9fafb);
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 8px;
  padding: 10px 14px;
}

.svc-hint {
  margin: 12px 0;
  font-size: 0.82rem;
  color: var(--c-gray, #6b7280);
}

.svc-msg {
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  margin-bottom: 12px;
}

.svc-msg-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.svc-msg-warn {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.svc-part-list {
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 10px;
  overflow: hidden;
}

.svc-part-head {
  display: grid;
  grid-template-columns: 34px 1fr 180px 128px;
  gap: 8px;
  padding: 8px 12px;
  background: var(--c-light, #f9fafb);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--c-gray, #6b7280);
}

.svc-part-empty {
  padding: 22px 12px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--c-gray, #6b7280);
}

.svc-part-row {
  display: grid;
  grid-template-columns: 34px 1fr 180px 128px;
  gap: 8px;
  padding: 8px 12px;
  align-items: center;
  border-top: 1px solid var(--c-border, #e5e7eb);
}

.svc-part-row:first-of-type {
  border-top: none;
}

.svc-part-idx {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-gray, #6b7280);
}

.svc-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--c-border, #d1d5db);
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: inherit;
  color: var(--c-black, #1a1a1a);
  transition: border-color 0.15s;
}
.svc-input:focus {
  outline: none;
  border-color: var(--c-primary, #b8912f);
}
.svc-input-doc {
  text-transform: uppercase;
}

.svc-part-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.svc-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 7px;
  background: var(--c-white, #fff);
  color: var(--c-dark, #374151);
  cursor: pointer;
  transition: all 0.15s;
}
.svc-icon-btn:hover:not(:disabled) {
  border-color: var(--c-primary, #b8912f);
  color: var(--c-primary, #b8912f);
}
.svc-icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.svc-icon-danger:hover:not(:disabled) {
  border-color: #dc2626;
  color: #dc2626;
}

.svc-add-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.svc-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border: 1px dashed var(--c-primary, #b8912f);
  border-radius: 8px;
  background: transparent;
  color: var(--c-primary, #b8912f);
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.svc-add-btn:hover {
  background: rgba(184, 145, 47, 0.08);
}

.svc-cert-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid var(--c-border, #e5e7eb);
}

.svc-foot-hint {
  font-size: 0.78rem;
  color: var(--c-gray, #6b7280);
}

.svc-foot-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.svc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.svc-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.svc-btn-cancel {
  border: 1px solid var(--c-border, #e5e7eb);
  background: var(--c-white, #fff);
  color: var(--c-dark, #374151);
}
.svc-btn-cancel:hover {
  background: var(--c-light, #f3f4f6);
}

.svc-btn-save {
  border: none;
  background: var(--c-dark, #374151);
  color: #fff;
  font-weight: 600;
}
.svc-btn-save:hover:not(:disabled) {
  opacity: 0.9;
}

.svc-btn-download {
  border: none;
  background: var(--c-primary, #b8912f);
  color: #fff;
  font-weight: 600;
}
.svc-btn-download:hover:not(:disabled) {
  opacity: 0.9;
}

.svc-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: svc-spin 0.8s linear infinite;
}
@keyframes svc-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .svc-cert-overlay {
    padding: 10px;
  }
  .svc-part-head {
    display: none;
  }
  .svc-part-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .svc-part-idx {
    display: none;
  }
  .svc-part-actions {
    justify-content: flex-start;
  }
  .svc-cert-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .svc-foot-hint {
    text-align: center;
  }
  .svc-foot-actions {
    margin-left: 0;
  }
  .svc-btn {
    flex: 1;
  }
}
</style>
