export function initEnvironment() {
  const personName = document.getElementById('person-name');
  const personStatus = document.getElementById('person-status');
  const personTags = document.getElementById('person-tags');
  const personKarma = document.getElementById('person-karma');
  const personList = document.getElementById('person-list');
  let people = JSON.parse(localStorage.getItem('people') || '[]');

  const renderPeople = () => {
    personList.innerHTML = '';
    people.forEach((person, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${person.name} (${person.status}, Карма: ${person.karma}, Метки: ${person.tags.join(', ')})
        <button onclick="adjustKarma(${index}, 10)">+10</button>
        <button onclick="adjustKarma(${index}, -10)">-10</button>
        <button onclick="deletePerson(${index})">❌</button>
      `;
      personList.appendChild(li);
    });
  };

  window.addPerson = () => {
    const name = personName.value.trim();
    const status = personStatus.value;
    const tags = personTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const karma = parseInt(personKarma.value);
    if (name) {
      people.push({ name, status, tags, karma });
      localStorage.setItem('people', JSON.stringify(people));
      personName.value = '';
      personTags.value = '';
      personKarma.value = '0';
      renderPeople();
      logActivity(`Добавлен человек: ${name}`);
    }
  };

  window.adjustKarma = (index, change) => {
    people[index].karma = Math.max(-100, Math.min(100, people[index].karma + change));
    localStorage.setItem('people', JSON.stringify(people));
    renderPeople();
    logActivity(`Изменена карма для ${people[index].name}: ${people[index].karma}`);
  };

  window.deletePerson = (index) => {
    const name = people[index].name;
    people.splice(index, 1);
    localStorage.setItem('people', JSON.stringify(people));
    renderPeople();
    logActivity(`Удалён человек: ${name}`);
  };

  renderPeople();
}