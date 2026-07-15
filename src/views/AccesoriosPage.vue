<template>
  <div class="accesorios-page">
    <!-- Hero Banner Section con Carrusel -->
    <section class="hero-banner">
      <div class="carousel-container">
        <!-- Slides del carrusel dinámicos desde productos de showcase de Accesorios -->
        <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div
            v-for="product in accesoriosShowcaseProducts"
            :key="product.id"
            class="carousel-slide"
          >
            <div class="slide-content">
              <div class="slide-text">
                <h1 class="slide-title">{{ product.name }}</h1>
                <p class="slide-subtitle">{{ product.description }}</p>
                <button @click="scrollToProducts" class="shop-now-btn">
                  Compra ahora
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m7 13 5 5 5-5"/>
                    <path d="m7 6 5 5 5-5"/>
                  </svg>
                </button>
              </div>
              <div class="slide-image">
                <img
                  :src="product.image"
                  :alt="product.name"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Controles del carrusel -->
        <button class="carousel-btn prev" @click="prevSlide" aria-label="Anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="carousel-btn next" @click="nextSlide" aria-label="Siguiente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- Indicadores -->
        <div class="carousel-indicators">
          <button
            v-for="(product, index) in accesoriosShowcaseProducts"
            :key="product.id"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
            :aria-label="`Ir a ${product.name}`"
          ></button>
        </div>
      </div>
    </section>

    <!-- Productos Disponibles Section -->
    <section class="products-section">
      <div class="container">
        <div v-if="isLoadingProducts" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>

        <div v-else-if="accesoriosProducts.length > 0" class="products-container">
          <div
            v-for="product in accesoriosProducts"
            :key="product.id"
            class="product-card-modern"
            @click="handleAddToCart(product)"
          >
            <!-- Imagen del producto -->
            <div class="product-visual">
              <img
                :src="product.images[0]"
                :alt="product.name"
                loading="lazy"
                decoding="async"
                class="product-image"
              />
            </div>

            <!-- Información del producto -->
            <div class="product-details">
              <h2 class="product-title">{{ product.name }}</h2>
              <p class="product-tagline">{{ product.description }}</p>

              <div class="product-pricing">
                <span class="product-price">Precio ${{ product.price.toLocaleString() }}</span>
                <span v-if="product.originalPrice" class="product-price-original">
                  ${{ product.originalPrice.toLocaleString() }}
                </span>
              </div>


              <button class="product-btn" @click.stop="handleAddToCart(product)">
                Comprar
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>No hay Accesorioss disponibles en este momento</p>
        </div>
      </div>
    </section>

    <!-- Sección Informativa -->
    <section class="info-section">
      <div class="container">
        <div class="info-content-centered">
          <h2 class="info-title">¿Por qué elegir nuestros Accesorios?</h2>
          <p class="info-text">
            Completa tu experiencia Apple con accesorios diseñados para funcionar en perfecta armonía
            con tus dispositivos. Desde AirPods Pro con cancelación de ruido activa y audio espacial,
            hasta Magic Keyboard, Mouse y fundas protectoras Premium. Cada accesorio Apple combina
            funcionalidad excepcional con diseño elegante. Carga inalámbrica MagSafe, cables Lightning
            y USB-C certificados, y mucho más para sacar el máximo provecho de tu ecosistema Apple.
          </p>
        </div>
      </div>
    </section>

    <!-- Sección de Características Destacadas
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h3 class="feature-title">Dynamic Island</h3>
            <p class="feature-text">
              Una nueva forma de interactuar con tu Accesorios. Notificaciones en vivo,
              alertas y actividades en una experiencia fluida y mágica.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3 class="feature-title">Chip A18 Pro</h3>
            <p class="feature-text">
              Rendimiento extremo. El chip más avanzado en un smartphone con
              velocidades impresionantes y eficiencia energética sin precedentes.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <h3 class="feature-title">Sistema de Cámaras Pro</h3>
            <p class="feature-text">
              Captura cada momento con calidad cinematográfica. Fotos de 48MP,
              modo nocturno mejorado y video 4K ProRes.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 class="feature-title">Batería de Todo el Día</h3>
            <p class="feature-text">
              Hasta 29 horas de reproducción de video. Carga rápida,
              carga inalámbrica y compatible con MagSafe.
            </p>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Carrito global renderizado en App.vue -->

    <!-- Modal del producto -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close floating" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        <div class="modal-body">
          <div class="modal-image">
            <div class="image-gallery">
              <img
                v-for="(image, index) in selectedProduct?.images"
                :key="index"
                :src="image"
                :alt="`${selectedProduct?.name} - ${index + 1}`"
                :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div v-if="selectedProduct?.images && selectedProduct.images.length > 1" class="image-dots">
              <button
                v-for="(image, index) in selectedProduct.images"
                :key="index"
                :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index"
              ></button>
            </div>
          </div>
          <div class="modal-info">
            <h2 class="modal-title">{{ selectedProduct?.name }}</h2>
            <div class="modal-category">
              Accesorios
            </div>
            <p class="modal-description">
              {{ selectedProduct?.description }}
            </p>
            <div class="modal-price">
              <span class="modal-current-price">${{ selectedProduct?.price?.toLocaleString() }}</span>
              <span v-if="selectedProduct?.originalPrice" class="modal-original-price">
                ${{ selectedProduct?.originalPrice?.toLocaleString() }}
              </span>
            </div>

            <!-- Selector de colores en el modal -->
            <div v-if="selectedProduct?.colors && selectedProduct.colors.length > 0" class="modal-colors">
              <h4>Seleccionar color:</h4>
              <div class="color-options">
                <div
                  v-for="colorName in selectedProduct.colors"
                  :key="colorName"
                  class="color-option"
                  :class="{ active: modalSelectedColor === colorName }"
                  @click="modalSelectedColor = colorName"
                  :title="colorName"
                  :aria-label="'Color ' + colorName"
                >
                  <div
                    class="color-circle"
                    :style="{ backgroundColor: getColorHex(colorName), border: '2px solid ' + (modalSelectedColor === colorName ? '#26F7D7' : getColorHex(colorName)) }"
                  ></div>
                  <span class="color-name">{{ colorName }}</span>
                </div>
              </div>
            </div>

            <!-- Estado del producto -->
            <div class="modal-status">
              <span :class="['status-badge', getStatusClass(selectedProduct?.status || '')]">
                {{ getStatusText(selectedProduct?.status || '') }}
              </span>
            </div>

            <!-- Botón agregar al carrito -->
            <button
              @click="addToCartFromModal"
              :disabled="selectedProduct?.status !== 'available' || (selectedProduct?.colors && selectedProduct.colors.length > 0 && !modalSelectedColor)"
              class="modal-add-to-cart"
            >
              {{ selectedProduct?.status === 'available' ? 'Agregar a cotización' : 'No disponible' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useCategories } from '@/composables/useCategories'
import { useQuotation } from '@/composables/useQuotation'
import type { Product } from '@/composables/useProducts'
import { useHead } from '@unhead/vue'

const { regularProducts, loadProducts, showcaseProducts, loadShowcaseProducts } = useProducts()
const { categories, loadCategories } = useCategories()




useHead({
  title: 'Accesorios Apple Originales | Apple Store Pro',
  meta: [
    {
      name: 'description',
      content: 'Compra y descubre nuestra colección de accesorios originales Apple: Apple Pencil, teclados, airtag y más. Tienda oficial Apple Store Pro Colombia.'
    },
    { property: 'og:title', content: 'Accesorios Apple Originales | Apple Store Pro' },
    { property: 'og:description', content: 'Compra y descubre nuestra colección de accesorios originales Apple: Apple Pencil, teclados, airtag y más. Tienda oficial Apple Store Pro Colombia.' },
    { property: 'og:image', content: 'https://www.mistorepro.com/images/accesorios.jpg' },
    { property: 'og:url', content: 'https://www.mistorepro.com/accesorios' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://www.mistorepro.com/images/accesorios.jpg' }
  ]
})


const { addToQuotation, openDrawer } = useQuotation()

const isLoadingProducts = ref(true)

// Carrusel dinámico basado en productos de showcase de Accesorios
const currentSlide = ref(0)
let autoplayInterval: number | null = null

// Obtener la categoría de Accesorios
const accesoriosCategory = computed(() => {
  return categories.value.find(cat =>
    cat.name.toLowerCase().includes('accesorio') ||
    cat.name.toLowerCase().includes('accessory')
  )
})

// Filtrar productos showcase de Accesorios para el carrusel
const accesoriosShowcaseProducts = computed(() => {
  if (!accesoriosCategory.value) return []

  return showcaseProducts.value.filter(p =>
    p.category === accesoriosCategory.value!.id ||
    p.category.toLowerCase().includes('accesorio')
  )
})

const nextSlide = () => {
  const total = accesoriosShowcaseProducts.value.length || 1
  currentSlide.value = (currentSlide.value + 1) % total
}

const prevSlide = () => {
  const total = accesoriosShowcaseProducts.value.length || 1
  currentSlide.value = (currentSlide.value - 1 + total) % total
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Auto-avance del carrusel
const startAutoplay = () => {
  autoplayInterval = window.setInterval(() => {
    nextSlide()
  }, 5000) // Cambia cada 5 segundos
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

// Filtrar productos de Accesorios
const accesoriosProducts = computed(() => {
  if (!accesoriosCategory.value) return []

  return regularProducts.value
    .filter(p => {
      const categoryMatch = p.category === accesoriosCategory.value!.id
      const statusMatch = p.status === 'available' || p.status === 'coming-soon'
      return categoryMatch && statusMatch
    })
    .sort((a, b) => {
      // Ordenar por precio de mayor a menor
      return b.price - a.price
    })
})

// Estado para el modal de producto
const showModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const modalSelectedColor = ref('')
const selectedImageIndex = ref(0)

// Función para abrir modal del producto
const openProductModal = (product: Product) => {
  selectedProduct.value = product
  modalSelectedColor.value = ''
  selectedImageIndex.value = 0
  showModal.value = true
}

// Función para cerrar modal
const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
  modalSelectedColor.value = ''
}

// Función para hacer scroll a la sección de productos
const scrollToProducts = () => {
  const productsSection = document.querySelector('.products-section')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Función para agregar al carrito desde el modal
const addToCartFromModal = () => {
  if (selectedProduct.value) {
    if (selectedProduct.value.colors && selectedProduct.value.colors.length > 0 && !modalSelectedColor.value) {
      // Si el producto tiene colores pero no se ha seleccionado uno, no hacer nada
      return
    }

    // Obtener el nombre de la categoría
    const categoryName = categories.value.find(cat => cat.id === selectedProduct.value!.category)?.name || 'Producto'

    // Crear el producto mapeado para el carrito
    const mappedProduct = {
      ...selectedProduct.value,
      inStock: selectedProduct.value.status === 'available',
      image: selectedProduct.value.images[0],
      category: categoryName, // Reemplazar el ID por el nombre
      sku: 'N/A',
      brand: 'N/A'
    }

    // Pasar el color seleccionado como tercer parámetro
    addToQuotation(mappedProduct, 1, modalSelectedColor.value || undefined)
    openDrawer()
    closeModal()
  }
}

// Función obsoleta - ahora abre el modal
const handleAddToCart = (product: Product) => {
  openProductModal(product)
}

// Función para obtener el texto del estado del producto
const getStatusText = (status: string) => {
  switch (status) {
    case 'available':
      return 'Disponible'
    case 'coming-soon':
      return 'Próximamente'
    case 'out-of-stock':
      return 'Agotado'
    default:
      return 'No disponible'
  }
}

// Función para obtener la clase CSS del estado
const getStatusClass = (status: string) => {
  switch (status) {
    case 'available':
      return 'status-available'
    case 'coming-soon':
      return 'status-coming-soon'
    case 'out-of-stock':
      return 'status-out-of-stock'
    default:
      return 'status-unavailable'
  }
}

// Colores de Apple predeterminados
const appleColors: Record<string, string> = {
  'naranja cósmico': '#ff5e00',
  'naranja cosmico': '#ff5e00',
  'azul profundo': '#003d5c',
  'plata': '#c0c0c0',
  'silver': '#c0c0c0',
  'azul': '#1976d2',
  'blue': '#1976d2',
  'negro': '#000000',
  'black': '#000000',
  'blanco': '#ffffff',
  'white': '#ffffff',
  'azul neblina': '#a8c7dd',
  'dorado claro': '#f7e7a1',
  'azul cielo': '#87ceeb',
  'rosa': '#ff69b4',
  'pink': '#ff69b4',
  'amarillo': '#ffeb3b',
  'yellow': '#ffeb3b',
  'verde': '#4caf50',
  'green': '#4caf50',
  'púrpura': '#9c27b0',
  'purpura': '#9c27b0',
  'purple': '#9c27b0',
  'morado': '#9c27b0',
  'oro': '#ffd700',
  'gold': '#ffd700'
}

// Normaliza nombres y obtiene color; fallback a gris claro
const getColorHex = (colorName: string): string => {
  if (!colorName) return '#cccccc'
  const key = colorName.trim().toLowerCase()
  return appleColors[key] || '#cccccc'
}

// Cargar datos al montar
onMounted(async () => {
  try {
    isLoadingProducts.value = true
    await loadCategories()
    await loadProducts()
    await loadShowcaseProducts()
    startAutoplay()
  } catch (error) {
    console.error('Error cargando datos de Accesorios:', error)
  } finally {
    isLoadingProducts.value = false
  }
})

// Limpiar intervalo al desmontar
onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
/* === TEMA OSCURO === */
.accesorios-page {
  min-height: 100vh;
  background: #000000;
  color: #f5f5f7;
}

/* === CARRUSEL === */
.hero-banner {
  position: relative;
  width: 100%;
  height: 90vh;
  min-height: 700px;
  max-height: 1000px;
  overflow: hidden;
  background: #0a0a0a;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
}

.slide-content {
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 40px;
  align-items: center;
  padding: 0 80px;
  height: 100%;
}

.slide-text {
  z-index: 2;
  padding-right: 20px;
}

.slide-label {
  display: inline-block;
  color: #ff9500;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 24px;
  animation: fadeInUp 0.6s ease-out;
}

.slide-title {
  font-size: 4.0rem;
  font-weight: 700;
  margin: 0 0 24px;
  color: #ffffff;
  letter-spacing: -3px;
  line-height: 0.95;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.slide-subtitle {
  font-size: 1.3rem;
  font-weight: 300;
  margin: 0 0 24px;
  color: #f5f5f7;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.shop-now-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: #0a84ff;
  color: white;
  border: none;
  border-radius: 980px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 30px;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.shop-now-btn:hover {
  background: #0077ed;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(10, 132, 255, 0.4);
}

.shop-now-btn svg {
  transition: transform 0.3s ease;
}

.shop-now-btn:hover svg {
  transform: translateY(3px);
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.slide-description {
  font-size: 1.0rem;
  color: #a1a1a6;
  line-height: 1.7;
  max-width: 480px;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.slide-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  animation: fadeInScale 0.8s ease-out 0.4s both;
}

.slide-image img {
  width: 100%;
  max-width: 650px;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  filter: drop-shadow(0 30px 80px rgba(0, 0, 0, 0.6));
  transition: transform 0.5s ease;

  /* Bordes profesionales */
  border-radius: 30px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(10px);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.6),
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Controles del carrusel */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 30px;
}

.carousel-btn.next {
  right: 30px;
}

/* Indicadores */
.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator.active {
  width: 24px;
  border-radius: 4px;
  background: #ffffff;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* Efecto hover en imagen */
.carousel-slide:hover .slide-image img {
  transform: scale(1.03);
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateX(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

/* === CONTAINER === */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* === PRODUCTOS SECTION === */
.products-section {
  padding: 100px 0;
  background: #0a0a0a;
}

@media (max-width: 480px) {
  .products-section {
    padding: 10px 0;
  }
}

.products-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.product-card-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 80px 40px;
  border-bottom: 1px solid #2a2a2a;
  cursor: pointer;
  transition: background 0.3s ease;
}

.product-card-modern:hover {
  background: #222222;
}

.product-card-modern:nth-child(even) .product-visual {
  order: 2;
}

.product-card-modern:nth-child(even) .product-details {
  order: 1;
}

.product-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
  transition: all 0.4s ease;

  /* Bordes visuales y profesionales */
  border-radius: 24px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  background: linear-gradient(145deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(15px);
  box-shadow:
    /* Sombra principal */
    0 20px 50px rgba(0, 0, 0, 0.6),
    /* Anillo exterior */
    0 0 0 1px rgba(255, 255, 255, 0.25),
    /* Anillo azul Apple */
    0 0 0 2px rgba(10, 132, 255, 0.15),
    /* Brillo interno superior */
    inset 0 1px 2px rgba(255, 255, 255, 0.15),
    /* Sombra interna inferior */
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

.product-card-modern:hover .product-image {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow:
    /* Sombra más dramática */
    0 25px 60px rgba(0, 0, 0, 0.7),
    /* Anillo exterior brillante */
    0 0 0 1px rgba(255, 255, 255, 0.4),
    /* Anillo azul más visible */
    0 0 0 3px rgba(10, 132, 255, 0.3),
    /* Glow azul */
    0 0 30px rgba(10, 132, 255, 0.2),
    /* Brillos internos intensificados */
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.15);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-label {
  display: inline-block;
  color: #ff9500;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.product-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
  line-height: 1.1;
}

.product-tagline {
  font-size: 1.3rem;
  color: #a1a1a6;
  margin: 0;
  line-height: 1.4;
}

.product-pricing {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 10px;
}

.product-price {
  font-size: 1.1rem;
  color: #f5f5f7;
  font-weight: 400;
}

.product-price-original {
  font-size: 0.95rem;
  color: #6e6e73;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
}

.product-purchases {
  font-size: 0.9rem;
  color: #0a84ff;
  font-weight: 500;
}

.product-btn {
  width: fit-content;
  padding: 12px 28px;
  background: #0a84ff;
  color: white;
  border: none;
  border-radius: 980px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.product-btn:hover {
  background: #0077ed;
  transform: scale(1.02);
}

/* === SECCIÓN INFORMATIVA SIMPLE === */
.info-section {
  padding: 80px 0;
  background: #0a0a0a;
}

.info-content-centered {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
}

.info-title {
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 30px;
  letter-spacing: -1.5px;
}

.info-text {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #a1a1a6;
  margin: 0;
  font-weight: 400;
}

/* === FEATURES SECTION === */
.features-section {
  padding: 100px 0;
  background: #0a0a0a;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  background: #1a1a1a;
  border-radius: 20px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: #222222;
}

.feature-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 25px;
  color: #0a84ff;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 15px;
}

.feature-text {
  font-size: 1rem;
  color: #a1a1a6;
  line-height: 1.6;
  margin: 0;
}

/* === LOADING & EMPTY STATES === */
.loading-state,
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6e6e73;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(10, 132, 255, 0.2);
  border-top-color: #0a84ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* === RESPONSIVE === */
@media (max-width: 1200px) {
  .slide-content {
    max-width: 100%;
    padding: 0 60px;
  }

  .slide-image img {
    max-width: 550px;
  }
}

@media (max-width: 1024px) {
  .hero-banner {
    height: auto;
    min-height: 600px;
  }

  .slide-content {
    grid-template-columns: 1fr;
    gap: 50px;
    padding: 60px 40px;
  }

  .slide-text {
    padding-right: 0;
    text-align: center;
  }

  .slide-title {
    font-size: 4rem;
  }

  .slide-subtitle {
    font-size: 1.8rem;
  }

  .slide-description {
    max-width: 100%;
    margin: 0 auto;
  }

  .slide-image {
    order: -1;
    height: auto;
    padding: 40px 0;
  }

  .slide-image img {
    max-width: 500px;
    max-height: 500px;
    border-radius: 26px;
    border-width: 2.5px;
    padding: 18px;
  }

  .product-card-modern {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 60px 30px;
  }

  .product-card-modern:nth-child(even) .product-visual,
  .product-card-modern:nth-child(even) .product-details {
    order: initial;
  }

  .info-section {
    padding: 60px 0;
  }

  .info-title {
    font-size: 2.5rem;
  }

  .info-text {
    font-size: 1.2rem;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    min-height: 550px;
  }

  .slide-content {
    padding: 50px 30px;
    gap: 40px;
  }

  .slide-label {
    font-size: 0.85rem;
    margin-bottom: 16px;
  }

  .slide-title {
    font-size: 3rem;
    letter-spacing: -2px;
    margin-bottom: 16px;
  }

  .slide-subtitle {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }

  .slide-description {
    font-size: 1rem;
  }

  .slide-image {
    padding: 30px 0;
  }

  .slide-image img {
    max-width: 380px;
    max-height: 400px;
    border-radius: 24px;
    border-width: 2px;
    padding: 15px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
  }

  .carousel-btn.prev {
    left: 15px;
  }

  .carousel-btn.next {
    right: 15px;
  }

  .product-title {
    font-size: 2.2rem;
  }

  .product-tagline {
    font-size: 1.0rem;
  }

  .info-section {
    padding: 50px 0;
  }

  .info-title {
    font-size: 2.2rem;
    margin-bottom: 25px;
  }

  .info-text {
    font-size: 1.1rem;
    line-height: 1.7;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 480px) {
  .hero-banner {
    min-height: 500px;
  }

  .slide-content {
    padding: 80px 20px;
    padding-bottom: 50px;
    gap: 30px;
  }

  .slide-label {
    font-size: 0.75rem;
    margin-bottom: 12px;
  }

  .slide-title {
    font-size: 2.4rem;
    letter-spacing: -1.5px;
    margin-bottom: 12px;
  }

  .slide-subtitle {
    font-size: 1.0rem;
    margin-bottom: 12px;
  }

  .slide-description {
    font-size: 0.95rem;
  }

  .slide-image {
    padding: 20px 0;
  }

  .slide-image img {
    max-width: 280px;
    max-height: 300px;
    border-radius: 20px;
    border-width: 2px;
    padding: 12px;
  }

  .carousel-btn {
    width: 35px;
    height: 35px;
  }

  .carousel-btn.prev {
    left: 10px;
  }

  .carousel-btn.next {
    right: 10px;
  }

  .product-card-modern {
    padding: 40px 20px;
  }

  .product-title {
    font-size: 1.8rem;
  }

  .info-section {
    padding: 40px 0;
  }

  .info-content-centered {
    padding: 0 15px;
  }

  .info-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    letter-spacing: -1px;
  }

  .info-text {
    font-size: 1rem;
    line-height: 1.6;
  }
}

/* === CARRITO FLOTANTE === */
.floating-cart {
  position: fixed;
  bottom: 500px;
  right: 20px;
  background: var(--brand-success);
  color: white;
  padding: 1rem;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}

.floating-cart:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
}

.floating-cart:hover .cart-tooltip {
  opacity: 1;
  visibility: visible;
}

.cart-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--brand-danger);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.cart-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 1001;
}

.cart-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.8);
}

/* === MODAL DEL CARRITO === */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(8px);
}

.cart-modal {
  background: var(--brand-surface);
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--brand-border);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.cart-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--brand-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--brand-surface);
}

.cart-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--brand-primary-contrast);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
  color: var(--brand-primary-contrast);
}

.close-btn:hover {
  background: var(--brand-border);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2rem;
  background: var(--brand-surface);
}

.empty-cart {
  text-align: center;
  padding: 3rem 0;
  color: rgba(255, 255, 255, 0.6);
}

.empty-cart p {
  font-size: 18px;
  margin: 0;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--brand-bg-end);
  border-radius: 15px;
  border: 1px solid var(--brand-border);
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 0.25rem;
  color: var(--brand-primary-contrast);
}

.item-category {
  font-size: 0.9rem;
  color: var(--brand-success);
  font-weight: 600;
}

.item-color {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  background: var(--brand-border);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  display: inline-block;
  margin-top: 0.3rem;
  font-weight: 500;
}

.item-price {
  font-weight: 700;
  color: var(--brand-success);
  margin-top: 0.5rem;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  background: var(--brand-success);
  color: white;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover {
  background: #0d9466;
  transform: scale(1.1);
}

.quantity-controls span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: var(--brand-primary-contrast);
}

.remove-btn {
  background: var(--brand-danger);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.cart-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid var(--brand-border);
  background: var(--brand-surface);
}

.cart-total-display {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: var(--brand-primary-contrast);
  font-weight: 700;
}

.cart-actions {
  display: flex;
  gap: 1rem;
}

.btn-clear,
.btn-checkout {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear {
  background: var(--brand-border);
  color: rgba(255, 255, 255, 0.8);
}

.btn-clear:hover {
  background: var(--brand-bg-end);
  color: var(--brand-primary-contrast);
}

.btn-checkout {
  background: var(--brand-success);
  color: white;
}

.btn-checkout:hover {
  background: #0d9466;
  transform: translateY(-2px);
}

/* === MODAL DEL PRODUCTO === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
  padding: 20px;
}

.modal-content {
  background: #1d1d1f;
  border-radius: 20px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-close.floating {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f5f5f7;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.modal-close.floating:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: rotate(90deg);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

.modal-image {
  position: relative;
}

.image-gallery {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.image-gallery img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.05);
}

.image-gallery img:hover {
  transform: scale(1.05);
}

.image-gallery img.active {
  border-color: #0071e3;
  box-shadow: 0 0 20px rgba(0, 113, 227, 0.4);
}

.image-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.image-dots button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.image-dots button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.image-dots button.active {
  background: #0071e3;
  width: 24px;
  border-radius: 4px;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #f5f5f7;
  letter-spacing: -0.5px;
}

.modal-category {
  color: #86868b;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.modal-description {
  color: #a1a1a6;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

.modal-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.modal-current-price {
  font-size: 32px;
  font-weight: 700;
  color: #0071e3;
}

.modal-original-price {
  font-size: 20px;
  color: #86868b;
  text-decoration: line-through;
}

.modal-colors {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
}

.modal-colors h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #f5f5f7;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s;
}

.color-option:hover {
  background: rgba(255, 255, 255, 0.05);
}

.color-option.active .color-circle {
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.3);
}

.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.color-name {
  font-size: 12px;
  color: #a1a1a6;
  text-align: center;
  max-width: 80px;
}

.modal-status {
  display: flex;
  gap: 8px;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-available {
  background: rgba(52, 199, 89, 0.15);
  color: #34c759;
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.status-coming-soon {
  background: rgba(255, 204, 0, 0.15);
  color: #ffcc00;
  border: 1px solid rgba(255, 204, 0, 0.3);
}

.status-out-of-stock {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.status-unavailable {
  background: rgba(142, 142, 147, 0.15);
  color: #8e8e93;
  border: 1px solid rgba(142, 142, 147, 0.3);
}

.modal-add-to-cart {
  background: linear-gradient(135deg, #0071e3 0%, #0051a8 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 113, 227, 0.3);
  margin-top: auto;
}

.modal-add-to-cart:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(0, 113, 227, 0.4);
  transform: translateY(-2px);
}

.modal-add-to-cart:disabled {
  background: rgba(142, 142, 147, 0.2);
  color: #8e8e93;
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive para modal de producto */
@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 24px;
  }

  .modal-title {
    font-size: 24px;
  }

  .modal-current-price {
    font-size: 24px;
  }

  .floating-cart {
    bottom: 350px;
    right: 8px;
    padding: 0.75rem;
    width: 55px;
    height: 55px;
  }

  .cart-tooltip {
    display: none;
  }

  .floating-cart:hover .cart-tooltip,
  .floating-cart:active .cart-tooltip {
    display: block;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .cart-overlay {
    padding: 0.5rem;
  }

  .cart-modal {
    width: 95%;
    max-height: 95vh;
    max-width: none;
    margin: 0;
    border-radius: 15px;
  }

  .cart-header {
    padding: 1.5rem 1rem 1rem;
  }

  .cart-header h3 {
    font-size: 1.3rem;
  }

  .cart-content {
    padding: 1rem;
  }

  .cart-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .cart-item img {
    width: 60px;
    height: 60px;
  }

  .item-details h4 {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }

  .item-category {
    font-size: 0.8rem;
  }

  .item-color {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }

  .item-price {
    font-size: 0.9rem;
    margin-top: 0.3rem;
  }

  .cart-footer {
    padding: 1rem;
  }

  .cart-total-display {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .cart-actions {
    flex-direction: column;
  }

  .quantity-controls {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .quantity-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .quantity-controls span {
    font-size: 0.9rem;
    padding: 0.3rem;
    min-width: 24px;
  }
}
</style>



