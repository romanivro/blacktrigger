function initFinance() {
  try {
    const financeList = document.getElementById('finance-list');
    if (!financeList) {
      showError('finance', 'Элемент списка транзакций не найден');
      return;
    }
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    const renderTransactions = () => {
      try {
        financeList.innerHTML = '';
        transactions.forEach((transaction, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${transaction.amount} (${transaction.type}, Тег: ${transaction.tag}, ${new Date(transaction.date).toLocaleDateString()})
            <button class="button-medium" onclick="deleteTransaction(${index})">❌</button>
          `;
          financeList.appendChild(li);
        });
        showError('finance', '');
      } catch (e) {
        showError('finance', 'Не удалось отобразить транзакции: ' + e.message);
      }
    };

    window.addTransaction = () => {
      try {
        const amount = parseFloat(document.getElementById('finance-amount').value);
        const type = document.getElementById('finance-type').value;
        const tag = document.getElementById('finance-tag').value.trim();
        if (!isNaN(amount) && amount > 0 && tag) {
          transactions.push({ amount, type, tag, date: new Date().toISOString() });
          localStorage.setItem('transactions', JSON.stringify(transactions));
          document.getElementById('finance-amount').value = '';
          document.getElementById('finance-type').value = 'income';
          document.getElementById('finance-tag').value = '';
          renderTransactions();
          logActivity(`Добавлена транзакция: ${type} ${amount} (${tag})`);
          showError('finance', '');
        } else {
          showError('finance', 'Введите корректную сумму и тег');
        }
      } catch (e) {
        showError('finance', 'Не удалось добавить транзакцию: ' + e.message);
      }
    };

    window.deleteTransaction = (index) => {
      try {
        const transaction = transactions[index];
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
        logActivity(`Удалена транзакция: ${transaction.type} ${transaction.amount}`);
      } catch (e) {
        showError('finance', 'Не удалось удалить транзакцию: ' + e.message);
      }
    };

    renderTransactions();
  } catch (e) {
    showError('finance', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initFinance);