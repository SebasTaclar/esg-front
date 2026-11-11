<template>
  <div class="invoice-page">
    <div class="page-header">
      <div>
        <router-link to="/admin/crm/proyectos" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver a proyectos
        </router-link>
        <h1 class="page-title">Seguimiento de facturas</h1>
        <p class="page-subtitle">{{ invoices.length }} facturas registradas</p>
      </div>
      <div class="summary-cards">
        <button class="summary-card status-filter paid" :class="{ active: selectedStatus === 'Pagada' }" @click="toggleStatus('Pagada')">
          <span class="summary-count">{{ countByStatus('Pagada') }}</span>
          <span class="summary-label">Pagadas</span>
        </button>
        <button class="summary-card status-filter pending" :class="{ active: selectedStatus === 'Pendiente de pago' }" @click="toggleStatus('Pendiente de pago')">
          <span class="summary-count">{{ countByStatus('Pendiente de pago') }}</span>
          <span class="summary-label">Pendientes</span>
        </button>
        <button class="summary-card status-filter overdue" :class="{ active: selectedStatus === 'Vencida' }" @click="toggleStatus('Vencida')">
          <span class="summary-count">{{ countByStatus('Vencida') }}</span>
          <span class="summary-label">Vencidas</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="state-card">Cargando facturas...</div>
    <div v-else-if="invoices.length === 0" class="state-card">
      No hay facturas registradas.
    </div>
    <div v-else>
      <div class="filters-bar">
        <div class="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input v-model="searchTerm" type="search" placeholder="Buscar por factura, proyecto o cliente..." />
        </div>
        <button v-if="searchTerm || selectedStatus" class="clear-filter" @click="clearFilters">Limpiar filtros</button>
      </div>
      <div v-if="filteredInvoices.length === 0" class="state-card">
        No hay facturas que coincidan con los filtros.
      </div>
      <div v-else class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Proyecto</th>
              <th>Cliente</th>
              <th>Fecha de emisión</th>
              <th>Pago proyectado</th>
              <th>Días restantes / Mora</th>
              <th>Estado</th>
              <th>Fecha efectiva de pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in filteredInvoices" :key="invoice.id">
              <td class="strong">{{ invoice.invoiceNumber }}</td>
              <td>{{ invoice.offer || invoice.code || '-' }}</td>
              <td>{{ invoice.client?.name || '-' }}</td>
              <td>{{ formatDate(invoice.invoiceIssueDate) }}</td>
              <td>{{ formatDate(invoice.projectedPaymentDate) }}</td>
              <td :class="invoice.timing.class">{{ invoice.timing.label }}</td>
              <td>
                <span class="status-badge" :class="invoice.status.class">{{ invoice.status.label }}</span>
              </td>
              <td>{{ formatDate(invoice.actualPaymentDate) }}</td>
              <td>
                <div class="actions-cell">
                  <router-link :to="`/admin/crm/proyectos/${invoice.id}`" class="action-btn" title="Ver">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/>
                      <circle cx="12" cy="12" r="2.5"/>
                    </svg>
                  </router-link>
                  <router-link :to="`/admin/crm/proyectos/${invoice.id}/editar`" class="action-btn" title="Editar">
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
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { projectService } from '@/services/api/projectService'
import type { Proyecto } from '@/types/crmTypes'

const projects = ref<Proyecto[]>([])
const loading = ref(true)
const searchTerm = ref('')
const selectedStatus = ref('')

const invoices = computed(() => projects.value
  .filter(project => Boolean(project.invoiceNumber))
  .map(project => ({
    ...project,
    status: getPaymentStatus(project),
    timing: getPaymentTiming(project),
  })))

const filteredInvoices = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  return invoices.value.filter(invoice => {
    const matchesStatus = !selectedStatus.value || invoice.status.label === selectedStatus.value
    const searchable = [
      invoice.invoiceNumber,
      invoice.offer,
      invoice.code,
      invoice.client?.name,
    ].filter(Boolean).join(' ').toLowerCase()
    return matchesStatus && (!term || searchable.includes(term))
  })
})

function parseExtraData(raw: unknown): Record<string, unknown> {
  if (!raw) return {}
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as Record<string, unknown> } catch { return {} }
  }
  if (typeof raw === 'object') return raw as Record<string, unknown>
  return {}
}

function getPaymentStatus(project: Proyecto) {
  if (parseExtraData(project.extraData)['estadoFactura'] === 'anulada') return { label: 'Anulada', class: 'status-cancelled' }
  if (project.actualPaymentDate) return { label: 'Pagada', class: 'status-paid' }
  if (project.projectedPaymentDate && isPast(project.projectedPaymentDate)) {
    return { label: 'Vencida', class: 'status-overdue' }
  }
  return { label: 'Pendiente de pago', class: 'status-pending' }
}

function getPaymentTiming(project: Proyecto) {
  if (project.actualPaymentDate) return { label: '-', class: '' }
  if (!project.projectedPaymentDate) return { label: 'Sin fecha proyectada', class: 'timing-missing' }

  const days = differenceInDays(project.projectedPaymentDate)
  if (days < 0) return { label: `${Math.abs(days)} día(s) de mora`, class: 'timing-overdue' }
  if (days === 0) return { label: 'Vence hoy', class: 'timing-soon' }
  return { label: `${days} día(s) restantes`, class: 'timing-ok' }
}

function startOfDay(date = new Date()) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function parseLocalDate(date?: string): Date | null {
  if (!date) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const d = new Date(date)
  return isNaN(d.getTime()) ? null : d
}

function differenceInDays(date: string) {
  const target = parseLocalDate(date)
  if (!target) return 0
  return Math.ceil((startOfDay(target).getTime() - startOfDay().getTime()) / 86400000)
}

function isPast(date: string) {
  return differenceInDays(date) < 0
}

function formatDate(date?: string) {
  const d = parseLocalDate(date)
  if (!d) return '-'
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function countByStatus(status: string) {
  return invoices.value.filter(invoice => invoice.status.label === status).length
}

function toggleStatus(status: string) {
  selectedStatus.value = selectedStatus.value === status ? '' : status
}

function clearFilters() {
  searchTerm.value = ''
  selectedStatus.value = ''
}

onMounted(async () => {
  try {
    const response = await projectService.getAll({ limit: 9999 })
    projects.value = response.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.invoice-page { display: flex; flex-direction: column; gap: 24px; min-width: 0; width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; }
.back-link { display: inline-flex; align-items: center; gap: 5px; color: var(--c-gray); text-decoration: none; font-size: .82rem; margin-bottom: 10px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { margin-top: 4px; color: var(--c-gray); font-size: .85rem; }
.summary-cards { display: flex; gap: 12px; }
.summary-card { min-width: 115px; padding: 14px 18px; border: 1px solid var(--c-border); border-radius: 10px; background: var(--c-white); text-align: center; }
.status-filter { cursor: pointer; font-family: inherit; transition: all .2s ease; }
.status-filter:hover, .status-filter.active { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15, 23, 42, .1); }
.status-filter.paid.active { border-color: #86EFAC; background: #F0FDF4; }
.status-filter.pending.active { border-color: #FCD34D; background: #FFFBEB; }
.status-filter.overdue.active { border-color: #FCA5A5; background: #FEF2F2; }
.summary-count { display: block; font-size: 1.2rem; font-weight: 700; color: var(--c-black); }
.summary-label { display: block; margin-top: 3px; color: var(--c-gray); font-size: .75rem; }
.filters-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.search-box { display: flex; align-items: center; gap: 8px; width: min(460px, 100%); padding: 10px 12px; border: 1px solid var(--c-border); border-radius: 9px; background: var(--c-white); color: var(--c-gray); }
.search-box input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--c-black); font: inherit; font-size: .84rem; }
.clear-filter { padding: 9px 13px; border: 1px solid var(--c-border); border-radius: 8px; background: var(--c-white); color: var(--c-gray); cursor: pointer; font: inherit; font-size: .8rem; }
.clear-filter:hover { border-color: var(--c-primary); color: var(--c-primary); }
.table-card { min-width: 0; max-width: 100%; overflow: hidden; background: var(--c-white); border: 1px solid var(--c-border); border-radius: 12px; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; table-layout: fixed; border-collapse: collapse; }
.data-table th, .data-table td { padding: 14px 12px; text-align: left; border-bottom: 1px solid var(--c-border); white-space: normal; overflow-wrap: anywhere; font-size: .8rem; vertical-align: middle; }
.data-table th:nth-child(1), .data-table td:nth-child(1) { width: 8%; }
.data-table th:nth-child(2), .data-table td:nth-child(2) { width: 8%; }
.data-table th:nth-child(3), .data-table td:nth-child(3) { width: 20%; }
.data-table th:nth-child(4), .data-table td:nth-child(4),
.data-table th:nth-child(5), .data-table td:nth-child(5) { width: 11%; }
.data-table th:nth-child(6), .data-table td:nth-child(6) { width: 10%; }
.data-table th:nth-child(7), .data-table td:nth-child(7) { width: 10%; }
.data-table th:nth-child(8), .data-table td:nth-child(8) { width: 10%; }
.data-table th:nth-child(9), .data-table td:nth-child(9) { width: 12%; }
.data-table th { background: var(--c-light); color: var(--c-gray); font-weight: 600; }
.data-table tr:last-child td { border-bottom: 0; }
.strong { font-weight: 700; color: var(--c-black); }
.actions-cell { display: flex; gap: 4px; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; text-decoration: none; transition: all 0.15s; }
.action-btn:hover { background: var(--c-light); color: var(--c-primary); }
.status-badge { display: inline-flex; padding: 5px 10px; border-radius: 6px; font-size: .75rem; font-weight: 700; }
.status-paid { background: #DCFCE7; color: #15803D; }
.status-pending { background: #FEF3C7; color: #B45309; }
.status-overdue { background: #FEE2E2; color: #B91C1C; }
.status-cancelled { background: #F3F4F6; color: #6B7280; }
.timing-ok { color: #15803D; font-weight: 600; }
.timing-soon { color: #B45309; font-weight: 600; }
.timing-overdue { color: #B91C1C; font-weight: 600; }
.timing-missing { color: var(--c-gray); }
.state-card { padding: 48px; text-align: center; color: var(--c-gray); background: var(--c-white); border: 1px solid var(--c-border); border-radius: 12px; }
@media (max-width: 768px) {
  .page-header { align-items: flex-start; flex-direction: column; }
  .summary-cards { width: 100%; }
  .summary-card { flex: 1; min-width: 0; }
  .filters-bar { align-items: stretch; flex-direction: column; }
  .search-box { width: auto; }
  .table-responsive { overflow-x: auto; }
  .data-table { min-width: 760px; table-layout: auto; }
  .data-table th, .data-table td { white-space: nowrap; }
}
</style>
