<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-left">
        <div class="logo">
          <span class="logo-mark">S</span>
          <span class="logo-text">Soft<span>Market</span></span>
        </div>
        <p class="footer-text">
          Краткое описание площадки по продаже ПО. Текст-заглушка, замените на реальные данные о
          компании или проекте.
        </p>
      </div>
      <div class="footer-right">
        <div class="footer-col">
          <div class="footer-title">Поддержка</div>
          <a href="#">Центр помощи (заглушка)</a>
          <a href="#">FAQ (заглушка)</a>
        </div>
        <div class="footer-col">
          <div class="footer-title">Документы</div>
          <a href="#">Пользовательское соглашение (заглушка)</a>
          <a href="#">Политика конфиденциальности (заглушка)</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} SoftMarket. Все права защищены. (заглушка)</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  padding: 24px 28px 16px;
  background: transparent;
  font-size: 14px;
  margin-top: 0;
}

.footer-inner {
  max-width: 1480px;
  margin: 0 auto 12px;
  display: flex;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-left {
  max-width: 480px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #020617;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #f1f5f9;
}

.logo-text span {
  color: #22c55e;
}

.footer-text {
  margin-top: 8px;
  color: #94a3b8;
  line-height: 1.6;
}

.footer-right {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #f1f5f9;
  font-size: 15px;
}

.footer-col a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 14px;
}

.footer-col a:hover {
  color: #22c55e;
}

.footer-bottom {
  max-width: 1480px;
  margin: 0 auto;
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  padding-top: 12px;
  color: #64748b;
  text-align: center;
  font-size: 13px;
}

@media (max-width: 768px) {
  .footer {
    padding: 20px;
  }

  .footer-inner {
    flex-direction: column;
    gap: 24px;
  }

  .footer-right {
    flex-direction: column;
    gap: 24px;
  }
}
</style>

