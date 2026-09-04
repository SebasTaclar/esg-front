<template>
  <div class="crm-dashboard">
    <h2 class="dashboard-title">Resumen General</h2>
    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-card stat-card-wide">
        <div class="stat-icon blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Clientes</span>
          <span class="stat-value">{{ stats.totalClientes }}</span>
        </div>
      </div>

      <div class="stat-card stat-card-wide">
        <div class="stat-icon amber">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Prospectos</span>
          <span class="stat-value">{{ stats.totalProspectos }}</span>
        </div>
      </div>

      <div class="stat-card stat-card-wide">
        <div class="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Tipos de Organización</span>
          <span class="stat-value">{{ orgTypes.length }}</span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <!-- Organization Types -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Tipos de Organización</h3>
          <span class="chart-subtitle">{{ orgTypes.length }} categorías</span>
        </div>
        <div class="chart-body">
          <div v-if="orgTypes.length === 0" class="chart-empty">Sin datos</div>
          <div v-else class="org-bars">
            <div v-for="org in orgTypes" :key="org.name" class="org-bar-row">
              <div class="org-bar-label">
                <span class="org-bar-name">{{ org.name }}</span>
                <span class="org-bar-count">{{ org.count }}</span>
              </div>
              <div class="org-bar-track">
                <div
                  class="org-bar-fill"
                  :style="{ width: (org.count / orgTypes[0].count * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Normas -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Normas</h3>
          <span class="chart-subtitle">{{ normas.length }} normas</span>
        </div>
        <div class="chart-body">
          <div v-if="normas.length === 0" class="chart-empty">Sin datos</div>
          <div v-else class="org-bars">
            <div v-for="n in normas" :key="n.name" class="org-bar-row">
              <div class="org-bar-label">
                <span class="org-bar-name">{{ n.name }}</span>
                <span class="org-bar-count">{{ n.count }}</span>
              </div>
              <div class="org-bar-track">
                <div
                  class="org-bar-fill"
                  :style="{ width: (n.count / normas[0].count * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clients Per Month -->
    <div class="chart-card">
      <div class="chart-header">
        <h3>Clientes por Mes</h3>
        <span class="chart-subtitle">Últimos 12 meses</span>
      </div>
      <div class="chart-body">
        <div v-if="monthlyData.length === 0" class="chart-empty">Sin datos</div>
        <div v-else class="monthly-chart">
          <div class="monthly-bars">
            <div v-for="m in monthlyData" :key="m.label" class="monthly-col">
              <span class="monthly-value">{{ m.count }}</span>
              <div class="monthly-bar-wrapper">
                <div
                  class="monthly-bar"
                  :style="{ height: (m.count / maxMonthly * 100) + '%' }"
                ></div>
              </div>
              <span class="monthly-label">{{ m.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCRM } from '@/composables/useCRM'

const { stats, clientes, loading, fetchDashboard } = useCRM()

onMounted(() => {
  fetchDashboard()
})

const orgTypes = computed(() => {
  const clients = clientes.value.filter((c) => !c.isProspect)
  const map = new Map<string, number>()
  clients.forEach((c) => {
    if (c.tipoOrganizacion) {
      map.set(c.tipoOrganizacion, (map.get(c.tipoOrganizacion) || 0) + 1)
    }
  })
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

const normas = computed(() => {
  const clients = clientes.value.filter((c) => !c.isProspect)
  const map = new Map<string, number>()
  clients.forEach((c) => {
    if (c.norma) {
      map.set(c.norma, (map.get(c.norma) || 0) + 1)
    }
  })
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

const monthlyData = computed(() => {
  const clients = clientes.value.filter((c) => !c.isProspect)
  const now = new Date()
  const months: { label: string; count: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const label = d.toLocaleString('es', { month: 'short' }).replace('.', '')
    const count = clients.filter((c) => {
      if (!c.createdAt) return false
      const created = new Date(c.createdAt)
      return created.getFullYear() === year && created.getMonth() === month
    }).length
    months.push({ label, count })
  }
  return months
})

const maxMonthly = computed(() => Math.max(...monthlyData.value.map((m) => m.count), 1))
</script>

<style scoped>
.crm-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--c-black);
  margin: 0;
}

/* ===== STATS ROW ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
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
.stat-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

.stat-sub {
  font-size: 0.7rem;
  color: var(--c-gray-light);
}

/* ===== CHARTS ROW ===== */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
}

.chart-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-black);
  margin: 0;
}

.chart-subtitle {
  font-size: 0.75rem;
  color: var(--c-gray-light);
}

.chart-body {
  padding: 20px 24px;
}

.chart-empty {
  text-align: center;
  color: var(--c-gray-light);
  padding: 40px 0;
  font-size: 0.85rem;
}

/* ===== ORG TYPE BARS ===== */
.org-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.org-bar-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.org-bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.org-bar-name {
  font-size: 0.8rem;
  color: var(--c-black);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

.org-bar-count {
  font-size: 0.78rem;
  color: var(--c-gray);
  font-weight: 600;
  flex-shrink: 0;
}

.org-bar-track {
  height: 8px;
  background: var(--c-light);
  border-radius: 4px;
  overflow: hidden;
}

.org-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-primary), #D4A843);
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 4px;
}

/* ===== MONTHLY CHART ===== */
.monthly-chart {
  width: 100%;
}

.monthly-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 180px;
}

.monthly-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
}

.monthly-value {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--c-gray);
}

.monthly-bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.monthly-bar {
  width: 70%;
  max-width: 32px;
  background: linear-gradient(180deg, var(--c-primary), #D4A843);
  border-radius: 4px 4px 0 0;
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 2px;
}

.monthly-label {
  font-size: 0.6rem;
  color: var(--c-gray-light);
  text-transform: capitalize;
  font-weight: 500;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .charts-row { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .stats-row { grid-template-columns: 1fr; }
  .monthly-bars { height: 140px; }
}

@media (max-width: 480px) {
  .monthly-bars { height: 120px; gap: 4px; }
  .monthly-label { font-size: 0.5rem; }
}
</style>
