<template>
  <div class="client-form-page">
    <!-- Header -->
    <div class="form-header">
      <div class="header-left">
        <router-link :to="backRoute" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </router-link>
        <h1 class="form-title">{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}</h1>
      </div>
      <div class="header-actions">
        <router-link :to="backRoute" class="btn-outline">Cancelar</router-link>
        <button class="btn-primary" :disabled="saving" @click="handleSubmit">
          <span v-if="saving" class="spinner-sm"></span>
          {{ isEdit ? 'Actualizar' : 'Crear Cliente' }}
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="formError" class="error-banner">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{{ formError }}</span>
      <button class="error-close" @click="formError = ''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loadingClient" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando datos del cliente...</p>
    </div>

    <!-- Form -->
    <form v-else class="form-body" @submit.prevent="handleSubmit">
      <!-- Datos Generales -->
      <div class="form-card">
        <h3 class="card-title">Datos Generales</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label required">Razón Social / Nombre</label>
            <input v-model="form.name" type="text" class="form-input" placeholder="Nombre de la empresa" required />
          </div>
          <div class="form-group">
            <label class="form-label">NIT</label>
            <input v-model="form.nit" type="text" class="form-input" placeholder="900123456-7" />
          </div>
          <div class="form-group">
            <label class="form-label">Código</label>
            <input v-model="form.code" type="text" class="form-input" placeholder="Ej: CLI-001" />
          </div>
          <div class="form-group">
            <label class="form-label">Tipo de Organización</label>
            <select v-model="form.organizationType" class="form-input">
              <option value="">Seleccionar...</option>
              <option v-for="opt in orgTypes" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div v-if="getOrgTypeBase(form.organizationType) === OTRO_VALUE" class="form-group">
            <label class="form-label required">Especifique el tipo de organización</label>
            <input v-model="organizationTypeDetail" type="text" class="form-input" placeholder="Ej: Organismo de certificación de personas" />
          </div>
          <div class="form-group">
            <label class="form-label">Norma</label>
            <input v-model="form.norm" type="text" class="form-input" placeholder="Ej: ISO 9001:2015" />
          </div>
        </div>
      </div>

      <!-- Ubicación -->
      <div class="form-card">
        <h3 class="card-title">Ubicación</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Ciudad</label>
            <input v-model="form.city" type="text" class="form-input" placeholder="Bogotá" />
          </div>
          <div class="form-group">
            <label class="form-label">Departamento</label>
            <input v-model="form.department" type="text" class="form-input" placeholder="Cundinamarca" />
          </div>
          <div class="form-group full-width">
            <label class="form-label">Dirección</label>
            <input v-model="form.address" type="text" class="form-input" placeholder="Calle 123 #45-67" />
          </div>
        </div>
      </div>

      <!-- Contacto -->
      <div class="form-card">
        <h3 class="card-title">Información de Contacto</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input v-model="form.phone" type="text" class="form-input" placeholder="+57 300 1234567" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="contacto@empresa.com" />
          </div>
          <div class="form-group full-width">
            <label class="form-label">Página Web</label>
            <input v-model="form.website" type="url" class="form-input" placeholder="https://www.empresa.com" />
          </div>
        </div>
      </div>

      <!-- Configuración -->
      <div class="form-card">
        <h3 class="card-title">Configuración</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label checkbox-label">
              <input v-model="form.isProspect" type="checkbox" class="form-checkbox" />
              <span class="checkbox-text">Prospecto</span>
              <span class="checkbox-hint">Marcar si es un prospecto, no un cliente activo</span>
            </label>
          </div>
          <div class="form-group">
            <label class="form-label checkbox-label">
              <input v-model="form.showResources" type="checkbox" class="form-checkbox" />
              <span class="checkbox-text">Mostrar Recursos</span>
              <span class="checkbox-hint">Permitir al cliente ver recursos en el portal</span>
            </label>
          </div>
          <div class="form-group full-width">
            <label class="form-label">Observaciones</label>
            <textarea v-model="form.observations" class="form-input form-textarea" rows="3" placeholder="Notas adicionales sobre el cliente..."></textarea>
          </div>
        </div>
      </div>

      <!-- Contactos -->
      <div id="contacts-section" class="form-card">
        <div class="card-header-row">
          <h3 class="card-title">Contactos</h3>
          <button type="button" class="btn-outline-sm" @click="addContact">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar Contacto
          </button>
        </div>

        <div v-if="contacts.length === 0" class="empty-contacts">
          <p>No hay contactos. Puedes agregar contactos después de crear el cliente.</p>
        </div>

        <div v-else class="contacts-list">
          <div v-for="(contact, index) in contacts" :key="index" class="contact-card">
            <div class="contact-card-header">
              <span class="contact-number">Contacto {{ index + 1 }}</span>
              <button type="button" class="remove-btn" @click="removeContact(index)" title="Eliminar contacto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input v-model="contact.name" type="text" class="form-input" placeholder="Nombre del contacto" />
              </div>
              <div class="form-group">
                <label class="form-label">Cargo</label>
                <input v-model="contact.position" type="text" class="form-input" placeholder="Gerente de Calidad" />
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input v-model="contact.phone" type="text" class="form-input" placeholder="+57 300 1234567" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-model="contact.email" type="email" class="form-input" placeholder="contacto@empresa.com" />
              </div>
              <div class="form-group">
                <label class="form-label checkbox-label compact">
                  <input type="checkbox" class="form-checkbox" :checked="contact.isPrimary" @change="setPrincipal(index)" />
                  <span class="checkbox-text">Contacto Principal</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <router-link :to="backRoute" class="btn-outline">Cancelar</router-link>
        <button type="submit" class="btn-primary" :disabled="saving">
          <span v-if="saving" class="spinner-sm"></span>
          {{ isEdit ? 'Actualizar Cliente' : 'Crear Cliente' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCRM } from '@/composables/useCRM'

const route = useRoute()
const router = useRouter()
const { fetchCliente, createCliente, updateCliente } = useCRM()

const isEdit = computed(() => !!route.params.id)
const clienteId = computed(() => Number(route.params.id))
const backRoute = computed(() => isEdit.value ? `/admin/crm/clientes/${clienteId.value}` : '/admin/crm/clientes')

const saving = ref(false)
const loadingClient = ref(false)
const formError = ref('')

const form = reactive({
  name: '',
  nit: '',
  code: '',
  organizationType: '',
  norm: '',
  city: '',
  department: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  isProspect: false,
  showResources: false,
  observations: '',
})

const contacts = ref<Array<{
  name: string
  position: string
  phone: string
  email: string
  isPrimary: boolean
}>>([])

const orgTypes = [
  'Sistema de Gestión de Calidad',
  'Organismos de Inspección',
  'Laboratorios de Ensayo',
  'Laboratorios de Calibración',
  'Organismos de Certificación de Productos',
  'Organización',
  'Otro',
]

const OTRO_VALUE = 'Otro'

function getOrgTypeBase(val: string): string {
  if (val.startsWith('Otro - ')) return 'Otro'
  return val
}

function getOrgTypeDetail(val: string): string {
  if (val.startsWith('Otro - ')) return val.slice(7)
  return ''
}

const organizationTypeDetail = ref('')

function addContact() {
  contacts.value.push({
    name: '',
    position: '',
    phone: '',
    email: '',
    isPrimary: contacts.value.length === 0,
  })
}

function removeContact(index: number) {
  contacts.value.splice(index, 1)
}

function setPrincipal(index: number) {
  contacts.value.forEach((c, i) => {
    c.isPrimary = i === index
  })
}

async function loadClient() {
  if (!isEdit.value) return
  loadingClient.value = true
  try {
    const cliente = await fetchCliente(clienteId.value)
    if (!cliente) {
      formError.value = 'No se pudo cargar el cliente'
      return
    }

    form.name = cliente.razonSocial
    form.nit = cliente.nit
    form.code = cliente.codigo || ''
    form.organizationType = getOrgTypeBase(cliente.tipoOrganizacion || '')
    organizationTypeDetail.value = getOrgTypeDetail(cliente.tipoOrganizacion || '')
    form.norm = cliente.norma || ''
    form.city = cliente.ciudad
    form.department = cliente.departamento
    form.address = cliente.direccion
    form.phone = cliente.telefono
    form.email = cliente.correo
    form.website = cliente.paginaWeb || ''
    form.isProspect = cliente.isProspect || false
    form.showResources = cliente.showResources || false
    form.observations = cliente.observaciones || ''

    if (cliente.contacts && cliente.contacts.length > 0) {
      contacts.value = cliente.contacts.map((c: any) => ({
        name: c.name || '',
        position: c.position || '',
        phone: c.phone || '',
        email: c.email || '',
        isPrimary: c.isPrimary || false,
      }))
    }
  } catch {
    formError.value = 'Error al cargar el cliente'
  } finally {
    loadingClient.value = false
  }
}

async function handleSubmit() {
  formError.value = ''

  if (!form.name.trim()) {
    formError.value = 'La razón social es obligatoria'
    return
  }

  if (getOrgTypeBase(form.organizationType) === OTRO_VALUE && !organizationTypeDetail.value.trim()) {
    formError.value = 'Por favor, especifique el tipo de organización.'
    return
  }

  saving.value = true
  try {
    const payload = {
      razonSocial: form.name.trim(),
      nit: form.nit.trim(),
      codigo: form.code.trim() || undefined,
      tipoOrganizacion: getOrgTypeBase(form.organizationType) === OTRO_VALUE
        ? `Otro - ${organizationTypeDetail.value.trim()}`
        : form.organizationType.trim() || undefined,
      norma: form.norm.trim() || undefined,
      ciudad: form.city.trim(),
      departamento: form.department.trim(),
      direccion: form.address.trim(),
      telefono: form.phone.trim(),
      correo: form.email.trim(),
      paginaWeb: form.website.trim() || undefined,
      estado: form.isProspect ? 'prospecto' as const : 'activo' as const,
      showResources: form.showResources,
      observaciones: form.observations.trim() || undefined,
      contacts: contacts.value
        .filter(c => c.name.trim())
        .map(c => ({
          name: c.name.trim(),
          position: c.position.trim() || undefined,
          phone: c.phone.trim() || undefined,
          email: c.email.trim() || undefined,
          isPrimary: c.isPrimary,
        })),
    }

    let result
    if (isEdit.value) {
      result = await updateCliente(clienteId.value, payload)
    } else {
      result = await createCliente(payload)
    }

    if (result) {
      router.push(isEdit.value ? `/admin/crm/clientes/${clienteId.value}` : '/admin/crm/clientes')
    } else {
      formError.value = isEdit.value
        ? 'No se pudo actualizar el cliente'
        : 'No se pudo crear el cliente'
    }
  } catch {
    formError.value = 'Error al guardar el cliente'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadClient()
  if (route.query.isProspect === 'true') {
    form.isProspect = true
  }
  if (route.query.section === 'contacts') {
    nextTick(() => {
      document.getElementById('contacts-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
})
</script>

<style scoped>
.client-form-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== HEADER ===== */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--c-border);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--c-gray);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 8px;
  transition: color 0.15s;
}
.back-link:hover { color: var(--c-primary); }

.form-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--c-black);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-primary:hover:not(:disabled) { background: var(--c-primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--c-white);
  color: var(--c-black);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { border-color: var(--c-gray-light); }

.btn-outline-sm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--c-white);
  color: var(--c-black);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline-sm:hover { border-color: var(--c-primary); color: var(--c-primary); }

/* ===== ERROR ===== */
.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.88rem;
}
.error-close {
  margin-left: auto;
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 4px;
}

/* ===== FORM BODY ===== */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 24px;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-black);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 20px;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card-header-row .card-title { margin-bottom: 0; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group.full-width { grid-column: 1 / -1; }

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}
.form-label.required::after { content: ' *'; color: #dc2626; }

.form-input {
  padding: 10px 14px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: inherit;
  color: var(--c-black);
  background: var(--c-white);
  outline: none;
  transition: all 0.2s;
}
.form-input:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.08);
}
.form-input::placeholder { color: var(--c-gray-light); }

select.form-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* ===== CHECKBOX ===== */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  padding: 8px 0;
}
.checkbox-label.compact { padding: 0; }

.form-checkbox {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--c-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--c-black);
}

.checkbox-hint {
  display: block;
  font-size: 0.78rem;
  color: var(--c-gray);
  margin-top: 2px;
  font-weight: 400;
}

/* ===== CONTACTS ===== */
.empty-contacts {
  text-align: center;
  padding: 24px;
  color: var(--c-gray);
  font-size: 0.88rem;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-card {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 16px;
  background: var(--c-light);
}

.contact-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.contact-number {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--c-primary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: var(--c-gray);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.remove-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* ===== ACTIONS ===== */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--c-border);
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

.spinner-sm {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .form-header { flex-direction: column; }
  .form-grid { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
}
</style>
