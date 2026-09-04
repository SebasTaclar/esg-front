<template>
  <div class="clients-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">{{ clientes.length }} clientes registrados</p>
      </div>
      <div class="header-actions">
        <router-link to="/admin/crm/clientes/nuevo" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo Cliente
        </router-link>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <div class="search-row">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchInput"
            type="text"
            placeholder="Buscar por nombre, NIT, código, email, tipo o norma..."
            class="search-input"
            @input="onSearchInput"
          />
          <button v-if="searchInput" class="clear-btn" @click="clearSearch" title="Limpiar búsqueda">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="filter-group">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          class="filter-chip"
          :class="{ active: activeFilter === filter.value }"
          @click="setFilter(filter.value)"
        >
          {{ filter.label }}
          <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
        </button>

        <select v-model="selectedOrgType" class="org-type-filter" @change="frontPage = 1">
          <option value="">Todos los tipos</option>
          <option v-for="tipo in orgTypes" :key="tipo" :value="tipo">{{ tipo }}</option>
        </select>

        <select v-model="selectedNorma" class="org-type-filter" @change="frontPage = 1">
          <option value="">Todas las normas</option>
          <option v-for="n in normas" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h3>No fue posible cargar los clientes</h3>
      <p>{{ error }}</p>
      <button class="btn-primary" @click="loadData">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Reintentar
      </button>
    </div>

    <!-- Clients Table -->
    <div v-else class="table-card">
      <!-- Skeleton Loading -->
      <div v-if="loading" class="skeleton-table">
        <div v-for="n in 5" :key="n" class="skeleton-row">
          <div class="skeleton-cell skeleton-code"></div>
          <div class="skeleton-cell skeleton-name">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-text-group">
              <div class="skeleton-text long"></div>
              <div class="skeleton-text short"></div>
            </div>
          </div>
          <div class="skeleton-cell skeleton-org"></div>
          <div class="skeleton-cell skeleton-status"></div>
          <div class="skeleton-cell skeleton-actions"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="clientesFiltrados.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h3>No se encontraron clientes</h3>
        <p>{{ searchInput ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer cliente' }}</p>
        <router-link v-if="!searchInput" to="/admin/crm/clientes/nuevo" class="btn-primary">
          Agregar Cliente
        </router-link>
      </div>

      <!-- Data Table -->
      <div v-else>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Tipo de organización</th>
                <th>Norma</th>
                <th v-if="activeFilter === 'prospectos'">OBS</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
                <td class="code-cell">{{ cliente.codigo || cliente.codigo || '-' }}</td>
                <td>
                  <div class="client-info">
                    <div>
                      <router-link :to="`/admin/crm/clientes/${cliente.id}`" class="client-name">
                        {{ cliente.razonSocial }}
                      </router-link>
                      <span class="client-email">{{ cliente.correo }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="org-type-text">{{ cliente.tipoOrganizacion || '-' }}</span>
                </td>
                <td>
                  <span class="norma-text">{{ cliente.norma || '-' }}</span>
                </td>
                <td v-if="activeFilter === 'prospectos'">
                  <button
                    v-if="cliente.observaciones"
                    class="obs-btn"
                    @click="openObsModal(cliente)"
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
                  <span class="status-badge" :class="getStatusClass(cliente)">
                    {{ getStatusLabel(cliente) }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <router-link :to="`/admin/crm/clientes/${cliente.id}`" class="action-btn" title="Ver detalle">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </router-link>
                    <router-link :to="`/admin/crm/clientes/${cliente.id}/editar`" class="action-btn" title="Editar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </router-link>
                    <button v-if="activeFilter === 'prospectos'" class="action-btn convert" title="Convertir a Cliente" @click="confirmConvert(cliente)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <polyline points="16 11 18 13 22 9"/>
                      </svg>
                    </button>
                    <button class="action-btn delete" title="Eliminar" @click="confirmDelete(cliente)">
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

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-bar">
          <span class="pagination-info">
            Mostrando {{ (frontPage - 1) * frontPageSize + 1 }}-{{ Math.min(frontPage * frontPageSize, totalItems) }}
            de {{ totalItems }}
          </span>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="frontPage === 1" @click="goToPage(frontPage - 1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-btn"
              :class="{ active: frontPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button class="page-btn" :disabled="frontPage === totalPages" @click="goToPage(frontPage + 1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-card">
        <div class="modal-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3>¿Eliminar cliente?</h3>
        <p>¿Deseas eliminar el cliente <strong>{{ clientToDelete?.razonSocial }}</strong>? Esta acción no se puede deshacer.</p>
        <div v-if="deleteError" class="delete-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{{ deleteError }}</span>
        </div>
        <div class="modal-actions">
          <button class="btn-outline" @click="showDeleteModal = false">Cancelar</button>
          <button class="btn-danger" :disabled="deleting" @click="handleDelete">
            <span v-if="deleting" class="spinner-sm"></span>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Convert Confirmation Modal -->
    <div v-if="showConvertModal" class="modal-overlay" @click.self="showConvertModal = false">
      <div class="modal-card">
        <div class="modal-icon modal-icon-success">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <polyline points="16 11 18 13 22 9"/>
          </svg>
        </div>
        <h3>Convertir a Cliente</h3>
        <p>¿Deseas convertir <strong>{{ prospectoToConvert?.razonSocial }}</strong> en un cliente activo?</p>
        <div v-if="convertError" class="delete-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{{ convertError }}</span>
        </div>
        <div class="modal-actions">
          <button class="btn-outline" @click="showConvertModal = false">Cancelar</button>
          <button class="btn-success" :disabled="converting" @click="handleConvert">
            <span v-if="converting" class="spinner-sm"></span>
            Convertir
          </button>
        </div>
      </div>
    </div>

    <!-- Observations Modal -->
    <div v-if="showObsModal" class="modal-overlay" @click.self="showObsModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Observaciones - {{ selectedCliente?.razonSocial }}</h3>
          <button class="modal-close" @click="showObsModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ selectedCliente?.observaciones }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" @click="showObsModal = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCRM } from '@/composables/useCRM'
import type { Cliente } from '@/types/crmTypes'

const {
  clientes,
  loading,
  error,
  fetchClientes,
  deleteCliente,
  convertProspecto,
} = useCRM()

const searchInput = ref('')
const activeFilter = ref('todos')
const selectedOrgType = ref('')
const selectedNorma = ref('')
const showDeleteModal = ref(false)
const clientToDelete = ref<Cliente | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const frontPage = ref(1)
const frontPageSize = 20

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const statusFilters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Clientes', value: 'clientes' },
  { label: 'Prospectos', value: 'prospectos' },
]

const orgTypes = computed(() => {
  const types = new Set(clientes.value.map((c) => c.tipoOrganizacion).filter(Boolean))
  return [...types].sort()
})

const normas = computed(() => {
  const norms = new Set(clientes.value.map((c) => c.norma).filter(Boolean))
  return [...norms].sort()
})

const allFiltered = computed(() => {
  let result = [...clientes.value]

  if (searchInput.value) {
    const term = searchInput.value.toLowerCase()
    result = result.filter((c) =>
      c.razonSocial.toLowerCase().includes(term) ||
      c.nit.toLowerCase().includes(term) ||
      (c.codigo && c.codigo.toLowerCase().includes(term)) ||
      c.correo.toLowerCase().includes(term) ||
      (c.tipoOrganizacion && c.tipoOrganizacion.toLowerCase().includes(term)) ||
      (c.norma && c.norma.toLowerCase().includes(term)),
    )
  }

  switch (activeFilter.value) {
    case 'clientes':
      result = result.filter((c) => !c.isProspect && c.isActive)
      break
    case 'prospectos':
      result = result.filter((c) => c.isProspect)
      break
  }

  if (selectedOrgType.value) {
    result = result.filter((c) => c.tipoOrganizacion === selectedOrgType.value)
  }

  if (selectedNorma.value) {
    result = result.filter((c) => c.norma === selectedNorma.value)
  }

  return result
})

const totalItems = computed(() => allFiltered.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / frontPageSize))

const clientesFiltrados = computed(() => {
  const start = (frontPage.value - 1) * frontPageSize
  return allFiltered.value.slice(start, start + frontPageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = frontPage.value
  const pages: number[] = []

  let start = Math.max(1, current - 2)
  const end = Math.min(total, start + 4)
  start = Math.max(1, end - 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function getFilterCount(filter: string): number {
  let base = clientes.value

  if (searchInput.value) {
    const term = searchInput.value.toLowerCase()
    base = base.filter((c) =>
      c.razonSocial.toLowerCase().includes(term) ||
      c.nit.toLowerCase().includes(term) ||
      (c.codigo && c.codigo.toLowerCase().includes(term)) ||
      c.correo.toLowerCase().includes(term) ||
      (c.tipoOrganizacion && c.tipoOrganizacion.toLowerCase().includes(term)) ||
      (c.norma && c.norma.toLowerCase().includes(term)),
    )
  }

  if (selectedOrgType.value) {
    base = base.filter((c) => c.tipoOrganizacion === selectedOrgType.value)
  }
  if (selectedNorma.value) {
    base = base.filter((c) => c.norma === selectedNorma.value)
  }
  if (filter === 'todos') return base.length
  if (filter === 'clientes') return base.filter((c) => !c.isProspect && c.isActive).length
  if (filter === 'prospectos') return base.filter((c) => c.isProspect).length
  return 0
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getAvatarClass(cliente: Cliente): string {
  if (cliente.isProspect) return 'prospect'
  if (cliente.isActive) return 'active'
  return 'inactive'
}

function getStatusClass(cliente: Cliente): string {
  if (cliente.isProspect) return 'prospect'
  if (cliente.isActive) return 'active'
  return 'inactive'
}

function getStatusLabel(cliente: Cliente): string {
  if (cliente.isProspect) return 'Prospecto'
  if (cliente.isActive) return 'Cliente'
  return 'Inactivo'
}

function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    frontPage.value = 1
  }, 300)
}

function clearSearch() {
  searchInput.value = ''
  frontPage.value = 1
}

function setFilter(value: string) {
  activeFilter.value = value
  frontPage.value = 1
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  frontPage.value = page
}

function confirmDelete(cliente: Cliente) {
  clientToDelete.value = cliente
  deleteError.value = null
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!clientToDelete.value) return
  deleting.value = true
  deleteError.value = null
  const success = await deleteCliente(clientToDelete.value.id)
  deleting.value = false
  if (success) {
    showDeleteModal.value = false
    clientToDelete.value = null
  } else {
    deleteError.value = error.value || 'No se pudo eliminar el cliente. Puede tener contactos o proyectos asociados.'
  }
}

const showConvertModal = ref(false)
const prospectoToConvert = ref<Cliente | null>(null)
const converting = ref(false)
const convertError = ref<string | null>(null)

function confirmConvert(cliente: Cliente) {
  prospectoToConvert.value = cliente
  convertError.value = null
  showConvertModal.value = true
}

async function handleConvert() {
  if (!prospectoToConvert.value) return
  converting.value = true
  convertError.value = null
  const result = await convertProspecto(prospectoToConvert.value.id)
  converting.value = false
  if (result) {
    showConvertModal.value = false
    prospectoToConvert.value = null
  } else {
    convertError.value = error.value || 'No se pudo convertir el prospecto.'
  }
}

const showObsModal = ref(false)
const selectedCliente = ref<Cliente | null>(null)

function openObsModal(cliente: Cliente) {
  selectedCliente.value = cliente
  showObsModal.value = true
}

async function loadData() {
  await fetchClientes({ page: 1, limit: 9999 })
  frontPage.value = 1
}

watch(activeFilter, () => {
  frontPage.value = 1
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.clients-page {
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

.search-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  max-width: 480px;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-gray-light);
  pointer-events: none;
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

.filter-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.filter-chip:hover {
  border-color: var(--c-gray-light);
  color: var(--c-black);
  transform: translateY(-1px);
}
.filter-chip.active {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(200, 155, 45, 0.25);
}

.filter-count {
  font-size: 0.75rem;
  background: rgba(0,0,0,0.04);
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}
.filter-chip.active .filter-count {
  background: rgba(255,255,255,0.2);
}

.org-type-filter {
  padding: 8px 12px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}
.org-type-filter:hover {
  border-color: var(--c-gray-light);
  color: var(--c-black);
}
.org-type-filter:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.1);
}

/* ===== ERROR STATE ===== */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  text-align: center;
  color: var(--c-gray);
}
.error-state h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-black);
}
.error-state p {
  font-size: 0.88rem;
  color: var(--c-gray);
  margin-bottom: 8px;
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
.client-avatar.active { background: rgba(16, 185, 129, 0.1); color: #059669; }
.client-avatar.prospect { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.client-avatar.inactive { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

.client-name {
  display: block;
  font-weight: 600;
  color: var(--c-black);
  text-decoration: none;
  transition: color 0.15s;
  max-width: 220px;
  word-wrap: break-word;
}
.client-name:hover { color: var(--c-primary); }

.client-email {
  display: block;
  font-size: 0.78rem;
  color: var(--c-gray);
  margin-top: 2px;
  max-width: 220px;
  word-wrap: break-word;
}

.code-cell {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--c-primary);
  min-width: 120px;
}

.org-type-text {
  font-size: 0.82rem;
  color: var(--c-black);
  min-width: 80px;
}
.norma-text {
  font-size: 0.82rem;
  color: var(--c-black);
  min-width: 80px;
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
  transition: all 0.2s;
}
.obs-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.no-obs {
  color: var(--c-gray-light);
  font-size: 0.82rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
}
.status-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.status-badge.active { background: rgba(16, 185, 129, 0.1); color: #059669; }
.status-badge.prospect { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.status-badge.inactive { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

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
.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}
.action-btn.convert:hover {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

/* ===== SKELETON ===== */
.skeleton-table {
  padding: 0;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--c-border);
}
.skeleton-row:last-child { border-bottom: none; }

.skeleton-cell {
  flex-shrink: 0;
}

.skeleton-code { width: 100px; height: 16px; background: var(--c-light); border-radius: 4px; }

.skeleton-name {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--c-light);
  flex-shrink: 0;
}

.skeleton-text-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-text {
  height: 12px;
  background: var(--c-light);
  border-radius: 4px;
}
.skeleton-text.long { width: 160px; }
.skeleton-text.short { width: 100px; }

.skeleton-org { width: 120px; height: 16px; background: var(--c-light); border-radius: 4px; }
.skeleton-status { width: 80px; height: 24px; background: var(--c-light); border-radius: 6px; }
.skeleton-actions { width: 80px; height: 34px; background: var(--c-light); border-radius: 8px; }

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

/* ===== EMPTY ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon { color: var(--c-gray-light); margin-bottom: 16px; }
.empty-state h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
.empty-state p { font-size: 0.88rem; color: var(--c-gray); margin-bottom: 20px; }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: var(--c-white);
  border-radius: 14px;
  padding: 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.modal-icon {
  color: #dc2626;
  margin-bottom: 16px;
}

.modal-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 8px;
}

.modal-card p {
  font-size: 0.88rem;
  color: var(--c-gray);
  margin-bottom: 24px;
  line-height: 1.5;
}

.delete-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.82rem;
  margin-bottom: 16px;
  text-align: left;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--c-white);
  color: var(--c-black);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { border-color: var(--c-gray-light); }

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-success {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-success:hover:not(:disabled) { background: #047857; }
.btn-success:disabled { opacity: 0.6; cursor: not-allowed; }
.modal-icon-success { background: rgba(16, 185, 129, 0.1); color: #059669; }

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
  .page-header { flex-direction: column; align-items: flex-start; }
  .filter-group { overflow-x: auto; flex-wrap: nowrap; }
  .pagination-bar { flex-direction: column; gap: 12px; }
}
</style>
