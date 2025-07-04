export function initReminders() {
  const reminderTimeInput = document.getElementById('reminder-time-input');
  const reminderTextInput = document.getElementById('reminder-text');
  const reminderList = document.getElementById('reminder-list');
  let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');

  const renderReminders = () => {
    reminderList.innerHTML = '';
    reminders.forEach((reminder, index) => {
      const li = document.createElement('li');
      li.innerHTML = `${reminder.time} - ${reminder.text} <button onclick="deleteReminder(${index})">❌</button>`;
      reminderList.appendChild(li);
    });
  };

  window.addReminder = () => {
    const time = reminderTimeInput.value;
    const text = reminderTextInput.value.trim();
    if (time && text) {
      reminders.push({ time, text });
      localStorage.setItem('reminders', JSON.stringify(reminders));
      reminderTimeInput.value = '';
      reminderTextInput.value = '';
      renderReminders();
      logActivity(`Добавлено напоминание: ${text}`);
      scheduleNotification(text, time);
    }
  };

  window.deleteReminder = (index) => {
    const reminderText = reminders[index].text;
    reminders.splice(index, 1);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();
    logActivity(`Удалено напоминание: ${reminderText}`);
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

  renderReminders();

  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}