<template>
  <header v-if="showUtilityBar" class="site-header" :class="{ scrolled: isScrolled || isNosotros }">
    <nav class="header-main">
      <RouterLink class="brand-container" to="/" @click="closeMobileMenu">
        <div class="brand-logo">
          <img src="/images/LOGO.PNG" alt="ESG" class="brand-logo-img" />
          <span class="brand-divider" aria-hidden="true"></span>
          <div class="brand-text">
            <span class="brand-text-main">ES GESTIÓN</span>
            <span class="brand-text-sub">EMPRESARIAL</span>
          </div>
        </div>
      </RouterLink>

      <div class="nav-menu desktop-only">
        <RouterLink to="/" class="nav-link" :class="{ active: isCurrentRoute('/') }" @click="closeMobileMenu">Inicio</RouterLink>
        <RouterLink to="/nosotros" class="nav-link" :class="{ active: isCurrentRoute('/nosotros') }" @click="closeMobileMenu">Nosotros</RouterLink>
        <RouterLink to="/servicios" class="nav-link" :class="{ active: isCurrentRoute('/servicios') }" @click="closeMobileMenu">Servicios</RouterLink>
        <RouterLink to="/clientes-recursos" class="nav-link" :class="{ active: isCurrentRoute('/clientes-recursos') }" @click="closeMobileMenu">Clientes / Recursos</RouterLink>
        <a href="/#contacto" class="nav-link" @click="closeMobileMenu">Contacto</a>
      </div>

      <div class="nav-actions desktop-only">
        <RouterLink to="/login-clientes" class="btn-portal">
          Portal Clientes
        </RouterLink>
        <RouterLink v-if="!isLoggedIn" to="/login" class="btn-login">
          <i class="fas fa-user" aria-hidden="true"></i>
          Iniciar sesión
        </RouterLink>
        <RouterLink v-else-if="isAdmin" to="/admin/products" class="btn-login">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          Mi cuenta
        </RouterLink>
        <button v-else type="button" class="btn-login" @click="logout">
          <i class="fas fa-user" aria-hidden="true"></i>
          Mi cuenta
        </button>
      </div>

      <div class="mobile-header-controls">
        <button type="button" class="mobile-contact-btn" aria-label="Contactar">
          <i class="fas fa-phone" aria-hidden="true"></i>
        </button>
      </div>

      <button class="hamburger-menu" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>

    <div class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <div class="mobile-nav-links">
          <RouterLink to="/" class="mobile-link" :class="{ active: isCurrentRoute('/') }" @click="closeMobileMenu">Inicio</RouterLink>
          <RouterLink to="/nosotros" class="mobile-link" :class="{ active: isCurrentRoute('/nosotros') }" @click="closeMobileMenu">Nosotros</RouterLink>
          <RouterLink to="/servicios" class="mobile-link" :class="{ active: isCurrentRoute('/servicios') }" @click="closeMobileMenu">Servicios</RouterLink>
          <RouterLink to="/clientes-recursos" class="mobile-link" :class="{ active: isCurrentRoute('/clientes-recursos') }" @click="closeMobileMenu">Clientes / Recursos</RouterLink>
          <a href="/#contacto" class="mobile-link" @click="closeMobileMenu">Contacto</a>
        </div>

        <div class="mobile-controls">
          <RouterLink to="/login-clientes" class="mobile-btn btn-portal-mobile" @click="closeMobileMenu">
            Portal Clientes
          </RouterLink>
          <RouterLink v-if="!isLoggedIn" class="mobile-btn btn-login-mobile" to="/login" @click="closeMobileMenu">
            <i class="fas fa-user" aria-hidden="true"></i>
            Iniciar sesión
          </RouterLink>
          <div v-if="isLoggedIn" class="mobile-user-greeting">
            <span>Hola, {{ username }}</span>
          </div>
          <RouterLink v-if="isLoggedIn && isAdmin" class="mobile-btn btn-login-mobile" to="/admin/products" @click="closeMobileMenu">
            <i class="fas fa-user-shield" aria-hidden="true"></i>
            Mi cuenta
          </RouterLink>
          <button v-if="isLoggedIn" class="mobile-btn logout-btn" @click="handleMobileLogout">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </header>

  <RouterView />

  <AppFooter />

  <ProductQuickViewModal
    :open="quickViewOpen"
    :product="quickViewProduct"
    @close="closeQuickView"
  />

  <GlobalCart />
  <SocialFloating v-if="showUtilityBar" />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { authService } from '@/services/api'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import router from './router'
import SocialFloating from '@/components/SocialFloating.vue'
import GlobalCart from '@/components/GlobalCart.vue'
import ProductQuickViewModal from '@/components/ProductQuickViewModal.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useProductQuickView } from '@/composables/useProductQuickView'

const isLoggedIn = ref(false)
const username = ref('')
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

const { isOpen: quickViewOpen, product: quickViewProduct, close: closeQuickView } = useProductQuickView()

const currentRoute = useRoute()
const isAdmin = computed(() => authService.isAdmin())
const showUtilityBar = computed(() => !currentRoute.path.startsWith('/admin'))
const isNosotros = computed(() => currentRoute.path === '/nosotros')

const isCurrentRoute = (path: string): boolean => currentRoute.path === path

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const checkAuthStatus = () => {
  isLoggedIn.value = authService.isAuthenticated()
  if (isLoggedIn.value) {
    const currentUser = authService.getCurrentUser()
    username.value = currentUser?.name || ''
  } else {
    username.value = ''
  }
}

const logout = () => {
  authService.logout()
  isLoggedIn.value = false
  username.value = ''
  router.replace({ name: 'home' })
}

const handleMobileLogout = () => {
  closeMobileMenu()
  logout()
}

onMounted(() => {
  checkAuthStatus()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(currentRoute, () => {
  checkAuthStatus()
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

defineOptions({
  name: 'App'
})
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: transparent;
  color: #4A4A4A;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: none;
  transition: background 0.35s ease, box-shadow 0.35s ease;
}

.site-header.scrolled {
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  color: #4A4A4A;
}

.header-main {
  min-height: 80px;
  height: 80px;
  padding: 0 clamp(16px, 4vw, 60px);
  background: transparent;
  display: flex;
  align-items: center;
  gap: 32px;
  transition: background 0.35s ease;
}

.site-header.scrolled .header-main {
  background: #FFFFFF;
}

.brand-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-img {
  height: 64px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-divider {
  display: block;
  width: 2px;
  height: 40px;
  background: #C89B2D;
  border-radius: 1px;
}

.brand-text-main {
  font-size: 18px;
  font-weight: 800;
  color: #4A4A4A;
  letter-spacing: 1px;
  transition: color 0.35s ease;
}

.site-header.scrolled .brand-text-main {
  color: #4A4A4A;
}

.brand-text-sub {
  font-size: 11px;
  font-weight: 600;
  color: #9A9A9A;
  letter-spacing: 2px;
  transition: color 0.35s ease;
}

.site-header.scrolled .brand-text-sub {
  color: #9A9A9A;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #4A4A4A;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.25s ease;
  cursor: pointer;
  white-space: nowrap;
}

.site-header.scrolled .nav-link {
  color: #4A4A4A;
}

.site-header.scrolled .nav-link:hover,
.site-header.scrolled .nav-link.active {
  color: #C89B2D;
}

.nav-link:hover,
.nav-link.active {
  color: #C89B2D;
}

.nav-link i {
  font-size: 10px;
  transition: transform 0.25s ease;
}

/* Dropdown */
.nav-link-dropdown {
  position: relative;
}

.nav-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #F0F0F0;
  padding: 8px;
  z-index: 100;
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  color: #4A4A4A;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(200, 155, 45, 0.06);
  color: #C89B2D;
}

/* CTA Buttons */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.btn-portal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #4A4A4A;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-portal:hover {
  background: #3A3A3A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 74, 74, 0.3);
}

.btn-login {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #C89B2D;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: all 0.25s ease;
  white-space: nowrap;
  cursor: pointer;
}

.btn-login:hover {
  background: #B8891F;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200, 155, 45, 0.3);
}

.btn-login i {
  font-size: 13px;
}

/* Mobile Controls */
.mobile-header-controls {
  display: none;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.mobile-contact-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid #E8E8E8;
  background: transparent;
  color: #C89B2D;
  cursor: pointer;
  transition: all 0.25s ease;
}

.site-header.scrolled .mobile-contact-btn {
  border-color: #E8E8E8;
  color: #C89B2D;
}

.mobile-contact-btn:hover {
  background: rgba(200, 155, 45, 0.06);
  border-color: rgba(200, 155, 45, 0.3);
}

.hamburger-menu {
  margin-left: 10px;
  display: none;
  flex-direction: column;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  justify-content: space-around;
  align-items: center;
  z-index: 1001;
}

.hamburger-menu span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: #4A4A4A;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.site-header.scrolled .hamburger-menu span {
  background-color: #4A4A4A;
}

.hamburger-menu.active span:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -5px);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: #FFFFFF;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 9998;
  overflow-y: auto;
}

.mobile-menu.active {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-link {
  color: #4A4A4A;
  text-decoration: none;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.25s ease;
  text-align: left;
  background: transparent;
  border: 1px solid #F0F0F0;
  font-family: 'Montserrat', sans-serif;
}

.mobile-link.active,
.mobile-link:hover {
  color: #C89B2D;
  border-color: rgba(200, 155, 45, 0.3);
  background: rgba(200, 155, 45, 0.04);
}

.mobile-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid #F0F0F0;
}

.mobile-btn {
  padding: 14px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  transition: all 0.25s ease;
  border: none;
  cursor: pointer;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
}

.btn-portal-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #4A4A4A;
  color: #FFFFFF;
  border: none;
}

.btn-portal-mobile:hover {
  background: #3A3A3A;
}

.btn-login-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #C89B2D;
  color: #FFFFFF;
  border: none;
}

.btn-login-mobile:hover {
  background: #B8891F;
}

.logout-btn {
  background: transparent;
  color: #4A4A4A;
  border: 1px solid #E8E8E8;
}

.logout-btn:hover {
  border-color: rgba(200, 155, 45, 0.3);
  color: #C89B2D;
}

.mobile-user-greeting {
  color: #4A4A4A;
  text-align: center;
  padding: 14px 16px;
  font-weight: 600;
  font-size: 15px;
  background: transparent;
  border-radius: 10px;
  font-family: 'Montserrat', sans-serif;
}

/* Responsive */
@media (max-width: 768px) {
  .header-main {
    height: 72px;
    padding: 12px 16px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-header-controls {
    display: flex;
  }

  .hamburger-menu {
    display: flex;
  }

  .mobile-menu {
    display: block;
    top: 72px;
    height: calc(100vh - 72px);
  }
}

@media (max-width: 480px) {
  .brand-logo-img {
    height: 52px;
  }

  .brand-text-main {
    font-size: 15px;
  }

  .brand-text-sub {
    font-size: 9px;
    letter-spacing: 1.5px;
  }

  .mobile-menu {
    top: 72px;
    height: calc(100vh - 72px);
  }
}
</style>
