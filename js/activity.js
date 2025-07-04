export function initActivity() {
  const activityList = document.getElementById('activity-list');
  const activityChart = document.getElementById('activity-chart').getContext('2d');
  let activity = JSON.parse(localStorage.getItem('activityLog') || '[]');
  let chart;

  const renderActivity = () => {
    activityList.innerHTML = '';
    activity.forEach((log, index) => {
      const li = document.createElement('li');
      li.textContent = `${new Date(log.date).toLocaleString()} - ${log.action}`;
      activityList.appendChild(li);
    });
    updateChart();
  };

  window.toggleActivityLog = () => {
    activityList.style.display = activityList.style.display === 'none' ? 'block' : 'none';
    logActivity('Переключён лог активности');
  };

  window.undoLastAction = () => {
    if (activity.length > 0) {
      activity.pop();
      localStorage.setItem('activityLog', JSON.stringify(activity));
      renderActivity();
      logActivity('Отменено последнее действие');
    }
  };

  function updateChart() {
    const dates = [...new Set(activity.map(log => new Date(log.date).toLocaleDateString()))];
    const data = dates.map(date => {
      return activity.filter(log => new Date(log.date).toLocaleDateString() === date).length;
    });

    if (chart) chart.destroy();
    chart = new Chart(activityChart, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{ label: 'Активность', data, backgroundColor: 'rgba(0, 123, 255, 0.5)' }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }

  renderActivity();
}