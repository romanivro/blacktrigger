function initStrategy() {
  try {
    const strategyList = document.getElementById('strategy-list');
    if (!strategyList) {
      showError('strategy', 'Элемент списка стратегий не найден');
      return;
    }
    let strategies = JSON.parse(localStorage.getItem('strategies') || '[]');

    const renderStrategies = () => {
      try {
        strategyList.innerHTML = '';
        strategies.forEach((strategy, index) => {
          const div = document.createElement('div');
          const people = Array.isArray(strategy.people) ? strategy.people.map(i => {
            const person = JSON.parse(localStorage.getItem('people') || '[]')[i];
            return person ? person.name : 'Неизвестно';
          }).join(', ') : 'Нет участников';
          div.innerHTML = `
            <strong>Цель:</strong> ${strategy.goal}<br>
            <strong>Статус:</strong> ${strategy.status}<br>
            <strong>Участники:</strong> ${people}<br>
            <strong>Ресурсы:</strong> ${strategy.resources}<br>
            <strong>Рычаги:</strong> ${strategy.levers}<br>
            <strong>Препятствия:</strong> ${strategy.obstacles}<br>
            <strong>Действия:</strong> ${strategy.actions}
            <button class="button-medium" onclick="deleteStrategy(${index})">❌</button>
          `;
          strategyList.appendChild(div);
        });
        showError('strategy', '');
      } catch (e) {
        showError('strategy', 'Не удалось отобразить стратегии: ' + e.message);
      }
    };

    window.addStrategy = () => {
      try {
        const goal = document.getElementById('strategy-goal').value.trim();
        const people = Array.from(document.getElementById('strategy-people').selectedOptions).map(option => parseInt(option.value));
        const resources = document.getElementById('strategy-resources').value.trim();
        const levers = document.getElementById('strategy-levers').value.trim();
        const obstacles = document.getElementById('strategy-obstacles').value.trim();
        const actions = document.getElementById('strategy-actions').value.trim();
        const status = document.getElementById('strategy-status').value;
        if (goal && actions) {
          strategies.push({ goal, people, resources, levers, obstacles, actions, status });
          localStorage.setItem('strategies', JSON.stringify(strategies));
          document.getElementById('strategy-goal').value = '';
          document.getElementById('strategy-people').selectedIndex = -1;
          document.getElementById('strategy-resources').value = '';
          document.getElementById('strategy-levers').value = '';
          document.getElementById('strategy-obstacles').value = '';
          document.getElementById('strategy-actions').value = '';
          document.getElementById('strategy-status').value = 'plan';
          closeModal('strategy-modal');
          renderStrategies();
          logActivity(`Добавлена стратегия: ${goal}`);
          showError('strategy', '');
        } else {
          showError('strategy-modal', 'Введите цель и действия');
        }
      } catch (e) {
        showError('strategy-modal', 'Не удалось добавить стратегию: ' + e.message);
      }
    };

    window.deleteStrategy = (index) => {
      try {
        const goal = strategies[index].goal;
        strategies.splice(index, 1);
        localStorage.setItem('strategies', JSON.stringify(strategies));
        renderStrategies();
        logActivity(`Удалена стратегия: ${goal}`);
      } catch (e) {
        showError('strategy', 'Не удалось удалить стратегию: ' + e.message);
      }
    };

    renderStrategies();
  } catch (e) {
    showError('strategy', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initStrategy);