<template>
  <div class="portal-app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header" @click="router.push('/')" style="cursor: pointer;">
        <img src="/images/LOGO_1.jpeg" alt="ESG" class="sidebar-logo" />
        <span class="sidebar-brand">Portal Clientes</span>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeSection === item.id }"
          @click="activeSection = item.id"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.count" class="nav-badge">{{ item.count }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">{{ clientInitials }}</div>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">{{ displayName }}</span>
            <span class="sidebar-user-company">{{ clientData?.razonSocial || '' }}</span>
          </div>
        </div>
        <button class="sidebar-logout" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesion
        </button>
      </div>
    </aside>

    <!-- Mobile header -->
    <header class="mobile-header">
      <button class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <span class="mobile-title">Mi Portal</span>
      <button class="mobile-logout-btn" @click="handleLogout">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </header>

    <!-- Mobile overlay -->
    <div v-if="showMobileMenu" class="mobile-overlay" @click="showMobileMenu = false"></div>
    <div class="mobile-sidebar" :class="{ open: showMobileMenu }">
      <div class="mobile-sidebar-header">
        <img src="/images/LOGO_1.jpeg" alt="ESG" class="sidebar-logo" />
        <button class="mobile-close-btn" @click="showMobileMenu = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <nav class="mobile-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="mobile-nav-item"
          :class="{ active: activeSection === item.id }"
          @click="activeSection = item.id; showMobileMenu = false"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>
    </div>

    <!-- Main content -->
    <main class="main-content">
      <!-- Loading -->
      <div v-if="loading" class="state-container">
        <div class="loader"></div>
        <p>Cargando tu informacion...</p>
      </div>

      <!-- Error with welcome fallback -->
      <template v-else-if="error">
        <!-- INICIO with welcome -->
        <section v-if="activeSection === 'inicio'" class="section">
          <div class="greeting-card">
            <div class="greeting-text">
              <h1>Bienvenido, {{ displayName }}</h1>
              <p>Tu portal de servicios con <strong>ES Gestion</strong></p>
            </div>
            <div class="greeting-decoration">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>

          <div class="welcome-info-card">
            <div class="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C89B2D" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2>Hola, {{ displayName }}</h2>
            <p class="welcome-subtitle">Bienvenido a tu espacio de seguimiento y gestion</p>
            <div class="welcome-divider"></div>
            <p class="welcome-message">{{ error }}</p>
            <button class="retry-btn" @click="reloadData">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Intentar de nuevo
            </button>
          </div>
        </section>

        <!-- Other sections with error -->
        <div v-else class="state-container error">
          <div class="error-box">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3>Algo salio mal</h3>
            <p>{{ error }}</p>
            <button class="retry-btn" @click="reloadData">Intentar de nuevo</button>
          </div>
        </div>
      </template>

      <!-- Content -->
      <template v-else>
        <!-- INICIO -->
        <section v-if="activeSection === 'inicio'" class="section">
          <div class="greeting-card">
            <div class="greeting-text">
              <h1>Hola, {{ displayName }}</h1>
              <p>Bienvenido a tu portal de servicios con <strong>ES Gestion</strong></p>
            </div>
            <div class="greeting-decoration">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-card blue">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="stat-data">
                <span class="stat-number">{{ projects.length }}</span>
                <span class="stat-text">Proyectos activos</span>
              </div>
            </div>
            <div class="stat-card gold">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="7"/>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                </svg>
              </div>
              <div class="stat-data">
                <span class="stat-number">{{ mappedCertificates.length }}</span>
                <span class="stat-text">Certificados</span>
              </div>
            </div>
            <div class="stat-card green">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div class="stat-data">
                <span class="stat-number">{{ documents.filter(d => d.isVisible !== false).length }}</span>
                <span class="stat-text">Documentos</span>
              </div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <h3>Tu empresa</h3>
              <div class="info-rows">
                <div class="info-row">
                  <span class="info-label">Razon social</span>
                  <span class="info-value">{{ clientData?.razonSocial || 'N/A' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">NIT</span>
                  <span class="info-value">{{ clientData?.nit || 'N/A' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Ciudad</span>
                  <span class="info-value">{{ clientData?.ciudad || 'N/A' }}, {{ clientData?.departamento || '' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Direccion</span>
                  <span class="info-value">{{ clientData?.direccion || 'N/A' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Telefono</span>
                  <span class="info-value">{{ clientData?.telefono || 'N/A' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Correo</span>
                  <span class="info-value">{{ clientData?.correo || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3>Actividad reciente</h3>
              <div v-if="projects.length === 0" class="empty-mini">
                <p>Sin actividad reciente</p>
              </div>
              <div v-else class="activity-list">
                <div v-for="p in recentProjects" :key="p.id" class="activity-item">
                  <div class="activity-dot" :class="getStatusClass(p.status || '')"></div>
                  <div class="activity-content">
                    <span class="activity-title">{{ p.description || p.code }}</span>
                    <span class="activity-meta">{{ p.norm }} - {{ getStatusLabel(p.status || '') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- PROYECTOS -->
        <section v-if="activeSection === 'proyectos'" class="section">
          <div class="section-head">
            <h2>Mis Proyectos</h2>
            <p>Todos los proyectos asociados a tu empresa</p>
          </div>

          <div v-if="projects.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <p>No hay proyectos registrados</p>
          </div>

          <div v-else class="projects-list">
            <div v-for="p in projects" :key="p.id" class="project-row" @click="selectedProject = p; activeSection = 'proyecto-detalle'">
              <div class="project-status-bar" :class="getStatusClass(p.status || '')"></div>
              <div class="project-body">
                <div class="project-top">
                  <h3>{{ p.description || `Proyecto ${p.code}` }}</h3>
                  <span class="status-pill" :class="getStatusClass(p.status || '')">{{ getStatusLabel(p.status || '') }}</span>
                </div>
                <div class="project-details">
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
                    {{ p.norm }}
                  </span>
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {{ p.responsible || 'Sin asignar' }}
                  </span>
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    {{ formatDate(p.startDate) }}
                  </span>
                </div>
                <div class="project-progress">
                  <div class="progress-track">
                    <div class="progress-fill" :class="getStatusClass(p.status || '')" :style="{ width: calculateProgress(p) + '%' }"></div>
                  </div>
                  <span class="progress-label">{{ calculateProgress(p) }}%</span>
                </div>
              </div>
              <div class="project-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </section>

        <!-- DETALLE PROYECTO -->
        <section v-if="activeSection === 'proyecto-detalle' && selectedProject" class="section">
          <button class="back-btn" @click="activeSection = 'proyectos'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Volver a proyectos
          </button>

          <div class="detail-header">
            <h2>{{ selectedProject.description || `Proyecto ${selectedProject.code}` }}</h2>
            <span class="status-pill large" :class="getStatusClass(selectedProject.status || '')">{{ getStatusLabel(selectedProject.status || '') }}</span>
          </div>

          <div class="detail-grid">
            <div class="detail-card">
              <h4>Informacion del proyecto</h4>
              <div class="detail-rows">
                <div class="detail-row"><span>Norma</span><strong>{{ selectedProject.norm }}</strong></div>
                <div class="detail-row"><span>Responsable</span><strong>{{ selectedProject.responsible }}</strong></div>
                <div class="detail-row"><span>Tipo</span><strong>{{ selectedProject.projectType }}</strong></div>
                <div class="detail-row"><span>Codigo</span><strong>{{ selectedProject.code }}</strong></div>
                <div class="detail-row"><span>Inicio</span><strong>{{ formatDate(selectedProject.startDate) }}</strong></div>
                <div class="detail-row"><span>Fin</span><strong>{{ selectedProject.endDate ? formatDate(selectedProject.endDate) : 'En curso' }}</strong></div>
              </div>
            </div>

            <div class="detail-card">
              <h4>Progreso</h4>
              <div class="big-progress">
                <div class="big-progress-ring">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#F0F0F0" stroke-width="8"/>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#C89B2D" stroke-width="8" stroke-linecap="round"
                      :stroke-dasharray="326.7"
                      :stroke-dashoffset="326.7 - (326.7 * calculateProgress(selectedProject) / 100)"
                      transform="rotate(-90 60 60)"/>
                  </svg>
                  <span class="big-progress-text">{{ calculateProgress(selectedProject) }}%</span>
                </div>
                <p class="big-progress-label">{{ getStatusLabel(selectedProject.status || '') }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedProject.description" class="detail-card full-width">
            <h4>Descripcion</h4>
            <p class="description-text">{{ selectedProject.description }}</p>
          </div>
        </section>

        <!-- CERTIFICADOS -->
        <section v-if="activeSection === 'certificados'" class="section">
          <div class="section-head">
            <h2>Certificados e Informes</h2>
            <p>Documentos emitidos por ESG para tu empresa</p>
          </div>

          <div v-if="mappedCertificates.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
            <p>No hay certificados disponibles aun</p>
          </div>

          <div v-else class="cert-grid">
            <div v-for="c in mappedCertificates" :key="c.id" class="cert-card-new">
              <div class="cert-card-top" :class="c.typeClass">
                <span class="cert-type-icon" v-html="c.icon"></span>
                <span class="cert-type-label">{{ c.type }}</span>
              </div>
              <div class="cert-card-body">
                <h4>{{ c.name }}</h4>
                <p>{{ c.service }}</p>
                <span class="cert-date-new">{{ c.date }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- COTIZACIONES -->
        <section v-if="activeSection === 'cotizaciones'" class="section">
          <div class="section-head">
            <h2>Mis Cotizaciones</h2>
            <p>Cotizaciones y presupuestos de tus proyectos</p>
          </div>

          <div v-if="visibleCotizaciones.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <p>No hay cotizaciones registradas</p>
          </div>

          <div v-else class="quotes-list">
            <div v-for="q in visibleCotizaciones" :key="q.id" class="quote-row">
              <div class="quote-status-bar" :class="getQuoteStatusClass(q.status)"></div>
              <div class="quote-body">
                <div class="quote-top">
                  <h3>{{ q.code }}</h3>
                  <span class="status-pill" :class="getQuoteStatusClass(q.status)">{{ getQuoteStatusLabel(q.status) }}</span>
                </div>
                <div class="quote-details">
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    ${{ q.totalAmount?.toLocaleString('es-CO') || '0' }}
                  </span>
                  <span v-if="q.project" class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    {{ q.project.description || q.project.code }}
                  </span>
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    {{ formatDate(q.createdAt) }}
                  </span>
                  <span v-if="q.validUntil" class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Validez: {{ formatDate(q.validUntil) }}
                  </span>
                </div>
                <div v-if="q.services && q.services.length > 0" class="quote-services">
                  <div v-for="(s, i) in q.services" :key="i" class="service-item">
                    <span class="service-name">{{ s.name }}</span>
                    <span class="service-qty">{{ s.quantity }}x</span>
                    <span class="service-price">${{ s.value?.toLocaleString('es-CO') || '0' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- DOCUMENTOS -->
        <section v-if="activeSection === 'documentos'" class="section">
          <div class="section-head">
            <h2>Documentos</h2>
            <p>Archivos compartidos en tus proyectos</p>
          </div>

          <div class="filter-pills">
            <button
              v-for="f in docFilters"
              :key="f.value"
              class="pill"
              :class="{ active: docFilter === f.value }"
              @click="docFilter = f.value"
            >{{ f.label }}</button>
          </div>

          <div v-if="filteredDocuments.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <p>No hay documentos para mostrar</p>
          </div>

          <div v-else class="docs-grid">
            <div v-for="d in filteredDocuments" :key="d.id" class="doc-card-new">
              <div class="doc-card-icon" :class="d.typeClass">
                <span v-html="d.icon"></span>
              </div>
              <div class="doc-card-info">
                <h4>{{ d.name }}</h4>
                <div class="doc-card-meta">
                  <span>{{ d.project }}</span>
                  <span class="doc-sep">|</span>
                  <span>{{ d.size }}</span>
                  <span class="doc-sep">|</span>
                  <span>{{ d.date }}</span>
                </div>
              </div>
              <span class="doc-card-badge" :class="d.typeClass">{{ d.type }}</span>
            </div>
          </div>
        </section>

        <section v-if="activeSection === 'recursos' && clientData?.showResources" class="section">
          <div class="section-head">
            <h2>Recursos</h2>
            <p>Proyectos realizados para tu empresa</p>
          </div>

          <div v-if="projects.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>No hay recursos para mostrar</p>
          </div>

          <div v-else class="recursos-grid">
            <div v-for="p in projects" :key="p.id" class="recurso-card">
              <div class="recurso-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="recurso-info">
                <h4>{{ p.code || p.description }}</h4>
                <p>{{ p.serviceType || 'Proyecto' }}</p>
              </div>
              <span class="recurso-status" :class="getStatusClass(p.status)">{{ getStatusLabel(p.status) }}</span>
            </div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clientAuthService, portalService } from '@/services/api'
import type { Cliente, Proyecto, DocumentoEntity, Cotizacion } from '@/types/crmTypes'

defineOptions({ name: 'ClientPortalView' })

const router = useRouter()
const loading = ref(true)
const error = ref('')
const showMobileMenu = ref(false)

const clientData = ref<Cliente | null>(null)
const projects = ref<Proyecto[]>([])
const documents = ref<DocumentoEntity[]>([])
const cotizaciones = ref<Cotizacion[]>([])
const visibleCotizaciones = computed(() => cotizaciones.value.filter(q => q.isVisible !== false))
const selectedProject = ref<Proyecto | null>(null)

const clientInitials = computed(() => {
  const name = clientData.value?.razonSocial || ''
  const parts = name.split(' ')
  return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')
})

const displayName = computed(() => {
  const user = clientAuthService.getCurrentUser()
  return user?.name || clientData.value?.razonSocial || ''
})

const activeSection = ref('inicio')
const docFilter = ref('todos')

const navItems = computed(() => {
  const items = [
    { id: 'inicio', label: 'Inicio', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', count: 0 },
    { id: 'proyectos', label: 'Mis Proyectos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>', count: projects.value.length },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>', count: visibleCotizaciones.value.length },
    { id: 'certificados', label: 'Certificados', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>', count: mappedCertificates.value.length },
    { id: 'documentos', label: 'Documentos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', count: documents.value.filter(d => d.isVisible !== false).length },
  ]
  if (clientData.value?.showResources) {
    items.push({ id: 'recursos', label: 'Recursos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', count: projects.value.length })
  }
  return items
})

const recentProjects = computed(() => {
  return projects.value.slice(0, 5)
})

function getStatusClass(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('activo') || s.includes('ejecucion') || s.includes('en curso') || s === 'en_curso') return 'active'
  if (s.includes('finalizado') || s.includes('completado') || s === 'completed') return 'completed'
  if (s.includes('programado') || s.includes('pendiente') || s.includes('nuevo')) return 'scheduled'
  return 'active'
}

function getStatusLabel(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('activo') || s.includes('ejecucion') || s.includes('en curso') || s === 'en_curso') return 'En ejecucion'
  if (s.includes('finalizado') || s.includes('completado') || s === 'completed') return 'Finalizado'
  if (s.includes('programado') || s.includes('pendiente') || s.includes('nuevo')) return 'Programado'
  return status
}

function getQuoteStatusClass(status: string): string {
  const s = status.toLowerCase()
  if (s === 'aprobada') return 'active'
  if (s === 'enviada') return 'scheduled'
  if (s === 'rechazada' || s === 'vencida') return 'completed'
  return 'scheduled'
}

function getQuoteStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    enviada: 'Enviada',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
    vencida: 'Vencida',
  }
  return labels[status] || status
}

function calculateProgress(project: Proyecto): number {
  if (project.status?.toLowerCase().includes('finalizado')) return 100
  if (project.status?.toLowerCase().includes('nuevo') || project.status?.toLowerCase().includes('programado')) return 0
  if (!project.startDate || !project.endDate) return 50
  const start = new Date(project.startDate).getTime()
  const end = new Date(project.endDate).getTime()
  const now = Date.now()
  if (end <= start) return 100
  const progress = Math.round(((now - start) / (end - start)) * 100)
  return Math.min(Math.max(progress, 0), 99)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

const mappedCertificates = computed(() => {
  return documents.value
    .filter((d) => (d.isVisible !== false) && (d.type === 'certificado' || d.type === 'informe'))
    .map((d) => ({
      id: d.id,
      name: d.name,
      service: getProjectName(d.entityId),
      type: d.type === 'certificado' ? 'Certificado' : 'Informe',
      typeClass: d.type === 'certificado' ? 'certificate' : 'report',
      date: new Date(d.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
      icon: d.type === 'certificado'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    }))
})

function getProjectName(projectId: number): string {
  const project = projects.value.find((p) => p.id === projectId)
  return project?.description || project?.code || 'Proyecto'
}

function getDocTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    contrato: 'Contrato', cotizacion: 'Cotizacion', informe: 'Informe',
    certificado: 'Certificado', acta: 'Acta', presentacion: 'Presentacion',
    hoja_de_vida: 'Hoja de Vida', soportes_estudio: 'Soportes',
  }
  return labels[type] || type
}

function getDocTypeClass(type: string): string {
  const classes: Record<string, string> = {
    contrato: 'procedure', cotizacion: 'procedure', informe: 'report',
    certificado: 'certificate', acta: 'acta', presentacion: 'presentation',
    hoja_de_vida: 'manual', soportes_estudio: 'plan',
  }
  return classes[type] || 'report'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

const mappedDocuments = computed(() => {
  return documents.value
    .filter((d) => d.isVisible !== false)
    .map((d) => ({
    id: d.id,
    name: d.name,
    project: getProjectName(d.entityId),
    type: getDocTypeLabel(d.type),
    typeClass: getDocTypeClass(d.type),
    size: formatFileSize(d.size),
    date: new Date(d.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
    url: d.url,
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  }))
})

const docFilters = [
  { value: 'todos', label: 'Todos' },
  { value: 'procedure', label: 'Contratos' },
  { value: 'report', label: 'Informes' },
  { value: 'certificate', label: 'Certificados' },
  { value: 'acta', label: 'Actas' },
  { value: 'presentation', label: 'Presentaciones' },
]

const filteredDocuments = computed(() => {
  if (docFilter.value === 'todos') return mappedDocuments.value
  return mappedDocuments.value.filter((d) => d.typeClass === docFilter.value)
})

onMounted(async () => {
  try {
    loading.value = true
    const data = await portalService.getPortalData()
    clientData.value = data.client
    projects.value = data.projects
    documents.value = data.documents
    cotizaciones.value = data.cotizaciones
    error.value = ''
  } catch (err: unknown) {
    console.error('Error loading portal data:', err)
    error.value = err instanceof Error ? err.message : 'Error al cargar los datos del portal'
  } finally {
    loading.value = false
  }
})

function handleLogout() {
  if (confirm('Desea cerrar sesion?')) {
    clientAuthService.logout()
    router.push('/')
  }
}

async function reloadData() {
  loading.value = true
  error.value = ''
  try {
    const data = await portalService.getPortalData()
    clientData.value = data.client
    projects.value = data.projects
    documents.value = data.documents
    cotizaciones.value = data.cotizaciones
    error.value = ''
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al cargar los datos del portal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.portal-app {
  display: flex;
  min-height: 100vh;
  background: #F4F1EC;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1A1A1A;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 260px;
  background: #1A1A1A;
  color: #FFF;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  background: #1A1A1A;
  z-index: 10;
}

.sidebar-logo {
  height: 36px;
  border-radius: 6px;
}

.sidebar-brand {
  font-size: 14px;
  font-weight: 700;
  opacity: 0.9;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.6);
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.nav-item:hover {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.9);
}

.nav-item.active {
  background: #C89B2D;
  color: #FFF;
}

.nav-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: rgba(255,255,255,0.15);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.nav-item.active .nav-badge {
  background: rgba(255,255,255,0.25);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.sidebar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #C89B2D;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-user-name {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-company {
  font-size: 11px;
  opacity: 0.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: rgba(255,255,255,0.5);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.sidebar-logout:hover {
  border-color: rgba(220,38,38,0.4);
  color: #EF4444;
  background: rgba(220,38,38,0.08);
}

/* ===== MOBILE HEADER ===== */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #1A1A1A;
  color: #FFF;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 150;
}

.mobile-menu-btn,
.mobile-logout-btn {
  background: none;
  border: none;
  color: #FFF;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
}

.mobile-menu-btn:hover,
.mobile-logout-btn:hover {
  background: rgba(255,255,255,0.1);
}

.mobile-title {
  font-size: 16px;
  font-weight: 700;
}

.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 250;
}

.mobile-sidebar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: #1A1A1A;
  z-index: 300;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  flex-direction: column;
}

.mobile-sidebar.open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.mobile-close-btn {
  background: none;
  border: none;
  color: #FFF;
  padding: 4px;
  cursor: pointer;
}

.mobile-nav {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.6);
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.mobile-nav-item.active {
  background: #C89B2D;
  color: #FFF;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 32px;
  min-height: 100vh;
}

/* ===== LOADING / ERROR ===== */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  color: #888;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #F0F0F0;
  border-top-color: #C89B2D;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-box {
  text-align: center;
  max-width: 400px;
}

.error-box h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 16px 0 8px;
  color: #1A1A1A;
}

.error-box p {
  font-size: 14px;
  color: #888;
  margin: 0 0 20px;
}

.retry-btn {
  padding: 10px 24px;
  background: #C89B2D;
  color: #FFF;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

/* ===== SECTIONS ===== */
.section {
  animation: fadeUp 0.3s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-head {
  margin-bottom: 28px;
}

.section-head h2 {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px;
}

.section-head p {
  font-size: 14px;
  color: #888;
  margin: 0;
}

/* ===== GREETING ===== */
.greeting-card {
  background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
  border-radius: 16px;
  padding: 36px 40px;
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.greeting-text h1 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px;
}

.greeting-text p {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin: 0;
}

.greeting-text strong {
  color: #C89B2D;
}

.greeting-decoration {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #C89B2D;
}

/* ===== WELCOME INFO CARD ===== */
.welcome-info-card {
  background: #FFF;
  border-radius: 16px;
  padding: 48px 40px;
  text-align: center;
  max-width: 500px;
  margin: 40px auto;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.welcome-icon {
  margin-bottom: 20px;
}

.welcome-info-card h2 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px;
  color: #1A1A1A;
}

.welcome-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0 0 24px;
}

.welcome-divider {
  width: 60px;
  height: 3px;
  background: #C89B2D;
  border-radius: 2px;
  margin: 0 auto 24px;
}

.welcome-message {
  font-size: 14px;
  color: #666;
  margin: 0 0 28px;
  line-height: 1.6;
}

.welcome-info-card .retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #C89B2D;
  color: #FFF;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.welcome-info-card .retry-btn:hover {
  background: #B88A25;
  transform: translateY(-1px);
}

/* ===== STATS ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #FFF;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(0,0,0,0.04);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.blue .stat-icon { background: #EFF6FF; color: #2563EB; }
.stat-card.gold .stat-icon { background: #FFFBEB; color: #D97706; }
.stat-card.green .stat-icon { background: #ECFDF5; color: #059669; }

.stat-number {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  display: block;
}

.stat-text {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

/* ===== INFO GRID ===== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-card {
  background: #FFF;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid rgba(0,0,0,0.04);
}

.info-card h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
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
  font-size: 13px;
  color: #888;
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== ACTIVITY ===== */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.activity-dot.active { background: #3B82F6; }
.activity-dot.completed { background: #10B981; }
.activity-dot.scheduled { background: #F59E0B; }

.activity-title {
  font-size: 13px;
  font-weight: 600;
  display: block;
}

.activity-meta {
  font-size: 12px;
  color: #888;
}

.empty-mini {
  text-align: center;
  padding: 24px;
  color: #AAA;
  font-size: 13px;
}

/* ===== PROJECTS LIST ===== */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-row {
  background: #FFF;
  border-radius: 14px;
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.project-row:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  transform: translateY(-1px);
}

.project-status-bar {
  width: 4px;
  flex-shrink: 0;
}

.project-status-bar.active { background: #3B82F6; }
.project-status-bar.completed { background: #10B981; }
.project-status-bar.scheduled { background: #F59E0B; }

.project-body {
  flex: 1;
  padding: 20px 24px;
}

.project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.project-top h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.status-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

.status-pill.active { background: #EFF6FF; color: #2563EB; }
.status-pill.completed { background: #ECFDF5; color: #059669; }
.status-pill.scheduled { background: #FFFBEB; color: #D97706; }
.status-pill.large { font-size: 12px; padding: 6px 14px; }

.project-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.detail-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #888;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track {
  flex: 1;
  height: 4px;
  background: #F0F0F0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.progress-fill.active { background: #3B82F6; }
.progress-fill.completed { background: #10B981; }
.progress-fill.scheduled { background: #F59E0B; }

.progress-label {
  font-size: 12px;
  font-weight: 700;
  color: #888;
  min-width: 32px;
  text-align: right;
}

.project-arrow {
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #CCC;
}

/* ===== BACK BTN ===== */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #888;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  font-family: inherit;
}

.back-btn:hover {
  color: #C89B2D;
}

/* ===== DETAIL ===== */
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-header h2 {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-card {
  background: #FFF;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid rgba(0,0,0,0.04);
}

.detail-card.full-width {
  grid-column: 1 / -1;
}

.detail-card h4 {
  font-size: 13px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px;
}

.detail-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row span {
  font-size: 13px;
  color: #888;
}

.detail-row strong {
  font-size: 13px;
  font-weight: 600;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.big-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.big-progress-ring {
  position: relative;
  width: 120px;
  height: 120px;
}

.big-progress-ring svg {
  width: 100%;
  height: 100%;
}

.big-progress-ring circle:last-child {
  transition: stroke-dashoffset 1s ease;
}

.big-progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: #C89B2D;
}

.big-progress-label {
  font-size: 13px;
  color: #888;
  margin: 0;
}

/* ===== CERTIFICATES ===== */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

/* ===== QUOTES ===== */
.quotes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quote-row {
  background: #FFF;
  border-radius: 14px;
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(0,0,0,0.04);
  overflow: hidden;
}

.quote-status-bar {
  width: 4px;
  flex-shrink: 0;
}

.quote-status-bar.active { background: #10B981; }
.quote-status-bar.scheduled { background: #F59E0B; }
.quote-status-bar.completed { background: #EF4444; }

.quote-body {
  flex: 1;
  padding: 20px 24px;
}

.quote-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.quote-top h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.quote-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.quote-services {
  border-top: 1px solid #F0F0F0;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.service-name {
  flex: 1;
  color: #555;
}

.service-qty {
  color: #888;
  min-width: 32px;
  text-align: center;
}

.service-price {
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}

.cert-card-new {
  background: #FFF;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.2s;
}

.cert-card-new:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.cert-card-top {
  padding: 16px 20px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cert-card-top.certificate { background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); }
.cert-card-top.report { background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); }

.cert-type-icon {
  display: flex;
  align-items: center;
}

.cert-card-top.certificate .cert-type-icon { color: #D97706; }
.cert-card-top.report .cert-type-icon { color: #2563EB; }

.cert-type-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cert-card-top.certificate .cert-type-label { color: #D97706; }
.cert-card-top.report .cert-type-label { color: #2563EB; }

.cert-card-body {
  padding: 16px 20px 20px;
}

.cert-card-body h4 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 4px;
}

.cert-card-body p {
  font-size: 12px;
  color: #888;
  margin: 0 0 8px;
}

.cert-date-new {
  font-size: 11px;
  color: #AAA;
}

/* ===== FILTERS ===== */
.filter-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.pill {
  padding: 8px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  background: #FFF;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.pill:hover {
  border-color: #CCC;
  color: #1A1A1A;
}

.pill.active {
  background: #1A1A1A;
  color: #FFF;
  border-color: #1A1A1A;
}

/* ===== DOCS ===== */
.docs-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.doc-card-new {
  background: #FFF;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.2s;
}

.doc-card-new:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.doc-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-card-icon.manual { background: #F3E8FF; color: #8B5CF6; }
.doc-card-icon.procedure { background: #EFF6FF; color: #3B82F6; }
.doc-card-icon.report { background: #ECFDF5; color: #10B981; }
.doc-card-icon.acta { background: #FFFBEB; color: #F59E0B; }
.doc-card-icon.plan { background: #FEF2F2; color: #EF4444; }
.doc-card-icon.presentation { background: #FEF9C3; color: #CA8A04; }
.doc-card-icon.certificate { background: #FEF9C3; color: #CA8A04; }

.doc-card-info {
  flex: 1;
  min-width: 0;
}

.doc-card-info h4 {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #AAA;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-sep {
  opacity: 0.3;
}

.doc-card-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.doc-card-badge.manual { background: #F3E8FF; color: #7C3AED; }
.doc-card-badge.procedure { background: #EFF6FF; color: #2563EB; }
.doc-card-badge.report { background: #ECFDF5; color: #059669; }
.doc-card-badge.acta { background: #FFFBEB; color: #D97706; }
.doc-card-badge.plan { background: #FEF2F2; color: #DC2626; }
.doc-card-badge.presentation { background: #FEF9C3; color: #CA8A04; }
.doc-card-badge.certificate { background: #FEF9C3; color: #CA8A04; }

/* ===== EMPTY ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
}

.empty-state p {
  font-size: 14px;
  color: #AAA;
  margin: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .stats-row { grid-template-columns: 1fr; }
  .info-grid { grid-template-columns: 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
}

.recursos-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recurso-card {
  background: #FFF;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.2s;
}

.recurso-card:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.recurso-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(200,155,45,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--brand);
}

.recurso-info {
  flex: 1;
  min-width: 0;
}

.recurso-info h4 {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.recurso-info p {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.recurso-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.recurso-status.active { background: rgba(16,185,129,0.1); color: #059669; }
.recurso-status.completed { background: rgba(59,130,246,0.1); color: #2563EB; }
.recurso-status.scheduled { background: rgba(245,158,11,0.1); color: #D97706; }

@media (max-width: 768px) {
  .sidebar { display: none; }
  .mobile-header { display: flex; }
  .mobile-overlay { display: block; }
  .mobile-sidebar { display: flex; }
  .main-content { margin-left: 0; padding: 72px 16px 24px; }
  .greeting-card { flex-direction: column; text-align: center; padding: 28px 20px; }
  .greeting-decoration { display: none; }
  .welcome-info-card { padding: 32px 20px; margin: 24px auto; }
  .project-details { flex-direction: column; gap: 6px; }
  .cert-grid { grid-template-columns: 1fr; }
}
</style>
