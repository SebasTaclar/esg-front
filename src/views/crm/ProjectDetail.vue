<template>
  <div class="project-detail" v-if="proyecto">
    <!-- Back Link (only when used as route component) -->
    <div v-if="!projectId" class="back-section">
      <router-link to="/admin/crm/proyectos" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver a proyectos
      </router-link>
    </div>

    <!-- Header -->
    <div class="project-header">
      <div class="header-left">
        <div class="project-code-row">
          <span class="project-code">{{ proyecto.code }}</span>
          <span class="separator">·</span>
          <span class="project-oferta">{{ proyecto.offer }}</span>
        </div>
        <h1 class="project-client">{{ proyecto.client?.name || cliente?.razonSocial }}</h1>
        <p class="project-type">{{ proyecto.projectType }}</p>
      </div>
      <div class="header-right">
        <span class="status-badge">
          {{ proyecto.status }}
        </span>
        <router-link :to="`/admin/crm/proyectos/${proyecto.id}/editar`" class="btn-outline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar proyecto
        </router-link>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <span class="summary-label">Norma</span>
        <span class="summary-value">{{ proyecto.norm }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Servicio</span>
        <span class="summary-value">{{ proyecto.serviceType }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Responsable</span>
        <span class="summary-value">{{ proyecto.responsible }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Inicio</span>
        <span class="summary-value">{{ formatDate(proyecto.startDate) }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Fin</span>
        <span class="summary-value">{{ proyecto.endDate ? formatDate(proyecto.endDate) : '-' }}</span>
      </div>
      <div class="summary-card highlight">
        <span class="summary-label">Valor</span>
        <span class="summary-value">{{ formatCurrency(proyecto.totalCost) }}</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon" v-html="tab.icon"></span>
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- INFORMACIÓN -->
      <div v-if="activeTab === 'informacion'" class="tab-panel">
        <div class="info-grid">
          <div class="info-card">
            <h3>Información del Cliente</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Razón social</span>
                <span class="info-value">{{ cliente?.razonSocial || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">NIT</span>
                <span class="info-value mono">{{ cliente?.nit || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Ciudad</span>
                <span class="info-value">{{ cliente?.ciudad || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Departamento</span>
                <span class="info-value">{{ cliente?.departamento || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Dirección</span>
                <span class="info-value">{{ cliente?.direccion || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Teléfono</span>
                <span class="info-value">{{ cliente?.telefono || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Correo electrónico</span>
                <span class="info-value">{{ cliente?.correo || '-' }}</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Información del Proyecto</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Código</span>
                <span class="info-value mono">{{ proyecto.code }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Oferta</span>
                <span class="info-value mono">{{ proyecto.offer || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tipo de proyecto</span>
                <span class="info-value">{{ proyecto.projectType }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Norma</span>
                <span class="info-value">{{ proyecto.norm }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estado</span>
                <span class="info-value">
                  <span class="status-badge-sm">
                    {{ proyecto.status }}
                  </span>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Responsable</span>
                <span class="info-value">{{ proyecto.responsible }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fecha de inicio</span>
                <span class="info-value">{{ formatDate(proyecto.startDate) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fecha de finalización</span>
                <span class="info-value">{{ proyecto.endDate ? formatDate(proyecto.endDate) : '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Valor total</span>
                <span class="info-value highlight">{{ formatCurrency(proyecto.totalCost) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SERVICIOS -->
      <div v-if="activeTab === 'servicios'" class="tab-panel">
        <div class="section-header">
          <h3>Servicios ({{ servicios.length }})</h3>
          <span class="total-value">Valor total: {{ formatCurrency(proyecto.totalCost) }}</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Norma</th>
                <th>Colaborador</th>
                <th>Cantidad</th>
                <th>Valor Unitario</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(servicio, index) in servicios" :key="index">
                <td class="service-name">{{ servicio.name }}</td>
                <td>{{ servicio.norm }}</td>
                <td>{{ servicio.collaborator }}</td>
                <td>{{ servicio.quantity }}</td>
                <td>{{ formatCurrency(servicio.unitPrice) }}</td>
                <td class="value-cell">{{ formatCurrency(servicio.totalPrice) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="total-label">Total</td>
                <td class="total-value">{{ formatCurrency(totalServicios) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- CONTACTOS -->
      <div v-if="activeTab === 'contactos'" class="tab-panel">
        <div class="section-header">
          <h3>Contactos ({{ contactos.length }})</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Principal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contacto in contactos" :key="contacto.id">
                <td class="contact-name">{{ contacto.nombre }}</td>
                <td>{{ contacto.cargo }}</td>
                <td class="mono">{{ contacto.telefono }}</td>
                <td>{{ contacto.correo }}</td>
                <td>
                  <span v-if="contacto.esPrincipal" class="principal-badge">Principal</span>
                  <span v-else class="secondary-text">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="contactos.length === 0" class="empty-tab">
          <p>No hay contactos registrados para este proyecto.</p>
        </div>
      </div>

      <!-- DOCUMENTOS -->
      <div v-if="activeTab === 'documentos'" class="tab-panel">
        <div class="section-header">
          <h3>Documentos ({{ documentos.length }})</h3>
        </div>
        <div class="docs-grid">
          <div v-for="doc in documentos" :key="doc.id" class="doc-card">
            <div class="doc-icon" :class="getDocColor(doc.tipo)">
              <span v-html="getDocIcon(doc.tipo)"></span>
            </div>
            <div class="doc-info">
              <span class="doc-name">{{ doc.nombre }}</span>
              <span class="doc-meta">{{ formatFileSize(doc.tamano) }} · {{ formatDate(doc.fecha) }}</span>
              <span class="doc-user">{{ doc.usuario }}</span>
            </div>
            <button class="doc-action" title="Descargar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
          </div>
        </div>
        <div v-if="documentos.length === 0" class="empty-tab">
          <p>No hay documentos cargados para este proyecto.</p>
        </div>
      </div>

      <!-- SEGUIMIENTO -->
      <div v-if="activeTab === 'seguimiento'" class="tab-panel">
        <div class="section-header">
          <h3>Seguimiento ({{ actividades.length }})</h3>
        </div>
        <div class="timeline">
          <div v-for="actividad in actividades" :key="actividad.id" class="timeline-item">
            <div class="timeline-dot" :class="getActivityColor(actividad.tipo)"></div>
            <div class="timeline-content">
              <span class="timeline-date">{{ formatDateTime(actividad.fecha) }}</span>
              <span class="timeline-text">{{ actividad.descripcion }}</span>
              <span class="timeline-user">{{ actividad.usuario }}</span>
            </div>
          </div>
        </div>
        <div v-if="actividades.length === 0" class="empty-tab">
          <p>No hay actividades registradas para este proyecto.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-else-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>Cargando proyecto...</p>
  </div>

  <!-- Not Found -->
  <div v-else class="empty-state">
    <h3>Proyecto no encontrado</h3>
    <router-link to="/admin/proyectos" class="btn-primary">Volver a Proyectos</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCRM } from '@/composables/useCRM'
import { mockServicios } from '@/mock/services'
import { mockContactosProyecto } from '@/mock/contacts'
import { mockDocumentosProyecto } from '@/mock/documents'
import { mockActividades } from '@/mock/activities'
import type { Proyecto, Cliente, ServicioProyecto, ContactoProyecto, DocumentoProyecto, ActividadProyecto } from '@/types/crmTypes'

const props = defineProps<{ projectId?: number }>()

const route = useRoute()
const { loading, fetchCliente, fetchProyecto } = useCRM()

const proyecto = ref<Proyecto | null>(null)
const cliente = ref<Cliente | null>(null)
const servicios = ref<ServicioProyecto[]>([])
const contactos = ref<ContactoProyecto[]>([])
const documentos = ref<DocumentoProyecto[]>([])
const actividades = ref<ActividadProyecto[]>([])
const activeTab = ref('informacion')

const tabs = computed(() => [
  { id: 'informacion', label: 'Información', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' },
  { id: 'servicios', label: 'Servicios', count: servicios.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
  { id: 'contactos', label: 'Contactos', count: contactos.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { id: 'documentos', label: 'Documentos', count: documentos.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 'seguimiento', label: 'Seguimiento', count: actividades.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
])

const totalServicios = computed(() => {
  return servicios.value.reduce((sum, s) => sum + s.totalPrice, 0)
})

async function loadProjectData(projectId: number) {
  proyecto.value = await fetchProyecto(projectId)
  if (!proyecto.value) return

  cliente.value = await fetchCliente(proyecto.value.clientId)
  servicios.value = proyecto.value.services || []
  contactos.value = []
  documentos.value = mockDocumentosProyecto.filter((d) => d.proyectoId === projectId)
  actividades.value = mockActividades
    .filter((a) => a.proyectoId === projectId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatCurrency(value: number | undefined): string {
  if (!value) return '-'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function getDocIcon(tipo: string): string {
  const icons: Record<string, string> = {
    oferta: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    contrato: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    informe: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    certificado: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    acta: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    presentacion: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  }
  return icons[tipo] || icons.informe
}

function getDocColor(tipo: string): string {
  const colors: Record<string, string> = {
    oferta: 'blue',
    contrato: 'amber',
    informe: 'green',
    certificado: 'purple',
    acta: 'teal',
    presentacion: 'orange',
  }
  return colors[tipo] || 'gray'
}

function getActivityColor(tipo: string): string {
  const colors: Record<string, string> = {
    proyecto_creado: 'green',
    oferta_enviada: 'blue',
    oferta_aprobada: 'green',
    reunion: 'amber',
    documento_agregado: 'teal',
    visita: 'orange',
    proyecto_finalizado: 'green',
    proyecto_actualizado: 'blue',
  }
  return colors[tipo] || 'gray'
}

onMounted(async () => {
  const id = props.projectId || Number(route.params.id)
  if (id) await loadProjectData(id)
})

watch(() => props.projectId, async (newId) => {
  if (newId) {
    activeTab.value = 'informacion'
    await loadProjectData(newId)
  }
})
</script>

<style scoped>
.project-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== BACK ===== */
.back-section {
  margin-bottom: -8px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--c-gray);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.15s;
}
.back-link:hover { color: var(--c-primary); }

/* ===== HEADER ===== */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.project-code-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.project-code {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-primary);
  background: rgba(200, 155, 45, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.separator {
  color: var(--c-gray-light);
}

.project-oferta {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: var(--c-gray);
}

.project-client {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 4px;
}

.project-type {
  font-size: 0.95rem;
  color: var(--c-gray);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-badge-sm {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--c-white);
  color: var(--c-black);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { border-color: var(--c-gray-light); }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--c-primary-hover); }

/* ===== SUMMARY CARDS ===== */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.summary-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 20px 16px;
  text-align: center;
}

.summary-card.highlight {
  background: rgba(200, 155, 45, 0.05);
  border-color: rgba(200, 155, 45, 0.2);
}

.summary-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.summary-value {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-black);
}

.summary-card.highlight .summary-value {
  color: var(--c-primary);
  font-size: 1.05rem;
}

/* ===== TABS ===== */
.tabs-bar {
  display: flex;
  gap: 4px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 6px;
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--c-gray);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab-btn:hover { background: var(--c-light); color: var(--c-black); }
.tab-btn.active { background: var(--c-primary); color: white; font-weight: 600; }

.tab-icon { display: flex; align-items: center; }

.tab-count {
  font-size: 0.72rem;
  background: rgba(0,0,0,0.08);
  padding: 1px 6px;
  border-radius: 10px;
}
.tab-btn.active .tab-count { background: rgba(255,255,255,0.25); }

/* ===== TAB CONTENT ===== */
.tab-content {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  background: var(--c-light);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 24px;
}

.info-card h3 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.info-label {
  font-size: 0.82rem;
  color: var(--c-gray);
}

.info-value {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--c-black);
}
.info-value.mono { font-family: 'Courier New', monospace; }
.info-value.highlight { color: var(--c-primary); font-weight: 600; }

/* ===== SECTION HEADER ===== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-black);
}

.total-value {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--c-primary);
}

/* ===== DATA TABLE ===== */
.table-responsive { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--c-light);
  border-bottom: 1px solid var(--c-border);
}

.data-table td {
  padding: 12px 14px;
  font-size: 0.85rem;
  color: var(--c-black);
  border-bottom: 1px solid var(--c-border);
}

.data-table tr:last-child td { border-bottom: none; }

.data-table tfoot td {
  font-weight: 700;
  background: var(--c-light);
}

.service-name { font-weight: 600; }
.value-cell { font-weight: 600; }
.contact-name { font-weight: 600; }
.mono { font-family: 'Courier New', monospace; }

.principal-badge {
  background: rgba(200, 155, 45, 0.1);
  color: var(--c-primary);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.secondary-text { color: var(--c-gray-light); }

.total-label { text-align: right; }
.total-value { font-weight: 700; color: var(--c-primary); }

/* ===== DOCS GRID ===== */
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.doc-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--c-light);
  border-radius: 10px;
  transition: background 0.15s;
}
.doc-card:hover { background: var(--c-border); }

.doc-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.doc-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.doc-icon.amber { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.doc-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
.doc-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
.doc-icon.teal { background: rgba(20, 184, 166, 0.1); color: #14B8A6; }
.doc-icon.orange { background: rgba(249, 115, 22, 0.1); color: #F97316; }
.doc-icon.gray { background: rgba(107, 114, 128, 0.1); color: #6B7280; }

.doc-info { flex: 1; min-width: 0; }
.doc-name { display: block; font-size: 0.85rem; font-weight: 500; color: var(--c-black); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-meta { display: block; font-size: 0.75rem; color: var(--c-gray); margin-top: 2px; }
.doc-user { display: block; font-size: 0.72rem; color: var(--c-gray-light); margin-top: 2px; }

.doc-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--c-gray);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.doc-action:hover { background: var(--c-white); color: var(--c-primary); }

/* ===== TIMELINE ===== */
.timeline {
  position: relative;
  padding-left: 24px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--c-border);
}

.timeline-item {
  position: relative;
  padding: 0 0 24px 24px;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--c-white);
}
.timeline-dot.green { background: #10B981; }
.timeline-dot.blue { background: #3B82F6; }
.timeline-dot.purple { background: #8B5CF6; }
.timeline-dot.amber { background: #F59E0B; }
.timeline-dot.orange { background: #F97316; }
.timeline-dot.teal { background: #14B8A6; }
.timeline-dot.gray { background: #6B7280; }

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-date {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
}

.timeline-text {
  font-size: 0.88rem;
  color: var(--c-black);
}

.timeline-user {
  font-size: 0.78rem;
  color: var(--c-gray-light);
}

/* ===== EMPTY & LOADING ===== */
.empty-tab {
  text-align: center;
  padding: 40px 20px;
  color: var(--c-gray);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}
.empty-state h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 16px; }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 20px;
  color: var(--c-gray);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--c-border);
  border-top-color: var(--c-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .summary-cards { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .project-header { flex-direction: column; }
  .header-right { flex-direction: column; align-items: flex-start; }
  .summary-cards { grid-template-columns: repeat(2, 1fr); }
  .info-grid { grid-template-columns: 1fr; }
  .tabs-bar { overflow-x: auto; }
}

@media (max-width: 480px) {
  .summary-cards { grid-template-columns: 1fr; }
}
</style>
