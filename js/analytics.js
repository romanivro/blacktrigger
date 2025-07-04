export function initAnalytics() {
  const analyticsResults = document.getElementById('analytics-results');

  const renderAnalytics = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const people = JSON.parse(localStorage.getItem('people') || '[]');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const state = localStorage.getItem('userState') || 'focus';
    const now = new Date();
    const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);

    let results = '<h3>Аналитика</h3><ul>';

    // Невыполненные задачи
    const overdueTasks = tasks.filter(task => !task.completed && new Date(task.created) < threeDaysAgo);
    if (overdueTasks.length > 0) {
      results += `<li>Невыполненные задачи (>3 дней): ${overdueTasks.map(t => t.text).join(', ')}</li>`;
    }

    // Люди с отрицательной кармой
    const negativeKarma = people.filter(p => p.karma < 0);
    if (negativeKarma.length > 0) {
      results += `<li>Люди с отрицательной кармой: ${negativeKarma.map(p => `${p.name} (${p.karma})`).join(', ')}</li>`;
    }

    // Влияние состояния
    results += `<li>Текущее состояние: ${state}. Рекомендация: ${state === 'fatigue' ? 'Отдохните' : 'Продолжайте в том же духе'}</li>`;

    // Финансовая эффективность
    const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const recentTransactions = transactions.filter(t => new Date(t.date) >= last30Days);
    const income = recentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = recentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const total = income + expense;
    const percentage = total ? (income / total * 100).toFixed(2) : 0;
    results += `<li>Финансовая эффективность: ${percentage}% (${percentage > 50 ? 'Хорошо' : 'Требует внимания'})</li>`;

    // Рекомендации
    if (negativeKarma.length > 0) {
      results += `<li>Рекомендация: Исключите контакт с ${negativeKarma[0].name}</li>`;
    }

    results += '</ul>';
    analyticsResults.innerHTML = results;
  };

  renderAnalytics();
}