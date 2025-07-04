export function initStrategy() {
  const goalInput = document.getElementById('strategy-goal');
  const leversInput = document.getElementById('strategy-levers');
  const resourcesInput = document.getElementById('strategy-resources');
  const obstaclesInput = document.getElementById('strategy-obstacles');
  const mechanismsInput = document.getElementById('strategy-mechanisms');
  const peopleSelect = document.getElementById('strategy-people');
  const statusSelect = document.getElementById('strategy-status');
  const strategyList = document.getElementById('strategy-list');
  let strategies = JSON.parse(localStorage.getItem('strategies') || '[]');
  let people = JSON.parse(localStorage.getItem('people') || '[]');

  const renderPeopleSelect = () => {
    peopleSelect.innerHTML = '<option value="">Выберите человека</option>';
    people.forEach(person => {
      const option = document.createElement('option');
      option.value = person.name;
      option.textContent = person.name;
      peopleSelect.appendChild(option);
    });
  };

  const renderStrategies = () => {
    strategyList.innerHTML = '';
    strategies.forEach((strategy, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${strategy.goal} (${strategy.status}, Люди: ${strategy.people || 'нет'})
        <button onclick="deleteStrategy(${index})">❌</button>
      `;
      strategyList.appendChild(li);
    });
  };

  window.addStrategy = () => {
    const goal = goalInput.value.trim();
    const levers = leversInput.value.trim();
    const resources = resourcesInput.value.trim();
    const obstacles = obstaclesInput.value.trim();
    const mechanisms = mechanismsInput.value.trim();
    const people = peopleSelect.value;
    const status = statusSelect.value;
    if (goal) {
      strategies.push({ goal, levers, resources, obstacles, mechanisms, people, status });
      localStorage.setItem('strategies', JSON.stringify(strategies));
      goalInput.value = '';
      leversInput.value = '';
      resourcesInput.value = '';
      obstaclesInput.value = '';
      mechanismsInput.value = '';
      peopleSelect.value = '';
      renderStrategies();
      logActivity(`Добавлена стратегия: ${goal}`);
    }
  };

  window.deleteStrategy = (index) => {
    const goal = strategies[index].goal;
    strategies.splice(index, 1);
    localStorage.setItem('strategies', JSON.stringify(strategies));
    renderStrategies();
    logActivity(`Удалена стратегия: ${goal}`);
  };

  renderPeopleSelect();
  renderStrategies();
}