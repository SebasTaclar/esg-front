<template>
  <div class="admin-layout" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-logo">
          <img src="/images/LOGO_1.jpeg" alt="ESG" class="logo-img" />
        </router-link>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: currentSection === item.id }"
          @click="setSection(item.id)"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" @click="handleLogout">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span class="nav-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Sidebar overlay (mobile) -->
    <div class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Main Area -->
    <div class="main-area">
      <!-- Topbar -->
      <header class="topbar">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <router-link to="/" class="home-btn" title="Volver al inicio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </router-link>

        <div class="topbar-greeting">
          <h1>¡Hola, Camila! 👋</h1>
          <p>Bienvenida al Centro de Gestión ESG</p>
        </div>

        <div class="topbar-search">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Buscar..." class="search-input" />
        </div>

        <div class="topbar-actions">
          <button class="action-btn" title="Notificaciones">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="badge">3</span>
          </button>
          <button class="export-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar reporte
          </button>
          <div class="topbar-user">
            <div class="user-avatar-sm">
              <img v-if="userAvatar" :src="userAvatar" alt="Avatar" />
              <span v-else>CR</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="main-content">
        <!-- ========== DASHBOARD ========== -->
        <div v-if="currentSection === 'dashboard'">
          <!-- Stats Cards -->
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Clientes</span>
                <span class="stat-value">245</span>
                <span class="stat-change up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  12 este mes
                </span>
              </div>
              <div class="stat-sparkline">
                <svg viewBox="0 0 80 30" class="sparkline-svg">
                  <polyline points="0,25 15,20 30,22 45,15 60,18 80,5" fill="none" stroke="#3B82F6" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Proyectos</span>
                <span class="stat-value">52</span>
                <span class="stat-sub">En ejecución</span>
              </div>
              <div class="stat-sparkline">
                <svg viewBox="0 0 80 30" class="sparkline-svg">
                  <polyline points="0,20 15,15 30,18 45,10 60,12 80,5" fill="none" stroke="#F59E0B" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Cotizaciones</span>
                <span class="stat-value">18</span>
                <span class="stat-sub">Pendientes</span>
              </div>
              <div class="stat-sparkline">
                <svg viewBox="0 0 80 30" class="sparkline-svg">
                  <polyline points="0,15 15,20 30,10 45,18 60,8 80,12" fill="none" stroke="#8B5CF6" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Facturación</span>
                <span class="stat-value">$235M</span>
                <span class="stat-change up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  18% este mes
                </span>
              </div>
              <div class="stat-sparkline">
                <svg viewBox="0 0 80 30" class="sparkline-svg">
                  <polyline points="0,25 15,20 30,22 45,12 60,15 80,3" fill="none" stroke="#10B981" stroke-width="2"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Middle Row: Activity, Calendar, Upcoming -->
          <div class="dashboard-middle">
            <!-- Actividad Reciente -->
            <div class="card activity-card">
              <div class="card-header">
                <h3>Actividad reciente</h3>
                <button class="link-btn">Ver todas</button>
              </div>
              <div class="activity-list">
                <div v-for="(activity, idx) in recentActivities" :key="idx" class="activity-item">
                  <div class="activity-icon" :class="activity.type">
                    <span v-html="activity.icon"></span>
                  </div>
                  <div class="activity-info">
                    <span class="activity-text">{{ activity.text }}</span>
                    <span class="activity-time">{{ activity.time }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Calendario -->
            <div class="card calendar-card">
              <div class="card-header">
                <h3>Calendario</h3>
                <div class="calendar-nav">
                  <span class="calendar-month">Mayo 2025</span>
                  <button class="cal-nav-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <button class="cal-nav-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="calendar-grid">
                <div class="cal-header">
                  <span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span><span>DOM</span>
                </div>
                <div class="cal-body">
                  <span class="cal-day other">28</span>
                  <span class="cal-day other">29</span>
                  <span class="cal-day other">30</span>
                  <span class="cal-day">1</span>
                  <span class="cal-day">2</span>
                  <span class="cal-day">3</span>
                  <span class="cal-day">4</span>
                  <span class="cal-day">5</span>
                  <span class="cal-day">6</span>
                  <span class="cal-day">7</span>
                  <span class="cal-day">8</span>
                  <span class="cal-day">9</span>
                  <span class="cal-day">10</span>
                  <span class="cal-day">11</span>
                  <span class="cal-day">12</span>
                  <span class="cal-day">13</span>
                  <span class="cal-day">14</span>
                  <span class="cal-day">15</span>
                  <span class="cal-day">16</span>
                  <span class="cal-day">17</span>
                  <span class="cal-day">18</span>
                  <span class="cal-day">19</span>
                  <span class="cal-day">20</span>
                  <span class="cal-day">21</span>
                  <span class="cal-day today">22</span>
                  <span class="cal-day">23</span>
                  <span class="cal-day">24</span>
                  <span class="cal-day">25</span>
                  <span class="cal-day">26</span>
                  <span class="cal-day">27</span>
                  <span class="cal-day">28</span>
                  <span class="cal-day">29</span>
                  <span class="cal-day">30</span>
                  <span class="cal-day">31</span>
                  <span class="cal-day">1</span>
                </div>
              </div>
              <div class="calendar-legend">
                <span class="legend-item"><span class="legend-dot amber"></span> Auditorías</span>
                <span class="legend-item"><span class="legend-dot blue"></span> Reuniones</span>
                <span class="legend-item"><span class="legend-dot green"></span> Capacitaciones</span>
              </div>
            </div>

            <!-- Próximas Actividades -->
            <div class="card upcoming-card">
              <div class="card-header">
                <h3>Próximas actividades</h3>
                <button class="link-btn">Ver todas</button>
              </div>
              <div class="upcoming-list">
                <div v-for="(event, idx) in upcomingEvents" :key="idx" class="upcoming-item">
                  <div class="upcoming-date">
                    <span class="day-num">{{ event.day }}</span>
                    <span class="day-month">{{ event.month }}</span>
                  </div>
                  <div class="upcoming-info">
                    <span class="upcoming-title">{{ event.title }}</span>
                    <span class="upcoming-client">{{ event.client }}</span>
                    <span class="upcoming-time">{{ event.time }}</span>
                  </div>
                  <span class="upcoming-badge" :class="event.type">{{ event.typeLabel }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Projects by Status + Recent Quotes -->
          <div class="dashboard-bottom">
            <!-- Proyectos por Estado -->
            <div class="card projects-card">
              <div class="card-header">
                <h3>Proyectos por estado</h3>
                <button class="link-btn">Ver reporte</button>
              </div>
              <div class="projects-chart-area">
                <div class="donut-container">
                  <svg viewBox="0 0 120 120" class="donut-svg">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#F59E0B" stroke-width="16" stroke-dasharray="144.5 166.5" stroke-dashoffset="0" transform="rotate(-90 60 60)"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#3B82F6" stroke-width="16" stroke-dasharray="94.2 216.8" stroke-dashoffset="-144.5" transform="rotate(-90 60 60)"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#10B981" stroke-width="16" stroke-dasharray="56.5 254.5" stroke-dashoffset="-238.7" transform="rotate(-90 60 60)"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#EF4444" stroke-width="16" stroke-dasharray="22 289" stroke-dashoffset="-295.2" transform="rotate(-90 60 60)"/>
                  </svg>
                  <div class="donut-center">
                    <span class="donut-value">52</span>
                    <span class="donut-label">Total</span>
                  </div>
                </div>
                <div class="projects-legend">
                  <div class="legend-row">
                    <span class="legend-dot-rect amber"></span>
                    <span class="legend-text">En ejecución</span>
                    <span class="legend-count">24 (46%)</span>
                  </div>
                  <div class="legend-row">
                    <span class="legend-dot-rect blue"></span>
                    <span class="legend-text">Finalizados</span>
                    <span class="legend-count">18 (35%)</span>
                  </div>
                  <div class="legend-row">
                    <span class="legend-dot-rect green"></span>
                    <span class="legend-text">Pendientes</span>
                    <span class="legend-count">6 (12%)</span>
                  </div>
                  <div class="legend-row">
                    <span class="legend-dot-rect red"></span>
                    <span class="legend-text">Cancelados</span>
                    <span class="legend-count">4 (7%)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cotizaciones Recientes -->
            <div class="card quotes-card">
              <div class="card-header">
                <h3>Cotizaciones recientes</h3>
              </div>
              <div class="quotes-table-wrap">
                <table class="quotes-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Valor</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="quote in recentQuotes" :key="quote.id">
                      <td class="q-id">{{ quote.id }}</td>
                      <td>{{ quote.client }}</td>
                      <td>{{ quote.service }}</td>
                      <td class="q-value">{{ quote.value }}</td>
                      <td><span class="q-status" :class="quote.statusClass">{{ quote.status }}</span></td>
                      <td class="q-date">{{ quote.date }}</td>
                      <td>
                        <button class="q-action" title="Ver">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button class="card-footer-btn">
                Ver todas las cotizaciones
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Bottom Metrics Row -->
          <div class="metrics-row">
            <div class="metric-card">
              <div class="metric-icon blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Tasa de conversión</span>
                <span class="metric-value">35%</span>
                <span class="metric-sub">Este mes</span>
              </div>
              <div class="metric-sparkline">
                <svg viewBox="0 0 60 24" class="sparkline-svg">
                  <polyline points="0,20 10,18 20,15 30,18 40,10 50,12 60,5" fill="none" stroke="#3B82F6" stroke-width="1.5"/>
                </svg>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon amber">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Clientes nuevos</span>
                <span class="metric-value">18</span>
                <span class="metric-sub">Este mes</span>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Proyectos activos</span>
                <span class="metric-value">24</span>
                <span class="metric-sub">Este mes</span>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Satisfacción clientes</span>
                <span class="metric-value">4.8 / 5</span>
                <span class="metric-sub">Promedio</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== CLIENTES ========== -->
        <div v-if="currentSection === 'clientes'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Clientes</h2>
              <p class="page-subtitle">Gestiona la información de tus clientes.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>Módulo de Clientes</h3>
            <p>Próximamente podrás gestionar todos tus clientes desde aquí.</p>
          </div>
        </div>

        <!-- ========== PROYECTOS ========== -->
        <div v-if="currentSection === 'proyectos'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Proyectos</h2>
              <p class="page-subtitle">Administra tus proyectos en curso y finalizados.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">📁</div>
            <h3>Módulo de Proyectos</h3>
            <p>Próximamente podrás gestionar todos tus proyectos desde aquí.</p>
          </div>
        </div>

        <!-- ========== COTIZACIONES ========== -->
        <div v-if="currentSection === 'cotizaciones'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Cotizaciones</h2>
              <p class="page-subtitle">Visualiza y gestiona todas las cotizaciones.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>Módulo de Cotizaciones</h3>
            <p>Próximamente podrás gestionar todas tus cotizaciones desde aquí.</p>
          </div>
        </div>

        <!-- ========== SERVICIOS ========== -->
        <div v-if="currentSection === 'servicios'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Servicios</h2>
              <p class="page-subtitle">Administra los servicios que ofreces.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">⚙️</div>
            <h3>Módulo de Servicios</h3>
            <p>Próximamente podrás gestionar tus servicios desde aquí.</p>
          </div>
        </div>

        <!-- ========== RECURSOS ========== -->
        <div v-if="currentSection === 'recursos'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Recursos</h2>
              <p class="page-subtitle">Gestiona los recursos disponibles.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>Módulo de Recursos</h3>
            <p>Próximamente podrás gestionar tus recursos desde aquí.</p>
          </div>
        </div>

        <!-- ========== CALENDARIO ========== -->
        <div v-if="currentSection === 'calendario'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Calendario</h2>
              <p class="page-subtitle">Organiza tus eventos y actividades.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>Módulo de Calendario</h3>
            <p>Próximamente podrás gestionar tu calendario desde aquí.</p>
          </div>
        </div>

        <!-- ========== REPORTES ========== -->
        <div v-if="currentSection === 'reportes'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Reportes</h2>
              <p class="page-subtitle">Genera y consulta reportes detallados.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">📊</div>
            <h3>Módulo de Reportes</h3>
            <p>Próximamente podrás generar reportes desde aquí.</p>
          </div>
        </div>

        <!-- ========== USUARIOS ========== -->
        <div v-if="currentSection === 'usuarios'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Usuarios</h2>
              <p class="page-subtitle">Administra los usuarios del sistema.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">👤</div>
            <h3>Módulo de Usuarios</h3>
            <p>Próximamente podrás gestionar los usuarios desde aquí.</p>
          </div>
        </div>

        <!-- ========== CONFIGURACIÓN ========== -->
        <div v-if="currentSection === 'configuracion'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Configuración</h2>
              <p class="page-subtitle">Ajusta la configuración del sistema.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">⚙️</div>
            <h3>Módulo de Configuración</h3>
            <p>Próximamente podrás configurar el sistema desde aquí.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api/authService'

const router = useRouter()
const currentSection = ref('dashboard')
const sidebarOpen = ref(false)
const userAvatar = ref<string | null>(null)

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { id: 'clientes', label: 'Clientes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { id: 'proyectos', label: 'Proyectos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 'servicios', label: 'Servicios', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/></svg>' },
  { id: 'recursos', label: 'Recursos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
  { id: 'calendario', label: 'Calendario', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { id: 'reportes', label: 'Reportes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
  { id: 'usuarios', label: 'Usuarios', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id: 'configuracion', label: 'Configuración', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
]

const recentActivities = [
  { text: 'Cotización enviada a EBM Metrology S.A.S.', time: 'Hace 10 minutos', type: 'blue', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { text: 'Nuevo cliente registrado: Laboratorio de Ensayos García S.A.S.', time: 'Hace 20 minutos', type: 'green', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>' },
  { text: 'Auditoría programada ISO 45001:2017 – EBM Metrology S.A.S.', time: 'Hace 2 horas', type: 'amber', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { text: 'Recurso descargado: Guía práctica ISO 9001:2015', time: 'Hace 3 horas', type: 'purple', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' },
]

const upcomingEvents = [
  { day: '23', month: 'MAY', title: 'Auditoría interna ISO 17025', client: 'EBM Metrology S.A.S.', time: '09:00 AM - 01:00 PM', type: 'audit', typeLabel: 'Auditoría' },
  { day: '24', month: 'MAY', title: 'Reunión de seguimiento', client: 'Proyecto implementación SG', time: '10:00 AM - 11:00 AM', type: 'meeting', typeLabel: 'Reunión' },
  { day: '27', month: 'MAY', title: 'Capacitación ISO 9001:2015', client: 'Fundamentos y requisitos', time: '02:00 PM - 05:00 PM', type: 'training', typeLabel: 'Capacitación' },
]

const recentQuotes = [
  { id: 'COT-2025-045', client: 'EBM Metrology S.A.S.', service: 'Auditoría ISO 17025', value: '$ 5.800.000', status: 'Enviada', statusClass: 'sent', date: '22 may 2025' },
  { id: 'COT-2025-044', client: 'Laboratorio García S.A.S.', service: 'Implementación SG', value: '$ 12.500.000', status: 'Pendiente', statusClass: 'pending', date: '21 may 2025' },
  { id: 'COT-2025-043', client: 'Industrias del Norte S.A.', service: 'Capacitación ISO 9001', value: '$ 4.200.000', status: 'Borrador', statusClass: 'draft', date: '20 may 2025' },
  { id: 'COT-2025-042', client: 'Energía Eléctrica S.A.S.', service: 'Auditoría ISO 9001', value: '$ 6.750.000', status: 'Aprobada', statusClass: 'approved', date: '19 may 2025' },
  { id: 'COT-2025-041', client: 'Farma Salud S.A.S.', service: 'Consultoría Regulatoria', value: '$ 8.900.000', status: 'Rechazada', statusClass: 'rejected', date: '18 may 2025' },
]

const setSection = (section: string) => {
  currentSection.value = section
  sidebarOpen.value = false
}

const handleLogout = () => {
  if (confirm('¿Estás seguro de cerrar sesión?')) {
    authService.logout()
    router.push('/')
  }
}
</script>

<style scoped>
/* ===== RESET & VARIABLES ===== */
.admin-layout, .admin-layout *, .admin-layout *::before, .admin-layout *::after { box-sizing: border-box; margin: 0; padding: 0; }

.admin-layout {
  --c-primary: #C89B2D;
  --c-primary-hover: #B8892A;
  --c-black: #1F2937;
  --c-dark: #111827;
  --c-sidebar: #FFFFFF;
  --c-white: #FFFFFF;
  --c-light: #F9FAFB;
  --c-gray: #6B7280;
  --c-gray-light: #9CA3AF;
  --c-border: #E5E7EB;
  --c-success: #10B981;
  --c-danger: #EF4444;
  --c-warning: #F59E0B;
  --c-info: #3B82F6;
  --sidebar-w: 220px;
  --topbar-h: 72px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  min-height: 100vh;
  background: var(--c-light);
  color: var(--c-black);
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: var(--sidebar-w);
  background: var(--c-sidebar);
  border-right: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}

.sidebar-header {
  padding: 10px;
  border-bottom: 1px solid var(--c-border);
}

.sidebar-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  height: 80px;
  width: auto;
  object-fit: contain;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: none;
  color: var(--c-gray);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: var(--c-light);
  color: var(--c-black);
}

.nav-item.active {
  background: rgba(200, 155, 45, 0.1);
  color: var(--c-primary);
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
}

.nav-item.active .nav-icon {
  color: var(--c-primary);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--c-border);
}

.logout-btn {
  color: var(--c-gray) !important;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.08) !important;
  color: #DC2626 !important;
}

.sidebar-overlay { display: none; }

/* ===== MAIN AREA ===== */
.main-area {
  flex: 1;
  margin-left: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== TOPBAR ===== */
.topbar {
  height: var(--topbar-h);
  background: var(--c-white);
  border-bottom: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--c-gray);
  padding: 6px;
  border-radius: 8px;
}
.menu-toggle:hover { background: var(--c-light); }

.home-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--c-border);
  background: var(--c-white);
  color: var(--c-gray);
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.home-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
  background: rgba(200, 155, 45, 0.04);
}

.topbar-greeting {
  display: flex;
  flex-direction: column;
}

.topbar-greeting h1 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--c-black);
}

.topbar-greeting p {
  font-size: 0.8rem;
  color: var(--c-gray);
}

.topbar-search {
  flex: 1;
  max-width: 320px;
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
}

.topbar-search .search-icon {
  position: absolute;
  left: 14px;
  color: var(--c-gray-light);
  pointer-events: none;
}

.topbar-search .search-input {
  width: 100%;
  padding: 10px 16px 10px 42px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-light);
  font-size: 0.88rem;
  color: var(--c-black);
  outline: none;
  transition: all 0.2s ease;
}

.topbar-search .search-input:focus {
  border-color: var(--c-primary);
  background: var(--c-white);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.1);
}

.topbar-search .search-input::placeholder { color: var(--c-gray-light); }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  position: relative;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--c-gray);
  transition: all 0.2s ease;
}
.action-btn:hover { background: var(--c-light); color: var(--c-black); }

.action-btn .badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--c-primary);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: none;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--c-black);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.export-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }

.topbar-user {
  display: flex;
  align-items: center;
}

.user-avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B5CF6, #6366F1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 700;
  overflow: hidden;
}

.user-avatar-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 0.88rem;
  color: var(--c-gray);
}

/* ===== STATS ROW ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
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

.stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.stat-icon.amber { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.stat-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
.stat-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.stat-label {
  font-size: 0.78rem;
  color: var(--c-gray);
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--c-black);
  line-height: 1.2;
}

.stat-change {
  font-size: 0.72rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
}

.stat-change.up { color: var(--c-success); }
.stat-change.down { color: var(--c-danger); }

.stat-sub {
  font-size: 0.72rem;
  color: var(--c-gray);
  margin-top: 2px;
}

.stat-sparkline {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80px;
  height: 30px;
  opacity: 0.6;
}

.sparkline-svg {
  width: 100%;
  height: 100%;
}

/* ===== DASHBOARD MIDDLE ===== */
.dashboard-middle {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

/* ===== CARDS ===== */
.card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.card-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-black);
}

.link-btn {
  background: none;
  border: none;
  color: var(--c-primary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.link-btn:hover { background: rgba(200, 155, 45, 0.08); }

/* ===== ACTIVITY ===== */
.activity-list {
  padding: 0 20px 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--c-border);
}

.activity-item:last-child { border-bottom: none; }

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.activity-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
.activity-icon.amber { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.activity-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-text {
  font-size: 0.82rem;
  color: var(--c-black);
  line-height: 1.4;
}

.activity-time {
  font-size: 0.72rem;
  color: var(--c-gray);
}

/* ===== CALENDAR ===== */
.calendar-card .card-header {
  flex-wrap: wrap;
  gap: 8px;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-month {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-black);
}

.cal-nav-btn {
  background: none;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  color: var(--c-gray);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cal-nav-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }

.calendar-grid {
  padding: 0 20px 12px;
}

.cal-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;
}

.cal-header span {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--c-gray);
  padding: 4px 0;
}

.cal-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  gap: 2px;
}

.cal-day {
  font-size: 0.78rem;
  padding: 6px 0;
  border-radius: 6px;
  color: var(--c-black);
  cursor: pointer;
}

.cal-day:hover { background: var(--c-light); }
.cal-day.other { color: var(--c-gray-light); }

.cal-day.today {
  background: var(--c-primary);
  color: white;
  font-weight: 700;
}

.calendar-legend {
  display: flex;
  gap: 16px;
  padding: 10px 20px;
  border-top: 1px solid var(--c-border);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--c-gray);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.amber { background: #F59E0B; }
.legend-dot.blue { background: #3B82F6; }
.legend-dot.green { background: #10B981; }

/* ===== UPCOMING ===== */
.upcoming-list {
  padding: 0 20px 16px;
}

.upcoming-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--c-border);
}

.upcoming-item:last-child { border-bottom: none; }

.upcoming-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 40px;
}

.day-num {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--c-primary);
  line-height: 1;
}

.day-month {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
}

.upcoming-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.upcoming-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}

.upcoming-client {
  font-size: 0.72rem;
  color: var(--c-gray);
}

.upcoming-time {
  font-size: 0.7rem;
  color: var(--c-gray-light);
}

.upcoming-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.upcoming-badge.audit { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.upcoming-badge.meeting { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.upcoming-badge.training { background: rgba(16, 185, 129, 0.1); color: #059669; }

/* ===== DASHBOARD BOTTOM ===== */
.dashboard-bottom {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 24px;
}

/* ===== PROJECTS CHART ===== */
.projects-chart-area {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px;
}

.donut-container {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.donut-svg {
  width: 100%;
  height: 100%;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
}

.donut-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--c-black);
  line-height: 1;
}

.donut-label {
  font-size: 0.7rem;
  color: var(--c-gray);
}

.projects-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-dot-rect {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-dot-rect.amber { background: #F59E0B; }
.legend-dot-rect.blue { background: #3B82F6; }
.legend-dot-rect.green { background: #10B981; }
.legend-dot-rect.red { background: #EF4444; }

.legend-text {
  font-size: 0.82rem;
  color: var(--c-black);
  flex: 1;
}

.legend-count {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}

/* ===== QUOTES TABLE ===== */
.quotes-table-wrap {
  overflow-x: auto;
}

.quotes-table {
  width: 100%;
  border-collapse: collapse;
}

.quotes-table th {
  text-align: left;
  padding: 10px 16px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid var(--c-border);
  white-space: nowrap;
}

.quotes-table td {
  padding: 12px 16px;
  font-size: 0.82rem;
  color: var(--c-black);
  border-bottom: 1px solid var(--c-border);
}

.quotes-table tr:last-child td { border-bottom: none; }

.q-id {
  font-weight: 600;
  color: var(--c-primary);
}

.q-value {
  font-weight: 700;
}

.q-date {
  color: var(--c-gray);
  white-space: nowrap;
}

.q-status {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.q-status.sent { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.q-status.pending { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.q-status.draft { background: rgba(107, 114, 128, 0.1); color: #4B5563; }
.q-status.approved { background: rgba(16, 185, 129, 0.1); color: #059669; }
.q-status.rejected { background: rgba(239, 68, 68, 0.1); color: #DC2626; }

.q-action {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--c-gray);
  border-radius: 6px;
}
.q-action:hover { background: var(--c-light); color: var(--c-black); }

.card-footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  border-top: 1px solid var(--c-border);
  color: var(--c-primary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.card-footer-btn:hover { background: rgba(200, 155, 45, 0.04); }

/* ===== METRICS ROW ===== */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.metric-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.metric-icon.amber { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.metric-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
.metric-icon.red { background: rgba(239, 68, 68, 0.1); color: #EF4444; }

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--c-gray);
  font-weight: 500;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--c-black);
  line-height: 1.2;
}

.metric-sub {
  font-size: 0.7rem;
  color: var(--c-gray);
}

.metric-sparkline {
  width: 60px;
  height: 24px;
  flex-shrink: 0;
}

/* ===== SECTION TOP ===== */
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-top h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--c-black);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 0.88rem;
  color: var(--c-gray);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .dashboard-middle { grid-template-columns: 1fr; }
  .dashboard-bottom { grid-template-columns: 1fr; }
  .metrics-row { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar-open .sidebar {
    transform: translateX(0);
  }
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 90;
  }
  .main-area {
    margin-left: 0;
  }
  .menu-toggle {
    display: flex;
  }
  .topbar {
    padding: 0 16px;
    gap: 12px;
  }
  .topbar-greeting h1 { font-size: 1rem; }
  .topbar-greeting p { font-size: 0.72rem; }
  .topbar-search { display: none; }
  .export-btn { display: none; }
  .stats-row { grid-template-columns: 1fr; }
  .metrics-row { grid-template-columns: 1fr; }
  .main-content { padding: 16px; }
}
</style>
