<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <button class="back-button" @click="goBack">
          <span class="icon">←</span>
          {{ t('checkout.back') }}
        </button>
        <h1 class="checkout-title">{{ t('checkout.title') }}</h1>
      </div>

      <div class="checkout-content">
        <!-- Resumen del pedido (lado izquierdo) -->
        <div class="order-summary">
          <h2>{{ t('checkout.summaryTitle') }}</h2>

          <div class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="item-image"
              >
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <div v-if="item.characteristics && item.characteristics.length > 0" class="item-characteristics">
                  <span v-for="(char, index) in item.characteristics" :key="index" class="item-char-badge">
                    {{ char }}
                  </span>
                </div>
                <p class="item-quantity">Cantidad: {{ item.quantity }}</p>
                <p class="item-price">${{ (item.price * item.quantity).toLocaleString() }} COP</p>
              </div>
            </div>

            <div v-if="cartItems.length === 0" class="empty-cart">
              <p>{{ t('checkout.emptyCart') }}</p>
              <button @click="goBack" class="btn-primary">{{ t('checkout.goStore') }}</button>
            </div>
          </div>

          <div v-if="cartItems.length > 0" class="order-total">
            <div class="total-row">
              <span>{{ t('checkout.subtotal') }}:</span>
              <span>${{ totalPrice.toLocaleString() }} COP</span>
            </div>
            <div class="total-row">
              <span>{{ t('checkout.shipping') }}:</span>
              <span>{{ deliveryMethod === 'delivery' ? t('checkout.shippingDeliveryValue') : t('checkout.shippingPickupValue') }}</span>
            </div>
            <div class="total-row total-final">
              <span>{{ t('checkout.total') }}:</span>
              <span>${{ finalTotal.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Botón seguir comprando -->
          <div v-if="cartItems.length > 0" class="continue-shopping">
            <button @click="goToHome" class="btn-continue">
              ← {{ t('checkout.continueShopping') }}
            </button>
          </div>
        </div>

        <!-- Formulario de contacto y entrega (lado derecho) -->
        <div class="checkout-form">
          <!-- Sección de contacto -->
          <div class="form-section">
            <h2>{{ t('checkout.contactTitle') }}</h2>
            <div class="form-group">
              <label for="name">{{ t('checkout.fullName') }} <span class="required">*</span></label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                :placeholder="t('checkout.fullNamePlaceholder')"
                :class="{ 'error': errors.name }"
                @input="clearError('name')"
              >
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="email">{{ t('checkout.email') }} <span class="required">*</span></label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                :placeholder="t('checkout.emailPlaceholder')"
                :class="{ 'error': errors.email }"
                @input="clearError('email')"
              >
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="identificationNumber">{{ t('checkout.idNumber') }} <span class="required">*</span></label>
                <input
                  id="identificationNumber"
                  v-model="formData.identificationNumber"
                  type="text"
                  :placeholder="t('checkout.idNumberPlaceholder')"
                  :class="{ 'error': errors.identificationNumber }"
                  @input="clearError('identificationNumber')"
                >
                <span v-if="errors.identificationNumber" class="error-message">{{ errors.identificationNumber }}</span>
              </div>

              <div class="form-group">
                <label for="contactNumber">{{ t('checkout.phone') }} <span class="required">*</span></label>
                <input
                  id="contactNumber"
                  v-model="formData.contactNumber"
                  type="tel"
                  :placeholder="t('checkout.phonePlaceholder')"
                  :class="{ 'error': errors.contactNumber }"
                  @input="clearError('contactNumber')"
                >
                <span v-if="errors.contactNumber" class="error-message">{{ errors.contactNumber }}</span>
              </div>
            </div>

            <div class="instagram-link-container">
              <p class="instagram-text">
                <a :href="instagramUrl" target="_blank" class="instagram-link" rel="noopener noreferrer">
                  <span class="ig-dot" aria-hidden="true"></span>
                  {{ t('social.instagramFollow') }}
                </a>
              </p>
            </div>

            <div class="form-group checkbox">
              <label class="checkbox-label">
                <input
                  v-model="formData.acceptTerms"
                  type="checkbox"
                >
                <span>
                  {{ t('checkout.termsAcceptPrefix') }}
                  <router-link to="/terms-and-conditions" class="privacy-link" target="_blank">
                    {{ t('checkout.termsAcceptLink') }}
                  </router-link>
                  <span class="required">*</span>
                </span>
              </label>
              <span v-if="errors.acceptTerms" class="error-message">{{ errors.acceptTerms }}</span>
            </div>
          </div>

          <!-- Sección de entrega -->
          <div class="form-section">
            <h2>{{ t('checkout.deliveryTitle') }}</h2>

            <div class="delivery-options">
              <label class="delivery-option" :class="{ 'selected': deliveryMethod === 'delivery' }">
                <input
                  v-model="deliveryMethod"
                  type="radio"
                  value="delivery"
                  name="delivery"
                >
                <div class="option-content">
                  <div class="option-header">
                    <span class="option-icon">🚚</span>
                    <span class="option-title">{{ t('checkout.deliveryHome') }}</span>
                  </div>
                  <span class="option-price">{{ t('checkout.shippingDeliveryValue') }}</span>
                </div>
              </label>

              <label class="delivery-option" :class="{ 'selected': deliveryMethod === 'pickup' }">
                <input
                  v-model="deliveryMethod"
                  type="radio"
                  value="pickup"
                  name="delivery"
                >
                <div class="option-content">
                  <div class="option-header">
                    <span class="option-icon">🏪</span>
                    <span class="option-title">{{ t('checkout.deliveryPickup') }}</span>
                  </div>
                  <span class="option-price">{{ t('checkout.shippingPickupValue') }}</span>
                </div>
              </label>
            </div>

            <!-- Dirección de envío (solo si es delivery) -->
            <transition name="fade">
              <div v-if="deliveryMethod === 'delivery'" class="address-section">
                <div class="form-group">
                  <label for="address">{{ t('checkout.address') }} <span class="required">*</span></label>
                  <input
                    id="address"
                    v-model="formData.address"
                    type="text"
                    :placeholder="t('checkout.addressPlaceholder')"
                    :class="{ 'error': errors.address }"
                    @input="clearError('address')"
                  >
                  <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city">{{ t('checkout.city') }} <span class="required">*</span></label>
                    <input
                      id="city"
                      v-model="formData.city"
                      type="text"
                      :placeholder="t('checkout.cityPlaceholder')"
                      :class="{ 'error': errors.city }"
                      @input="clearError('city')"
                    >
                    <span v-if="errors.city" class="error-message">{{ errors.city }}</span>
                  </div>

                  <div class="form-group">
                    <label for="phone">{{ t('checkout.deliveryPhone') }} <span class="required">*</span></label>
                    <input
                      id="phone"
                      v-model="formData.phone"
                      type="tel"
                      :placeholder="t('checkout.phonePlaceholder')"
                      :class="{ 'error': errors.phone }"
                      @input="clearError('phone')"
                    >
                    <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Información de pickup (solo si es pickup) -->
            <transition name="fade">
              <div v-if="deliveryMethod === 'pickup'" class="pickup-info">
                <div class="info-card">
                  <h3>📍 {{ t('checkout.pickupLocationTitle') }}</h3>
                  <p class="location-name"><strong>{{ t('store.pickup.title') }}</strong></p>
                  <p class="location-address">{{ t('store.pickup.addressLine') }}</p>

                  <h4>⏰ {{ t('store.pickup.hoursTitle') }}</h4>
                  <p>{{ t('store.pickup.hours.weekday') }}</p>
                  <p>{{ t('store.pickup.hours.saturday') }}</p>
                  <p>{{ t('store.pickup.hours.sunday') }}</p>
                </div>
              </div>
            </transition>
          </div>

          <!-- Mensaje de error general -->
          <div v-if="errors.general" class="error-alert">
            <span>⚠️ {{ errors.general }}</span>
          </div>

          <!-- Botón de confirmar pedido -->
          <button
            v-if="cartItems.length > 0"
            class="btn-confirm"
            :disabled="isProcessing"
            @click="confirmOrder"
          >
            <span v-if="!isProcessing">{{ t('checkout.confirm') }} - ${{ finalTotal.toLocaleString() }}</span>
            <span v-else>{{ t('checkout.processing') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { paymentService } from '@/services/api/paymentService'
import type { CreateProductPaymentRequest } from '@/services/api/paymentService'
import { useI18n } from 'vue-i18n'
import { SOCIALS } from '@/config/brand'

defineOptions({
  name: 'CheckoutView'
})

const router = useRouter()
const { cartItems, totalPrice, clearCart } = useCart()
const { t } = useI18n()

const instagramUrl = SOCIALS.instagramUrl

// Estado del formulario
const formData = ref({
  name: '',
  email: '',
  identificationNumber: '',
  contactNumber: '',
  acceptTerms: false,
  address: '',
  city: '',
  phone: ''
})

const deliveryMethod = ref<'delivery' | 'pickup'>('delivery')
const isProcessing = ref(false)
const errors = ref<Record<string, string>>({})

watch(
  deliveryMethod,
  (value) => {
    if (value === 'pickup') {
      // Estos campos no aplican para pickup
      formData.value.address = ''
      formData.value.city = ''
      formData.value.phone = ''
      delete errors.value.address
      delete errors.value.city
      delete errors.value.phone
    }
  },
  { immediate: true }
)

// Función para verificar si el usuario ya aceptó los términos
const checkTermsAcceptance = () => {
  const termsAccepted = sessionStorage.getItem('termsAccepted')
  console.log('🔍 Verificando términos aceptados en sessionStorage:', termsAccepted)
  if (termsAccepted === 'true') {
    formData.value.acceptTerms = true
    console.log('✅ Términos marcados automáticamente')
  }
}

// Listener para cuando la ventana recupera el foco (usuario vuelve de otra pestaña)
const handleWindowFocus = () => {
  console.log('👀 Ventana recuperó el foco, verificando términos...')
  checkTermsAcceptance()
}

// Verificar al montar el componente
onMounted(() => {
  console.log('🏁 Componente Checkout montado')
  checkTermsAcceptance()

  // Agregar listener para cuando vuelve el foco a la ventana
  window.addEventListener('focus', handleWindowFocus)
})

// Limpiar el listener al desmontar
onUnmounted(() => {
  window.removeEventListener('focus', handleWindowFocus)
})

// Total final (incluye envío si aplica)
const finalTotal = computed(() => {
  const shipping = deliveryMethod.value === 'delivery' ? 15000 : 0
  return totalPrice.value + shipping
})

// Validación
const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = t('checkout.errors.nameRequired')
  }

  if (!formData.value.email.trim()) {
    errors.value.email = t('checkout.errors.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = t('checkout.errors.emailInvalid')
  }

  if (!formData.value.identificationNumber.trim()) {
    errors.value.identificationNumber = t('checkout.errors.idRequired')
  }

  if (!formData.value.contactNumber.trim()) {
    errors.value.contactNumber = t('checkout.errors.phoneRequired')
  }

  if (deliveryMethod.value === 'delivery') {
    if (!formData.value.address.trim()) {
      errors.value.address = t('checkout.errors.addressRequired')
    }
    if (!formData.value.city.trim()) {
      errors.value.city = t('checkout.errors.cityRequired')
    }
    if (!formData.value.phone.trim()) {
      errors.value.phone = t('checkout.errors.deliveryPhoneRequired')
    }
  }

  if (!formData.value.acceptTerms) {
    errors.value.acceptTerms = t('checkout.errors.termsRequired')
  }

  return Object.keys(errors.value).length === 0
}

const clearError = (field: string) => {
  delete errors.value[field]
}

const confirmOrder = async () => {
  console.log('🔵 Iniciando confirmOrder...')

  if (!validateForm()) {
    console.log('❌ Validación fallida')
    return
  }

  console.log('✅ Validación exitosa')
  isProcessing.value = true

  // Limpiar errores previos
  errors.value.general = ''

  try {
    // Verificar que haya items en el carrito
    if (cartItems.value.length === 0) {
      throw new Error('El carrito está vacío')
    }

    // Preparar los items del carrito para el backend
    const items = cartItems.value.map(item => {
      const productId = parseInt(item.id)

      // Validar que el ID sea un número válido
      if (isNaN(productId)) {
        console.error('❌ ID de producto inválido:', item.id)
        throw new Error(`ID de producto inválido: ${item.id}`)
      }

      const cartItem: {
        productId: number
        quantity: number
        selectedColor?: string
      } = {
        productId: productId,
        quantity: item.quantity
      }

      // Solo agregar selectedColor si existe
      if (item.selectedColor) {
        cartItem.selectedColor = item.selectedColor
      }

      return cartItem
    })

    console.log('📦 Items preparados:', items)
    console.log('📦 CartItems originales:', cartItems.value)

    // Preparar el request para el backend
    const paymentRequest: CreateProductPaymentRequest = {
      buyerEmail: formData.value.email,
      buyerName: formData.value.name,
      buyerIdentificationNumber: formData.value.identificationNumber,
      buyerContactNumber: formData.value.contactNumber,
      items: items
    }

    // Si es envío a domicilio, agregar dirección
    if (deliveryMethod.value === 'delivery') {
      paymentRequest.shippingAddress = `${formData.value.address}, ${formData.value.city}`
    }

    console.log('📤 Enviando request de pago:', paymentRequest)

    // Llamar al backend para crear el pago
    const response = await paymentService.createProductPayment(paymentRequest)

    console.log('📥 Respuesta completa del backend:', response)
    console.log('📥 response.success:', response.success)
    console.log('📥 response.data:', response.data)

    if (response.success && response.data) {
      // Redirigir a la URL de pago de Wompi
      const paymentUrl = response.data.payment.paymentUrl
      console.log('💳 URL de pago obtenida:', paymentUrl)
      console.log('💳 Tipo de paymentUrl:', typeof paymentUrl)
      console.log('💳 paymentUrl válida:', !!paymentUrl)

      if (!paymentUrl) {
        throw new Error('No se recibió URL de pago del servidor')
      }

      // Guardar info de la compra antes de redirigir
      sessionStorage.setItem('pendingPurchaseId', response.data.purchase.id.toString())
      console.log('💾 Purchase ID guardado:', response.data.purchase.id)

      // Limpiar carrito
      clearCart()
      console.log('🗑️ Carrito limpiado')

      // Redirigir a Wompi
      console.log('🚀 Redirigiendo a:', paymentUrl)
      window.location.href = paymentUrl
    } else {
      console.error('❌ Response no exitoso:', response)
      throw new Error(response.message || 'Error al crear el pago')
    }
  } catch (error: unknown) {
    console.error('❌ Error capturado en catch:', error)
    console.error('❌ Tipo de error:', typeof error)
    console.error('❌ Error completo:', JSON.stringify(error, null, 2))

    // Mostrar error al usuario
    let errorMessage = 'Hubo un problema al procesar tu pago. '

    if (error instanceof Error) {
      errorMessage = error.message
      console.error('❌ Error message:', error.message)
      console.error('❌ Error stack:', error.stack)
    }

    // Si es un error de axios/fetch
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>
      if (err.response) {
        console.error('❌ Error response:', err.response)
        const response = err.response as Record<string, unknown>
        console.error('❌ Error response.data:', response.data)

        if (response.data && typeof response.data === 'object') {
          const data = response.data as Record<string, unknown>
          const backendMessage = (data.message as string) || (data.error as string)

          if (backendMessage) {
            // Si es error 500 del servidor
            if (response.status === 500) {
              errorMessage = '⚠️ Error en el servidor de pagos. Por favor contacta a soporte o intenta más tarde.'
            } else {
              errorMessage = backendMessage
            }
          }
        }
      }
    }

    errors.value.general = errorMessage
    console.error('❌ Error mostrado al usuario:', errorMessage)

    isProcessing.value = false
  }
}

const goBack = () => {
  router.push('/')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

.checkout-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #071e25 0%, #081f2a 60%, #061318 100%);
  padding: 5rem 1rem;
}

.checkout-container {
  max-width: 1400px;
  margin: 0 auto;
}

.checkout-header {
  margin-bottom: 2rem;
}

.back-button {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(201, 168, 89, 0.18);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  color: rgba(246, 245, 241, 0.9);
}

.back-button:hover {
  background: rgba(201, 168, 89, 0.08);
  transform: translateX(-4px);
  border-color: rgba(201, 168, 89, 0.35);
}

.checkout-title {
  font-size: 2rem;
  color: rgba(246, 245, 241, 0.95);
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  letter-spacing: 0.5px;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
}

/* Resumen del pedido */
.order-summary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.035) 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
  height: fit-content;
  position: sticky;
  top: 2rem;
  border: 1px solid rgba(201, 168, 89, 0.16);
}

.order-summary h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: rgba(246, 245, 241, 0.95);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  letter-spacing: 0.4px;
}

.cart-items {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(201, 168, 89, 0.12);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details h3 {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: rgba(246, 245, 241, 0.92);
}

.item-quantity {
  font-size: 0.875rem;
  color: rgba(246, 245, 241, 0.68);
  margin: 0.25rem 0;
}

.item-color {
  font-size: 0.875rem;
  color: rgb(201, 168, 89);
  margin: 0.25rem 0;
  font-weight: 500;
}

.item-characteristics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.5rem 0;
}

.item-char-badge {
  font-size: 0.75rem;
  color: rgba(246, 245, 241, 0.95);
  background: rgba(201, 168, 89, 0.2);
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  display: inline-block;
  font-weight: 600;
  border: 1px solid rgba(201, 168, 89, 0.3);
  text-transform: lowercase;
}

.item-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(201, 168, 89);
  margin: 0;
}

.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(246, 245, 241, 0.7);
}

.order-total {
  border-top: 1px solid rgba(201, 168, 89, 0.18);
  padding-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 1rem;
  color: rgba(246, 245, 241, 0.7);
}

.total-final {
  border-top: 1px solid rgba(201, 168, 89, 0.18);
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgba(246, 245, 241, 0.95);
}

.continue-shopping {
  margin-top: 1.5rem;
  text-align: center;
}

.btn-continue {
  background: transparent;
  color: rgb(201, 168, 89);
  border: 2px solid rgba(201, 168, 89, 0.6);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-continue:hover {
  background: rgba(201, 168, 89, 0.14);
  color: rgba(246, 245, 241, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(201, 168, 89, 0.12);
}

/* Formulario */
.checkout-form {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.035) 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(201, 168, 89, 0.16);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: rgba(246, 245, 241, 0.95);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  letter-spacing: 0.4px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: rgba(246, 245, 241, 0.88);
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(201, 168, 89, 0.22);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(246, 245, 241, 0.92);
}

.form-group input:focus {
  outline: none;
  border-color: rgba(201, 168, 89, 0.75);
  box-shadow: 0 0 0 3px rgba(201, 168, 89, 0.14);
}

.form-group input.error {
  border-color: rgba(255, 140, 140, 0.95);
}

.error-message {
  color: rgba(255, 140, 140, 0.95);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
  color: rgba(246, 245, 241, 0.88);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.instagram-link-container {
  background: linear-gradient(135deg, rgba(201, 168, 89, 0.16) 0%, rgba(201, 168, 89, 0.06) 100%);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  text-align: center;
  border: 1px solid rgba(201, 168, 89, 0.22);
}

.instagram-text {
  margin: 0;
}

.instagram-link {
  color: rgba(246, 245, 241, 0.92);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.ig-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgb(201, 168, 89);
  box-shadow: 0 0 0 4px rgba(201, 168, 89, 0.15);
  flex-shrink: 0;
}

.instagram-link:hover {
  transform: scale(1.05);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.privacy-text {
  font-size: 0.875rem;
  color: rgba(246, 245, 241, 0.84);
  margin-top: 1rem;
}

.privacy-link {
  color: rgb(201, 168, 89);
  text-decoration: underline;
  font-weight: 600;
}

.privacy-link:hover {
  color: rgba(201, 168, 89, 0.9);
}

.required {
  color: rgba(201, 168, 89, 0.95);
  margin-left: 0.25rem;
}

/* Opciones de entrega */
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.delivery-option {
  border: 2px solid rgba(201, 168, 89, 0.22);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
}

.delivery-option:hover {
  border-color: rgba(201, 168, 89, 0.55);
  background: rgba(201, 168, 89, 0.08);
}

.delivery-option.selected {
  border-color: rgba(201, 168, 89, 0.7);
  background: rgba(201, 168, 89, 0.1);
  box-shadow: 0 0 0 3px rgba(201, 168, 89, 0.14);
}

.delivery-option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-icon {
  font-size: 1.5rem;
}

.option-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: rgba(246, 245, 241, 0.92);
}

.option-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(201, 168, 89);
}

/* Información de pickup */
.pickup-info {
  margin-top: 1rem;
}

.info-card {
  background: rgba(201, 168, 89, 0.08);
  border: 1px solid rgba(201, 168, 89, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
}

.info-card h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.info-card h4 {
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #f5f5f7;
}

.info-card p {
  margin: 0.5rem 0;
  color: rgba(246, 245, 241, 0.84);
  line-height: 1.6;
}

.location-name {
  color: rgb(201, 168, 89) !important;
  font-size: 1rem;
}

.location-address {
  color: rgba(246, 245, 241, 0.84) !important;
  font-size: 0.95rem;
  margin-bottom: 1rem !important;
}

/* Alerta de error */
.error-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(255, 140, 140, 0.55);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
  color: rgba(255, 140, 140, 0.95);
  font-weight: 500;
  text-align: center;
}

/* Botón de confirmar */
.btn-confirm {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgb(201, 168, 89) 0%, rgb(180, 145, 65) 100%);
  color: #061318;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(201, 168, 89, 0.2);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  padding: 0.875rem 2rem;
  background: rgb(201, 168, 89);
  color: #061318;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}

/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 968px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
    order: 2;
  }

  .checkout-form {
    order: 1;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .checkout-page {
    padding: 1rem 0.5rem;
  }

  .checkout-title {
    font-size: 1.5rem;
  }

  .order-summary,
  .checkout-form {
    padding: 1.5rem;
  }
}
</style>
