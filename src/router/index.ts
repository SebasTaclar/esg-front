import { createRouter, createWebHistory } from 'vue-router'
import { authService, clientAuthService } from '@/services/api'
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
      path: '/portal-clientes',
      name: 'client-portal',
      component: () => import('../views/ClientPortal.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'user',
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
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/AdminDashboardNew.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'admin', // Solo accesible para administradores
      },
    },

    {
      path: '/admin/proyectos/:id',
      name: 'admin-project-detail',
      redirect: (to) => `/admin/crm/proyectos/${to.params.id}`,
    },

    {
      path: '/admin/crm',
      component: () => import('../views/crm/CRMMain.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'admin',
      },
      children: [
        {
          path: '',
          name: 'crm-dashboard',
          component: () => import('../views/crm/CRMDashboard.vue'),
        },
        {
          path: 'clientes',
          name: 'crm-clients',
          component: () => import('../views/crm/ClientsList.vue'),
        },
        {
          path: 'clientes/nuevo',
          name: 'crm-client-new',
          component: () => import('../views/crm/forms/ClientForm.vue'),
        },
        {
          path: 'clientes/:id',
          name: 'crm-client-detail',
          component: () => import('../views/crm/ClientDetail.vue'),
        },
        {
          path: 'clientes/:id/editar',
          name: 'crm-client-edit',
          component: () => import('../views/crm/forms/ClientForm.vue'),
        },
        {
          path: 'proyectos',
          name: 'crm-projects',
          component: () => import('../views/crm/ProjectsList.vue'),
        },
        {
          path: 'proyectos/nuevo',
          name: 'crm-project-new',
          component: () => import('../views/crm/forms/ProjectForm.vue'),
        },
        {
          path: 'proyectos/:id',
          name: 'crm-project-detail',
          component: () => import('../views/crm/ProjectDetail.vue'),
        },
        {
          path: 'proyectos/:id/editar',
          name: 'crm-project-edit',
          component: () => import('../views/crm/forms/ProjectForm.vue'),
        },
        {
          path: 'prospectos',
          name: 'crm-prospects',
          component: () => import('../views/crm/ProspectsList.vue'),
        },
        {
          path: 'prospectos/:id',
          name: 'crm-prospect-detail',
          component: () => import('../views/crm/ProspectsDetail.vue'),
        },
        {
          path: 'prospectos/:id/editar',
          name: 'crm-prospect-edit',
          component: () => import('../views/crm/forms/ClientForm.vue'),
        },
        {
          path: 'seguimientos',
          name: 'crm-followups',
          component: () => import('../views/crm/FollowUpsList.vue'),
        },
        {
          path: 'cotizaciones',
          name: 'crm-quotes',
          component: () => import('../views/crm/QuotesList.vue'),
        },
        {
          path: 'licitaciones',
          name: 'crm-licitaciones',
          component: () => import('../views/crm/LicitacionesList.vue'),
        },
        {
          path: 'colaboradores',
          name: 'crm-colaboradores',
          component: () => import('../views/crm/ColaboradoresList.vue'),
        },
        {
          path: 'colaboradores/:id',
          name: 'crm-colaborador-detail',
          component: () => import('../views/crm/ColaboradorDetail.vue'),
        },
      ],
    },

    {
      path: '/terms-and-conditions',
      name: 'TermsAndConditions',
      component: () => import('../views/TermsAndConditions.vue'),
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
  const isClientRoute = to.path === '/portal-clientes'
  const isLoginClientRoute = to.path === '/login-clientes'

  // Para rutas del portal de clientes, usar clientAuthService
  if (isClientRoute) {
    if (!clientAuthService.isAuthenticated()) {
      next('/login-clientes')
      return
    }
    next()
    return
  }

  // Para login de clientes, verificar si ya esta autenticado como cliente
  if (isLoginClientRoute) {
    if (clientAuthService.isAuthenticated()) {
      next('/portal-clientes')
      return
    }
    next()
    return
  }

  // Para el resto de rutas, usar authService (admin)
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
      next('/login')
      return
    }

    // Verificar rol específico si se requiere
    if (to.meta.requiredRole && userRole !== to.meta.requiredRole) {
      next('/')
      return
    }

    // Verificar múltiples roles si se requiere
    if (to.meta.requiredRoles && (!userRole || !to.meta.requiredRoles.includes(userRole))) {
      next('/')
      return
    }
  }

  // Si la ruta requiere ser invitado (no autenticado)
  if (to.meta.requiresGuest && isAuthenticated) {
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
