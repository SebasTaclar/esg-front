<template>
  <div class="projects-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Proyectos</h1>
        <p class="page-subtitle">{{ filteredProjects.length }} proyectos registrados{{ totalPages > 1 ? ` — Página ${frontPage} de ${totalPages}` : '' }}</p>
      </div>
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon ejecucion">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ filteredProjects.filter(p => (p.status || '').toLowerCase().includes('ejecucion')).length }}</span>
            <span class="summary-label">En Ejecución</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon finalizados">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ filteredProjects.filter(p => (p.status || '').toLowerCase().includes('finalizado')).length }}</span>
            <span class="summary-label">Finalizados</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon cotizacion">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ filteredProjects.filter(p => (p.status || '').toLowerCase().includes('cotizacion')).length }}</span>
            <span class="summary-label">Cotización</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon aprobados">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ filteredProjects.filter(p => (p.status || '').toLowerCase().includes('aprobado')).length }}</span>
            <span class="summary-label">Aprobados</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon suspendidos">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-count">{{ filteredProjects.filter(p => (p.status || '').toLowerCase().includes('suspendido')).length }}</span>
            <span class="summary-label">Suspendidos</span>
          </div>
        </div>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo Proyecto
      </button>
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
        <select v-if="!clientId" v-model="selectedClient" class="form-select">
          <option value="">Todos los clientes</option>
          <option v-for="c in uniqueProjectClients" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="activeFilter" class="form-select">
          <option v-for="f in statusFilters" :key="f.value" :value="f.value">{{ f.label }}</option>
        </select>
        <select v-if="uniqueOffers.length > 0" v-model="selectedOffer" class="form-select">
          <option value="">Todas las ofertas</option>
          <option v-for="o in uniqueOffers" :key="o" :value="o">{{ o }}</option>
        </select>
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
                <th>Cliente</th>
                <th>Oferta</th>
                <th>Estado</th>
                <th>Costo Total Cliente</th>
                <th>Utilidad Final</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in paginatedProjects" :key="p.id">
                <td class="client-cell">
                  <span class="client-name">{{ p.client?.name }}</span>
                  <small v-if="p.client?.code" class="client-code">{{ p.client.code }}</small>
                  <small class="client-type">{{ p.projectType }}</small>
                </td>
                <td><span class="oferta-text">{{ p.offer || '-' }}</span></td>
                <td>
                  <span class="status-badge" :class="getStatusClass(p.status)">{{ p.status }}</span>
                </td>
                <td><span class="costo-text">{{ formatCurrency(p.totalCost) }}</span></td>
                <td><span class="utilidad-text">{{ formatCurrency(calcProjectProfit(p)) }}</span></td>
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
                    <button class="action-btn" title="Editar" @click="openEditModal(p)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn delete" title="Eliminar" @click="confirmDelete(p)">
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

    <!-- Modal Crear Proyecto -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-content modal-lg" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProject ? 'Editar Proyecto' : 'Crear Proyecto' }}</h3>
          <button class="modal-close" @click="closeCreateModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-grid-modal">
            <div class="form-group">
              <label class="form-label required">Cliente</label>
              <select v-model="form.clientId" class="form-input" :class="{ 'field-error': submitted && !form.clientId }" :disabled="!!clientId">
                <option value="">Seleccionar cliente...</option>
                <option v-for="c in uniqueClientes" :key="c.id" :value="c.id">{{ c.razonSocial }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Código</label>
              <input type="text" class="form-input" :value="selectedClientCode" readonly placeholder="Selecciona un cliente" />
            </div>
            <div class="form-group">
              <label class="form-label">NIT</label>
              <input type="text" class="form-input" :value="selectedClientNit" readonly placeholder="Selecciona un cliente" />
            </div>
            <div class="form-group">
              <label class="form-label required">Tipo de Proyecto</label>
              <input v-model="form.serviceType" type="text" class="form-input" :class="{ 'field-error': submitted && !form.serviceType.trim() }" placeholder="Ej: Consultoría" />
            </div>
            <div class="form-group">
              <label class="form-label required">Norma / Reglamento General</label>
              <input v-model="form.norm" type="text" class="form-input" :class="{ 'field-error': submitted && !form.norm.trim() }" placeholder="Escribe la norma..." />
            </div>
            <div class="form-group">
              <label class="form-label required">Estado</label>
              <select v-model="form.status" class="form-input" :class="{ 'field-error': submitted && !form.status }">
                <option value="">Seleccionar estado...</option>
                <option value="Cotizacion">Cotizacion</option>
                <option value="Aprobado">Aprobado</option>
                <option value="En Ejecucion">En Ejecucion</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Responsable ESG</label>
              <input v-model="form.responsible" type="text" class="form-input" :class="{ 'field-error': submitted && !form.responsible.trim() }" placeholder="Nombre del responsable" />
            </div>
            <div class="form-group">
              <label class="form-label required">Fecha de Inicio</label>
              <input v-model="form.startDate" type="date" class="form-input" :class="{ 'field-error': submitted && !form.startDate }" />
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Fin</label>
              <input v-model="form.endDate" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label required">Oferta</label>
              <select v-model="form.offer" class="form-input" :class="{ 'field-error': submitted && !form.offer }">
                <option value="">Seleccionar oferta...</option>
                <option v-for="o in availableOffers" :key="o" :value="o">{{ o }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.description" class="form-input form-textarea" rows="2" placeholder="Descripción del proyecto..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Observaciones</label>
              <textarea v-model="form.observations" class="form-input form-textarea" rows="2" placeholder="Notas adicionales..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Ganancia / Utilidades Total</label>
              <div class="input-currency input-total-green">
                <span class="input-currency-prefix">$</span>
                <input :value="formatCurrencyValue(totalNetProfit)" type="text" class="form-input-sm" readonly />
              </div>
            </div>
          </div>

          <!-- Servicios -->
          <div class="services-section">
            <div class="services-header">
              <div>
                <h3>Servicios</h3>
                <p class="services-subtitle">Agrega los servicios que conforman esta oferta.</p>
              </div>
              <button type="button" class="btn-add-service" @click="addService">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar servicio
              </button>
            </div>
            <div v-if="form.services.length === 0" class="empty-services">
              <p>Sin servicios. Puedes agregar servicios después de crear el proyecto.</p>
            </div>
            <div v-else class="services-list">
              <div v-for="(svc, idx) in form.services" :key="idx" class="service-card">
                <div class="service-card-header" @click="svc._collapsed = !svc._collapsed" style="cursor:pointer">
                  <span class="service-num">Servicio {{ idx + 1 }}{{ getServiceLabel(svc) ? ' — ' + getServiceLabel(svc) : '' }}</span>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span v-if="svc._collapsed" class="service-profit">{{ formatCurrency(calcNetProfit(svc)) }}</span>
                    <svg :class="['cost-toggle-arrow', { open: !svc._collapsed }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    <button type="button" class="remove-btn" @click.stop="removeService(idx)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="!svc._collapsed">
                <div class="services-grid">
                  <div class="form-group">
                    <label class="form-label required">Servicio</label>
                    <div>
                      <select v-model="svc.name" class="form-input-sm">
                        <option value="">Seleccionar servicio...</option>
                        <option v-for="s in serviceTypes" :key="s" :value="s">{{ s }}</option>
                        <option value="__custom__">Otro</option>
                      </select>
                      <input v-if="svc.name === '__custom__'" v-model="svc.customName" type="text" class="form-input-sm" placeholder="Escribe el servicio..." style="margin-top:4px" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Norma</label>
                    <div>
                      <select v-model="svc.norm" class="form-input-sm">
                        <option value="">Seleccionar norma...</option>
                        <option v-for="n in normasList" :key="n" :value="n">{{ n }}</option>
                        <option value="__custom__">Otro</option>
                      </select>
                      <input v-if="svc.norm === '__custom__'" v-model="svc.customNorm" type="text" class="form-input-sm" placeholder="Escribe la norma..." style="margin-top:4px" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Proveedor / Colaborador</label>
                    <input v-model="svc.collaborator" type="text" class="form-input-sm" placeholder="Colaborador" />
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Cantidad</label>
                    <input v-model.number="svc.quantity" type="number" class="form-input-sm" placeholder="1" min="1" />
                    <span class="form-hint">Nº Horas / Días / Meses</span>
                  </div>
                </div>
                <div class="cost-toggle" @click="svc._showCost = !svc._showCost">
                  <span class="cost-toggle-title">Costo al Cliente</span>
                  <span class="cost-toggle-value">{{ formatCurrency(calcTotal(svc)) }}</span>
                  <svg :class="['cost-toggle-arrow', { open: svc._showCost }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div v-if="svc._showCost" class="cost-fields">
                  <div class="cost-fields-grid">
                    <div class="form-group">
                      <label class="form-label required">Valor Unitario</label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(svc.unitPrice)" @input="onCurrencyInput($event, svc, 'unitPrice')" type="text" class="form-input-sm" placeholder="0" />
                      </div>
                      <span class="form-hint">Valor por unidad o jornada</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Subtotal</label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(calcSubtotal(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                      <span class="form-hint">Cantidad  × Valor Unitario </span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Descuento (%)</label>
                      <div class="input-percent">
                        <span class="input-percent-prefix">%</span>
                        <input v-model.number="svc.discount" type="number" class="form-input-sm" placeholder="0" min="0" max="100" />
                      </div>
                      <span class="form-hint">-{{ formatCurrency(calcSubtotal(svc) * svc.discount / 100) }}</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Subtotal con Descuento</label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(calcSubtotalWithDiscount(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">
                        <input type="checkbox" v-model="svc.applyIva" class="iva-checkbox" />
                        IVA
                      </label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="svc.applyIva ? formatCurrencyValue(calcIVA(svc)) : '0'" type="text" class="form-input-sm" readonly />
                      </div>
                      <span class="form-hint">IVA 19%</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Total</label>
                      <div class="input-currency input-total">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(calcTotal(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cost-toggle cost-toggle-provider" @click="svc._showProvider = !svc._showProvider">
                  <span class="cost-toggle-title">Costo Proveedor</span>
                  <span class="cost-toggle-value">{{ formatCurrency(calcProviderTotal(svc)) }}</span>
                  <svg :class="['cost-toggle-arrow', { open: svc._showProvider }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div v-if="svc._showProvider" class="cost-fields">
                  <div class="cost-fields-grid">
                    <div class="form-group">
                      <label class="form-label">Rol</label>
                      <input v-model="svc.providerRole" type="text" class="form-input-sm" placeholder="Ej: Gerente de Proyecto" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Colaborador</label>
                      <input :value="svc.collaborator || ''" type="text" class="form-input-sm" placeholder="Sin colaborador" disabled style="opacity: 0.7; cursor: not-allowed;" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Nº Cuenta de Cobro</label>
                      <input v-model="svc.providerBillingAccount" type="text" class="form-input-sm" placeholder="Ej: CC-001" />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">Valor Unitario</label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(svc.providerUnitPrice)" @input="onCurrencyInput($event, svc, 'providerUnitPrice')" type="text" class="form-input-sm" placeholder="0" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Total Proveedor</label>
                      <div class="input-currency input-total">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(calcProviderTotal(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                      <span class="form-hint">{{ svc.quantity }} × {{ formatCurrencyValue(svc.providerUnitPrice || 0) }}</span>
                    </div>
                  </div>
                </div>
                <div class="cost-toggle cost-toggle-taxes" @click="svc._showTaxes = !svc._showTaxes">
                  <span class="cost-toggle-title">Impuestos</span>
                  <svg :class="['cost-toggle-arrow', { open: svc._showTaxes }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div v-if="svc._showTaxes" class="cost-fields">
                  <div class="cost-fields-grid cost-fields-3">
                    <div class="form-group">
                      <label class="form-label">Ganancia antes de impuestos</label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(calcPretaxProfit(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                      <span class="form-hint">Sub. Descuento - Total Proveedor</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">ICA</label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(calcICA(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                      <span class="form-hint">Sub. Descuento × 1.15%</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Impuesto Simple</label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(calcSimpleTax(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                      <span class="form-hint">Sub. Descuento × 7.3%</span>
                    </div>
                  </div>
                </div>
                <div class="cost-toggle cost-toggle-utilities" @click="svc._showUtilities = !svc._showUtilities">
                  <span class="cost-toggle-title">Utilidades</span>
                  <span class="cost-toggle-value cost-toggle-value-green">{{ formatCurrency(calcNetProfit(svc)) }}</span>
                  <svg :class="['cost-toggle-arrow', { open: svc._showUtilities }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div v-if="svc._showUtilities" class="cost-fields">
                  <div class="cost-fields-grid cost-fields-3">
                    <div class="form-group">
                      <label class="form-label">Ganancia Neta</label>
                      <div class="input-currency">
                        <span class="input-currency-prefix">$</span>
                        <input :value="formatCurrencyValue(calcNetProfit(svc))" type="text" class="form-input-sm" readonly />
                      </div>
                      <span class="form-hint">antes de imp. - (ICA + Imp. Simple)</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Fecha de Ingreso (pago)</label>
                      <input v-model="svc.entryDate" type="date" class="form-input-sm" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Fecha de Facturación</label>
                      <input v-model="svc.billingDate" type="date" class="form-input-sm" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Fecha de Orden de Compra</label>
                      <input v-model="svc.purchaseOrderDate" type="date" class="form-input-sm" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Consec. Orden de Compra</label>
                      <input v-model="svc.purchaseOrderNumber" type="text" class="form-input-sm" placeholder="Ej: OC-001" />
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>



        </div>

        <div class="modal-footer">
          <button class="btn-outline" @click="closeCreateModal">Cancelar</button>
          <button class="btn-primary" :disabled="creating" @click="handleCreate">
            <span v-if="creating" class="spinner-sm"></span>
            {{ creating ? (editingProject ? 'Actualizando...' : 'Creando...') : (editingProject ? 'Actualizar' : 'Crear Proyecto') }}
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
        <h3>¿Eliminar proyecto?</h3>
        <p>¿Deseas eliminar el proyecto <strong>{{ projectToDelete?.code }}</strong>? Esta acción no se puede deshacer.</p>
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
import { useCRM } from '@/composables/useCRM'
import { projectService } from '@/services/api/projectService'
import type { ServicioProyecto } from '@/types/crmTypes'

const props = defineProps<{ inline?: boolean; clientId?: number }>()
defineEmits<{ viewProject: [id: number] }>()

const { clientes, proyectos, loading, fetchProyectos, fetchClientes, deleteProyecto } = useCRM()

const searchTerm = ref('')

const uniqueClientes = computed(() => {
  const seen = new Map<string, typeof clientes.value[0]>()
  for (const c of clientes.value) {
    const key = c.razonSocial.toLowerCase().trim()
    if (!seen.has(key)) seen.set(key, c)
  }
  return Array.from(seen.values()).sort((a, b) => a.razonSocial.localeCompare(b.razonSocial))
})

const uniqueProjectClients = computed(() => {
  const names = proyectos.value.map(p => p.client?.name).filter(Boolean) as string[]
  return [...new Set(names)].sort()
})

const uniqueOffers = computed(() => {
  const offers = proyectos.value.map(p => p.offer).filter(Boolean) as string[]
  return [...new Set(offers)].sort()
})
const activeFilter = ref('todos')
const selectedClient = ref('')
const selectedOffer = ref('')

const frontPage = ref(1)
const frontPageSize = 20

const showCreateModal = ref(false)
const creating = ref(false)
const createError = ref('')
const submitted = ref(false)

const showDeleteModal = ref(false)
const projectToDelete = ref<typeof proyectos.value[0] | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const editingProject = ref<typeof proyectos.value[0] | null>(null)

const form = reactive({
  clientId: '' as string | number,
  clientCodeId: '' as string | number,
  projectType: '',
  serviceType: '',
  norm: '',
  status: 'cotizacion',
  responsible: '',
  startDate: '',
  endDate: '',
  offer: '',
  totalCost: 0,
  description: '',
  observations: '',
  services: [] as ServicioProyecto[],
})

watch(() => form.clientId, () => {
  form.clientCodeId = ''
})

const usedOffers = computed(() => {
  const editingOffer = editingProject.value?.offer
  return new Set(proyectos.value.map(p => p.offer).filter(o => o && o !== editingOffer))
})

const availableOffers = computed(() => {
  const current = editingProject.value?.offer
  const offers: string[] = []
  if (current) offers.push(current)
  for (let i = 1; i <= 500; i++) {
    const code = `OE-${String(i).padStart(4, '0')}`
    if (!usedOffers.value.has(code) && code !== current) {
      offers.push(code)
    }
  }
  return offers
})

const summarySubtotal = computed(() => {
  return form.services.reduce((sum, svc) => sum + calcSubtotal(svc), 0)
})

const summaryDiscount = computed(() => {
  return form.services.reduce((sum, svc) => sum + (calcSubtotal(svc) * svc.discount / 100), 0)
})

const summarySubtotalWithDiscount = computed(() => {
  return form.services.reduce((sum, svc) => sum + calcSubtotalWithDiscount(svc), 0)
})

const summaryIVA = computed(() => {
  return form.services.reduce((sum, svc) => sum + (svc.applyIva ? calcIVA(svc) : 0), 0)
})

const summaryTotal = computed(() => {
  return form.services.reduce((sum, svc) => sum + calcTotal(svc), 0)
})

const serviceTypes = [
  'Asesoría Híbrida',
  'Asesoría Presencial',
  'Asesoría Virtual',
  'Auditoria interna - Exp técnico Calibraciones Etapa 1',
  'Auditoria interna - Exp técnico Calibraciones Etapa 2',
  'Auditoria interna - Exp técnico Eléctrico Etapa 1',
  'Auditoria interna - Exp técnico Eléctrico Etapa 2',
  'Auditoria interna - Exp técnico Fisicoquímico Etapa 1',
  'Auditoria interna - Exp técnico Fisicoquímico Etapa 2',
  'Auditoria interna - Exp técnico Microbiológico Etapa 1',
  'Auditoria interna - Exp técnico Microbiológico Etapa 2',
  'Auditoria interna - Exp técnico',
  'Auditoria interna - Líder Etapa 1',
  'Auditoria interna - Líder Etapa 2',
  'Auditoria interna presencial',
  'Búsqueda de personal',
  'Búsqueda y Selección de personal',
  'Capacitación presencial',
  'Capacitación Virtual',
  'Cierre de correcciones y acciones correctivas',
  'Crecimiento personal',
  'Diagnóstico Inicial',
  'Director de Calidad',
  'Director Técnico Freelance',
  'Diplomado',
  'Elaboración de informe',
  'Gestión ensayos de aptitud',
  'Implementación',
  'Implementación - Fase 1',
  'Implementación - Fase 2',
  'Incertidumbres de la medición',
  'Mantenimiento',
  'Matriz Informes',
  'Outsourcing Calidad',
  'Outsourcing In house',
  'Outsourcing SST',
  'Paquete Capacitaciones',
  'Pasantía',
  'Revisión documental Experto técnico',
  'Revisión documental y preparación de Auditoria Líder',
  'Revisión Plan de correciones y acciones correctivas',
  'Servicio al cliente',
  'Verificaciones de métodos',
  'Viáticos',
  'Ventas y negociación',
]

const normasList = [
  'ANAB',
  'ASEGURAMIENTO METROLOGICO',
  'BPM',
  'CRECIMIENTO PERSONAL',
  'DECRETO SST',
  'HABILIDADES BLANDAS',
  'HACCP',
  'ISO 14001:2015',
  'ISO 22000:2018',
  'ISO 27001:2022',
  'ISO 37001:2016',
  'ISO 45001:2018',
  'ISO 9001:2015',
  'ISO IEC 17020:2012',
  'ISO IEC 17021:2015',
  'ISO IEC 17024:2012',
  'ISO IEC 17025:2017',
  'ISO IEC 17043:2023',
  'ISO IEC 17065.2012',
  'PRESIÓN',
  'RETIE',
  'RETIE Y RETILAP',
  'RETILAP',
  'RITEL',
  'RTE',
  'RUC',
  'SERVICIO AL CLIENTE',
  'SG- SST',
  'SGA',
  'SGA - SST - Decreto',
  'TEMPERATURA',
  'TIC',
  'TRINORMA',
  'TRANSVERSAL',
  'VENTAS Y NEGOCIACIÓN',
  'VERIFICACIÓN MÉTODOS',
]

const statusFilters = [
  { label: 'Todos', value: 'todos', match: '' },
  { label: 'En Ejecucion', value: 'En Ejecucion', match: 'ejecucion' },
  { label: 'Finalizados', value: 'Finalizado', match: 'finalizado' },
  { label: 'Cotizacion', value: 'Cotizacion', match: 'cotizacion' },
  { label: 'Aprobados', value: 'Aprobado', match: 'aprobado' },
  { label: 'Suspendidos', value: 'Suspendido', match: 'suspendido' },
]

const selectedClientCode = computed(() => {
  if (!form.clientId) return ''
  const client = clientes.value.find(c => c.id === form.clientId)
  if (!client) return ''
  return client.codigo || ''
})

const selectedClientNit = computed(() => {
  if (!form.clientId) return ''
  const client = clientes.value.find(c => c.id === form.clientId)
  if (!client) return ''
  return client.nit || ''
})

const clientCodes = computed(() => {
  if (!form.clientId) return []
  const client = clientes.value.find(c => c.id === form.clientId)
  if (!client) return []
  return clientes.value.filter(c => c.nit === client.nit)
})

const filteredProjects = computed(() => {
  let result = [...proyectos.value]

  if (props.clientId) {
    result = result.filter((p) => p.clientId === props.clientId)
  }

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(
      (p) =>
        (p.code && p.code.toLowerCase().includes(term)) ||
        (p.client?.name && p.client.name.toLowerCase().includes(term)) ||
        (p.client?.code && p.client.code.toLowerCase().includes(term)) ||
        (p.responsible && p.responsible.toLowerCase().includes(term)) ||
        (p.offer && p.offer.toLowerCase().includes(term)) ||
        (p.status && p.status.toLowerCase().includes(term)) ||
        (p.projectType && p.projectType.toLowerCase().includes(term)) ||
        (p.serviceType && p.serviceType.toLowerCase().includes(term)),
    )
  }

  if (activeFilter.value !== 'todos') {
    result = result.filter((p) => p.status && p.status.toLowerCase() === activeFilter.value.toLowerCase())
  }

  if (selectedClient.value) {
    result = result.filter((p) => p.client?.name === selectedClient.value)
  }

  if (selectedOffer.value) {
    result = result.filter((p) => p.offer === selectedOffer.value)
  }

  result.sort((a, b) => (b.offer || '').localeCompare(a.offer || ''))

  return result
})

const totalItems = computed(() => filteredProjects.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / frontPageSize))

const paginatedProjects = computed(() => {
  const start = (frontPage.value - 1) * frontPageSize
  return filteredProjects.value.slice(start, start + frontPageSize)
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

watch([searchTerm, activeFilter, selectedClient, selectedOffer], () => {
  frontPage.value = 1
})

watch(showCreateModal, (open) => {
  if (open) {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCreateModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }
})

function openCreateModal() {
  editingProject.value = null
  submitted.value = false
  form.clientId = ''
  form.clientCodeId = ''
  form.projectType = ''
  form.serviceType = ''
  form.norm = ''
  form.status = ''
  form.responsible = ''
  form.startDate = ''
  form.endDate = ''
  form.offer = ''
  form.totalCost = 0
  form.description = ''
  form.observations = ''
  form.services = []
  createError.value = ''
  showCreateModal.value = true
}

function normalizeStatus(status: string): string {
  if (!status) return ''
  const s = status.toLowerCase().trim()
  if (s.includes('cotizacion') || s.includes('cotización')) return 'Cotizacion'
  if (s.includes('aprobado')) return 'Aprobado'
  if (s.includes('ejecucion') || s.includes('ejecución')) return 'En Ejecucion'
  if (s.includes('finalizado') || s.includes('completado')) return 'Finalizado'
  if (s.includes('suspendido') || s.includes('pausado')) return 'Suspendido'
  return status
}

function openEditModal(p: typeof proyectos.value[0]) {
  editingProject.value = p
  submitted.value = false
  form.clientId = p.clientId
  form.clientCodeId = ''
  form.projectType = p.projectType || ''
  form.serviceType = p.serviceType || ''
  form.norm = p.norm || ''
  form.status = normalizeStatus(p.status)
  form.responsible = p.responsible || ''
  form.startDate = p.startDate ? p.startDate.split('T')[0] : ''
  form.endDate = p.endDate ? p.endDate.split('T')[0] : ''
  form.offer = p.offer || ''
  form.totalCost = p.totalCost || 0
  form.description = p.description || ''
  form.observations = p.observations || ''
  form.services = (p.services || []).map(s => ({ ...s, applyIva: s.applyIva !== false, _collapsed: false, _showCost: false, _showProvider: false, _showTaxes: false, _showUtilities: false }))
  createError.value = ''
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
  editingProject.value = null
  createError.value = ''
  submitted.value = false
}

function confirmDelete(project: typeof proyectos.value[0]) {
  projectToDelete.value = project
  deleteError.value = null
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!projectToDelete.value) return
  deleting.value = true
  deleteError.value = null
  const success = await deleteProyecto(projectToDelete.value.id)
  deleting.value = false
  if (success) {
    showDeleteModal.value = false
    projectToDelete.value = null
  } else {
    deleteError.value = 'No se pudo eliminar el proyecto. Puede tener seguimientos o datos asociados.'
  }
}

function addService() {
  const normValue = form.norm
  form.services.push({
    name: '',
    customName: '',
    norm: normValue,
    customNorm: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    subtotal: 0,
    subtotalWithDiscount: 0,
    iva: 0,
    totalPrice: 0,
    collaborator: '',
    applyIva: true,
    providerRole: '',
    providerCollaborator: '',
    providerBillingAccount: '',
    providerUnitPrice: 0,
    providerTotalPrice: 0,
    entryDate: '',
    billingDate: '',
    purchaseOrderDate: '',
    purchaseOrderNumber: '',
    _showCost: false,
    _showProvider: false,
    _showTaxes: false,
    _showUtilities: false,
    _collapsed: false,
  })
}

function removeService(index: number) {
  form.services.splice(index, 1)
}

function calcSubtotal(svc: { quantity: number; unitPrice: number }): number {
  return svc.quantity * svc.unitPrice
}

function calcSubtotalWithDiscount(svc: { quantity: number; unitPrice: number; discount: number }): number {
  const subtotal = svc.quantity * svc.unitPrice
  return subtotal - (subtotal * svc.discount / 100)
}

function calcIVA(svc: { quantity: number; unitPrice: number; discount: number }): number {
  const subtotalWithDiscount = calcSubtotalWithDiscount(svc)
  return subtotalWithDiscount * 0.19
}

function calcTotal(svc: { quantity: number; unitPrice: number; discount: number; applyIva?: boolean }): number {
  const subtotalWithDiscount = calcSubtotalWithDiscount(svc)
  const iva = svc.applyIva ? subtotalWithDiscount * 0.19 : 0
  return subtotalWithDiscount + iva
}

function calcProviderTotal(svc: { quantity: number; providerUnitPrice?: number }): number {
  return svc.quantity * (svc.providerUnitPrice || 0)
}

function calcPretaxProfit(svc: { quantity: number; unitPrice: number; discount: number; providerUnitPrice?: number }): number {
  return calcSubtotalWithDiscount(svc) - calcProviderTotal(svc)
}

function calcICA(svc: { quantity: number; unitPrice: number; discount: number }): number {
  return calcSubtotalWithDiscount(svc) * 0.0115
}

function calcSimpleTax(svc: { quantity: number; unitPrice: number; discount: number }): number {
  return calcSubtotalWithDiscount(svc) * 0.073
}

function calcTaxesTotal(svc: { quantity: number; unitPrice: number; discount: number }): number {
  return calcPretaxProfit(svc) + calcICA(svc) + calcSimpleTax(svc)
}

function calcNetProfit(svc: { quantity: number; unitPrice: number; discount: number }): number {
  return calcPretaxProfit(svc) - (calcICA(svc) + calcSimpleTax(svc))
}

const totalNetProfit = computed(() => {
  return form.services.reduce((sum, svc) => sum + calcNetProfit(svc), 0)
})

function calcProjectProfit(p: typeof proyectos.value[0]): number {
  if (!p.services || p.services.length === 0) return 0
  return p.services.reduce((sum, svc) => sum + calcNetProfit(svc), 0)
}

function getServiceLabel(svc: ServicioProyecto): string {
  const name = svc.name === '__custom__' ? svc.customName : svc.name
  return name || ''
}

function getStatusClass(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('ejecucion')) return 'status-active'
  if (s.includes('finalizado')) return 'status-completed'
  if (s.includes('cotizacion')) return 'status-quote'
  if (s.includes('aprobado')) return 'status-approved'
  if (s.includes('suspendido')) return 'status-suspended'
  if (s.includes('prospect')) return 'status-prospect'
  return 'status-default'
}

function formatCurrency(value: number | undefined): string {
  if (!value) return '-'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

function formatCurrencyValue(value: number | undefined | null): string {
  if (!value && value !== 0) return '0'
  return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

function onCurrencyInput(event: Event, svc: ServicioProyecto, field: 'unitPrice' | 'discount' | 'providerUnitPrice' | 'netProfit') {
  const raw = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  ;(svc as any)[field] = Number(raw) || 0
}

async function handleCreate() {
  submitted.value = true

  if (!form.clientId) return
  if (!form.norm.trim()) return
  if (!form.status) return
  if (!form.offer) return
  if (!form.serviceType.trim()) return
  if (!form.responsible.trim()) return
  if (!form.startDate) return

  creating.value = true
  try {
    const services = form.services
      .filter(s => (s.name === '__custom__' ? (s.customName ?? '') : (s.name ?? '')).trim())
      .map(s => {
        const providerTotal = s.quantity * (s.providerUnitPrice || 0)
        return {
          name: s.name === '__custom__' ? (s.customName ?? '').trim() : (s.name ?? '').trim(),
          norm: s.norm === '__custom__' ? (s.customNorm ?? '').trim() : (s.norm || form.norm || ''),
          quantity: s.quantity,
          unitPrice: s.unitPrice,
          discount: s.discount,
          subtotal: calcSubtotal(s),
          subtotalWithDiscount: calcSubtotalWithDiscount(s),
          iva: calcIVA(s),
          totalPrice: calcTotal(s),
          collaborator: s.collaborator,
          applyIva: s.applyIva !== false,
          providerRole: s.providerRole || '',
          providerCollaborator: s.collaborator || '',
          providerBillingAccount: s.providerBillingAccount || '',
          providerUnitPrice: s.providerUnitPrice || 0,
          providerTotalPrice: providerTotal,
          pretaxProfit: calcPretaxProfit(s),
          ica: s.ica || 0,
          simpleTax: s.simpleTax || 0,
          entryDate: s.entryDate || '',
          billingDate: s.billingDate || '',
          purchaseOrderDate: s.purchaseOrderDate || '',
          purchaseOrderNumber: s.purchaseOrderNumber || '',
        }
      })

    const totalCost = services.reduce((sum, s) => sum + s.totalPrice, 0)

    const payload = {
      clientId: Number(form.clientId),
      projectType: form.projectType.trim() || 'General',
      serviceType: form.serviceType.trim() || undefined,
      norm: form.norm.trim(),
      status: form.status,
      responsible: form.responsible.trim(),
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      offer: form.offer.trim() || undefined,
      totalCost: totalCost || form.totalCost || undefined,
      description: form.description.trim(),
      observations: form.observations.trim() || undefined,
      services: services.length > 0 ? services : undefined,
    }

    if (editingProject.value) {
      await projectService.update(editingProject.value.id, payload)
    } else {
      await projectService.create(payload)
    }

    closeCreateModal()
    await fetchProyectos({ limit: 9999 })
  } catch (e) {
    createError.value = e instanceof Error ? e.message : (editingProject.value ? 'Error al actualizar el proyecto' : 'Error al crear el proyecto')
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  fetchProyectos({ limit: 9999 })
  fetchClientes({ page: 1, limit: 9999 })
})
</script>

<style scoped>
.projects-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }

.summary-cards { display: flex; gap: 10px; }
.summary-card { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--c-white); border: 1px solid var(--c-border); border-radius: 10px; }
.summary-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; }
.summary-icon.ejecucion { background: #FEF3C7; color: #D97706; }
.summary-icon.finalizados { background: #DCFCE7; color: #16A34A; }
.summary-icon.cotizacion { background: #DBEAFE; color: #2563EB; }
.summary-icon.aprobados { background: #D1FAE5; color: #065F46; }
.summary-icon.suspendidos { background: #FEE2E2; color: #DC2626; }
.summary-info { display: flex; flex-direction: column; }
.summary-count { font-size: 1.1rem; font-weight: 700; color: var(--c-black); line-height: 1; }
.summary-label { font-size: 0.68rem; color: var(--c-gray); margin-top: 2px; white-space: nowrap; }

.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; background: var(--c-primary); color: white; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 600; text-decoration: none; cursor: pointer; transition: background 0.2s; margin-left: auto; white-space: nowrap; }
.btn-primary:hover { background: var(--c-primary-hover); }

.filters-bar { display: flex; flex-direction: column; gap: 10px; }
.search-box { position: relative; max-width: 400px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: var(--c-primary); }
.search-input::placeholder { color: var(--c-gray-light); }
.filter-group { display: flex; gap: 8px; align-items: flex-end; justify-content: flex-start; }
.form-select { padding: 9px 28px 9px 12px; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.82rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; cursor: pointer; appearance: auto; width: 160px; }
.form-select:focus { border-color: var(--c-primary); }

.table-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: 14px; overflow: hidden; }
.table-responsive { overflow-x: auto; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 12px 14px; text-align: left; font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 14px; font-size: 0.85rem; color: var(--c-black); vertical-align: middle; }
.data-table tr { border-bottom: 1px solid var(--c-border); }
.data-table tr:last-child { border-bottom: none; }
.data-table tr:hover td { background: rgba(249, 250, 251, 0.5); }

.client-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: normal;
  word-break: break-word;
}

.client-name {
  font-weight: 600;
  color: var(--c-black);
}

.client-code {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--c-primary);
}

.client-type {
  font-size: 0.78rem;
  color: var(--c-gray);
}

.oferta-text {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: var(--c-gray);
  min-width: 100px;
  display: inline-block;
  white-space: nowrap;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-active { background: #FEF3C7; color: #92400E; }
.status-completed { background: #D1FAE5; color: #065F46; }
.status-quote { background: #DBEAFE; color: #1E40AF; }
.status-approved { background: #D1FAE5; color: #065F46; }
.status-suspended { background: #FEE2E2; color: #991B1B; }
.status-prospect { background: #F3F4F6; color: #374151; }
.status-default { background: #F3F4F6; color: #374151; }

.costo-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-black);
  white-space: nowrap;
}

.utilidad-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #15803d;
  white-space: nowrap;
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

@media (max-width: 768px) { .page-header { flex-direction: column; align-items: flex-start; } .filters-bar { flex-direction: column; align-items: stretch; } .search-box { min-width: 100%; } .filter-chips { overflow-x: auto; flex-wrap: nowrap; } .pagination-bar { flex-direction: column; gap: 12px; } }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--c-white);
  border-radius: 14px;
  width: 95%;
  max-height: 95vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.modal-lg { max-width: 1400px; }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
}
.modal-header h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); }
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
  transition: all 0.15s;
}
.modal-close:hover { background: var(--c-light); color: var(--c-black); }

.modal-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 24px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 16px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.form-grid-modal {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
}
.form-group { display: flex; flex-direction: column; gap: 6px; padding: 0; min-width: 0; }
.form-group.full-width { grid-column: 1 / -1; }

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
  display: flex;
  align-items: center;
  gap: 6px;
}
.iva-checkbox {
  width: 15px;
  height: 15px;
  accent-color: var(--c-primary);
  cursor: pointer;
}
.form-label.required::after { content: ' *'; color: #dc2626; }
.field-error { border-color: #dc2626 !important; box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.15) !important; }
.form-hint { font-size: 0.6rem; color: var(--c-gray); margin-top: -5px; margin-bottom: 3px; display: block; }

.form-input {
  padding: 10px 14px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: inherit;
  color: var(--c-black);
  background: var(--c-white);
  outline: none;
  transition: all 0.2s;
}
.form-input:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.08); }
.form-input::placeholder { color: var(--c-gray-light); }

select.form-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.form-textarea { resize: vertical; min-height: 60px; }

/* ===== COST SUMMARY ===== */
.cost-summary {
  margin-top: 20px;
  padding: 16px 20px;
  background: #f9fafb;
  border: 1px solid var(--c-border);
  border-radius: 10px;
}
.cost-summary h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 12px;
}
.cost-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--c-border);
}
.cost-item:last-child { border-bottom: none; }
.cost-item.total {
  border-top: 2px solid var(--c-primary);
  margin-top: 4px;
  padding-top: 10px;
  font-weight: 700;
}
.cost-label { font-size: 0.85rem; color: var(--c-gray); }
.cost-value { font-size: 0.88rem; color: var(--c-black); font-weight: 600; }
.cost-item.total .cost-label { color: var(--c-black); font-weight: 700; }
.cost-item.total .cost-value { color: var(--c-primary); font-size: 1rem; }

/* ===== COST TOGGLE (per service) ===== */
.cost-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #fafafa;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.cost-toggle:hover { background: #f0f0f0; }
.cost-toggle-title { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
.cost-toggle-value { margin-left: auto; font-size: 0.85rem; font-weight: 700; color: var(--c-primary); }
.cost-toggle-arrow { transition: transform 0.2s; color: var(--c-gray); }
.cost-toggle-arrow.open { transform: rotate(180deg); }
.cost-toggle-provider { border-color: #d1d5db; background: #f3f4f6; }
.cost-toggle-taxes { border-color: #d1d5db; background: #f9fafb; }
.cost-toggle-utilities { border-color: #86efac; background: #dcfce7; }
.cost-toggle-value-green { color: #15803d !important; font-weight: 700; }
.input-currency.input-total-green { border: 2px solid #86efac; background: #f0fdf4; }
.service-profit { color: #15803d; font-weight: 700; font-size: 13px; }
.cost-fields-3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 700px) { .cost-fields-3 { grid-template-columns: 1fr; } }
.cost-fields { margin-top: 10px; padding: 12px; background: #fafafa; border: 1px solid var(--c-border); border-radius: 8px; }
.cost-fields-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
@media (max-width: 1100px) { .cost-fields-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px) { .cost-fields-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .cost-fields-grid { grid-template-columns: 1fr; } }

/* ===== SERVICES ===== */
.services-section { margin-top: 20px; border-top: 1px solid var(--c-border); padding-top: 20px; }
.services-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.services-header h4 { font-size: 0.88rem; font-weight: 700; color: var(--c-black); margin-bottom: 2px; }
.services-subtitle { font-size: 0.78rem; color: var(--c-gray); margin: 0; }

.btn-add-service {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border: 1px solid var(--c-primary);
  border-radius: 8px;
  background: var(--c-primary);
  color: var(--c-white);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-add-service:hover { opacity: 0.85; }

.empty-services {
  text-align: center;
  padding: 20px;
  color: var(--c-gray);
  font-size: 0.85rem;
}

.services-list { display: flex; flex-direction: column; gap: 12px; }

.service-card {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 14px;
  background: var(--c-light);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.service-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.service-num {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--c-primary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: none;
  color: var(--c-gray);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.remove-btn:hover { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

.services-grid {
  display: grid;
  grid-template-columns: 2.2fr 1.5fr 1.6fr 0.65fr;
  gap: 16px;
  align-items: start;
  width: 100%;
  box-sizing: border-box;
}
.services-grid > .form-group { min-width: 0; width: 100%; }
.services-grid > .form-group:last-child { text-align: center; }
.services-grid > .form-group:last-child { text-align: center; }
.services-grid > .form-group:last-child .form-label { text-align: left; }
.services-grid > .form-group:last-child .form-input-sm { text-align: center; }
.services-grid .form-input-sm { width: 100%; min-width: 0; box-sizing: border-box; }

.input-currency {
  display: flex;
  align-items: center;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-white);
  overflow: hidden;
}
.input-currency-prefix {
  padding: 8px 6px 8px 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-gray);
  background: #f5f5f5;
  border-right: 1px solid var(--c-border);
  user-select: none;
}
.input-currency .form-input-sm {
  border: none;
  border-radius: 0;
  background: transparent;
}

@media (max-width: 900px) {
  .services-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 520px) {
  .services-grid { grid-template-columns: 1fr; }
}

.form-input-sm {
  padding: 8px 5px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  font-size: 0.82rem;
  font-family: inherit;
  color: var(--c-black);
  background: var(--c-white);
  outline: none;
  transition: border-color 0.15s;
}
.form-input-sm:focus { border-color: var(--c-primary); }
.form-input-sm::placeholder { color: var(--c-gray-light); }

.input-percent {
  display: flex;
  align-items: center;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-white);
  overflow: hidden;
}
.input-percent-prefix {
  padding: 8px 6px 8px 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-gray);
  background: #f5f5f5;
  border-right: 1px solid var(--c-border);
  user-select: none;
}
.input-percent .form-input-sm {
  border: none !important;
  border-radius: 0 !important;
  background: transparent;
}

.input-total {
  background: #fef9e7;
  border-color: var(--c-primary);
}
.input-total .input-currency-prefix {
  background: #fdf3d7;
  border-right-color: var(--c-primary);
}
.input-total .form-input-sm {
  font-weight: 700;
  color: var(--c-primary);
}

/* ===== MODAL FOOTER ===== */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--c-border);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: var(--c-white);
  color: var(--c-black);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-outline:hover { border-color: var(--c-gray-light); }

.spinner-sm {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.action-btn.delete:hover { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

.modal-card {
  background: var(--c-white);
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.modal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  margin-bottom: 16px;
}

.modal-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 8px;
}

.modal-card p {
  font-size: 0.9rem;
  color: var(--c-gray);
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #dc2626;
  color: var(--c-white);
  border: none;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

.delete-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.85rem;
  margin-bottom: 16px;
}
</style>
