function initEnvironment() {
  try {
    const peopleList = document.getElementById('people-list');
    const networkGraph = document.getElementById('network-graph');
    let people = JSON.parse(localStorage.getItem('people') || '[]');

    const renderPeople = () => {
      try {
        peopleList.innerHTML = '';
        people.forEach((person, index) => {
          const div = document.createElement('div');
          div.className = 'profile-card';
          div.innerHTML = `
            ${person.name} (${person.status}, Карма: ${person.karma})
            <button class="button-medium" onclick="deletePerson(${index})">❌</button>
          `;
          peopleList.appendChild(div);
        });
        renderNetwork();
        updateStrategyPeopleSelect();
        showError('environment', '');
      } catch (e) {
        showError('environment', 'Не удалось отобразить окружение: ' + e.message);
      }
    };

    window.addPerson = () => {
      try {
        const name = document.getElementById('person-name').value.trim();
        const status = document.getElementById('person-status').value;
        const tags = document.getElementById('person-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const karma = parseInt(document.getElementById('person-karma').value) || 0;
        if (name) {
          people.push({ name, status, tags, karma });
          localStorage.setItem('people', JSON.stringify(people));
          renderPeople();
          closeModal('person-modal');
          logActivity(`Добавлен человек: ${name}`);
          showError('environment', '');
        } else {
          showError('person-modal', 'Введите имя');
        }
      } catch (e) {
        showError('person-modal', 'Не удалось добавить человека: ' + e.message);
      }
    };

    window.deletePerson = (index) => {
      try {
        const name = people[index].name;
        people.splice(index, 1);
        localStorage.setItem('people', JSON.stringify(people));
        renderPeople();
        logActivity(`Удалён человек: ${name}`);
      } catch (e) {
        showError('environment', 'Не удалось удалить человека: ' + e.message);
      }
    };

    window.updateStrategyPeopleSelect = () => {
      try {
        const select = document.getElementById('strategy-people');
        if (!select) return;
        select.innerHTML = '';
        people = Array.isArray(people) ? people : [];
        people.forEach((person, index) => {
          const option = document.createElement('option');
          option.value = index;
          option.textContent = person.name;
          select.appendChild(option);
        });
      } catch (e) {
        showError('strategy', 'Ошибка обновления списка людей: ' + e.message);
      }
    };

    const renderNetwork = () => {
      try {
        const nodes = people.map((person, index) => ({
          id: index,
          label: person.name,
          color: person.status === 'loyal' ? '#55ff55' : person.status === 'neutral' ? '#ffff55' : person.status === 'hostile' ? '#ff5555' : '#55aaff'
        }));
        const edges = [];
        people.forEach((person, i) => {
          people.forEach((other, j) => {
            if (i < j && person.tags.some(tag => other.tags.includes(tag))) {
              edges.push({ from: i, to: j });
            }
          });
        });
        const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
        const options = { nodes: { shape: 'dot', size: 20 }, edges: { color: '#e0e0e0' } };
        new vis.Network(networkGraph, data, options);
      } catch (e) {
        showError('environment', 'Ошибка рендеринга графа: ' + e.message);
      }
    };

    renderPeople();
  } catch (e) {
    showError('environment', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initEnvironment);