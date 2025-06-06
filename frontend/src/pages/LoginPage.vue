<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">

        <h2>{{ isLogin ? 'Добро пожаловать!' : 'Создать аккаунт' }}</h2>
        <p class="auth-subtitle">
          {{ isLogin ? 'Войдите в свой аккаунт' : 'Зарегистрируйтесь для продолжения' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">Логин</label>
          <div class="input-container">
            <input 
              id="username"
              v-model="username" 
              type="text" 
              placeholder="Введите ваш логин" 
              required 
              class="auth-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <div class="input-container">
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="Введите ваш пароль" 
              required 
              class="auth-input"
            />
          </div>
        </div>

        <button type="submit" class="auth-button" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          <span v-else>{{ isLogin ? 'Войти' : 'Зарегистрироваться' }}</span>
        </button>
      </form>

      <div v-if="error" class="error-message">
        <span>{{ error }}</span>
      </div>

      <div v-if="successMessage" class="success-message">
        <span>{{ successMessage }}</span>
      </div>

      <div class="auth-footer">
        <p class="toggle-text">
          {{ isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
          <button @click="toggleMode" class="toggle-button">
            {{ isLogin ? 'Зарегистрироваться' : 'Войти' }}
          </button>
        </p>
      </div>
    </div>

    <div class="auth-background">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { saveToken } from '../services/auth';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const successMessage = ref('');
const isLogin = ref(true);
const isLoading = ref(false);
const router = useRouter();


// Define router outside of toggleMode to avoid "useRouter" being called conditionally
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
  successMessage.value = '';
  username.value = '';
  password.value = '';
}

async function handleSubmit() {
  if (isLoading.value) return;
  
  isLoading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    if (isLogin.value) {
      const res = await api.post('/auth/login', { 
        username: username.value, 
        password: password.value 
      });
      
      saveToken(res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      successMessage.value = 'Успешный вход!';
      
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      await api.post('/auth/register', { 
        username: username.value, 
        password: password.value 
      });
      
      successMessage.value = 'Регистрация успешна! Теперь войдите.';
      
      setTimeout(() => {
        isLogin.value = true;
        username.value = '';
        password.value = '';
        successMessage.value = '';
      }, 2000);
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Произошла ошибка';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(16, 185, 129, 0.05));
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.auth-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.auth-card h2 {
  color: #34d399;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.auth-subtitle {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.95rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.25rem;
  z-index: 1;
  opacity: 0.7;
}

.auth-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background-color: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.auth-input:focus {
  border-color: #34d399;
  background-color: rgba(51, 65, 85, 0.8);
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.1);
  transform: translateY(-2px);
}

.auth-input::placeholder {
  color: #94a3b8;
}

.auth-button {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message,
.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  margin-top: 1rem;
}

.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.success-message {
  background-color: rgba(52, 211, 153, 0.1);
  color: #6ee7b7;
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.error-icon,
.success-icon {
  font-size: 1.25rem;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
}

.toggle-text {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
}

.toggle-button {
  background: none;
  border: none;
  color: #34d399;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.95rem;
  margin-left: 0.5rem;
  transition: color 0.2s ease;
}

.toggle-button:hover {
  color: #10b981;
}

@media (max-width: 480px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 2rem 1.5rem;
  }
  
  .auth-icon {
    font-size: 2.5rem;
  }
  
  .auth-card h2 {
    font-size: 1.5rem;
  }
}
</style>
