<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated, balance, user, logout } = useAuth()

const mobileMenuOpen = ref(false)

const route = useRoute()
const router = useRouter()

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

watch(mobileMenuOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

const scrollToSection = (sectionId) => {
  const doScroll = () => {
    const element = document.getElementById(sectionId)
    if (!element) return

    const headerOffset = 90
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({ top: Math.max(0, elementPosition - headerOffset), behavior: 'smooth' })
  }

  closeMobileMenu()

  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(doScroll, 150)
    })
    return
  }

  setTimeout(doScroll, 100)
}

const handleLogin = () => {
  router.push('/auth')
}

const userDisplay = computed(() => {
  if (!user.value) return ''
  if (user.value.username) return `@${user.value.username}`
  const name = [user.value.firstName, user.value.lastName].filter(Boolean).join(' ')
  return name || 'Профиль'
})

const handleLogout = () => {
  logout()
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="topbar-left">
        <router-link to="/" class="logo-link">
          <div class="logo">
            <span class="logo-mark">S</span>
            <span class="logo-text">Soft<span>Market</span></span>
          </div>
        </router-link>

        <button
          class="mobile-menu-toggle"
          type="button"
          :aria-expanded="mobileMenuOpen"
          aria-label="Открыть меню"
          @click="toggleMobileMenu"
        >
          <svg v-if="!mobileMenuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <nav class="topbar-links">
          <router-link to="/catalog">Каталог</router-link>
          <a href="#features" @click.prevent="scrollToSection('features')">Преимущества</a>
          <a href="#purchase-guide" @click.prevent="scrollToSection('purchase-guide')">Как купить</a>
        </nav>
      </div>

      <div class="topbar-right">
        <div v-if="isAuthenticated" class="topbar-pill">
          <span class="pill-label">Баланс</span>
          <span class="pill-value">{{ balance.toFixed(2) }} ₽</span>
        </div>
        <button v-if="!isAuthenticated" class="topbar-action topbar-action--accent" @click="handleLogin">Войти через Telegram</button>
        <router-link v-if="isAuthenticated" to="/profile" class="user-chip">
          <span class="user-chip__avatar">
            <img v-if="user?.photoUrl" :src="user.photoUrl" alt="avatar" />
            <span v-else class="user-chip__fallback">{{ (userDisplay || 'U').slice(0, 1) }}</span>
          </span>
          <span class="user-chip__name">{{ userDisplay }}</span>
        </router-link>
        <button v-if="isAuthenticated" class="topbar-action" @click="handleLogout">Выйти</button>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="mobile-menu" @click.self="closeMobileMenu">
      <div class="mobile-menu-panel">
        <button class="mobile-menu-link" type="button" @click="router.push('/catalog'); closeMobileMenu()">Каталог</button>
        <a href="#features" @click.prevent="scrollToSection('features'); closeMobileMenu()">Преимущества</a>
        <a href="#purchase-guide" @click.prevent="scrollToSection('purchase-guide'); closeMobileMenu()">Как купить</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.95) 0%,
    rgba(2, 6, 23, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-inner {
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  padding: 14px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.mobile-menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(51, 65, 85, 0.7);
  background: rgba(15, 23, 42, 0.85);
  color: #e2e8f0;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mobile-menu-toggle:hover {
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow: 0 6px 18px rgba(34, 197, 94, 0.15);
}

.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.65);
  backdrop-filter: blur(10px);
  z-index: 120;
}

.mobile-menu-panel {
  position: absolute;
  top: 64px;
  left: 16px;
  right: 16px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%);
  border: 1px solid rgba(51, 65, 85, 0.65);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
}

.mobile-menu-panel a {
  color: #e2e8f0;
  padding: 12px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 600;
}

.mobile-menu-link {
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: #e2e8f0;
  padding: 12px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 600;
}

.mobile-menu-panel a:hover {
  background: rgba(79, 70, 229, 0.12);
  color: #f8fafc;
}

.mobile-menu-link:hover {
  background: rgba(79, 70, 229, 0.12);
  color: #f8fafc;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo-link {
  text-decoration: none;
  display: inline-flex;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffd700, #ff6b6b, #16a34a);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #020617;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4), 0 0 20px rgba(255, 107, 107, 0.2);
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #f1f5f9;
}

.logo-text span {
  color: #22c55e;
}

.topbar-links {
  display: flex;
  gap: 20px;
  font-size: 15px;
}

.topbar-links a {
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  position: relative;
}

.topbar-links :deep(a),
.topbar-links :deep(.router-link-active),
.topbar-links :deep(.router-link-exact-active) {
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  position: relative;
}

.topbar-links a:hover {
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.topbar-links :deep(a:hover) {
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.topbar-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffd700, #ff6b6b);
  transition: width 0.3s ease;
}

.topbar-links :deep(a)::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffd700, #ff6b6b);
  transition: width 0.3s ease;
}

.topbar-links a:hover::after {
  width: 100%;
}

.topbar-links :deep(a:hover)::after {
  width: 100%;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(51, 65, 85, 0.6);
}

.pill-label {
  font-size: 13px;
  color: #94a3b8;
}

.pill-value {
  font-size: 15px;
  color: #f1f5f9;
  font-weight: 600;
}

.topbar-action {
  font-size: 15px;
  padding: 9px 18px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid rgba(51, 65, 85, 0.8);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.topbar-action--accent {
  background: linear-gradient(135deg, #ffd700, #ff6b6b);
  border-color: rgba(255, 215, 0, 0.9);
  color: #020617;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.topbar-action:hover {
  border-color: #22c55e;
  color: #f1f5f9;
}

.topbar-action--accent:hover {
  filter: brightness(1.15);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 999px;
  text-decoration: none;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(51, 65, 85, 0.6);
  color: #e2e8f0;
  transition: all 0.2s ease;
}

.user-chip:hover {
  border-color: rgba(0, 136, 204, 0.6);
  box-shadow: 0 6px 18px rgba(0, 136, 204, 0.15);
}

.user-chip__avatar {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid rgba(51, 65, 85, 0.6);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.user-chip__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-chip__fallback {
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
}

.user-chip__name {
  font-size: 14px;
  font-weight: 600;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 20px;
  }

  .topbar-left {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .topbar-links {
    display: none;
  }

  .mobile-menu-toggle {
    display: inline-flex;
  }
}
</style>

