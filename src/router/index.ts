import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/api'
import Home from '@/views/Home.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    requiredRole?: string
    requiredRoles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise(resolve => {
        // Espera un tick para asegurar que el DOM de la ruta ya renderizó.
        requestAnimationFrame(() => {
          const el = document.querySelector(to.hash)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            resolve(false)
            return
          }
          resolve({ left: 0, top: 0 })
        })
      })
    }
    return { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        requiresGuest: true,
      },
    },

    {
      path: '/login-clientes',
      name: 'client-login',
      component: () => import('../views/ClientLogin.vue'),
      meta: {
        requiresGuest: true,
      },
    },

    {
      path: '/nosotros',
      name: 'nosotros',
      component: () => import('../views/NosotrosView.vue'),
    },

    {
      path: '/servicios',
      name: 'servicios',
      component: () => import('../views/ServiciosView.vue'),
    },

    {
      path: '/clientes-recursos',
      name: 'clientes-recursos',
      component: () => import('../views/ClientesRecursos.vue'),
    },

    {
      path: '/anillos',
      name: 'anillos',
      component: () => import('../views/CategoryProducts.vue'),
      props: { slug: 'anillos', title: 'Anillos' },
    },

    {
      path: '/collares',
      name: 'collares',
      component: () => import('../views/CategoryProducts.vue'),
      props: { slug: 'collares', title: 'Collares' },
    },

    {
      path: '/aretes',
      name: 'aretes',
      component: () => import('../views/CategoryProducts.vue'),
      props: { slug: 'aretes', title: 'Aretes' },
    },

    {
      path: '/pulseras',
      name: 'pulseras',
      component: () => import('../views/CategoryProducts.vue'),
      props: { slug: 'pulseras', title: 'Pulseras' },
    },

    {
      path: '/esmeraldas',
      name: 'esmeraldas',
      component: () => import('../views/CategoryProducts.vue'),
      props: { slug: 'esmeraldas', title: 'Esmeraldas' },
    },

    {
      path: '/ofertas',
      redirect: '/',
    },

    {
      path: '/perfumes',
      redirect: '/ofertas',
    },

    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/AdminDashboardNew.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'admin', // Solo accesible para administradores
      },
    },

    {
      path: '/payment/success',
      name: 'payment-success',
      component: () => import('../views/PaymentSuccess.vue'),
    },
    {
      path: '/payment/failure',
      name: 'payment-failure',
      component: () => import('../views/PaymentFailure.vue'),
    },
    {
      path: '/checkout',
      redirect: '/',
    },
    {
      path: '/terms-and-conditions',
      name: 'TermsAndConditions',
      component: () => import('../views/TermsAndConditions.vue'),
    },
    {
      path: '/test-sync',
      name: 'test-sync',
      component: () => import('../views/TestSync.vue'),
    },
    {
      path: '/test-purchases',
      name: 'test-purchases',
      component: () => import('../views/TestPurchases.vue'),
    },
    {
      path: '/payment/pending',
      name: 'payment-pending',
      component: () => import('../views/PaymentPending.vue'),
    },
    // Catch-all route - debe ir al final
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const userRole = authService.getUserRole()

  // Redirigir admins autenticados que intenten ir al login
  if (to.path === '/login' && isAuthenticated && userRole === 'admin') {
    next('/admin/products')
    return
  }

  // Si la ruta requiere estar autenticado
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Redirigir al login si no está autenticado
      next('/login')
      return
    }

    // Verificar rol específico si se requiere
    if (to.meta.requiredRole && userRole !== to.meta.requiredRole) {
      // Redirigir a home si no tiene el rol requerido
      next('/')
      return
    }

    // Verificar múltiples roles si se requiere
    if (to.meta.requiredRoles && (!userRole || !to.meta.requiredRoles.includes(userRole))) {
      // Redirigir a home si no tiene ninguno de los roles requeridos
      next('/')
      return
    }
  }

  // Si la ruta requiere ser invitado (no autenticado)
  if (to.meta.requiresGuest && isAuthenticated) {
    // Si es invitado y autenticado: si es admin va a panel, si no a home
    if (userRole === 'admin') {
      next('/admin/products')
    } else {
      next('/')
    }
    return
  }

  next()
})

export default router
