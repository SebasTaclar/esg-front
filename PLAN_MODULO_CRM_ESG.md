# Plan: Módulo Clientes y Proyectos (CRM ESG)

## Arquitectura Actual vs Propuesta

### Estado Actual
- `AdminDashboardSimple.vue` es un **componente monolítico** (1656 líneas)
- Navegación por secciones con `v-if` y `currentSection` (sin router anidado)
- Datos hardcodeados (no hay backend para clientes/proyectos)
- Las secciones "Clientes" y "Proyectos" son placeholders ("Próximamente")

### Estado Propuesto
- **Refactorizar** el dashboard para usar **router sub-routes** en lugar de `v-if`
- Extraer cada sección en **componentes independientes**
- Crear un **módulo completo** con vista de dashboard, listas, fichas y formularios
- Preparar **capa de servicios** para integración con backend

---

## Arquitectura del Módulo

### Estructura de Directorios

```
src/
├── types/
│   └── crmTypes.ts                    # Modelos de datos del CRM
├── services/api/
│   ├── clientService.ts               # API de clientes
│   ├── projectService.ts              # API de proyectos
│   ├── prospectService.ts             # API de prospectos
│   ├── followUpService.ts             # API de seguimientos
│   └── catalogService.ts              # API de catálogos (tipos, normas, estados)
├── composables/
│   └── useCRM.ts                      # Composable principal del CRM
├── views/crm/
│   ├── CRMMain.vue                    # Wrapper con sidebar del CRM
│   ├── CRMDashboard.vue               # Dashboard con indicadores
│   ├── ClientsList.vue                # Lista de clientes
│   ├── ClientDetail.vue               # Ficha completa del cliente (con pestañas)
│   ├── ProjectsList.vue               # Lista de proyectos
│   ├── ProjectDetail.vue              # Ficha del proyecto
│   ├── ProspectsList.vue              # Lista de prospectos
│   ├── FollowUpsList.vue              # Lista de seguimientos
│   ├── forms/
│   │   ├── ClientForm.vue             # Crear/editar cliente
│   │   ├── ProjectForm.vue            # Crear/editar proyecto
│   │   ├── ContactForm.vue            # Crear/editar contacto
│   │   ├── FollowUpForm.vue           # Crear/editar seguimiento
│   │   └── DocumentUpload.vue         # Subir documentos
│   └── components/
│       ├── CRMStatsCards.vue           # Tarjetas de indicadores
│       ├── CRMTopBar.vue              # Barra superior con acciones
│       ├── CRMFilters.vue             # Filtros del módulo
│       ├── CRMProjectsTable.vue       # Tabla principal de proyectos
│       ├── ClientCard.vue             # Tarjeta de cliente (para vistas de cards)
│       ├── ProjectCard.vue            # Tarjeta de proyecto
│       ├── ContactsTab.vue            # Pestaña de contactos
│       ├── ProjectsTab.vue            # Pestaña de proyectos (en ficha cliente)
│       ├── DocumentsTab.vue           # Pestaña de documentos
│       ├── FollowUpsTab.vue           # Pestaña de seguimientos
│       ├── TimelineTab.vue            # Pestaña de cronología
│       ├── QuotesTab.vue              # Pestaña de cotizaciones
│       └── ProjectCodeBadge.vue       # Badge con código automático
├── router/
│   └── index.ts                       # Rutas actualizadas
└── assets/
    └── styles/
        └── crm.css                    # Estilos compartidos del CRM
```

---

## Modelo de Datos

### `crmTypes.ts`

```typescript
// ====== CATÁLOGOS ======
export interface TipoProyecto {
  id: number
  abreviatura: string  // SG, LAB, LAC, CPR, OIN
  nombre: string
  activo: boolean
}

export interface Norma {
  id: number
  codigo: string       // ISO 9001, ISO 14001, etc.
  nombre: string
  activa: boolean
}

export interface EstadoProyecto {
  id: number
  codigo: string       // prospecto, cotizacion, aprobado, en_ejecucion, suspendido, finalizado, cancelado
  nombre: string
  color: string        // hex del color
  orden: number
}

export interface TipoServicio {
  id: number
  nombre: string       // Consultoría, Auditoría, Formación, Gestión Metrológica
  activo: boolean
}

// ====== CLIENTE ======
export interface Cliente {
  id: number
  razonSocial: string
  nit: string
  ciudad: string
  departamento: string
  direccion: string
  telefono: string
  correo: string
  paginaWeb?: string
  estado: 'activo' | 'inactivo' | 'prospecto'
  observaciones?: string
  createdAt: string
  updatedAt: string
}

export interface CreateClienteRequest {
  razonSocial: string
  nit: string
  ciudad: string
  departamento: string
  direccion: string
  telefono: string
  correo: string
  paginaWeb?: string
  estado?: 'activo' | 'inactivo' | 'prospecto'
  observaciones?: string
}

export interface UpdateClienteRequest extends Partial<CreateClienteRequest> {}

// ====== CONTACTO ======
export interface Contacto {
  id: number
  clienteId: number
  nombre: string
  cargo: string
  celular: string
  correo: string
  esPrincipal: boolean
  createdAt: string
}

export interface CreateContactoRequest {
  clienteId: number
  nombre: string
  cargo: string
  celular: string
  correo: string
  esPrincipal?: boolean
}

// ====== PROYECTO ======
export interface Proyecto {
  id: number
  consecutivo: number
  abreviatura: string
  codigo: string         // Generado automáticamente: 0001-LAB
  clienteId: number
  clienteRazonSocial?: string
  tipoProyectoId: number
  tipoProyectoNombre?: string
  tipoServicioId?: number
  tipoServicioNombre?: string
  normaId: number
  normaCodigo?: string
  estadoId: number
  estadoNombre?: string
  estadoColor?: string
  responsable: string
  fechaInicio: string
  fechaFin?: string
  descripcion: string
  observaciones?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProyectoRequest {
  clienteId: number
  tipoProyectoId: number
  tipoServicioId?: number
  normaId: number
  estadoId: number
  responsable: string
  fechaInicio: string
  fechaFin?: string
  descripcion: string
  observaciones?: string
}

export interface UpdateProyectoRequest extends Partial<CreateProyectoRequest> {}

// ====== SEGUIMIENTO ======
export interface Seguimiento {
  id: number
  proyectoId: number
  tipo: 'llamada' | 'correo' | 'reunion' | 'visita' | 'compromiso'
  descripcion: string
  fecha: string
  proximaActividad?: string
  fechaProximaActividad?: string
  usuario: string
  createdAt: string
}

export interface CreateSeguimientoRequest {
  proyectoId: number
  tipo: 'llamada' | 'correo' | 'reunion' | 'visita' | 'compromiso'
  descripcion: string
  fecha: string
  proximaActividad?: string
  fechaProximaActividad?: string
}

// ====== DOCUMENTO ======
export interface Documento {
  id: number
  proyectoId: number
  nombre: string
  tipo: string           // contrato, cotizacion, informe, certificado, acta, presentacion
  url: string
  tamano: number
  usuario: string
  createdAt: string
}

// ====== CRONOLOGÍA ======
export interface EventoCronologia {
  id: number
  entidadTipo: 'cliente' | 'proyecto' | 'cotizacion'
  entidadId: number
  tipo: string           // cliente_creado, proyecto_creado, cotizacion_enviada, reunion, documento_cargado, proyecto_finalizado
  descripcion: string
  usuario: string
  fecha: string
}

// ====== DASHBOARD ======
export interface CRMStats {
  totalClientes: number
  totalProspectos: number
  proyectosActivos: number
  proyectosFinalizados: number
  cotizacionesPendientes: number
  seguimientosProgramados: number
}
```

---

## Rutas del Módulo

```typescript
// En router/index.ts - agregar rutas CRM
{
  path: '/admin/crm',
  component: () => import('../views/crm/CRMMain.vue'),
  meta: { requiresAuth: true, requiredRole: 'admin' },
  children: [
    { path: '',                    name: 'crm-dashboard',    component: CRMDashboard },
    { path: 'clientes',           name: 'crm-clients',      component: ClientsList },
    { path: 'clientes/nuevo',     name: 'crm-client-new',   component: ClientForm },
    { path: 'clientes/:id',       name: 'crm-client-detail', component: ClientDetail },
    { path: 'clientes/:id/editar', name: 'crm-client-edit',  component: ClientForm },
    { path: 'proyectos',          name: 'crm-projects',     component: ProjectsList },
    { path: 'proyectos/nuevo',    name: 'crm-project-new',  component: ProjectForm },
    { path: 'proyectos/:id',      name: 'crm-project-detail', component: ProjectDetail },
    { path: 'proyectos/:id/editar', name: 'crm-project-edit', component: ProjectForm },
    { path: 'prospectos',         name: 'crm-prospects',    component: ProspectsList },
    { path: 'seguimientos',       name: 'crm-followups',    component: FollowUpsList },
  ]
}
```

---

## Ficha del Cliente - Pestañas

| Pestaña | Componente | Descripción |
|---------|------------|-------------|
| Información General | (integrada en ClientDetail) | Datos de la empresa |
| Contactos | `ContactsTab.vue` | Lista de contactos, agregar/editar/eliminar |
| Proyectos | `ProjectsTab.vue` | Proyectos asociados al cliente |
| Cotizaciones | `QuotesTab.vue` | Cotizaciones del cliente (preparado para futuro) |
| Documentos | `DocumentsTab.vue` | Documentos globales del cliente |
| Seguimientos | `FollowUpsTab.vue` | Seguimientos del cliente |
| Cronología | `TimelineTab.vue` | Timeline de eventos automáticos |

---

## Codificación Automática de Proyectos

**Lógica:**
1. Al crear proyecto, seleccionar tipo (abreviatura)
2. Backend obtiene el último consecutivo para esa abreviatura
3. Generar código: `${consecutivo}-${abreviatura}`
4. Ejemplo: Si el último LAB es 0003-LAB, el nuevo será 0004-LAB
5. Campo `codigo` es **solo lectura** en frontend

---

## Flujo de Navegación

```
Admin Dashboard (AdminDashboardSimple)
  └── Click en "Clientes" o "Proyectos" en sidebar
       └── /admin/crm → CRMMain.vue
            ├── Dashboard (/admin/crm)
            │   ├── Stats Cards
            │   ├── Top Bar (acciones rápidas)
            │   ├── Filtros
            │   └── Tabla principal
            ├── Clientes (/admin/crm/clientes)
            │   ├── Lista con búsqueda y filtros
            │   └── Click cliente → Ficha completa
            ├── Proyectos (/admin/crm/proyectos)
            │   ├── Lista con código automático
            │   └── Click proyecto → Detalle
            ├── Prospectos (/admin/crm/prospectos)
            │   └── Lista de prospectos
            └── Seguimientos (/admin/crm/seguimientos)
                └── Vista consolidada
```

---

## Decisiones de UX/UI

1. **No usar modales para fichas** → Usar vista completa con navegación de regreso
2. **Tabla moderna** → Estilo cards/responsive, no tablas Bootstrap
3. **Estados con colores** → Badges con colores consistentes (éxito=verde, peligro=rojo, etc.)
4. **Búsqueda en tiempo real** → Filtrado instantáneo en todas las listas
5. **Responsive** → Se adapta a móvil con sidebar colapsable
6. **Consistencia visual** → Mismos tokens de color del dashboard actual

---

## Integraciones Futuras (Preparadas)

- Cotizaciones (ya existe flujo WhatsApp)
- Facturación
- Agenda/Calendario
- Recursos
- Dashboard Ejecutivo
- Reportes
- Automatizaciones
- Notificaciones

---

## Orden de Implementación

1. **Tipos y modelos** (`crmTypes.ts`)
2. **Servicios API** (`clientService.ts`, `projectService.ts`, etc.)
3. **Composable CRM** (`useCRM.ts`)
4. **Router actualizado**
5. **CRMMain.vue** (wrapper con sidebar)
6. **CRMStatsCards.vue** (indicadores)
7. **CRMTopBar.vue** (acciones rápidas)
8. **CRMDashboard.vue** (dashboard completo)
9. **ClientsList.vue** (lista de clientes)
10. **ClientForm.vue** (formulario crear/editar)
11. **ClientDetail.vue** (ficha con pestañas)
12. **ContactsTab.vue** (pestaña contactos)
13. **ProjectsTab.vue** (pestaña proyectos)
14. **ProjectsList.vue** (lista de proyectos)
15. **ProjectForm.vue** (formulario proyecto con código auto)
16. **ProjectDetail.vue** (detalle proyecto)
17. **ProspectsList.vue** (lista prospectos)
18. **FollowUpsList.vue** (lista seguimientos)
19. **TimelineTab.vue** (cronología)
20. **DocumentsTab.vue** (documentos)
21. **Estilos compartidos** (`crm.css`)
22. **Integración en AdminDashboardSimple** (sidebar CRM)
