<template>
  <div class="colaborador-detail">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando colaborador...</p>
    </div>
    <template v-else-if="colaborador">
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
        <div v-if="uploadSuccessMessage" class="success-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {{ uploadSuccessMessage }}
        </div>
        <div class="section-header">
          <h3>Documentos ({{ documents.length }})</h3>
          <button class="btn-upload" @click="openUploadModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Subir documento
          </button>
        </div>
        <div v-if="documents.length === 0" class="empty-tab">
          <p>No hay documentos registrados</p>
        </div>
        <div v-else class="docs-table-wrap">
          <table class="docs-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Subido por</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in documents" :key="doc.id">
                <td>
                  <div class="doc-name-cell">
                    <div class="doc-icon-sm" :style="{ background: getDocColor(doc.type) }">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <span class="doc-name">{{ doc.name }}</span>
                  </div>
                </td>
                <td><span class="type-badge" :class="doc.type">{{ formatDocType(doc.type) }}</span></td>
                <td>{{ doc.user || '-' }}</td>
                <td>{{ formatDateShort(doc.createdAt) }}</td>
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
                    <button class="action-btn delete-btn" title="Eliminar" @click="deleteDocument(doc.id, doc.name)">
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
      </div>

      <!-- Upload Modal -->
      <div v-if="showUploadModal" class="modal-overlay" @click.self="showUploadModal = false">
        <div class="modal-content modal-sm" @click.stop>
            <div class="modal-header">
              <h3>Subir Documento</h3>
              <button class="modal-close" @click="showUploadModal = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-grid-modal">
                <div class="form-group">
                  <label>Tipo de documento *</label>
                  <select v-model="uploadForm.type" class="form-input" :class="{ 'field-error': uploadSubmitted && !uploadForm.type }">
                    <option value="">Seleccionar...</option>
                    <option value="hoja_de_vida">Hoja de vida</option>
                    <option value="soportes_estudio">Soportes de estudio</option>
                    <option value="soportes_experiencia">Soportes de experiencia</option>
                    <option value="certificado">Certificado</option>
                    <option value="contrato">Contrato</option>
                    <option value="informe">Informe</option>
                    <option value="acta">Acta</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Nombre del archivo</label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="uploadForm.useOriginalName" />
                    Usar nombre original del archivo
                  </label>
                  <input v-if="!uploadForm.useOriginalName" v-model="uploadForm.name" type="text" class="form-input" placeholder="Nombre del documento" />
                  <span v-else class="file-original-name">{{ uploadForm.file?.name || 'Selecciona un archivo primero' }}</span>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label>Archivo *</label>
                  <div class="file-input-wrapper" :class="{ 'field-error': uploadSubmitted && !uploadForm.file, 'has-file': uploadForm.file }">
                    <input type="file" class="file-input" @change="onFileChange" />
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
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showUploadModal = false">Cancelar</button>
              <button class="btn-save" :disabled="uploading" @click="handleUpload">
                <span v-if="uploading" class="btn-spinner"></span>
                {{ uploading ? 'Subiendo...' : 'Subir Documento' }}
              </button>
            </div>
          </div>
        </div>
      <!-- Edit Modal -->
      <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
        <div class="modal-content modal-sm" @click.stop>
            <div class="modal-header">
              <h3>Actualizar Documento</h3>
              <button class="modal-close" @click="showEditModal = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-grid-modal">
                <div class="form-group">
                  <label>Tipo de documento *</label>
                  <select v-model="editForm.type" class="form-input">
                    <option value="">Seleccionar...</option>
                    <option value="hoja_de_vida">Hoja de vida</option>
                    <option value="soportes_estudio">Soportes de estudio</option>
                    <option value="soportes_experiencia">Soportes de experiencia</option>
                    <option value="certificado">Certificado</option>
                    <option value="contrato">Contrato</option>
                    <option value="informe">Informe</option>
                    <option value="acta">Acta</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Nombre del archivo</label>
                  <input v-model="editForm.name" type="text" class="form-input" placeholder="Nombre del documento" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showEditModal = false">Cancelar</button>
              <button class="btn-save" :disabled="savingEdit" @click="handleEdit">
                <span v-if="savingEdit" class="btn-spinner"></span>
                {{ savingEdit ? 'Guardando...' : 'Guardar' }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { collaboratorService } from '@/services/api/collaboratorService'
import { documentService } from '@/services/api/documentService'
import type { Colaborador, CompetenciaColaborador, DocumentoEntity, DocumentType } from '@/types/crmTypes'

const props = defineProps<{ colaboradorId?: number }>()

const activeTab = ref('informacion')
const colaborador = ref<Colaborador | null>(null)
const loading = ref(false)
const documents = ref<DocumentoEntity[]>([])

const showUploadModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const uploading = ref(false)
const savingEdit = ref(false)
const uploadSubmitted = ref(false)
const deleteId = ref(0)
const deleteName = ref('')
const uploadSuccessMessage = ref('')

const uploadForm = ref({ type: '' as DocumentType | '', name: '', useOriginalName: true, isVisible: false, file: null as File | null })
const editForm = ref({ id: 0, name: '', type: '' as string, isVisible: false })

const tabs = computed(() => [
  { id: 'informacion', label: 'Información' },
  { id: 'competencias', label: 'Competencias', count: colaborador.value?.competencias.length ?? 0 },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'documentos', label: 'Documentos', count: documents.value.length },
])

const agrupadoPorNorma = computed((): CompetenciaColaborador[] => {
  if (!colaborador.value) return []
  return colaborador.value.competencias
})

const documentosCompletos = computed(() => {
  if (!colaborador.value) return 0
  return colaborador.value.documentos.filter(d => d.estado === 'completo').length
})

async function fetchColaborador() {
  const id = props.colaboradorId
  if (!id) return
  loading.value = true
  try {
    colaborador.value = await collaboratorService.getById(id)
    await fetchDocuments(id)
  } catch {
    colaborador.value = null
  } finally {
    loading.value = false
  }
}

async function fetchDocuments(colaboradorId: number) {
  try {
    documents.value = await documentService.getByEntity('collaborator', colaboradorId)
  } catch {
    documents.value = []
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

function formatDocType(type: string): string {
  const labels: Record<string, string> = {
    hoja_de_vida: 'Hoja de vida',
    soportes_estudio: 'Soportes de estudio',
    soportes_experiencia: 'Soportes de experiencia',
    certificado: 'Certificado',
    contrato: 'Contrato',
    informe: 'Informe',
    acta: 'Acta',
  }
  return labels[type] || type
}

function getDocColor(type: string): string {
  const colors: Record<string, string> = {
    hoja_de_vida: '#EFF6FF',
    soportes_estudio: '#FEF3C7',
    soportes_experiencia: '#F0FDF4',
    certificado: '#FDF4FF',
    contrato: '#EFF6FF',
    informe: '#FEF3C7',
    acta: '#FFF7ED',
  }
  return colors[type] || '#F3F4F6'
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function openUploadModal() {
  uploadForm.value = { type: '', name: '', useOriginalName: true, isVisible: false, file: null }
  uploadSubmitted.value = false
  showUploadModal.value = true
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    uploadForm.value.file = file
    if (!uploadForm.value.name) {
      uploadForm.value.name = file.name.replace(/\.[^.]+$/, '')
    }
  }
}

async function handleUpload() {
  uploadSubmitted.value = true
  if (!uploadForm.value.type) return
  if (!uploadForm.value.file) return
  if (!colaborador.value) return

  uploading.value = true
  try {
    const fileName = uploadForm.value.useOriginalName
      ? uploadForm.value.file?.name.replace(/\.[^.]+$/, '')
      : uploadForm.value.name
    await documentService.upload(uploadForm.value.file, {
      entityType: 'collaborator',
      entityId: colaborador.value.id,
      type: uploadForm.value.type as DocumentType,
      name: fileName || undefined,
      isVisible: uploadForm.value.isVisible,
    })
    showUploadModal.value = false
    uploadSuccessMessage.value = 'Documento subido exitosamente'
    setTimeout(() => { uploadSuccessMessage.value = '' }, 3000)
    await fetchDocuments(colaborador.value.id)
  } catch (err) {
    console.error('Error uploading:', err)
  } finally {
    uploading.value = false
  }
}

function openEditModal(doc: DocumentoEntity) {
  editForm.value = {
    id: doc.id,
    name: doc.name,
    type: doc.type || '',
    isVisible: false,
  }
  showEditModal.value = true
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
    if (colaborador.value) await fetchDocuments(colaborador.value.id)
  } catch (err) {
    console.error('Error updating:', err)
  } finally {
    savingEdit.value = false
  }
}

function deleteDocument(id: number, name: string) {
  deleteId.value = id
  deleteName.value = name
  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    await documentService.delete(deleteId.value)
    showDeleteModal.value = false
    if (colaborador.value) await fetchDocuments(colaborador.value.id)
  } catch (e) {
    console.error('Error deleting:', e)
  }
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

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-upload:hover { background: #b8891a; }

.docs-table-wrap { overflow-x: auto; }
.docs-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.docs-table th { padding: 12px 14px; text-align: left; font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.docs-table td { padding: 14px; font-size: 0.85rem; color: var(--c-black); border-bottom: 1px solid var(--c-border); vertical-align: middle; }
.docs-table td:nth-child(1) { white-space: normal; word-break: break-word; }
.docs-table tr:last-child td { border-bottom: none; }
.docs-table tr:hover td { background: rgba(249, 250, 251, 0.5); }
.docs-table th:nth-child(1), .docs-table td:nth-child(1) { width: 23%; }
.docs-table th:nth-child(2), .docs-table td:nth-child(2) { width: 15%; }
.docs-table th:nth-child(3), .docs-table td:nth-child(3) { width: 22%; }
.docs-table th:nth-child(4), .docs-table td:nth-child(4) { width: 15%; }
.docs-table th:nth-child(5), .docs-table td:nth-child(5) { width: 10%; }

.doc-name-cell { display: flex; align-items: center; gap: 10px; }
.doc-icon-sm { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; color: #6B7280; flex-shrink: 0; }
.doc-name { font-weight: 600; }

.type-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
.type-badge.hoja_de_vida { background: #EFF6FF; color: #2563EB; }
.type-badge.soportes_estudio { background: #FEF3C7; color: #D97706; }
.type-badge.soportes_experiencia { background: #F0FDF4; color: #16A34A; }
.type-badge.certificado { background: #FDF4FF; color: #9333EA; }
.type-badge.contrato { background: #EFF6FF; color: #2563EB; }
.type-badge.informe { background: #FEF3C7; color: #D97706; }
.type-badge.acta { background: #FFF7ED; color: #EA580C; }

.visibility-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
.visibility-badge.visible { background: #DCFCE7; color: #16A34A; }
.visibility-badge.hidden { background: #FEE2E2; color: #DC2626; }

.actions-cell { display: flex; gap: 4px; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; text-decoration: none; transition: all 0.15s; }
.action-btn:hover { background: var(--c-light); color: var(--c-primary); }
.action-btn.delete-btn:hover { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 16px; width: 90%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--c-border); }
.modal-header h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 8px; cursor: pointer; }
.modal-close:hover { background: var(--c-light); }
.modal-body { padding: 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--c-border); }
.btn-cancel { padding: 8px 16px; border: 1px solid var(--c-border); border-radius: 8px; background: white; color: var(--c-gray); font-size: 0.85rem; font-weight: 500; cursor: pointer; }
.btn-cancel:hover { background: var(--c-light); }
.btn-save { padding: 8px 16px; border: none; border-radius: 8px; background: var(--c-primary); color: white; font-size: 0.85rem; font-weight: 500; cursor: pointer; }
.btn-save:hover { background: #b8891a; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.form-grid-modal { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group-full { grid-column: 1 / -1; }
.form-group label { font-size: 0.78rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; }
.form-input { padding: 10px 14px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; color: var(--c-black); background: white; }
.form-input:focus { outline: none; border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.12); }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--c-black); cursor: pointer; }

.file-input-wrapper { position: relative; border: 1.5px dashed #d1d5db; border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
.file-input-wrapper:hover { border-color: var(--c-primary); }
.file-input-wrapper.has-file { border-style: solid; border-color: var(--c-primary); background: rgba(200, 155, 45, 0.05); }
.file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.file-input-label { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--c-gray); }
.file-selected { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.file-original-name { font-size: 0.82rem; color: var(--c-gray); font-style: italic; }
.file-remove { border: none; background: none; color: #dc2626; cursor: pointer; font-size: 1.1rem; }

.delete-modal-body { padding: 32px 24px; text-align: center; }
.delete-icon { display: flex; justify-content: center; margin-bottom: 16px; color: #F59E0B; }
.delete-title { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
.delete-text { font-size: 0.88rem; color: var(--c-gray); margin-bottom: 24px; }
.delete-actions { display: flex; justify-content: center; gap: 10px; }
.btn-delete { padding: 8px 16px; border: none; border-radius: 8px; background: #dc2626; color: white; font-size: 0.85rem; font-weight: 500; cursor: pointer; }
.btn-delete:hover { background: #b91c1c; }

.empty-tab {
  text-align: center;
  padding: 40px 20px;
  color: var(--c-gray);
}

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: var(--c-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .summary-cards { grid-template-columns: repeat(2, 1fr); }
  .info-grid { grid-template-columns: 1fr; }
  .competencias-grid, .docs-grid { grid-template-columns: 1fr; }
}
</style>
