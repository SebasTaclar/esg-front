<template>
  <div class="licitaciones-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Licitaciones</h1>
        <p class="page-subtitle">{{ totalItems }} licitaciones registradas</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nueva Licitación
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Buscar por cliente, número de proceso, servicio o norma..." class="search-input" />
      </div>
      <select v-model="activeEstadoFilter" class="estado-filter">
        <option value="todos">Todos los estados</option>
        <option value="publicada">Publicada</option>
        <option value="en_curso">En curso</option>
        <option value="cerrada">Cerrada</option>
        <option value="adjudicada">Adjudicada</option>
        <option value="desierta">Desierta</option>
        <option value="cancelada">Cancelada</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando licitaciones...</p>
      </div>

      <div v-else-if="filteredLicitaciones.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <h3>No se encontraron licitaciones</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos' : 'Crea tu primera licitación' }}</p>
      </div>

      <div v-else>
        <div class="table-responsive">
          <table class="data-table">
            <colgroup>
              <col class="col-oferta" />
              <col class="col-tipo" />
              <col class="col-proceso" />
              <col class="col-cliente" />
              <col class="col-servicio" />
              <col class="col-norma" />
              <col class="col-valor" />
              <col class="col-estado" />
              <col class="col-acciones" />
            </colgroup>
            <thead>
              <tr>
                <th>Oferta</th>
                <th>Tipo</th>
                <th>Número del <br>Proceso</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Norma</th>
                <th class="col-valor">Valor <br>Estimado</th>
                <th>Estado</th>
                <th class="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="l in paginatedLicitaciones" :key="l.id">
                <tr>
                  <td class="col-oferta"><span class="oferta-badge">{{ l.oferta || '-' }}</span></td>
                  <td class="col-tipo"><span class="tipo-badge" :class="l.tipo">{{ l.tipoLabel }}</span></td>
                  <td class="col-proceso"><span class="proceso-text">{{ l.numeroProceso || '-' }}</span></td>
                  <td class="col-cliente">
                    <span class="client-name">{{ l.clienteNombre }}</span>
                  </td>
                  <td class="col-servicio"><span class="servicio-text">{{ l.servicio }}</span></td>
                  <td class="col-norma"><span class="norma-text">{{ l.norma }}</span></td>
                  <td class="col-valor"><span class="valor-text">{{ formatCurrency(l.valorEstimado) }}</span></td>
                  <td class="col-estado">
                    <span class="estado-badge" :class="l.estado">{{ formatEstado(l.estado) }}</span>
                  </td>
                  <td class="col-acciones">
                    <div class="actions-cell">
                      <button class="action-btn" title="Editar" @click="openEditModal(l)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="action-btn delete" title="Eliminar" @click="confirmDelete(l)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="expandedRows.has(l.id) && l.servicios && l.servicios.length">
                  <td colspan="10" class="services-row">
                    <div class="services-expand">
                      <table class="services-table">
                        <thead>
                          <tr>
                            <th>Servicio</th>
                            <th>Norma</th>
                            <th>Rol</th>
                            <th>Colaborador</th>
                            <th>Cant.</th>
                            <th>Valor Unit.</th>
                            <th>Subtotal</th>
                            <th>Descuento</th>
                            <th>IVA</th>
                            <th>Total</th>
                            <th>Utilidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(svc, idx) in l.servicios" :key="idx">
                            <td>{{ svc.name }}</td>
                            <td>{{ svc.norm }}</td>
                            <td>{{ svc.rol || '-' }}</td>
                            <td>{{ svc.collaborator || '-' }}</td>
                            <td>{{ svc.quantity }}</td>
                            <td>{{ formatCurrency(svc.unitPrice) }}</td>
                            <td>{{ formatCurrency(svc.subtotal) }}</td>
                            <td>{{ svc.discount }}%</td>
                            <td>{{ formatCurrency(svc.iva) }}</td>
                            <td><strong>{{ formatCurrency(svc.totalPrice) }}</strong></td>
                            <td class="utilidad-cell">{{ formatCurrency(svc.netProfit) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </template>
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

    <!-- Modal Crear/Editar Licitación -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content modal-lg" @click.stop>
        <div class="modal-header">
          <h3>{{ editingLicitacion ? 'Editar Licitación' : 'Nueva Licitación' }}</h3>
          <button class="modal-close" @click="closeModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="formError" class="modal-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ formError }}
        </div>

        <div class="modal-body">
          <div class="form-grid-modal">
            <div class="form-group">
              <label class="form-label required">Código de Oferta</label>
              <input v-model="form.offerCode" type="text" class="form-input" placeholder="Ej: OE-LIC-001" />
            </div>
            <div class="form-group">
              <label class="form-label required">Tipo</label>
              <select v-model="form.type" class="form-input">
                <option value="">Seleccionar tipo...</option>
                <option value="publica">Pública</option>
                <option value="minima_cuantia">Mínima Cuantía</option>
                <option value="solicitud_informacion">Solicitud de Información</option>
                <option value="contratacion_especial">Contratación Especial</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Número de Proceso</label>
              <input v-model="form.processNumber" type="text" class="form-input" placeholder="Ej: SECOP-2025-00123" />
            </div>
            <div class="form-group">
              <label class="form-label required">Cliente</label>
              <input v-model="form.clientName" type="text" class="form-input" placeholder="Nombre del cliente" />
            </div>
            <div class="form-group">
              <label class="form-label required">Servicio</label>
              <input v-model="form.service" type="text" class="form-input" placeholder="Ej: Auditoría ISO 14001" />
            </div>
            <div class="form-group">
              <label class="form-label required">Norma</label>
              <input v-model="form.norm" type="text" class="form-input" placeholder="Ej: ISO 14001:2015" />
            </div>
            <div class="form-group">
              <label class="form-label">Estado</label>
              <select v-model="form.status" class="form-input">
                <option value="publicada">Publicada</option>
                <option value="en_curso">En curso</option>
                <option value="cerrada">Cerrada</option>
                <option value="adjudicada">Adjudicada</option>
                <option value="desierta">Desierta</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Valor Estimado</label>
              <div class="input-currency">
                <span class="input-currency-prefix">$</span>
                <input :value="formatCurrencyValue(form.estimatedValue)" @input="onCurrencyInput($event)" type="text" class="form-input" placeholder="0" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Publicación</label>
              <input v-model="form.publicationDate" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Cierre</label>
              <input v-model="form.closingDate" type="date" class="form-input" />
            </div>
            <div class="form-group form-group-full">
              <label class="form-label">Observaciones</label>
              <textarea v-model="form.observations" class="form-input form-textarea" rows="3" placeholder="Notas adicionales..."></textarea>
            </div>
          </div>

          <!-- Servicios -->
          <div class="services-section">
            <div class="services-header">
              <div>
                <h3>Servicios</h3>
                <p class="services-subtitle">Agrega los servicios asociados a esta licitación.</p>
              </div>
              <button type="button" class="btn-add-service" @click="addService">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar servicio
              </button>
            </div>
            <div v-if="form.services.length === 0" class="empty-services">
              <p>Sin servicios. Puedes agregar servicios ahora o después.</p>
            </div>
            <div v-else class="services-list">
              <div v-for="(svc, idx) in form.services" :key="idx" class="service-card">
                <div class="service-card-header" @click="svc._collapsed = !svc._collapsed" style="cursor:pointer">
                  <span class="service-num">Servicio {{ idx + 1 }}{{ svc.name ? ' — ' + svc.name : '' }}</span>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span v-if="svc._collapsed" class="service-profit">{{ formatCurrency(svc.totalPrice) }}</span>
                    <svg :class="['cost-toggle-arrow', { open: !svc._collapsed }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    <button type="button" class="remove-btn" @click.stop="removeService(idx)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="!svc._collapsed" class="service-fields">
                  <div class="services-grid">
                    <div class="form-group">
                      <label class="form-label required">Servicio</label>
                      <input v-model="svc.name" type="text" class="form-input-sm" placeholder="Nombre del servicio" />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">Norma</label>
                      <input v-model="svc.norm" type="text" class="form-input-sm" placeholder="Norma" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Rol</label>
                      <input v-model="svc.rol" type="text" class="form-input-sm" placeholder="Ej: Auditor Líder" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Colaborador</label>
                      <input v-model="svc.collaborator" type="text" class="form-input-sm" placeholder="Nombre del colaborador" />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">Cantidad</label>
                      <input v-model.number="svc.quantity" type="number" class="form-input-sm" placeholder="1" min="0" step="0.5" />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">Valor Unitario</label>
                      <div class="input-currency-sm">
                        <span class="input-currency-prefix-sm">$</span>
                        <input :value="formatCurrencyValue(svc.unitPrice)" @input="onSvcCurrencyInput($event, svc, 'unitPrice')" type="text" class="form-input-sm" placeholder="0" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Descuento (%)</label>
                      <input v-model.number="svc.discount" type="number" class="form-input-sm" placeholder="0" min="0" max="100" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Subtotal</label>
                      <div class="input-currency-sm">
                        <span class="input-currency-prefix-sm">$</span>
                        <input :value="formatCurrencyValue(calcSubtotal(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">IVA</label>
                      <div class="input-currency-sm">
                        <span class="input-currency-prefix-sm">$</span>
                        <input :value="formatCurrencyValue(calcIVA(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Total</label>
                      <div class="input-currency-sm input-total-green">
                        <span class="input-currency-prefix-sm">$</span>
                        <input :value="formatCurrencyValue(calcTotal(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="services-grid">
                    <div class="form-group">
                      <label class="form-label">Fecha Ingreso</label>
                      <input v-model="svc.entryDate" type="month" class="form-input-sm" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Fecha Facturación</label>
                      <input v-model="svc.billingDate" type="month" class="form-input-sm" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Fecha Orden de Compra</label>
                      <input v-model="svc.purchaseOrderDate" type="date" class="form-input-sm" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Nº Orden de Compra</label>
                      <input v-model="svc.purchaseOrderNumber" type="text" class="form-input-sm" placeholder="OC-001" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Nº Cuenta de Cobro</label>
                      <input v-model="svc.billingAccountNumber" type="text" class="form-input-sm" placeholder="CC-001" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Valor Colaborador</label>
                      <div class="input-currency-sm">
                        <span class="input-currency-prefix-sm">$</span>
                        <input :value="formatCurrencyValue(svc.collaboratorUnitPrice)" @input="onSvcCurrencyInput($event, svc, 'collaboratorUnitPrice')" type="text" class="form-input-sm" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline" @click="closeModal">Cancelar</button>
          <button class="btn-primary" :disabled="saving" @click="handleSave">
            <span v-if="saving" class="spinner-sm"></span>
            {{ saving ? (editingLicitacion ? 'Actualizando...' : 'Creando...') : (editingLicitacion ? 'Actualizar' : 'Crear Licitación') }}
          </button>
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
        <h3>¿Eliminar licitación?</h3>
        <p>¿Deseas eliminar la licitación <strong>{{ licitacionToDelete?.numeroProceso || licitacionToDelete?.oferta }}</strong>? Esta acción no se puede deshacer.</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { tenderService } from '@/services/api/tenderService'
import type { Licitacion, TenderServiceItem } from '@/types/crmTypes'

interface ServiceForm extends TenderServiceItem {
  _collapsed: boolean
}

const licitaciones = ref<Licitacion[]>([])
const loading = ref(true)
const searchTerm = ref('')
const activeEstadoFilter = ref('todos')
const expandedRows = ref<Set<number>>(new Set())

const frontPage = ref(1)
const frontPageSize = 20

const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const editingLicitacion = ref<Licitacion | null>(null)

const showDeleteModal = ref(false)
const licitacionToDelete = ref<Licitacion | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const form = reactive({
  offerCode: '',
  type: '',
  processNumber: '',
  clientName: '',
  service: '',
  norm: '',
  status: 'publicada',
  publicationDate: '',
  closingDate: '',
  estimatedValue: 0,
  observations: '',
  services: [] as ServiceForm[],
})

function createEmptyService(): ServiceForm {
  return {
    name: '',
    norm: '',
    rol: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    subtotal: 0,
    subtotalWithDiscount: 0,
    iva: 0,
    totalPrice: 0,
    collaborator: '',
    collaboratorUnitPrice: 0,
    collaboratorTotalPrice: 0,
    ica: 0,
    simpleTax: 0,
    netProfit: 0,
    pretaxProfit: 0,
    entryDate: '',
    billingDate: '',
    purchaseOrderDate: '',
    purchaseOrderNumber: '',
    billingAccountNumber: '',
    _collapsed: false,
  }
}

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

  if (activeEstadoFilter.value !== 'todos') {
    result = result.filter((l) => l.estado === activeEstadoFilter.value)
  }

  return result
})

const totalItems = computed(() => filteredLicitaciones.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / frontPageSize))

const paginatedLicitaciones = computed(() => {
  const start = (frontPage.value - 1) * frontPageSize
  return filteredLicitaciones.value.slice(start, start + frontPageSize)
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

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  frontPage.value = page
}

watch([searchTerm, activeEstadoFilter], () => {
  frontPage.value = 1
})

function toggleExpand(id: number) {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}

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

function formatCurrency(value: number | undefined | null): string {
  if (!value && value !== 0) return '-'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

function formatCurrencyValue(value: number | undefined | null): string {
  if (!value && value !== 0) return '0'
  return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

function onCurrencyInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  form.estimatedValue = Number(raw) || 0
}

function onSvcCurrencyInput(event: Event, svc: ServiceForm, field: 'unitPrice' | 'collaboratorUnitPrice') {
  const raw = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  ;(svc as any)[field] = Number(raw) || 0
}

function calcSubtotal(svc: ServiceForm): number {
  return svc.quantity * svc.unitPrice
}

function calcIVA(svc: ServiceForm): number {
  const sub = calcSubtotal(svc)
  const discount = sub * (svc.discount / 100)
  return (sub - discount) * 0.19
}

function calcTotal(svc: ServiceForm): number {
  const sub = calcSubtotal(svc)
  const discount = sub * (svc.discount / 100)
  return sub - discount + calcIVA(svc)
}

function addService() {
  form.services.push(createEmptyService())
}

function removeService(index: number) {
  form.services.splice(index, 1)
}

function openCreateModal() {
  editingLicitacion.value = null
  form.offerCode = ''
  form.type = ''
  form.processNumber = ''
  form.clientName = ''
  form.service = ''
  form.norm = ''
  form.status = 'publicada'
  form.publicationDate = ''
  form.closingDate = ''
  form.estimatedValue = 0
  form.observations = ''
  form.services = []
  formError.value = ''
  showModal.value = true
}

function openEditModal(l: Licitacion) {
  editingLicitacion.value = l
  form.offerCode = l.oferta || ''
  form.type = l.tipo || ''
  form.processNumber = l.numeroProceso || ''
  form.clientName = l.clienteNombre || ''
  form.service = l.servicio || ''
  form.norm = l.norma || ''
  form.status = l.estado || 'publicada'
  form.publicationDate = l.fechaPublicacion ? l.fechaPublicacion.split('T')[0] : ''
  form.closingDate = l.fechaCierre ? l.fechaCierre.split('T')[0] : ''
  form.estimatedValue = l.valorEstimado || 0
  form.observations = l.observaciones || ''
  form.services = (l.servicios || []).map(s => ({ ...s, _collapsed: true }))
  formError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingLicitacion.value = null
  formError.value = ''
}

function confirmDelete(l: Licitacion) {
  licitacionToDelete.value = l
  deleteError.value = null
  showDeleteModal.value = true
}

async function handleSave() {
  formError.value = ''

  if (!form.offerCode.trim()) { formError.value = 'El código de oferta es obligatorio.'; return }
  if (!form.type) { formError.value = 'El tipo es obligatorio.'; return }
  if (!form.processNumber.trim()) { formError.value = 'El número de proceso es obligatorio.'; return }
  if (!form.clientName.trim()) { formError.value = 'El cliente es obligatorio.'; return }
  if (!form.service.trim()) { formError.value = 'El servicio es obligatorio.'; return }
  if (!form.norm.trim()) { formError.value = 'La norma es obligatoria.'; return }

  saving.value = true
  try {
    const services = form.services
      .filter(s => s.name.trim())
      .map(s => ({
        name: s.name.trim(),
        norm: s.norm.trim(),
        rol: s.rol || '',
        quantity: s.quantity,
        unitPrice: s.unitPrice,
        discount: s.discount,
        subtotal: calcSubtotal(s),
        subtotalWithDiscount: calcSubtotal(s) - (calcSubtotal(s) * s.discount / 100),
        iva: calcIVA(s),
        totalPrice: calcTotal(s),
        collaborator: s.collaborator || '',
        collaboratorUnitPrice: s.collaboratorUnitPrice || 0,
        collaboratorTotalPrice: (s.collaboratorUnitPrice || 0) * s.quantity,
        ica: 0,
        simpleTax: 0,
        netProfit: 0,
        pretaxProfit: 0,
        entryDate: s.entryDate || '',
        billingDate: s.billingDate || '',
        purchaseOrderDate: s.purchaseOrderDate || '',
        purchaseOrderNumber: s.purchaseOrderNumber || '',
        billingAccountNumber: s.billingAccountNumber || '',
      }))

    const payload = {
      offerCode: form.offerCode.trim(),
      type: form.type,
      processNumber: form.processNumber.trim(),
      clientName: form.clientName.trim(),
      service: form.service.trim(),
      norm: form.norm.trim(),
      status: form.status,
      publicationDate: form.publicationDate || new Date().toISOString().split('T')[0],
      closingDate: form.closingDate || undefined,
      estimatedValue: form.estimatedValue || undefined,
      observations: form.observations.trim() || undefined,
      services: services.length > 0 ? services : undefined,
    }

    if (editingLicitacion.value) {
      await tenderService.update(editingLicitacion.value.id, payload)
    } else {
      await tenderService.create(payload)
    }

    closeModal()
    await loadLicitaciones()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : (editingLicitacion.value ? 'Error al actualizar la licitación' : 'Error al crear la licitación')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!licitacionToDelete.value) return
  deleting.value = true
  deleteError.value = null
  try {
    await tenderService.delete(licitacionToDelete.value.id)
    showDeleteModal.value = false
    licitacionToDelete.value = null
    await loadLicitaciones()
  } catch (e) {
    deleteError.value = e instanceof Error ? e.message : 'No se pudo eliminar la licitación.'
  } finally {
    deleting.value = false
  }
}

async function loadLicitaciones() {
  loading.value = true
  try {
    const response = await tenderService.getAll({ page: 1, pageSize: 9999 })
    licitaciones.value = response.data
  } catch (e) {
    console.error('Error loading licitaciones:', e)
    licitaciones.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLicitaciones()
})
</script>

<style scoped>
.licitaciones-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding: 0 0 0 0; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }

.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; background: var(--c-primary); color: white; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 600; text-decoration: none; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: var(--c-primary-hover); }

.filters-bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-box { position: relative; flex: 1; min-width: 250px; max-width: 480px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: var(--c-primary); }
.search-input::placeholder { color: var(--c-gray-light); }

.estado-filter {
  padding: 10px 14px;
  border: 1.5px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-white);
  color: var(--c-black);
  font-size: 0.88rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  min-width: 180px;
}
.estado-filter:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.1); }

.table-card { background: var(--c-white); overflow: hidden; margin: 0; border-radius: 12px; border: 1px solid var(--c-border); }
.table-responsive { overflow-x: auto; width: 100%; }

.data-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.data-table th { padding: 10px 12px; text-align: center; font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 8px 12px; font-size: 0.85rem; color: var(--c-black); border-bottom: 1px solid var(--c-border); vertical-align: middle; }
.data-table colgroup .col-expand { width: 36px; }
.data-table colgroup .col-oferta { width: 100px; }
.data-table colgroup .col-tipo { width: 130px; }
.data-table colgroup .col-proceso { width: 140px; }
.data-table colgroup .col-cliente { width: 200px; }
.data-table colgroup .col-servicio { width: 160px; }
.data-table colgroup .col-norma { width: 120px; }
.data-table colgroup .col-estado { width: 85px; }
.data-table colgroup .col-valor { width: 80px; }
.data-table colgroup .col-acciones { width: 80px; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: rgba(249, 250, 251, 0.5); }

.col-oferta { font-size: 0.75rem; }
.col-tipo { }
.col-proceso { }
.col-cliente { }
.col-servicio { }
.col-norma { }
.col-estado { text-align: left; }
.col-valor { text-align: right; }
.col-acciones { text-align: center; }

.oferta-badge {
  display: inline-block;
  padding: 2px 5px;
  background: var(--c-light);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--c-black);
}

.tipo-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}
.tipo-badge.publica { background: #EDE9FE; color: #6D28D9; }
.tipo-badge.minima_cuantia { background: #EFF6FF; color: #1D4ED8; }
.tipo-badge.solicitud_informacion { background: #F0FDF4; color: #15803D; }
.tipo-badge.contratacion_especial { background: #FEF3C7; color: #B45309; }

.proceso-text { font-family: 'Courier New', monospace; font-size: 0.78rem; color: var(--c-gray); }

.client-name { font-size: 0.78rem; color: var(--c-black); }

.servicio-text { font-size: 0.82rem; color: var(--c-black); }
.norma-text { font-size: 0.78rem; color: var(--c-gray); }
.valor-text { font-size: 0.85rem; font-weight: 600; color: var(--c-black); text-align: right; display: block; }

.estado-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; }
.estado-badge.publicada { background: #EFF6FF; color: #1D4ED8; }
.estado-badge.en_curso { background: #FEF3C7; color: #B45309; }
.estado-badge.cerrada { background: #F3F4F6; color: #6B7280; }
.estado-badge.adjudicada { background: #F0FDF4; color: #15803D; }
.estado-badge.desierta { background: #FEF2F2; color: #DC2626; }
.estado-badge.cancelada { background: #FEF2F2; color: #991B1B; }

.actions-cell { display: flex; gap: 4px; justify-content: center; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; text-decoration: none; transition: all 0.15s; }
.action-btn:hover { background: var(--c-light); color: var(--c-primary); }
.action-btn.delete:hover { background: #FEF2F2; color: var(--c-danger); }

/* Expanded Services Row */
.services-row { padding: 0 !important; background: #FAFBFC; }
.services-expand { padding: 12px 16px; overflow-x: auto; }
.services-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
.services-table th { padding: 8px 10px; text-align: left; font-size: 0.7rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.services-table td { padding: 8px 10px; color: var(--c-black); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.services-table tr:last-child td { border-bottom: none; }
.utilidad-cell { color: #15803D; font-weight: 600; }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: var(--c-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 60px 20px; color: var(--c-gray); }
.empty-state svg { color: var(--c-gray-light); margin-bottom: 16px; }
.empty-state h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
.empty-state p { font-size: 0.88rem; color: var(--c-gray); }

/* Pagination */
.pagination-bar { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-top: 1px solid var(--c-border); }
.pagination-info { font-size: 0.82rem; color: var(--c-gray); }
.pagination-controls { display: flex; gap: 4px; }
.page-btn { display: flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; border: 1px solid var(--c-border); border-radius: 6px; background: var(--c-white); color: var(--c-gray); font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
.page-btn:hover:not(:disabled) { border-color: var(--c-primary); color: var(--c-primary); }
.page-btn.active { background: var(--c-primary); border-color: var(--c-primary); color: white; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Modal */
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
.form-group-full { grid-column: 1 / -1; }
.form-label { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
.form-label.required::after { content: ' *'; color: var(--c-danger); }
.form-input { padding: 10px 12px; border: 1px solid var(--c-border); border-radius: 8px; font-size: 0.88rem; font-family: inherit; color: var(--c-black); background: var(--c-white); outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: var(--c-primary); }
.form-textarea { resize: vertical; min-height: 60px; }

.input-currency { position: relative; display: flex; align-items: center; }
.input-currency .form-input { width: 100%; padding-left: 28px; }
.input-currency-prefix { position: absolute; left: 12px; color: var(--c-gray); font-size: 0.85rem; pointer-events: none; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--c-border); }
.btn-outline { padding: 10px 20px; border: 1px solid var(--c-border); border-radius: 10px; background: var(--c-white); color: var(--c-gray); font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { border-color: var(--c-gray-light); color: var(--c-black); }

/* Services Section */
.services-section { margin-top: 24px; border-top: 1px solid var(--c-border); padding-top: 20px; }
.services-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.services-header h3 { font-size: 0.95rem; font-weight: 700; color: var(--c-black); }
.services-subtitle { font-size: 0.82rem; color: var(--c-gray); margin-top: 2px; }
.btn-add-service { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px dashed var(--c-primary); border-radius: 8px; background: transparent; color: var(--c-primary); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-add-service:hover { background: rgba(200, 155, 45, 0.05); }

.empty-services { text-align: center; padding: 24px; background: var(--c-light); border-radius: 10px; color: var(--c-gray); font-size: 0.88rem; }

.services-list { display: flex; flex-direction: column; gap: 12px; }
.service-card { border: 1px solid var(--c-border); border-radius: 10px; overflow: hidden; }
.service-card-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--c-light); }
.service-num { font-size: 0.85rem; font-weight: 600; color: var(--c-black); }
.service-profit { font-size: 0.82rem; font-weight: 700; color: #15803D; }
.remove-btn { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; background: none; color: var(--c-gray); border-radius: 4px; cursor: pointer; transition: all 0.15s; }
.remove-btn:hover { background: #FEF2F2; color: var(--c-danger); }

.service-fields { padding: 16px; }
.services-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }

.form-input-sm { padding: 8px 10px; border: 1px solid var(--c-border); border-radius: 6px; font-size: 0.82rem; font-family: inherit; color: var(--c-black); background: var(--c-white); outline: none; transition: border-color 0.2s; }
.form-input-sm:focus { border-color: var(--c-primary); }

.input-currency-sm { position: relative; display: flex; align-items: center; }
.input-currency-sm .form-input-sm { width: 100%; padding-left: 22px; }
.input-currency-prefix-sm { position: absolute; left: 8px; color: var(--c-gray); font-size: 0.78rem; pointer-events: none; }
.input-total-green .form-input-sm { font-weight: 700; color: #15803D; }

.cost-toggle-arrow { transition: transform 0.2s; color: var(--c-gray); }
.cost-toggle-arrow.open { transform: rotate(180deg); }

/* Delete Modal */
.modal-card { background: var(--c-white); border-radius: 14px; padding: 32px; text-align: center; max-width: 400px; width: 100%; }
.modal-icon { margin-bottom: 16px; color: var(--c-warning); }
.modal-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
.modal-card p { font-size: 0.88rem; color: var(--c-gray); margin-bottom: 16px; }
.delete-error { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; background: #FEF2F2; border-radius: 8px; color: #991B1B; font-size: 0.82rem; margin-bottom: 16px; }
.modal-actions { display: flex; justify-content: center; gap: 10px; }
.btn-danger { padding: 10px 20px; border: none; border-radius: 10px; background: var(--c-danger); color: white; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-danger:hover { background: #DC2626; }

.spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .form-grid-modal { grid-template-columns: 1fr; }
  .services-grid { grid-template-columns: 1fr; }
  .pagination-bar { flex-direction: column; gap: 12px; }
}
</style>
