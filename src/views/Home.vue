<script setup>
import { useRouter } from 'vue-router'
import { allProducts } from '../data/products'
import { useNotification } from '../composables/useNotification'

const router = useRouter()

const { notify } = useNotification()

const features = [
  {
    title: 'Мониторинг в реальном времени',
    description:
      'Отслеживайте ключевые показатели вашей системы и бизнеса в одном удобном дашборде. Текст-заглушка, замените на описание реального функционала.'
  },
  {
    title: 'Гибкая аналитика',
    description: 'Стройте кастомные отчёты и фильтруйте данные по любым параметрам. Текст-заглушка.'
  },
  {
    title: 'Автоматизация процессов',
    description: 'Настраивайте сценарии и автоматические действия, чтобы экономить время команды. Текст-заглушка.'
  }
]

const purchaseSteps = [
  {
    step: 1,
    title: 'Выберите продукт',
    description: 'Просмотрите наш каталог и выберите программное обеспечение, которое подходит именно вам. Используйте фильтры для быстрого поиска.',
    icon: 'search',
    details: [
      'Используйте поиск по названию',
      'Фильтруйте по категориям',
      'Сравнивайте характеристики'
    ]
  },
  {
    step: 2,
    title: 'Добавьте в корзину',
    description: 'Нажмите кнопку "Купить сейчас" на странице продукта, чтобы добавить его в корзину и перейти к оформлению заказа.',
    icon: 'cart',
    details: [
      'Проверьте совместимость',
      'Выберите лицензию',
      'Добавьте в корзину'
    ]
  },
  {
    step: 3,
    title: 'Оформите заказ',
    description: 'Заполните контактную информацию и выберите удобный способ оплаты. Все данные защищены SSL-шифрованием.',
    icon: 'payment',
    details: [
      'Укажите контактные данные',
      'Выберите способ оплаты',
      'Проверьте детали заказа'
    ]
  },
  {
    step: 4,
    title: 'Получите доступ',
    description: 'После успешной оплаты вы получите ссылку для скачивания и лицензионный ключ на вашу электронную почту.',
    icon: 'download',
    details: [
      'Получите ссылку на email',
      'Скачайте установщик',
      'Активируйте лицензию'
    ]
  }
]

// Purchase guide functions
const handleStepAction = (stepNumber) => {
  const actions = {
    1: () => {
      // Navigate to catalog
      router.push('/catalog')
    },
    2: () => {
      // Show notification about adding to cart
      notify('Выберите продукт и нажмите "Купить сейчас"', 'info')
    },
    3: () => {
      // Show checkout info
      notify('Оформление заказа доступно после добавления товара в корзину', 'info')
    },
    4: () => {
      // Show download info
      notify('Ссылка для скачивания придет на вашу почту после оплаты', 'info')
    }
  }
  
  actions[stepNumber]?.()
}

const getStepActionText = (stepNumber) => {
  const actions = {
    1: 'Перейти к каталогу',
    2: 'Выбрать продукт',
    3: 'Оформить заказ',
    4: 'Узнать больше'
  }
  return actions[stepNumber] || 'Далее'
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (!el) return

  const header = document.querySelector('header')
  const headerOffset = header ? header.getBoundingClientRect().height : 0
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset - 12
  window.scrollTo({ top, behavior: 'smooth' })
}

</script>

<template>
  <div class="home-page">
    <!-- Hero с поиском -->
    <section class="hero" id="hero">
      <div class="hero-content">
        <div class="hero-main">
          <h1 class="hero-title">Магазин специализированного ПО</h1>
          <p class="hero-subtitle">
            Платформа для покупки и скачивания программных продуктов. Здесь заглушка — замените текст
            на своё позиционирование и описание магазина.
          </p>

          <div class="hero-actions">
            <button class="hero-primary-btn" type="button" @click="router.push('/catalog')">
              Перейти в каталог
            </button>
            <button class="hero-secondary-btn" type="button" @click="scrollToSection('purchase-guide')">
              Как купить
            </button>
          </div>
        </div>

        <div class="hero-stats">
          <div class="hero-stat-card">
            <div class="hero-stat-number">{{ allProducts.length }}+</div>
            <div class="hero-stat-label">Продуктов ПО</div>
          </div>
          <div class="hero-stat-card">
            <div class="hero-stat-number">
              {{ Math.round(allProducts.reduce((sum, p) => sum + p.downloads, 0) / 1000) }}k+
            </div>
            <div class="hero-stat-label">Скачиваний</div>
          </div>
          <div class="hero-stat-card">
            <div class="hero-stat-number">
              {{ (allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length).toFixed(1) }}
            </div>
            <div class="hero-stat-label">Средний рейтинг</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Баннер -->
    <section class="home-banner">
      <div class="home-banner-inner">
        <div class="home-banner-left">
          <div class="home-banner-badge">Надёжная площадка для покупки ПО</div>
          <h2 class="home-banner-title">Каталог лицензий и подписок для бизнеса и личных задач</h2>
          <p class="home-banner-text">
            Быстрый поиск, фильтры по платформам и типам лицензий, прозрачные цены и удобная покупка.
          </p>
          <div class="home-banner-actions">
            <button class="hero-primary-btn" type="button" @click="router.push('/catalog')">Открыть каталог</button>
            <button class="hero-secondary-btn" type="button" @click="scrollToSection('features')">Почему мы</button>
          </div>
        </div>

        <div class="home-banner-right" aria-hidden="true">
          <div class="banner-mock banner-mock--1"></div>
          <div class="banner-mock banner-mock--2"></div>
          <div class="banner-mock banner-mock--3"></div>
        </div>
      </div>
    </section>

    <!-- Блок с преимуществами -->
    <section id="features" class="features-section">
      <div class="features-container">
        <!-- Основной контент с возможностями -->
        <div class="features-main">
          <div class="section-header">
            <h2 class="section-title">Почему именно наш магазин ПО</h2>
            <p class="section-subtitle">Откройте для себя преимущества нашей платформы</p>
          </div>
          <div class="features-column">
            <article
              v-for="(feature, index) in features"
              :key="feature.title"
              class="feature-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path v-if="index === 0" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  <path v-else-if="index === 1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path v-else d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
              </div>
              <div class="feature-number">{{ index + 1 }}</div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Инструкция по покупке -->
    <section id="purchase-guide" class="purchase-guide-section">
      <div class="section-header">
        <h2 class="section-title">Как совершить покупку</h2>
        <p class="section-subtitle">Простая и безопасная покупка программного обеспечения в 4 шага</p>
      </div>
      
      <div class="purchase-steps-container">
        <div class="steps-progress">
          <div class="progress-line"></div>
          <div 
            v-for="(step, index) in purchaseSteps" 
            :key="step.step"
            class="progress-dot"
            :class="{ 'progress-dot--active': index === 0 }"
            :style="{ left: `${(index / (purchaseSteps.length - 1)) * 100}%` }"
          >
            {{ step.step }}
          </div>
        </div>
        
        <div class="steps-grid">
          <article
            v-for="(step, index) in purchaseSteps"
            :key="step.step"
            class="purchase-step-card"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="step-header">
              <div class="step-number">{{ step.step }}</div>
              <div class="step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle v-if="step.icon === 'search'" cx="11" cy="11" r="8"></circle>
                  <path v-if="step.icon === 'search'" d="m21 21-4.35-4.35"></path>
                  <path v-else-if="step.icon === 'cart'" d="M9 2L3 9h6l-1 8 10-12h-6l1-8z"></path>
                  <path v-else-if="step.icon === 'payment'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path v-else-if="step.icon === 'download'" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline v-if="step.icon === 'download'" points="7 10 12 15 17 10"></polyline>
                  <line v-if="step.icon === 'download'" x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
            </div>
            
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
              
              <div class="step-details">
                <div 
                  v-for="detail in step.details" 
                  :key="detail"
                  class="step-detail-item"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{{ detail }}</span>
                </div>
              </div>
              
              <button class="step-action-btn" @click="handleStepAction(step.step)">
                {{ getStepActionText(step.step) }}
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.hero-primary-btn {
  border: none;
  cursor: pointer;
  border-radius: 14px;
  padding: 12px 16px;
  font-weight: 800;
  color: #020617;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 16px 40px rgba(34, 197, 94, 0.25);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.hero-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 60px rgba(34, 197, 94, 0.32);
}

.hero-secondary-btn {
  border: 1px solid rgba(148, 163, 184, 0.35);
  cursor: pointer;
  border-radius: 14px;
  padding: 12px 16px;
  font-weight: 800;
  color: #e2e8f0;
  background: rgba(15, 23, 42, 0.55);
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.hero-secondary-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.45);
  background: rgba(99, 102, 241, 0.08);
}

.home-banner {
  padding: 44px 28px;
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
}

.home-banner-inner {
  max-width: 1480px;
  margin: 0 auto;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background:
    radial-gradient(1200px 500px at 20% 20%, rgba(99, 102, 241, 0.22), transparent 60%),
    radial-gradient(900px 420px at 80% 70%, rgba(34, 197, 94, 0.18), transparent 55%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.55) 0%, rgba(2, 6, 23, 0.75) 100%);
  backdrop-filter: blur(18px);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 20px;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.home-banner-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c7d2fe;
  border: 1px solid rgba(99, 102, 241, 0.35);
  background: rgba(99, 102, 241, 0.12);
  border-radius: 999px;
  padding: 6px 12px;
}

.home-banner-title {
  margin-top: 14px;
  font-size: 30px;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #f8fafc;
}

.home-banner-text {
  margin-top: 10px;
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.65;
  max-width: 70ch;
}

.home-banner-actions {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.home-banner-right {
  position: relative;
  height: 220px;
}

.banner-mock {
  position: absolute;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.55);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px);
}

.banner-mock--1 {
  width: 78%;
  height: 120px;
  right: -8px;
  top: 12px;
  transform: rotate(4deg);
  background:
    radial-gradient(450px 200px at 30% 30%, rgba(34, 197, 94, 0.2), transparent 70%),
    rgba(2, 6, 23, 0.55);
}

.banner-mock--2 {
  width: 70%;
  height: 110px;
  right: 22px;
  bottom: -8px;
  transform: rotate(-5deg);
  background:
    radial-gradient(420px 220px at 70% 20%, rgba(99, 102, 241, 0.22), transparent 70%),
    rgba(2, 6, 23, 0.55);
}

.banner-mock--3 {
  width: 58%;
  height: 90px;
  right: 40px;
  top: 70px;
  transform: rotate(10deg);
  opacity: 0.9;
}

@media (max-width: 900px) {
  .home-banner-inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .home-banner-right {
    height: 180px;
  }
}

/* Enhanced Features Section */
.features-section {
  padding: 100px 40px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%);
  position: relative;
  overflow: hidden;
}

.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.5), transparent);
}

.features-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 60px;
  align-items: start;
}

.features-main {
  width: 100%;
}

.features-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.feature-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(2, 6, 23, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  display: flex;
  align-items: center;
  gap: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
  border-color: rgba(79, 70, 229, 0.4);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed, #ec4899);
  transform: scaleX(0);
  transition: transform 0.5s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.feature-card:hover::after {
  opacity: 1;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.3);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.feature-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.feature-card:hover .feature-icon::before {
  transform: translateX(100%);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 16px 32px rgba(79, 70, 229, 0.4);
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 28px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 16px;
  line-height: 1.3;
  background: linear-gradient(90deg, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.feature-description {
  font-size: 18px;
  color: #94a3b8;
  line-height: 1.7;
}

.feature-number {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-number {
  transform: scale(1.1);
}

/* Separate Recommendations Block */
.recommendations-block {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(2, 6, 23, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(20px);
  position: sticky;
  top: 80px;
  max-height: none;
  overflow: visible;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.recommendations-block:hover {
  border-color: rgba(79, 70, 229, 0.2);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.recommendations-header {
  margin-bottom: 24px;
  text-align: center;
}

.recommendations-title {
  font-size: 24px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.recommendations-subtitle {
  font-size: 14px;
  color: #94a3b8;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.recommendation-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.recommendation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.1), transparent);
  transition: left 0.5s ease;
}

.recommendation-card:hover::before {
  left: 100%;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border-color: rgba(79, 70, 229, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.recommendation-image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

.recommendation-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommendation-card:hover .recommendation-image img {
  transform: scale(1.1);
}

.recommendation-content {
  flex: 1;
  min-width: 0;
}

.recommendation-name {
  font-size: 16px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommendation-subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommendation-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recommendation-price {
  font-size: 16px;
  font-weight: 600;
  color: #10b981;
}

.recommendation-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.recommendation-arrow {
  color: #64748b;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.recommendation-card:hover .recommendation-arrow {
  transform: translateX(4px);
  color: #4f46e5;
}

.recommendations-footer {
  text-align: center;
}

.view-all-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.view-all-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.view-all-btn:hover::before {
  left: 100%;
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4);
}

.view-all-btn svg {
  transition: transform 0.3s ease;
}

.view-all-btn:hover svg {
  transform: translateX(4px);
}

/* Section Header Styles */
.section-header {
  margin-bottom: 60px;
  max-width: 800px;
}

.section-title {
  font-size: 48px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 16px;
  line-height: 1.2;
  background: linear-gradient(90deg, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 18px;
  color: #94a3b8;
  line-height: 1.6;
}

/* Responsive Design for Enhanced Features and Recommendations */
@media (max-width: 1024px) {
  .features-section {
    padding: 80px 20px;
  }
  
  .features-container {
    gap: 40px;
  }
  
  .section-title {
    font-size: 36px;
  }
  
  .feature-card {
    padding: 32px;
    gap: 24px;
  }
  
  .feature-icon {
    width: 64px;
    height: 64px;
  }
  
  .feature-number {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }
  
  .feature-title {
    font-size: 22px;
  }
  
  .feature-description {
    font-size: 16px;
  }
  
  .recommendations-block {
    position: static;
    max-height: none;
    margin-bottom: 40px;
  }
  
  .recommendations-title {
    font-size: 20px;
  }
  
  .recommendation-card {
    padding: 12px;
    gap: 12px;
  }
  
  .recommendation-image {
    width: 48px;
    height: 48px;
  }
  
  .recommendation-name {
    font-size: 14px;
  }
  
  .recommendation-subtitle {
    font-size: 11px;
  }
  
  .recommendation-price {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .features-section {
    padding: 60px 16px;
  }
  
  .features-container {
    gap: 32px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .section-subtitle {
    font-size: 16px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 24px;
  }
  
  .feature-icon {
    width: 72px;
    height: 72px;
  }
  
  .feature-number {
    width: 60px;
    height: 60px;
    font-size: 18px;
  }
  
  .feature-title {
    font-size: 20px;
  }
  
  .feature-description {
    font-size: 15px;
  }
  
  .recommendations-block {
    padding: 24px;
    margin-bottom: 32px;
  }
  
  .recommendations-title {
    font-size: 18px;
  }
  
  .recommendations-list {
    gap: 12px;
  }
  
  .recommendation-card {
    padding: 10px;
    gap: 10px;
  }
  
  .recommendation-image {
    width: 40px;
    height: 40px;
  }
  
  .recommendation-name {
    font-size: 12px;
  }
  
  .recommendation-subtitle {
    font-size: 10px;
  }
  
  .recommendation-price {
    font-size: 12px;
  }
  
  .view-all-btn {
    padding: 12px 16px;
    font-size: 12px;
  }
}

/* Modern Gallery Section */
.gallery-section {
  padding: 80px 40px;
  background: linear-gradient(135deg, rgba(2, 6, 23, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%);
  position: relative;
  overflow: hidden;
}

.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  align-items: start;
}

.gallery-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-screenshot {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  aspect-ratio: 16/10;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.main-screenshot:hover {
  transform: scale(1.02);
}

.main-screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.screenshot-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.main-screenshot:hover .screenshot-overlay {
  opacity: 1;
}

.zoom-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.main-screenshot:hover .zoom-icon {
  transform: scale(1.1);
}

.screenshot-info {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.screenshot-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 8px;
}

.screenshot-info p {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
}

.gallery-thumbnails {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.thumbnail-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16/10;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.thumbnail-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.thumbnail-card:hover .thumbnail-overlay {
  opacity: 1;
}

/* Gallery Lightbox */
.gallery-lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.lightbox-close {
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-image-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-width: 80vw;
  max-height: 70vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  display: block;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-prev {
  left: -60px;
}

.lightbox-next {
  right: -60px;
}

.lightbox-info {
  text-align: center;
  max-width: 600px;
}

.lightbox-info h3 {
  font-size: 24px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 8px;
}

.lightbox-info p {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.5;
}

.lightbox-counter {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Animations */
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

/* Responsive Design */
@media (max-width: 1024px) {
  .features-section,
  .gallery-section {
    padding: 60px 20px;
  }
  
  .section-title {
    font-size: 36px;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
  
  .gallery-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .gallery-thumbnails {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .lightbox-nav {
    width: 40px;
    height: 40px;
  }
  
  .lightbox-prev {
    left: -50px;
  }
  
  .lightbox-next {
    right: -50px;
  }
}

@media (max-width: 768px) {
  .features-section,
  .gallery-section {
    padding: 40px 16px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .section-subtitle {
    font-size: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    padding: 24px;
  }
  
  .gallery-thumbnails {
    grid-template-columns: 1fr;
  }
  
  .lightbox-nav {
    width: 36px;
    height: 36px;
  }
  
  .lightbox-prev {
    left: -45px;
  }
  
  .lightbox-next {
    right: -45px;
  }
}

/* Purchase Guide Section */
.purchase-guide-section {
  padding: 80px 40px;
  background: linear-gradient(135deg, rgba(2, 6, 23, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%);
  position: relative;
  overflow: hidden;
}

.purchase-steps-container {
  max-width: 1200px;
  margin: 0 auto;
}

.steps-progress {
  position: relative;
  height: 60px;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  transform: translateY(-50%);
  z-index: 1;
}

.progress-dot {
  position: absolute;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
  z-index: 2;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.progress-dot--active {
  transform: translateX(-50%) scale(1.2);
  box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.purchase-step-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(2, 6, 23, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.purchase-step-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(79, 70, 229, 0.3);
}

.purchase-step-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.purchase-step-card:hover::before {
  transform: scaleX(1);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 8px rgba(79, 70, 229, 0.2);
  transition: transform 0.3s ease;
}

.purchase-step-card:hover .step-icon {
  transform: scale(1.1);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 22px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 12px;
  line-height: 1.3;
}

.step-description {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 20px;
}

.step-details {
  margin-bottom: 24px;
}

.step-detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #cbd5e1;
}

.step-detail-item svg {
  flex-shrink: 0;
  color: #10b981;
}

.step-action-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
}

.step-action-btn:active {
  transform: translateY(0);
}

.step-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.step-action-btn:hover::before {
  left: 100%;
}

/* Responsive Design for Purchase Guide */
@media (max-width: 1024px) {
  .purchase-guide-section {
    padding: 60px 20px;
  }
  
  .steps-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
  
  .purchase-step-card {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .purchase-guide-section {
    padding: 40px 16px;
  }
  
  .steps-progress {
    height: 40px;
    margin-bottom: 40px;
  }
  
  .progress-dot {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .purchase-step-card {
    padding: 20px;
  }
  
  .step-header {
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .step-number,
  .step-icon {
    width: 40px;
    height: 40px;
  }
  
  .step-number {
    font-size: 16px;
  }
  
  .step-title {
    font-size: 18px;
  }
  
  .step-description {
    font-size: 14px;
  }
}

.hero {
  padding: 32px 28px 20px;
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
}

.hero-content {
  max-width: 1480px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr);
  gap: 32px;
}

.hero-main {
  max-width: 680px;
}

.hero-title {
  font-size: 36px;
  line-height: 1.2;
  margin-bottom: 10px;
  font-weight: 700;
  color: #f1f5f9;
}

.hero-subtitle {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 20px;
  line-height: 1.6;
}

.hero-search {
  margin-top: 24px;
}

.hero-search-input-wrap {
  width: 100%;
}

.hero-search-label {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 8px;
  display: inline-block;
  font-weight: 600;
}

.hero-search-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(15, 23, 42, 0.9);
  border: 2px solid rgba(51, 65, 85, 0.8);
  border-radius: 16px;
  padding: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero-search-container:focus-within {
  border-color: #ffd700;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.2), 0 12px 40px rgba(255, 215, 0, 0.15);
  transform: translateY(-2px);
}

.hero-search-input {
  flex: 1;
  padding: 16px 20px;
  border: none;
  background: transparent;
  color: #f1f5f9;
  font-size: 17px;
  transition: all 0.2s ease;
  outline: none;
}

.hero-search-input::placeholder {
  color: #64748b;
}

.hero-search-button {
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ffd700, #ff6b6b);
  color: #020617;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.hero-search-button:hover {
  filter: brightness(1.15);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}

.hero-search-button--search {
  background: linear-gradient(135deg, #ffd700, #ff6b6b);
}

.hero-tags {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.hero-tag-label {
  font-size: 14px;
  color: #94a3b8;
}

.chip {
  border-radius: 999px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  font-size: 14px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.chip:hover {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
}

.chip--small {
  font-size: 13px;
  padding: 5px 12px;
}

.chip--active {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-self: center;
}

.hero-stat-card {
  border-radius: 12px;
  padding: 16px 14px;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.1),
    rgba(15, 23, 42, 0.8)
  );
  border: 1px solid rgba(51, 65, 85, 0.6);
  transition: all 0.2s ease;
}

.hero-stat-card:hover {
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.hero-stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 4px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.hero-stat-label {
  font-size: 13px;
  color: #94a3b8;
}

.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 280px 340px minmax(0, 1fr);
  gap: 24px;
  padding: 24px 28px 32px;
  max-width: 1480px;
  margin: 0 auto;
  width: 100%;
}

.sidebar {
  align-self: flex-start;
  border-radius: 16px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.6);
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: sticky;
  top: 80px;
  max-height: none;
  overflow: visible;
}

.sidebar-section {
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
  padding-bottom: 16px;
  margin-bottom: 4px;
}

.sidebar-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.sidebar-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #64748b;
  margin-bottom: 12px;
  font-weight: 600;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-link {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #cbd5e1;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.sidebar-link:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
}

.sidebar-link--active {
  background: linear-gradient(
    90deg,
    rgba(255, 215, 0, 0.2),
    rgba(255, 107, 107, 0.1)
  );
  color: #ffd700;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #cbd5e1;
  margin-bottom: 8px;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s ease;
}

.checkbox:hover {
  color: #f1f5f9;
}

.checkbox input {
  width: 18px;
  height: 18px;
  accent-color: #ffd700;
  cursor: pointer;
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.8);
  color: #f1f5f9;
  font-size: 14px;
  transition: all 0.2s ease;
}

.price-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

.btn-apply {
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.9);
  color: #e2e8f0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-apply:hover {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.content-header-left h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #f1f5f9;
}

.content-header-left p {
  font-size: 15px;
  color: #94a3b8;
}

.content-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.content-count {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
}

.content-sort {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.8);
  color: #f1f5f9;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.content-sort:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

.products {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.products-empty {
  padding: 60px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 16px;
}

.product-card {
  display: grid;
  grid-template-columns: minmax(0, 2.4fr) minmax(0, 1.2fr);
  gap: 20px;
  padding: 16px 18px;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.8),
    rgba(2, 6, 23, 0.9)
  );
  border: 1px solid rgba(51, 65, 85, 0.6);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.2);
}

/* Красивый тег в правом верхнем углу */
.product-tag-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  max-height: 30px;
}

.product-tag-badge.tag-popular {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #020617;
}

.product-tag-badge.tag-new {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
}

.product-tag-badge.tag-top {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
}

.product-tag-badge.tag-hit {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
}

.product-tag-badge.tag-default {
  background: rgba(15, 23, 42, 0.9);
  color: #e2e8f0;
  border: 1px solid rgba(51, 65, 85, 0.8);
}

.product-main {
  display: flex;
  gap: 14px;
}

.product-thumb {
  width: 80px;
  height: 80px;
  min-width: 80px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(51, 65, 85, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  flex-wrap: wrap;
  gap: 8px;
}

.product-badge {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.product-name {
  font-size: 18px;
  margin-bottom: 4px;
  font-weight: 600;
  color: #f1f5f9;
}

.product-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 8px;
  line-height: 1.5;
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #94a3b8;
}

.product-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.product-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
}

.product-price-block {
  text-align: right;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.product-price {
  font-size: 22px;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

.product-old-price {
  font-size: 14px;
  color: #64748b;
  text-decoration: line-through;
}

.product-price-note {
  font-size: 12px;
  color: #94a3b8;
  display: block;
  margin-top: 4px;
}

.strip {
  margin-top: 24px;
  border-radius: 14px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.6);
}

.strip--features h2,
.strip--gallery h2,
.strip--download h2 {
  font-size: 22px;
  margin-bottom: 12px;
  font-weight: 700;
  color: #f1f5f9;
}

.strip-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.strip-card {
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px dashed rgba(51, 65, 85, 0.6);
  transition: all 0.2s ease;
}

.strip-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(15, 23, 42, 0.9);
}

.strip-card h3 {
  font-size: 16px;
  margin-bottom: 6px;
  font-weight: 600;
  color: #f1f5f9;
}

.strip-card p {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
}

.strip-header {
  margin-bottom: 16px;
}

.strip-header p {
  font-size: 15px;
  color: #94a3b8;
}

.gallery-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.gallery-card {
  border-radius: 12px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.6);
  transition: all 0.2s ease;
}

.gallery-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.gallery-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-card:hover .gallery-thumb img {
  transform: scale(1.05);
}

.gallery-card figcaption {
  padding: 12px 14px;
}

.gallery-title {
  font-size: 15px;
  margin-bottom: 4px;
  font-weight: 600;
  color: #f1f5f9;
}

.gallery-text {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.5;
}

.download-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 8px;
}

.download-card {
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.6);
  transition: all 0.2s ease;
}

.download-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
}

.download-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.download-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.download-pill {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.15);
  color: #bbf7d0;
  font-weight: 600;
}

.download-title {
  font-size: 18px;
  margin-bottom: 6px;
  font-weight: 600;
  color: #f1f5f9;
}

.download-text {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 12px;
  line-height: 1.6;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  font-size: 14px;
  text-decoration: none;
  color: #e2e8f0;
  transition: all 0.2s ease;
  font-weight: 500;
}

.download-btn:hover {
  border-color: #22c55e;
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.1);
}

.download-btn--primary {
  border-color: rgba(34, 197, 94, 0.9);
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #020617;
  font-weight: 600;
}

.download-btn--primary:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-stats {
    max-width: 100%;
  }

  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .sidebar {
    order: -1;
    position: relative;
    top: 0;
    max-height: none;
  }

  .recommendations-block {
    order: -1;
    position: relative;
    top: 0;
    max-height: none;
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .layout {
    padding: 20px;
    gap: 20px;
  }

  .recommendations-block {
    padding: 20px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .content-header-left h2 {
    font-size: 20px;
  }

  .product-card {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .product-side {
    align-items: flex-start;
    width: 100%;
  }

  .product-price-block {
    text-align: left;
    width: 100%;
  }

  .product-price-row {
    justify-content: flex-start;
  }

  .gallery-row,
  .strip-grid,
  .download-cards {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 24px;
  }

  .hero-search {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-search-button {
    width: 100%;
  }

  .hero-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .hero-stat-card {
    padding: 12px 10px;
  }

  .hero-stat-number {
    font-size: 20px;
  }

  .product-thumb {
    width: 64px;
    height: 64px;
    min-width: 64px;
  }

  .product-name {
    font-size: 16px;
  }

  .product-tag-badge {
    top: 8px;
    right: 8px;
    padding: 5px 10px;
    font-size: 11px;
  }
}
</style>

