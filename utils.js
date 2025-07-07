function toggleModule(moduleId) {
  try {
    const module = document.getElementById(moduleId);
    if (!module.classList.contains('always-open')) {
      module.classList.toggle('collapsed');
      logActivity(`Модуль ${moduleId} ${module.classList.contains('collapsed') ? 'свёрнут' : 'развёрнут'}`);
    }
  } catch (e) {
    showError('settings', 'Ошибка переключения модуля: ' + e.message);
  }
}

function showError(moduleId, message) {
  try {
    const errorElement = document.getElementById(`${moduleId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      if (message) logActivity(`Ошибка в ${moduleId}: ${message}`);
    }
  } catch (e) {
    console.error('Ошибка отображения ошибки:', e);
  }
}

function logActivity(message) {
  try {
    let activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    activityLog.push({ message, timestamp: new Date().toISOString() });
    if (activityLog.length > 50) activityLog.shift();
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
  } catch (e) {
    showError('settings', 'Ошибка логирования: ' + e.message);
  }
}

function openModal(templateId, modalId) {
  try {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal';
    modal.innerHTML = document.getElementById(templateId).innerHTML;
    document.body.appendChild(modal);
    modal.classList.add('show');
    logActivity(`Открыто модальное окно: ${modalId}`);
  } catch (e) {
    showError('settings', 'Ошибка открытия модального окна: ' + e.message);
  }
}

function closeModal(modalId) {
  try {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.remove();
      logActivity(`Закрыто модальное окно: ${modalId}`);
    }
  } catch (e) {
    showError('settings', 'Ошибка закрытия модального окна: ' + e.message);
  }
}

function exportData() {
  try {
    const data = {
      rule: localStorage.getItem('currentRule'),
      customRules: localStorage.getItem('customRules'),
      plans: localStorage.getItem('plans'),
      people: localStorage.getItem('people'),
      transactions: localStorage.getItem('transactions'),
      exercises: localStorage.getItem('exercises'),
      strategies: localStorage.getItem('strategies'),
      habits: localStorage.getItem('habits'),
      notes: localStorage.getItem('notes'),
      knowledge: localStorage.getItem('knowledge'),
      archetype: localStorage.getItem('archetype'),
      customSettings: localStorage.getItem('customSettings')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blacktrigger-data.json';
    a.click();
    URL.revokeObjectURL(url);
    logActivity('Данные экспортированы');
  } catch (e) {
    showError('settings', 'Ошибка экспорта: ' + e.message);
  }
}

function importData() {
  try {
    const fileInput = document.getElementById('import-file');
    if (fileInput.files.length === 0) {
      showError('settings', 'Выберите файл');
      return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      for (const key in data) {
        if (data[key]) localStorage.setItem(key, data[key]);
      }
      location.reload();
      logActivity('Данные импортированы');
    };
    reader.readAsText(file);
  } catch (e) {
    showError('settings', 'Ошибка импорта: ' + e.message);
  }
}

function switchMode(mode) {
  try {
    document.body.className = mode.toLowerCase();
    localStorage.setItem('mode', mode);
    logActivity(`Режим изменён на ${mode}`);
  } catch (e) {
    showError('settings', 'Ошибка смены режима: ' + e.message);
  }
}

function applyState() {
  try {
    const state = document.getElementById('state-select').value;
    localStorage.setItem('userState', state);
    logActivity(`Состояние изменено на ${state}`);
    showError('settings', '');
  } catch (e) {
    showError('settings', 'Ошибка изменения состояния: ' + e.message);
  }
}

function scheduleNotifications() {
  try {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
      return;
    }
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const now = new Date();
    plans.forEach(plan => {
      if (!plan.completed && new Date(plan.created).toDateString() === now.toDateString()) {
        new Notification('Напоминание', { body: `Задача "${plan.text}" не выполнена!` });
      }
    });
    habits.forEach(habit => {
      if (!habit.todayCompleted && habit.frequency === 'daily') {
        new Notification('Напоминание', { body: `Не забыть про привычку: ${habit.text}` });
      }
    });
  } catch (e) {
    showError('analytics', 'Ошибка уведомлений: ' + e.message);
  }
}

function checkInactivity() {
  try {
    const lastActivity = localStorage.getItem('lastActivity') || new Date().toISOString();
    const daysSinceLast = (new Date() - new Date(lastActivity)) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > 3) {
      const notification = document.getElementById('critical-notification');
      notification.style.display = 'block';
      notification.textContent = 'Бездействие более 3 дней! Вернитесь к работе!';
      if (Notification.permission === 'granted') {
        new Notification('Критическое уведомление', { body: 'Бездействие более 3 дней!' });
      }
    }
    localStorage.setItem('lastActivity', new Date().toISOString());
  } catch (e) {
    showError('analytics', 'Ошибка проверки бездействия: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const mode = localStorage.getItem('mode') || 'Absolute';
    switchMode(mode);
    document.getElementById('mode-select').value = mode;
    const customSettings = JSON.parse(localStorage.getItem('customSettings') || '{}');
    if (customSettings.backgroundImage) {
      document.querySelector('.container').style.backgroundImage = `url(${customSettings.backgroundImage})`;
    }
    if (customSettings.moduleSize) {
      document.querySelectorAll('.module').forEach(module => {
        module.classList.add(`module-${customSettings.moduleSize}`);
      });
      document.getElementById('module-size').value = customSettings.moduleSize;
    }
    if (customSettings.buttonSize) {
      document.querySelectorAll('button').forEach(button => {
        button.classList.add(`button-${customSettings.buttonSize}`);
      });
      document.getElementById('button-size').value = customSettings.buttonSize;
    }
    const state = localStorage.getItem('userState') || 'focus';
    document.getElementById('state-select').value = state;
    checkInactivity();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then(reg => {
          console.log('Service Worker зарегистрирован:', reg);
          logActivity('Service Worker зарегистрирован');
        })
        .catch(err => {
          console.error('Ошибка регистрации Service Worker:', err);
          showError('settings', 'Ошибка Service Worker: ' + err.message);
        });
    }
  } catch (e) {
    showError('settings', 'Ошибка инициализации приложения: ' + e.message);
  }
});