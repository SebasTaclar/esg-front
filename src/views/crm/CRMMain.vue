<template>
  <div class="crm-layout" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Sidebar -->
    <aside class="crm-sidebar">
      <div class="sidebar-header">
        <router-link to="/admin/products" class="back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver al Panel
        </router-link>
      </div>

      <div class="sidebar-brand">
        <img src="/images/LOGO_1.jpeg" alt="ESG" class="sidebar-logo" />
        <span class="sidebar-title">CRM ESG</span>
      </div>

      <nav class="crm-nav">
        <router-link
          v-for="item in navItems"
          :key="item.route"
          :to="item.route"
          class="nav-item"
          :class="{ active: isActive(item.route) }"
          @click="sidebarOpen = false"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
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

    <!-- Overlay -->
    <div class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Main -->
    <div class="crm-main">
      <header class="crm-topbar">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div class="topbar-title">
          <h1>{{ currentTitle }}</h1>
        </div>

        <div class="topbar-search">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            :value="busqueda"
            @input="onSearch"
            placeholder="Buscar clientes, proyectos..."
            class="search-input"
          />
        </div>

        <div class="topbar-actions">
          <button class="action-btn primary" @click="showQuickActions = !showQuickActions">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nuevo
          </button>

          <!-- Quick Actions Dropdown -->
          <div v-if="showQuickActions" class="quick-actions-dropdown">
            <router-link to="/admin/crm/clientes/nuevo" class="dropdown-item" @click="showQuickActions = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Nuevo Cliente
            </router-link>
            <router-link to="/admin/crm/proyectos/nuevo" class="dropdown-item" @click="showQuickActions = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              Nuevo Proyecto
            </router-link>
          </div>
        </div>
      </header>

      <main class="crm-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/api/authService'
import { useCRM } from '@/composables/useCRM'

const route = useRoute()
const router = useRouter()
const { busqueda, setBusqueda } = useCRM()

const sidebarOpen = ref(false)
const showQuickActions = ref(false)

const navItems = [
  {
    label: 'Resumen general',
    route: '/admin/crm',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  },
  {
    label: 'Clientes',
    route: '/admin/crm/clientes',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  {
    label: 'Prospectos',
    route: '/admin/crm/prospectos',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
  },
  {
    label: 'Seguimientos',
    route: '/admin/crm/seguimientos',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  },
]

const currentTitle = computed(() => {
  const item = navItems.find((n) => route.path === n.route || route.path.startsWith(n.route + '/'))
  return item?.label || 'CRM'
})

function isActive(itemRoute: string): boolean {
  if (itemRoute === '/admin/crm') {
    return route.path === '/admin/crm'
  }
  return route.path.startsWith(itemRoute)
}

function onSearch(event: Event) {
  const target = event.target as HTMLInputElement
  setBusqueda(target.value)
}

function handleLogout() {
  if (confirm('¿Estás seguro de cerrar sesión?')) {
    authService.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.crm-layout, .crm-layout *, .crm-layout *::before, .crm-layout *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.crm-layout {
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
  --sidebar-w: 240px;
  --topbar-h: 64px;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  min-height: 100vh;
  background: var(--c-light);
  color: var(--c-black);
}

/* ===== SIDEBAR ===== */
.crm-sidebar {
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
  padding: 12px 16px;
  border-bottom: 1px solid var(--c-border);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--c-gray);
  font-size: 0.82rem;
  font-weight: 500;
  transition: color 0.2s;
}
.back-btn:hover { color: var(--c-primary); }

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid var(--c-border);
}

.sidebar-logo {
  height: 36px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-black);
}

.crm-nav {
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
  text-decoration: none;
}

.nav-item:hover {
  background: var(--c-light);
  color: var(--c-black);
}

.nav-item.active {
  background: rgba(200, 155, 45, 0.08);
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

.nav-badge {
  margin-left: auto;
  background: var(--c-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  line-height: 1.2;
}

.sidebar-footer {
  padding: 12px 10px;
  border-top: 1px solid var(--c-border);
}

.logout-btn {
  color: var(--c-danger) !important;
}

/* ===== OVERLAY ===== */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 90;
}

/* ===== MAIN ===== */
.crm-main {
  flex: 1;
  margin-left: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== TOPBAR ===== */
.crm-topbar {
  height: var(--topbar-h);
  background: var(--c-white);
  border-bottom: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: var(--c-black);
  cursor: pointer;
  border-radius: 8px;
}
.menu-toggle:hover { background: var(--c-light); }

.topbar-title h1 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-black);
  white-space: nowrap;
}

.topbar-search {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-gray-light);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  font-size: 0.85rem;
  font-family: inherit;
  background: var(--c-light);
  color: var(--c-black);
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: var(--c-primary); }
.search-input::placeholder { color: var(--c-gray-light); }

.topbar-actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.action-btn:hover { border-color: var(--c-gray-light); color: var(--c-black); }

.action-btn.primary {
  background: var(--c-primary);
  color: white;
  border-color: var(--c-primary);
}
.action-btn.primary:hover { background: var(--c-primary-hover); }

.quick-actions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  min-width: 200px;
  z-index: 200;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  text-decoration: none;
  color: var(--c-black);
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.15s;
}
.dropdown-item:hover { background: var(--c-light); }

/* ===== CONTENT ===== */
.crm-content {
  flex: 1;
  padding: 24px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .crm-sidebar {
    transform: translateX(-100%);
  }
  .crm-sidebar-open .crm-sidebar {
    transform: translateX(0);
  }
  .sidebar-overlay {
    display: block;
  }
  .crm-main {
    margin-left: 0;
  }
  .menu-toggle {
    display: flex;
  }
  .crm-topbar {
    padding: 0 16px;
    gap: 12px;
  }
  .topbar-search {
    max-width: 200px;
  }
}

@media (max-width: 640px) {
  .crm-content {
    padding: 16px;
  }
  .topbar-search {
    display: none;
  }
}
</style>
