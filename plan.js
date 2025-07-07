function initPlan() {
  try {
    const planText = document.getElementById('plan-text');
    const planPriority = document.getElementById('plan-priority');
    const planList = document.getElementById('plan-list');
    let plans = JSON.parse(localStorage.getItem('plans') || '[]');

    const renderPlans = () => {
      try {
        planList.innerHTML = '';
        plans.forEach((plan, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${plan.text} (Приоритет: ${plan.priority}, ${new Date(plan.created).toLocaleDateString()})
            <input type="checkbox" ${plan.completed ? 'checked' : ''} onchange="togglePlan(${index})">
            <button class="button-medium" onclick="deletePlan(${index})">❌</button>
          `;
          planList.appendChild(li);
        });
        renderAnalytics();
        scheduleNotifications();
        showError('plan', '');
      } catch (e) {
        showError('plan', 'Не удалось отобразить задачи: ' + e.message);
      }
    };

    window.addPlan = () => {
      try {
        const text = planText.value.trim();
        const priority = planPriority.value;
        if (text) {
          plans.push({ text, priority, created: new Date().toISOString(), completed: false });
          localStorage.setItem('plans', JSON.stringify(plans));
          planText.value = '';
          planPriority.value = 'low';
          renderPlans();
          logActivity(`Добавлена задача: ${text}`);
          showError('plan', '');
        } else {
          showError('plan', 'Введите задачу');
        }
      } catch (e) {
        showError('plan', 'Не удалось добавить задачу: ' + e.message);
      }
    };

    window.togglePlan = (index) => {
      try {
        plans[index].completed = !plans[index].completed;
        localStorage.setItem('plans', JSON.stringify(plans));
        renderPlans();
        logActivity(`Задача ${plans[index].text}: ${plans[index].completed ? 'Выполнена' : 'Отменена'}`);
      } catch (e) {
        showError('plan', 'Не удалось изменить статус задачи: ' + e.message);
      }
    };

    window.deletePlan = (index) => {
      try {
        const text = plans[index].text;
        plans.splice(index, 1);
        localStorage.setItem('plans', JSON.stringify(plans));
        renderPlans();
        logActivity(`Удалена задача: ${text}`);
        showError('plan', '');
      } catch (e) {
        showError('plan', 'Не удалось удалить задачу: ' + e.message);
      }
    };

    renderPlans();
  } catch (e) {
    showError('plan', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initPlan);