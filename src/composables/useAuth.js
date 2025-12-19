import { ref, computed, readonly } from 'vue'

// Состояние авторизации
const user = ref(null)
const balance = ref(0)

// Проверяем, есть ли сохраненные данные пользователя
const initAuth = () => {
  const savedUser = localStorage.getItem('user')
  const savedBalance = localStorage.getItem('balance')
  
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
  
  if (savedBalance) {
    balance.value = parseFloat(savedBalance)
  }
}

// Валидация данных от Telegram
const validateTelegramData = (telegramData) => {
  const { hash, ...authData } = telegramData
  
  // Проверяем наличие обязательных полей
  const requiredFields = ['id', 'first_name', 'auth_date']
  for (const field of requiredFields) {
    if (!authData[field]) {
      return false
    }
  }
  
  // В реальном приложении здесь должна быть проверка hash через HMAC-SHA256
  // Для демо-режима пропускаем проверку
  return true
}

// Инициализация при первом импорте
initAuth()

export function useAuth() {
  const isAuthenticated = computed(() => user.value !== null)
  
  const login = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }
  
  const loginWithTelegram = (telegramData) => {
    if (!validateTelegramData(telegramData)) {
      throw new Error('Неверные данные от Telegram')
    }

    const telegramId = Number(telegramData.id)
    const authDateSeconds = Number(telegramData.auth_date)
    if (!Number.isFinite(telegramId) || !Number.isFinite(authDateSeconds)) {
      throw new Error('Некорректные данные от Telegram')
    }

    const existingRegistrationDate = user.value?.telegramId === telegramId ? user.value?.registrationDate : null
    
    const userData = {
      id: telegramId,
      telegramId,
      firstName: telegramData.first_name,
      lastName: telegramData.last_name || '',
      username: telegramData.username || '',
      photoUrl: telegramData.photo_url || '',
      authDate: new Date(authDateSeconds * 1000).toISOString(),
      registrationDate: existingRegistrationDate || new Date().toISOString(),
      provider: 'telegram'
    }
    
    login(userData)
    return userData
  }
  
  const logout = () => {
    user.value = null
    balance.value = 0
    localStorage.removeItem('user')
    localStorage.removeItem('balance')
  }
  
  const updateBalance = (newBalance) => {
    balance.value = newBalance
    localStorage.setItem('balance', newBalance.toString())
  }
  
  const addBalance = (amount) => {
    const newBalance = balance.value + amount
    updateBalance(newBalance)
  }
  
  const deductBalance = (amount) => {
    if (balance.value >= amount) {
      const newBalance = balance.value - amount
      updateBalance(newBalance)
      return true
    }
    return false
  }
  
  return {
    user: readonly(user),
    balance: readonly(balance),
    isAuthenticated,
    login,
    loginWithTelegram,
    logout,
    updateBalance,
    addBalance,
    deductBalance
  }
}
