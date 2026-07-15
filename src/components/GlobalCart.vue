<template>
  <div v-if="!isAdminRoute" class="global-quotation">
    <!-- Drawer overlay -->
    <div v-if="isDrawerOpen" class="drawer-overlay" @click="closeDrawer">
      <div class="drawer-panel" @click.stop>
        <!-- Header -->
        <div class="drawer-header">
          <div class="drawer-header-content">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <h3>Mi Cotización</h3>
          </div>
          <button type="button" @click="closeDrawer" class="drawer-close-btn" aria-label="Cerrar cotización">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="drawer-content">
          <div v-if="quotationItems.length === 0" class="drawer-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>No hay productos en tu cotización</p>
            <span>Agrega productos desde el catálogo</span>
          </div>

          <div v-else class="drawer-items">
            <div v-for="item in quotationItems" :key="item.id" class="drawer-item">
              <img :src="item.image" :alt="item.name" class="drawer-item-image" />
              <div class="drawer-item-info">
                <h4 class="drawer-item-name">{{ item.name }}</h4>
                <span class="drawer-item-meta">Marca: {{ item.brand }}</span>
                <span class="drawer-item-meta">SKU: {{ item.sku }}</span>

                <div class="drawer-item-quantity">
                  <button
                    type="button"
                    class="qty-btn qty-minus"
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    aria-label="Disminuir cantidad"
                  >-</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="qty-btn qty-plus"
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    aria-label="Aumentar cantidad"
                  >+</button>
                </div>

                <div class="drawer-item-obs">
                  <input
                    type="text"
                    :value="item.observations"
                    @input="updateObs(item.id, ($event.target as HTMLInputElement).value)"
                    placeholder="Ej: Talla 10, Curva C"
                    class="obs-input"
                  />
                </div>
              </div>

              <button
                type="button"
                class="drawer-item-remove"
                @click="removeFromQuotation(item.id)"
                aria-label="Eliminar producto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="quotationItems.length > 0" class="drawer-footer">
          <div class="drawer-summary">
            <span class="summary-count">{{ totalItems }} productos seleccionados</span>
          </div>
          <div class="drawer-actions">
            <button type="button" @click="closeDrawer" class="btn-continue">
              Continuar explorando
            </button>
            <button type="button" @click="sendToWhatsApp" class="btn-send-quote">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
              </svg>
              Solicitar cotización
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuotation } from '@/composables/useQuotation'

const route = useRoute()

const {
  quotationItems,
  isDrawerOpen,
  totalItems,
  removeFromQuotation,
  updateQuantity,
  updateObservations,
  closeDrawer,
  sendToWhatsApp
} = useQuotation()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const updateObs = (productId: string, value: string) => {
  updateObservations(productId, value)
}

watch(
  () => isAdminRoute.value,
  (isAdmin) => {
    if (isAdmin) closeDrawer()
  },
  { immediate: true }
)
</script>

<style scoped>
.global-quotation {
  --q-ink: #071e25;
  --q-gold: rgb(201, 168, 89);
  --q-gold-deep: rgb(215, 172, 67);
}

/* Overlay */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 3000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Panel */
.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 90vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Header */
.drawer-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0b0b0b;
  color: #ffffff;
}

.drawer-header-content {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.drawer-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
}

.drawer-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 0.4rem;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.drawer-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Content */
.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

.drawer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #666;
  gap: 0.5rem;
}

.empty-icon {
  opacity: 0.3;
  margin-bottom: 0.5rem;
}

.drawer-empty p {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.drawer-empty span {
  font-size: 0.85rem;
  color: #999;
}

/* Items */
.drawer-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.drawer-item {
  display: flex;
  gap: 0.85rem;
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  transition: border-color 0.2s ease;
}

.drawer-item:hover {
  border-color: rgba(201, 168, 89, 0.4);
}

.drawer-item-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.drawer-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.drawer-item-name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.drawer-item-meta {
  font-size: 0.78rem;
  color: #777;
}

.drawer-item-quantity {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.3rem;
}

.qty-btn {
  border: 1px solid #ddd;
  background: #fff;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  color: #333;
}

.qty-btn:hover {
  border-color: var(--q-gold);
  color: var(--q-gold);
}

.qty-plus {
  background: var(--q-gold);
  border-color: var(--q-gold);
  color: #0b0b0b;
}

.qty-plus:hover {
  background: var(--q-gold-deep);
}

.qty-value {
  min-width: 20px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #1a1a1a;
}

.drawer-item-obs {
  margin-top: 0.3rem;
}

.obs-input {
  width: 100%;
  padding: 0.35rem 0.6rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.78rem;
  color: #333;
  background: #fff;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.obs-input:focus {
  outline: none;
  border-color: var(--q-gold);
}

.obs-input::placeholder {
  color: #aaa;
}

.drawer-item-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 0.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.drawer-item-remove:hover {
  color: #e53935;
  background: rgba(229, 57, 53, 0.08);
}

/* Footer */
.drawer-footer {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
}

.drawer-summary {
  text-align: center;
  margin-bottom: 1rem;
}

.summary-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.drawer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.btn-continue,
.btn-send-quote {
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-continue {
  background: #f0f0f0;
  color: #555;
}

.btn-continue:hover {
  background: #e5e5e5;
}

.btn-send-quote {
  background: #25d366;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-send-quote:hover {
  background: #20b858;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

/* Responsive */
@media (max-width: 480px) {
  .drawer-panel {
    width: 100%;
    max-width: 100%;
  }

  .drawer-header {
    padding: 1rem;
  }

  .drawer-content {
    padding: 0.75rem;
  }

  .drawer-item {
    padding: 0.75rem;
  }

  .drawer-item-image {
    width: 60px;
    height: 60px;
  }

  .drawer-footer {
    padding: 0.75rem 1rem 1rem;
  }
}
</style>
