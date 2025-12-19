<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <!-- Анимированный 404 -->
      <div class="error-number">
        <div class="digit">4</div>
        <div class="digit zero">
          <div class="zero-inner">
            <div class="astronaut">
              <div class="helmet"></div>
              <div class="body"></div>
              <div class="arm-left"></div>
              <div class="arm-right"></div>
              <div class="leg-left"></div>
              <div class="leg-right"></div>
            </div>
          </div>
        </div>
        <div class="digit">4</div>
      </div>

      <!-- Текст ошибки -->
      <div class="error-content">
        <h1 class="error-title">Страница не найдена</h1>
        <p class="error-subtitle">
          Похоже, вы заблудились в цифровом космосе. Страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <!-- Кнопки действий -->
        <div class="error-actions">
          <button class="btn-primary" @click="goHome">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            На главную
          </button>
          
          <button class="btn-secondary" @click="goBack">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Назад
          </button>
        </div>

        <!-- Дополнительные ссылки -->
        <div class="error-suggestions">
          <p class="suggestions-title">Возможно, вы ищете:</p>
          <div class="suggestions-links">
            <router-link to="/catalog" class="suggestion-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Каталог ПО
            </router-link>
            <router-link to="/" class="suggestion-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Главная страница
            </router-link>
          </div>
        </div>
      </div>

      <!-- Декоративные элементы -->
      <div class="stars">
        <div class="star" style="--x: 10%; --y: 20%; --delay: 0s;"></div>
        <div class="star" style="--x: 80%; --y: 10%; --delay: 1s;"></div>
        <div class="star" style="--x: 20%; --y: 80%; --delay: 2s;"></div>
        <div class="star" style="--x: 90%; --y: 70%; --delay: 3s;"></div>
        <div class="star" style="--x: 5%; --y: 50%; --delay: 4s;"></div>
        <div class="star" style="--x: 70%; --y: 90%; --delay: 5s;"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a 0, #020617 45%, #000000 100%);
  color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Новогодние снежинки */
.not-found-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.2), transparent),
    radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(2px 2px at 90% 60%, rgba(255, 255, 255, 0.2), transparent),
    radial-gradient(1px 1px at 33% 80%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(1px 1px at 15% 50%, rgba(255, 255, 255, 0.2), transparent);
  background-size: 200% 200%;
  animation: snowfall 20s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes snowfall {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

.not-found-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
}

.digit {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(79, 70, 229, 0.5);
  animation: float 3s ease-in-out infinite;
}

.digit:nth-child(1) {
  animation-delay: 0s;
}

.digit:nth-child(3) {
  animation-delay: 0.5s;
}

.zero {
  position: relative;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: float 3s ease-in-out infinite;
  animation-delay: 0.25s;
}

.zero-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
}

.astronaut {
  position: relative;
  width: 100%;
  height: 100%;
  animation: rotate 10s linear infinite;
}

.helmet {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 35%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.body {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 30%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20%;
}

.arm-left,
.arm-right {
  position: absolute;
  top: 50%;
  width: 15%;
  height: 25%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.arm-left {
  left: 20%;
  transform: rotate(-20deg);
}

.arm-right {
  right: 20%;
  transform: rotate(20deg);
}

.leg-left,
.leg-right {
  position: absolute;
  bottom: 15%;
  width: 15%;
  height: 20%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.leg-left {
  left: 35%;
}

.leg-right {
  right: 35%;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.error-content {
  max-width: 500px;
  margin: 0 auto;
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 16px;
  background: linear-gradient(90deg, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.error-subtitle {
  color: #94a3b8;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 32px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
}

.btn-secondary {
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(51, 65, 85, 0.8);
}

.btn-secondary:hover {
  border-color: #22c55e;
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.1);
}

.error-suggestions {
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  padding-top: 24px;
}

.suggestions-title {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 16px;
  font-weight: 500;
}

.suggestions-links {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.suggestion-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.5);
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.suggestion-link:hover {
  border-color: #22c55e;
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.1);
  transform: translateY(-1px);
}

/* Звезды на фоне */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  animation: twinkle 3s ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 640px) {
  .error-number {
    font-size: 80px;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-subtitle {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  
  .suggestions-links {
    flex-direction: column;
    align-items: center;
  }
  
  .suggestion-link {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}
</style>
