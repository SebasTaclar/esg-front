<template>
  <main class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-icon">
          <i class="fas fa-users"></i>
        </div>

        <h1 class="login-title">Portal de Clientes</h1>
        <p class="login-subtitle">Acceda a sus proyectos, documentos y seguimiento</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <label for="email">Correo electrónico</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="correo@ejemplo.com"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="••••••••"
                required
                class="form-input"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="login-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>Recordarme</span>
            </label>
          </div>

          <button type="submit" :disabled="loading" class="btn-login">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i> Accediendo...
            </span>
            <span v-else>
              Ingresar <i class="fas fa-arrow-right"></i>
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>¿No tiene cuenta? <a href="/#contacto">Solicite acceso</a></p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type LoginCredentials } from '@/services/api'

defineOptions({
  name: 'ClientLoginView'
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  try {
    const credentials: LoginCredentials = {
      email: email.value,
      password: password.value
    }

    const response = await authService.login(credentials)

    if (response.success) {
      const userInfo = authService.getCurrentUser()
      if (userInfo?.role === 'admin') {
        router.push('/admin/products')
      } else {
        router.push('/')
      }
    } else {
      alert(response.message || 'Credenciales inválidas')
    }
  } catch (error: unknown) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error en el servidor. Intente nuevamente.'
    alert('Error: ' + errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAFAF8;
  padding: 120px 24px 60px;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 48px 40px;
  border: 1px solid #F0F0F0;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.login-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(200, 155, 45, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.login-icon i {
  font-size: 28px;
  color: #C89B2D;
}

.login-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 800;
  color: #2F2F2F;
}

.login-subtitle {
  margin: 0 0 32px;
  font-size: 14px;
  color: #888888;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #3F3F3F;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i:first-child {
  position: absolute;
  left: 16px;
  color: #AAAAAA;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  background: #FAFAF8;
  border: 1px solid #E8E8E8;
  border-radius: 10px;
  font-size: 14px;
  color: #2F2F2F;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #BBBBBB;
}

.form-input:focus {
  outline: none;
  border-color: #C89B2D;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.1);
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #AAAAAA;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
}

.toggle-password:hover {
  color: #C89B2D;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6B6B6B;
  cursor: pointer;
}

.remember-me input {
  accent-color: #C89B2D;
}

.forgot-password {
  font-size: 13px;
  color: #C89B2D;
  text-decoration: none;
  font-weight: 600;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background: #C89B2D;
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.btn-login:hover:not(:disabled) {
  background: #D4A82F;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200, 155, 45, 0.3);
}

.btn-login:disabled {
  background: #CCCCCC;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #F0F0F0;
}

.login-footer p {
  margin: 0;
  font-size: 14px;
  color: #888888;
}

.login-footer a {
  color: #C89B2D;
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-page {
    padding: 100px 16px 40px;
  }

  .login-card {
    padding: 36px 24px;
  }

  .login-title {
    font-size: 22px;
  }
}
</style>
