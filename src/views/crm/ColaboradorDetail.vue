<template>
  <div class="colaborador-detail" v-if="colaborador">
    <!-- Back Link (only when used as route component) -->
    <div v-if="!colaboradorId" class="back-section">
      <router-link to="/admin/crm/colaboradores" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver a colaboradores
      </router-link>
    </div>

    <!-- Header -->
    <div class="detail-header">
      <div class="header-left">
        <h1 class="colaborador-name">{{ colaborador.nombre }}</h1>
        <p class="colaborador-studies">{{ colaborador.estudios }}</p>
        <p class="colaborador-area">Área: {{ colaborador.areaPrincipal }}</p>
      </div>
      <div class="header-right">
        <span class="estado-badge" :class="colaborador.estado">{{ formatEstado(colaborador.estado) }}</span>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <span class="summary-label">Ciudad</span>
        <span class="summary-value">{{ colaborador.ciudad }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Celular</span>
        <span class="summary-value">{{ colaborador.celular }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Correo</span>
        <span class="summary-value">{{ colaborador.correo }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Competencias</span>
        <span class="summary-value">{{ colaborador.competencias.length }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Documentos</span>
        <span class="summary-value">{{ documentosCompletos }} / {{ colaborador.documentos.length }}</span>
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
            <h3>Datos Personales</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Nombre</span>
                <span class="info-value">{{ colaborador.nombre }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estudios</span>
                <span class="info-value">{{ colaborador.estudios }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Área principal</span>
                <span class="info-value">{{ colaborador.areaPrincipal }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Ciudad</span>
                <span class="info-value">{{ colaborador.ciudad }}</span>
              </div>
            </div>
          </div>
          <div class="info-card">
            <h3>Información de Contacto</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Celular</span>
                <span class="info-value">{{ colaborador.celular }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Correo electrónico</span>
                <span class="info-value">{{ colaborador.correo }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- COMPETENCIAS -->
      <div v-if="activeTab === 'competencias'" class="tab-panel">
        <div class="section-header">
          <h3>Competencias ({{ colaborador.competencias.length }})</h3>
        </div>
        <div v-if="colaborador.competencias.length === 0" class="empty-tab">
          <p>No hay competencias registradas</p>
        </div>
        <div v-else class="competencias-grid">
          <div v-for="comp in agrupadoPorNorma" :key="comp.norma" class="competencia-card">
            <div class="competencia-header">
              <span class="competencia-area">{{ comp.area }}</span>
              <span class="competencia-norma">{{ comp.norma }}</span>
            </div>
            <p class="competencia-desc">{{ comp.descripcion }}</p>
          </div>
        </div>
      </div>

      <!-- EXPERIENCIA -->
      <div v-if="activeTab === 'experiencia'" class="tab-panel">
        <div class="section-header">
          <h3>Experiencia</h3>
        </div>
        <div class="experiencia-content">
          <p class="info-experience">
            {{ colaborador.nombre }} cuenta con experiencia en {{ colaborador.competencias.length }} competencias
            en el área de {{ colaborador.areaPrincipal }}.
          </p>
          <div v-for="comp in colaborador.competencias" :key="comp.id" class="experiencia-item">
            <div class="exp-norma">{{ comp.norma }}</div>
            <div class="exp-desc">{{ comp.descripcion }}</div>
          </div>
        </div>
      </div>

      <!-- DOCUMENTOS -->
      <div v-if="activeTab === 'documentos'" class="tab-panel">
        <div class="section-header">
          <h3>Documentos ({{ colaborador.documentos.length }})</h3>
          <span class="docs-summary">Completados: {{ documentosCompletos }} | Pendientes: {{ documentosPendientes }} | Faltantes: {{ documentosFaltantes }}</span>
        </div>
        <div v-if="colaborador.documentos.length === 0" class="empty-tab">
          <p>No hay documentos registrados</p>
        </div>
        <div v-else class="docs-grid">
          <div v-for="doc in colaborador.documentos" :key="doc.id" class="doc-card">
            <div class="doc-icon" :class="getDocIconClass(doc.tipo)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="doc-info">
              <span class="doc-name">{{ doc.nombre }}</span>
              <span class="doc-type">{{ formatDocType(doc.tipo) }}</span>
            </div>
            <span class="doc-status" :class="doc.estado">{{ formatDocEstado(doc.estado) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { mockColaboradores } from '@/mock/colaboradores'
import type { Colaborador, CompetenciaColaborador } from '@/types/crmTypes'

const props = defineProps<{ colaboradorId?: number }>()

const activeTab = ref('informacion')
const colaborador = ref<Colaborador | null>(null)

const tabs = computed(() => [
  { id: 'informacion', label: 'Información' },
  { id: 'competencias', label: 'Competencias', count: colaborador.value?.competencias.length ?? 0 },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'documentos', label: 'Documentos', count: colaborador.value?.documentos.length ?? 0 },
])

const documentosCompletos = computed(() => colaborador.value?.documentos.filter(d => d.estado === 'completo').length ?? 0)
const documentosPendientes = computed(() => colaborador.value?.documentos.filter(d => d.estado === 'pendiente').length ?? 0)
const documentosFaltantes = computed(() => colaborador.value?.documentos.filter(d => d.estado === 'faltante').length ?? 0)

const agrupadoPorNorma = computed((): CompetenciaColaborador[] => {
  if (!colaborador.value) return []
  return colaborador.value.competencias
})

function fetchColaborador() {
  const id = props.colaboradorId
  if (id) {
    colaborador.value = mockColaboradores.find(c => c.id === id) || null
  }
}

watch(() => props.colaboradorId, fetchColaborador, { immediate: true })

function formatEstado(estado: string): string {
  const labels: Record<string, string> = {
    disponible: 'Disponible',
    asignado: 'Asignado',
    no_disponible: 'No disponible',
    documentacion_pendiente: 'Doc. pendiente',
    inactivo: 'Inactivo',
  }
  return labels[estado] || estado
}

function formatDocType(tipo: string): string {
  const labels: Record<string, string> = {
    hoja_de_vida: 'Hoja de vida',
    soportes_estudio: 'Soportes de estudio',
    soportes_experiencia: 'Soportes de experiencia',
    certificado: 'Certificado',
  }
  return labels[tipo] || tipo
}

function formatDocEstado(estado: string): string {
  const labels: Record<string, string> = {
    completo: 'Completo',
    pendiente: 'Pendiente',
    faltante: 'Faltante',
  }
  return labels[estado] || estado
}

function getDocIconClass(tipo: string): string {
  const classes: Record<string, string> = {
    hoja_de_vida: 'blue',
    soportes_estudio: 'amber',
    soportes_experiencia: 'green',
    certificado: 'purple',
  }
  return classes[tipo] || 'gray'
}
</script>

<style scoped>
.colaborador-detail { display: flex; flex-direction: column; gap: 24px; }

.back-section { margin-bottom: 8px; }
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--c-gray);
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: var(--c-primary); }

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}
.colaborador-name { font-size: 1.5rem; font-weight: 700; color: var(--c-black); }
.colaborador-studies { font-size: 0.95rem; color: var(--c-gray); margin-top: 4px; }
.colaborador-area { font-size: 0.88rem; color: var(--c-gray); margin-top: 2px; }

.estado-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
}
.estado-badge.disponible { background: #F0FDF4; color: #15803D; }
.estado-badge.asignado { background: #FEF3C7; color: #B45309; }
.estado-badge.no_disponible { background: #EFF6FF; color: #1D4ED8; }
.estado-badge.documentacion_pendiente { background: #FFF7ED; color: #C2410C; }
.estado-badge.inactivo { background: #F3F4F6; color: #6B7280; }

.summary-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.summary-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.summary-card.highlight { background: var(--c-primary-light); border-color: var(--c-primary); }
.summary-label { font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; }
.summary-value { font-size: 0.95rem; font-weight: 600; color: var(--c-black); }
.summary-card.highlight .summary-value { color: var(--c-primary); }

.tabs-bar {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--c-border);
  background: var(--c-white);
  border-radius: 12px 12px 0 0;
  padding: 0 24px;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 20px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--c-gray);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover { color: var(--c-black); }
.tab-btn.active { color: var(--c-primary); border-bottom-color: var(--c-primary); }
.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--c-light);
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-gray);
}
.tab-btn.active .tab-count { background: var(--c-primary-light); color: var(--c-primary); }

.tab-content {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 24px;
}
.tab-panel { display: flex; flex-direction: column; gap: 20px; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.info-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 24px;
}
.info-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 16px;
}
.info-rows { display: flex; flex-direction: column; gap: 0; }
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--c-border);
}
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 0.82rem; color: var(--c-gray); }
.info-value { font-size: 0.88rem; font-weight: 500; color: var(--c-black); text-align: right; }
.info-value.highlight { color: var(--c-primary); font-weight: 700; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.section-header h3 { font-size: 0.95rem; font-weight: 700; color: var(--c-black); }

.competencias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}
.competencia-card {
  background: var(--c-light);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 16px;
}
.competencia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.competencia-area {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.competencia-norma {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
  background: var(--c-white);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--c-border);
}
.competencia-desc {
  font-size: 0.85rem;
  color: var(--c-gray);
  line-height: 1.5;
}

.experiencia-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-experience {
  font-size: 0.88rem;
  color: var(--c-gray);
  line-height: 1.5;
}
.experiencia-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: var(--c-light);
  border-radius: 10px;
}
.exp-norma {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-primary);
  background: var(--c-white);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--c-border);
  white-space: nowrap;
}
.exp-desc {
  font-size: 0.85rem;
  color: var(--c-gray);
  line-height: 1.5;
}

.docs-summary {
  font-size: 0.82rem;
  color: var(--c-gray);
}

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
.doc-icon.gray { background: rgba(107, 114, 128, 0.1); color: #6B7280; }

.doc-info { flex: 1; min-width: 0; }
.doc-name { display: block; font-size: 0.85rem; font-weight: 500; color: var(--c-black); }
.doc-type { display: block; font-size: 0.75rem; color: var(--c-gray); margin-top: 2px; }

.doc-status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
.doc-status.completo { background: #F0FDF4; color: #15803D; }
.doc-status.pendiente { background: #FEF3C7; color: #B45309; }
.doc-status.faltante { background: #FEE2E2; color: #DC2626; }

.empty-tab {
  text-align: center;
  padding: 40px 20px;
  color: var(--c-gray);
}

@media (max-width: 768px) {
  .summary-cards { grid-template-columns: repeat(2, 1fr); }
  .info-grid { grid-template-columns: 1fr; }
  .competencias-grid, .docs-grid { grid-template-columns: 1fr; }
}
</style>
