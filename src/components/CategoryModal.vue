<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ category ? 'Editar Categoría' : 'Agregar Categoría' }}</h3>
        <button @click="$emit('close')" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="name">Nombre de la Categoría *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Ej: iPhone, iPad, Mac..."
          />
        </div>

        <div class="form-group">
          <label for="description">Descripción *</label>
          <textarea
            id="description"
            v-model="formData.description"
            required
            rows="3"
            placeholder="Descripción de la categoría..."
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-save">
            {{ category ? 'Actualizar' : 'Crear' }} Categoría
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue'

// Props
interface Category {
  id: string
  name: string
  description: string
}

const props = defineProps<{
  category?: Category | null
}>()

// Emits
const emit = defineEmits<{
  close: []
  save: [categoryData: Category]
}>()

// Form data
const formData = reactive({
  name: '',
  description: ''
})

// Métodos
const handleSubmit = () => {
  const categoryData = {
    id: props.category?.id || '',
    name: formData.name,
    description: formData.description
  }

  emit('save', categoryData)
}

// Watch para cargar datos de la categoría cuando se edita
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    formData.name = newCategory.name
    formData.description = newCategory.description
  }
}, { immediate: true })

// Limpiar formulario cuando no hay categoría
onMounted(() => {
  if (!props.category) {
    Object.assign(formData, {
      name: '',
      description: ''
    })
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
  max-width: 500px;
  width: 100%;
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--brand-primary);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--brand-success);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
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

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-header,
  .modal-form {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
