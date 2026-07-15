<!-- Página de prueba para demostrar la sincronización de productos -->
<template>
  <div class="test-page">
    <div class="container">
      <h1>🧪 Prueba de Sincronización de Productos</h1>
      <p class="description">
        Esta página demuestra cómo los productos creados en el AdminDashboard
        aparecen automáticamente en ProductStore
      </p>

      <!-- Estadísticas -->
      <div class="stats-section">
        <div class="stat-card">
          <h3>Total de Productos</h3>
          <div class="number">{{ products.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Productos Disponibles</h3>
          <div class="number">{{ availableProducts.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Categorías</h3>
          <div class="number">{{ categories.length }}</div>
        </div>
      </div>

      <!-- Lista de productos sincronizados -->
      <div class="sync-demonstration">
        <h2>📦 Productos Sincronizados desde Admin</h2>
        <div class="product-list">
          <div
            v-for="product in products"
            :key="product.id"
            class="sync-product-card"
          >
            <img :src="product.images[0]" :alt="product.name" class="product-img">
            <div class="product-details">
              <h4>{{ product.name }}</h4>
              <p class="category">{{ getCategoryName(product.category) }}</p>
              <p class="price">${{ product.price.toLocaleString() }}</p>
              <span
                :class="['status', product.status]"
              >
                {{ getStatusText(product.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="instructions">
        <h2>🚀 Cómo probarlo</h2>
        <ol>
          <li>Ve al <strong>AdminDashboard</strong> (sección de administración)</li>
          <li>Agrega un nuevo producto con nombre, precio, descripción e imagen</li>
          <li>Regresa a esta página y verás el producto aquí automáticamente</li>
          <li>Ve a <strong>ProductStore</strong> y verás que también aparece allí</li>
          <li>¡Los cambios son en tiempo real! 🎉</li>
        </ol>
      </div>

      <!-- Enlaces de navegación -->
      <div class="navigation-links">
        <router-link to="/" class="nav-btn primary">
          🏠 Ir al Home
        </router-link>
        <button @click="openAdmin" class="nav-btn secondary">
          ⚙️ Abrir Admin
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProducts } from '@/composables/useProducts'

// Usar el composable de productos
const { products, availableProducts, categories, getCategoryById } = useProducts()

// Función helper para obtener el nombre de la categoría
const getCategoryName = (categoryId: string) => {
  return getCategoryById(categoryId)?.name || 'Sin categoría'
}

// Función helper para el texto del estado
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'available': 'Disponible',
    'out-of-stock': 'Sin Stock',
    'coming-soon': 'Próximamente'
  }
  return statusMap[status] || status
}

// Función para abrir el admin (simulada)
const openAdmin = () => {
  alert('💡 Para acceder al AdminDashboard, ve al menú principal y selecciona la opción de administración')
}
</script>

<style scoped>
.test-page {
  padding: 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

h1 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.description {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

/* Estadísticas */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.stat-card .number {
  font-size: 3rem;
  font-weight: bold;
  color: #ffd700;
}

/* Demostración de sincronización */
.sync-demonstration {
  margin-bottom: 3rem;
}

.sync-demonstration h2 {
  margin-bottom: 2rem;
  text-align: center;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.sync-product-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.sync-product-card:hover {
  transform: translateY(-5px);
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.product-details h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.product-details .category {
  margin: 0.25rem 0;
  opacity: 0.7;
  font-size: 0.9rem;
}

.product-details .price {
  margin: 0.5rem 0;
  font-weight: bold;
  font-size: 1.1rem;
  color: #ffd700;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status.available {
  background: rgba(34, 197, 94, 0.3);
  border: 1px solid rgba(34, 197, 94, 0.5);
}

.status.out-of-stock {
  background: rgba(239, 68, 68, 0.3);
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.status.coming-soon {
  background: rgba(251, 191, 36, 0.3);
  border: 1px solid rgba(251, 191, 36, 0.5);
}

/* Instrucciones */
.instructions {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.instructions h2 {
  margin-bottom: 1.5rem;
}

.instructions ol {
  font-size: 1.1rem;
  line-height: 1.6;
}

.instructions li {
  margin-bottom: 0.75rem;
}

/* Enlaces de navegación */
.navigation-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn.primary {
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  color: #333;
}

.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.nav-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.nav-btn.primary:hover {
  background: linear-gradient(45deg, #ffed4a, #ffd700);
}

.nav-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: 1fr;
  }

  .product-list {
    grid-template-columns: 1fr;
  }

  .sync-product-card {
    flex-direction: column;
    text-align: center;
  }

  .navigation-links {
    flex-direction: column;
    align-items: center;
  }

  .nav-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>