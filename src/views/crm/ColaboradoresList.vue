<template>
  <div class="colaboradores-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Colaboradores</h1>
        <p class="page-subtitle">{{ filteredColaboradores.length }} colaboradores registrados{{ totalPages > 1 ? ` — Página ${currentPage} de ${totalPages}` : '' }}</p>
      </div>
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon disponibles">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ colaboradores.filter(c => c.estado === 'disponible').length }}</span>
            <span class="summary-label">Disponibles</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon asignados">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ colaboradores.filter(c => c.estado === 'asignado').length }}</span>
            <span class="summary-label">Asignados</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon no-disponible">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ colaboradores.filter(c => c.estado === 'no_disponible').length }}</span>
            <span class="summary-label">No disponibles</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon pendientes">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ colaboradores.filter(c => c.estado === 'documentacion_pendiente').length }}</span>
            <span class="summary-label">Doc. pendiente</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon inactivos">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ colaboradores.filter(c => c.estado === 'inactivo').length }}</span>
            <span class="summary-label">Inactivos</span>
          </div>
        </div>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Crear Colaborador
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Buscar en toda la tabla..." class="search-input" />
        <button v-if="searchTerm" class="clear-btn" @click="searchTerm = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="filter-group">
        <div class="filter-field">
          <label class="filter-label">Estado</label>
          <select v-model="activeFilter" class="form-select">
            <option v-for="f in estadoFilters" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
        </div>
        <div class="filter-field">
          <label class="filter-label">Ciudad</label>
          <select v-model="ciudadFilter" class="form-select">
            <option value="">Todas</option>
            <option v-for="c in ciudadOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="filter-field">
          <label class="filter-label">Estudios</label>
          <select v-model="estudiosFilter" class="form-select">
            <option value="">Todos</option>
            <option v-for="e in estudiosOptions" :key="e" :value="e">{{ e }}</option>
          </select>
        </div>
        <div class="filter-field">
          <label class="filter-label">Norma</label>
          <select v-model="normaFilter" class="form-select">
            <option value="">Todas</option>
            <option v-for="n in normaOptions" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando colaboradores...</p>
      </div>
      <div v-else-if="filteredColaboradores.length === 0" class="empty-state">
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
              <tr v-for="c in paginatedColaboradores" :key="c.id">
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
                      <Teleport to="body">
                        <div v-if="openPopoverId === c.id" class="normas-modal-overlay">
                          <div class="normas-modal" @click.stop>
                            <div class="normas-modal-header">
                              <h3>Competencias / Normas</h3>
                              <button class="modal-close" @click="openPopoverId = null">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                              </button>
                            </div>
                            <div class="normas-modal-body">
                              <div v-if="!c.competencias || c.competencias.length === 0" class="normas-empty">
                                No tiene competencias registradas
                              </div>
                              <div v-else v-for="comp in c.competencias" :key="comp.id" class="normas-card">
                                <div class="normas-card-header">
                                  <span class="normas-card-norma">{{ comp.norma }}</span>
                                  <span class="normas-card-area">{{ comp.area }}</span>
                                </div>
                                <p class="normas-card-desc" v-if="comp.descripcion">{{ comp.descripcion }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Teleport>
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
                    <button class="action-btn" title="Actualizar" @click="openEdit(c)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn delete-btn" title="Eliminar" @click="deleteColaborador(c.id, c.nombre)">
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
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content modal-lg" @click.stop>
        <div class="modal-header">
          <h3>{{ editingId ? 'Editar' : 'Crear' }} Colaborador</h3>
          <button class="modal-close" @click="closeModal">
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
            <div class="form-group">
              <label>Nombre completo *</label>
              <input v-model="form.name" type="text" class="form-input" :class="{ 'field-error': fieldError('name') }" placeholder="Ej: Camila Rodriguez" />
            </div>
            <div class="form-group">
              <label>Estudios</label>
              <input v-model="form.studies" type="text" class="form-input" placeholder="Ej: Ingeniera Ambiental - Universidad Nacional" />
            </div>
            <div class="form-group">
              <label>Área Principal</label>
              <input v-model="form.mainArea" type="text" class="form-input" placeholder="Ej: Gestión Ambiental" />
            </div>
            <div class="form-group">
              <label>Ciudad</label>
              <input v-model="form.city" type="text" class="form-input" placeholder="Ej: Bogotá D.C." />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="form.phone" type="text" class="form-input" placeholder="Ej: 300 123 4567" />
            </div>
            <div class="form-group">
              <label>Correo electrónico</label>
              <input v-model="form.email" type="email" class="form-input" placeholder="Ej: camila@ejemplo.com" />
            </div>
            <div class="form-group">
              <label>Estado *</label>
              <select v-model="form.status" class="form-input" :class="{ 'field-error': fieldError('status') }">
                <option value="available">Disponible</option>
                <option value="assigned">Asignado</option>
                <option value="unavailable">No disponible</option>
                <option value="pending_docs">Doc. pendiente</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <!-- Competencias -->
          <div class="competencias-section">
            <div class="competencias-header">
              <h4>Competencias</h4>
              <button class="btn-add-competencia" @click="addCompetencia">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar
              </button>
            </div>
            <div v-if="form.competencies.length === 0" class="empty-competencias">
              No hay competencias agregadas
            </div>
            <div v-else class="competencias-list">
              <div v-for="(comp, idx) in form.competencies" :key="idx" class="competencia-row">
                <div class="comp-field">
                  <label class="comp-label-text">Área / Especialidad</label>
                  <input v-model="comp.area" type="text" class="form-input comp-input" />
                </div>
                <div class="comp-field">
                  <label class="comp-label-text">Norma</label>
                  <input v-model="comp.norm" type="text" class="form-input comp-input" />
                </div>
                <div class="comp-field comp-field-desc">
                  <label class="comp-label-text">Detalle</label>
                  <input v-model="comp.description" type="text" class="form-input comp-input" />
                </div>
                <button class="btn-remove" @click="removeCompetencia(idx)" title="Eliminar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleCreate">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear Colaborador') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content modal-sm" @click.stop>
        <div class="delete-modal-body">
          <div class="delete-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="delete-title">Eliminar colaborador</h3>
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
import { ref, computed, onMounted, watch } from 'vue'
import { collaboratorService } from '@/services/api/collaboratorService'
import type { Colaborador, CreateColaboradorRequest } from '@/types/crmTypes'

defineProps<{ inline?: boolean }>()
defineEmits<{ viewColaborador: [id: number] }>()

const colaboradores = ref<Colaborador[]>([])
const loading = ref(false)
const searchTerm = ref('')
const activeFilter = ref('todos')
const ciudadFilter = ref('')
const estudiosFilter = ref('')
const normaFilter = ref('')
const openPopoverId = ref<number | null>(null)
const currentPage = ref(1)
const perPage = 30

const statusMapReverse: Record<string, string> = {
  disponible: 'available',
  asignado: 'assigned',
  no_disponible: 'unavailable',
  documentacion_pendiente: 'pending_docs',
  inactivo: 'inactive',
}

const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const editingId = ref<number | null>(null)
const showDeleteModal = ref(false)
const deleteId = ref(0)
const deleteName = ref('')
const submitted = ref(false)

const emptyForm = (): CreateColaboradorRequest => ({
  name: '',
  studies: '',
  mainArea: '',
  city: '',
  phone: '',
  email: '',
  status: 'available',
  competencies: [],
})
const form = ref<CreateColaboradorRequest>(emptyForm())

async function fetchColaboradores() {
  loading.value = true
  try {
    colaboradores.value = await collaboratorService.getAll()
    console.log('Colaboradores cargados:', colaboradores.value.length, colaboradores.value[0])
  } catch {
    colaboradores.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchColaboradores)

function toggleNormas(id: number) {
  openPopoverId.value = openPopoverId.value === id ? null : id
}

function deleteColaborador(id: number, name: string) {
  deleteId.value = id
  deleteName.value = name
  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    await collaboratorService.delete(deleteId.value)
    showDeleteModal.value = false
    await fetchColaboradores()
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Error al eliminar')
  }
}

function openCreateModal() {
  form.value = emptyForm()
  editingId.value = null
  formError.value = ''
  showModal.value = true
}

function openEdit(c: Colaborador) {
  editingId.value = c.id
  form.value = {
    name: c.nombre,
    studies: c.estudios,
    mainArea: c.areaPrincipal,
    city: c.ciudad,
    phone: c.celular,
    email: c.correo,
    status: statusMapReverse[c.estado] as CreateColaboradorRequest['status'],
    competencies: c.competencias.map(comp => ({
      area: comp.area,
      norm: comp.norma,
      description: comp.descripcion,
    })),
  }
  formError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  formError.value = ''
  submitted.value = false
}

function addCompetencia() {
  form.value.competencies.push({ area: '', norm: '', description: '' })
}

function removeCompetencia(idx: number) {
  form.value.competencies.splice(idx, 1)
}

async function handleCreate() {
  formError.value = ''
  submitted.value = true

  if (!form.value.name.trim()) { formError.value = 'El nombre es obligatorio.'; return }
  if (!form.value.status) { formError.value = 'El estado es obligatorio.'; return }

  saving.value = true
  try {
    if (editingId.value) {
      await collaboratorService.update(editingId.value, form.value)
    } else {
      await collaboratorService.create(form.value)
    }
    showModal.value = false
    await fetchColaboradores()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Error al guardar el colaborador'
  } finally {
    saving.value = false
  }
}

function fieldError(field: string): boolean {
  if (!submitted.value) return false
  if (field === 'name') return !form.value.name.trim()
  if (field === 'status') return !form.value.status
  return false
}

const estadoFilters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Disponible', value: 'disponible' },
  { label: 'Asignado', value: 'asignado' },
  { label: 'No disponible', value: 'no_disponible' },
  { label: 'Doc. pendiente', value: 'documentacion_pendiente' },
  { label: 'Inactivo', value: 'inactivo' },
]

const ciudadOptions = computed(() => {
  const set = new Set(colaboradores.value.map(c => c.ciudad).filter(Boolean))
  return [...set].sort()
})

const estudiosOptions = computed(() => {
  const set = new Set(colaboradores.value.map(c => c.estudios).filter(Boolean))
  return [...set].sort()
})

const normaOptions = computed(() => {
  const set = new Set(colaboradores.value.flatMap(c => (c.competencias || []).map(comp => comp.norma)).filter(Boolean))
  return [...set].sort()
})

const filteredColaboradores = computed(() => {
  let result = [...colaboradores.value]

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter((c) => {
      const name = (c.nombre || '').toLowerCase()
      const studies = (c.estudios || '').toLowerCase()
      const area = (c.areaPrincipal || '').toLowerCase()
      const city = (c.ciudad || '').toLowerCase()
      const status = (c.estado || '').toLowerCase()
      const phone = (c.celular || '').toLowerCase()
      const email = (c.correo || '').toLowerCase()
      const comps = c.competencias || []
      const matchComp = comps.some(
        (comp) =>
          (comp.area || '').toLowerCase().includes(term) ||
          (comp.norma || '').toLowerCase().includes(term) ||
          (comp.descripcion || '').toLowerCase().includes(term)
      )
      return name.includes(term) || studies.includes(term) || area.includes(term) ||
        city.includes(term) || status.includes(term) || phone.includes(term) ||
        email.includes(term) || matchComp
    })
  }

  if (activeFilter.value !== 'todos') {
    result = result.filter((c) => c.estado === activeFilter.value)
  }

  if (ciudadFilter.value) {
    result = result.filter((c) => c.ciudad === ciudadFilter.value)
  }

  if (estudiosFilter.value) {
    result = result.filter((c) => c.estudios === estudiosFilter.value)
  }

  if (normaFilter.value) {
    result = result.filter((c) => c.competencias.some((comp) => comp.norma === normaFilter.value))
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredColaboradores.value.length / perPage))

const paginatedColaboradores = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredColaboradores.value.slice(start, start + perPage)
})

watch(showModal, (open) => {
  if (open) {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }
})

watch(showDeleteModal, (open) => {
  if (open) {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') showDeleteModal.value = false
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }
})

watch(openPopoverId, (id) => {
  if (id !== null) {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') openPopoverId.value = null
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }
})

watch([searchTerm, activeFilter, ciudadFilter, estudiosFilter, normaFilter], () => {
  currentPage.value = 1
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

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }

.summary-cards { display: flex; gap: 10px; }
.summary-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 10px;
}
.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}
.summary-icon.disponibles { background: #DCFCE7; color: #16A34A; }
.summary-icon.asignados { background: #DBEAFE; color: #2563EB; }
.summary-icon.no-disponible { background: #FEE2E2; color: #DC2626; }
.summary-icon.pendientes { background: #FEF3C7; color: #D97706; }
.summary-icon.inactivos { background: #F3F4F6; color: #6B7280; }
.summary-info { display: flex; flex-direction: column; }
.summary-count { font-size: 1.1rem; font-weight: 700; color: var(--c-black); line-height: 1; }
.summary-label { font-size: 0.68rem; color: var(--c-gray); margin-top: 2px; white-space: nowrap; }

.filters-bar { display: flex; flex-direction: column; gap: 10px; }
.search-box { position: relative; max-width: 400px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: var(--c-primary); }
.search-input::placeholder { color: var(--c-gray-light); }
.filter-group { display: flex; gap: 8px; align-items: flex-end; justify-content: flex-start; }
.filter-field { display: flex; flex-direction: column; gap: 4px; }
.filter-label { font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }
.form-select {
  padding: 9px 28px 9px 12px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  font-size: 0.82rem;
  font-family: inherit;
  background: var(--c-white);
  color: var(--c-black);
  outline: none;
  cursor: pointer;
  appearance: auto;
  width: 140px;
}
.form-select:focus { border-color: var(--c-primary); }
.clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; background: none; color: var(--c-gray-light); border-radius: 4px; cursor: pointer; transition: all 0.15s; }
.clear-btn:hover { background: var(--c-light); color: var(--c-black); }

.table-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: 14px; }
.table-responsive { overflow-x: auto; }

.data-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.data-table th { padding: 12px 14px; text-align: left; font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 14px; font-size: 0.85rem; color: var(--c-black); border-bottom: 1px solid var(--c-border); vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.data-table td:nth-child(5) { white-space: normal; word-break: break-word; }
.data-table td:nth-child(2) { white-space: normal; word-break: break-word; }
.data-table td:nth-child(1) { white-space: normal; word-break: break-word; }
.data-table td:nth-child(3) { white-space: normal; word-break: break-word; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(249, 250, 251, 0.5); }
.data-table th:nth-child(1), .data-table td:nth-child(1) { width: 17%; }
.data-table th:nth-child(2), .data-table td:nth-child(2) { width: 14%; }
.data-table th:nth-child(3), .data-table td:nth-child(3) { width: 11%; }
.data-table th:nth-child(4), .data-table td:nth-child(4) { width: 7%; }
.data-table th:nth-child(5), .data-table td:nth-child(5) { width: 12%; }
.data-table th:nth-child(6), .data-table td:nth-child(6) { width: 11%; }
.data-table th:nth-child(7), .data-table td:nth-child(7) { width: 9%; }

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
.normas-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.normas-modal {
  background: var(--c-white);
  border-radius: 14px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.normas-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--c-border);
  background: #f0f0f0;
}
.normas-modal-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
}
.normas-modal-header .modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #F0F0F0;
  border-radius: 8px;
  cursor: pointer;
  color: #000;
  transition: all 0.15s;
}
.normas-modal-header .modal-close:hover { background: #E0E0E0; }
.normas-modal-body {
  padding: 16px 24px 20px;
  background: #e7e6d9;
}
.normas-empty {
  text-align: center;
  color: #666;
  padding: 24px 0;
  font-size: 0.88rem;
}
.normas-card {
  border: 1px solid #312e2e;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 10px;
}
.normas-card:last-child { margin-bottom: 0; }
.normas-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.normas-card-norma {
  font-weight: 700;
  font-size: 0.88rem;
  color: #000;
}
.normas-card-area {
  font-size: 0.76rem;
  color: #000;
  background: #dbdd57;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 500;
}
.normas-card-desc {
  margin: 0;
  font-size: 0.8rem;
  color: #333;
  line-height: 1.5;
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
.action-btn.delete-btn:hover { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: var(--c-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 60px 20px; color: var(--c-gray); }
.empty-state svg { color: var(--c-gray-light); margin-bottom: 16px; }
.empty-state h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
.empty-state p { font-size: 0.88rem; color: var(--c-gray); }

@media (max-width: 768px) { .page-header { flex-direction: column; align-items: flex-start; } .filter-group { overflow-x: auto; flex-wrap: nowrap; } }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
  white-space: nowrap;
}
.btn-primary:hover { opacity: 0.9; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: var(--c-white); border-radius: 14px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; }
.modal-content.modal-lg { max-width: 800px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--c-border); }
.modal-header h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.modal-close:hover { background: var(--c-light); color: var(--c-black); }
.modal-error { display: flex; align-items: center; gap: 8px; margin: 0 24px; padding: 10px 14px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; color: #991B1B; font-size: 0.85rem; }
.modal-body { padding: 24px; }
.form-grid-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
.form-input { padding: 10px 12px; border: 1px solid var(--c-border); border-radius: 8px; font-size: 0.88rem; font-family: inherit; color: var(--c-black); background: var(--c-white); outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: var(--c-primary); }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--c-border); }
.btn-cancel { padding: 10px 18px; border: 1px solid var(--c-border); border-radius: 8px; background: var(--c-white); color: var(--c-gray); font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
.btn-cancel:hover { background: var(--c-light); color: var(--c-black); }
.btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border: none; border-radius: 8px; background: var(--c-primary); color: white; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.btn-save:hover { opacity: 0.9; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

.competencias-section { margin-top: 20px; }
.competencias-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.competencias-header h4 { font-size: 0.95rem; font-weight: 700; color: var(--c-black); }
.btn-add-competencia { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid var(--c-primary); border-radius: 6px; background: var(--c-white); color: var(--c-primary); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.btn-add-competencia:hover { background: var(--c-primary); color: white; }
.empty-competencias { text-align: center; padding: 20px; background: var(--c-light); border-radius: 8px; color: var(--c-gray); font-size: 0.85rem; }
.competencias-list { display: flex; flex-direction: column; gap: 8px; }
.competencia-row { display: flex; align-items: flex-start; gap: 8px; padding: 10px; background: var(--c-light); border-radius: 8px; }
.comp-field { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.comp-field-desc { flex: 1.5; }
.comp-label-text {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.comp-input { flex: 1; padding: 8px 10px; font-size: 0.82rem; }
.comp-desc { flex: 2; }
.btn-remove { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background: none; color: var(--c-gray-light); border-radius: 6px; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
.btn-remove:hover { background: #FEE2E2; color: #DC2626; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  border-top: 1px solid var(--c-border);
}
.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-white);
  color: var(--c-dark);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled):not(.active) { border-color: var(--c-primary); color: var(--c-primary); }
.page-btn.active { background: var(--c-primary); color: white; border-color: var(--c-primary); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-dots { color: var(--c-gray); font-size: 0.85rem; padding: 0 4px; }

.modal-sm { max-width: 400px; }
.delete-modal-body { padding: 32px 28px; text-align: center; }
.delete-icon { color: var(--c-danger, #dc2626); margin-bottom: 12px; }
.delete-title { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin: 0 0 8px; }
.delete-text { font-size: 0.88rem; color: var(--c-gray); margin: 0 0 24px; line-height: 1.5; }
.delete-actions { display: flex; gap: 10px; justify-content: center; }
.delete-actions .btn-cancel {
  padding: 10px 20px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  color: var(--c-dark);
  font-size: 0.85rem;
  cursor: pointer;
}
.delete-actions .btn-cancel:hover { background: var(--c-light); }
.delete-actions .btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #dc2626;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.delete-actions .btn-delete:hover { background: #b91c1c; }

.field-error { border-color: #dc2626 !important; box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.15) !important; }

@media (max-width: 768px) {
  .form-grid-modal { grid-template-columns: 1fr; }
  .competencia-row { flex-direction: column; }
}
</style>
