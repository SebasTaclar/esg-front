<template>
  <div class="crm-dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
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
          <span class="stat-label">Total Clientes</span>
          <span class="stat-value">{{ stats.totalClientes }}</span>
          <span class="stat-sub">{{ clientes.filter(c => c.estado === 'activo').length }} activos</span>
        </div>
      </div>

      <div class="stat-card">
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
          <span class="stat-sub">En pipeline</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Proyectos Activos</span>
          <span class="stat-value">{{ stats.proyectosActivos }}</span>
          <span class="stat-sub">En ejecución</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Cotizaciones Pendientes</span>
          <span class="stat-value">{{ stats.cotizacionesPendientes }}</span>
          <span class="stat-sub">Por responder</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Seguimientos</span>
          <span class="stat-value">{{ stats.seguimientosProgramados }}</span>
          <span class="stat-sub">Próximos 7 días</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon teal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Finalizados</span>
          <span class="stat-value">{{ stats.proyectosFinalizados }}</span>
          <span class="stat-sub">Total histórico</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCRM } from '@/composables/useCRM'

const { stats, clientes, loading, fetchDashboard } = useCRM()

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.crm-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== STATS GRID ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
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
.stat-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
.stat-icon.orange { background: rgba(249, 115, 22, 0.1); color: #F97316; }
.stat-icon.teal { background: rgba(20, 184, 166, 0.1); color: #14B8A6; }

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

/* ===== TABLE CARD ===== */
.table-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
}

.table-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-black);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--c-primary-hover); }

/* ===== ACTIVITY CARD ===== */
.card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-black);
}

/* ===== LOADING ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--c-gray);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--c-border);
  border-top-color: var(--c-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  color: var(--c-gray-light);
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
  margin-bottom: 20px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1400px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
