export function initFinance() {
  const amountInput = document.getElementById('transaction-amount');
  const typeSelect = document.getElementById('transaction-type');
  const descriptionInput = document.getElementById('transaction-description');
  const incomeList = document.getElementById('income-list');
  const expenseList = document.getElementById('expense-list');
  const percentageText = document.getElementById('finance-percentage');
  const financeChart = document.getElementById('finance-chart').getContext('2d');
  let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  let chart;

  const renderTransactions = () => {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTransactions = transactions.filter(t => new Date(t.date) >= last30Days);

    recentTransactions.forEach((transaction, index) => {
      const li = document.createElement('li');
      li.innerHTML = `${transaction.amount} - ${transaction.description} (${new Date(transaction.date).toLocaleDateString()}) <button onclick="deleteTransaction(${index})">❌</button>`;
      if (transaction.type === 'income') {
        incomeList.appendChild(li);
      } else {
        expenseList.appendChild(li);
      }
    });

    const income = recentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = recentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const total = income + expense;
    const percentage = total ? (income / total * 100).toFixed(2) : 0;
    percentageText.textContent = `Доходы: ${percentage}%`;
    percentageText.style.color = percentage > 50 ? 'green' : percentage === 50 ? 'yellow' : 'red';

    updateChart(recentTransactions);
  };

  window.addTransaction = () => {
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const description = descriptionInput.value.trim();
    if (!isNaN(amount) && description) {
      transactions.push({ amount, type, description, date: new Date().toISOString() });
      localStorage.setItem('transactions', JSON.stringify(transactions));
      amountInput.value = '';
      descriptionInput.value = '';
      renderTransactions();
      logActivity(`Добавлена транзакция: ${type}, ${amount}`);
    }
  };

  window.deleteTransaction = (index) => {
    const transaction = transactions[index];
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    logActivity(`Удалена транзакция: ${transaction.type}, ${transaction.amount}`);
  };

  window.showFinanceLog = () => {
    alert(JSON.stringify(transactions, null, 2));
    logActivity('Просмотрен лог транзакций');
  };

  function updateChart(transactions) {
    const dates = [...new Set(transactions.map(t => new Date(t.date).toLocaleDateString()))];
    const incomeData = dates.map(date => {
      return transactions
        .filter(t => t.type === 'income' && new Date(t.date).toLocaleDateString() === date)
        .reduce((sum, t) => sum + t.amount, 0);
    });
    const expenseData = dates.map(date => {
      return transactions
        .filter(t => t.type === 'expense' && new Date(t.date).toLocaleDateString() === date)
        .reduce((sum, t) => sum + t.amount, 0);
    });

    if (chart) chart.destroy();
    chart = new Chart(financeChart, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          { label: 'Доходы', data: incomeData, borderColor: 'green', fill: false },
          { label: 'Расходы', data: expenseData, borderColor: 'red', fill: false }
        ]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }

  renderTransactions();
}