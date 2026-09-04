<template>
  <div class="documentos-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Documentos</h1>
        <p class="page-subtitle">{{ filteredDocumentos.length }} documentos registrados{{ totalPages > 1 ? ` — Página ${currentPage} de ${totalPages}` : '' }}</p>
      </div>
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon clientes">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ documentos.filter(d => d.entityType === 'client').length }}</span>
            <span class="summary-label">Clientes</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon proyectos">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ documentos.filter(d => d.entityType === 'project').length }}</span>
            <span class="summary-label">Proyectos</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon cotizaciones">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ documentos.filter(d => d.entityType === 'quote').length }}</span>
            <span class="summary-label">Cotizaciones</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon licitaciones">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ documentos.filter(d => d.entityType === 'tender').length }}</span>
            <span class="summary-label">Licitaciones</span>
          </div>
        </div>
      </div>
      <button class="btn-primary" @click="openUploadModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Subir Documento
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Buscar por nombre..." class="search-input" />
        <button v-if="searchTerm" class="clear-btn" @click="searchTerm = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="filter-group">
        <div class="filter-field">
          <label class="filter-label">Entidad</label>
          <select v-model="entityFilter" class="form-select">
            <option value="">Todas</option>
            <option value="client">Cliente</option>
            <option value="project">Proyecto</option>
            <option value="quote">Cotización</option>
            <option value="tender">Licitación</option>
          </select>
        </div>
        <div class="filter-field">
          <label class="filter-label">Tipo</label>
          <select v-model="typeFilter" class="form-select">
            <option value="">Todos</option>
            <option value="contrato">Contrato</option>
            <option value="cotizacion">Cotización</option>
            <option value="informe">Informe</option>
            <option value="certificado">Certificado</option>
            <option value="acta">Acta</option>
            <option value="presentacion">Presentación</option>
            <option value="hoja_de_vida">Hoja de vida</option>
            <option value="soportes_estudio">Soportes estudio</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="uploadSuccessMessage" class="success-banner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      {{ uploadSuccessMessage }}
    </div>
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando documentos...</p>
      </div>
      <div v-else-if="filteredDocumentos.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>No se encontraron documentos</p>
      </div>
      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Entidad</th>
              <th>Visible</th>
              <th>Subido por</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in paginatedDocumentos" :key="doc.id">
              <td>
                <div class="doc-name-cell">
                  <div class="doc-icon" :style="{ background: getDocColor(doc.type) }">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <span class="doc-name">{{ doc.name }}</span>
                </div>
              </td>
              <td><span class="type-badge" :class="doc.type">{{ formatType(doc.type) }}</span></td>
              <td><span class="entity-badge" :class="doc.entityType">{{ formatEntityType(doc.entityType) }}</span></td>
              <td>
                <span class="visibility-badge" :class="doc.isVisible !== false ? 'visible' : 'hidden'">
                  {{ doc.isVisible !== false ? 'Sí' : 'No' }}
                </span>
              </td>
              <td>{{ doc.user }}</td>
              <td>{{ formatDate(doc.createdAt) }}</td>
              <td>
                <div class="actions-cell">
                  <a v-if="doc.url" :href="doc.url" target="_blank" class="action-btn" title="Descargar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </a>
                  <button class="action-btn" title="Actualizar" @click="openEditModal(doc)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="action-btn delete-btn" title="Eliminar" @click="deleteDocumento(doc.id, doc.name)">
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

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay">
      <div class="modal-content modal-sm" @click.stop>
        <div class="modal-header">
          <h3>Subir Documento</h3>
          <button class="modal-close" @click="closeUploadModal">
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
              <label>Tipo de entidad</label>
              <select v-model="uploadForm.entityType" class="form-input">
                <option value="">Ninguna (standalone)</option>
                <option value="client">Cliente</option>
                <option value="project">Proyecto</option>
                <option value="quote">Cotización</option>
                <option value="tender">Licitación</option>
              </select>
            </div>
            <div class="form-group">
              <label>ID de entidad</label>
              <input v-model.number="uploadForm.entityId" type="number" class="form-input" placeholder="Ej: 1" :disabled="!uploadForm.entityType" />
            </div>
            <div class="form-group">
              <label>Tipo de documento</label>
              <select v-model="uploadForm.type" class="form-input" :disabled="!uploadForm.entityType">
                <option value="">Seleccionar...</option>
                <option value="contrato">Contrato</option>
                <option value="cotizacion">Cotización</option>
                <option value="informe">Informe</option>
                <option value="certificado">Certificado</option>
                <option value="acta">Acta</option>
                <option value="presentacion">Presentación</option>
                <option value="hoja_de_vida">Hoja de vida</option>
                <option value="soportes_estudio">Soportes estudio</option>
              </select>
            </div>
            <div class="form-group">
              <label>Archivo *</label>
              <div class="file-input-wrapper" :class="{ 'field-error': submitted && !uploadForm.file, 'has-file': uploadForm.file }">
                <input type="file" ref="fileInput" class="file-input" @change="onFileChange" />
                <div class="file-input-label" v-if="!uploadForm.file">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Seleccionar archivo
                </div>
                <div class="file-selected" v-else>
                  <span>{{ uploadForm.file?.name }}</span>
                  <button class="file-remove" @click="uploadForm.file = null">✕</button>
                </div>
              </div>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="checkbox-label">
                <input type="checkbox" v-model="uploadForm.isVisible" />
                Visible en Portal del Cliente
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeUploadModal">Cancelar</button>
          <button class="btn-save" :disabled="uploading" @click="handleUpload">
            <span v-if="uploading" class="btn-spinner"></span>
            {{ uploading ? 'Subiendo...' : 'Subir Documento' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content modal-sm" @click.stop>
        <div class="modal-header">
          <h3>Actualizar Documento</h3>
          <button class="modal-close" @click="closeEditModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid-modal">
            <div class="form-group">
              <label>Nombre del archivo</label>
              <input v-model="editForm.name" type="text" class="form-input" placeholder="Nombre del documento" />
            </div>
            <div class="form-group">
              <label>Tipo de documento *</label>
              <select v-model="editForm.type" class="form-input">
                <option value="">Seleccionar...</option>
                <option value="contrato">Contrato</option>
                <option value="cotizacion">Cotización</option>
                <option value="informe">Informe</option>
                <option value="certificado">Certificado</option>
                <option value="acta">Acta</option>
                <option value="presentacion">Presentación</option>
                <option value="hoja_de_vida">Hoja de vida</option>
                <option value="soportes_estudio">Soportes estudio</option>
              </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="checkbox-label">
                <input type="checkbox" v-model="editForm.isVisible" />
                Visible en Portal del Cliente
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeEditModal">Cancelar</button>
          <button class="btn-save" :disabled="savingEdit" @click="handleEdit">
            <span v-if="savingEdit" class="btn-spinner"></span>
            {{ savingEdit ? 'Guardando...' : 'Guardar' }}
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
          <h3 class="delete-title">Eliminar documento</h3>
          <p class="delete-text">¿Estás seguro de eliminar <strong>{{ deleteName }}</strong>? Esta acción no se puede deshacer.</p>
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
import { documentService } from '@/services/api/documentService'
import type { DocumentoEntity, DocumentEntityType, DocumentType } from '@/types/crmTypes'

const documentos = ref<DocumentoEntity[]>([])
const loading = ref(false)
const searchTerm = ref('')
const entityFilter = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const perPage = 30

const showUploadModal = ref(false)
const uploading = ref(false)
const formError = ref('')
const submitted = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const showDeleteModal = ref(false)
const deleteId = ref(0)
const deleteName = ref('')

const showEditModal = ref(false)
const savingEdit = ref(false)
const editForm = ref({ id: 0, name: '', type: '' as DocumentType | '', isVisible: true })
const uploadSuccessMessage = ref('')

const uploadForm = ref({
  entityType: '' as DocumentEntityType | '',
  entityId: null as number | null,
  type: '' as DocumentType | '',
  isVisible: true,
  file: null as File | null,
})

async function fetchDocumentos() {
  loading.value = true
  try {
    const response = await documentService.getAll({ pageSize: 9999 })
    documentos.value = response.data
  } catch {
    documentos.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchDocumentos)

const filteredDocumentos = computed(() => {
  let result = [...documentos.value]

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter((d) => (d.name || '').toLowerCase().includes(term))
  }

  if (entityFilter.value) {
    result = result.filter((d) => d.entityType === entityFilter.value)
  }

  if (typeFilter.value) {
    result = result.filter((d) => d.type === typeFilter.value)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredDocumentos.value.length / perPage))

const paginatedDocumentos = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredDocumentos.value.slice(start, start + perPage)
})

watch([searchTerm, entityFilter, typeFilter], () => {
  currentPage.value = 1
})

function formatEntityType(type: DocumentEntityType): string {
  const labels: Record<string, string> = { client: 'Cliente', project: 'Proyecto', quote: 'Cotización', tender: 'Licitación' }
  return labels[type] || type
}

function formatType(type: DocumentType): string {
  const labels: Record<string, string> = {
    contrato: 'Contrato', cotizacion: 'Cotización', informe: 'Informe', certificado: 'Certificado',
    acta: 'Acta', presentacion: 'Presentación', hoja_de_vida: 'Hoja de vida', soportes_estudio: 'Soportes estudio',
  }
  return labels[type] || type
}

function getDocColor(type: DocumentType): string {
  const colors: Record<string, string> = {
    contrato: '#EFF6FF', cotizacion: '#F0FDF4', informe: '#FEF3C7', certificado: '#FDF4FF',
    acta: '#FFF7ED', presentacion: '#F0FDFA', hoja_de_vida: '#FEF2F2', soportes_estudio: '#F5F3FF',
  }
  return colors[type] || '#F3F4F6'
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function formatDate(date?: string): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

function openUploadModal() {
  uploadForm.value = { entityType: '', entityId: null, type: '', isVisible: true, file: null }
  formError.value = ''
  submitted.value = false
  showUploadModal.value = true
}

function closeUploadModal() {
  showUploadModal.value = false
  formError.value = ''
  submitted.value = false
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    uploadForm.value.file = input.files[0]
  }
}

async function handleUpload() {
  formError.value = ''
  submitted.value = true

  if (!uploadForm.value.file) { formError.value = 'Debe seleccionar un archivo.'; return }
  if (uploadForm.value.entityType && !uploadForm.value.entityId) { formError.value = 'El ID de entidad es obligatorio.'; return }
  if (uploadForm.value.entityId && !uploadForm.value.entityType) { formError.value = 'El tipo de entidad es obligatorio.'; return }
  if (uploadForm.value.entityType && uploadForm.value.entityId && !uploadForm.value.type) { formError.value = 'El tipo de documento es obligatorio.'; return }

  uploading.value = true
  try {
    await documentService.upload(uploadForm.value.file, {
      entityType: uploadForm.value.entityType || undefined,
      entityId: uploadForm.value.entityId || undefined,
      type: uploadForm.value.type || undefined,
      isVisible: uploadForm.value.isVisible,
    })
    showUploadModal.value = false
    uploadSuccessMessage.value = 'Documento subido exitosamente'
    setTimeout(() => { uploadSuccessMessage.value = '' }, 3000)
    await fetchDocumentos()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Error al subir el documento'
  } finally {
    uploading.value = false
  }
}

function deleteDocumento(id: number, name: string) {
  deleteId.value = id
  deleteName.value = name
  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    await documentService.delete(deleteId.value)
    showDeleteModal.value = false
    await fetchDocumentos()
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Error al eliminar')
  }
}

function openEditModal(doc: DocumentoEntity) {
  editForm.value = {
    id: doc.id,
    name: doc.name,
    type: doc.type || '',
    isVisible: doc.isVisible !== false,
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
}

async function handleEdit() {
  if (!editForm.value.id) return
  savingEdit.value = true
  try {
    await documentService.update(editForm.value.id, {
      name: editForm.value.name,
      type: editForm.value.type as DocumentType,
      isVisible: editForm.value.isVisible,
    })
    showEditModal.value = false
    await fetchDocumentos()
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Error al actualizar')
  } finally {
    savingEdit.value = false
  }
}

watch(showUploadModal, (open) => {
  if (open) {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeUploadModal() }
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
.documentos-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }

.success-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #DCFCE7;
  color: #16A34A;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.summary-cards { display: flex; gap: 10px; }
.summary-card { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--c-white); border: 1px solid var(--c-border); border-radius: 10px; }
.summary-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; }
.summary-icon.clientes { background: #DBEAFE; color: #2563EB; }
.summary-icon.proyectos { background: #DCFCE7; color: #16A34A; }
.summary-icon.cotizaciones { background: #FEF3C7; color: #D97706; }
.summary-icon.licitaciones { background: #F3E8FF; color: #9333EA; }
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
.form-select { padding: 9px 28px 9px 12px; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.82rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; cursor: pointer; appearance: auto; width: 140px; }
.form-select:focus { border-color: var(--c-primary); }
.clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; background: none; color: var(--c-gray-light); border-radius: 4px; cursor: pointer; transition: all 0.15s; }
.clear-btn:hover { background: var(--c-light); color: var(--c-black); }

.table-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: 14px; overflow: hidden; }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.data-table th { padding: 12px 14px; text-align: left; font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 14px; font-size: 0.85rem; color: var(--c-black); border-bottom: 1px solid var(--c-border); vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.data-table td:nth-child(1) { white-space: normal; word-break: break-word; }
.data-table td:nth-child(6) { white-space: normal; word-break: break-word; min-width: 120px; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(249, 250, 251, 0.5); }

.data-table th:nth-child(1), .data-table td:nth-child(1) { width: 26%; }
.data-table th:nth-child(2), .data-table td:nth-child(2) { width: 14%; }
.data-table th:nth-child(3), .data-table td:nth-child(3) { width: 12%; }
.data-table th:nth-child(4), .data-table td:nth-child(4) { width: 10%; }
.data-table th:nth-child(5), .data-table td:nth-child(5) { width: 16%; }
.data-table th:nth-child(6), .data-table td:nth-child(6) { width: 14%; }
.data-table th:nth-child(7), .data-table td:nth-child(7) { width: 10%; }

.doc-name-cell { display: flex; align-items: center; gap: 10px; }
.doc-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; color: #6B7280; flex-shrink: 0; }
.doc-name { font-weight: 600; }

.type-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
.type-badge.contrato { background: #EFF6FF; color: #2563EB; }
.type-badge.cotizacion { background: #F0FDF4; color: #16A34A; }
.type-badge.informe { background: #FEF3C7; color: #D97706; }
.type-badge.certificado { background: #FDF4FF; color: #9333EA; }
.type-badge.acta { background: #FFF7ED; color: #EA580C; }
.type-badge.presentacion { background: #F0FDFA; color: #0D9488; }
.type-badge.hoja_de_vida { background: #FEF2F2; color: #DC2626; }
.type-badge.soportes_estudio { background: #F5F3FF; color: #7C3AED; }

.entity-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
.entity-badge.client { background: #DBEAFE; color: #2563EB; }
.entity-badge.project { background: #DCFCE7; color: #16A34A; }
.entity-badge.quote { background: #FEF3C7; color: #D97706; }
.entity-badge.tender { background: #F3E8FF; color: #9333EA; }

.visibility-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
.visibility-badge.visible { background: #DCFCE7; color: #16A34A; }
.visibility-badge.hidden { background: #FEE2E2; color: #DC2626; }

.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; gap: 12px; color: var(--c-gray); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; gap: 12px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: var(--c-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.actions-cell { display: flex; gap: 4px; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; text-decoration: none; transition: all 0.15s; }
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

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: var(--c-white); border-radius: 14px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; }
.modal-content.modal-sm { max-width: 480px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--c-border); }
.modal-header h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin: 0; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.modal-close:hover { background: var(--c-light); color: var(--c-black); }
.modal-error { display: flex; align-items: center; gap: 8px; padding: 12px 16px; margin: 0 24px; margin-top: 16px; background: #FEF2F2; color: #DC2626; border-radius: 8px; font-size: 0.85rem; }
.modal-body { padding: 24px; }
.form-grid-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.82rem; font-weight: 600; color: var(--c-dark); }
.form-input { padding: 10px 14px; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: var(--c-primary); }
.field-error { border-color: #dc2626 !important; box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.15) !important; }

.file-input-wrapper { position: relative; border: 1px dashed var(--c-border); border-radius: 10px; overflow: hidden; cursor: pointer; transition: border-color 0.2s; }
.file-input-wrapper:hover { border-color: var(--c-primary); }
.file-input-wrapper.has-file { border-style: solid; border-color: var(--c-primary); background: #F0FDF4; }
.file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.file-input-label { display: flex; align-items: center; gap: 8px; padding: 12px 14px; color: var(--c-gray); font-size: 0.85rem; }
.file-selected { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; font-size: 0.85rem; color: var(--c-black); }
.file-remove { border: none; background: none; color: var(--c-gray); cursor: pointer; font-size: 1rem; padding: 2px 6px; border-radius: 4px; }
.file-remove:hover { background: #FEE2E2; color: #DC2626; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--c-border); }
.btn-cancel { padding: 10px 20px; border: 1px solid var(--c-border); border-radius: 8px; background: var(--c-white); color: var(--c-dark); font-size: 0.85rem; cursor: pointer; }
.btn-cancel:hover { background: var(--c-light); }
.btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--c-primary); color: white; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
.btn-save:hover { opacity: 0.9; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

.delete-modal-body { padding: 32px 28px; text-align: center; }
.delete-icon { color: var(--c-danger, #dc2626); margin-bottom: 12px; }
.delete-title { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin: 0 0 8px; }
.delete-text { font-size: 0.88rem; color: var(--c-gray); margin: 0 0 24px; line-height: 1.5; }
.delete-actions { display: flex; gap: 10px; justify-content: center; }
.delete-actions .btn-delete { padding: 10px 20px; border: none; border-radius: 8px; background: #dc2626; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
.delete-actions .btn-delete:hover { background: #b91c1c; }

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .filter-group { overflow-x: auto; flex-wrap: nowrap; }
  .form-grid-modal { grid-template-columns: 1fr; }
}
</style>
