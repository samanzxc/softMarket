<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const { user, balance, logout } = useAuth()
const { notify } = useNotification()

const displayName = computed(() => {
  if (!user.value) return ''
  if (user.value.username) return `@${user.value.username}`
  const name = [user.value.firstName, user.value.lastName].filter(Boolean).join(' ')
  return name || user.value.name || 'Пользователь'
})

const registrationDate = computed(() => {
  if (!user.value?.registrationDate) return ''
  return new Date(user.value.registrationDate).toLocaleString('ru-RU')
})

const lastAuthDate = computed(() => {
  if (!user.value?.authDate) return ''
  return new Date(user.value.authDate).toLocaleString('ru-RU')
})

const handleLogout = () => {
  logout()
  notify('Вы вышли из аккаунта', 'info')
  router.push('/auth')
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <button class="btn-back" @click="router.go(-1)">← Назад</button>

      <div v-if="user" class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            <img v-if="user.photoUrl" :src="user.photoUrl" alt="avatar" />
            <div v-else class="avatar-fallback">{{ (user.firstName || 'U').slice(0, 1) }}</div>
          </div>

          <div class="header-info">
            <h1 class="name">{{ displayName }}</h1>
            <div class="provider">Telegram</div>
          </div>
        </div>

        <div class="grid">
          <div class="row">
            <div class="label">Telegram ID</div>
            <div class="value">{{ user.telegramId || user.id }}</div>
          </div>
          <div class="row" v-if="user.username">
            <div class="label">Ник</div>
            <div class="value">@{{ user.username }}</div>
          </div>
          <div class="row" v-if="user.firstName">
            <div class="label">Имя</div>
            <div class="value">{{ user.firstName }}</div>
          </div>
          <div class="row" v-if="user.lastName">
            <div class="label">Фамилия</div>
            <div class="value">{{ user.lastName }}</div>
          </div>
          <div class="row" v-if="registrationDate">
            <div class="label">Дата регистрации</div>
            <div class="value">{{ registrationDate }}</div>
          </div>
          <div class="row" v-if="lastAuthDate">
            <div class="label">Последний вход</div>
            <div class="value">{{ lastAuthDate }}</div>
          </div>
          <div class="row">
            <div class="label">Баланс</div>
            <div class="value">{{ balance }}</div>
          </div>
        </div>

        <button class="btn-logout" @click="handleLogout">Выйти</button>
      </div>

      <div v-else class="empty-state">
        <h2>Вы не авторизованы</h2>
        <p>Вход возможен только через Telegram.</p>
        <button class="btn-primary" @click="router.push('/auth')">Войти через Telegram</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a 0, #020617 45%, #000000 100%);
  color: #f1f5f9;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
}

.profile-container {
  width: 100%;
  max-width: 720px;
}

.btn-back {
  margin-bottom: 16px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  cursor: pointer;
}

.profile-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98));
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 20px;
  padding: 28px;
}

.profile-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(2, 6, 23, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-size: 28px;
  font-weight: 700;
  color: #94a3b8;
}

.name {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.provider {
  margin-top: 6px;
  display: inline-block;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 136, 204, 0.15);
  border: 1px solid rgba(0, 136, 204, 0.3);
  color: #66c7ff;
}

.grid {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(2, 6, 23, 0.55);
}

.label {
  color: #94a3b8;
  font-size: 13px;
}

.value {
  color: #f1f5f9;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.btn-logout {
  margin-top: 18px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  font-weight: 600;
  cursor: pointer;
}

.empty-state {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98));
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 20px;
  padding: 28px;
}

.btn-primary {
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #0088cc, #22c55e);
  color: #0b1220;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 520px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
