<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '../data/products'
import { useNotification } from '../composables/useNotification'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()

// Reactive state
const isLoading = ref(false)
const cartItems = ref([])
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)
const purchasedProducts = ref([]) // Список купленных продуктов

const { isAuthenticated, balance, deductBalance, addBalance } = useAuth()

const { notify } = useNotification()

const product = computed(() => {
  return getProductById(route.params.id)
})

const formatPrice = (price) => {
  return `${price} ₽`
}

const formatDownloads = (downloads) => {
  if (downloads >= 1000) {
    return `${(downloads / 1000).toFixed(1)}k+`
  }
  return `${downloads}+`
}

// Проверка, куплен ли продукт
const isProductPurchased = computed(() => {
  return purchasedProducts.value.includes(product.value?.id)
})

// Загрузка купленных продуктов из localStorage
const loadPurchasedProducts = () => {
  const saved = localStorage.getItem('purchasedProducts')
  if (saved) {
    purchasedProducts.value = JSON.parse(saved)
  }
}

// Сохранение купленных продуктов в localStorage
const savePurchasedProducts = () => {
  localStorage.setItem('purchasedProducts', JSON.stringify(purchasedProducts.value))
}

// Инициализация
loadPurchasedProducts()

const getTagClass = (tag) => {
  const tagMap = {
    'Популярный': 'tag-popular',
    'Новинка': 'tag-new',
    'Топ продаж': 'tag-top',
    'Хит': 'tag-hit'
  }
  return tagMap[tag] || 'tag-default'
}

// Handle purchase
const handleBuy = async () => {
  if (isLoading.value) return
  
  // Проверяем авторизацию
  if (!isAuthenticated.value) {
    notify('Для покупки необходимо войти в систему', 'error')
    return
  }
  
  // Проверяем баланс
  if (balance.value < product.value.price) {
    notify('Недостаточно средств на балансе', 'error')
    return
  }
  
  isLoading.value = true
  
  try {
    // Симуляция процесса покупки
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Списываем деньги
    const purchaseSuccess = deductBalance(product.value.price)
    
    if (purchaseSuccess) {
      // Добавляем продукт в купленные
      if (!purchasedProducts.value.includes(product.value.id)) {
        purchasedProducts.value.push(product.value.id)
        savePurchasedProducts()
      }
      
      // Показываем успешное сообщение
      notify(`Покупка "${product.value.name}" успешно завершена!`, 'success')
      
      // Добавляем в корзину для демо-режима
      addToCart()
    } else {
      notify('Ошибка при списании средств', 'error')
    }
    
  } catch (error) {
    notify('Ошибка при оформлении покупки', 'error')
  } finally {
    isLoading.value = false
  }
}

// Add to cart
const addToCart = () => {
  const existingItem = cartItems.value.find(item => item.id === product.value.id)
  
  if (!existingItem) {
    cartItems.value.push({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      quantity: 1,
      image: product.value.image
    })
  }
}

// Handle download
const handleDownload = (url, filename) => {
  if (!url) {
    notify('Ссылка для скачивания недоступна', 'error')
    return
  }
  
  // Проверяем авторизацию
  if (!isAuthenticated.value) {
    notify('Для скачивания необходимо войти в систему', 'error')
    return
  }
  
  // Проверяем, куплен ли продукт
  if (!isProductPurchased.value) {
    notify('Для скачивания необходимо сначала купить продукт', 'error')
    return
  }
  
  // Создаем ссылку для скачивания
  const link = document.createElement('a')
  link.href = url
  link.download = filename || product.value.name
  link.target = '_blank'
  
  // Запускаем скачивание
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  notify(`Начато скачивание: ${filename || product.value.name}`, 'success')
}

// Navigate back
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

// Lightbox functionality
const openLightbox = (index) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (product.value.screenshots) {
    currentImageIndex.value = (currentImageIndex.value + 1) % product.value.screenshots.length
  }
}

const prevImage = () => {
  if (product.value.screenshots) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? product.value.screenshots.length - 1 
      : currentImageIndex.value - 1
  }
}

// Get feature title
const getFeatureTitle = (feature) => {
  const words = feature.split(' ')
  return words.slice(0, 3).join(' ')
}

watch(
  () => product.value,
  (newProduct) => {
    if (!newProduct) {
      router.push('/')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="product-detail-page" v-if="product">
    <div class="product-detail-container">
      <!-- Кнопка назад -->
      <button class="btn-back" @click="goBack">
        ← Назад к каталогу
      </button>

      <!-- Основная информация о товаре -->
      <div class="product-detail-main">
        <div class="product-detail-left">
          <!-- Изображение -->
          <div class="product-detail-image">
            <img :src="product.image" :alt="product.name" />
            <!-- Тег на изображении -->
            <div class="product-detail-tag" :class="getTagClass(product.tag)">
              {{ product.tag }}
            </div>
          </div>
        </div>

        <div class="product-detail-right">
          <!-- Заголовок и базовая информация -->
          <div class="product-detail-header">
            <div class="product-detail-badge">{{ product.badge }}</div>
            <h1 class="product-detail-title">{{ product.name }}</h1>
            <p class="product-detail-subtitle">{{ product.subtitle }}</p>

            <!-- Метаданные -->
            <div class="product-detail-meta">
              <div class="product-detail-stats">
                <div class="stat-item">
                  <svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {{ formatDownloads(product.downloads) }} скачиваний
                </div>
              </div>
            </div>
          </div>

          <!-- Цена и покупка -->
          <div class="product-detail-purchase">
            <div class="product-detail-price-block">
              <div class="product-detail-price-row">
                <span class="product-detail-price">{{ formatPrice(product.price) }}</span>
                <span class="product-detail-old-price" v-if="product.oldPrice">
                  {{ formatPrice(product.oldPrice) }}
                </span>
                <span v-if="product.oldPrice" class="product-detail-discount-badge">
                  -{{ Math.round((1 - product.price / product.oldPrice) * 100) }}%
                </span>
              </div>
              <div class="product-detail-price-info">
                <span class="price-label">Тип лицензии:</span>
                <span class="price-value">{{ product.licenseType }}</span>
              </div>
              
              <div class="guarantee-banner">
                <div class="guarantee-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div class="guarantee-text">
                  <span class="guarantee-title">Гарантия возврата 30 дней</span>
                  <span class="guarantee-subtitle">Полное возмещение, если не понравится</span>
                </div>
              </div>
              
              <div class="purchase-buttons">
                <button v-if="!isProductPurchased" class="btn-buy-now" @click="handleBuy" :disabled="isLoading">
                  <div class="btn-content">
                    <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <div v-else class="loading-spinner"></div>
                    <span>{{ isLoading ? 'Обработка...' : 'Купить сейчас' }}</span>
                  </div>
                  <div class="btn-shine"></div>
                </button>
                
                <div v-if="isProductPurchased" class="purchased-section">
                  <div class="purchased-badge">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Куплено</span>
                  </div>
                  <div class="download-buttons-inline">
                    <button
                      v-if="product.downloadUrl"
                      @click="handleDownload(product.downloadUrl, `${product.name}-installer.exe`)"
                      class="download-btn-inline download-btn-inline--primary"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Установщик
                    </button>
                    <button
                      v-if="product.docUrl"
                      @click="handleDownload(product.docUrl, `${product.name}-documentation.pdf`)"
                      class="download-btn-inline"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Документация
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="payment-security">
                <div class="security-header">
                  <div class="security-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <span class="security-title">Безопасная оплата</span>
                </div>
                <div class="payment-methods">
                  <div class="payment-method">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="1" y="4" width="22" height="8" rx="2"></rect>
                      <path d="M7 8h10"></path>
                    </svg>
                  </div>
                  <div class="payment-method">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="1" y="4" width="22" height="8" rx="2"></rect>
                      <circle cx="7" cy="8" r="2"></circle>
                      <circle cx="17" cy="8" r="2"></circle>
                    </svg>
                  </div>
                  <div class="payment-method">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="1" y="4" width="22" height="8" rx="2"></rect>
                      <path d="M4 8h16"></path>
                    </svg>
                  </div>
                </div>
                <div class="security-features">
                  <div class="security-feature">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>SSL шифрование</span>
                  </div>
                  <div class="security-feature">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Защита данных</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Платформы -->
          <div class="product-detail-platforms">
            <span class="platforms-label">Доступно для:</span>
            <div class="platforms-list">
              <span
                v-for="platform in product.platform"
                :key="platform"
                class="platform-badge"
              >
                {{ platform }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Скриншоты и галерея -->
      <div class="product-detail-content" v-if="product.screenshots && product.screenshots.length > 0">
        <div class="product-detail-section">
          <h2 class="section-title">Скриншоты</h2>
          <div class="screenshots-gallery">
            <div class="main-screenshot" @click="openLightbox(0)">
              <img :src="product.screenshots[0]" :alt="`${product.name} - скриншот 1`" />
              <div class="screenshot-overlay">
                <div class="zoom-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <span>Нажмите для увеличения</span>
              </div>
            </div>
            <div class="thumbnail-grid">
              <div 
                v-for="(screenshot, index) in product.screenshots.slice(1, 5)" 
                :key="index"
                class="thumbnail-item"
                @click="openLightbox(index + 1)"
              >
                <img :src="screenshot" :alt="`${product.name} - скриншот ${index + 2}`" />
                <div class="thumbnail-overlay">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
              </div>
              <div 
                v-if="product.screenshots.length > 5"
                class="thumbnail-more"
                @click="openLightbox(5)"
              >
                <div class="more-content">
                  <span class="more-count">+{{ product.screenshots.length - 5 }}</span>
                  <span class="more-text">еще</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Описание и возможности -->
      <div class="product-detail-content">
        <div class="product-detail-section">
          <h2 class="section-title">Описание</h2>
          <div class="description-card">
            <p class="section-text">{{ product.description }}</p>
            <div class="description-highlights">
              <div class="highlight-item">
                <div class="highlight-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <span>Высокая производительность</span>
              </div>
              <div class="highlight-item">
                <div class="highlight-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <span>Безопасность и надежность</span>
              </div>
              <div class="highlight-item">
                <div class="highlight-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <span>Простота в использовании</span>
              </div>
            </div>
          </div>
        </div>

        <div class="product-detail-section" v-if="product.features">
          <h2 class="section-title">Основные возможности</h2>
          <div class="features-grid">
            <div 
              v-for="(feature, index) in product.features" 
              :key="index"
              class="feature-card"
            >
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ getFeatureTitle(feature) }}</h3>
                <p class="feature-description">{{ feature }}</p>
              </div>
              <div class="feature-badge">{{ index + 1 }}</div>
            </div>
          </div>
        </div>

        <!-- Дополнительная информация -->
        <div class="product-detail-section">
          <h2 class="section-title">Дополнительная информация</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Категория:</span>
              <span class="info-value">{{ product.category }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Рейтинг:</span>
              <span class="info-value">{{ product.rating }} / 5.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">Отзывов:</span>
              <span class="info-value">{{ product.reviews }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Скачиваний:</span>
              <span class="info-value">{{ formatDownloads(product.downloads) }}</span>
            </div>
          </div>
        </div>

          <div class="product-detail-section">
            <h2 class="section-title">Скачать</h2>
            <div v-if="!isAuthenticated" class="download-notice">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <p>Для скачивания файлов необходимо <a href="#" @click.prevent="$emit('login-required')">войти в систему</a></p>
            </div>
            <div v-else-if="!isProductPurchased" class="download-notice">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Для скачивания необходимо сначала <strong>купить продукт</strong></p>
            </div>
            <div v-else class="download-links">
              <a
                v-if="product.downloadUrl"
                @click="handleDownload(product.downloadUrl, `${product.name}-installer.exe`)"
                class="download-link download-link--primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Скачать установщик
              </a>
              <a
                v-if="product.docUrl"
                @click="handleDownload(product.docUrl, `${product.name}-documentation.pdf`)"
                class="download-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Скачать документацию
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Lightbox for screenshots -->
  <div v-if="lightboxOpen && product.screenshots" class="lightbox" @click="closeLightbox">
    <div class="lightbox-content" @click.stop>
      <button class="lightbox-close" @click="closeLightbox">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="lightbox-image-container">
        <img 
          :src="product.screenshots[currentImageIndex]" 
          :alt="`${product.name} - скриншот ${currentImageIndex + 1}`"
          class="lightbox-image"
        />
      </div>
      
      <button class="lightbox-nav lightbox-prev" @click="prevImage" v-if="product.screenshots.length > 1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <button class="lightbox-nav lightbox-next" @click="nextImage" v-if="product.screenshots.length > 1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      
      <div class="lightbox-counter" v-if="product.screenshots.length > 1">
        {{ currentImageIndex + 1 }} / {{ product.screenshots.length }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  width: 100%;
  padding: 32px 40px;
}

.product-detail-container {
  max-width: 1480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.product-detail-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.product-detail-discount-badge {
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.product-detail-price-info {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 16px;
}

.price-value {
  color: #e2e8f0;
  font-weight: 600;
  margin-left: 4px;
}

.btn-back {
  align-self: flex-start;
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
  border-color: #22c55e;
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.1);
}

.product-detail-main {
  display: grid;
  grid-template-columns: minmax(320px, 440px) minmax(0, 1fr);
  gap: 40px;
  padding: 32px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.85),
    rgba(2, 6, 23, 0.95)
  );
  border: 1px solid rgba(51, 65, 85, 0.6);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  width: 100%;
}

.product-detail-left {
  flex: 0 0 400px;
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.product-detail-image {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.product-detail-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-detail-image:hover img {
  transform: scale(1.05);
}

.product-detail-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 11px;
  font-weight: 700;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tag-popular {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%);
  color: #1e1b4b;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
}

.tag-new {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
  color: #064e3b;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
}

.tag-top {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
  color: white;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.tag-hit {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%);
  color: white;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.tag-default {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
  color: white;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.product-detail-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.product-detail-header {
  margin-bottom: 8px;
  position: relative;
  padding-bottom: 16px;
}

.product-detail-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.product-detail-badge {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  align-self: flex-start;
}

.product-detail-title {
  font-size: 32px;
  font-weight: 700;
  margin: 12px 0 8px;
  color: #f8fafc;
  line-height: 1.2;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.product-detail-subtitle {
  color: #94a3b8;
  margin: 8px 0 16px;
  font-size: 16px;
  line-height: 1.6;
  max-width: 90%;
  opacity: 0.9;
}

.product-detail-stats {
  display: flex;
  gap: 24px;
  color: #94a3b8;
  font-size: 14px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
}

.stat-icon {
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-detail-purchase {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.product-detail-purchase::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
}

.product-detail-price-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-detail-price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.product-detail-price {
  font-size: 36px;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
}

.product-detail-old-price {
  font-size: 16px;
  color: #94a3b8;
  text-decoration: line-through;
  position: relative;
  top: -2px;
  opacity: 0.8;
}

.product-detail-price-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.price-label {
  color: #94a3b8;
}

.price-value {
  color: #e2e8f0;
  font-weight: 500;
}

.btn-buy-now {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;
  min-width: 160px;
  margin-top: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-buy-now:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
}

.btn-buy-now:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.product-detail-platforms {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
  margin-top: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.platforms-label {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
}

.platforms-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.platform-badge {
  background: rgba(79, 70, 229, 0.1);
  color: #a5b4fc;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(79, 70, 229, 0.2);
  transition: all 0.2s ease;
}

.platform-badge:hover {
  background: rgba(79, 70, 229, 0.2);
  transform: translateY(-1px);
}

.product-detail-content {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 16px;
  position: relative;
  padding-bottom: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 2px;
}

.section-text {
  color: #cbd5e1;
  line-height: 1.7;
  margin-bottom: 24px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.features-list li {
  color: #cbd5e1;
  padding-left: 24px;
  position: relative;
  line-height: 1.6;
}

.features-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4f46e5;
  font-weight: bold;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.info-item {
  background: rgba(15, 23, 42, 0.5);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-label {
  display: block;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.info-value {
  font-size: 15px;
  color: #e2e8f0;
  font-weight: 500;
}

.download-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.download-link--primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
}

.download-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.1);
}

.download-link--primary:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
}

.download-link:active {
  transform: translateY(0);
  box-shadow: none;
}

.download-link:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Enhanced guarantee banner */
.guarantee-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.guarantee-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #059669);
}

.guarantee-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
}

.guarantee-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guarantee-title {
  font-size: 16px;
  font-weight: 600;
  color: #10b981;
  line-height: 1.3;
}

.guarantee-subtitle {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

/* Enhanced purchase buttons */
.purchase-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-buy-now {
  flex: 1;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3), 0 2px 4px -1px rgba(79, 70, 229, 0.2);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-buy-now:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -1px rgba(79, 70, 229, 0.4), 0 4px 8px -1px rgba(79, 70, 229, 0.3);
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
}

.btn-buy-now:hover .btn-shine {
  left: 100%;
}

.btn-buy-now:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px -1px rgba(79, 70, 229, 0.3);
}

.btn-favorite {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-favorite:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  transform: scale(1.05);
}

.btn-favorite:active {
  transform: scale(1);
}

.btn-favorite--active {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-favorite--active:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
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

/* Enhanced description card */
.description-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(2, 6, 23, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.description-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
}

.description-highlights {
  display: flex;
  gap: 24px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.highlight-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
  flex-shrink: 0;
}

.highlight-item span {
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
}

/* Screenshots gallery */
.screenshots-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-screenshot {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-screenshot:hover img {
  transform: scale(1.05);
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
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.main-screenshot:hover .screenshot-overlay {
  opacity: 1;
}

.zoom-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.thumbnail-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16/9;
  background: rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.thumbnail-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.thumbnail-item img {
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

.thumbnail-item:hover .thumbnail-overlay {
  opacity: 1;
}

.thumbnail-more {
  position: relative;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
  border: 1px solid rgba(79, 70, 229, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  aspect-ratio: 16/9;
}

.thumbnail-more:hover {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.more-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
}

.more-count {
  font-size: 24px;
  font-weight: 700;
  color: #a5b4fc;
}

.more-text {
  font-size: 14px;
  font-weight: 500;
}

/* Enhanced features grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.feature-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(79, 70, 229, 0.3);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
}

.feature-content {
  margin-bottom: 16px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 8px;
  line-height: 1.3;
}

.feature-description {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
}

.feature-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Lightbox styles */
.lightbox {
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
}

.lightbox-close {
  position: absolute;
  top: -40px;
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
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

.lightbox-counter {
  position: absolute;
  bottom: -40px;
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
.payment-security {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.payment-security::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.5), transparent);
}

.security-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.security-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 8px;
  color: white;
  box-shadow: 0 2px 4px -1px rgba(59, 130, 246, 0.3);
}

.security-title {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
}

.payment-methods {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.payment-method {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #94a3b8;
  transition: all 0.2s ease;
}

.payment-method:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  transform: translateY(-1px);
}

.security-features {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.security-feature {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.security-feature svg {
  color: #10b981;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .product-detail-page {
    padding: 24px 20px;
  }

  .product-detail-main {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    padding: 24px;
  }

  .product-detail-left {
    flex: 0 0 auto;
  }

  .guarantee-banner {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .purchase-buttons {
    flex-direction: column;
  }

  .btn-favorite {
    width: 100%;
    height: 48px;
  }

  .security-features {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 20px;
  }

  .product-detail-title {
    font-size: 24px;
  }

  .product-detail-subtitle {
    font-size: 14px;
  }

  .product-detail-price {
    font-size: 24px;
  }

  .btn-buy-now {
    font-size: 16px;
    padding: 14px 20px;
  }
}

@media (max-width: 640px) {
  .product-detail-page {
    padding: 16px 12px;
  }

  .product-detail-container {
    padding: 16px;
  }

  .product-detail-title {
    font-size: 24px;
  }

  .product-detail-price {
    font-size: 24px;
  }

  .btn-buy-now {
    padding: 12px 20px;
    font-size: 14px;
  }

  .download-links {
    flex-direction: column;
  }

  .download-link {
    width: 100%;
    justify-content: center;
  }

  /* Responsive screenshots gallery */
  .thumbnail-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  .description-highlights {
    flex-direction: column;
    gap: 16px;
  }

  .highlight-item {
    min-width: auto;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
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

/* Стили для статуса покупки */
.purchase-status {
  display: flex;
  align-items: center;
  justify-content: center;
}

.purchased-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.purchased-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(34, 197, 94, 0.3);
}

.download-buttons-inline {
  display: flex;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
}

.download-btn-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.download-btn-inline:hover {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  color: #bbf7d0;
  transform: translateY(-1px);
}

.download-btn-inline--primary {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: #22c55e;
  color: white;
  font-weight: 600;
}

.download-btn-inline--primary:hover {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
}

/* Стили для уведомлений о скачивании */
.download-notice {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 12px;
  color: #cbd5e1;
}

.download-notice svg {
  color: #f59e0b;
  flex-shrink: 0;
}

.download-notice p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.download-notice a {
  color: #22c55e;
  text-decoration: none;
  font-weight: 600;
}

.download-notice a:hover {
  text-decoration: underline;
}

.download-notice strong {
  color: #f59e0b;
}
</style>

