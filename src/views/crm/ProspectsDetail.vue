<template>
  <div class="client-detail" v-if="cliente">
    <!-- Back & Header -->
    <div class="detail-header">
      <div class="header-left">
        <router-link to="/admin/crm/prospectos" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Prospectos
        </router-link>
        <div class="client-title">
          <div class="client-avatar" :class="cliente.estado">
            {{ getInitials(cliente.razonSocial) }}
          </div>
          <div>
            <h1>{{ cliente.razonSocial }}</h1>
            <span class="client-meta">
              <span class="status-badge" :class="cliente.estado">{{ capitalizeFirst(cliente.estado) }}</span>
              · {{ cliente.nit }}
            </span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link :to="`/admin/crm/clientes/${cliente.id}/editar`" class="btn-outline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </router-link>
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
      <!-- INFO GENERAL -->
      <div v-if="activeTab === 'info'" class="tab-panel">
        <div class="info-grid">
          <div class="info-card">
            <h3>Datos de la Empresa</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Razón Social</span>
                <span class="info-value">{{ cliente.razonSocial }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">NIT</span>
                <span class="info-value mono">{{ cliente.nit }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tipo de organización</span>
                <span class="info-value">{{ cliente.tipoOrganizacion || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Norma</span>
                <span class="info-value">{{ cliente.norma || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estado</span>
                <span class="info-value">
                  <span class="status-badge" :class="cliente.estado">
                    {{ capitalizeFirst(cliente.estado) }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Información de Contacto</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Dirección</span>
                <span class="info-value">{{ cliente.direccion }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Ciudad</span>
                <span class="info-value">{{ cliente.ciudad }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Departamento</span>
                <span class="info-value">{{ cliente.departamento }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Persona de Contacto</span>
                <span class="info-value">{{ contactos.length > 0 ? contactos[0].nombre : '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Teléfono</span>
                <span class="info-value">{{ cliente.telefono }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Correo</span>
                <span class="info-value">{{ cliente.correo }}</span>
              </div>
            </div>
          </div>

          <div class="info-card full-width" v-if="cliente.observaciones">
            <h3>Observaciones</h3>
            <p class="observaciones">{{ cliente.observaciones }}</p>
          </div>
        </div>
      </div>

      <!-- CONTACTOS -->
      <div v-if="activeTab === 'contactos'" class="tab-panel">
        <div class="section-header">
          <h3>Contactos ({{ contactos.length }})</h3>
          <button class="btn-outline-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar Contacto
          </button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Celular</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contacto in contactos" :key="contacto.id">
                <td class="contact-name">{{ contacto.nombre }}</td>
                <td>{{ contacto.cargo }}</td>
                <td class="mono">{{ contacto.celular }}</td>
                <td>{{ contacto.correo }}</td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn" title="Editar" @click="editContact(contacto)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn delete" title="Eliminar" @click="deleteContact(contacto.id)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="contactos.length === 0" class="empty-tab">
          <p>No hay contactos registrados para este prospecto.</p>
        </div>
      </div>

      <!-- COTIZACIONES -->
      <div v-if="activeTab === 'cotizaciones'" class="tab-panel">
        <div class="section-header">
          <h3>Cotizaciones ({{ cotizaciones.length }})</h3>
        </div>
        <div v-if="cotizaciones.length > 0" class="quotes-table-wrap">
          <table class="quotes-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Proyecto</th>
                <th>Valor Total</th>
                <th>Estado</th>
                <th>Vigencia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cot in cotizaciones" :key="cot.id">
                <td class="code-cell">{{ cot.code }}</td>
                <td>{{ cot.project ? cot.project.code + ' - ' + cot.project.description : '-' }}</td>
                <td class="amount-cell">{{ formatCurrency(cot.totalAmount) }}</td>
                <td>
                  <span class="status-badge" :class="'status-' + cot.status">{{ getStatusLabel(cot.status) }}</span>
                </td>
                <td>{{ cot.validUntil ? formatDate(cot.validUntil) : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="cotizaciones.length === 0" class="empty-tab">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3>Cotizaciones</h3>
          <p>No hay cotizaciones registradas para este prospecto.</p>
        </div>
      </div>

      <!-- SEGUIMIENTOS -->
      <div v-if="activeTab === 'seguimientos'" class="tab-panel">
        <div class="section-header">
          <h3>Seguimientos ({{ allSeguimientos.length }})</h3>
        </div>
        <div class="followup-list">
          <div v-for="seg in allSeguimientos" :key="seg.id" class="followup-item">
            <div class="followup-icon" :class="seg.tipo">
              <span v-html="getSeguimientoIcon(seg.tipo)"></span>
            </div>
            <div class="followup-content">
              <div class="followup-header">
                <span class="followup-type">{{ capitalizeFirst(seg.tipo) }}</span>
                <span class="followup-date">{{ formatDate(seg.fecha) }}</span>
              </div>
              <p class="followup-desc">{{ seg.descripcion }}</p>
              <span class="followup-user">{{ seg.usuario }}</span>
            </div>
          </div>
        </div>
        <div v-if="allSeguimientos.length === 0" class="empty-tab">
          <p>No hay seguimientos registrados para este prospecto.</p>
        </div>
      </div>

      <!-- DOCUMENTOS -->
      <div v-if="activeTab === 'documentos'" class="tab-panel">
        <div class="section-header">
          <h3>Documentos ({{ allDocumentos.length }})</h3>
          <button class="btn-outline-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Subir Documento
          </button>
        </div>
        <div class="docs-grid">
          <div v-for="doc in allDocumentos" :key="doc.id" class="doc-card">
            <div class="doc-icon" :class="getDocColor(doc.tipo)">
              <span v-html="getDocIcon(doc.tipo)"></span>
            </div>
            <div class="doc-info">
              <span class="doc-name">{{ doc.nombre }}</span>
              <span class="doc-meta">{{ formatFileSize(doc.tamano) }} · {{ formatDate(doc.createdAt) }}</span>
            </div>
          </div>
        </div>
        <div v-if="allDocumentos.length === 0" class="empty-tab">
          <p>No hay documentos cargados para este prospecto.</p>
        </div>
      </div>

      <!-- CRONOLOGÍA -->
      <div v-if="activeTab === 'cronologia'" class="tab-panel">
        <div class="timeline">
          <div v-for="evento in cronologia" :key="evento.id" class="timeline-item">
            <div class="timeline-dot" :class="getEventColor(evento.tipo)"></div>
            <div class="timeline-content">
              <span class="timeline-text">{{ evento.descripcion }}</span>
              <span class="timeline-meta">
                {{ evento.usuario }} · {{ formatRelativeTime(evento.fecha) }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="cronologia.length === 0" class="empty-tab">
          <p>No hay eventos en la cronología.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-else-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>Cargando prospecto...</p>
  </div>

  <!-- Not Found -->
  <div v-else class="empty-state">
    <h3>Prospecto no encontrado</h3>
    <router-link to="/admin/crm/prospectos" class="btn-primary">Volver a Prospectos</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCRM } from '@/composables/useCRM'
import { projectService } from '@/services/api/projectService'
import { quoteService } from '@/services/api/quoteService'
import type { Cliente, Contacto, Proyecto, Seguimiento, Documento, EventoCronologia, ClientContact, Cotizacion, EstadoCotizacion } from '@/types/crmTypes'

const route = useRoute()
const { loading, fetchCliente, fetchCronologia } = useCRM()

const cliente = ref<Cliente | null>(null)
const contactos = ref<Contacto[]>([])
const proyectos = ref<Proyecto[]>([])
const cotizaciones = ref<Cotizacion[]>([])
const allSeguimientos = ref<Seguimiento[]>([])
const allDocumentos = ref<Documento[]>([])
const cronologia = ref<EventoCronologia[]>([])
const activeTab = ref('info')

const tabs = computed(() => [
  { id: 'info', label: 'Información', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' },
  { id: 'contactos', label: 'Contactos', count: contactos.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { id: 'cotizaciones', label: 'Cotizaciones', count: cotizaciones.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 'seguimientos', label: 'Seguimientos', count: allSeguimientos.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
  { id: 'documentos', label: 'Documentos', count: allDocumentos.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' },
  { id: 'cronologia', label: 'Cronología', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
])

async function loadClientData(clienteId: number) {
  cliente.value = await fetchCliente(clienteId)
  if (!cliente.value) return

  contactos.value = (cliente.value.contacts || []).map((c: ClientContact) => ({
    id: c.id || 0,
    clienteId,
    nombre: c.name || '',
    cargo: c.position || '',
    celular: c.phone || '',
    correo: c.email || '',
    esPrincipal: c.isPrimary || false,
    createdAt: new Date().toISOString(),
  }))
  proyectos.value = await projectService.getByCliente(clienteId)

  try {
    const cotResponse = await quoteService.getByClient(clienteId)
    cotizaciones.value = Array.isArray(cotResponse) ? cotResponse : []
  } catch {
    cotizaciones.value = []
  }

  const allSegs: Seguimiento[] = []
  for (const p of proyectos.value) {
    const segs = await projectService.getSeguimientos(p.id)
    allSegs.push(...segs)
  }
  allSeguimientos.value = allSegs.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  const allDocs: Documento[] = []
  for (const p of proyectos.value) {
    const docs = await projectService.getDocumentos(p.id)
    allDocs.push(...docs)
  }
  allDocumentos.value = allDocs

  cronologia.value = await fetchCronologia('cliente', clienteId)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`
  return `Hace ${Math.floor(diffDays / 365)} años`
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

function capitalizeFirst(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getStatusLabel(status: EstadoCotizacion): string {
  const map: Record<EstadoCotizacion, string> = {
    pendiente: 'Pendiente',
    enviada: 'Enviada',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
    vencida: 'Vencida',
  }
  return map[status] || status
}

function editContact(contacto: Contacto) {
  alert(`Editar contacto: ${contacto.nombre}`)
}

function deleteContact(contactoId: number) {
  if (confirm('¿Estás seguro de eliminar este contacto?')) {
    alert(`Contacto ${contactoId} eliminado`)
  }
}

function getSeguimientoIcon(tipo: string): string {
  const icons: Record<string, string> = {
    llamada: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>',
    correo: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    reunion: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
    visita: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    compromiso: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  }
  return icons[tipo] || icons.compromiso
}

function getDocIcon(tipo: string): string {
  const icons: Record<string, string> = {
    contrato: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    cotizacion: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    informe: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    certificado: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    acta: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    presentacion: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  }
  return icons[tipo] || icons.informe
}

function getDocColor(tipo: string): string {
  const colors: Record<string, string> = {
    contrato: 'blue',
    cotizacion: 'amber',
    informe: 'green',
    certificado: 'purple',
    acta: 'teal',
    presentacion: 'orange',
  }
  return colors[tipo] || 'gray'
}

function getEventColor(tipo: string): string {
  const colors: Record<string, string> = {
    cliente_creado: 'green',
    proyecto_creado: 'blue',
    cotizacion_enviada: 'purple',
    proyecto_aprobado: 'green',
    reunion: 'amber',
    documento_cargado: 'teal',
    proyecto_finalizado: 'green',
    visita: 'orange',
  }
  return colors[tipo] || 'gray'
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await loadClientData(id)
})
</script>

<style scoped>
.client-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== HEADER ===== */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--c-gray);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 12px;
  transition: color 0.15s;
}
.back-link:hover { color: var(--c-primary); }

.client-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.client-avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
}
.client-avatar.activo { background: rgba(16, 185, 129, 0.1); color: #059669; }
.client-avatar.prospecto { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.client-avatar.inactivo { background: rgba(107, 114, 128, 0.1); color: #4B5563; }
.client-avatar.nuevo { background: rgba(234, 179, 8, 0.1); color: #CA8A04; }
.client-avatar.contactado { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.client-avatar.en_diagnostico { background: rgba(139, 92, 246, 0.1); color: #7C3AED; }
.client-avatar.cotizacion_enviada { background: rgba(249, 115, 22, 0.1); color: #EA580C; }
.client-avatar.en_negociacion { background: rgba(180, 83, 9, 0.1); color: #B45309; }
.client-avatar.ganado { background: rgba(16, 185, 129, 0.1); color: #059669; }
.client-avatar.perdido { background: rgba(239, 68, 68, 0.1); color: #DC2626; }
.client-avatar.en_pausa { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

.client-title h1 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--c-black);
}

.client-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--c-gray);
  margin-top: 4px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

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

.btn-outline-sm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--c-white);
  color: var(--c-black);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline-sm:hover { border-color: var(--c-primary); color: var(--c-primary); }

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status-badge.activo { background: rgba(16, 185, 129, 0.1); color: #059669; }
.status-badge.prospecto { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.status-badge.inactivo { background: rgba(107, 114, 128, 0.1); color: #4B5563; }
.status-badge.nuevo { background: rgba(234, 179, 8, 0.1); color: #CA8A04; }
.status-badge.contactado { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.status-badge.en_diagnostico { background: rgba(139, 92, 246, 0.1); color: #7C3AED; }
.status-badge.cotizacion_enviada { background: rgba(249, 115, 22, 0.1); color: #EA580C; }
.status-badge.en_negociacion { background: rgba(180, 83, 9, 0.1); color: #B45309; }
.status-badge.ganado { background: rgba(16, 185, 129, 0.1); color: #059669; }
.status-badge.perdido { background: rgba(239, 68, 68, 0.1); color: #DC2626; }
.status-badge.en_pausa { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

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
  border-radius: 12px;
  padding: 20px;
}
.info-card.full-width { grid-column: 1 / -1; }

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
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.info-value.link { color: var(--c-primary); }

.observaciones {
  font-size: 0.88rem;
  color: var(--c-gray);
  line-height: 1.6;
}

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

.code-cell { font-family: 'Courier New', monospace; font-weight: 700; color: var(--c-primary); }
.date-cell { color: var(--c-gray); white-space: nowrap; }
.contact-name { font-weight: 600; }

/* ===== FOLLOW-UP LIST ===== */
.followup-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.followup-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: var(--c-light);
  border-radius: 10px;
}

.followup-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.followup-icon.llamada { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.followup-icon.correo { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
.followup-icon.reunion { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.followup-icon.visita { background: rgba(249, 115, 22, 0.1); color: #F97316; }
.followup-icon.compromiso { background: rgba(16, 185, 129, 0.1); color: #10B981; }

.followup-content { flex: 1; min-width: 0; }

.followup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.followup-type { font-weight: 600; font-size: 0.85rem; color: var(--c-black); }
.followup-date { font-size: 0.78rem; color: var(--c-gray); }

.followup-desc {
  font-size: 0.85rem;
  color: var(--c-gray);
  line-height: 1.5;
  margin-bottom: 4px;
}

.followup-user { font-size: 0.75rem; color: var(--c-gray-light); }

/* ===== DOCS GRID ===== */
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.doc-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--c-light);
  border-radius: 10px;
  cursor: pointer;
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
  padding: 0 0 20px 24px;
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

.timeline-text {
  font-size: 0.88rem;
  color: var(--c-black);
}

.timeline-meta {
  font-size: 0.78rem;
  color: var(--c-gray-light);
}

/* ===== ACTIONS ===== */
.actions-cell {
  display: flex;
  gap: 4px;
}

.action-btn {
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
  transition: all 0.2s ease;
}
.action-btn:hover {
  background: var(--c-light);
  color: var(--c-primary);
}
.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* ===== EMPTY & LOADING ===== */
.empty-tab {
  text-align: center;
  padding: 40px 20px;
  color: var(--c-gray);
}
.empty-tab svg { color: var(--c-gray-light); margin-bottom: 12px; }
.empty-tab h3 { font-size: 1rem; font-weight: 600; color: var(--c-black); margin-bottom: 6px; }

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

/* ===== QUOTES TABLE ===== */
.quotes-table-wrap {
  overflow-x: auto;
}

.quotes-table {
  width: 100%;
  border-collapse: collapse;
}

.quotes-table th {
  padding: 12px 14px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--c-light);
  border-bottom: 1px solid var(--c-border);
  white-space: nowrap;
}

.quotes-table td {
  padding: 12px 14px;
  font-size: 0.85rem;
  color: var(--c-black);
  border-bottom: 1px solid var(--c-border);
}

.quotes-table tr:last-child td { border-bottom: none; }
.quotes-table tr:hover td { background: rgba(249, 250, 251, 0.6); }

.quotes-table .code-cell {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--c-primary);
}

.quotes-table .amount-cell {
  font-weight: 700;
  white-space: nowrap;
}

.quotes-table .status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.quotes-table .status-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.quotes-table .status-pendiente { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.quotes-table .status-enviada { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.quotes-table .status-aprobada { background: rgba(16, 185, 129, 0.1); color: #059669; }
.quotes-table .status-rechazada { background: rgba(239, 68, 68, 0.1); color: #DC2626; }
.quotes-table .status-vencida { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .detail-header { flex-direction: column; }
  .info-grid { grid-template-columns: 1fr; }
  .tabs-bar { overflow-x: auto; }
}
</style>