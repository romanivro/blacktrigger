export function checkInactivity() {
  const activity = JSON.parse(localStorage.getItem('activityLog') || '[]');
  const lastActivity = activity.length > 0 ? new Date(activity[activity.length - 1].date) : new Date();
  const now = new Date();
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  if (now - lastActivity > threeDays && Notification.permission === 'granted') {
    new Notification('Вы неактивны 3 дня! Вернитесь к задачам.');
  }

  setTimeout(checkInactivity, 24 * 60 * 60 * 1000); // Проверка раз в день
}