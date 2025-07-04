export function initPlan() {
  const taskInput = document.getElementById('task-input');
  const reminderTime = document.getElementById('reminder-time');
  const taskList = document.getElementById('task-list');
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  const renderTasks = () => {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
        ${task.text} (${task.time || 'без времени'})
        <button onclick="deleteTask(${index})">❌</button>
      `;
      taskList.appendChild(li);
    });
  };

  window.addTask = () => {
    const text = taskInput.value.trim();
    const time = reminderTime.value;
    if (text) {
      tasks.push({ text, time, completed: false, created: new Date().toISOString() });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      taskInput.value = '';
      reminderTime.value = '';
      renderTasks();
      logActivity(`Добавлена задача: ${text}`);
      if (time) scheduleNotification(text, time);
    }
  };

  window.toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    logActivity(`Задача "${tasks[index].text}" ${tasks[index].completed ? 'выполнена' : 'не выполнена'}`);
  };

  window.deleteTask = (index) => {
    const taskText = tasks[index].text;
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    logActivity(`Удалена задача: ${taskText}`);
  };

  function scheduleNotification(text, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const delay = notificationTime - now;
    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(text);
        }
      }, delay);
    }
  }

  renderTasks();
}