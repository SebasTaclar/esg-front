<template>
  <div class="colaboradores-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Colaboradores</h1>
        <p class="page-subtitle">{{ filteredColaboradores.length }} colaboradores registrados</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Buscar por nombre, área o ciudad..." class="search-input" />
      </div>
      <div class="filter-row">
        <div class="norma-filter-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input v-model="normaSearch" type="text" placeholder="Filtrar por norma..." class="search-input norma-input" />
          <button v-if="normaSearch" class="clear-btn" @click="normaSearch = ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="filter-group">
          <button v-for="f in estadoFilters" :key="f.value" class="filter-chip" :class="{ active: activeFilter === f.value }" @click="activeFilter = f.value">
            {{ f.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="filteredColaboradores.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <h3>No se encontraron colaboradores</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos' : 'No hay colaboradores registrados' }}</p>
      </div>

      <div v-else>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estudios</th>
                <th>Área Principal</th>
                <th>Normas</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in filteredColaboradores" :key="c.id">
                <td class="name-cell">{{ c.nombre }}</td>
                <td>{{ c.estudios }}</td>
                <td>{{ c.areaPrincipal }}</td>
                <td>
                  <div class="normas-cell">
                    <span class="normas-count">{{ c.normasCount }}</span>
                    <div class="normas-popover-wrapper">
                      <button class="eye-btn" title="Ver normas" @click.stop="toggleNormas(c.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <div v-if="openPopoverId === c.id" class="normas-popover" @click.stop>
                        <div class="popover-header">
                          <span class="popover-title">Competencias</span>
                          <button class="popover-close" @click="openPopoverId = null">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                        <ul class="popover-list">
                          <li v-for="comp in c.competencias" :key="comp.id" class="popover-item">
                            <span class="popover-norma">{{ comp.norma }}</span>
                            <span class="popover-area">{{ comp.area }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </td>
                <td>{{ c.ciudad }}</td>
                <td>
                  <span class="estado-badge" :class="c.estado">{{ formatEstado(c.estado) }}</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn" title="Ver" @click="$emit('viewColaborador', c.id)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button class="action-btn" title="Editar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
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
import { mockColaboradores } from '@/mock/colaboradores'
import type { Colaborador } from '@/types/crmTypes'

defineProps<{ inline?: boolean }>()
defineEmits<{ viewColaborador: [id: number] }>()

const colaboradores = ref<Colaborador[]>(mockColaboradores)
const searchTerm = ref('')
const normaSearch = ref('')
const activeFilter = ref('todos')
const openPopoverId = ref<number | null>(null)

function toggleNormas(id: number) {
  openPopoverId.value = openPopoverId.value === id ? null : id
}

const estadoFilters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Disponible', value: 'disponible' },
  { label: 'Asignado', value: 'asignado' },
  { label: 'No disponible', value: 'no_disponible' },
  { label: 'Doc. pendiente', value: 'documentacion_pendiente' },
  { label: 'Inactivo', value: 'inactivo' },
]

const filteredColaboradores = computed(() => {
  let result = [...colaboradores.value]

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.nombre.toLowerCase().includes(term) ||
        c.areaPrincipal.toLowerCase().includes(term) ||
        c.ciudad.toLowerCase().includes(term) ||
        c.estudios.toLowerCase().includes(term),
    )
  }

  if (normaSearch.value) {
    const term = normaSearch.value.toLowerCase()
    result = result.filter((c) =>
      c.competencias.some((comp) => comp.norma.toLowerCase().includes(term)),
    )
  }

  if (activeFilter.value !== 'todos') {
    result = result.filter((c) => c.estado === activeFilter.value)
  }

  return result
})

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
</script>

<style scoped>
.colaboradores-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }

.filters-bar { display: flex; flex-direction: column; gap: 12px; }
.search-box { position: relative; max-width: 480px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px !important; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: var(--c-primary); }
.search-input::placeholder { color: var(--c-gray-light); }
.filter-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.norma-filter-box { position: relative; max-width: 280px; flex-shrink: 0; }
.norma-filter-box .search-icon { left: 12px; }
.norma-input { padding-left: 38px !important; padding-right: 36px !important; font-size: 0.82rem !important; height: 36px; }
.clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; background: none; color: var(--c-gray-light); border-radius: 4px; cursor: pointer; transition: all 0.15s; }
.clear-btn:hover { background: var(--c-light); color: var(--c-black); }
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

.name-cell { font-weight: 600; }

.normas-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
.normas-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--c-light);
  border: 1px solid var(--c-border);
  border-radius: 50%;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
  flex-shrink: 0;
}
.normas-popover-wrapper { position: relative; }
.eye-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: none;
  color: var(--c-gray-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.eye-btn:hover { background: var(--c-light); color: var(--c-primary); }
.normas-popover {
  position: absolute;
  top: calc(100% + 6px);
  left: -8px;
  min-width: 240px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  padding: 12px;
}
.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-border);
}
.popover-title { font-size: 0.82rem; font-weight: 700; color: var(--c-black); }
.popover-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  background: none;
  color: var(--c-gray-light);
  border-radius: 4px;
  cursor: pointer;
}
.popover-close:hover { background: var(--c-light); color: var(--c-black); }
.popover-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.popover-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: var(--c-light);
  border-radius: 6px;
}
.popover-norma { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
.popover-area { font-size: 0.72rem; color: var(--c-gray); }

.estado-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
.estado-badge.disponible { background: #F0FDF4; color: #15803D; }
.estado-badge.asignado { background: #FEF3C7; color: #B45309; }
.estado-badge.no_disponible { background: #EFF6FF; color: #1D4ED8; }
.estado-badge.documentacion_pendiente { background: #FFF7ED; color: #C2410C; }
.estado-badge.inactivo { background: #F3F4F6; color: #6B7280; }

.actions-cell { display: flex; gap: 4px; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; text-decoration: none; transition: all 0.15s; }
.action-btn:hover { background: var(--c-light); color: var(--c-primary); }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: var(--c-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 60px 20px; color: var(--c-gray); }
.empty-state svg { color: var(--c-gray-light); margin-bottom: 16px; }
.empty-state h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
.empty-state p { font-size: 0.88rem; color: var(--c-gray); }

@media (max-width: 768px) { .page-header { flex-direction: column; align-items: flex-start; } .filter-group { overflow-x: auto; flex-wrap: nowrap; } }
</style>
