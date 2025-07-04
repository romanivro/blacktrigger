export function initState() {
  const stateSelect = document.getElementById('state-select');
  const savedState = localStorage.getItem('userState') || 'focus';
  stateSelect.value = savedState;

  window.updateState = () => {
    const state = stateSelect.value;
    localStorage.setItem('userState', state);
    logActivity(`Изменено состояние: ${state}`);
  };
}

function logActivity(action) {
  const activity = JSON.parse(localStorage.getItem('activityLog') || '[]');
  activity.push({ date: new Date().toISOString(), action });
  localStorage.setItem('activityLog', JSON.stringify(activity));
}