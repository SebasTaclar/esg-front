<template>
  <div class="client-detail" v-if="cliente">
    <!-- Back & Header -->
    <div class="detail-header">
      <div class="header-left">
        <router-link to="/admin/crm/clientes" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Clientes
        </router-link>
        <div class="client-title">
          <div class="client-avatar" :class="getAvatarClass()">
            {{ getInitials(cliente.razonSocial) }}
          </div>
          <div>
            <h1>{{ cliente.razonSocial }}</h1>
            <span class="client-meta">
              <span class="status-badge" :class="getStatusClass()">{{ getStatusLabel() }}</span>
              · {{ cliente.nit }}
            </span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link :to="`/admin/crm/clientes/${cliente.id}/editar`" class="btn-outline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </router-link>
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
        <span class="tab-icon" v-html="tab.icon"></span>
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- INFO GENERAL -->
      <div v-if="activeTab === 'info'" class="tab-panel">
        <div class="info-grid">
          <div class="info-card">
            <h3>Datos de la Empresa</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Razón Social</span>
                <span class="info-value">{{ cliente.razonSocial }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">NIT</span>
                <span class="info-value mono">{{ cliente.nit }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Código</span>
                <span class="info-value mono">{{ cliente.codigo || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tipo de organización</span>
                <span class="info-value">{{ cliente.tipoOrganizacion || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Norma</span>
                <span class="info-value">{{ cliente.norma || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estado</span>
                <span class="info-value">
                  <span class="status-badge" :class="getStatusClass()">
                    {{ getStatusLabel() }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Información de Contacto</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Dirección</span>
                <span class="info-value">{{ cliente.direccion || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Ciudad</span>
                <span class="info-value">{{ cliente.ciudad || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Departamento</span>
                <span class="info-value">{{ cliente.departamento || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Teléfono</span>
                <span class="info-value">{{ cliente.telefono || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Correo</span>
                <span class="info-value">{{ cliente.correo || '-' }}</span>
              </div>
              <div class="info-row" v-if="contactos.length > 0">
                <span class="info-label">Contacto Principal</span>
                <span class="info-value">{{ contactos.find(c => c.esPrincipal)?.nombre || contactos[0]?.nombre || '-' }}</span>
              </div>
              <div class="info-row" v-if="cliente.paginaWeb">
                <span class="info-label">Página Web</span>
                <span class="info-value link">
                  <a :href="cliente.paginaWeb" target="_blank" rel="noopener">{{ cliente.paginaWeb }}</a>
                </span>
              </div>
            </div>
          </div>

          <div class="info-card full-width" v-if="cliente.observaciones">
            <h3>Observaciones</h3>
            <p class="observaciones">{{ cliente.observaciones }}</p>
          </div>

          <div class="info-card full-width">
            <h3>Contacto Principal</h3>
            <div v-if="contactos.length > 0" class="contacts-inline">
              <div v-for="(contacto, index) in contactos.filter(c => c.esPrincipal)" :key="index" class="contact-inline-card">
                <div class="contact-inline-header">
                  <span class="contact-inline-name">{{ contacto.nombre }}</span>
                  <span v-if="contacto.esPrincipal" class="principal-badge">Principal</span>
                </div>
                <div class="contact-inline-details">
                  <span v-if="contacto.cargo" class="contact-inline-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {{ contacto.cargo }}
                  </span>
                  <span v-if="contacto.celular" class="contact-inline-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {{ contacto.celular }}
                  </span>
                  <span v-if="contacto.correo" class="contact-inline-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {{ contacto.correo }}
                  </span>
                </div>
              </div>
            </div>
            <p v-else class="no-contacts">No hay contactos registrados.</p>
          </div>

          <div class="info-card full-width">
            <h3>Resumen</h3>
            <div class="summary-stats">
              <div class="summary-stat">
                <span class="summary-value">{{ contactos.length }}</span>
                <span class="summary-label">Contactos</span>
              </div>
              <div class="summary-stat">
                <span class="summary-value">{{ proyectos.length }}</span>
                <span class="summary-label">Proyectos</span>
              </div>
              <div class="summary-stat">
                <span class="summary-value">{{ formatRelativeDate(cliente.createdAt) }}</span>
                <span class="summary-label">Cliente desde</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTACTOS -->
      <div v-if="activeTab === 'contactos'" class="tab-panel">
        <div class="section-header">
          <h3>Contactos ({{ contactos.length }})</h3>
        </div>
        <div v-if="contactos.length > 0" class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Principal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(contacto, index) in contactos" :key="index">
                <td class="contact-name">{{ contacto.nombre }}</td>
                <td>{{ contacto.cargo || '-' }}</td>
                <td class="mono">{{ contacto.celular || '-' }}</td>
                <td>{{ contacto.correo || '-' }}</td>
                <td>
                  <span v-if="contacto.esPrincipal" class="principal-badge">Principal</span>
                  <span v-else class="secondary-text">-</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <router-link :to="`/admin/crm/clientes/${cliente.id}/editar?section=contacts`" class="action-btn" title="Editar">
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
        <div v-else class="empty-tab">
          <p>No hay contactos registrados para este cliente.</p>
        </div>
      </div>

      <!-- PROYECTOS -->
      <div v-if="activeTab === 'proyectos'" class="tab-panel">
        <ProjectsList :client-id="cliente.id" />
      </div>

      <!-- RECURSOS -->
      <div v-if="activeTab === 'recursos'" class="tab-panel">
        <div v-if="uploadSuccessMessage" class="success-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {{ uploadSuccessMessage }}
        </div>
        <div class="section-header">
          <h3>Documentación ({{ filteredResources.length }})</h3>
          <button class="btn-upload" @click="openUploadModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Subir documento
          </button>
        </div>

        <div class="filters-bar">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input v-model="resourceSearch" type="text" placeholder="Buscar por nombre..." class="search-input" />
            <button v-if="resourceSearch" class="clear-btn" @click="resourceSearch = ''">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="uploading" class="upload-progress">
          <div class="spinner-small"></div>
          <span>Subiendo archivo...</span>
        </div>

        <div class="table-card">
          <div v-if="filteredResources.length > 0" class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Visible</th>
                  <th>Subido por</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(doc, index) in filteredResources" :key="doc.id || index">
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
                  <td><span class="type-badge" :class="doc.type">{{ formatDocType(doc.type) }}</span></td>
                  <td>
                    <span class="visibility-badge" :class="doc.isVisible !== false ? 'visible' : 'hidden'">
                      {{ doc.isVisible !== false ? 'Sí' : 'No' }}
                    </span>
                  </td>
                  <td>{{ doc.user || currentUser?.name || '-' }}</td>
                  <td>{{ formatDateShort(doc.uploadedAt || doc.createdAt) }}</td>
                  <td>
                    <div class="actions-cell">
                      <a v-if="doc.url" :href="doc.url" target="_blank" class="action-btn" title="Descargar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </a>
                      <button v-if="doc.id" class="action-btn" title="Actualizar" @click="openEditResource(doc)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button v-if="doc.id" class="action-btn delete-btn" title="Eliminar" @click="deleteResource(doc.id, doc.name)">
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
          <div v-else class="empty-tab">
            <p>No hay documentos asociados a este cliente.</p>
          </div>
        </div>
      </div>

      <!-- Upload Modal Recursos -->
      <Teleport to="body">
        <div v-if="showResourceUploadModal" class="modal-overlay" @click.self="showResourceUploadModal = false">
          <div class="modal-content modal-sm" @click.stop>
            <div class="modal-header">
              <h3>Subir Documento</h3>
              <button class="modal-close" @click="showResourceUploadModal = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-grid-modal">
                <div class="form-group">
                  <label>Tipo de documento *</label>
                  <select v-model="resourceUploadForm.type" class="form-input" :class="{ 'field-error': resourceSubmitted && !resourceUploadForm.type }">
                    <option value="">Seleccionar...</option>
                    <option value="documentos_legales">Documentos Legales y Tributarios</option>
                    <option value="comunicaciones">Comunicaciones y Actas</option>
                    <option value="propuesta">Propuesta y Negociación</option>
                    <option value="legalizacion">Legalización / Contrato</option>
                    <option value="otro">Otro</option>
                  </select>
                  <input v-if="resourceUploadForm.type === 'otro'" v-model="resourceUploadForm.customType" type="text" class="form-input" placeholder="Escribe el tipo de documento" style="margin-top: 8px;" :class="{ 'field-error': resourceSubmitted && resourceUploadForm.type === 'otro' && !resourceUploadForm.customType }" />
                </div>
                <div class="form-group">
                  <label>Nombre del archivo</label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="resourceUploadForm.useOriginalName" />
                    Usar nombre original del archivo
                  </label>
                  <input v-if="!resourceUploadForm.useOriginalName" v-model="resourceUploadForm.name" type="text" class="form-input" placeholder="Nombre del documento" />
                  <span v-else class="file-original-name">{{ resourceUploadForm.file?.name || 'Selecciona un archivo primero' }}</span>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label>Archivo *</label>
                  <div class="file-input-wrapper" :class="{ 'field-error': resourceSubmitted && !resourceUploadForm.file, 'has-file': resourceUploadForm.file }">
                    <input type="file" class="file-input" @change="onResourceFileChange" />
                    <div class="file-input-label" v-if="!resourceUploadForm.file">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Seleccionar archivo
                    </div>
                    <div class="file-selected" v-else>
                      <span>{{ resourceUploadForm.file?.name }}</span>
                      <button class="file-remove" @click="resourceUploadForm.file = null">✕</button>
                    </div>
                  </div>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="resourceUploadForm.isVisible" />
                    Visible en Portal del Cliente
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showResourceUploadModal = false">Cancelar</button>
              <button class="btn-save" :disabled="uploading" @click="handleResourceUpload">
                <span v-if="uploading" class="btn-spinner"></span>
                {{ uploading ? 'Subiendo...' : 'Subir Documento' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Delete Confirmation Modal Recursos -->
      <Teleport to="body">
        <div v-if="showResourceDeleteModal" class="modal-overlay" @click.self="showResourceDeleteModal = false">
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
              <p class="delete-text">¿Estás seguro de eliminar <strong>{{ resourceDeleteName }}</strong>? Esta acción no se puede deshacer.</p>
              <div class="delete-actions">
                <button class="btn-cancel" @click="showResourceDeleteModal = false">Cancelar</button>
                <button class="btn-delete" @click="confirmResourceDelete">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Edit Modal Recursos -->
      <Teleport to="body">
        <div v-if="showResourceEditModal" class="modal-overlay" @click.self="showResourceEditModal = false">
          <div class="modal-content modal-sm" @click.stop>
            <div class="modal-header">
              <h3>Actualizar Documento</h3>
              <button class="modal-close" @click="showResourceEditModal = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-grid-modal">
                <div class="form-group">
                  <label>Tipo de documento *</label>
                  <select v-model="resourceEditForm.type" class="form-input">
                    <option value="">Seleccionar...</option>
                    <option value="documentos_legales">Documentos Legales y Tributarios</option>
                    <option value="comunicaciones">Comunicaciones y Actas</option>
                    <option value="propuesta">Propuesta y Negociación</option>
                    <option value="legalizacion">Legalización / Contrato</option>
                    <option value="otro">Otro</option>
                  </select>
                  <input v-if="resourceEditForm.type === 'otro'" v-model="resourceEditForm.customType" type="text" class="form-input" placeholder="Escribe el tipo de documento" style="margin-top: 8px;" />
                </div>
                <div class="form-group">
                  <label>Nombre del archivo</label>
                  <input v-model="resourceEditForm.name" type="text" class="form-input" placeholder="Nombre del documento" />
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="resourceEditForm.isVisible" />
                    Visible en Portal del Cliente
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showResourceEditModal = false">Cancelar</button>
              <button class="btn-save" :disabled="savingResource" @click="handleResourceUpdate">
                <span v-if="savingResource" class="btn-spinner"></span>
                {{ savingResource ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- COTIZACIONES -->
      <div v-if="activeTab === 'cotizaciones'" class="tab-panel">
        <div class="section-header">
          <h3>Cotizaciones ({{ cotizaciones.length }})</h3>
        </div>
        <div v-if="cotizaciones.length > 0" class="quotes-table-wrap">
          <table class="quotes-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Proyecto</th>
                <th>Valor Total</th>
                <th>Estado</th>
                <th>Vigencia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cot in cotizaciones" :key="cot.id">
                <td class="code-cell">{{ cot.code }}</td>
                <td>{{ cot.project ? cot.project.code + ' - ' + cot.project.description : '-' }}</td>
                <td class="amount-cell">{{ formatCurrency(cot.totalAmount) }}</td>
                <td>
                  <span class="status-badge" :class="'status-' + cot.status">{{ getQuoteStatusLabel(cot.status) }}</span>
                </td>
                <td>{{ cot.validUntil ? formatDate(cot.validUntil) : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="cotizaciones.length === 0" class="empty-tab">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3>Cotizaciones</h3>
          <p>No hay cotizaciones registradas para este cliente.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-else-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>Cargando cliente...</p>
  </div>

  <!-- Not Found -->
  <div v-else class="empty-state">
    <h3>Cliente no encontrado</h3>
    <router-link to="/admin/crm/clientes" class="btn-primary">Volver a Clientes</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCRM } from '@/composables/useCRM'
import { authService } from '@/services/api/authService'
import { projectService } from '@/services/api/projectService'
import { quoteService } from '@/services/api/quoteService'
import { documentService } from '@/services/api/documentService'
import { apiClient } from '@/services/api/apiConfig'
import type { Cliente, Contacto, Proyecto, Seguimiento, ClientContact, ClientResource, Cotizacion, EstadoCotizacion, DocumentType } from '@/types/crmTypes'
import ProjectsList from '@/views/crm/ProjectsList.vue'

interface ResourceItem {
  id?: number
  name: string
  url: string
  type: string
  size?: number
  user?: string
  isVisible?: boolean
  uploadedAt?: string
  createdAt?: string
}

const route = useRoute()
const { loading, fetchCliente } = useCRM()

const cliente = ref<Cliente | null>(null)
const contactos = ref<Contacto[]>([])
const proyectos = ref<Proyecto[]>([])
const cotizaciones = ref<Cotizacion[]>([])
const allSeguimientos = ref<Seguimiento[]>([])
const resources = ref<ResourceItem[]>([])
const activeTab = ref('info')
const uploading = ref(false)
const currentUser = authService.getCurrentUser()

const resourceSearch = ref('')
const showResourceUploadModal = ref(false)
const showResourceDeleteModal = ref(false)
const showResourceEditModal = ref(false)
const savingResource = ref(false)
const resourceDeleteId = ref(0)
const resourceDeleteName = ref('')
const resourceSubmitted = ref(false)
const resourceUploadForm = ref({ type: '' as DocumentType | 'otro' | '', name: '', customType: '', useOriginalName: true, isVisible: true, file: null as File | null })
const resourceEditForm = ref({ id: 0, name: '', type: '' as string, customType: '', isVisible: true })
const uploadSuccessMessage = ref('')

const tabs = computed(() => [
  { id: 'info', label: 'Información', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' },
  { id: 'contactos', label: 'Contactos', count: contactos.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { id: 'proyectos', label: 'Proyectos', count: proyectos.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
  { id: 'recursos', label: 'Documentación', count: resources.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' },
  { id: 'cotizaciones', label: 'Cotizaciones', count: cotizaciones.value.length, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
])

function getAvatarClass(): string {
  if (!cliente.value) return ''
  if (cliente.value.isProspect) return 'prospect'
  if (cliente.value.isActive) return 'active'
  return 'inactive'
}

function getStatusClass(): string {
  if (!cliente.value) return ''
  if (cliente.value.isProspect) return 'prospect'
  if (cliente.value.isActive) return 'active'
  return 'inactive'
}

function getStatusLabel(): string {
  if (!cliente.value) return ''
  if (cliente.value.isProspect) return 'Prospecto'
  if (cliente.value.isActive) return 'Cliente'
  return 'Inactivo'
}

async function loadClientData(clienteId: number) {
  cliente.value = await fetchCliente(clienteId)
  if (!cliente.value) return

  contactos.value = (cliente.value.contacts || []).map((c: ClientContact) => ({
    id: c.id || 0,
    clienteId,
    nombre: c.name || '',
    cargo: c.position || '',
    celular: c.phone || '',
    correo: c.email || '',
    esPrincipal: c.isPrimary || false,
    createdAt: new Date().toISOString(),
  }))

  // Ensure only one principal contact
  const principals = contactos.value.filter(c => c.esPrincipal)
  if (principals.length > 1) {
    principals.forEach((c, i) => {
      if (i > 0) c.esPrincipal = false
    })
  }

  proyectos.value = await projectService.getByCliente(clienteId)

  try {
    const cotResponse = await quoteService.getByClient(clienteId)
    cotizaciones.value = Array.isArray(cotResponse) ? cotResponse : []
  } catch {
    cotizaciones.value = []
  }

  // Load seguimientos for all projects
  const allSegs: Seguimiento[] = []
  try {
    for (const p of proyectos.value) {
      try {
        const segs = await projectService.getSeguimientos(p.id)
        allSegs.push(...segs)
      } catch { /* skip failed project */ }
    }
  } catch { /* skip seguimientos */ }
  allSeguimientos.value = allSegs.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  resources.value = (cliente.value.resources || []).map((r: ClientResource) => ({
    name: r.name,
    url: r.url,
    type: r.type,
    isVisible: (r as any).isVisible !== false,
    uploadedAt: r.uploadedAt,
  }))

  try {
    const docs = await documentService.getByEntity('client', clienteId)
    console.log('Documents fetched for client:', clienteId, docs)
    const existingNames = new Set(resources.value.map(r => r.name))
    for (const doc of docs) {
      if (!existingNames.has(doc.name)) {
        resources.value.push({
          id: doc.id,
          name: doc.name,
          url: doc.url || '',
          type: doc.type || 'other',
          size: doc.size,
          user: doc.user,
          isVisible: doc.isVisible,
          uploadedAt: doc.createdAt,
        })
      }
    }
  } catch (e) { console.error('Error fetching docs:', e) }

}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getQuoteStatusLabel(status: EstadoCotizacion): string {
  const map: Record<EstadoCotizacion, string> = {
    pendiente: 'Pendiente',
    enviada: 'Enviada',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
    vencida: 'Vencida',
  }
  return map[status] || status
}

const filteredResources = computed(() => {
  let result = [...resources.value]
  if (resourceSearch.value) {
    const term = resourceSearch.value.toLowerCase()
    result = result.filter(d => (d.name || '').toLowerCase().includes(term))
  }
  return result
})

watch([resourceSearch], () => {})

function getDocColor(type: string): string {
  const colors: Record<string, string> = {
    documentos_legales: '#EFF6FF', comunicaciones: '#FEF3C7', propuesta: '#F0FDF4', legalizacion: '#FDF4FF',
    contrato: '#EFF6FF', cotizacion: '#F0FDF4', informe: '#FEF3C7', certificado: '#FDF4FF',
    acta: '#FFF7ED', presentacion: '#F0FDFA', hoja_de_vida: '#FEF2F2', soportes_estudio: '#F5F3FF',
  }
  return colors[type] || '#F3F4F6'
}

function formatDocType(type: string): string {
  const labels: Record<string, string> = {
    documentos_legales: 'Doc. Legal/Tributario',
    comunicaciones: 'Comunicación/Acta',
    propuesta: 'Propuesta',
    legalizacion: 'Legalización/Contrato',
    contrato: 'Contrato', cotizacion: 'Cotización', informe: 'Informe', certificado: 'Certificado',
    acta: 'Acta', presentacion: 'Presentación', hoja_de_vida: 'Hoja de vida', soportes_estudio: 'Soportes estudio',
  }
  return labels[type] || type
}

function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

function openUploadModal() {
  resourceUploadForm.value = { type: '', name: '', customType: '', useOriginalName: true, file: null }
  resourceSubmitted.value = false
  showResourceUploadModal.value = true
}

function onResourceFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    resourceUploadForm.value.file = file
    if (!resourceUploadForm.value.name) {
      resourceUploadForm.value.name = file.name.replace(/\.[^.]+$/, '')
    }
  }
}

async function handleResourceUpload() {
  resourceSubmitted.value = true
  if (!resourceUploadForm.value.type) return
  if (!resourceUploadForm.value.file) return
  if (!cliente.value) return

  uploading.value = true
  try {
    const fileType = resourceUploadForm.value.type === 'otro'
      ? resourceUploadForm.value.customType
      : resourceUploadForm.value.type
    const fileName = resourceUploadForm.value.useOriginalName
      ? resourceUploadForm.value.file?.name.replace(/\.[^.]+$/, '')
      : resourceUploadForm.value.name
    await documentService.upload(resourceUploadForm.value.file, {
      entityType: 'client',
      entityId: cliente.value.id,
      type: fileType as DocumentType,
      name: fileName || undefined,
      isVisible: resourceUploadForm.value.isVisible,
    })
    showResourceUploadModal.value = false
    uploadSuccessMessage.value = 'Documento subido exitosamente'
    setTimeout(() => { uploadSuccessMessage.value = '' }, 3000)
    await loadClientData(cliente.value.id)
  } catch (err) {
    console.error('Error uploading:', err)
  } finally {
    uploading.value = false
  }
}

function openEditResource(doc: ResourceItem) {
  resourceEditForm.value = {
    id: doc.id || 0,
    name: doc.name,
    type: doc.type || '',
    customType: '',
    isVisible: (doc as any).isVisible !== false,
  }
  showResourceEditModal.value = true
}

async function handleResourceUpdate() {
  if (!resourceEditForm.value.id) return
  savingResource.value = true
  try {
    const docType = resourceEditForm.value.type === 'otro'
      ? resourceEditForm.value.customType
      : resourceEditForm.value.type
    await documentService.update(resourceEditForm.value.id, {
      name: resourceEditForm.value.name,
      type: docType as DocumentType,
      isVisible: resourceEditForm.value.isVisible,
    })
    showResourceEditModal.value = false
    if (cliente.value) await loadClientData(cliente.value.id)
  } catch (err) {
    console.error('Error updating:', err)
  } finally {
    savingResource.value = false
  }
}

function deleteResource(id: number, name: string) {
  resourceDeleteId.value = id
  resourceDeleteName.value = name
  showResourceDeleteModal.value = true
}

async function confirmResourceDelete() {
  try {
    await documentService.delete(resourceDeleteId.value)
    showResourceDeleteModal.value = false
    if (cliente.value) await loadClientData(cliente.value.id)
  } catch (err) {
    console.error('Error deleting:', err)
  }
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await loadClientData(id)
})
</script>

<style scoped>
.client-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== HEADER ===== */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--c-gray);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 12px;
  transition: color 0.15s;
}
.back-link:hover { color: var(--c-primary); }

.client-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.client-avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
}
.client-avatar.active { background: rgba(16, 185, 129, 0.1); color: #059669; }
.client-avatar.prospect { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.client-avatar.inactive { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

.client-title h1 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--c-black);
}

.client-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--c-gray);
  margin-top: 4px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--c-primary-hover); }

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--c-white);
  color: var(--c-black);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { border-color: var(--c-gray-light); }

.btn-outline-sm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--c-white);
  color: var(--c-black);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline-sm:hover { border-color: var(--c-primary); color: var(--c-primary); }

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}
.status-badge.active { background: rgba(16, 185, 129, 0.1); color: #059669; }
.status-badge.prospect { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.status-badge.inactive { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

/* ===== TABS ===== */
.tabs-bar {
  display: flex;
  gap: 4px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 6px;
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--c-gray);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab-btn:hover { background: var(--c-light); color: var(--c-black); }
.tab-btn.active { background: var(--c-primary); color: white; font-weight: 600; }

.tab-icon { display: flex; align-items: center; }

.tab-count {
  font-size: 0.72rem;
  background: rgba(0,0,0,0.08);
  padding: 1px 6px;
  border-radius: 10px;
}
.tab-btn.active .tab-count { background: rgba(255,255,255,0.25); }

/* ===== TAB CONTENT ===== */
.tab-content {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  background: var(--c-light);
  border-radius: 12px;
  padding: 20px;
}
.info-card.full-width { grid-column: 1 / -1; }

.info-card h3 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 0.82rem;
  color: var(--c-gray);
}

.info-value {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--c-black);
}
.info-value.mono { font-family: 'Courier New', monospace; }
.info-value.link a { color: var(--c-primary); text-decoration: none; }
.info-value.link a:hover { text-decoration: underline; }

.observaciones {
  font-size: 0.88rem;
  color: var(--c-gray);
  line-height: 1.6;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  text-align: center;
}

.summary-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--c-primary);
}

.summary-label {
  display: block;
  font-size: 0.78rem;
  color: var(--c-gray);
  margin-top: 4px;
}

/* ===== CONTACTS INLINE ===== */
.contacts-inline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-inline-card {
  padding: 14px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 10px;
}

.contact-inline-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.contact-inline-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--c-black);
}

.contact-inline-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.contact-inline-detail {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  color: var(--c-gray);
}

.contact-inline-detail svg {
  color: var(--c-gray-light);
  flex-shrink: 0;
}

.no-contacts {
  font-size: 0.88rem;
  color: var(--c-gray);
}

/* ===== SECTION HEADER ===== */
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-black);
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-upload:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 0.85rem;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ===== DATA TABLE ===== */
.table-responsive { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--c-light);
  border-bottom: 1px solid var(--c-border);
}

.data-table td {
  padding: 12px 14px;
  font-size: 0.85rem;
  color: var(--c-black);
  border-bottom: 1px solid var(--c-border);
}

.data-table tr:last-child td { border-bottom: none; }

.code-cell { font-family: 'Courier New', monospace; font-weight: 700; color: var(--c-primary); }
.date-cell { color: var(--c-gray); white-space: nowrap; }
.contact-name { font-weight: 600; }
.principal-badge { background: rgba(200, 155, 45, 0.1); color: var(--c-primary); padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.secondary-text { color: var(--c-gray-light); }

/* ===== DOCS GRID ===== */
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.doc-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--c-light);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.doc-card:hover { background: var(--c-border); }

.doc-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.doc-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.doc-icon.red { background: rgba(239, 68, 68, 0.1); color: #EF4444; }
.doc-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
.doc-icon.teal { background: rgba(20, 184, 166, 0.1); color: #14B8A6; }
.doc-icon.gray { background: rgba(107, 114, 128, 0.1); color: #6B7280; }

.doc-info { flex: 1; min-width: 0; }
.doc-name { display: block; font-size: 0.85rem; font-weight: 500; color: var(--c-black); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-meta { display: block; font-size: 0.75rem; color: var(--c-gray); margin-top: 2px; }

/* ===== RESOURCES TABLE ===== */
.table-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: 14px; overflow: hidden; }
.table-card .empty-tab { padding: 40px; text-align: center; color: var(--c-gray); }

.doc-name-cell { display: flex; align-items: center; gap: 10px; }
.doc-name-cell .doc-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; color: #6B7280; flex-shrink: 0; }
.doc-name-cell .doc-name { font-weight: 600; }

.type-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
.type-badge.documentos_legales { background: #EFF6FF; color: #2563EB; }
.type-badge.comunicaciones { background: #FEF3C7; color: #D97706; }
.type-badge.propuesta { background: #F0FDF4; color: #16A34A; }
.type-badge.legalizacion { background: #FDF4FF; color: #9333EA; }
.type-badge.contrato { background: #EFF6FF; color: #2563EB; }
.type-badge.cotizacion { background: #F0FDF4; color: #16A34A; }
.type-badge.informe { background: #FEF3C7; color: #D97706; }
.type-badge.certificado { background: #FDF4FF; color: #9333EA; }
.type-badge.acta { background: #FFF7ED; color: #EA580C; }
.type-badge.presentacion { background: #F0FDFA; color: #0D9488; }
.type-badge.hoja_de_vida { background: #FEF2F2; color: #DC2626; }
.type-badge.soportes_estudio { background: #F5F3FF; color: #7C3AED; }

.visibility-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
.visibility-badge.visible { background: #DCFCE7; color: #16A34A; }
.visibility-badge.hidden { background: #FEE2E2; color: #DC2626; }

.actions-cell { display: flex; gap: 4px; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; text-decoration: none; transition: all 0.15s; }
.action-btn:hover { background: var(--c-light); color: var(--c-primary); }
.action-btn.delete-btn:hover { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

/* ===== FILTERS BAR ===== */
.filters-bar { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
.search-box { position: relative; max-width: 400px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px; border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: var(--c-primary); }
.search-input::placeholder { color: var(--c-gray-light); }
.filter-group { display: flex; gap: 8px; align-items: flex-end; }
.filter-field { display: flex; flex-direction: column; gap: 4px; }
.filter-label { font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }
.form-select { padding: 11px 32px 11px 14px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; cursor: pointer; appearance: auto; width: 100%; box-sizing: border-box; transition: all 0.2s; }
.form-select:hover { border-color: #9ca3af; }
.form-select:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.12); }
.clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; background: none; color: var(--c-gray-light); border-radius: 4px; cursor: pointer; transition: all 0.15s; }
.clear-btn:hover { background: var(--c-light); color: var(--c-black); }

/* ===== MODAL ===== */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
.modal-content { background: var(--c-white); border-radius: 16px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; }
.modal-content.modal-sm { max-width: 480px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--c-border); background: #596983; }
.modal-header h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin: 0; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.modal-close:hover { background: var(--c-light); color: var(--c-black); }
.modal-body { padding: 24px; background: #f1f2f3; color: black;}
.form-grid-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.78rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }
.form-input { padding: 11px 14px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box; }
.form-input:hover { border-color: #9ca3af; }
.form-input:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.12); }
.form-input::placeholder { color: #9ca3af; }
.field-error { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important; }

.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--c-dark); cursor: pointer; margin-bottom: 6px; }
.checkbox-label input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--c-primary); cursor: pointer; }
.file-original-name { display: block; padding: 10px 14px; background: var(--c-light); border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.85rem; color: var(--c-gray); }

.file-input-wrapper { position: relative; border: 1.5px dashed #d1d5db; border-radius: 10px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
.file-input-wrapper:hover { border-color: var(--c-primary); border-style: solid; }
.file-input-wrapper.has-file { border-style: solid; border-color: var(--c-primary); background: #F0FDF4; }
.file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.file-input-label { display: flex; align-items: center; gap: 8px; padding: 12px 14px; color: var(--c-gray); font-size: 0.85rem; }
.file-selected { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; font-size: 0.85rem; color: var(--c-black); }
.file-remove { border: none; background: none; color: var(--c-gray); cursor: pointer; font-size: 1rem; padding: 2px 6px; border-radius: 4px; }
.file-remove:hover { background: #FEE2E2; color: #DC2626; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--c-border); color: black; background: #EFF6FF; }
.btn-cancel { padding: 10px 20px; border: 1.5px solid #d1d5db; border-radius: 10px; background: #f9fafb; color: #374151; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: #7c9dbe; border-color: #9ca3af; }
.btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #B8892A; color: rgb(250, 250, 250); border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

/* ===== DELETE MODAL ===== */
.delete-modal-body { padding: 32px 28px; text-align: center; background: #374151; }
.delete-icon { color: var(--c-danger, #dc2626); margin-bottom: 12px; }
.delete-title { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin: 0 0 8px; }
.delete-text { font-size: 0.88rem; color: var(--c-gray); margin: 0 0 24px; line-height: 1.5; }
.delete-actions { display: flex; gap: 10px; justify-content: center; }
.btn-delete { padding: 10px 20px; border: none; border-radius: 10px; background: #dc2626; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-delete:hover { background: #b91c1c; transform: translateY(-1px); }

.upload-progress { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px; color: #6b7280; font-size: 0.85rem; }

/* ===== TIMELINE ===== */
.timeline {
  position: relative;
  padding-left: 24px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--c-border);
}

.timeline-item {
  position: relative;
  padding: 0 0 20px 24px;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--c-white);
}
.timeline-dot.green { background: #10B981; }
.timeline-dot.blue { background: #3B82F6; }
.timeline-dot.purple { background: #8B5CF6; }
.timeline-dot.amber { background: #F59E0B; }
.timeline-dot.orange { background: #F97316; }
.timeline-dot.teal { background: #14B8A6; }
.timeline-dot.gray { background: #6B7280; }

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-text {
  font-size: 0.88rem;
  color: var(--c-black);
}

.timeline-meta {
  font-size: 0.78rem;
  color: var(--c-gray-light);
}

/* ===== EMPTY & LOADING ===== */
.empty-tab {
  text-align: center;
  padding: 40px 20px;
  color: var(--c-gray);
}
.empty-tab h3 { font-size: 1rem; font-weight: 600; color: var(--c-black); margin-bottom: 6px; }

.empty-state {
  text-align: center;
  padding: 80px 20px;
}
.empty-state h3 { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin-bottom: 16px; }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 20px;
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

.btn-primary:hover { background: var(--c-primary-hover); }

/* ===== QUOTES TABLE ===== */
.quotes-table-wrap {
  overflow-x: auto;
}

.quotes-table {
  width: 100%;
  border-collapse: collapse;
}

.quotes-table th {
  padding: 12px 14px;
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

.quotes-table td {
  padding: 12px 14px;
  font-size: 0.85rem;
  color: var(--c-black);
  border-bottom: 1px solid var(--c-border);
}

.quotes-table tr:last-child td { border-bottom: none; }
.quotes-table tr:hover td { background: rgba(249, 250, 251, 0.6); }

.quotes-table .code-cell {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--c-primary);
}

.quotes-table .amount-cell {
  font-weight: 700;
  white-space: nowrap;
}

.quotes-table .status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.quotes-table .status-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.quotes-table .status-pendiente { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.quotes-table .status-enviada { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.quotes-table .status-aprobada { background: rgba(16, 185, 129, 0.1); color: #059669; }
.quotes-table .status-rechazada { background: rgba(239, 68, 68, 0.1); color: #DC2626; }
.quotes-table .status-vencida { background: rgba(107, 114, 128, 0.1); color: #4B5563; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .detail-header { flex-direction: column; }
  .info-grid { grid-template-columns: 1fr; }
  .summary-stats { grid-template-columns: repeat(2, 1fr); }
  .tabs-bar { overflow-x: auto; }
}
</style>
