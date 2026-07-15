<template>
  <div class="admin-layout" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-logo">
          <img src="/images/logof.png" alt="DISEF" class="logo-img" />
        </router-link>
        <p class="sidebar-subtitle">Comercializadora Industrial</p>
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
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout" @click="handleLogout">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span class="nav-label">Cerrar sesión</span>
        </button>
        <p class="copyright">DISEF Comercializadora Industrial<br/>© 2025 Todos los derechos reservados.</p>
      </div>
    </aside>

    <!-- Sidebar overlay (mobile) -->
    <div class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Main Area -->
    <div class="main-area">
      <!-- Topbar -->
      <header class="topbar">
        <router-link to="/" class="home-btn" title="Volver al inicio">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </router-link>
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div class="topbar-search">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Buscar productos, pedidos, clientes..." class="search-input" />
        </div>

        <div class="topbar-actions">
          <button class="action-btn" title="Notificaciones">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="badge">3</span>
          </button>
          <div class="topbar-divider"></div>
          <div class="topbar-user">
            <div class="user-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="user-info">
              <span class="user-name">Administrador</span>
              <span class="user-role">Administrador</span>
            </div>
          </div>
          <button class="logout-btn" title="Cerrar sesión" @click="handleLogout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="main-content">
        <!-- ========== DASHBOARD ========== -->
        <div v-if="currentSection === 'dashboard'">
          <div class="content-header">
            <div>
              <h1 class="page-title">Bienvenido, Administrador</h1>
              <p class="page-subtitle">Aqui tienes un resumen general de tu tienda.</p>
            </div>
            <div class="date-filter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>7 de mayo, 2025 - 7 de junio, 2025</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="stats-row">
            <div class="stat-card" v-for="stat in dashboardStats" :key="stat.label">
              <div class="stat-icon" :style="{ background: stat.iconBg }">
                <span v-html="stat.icon"></span>
              </div>
              <div class="stat-content">
                <span class="stat-label">{{ stat.label }}</span>
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-change" :class="stat.changeType">
                  <svg v-if="stat.changeType === 'up'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  {{ stat.change }} vs mes anterior
                </span>
              </div>
            </div>
          </div>

          <!-- Charts & Recent Orders -->
          <div class="dashboard-grid">
            <!-- Sales Chart -->
            <div class="card chart-card">
              <div class="card-header">
                <h3>Ventas</h3>
                <select class="chart-filter">
                  <option>Mensual</option>
                  <option>Semanal</option>
                </select>
              </div>
              <div class="chart-placeholder">
                <div class="chart-y-axis">
                  <span>$60M</span>
                  <span>$45M</span>
                  <span>$30M</span>
                  <span>$15M</span>
                  <span>$0</span>
                </div>
                <div class="chart-area">
                  <svg viewBox="0 0 600 200" class="chart-svg">
                    <!-- Grid lines -->
                    <line x1="0" y1="0" x2="600" y2="0" stroke="#E5E7EB" stroke-width="1"/>
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#E5E7EB" stroke-width="1"/>
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#E5E7EB" stroke-width="1"/>
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#E5E7EB" stroke-width="1"/>
                    <!-- Area fill -->
                    <path d="M0,180 Q50,170 100,160 T200,120 T300,140 T400,80 T500,60 T600,40 L600,200 L0,200 Z" fill="url(#chartGradient)" opacity="0.3"/>
                    <!-- Line -->
                    <path d="M0,180 Q50,170 100,160 T200,120 T300,140 T400,80 T500,60 T600,40" fill="none" stroke="#F4B400" stroke-width="3"/>
                    <!-- Previous month line -->
                    <path d="M0,170 Q50,175 100,165 T200,150 T300,130 T400,110 T500,90 T600,80" fill="none" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="6,4"/>
                    <!-- Dots -->
                    <circle cx="0" cy="180" r="4" fill="#F4B400"/>
                    <circle cx="100" cy="160" r="4" fill="#F4B400"/>
                    <circle cx="200" cy="120" r="4" fill="#F4B400"/>
                    <circle cx="300" cy="140" r="4" fill="#F4B400"/>
                    <circle cx="400" cy="80" r="4" fill="#F4B400"/>
                    <circle cx="500" cy="60" r="4" fill="#F4B400"/>
                    <circle cx="600" cy="40" r="4" fill="#F4B400"/>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#F4B400" stop-opacity="0.4"/>
                        <stop offset="100%" stop-color="#F4B400" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="chart-x-axis">
                    <span>7 May</span>
                    <span>14 May</span>
                    <span>21 May</span>
                    <span>28 May</span>
                    <span>4 Jun</span>
                  </div>
                </div>
              </div>
              <div class="chart-legend">
                <span class="legend-item"><span class="legend-dot" style="background:#F4B400"></span> Ventas</span>
                <span class="legend-item"><span class="legend-dot" style="background:#E5E7EB"></span> Mes anterior</span>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="card">
              <div class="card-header">
                <h3>Pedidos recientes</h3>
                <button class="link-btn">Ver todos</button>
              </div>
              <div class="orders-list">
                <div v-for="order in recentOrders" :key="order.id" class="order-item">
                  <div class="order-info">
                    <span class="order-id">#{{ order.id }}</span>
                    <span class="order-date">{{ order.date }}</span>
                  </div>
                  <span :class="['order-status', order.statusClass]">{{ order.status }}</span>
                  <span class="order-amount">{{ order.amount }}</span>
                  <button class="order-view" title="Ver detalle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
              <button class="card-footer-btn">
                Ver todos los pedidos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Bottom Row -->
          <div class="dashboard-grid-3">
            <!-- Top Selling Products -->
            <div class="card">
              <div class="card-header">
                <h3>Productos más vendidos</h3>
                <button class="link-btn">Ver todos</button>
              </div>
              <div class="products-top-list">
                <div v-for="item in topProducts" :key="item.name" class="top-product-item">
                  <div class="top-product-img">
                    <span>{{ item.emoji }}</span>
                  </div>
                  <div class="top-product-info">
                    <span class="top-product-name">{{ item.name }}</span>
                    <span class="top-product-sales">Ventas: {{ item.sales }}</span>
                  </div>
                  <span class="top-product-price">{{ item.price }}</span>
                </div>
              </div>
            </div>

            <!-- Inventory Alerts -->
            <div class="card">
              <div class="card-header">
                <h3>Alertas de inventario</h3>
                <button class="link-btn">Ver todas</button>
              </div>
              <div class="alerts-list">
                <div v-for="alert in inventoryAlerts" :key="alert.name" class="alert-item">
                  <div class="alert-img">
                    <span>{{ alert.emoji }}</span>
                  </div>
                  <div class="alert-info">
                    <span class="alert-name">{{ alert.name }}</span>
                    <span class="alert-stock">Stock actual: {{ alert.stock }}</span>
                  </div>
                  <span class="alert-badge">Stock bajo</span>
                </div>
              </div>
            </div>

            <!-- Recent Quotations -->
            <div class="card">
              <div class="card-header">
                <h3>Cotizaciones recientes</h3>
                <button class="link-btn">Ver todas</button>
              </div>
              <div class="quotations-list">
                <div v-for="qt in recentQuotations" :key="qt.id" class="quotation-item">
                  <div class="quotation-info">
                    <span class="quotation-id">{{ qt.id }}</span>
                    <span class="quotation-date">{{ qt.date }}</span>
                  </div>
                  <span :class="['quotation-status', qt.statusClass]">{{ qt.status }}</span>
                  <span class="quotation-amount">{{ qt.amount }}</span>
                </div>
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
        </div>

        <!-- ========== PRODUCTS ========== -->
        <div v-if="currentSection === 'products'">
          <!-- Header -->
          <div class="section-top">
            <div>
              <h2 class="page-title">Productos</h2>
              <p class="page-subtitle">Gestiona y controla todos los productos de tu tienda.</p>
            </div>
            <button class="btn btn-primary" @click="showProductForm = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Agregar productos
            </button>
          </div>

          <!-- Stats Cards -->
          <div class="cat-stats-row">
            <div class="cat-stat-card">
              <div class="cat-stat-icon yellow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ products.length }}</span>
                <span class="cat-stat-label">Total productos</span>
                <span class="cat-stat-sub">Todos los registros</span>
              </div>
            </div>
            <div class="cat-stat-card">
              <div class="cat-stat-icon green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ products.filter(p => p.status === 'available').length }}</span>
                <span class="cat-stat-label">Productos activos</span>
                <span class="cat-stat-sub">{{ Math.round((products.filter(p => p.status === 'available').length / (products.length || 1)) * 100) }}% del total</span>
              </div>
            </div>
            <div class="cat-stat-card">
              <div class="cat-stat-icon red">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ products.filter(p => p.status === 'out-of-stock').length }}</span>
                <span class="cat-stat-label">Productos sin stock</span>
                <span class="cat-stat-sub">Requieren atención</span>
              </div>
            </div>
            <div class="cat-stat-card">
              <div class="cat-stat-icon blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ products.filter(p => p.isShowcase).length }}</span>
                <span class="cat-stat-label">Productos en oferta</span>
                <span class="cat-stat-sub">Activos actualmente</span>
              </div>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="prod-toolbar">
            <div class="prod-toolbar-left">
              <div class="prod-bulk-actions">
                <select class="prod-bulk-select">
                  <option>Acciones en lote</option>
                </select>
                <button class="btn btn-primary btn-sm">Aplicar</button>
              </div>
              <select v-model="selectedCategoryFilter" class="prod-filter-select">
                <option value="">Todas las categorías</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <select v-model="productStatusFilter" class="prod-filter-select">
                <option value="">Estado: Todos</option>
                <option value="available">Activo</option>
                <option value="out-of-stock">Inactivo</option>
                <option value="coming-soon">Próximamente</option>
              </select>
            </div>
            <div class="prod-toolbar-right">
              <div class="search-input-wrapper search-sm">
                <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="search" v-model="searchProducts" placeholder="Buscar producto..." class="search-field" />
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="cat-table-wrap">
            <table class="cat-table products-table">
              <thead>
                <tr>
                  <th class="col-check"><input type="checkbox" /></th>
                  <th class="col-product">Producto</th>
                  <th class="col-category">Categoría</th>
                  <th class="col-price">Precio</th>
                  <th class="col-status">Estado</th>
                  <th class="col-featured">Destacado</th>
                  <th class="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in paginatedProducts" :key="product.id">
                  <td class="col-check"><input type="checkbox" /></td>
                  <td class="col-product">
                    <div class="prod-cell">
                      <div class="prod-thumb">
                        <img v-if="product.images && product.images.length > 0" :src="product.images[0]" :alt="product.name" />
                        <span v-else class="prod-thumb-placeholder">📦</span>
                      </div>
                      <div class="prod-info">
                        <span class="prod-name">{{ product.name }}</span>
                        <span class="prod-desc">{{ product.description || 'Sin descripción' }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="col-category">
                    <span class="prod-category-badge">{{ getCategoryName(product.category) }}</span>
                  </td>
                  <td class="col-price">
                    <span class="prod-price">${{ product.price.toLocaleString() }}</span>
                  </td>
                  <td class="col-status">
                    <span :class="['prod-status-badge', product.status]">{{ getStatusText(product.status) }}</span>
                  </td>
                  <td class="col-featured">
                    <button class="prod-star-btn" :class="{ active: product.isShowcase }" @click="toggleProductFeatured(product)">
                      <svg width="18" height="18" viewBox="0 0 24 24" :fill="product.isShowcase ? '#F4B400' : 'none'" :stroke="product.isShowcase ? '#F4B400' : '#9CA3AF'" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                  </td>
                  <td class="col-actions">
                    <div class="cat-actions">
                      <button class="cat-action-btn" @click="editProduct(product)" title="Editar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="cat-action-btn danger" @click="deleteProductConfirm(product.id)" title="Eliminar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <div class="cat-pagination" v-if="filteredProducts.length > 0">
            <span class="cat-pagination-info">Mostrando {{ (productPage - 1) * productsPerPage + 1 }} a {{ Math.min(productPage * productsPerPage, filteredProducts.length) }} de {{ filteredProducts.length }} productos</span>
            <div class="cat-pagination-btns">
              <button class="page-btn" :disabled="productPage <= 1" @click="productPage--">&lt; Anterior</button>
              <button v-for="p in totalProductPages" :key="p" class="page-btn" :class="{ active: p === productPage }" @click="productPage = p">{{ p }}</button>
              <button class="page-btn" :disabled="productPage >= totalProductPages" @click="productPage++">Siguiente &gt;</button>
            </div>
          </div>

          <!-- Empty states -->
          <div v-if="filteredProducts.length === 0 && !searchProducts" class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>No hay productos</h3>
            <p>Comienza agregando tu primer producto</p>
            <button class="btn btn-primary" @click="showProductForm = true">Crear Primer Producto</button>
          </div>
          <div v-else-if="filteredProducts.length === 0 && searchProducts" class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No se encontraron resultados</h3>
            <p>No hay productos que coincidan con "{{ searchProducts }}"</p>
            <button class="btn btn-secondary" @click="searchProducts = ''">Limpiar búsqueda</button>
          </div>
        </div>

        <!-- ========== CATEGORIES ========== -->
        <div v-if="currentSection === 'categories'">
          <!-- Header -->
          <div class="section-top">
            <div>
              <h2 class="page-title">Categorías</h2>
              <p class="page-subtitle">Gestiona las categorías de productos de tu tienda.</p>
            </div>
            <button class="btn btn-primary" @click="showCategoryForm = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nueva categoría
            </button>
          </div>

          <!-- Stats Cards -->
          <div class="cat-stats-row">
            <div class="cat-stat-card">
              <div class="cat-stat-icon yellow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ categories.length }}</span>
                <span class="cat-stat-label">Total categorías</span>
                <span class="cat-stat-sub">Categorías registradas</span>
              </div>
            </div>
            <div class="cat-stat-card">
              <div class="cat-stat-icon green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ categories.length }}</span>
                <span class="cat-stat-label">Categorías activas</span>
                <span class="cat-stat-sub">Activadas</span>
              </div>
            </div>
            <div class="cat-stat-card">
              <div class="cat-stat-icon red">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">0</span>
                <span class="cat-stat-label">Categorías inactivas</span>
                <span class="cat-stat-sub">Desactivadas</span>
              </div>
            </div>
            <div class="cat-stat-card">
              <div class="cat-stat-icon blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ categories.length }}</span>
                <span class="cat-stat-label">Categorías principales</span>
                <span class="cat-stat-sub">Con subcategorías</span>
              </div>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="cat-toolbar">
            <div class="cat-toolbar-left">
              <select class="cat-bulk-select">
                <option>Acciones en lote</option>
              </select>
              <button class="btn btn-primary btn-sm">Aplicar</button>
            </div>
            <div class="cat-toolbar-right">
              <select class="cat-filter-select">
                <option>Todas las categorías</option>
              </select>
              <div class="cat-search">
                <svg class="cat-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="search" v-model="searchCategories" placeholder="Buscar categoría..." class="cat-search-input" />
              </div>
              <button class="btn btn-outline btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filtros
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="cat-table-container">
            <table class="cat-table">
              <thead>
                <tr>
                  <th class="col-check"><input type="checkbox" /></th>
                  <th class="col-img">Imagen</th>
                  <th class="col-name">Nombre de categoría</th>
                  <th class="col-desc">Descripción</th>
                  <th class="col-products">Productos</th>
                  <th class="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in filteredCategories" :key="category.id">
                  <td class="col-check"><input type="checkbox" /></td>
                  <td class="col-img">
                    <div class="cat-thumb">
                      <img v-if="category.imageUrls && category.imageUrls.length > 0" :src="category.imageUrls[0]" :alt="category.name" />
                      <span v-else class="cat-thumb-placeholder">🏷️</span>
                    </div>
                  </td>
                  <td class="col-name">
                    <span class="cat-name-text">{{ category.name }}</span>
                  </td>
                  <td class="col-desc">
                    <span class="cat-desc-text">{{ category.description || 'Sin descripción' }}</span>
                  </td>
                  <td class="col-products">{{ getProductsInCategory(category.id) }}</td>
                  <td class="col-actions">
                    <div class="cat-actions">
                      <button class="cat-action-btn" @click="editCategory(category)" title="Editar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="cat-action-btn danger" @click="handleDeleteCategory(category.id)" title="Eliminar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <div class="cat-pagination">
            <span class="cat-pagination-info">Mostrando 1 a {{ filteredCategories.length }} de {{ categories.length }} categorías</span>
            <div class="cat-pagination-btns">
              <button class="cat-page-btn" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button class="cat-page-btn active">1</button>
              <button class="cat-page-btn">2</button>
              <button class="cat-page-btn">3</button>
              <button class="cat-page-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Empty states -->
          <div v-if="filteredCategories.length === 0 && !searchCategories" class="empty-state">
            <div class="empty-icon">🏷️</div>
            <h3>No hay categorías</h3>
            <p>Crea categorías para organizar tus productos</p>
            <button class="btn btn-primary" @click="showCategoryForm = true">Crear Primera Categoría</button>
          </div>
          <div v-else-if="filteredCategories.length === 0 && searchCategories" class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No se encontraron resultados</h3>
            <p>No hay categorías que coincidan con "{{ searchCategories }}"</p>
            <button class="btn btn-secondary" @click="searchCategories = ''">Limpiar búsqueda</button>
          </div>
        </div>

        <!-- ========== BRANDS ========== -->
        <div v-if="currentSection === 'brands'">
          <!-- Header -->
          <div class="section-top">
            <div>
              <h2 class="page-title">Marcas</h2>
              <p class="page-subtitle">Gestiona las marcas de productos de tu tienda.</p>
            </div>
            <button class="btn btn-primary" @click="showBrandForm = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nueva marca
            </button>
          </div>

          <!-- Stats Cards -->
          <div class="cat-stats-row">
            <div class="cat-stat-card">
              <div class="cat-stat-icon yellow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ brands.length }}</span>
                <span class="cat-stat-label">Total marcas</span>
                <span class="cat-stat-sub">Marcas registradas</span>
              </div>
            </div>
            <div class="cat-stat-card">
              <div class="cat-stat-icon green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div class="cat-stat-info">
                <span class="cat-stat-value">{{ brands.length }}</span>
                <span class="cat-stat-label">Marcas activas</span>
                <span class="cat-stat-sub">Activadas</span>
              </div>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="cat-toolbar">
            <div class="cat-toolbar-left">
              <select class="cat-bulk-select">
                <option>Acciones en lote</option>
              </select>
              <button class="btn btn-primary btn-sm">Aplicar</button>
            </div>
            <div class="cat-toolbar-right">
              <select class="cat-filter-select">
                <option>Todas las marcas</option>
              </select>
              <div class="cat-search">
                <svg class="cat-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="search" v-model="searchBrands" placeholder="Buscar marca..." class="cat-search-input" />
              </div>
              <button class="btn btn-outline btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filtros
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="brandsLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando marcas...</p>
          </div>

          <!-- Error -->
          <div v-else-if="brandsError" class="error-state">
            <div class="error-icon">⚠️</div>
            <p>{{ brandsError }}</p>
            <button @click="loadBrandsData" class="btn btn-primary">Reintentar</button>
          </div>

          <!-- Table -->
          <div v-else class="cat-table-container">
            <table class="cat-table">
              <thead>
                <tr>
                  <th class="col-check"><input type="checkbox" /></th>
                  <th class="col-img">Imagen</th>
                  <th class="col-name">Nombre de marca</th>
                  <th class="col-desc">Descripción</th>
                  <th class="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="brand in filteredBrands" :key="brand.id">
                  <td class="col-check"><input type="checkbox" /></td>
                  <td class="col-img">
                    <div class="cat-thumb">
                      <img v-if="brand.imageUrls && brand.imageUrls.length > 0" :src="brand.imageUrls[0]" :alt="brand.name" />
                      <span v-else class="cat-thumb-placeholder">🏷️</span>
                    </div>
                  </td>
                  <td class="col-name">
                    <span class="cat-name-text">{{ brand.name }}</span>
                  </td>
                  <td class="col-desc">
                    <span class="cat-desc-text">{{ brand.description || 'Sin descripción' }}</span>
                  </td>
                  <td class="col-actions">
                    <div class="cat-actions">
                      <button class="cat-action-btn" @click="editBrand(brand)" title="Editar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="cat-action-btn danger" @click="handleDeleteBrand(brand.id)" title="Eliminar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <div class="cat-pagination">
            <span class="cat-pagination-info">Mostrando 1 a {{ filteredBrands.length }} de {{ brands.length }} marcas</span>
            <div class="cat-pagination-btns">
              <button class="cat-page-btn" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button class="cat-page-btn active">1</button>
              <button class="cat-page-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Empty states -->
          <div v-if="filteredBrands.length === 0 && !searchBrands" class="empty-state">
            <div class="empty-icon">🏷️</div>
            <h3>No hay marcas</h3>
            <p>Crea marcas para asociar a tus productos</p>
            <button class="btn btn-primary" @click="showBrandForm = true">Crear Primera Marca</button>
          </div>
          <div v-else-if="filteredBrands.length === 0 && searchBrands" class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No se encontraron resultados</h3>
            <p>No hay marcas que coincidan con "{{ searchBrands }}"</p>
            <button class="btn btn-secondary" @click="searchBrands = ''">Limpiar búsqueda</button>
          </div>
        </div>

        <!-- ========== SALES ========== -->
        <div v-if="currentSection === 'sales'">
          <div class="section-top">
            <h2>Resumen de Compras</h2>
            <button class="btn btn-secondary" @click="loadPurchases" :disabled="isLoadingSales">
              {{ isLoadingSales ? 'Cargando...' : 'Actualizar' }}
            </button>
          </div>

          <div v-if="!isLoadingSales && !salesError && sales.length > 0" class="search-bar">
            <div class="search-input-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="search" v-model="searchSales" placeholder="Buscar por cliente o producto..." class="search-field" />
              <button v-if="searchSales" class="search-clear" @click="searchSales = ''">✕</button>
            </div>
          </div>

          <div v-if="isLoadingSales" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando compras...</p>
          </div>

          <div v-else-if="salesError" class="error-state">
            <div class="error-icon">⚠️</div>
            <p>{{ salesError }}</p>
            <button @click="loadPurchases" class="btn btn-primary">Reintentar</button>
          </div>

          <div v-else>
            <div class="sales-stats-row">
              <div class="mini-stat">
                <span class="mini-stat-label">Ingresos Totales</span>
                <span class="mini-stat-value">${{ totalRevenue.toLocaleString() }}</span>
              </div>
              <div class="mini-stat">
                <span class="mini-stat-label">Ventas Pendientes</span>
                <span class="mini-stat-value">{{ pendingSales }}</span>
              </div>
              <div class="mini-stat">
                <span class="mini-stat-label">Total Ventas</span>
                <span class="mini-stat-value">{{ totalSalesCount }}</span>
              </div>
            </div>

            <div class="table-container" v-if="sales.length > 0">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sale in filteredSales" :key="sale.id">
                    <td>
                      <div class="cell-stack">
                        <span class="cell-primary">{{ sale.customerName }}</span>
                        <span class="cell-secondary">{{ sale.customerEmail }}</span>
                      </div>
                    </td>
                    <td>
                      <div v-if="sale.items && sale.items.length === 1" class="cell-stack">
                        <span class="cell-primary">{{ sale.items[0].productName }}</span>
                        <span v-if="sale.items[0].selectedColor" class="cell-secondary">
                          <span class="color-dot" :style="{ backgroundColor: getColorHex(sale.items[0].selectedColor) }"></span>
                          {{ sale.items[0].selectedColor }}
                        </span>
                      </div>
                      <div v-else-if="sale.items && sale.items.length > 1">
                        <span class="products-badge">{{ sale.items.length }} productos</span>
                        <details class="products-details">
                          <summary class="products-toggle">Ver detalles</summary>
                          <ul class="products-list">
                            <li v-for="(item, idx) in sale.items" :key="idx">
                              <span>{{ item.productName }}</span>
                              <span class="item-qty">x{{ item.quantity }}</span>
                            </li>
                          </ul>
                        </details>
                      </div>
                      <span v-else class="cell-primary">{{ sale.productName }}</span>
                    </td>
                    <td>
                      <span class="qty-badge">{{ sale.quantity }}</span>
                    </td>
                    <td>
                      <span class="amount">${{ sale.totalAmount.toLocaleString() }}</span>
                    </td>
                    <td>
                      <span :class="['status-pill', sale.status]">{{ getSaleStatusText(sale.status) }}</span>
                    </td>
                    <td>
                      <span class="cell-secondary">{{ formatDate(sale.date) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">📊</div>
              <h3>No hay ventas registradas</h3>
              <p>Las ventas aparecerán aquí cuando los clientes realicen compras</p>
            </div>
          </div>
        </div>

        <!-- ========== WHATSAPP QUOTES ========== -->
        <div v-if="currentSection === 'whatsapp-quotes'">
          <div class="section-top">
            <h2>Cotizaciones WhatsApp</h2>
          </div>

          <div class="sales-stats-row">
            <div class="mini-stat">
              <span class="mini-stat-label">Total Solicitudes</span>
              <span class="mini-stat-value">{{ whatsappQuotes.length }}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat-label">Pendientes</span>
              <span class="mini-stat-value">{{ whatsappQuotes.filter(q => q.status === 'pending').length }}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat-label">Respondidas</span>
              <span class="mini-stat-value">{{ whatsappQuotes.filter(q => q.status === 'responded').length }}</span>
            </div>
          </div>

          <div v-if="whatsappQuotes.length === 0" class="empty-state">
            <div class="empty-icon">💬</div>
            <h3>No hay cotizaciones por WhatsApp</h3>
            <p>Las solicitudes de cotización aparecerán aquí cuando los clientes envíen mensajes desde el catálogo.</p>
          </div>

          <div v-else class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Empresa</th>
                  <th>Ciudad</th>
                  <th>Teléfono</th>
                  <th>Productos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quote in whatsappQuotes" :key="quote.id">
                  <td><span class="cell-primary">{{ quote.name }}</span></td>
                  <td><span class="cell-secondary">{{ quote.company }}</span></td>
                  <td><span class="cell-secondary">{{ quote.city }}</span></td>
                  <td><span class="cell-secondary">{{ quote.phone }}</span></td>
                  <td><span class="products-badge">{{ quote.productCount }} productos</span></td>
                  <td><span :class="['status-pill', quote.status]">{{ quote.status === 'pending' ? 'Pendiente' : 'Respondida' }}</span></td>
                  <td>
                    <button class="btn btn-sm btn-primary" @click="openWhatsApp(quote)">Responder</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- ========== MODALS ========== -->
    <!-- Modal de Producto -->
    <div v-if="showProductForm" class="modal-overlay" @click="closeProductForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button class="modal-close" @click="closeProductForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-group">
              <label>Nombre del Producto *</label>
              <input v-model="productForm.name" type="text" class="form-input" required placeholder="Ej: iPhone 15 Pro" />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="productForm.description" class="form-input" rows="3" placeholder="Describe las características principales del producto"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Precio *</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input :value="formatPriceInput(productForm.price)" @input="handlePriceInput($event, 'price')" type="text" class="form-input" required placeholder="0" />
                </div>
              </div>
              <div class="form-group">
                <label>Precio Original (descuento)</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input :value="formatPriceInput(productForm.originalPrice)" @input="handlePriceInput($event, 'originalPrice')" type="text" class="form-input" placeholder="0" />
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Categoría *</label>
                <select v-model="productForm.category" class="form-input" required>
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Estado de Disponibilidad *</label>
                <select v-model="productForm.status" class="form-input" required>
                  <option value="available">✅ Disponible</option>
                  <option value="out-of-stock">❌ Sin Stock</option>
                  <option value="coming-soon">🔜 Próximamente</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="productForm.isShowcase" />
                <span>⭐ Producto Destacado</span>
              </label>
              <p class="form-help">Marcar para mostrar en la sección de Productos Destacados del inicio</p>
            </div>
            <div class="form-group">
              <label>Materiales Disponibles</label>
              <div class="materials-grid">
                <button v-for="material in materialOptions" :key="material" type="button" class="material-chip" :class="{ selected: isMaterialSelected(material) }" @click="toggleProductMaterial(material)">
                  {{ material }}
                </button>
              </div>
              <div v-if="productForm.colors.length > 0" class="selected-materials">
                <span class="selected-label">Seleccionados: </span>
                <span class="selected-list">{{ productForm.colors.join(', ') }}</span>
              </div>
            </div>
            <div class="form-group">
              <label>Imagen del Producto (URL) *</label>
              <div class="image-urls">
                <div class="image-url-row">
                  <input :value="productForm.images[0]" @input="(e) => updateImageUrl(0, (e.target as HTMLInputElement).value)" type="text" class="form-input" placeholder="https://ejemplo.com/imagen.jpg" />
                </div>
              </div>

              <div v-if="productForm.images[0] && productForm.images[0].trim()" class="images-preview-grid" style="margin-top: 12px;">
                <div class="image-preview-item">
                  <img :src="getPreviewUrl(productForm.images[0])" alt="Vista previa" />
                  <span class="image-index">Principal</span>
                </div>
              </div>

              <div v-else class="preview-placeholder" style="margin-top: 12px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <p>Pega una URL de imagen para ver la vista previa</p>
              </div>
            </div>
            <div v-if="productForm.originalPrice && productForm.originalPrice > productForm.price" class="discount-info">
              <span class="discount-badge">💰 Descuento: {{ Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100) }}%</span>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeProductForm">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
                {{ editingProduct ? 'Actualizar Producto' : 'Crear Producto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Categoría -->
    <div v-if="showCategoryForm" class="modal-overlay" @click="closeCategoryForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button class="modal-close" @click="closeCategoryForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCategory">
            <div class="form-group">
              <label>Nombre de la Categoría</label>
              <input v-model="categoryForm.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="categoryForm.description" class="form-input" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Imágenes de la Categoría (URLs)</label>
              <div class="image-urls">
                <div v-for="(_, index) in categoryImageUrls" :key="index" class="image-url-row">
                  <input :value="categoryImageUrls[index]" @input="(e) => updateCategoryImageUrl(index, (e.target as HTMLInputElement).value)" type="text" class="form-input" placeholder="https://ejemplo.com/imagen.jpg" />
                  <button type="button" class="btn btn-secondary btn-sm" @click="removeCategoryImageUrl(index)" :disabled="categoryImageUrls.length <= 1">✕</button>
                </div>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" @click="addCategoryImageUrl" style="margin-top: 8px;">+ Agregar otra URL</button>
              <div v-if="categoryImageUrls.some(i => i.trim())" class="images-preview-grid" style="margin-top: 12px;">
                <div v-for="(image, index) in categoryImageUrls" :key="`cat-${index}-${image}`" class="image-preview-item" v-show="image.trim()">
                  <img :src="image" :alt="`Preview ${index + 1}`" />
                  <span class="image-index">{{ index + 1 }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeCategoryForm">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ editingCategory ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Brand Form Modal -->
    <div v-if="showBrandForm" class="modal-overlay" @click="closeBrandForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingBrand ? 'Editar Marca' : 'Nueva Marca' }}</h3>
          <button class="modal-close" @click="closeBrandForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveBrand">
            <div class="form-group">
              <label>Nombre de la Marca</label>
              <input v-model="brandForm.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="brandForm.description" class="form-input" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Imágenes de la Marca (URLs)</label>
              <div class="image-urls">
                <div v-for="(_, index) in brandImageUrls" :key="index" class="image-url-row">
                  <input :value="brandImageUrls[index]" @input="(e) => updateBrandImageUrl(index, (e.target as HTMLInputElement).value)" type="text" class="form-input" placeholder="https://ejemplo.com/imagen.jpg" />
                  <button type="button" class="btn btn-secondary btn-sm" @click="removeBrandImageUrl(index)" :disabled="brandImageUrls.length <= 1">✕</button>
                </div>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" @click="addBrandImageUrl" style="margin-top: 8px;">+ Agregar otra URL</button>
              <div v-if="brandImageUrls.some(i => i.trim())" class="images-preview-grid" style="margin-top: 12px;">
                <div v-for="(image, index) in brandImageUrls" :key="`brand-${index}-${image}`" class="image-preview-item" v-show="image.trim()">
                  <img :src="image" :alt="`Preview ${index + 1}`" />
                  <span class="image-index">{{ index + 1 }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeBrandForm">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ editingBrand ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useBrands } from '@/composables/useBrands'
import type { Product } from '@/types/ProductType'
import type { Category, CreateCategoryRequest } from '@/types/CategoryType'
import type { Brand, CreateBrandRequest } from '@/types/BrandType'
import { paymentService } from '@/services/api/paymentService'
import type { Purchase, ProductPaymentItem } from '@/services/api/paymentService'
import { authService } from '@/services/api/authService'

interface Sale {
  id: string
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  quantity: number
  unitPrice: number
  totalAmount: number
  status: 'completed' | 'pending' | 'cancelled'
  date: Date
  selectedColor?: string
  items?: ProductPaymentItem[]
}

const router = useRouter()
const currentSection = ref('dashboard')
const sidebarOpen = ref(false)
const showProductForm = ref(false)
const showCategoryForm = ref(false)
const editingProduct = ref<Product | null>(null)
const editingCategory = ref<Category | null>(null)
const searchProducts = ref('')
const searchCategories = ref('')
const searchSales = ref('')
const selectedCategoryFilter = ref('')
const productStatusFilter = ref('')
const productPage = ref(1)
const productsPerPage = 8

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { id: 'products', label: 'Productos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
  { id: 'categories', label: 'Categorías', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>' },
  { id: 'brands', label: 'Marcas', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>' },
  { id: 'orders', label: 'Pedidos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', badge: '12' },
  { id: 'clients', label: 'Clientes', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { id: 'inventory', label: 'Inventario', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
  { id: 'sales', label: 'Cotizaciones', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 'whatsapp-quotes', label: 'Cotizaciones WhatsApp', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/></svg>' },
  { id: 'blog', label: 'Blog', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' },
  { id: 'banners', label: 'Banners', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
  { id: 'users', label: 'Usuarios', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id: 'settings', label: 'Configuración', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' }
]

const dashboardStats = computed(() => [
  {
    label: 'Ventas Totales',
    value: `$${totalRevenue.value.toLocaleString()}`,
    change: `${Math.round((totalSalesCount.value / 10) * 100) || 18.5}%`,
    changeType: 'up',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    iconBg: 'linear-gradient(135deg, #F4B400, #FFC107)'
  },
  {
    label: 'Productos',
    value: products.value.length.toString(),
    change: '8.2%',
    changeType: 'up',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    iconBg: 'linear-gradient(135deg, #F4B400, #FFC107)'
  },
  {
    label: 'Pedidos',
    value: totalSalesCount.value.toString(),
    change: '12.7%',
    changeType: 'up',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    iconBg: 'linear-gradient(135deg, #F4B400, #FFC107)'
  },
  {
    label: 'Clientes',
    value: new Set(sales.value.map(s => s.customerEmail)).size.toString() || '1',
    change: '9.1%',
    changeType: 'up',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    iconBg: 'linear-gradient(135deg, #F4B400, #FFC107)'
  },
  {
    label: 'Cotizaciones',
    value: totalSalesCount.value.toString(),
    change: '15.4%',
    changeType: 'up',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    iconBg: 'linear-gradient(135deg, #F4B400, #FFC107)'
  }
])

const recentOrders = computed(() => sales.value.slice(0, 5).map(s => ({
  id: s.id,
  date: formatDate(s.date),
  status: getSaleStatusText(s.status),
  statusClass: s.status,
  amount: `$${s.totalAmount.toLocaleString()}`
})))

const topProducts = [
  { name: 'Guantes Dieléctricos Clase 00', emoji: '🧤', sales: '152', price: '$120.000' },
  { name: 'Multímetro Fluke 117', emoji: '🔧', sales: '98', price: '$850.000' },
  { name: 'Casco Dieléctrico Class E', emoji: '⛑️', sales: '76', price: '$45.000' },
  { name: 'Botas Dieléctricas Dielectric', emoji: '👢', sales: '62', price: '$320.000' }
]

const inventoryAlerts = [
  { name: 'Cable THHN #12', emoji: '🔌', stock: '5 rollos' },
  { name: 'Breaker Termomagnético 2x20A', emoji: '⚡', stock: '3 unidades' },
  { name: 'Relé Térmico 9-13A', emoji: '🔌', stock: '2 unidades' },
  { name: 'Conector Eléctrico Tipo U', emoji: '🔌', stock: '4 unidades' }
]

const recentQuotations = [
  { id: 'COT-0054', date: '7 Jun, 2025', status: 'Pendiente', statusClass: 'pending', amount: '$3.250.000' },
  { id: 'COT-0053', date: '6 Jun, 2025', status: 'Pendiente', statusClass: 'pending', amount: '$1.850.000' },
  { id: 'COT-0052', date: '5 Jun, 2025', status: 'Aprobada', statusClass: 'completed', amount: '$4.500.000' },
  { id: 'COT-0051', date: '5 Jun, 2025', status: 'Pendiente', statusClass: 'pending', amount: '$950.000' },
  { id: 'COT-0050', date: '4 Jun, 2025', status: 'Rechazada', statusClass: 'cancelled', amount: '$1.200.000' }
]

const { products: backendProducts, categories, availableProducts, addProduct, updateProduct, deleteProduct, loadCategories, loadProducts, addCategory, updateCategory, deleteCategory } = useProducts()
const products = backendProducts

const categoryDropdownOpen = ref(false)
const categoryDropdownRef = ref<HTMLElement | null>(null)

const selectedCategoryLabel = computed(() => {
  const selectedId = selectedCategoryFilter.value
  if (!selectedId) return 'Todas'
  const found = categories.value.find(c => c.id === selectedId)
  return found?.name || 'Todas'
})

const toggleCategoryDropdown = () => { categoryDropdownOpen.value = !categoryDropdownOpen.value }
const closeCategoryDropdown = () => { categoryDropdownOpen.value = false }
const selectCategoryFilter = (categoryId: string) => { selectedCategoryFilter.value = categoryId; closeCategoryDropdown() }

const onCategoryDropdownDocumentClick = (event: MouseEvent) => {
  if (!categoryDropdownOpen.value) return
  const target = event.target as Node | null
  const root = categoryDropdownRef.value
  if (!target || !root) { closeCategoryDropdown(); return }
  if (!root.contains(target)) closeCategoryDropdown()
}

onMounted(async () => {
  await loadCategories()
  await loadProducts()
  await loadPurchases()
  await loadBrandsData()
  document.addEventListener('click', onCategoryDropdownDocumentClick)
})

onBeforeUnmount(() => { document.removeEventListener('click', onCategoryDropdownDocumentClick) })

watch(categories, (newCategories) => {
  console.log('Categorías:', newCategories.length)
}, { deep: true })

watch([selectedCategoryFilter, productStatusFilter, searchProducts], () => {
  productPage.value = 1
})

const sales = ref<Sale[]>([])
const isLoadingSales = ref(false)
const salesError = ref('')

const transformPurchaseToSale = (purchase: Purchase): Sale => {
  const firstItem = purchase.items?.[0]
  const itemCount = purchase.items?.length || 0
  const totalQuantity = purchase.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  let productName = 'Múltiples productos'
  if (itemCount === 1) { productName = firstItem?.productName || 'Producto desconocido' }
  else if (itemCount > 1) { productName = `${itemCount} productos diferentes` }
  return {
    id: purchase.id.toString(),
    productId: '',
    productName,
    customerName: purchase.buyerName,
    customerEmail: purchase.buyerEmail,
    quantity: totalQuantity,
    unitPrice: firstItem?.unitPrice || 0,
    totalAmount: purchase.amount,
    status: mapPurchaseStatus(purchase.status),
    date: new Date(purchase.createdAt),
    selectedColor: firstItem?.selectedColor,
    items: purchase.items
  }
}

const mapPurchaseStatus = (status: string): 'completed' | 'pending' | 'cancelled' => {
  const upperStatus = status.toUpperCase()
  if (upperStatus === 'COMPLETED' || upperStatus === 'APPROVED') return 'completed'
  if (upperStatus === 'CANCELLED' || upperStatus === 'REJECTED') return 'cancelled'
  return 'pending'
}

const loadPurchases = async () => {
  isLoadingSales.value = true
  salesError.value = ''
  try {
    const response = await paymentService.getAllPurchases()
    if (response.success && response.data) {
      sales.value = response.data.purchases.map(transformPurchaseToSale)
    } else {
      salesError.value = 'No se pudieron cargar las compras'
    }
  } catch {
    salesError.value = 'Error al cargar las compras'
  } finally {
    isLoadingSales.value = false
  }
}

const productForm = ref({
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  images: [''] as string[],
  category: '',
  status: 'available' as 'available' | 'out-of-stock' | 'coming-soon',
  colors: [] as string[],
  isShowcase: false
})

const getPreviewUrl = (url: string) => url || ''

const materialOptions = ['Esmeralda', 'Oro', 'Plata']
const categoryForm = ref<CreateCategoryRequest>({ name: '', description: '' })
const categoryImageUrls = ref<string[]>([''])

const { brands, loading: brandsLoading, error: brandsError, loadBrands, createBrand, updateBrand, deleteBrand } = useBrands()
const showBrandForm = ref(false)
const editingBrand = ref<Brand | null>(null)
const searchBrands = ref('')
const brandForm = ref<CreateBrandRequest>({ name: '', description: '' })
const brandImageUrls = ref<string[]>([''])

const availableProductsCount = computed(() => availableProducts.value.length)
const totalValue = computed(() => sales.value.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.totalAmount, 0))
const completedSales = computed(() => sales.value.filter(s => s.status === 'completed'))
const totalRevenue = computed(() => completedSales.value.reduce((sum, s) => sum + s.totalAmount, 0))
const pendingSales = computed(() => sales.value.filter(s => s.status === 'pending').length)
const totalSalesCount = computed(() => sales.value.length)

const filteredProducts = computed(() => {
  let baseList = selectedCategoryFilter.value ? products.value.filter(p => p.category === selectedCategoryFilter.value) : products.value
  if (productStatusFilter.value) {
    baseList = baseList.filter(p => p.status === productStatusFilter.value)
  }
  if (!searchProducts.value.trim()) return baseList
  const q = searchProducts.value.toLowerCase().trim()
  return baseList.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
})

const totalProductPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / productsPerPage)))
const paginatedProducts = computed(() => {
  const start = (productPage.value - 1) * productsPerPage
  return filteredProducts.value.slice(start, start + productsPerPage)
})

const getCategoryName = (categoryId: string): string => {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat?.name || 'Sin categoría'
}

const toggleProductFeatured = async (product: Product) => {
  await updateProduct(product.id, { isShowcase: !product.isShowcase })
  await loadProducts()
}

const filteredCategories = computed(() => {
  if (!searchCategories.value.trim()) return categories.value
  const q = searchCategories.value.toLowerCase().trim()
  return categories.value.filter(c => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
})

const filteredSales = computed(() => {
  if (!searchSales.value.trim()) return sales.value
  const q = searchSales.value.toLowerCase().trim()
  return sales.value.filter(s => s.customerName.toLowerCase().includes(q) || s.customerEmail.toLowerCase().includes(q) || s.productName.toLowerCase().includes(q) || (s.items && s.items.some(i => i.productName.toLowerCase().includes(q))))
})

const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = { 'esmeralda': '#10b981', 'plata': '#c0c0c0', 'silver': '#c0c0c0', 'azul': '#1976d2', 'negro': '#000000', 'blanco': '#ffffff', 'oro': '#ffd700', 'gold': '#ffd700', 'rosa': '#ff69b4', 'amarillo': '#ffeb3b', 'verde': '#4caf50', 'púrpura': '#9c27b0' }
  return colorMap[colorName.toLowerCase().trim()] || '#9e9e9e'
}

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

const getStatusText = (status: string) => ({ 'available': 'Disponible', 'out-of-stock': 'Sin Stock', 'coming-soon': 'Próximamente' }[status] || status)
const getSaleStatusText = (status: string) => ({ 'completed': 'Completada', 'pending': 'Pendiente', 'cancelled': 'Cancelada' }[status] || status)
const formatDate = (date: Date) => date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
const getProductsInCategory = (categoryId: string) => products.value.filter(p => p.category === categoryId).length

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = { name: product.name, description: product.description, price: product.price, originalPrice: product.originalPrice || 0, images: product.images ? [...product.images] : [''], category: product.category, status: product.status, colors: product.colors ? [...product.colors] : [], isShowcase: product.isShowcase || false }
  showProductForm.value = true
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = { name: category.name, description: category.description || '', imageUrls: category.imageUrls || [] }
  categoryImageUrls.value = category.imageUrls && category.imageUrls.length > 0 ? [...category.imageUrls] : ['']
  showCategoryForm.value = true
}

const deleteProductConfirm = (id: string) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) deleteProduct(id)
}

const handleDeleteCategory = async (id: string) => {
  const count = getProductsInCategory(id)
  let msg = '¿Estás seguro de eliminar esta categoría?'
  if (count > 0) msg = `⚠️ Esta categoría tiene ${count} producto(s) asociado(s).\n\n¿Estás seguro de que deseas continuar?`
  if (confirm(msg)) await deleteCategory(Number(id))
}

const isFormValid = computed(() => {
  const hasImage = productForm.value.images.some(i => i.trim().length > 0)
  return productForm.value.name.trim() !== '' && productForm.value.price > 0 && productForm.value.category !== '' && hasImage
})

const updateImageUrl = (index: number, value: string) => { productForm.value.images[index] = value }

const normalizeString = (str: string): string => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ')
const isMaterialSelected = (material: string) => productForm.value.colors.some(c => normalizeString(c) === normalizeString(material))
const toggleProductMaterial = (material: string) => {
  const idx = productForm.value.colors.findIndex(c => normalizeString(c) === normalizeString(material))
  if (idx > -1) productForm.value.colors.splice(idx, 1)
  else productForm.value.colors.push(material)
}

const formatPriceInput = (value: number): string => { if (!value || value === 0) return ''; return value.toLocaleString('es-CO') }
const handlePriceInput = (event: Event, field: 'price' | 'originalPrice') => {
  const raw = (event.target as HTMLInputElement).value.replace(/\./g, '').replace(/[^\d]/g, '')
  productForm.value[field] = raw ? parseInt(raw, 10) : 0
}

const saveProduct = () => {
  const payload = { ...productForm.value, images: productForm.value.images.map(i => i.trim()).filter(Boolean) }
  if (editingProduct.value) {
    if (!confirm(`¿Actualizar producto "${editingProduct.value.name}"?`)) return
    updateProduct(editingProduct.value.id, payload)
  } else { addProduct(payload) }
  closeProductForm()
}

const saveCategory = async () => {
  const urls = categoryImageUrls.value.map(i => i.trim()).filter(Boolean)
  const payload: CreateCategoryRequest = { name: categoryForm.value.name, description: categoryForm.value.description, imageUrls: urls.length > 0 ? urls : undefined }
  if (editingCategory.value) {
    if (!confirm(`¿Actualizar categoría "${editingCategory.value.name}"?`)) return
    await updateCategory(Number(editingCategory.value.id), payload)
  } else { await addCategory(payload) }
  closeCategoryForm()
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  productForm.value = { name: '', description: '', price: 0, originalPrice: 0, images: [''], category: '', status: 'available', colors: [], isShowcase: false }
}

const closeCategoryForm = () => {
  showCategoryForm.value = false
  editingCategory.value = null
  categoryForm.value = { name: '', description: '' }
  categoryImageUrls.value = ['']
}

const addCategoryImageUrl = () => { categoryImageUrls.value.push('') }
const updateCategoryImageUrl = (index: number, value: string) => { categoryImageUrls.value[index] = value }
const removeCategoryImageUrl = (index: number) => { categoryImageUrls.value.splice(index, 1); if (categoryImageUrls.value.length === 0) categoryImageUrls.value = [''] }

const loadBrandsData = async () => {
  await loadBrands()
}

const filteredBrands = computed(() => {
  if (!searchBrands.value.trim()) return brands.value
  const q = searchBrands.value.toLowerCase().trim()
  return brands.value.filter(b => b.name.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q))
})

const editBrand = (brand: Brand) => {
  editingBrand.value = brand
  brandForm.value = { name: brand.name, description: brand.description || '', imageUrls: brand.imageUrls || [] }
  brandImageUrls.value = brand.imageUrls && brand.imageUrls.length > 0 ? [...brand.imageUrls] : ['']
  showBrandForm.value = true
}

const handleDeleteBrand = async (id: string) => {
  const msg = '¿Estás seguro de eliminar esta marca?'
  if (confirm(msg)) await deleteBrand(Number(id))
}

const saveBrand = async () => {
  const urls = brandImageUrls.value.map(i => i.trim()).filter(Boolean)
  const payload: CreateBrandRequest = { name: brandForm.value.name, description: brandForm.value.description, imageUrls: urls.length > 0 ? urls : undefined }
  if (editingBrand.value) {
    if (!confirm(`¿Actualizar marca "${editingBrand.value.name}"?`)) return
    await updateBrand(Number(editingBrand.value.id), payload)
  } else { await createBrand(payload) }
  closeBrandForm()
}

const closeBrandForm = () => {
  showBrandForm.value = false
  editingBrand.value = null
  brandForm.value = { name: '', description: '' }
  brandImageUrls.value = ['']
}

const addBrandImageUrl = () => { brandImageUrls.value.push('') }
const updateBrandImageUrl = (index: number, value: string) => { brandImageUrls.value[index] = value }
const removeBrandImageUrl = (index: number) => { brandImageUrls.value.splice(index, 1); if (brandImageUrls.value.length === 0) brandImageUrls.value = [''] }

// Cotizaciones WhatsApp
const whatsappQuotes = ref([
  { id: 1, name: 'Juan Pérez', company: 'Constructora ABC', city: 'Bogotá', phone: '3229118168', productCount: 3, status: 'pending', products: 'Guantes Dieléctricos, Breaker Schneider, Casco Honeywell' },
  { id: 2, name: 'María García', company: 'Electricos del Norte', city: 'Medellín', phone: '3101234567', productCount: 2, status: 'responded', products: 'Multímetro Fluke, Alicate isolado' },
  { id: 3, name: 'Carlos López', company: 'Industrial Solutions', city: 'Cali', phone: '3159876543', productCount: 5, status: 'pending', products: 'Cable THW, Conector bipolar, Tablero distribución' },
])

const openWhatsApp = (quote: { phone: string; name: string }) => {
  const message = encodeURIComponent(`Hola ${quote.name}, gracias por tu solicitud de cotización. ¿En qué podemos ayudarte?`)
  window.open(`https://wa.me/57${quote.phone}?text=${message}`, '_blank')
}
</script>

<style scoped>
/* ===== RESET & VARIABLES ===== */
.admin-layout, .admin-layout *, .admin-layout *::before, .admin-layout *::after { box-sizing: border-box; margin: 0; padding: 0; }

.admin-layout {
  --c-primary: #F4B400;
  --c-primary-hover: #D99A00;
  --c-accent: #FFC107;
  --c-black: #111111;
  --c-dark: #1A1A2E;
  --c-sidebar: #111111;
  --c-white: #FFFFFF;
  --c-light: #F5F5F5;
  --c-gray: #6B7280;
  --c-gray-light: #9CA3AF;
  --c-border: #E5E7EB;
  --c-success: #10B981;
  --c-danger: #EF4444;
  --c-warning: #F59E0B;
  --c-info: #3B82F6;
  --sidebar-w: 260px;
  --topbar-h: 64px;
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
  padding: 24px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.sidebar-logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 52px;
  width: auto;
  object-fit: contain;
}

.sidebar-subtitle {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.35);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  color: rgba(255,255,255,0.55);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.9);
}

.nav-item.active {
  background: var(--c-primary);
  color: var(--c-black);
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
}

.nav-item.active .nav-icon { color: var(--c-black); }

.nav-badge {
  margin-left: auto;
  background: var(--c-danger);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 16px 10px 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.logout { color: rgba(255,255,255,0.45); }
.logout:hover { background: rgba(239,68,68,0.12); color: #fca5a5; }

.copyright {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.2);
  text-align: center;
  line-height: 1.5;
  margin-top: 12px;
  padding: 0 10px;
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
  padding: 0 24px;
  gap: 16px;
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
  width: 38px;
  height: 38px;
  border-radius: 10px;
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
  background: rgba(244, 180, 0, 0.04);
}

.topbar-search {
  flex: 1;
  max-width: 560px;
  position: relative;
  display: flex;
  align-items: center;
}

.topbar-search .search-icon {
  position: absolute;
  left: 14px;
  color: var(--c-gray-light);
  pointer-events: none;
}

.topbar-search .search-input {
  width: 100%;
  padding: 10px 80px 10px 42px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-light);
  font-size: 0.88rem;
  color: var(--c-black);
  outline: none;
  transition: all 0.2s ease;
}
.topbar-search .search-input:focus { border-color: var(--c-primary); background: var(--c-white); box-shadow: 0 0 0 3px rgba(244,180,0,0.1); }
.topbar-search .search-input::placeholder { color: var(--c-gray-light); }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
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
  top: 4px;
  right: 4px;
  background: var(--c-primary);
  color: var(--c-black);
  font-size: 0.6rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 8px;
}
.topbar-user:hover { background: var(--c-light); }

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--c-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-black);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
.user-role { font-size: 0.68rem; color: var(--c-gray); }

.topbar-divider {
  width: 1px;
  height: 28px;
  background: var(--c-border);
  margin: 0 4px;
}

.logout-btn {
  background: none;
  border: 1px solid var(--c-border);
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--c-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.logout-btn:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: var(--c-danger);
  color: var(--c-danger);
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 0.9rem;
  color: var(--c-gray);
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  font-size: 0.82rem;
  color: var(--c-gray);
  cursor: pointer;
}
.date-filter:hover { border-color: var(--c-primary); }

/* ===== STATS ROW ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
}
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px); }

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--c-gray);
  font-weight: 500;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--c-black);
  line-height: 1.1;
}

.stat-change {
  font-size: 0.72rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 3px;
}

.stat-change.up { color: var(--c-success); }
.stat-change.down { color: var(--c-danger); }

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
  padding: 18px 20px;
  border-bottom: 1px solid var(--c-border);
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-black);
}

.link-btn {
  background: none;
  border: none;
  color: var(--c-primary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.link-btn:hover { color: var(--c-primary-hover); }

.chart-filter {
  padding: 6px 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.8rem;
  background: var(--c-white);
  color: var(--c-black);
  cursor: pointer;
}

/* ===== CHART ===== */
.chart-card { grid-column: span 2; }

.chart-placeholder {
  padding: 20px;
  display: flex;
  gap: 12px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--c-gray);
  padding: 0 0 24px;
  min-width: 40px;
}

.chart-area { flex: 1; }

.chart-svg { width: 100%; height: 180px; }

.chart-x-axis {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--c-gray);
  padding-top: 8px;
}

.chart-legend {
  display: flex;
  gap: 20px;
  padding: 12px 20px 16px;
  border-top: 1px solid var(--c-border);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--c-gray);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* ===== DASHBOARD GRIDS ===== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.dashboard-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ===== ORDERS LIST ===== */
.orders-list { padding: 0; }

.order-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
  gap: 12px;
}
.order-item:last-child { border-bottom: none; }

.order-info {
  display: flex;
  flex-direction: column;
  min-width: 90px;
}

.order-id { font-size: 0.85rem; font-weight: 600; color: var(--c-black); }
.order-date { font-size: 0.7rem; color: var(--c-gray); }

.order-status {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.order-status.pending { background: #FEF3C7; color: #92400E; }
.order-status.completed { background: #D1FAE5; color: #065F46; }
.order-status.cancelled { background: #FEE2E2; color: #991B1B; }

.order-amount {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-black);
  margin-left: auto;
  white-space: nowrap;
}

.order-view {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--c-gray);
  border-radius: 6px;
}
.order-view:hover { background: var(--c-light); color: var(--c-black); }

.card-footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 14px;
  background: none;
  border: none;
  border-top: 1px solid var(--c-border);
  color: var(--c-primary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.card-footer-btn:hover { background: rgba(244,180,0,0.04); }

/* ===== TOP PRODUCTS ===== */
.products-top-list { padding: 0; }

.top-product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
}
.top-product-item:last-child { border-bottom: none; }

.top-product-img {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--c-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.top-product-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.top-product-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-product-sales {
  font-size: 0.72rem;
  color: var(--c-gray);
}

.top-product-price {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-black);
  white-space: nowrap;
}

/* ===== INVENTORY ALERTS ===== */
.alerts-list { padding: 0; }

.alert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
}
.alert-item:last-child { border-bottom: none; }

.alert-img {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--c-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.alert-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.alert-name { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
.alert-stock { font-size: 0.72rem; color: var(--c-gray); }

.alert-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #FEE2E2;
  color: #991B1B;
  white-space: nowrap;
}

/* ===== QUOTATIONS ===== */
.quotations-list { padding: 0; }

.quotation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
}
.quotation-item:last-child { border-bottom: none; }

.quotation-info {
  display: flex;
  flex-direction: column;
  min-width: 80px;
}

.quotation-id { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
.quotation-date { font-size: 0.7rem; color: var(--c-gray); }

.quotation-status {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.quotation-status.pending { background: #FEF3C7; color: #92400E; }
.quotation-status.completed { background: #D1FAE5; color: #065F46; }
.quotation-status.cancelled { background: #FEE2E2; color: #991B1B; }

.quotation-amount {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-black);
  margin-left: auto;
  white-space: nowrap;
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

/* ===== SEARCH BAR ===== */
.search-bar {
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
  max-width: 480px;
}

.search-input-wrapper .search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-gray-light);
  pointer-events: none;
}

.search-field {
  width: 100%;
  padding: 10px 40px 10px 42px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-white);
  font-size: 0.88rem;
  color: var(--c-black);
  outline: none;
  transition: all 0.2s ease;
}
.search-field:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(244,180,0,0.1); }
.search-field::placeholder { color: var(--c-gray-light); }

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--c-light);
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--c-gray);
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-clear:hover { background: var(--c-danger); color: white; }

/* ===== PRODUCTS TABLE ===== */
.prod-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.prod-toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.prod-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prod-bulk-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.prod-bulk-select {
  padding: 8px 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  font-size: 0.82rem;
  color: var(--c-black);
  cursor: pointer;
}

.prod-filter-select {
  padding: 8px 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  font-size: 0.82rem;
  color: var(--c-black);
  cursor: pointer;
  min-width: 150px;
}
.prod-filter-select:focus { border-color: var(--c-primary); outline: none; }

.search-sm { max-width: 220px; }

.products-table .col-product { min-width: 250px; }
.products-table .col-category { min-width: 140px; }
.products-table .col-price { min-width: 100px; }
.products-table .col-status { min-width: 100px; }
.products-table .col-featured { min-width: 70px; text-align: center; }

.prod-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prod-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--c-light);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prod-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prod-thumb-placeholder { font-size: 1.2rem; }

.prod-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.prod-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--c-black);
}

.prod-desc {
  font-size: 0.76rem;
  color: var(--c-gray);
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prod-category-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #FEF3C7;
  color: #92400E;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.prod-price {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--c-black);
}

.prod-status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}

.prod-status-badge.available {
  background: #D1FAE5;
  color: #065F46;
}

.prod-status-badge.out-of-stock {
  background: #FEE2E2;
  color: #991B1B;
}

.prod-status-badge.coming-soon {
  background: #FEF3C7;
  color: #92400E;
}

.prod-star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.15s;
}

.prod-star-btn:hover {
  background: #FEF3C7;
}

.prod-star-btn.active {
  transform: scale(1.1);
}

/* ===== BREADCRUMB ===== */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 0.82rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--c-primary);
  text-decoration: none;
  font-weight: 500;
}
.breadcrumb-link:hover { color: var(--c-primary-hover); }

.breadcrumb-sep { color: var(--c-gray-light); }
.breadcrumb-current { color: var(--c-gray); }

/* ===== CATEGORIES TABLE ===== */
.cat-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.cat-stat-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.cat-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cat-stat-icon.yellow { background: rgba(244,180,0,0.12); color: var(--c-primary); }
.cat-stat-icon.green { background: rgba(16,185,129,0.12); color: var(--c-success); }
.cat-stat-icon.red { background: rgba(239,68,68,0.12); color: var(--c-danger); }
.cat-stat-icon.blue { background: rgba(59,130,246,0.12); color: var(--c-info); }

.cat-stat-info {
  display: flex;
  flex-direction: column;
}

.cat-stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--c-black);
  line-height: 1.1;
}

.cat-stat-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}

.cat-stat-sub {
  font-size: 0.72rem;
  color: var(--c-gray);
}

/* Toolbar */
.cat-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.cat-toolbar-left,
.cat-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cat-bulk-select,
.cat-filter-select {
  padding: 8px 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.82rem;
  background: var(--c-white);
  color: var(--c-black);
  cursor: pointer;
}

.cat-search {
  position: relative;
}

.cat-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-gray-light);
  pointer-events: none;
}

.cat-search-input {
  padding: 8px 12px 8px 32px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.82rem;
  width: 200px;
  outline: none;
  background: var(--c-white);
  color: var(--c-black);
}
.cat-search-input:focus { border-color: var(--c-primary); }

/* Table */
.cat-table-container {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
}

.cat-table {
  width: 100%;
  border-collapse: collapse;
}

.cat-table th {
  text-align: left;
  padding: 14px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-light);
  white-space: nowrap;
}

.cat-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--c-border);
  font-size: 0.85rem;
  color: var(--c-black);
  vertical-align: middle;
}

.cat-table tbody tr:hover { background: rgba(244,180,0,0.02); }
.cat-table tbody tr:last-child td { border-bottom: none; }

.col-check { width: 40px; text-align: center; }
.col-check input { width: 16px; height: 16px; accent-color: var(--c-primary); cursor: pointer; }

.col-img { width: 60px; }

.cat-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--c-border);
  background: var(--c-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cat-thumb-placeholder {
  font-size: 1.2rem;
}

.cat-name-text {
  font-weight: 600;
  color: var(--c-black);
}

.cat-desc-text {
  font-size: 0.82rem;
  color: var(--c-gray);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 280px;
}

.cat-status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}

.cat-status-badge.active {
  background: #D1FAE5;
  color: #065F46;
}

.cat-status-badge.inactive {
  background: #FEE2E2;
  color: #991B1B;
}

.cat-actions {
  display: flex;
  gap: 6px;
}

.cat-action-btn {
  background: none;
  border: 1px solid var(--c-border);
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--c-gray);
  display: flex;
  align-items: center;
  transition: all 0.2s;
}
.cat-action-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }
.cat-action-btn.danger:hover { border-color: var(--c-danger); color: var(--c-danger); }

/* Pagination */
.cat-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.cat-pagination-info {
  font-size: 0.82rem;
  color: var(--c-gray);
}

.cat-pagination-btns {
  display: flex;
  gap: 4px;
}

.cat-page-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  color: var(--c-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 500;
}
.cat-page-btn:hover:not(:disabled) { border-color: var(--c-primary); color: var(--c-primary); }
.cat-page-btn.active {
  background: var(--c-primary);
  color: var(--c-black);
  border-color: var(--c-primary);
}
.cat-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ===== SALES ===== */
.sales-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.mini-stat {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-stat-label { font-size: 0.78rem; color: var(--c-gray); }
.mini-stat-value { font-size: 1.3rem; font-weight: 800; color: var(--c-black); }

.table-container {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.data-table th {
  text-align: left;
  padding: 14px 18px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-light);
}

.data-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--c-border);
}

.data-table tbody tr:hover { background: rgba(244,180,0,0.02); }
.data-table tbody tr:last-child td { border-bottom: none; }

.cell-stack { display: flex; flex-direction: column; gap: 2px; }
.cell-primary { font-weight: 500; color: var(--c-black); font-size: 0.85rem; }
.cell-secondary { font-size: 0.75rem; color: var(--c-gray); }

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}

.qty-badge {
  background: var(--c-primary);
  color: var(--c-black);
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
}

.amount { font-weight: 700; color: var(--c-success); font-size: 0.85rem; }

.status-pill {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}

.status-pill.completed { background: #D1FAE5; color: #065F46; }
.status-pill.pending { background: #FEF3C7; color: #92400E; }
.status-pill.cancelled { background: #FEE2E2; color: #991B1B; }

.products-badge {
  background: var(--c-primary);
  color: var(--c-black);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  display: inline-block;
}

.products-details { margin-top: 4px; }
.products-toggle {
  cursor: pointer;
  color: var(--c-primary);
  font-size: 0.72rem;
  font-weight: 500;
}
.products-list {
  list-style: none;
  padding: 6px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.products-list li {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  padding: 4px 8px;
  background: var(--c-light);
  border-radius: 6px;
}
.item-qty { font-weight: 600; }

/* ===== BUTTONS ===== */
.btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--c-primary);
  color: var(--c-black);
}
.btn-primary:hover { background: var(--c-primary-hover); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  background: var(--c-light);
  color: var(--c-gray);
  border: 1px solid var(--c-border);
}
.btn-secondary:hover { border-color: var(--c-primary); color: var(--c-primary); }

.btn-outline {
  background: transparent;
  color: var(--c-gray);
  border: 1px solid var(--c-border);
}
.btn-outline:hover { border-color: var(--c-primary); color: var(--c-primary); }

.btn-outline-danger {
  background: transparent;
  color: var(--c-gray);
  border: 1px solid var(--c-border);
}
.btn-outline-danger:hover { border-color: var(--c-danger); color: var(--c-danger); background: rgba(239,68,68,0.04); }

.btn-sm { padding: 7px 12px; font-size: 0.78rem; border-radius: 8px; }

/* ===== FORMS ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: var(--c-white);
  border-radius: 18px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.modal-header {
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 { font-size: 1.2rem; font-weight: 700; color: var(--c-black); }

.modal-close {
  background: var(--c-light);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--c-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
.modal-close:hover { background: var(--c-danger); color: white; }

.modal-body { padding: 24px; }

.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-weight: 600; font-size: 0.85rem; color: var(--c-black); margin-bottom: 6px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  font-size: 0.9rem;
  background: var(--c-white);
  color: var(--c-black);
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(244,180,0,0.1); }
.form-input::placeholder { color: var(--c-gray-light); }

.price-input { position: relative; display: flex; align-items: center; }
.currency { position: absolute; left: 14px; font-weight: 600; color: var(--c-gray); font-size: 0.9rem; z-index: 1; }
.price-input .form-input { padding-left: 32px; }

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 500;
}
.checkbox-label input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--c-primary); }

.form-help { font-size: 0.78rem; color: var(--c-gray); margin-top: 4px; }

.materials-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }

.material-chip {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--c-border);
  background: var(--c-white);
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  color: var(--c-black);
  transition: all 0.2s;
}
.material-chip:hover { border-color: var(--c-primary); }
.material-chip.selected { background: rgba(244,180,0,0.1); border-color: var(--c-primary); color: var(--c-primary); }

.selected-materials {
  padding: 8px 12px;
  background: var(--c-light);
  border-radius: 8px;
}
.selected-label { font-weight: 600; color: var(--c-primary); font-size: 0.82rem; }
.selected-list { font-size: 0.82rem; color: var(--c-black); }

.image-urls { display: flex; flex-direction: column; gap: 8px; }
.image-url-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; }

.images-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.image-preview-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--c-border);
  background: var(--c-light);
}

.image-preview-item img { width: 100%; height: 80px; object-fit: cover; display: block; }

.img-action-btn {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  padding: 2px 6px;
  font-size: 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
.img-action-btn.primary { background: var(--c-primary); color: var(--c-black); }
.img-action-btn:disabled { opacity: 0.4; cursor: default; }

.image-index {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.5);
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
}

.discount-info {
  background: rgba(16,185,129,0.06);
  border: 1px solid rgba(16,185,129,0.15);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 16px;
}

.discount-badge {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-success);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--c-border);
}

/* ===== EMPTY / LOADING / ERROR ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-icon { font-size: 3.5rem; margin-bottom: 16px; opacity: 0.4; }
.empty-state h3 { font-size: 1.2rem; font-weight: 600; color: var(--c-black); margin-bottom: 8px; }
.empty-state p { font-size: 0.9rem; color: var(--c-gray); margin-bottom: 20px; }

.loading-state, .error-state { text-align: center; padding: 60px 20px; }
.loading-state p, .error-state p { margin-top: 16px; color: var(--c-gray); }

.spinner {
  border: 3px solid var(--c-border);
  border-left-color: var(--c-primary);
  border-radius: 50%;
  width: 40px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .stats-row { grid-template-columns: repeat(3, 1fr); }
  .dashboard-grid-3 { grid-template-columns: 1fr; }
}

@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .chart-card { grid-column: span 1; }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-open .sidebar {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 99;
  }

  .sidebar-open .sidebar-overlay { display: block; }

  .main-area { margin-left: 0; }

  .menu-toggle { display: flex; }

  .topbar-search { display: none; }

  .topbar-user .user-info { display: none; }

  .stats-row { grid-template-columns: repeat(2, 1fr); }

  .main-content { padding: 16px; }

  .content-header { flex-direction: column; }

  .form-row { grid-template-columns: 1fr; }

  .sales-stats-row { grid-template-columns: 1fr; }

  .products-grid { grid-template-columns: 1fr; }

  .cat-stats-row { grid-template-columns: repeat(2, 1fr); }
  .cat-toolbar { flex-direction: column; align-items: stretch; }
  .cat-toolbar-left,
  .cat-toolbar-right { flex-wrap: wrap; }
  .cat-search-input { width: 100%; }
  .cat-table-container { overflow-x: auto; }
  .cat-pagination { flex-direction: column; gap: 12px; align-items: center; }
}

@media (max-width: 480px) {
  .stats-row { grid-template-columns: 1fr; }
  .stat-card { padding: 14px; }
  .stat-value { font-size: 1.1rem; }
}
</style>
