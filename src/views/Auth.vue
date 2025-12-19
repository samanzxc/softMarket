<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const { loginWithTelegram } = useAuth()
const { notify } = useNotification()

const isLoading = ref(false)
const telegramWidgetLoaded = ref(false)

const buildTelegramAuthUrl = () => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return `${window.location.origin}${base}#/auth/telegram`
}

const getTelegramAuthParams = () => {
  const params = new URLSearchParams(window.location.search)
  if (params.has('id')) return params

  const hash = window.location.hash || ''
  const idx = hash.indexOf('?')
  if (idx !== -1) {
    return new URLSearchParams(hash.slice(idx + 1))
  }

  return params
}

// Загрузка Telegram Widget
const loadTelegramWidget = () => {
  return new Promise((resolve, reject) => {
    const container = document.getElementById('telegram-login-widget')
    if (!container) {
      reject(new Error('Контейнер для Telegram Widget не найден'))
      return
    }

    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'testingappit_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-auth-url', buildTelegramAuthUrl())
    script.setAttribute('data-request-access', 'write')
    script.async = true

    script.onload = () => {
      telegramWidgetLoaded.value = true
      resolve()
    }

    script.onerror = () => {
      reject(new Error('Не удалось загрузить Telegram Widget'))
    }

    container.appendChild(script)
  })
}

// Обработка успешной аутентификации через Telegram
const handleTelegramAuth = async (telegramData) => {
  isLoading.value = true
  
  try {
    // Получаем данные из URL параметров
    const urlParams = getTelegramAuthParams()
    const authData = {}
    
    for (const [key, value] of urlParams.entries()) {
      authData[key] = value
    }
    
    if (!authData.id) {
      throw new Error('Отсутствуют данные аутентификации')
    }
    
    // Входим через Telegram
    const userData = loginWithTelegram(authData)
    
    notify('Вход через Telegram выполнен успешно!', 'success')
    
    // Перенаправляем на главную страницу
    setTimeout(() => {
      router.push('/')
    }, 1500)
    
  } catch (error) {
    console.error('Ошибка аутентификации через Telegram:', error)
    notify(error?.message || 'Ошибка при входе через Telegram. Попробуйте еще раз.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Инициализация при монтировании компонента
onMounted(async () => {
  // Проверяем, есть ли данные от Telegram в URL
  const urlParams = getTelegramAuthParams()
  if (urlParams.has('id')) {
    await handleTelegramAuth()
  } else {
    // Загружаем виджет
    try {
      await loadTelegramWidget()
    } catch (error) {
      notify('Не удалось загрузить Telegram Widget', 'error')
    }
  }
})
</script>

<template>
  <div class="telegram-auth">
    <div class="telegram-auth-container">
      <!-- Кнопка назад -->
      <button class="btn-back" @click="router.go(-1)">
        ← Назад
      </button>

      <!-- Заголовок -->
      <div class="auth-header">
        <div class="telegram-logo">
          <svg width="40" height="40" viewBox="0 0 240 240" fill="none">
            <circle cx="120" cy="120" r="120" fill="#0088CC"/>
            <path d="M100.5 140.9L98.3 155.8C98.3 155.8 97.8 160.2 102.2 160.2C106.6 160.2 108.9 156.3 108.9 156.3L115.3 148.4L130.4 159.6C130.4 159.6 136.6 163.5 139.2 156.3L155.8 102.2C155.8 102.2 157.1 96.5 150.4 94.7C143.7 92.9 140.9 98.3 140.9 98.3L108.9 134.2L93.3 122.5C93.3 122.5 89.4 119.7 85.5 122.5C81.6 125.3 82.1 130.2 82.1 130.2L100.5 140.9Z" fill="white"/>
          </svg>
        </div>
        <h2 class="auth-title">Вход через Telegram</h2>
        <p class="auth-subtitle">
          Используйте ваш Telegram аккаунт для быстрого входа
        </p>
      </div>

      <!-- Telegram Widget -->
      <div class="telegram-widget-container">
        <div class="telegram-widget">
          <div id="telegram-login-widget"></div>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Выполняем вход...</p>
        </div>

        <div v-else-if="!telegramWidgetLoaded" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Загружаем Telegram Widget...</p>
        </div>
      </div>

      <!-- Информация -->
      <div class="auth-info">
        <div class="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Безопасно и надежно</span>
        </div>
        <div class="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>Мгновенный вход</span>
        </div>
        <div class="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Без паролей</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.telegram-auth {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a 0, #020617 45%, #000000 100%);
  color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow-x: hidden;
}

.telegram-auth-container {
  width: 100%;
  max-width: 420px;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.95),
    rgba(2, 6, 23, 0.98)
  );
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  text-align: center;
}

.btn-back {
  display: block;
  width: fit-content;
  margin: 0 auto 20px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-back:hover {
  border-color: #0088cc;
  color: #0088cc;
  background: rgba(0, 136, 204, 0.1);
}

.auth-header {
  margin-bottom: 32px;
}

.telegram-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.telegram-logo svg {
  filter: drop-shadow(0 4px 12px rgba(0, 136, 204, 0.4));
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 8px;
  background: linear-gradient(90deg, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.auth-subtitle {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.telegram-widget-container {
  margin: 32px 0;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.telegram-widget {
  width: 100%;
  display: flex;
  justify-content: center;
}

#telegram-login-widget {
  transform: scale(1.1);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #94a3b8;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-top: 2px solid #0088cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-info {
  margin: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
}

.info-item svg {
  color: #0088cc;
}

@media (max-width: 480px) {
  .telegram-auth-container {
    padding: 32px 24px;
  }
  
  .auth-title {
    font-size: 24px;
  }
  
  #telegram-login-widget {
    transform: scale(1);
  }
}
</style>
