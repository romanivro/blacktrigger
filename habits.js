function initHabits() {
  try {
    const habitList = document.getElementById('habit-list');
    if (!habitList) {
      showError('habits', 'Элемент списка привычек не найден');
      return;
    }
    let habits = JSON.parse(localStorage.getItem('habits') || '[]');

    const renderHabits = () => {
      try {
        habitList.innerHTML = '';
        habits.forEach((habit, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${habit.text} (${habit.frequency}, ${habit.todayCompleted ? 'Выполнено' : 'Не выполнено'})
            <input type="checkbox" ${habit.todayCompleted ? 'checked' : ''} onchange="toggleHabit(${index})">
            <button class="button-medium" onclick="deleteHabit(${index})">❌</button>
          `;
          habitList.appendChild(li);
        });
        scheduleNotifications();
        showError('habits', '');
      } catch (e) {
        showError('habits', 'Не удалось отобразить привычки: ' + e.message);
      }
    };

    window.addHabit = () => {
      try {
        const text = document.getElementById('habit-text').value.trim();
        const frequency = document.getElementById('habit-frequency').value;
        if (text) {
          habits.push({ text, frequency, todayCompleted: false, lastUpdated: new Date().toISOString() });
          localStorage.setItem('habits', JSON.stringify(habits));
          document.getElementById('habit-text').value = '';
          document.getElementById('habit-frequency').value = 'daily';
          renderHabits();
          logActivity(`Добавлена привычка: ${text}`);
          showError('habits', '');
        } else {
          showError('habits', 'Введите привычку');
        }
      } catch (e) {
        showError('habits', 'Не удалось добавить привычку: ' + e.message);
      }
    };

    window.toggleHabit = (index) => {
      try {
        habits[index].todayCompleted = !habits[index].todayCompleted;
        habits[index].lastUpdated = new Date().toISOString();
        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits();
        logActivity(`Привычка ${habits[index].text}: ${habits[index].todayCompleted ? 'Выполнена' : 'Отменена'}`);
      } catch (e) {
        showError('habits', 'Не удалось изменить статус привычки: ' + e.message);
      }
    };

    window.deleteHabit = (index) => {
      try {
        const text = habits[index].text;
        habits.splice(index, 1);
        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits();
        logActivity(`Удалена привычка: ${text}`);
      } catch (e) {
        showError('habits', 'Не удалось удалить привычку: ' + e.message);
      }
    };

    renderHabits();
  } catch (e) {
    showError('habits', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initHabits);