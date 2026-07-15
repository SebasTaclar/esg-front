<template>
  <div class="test-purchases">
    <h1>🧪 Test de Purchases API</h1>

    <div class="controls">
      <button @click="loadAllPurchases" class="btn-primary">
        Cargar Todas las Compras
      </button>

      <div class="email-filter">
        <input
          v-model="emailFilter"
          type="email"
          placeholder="ejemplo@email.com"
          class="input"
        >
        <button @click="loadPurchasesByEmail" class="btn-secondary">
          Buscar por Email
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <p>⏳ Cargando...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ Error: {{ error }}</p>
    </div>

    <div v-else-if="purchases.length > 0" class="results">
      <h2>📦 Compras Encontradas: {{ purchases.length }}</h2>

      <div class="purchase-card" v-for="purchase in purchases" :key="purchase.id">
        <div class="purchase-header">
          <h3>Compra #{{ purchase.id }}</h3>
          <span :class="['status', purchase.status?.toLowerCase()]">
            {{ purchase.status }}
          </span>
        </div>

        <div class="purchase-info">
          <p><strong>Cliente:</strong> {{ purchase.buyerName }}</p>
          <p><strong>Email:</strong> {{ purchase.buyerEmail }}</p>
          <p v-if="purchase.buyerContactNumber">
            <strong>Teléfono:</strong> {{ purchase.buyerContactNumber }}
          </p>
          <p v-if="purchase.shippingAddress">
            <strong>Dirección:</strong> {{ purchase.shippingAddress }}
          </p>
          <p><strong>Total:</strong> ${{ purchase.amount?.toLocaleString() }} {{ purchase.currency }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(purchase.createdAt) }}</p>
        </div>

        <div v-if="purchase.items && purchase.items.length > 0" class="purchase-items">
          <h4>Productos:</h4>
          <div class="item" v-for="(item, index) in purchase.items" :key="index">
            <p><strong>{{ item.productName }}</strong></p>
            <p>Cantidad: {{ item.quantity }} x ${{ item.unitPrice?.toLocaleString() }}</p>
            <p v-if="item.selectedColor">Color: {{ item.selectedColor }}</p>
            <p>Subtotal: ${{ item.totalPrice?.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <p>📭 No hay compras para mostrar</p>
    </div>

    <!-- Raw JSON -->
    <details class="raw-data">
      <summary>🔍 Ver JSON Completo</summary>
      <pre>{{ JSON.stringify(rawResponse, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { paymentService } from '@/services/api/paymentService'
import type { Purchase, GetPurchasesResponse } from '@/services/api/paymentService'
import type { ApiResponse } from '@/services/api/apiConfig'

const purchases = ref<Purchase[]>([])
const isLoading = ref(false)
const error = ref('')
const emailFilter = ref('')
const rawResponse = ref<ApiResponse<GetPurchasesResponse> | null>(null)

const loadAllPurchases = async () => {
  isLoading.value = true
  error.value = ''

  try {
    console.log('📤 Obteniendo todas las compras...')
    const response = await paymentService.getAllPurchases()
    console.log('📥 Respuesta:', response)

    rawResponse.value = response

    if (response.success && response.data) {
      purchases.value = response.data.purchases
      console.log('✅ Compras cargadas:', purchases.value.length)
    } else {
      error.value = response.message || 'Error al cargar compras'
    }
  } catch (err: unknown) {
    console.error('❌ Error:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    isLoading.value = false
  }
}

const loadPurchasesByEmail = async () => {
  if (!emailFilter.value.trim()) {
    error.value = 'Por favor ingresa un email'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    console.log('📤 Buscando compras de:', emailFilter.value)
    const response = await paymentService.getPurchasesByEmail(emailFilter.value)
    console.log('📥 Respuesta:', response)

    rawResponse.value = response

    if (response.success && response.data) {
      purchases.value = response.data.purchases
      console.log('✅ Compras encontradas:', purchases.value.length)
    } else {
      error.value = response.message || 'Error al buscar compras'
    }
  } catch (err: unknown) {
    console.error('❌ Error:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.test-purchases {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.controls {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.email-filter {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #10b981;
  color: white;
  width: 100%;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #667eea;
  color: white;
}

.btn-secondary:hover {
  background: #5568d3;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  font-size: 1.25rem;
}

.error {
  color: #ef4444;
}

.results h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.purchase-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.purchase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.purchase-header h3 {
  margin: 0;
  color: #333;
}

.status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.approved,
.status.completed,
.status.completada {
  background: #d1fae5;
  color: #065f46;
}

.status.rejected,
.status.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.purchase-info p {
  margin: 0.5rem 0;
  color: #666;
}

.purchase-items {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.purchase-items h4 {
  margin-bottom: 0.75rem;
  color: #333;
}

.item {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.item p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.wallpapers {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.raw-data {
  margin-top: 2rem;
  background: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
}

.raw-data summary {
  cursor: pointer;
  font-weight: 600;
  padding: 0.5rem;
}

.raw-data pre {
  margin-top: 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
