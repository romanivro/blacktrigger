// Утилиты
function toggleModule(moduleId) {
  const module = document.getElementById(moduleId);
  if (!module.classList.contains('always-open')) {
    module.classList.toggle('collapsed');
  }
}

function showError(moduleId, message) {
  const errorElement = document.getElementById(`${moduleId}-error`);
  if (errorElement) errorElement.textContent = message;
}

function openModal(templateId, modalId) {
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal';
  modal.innerHTML = document.getElementById(templateId).innerHTML;
  document.body.appendChild(modal);
  modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.remove();
}

function exportData() {
  const data = {
    rule: localStorage.getItem('currentRule'),
    plans: localStorage.getItem('plans'),
    people: localStorage.getItem('people'),
    transactions: localStorage.getItem('transactions'),
    habits: localStorage.getItem('habits'),
    notes: localStorage.getItem('notes'),
    knowledge: localStorage.getItem('knowledge'),
    archetype: localStorage.getItem('archetype'),
    strategies: localStorage.getItem('strategies')
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'blacktrigger-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const fileInput = document.getElementById('import-file');
  if (fileInput.files.length === 0) {
    showError('settings', 'Выберите файл');
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    for (const key in data) {
      if (data[key]) localStorage.setItem(key, data[key]);
    }
    location.reload();
  };
  reader.readAsText(file);
}

// Правило День
let currentRule = JSON.parse(localStorage.getItem('currentRule') || '{}');
let customRules = JSON.parse(localStorage.getItem('customRules') || '[]');
const defaultRules = [
  'Не оправдывайся — объяснение без запроса — слабость.',
  'Если не приносит ресурс — отсекай.',
  'Хищник молчит чаще, чем говорит.',
  'Контроль над собой — контроль над всем.',
  'Каждое взаимодействие — война за интересы.',
  'Грубость — фильтр. Кто слаб — отпадёт сам.',
  'Сначала доминируй, потом дружи.',
  'Если не давят на тебя — дави ты.',
  'Ложь — инструмент, не слабость.',
  'Правильное ≠ выгодное. Выбирай выгоду.'
];

function updateRule() {
  const today = new Date().toDateString();
  if (!currentRule.date || currentRule.date !== today) {
    const rule = customRules.length > 0 && Math.random() > 0.5
      ? customRules[Math.floor(Math.random() * customRules.length)]
      : defaultRules[Math.floor(Math.random() * defaultRules.length)];
    currentRule = { text: rule, adhered: 0, violated: 0, date: today };
    localStorage.setItem('currentRule', JSON.stringify(currentRule));
  }
  document.getElementById('rule-text').textContent = `${currentRule.text || 'Правило не выбрано'} (Соблюдено: ${currentRule.adhered || 0}, Нарушено: ${currentRule.violated || 0})`;
}

function adhereRule() {
  if (currentRule.text) {
    currentRule.adhered = (currentRule.adhered || 0) + 1;
    localStorage.setItem('currentRule', JSON.stringify(currentRule));
    updateRule();
  } else {
    showError('rule', 'Сначала выберите правило');
  }
}

function violateRule() {
  if (currentRule.text) {
    currentRule.violated = (currentRule.violated || 0) + 1;
    localStorage.setItem('currentRule', JSON.stringify(currentRule));
    updateRule();
  } else {
    showError('rule', 'Сначала выберите правило');
  }
}

function addCustomRule() {
  const rule = document.getElementById('custom-rule').value.trim();
  if (rule) {
    customRules.push(rule);
    localStorage.setItem('customRules', JSON.stringify(customRules));
    document.getElementById('custom-rule').value = '';
    updateRule();
  } else {
    showError('rule', 'Введите правило');
  }
}

// План на День
let plans = JSON.parse(localStorage.getItem('plans') || '[]');

function renderPlans() {
  const planList = document.getElementById('plan-list');
  planList.innerHTML = '';
  plans.forEach((plan, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${plan.text} <button onclick="deletePlan(${index})">❌</button>`;
    planList.appendChild(li);
  });
}

function addPlan() {
  const text = document.getElementById('plan-text').value.trim();
  if (text) {
    plans.push({ text, created: new Date().toISOString() });
    localStorage.setItem('plans', JSON.stringify(plans));
    document.getElementById('plan-text').value = '';
    renderPlans();
  } else {
    showError('plan', 'Введите задачу');
  }
}

function deletePlan(index) {
  plans.splice(index, 1);
  localStorage.setItem('plans', JSON.stringify(plans));
  renderPlans();
}

// Окружение
let people = JSON.parse(localStorage.getItem('people') || '[]');

function renderPeople() {
  const peopleList = document.getElementById('people-list');
  peopleList.innerHTML = '';
  people.forEach((person, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${person.name} (${person.status}) [${person.tags.join(', ')}] <button onclick="deletePerson(${index})">❌</button>`;
    peopleList.appendChild(div);
  });
}

function openPersonModal() { openModal('person-modal-template', 'person-modal'); }

function addPerson() {
  const name = document.getElementById('person-name').value.trim();
  const status = document.getElementById('person-status').value;
  const tagsInput = document.getElementById('person-tags').value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  if (name) {
    people.push({ name, status, tags, karma: 0 });
    localStorage.setItem('people', JSON.stringify(people));
    document.getElementById('person-name').value = '';
    document.getElementById('person-status').value = 'neutral';
    document.getElementById('person-tags').value = '';
    renderPeople();
    closeModal('person-modal');
  } else {
    alert('Введите имя');
  }
}

function deletePerson(index) {
  people.splice(index, 1);
  localStorage.setItem('people', JSON.stringify(people));
  renderPeople();
}

// Финансы
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

function renderTransactions() {
  const financeList = document.getElementById('finance-list');
  financeList.innerHTML = '';
  transactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${transaction.amount} (${transaction.type}) <button onclick="deleteTransaction(${index})">❌</button>`;
    financeList.appendChild(li);
  });
  updateFinanceStats();
}

function addTransaction() {
  const amount = parseFloat(document.getElementById('finance-amount').value);
  const type = document.getElementById('finance-type').value;
  if (!isNaN(amount) && amount > 0) {
    transactions.push({ amount, type, date: new Date().toISOString() });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    document.getElementById('finance-amount').value = '';
    document.getElementById('finance-type').value = 'income';
    renderTransactions();
  } else {
    showError('finance', 'Введите корректную сумму');
  }
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTransactions();
}

function updateFinanceStats() {
  const incomes = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = incomes - expenses;
  document.getElementById('finance-stats').textContent = `Доходы: ${incomes}, Расходы: ${expenses}, Баланс: ${balance} (${((incomes / (expenses || 1)) * 100).toFixed(1)}%)`;
}

// Привычки
let habits = JSON.parse(localStorage.getItem('habits') || '[]');

function renderHabits() {
  const habitList = document.getElementById('habit-list');
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${habit.text} (${habit.frequency}) <button onclick="deleteHabit(${index})">❌</button>`;
    habitList.appendChild(li);
  });
}

function addHabit() {
  const text = document.getElementById('habit-text').value.trim();
  const frequency = document.getElementById('habit-frequency').value;
  if (text) {
    habits.push({ text, frequency });
    localStorage.setItem('habits', JSON.stringify(habits));
    document.getElementById('habit-text').value = '';
    document.getElementById('habit-frequency').value = 'daily';
    renderHabits();
  } else {
    showError('habits', 'Введите привычку');
  }
}

function deleteHabit(index) {
  habits.splice(index, 1);
  localStorage.setItem('habits', JSON.stringify(habits));
  renderHabits();
}

// Заметки
let notes = JSON.parse(localStorage.getItem('notes') || '[]');

function renderNotes() {
  const noteList = document.getElementById('note-list');
  noteList.innerHTML = '';
  notes.forEach((note, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${note.text} (${new Date(note.date).toLocaleDateString()}) <button onclick="deleteNote(${index})">❌</button>`;
    noteList.appendChild(li);
  });
}

function addNote() {
  const text = document.getElementById('note-text').value.trim();
  if (text) {
    notes.push({ text, date: new Date().toISOString() });
    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('note-text').value = '';
    renderNotes();
  } else {
    showError('notes', 'Введите заметку');
  }
}

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();
}

// База знаний
let knowledge = JSON.parse(localStorage.getItem('knowledge') || '[]');

function renderKnowledge() {
  const knowledgeList = document.getElementById('knowledge-list');
  const searchTerm = document.getElementById('knowledge-search').value.toLowerCase();
  knowledgeList.innerHTML = '';
  knowledge.filter(note => note.title.toLowerCase().includes(searchTerm)).forEach((note, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${note.title} <button onclick="deleteKnowledge(${index})">❌</button>`;
    knowledgeList.appendChild(li);
  });
}

function openKnowledgeModal() { openModal('knowledge-modal-template', 'knowledge-modal'); }

function addKnowledge() {
  const title = document.getElementById('knowledge-title').value.trim();
  const content = document.getElementById('knowledge-content').value.trim();
  if (title && content) {
    knowledge.push({ title, content, date: new Date().toISOString(), author: 'romanivro' });
    localStorage.setItem('knowledge', JSON.stringify(knowledge));
    document.getElementById('knowledge-title').value = '';
    document.getElementById('knowledge-content').value = '';
    renderKnowledge();
    closeModal('knowledge-modal');
  } else {
    alert('Введите заголовок и содержимое');
  }
}

function deleteKnowledge(index) {
  knowledge.splice(index, 1);
  localStorage.setItem('knowledge', JSON.stringify(knowledge));
  renderKnowledge();
}

// Архетипы
let archetype = JSON.parse(localStorage.getItem('archetype') || '{}');
const archetypes = { predator: 'Хищник', strategist: 'Стратег', provocateur: 'Провокатор' };

function openArchetypeModal() { openModal('archetype-modal-template', 'archetype-modal'); }

function submitArchetype() {
  const result = document.getElementById('archetype-question').value;
  archetype = { type: result };
  localStorage.setItem('archetype', JSON.stringify(archetype));
  document.getElementById('archetype-result').textContent = `Ваш архетип: ${archetypes[result]}`;
  closeModal('archetype-modal');
}

// Аналитика
function accessAnalytics() {
  const totalPlans = plans.length;
  const totalTransactions = transactions.length;
  document.getElementById('analytics-results').textContent = `Всего задач: ${totalPlans}, Транзакций: ${totalTransactions}`;
}

// Настройки
function applyState() {
  const state = document.getElementById('state-select').value;
  localStorage.setItem('userState', state);
}

// Справка
document.getElementById('help-content').innerHTML = '<h3>Справка</h3><p>Используйте модули для управления задачами, окружением и финансами. Данные сохраняются автоматически.</p>';

// Карта стратегии
let strategies = JSON.parse(localStorage.getItem('strategies') || '[]');

function renderStrategies() {
  const strategyList = document.getElementById('strategy-list');
  strategyList.innerHTML = '';
  strategies.forEach((strategy, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${strategy.goal} <button onclick="deleteStrategy(${index})">❌</button>`;
    strategyList.appendChild(div);
  });
}

function openStrategyModal() { openModal('strategy-modal-template', 'strategy-modal'); }

function addStrategy() {
  const goal = document.getElementById('strategy-goal').value.trim();
  if (goal) {
    strategies.push({ goal, date: new Date().toISOString() });
    localStorage.setItem('strategies', JSON.stringify(strategies));
    document.getElementById('strategy-goal').value = '';
    renderStrategies();
    closeModal('strategy-modal');
  } else {
    alert('Введите цель');
  }
}

function deleteStrategy(index) {
  strategies.splice(index, 1);
  localStorage.setItem('strategies', JSON.stringify(strategies));
  renderStrategies();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  updateRule();
  renderPlans();
  renderPeople();
  renderTransactions();
  renderHabits();
  renderNotes();
  renderKnowledge();
  renderStrategies();
  if (archetype.type) document.getElementById('archetype-result').textContent = `Ваш архетип: ${archetypes[archetype.type]}`;
  accessAnalytics();
}); 