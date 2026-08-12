<template>
  <div class="prospects-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Prospectos</h1>
        <p class="page-subtitle">{{ filteredProspects.length }} prospectos registrados</p>
      </div>
      <div class="header-actions">
        <router-link to="/admin/crm/clientes/nuevo" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo Prospecto
        </router-link>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nombre, NIT o correo..."
          class="search-input"
        />
        <button v-if="searchTerm" class="clear-btn" @click="clearSearch" title="Limpiar búsqueda">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Prospects Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando prospectos...</p>
      </div>

      <div v-else-if="filteredProspects.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h3>No se encontraron prospectos</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer prospecto' }}</p>
        <router-link v-if="!searchTerm" to="/admin/crm/clientes/nuevo" class="btn-primary">
          Agregar Prospecto
        </router-link>
      </div>

      <div v-else>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th @click="toggleSort('razonSocial')" class="sortable">
                  Cliente
                  <span v-if="sortField === 'razonSocial'" class="sort-icon">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Tipo de organización</th>
                <th>Norma</th>
                <th>Observaciones</th>
                <th @click="toggleSort('estado')" class="sortable">
                  Estado
                  <span v-if="sortField === 'estado'" class="sort-icon">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prospecto in paginatedProspects" :key="prospecto.id">
                <td>
                  <div class="client-info">
                    <div class="client-avatar prospecto">
                      {{ getInitials(prospecto.razonSocial) }}
                    </div>
                    <div>
                      <router-link :to="`/admin/crm/prospectos/${prospecto.id}`" class="client-name">
                        {{ prospecto.razonSocial }}
                      </router-link>
                      <span class="client-email">{{ prospecto.correo }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="org-type-text">{{ prospecto.tipoOrganizacion || '-' }}</span>
                </td>
                <td>
                  <span class="norma-text">{{ prospecto.norma || '-' }}</span>
                </td>
                <td>
                  <button
                    v-if="prospecto.observaciones"
                    class="obs-btn"
                    @click="openObsModal(prospecto)"
                    title="Ver observaciones"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Ver
                  </button>
                  <span v-else class="no-obs">-</span>
                </td>
                <td>
                  <span class="status-badge" :class="prospecto.estado">
                    {{ capitalizeFirst(prospecto.estado) }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <router-link :to="`/admin/crm/prospectos/${prospecto.id}`" class="action-btn" title="Ver ficha">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </router-link>
                    <router-link :to="`/admin/crm/prospectos/${prospecto.id}/editar`" class="action-btn" title="Editar">
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

        <!-- Observations Modal -->
        <div v-if="showObsModal" class="modal-overlay" @click="closeObsModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Observaciones - {{ selectedProspecto?.razonSocial }}</h3>
              <button class="modal-close" @click="closeObsModal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <p>{{ selectedProspecto?.observaciones }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" @click="closeObsModal">Cerrar</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination-bar">
          <span class="pagination-info">
            Mostrando {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredProspects.length) }}
            de {{ filteredProspects.length }}
          </span>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCRM } from '@/composables/useCRM'
import type { Cliente } from '@/types/crmTypes'

const { clientes, loading, fetchClientes } = useCRM()

const searchTerm = ref('')
const sortField = ref<string>('razonSocial')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = 10
const showObsModal = ref(false)
const selectedProspecto = ref<Cliente | null>(null)

const prospectStatuses = ['prospecto', 'nuevo', 'contactado', 'en_diagnostico', 'cotizacion_enviada', 'en_negociacion', 'ganado', 'perdido', 'en_pausa']

const filteredProspects = computed(() => {
  let result = [...clientes.value].filter((c) => prospectStatuses.includes(c.estado))

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.razonSocial.toLowerCase().includes(term) ||
        c.nit.includes(term) ||
        c.correo.toLowerCase().includes(term),
    )
  }

  if (sortField.value) {
    result.sort((a, b) => {
      const aVal = a[sortField.value as keyof Cliente] ?? ''
      const bVal = b[sortField.value as keyof Cliente] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDirection.value === 'desc' ? -cmp : cmp
    })
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredProspects.value.length / pageSize))

const paginatedProspects = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProspects.value.slice(start, start + pageSize)
})

function toggleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function capitalizeFirst(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function clearSearch() {
  searchTerm.value = ''
}

function openObsModal(prospecto: Cliente) {
  selectedProspecto.value = prospecto
  showObsModal.value = true
}

function closeObsModal() {
  showObsModal.value = false
  selectedProspecto.value = null
}

watch([searchTerm], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchClientes()
})
</script>

<style scoped>
.prospects-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== PAGE HEADER ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--c-border);
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--c-black);
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--c-gray);
  margin-top: 4px;
  letter-spacing: 0.01em;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(200, 155, 45, 0.2);
}
.btn-primary:hover {
  background: var(--c-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200, 155, 45, 0.3);
}

/* ===== FILTERS ===== */
.filters-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
}

.search-box {
  position: relative;
  max-width: 480px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-gray-light);
  pointer-events: none;
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 44px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  background: var(--c-white);
  color: var(--c-black);
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.search-input:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.08);
}
.search-input::placeholder { color: var(--c-gray-light); }

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: var(--c-light);
  color: var(--c-gray);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.clear-btn:hover {
  background: var(--c-border);
  color: var(--c-black);
}

/* ===== TABLE ===== */
.table-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 14px 16px;
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

.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
}
.sortable:hover { color: var(--c-black); }
.sort-icon { margin-left: 4px; color: var(--c-primary); font-weight: 700; }

.data-table td {
  padding: 14px 16px;
  font-size: 0.88rem;
  color: var(--c-black);
  border-bottom: 1px solid var(--c-border);
  vertical-align: middle;
}

.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(249, 250, 251, 0.6); }

.client-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.client-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}
.client-avatar.prospecto { background: rgba(59, 130, 246, 0.1); color: #2563EB; }

.client-name {
  display: block;
  font-weight: 600;
  color: var(--c-black);
  text-decoration: none;
  transition: color 0.15s;
}
.client-name:hover { color: var(--c-primary); }

.client-email {
  display: block;
  font-size: 0.78rem;
  color: var(--c-gray);
  margin-top: 2px;
}

.nit-cell {
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.org-type-text {
  font-size: 0.82rem;
  color: var(--c-black);
}

.norma-text {
  font-size: 0.82rem;
  font-weight: 500;
  min-width: 130px;
  color: var(--c-gray);
}

.obs-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.obs-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.no-obs {
  color: var(--c-gray-light);
}

.number-cell { text-align: center; }

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  background: var(--c-light);
  color: var(--c-gray);
  font-size: 0.82rem;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
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

.actions-cell {
  display: flex;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  background: none;
  color: var(--c-gray);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.action-btn:hover {
  background: var(--c-light);
  color: var(--c-primary);
  transform: translateY(-1px);
}

/* ===== PAGINATION ===== */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-top: 1px solid var(--c-border);
}

.pagination-info {
  font-size: 0.85rem;
  color: var(--c-gray);
}

.pagination-controls {
  display: flex;
  gap: 6px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-btn:hover:not(:disabled) {
  border-color: var(--c-primary);
  color: var(--c-primary);
  transform: translateY(-1px);
}
.page-btn.active {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: white;
  box-shadow: 0 2px 6px rgba(200, 155, 45, 0.2);
}
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--c-white);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-black);
  margin: 0;
}

.modal-close {
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
.modal-close:hover {
  background: var(--c-light);
  color: var(--c-black);
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  font-size: 0.9rem;
  color: var(--c-black);
  line-height: 1.6;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--c-border);
}

.btn-secondary {
  padding: 8px 16px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  border-color: var(--c-gray-light);
  color: var(--c-black);
}

/* ===== LOADING & EMPTY ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon { color: var(--c-gray-light); margin-bottom: 16px; }
.empty-state h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
.empty-state p { font-size: 0.88rem; color: var(--c-gray); margin-bottom: 20px; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .pagination-bar { flex-direction: column; gap: 12px; }
}
</style>
