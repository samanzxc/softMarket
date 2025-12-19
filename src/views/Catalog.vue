<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { allProducts } from '../data/products'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('Все категории')
const selectedPlatforms = ref([])
const selectedLicenseTypes = ref([])
const priceMin = ref(0)
const priceMax = ref(10000)
const sortBy = ref('popularity')

const categories = ['Все категории', 'Аналитика', 'Автоматизация', 'Поддержка / Helpdesk', 'DevOps и инструменты']
const platforms = ['Windows', 'Linux', 'macOS', 'Web']
const licenseTypes = ['Подписка', 'Пожизненная', 'On-Premise']

const handleCategoryClick = (category) => {
  selectedCategory.value = category
}

const togglePlatform = (platform) => {
  const index = selectedPlatforms.value.indexOf(platform)
  if (index > -1) {
    selectedPlatforms.value.splice(index, 1)
  } else {
    selectedPlatforms.value.push(platform)
  }
}

const toggleLicenseType = (type) => {
  const index = selectedLicenseTypes.value.indexOf(type)
  if (index > -1) {
    selectedLicenseTypes.value.splice(index, 1)
  } else {
    selectedLicenseTypes.value.push(type)
  }
}

const applyPriceFilter = () => {
  // Фильтр применяется автоматически через computed
}

const filteredProducts = computed(() => {
  let result = [...allProducts]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value !== 'Все категории') {
    result = result.filter((p) => p.category === selectedCategory.value)
  }

  if (selectedPlatforms.value.length > 0) {
    result = result.filter((p) => p.platform.some((platform) => selectedPlatforms.value.includes(platform)))
  }

  if (selectedLicenseTypes.value.length > 0) {
    result = result.filter((p) => selectedLicenseTypes.value.includes(p.licenseType))
  }

  result = result.filter((p) => p.price >= priceMin.value && p.price <= priceMax.value)

  const sorted = [...result]
  switch (sortBy.value) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    case 'popularity':
    default:
      sorted.sort((a, b) => b.downloads - a.downloads)
      break
  }

  return sorted
})

const formatPrice = (price) => `${price} ₽`

const formatDownloads = (downloads) => {
  if (downloads >= 1000) return `${(downloads / 1000).toFixed(1)}k+`
  return `${downloads}+`
}

const isHotProduct = (product) => {
  return product.rating >= 4.9 && product.downloads >= 1000
}

const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}
</script>

<template>
  <div class="catalog-page">
    <section class="catalog-hero">
      <div class="catalog-hero-inner">
        <div class="catalog-hero-left">
          <h1 class="catalog-title">Каталог программного обеспечения</h1>
          <p class="catalog-subtitle">
            Найдите подходящий продукт по категории, платформе и типу лицензии. Всё собрано в одном месте.
          </p>
        </div>

        <div class="catalog-hero-right">
          <div class="catalog-search">
            <span class="catalog-search-label">🔍 Поиск</span>
            <div class="catalog-search-row">
              <input
                v-model="searchQuery"
                type="search"
                class="catalog-search-input"
                placeholder="Введите название программы или задачу..."
              />
              <button class="catalog-search-clear" type="button" @click="searchQuery = ''" v-if="searchQuery">
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="layout">
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-title">Категории ПО</div>
          <ul class="sidebar-list">
            <li v-for="category in categories" :key="category">
              <button
                class="sidebar-link"
                :class="{ 'sidebar-link--active': selectedCategory === category }"
                @click="handleCategoryClick(category)"
              >
                {{ category }}
              </button>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">Платформа</div>
          <div class="filter-tags">
            <button
              v-for="platform in platforms"
              :key="platform"
              class="chip chip--small"
              :class="{ 'chip--active': selectedPlatforms.includes(platform) }"
              @click="togglePlatform(platform)"
            >
              {{ platform }}
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">Тип лицензии</div>
          <label v-for="type in licenseTypes" :key="type" class="checkbox">
            <input
              type="checkbox"
              :checked="selectedLicenseTypes.includes(type)"
              @change="toggleLicenseType(type)"
            />
            <span>{{ type }}</span>
          </label>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">Диапазон цены</div>
          <div class="price-range">
            <div class="price-inputs">
              <input v-model.number="priceMin" type="number" placeholder="от 0 ₽" min="0" class="price-input" />
              <input v-model.number="priceMax" type="number" placeholder="до 500 ₽" min="0" class="price-input" />
            </div>
            <button class="btn-apply" @click="applyPriceFilter">Применить</button>
          </div>
        </div>
      </aside>

      <section class="content" id="catalog">
        <div class="content-header">
          <div class="content-header-left">
            <h2>Программные продукты</h2>
            <p>Подборка ПО по заглушечным данным. Замените на реальные карточки продуктов.</p>
          </div>
          <div class="content-header-right">
            <span class="content-count">Найдено: {{ filteredProducts.length }} товара</span>
            <select v-model="sortBy" class="content-sort">
              <option value="popularity">По популярности</option>
              <option value="price-asc">По цене (сначала дешевле)</option>
              <option value="price-desc">По цене (сначала дороже)</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>

        <div class="products" v-if="filteredProducts.length > 0">
          <article
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
            @click="goToProduct(product.id)"
          >
            <div v-if="isHotProduct(product)" class="product-hot-badge" title="Горячее предложение">🔥</div>

            <div class="product-thumb">
              <img :src="product.image" :alt="product.name" />
            </div>

            <div class="product-info">
              <div class="product-topline">
                <span class="product-badge">{{ product.badge }}</span>
                <span class="product-license">{{ product.licenseType }}</span>
              </div>

              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-subtitle">{{ product.subtitle }}</p>

              <div class="product-meta">
                <span class="product-meta-item">⭐ {{ product.rating }} • {{ product.reviews }} отзывов</span>
                <span class="product-meta-item">⬇ {{ formatDownloads(product.downloads) }}</span>
                <span class="product-meta-item">💻 {{ product.platform.join(' / ') }}</span>
              </div>
            </div>

            <div class="product-actions">
              <div class="product-price-block">
                <div class="product-price-row">
                  <span class="product-price">{{ formatPrice(product.price) }}</span>
                  <span class="product-old-price" v-if="product.oldPrice">{{ formatPrice(product.oldPrice) }}</span>
                </div>
                <span class="product-price-note">Цена</span>
              </div>

              <button
                class="product-more-btn"
                type="button"
                @click.stop="goToProduct(product.id)"
              >
                Подробнее
              </button>
            </div>
          </article>
        </div>

        <div v-else class="products-empty">
          <p>По вашему запросу ничего не найдено. Попробуйте изменить фильтры.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.catalog-hero {
  padding: 28px 28px 10px;
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
}

.catalog-hero-inner {
  max-width: 1480px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 24px;
  align-items: center;
}

.catalog-title {
  font-size: 34px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.catalog-subtitle {
  margin-top: 10px;
  color: #94a3b8;
  font-size: 16px;
  line-height: 1.6;
  max-width: 58ch;
}

.catalog-search {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 16px;
  padding: 14px;
}

.catalog-search-label {
  display: block;
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 8px;
}

.catalog-search-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.catalog-search-input {
  flex: 1;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(2, 6, 23, 0.7);
  border-radius: 12px;
  padding: 12px 12px;
  color: #f1f5f9;
  outline: none;
}

.catalog-search-input:focus {
  border-color: rgba(99, 102, 241, 0.9);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
}

.catalog-search-clear {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  cursor: pointer;
}

.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
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
  gap: 8px;
}

.sidebar-link {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(2, 6, 23, 0.6);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.sidebar-link:hover {
  border-color: rgba(99, 102, 241, 0.6);
  background: rgba(99, 102, 241, 0.12);
}

.sidebar-link--active {
  border-color: rgba(34, 197, 94, 0.7);
  background: rgba(34, 197, 94, 0.12);
  color: #bbf7d0;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 600;
}

.chip--small {
  padding: 6px 10px;
  font-size: 12px;
}

.chip--active {
  border-color: rgba(99, 102, 241, 0.8);
  background: rgba(99, 102, 241, 0.18);
  color: #c7d2fe;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #cbd5e1;
  margin-bottom: 8px;
  cursor: pointer;
}

.checkbox input {
  width: 18px;
  height: 18px;
  accent-color: #ffd700;
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
  font-weight: 600;
}

.btn-apply:hover {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 14px;
  border-radius: 16px;
  border: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(15, 23, 42, 0.55);
}

.content-header-left h2 {
  font-size: 22px;
  font-weight: 800;
}

.content-header-left p {
  color: #94a3b8;
  font-size: 14px;
  margin-top: 6px;
}

.content-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content-count {
  color: #94a3b8;
  font-size: 13px;
}

.content-sort {
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.8);
  color: #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
}

.content-sort:focus {
  border-color: rgba(99, 102, 241, 0.9);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
}

.products {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 14px;
}

.product-card {
  position: relative;
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) 220px;
  gap: 18px;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(15, 23, 42, 0.55);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
  border-color: rgba(99, 102, 241, 0.35);
}

.product-hot-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: rgba(2, 6, 23, 0.65);
  border: 1px solid rgba(245, 158, 11, 0.45);
  box-shadow: 0 12px 24px rgba(245, 158, 11, 0.12);
}

.product-thumb {
  width: 92px;
  height: 92px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  min-width: 0;
}

.product-badge {
  font-size: 12px;
  color: #94a3b8;
}

.product-license {
  font-size: 12px;
  color: #cbd5e1;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(2, 6, 23, 0.5);
}

.product-name {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 800;
  color: #f8fafc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  color: #cbd5e1;
  font-size: 12px;
}


.product-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.product-price {
  font-size: 18px;
  font-weight: 900;
  color: #22c55e;
}

.product-old-price {
  margin-left: 8px;
  font-size: 13px;
  color: #94a3b8;
  text-decoration: line-through;
}

.product-price-note {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #94a3b8;
  text-align: right;
}

.product-more-btn {
  width: 100%;
  border: 1px solid rgba(99, 102, 241, 0.45);
  background: rgba(99, 102, 241, 0.12);
  color: #e2e8f0;
  border-radius: 14px;
  padding: 12px 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.product-more-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(34, 197, 94, 0.45);
  background: rgba(34, 197, 94, 0.12);
}

.products-empty {
  padding: 18px;
  border-radius: 16px;
  border: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(15, 23, 42, 0.55);
  color: #cbd5e1;
}


@media (max-width: 1024px) {
  .catalog-hero-inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .layout {
    grid-template-columns: minmax(0, 1fr);
    padding: 20px;
  }

  .sidebar {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .catalog-hero {
    padding: 20px;
  }

  .layout {
    padding: 16px;
    gap: 16px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-card {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .product-actions {
    align-items: flex-start;
  }

  .product-price-note {
    text-align: left;
  }
}
</style>
