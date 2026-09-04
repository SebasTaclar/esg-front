<template>
  <div class="project-form-page">
    <!-- Header -->
    <div class="form-header">
      <div class="header-left">
        <router-link :to="backRoute" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {{ isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto' }}
        </router-link>
        <h1 class="form-title">{{ isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h1>
      </div>
      <div class="header-actions">
        <router-link :to="backRoute" class="btn-outline">Cancelar</router-link>
        <button class="btn-primary" :disabled="saving" @click="handleSubmit">
          <span v-if="saving" class="spinner-sm"></span>
          {{ isEdit ? 'Actualizar' : 'Crear Proyecto' }}
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="formError" class="error-banner">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{{ formError }}</span>
      <button class="error-close" @click="formError = ''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loadingProject" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando datos del proyecto...</p>
    </div>

    <!-- Form -->
    <form v-else class="form-body" @submit.prevent="handleSubmit">
      <!-- Datos Generales -->
      <div class="form-card">
        <h3 class="card-title">Datos Generales</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">Cliente</label>
            <select v-model="form.clientId" class="form-input" required>
              <option value="">Seleccionar cliente...</option>
              <option v-for="c in uniqueClientes" :key="c.id" :value="c.id">{{ c.razonSocial }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Código</label>
            <input type="text" class="form-input" :value="selectedClientCode" readonly placeholder="Selecciona un cliente" />
          </div>
          <div class="form-group">
            <label class="form-label">NIT</label>
            <input type="text" class="form-input" :value="selectedClientNit" readonly placeholder="Selecciona un cliente" />
          </div>
          <div class="form-group">
            <label class="form-label required">Tipo de Servicio</label>
            <input v-model="form.serviceType" type="text" class="form-input" placeholder="Ej: Consultoría" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Norma</label>
            <input v-model="form.norm" type="text" class="form-input" placeholder="Escribe la norma..." />
          </div>
          <div class="form-group">
            <label class="form-label required">Estado</label>
            <select v-model="form.status" class="form-input" required>
              <option value="">Seleccionar estado...</option>
              <option value="Cotizacion">Cotizacion</option>
              <option value="Aprobado">Aprobado</option>
              <option value="En Ejecucion">En Ejecucion</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Suspendido">Suspendido</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Responsable</label>
            <input v-model="form.responsible" type="text" class="form-input" placeholder="Nombre del responsable" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Fecha de Inicio</label>
            <input v-model="form.startDate" type="date" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Fin</label>
            <input v-model="form.endDate" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label required">Oferta</label>
            <select v-model="form.offer" class="form-input" required>
              <option value="">Seleccionar oferta...</option>
              <option v-for="o in availableOffers" :key="o" :value="o">{{ o }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.description" class="form-input form-textarea" rows="2" placeholder="Descripción del servicio..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Observaciones</label>
            <textarea v-model="form.observations" class="form-input form-textarea" rows="2" placeholder="Notas adicionales..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Costo Total</label>
            <input :value="formatCurrency(computedTotalCost)" type="text" class="form-input" readonly />
          </div>
        </div>
      </div>

      <!-- Servicios -->
      <div class="form-card">
        <div class="card-header-row">
          <h3 class="card-title">Servicios</h3>
          <button type="button" class="btn-outline-sm" @click="addService">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar Servicio
          </button>
        </div>

        <div v-if="form.services.length === 0" class="empty-contacts">
          <p>Sin servicios. Puedes agregar servicios después de crear el proyecto.</p>
        </div>

        <div v-else class="contacts-list">
          <div v-for="(svc, idx) in form.services" :key="idx" class="contact-card">
            <div class="contact-card-header">
              <span class="contact-number">Servicio {{ idx + 1 }}</span>
              <button type="button" class="remove-btn" @click="removeService(idx)" title="Eliminar servicio">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <select v-model="svc.name" class="form-input">
                  <option value="">Seleccionar servicio...</option>
                  <option v-for="s in serviceTypes" :key="s" :value="s">{{ s }}</option>
                  <option value="__custom__">Otro</option>
                </select>
                <input v-if="svc.name === '__custom__'" v-model="svc.customName" type="text" class="form-input custom-input" placeholder="Escribe el servicio..." />
              </div>
              <div class="form-group">
                <label class="form-label">Norma</label>
                <select v-model="svc.norm" class="form-input">
                  <option value="">Seleccionar norma...</option>
                  <option v-for="n in normasList" :key="n" :value="n">{{ n }}</option>
                  <option value="__custom__">Otro</option>
                </select>
                <input v-if="svc.norm === '__custom__'" v-model="svc.customNorm" type="text" class="form-input" placeholder="Escribe la norma..." style="margin-top:4px" />
              </div>
              <div class="form-group">
                <label class="form-label">Colaborador</label>
                <input v-model="svc.collaborator" type="text" class="form-input" placeholder="Colaborador" />
              </div>
              <div class="form-group">
                <label class="form-label">Cantidad</label>
                <input v-model.number="svc.quantity" type="number" class="form-input" placeholder="1" min="1" />
              </div>
              <div class="form-group">
                <label class="form-label">Valor Unitario</label>
                <input v-model.number="svc.unitPrice" type="number" class="form-input" placeholder="0" min="0" />
              </div>
              <div class="form-group">
                <label class="form-label">Descuento (%)</label>
                <input v-model.number="svc.discount" type="number" class="form-input" placeholder="0" min="0" max="100" />
              </div>
              <div class="form-group">
                <label class="form-label">Subtotal</label>
                <input :value="formatCurrency(calcSubtotal(svc))" type="text" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Sub. Descuento</label>
                <input :value="formatCurrency(calcSubtotalWithDiscount(svc))" type="text" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">IVA</label>
                <input :value="formatCurrency(calcIVA(svc))" type="text" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Total</label>
                <input :value="formatCurrency(calcTotal(svc))" type="text" class="form-input" readonly />
              </div>
            </div>
          </div>
        </div>

        <!-- Costo al Cliente -->
        <div v-if="form.services.length > 0" class="form-card cost-summary">
          <h3 class="card-title">Costo al Cliente</h3>
          <div class="cost-grid">
            <div class="cost-item">
              <span class="cost-label">Subtotal</span>
              <span class="cost-value">{{ formatCurrency(summarySubtotal) }}</span>
            </div>
            <div class="cost-item">
              <span class="cost-label">Descuento</span>
              <span class="cost-value">-{{ formatCurrency(summaryDiscount) }}</span>
            </div>
            <div class="cost-item">
              <span class="cost-label">Sub. con Descuento</span>
              <span class="cost-value">{{ formatCurrency(summarySubtotalWithDiscount) }}</span>
            </div>
            <div class="cost-item">
              <span class="cost-label">IVA (19%)</span>
              <span class="cost-value">{{ formatCurrency(summaryIVA) }}</span>
            </div>
            <div class="cost-item total">
              <span class="cost-label">Total</span>
              <span class="cost-value">{{ formatCurrency(summaryTotal) }}</span>
            </div>
          </div>
        </div>

      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCRM } from '@/composables/useCRM'
import { projectService } from '@/services/api/projectService'
import type { ServicioProyecto } from '@/types/crmTypes'

const route = useRoute()
const router = useRouter()
const { clientes, proyectos, fetchClientes, fetchProyectos } = useCRM()

const projectId = computed(() => {
  const id = route.params.id
  return id ? Number(id) : null
})
const isEdit = computed(() => !!projectId.value)
const backRoute = computed(() => {
  if (isEdit.value) {
    if (route.query.fromClient) return `/admin/crm/clientes/${route.query.fromClient}`
    return `/admin/crm/proyectos/${projectId.value}`
  }
  if (route.query.clientId) return `/admin/crm/clientes/${route.query.clientId}`
  return '/admin/crm/proyectos'
})

const saving = ref(false)
const loadingProject = ref(false)
const formError = ref('')

const form = reactive({
  clientId: '' as string | number,
  clientCodeId: '' as string | number,
  projectType: '',
  serviceType: '',
  norm: '',
  status: '',
  responsible: '',
  startDate: '',
  endDate: '',
  offer: '',
  description: '',
  observations: '',
  services: [] as ServicioProyecto[],
})

watch(() => form.clientId, () => {
  form.clientCodeId = ''
})

const usedOffers = computed(() => {
  return new Set(proyectos.value.map(p => p.offer).filter(Boolean))
})

const availableOffers = computed(() => {
  const offers: string[] = []
  for (let i = 1; i <= 500; i++) {
    const code = `OE-${String(i).padStart(4, '0')}`
    if (!usedOffers.value.has(code)) {
      offers.push(code)
    }
  }
  return offers
})

const normasList = [
  'ANAB',
  'ASEGURAMIENTO METROLOGICO',
  'BPM',
  'CRECIMIENTO PERSONAL',
  'DECRETO SST',
  'HABILIDADES BLANDAS',
  'HACCP',
  'ISO 14001:2015',
  'ISO 22000:2018',
  'ISO 27001:2022',
  'ISO 37001:2016',
  'ISO 45001:2018',
  'ISO 9001:2015',
  'ISO IEC 17020:2012',
  'ISO IEC 17021:2015',
  'ISO IEC 17024:2012',
  'ISO IEC 17025:2017',
  'ISO IEC 17043:2023',
  'ISO IEC 17065.2012',
  'PRESIÓN',
  'RETIE',
  'RETIE Y RETILAP',
  'RETILAP',
  'RITEL',
  'RTE',
  'RUC',
  'SERVICIO AL CLIENTE',
  'SG- SST',
  'SGA',
  'SGA - SST - Decreto',
  'TEMPERATURA',
  'TIC',
  'TRINORMA',
  'TRANSVERSAL',
  'VENTAS Y NEGOCIACIÓN',
  'VERIFICACIÓN MÉTODOS',
]

const serviceTypes = [
  'Asesoría Híbrida',
  'Asesoría Presencial',
  'Asesoría Virtual',
  'Auditoria interna - Exp técnico Calibraciones Etapa 1',
  'Auditoria interna - Exp técnico Calibraciones Etapa 2',
  'Auditoria interna - Exp técnico Eléctrico Etapa 1',
  'Auditoria interna - Exp técnico Eléctrico Etapa 2',
  'Auditoria interna - Exp técnico Fisicoquímico Etapa 1',
  'Auditoria interna - Exp técnico Fisicoquímico Etapa 2',
  'Auditoria interna - Exp técnico Microbiológico Etapa 1',
  'Auditoria interna - Exp técnico Microbiológico Etapa 2',
  'Auditoria interna - Exp técnico',
  'Auditoria interna - Líder Etapa 1',
  'Auditoria interna - Líder Etapa 2',
  'Auditoria interna presencial',
  'Búsqueda de personal',
  'Búsqueda y Selección de personal',
  'Capacitación presencial',
  'Capacitación Virtual',
  'Cierre de correcciones y acciones correctivas',
  'Crecimiento personal',
  'Diagnóstico Inicial',
  'Director de Calidad',
  'Director Técnico Freelance',
  'Diplomado',
  'Elaboración de informe',
  'Gestión ensayos de aptitud',
  'Implementación',
  'Implementación - Fase 1',
  'Implementación - Fase 2',
  'Incertidumbres de la medición',
  'Mantenimiento',
  'Matriz Informes',
  'Outsourcing Calidad',
  'Outsourcing In house',
  'Outsourcing SST',
  'Paquete Capacitaciones',
  'Pasantía',
  'Revisión documental Experto técnico',
  'Revisión documental y preparación de Auditoria Líder',
  'Revisión Plan de correciones y acciones correctivas',
  'Servicio al cliente',
  'Verificaciones de métodos',
  'Viáticos',
  'Ventas y negociación',
]

const uniqueClientes = computed(() => {
  const seen = new Map<string, typeof clientes.value[0]>()
  for (const c of clientes.value) {
    const key = c.razonSocial.toLowerCase().trim()
    if (!seen.has(key)) seen.set(key, c)
  }
  return Array.from(seen.values()).sort((a, b) => a.razonSocial.localeCompare(b.razonSocial))
})

const clientCodes = computed(() => {
  if (!form.clientId) return []
  const client = clientes.value.find(c => c.id === form.clientId)
  if (!client) return []
  return clientes.value.filter(c => c.nit === client.nit)
})

const computedTotalCost = computed(() => {
  return form.services.reduce((sum, s) => sum + (s.quantity * s.unitPrice), 0)
})

const selectedClientCode = computed(() => {
  if (!form.clientId) return ''
  const client = clientes.value.find(c => c.id === form.clientId)
  if (!client) return ''
  return client.codigo || ''
})

const selectedClientNit = computed(() => {
  if (!form.clientId) return ''
  const client = clientes.value.find(c => c.id === form.clientId)
  if (!client) return ''
  return client.nit || ''
})

function formatCurrency(value: number | undefined | null): string {
  if (!value) return '-'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

function addService() {
  const normValue = form.norm
  form.services.push({
    name: '',
    customName: '',
    norm: normValue,
    customNorm: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    subtotal: 0,
    subtotalWithDiscount: 0,
    iva: 0,
    totalPrice: 0,
    collaborator: '',
  })
}

function removeService(index: number) {
  form.services.splice(index, 1)
}

function calcSubtotal(svc: { quantity: number; unitPrice: number }): number {
  return svc.quantity * svc.unitPrice
}

function calcSubtotalWithDiscount(svc: { quantity: number; unitPrice: number; discount: number }): number {
  const subtotal = svc.quantity * svc.unitPrice
  return subtotal - (subtotal * svc.discount / 100)
}

function calcIVA(svc: { quantity: number; unitPrice: number; discount: number }): number {
  return calcSubtotalWithDiscount(svc) * 0.19
}

function calcTotal(svc: { quantity: number; unitPrice: number; discount: number }): number {
  const sub = calcSubtotalWithDiscount(svc)
  return sub + sub * 0.19
}

const summarySubtotal = computed(() => form.services.reduce((s, svc) => s + calcSubtotal(svc), 0))
const summaryDiscount = computed(() => form.services.reduce((s, svc) => s + (calcSubtotal(svc) * svc.discount / 100), 0))
const summarySubtotalWithDiscount = computed(() => form.services.reduce((s, svc) => s + calcSubtotalWithDiscount(svc), 0))
const summaryIVA = computed(() => form.services.reduce((s, svc) => s + calcIVA(svc), 0))
const summaryTotal = computed(() => form.services.reduce((s, svc) => s + calcTotal(svc), 0))

function resetForm() {
  form.clientId = ''
  form.projectType = ''
  form.serviceType = ''
  form.norm = ''
  form.status = 'cotizacion'
  form.responsible = ''
  form.startDate = ''
  form.endDate = ''
  form.offer = ''
  form.description = ''
  form.observations = ''
  form.services = []
}

async function loadProject() {
  if (!projectId.value) return
  loadingProject.value = true
  try {
    const proyecto = await projectService.getById(projectId.value)
    if (!proyecto) {
      formError.value = 'No se pudo cargar el proyecto'
      return
    }
    form.clientId = proyecto.clientId
    form.projectType = proyecto.projectType
    form.serviceType = proyecto.serviceType || ''
    form.norm = proyecto.norm
    form.status = proyecto.status
    form.responsible = proyecto.responsible
    form.startDate = proyecto.startDate ? proyecto.startDate.split('T')[0] : ''
    form.endDate = proyecto.endDate ? proyecto.endDate.split('T')[0] : ''
    form.offer = proyecto.offer || ''
    form.description = proyecto.description
    form.observations = proyecto.observations || ''
    form.services = (proyecto.services || []).map(s => ({ ...s }))
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Error al cargar el proyecto'
  } finally {
    loadingProject.value = false
  }
}

async function handleSubmit() {
  formError.value = ''

  if (!form.clientId) { formError.value = 'Selecciona un cliente.'; return }
  if (!form.norm.trim()) { formError.value = 'La norma es obligatoria.'; return }
  if (!form.status) { formError.value = 'El estado es obligatorio.'; return }
  if (!form.offer) { formError.value = 'La oferta es obligatoria.'; return }
  if (!form.serviceType.trim()) { formError.value = 'El tipo de servicio es obligatorio.'; return }
  if (!form.responsible.trim()) { formError.value = 'El responsable es obligatorio.'; return }
  if (!form.startDate) { formError.value = 'La fecha de inicio es obligatoria.'; return }

  saving.value = true
  try {
    const services = form.services
      .filter(s => s.name === '__custom__' ? (s.customName ?? '').trim() : s.name.trim())
      .map(s => ({
        name: s.name === '__custom__' ? (s.customName ?? '').trim() : s.name.trim(),
        norm: s.norm === '__custom__' ? (s.customNorm ?? '').trim() : (s.norm || form.norm),
        quantity: s.quantity,
        unitPrice: s.unitPrice,
        discount: s.discount,
        subtotal: calcSubtotal(s),
        subtotalWithDiscount: calcSubtotalWithDiscount(s),
        iva: calcIVA(s),
        totalPrice: calcTotal(s),
        collaborator: s.collaborator,
      }))

    const payload = {
      clientId: Number(form.clientId),
      projectType: form.projectType.trim() || 'General',
      serviceType: form.serviceType.trim() || undefined,
      norm: form.norm.trim(),
      status: form.status,
      responsible: form.responsible.trim(),
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      offer: form.offer.trim() || undefined,
      totalCost: computedTotalCost.value || undefined,
      description: form.description.trim(),
      observations: form.observations.trim() || undefined,
      services: services.length > 0 ? services : undefined,
    }

    if (isEdit.value) {
      await projectService.update(projectId.value!, payload)
    } else {
      await projectService.create(payload)
    }

    router.push(backRoute.value)
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Error al guardar el proyecto'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchClientes({ page: 1, limit: 9999 }), fetchProyectos()])
  if (isEdit.value) {
    await loadProject()
  } else if (route.query.clientId) {
    form.clientId = Number(route.query.clientId)
  }
})
</script>

<style scoped>
.custom-input { margin-top: 4px; }
.project-form-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== HEADER ===== */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--c-border);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--c-gray);
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: var(--c-primary); }

.header-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--c-black);
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* ===== FORM BODY ===== */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 24px;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 20px;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header-row .card-title {
  margin-bottom: 0;
}

/* ===== FORM GRID ===== */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}

.form-label.required::after {
  content: ' *';
  color: var(--c-primary);
}

.form-input {
  padding: 10px 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: inherit;
  color: var(--c-black);
  background: var(--c-white);
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: var(--c-primary); }

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

/* ===== COST SUMMARY ===== */
.cost-summary {
  margin-top: 24px;
  padding: 20px;
}
.cost-summary .card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 16px;
}
.cost-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--c-border);
}
.cost-item:last-child { border-bottom: none; }
.cost-item.total {
  border-top: 2px solid var(--c-primary);
  margin-top: 4px;
  padding-top: 12px;
  font-weight: 700;
}
.cost-label { font-size: 0.85rem; color: var(--c-gray); }
.cost-value { font-size: 0.88rem; color: var(--c-black); font-weight: 600; }
.cost-item.total .cost-label { color: var(--c-black); font-weight: 700; }
.cost-item.total .cost-value { color: var(--c-primary); font-size: 1rem; }

/* ===== BUTTONS ===== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--c-primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-outline {
  padding: 10px 20px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { border-color: var(--c-gray-light); color: var(--c-black); }

.btn-outline-sm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline-sm:hover { border-color: var(--c-primary); color: var(--c-primary); }

/* ===== SERVICES ===== */
.empty-contacts {
  padding: 32px;
  text-align: center;
  color: var(--c-gray);
  font-size: 0.88rem;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-card {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 16px;
}

.contact-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.contact-number {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--c-primary);
  text-transform: uppercase;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: var(--c-gray-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.remove-btn:hover { background: #fee2e2; color: #dc2626; }

/* ===== ERROR ===== */
.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 0.85rem;
}

.error-close {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #dc2626;
  border-radius: 6px;
  cursor: pointer;
}

/* ===== LOADING ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: var(--c-gray);
  font-size: 0.88rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--c-border);
  border-top-color: var(--c-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-sm {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .form-header { flex-direction: column; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
