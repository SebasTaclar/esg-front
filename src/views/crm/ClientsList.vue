<template>
  <div class="clients-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">{{ filteredClients.length }} clientes registrados</p>
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

        <div class="search-box code-filter">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          <input
            v-model="codeFilter"
            type="text"
            placeholder="Filtrar por código..."
            class="search-input"
          />
          <button v-if="codeFilter" class="clear-btn" @click="clearCodeFilter" title="Limpiar filtro">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="org-dropdown" @click.stop>
          <div class="org-dropdown-trigger" @click="toggleOrgDropdown">

            <span class="org-dropdown-text">{{ orgFilter || 'Tipo de organización' }}</span>
            <button v-if="orgFilter" class="org-dropdown-clear" @click.stop="clearOrgSelection" title="Limpiar filtro">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <svg class="org-dropdown-arrow" :class="{ open: showOrgDropdown }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <div v-if="showOrgDropdown" class="org-dropdown-menu">
            <div class="org-dropdown-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                v-model="orgSearchTerm"
                type="text"
                placeholder="Buscar tipo..."
                class="org-dropdown-search-input"
                @input="filterOrgOptions"
              />
            </div>
            <div class="org-dropdown-options">
              <div
                v-for="option in filteredOrgOptions"
                :key="option"
                class="org-dropdown-option"
                :class="{ selected: orgFilter === option }"
                @click="selectOrgFilter(option)"
              >
                {{ option }}
              </div>
              <div v-if="filteredOrgOptions.length === 0" class="org-dropdown-empty">
                No se encontraron resultados
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          class="filter-chip"
          :class="{ active: activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
          <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
        </button>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando clientes...</p>
      </div>

      <div v-else-if="filteredClients.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h3>No se encontraron clientes</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer cliente' }}</p>
        <router-link v-if="!searchTerm" to="/admin/crm/clientes/nuevo" class="btn-primary">
          Agregar Cliente
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
                <th @click="toggleSort('codigo')" class="sortable">
                  Código
                  <span v-if="sortField === 'codigo'" class="sort-icon">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Tipo de organización</th>
                <th>Norma</th>
                <th>Proyectos</th>
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
              <tr v-for="cliente in paginatedClients" :key="cliente.id">
                <td>
                  <div class="client-info">
                    <div class="client-avatar" :class="cliente.estado">
                      {{ getInitials(cliente.razonSocial) }}
                    </div>
                    <div>
                      <router-link :to="`/admin/crm/clientes/${cliente.id}`" class="client-name">
                        {{ cliente.razonSocial }}
                      </router-link>
                      <span class="client-email">{{ cliente.correo }}</span>
                    </div>
                  </div>
                </td>
                <td class="code-cell">{{ cliente.codigo || '-' }}</td>
                <td>
                  <span class="org-type-text">{{ cliente.tipoOrganizacion || '-' }}</span>
                </td>
                <td>
                  <span class="norma-text">{{ cliente.norma || '-' }}</span>
                </td>
                <td class="number-cell">
                  <span class="count-badge" :class="{ highlight: (cliente.proyectosCount || 0) > 0 }">
                    {{ cliente.proyectosCount || 0 }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="cliente.estado">
                    {{ capitalizeFirst(cliente.estado) }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <router-link :to="`/admin/crm/clientes/${cliente.id}`" class="action-btn" title="Ver ficha">
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
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-bar">
          <span class="pagination-info">
            Mostrando {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredClients.length) }}
            de {{ filteredClients.length }}
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
const codeFilter = ref('')
const orgFilter = ref('')
const showOrgDropdown = ref(false)
const orgSearchTerm = ref('')
const activeFilter = ref('todos')
const sortField = ref<string>('razonSocial')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = 10

const statusFilters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activos', value: 'activo' },
  { label: 'Inactivos', value: 'inactivo' },
]

const prospectStatuses = ['prospecto', 'nuevo', 'contactado', 'en_diagnostico', 'cotizacion_enviada', 'en_negociacion', 'ganado', 'perdido', 'en_pausa']

const orgOptions = computed(() => {
  const types = new Set<string>()
  clientes.value.forEach((c) => {
    if (c.tipoOrganizacion && !prospectStatuses.includes(c.estado)) {
      types.add(c.tipoOrganizacion)
    }
  })
  return Array.from(types).sort()
})

const filteredOrgOptions = computed(() => {
  if (!orgSearchTerm.value) return orgOptions.value
  const term = orgSearchTerm.value.toLowerCase()
  return orgOptions.value.filter((opt) => opt.toLowerCase().includes(term))
})

const filteredClients = computed(() => {
  let result = [...clientes.value].filter((c) => !prospectStatuses.includes(c.estado))

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.razonSocial.toLowerCase().includes(term) ||
        c.nit.includes(term) ||
        c.correo.toLowerCase().includes(term),
    )
  }

  if (codeFilter.value) {
    const codeTerm = codeFilter.value.toLowerCase()
    result = result.filter(
      (c) => c.codigo && c.codigo.toLowerCase().includes(codeTerm),
    )
  }

  if (orgFilter.value) {
    const orgTerm = orgFilter.value.toLowerCase()
    result = result.filter(
      (c) => c.tipoOrganizacion && c.tipoOrganizacion.toLowerCase().includes(orgTerm),
    )
  }

  if (activeFilter.value !== 'todos') {
    result = result.filter((c) => c.estado === activeFilter.value)
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

const totalPages = computed(() => Math.ceil(filteredClients.value.length / pageSize))

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredClients.value.slice(start, start + pageSize)
})

function getFilterCount(filter: string): number {
  const clientsOnly = clientes.value.filter((c) => !prospectStatuses.includes(c.estado))
  if (filter === 'todos') return clientsOnly.length
  return clientsOnly.filter((c) => c.estado === filter).length
}

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
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function clearSearch() {
  searchTerm.value = ''
}

function clearCodeFilter() {
  codeFilter.value = ''
}

function toggleOrgDropdown() {
  showOrgDropdown.value = !showOrgDropdown.value
  if (showOrgDropdown.value) {
    orgSearchTerm.value = ''
  }
}

function selectOrgFilter(value: string) {
  if (orgFilter.value === value) {
    orgFilter.value = ''
  } else {
    orgFilter.value = value
  }
  showOrgDropdown.value = false
  orgSearchTerm.value = ''
}

function clearOrgSelection() {
  orgFilter.value = ''
  orgSearchTerm.value = ''
}

function filterOrgOptions() {
  // Computed property handles this
}

function closeOrgDropdown() {
  showOrgDropdown.value = false
}

watch([searchTerm, codeFilter, orgFilter, activeFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchClientes()
  document.addEventListener('click', closeOrgDropdown)
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

.code-filter {
  max-width: 280px;
}

/* ===== ORG DROPDOWN ===== */
.org-dropdown {
  position: relative;
  min-width: 260px;
}

.org-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.org-dropdown-trigger:hover {
  border-color: var(--c-gray-light);
}

.org-dropdown-icon {
  color: var(--c-gray-light);
  flex-shrink: 0;
}

.org-dropdown-text {
  flex: 1;
  font-size: 0.9rem;
  color: var(--c-black);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.org-dropdown-text:empty::before {
  content: 'Tipo de organización';
  color: var(--c-gray-light);
}

.org-dropdown-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: var(--c-light);
  color: var(--c-gray);
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.org-dropdown-clear:hover {
  background: var(--c-border);
  color: var(--c-black);
}

.org-dropdown-arrow {
  color: var(--c-gray-light);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.org-dropdown-arrow.open {
  transform: rotate(180deg);
}

.org-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  overflow: hidden;
}

.org-dropdown-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--c-border);
}
.org-dropdown-search svg {
  color: var(--c-gray-light);
  flex-shrink: 0;
}

.org-dropdown-search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.85rem;
  font-family: inherit;
  color: var(--c-black);
  background: transparent;
}
.org-dropdown-search-input::placeholder {
  color: var(--c-gray-light);
}

.org-dropdown-options {
  max-height: 200px;
  overflow-y: auto;
}

.org-dropdown-option {
  padding: 10px 14px;
  font-size: 0.85rem;
  color: var(--c-black);
  cursor: pointer;
  transition: background 0.15s ease;
}
.org-dropdown-option:hover {
  background: var(--c-light);
}
.org-dropdown-option.selected {
  background: rgba(200, 155, 45, 0.1);
  color: var(--c-primary);
  font-weight: 600;
}

.org-dropdown-empty {
  padding: 16px 14px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--c-gray);
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
.search-input:focus + .search-icon,
.search-input:focus ~ .search-icon {
  color: var(--c-primary);
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
.client-avatar.activo { background: rgba(16, 185, 129, 0.1); color: #059669; }
.client-avatar.prospecto { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.client-avatar.inactivo { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

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
  font-weight: 500;
  min-width: 280px;
  color: var(--c-gray);
  white-space: nowrap;
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
.count-badge.highlight { background: rgba(200, 155, 45, 0.1); color: var(--c-primary); }

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
  .filter-group { overflow-x: auto; flex-wrap: nowrap; }
  .pagination-bar { flex-direction: column; gap: 12px; }
}
</style>
