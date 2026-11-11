<template>
  <div class="quotes-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Cotizaciones</h1>
        <p class="page-subtitle">{{ totalItems }} cotizaciones registradas</p>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="openCreateModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Cotización
        </button>
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
            placeholder="Buscar por código o nombre de cliente..."
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
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h3>No fue posible cargar las cotizaciones</h3>
      <p>{{ error }}</p>
      <button class="btn-primary" @click="loadData">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Reintentar
      </button>
    </div>

    <!-- Table -->
    <div v-else class="table-card">
      <!-- Skeleton Loading -->
      <div v-if="loading" class="skeleton-table">
        <div v-for="n in 5" :key="n" class="skeleton-row">
          <div class="skeleton-cell skeleton-code"></div>
          <div class="skeleton-cell skeleton-name"></div>
          <div class="skeleton-cell skeleton-project"></div>
          <div class="skeleton-cell skeleton-amount"></div>
          <div class="skeleton-cell skeleton-status"></div>
          <div class="skeleton-cell skeleton-date"></div>
          <div class="skeleton-cell skeleton-actions"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredCotizaciones.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h3>No se encontraron cotizaciones</h3>
        <p>{{ searchInput ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera cotización' }}</p>
        <button v-if="!searchInput" class="btn-primary" @click="openCreateModal">
          Crear Cotización
        </button>
      </div>

      <!-- Data Table -->
      <div v-else>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código COT</th>
                <th>Cliente</th>
                <th>Parametros de Oferta</th>
                <th>Valor Total</th>
                <th>Estado</th>
                <th>Fecha <br>Cotización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cot in paginatedCotizaciones" :key="cot.id">
                <td class="code-cell">{{ cot.code }}</td>
                <td>
                  <div class="client-info">
                    <div>
                      <span class="client-name">{{ getClientName(cot) }}</span>
                      <span class="client-nit" v-if="cot.client?.nit">NIT: {{ cot.client.nit }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <template v-if="cot.observations">
                    <div class="obs-cell" :class="{ clamped: isLongObservation(cot.observations) }">{{ cot.observations }}</div>
                    <button v-if="isLongObservation(cot.observations)" class="obs-more-btn" @click="openObservationsModal(cot)">Ver más</button>
                  </template>
                  <span class="no-data" v-else>-</span>
                </td>
                <td class="amount-cell">{{ formatCurrency(cot.totalAmount) }}</td>
                <td>
                  <span class="status-badge" :class="getStatusClass(cot.status)">
                    {{ getStatusLabel(cot.status) }}
                  </span>
                </td>
                <td class="date-cell">{{ cot.validUntil ? formatDate(cot.validUntil) : '-' }}</td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn" title="Ver detalle" @click="viewQuote(cot)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button class="action-btn" title="Editar" @click="openEditModal(cot)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn download" title="Previsualizar PDF" @click="downloadPDF(cot)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                    <button class="action-btn delete" title="Eliminar" @click="confirmDelete(cot)">
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

    <!-- View Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3>Cotización {{ selectedQuote?.code }}</h3>
          <button class="modal-close" @click="showDetailModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedQuote">
          <div class="detail-grid">
            <div class="detail-field">
              <label>Código</label>
              <span>{{ selectedQuote.code }}</span>
            </div>
            <div class="detail-field">
              <label>Estado</label>
              <span class="status-badge" :class="getStatusClass(selectedQuote.status)">
                {{ getStatusLabel(selectedQuote.status) }}
              </span>
            </div>
            <div class="detail-field">
              <label>Cliente</label>
              <span>{{ getClientName(selectedQuote) }}</span>
            </div>
            <div class="detail-field">
              <label>NIT</label>
              <span>{{ selectedQuote.client?.nit || '-' }}</span>
            </div>
            <div class="detail-field">
              <label>Proyecto</label>
              <span v-if="selectedQuote.project">{{ selectedQuote.project.code }} - {{ selectedQuote.project.description }}</span>
              <span v-else>-</span>
            </div>
            <div class="detail-field">
              <label>Valor Total</label>
              <span class="amount-cell">{{ formatCurrency(selectedQuote.totalAmount) }}</span>
            </div>
            <div class="detail-field">
              <label>Fecha de cotización</label>
              <span>{{ selectedQuote.validUntil ? formatDate(selectedQuote.validUntil) : '-' }}</span>
            </div>
            <div class="detail-field full-width">
              <label>Observaciones</label>
              <span>{{ selectedQuote.observations || '-' }}</span>
            </div>
            <div class="detail-field">
              <label>Visible para clientes</label>
              <span class="visibility-badge" :class="selectedQuote.isVisible ? 'visible' : 'hidden'">
                {{ selectedQuote.isVisible ? 'Sí' : 'No' }}
              </span>
            </div>
          </div>

          <div class="services-section" v-if="selectedQuote.services && selectedQuote.services.length > 0">
            <h4>Servicios</h4>
            <table class="services-table">
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Tiempo (Días)</th>
                  <th>Tipo</th>
                  <th>VALOR * DÍA (COP)</th>
                  <th>TOTAL (COP)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(svc, idx) in selectedQuote.services" :key="idx">
                  <td>{{ svc.name }}</td>
                  <td>{{ svc.quantity }}</td>
                  <td>{{ svc.billingType === 'ONETIME' ? 'Único' : 'Mensual' }}</td>
                  <td class="amount-cell">{{ formatCurrency(svc.value) }}</td>
                  <td class="amount-cell">{{ formatCurrency((svc.value || 0) * (svc.quantity || 0)) }}</td>
                </tr>
                <tr class="summary-row">
                  <td colspan="4">SUB TOTAL</td>
                  <td class="amount-cell summary-amount">{{ formatCurrency(servicesSubtotal) }}</td>
                </tr>
                <tr class="summary-row">
                  <td colspan="4">Descuento {{ selectedQuoteDescuento }} %</td>
                  <td class="amount-cell summary-amount">- {{ formatCurrency(selectedQuoteDiscountAmount) }}</td>
                </tr>
                <tr class="summary-row">
                  <td colspan="4">IVA {{ selectedQuoteIva }} %</td>
                  <td class="amount-cell summary-amount">{{ formatCurrency(selectedQuoteIvaAmount) }}</td>
                </tr>
                <tr class="summary-row total">
                  <td colspan="4">VALOR TOTAL</td>
                  <td class="amount-cell summary-amount">{{ formatCurrency(selectedQuoteTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="terms-section">
            <h4>Términos comerciales</h4>
            <div class="terms-body" v-html="termsTextToHtml(selectedQuote.commercialTerms || DEFAULT_COMMERCIAL_TERMS)"></div>
          </div>

          <div class="terms-section">
            <h4>Términos del servicio</h4>
            <div class="terms-body" v-html="termsTextToHtml(selectedQuote.serviceTerms || DEFAULT_SERVICE_TERMS)"></div>
          </div>

          <div class="terms-section">
            <h4>Confidencialidad y protección de la información</h4>
            <div class="terms-body" v-html="termsTextToHtml(selectedQuote.confidentialityTerms || DEFAULT_CONFIDENTIALITY_TERMS)"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" @click="showDetailModal = false">Cerrar</button>
          <button class="btn-outline" @click="downloadPDF(selectedQuote!)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Previsualizar PDF
          </button>
          <button class="btn-outline" @click="toggleIsVisible(selectedQuote!)">
            {{ selectedQuote?.isVisible ? 'Ocultar para clientes' : 'Mostrar para clientes' }}
          </button>
          <button class="btn-primary" @click="showDetailModal = false; openEditModal(selectedQuote!)">Editar</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showFormModal" class="modal-overlay">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3>{{ editingQuote ? 'Editar Cotización' : 'Nueva Cotización' }}</h3>
          <button class="modal-close" @click="showFormModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="formError" class="form-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{{ formError }}</span>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Código *</label>
              <select v-model="form.code" class="form-input" :disabled="!!editingQuote">
                <option value="">Seleccionar código...</option>
                <option v-for="c in availableCodes" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Estado *</label>
              <select v-model="form.status" class="form-input">
                <option value="pendiente">Pendiente</option>
                <option value="enviada">Enviada</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
                <option value="vencida">Vencida</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cliente</label>
              <div class="client-dropdown-wrapper">
                <div class="client-dropdown-trigger" @click="toggleClientDropdown">
                  <span :class="{ placeholder: form.clientId === 0 }">
                    {{ form.clientId === 0 ? 'Seleccionar cliente' : getSelectedClientName() }}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                <div v-if="showClientDropdown" class="client-dropdown-list">
                  <div class="client-dropdown-search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      v-model="clientSearch"
                      type="text"
                      placeholder="Buscar cliente..."
                      class="client-search-input"
                      @click.stop
                    />
                  </div>
                  <div class="client-dropdown-items">
                    <div
                      class="client-dropdown-item"
                      :class="{ selected: form.clientId === 0 }"
                      @click="selectClient(0)"
                    >
                      Seleccionar cliente
                    </div>
                    <div
                      v-for="c in sortedClientes"
                      :key="c.id"
                      class="client-dropdown-item"
                      :class="{ selected: form.clientId === c.id }"
                      @click="selectClient(c.id)"
                    >
                      {{ c.razonSocial }}
                    </div>
                    <div v-if="sortedClientes.length === 0" class="client-dropdown-empty">
                      No se encontraron clientes
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="form.clientId === 0" class="form-group">
              <label>Cliente / Entidad (No registrada)</label>
              <input v-model="form.clientName" type="text" placeholder="Nombre del cliente o entidad" class="form-input" />
            </div>
            <div v-if="form.clientId === 0" class="form-group">
              <label>NIT / CC (No registrado)</label>
              <input v-model="form.nitCC" type="text" placeholder="NIT o cédula de la entidad" class="form-input" />
            </div>
            <div class="form-group">
              <label>Proyecto</label>
              <div class="client-dropdown-wrapper">
                <div class="client-dropdown-trigger" @click="toggleProjectDropdown">
                  <span :class="{ placeholder: form.projectId === 0 }">
                    {{ form.projectId === 0 ? 'Sin proyecto' : getSelectedProjectName() }}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                <div v-if="showProjectDropdown" class="client-dropdown-list">
                  <div class="client-dropdown-search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      v-model="projectSearch"
                      type="text"
                      placeholder="Buscar proyecto..."
                      class="client-search-input"
                      @click.stop
                    />
                  </div>
                  <div class="client-dropdown-items">
                    <div
                      class="client-dropdown-item"
                      :class="{ selected: form.projectId === 0 }"
                      @click="selectProject(0)"
                    >
                      Sin proyecto
                    </div>
                    <div
                      v-for="p in sortedProyectos"
                      :key="p.id"
                      class="client-dropdown-item"
                      :class="{ selected: form.projectId === p.id }"
                      @click="selectProject(p.id)"
                    >
                      {{ p.code }} - {{ p.description }}
                    </div>
                    <div v-if="sortedProyectos.length === 0" class="client-dropdown-empty">
                      No se encontraron proyectos
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Valor Total</label>
              <div class="currency-input-wrap">
                <span class="currency-prefix">$</span>
                <input :value="formatCurrencyInput(quoteTotal)" type="text" class="form-input currency-input" readonly />
              </div>
            </div>
            <div class="form-group">
              <label>Descuento (%)</label>
              <input v-model.number="form.descuento" type="number" min="0" max="100" class="form-input" placeholder="0" />
            </div>
            <div class="form-group">
              <label>IVA (%)</label>
              <input v-model.number="form.iva" type="number" min="0" max="100" class="form-input" placeholder="19" />
            </div>
            <div class="form-group">
              <label>Modalidad de trabajo</label>
              <select v-model="form.modalidad" class="form-input">
                <option value="Sin definir">Sin definir</option>
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Mixta">Mixta</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha Cotización</label>
              <input v-model="form.validUntil" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label>Visible para clientes</label>
              <label class="toggle-switch">
                <input v-model="form.isVisible" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="form-group full-width">
              <label>Parametros de Oferta</label>
              <textarea v-model="form.observations" rows="2" placeholder="Parametros de la oferta..." class="form-input"></textarea>
            </div>
            <div class="form-group full-width">
              <label>Términos comerciales (PDF)</label>
              <textarea v-model="form.commercialTerms" rows="5" placeholder="Términos comerciales..." class="form-input"></textarea>
            </div>
            <div class="form-group full-width">
              <label>Términos del servicio (PDF)</label>
              <textarea v-model="form.serviceTerms" rows="3" placeholder="Términos del servicio..." class="form-input"></textarea>
            </div>
            <div class="form-group full-width">
              <label>Confidencialidad (PDF)</label>
              <textarea v-model="form.confidentialityTerms" rows="6" placeholder="Confidencialidad y protección de la información..." class="form-input"></textarea>
            </div>
          </div>

          <!-- Services -->
          <div class="services-section">
            <div class="services-header">
              <h4>Servicios</h4>
              <button class="btn-add-service" @click="addService">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar Servicio
              </button>
            </div>
            <div v-if="form.services.length === 0" class="no-services">
              No hay servicios agregados
            </div>
            <div v-else class="services-list">
              <div v-for="(svc, idx) in form.services" :key="idx" class="service-row">
                <div class="service-fields">
                  <div class="service-field-group">
                    <label class="service-field-label">Actividad</label>
                    <input v-model="svc.name" type="text" placeholder="Nombre de la actividad" class="form-input service-name" />
                  </div>
                  <div class="service-field-group">
                    <label class="service-field-label">Tiempo (días)</label>
                    <input v-model.number="svc.quantity" type="number" min="1" placeholder="Días" class="form-input service-qty" />
                  </div>
                  <div class="service-field-group">
                    <label class="service-field-label">Tipo</label>
                    <select v-model="svc.billingType" class="form-input service-type">
                      <option value="ONETIME">Único</option>
                      <option value="MONTHLY">Mensual</option>
                    </select>
                  </div>
                  <div class="service-field-group">
                    <label class="service-field-label">Valor * día (COP)</label>
                    <div class="currency-input-wrap">
                      <span class="currency-prefix">$</span>
                      <input :value="formatCurrencyInput(svc.value)" @input="onSvcValueInput($event, idx)" type="text" class="form-input currency-input service-value" placeholder="0" />
                    </div>
                  </div>
                  <button class="btn-remove-service" @click="removeService(idx)" title="Eliminar servicio">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div class="service-field-group full-width">
                  <label class="service-field-label">Norma / observación</label>
                  <input v-model="svc.description" type="text" placeholder="Norma observación del servicio" class="form-input service-desc" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" @click="showFormModal = false">Cancelar</button>
          <button class="btn-primary" :disabled="saving" @click="handleSave">
            <span v-if="saving" class="spinner-sm"></span>
            {{ editingQuote ? 'Guardar Cambios' : 'Crear Cotización' }}
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
        <h3>¿Eliminar cotización?</h3>
        <p>¿Deseas eliminar la cotización <strong>{{ quoteToDelete?.code }}</strong>? Esta acción no se puede deshacer.</p>
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

    <!-- Observaciones Modal -->
    <div v-if="showObsModal && obsModalQuote" class="modal-overlay" @click.self="showObsModal = false">
      <div class="modal-card obs-modal">
        <div class="obs-modal-header">
          <h3>Observaciones — {{ obsModalQuote.code }}</h3>
          <button class="modal-close" title="Cerrar" @click="showObsModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="obs-modal-body">{{ obsModalQuote.observations }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCRM } from '@/composables/useCRM'
import type { Cotizacion, CotizacionServicio, EstadoCotizacion } from '@/types/crmTypes'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const {
  clientes,
  proyectos,
  cotizaciones,
  loading,
  error,
  fetchCotizaciones,
  fetchClientes,
  fetchProyectos,
  createCotizacion,
  updateCotizacion,
  deleteCotizacion,
} = useCRM()

const searchInput = ref('')
const activeFilter = ref('todos')
const frontPage = ref(1)
const frontPageSize = 20
const clientSearch = ref('')
const showClientDropdown = ref(false)
const projectSearch = ref('')
const showProjectDropdown = ref(false)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const statusFilters = [
  { label: 'Todas', value: 'todos' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Enviada', value: 'enviada' },
  { label: 'Aprobada', value: 'aprobada' },
  { label: 'Rechazada', value: 'rechazada' },
  { label: 'Vencida', value: 'vencida' },
]

const sortedClientes = computed(() => {
  const list = [...clientes.value].sort((a, b) =>
    (a.razonSocial || '').localeCompare(b.razonSocial || '', 'es', { sensitivity: 'base' })
  )
  if (!clientSearch.value) return list
  const term = clientSearch.value.toLowerCase()
  return list.filter((c) => (c.razonSocial || '').toLowerCase().includes(term))
})

function selectClient(id: number) {
  form.value.clientId = id
  showClientDropdown.value = false
  clientSearch.value = ''
}

function getSelectedClientName(): string {
  if (form.value.clientId === 0) return ''
  const c = clientes.value.find((cl) => cl.id === form.value.clientId)
  return c ? c.razonSocial : ''
}

function toggleClientDropdown() {
  showClientDropdown.value = !showClientDropdown.value
  if (showClientDropdown.value) {
    clientSearch.value = ''
    showProjectDropdown.value = false
  }
}

function closeClientDropdown() {
  showClientDropdown.value = false
  clientSearch.value = ''
}

const sortedProyectos = computed(() => {
  const list = [...proyectos.value].sort((a, b) =>
    (a.code || '').localeCompare(b.code || '', 'es', { sensitivity: 'base' })
  )
  if (!projectSearch.value) return list
  const term = projectSearch.value.toLowerCase()
  return list.filter(
    (p) =>
      (p.code || '').toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
  )
})

function selectProject(id: number) {
  form.value.projectId = id
  showProjectDropdown.value = false
  projectSearch.value = ''
}

function getSelectedProjectName(): string {
  if (form.value.projectId === 0) return ''
  const p = proyectos.value.find((pr) => pr.id === form.value.projectId)
  return p ? `${p.code} - ${p.description}` : ''
}

const usedCodes = computed(() => new Set(cotizaciones.value.map((c) => c.code).filter(Boolean)))

const availableCodes = computed(() => {
  const codes: string[] = []
  if (editingQuote.value?.code) {
    codes.push(editingQuote.value.code)
  }
  let i = 258
  while (i < 100000) {
    const code = `OE-${String(i).padStart(4, '0')}`
    if (!usedCodes.value.has(code) && !codes.includes(code)) {
      codes.push(code)
      break
    }
    i++
  }
  return codes
})

function toggleProjectDropdown() {
  showProjectDropdown.value = !showProjectDropdown.value
  if (showProjectDropdown.value) {
    projectSearch.value = ''
    showClientDropdown.value = false
  }
}

const filteredCotizaciones = computed(() => {
  let result = [...cotizaciones.value]

  if (searchInput.value) {
    const term = searchInput.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.code.toLowerCase().includes(term) ||
        (c.client?.name && c.client.name.toLowerCase().includes(term)) ||
        ((c.client as any).razonSocial && (c.client as any).razonSocial.toLowerCase().includes(term)),
    )
  }

  if (activeFilter.value !== 'todos') {
    result = result.filter((c) => c.status === activeFilter.value)
  }

  return result
})

const totalItems = computed(() => filteredCotizaciones.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / frontPageSize))

const paginatedCotizaciones = computed(() => {
  const start = (frontPage.value - 1) * frontPageSize
  return filteredCotizaciones.value.slice(start, start + frontPageSize)
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
  let base = cotizaciones.value
  if (searchInput.value) {
    const term = searchInput.value.toLowerCase()
    base = base.filter(
      (c) =>
        c.code.toLowerCase().includes(term) ||
        (c.client?.name && c.client.name.toLowerCase().includes(term)) ||
        ((c.client as any).razonSocial && (c.client as any).razonSocial.toLowerCase().includes(term)),
    )
  }
  if (filter === 'todos') return base.length
  return base.filter((c) => c.status === filter).length
}

function getStatusClass(status: EstadoCotizacion): string {
  const map: Record<EstadoCotizacion, string> = {
    pendiente: 'pending',
    enviada: 'sent',
    aprobada: 'approved',
    rechazada: 'rejected',
    vencida: 'expired',
  }
  return map[status] || ''
}

function getStatusLabel(status: EstadoCotizacion): string {
  const map: Record<EstadoCotizacion, string> = {
    pendiente: 'Pendiente',
    enviada: 'Enviada',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
    vencida: 'Vencida',
  }
  return map[status] || status
}

function getClientName(cot: Cotizacion): string {
  if (cot.client) return (cot.client as any).razonSocial || cot.client.name || '-'
  if (cot.clientName) return cot.clientName
  return '-'
}

function isLongObservation(text: string): boolean {
  return text.length > 120 || text.split('\n').length > 3
}

const showObsModal = ref(false)
const obsModalQuote = ref<Cotizacion | null>(null)

function openObservationsModal(cot: Cotizacion) {
  obsModalQuote.value = cot
  showObsModal.value = true
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCurrencyInput(value: number | undefined | null): string {
  if (!value && value !== 0) return '0'
  return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

const formSubtotal = computed(() =>
  form.value.services.reduce(
    (sum, s) => sum + (Number(s.value) || 0) * (Number(s.quantity) || 0),
    0
  )
)
const formDiscountAmount = computed(() => formSubtotal.value * ((form.value.descuento || 0) / 100))
const formBase = computed(() => formSubtotal.value - formDiscountAmount.value)
const formIvaAmount = computed(() => formBase.value * ((form.value.iva || 0) / 100))
const quoteTotal = computed(() => formBase.value + formIvaAmount.value)

function onSvcValueInput(event: Event, idx: number) {
  const raw = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  form.value.services[idx].value = Number(raw) || 0
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
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

// Detail modal
const showDetailModal = ref(false)
const selectedQuote = ref<Cotizacion | null>(null)

const servicesSubtotal = computed(() =>
  (selectedQuote.value?.services || []).reduce(
    (sum, s) => sum + (Number(s.value) || 0) * (Number(s.quantity) || 0),
    0
  )
)
const selectedQuoteExtra = computed(() => parseExtraData(selectedQuote.value?.extraData))
const selectedQuoteIva = computed(() => (typeof selectedQuoteExtra.value['iva'] === 'number' ? selectedQuoteExtra.value['iva'] : 19))
const selectedQuoteDescuento = computed(() => (typeof selectedQuoteExtra.value['descuento'] === 'number' ? selectedQuoteExtra.value['descuento'] : 0))
const selectedQuoteDiscountAmount = computed(() => servicesSubtotal.value * (selectedQuoteDescuento.value / 100))
const selectedQuoteBase = computed(() => servicesSubtotal.value - selectedQuoteDiscountAmount.value)
const selectedQuoteIvaAmount = computed(() => selectedQuoteBase.value * (selectedQuoteIva.value / 100))
const selectedQuoteTotal = computed(() => selectedQuoteBase.value + selectedQuoteIvaAmount.value)

function viewQuote(cot: Cotizacion) {
  selectedQuote.value = cot
  showDetailModal.value = true
}

async function toggleIsVisible(cot: Cotizacion) {
  const newVisibility = !cot.isVisible
  const result = await updateCotizacion(cot.id, { isVisible: newVisibility })
  if (result) {
    selectedQuote.value = result
  }
}

// Textos por defecto de los términos del PDF (editables por cotización)
const DEFAULT_COMMERCIAL_TERMS = `**Vigencia de la cotización:** Treinta (30) días calendario.
**Tiempos de entregables:** 5 días.
**Aprobación de la Oferta:** En caso de aprobación de esta oferta, por favor enviar Orden de Compra o esta oferta firmada al correo: **administrativo@esgestionempresarial.com**
**Términos de Pago:** 50% anticipado - 50% al finalizar la actividad (sujeto a negociación con el cliente).
* Transferencia electrónica a la cuenta de ahorros No. **1089-044-3160** del **BANCO DE DAVIVIENDA** a nombre de ES GESTIÓN EMPRESARIAL SAS NIT 901.790.027-5`

const DEFAULT_SERVICE_TERMS = `* Se dará por terminado el servicio cuando se realice el envío de los entregables
**Nota 1:** Las fechas serán acordadas según la disponibilidad de las dos partes.`

const DEFAULT_CONFIDENTIALITY_TERMS = `La información obtenida durante la prestación de los servicios contratados será confidencial y ninguna de las partes podrá hacerla pública. En caso de que sea necesario divulgarla por razones legales, la parte que deba revelarla deberá obtener el consentimiento previo y por escrito de la otra parte. Si se requiere acceso a documentos, éste podrá realizarse de forma física en las instalaciones permanentes, cumpliendo con los procedimientos internos establecidos para tal fin.
Ambas partes se comprometen a cumplir con la legislación vigente en materia de protección de datos personales y garantizarán que los datos personales intercambiados entre ellas, incluidos los datos personales de sus empleados y/o representantes (los Datos Personales), serán tratados de manera confidencial. Asimismo, ambas partes se comprometen a informar a los titulares de los datos personales sobre los procedimientos, alcance y finalidades de la recolección, tratamiento y administración de privacidad e implementar medidas de seguridad administrativas, técnicas y físicas para proteger dichos datos, pérdida, alteración, destrucción o tratamiento no autorizado.
Además, las partes se obligan a no transferir, ceder ni compartir los datos personales, salvo que sea de forma gratuita u onerosa, sin el consentimiento previo y por escrito de la otra parte. En caso de cualquier pérdida, fuga o divulgación no autorizada de los datos personales, ya sea por negligencia, dolo o mala fe, por parte de sus empleados, usuarios, clientes o asesores, la parte responsable deberá notificar por escrito a la otra parte dentro de los cinco (5) días siguientes a la ocurrencia del incidente.`

function escapeTermsHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Firma del PDF: imagen cargada desde link (Cloudinary permite CORS por defecto).
// - Si la imagen no carga, se muestra el texto "FIRMA" automáticamente.
const SIGNATURE_URL = 'https://res.cloudinary.com/dlwzazojt/image/upload/v1794375726/camila_wptonv.png'

function termsTextToHtml(text: string, cssClass = ''): string {
  const classAttr = cssClass ? ` class="${cssClass}"` : ''
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => `<p${classAttr}>${escapeTermsHtml(line).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`)
    .join('')
}

async function downloadPDF(cot: Cotizacion) {
  const previewWindow = window.open('', '_blank')
  if (!previewWindow) {
    window.alert('Permite las ventanas emergentes para previsualizar el PDF.')
    return
  }
  previewWindow.document.write('<p style="font-family:Arial,sans-serif;padding:24px;">Preparando previsualización...</p>')

  const servicesRows = (cot.services || []).map((s, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${s.name}</td>
      <td>${s.description || '-'}</td>
      <td>${s.quantity}</td>
      <td>$ ${(s.value || 0).toLocaleString('es-CO')}</td>
      <td>$ ${((s.value || 0) * (s.quantity || 0)).toLocaleString('es-CO')}</td>
    </tr>
  `).join('')

  const quoteDate = cot.createdAt ? cot.createdAt.slice(0, 10) : '-'
  const pdfExtra = parseExtraData(cot.extraData)
  const pdfIvaPct = typeof pdfExtra['iva'] === 'number' ? pdfExtra['iva'] : 19
  const pdfDescuentoPct = typeof pdfExtra['descuento'] === 'number' ? pdfExtra['descuento'] : 0
  const pdfModalidadRaw = (pdfExtra['modalidad'] as string) || 'Presencial'
  const pdfModalidad = pdfModalidadRaw === 'Sin definir' ? '' : pdfModalidadRaw
  const subtotalAmount = (cot.services || []).reduce((sum, s) => sum + (Number(s.value) || 0) * (Number(s.quantity) || 0), 0)
  const discountAmount = subtotalAmount * (pdfDescuentoPct / 100)
  const baseAmount = subtotalAmount - discountAmount
  const ivaAmount = baseAmount * (pdfIvaPct / 100)
  const totalAmount = baseAmount + ivaAmount
  const formatPdfCurrency = (value: number) => `$ ${Math.round(value).toLocaleString('es-CO')}`

  const commercialTermsHtml = termsTextToHtml(cot.commercialTerms || DEFAULT_COMMERCIAL_TERMS)
  const serviceTermsHtml = termsTextToHtml(cot.serviceTerms || DEFAULT_SERVICE_TERMS)
  const confidentialityHtml = termsTextToHtml(cot.confidentialityTerms || DEFAULT_CONFIDENTIALITY_TERMS)

  const htmlHead = `
    <!DOCTYPE html>
    <html>
    <head>
      <title> </title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1a1a1a; }
        .header-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 32px; }
        .header-table col:first-child { width: 34%; }
        .header-table col:nth-child(2) { width: 50%; }
        .header-table col:nth-child(3) { width: 16%; }
        .header-table, .header-table td { border: 1px solid #000; border-collapse: collapse; }
        .header-table td { height: 42px; padding: 0; vertical-align: middle; }
        .header-logo { height: 84px !important; text-align: center; }
        .header-logo img { max-width: 150px; max-height: 68px; object-fit: contain; }
        .header-center { height: 42px; text-align: center; }
        .company-name { height: 42px; text-align: center; font-size: 20px; font-weight: 700; line-height: 1.1; }
        .company-nit { margin-top: 4px; font-size: 9px; font-weight: 400; }
        .doc-title { height: 28px !important; text-align: center; font-size: 13px; font-weight: 700; }
        .header-meta { text-align: center; font-size: 8px; font-weight: 700; }
        .header-meta-top { height: 42px !important; }
        .header-meta-bottom { height: 42px !important; font-size: 7px; }
        .header-meta-bottom span + span { margin-left: 7px; }
        .quote-details { margin: 0 0 18px; font-size: 11px; line-height: 1.45; }
        .quote-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-bottom: 14px; }
        .quote-details strong { font-weight: 700; }
        .greeting { margin: 12px 0 10px; font-size: 12px; }
        .intro { margin: 0 0 8px; font-size: 10px; line-height: 1.5; }
        .scope-title { margin: 8px 0 4px; font-size: 11px;   }
        .scope-list { margin: 0 0 12px 18px; padding: 0; font-size: 10px; line-height: 1.5; }
        .services-title { margin: 14px 0 5px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .services-intro { margin: 0 0 8px; font-size: 10px; }
        .services-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 24px; }
        .services-table th, .services-table td { border: 1px solid #000; padding: 6px 5px; font-size: 9px; vertical-align: middle; text-align: center; }
        .services-table th { background: #B49538; color: #fff; font-weight: 700; }
        .services-table th:nth-child(1) { width: 4%; }
        .services-table th:nth-child(2) { width: 31%; }
        .services-table th:nth-child(3) { width: 29%; }
        .services-table th:nth-child(4) { width: 10%; }
        .services-table th:nth-child(5), .services-table th:nth-child(6) { width: 13%; }
        .services-table td { white-space: nowrap; }
        .total-row td { font-weight: 700; font-size: 11px; }
        .commercial-summary { display: flex; justify-content: flex-end; margin: -12px 0 14px; }
        .commercial-summary table { width: 240px; margin: 0; border-collapse: collapse; }
        .commercial-summary td { border: 1px solid #000; padding: 3px 7px; font-size: 9px; }
        .commercial-summary td:first-child { width: 60%; }
        .commercial-summary td:last-child { width: 40%; text-align: right; white-space: nowrap; }
        .commercial-summary .summary-total td { font-weight: 700; }
        .commercial-terms { border: 1px solid #000; margin-top: 86px; font-size: 9px; line-height: 1.45; }
        .commercial-terms-title { padding: 2px 6px; background: #B49538; color: #fff; text-align: center; font-weight: 700; }
        .commercial-terms-body { padding: 7px 8px; }
        .commercial-terms-body p { margin: 0 0 3px; }
        .commercial-terms-body p:last-child { margin-bottom: 0; }
        .service-terms { margin-top: 14px; }
        .service-terms-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .service-terms-table th, .service-terms-table td { border: 1px solid #000; }
        .service-terms-table th { background: #B49538; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 6px; text-align: center; }
        .service-terms-table td { padding: 8px 10px; font-size: 9px; line-height: 1.6; vertical-align: top; }
        .terms-left { width: 62%; }
        .terms-right { width: 38%; }
        .special-conditions-label { text-align: center; font-weight: 700; font-size: 10px; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 4px; }
        .confidentiality { border: 1px solid #000; margin-top: 14px; }
        .confidentiality-title { padding: 3px 6px; background: #B49538; color: #fff; text-align: center; font-weight: 700; font-size: 10px; }
        .confidentiality-body { padding: 7px 8px; font-size: 9px; line-height: 1.5; }
        .confidentiality-body p { margin: 0 0 6px; }
        .confidentiality-body p:last-child { margin-bottom: 0; }
        .closing { margin-top: 36px; }
        .closing-text { font-size: 11px; font-style: italic; font-weight: 700; margin: 0 0 24px; }
        .signature-block { display: flex; justify-content: space-between; align-items: flex-start; font-size: 10px; line-height: 1.5; }
        .signature-img { display: block; height: 50px; max-width: 200px; object-fit: contain; object-position: left bottom; margin-bottom: 2px; }
        .signature-firma { display: flex; align-items: flex-end; height: 50px; font-weight: 700; color: #9ca3af; }
        .doc-banner { display: flex; align-items: stretch; background: #595959; margin-top: 22px; min-height: 88px; }
        .banner-spacer { flex: 1; }
        .banner-spacer-end { flex: 0 0 24px; }
        .banner-logo { background: #fff; display: flex; align-items: center; justify-content: center; padding: 8px 14px; }
        .banner-logo img { max-height: 64px; max-width: 130px; object-fit: contain; }
        .banner-photo { flex: 0 0 200px; background: #4b4b4b; }
        .banner-quote { flex: 0 0 210px; background: #3f3f3f; color: #fff; padding: 10px 14px; display: flex; flex-direction: column; justify-content: center; }
        .quote-mark { font-size: 34px; font-weight: 700; line-height: 0.8; }
        .quote-text { font-size: 11px; font-weight: 700; line-height: 1.35; margin-top: 4px; }
        .doc-contact { text-align: center; font-size: 8px; color: #6b7280; margin-top: 8px; }
        .doc-contact p { margin: 2px 0; }
        .doc-contact a { color: #2563eb; text-decoration: underline; }
        .observations { background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; color: #374151; }
        @media print {
          /* Oculta los encabezados y pies de página del navegador (about:blank, fecha, paginación) */
          @page {
            margin: 0;
            size: letter portrait;
          }

          /* Le da un margen interno al cuerpo para que el contenido no quede pegado al borde del papel */
          body {
            margin: 15mm 10mm 15mm 10mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
  `

  const headerDetailsHtml = `
      <table class="header-table">
        <colgroup><col><col><col></colgroup>
        <tbody>
          <tr>
            <td class="header-logo" rowspan="2">
              <img src="${window.location.origin}/images/LOGO.PNG" alt="ES Gestión Empresarial">
            </td>
            <td class="header-center company-name">
              ES GESTIÓN EMPRESARIAL<br>
              <span class="company-nit">NIT 901.790.027-5</span>
            </td>
            <td class="header-meta header-meta-top">CO-F-001-02</td>
          </tr>
          <tr>
            <td class="header-center doc-title">OFERTA ECONÓMICA</td>
            <td class="header-meta header-meta-bottom"><span>VERSIÓN 01</span><span>2025-03-07</span></td>
          </tr>
        </tbody>
      </table>

      <section class="quote-details">
        <div class="quote-details-grid">
          <div><strong>SEÑORES</strong><br><strong>${getClientName(cot)}</strong><br>${cot.client?.nit || pdfExtra['nitCC'] || 'NIT no registrado'}</div>
          <div>
            <div><strong>Fecha:</strong> ${quoteDate}</div>
            <div><strong>Nº de Oferta Económica:</strong> ${cot.code}</div>
          </div>
          ${cot.project ? `<div style="grid-column: 1 / -1;"><strong>Proyecto:</strong> ${cot.project.code} - ${cot.project.description}</div>` : ''}
        </div>
        <div class="greeting"><strong>Cordial saludo,</strong></div>
        <p class="intro">Para ES Gestión Empresarial es un gusto hacer parte de su proceso de mejora continua, apoyándoles con excelencia y dedicación en cada paso hacia el éxito.</p>
        <div class="scope-title">Nuestra oferta comprende:</div>
        ${cot.observations ? termsTextToHtml(cot.observations, 'intro') : ''}
      </section>
  `

  const hasServices = Boolean(cot.services && cot.services.length > 0)

  const servicesHtml = hasServices ? '<div class="services-title">Descripción de la oferta:</div>' + (pdfModalidad ? '<div class="services-intro"><strong>Modalidad de trabajo:</strong> ' + pdfModalidad + '</div>' : '') + '<div class="services-intro">De acuerdo a su solicitud, a continuación encontrará la descripción y costos del servicio:</div><table class="services-table"><thead><tr><th>No.</th><th>ACTIVIDAD</th><th>NORMA</th><th>TIEMPO<br>(Días)</th><th>VALOR * DÍA<br>(COP)</th><th>VALOR TOTAL<br>(COP)</th></tr></thead><tbody>' + servicesRows + '</tbody></table><div class="commercial-summary"><table><tbody><tr><td>SUB TOTAL</td><td>' + formatPdfCurrency(subtotalAmount) + '</td></tr>' + (pdfDescuentoPct > 0 ? '<tr><td>DESCUENTO ' + pdfDescuentoPct + ' %</td><td>' + formatPdfCurrency(discountAmount) + '</td></tr>' : '') + (pdfIvaPct > 0 ? '<tr><td>IVA ' + pdfIvaPct + ' %</td><td>' + formatPdfCurrency(ivaAmount) + '</td></tr>' : '') + '<tr class="summary-total"><td>VALOR TOTAL</td><td>' + formatPdfCurrency(totalAmount) + '</td></tr></tbody></table></div><div class="commercial-terms"><div class="commercial-terms-title">TÉRMINOS COMERCIALES</div><div class="commercial-terms-body">' + commercialTermsHtml + '</div></div>' : ''

  const termsHtml = hasServices ? '<div class="service-terms"><table class="service-terms-table"><thead><tr><th colspan="2">TÉRMINOS DEL SERVICIO</th></tr></thead><tbody><tr><td class="terms-left">' + serviceTermsHtml + '</td><td class="terms-right"><div class="special-conditions-label">CONDICIONES ESPECIALES</div></td></tr></tbody></table></div><div class="confidentiality"><div class="confidentiality-title">CONFIDENCIALIDAD Y PROTECCIÓN DE LA INFORMACIÓN</div><div class="confidentiality-body">' + confidentialityHtml + '</div></div>' : ''

  const closingHtml = `
      <div class="closing">
        <p class="closing-text">Atentamente,</p>
        <div class="signature-block">
          <div class="signature-left">
            ${SIGNATURE_URL ? `<img class="signature-img" src="${SIGNATURE_URL}" alt="Firma" onerror="this.style.display='none';this.parentElement.querySelector('.signature-firma').style.display='flex'" /><div class="signature-firma" style="display:none">FIRMA</div>` : '<div class="signature-firma">FIRMA</div>'}
            <div><strong>Camila Escobar</strong><br><strong>Gerente Comercial</strong></div>
          </div>
        </div>
      </div>
      </div>

      <div class="doc-banner">
        <div class="banner-spacer"></div>
        <div class="banner-logo"><img src="${window.location.origin}/images/LOGO.PNG" alt="ESG"></div>
        <div class="banner-photo"></div>
        <div class="banner-quote">
          <div class="quote-mark">&ldquo;</div>
          <div class="quote-text">NOS DEDICAMOS A AYUDARTE EN EL AUMENTO DE LAS CAPACIDADES DE TU ORGANIZACIÓN</div>
        </div>
        <div class="banner-spacer banner-spacer-end"></div>
      </div>
      <div class="doc-contact">
        <p>ESG ES GESTIÓN EMPRESARIAL S.A.S. | Carrera 76 60-09 | Medellín, Colombia | Cel. 318 388 66 99 - 301 253 60 65</p>
        <p><a href="https://www.esgestionempresarial.com">www.esgestionempresarial.com</a></p>
      </div>
  `

  const page1Html = htmlHead + headerDetailsHtml + (hasServices ? servicesHtml : closingHtml) + `
    </body>
    </html>
  `

  const page2Html = hasServices ? htmlHead + termsHtml + closingHtml + `
    </body>
    </html>
  ` : ''

  const renderPageCanvas = async (pageHtml: string): Promise<HTMLCanvasElement> => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.position = 'fixed'
    iframe.style.left = '-10000px'
    iframe.style.top = '0'
    iframe.style.width = '816px'
    iframe.style.height = '1056px'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    try {
      const iframeDocument = iframe.contentDocument
      if (!iframeDocument) throw new Error('No se pudo preparar el documento PDF')
      iframeDocument.open()
      iframeDocument.write(pageHtml)
      iframeDocument.close()

      await new Promise<void>(resolve => {
        if (iframeDocument.readyState === 'complete') {
          resolve()
          return
        }
        iframe.onload = () => resolve()
      })

      await Promise.all(Array.from(iframeDocument.images).map(image => {
        if (image.complete) return Promise.resolve()
        return new Promise<void>(resolve => {
          image.onload = () => resolve()
          image.onerror = () => resolve()
        })
      }))

      return await html2canvas(iframeDocument.body, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      })
    } finally {
      iframe.remove()
    }
  }

  const canvas1 = await renderPageCanvas(page1Html)
  const canvas2 = page2Html ? await renderPageCanvas(page2Html) : null

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const footerHeight = 8
    const contentWidth = pageWidth - margin * 2
    const contentHeight = pageHeight - margin * 2 - footerHeight
    const totalPageCount = (canvas1 ? 1 : 0) + (canvas2 ? 1 : 0)

    let pageIndex = 0
    const appendFittedPage = (canvas: HTMLCanvasElement) => {
      if (pageIndex > 0) pdf.addPage()
      const drawHeight = Math.min(contentHeight, canvas.height * contentWidth / canvas.width)
      const drawWidth = canvas.width * drawHeight / canvas.height
      const x = (pageWidth - drawWidth) / 2
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', x, margin, drawWidth, drawHeight)
      pdf.setFontSize(8)
      pdf.setTextColor(107, 114, 128)
      pageIndex += 1
      pdf.text(`Página ${pageIndex} de ${totalPageCount}`, pageWidth / 2, pageHeight - 5, { align: 'center' })
    }

    appendFittedPage(canvas1)
    if (canvas2) appendFittedPage(canvas2)

    const pdfBlob = pdf.output('blob')
    const downloadUrl = URL.createObjectURL(pdfBlob)
    const clientRaw = getClientName(cot)
    const safeClient = (clientRaw === '-' ? 'cliente' : clientRaw)
      .replace(/[\\/:*?"<>|.]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40)
    const fileName = `${cot.code || 'cotizacion'} ${safeClient}.pdf`

    previewWindow.document.open()
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body { margin: 0; background: #525659; font-family: Arial, sans-serif; }
            .toolbar { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background: #f9fafb; border-bottom: 1px solid #d1d5db; }
            .toolbar-title { font-size: 13px; font-weight: 700; color: #111827; }
            .toolbar-btn { padding: 7px 14px; border: none; border-radius: 6px; background: #B49538; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; }
            .toolbar-btn:hover { background: #9a7e2e; }
            embed { display: block; width: 100%; height: calc(100vh - 45px); }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <span class="toolbar-title">${fileName}</span>
            <button class="toolbar-btn" onclick="window.downloadPdf()">Descargar PDF</button>
          </div>
          <embed src="${downloadUrl}" type="application/pdf" />
          <script>
            window.downloadPdf = function () {
              var a = document.createElement('a')
              a.href = '${downloadUrl}'
              a.download = '${fileName}'
              document.body.appendChild(a)
              a.click()
              a.remove()
            }
          <\/script>
        </body>
      </html>
    `)
    previewWindow.document.close()

    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 600000)
}

// Form modal
const showFormModal = ref(false)
const editingQuote = ref<Cotizacion | null>(null)
const saving = ref(false)
const formError = ref<string | null>(null)

interface QuoteForm {
  code: string
  clientId: number
  clientName: string
  nitCC: string
  projectId: number
  status: EstadoCotizacion
  totalAmount: number
  iva: number
  descuento: number
  modalidad: string
  validUntil: string
  observations: string
  services: CotizacionServicio[]
  isVisible: boolean
  commercialTerms: string
  serviceTerms: string
  confidentialityTerms: string
}

const defaultForm: QuoteForm = {
  code: '',
  clientId: 0,
  clientName: '',
  nitCC: '',
  projectId: 0,
  status: 'pendiente',
  totalAmount: 0,
  iva: 19,
  descuento: 0,
  modalidad: 'Presencial',
  validUntil: '',
  observations: '',
  services: [],
  isVisible: false,
  commercialTerms: DEFAULT_COMMERCIAL_TERMS,
  serviceTerms: DEFAULT_SERVICE_TERMS,
  confidentialityTerms: DEFAULT_CONFIDENTIALITY_TERMS,
}

const form = ref<QuoteForm>({ ...defaultForm })

const loadedExtraData = ref<Record<string, unknown>>({})

function parseExtraData(raw: unknown): Record<string, unknown> {
  if (!raw) return {}
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as Record<string, unknown> } catch { return {} }
  }
  if (typeof raw === 'object') return raw as Record<string, unknown>
  return {}
}

function openCreateModal() {
  editingQuote.value = null
  form.value = { ...defaultForm, services: [] }
  form.value.code = availableCodes.value[0] || ''
  formError.value = null
  showFormModal.value = true
}

function openEditModal(cot: Cotizacion) {
  editingQuote.value = cot
  const extra = parseExtraData(cot.extraData)
  loadedExtraData.value = extra
  form.value = {
    code: cot.code,
    clientId: cot.clientId ?? 0,
    clientName: cot.clientName || (extra['clientName'] as string) || '',
    nitCC: (extra['nitCC'] as string) || '',
    projectId: cot.projectId || 0,
    status: cot.status,
    totalAmount: cot.totalAmount,
    iva: typeof extra['iva'] === 'number' ? extra['iva'] : 19,
    descuento: typeof extra['descuento'] === 'number' ? extra['descuento'] : 0,
    modalidad: (extra['modalidad'] as string) || 'Presencial',
    validUntil: cot.validUntil ? cot.validUntil.split('T')[0] : '',
    observations: cot.observations || '',
    services: cot.services ? [...cot.services.map((s) => ({ ...s }))] : [],
    isVisible: cot.isVisible || false,
    commercialTerms: cot.commercialTerms || DEFAULT_COMMERCIAL_TERMS,
    serviceTerms: cot.serviceTerms || DEFAULT_SERVICE_TERMS,
    confidentialityTerms: cot.confidentialityTerms || DEFAULT_CONFIDENTIALITY_TERMS,
  }
  formError.value = null
  showFormModal.value = true
}

function addService() {
  form.value.services.push({
    name: '',
    quantity: 1,
    billingType: 'ONETIME',
    description: '',
    value: 0,
  })
}

function removeService(index: number) {
  form.value.services.splice(index, 1)
}

async function handleSave() {
  if (!form.value.code.trim()) {
    formError.value = 'El código es obligatorio'
    return
  }
  if (!form.value.status) {
    formError.value = 'El estado es obligatorio'
    return
  }
  if (!form.value.clientId && !form.value.clientName.trim()) {
    formError.value = 'Selecciona un cliente o ingresa el nombre de la entidad'
    return
  }
  const validServices = form.value.services.filter((s) => s.name.trim())
  if (validServices.length === 0) {
    formError.value = 'Agrega al menos un servicio'
    return
  }

  saving.value = true
  formError.value = null

  const mergedExtraData: Record<string, unknown> = { ...loadedExtraData.value }
  mergedExtraData['iva'] = form.value.iva
  mergedExtraData['descuento'] = form.value.descuento
  mergedExtraData['modalidad'] = form.value.modalidad
  const trimmedName = form.value.clientName.trim()
  if (trimmedName) mergedExtraData['clientName'] = trimmedName
  else delete mergedExtraData['clientName']
  const trimmedNit = form.value.nitCC.trim()
  if (trimmedNit) mergedExtraData['nitCC'] = trimmedNit
  else delete mergedExtraData['nitCC']

  const payload = {
    code: form.value.code.trim(),
    clientId: form.value.clientId || null,
    clientName: trimmedName || undefined,
    projectId: form.value.projectId || undefined,
    status: form.value.status,
    totalAmount: quoteTotal.value,
    validUntil: form.value.validUntil || undefined,
    observations: form.value.observations.trim() || undefined,
    services: validServices,
    isVisible: form.value.isVisible,
    commercialTerms: form.value.commercialTerms.trim(),
    serviceTerms: form.value.serviceTerms.trim(),
    confidentialityTerms: form.value.confidentialityTerms.trim(),
    extraData: mergedExtraData,
  }

  let result: Cotizacion | null = null
  if (editingQuote.value) {
    result = await updateCotizacion(editingQuote.value.id, payload)
  } else {
    result = await createCotizacion(payload)
  }

  saving.value = false
  if (result) {
    showFormModal.value = false
  } else {
    const msg = error.value || 'No se pudo guardar la cotización'
    formError.value = msg.toLowerCase().includes('services array')
      ? 'Agrega al menos un servicio'
      : msg
  }
}

// Delete modal
const showDeleteModal = ref(false)
const quoteToDelete = ref<Cotizacion | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

function confirmDelete(cot: Cotizacion) {
  quoteToDelete.value = cot
  deleteError.value = null
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!quoteToDelete.value) return
  deleting.value = true
  deleteError.value = null
  const success = await deleteCotizacion(quoteToDelete.value.id)
  deleting.value = false
  if (success) {
    showDeleteModal.value = false
    quoteToDelete.value = null
  } else {
    deleteError.value = error.value || 'No se pudo eliminar la cotización'
  }
}

async function loadData() {
  await Promise.all([
    fetchCotizaciones({ limit: 9999 }),
    fetchClientes({ page: 1, limit: 9999 }),
    fetchProyectos({ limit: 9999 }),
  ])
  frontPage.value = 1
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (showFormModal.value) showFormModal.value = false
    else if (showDetailModal.value) showDetailModal.value = false
    else if (showDeleteModal.value) showDeleteModal.value = false
  }
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.client-dropdown-wrapper')) {
    showClientDropdown.value = false
    clientSearch.value = ''
    showProjectDropdown.value = false
    projectSearch.value = ''
  }
}

onMounted(() => {
  loadData()
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.quotes-page {
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

.client-name {
  display: block;
  font-weight: 600;
  color: var(--c-black);
  max-width: 200px;
  word-wrap: break-word;
}

.client-nit {
  display: block;
  font-size: 0.78rem;
  color: var(--c-gray);
  margin-top: 2px;
}

.code-cell {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--c-primary);
  min-width: 130px;
}

.project-text {
  font-size: 0.82rem;
  color: var(--c-black);
  max-width: 200px;
  word-wrap: break-word;
}

.no-data {
  color: var(--c-gray-light);
}

.amount-cell {
  font-weight: 700;
  color: var(--c-black);
  white-space: nowrap;
}

.date-cell {
  font-size: 0.82rem;
  color: var(--c-gray);
  white-space: nowrap;
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
.status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.status-badge.sent { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.status-badge.approved { background: rgba(16, 185, 129, 0.1); color: #059669; }
.status-badge.rejected { background: rgba(239, 68, 68, 0.1); color: #DC2626; }
.status-badge.expired { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

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
.action-btn.download:hover {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

/* ===== SKELETON ===== */
.skeleton-table { padding: 0; }

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
  height: 16px;
  background: var(--c-light);
  border-radius: 4px;
}

.skeleton-code { width: 120px; }
.skeleton-name { width: 160px; }
.skeleton-project { width: 140px; }
.skeleton-amount { width: 100px; }
.skeleton-status { width: 80px; height: 24px; border-radius: 6px; }
.skeleton-date { width: 90px; }
.skeleton-actions { width: 80px; height: 34px; border-radius: 8px; }

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
  overflow: hidden;
}

.modal-card.modal-lg {
  max-width: 900px;
  text-align: left;
}

.obs-modal {
  max-width: 560px;
  text-align: left;
  padding: 24px;
}

.obs-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.obs-modal-header h3 {
  margin: 0;
}

.obs-modal .modal-close {
  position: static;
  color: var(--c-gray);
}

.obs-modal-body {
  white-space: pre-line;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--c-black);
  max-height: 60vh;
  overflow-y: auto;
}

.obs-cell {
  white-space: pre-line;
  font-size: 0.8rem;
  color: var(--c-black);
}

.obs-cell.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.obs-more-btn {
  display: block;
  border: none;
  background: none;
  padding: 0;
  margin-top: 2px;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-primary);
  cursor: pointer;
  text-decoration: underline;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 1.1rem;
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
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.modal-close:hover {
  background: var(--c-light);
  color: var(--c-black);
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

.modal-body {
  margin-bottom: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--c-border);
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

/* ===== FORM ===== */
.form-error {
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
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}

.form-input {
  padding: 10px 12px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--c-black);
  background: var(--c-white);
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.08);
}

select.form-input {
  appearance: auto;
}

.form-input::placeholder { color: var(--c-gray-light); }

textarea.form-input {
  resize: vertical;
  min-height: 60px;
}

/* ===== TOGGLE SWITCH ===== */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #d1d5db;
  border-radius: 24px;
  transition: background 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-switch input:checked + .toggle-slider {
  background: var(--c-primary);
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* ===== VISIBILITY BADGE ===== */
.visibility-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 600;
}

.visibility-badge.visible {
  background: #d1fae5;
  color: #065f46;
}

.visibility-badge.hidden {
  background: #f3f4f6;
  color: #6b7280;
}

/* ===== CLIENT DROPDOWN ===== */
.client-dropdown-wrapper {
  position: relative;
}

.client-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--c-black);
  background: var(--c-white);
  cursor: pointer;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.client-dropdown-trigger:hover {
  border-color: #9ca3af;
}

.client-dropdown-trigger:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.08);
}

.client-dropdown-trigger .placeholder {
  color: var(--c-gray-light);
}

.client-dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--c-white);
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 100;
  overflow: hidden;
}

.client-dropdown-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--c-border);
  color: var(--c-gray);
}

.client-search-input {
  border: none;
  outline: none;
  font-size: 0.85rem;
  color: var(--c-black);
  width: 100%;
  background: transparent;
}

.client-search-input::placeholder {
  color: var(--c-gray-light);
}

.client-dropdown-items {
  max-height: 200px;
  overflow-y: auto;
}

.client-dropdown-item {
  padding: 9px 12px;
  font-size: 0.85rem;
  color: var(--c-black);
  cursor: pointer;
  transition: background 0.15s;
}

.client-dropdown-item:hover {
  background: var(--c-light);
}

.client-dropdown-item.selected {
  background: rgba(200, 155, 45, 0.1);
  color: var(--c-primary);
  font-weight: 600;
}

.client-dropdown-empty {
  padding: 12px;
  text-align: center;
  font-size: 0.82rem;
  color: var(--c-gray);
}

/* ===== CURRENCY INPUT ===== */
.currency-input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  overflow: hidden;
  transition: border-color 0.2s;
}

.currency-input-wrap:focus-within {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.08);
}

.currency-prefix {
  padding: 0 6px 0 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-gray);
  height: 38px;
  display: flex;
  align-items: center;
}

.currency-input {
  border: none !important;
  box-shadow: none !important;
  text-align: left;
  font-weight: 600;
  padding-left: 4px !important;
}

/* ===== SERVICES ===== */
.services-section {
  border-top: 1px solid var(--c-border);
  padding-top: 20px;
}

.terms-section {
  border-top: 1px solid var(--c-border);
  padding-top: 16px;
  margin-top: 20px;
}

.terms-section h4 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-black);
  margin: 0 0 8px;
}

.terms-body {
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--c-gray);
}

.terms-body p {
  margin: 0 0 8px;
}

.terms-body p:last-child {
  margin-bottom: 0;
}

.terms-body strong {
  color: var(--c-black);
  font-weight: 600;
}

.services-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.services-header h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-black);
  margin: 0;
}

.btn-add-service {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px dashed var(--c-primary);
  border-radius: 6px;
  background: rgba(200, 155, 45, 0.05);
  color: var(--c-primary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-add-service:hover {
  background: rgba(200, 155, 45, 0.12);
}

.no-services {
  text-align: center;
  color: var(--c-gray-light);
  font-size: 0.85rem;
  padding: 20px;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.service-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-light);
}

.service-fields {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.service-field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-field-group.full-width {
  flex: 1;
}

.service-field-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--c-gray);
}

.service-name { flex: 2; }
.service-qty { width: 80px; }
.service-type { width: 100px; }
.service-value { flex: 1; }
.service-desc { width: 100%; }

.service-fields .form-input,
.service-desc {
  padding: 8px 10px;
  font-size: 0.82rem;
}

.btn-remove-service {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  color: var(--c-gray);
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}
.btn-remove-service:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* ===== SERVICES TABLE (detail) ===== */
.services-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

.services-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--c-light);
  border-bottom: 1px solid var(--c-border);
}

.services-table td {
  padding: 10px 12px;
  font-size: 0.85rem;
  color: var(--c-black);
  border-bottom: 1px solid var(--c-border);
}

.services-table tr:last-child td { border-bottom: none; }

.services-table .summary-row td {
  background: var(--c-light);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.03em;
}

.services-table .summary-row.total td {
  background: var(--c-primary);
  color: #fff;
  font-weight: 700;
  font-size: 0.8rem;
}

.services-table .summary-row td:first-child {
  text-align: right;
}

.services-table .summary-amount {
  text-align: right;
}

/* ===== DETAIL ===== */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-field.full-width {
  grid-column: 1 / -1;
}

.detail-field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-field span {
  font-size: 0.9rem;
  color: var(--c-black);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .filter-group { overflow-x: auto; flex-wrap: nowrap; }
  .pagination-bar { flex-direction: column; gap: 12px; }
  .form-grid { grid-template-columns: 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
  .service-fields { flex-wrap: wrap; }
  .service-name, .service-qty, .service-type, .service-value { flex: 1 1 auto; }
  .modal-card.modal-lg { max-width: 95%; padding: 20px; }
}
</style>
