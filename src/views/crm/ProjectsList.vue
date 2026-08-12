<template>
  <div class="projects-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Proyectos</h1>
        <p class="page-subtitle">{{ filteredProjects.length }} proyectos registrados</p>
      </div>
      <router-link to="/admin/crm/proyectos/nuevo" class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo Proyecto
      </router-link>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Buscar por código, cliente o responsable..." class="search-input" />
      </div>
      <div class="filter-group">
        <button v-for="f in statusFilters" :key="f.value" class="filter-chip" :class="{ active: activeFilter === f.value }" @click="activeFilter = f.value">
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando proyectos...</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        <h3>No se encontraron proyectos</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos' : 'Crea tu primer proyecto' }}</p>
      </div>

      <div v-else>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Oferta</th>
                <th>Estado</th>
                <th>Costo Total Cliente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in filteredProjects" :key="p.id">
                <td><span class="code-badge">{{ p.codigo }}</span></td>
                <td class="client-cell">
                  <span class="client-name">{{ p.clienteRazonSocial }}</span>
                  <small class="client-type">{{ p.tipoProyectoNombre }}</small>
                </td>
                <td><span class="oferta-text">{{ p.oferta || '-' }}</span></td>
                <td>
                  <span class="status-dot" :style="{ background: p.estadoColor }"></span>
                  <span class="status-text">{{ p.estadoNombre }}</span>
                </td>
                <td><span class="costo-text">{{ formatCurrency(p.costoTotal) }}</span></td>
                <td>
                  <div class="actions-cell">
                    <button v-if="inline" class="action-btn" title="Ver" @click="$emit('viewProject', p.id)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <router-link v-else :to="`/admin/crm/proyectos/${p.id}`" class="action-btn" title="Ver">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </router-link>
                    <router-link :to="`/admin/crm/proyectos/${p.id}/editar`" class="action-btn" title="Editar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </router-link>
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
import { ref, computed, onMounted } from 'vue'
import { useCRM } from '@/composables/useCRM'

defineProps<{ inline?: boolean }>()
defineEmits<{ viewProject: [id: number] }>()

const { proyectos, loading, fetchProyectos } = useCRM()

const searchTerm = ref('')
const activeFilter = ref('todos')

const statusFilters = [
  { label: 'Todos', value: 'todos' },
  { label: 'En ejecución', value: 'En ejecución' },
  { label: 'Finalizados', value: 'Finalizado' },
  { label: 'Cotización', value: 'Cotización' },
  { label: 'Aprobados', value: 'Aprobado' },
  { label: 'Suspendidos', value: 'Suspendido' },
]

const filteredProjects = computed(() => {
  let result = [...proyectos.value]

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.codigo.toLowerCase().includes(term) ||
        (p.clienteRazonSocial && p.clienteRazonSocial.toLowerCase().includes(term)) ||
        p.responsable.toLowerCase().includes(term),
    )
  }

  if (activeFilter.value !== 'todos') {
    result = result.filter((p) => p.estadoNombre === activeFilter.value)
  }

  return result
})

function formatCurrency(value: number | undefined): string {
  if (!value) return '-'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

onMounted(() => { fetchProyectos() })
</script>

<style scoped>
.projects-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }

.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px !important; background: var(--c-primary); color: white; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 600; text-decoration: none; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: var(--c-primary-hover); }

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

.code-badge {
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

.client-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.client-name {
  font-weight: 600;
  color: var(--c-black);
}

.client-type {
  font-size: 0.78rem;
  color: var(--c-gray);
}

.oferta-text {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: var(--c-gray);
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-text {
  font-size: 0.85rem;
  color: var(--c-black);
}

.costo-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-black);
}

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
