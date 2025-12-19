let stylesMounted = false

const ensureStyles = () => {
  if (stylesMounted) return
  if (typeof document === 'undefined') return

  if (document.querySelector('#notification-styles')) {
    stylesMounted = true
    return
  }

  const style = document.createElement('style')
  style.id = 'notification-styles'
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      max-width: 420px;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      animation: slideIn 0.28s ease;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }

    .notification--success {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.92), rgba(5, 150, 105, 0.92));
      color: white;
    }

    .notification--error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.92), rgba(220, 38, 38, 0.92));
      color: white;
    }

    .notification--info {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.92), rgba(37, 99, 235, 0.92));
      color: white;
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .notification-message {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.45;
    }

    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }

    .notification-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    @keyframes slideIn {
      from {
        transform: translateX(16px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 480px) {
      .notification {
        left: 12px;
        right: 12px;
        top: 12px;
        min-width: 0;
        max-width: none;
      }
    }
  `

  document.head.appendChild(style)
  stylesMounted = true
}

export const useNotification = () => {
  const notify = (message, type = 'info', timeoutMs = 5000) => {
    if (typeof document === 'undefined') return

    ensureStyles()

    const notification = document.createElement('div')
    notification.className = `notification notification--${type}`

    const close = () => {
      if (notification.parentElement) notification.remove()
    }

    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message"></span>
        <button class="notification-close" type="button" aria-label="Закрыть">×</button>
      </div>
    `

    const messageEl = notification.querySelector('.notification-message')
    if (messageEl) messageEl.textContent = String(message)

    const closeBtn = notification.querySelector('.notification-close')
    if (closeBtn) closeBtn.addEventListener('click', close)

    document.body.appendChild(notification)

    window.setTimeout(close, timeoutMs)
  }

  return { notify }
}
