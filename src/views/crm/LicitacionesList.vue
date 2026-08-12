<template>
  <div class="licitaciones-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Licitaciones</h1>
        <p class="page-subtitle">{{ filteredLicitaciones.length }} licitaciones registradas</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Buscar por cliente, número de proceso, servicio o norma..." class="search-input" />
      </div>
      <div class="filter-group">
        <button v-for="f in tipoFilters" :key="f.value" class="filter-chip" :class="{ active: activeTipoFilter === f.value }" @click="activeTipoFilter = f.value">
          {{ f.label }}
        </button>
      </div>
      <div class="filter-group">
        <button v-for="f in estadoFilters" :key="f.value" class="filter-chip" :class="{ active: activeEstadoFilter === f.value }" @click="activeEstadoFilter = f.value">
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="filteredLicitaciones.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <h3>No se encontraron licitaciones</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos' : 'No hay licitaciones registradas' }}</p>
      </div>

      <div v-else>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Oferta</th>
                <th>Tipo</th>
                <th>Número del Proceso</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Norma</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in filteredLicitaciones" :key="l.id">
                <td><span class="oferta-badge">{{ l.oferta || '-' }}</span></td>
                <td><span class="tipo-badge" :class="l.tipo">{{ l.tipoLabel }}</span></td>
                <td><span class="proceso-text">{{ l.numeroProceso || '-' }}</span></td>
                <td class="client-cell">
                  <span class="client-name">{{ l.clienteNombre }}</span>
                </td>
                <td><span class="servicio-text">{{ l.servicio }}</span></td>
                <td><span class="norma-text">{{ l.norma }}</span></td>
                <td>
                  <span class="estado-badge" :class="l.estado">{{ formatEstado(l.estado) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockLicitaciones } from '@/mock/licitaciones'
import type { Licitacion } from '@/types/crmTypes'

const licitaciones = ref<Licitacion[]>(mockLicitaciones)
const searchTerm = ref('')
const activeTipoFilter = ref('todos')
const activeEstadoFilter = ref('todos')

const tipoFilters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Mínima Cuantía', value: 'minima_cuantia' },
  { label: 'Solicitud de Información', value: 'solicitud_informacion' },
  { label: 'Contratación Especial', value: 'contratacion_especial' },
]

const estadoFilters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Publicada', value: 'publicada' },
  { label: 'En curso', value: 'en_curso' },
  { label: 'Cerrada', value: 'cerrada' },
  { label: 'Adjudicada', value: 'adjudicada' },
  { label: 'Desierta', value: 'desierta' },
  { label: 'Cancelada', value: 'cancelada' },
]

const filteredLicitaciones = computed(() => {
  let result = [...licitaciones.value]

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(
      (l) =>
        l.clienteNombre.toLowerCase().includes(term) ||
        l.numeroProceso.toLowerCase().includes(term) ||
        l.servicio.toLowerCase().includes(term) ||
        l.norma.toLowerCase().includes(term) ||
        (l.oferta && l.oferta.toLowerCase().includes(term)),
    )
  }

  if (activeTipoFilter.value !== 'todos') {
    result = result.filter((l) => l.tipo === activeTipoFilter.value)
  }

  if (activeEstadoFilter.value !== 'todos') {
    result = result.filter((l) => l.estado === activeEstadoFilter.value)
  }

  return result
})

function formatEstado(estado: string): string {
  const labels: Record<string, string> = {
    publicada: 'Publicada',
    en_curso: 'En curso',
    cerrada: 'Cerrada',
    adjudicada: 'Adjudicada',
    desierta: 'Desierta',
    cancelada: 'Cancelada',
  }
  return labels[estado] || estado
}
</script>

<style scoped>
.licitaciones-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }

.filters-bar { display: flex; flex-direction: column; gap: 12px; }
.search-box { position: relative; max-width: 480px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px !important; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: var(--c-primary); }
.search-input::placeholder { color: var(--c-gray-light); }
.filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-chip { display: flex; align-items: center; gap: 6px; padding: 6px 14px !important; border: 1px solid var(--c-border); border-radius: 20px; background: var(--c-white); color: var(--c-gray); font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.filter-chip:hover { border-color: var(--c-gray-light); color: var(--c-black); }
.filter-chip.active { background: var(--c-primary); border-color: var(--c-primary); color: white; }

.table-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: 14px; overflow: hidden; }
.table-responsive { overflow-x: auto; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 12px 14px; text-align: left; font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 14px; font-size: 0.85rem; color: var(--c-black); border-bottom: 1px solid var(--c-border); vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(249, 250, 251, 0.5); }

.oferta-badge {
  display: inline-block;
  padding: 4px 10px;
  background: var(--c-light);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}

.tipo-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
.tipo-badge.minima_cuantia { background: #EFF6FF; color: #1D4ED8; }
.tipo-badge.solicitud_informacion { background: #F0FDF4; color: #15803D; }
.tipo-badge.contratacion_especial { background: #FEF3C7; color: #B45309; }

.proceso-text {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: var(--c-gray);
}

.client-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 280px;
}

.client-name {
  font-weight: 600;
  color: var(--c-black);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.servicio-text {
  font-size: 0.85rem;
  color: var(--c-black);
}

.norma-text {
  font-size: 0.82rem;
  color: var(--c-gray);
  white-space: nowrap;
}

.estado-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
}
.estado-badge.publicada { background: #EFF6FF; color: #1D4ED8; }
.estado-badge.en_curso { background: #FEF3C7; color: #B45309; }
.estado-badge.cerrada { background: #F3F4F6; color: #6B7280; }
.estado-badge.adjudicada { background: #F0FDF4; color: #15803D; }
.estado-badge.desierta { background: #FEF2F2; color: #DC2626; }
.estado-badge.cancelada { background: #FEF2F2; color: #991B1B; }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: var(--c-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 60px 20px; color: var(--c-gray); }
.empty-state svg { color: var(--c-gray-light); margin-bottom: 16px; }
.empty-state h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
.empty-state p { font-size: 0.88rem; color: var(--c-gray); }

@media (max-width: 768px) { .page-header { flex-direction: column; align-items: flex-start; } .filter-group { overflow-x: auto; flex-wrap: nowrap; } }
</style>
