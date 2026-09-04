<template>
  <div class="usuarios-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Usuarios</h1>
        <p class="page-subtitle">{{ filteredUsuarios.length }} usuarios registrados{{ totalPages > 1 ? ` — Página ${currentPage} de ${totalPages}` : '' }}</p>
      </div>
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon activos">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ usuarios.length }}</span>
            <span class="summary-label">Usuarios</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon admins">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ usuarios.filter(u => u.role === 'admin').length }}</span>
            <span class="summary-label">Admins</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon clientes">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ usuarios.filter(u => u.role === 'user').length }}</span>
            <span class="summary-label">Clientes</span>
          </div>
        </div>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Crear Usuario
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Buscar por nombre o cliente..." class="search-input" />
        <button v-if="searchTerm" class="clear-btn" @click="searchTerm = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="filter-group">
        <div class="filter-field">
          <label class="filter-label">Rol</label>
          <select v-model="roleFilter" class="form-select">
            <option value="">Todos</option>
            <option value="admin">Admin</option>
            <option value="user">Cliente</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
      <div v-else-if="filteredUsuarios.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p>No se encontraron usuarios</p>
      </div>
      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre / Cliente</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in paginatedUsuarios" :key="u.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar" :style="{ background: getUserColor(u.id) }">
                    <span>{{ getUserInitials(u.name || u.email || 'U') }}</span>
                  </div>
                  <span class="user-name">{{ u.name || `Usuario #${u.id}` }}</span>
                </div>
              </td>
              <td>{{ u.email || '-' }}</td>
              <td><span class="rol-badge" :class="u.role">{{ u.role }}</span></td>
              <td>
                <div class="actions-cell">
                  <button class="action-btn" title="Actualizar" @click="openEditModal(u)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="action-btn" title="Cambiar contraseña" @click="openPasswordModal(u)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </button>
                  <button class="action-btn delete-btn" title="Eliminar" @click="deleteUsuario(u.id, u.name || u.email || `Usuario #${u.id}`)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <template v-for="p in totalPages" :key="p">
          <button v-if="p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <span v-else-if="p === currentPage - 2 || p === currentPage + 2" class="page-dots">...</span>
        </template>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content modal-sm" @click.stop>
        <div class="modal-header">
          <h3>Crear Usuario</h3>
          <button class="modal-close" @click="showCreateModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="formError" class="modal-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ formError }}
        </div>

        <div class="modal-body">
          <div class="form-grid-modal">
            <div class="form-group form-group-full">
              <label>Rol *</label>
              <select v-model="createForm.role" class="form-input">
                <option value="user">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <template v-if="createForm.role === 'user'">
              <div class="form-group form-group-full">
                <label>Cliente *</label>
                <div class="client-dropdown-wrapper">
                  <div class="client-dropdown-trigger" :class="{ 'field-error': createSubmitted && !createForm.clientId }" @click="toggleClientDropdownCreate">
                    <span :class="{ placeholder: !createForm.clientId }">
                      {{ createForm.clientId ? getSelectedClientName(createForm.clientId) : 'Seleccionar cliente' }}
                    </span>
                    <div class="client-dropdown-actions">
                      <button v-if="createForm.clientId" type="button" class="btn-clear-client" @click.stop="selectClientCreate(null)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  <div v-if="showClientDropdownCreate" class="client-dropdown-list">
                    <div class="client-dropdown-search">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                      <input v-model="clientSearch" type="text" placeholder="Buscar cliente..." class="client-search-input" @click.stop />
                    </div>
                    <div class="client-dropdown-items">
                      <div class="client-dropdown-item" :class="{ selected: !createForm.clientId }" @click="selectClientCreate(null)">Seleccionar cliente</div>
                      <div v-for="c in sortedClientes" :key="c.id" class="client-dropdown-item" :class="{ selected: createForm.clientId === c.id }" @click="selectClientCreate(c.id)">
                        {{ c.razonSocial }}
                      </div>
                      <div v-if="sortedClientes.length === 0" class="client-dropdown-empty">No se encontraron clientes</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group form-group-full">
                <label>Correo electrónico (del cliente)</label>
                <input v-model="createForm.email" type="email" class="form-input auto-filled" readonly :placeholder="createForm.clientId ? '' : 'Se llenará al seleccionar cliente'" />
                <span v-if="createForm.clientId && createForm.email" class="auto-fill-hint">Se usará el correo del cliente seleccionado</span>
                <span v-else-if="!createForm.clientId" class="auto-fill-hint">Seleccione un cliente para llenar el correo</span>
              </div>
            </template>

            <template v-if="createForm.role === 'admin'">
              <div class="form-group form-group-full">
                <label>Nombre *</label>
                <input v-model="createForm.name" type="text" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.name }" placeholder="Nombre completo" />
              </div>
              <div class="form-group form-group-full">
                <label>Correo electrónico *</label>
                <input v-model="createForm.email" type="email" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.email }" placeholder="correo@ejemplo.com" />
              </div>
            </template>

            <div class="form-group form-group-full">
              <label>Contraseña *</label>
              <div class="password-input-wrap">
                <input v-model="createForm.password" :type="showPassword ? 'text' : 'password'" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.password }" placeholder="Mínimo 6 caracteres" />
                <button type="button" class="btn-toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showCreateModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleCreate">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Creando...' : 'Crear Usuario' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal-content modal-sm" @click.stop>
        <div class="modal-header">
          <h3>Cambiar Contraseña</h3>
          <button class="modal-close" @click="showPasswordModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="formError" class="modal-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ formError }}
        </div>

        <div class="modal-body">
          <p class="modal-info">Cambiar contraseña de <strong>{{ passwordUserName }}</strong></p>
          <div class="form-group">
            <label>Nueva contraseña *</label>
            <div class="password-input-wrap">
              <input v-model="passwordForm.newPassword" :type="showPasswordModal2 ? 'text' : 'password'" class="form-input" :class="{ 'field-error': passwordSubmitted && !passwordForm.newPassword }" placeholder="Mínimo 6 caracteres" />
              <button type="button" class="btn-toggle-password" @click="showPasswordModal2 = !showPasswordModal2">
                <svg v-if="!showPasswordModal2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showPasswordModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleChangePassword">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Guardando...' : 'Cambiar Contraseña' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content modal-sm" @click.stop>
        <div class="modal-header">
          <h3>Actualizar Usuario</h3>
          <button class="modal-close" @click="showEditModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="formError" class="modal-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ formError }}
        </div>

        <div class="modal-body">
          <div class="form-grid-modal">
            <div class="form-group form-group-full">
              <label>Rol</label>
              <select v-model="editForm.role" class="form-input">
                <option value="user">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <template v-if="editForm.role === 'user'">
              <div class="form-group form-group-full">
                <label>Cliente</label>
                <div class="client-dropdown-wrapper">
                  <div class="client-dropdown-trigger" @click="toggleClientDropdownEdit">
                    <span :class="{ placeholder: !editForm.clientId }">
                      {{ editForm.clientId ? getSelectedClientName(editForm.clientId) : 'Seleccionar cliente' }}
                    </span>
                    <div class="client-dropdown-actions">
                      <button v-if="editForm.clientId" type="button" class="btn-clear-client" @click.stop="selectClientEdit(null)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  <div v-if="showClientDropdownEdit" class="client-dropdown-list">
                    <div class="client-dropdown-search">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                      <input v-model="clientSearch" type="text" placeholder="Buscar cliente..." class="client-search-input" @click.stop />
                    </div>
                    <div class="client-dropdown-items">
                      <div class="client-dropdown-item" :class="{ selected: !editForm.clientId }" @click="selectClientEdit(null)">Seleccionar cliente</div>
                      <div v-for="c in sortedClientes" :key="c.id" class="client-dropdown-item" :class="{ selected: editForm.clientId === c.id }" @click="selectClientEdit(c.id)">
                        {{ c.razonSocial }}
                      </div>
                      <div v-if="sortedClientes.length === 0" class="client-dropdown-empty">No se encontraron clientes</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group form-group-full">
                <label>Correo electrónico (del cliente)</label>
                <input v-model="editForm.email" type="email" class="form-input auto-filled" readonly :placeholder="editForm.clientId ? '' : 'Se llenará al seleccionar cliente'" />
                <span v-if="editForm.clientId && editForm.email" class="auto-fill-hint">Se usará el correo del cliente seleccionado</span>
                <span v-else-if="!editForm.clientId" class="auto-fill-hint">Seleccione un cliente para llenar el correo</span>
              </div>
            </template>

            <template v-if="editForm.role === 'admin'">
              <div class="form-group form-group-full">
                <label>Nombre</label>
                <input v-model="editForm.name" type="text" class="form-input" placeholder="Nombre completo" />
              </div>
              <div class="form-group form-group-full">
                <label>Correo electrónico</label>
                <input v-model="editForm.email" type="email" class="form-input" placeholder="correo@ejemplo.com" />
              </div>
            </template>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showEditModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleUpdate">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Guardando...' : 'Actualizar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content modal-sm" @click.stop>
        <div class="delete-modal-body">
          <div class="delete-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="delete-title">Eliminar usuario</h3>
          <p class="delete-text">¿Estás seguro de eliminar a <strong>{{ deleteName }}</strong>? Esta acción no se puede deshacer.</p>
          <div class="delete-actions">
            <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn-delete" @click="confirmDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { userService } from '@/services/api/userService'
import type { User, CreateUserRequest, UpdateUserRequest } from '@/services/api/userService'
import { useCRM } from '@/composables/useCRM'

const { clientes, fetchClientes } = useCRM()

const clientSearch = ref('')
const showClientDropdownCreate = ref(false)
const showClientDropdownEdit = ref(false)

const sortedClientes = computed(() => {
  const list = [...clientes.value].sort((a, b) =>
    (a.razonSocial || '').localeCompare(b.razonSocial || '', 'es', { sensitivity: 'base' })
  )
  if (!clientSearch.value) return list
  const term = clientSearch.value.toLowerCase()
  return list.filter((c) => (c.razonSocial || '').toLowerCase().includes(term))
})

function selectClientCreate(id: number | null) {
  createForm.value.clientId = id
  if (id) {
    const client = clientes.value.find((c) => c.id === id)
    createForm.value.email = client?.correo || ''
  } else {
    createForm.value.email = ''
  }
  showClientDropdownCreate.value = false
  clientSearch.value = ''
}

function selectClientEdit(id: number | null) {
  editForm.value.clientId = id
  showClientDropdownEdit.value = false
  clientSearch.value = ''
}

function getSelectedClientName(id: number | null): string {
  if (!id) return ''
  const c = clientes.value.find((cl) => cl.id === id)
  return c ? c.razonSocial : ''
}

function toggleClientDropdownCreate() {
  showClientDropdownCreate.value = !showClientDropdownCreate.value
  showClientDropdownEdit.value = false
  clientSearch.value = ''
}

function toggleClientDropdownEdit() {
  showClientDropdownEdit.value = !showClientDropdownEdit.value
  showClientDropdownCreate.value = false
  clientSearch.value = ''
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.client-dropdown-wrapper')) {
    showClientDropdownCreate.value = false
    showClientDropdownEdit.value = false
    clientSearch.value = ''
  }
}

const usuarios = ref<User[]>([])
const loading = ref(false)
const searchTerm = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const perPage = 30

const showCreateModal = ref(false)
const showPasswordModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const saving = ref(false)
const formError = ref('')
const createSubmitted = ref(false)
const passwordSubmitted = ref(false)
const showPassword = ref(false)
const showPasswordModal2 = ref(false)

const deleteId = ref(0)
const deleteName = ref('')
const passwordUserId = ref(0)
const passwordUserName = ref('')
const editUserId = ref(0)

const createForm = ref({ role: 'user' as 'user' | 'admin', clientId: null as number | null, name: '', email: '', password: '' })
const passwordForm = ref({ newPassword: '' })
const editForm = ref({ role: 'user' as 'user' | 'admin', clientId: null as number | null, name: '', email: '' })

async function fetchUsuarios() {
  loading.value = true
  try {
    usuarios.value = await userService.getAll()
  } catch (e) {
    console.error('Error fetching usuarios:', e)
    usuarios.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchUsuarios(), fetchClientes({ page: 1, limit: 9999 })])
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const filteredUsuarios = computed(() => {
  let result = [...usuarios.value]
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter((u) => {
      const name = (u.name || '').toLowerCase()
      const client = (u.clientName || '').toLowerCase()
      const email = (u.email || '').toLowerCase()
      return name.includes(term) || client.includes(term) || email.includes(term)
    })
  }
  if (roleFilter.value) {
    result = result.filter((u) => u.role === roleFilter.value)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredUsuarios.value.length / perPage))

const paginatedUsuarios = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsuarios.value.slice(start, start + perPage)
})

watch([searchTerm, roleFilter], () => { currentPage.value = 1 })

function getUserInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function getUserColor(id: number): string {
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#14B8A6']
  return colors[id % colors.length]
}

function openCreateModal() {
  createForm.value = { role: 'user', clientId: null, name: '', email: '', password: '' }
  formError.value = ''
  createSubmitted.value = false
  showPassword.value = false
  showCreateModal.value = true
}

function openEditModal(u: User) {
  editUserId.value = u.id
  editForm.value = {
    role: u.role === 'admin' ? 'admin' : 'user',
    clientId: u.clientId || null,
    name: u.name || '',
    email: u.email || '',
  }
  formError.value = ''
  showEditModal.value = true
}

function openPasswordModal(u: User) {
  passwordUserId.value = u.id
  passwordUserName.value = u.name || u.email || `Usuario #${u.id}`
  passwordForm.value = { newPassword: '' }
  formError.value = ''
  passwordSubmitted.value = false
  showPasswordModal2.value = false
  showPasswordModal.value = true
}

async function handleCreate() {
  formError.value = ''
  createSubmitted.value = true

  if (createForm.value.role === 'user') {
    if (!createForm.value.clientId) { formError.value = 'El cliente es obligatorio.'; return }
  } else {
    if (!createForm.value.name) { formError.value = 'El nombre es obligatorio.'; return }
    if (!createForm.value.email) { formError.value = 'El correo es obligatorio.'; return }
  }
  if (!createForm.value.password || createForm.value.password.length < 6) { formError.value = 'La contraseña debe tener al menos 6 caracteres.'; return }

  saving.value = true
  try {
    const payload: CreateUserRequest = {
      password: createForm.value.password,
      role: createForm.value.role,
    }
    if (createForm.value.role === 'user') {
      payload.clientId = createForm.value.clientId!
      payload.email = createForm.value.email
    } else {
      payload.name = createForm.value.name
      payload.email = createForm.value.email
    }
    await userService.create(payload)
    showCreateModal.value = false
    await fetchUsuarios()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Error al crear el usuario'
  } finally {
    saving.value = false
  }
}

async function handleUpdate() {
  formError.value = ''
  saving.value = true
  try {
    const payload: UpdateUserRequest = {}
    if (editForm.value.role === 'user') {
      payload.clientId = editForm.value.clientId || undefined
      payload.email = editForm.value.email || undefined
    } else {
      payload.name = editForm.value.name || undefined
      payload.email = editForm.value.email || undefined
    }
    await userService.update(editUserId.value, payload)
    showEditModal.value = false
    await fetchUsuarios()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Error al actualizar el usuario'
  } finally {
    saving.value = false
  }
}

async function handleChangePassword() {
  formError.value = ''
  passwordSubmitted.value = true
  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) { formError.value = 'La contraseña debe tener al menos 6 caracteres.'; return }

  saving.value = true
  try {
    await userService.changePassword(passwordUserId.value, passwordForm.value.newPassword)
    showPasswordModal.value = false
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Error al cambiar la contraseña'
  } finally {
    saving.value = false
  }
}

function deleteUsuario(id: number, name: string) {
  deleteId.value = id
  deleteName.value = name
  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    await userService.delete(deleteId.value)
    showDeleteModal.value = false
    await fetchUsuarios()
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Error al eliminar')
  }
}

watch(showCreateModal, (open) => {
  if (open) {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') showCreateModal.value = false }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }
})

watch(showPasswordModal, (open) => {
  if (open) {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') showPasswordModal.value = false }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }
})

watch(showEditModal, (open) => {
  if (open) {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') showEditModal.value = false }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }
})

watch(showDeleteModal, (open) => {
  if (open) {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') showDeleteModal.value = false }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }
})
</script>

<style scoped>
.usuarios-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }

.summary-cards { display: flex; gap: 10px; }
.summary-card { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--c-white); border: 1px solid var(--c-border); border-radius: 10px; }
.summary-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; }
.summary-icon.activos { background: #DCFCE7; color: #16A34A; }
.summary-icon.admins { background: #DBEAFE; color: #2563EB; }
.summary-icon.clientes { background: #FEF3C7; color: #D97706; }
.summary-info { display: flex; flex-direction: column; }
.summary-count { font-size: 1.1rem; font-weight: 700; color: var(--c-black); line-height: 1; }
.summary-label { font-size: 0.68rem; color: var(--c-gray); margin-top: 2px; white-space: nowrap; }

.filters-bar { display: flex; flex-direction: column; gap: 10px; }
.search-box { position: relative; max-width: 400px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: all 0.2s; }
.search-input:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.12); }
.search-input::placeholder { color: var(--c-gray-light); }
.filter-group { display: flex; gap: 8px; align-items: flex-end; }
.filter-field { display: flex; flex-direction: column; gap: 4px; }
.filter-label { font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }
.form-select { padding: 11px 32px 11px 14px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; cursor: pointer; appearance: auto; width: 140px; transition: all 0.2s; }
.form-select:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.12); }
.clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; background: none; color: var(--c-gray-light); border-radius: 4px; cursor: pointer; transition: all 0.15s; }
.clear-btn:hover { background: var(--c-light); color: var(--c-black); }

.table-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: 14px; overflow: hidden; }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.data-table th { padding: 12px 14px; text-align: left; font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 14px; font-size: 0.85rem; color: var(--c-black); border-bottom: 1px solid var(--c-border); vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.data-table td:nth-child(1) { white-space: normal; word-break: break-word; }
.data-table td:nth-child(2) { white-space: normal; word-break: break-word; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(249, 250, 251, 0.5); }
.data-table th:nth-child(1), .data-table td:nth-child(1) { width: 30%; }
.data-table th:nth-child(2), .data-table td:nth-child(2) { width: 30%; }
.data-table th:nth-child(3), .data-table td:nth-child(3) { width: 15%; }
.data-table th:nth-child(4), .data-table td:nth-child(4) { width: 25%; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; color: white; font-size: 0.72rem; font-weight: 700; flex-shrink: 0; }
.user-name { font-weight: 600; }

.rol-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
.rol-badge.admin { background: #EFF6FF; color: #2563EB; }
.rol-badge.user { background: #F0FDF4; color: #16A34A; }

.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; gap: 12px; color: var(--c-gray); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; gap: 12px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: var(--c-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.actions-cell { display: flex; gap: 4px; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.action-btn:hover { background: var(--c-light); color: var(--c-primary); }
.action-btn.delete-btn:hover { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 16px; border-top: 1px solid var(--c-border); }
.page-btn { display: flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 6px; background: var(--c-white); color: var(--c-dark); font-size: 0.82rem; cursor: pointer; transition: all 0.15s; }
.page-btn:hover:not(:disabled):not(.active) { border-color: var(--c-primary); color: var(--c-primary); }
.page-btn.active { background: var(--c-primary); color: white; border-color: var(--c-primary); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-dots { color: var(--c-gray); font-size: 0.85rem; padding: 0 4px; }

.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--c-primary); color: white; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-left: auto; white-space: nowrap; }
.btn-primary:hover { opacity: 0.9; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
.modal-content { background: var(--c-white); border-radius: 16px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; }
.modal-content.modal-sm { max-width: 520px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; background: #596983; border-radius: 16px 16px 0 0; }
.modal-header h3 { font-size: 1.1rem; font-weight: 700; color: white; margin: 0; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: white; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
.modal-close:hover { background: rgba(255,255,255,0.2); }
.modal-error { display: flex; align-items: center; gap: 8px; padding: 12px 16px; margin: 16px 24px 0; background: #FEF2F2; color: #DC2626; border-radius: 8px; font-size: 0.85rem; }
.modal-body { padding: 32px 24px; background: #f1f2f3; }
.modal-info { margin: 0 0 16px; font-size: 0.88rem; color: #374151; }
.form-grid-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group-full { grid-column: 1 / -1; }
.form-group label { font-size: 0.78rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }
.form-input { padding: 11px 14px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box; }
.form-input:hover { border-color: #9ca3af; }
.form-input:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.12); }
.field-error { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important; }
.form-input.auto-filled { background: #f9fafb; color: #6b7280; cursor: default; }
.auto-fill-hint { font-size: 0.72rem; color: #6b7280; margin-top: 2px; font-style: italic; }
.client-id-hint { font-size: 0.75rem; color: var(--c-gray); margin-top: -2px; }

.client-dropdown-wrapper { position: relative; }
.client-dropdown-trigger {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 14px; border: 1.5px solid #d1d5db; border-radius: 10px;
  font-size: 0.88rem; color: var(--c-black); background: var(--c-white);
  cursor: pointer; transition: all 0.2s; width: 100%; box-sizing: border-box;
}
.client-dropdown-trigger:hover { border-color: #9ca3af; }
.client-dropdown-trigger:focus { outline: none; border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.12); }
.client-dropdown-trigger .placeholder { color: var(--c-gray-light); }
.client-dropdown-actions { display: flex; align-items: center; gap: 6px; }
.btn-clear-client { display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border: none; background: #e5e7eb; color: #6b7280; border-radius: 50%; cursor: pointer; padding: 0; transition: all 0.15s; }
.btn-clear-client:hover { background: #d1d5db; color: #374151; }
.client-dropdown-list {
  position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px;
  background: var(--c-white); border: 1.5px solid #d1d5db; border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); z-index: 100; overflow: hidden;
}
.client-dropdown-search {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border-bottom: 1px solid #e5e7eb; color: var(--c-gray);
}
.client-search-input {
  border: none; outline: none; font-size: 0.85rem; color: var(--c-black);
  width: 100%; background: transparent;
}
.client-search-input::placeholder { color: var(--c-gray-light); }
.client-dropdown-items { max-height: 200px; overflow-y: auto; }
.client-dropdown-item {
  padding: 9px 12px; font-size: 0.85rem; color: var(--c-black);
  cursor: pointer; transition: background 0.15s;
}
.client-dropdown-item:hover { background: #f3f4f6; }
.client-dropdown-item.selected { background: rgba(200, 155, 45, 0.1); color: #B8892A; font-weight: 600; }
.client-dropdown-empty { padding: 12px; text-align: center; font-size: 0.82rem; color: var(--c-gray); }

.password-input-wrap { position: relative; }
.password-input-wrap .form-input { padding-right: 40px; }
.btn-toggle-password {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border: none; background: none;
  color: var(--c-gray); cursor: pointer; border-radius: 6px; transition: all 0.2s;
}
.btn-toggle-password:hover { background: #f3f4f6; color: var(--c-black); }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #EFF6FF; border-radius: 0 0 16px 16px; }
.btn-cancel { padding: 10px 20px; border: 1.5px solid #d1d5db; border-radius: 10px; background: var(--c-white); color: #374151; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #B8892A; color: white; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

.delete-modal-body { padding: 32px 28px; text-align: center; }
.delete-icon { color: var(--c-danger, #dc2626); margin-bottom: 12px; }
.delete-title { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin: 0 0 8px; }
.delete-text { font-size: 0.88rem; color: var(--c-gray); margin: 0 0 24px; line-height: 1.5; }
.delete-actions { display: flex; gap: 10px; justify-content: center; }
.delete-actions .btn-cancel { padding: 10px 20px; border: 1.5px solid #d1d5db; border-radius: 10px; background: var(--c-white); color: #374151; font-size: 0.85rem; font-weight: 500; cursor: pointer; }
.delete-actions .btn-cancel:hover { background: #f9fafb; }
.delete-actions .btn-delete { padding: 10px 20px; border: none; border-radius: 10px; background: #dc2626; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.delete-actions .btn-delete:hover { background: #b91c1c; transform: translateY(-1px); }

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .filter-group { overflow-x: auto; flex-wrap: nowrap; }
  .form-grid-modal { grid-template-columns: 1fr; }
}
</style>
