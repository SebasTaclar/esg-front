<template>
  <main class="portal-page">
    <!-- Top bar del portal -->
    <header class="portal-topbar">
      <div class="topbar-inner">
        <router-link to="/" class="portal-logo">
          <img src="/images/LOGO_1.jpeg" alt="ESG" class="logo-img" />
          <span class="logo-text">Portal Clientes</span>
        </router-link>
        <div class="topbar-user">
          <div class="user-avatar">
            <span>{{ clientInitials }}</span>
          </div>
          <div class="user-info">
            <span class="user-name">{{ clientData.name }}</span>
            <span class="user-role">{{ clientData.company }}</span>
          </div>
          <button class="btn-logout" @click="handleLogout" title="Cerrar sesión">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="portal-container">
      <!-- Bienvenida -->
      <section class="welcome-section">
        <div class="welcome-content">
          <h1>Bienvenido, {{ clientData.name }} 👋</h1>
          <p>{{ clientData.company }} — NIT {{ clientData.nit }}</p>
          <div class="welcome-stats">
            <div class="w-stat">
              <span class="w-stat-value">{{ services.length }}</span>
              <span class="w-stat-label">Servicios</span>
            </div>
            <div class="w-stat">
              <span class="w-stat-value">{{ certificates.length }}</span>
              <span class="w-stat-label">Certificados</span>
            </div>
            <div class="w-stat">
              <span class="w-stat-value">{{ documents.length }}</span>
              <span class="w-stat-label">Documentos</span>
            </div>
          </div>
        </div>
        <div class="welcome-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
      </section>

      <!-- Navegación de tabs -->
      <nav class="portal-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon" v-html="tab.icon"></span>
          {{ tab.label }}
        </button>
      </nav>

      <!-- ========== SERVICIOS ========== -->
      <section v-if="activeTab === 'servicios'" class="portal-section">
        <div class="section-header">
          <h2>Servicios con ESG</h2>
          <p>Historial de servicios contratados y en curso.</p>
        </div>

        <div class="services-grid">
          <div v-for="s in services" :key="s.id" class="service-card">
            <div class="service-header">
              <div class="service-icon" :class="s.statusClass">
                <span v-html="s.icon"></span>
              </div>
              <span class="service-status" :class="s.statusClass">{{ s.status }}</span>
            </div>
            <h3 class="service-name">{{ s.name }}</h3>
            <p class="service-norm">{{ s.norm }}</p>
            <div class="service-meta">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ s.startDate }} — {{ s.endDate }}
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {{ s.responsible }}
              </div>
            </div>
            <div class="service-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: s.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ s.progress }}%</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== CERTIFICADOS / INFORMES ========== -->
      <section v-if="activeTab === 'certificados'" class="portal-section">
        <div class="section-header">
          <h2>Certificados e Informes</h2>
          <p>Certificados emitidos e informes generados por ESG.</p>
        </div>

        <div class="cert-list">
          <div v-for="c in certificates" :key="c.id" class="cert-card">
            <div class="cert-icon" :class="c.typeClass">
              <span v-html="c.icon"></span>
            </div>
            <div class="cert-info">
              <h4 class="cert-name">{{ c.name }}</h4>
              <p class="cert-detail">{{ c.service }} — {{ c.norm }}</p>
              <span class="cert-date">Emitido: {{ c.date }}</span>
            </div>
            <div class="cert-actions">
              <span class="cert-badge" :class="c.typeClass">{{ c.type }}</span>
              <button class="cert-download" title="Descargar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== DOCUMENTOS ========== -->
      <section v-if="activeTab === 'documentos'" class="portal-section">
        <div class="section-header">
          <h2>Documentos</h2>
          <p>Documentos cargados en sus proyectos.</p>
        </div>

        <div class="doc-filters">
          <button
            v-for="f in docFilters"
            :key="f.value"
            class="doc-filter-btn"
            :class="{ active: docFilter === f.value }"
            @click="docFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="table-card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Proyecto</th>
                  <th>Tipo</th>
                  <th>Tamaño</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in filteredDocuments" :key="d.id">
                  <td class="doc-name-cell">
                    <div class="doc-icon" :class="d.typeClass">
                      <span v-html="d.icon"></span>
                    </div>
                    {{ d.name }}
                  </td>
                  <td>{{ d.project }}</td>
                  <td><span class="doc-type-badge" :class="d.typeClass">{{ d.type }}</span></td>
                  <td class="doc-size">{{ d.size }}</td>
                  <td class="doc-date">{{ d.date }}</td>
                  <td>
                    <div class="doc-actions">
                      <button class="doc-action" title="Ver">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button class="doc-action" title="Descargar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredDocuments.length === 0">
                  <td colspan="6" class="empty-row">No hay documentos para mostrar.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api'

defineOptions({ name: 'ClientPortalView' })

const router = useRouter()

const clientData = ref({
  name: 'Juan Pérez',
  company: 'EBM Metrology S.A.S.',
  nit: '901234567-8',
})

const clientInitials = computed(() => {
  const parts = clientData.value.name.split(' ')
  return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')
})

const activeTab = ref('servicios')
const docFilter = ref('todos')

const tabs = [
  { id: 'servicios', label: 'Servicios', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
  { id: 'certificados', label: 'Certificados e Informes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
  { id: 'documentos', label: 'Documentos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
]

// ========== SERVICIOS ==========
const services = ref([
  {
    id: 1,
    name: 'Implementación Sistema de Gestión de Calidad',
    norm: 'ISO 9001:2015',
    status: 'En ejecución',
    statusClass: 'active',
    responsible: 'Camila Rodríguez',
    startDate: '01 Mar 2025',
    endDate: '30 Sep 2025',
    progress: 65,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  },
  {
    id: 2,
    name: 'Auditoría Interna Laboratorio',
    norm: 'ISO/IEC 17025:2017',
    status: 'Finalizado',
    statusClass: 'completed',
    responsible: 'Luis Eduardo',
    startDate: '10 Ene 2025',
    endDate: '15 Mar 2025',
    progress: 100,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  },
  {
    id: 3,
    name: 'Capacitación Seguridad y Salud en el Trabajo',
    norm: 'ISO 45001:2018',
    status: 'Programado',
    statusClass: 'scheduled',
    responsible: 'María Paula',
    startDate: '01 Ago 2025',
    endDate: '15 Ago 2025',
    progress: 0,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  },
  {
    id: 4,
    name: 'Consultoría Gestión Ambiental',
    norm: 'ISO 14001:2015',
    status: 'En ejecución',
    statusClass: 'active',
    responsible: 'Camila Rodríguez',
    startDate: '15 Jun 2025',
    endDate: '15 Dic 2025',
    progress: 30,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  },
])

// ========== CERTIFICADOS ==========
const certificates = ref([
  { id: 1, name: 'Certificado de Conformidad ISO 9001:2015', service: 'Implementación SG', norm: 'ISO 9001:2015', type: 'Certificado', typeClass: 'certificate', date: '20 Dic 2024', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>' },
  { id: 2, name: 'Informe de Auditoría Interna – Laboratorio', service: 'Auditoría Interna', norm: 'ISO/IEC 17025:2017', type: 'Informe', typeClass: 'report', date: '15 Mar 2025', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 3, name: 'Certificado de Acreditación Laboratorio', service: 'Acreditación', norm: 'ISO/IEC 17025:2017', type: 'Certificado', typeClass: 'certificate', date: '10 Feb 2025', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>' },
  { id: 4, name: 'Informe de Capacitación ISO 45001', service: 'Capacitación SST', norm: 'ISO 45001:2018', type: 'Informe', typeClass: 'report', date: '28 Jul 2025', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 5, name: 'Certificado de Conformidad ISO 14001:2015', service: 'Gestión Ambiental', norm: 'ISO 14001:2015', type: 'Certificado', typeClass: 'certificate', date: '01 Jul 2025', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>' },
])

// ========== DOCUMENTOS ==========
const documents = ref([
  { id: 1, name: 'Manual de Calidad v3.0.pdf', project: 'Implementación SG', type: 'Manual', typeClass: 'manual', size: '1.2 MB', date: '20 Jul 2025', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 2, name: 'Procedimiento Control de Documentos.pdf', project: 'Implementación SG', type: 'Procedimiento', typeClass: 'procedure', size: '450 KB', date: '18 Jul 2025', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 3, name: 'Acta de Reunión Arranque Proyecto.pdf', project: 'Implementación SG', type: 'Acta', typeClass: 'acta', size: '95 KB', date: '05 Mar 2025', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 4, name: 'Plan de Auditoría Interna.pdf', project: 'Auditoría Interna', type: 'Plan', typeClass: 'plan', size: '320 KB', date: '10 Ene 2025', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 5, name: 'Informe de Hallazgos Auditoría.pdf', project: 'Auditoría Interna', type: 'Informe', typeClass: 'report', size: '780 KB', date: '15 Mar 2025', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 6, name: 'Material Capacitación ISO 45001.pptx', project: 'Capacitación SST', type: 'Presentación', typeClass: 'presentation', size: '4.5 MB', date: '28 Jul 2025', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 7, name: 'Registro de Capacitados.pdf', project: 'Capacitación SST', type: 'Registro', typeClass: 'acta', size: '180 KB', date: '28 Jul 2025', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 8, name: 'Cotización Consultoría Ambiental.pdf', project: 'Gestión Ambiental', type: 'Cotización', typeClass: 'procedure', size: '275 KB', date: '15 Jun 2025', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
])

const docFilters = [
  { value: 'todos', label: 'Todos' },
  { value: 'manual', label: 'Manuales' },
  { value: 'procedure', label: 'Procedimientos' },
  { value: 'report', label: 'Informes' },
  { value: 'acta', label: 'Actas' },
  { value: 'plan', label: 'Planes' },
  { value: 'presentation', label: 'Presentaciones' },
]

const filteredDocuments = computed(() => {
  if (docFilter.value === 'todos') return documents.value
  return documents.value.filter(d => d.typeClass === docFilter.value)
})

function handleLogout() {
  if (confirm('¿Estás seguro de cerrar sesión?')) {
    authService.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.portal-page {
  min-height: 100vh;
  background: #F7F6F3;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2F2F2F;
}

/* ===== TOPBAR ===== */
.portal-topbar {
  background: #FFFFFF;
  border-bottom: 1px solid #E8E8E8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.portal-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-img {
  height: 36px;
  width: auto;
  border-radius: 6px;
}

.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: #2F2F2F;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #C89B2D;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar span {
  color: #FFF;
  font-size: 13px;
  font-weight: 700;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #2F2F2F;
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: #888;
}

.btn-logout {
  background: none;
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: #888;
  transition: all 0.2s;
}

.btn-logout:hover {
  color: #DC2626;
  border-color: #DC2626;
  background: rgba(220, 38, 38, 0.05);
}

/* ===== CONTAINER ===== */
.portal-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

/* ===== WELCOME ===== */
.welcome-section {
  background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
  border-radius: 16px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  color: #FFF;
}

.welcome-content h1 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 6px;
}

.welcome-content > p {
  font-size: 14px;
  color: #AAA;
  margin: 0 0 24px;
}

.welcome-stats {
  display: flex;
  gap: 32px;
}

.w-stat {
  display: flex;
  flex-direction: column;
}

.w-stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #C89B2D;
  line-height: 1;
}

.w-stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.welcome-icon {
  opacity: 0.15;
  color: #C89B2D;
}

/* ===== TABS ===== */
.portal-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  border-bottom: 2px solid #E8E8E8;
  padding-bottom: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-size: 14px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.tab-btn:hover {
  color: #2F2F2F;
}

.tab-btn.active {
  color: #C89B2D;
  border-bottom-color: #C89B2D;
}

.tab-icon {
  display: flex;
  align-items: center;
}

/* ===== SECTIONS ===== */
.portal-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 800;
  color: #2F2F2F;
  margin: 0 0 4px;
}

.section-header p {
  font-size: 14px;
  color: #888;
  margin: 0;
}

/* ===== SERVICES GRID ===== */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.service-card {
  background: #FFF;
  border: 1px solid #E8E8E8;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.25s ease;
}

.service-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.service-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.service-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon.active { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.service-icon.completed { background: rgba(16, 185, 129, 0.1); color: #10B981; }
.service-icon.scheduled { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }

.service-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.service-status.active { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.service-status.completed { background: rgba(16, 185, 129, 0.1); color: #059669; }
.service-status.scheduled { background: rgba(245, 158, 11, 0.1); color: #D97706; }

.service-name {
  font-size: 15px;
  font-weight: 700;
  color: #2F2F2F;
  margin: 0 0 4px;
}

.service-norm {
  font-size: 13px;
  color: #C89B2D;
  font-weight: 600;
  margin: 0 0 14px;
}

.service-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
}

.service-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #F0F0F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #C89B2D;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 700;
  color: #888;
  min-width: 32px;
  text-align: right;
}

/* ===== CERTIFICATES ===== */
.cert-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cert-card {
  background: #FFF;
  border: 1px solid #E8E8E8;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.cert-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.cert-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cert-icon.certificate { background: rgba(200, 155, 45, 0.1); color: #C89B2D; }
.cert-icon.report { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }

.cert-info {
  flex: 1;
}

.cert-name {
  font-size: 14px;
  font-weight: 700;
  color: #2F2F2F;
  margin: 0 0 2px;
}

.cert-detail {
  font-size: 12px;
  color: #888;
  margin: 0 0 2px;
}

.cert-date {
  font-size: 11px;
  color: #AAA;
}

.cert-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cert-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.cert-badge.certificate { background: rgba(200, 155, 45, 0.1); color: #A88224; }
.cert-badge.report { background: rgba(59, 130, 246, 0.1); color: #2563EB; }

.cert-download {
  background: none;
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: #888;
  transition: all 0.2s;
}

.cert-download:hover {
  color: #C89B2D;
  border-color: #C89B2D;
}

/* ===== DOCUMENTS ===== */
.doc-filters {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.doc-filter-btn {
  padding: 6px 14px;
  border: 1px solid #E8E8E8;
  border-radius: 20px;
  background: #FFF;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.doc-filter-btn:hover {
  color: #2F2F2F;
  border-color: #CCC;
}

.doc-filter-btn.active {
  background: #C89B2D;
  color: #FFF;
  border-color: #C89B2D;
}

.table-card {
  background: #FFF;
  border: 1px solid #E8E8E8;
  border-radius: 14px;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #FAFAF8;
  border-bottom: 1px solid #E8E8E8;
  white-space: nowrap;
}

.data-table td {
  padding: 14px 16px;
  font-size: 13px;
  color: #2F2F2F;
  border-bottom: 1px solid #F0F0F0;
  vertical-align: middle;
}

.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(250, 250, 248, 0.5); }

.doc-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.doc-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-icon.manual { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
.doc-icon.procedure { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.doc-icon.report { background: rgba(16, 185, 129, 0.1); color: #10B981; }
.doc-icon.acta { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.doc-icon.plan { background: rgba(239, 68, 68, 0.1); color: #EF4444; }
.doc-icon.presentation { background: rgba(200, 155, 45, 0.1); color: #C89B2D; }

.doc-type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.doc-type-badge.manual { background: rgba(139, 92, 246, 0.1); color: #7C3AED; }
.doc-type-badge.procedure { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.doc-type-badge.report { background: rgba(16, 185, 129, 0.1); color: #059669; }
.doc-type-badge.acta { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.doc-type-badge.plan { background: rgba(239, 68, 68, 0.1); color: #DC2626; }
.doc-type-badge.presentation { background: rgba(200, 155, 45, 0.1); color: #A88224; }

.doc-size {
  color: #888;
  white-space: nowrap;
}

.doc-date {
  color: #888;
  white-space: nowrap;
}

.doc-actions {
  display: flex;
  gap: 4px;
}

.doc-action {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #888;
  border-radius: 6px;
  transition: all 0.2s;
}

.doc-action:hover {
  background: #F5F5F5;
  color: #C89B2D;
}

.empty-row {
  text-align: center;
  padding: 32px !important;
  color: #AAA !important;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .topbar-inner { padding: 0 16px; }
  .user-info { display: none; }
  .portal-container { padding: 20px 16px; }
  .welcome-section { flex-direction: column; text-align: center; padding: 28px 20px; }
  .welcome-stats { justify-content: center; }
  .welcome-icon { display: none; }
  .portal-tabs { overflow-x: auto; }
  .tab-btn { white-space: nowrap; padding: 10px 14px; font-size: 13px; }
  .services-grid { grid-template-columns: 1fr; }
  .cert-card { flex-direction: column; align-items: flex-start; }
  .cert-actions { width: 100%; justify-content: space-between; }
}

@media (max-width: 480px) {
  .welcome-content h1 { font-size: 20px; }
  .w-stat-value { font-size: 22px; }
  .welcome-stats { gap: 20px; }
}
</style>
