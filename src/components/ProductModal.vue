<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ product ? 'Editar Producto' : 'Agregar Producto' }}</h3>
        <button @click="$emit('close')" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <!-- Información básica -->
        <div class="form-section">
          <h4>Información Básica</h4>

          <div class="form-group">
            <label for="name">Nombre del Producto *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Ej: Breaker Termomagnético Acti9"
            />
          </div>

          <div class="form-group">
            <label for="description">Descripción *</label>
            <textarea
              id="description"
              v-model="formData.description"
              required
              rows="3"
              placeholder="Descripción detallada del producto..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Categoría *</label>
              <select id="category" v-model="formData.category" required>
                <option value="">Seleccionar categoría</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Estado *</label>
              <select id="status" v-model="formData.status" required>
                <option value="available">Disponible</option>
                <option value="out-of-stock">Agotado</option>
                <option value="coming-soon">Próximamente</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Precios -->
        <div class="form-section">
          <h4>Precios</h4>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Precio Actual *</label>
              <div class="price-input">
                <span class="currency">$</span>
                <input
                  id="price"
                  v-model.number="formData.price"
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="originalPrice">Precio Original (opcional)</label>
              <div class="price-input">
                <span class="currency">$</span>
                <input
                  id="originalPrice"
                  v-model.number="formData.originalPrice"
                  type="number"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div v-if="formData.originalPrice && formData.price" class="discount-info">
            <span class="discount-badge">
              -{{ Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100) }}% descuento
            </span>
          </div>
        </div>

        <!-- Imagen del Producto -->
        <div class="form-section">
          <h4>Imagen del Producto</h4>

          <div class="form-group">
            <label for="imageUrl">URL de la imagen</label>
            <input
              id="imageUrl"
              v-model="imageUrlInput"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              @input="updatePreview"
            />
          </div>

          <!-- Vista Previa -->
          <div class="preview-section" v-if="previewUrl">
            <label>Vista Previa</label>
            <div class="preview-container">
              <img :src="previewUrl" alt="Vista previa" @error="onImageError" />
            </div>
          </div>

          <!-- Error de imagen -->
          <div class="preview-error" v-if="imageError">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4"/>
              <path d="M12 16h.01"/>
            </svg>
            No se pudo cargar la imagen. Verifica la URL.
          </div>

          <!-- Placeholder -->
          <div class="preview-placeholder" v-if="!previewUrl && !imageError">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <p>Pega una URL de imagen para ver la vista previa</p>
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-save">
            {{ product ? 'Actualizar' : 'Crear' }} Producto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'

// Props
interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  status: 'available' | 'out-of-stock' | 'coming-soon'
}

interface Category {
  id: string
  name: string
  description: string
}

const props = defineProps<{
  product?: Product | null
  categories: Category[]
}>()

// Emits
const emit = defineEmits<{
  close: []
  save: [productData: Product]
}>()

// State
const imageUrlInput = ref('')
const previewUrl = ref('')
const imageError = ref(false)

// Form data
const formData = reactive({
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined as number | undefined,
  image: '',
  category: '',
  status: 'available' as Product['status']
})

// Methods
const updatePreview = () => {
  imageError.value = false
  if (!imageUrlInput.value) {
    previewUrl.value = ''
    formData.image = ''
    return
  }
  previewUrl.value = imageUrlInput.value
  formData.image = imageUrlInput.value
}

const onImageError = () => {
  imageError.value = true
}

const handleSubmit = () => {
  const productData = {
    id: props.product?.id || '',
    name: formData.name,
    description: formData.description,
    price: formData.price,
    originalPrice: formData.originalPrice || undefined,
    image: formData.image,
    category: formData.category,
    status: formData.status
  }
  emit('save', productData)
}

// Watch para cargar datos del producto cuando se edita
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.name = newProduct.name
    formData.description = newProduct.description
    formData.price = newProduct.price
    formData.originalPrice = newProduct.originalPrice
    formData.image = newProduct.image
    formData.category = newProduct.category
    formData.status = newProduct.status
    imageUrlInput.value = newProduct.image || ''
    previewUrl.value = newProduct.image || ''
    imageError.value = false
  }
}, { immediate: true })

onMounted(() => {
  if (!props.product) {
    Object.assign(formData, {
      name: '',
      description: '',
      price: 0,
      originalPrice: undefined,
      image: '',
      category: '',
      status: 'available'
    })
    imageUrlInput.value = ''
    previewUrl.value = ''
    imageError.value = false
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  font-size: 1.5rem;
  color: var(--brand-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
}

.modal-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  font-size: 1.2rem;
  color: var(--brand-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--brand-success);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--brand-primary);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--brand-success);
}

.price-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 1rem;
  color: #666;
  font-weight: 600;
  z-index: 1;
}

.price-input input {
  padding-left: 2.5rem;
}

.discount-info {
  margin-top: 0.5rem;
}

.discount-badge {
  background: var(--brand-success);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Preview */
.preview-section {
  margin-top: 1rem;
}

.preview-section > label {
  display: block;
  font-weight: 600;
  color: var(--brand-primary);
  margin-bottom: 0.75rem;
}

.preview-container {
  background: #FFFFFF;
  border: 2px solid #e5e5e5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  overflow: hidden;
}

.preview-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.preview-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  color: #DC2626;
  font-size: 0.85rem;
}

.preview-placeholder {
  margin-top: 1rem;
  background: #f8f9fa;
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  color: #aaa;
}

.preview-placeholder p {
  margin: 0.75rem 0 0;
  font-size: 0.9rem;
}

/* Modal actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-save {
  background: var(--brand-success);
  color: white;
}

.btn-save:hover {
  background: #0d9466;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header,
  .modal-form {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
