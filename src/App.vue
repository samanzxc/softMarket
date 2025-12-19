<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="page">
    <Header />
    <main class="main-content">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
.page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a 0, #020617 45%, #000000 100%);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 1.6;
  position: relative;
  overflow-x: hidden;
}

/* Новогодние снежинки */
.page::before {
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

/* Новогодние акценты */

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

/* Новогодние градиенты для акцентов */
:root {
  --new-year-gold: #ffd700;
  --new-year-red: #dc2626;
  --new-year-green: #16a34a;
}
</style>
