function initKnowledge() {
  try {
    const knowledgeList = document.getElementById('knowledge-list');
    const knowledgeSearch = document.getElementById('knowledge-search');
    let knowledge = JSON.parse(localStorage.getItem('knowledge') || '[]');

    const renderKnowledge = () => {
      try {
        knowledgeList.innerHTML = '';
        const searchTerm = knowledgeSearch.value.toLowerCase();
        knowledge
          .filter(note => note.title.toLowerCase().includes(searchTerm) || note.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
          .forEach((note, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
              ${note.title} (Теги: ${note.tags.join(', ')})
              <p>${note.content}</p>
              <button class="button-medium" onclick="deleteKnowledge(${index})">❌</button>
            `;
            knowledgeList.appendChild(li);
          });
        showError('knowledge', '');
      } catch (e) {
        showError('knowledge', 'Не удалось отобразить заметки: ' + e.message);
      }
    };

    window.addKnowledge = () => {
      try {
        const title = document.getElementById('knowledge-title').value.trim();
        const content = document.getElementById('knowledge-content').value.trim();
        const tags = document.getElementById('knowledge-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        if (title && content) {
          knowledge.push({ title, content, tags, date: new Date().toISOString() });
          localStorage.setItem('knowledge', JSON.stringify(knowledge));
          document.getElementById('knowledge-title').value = '';
          document.getElementById('knowledge-content').value = '';
          document.getElementById('knowledge-tags').value = '';
          closeModal('knowledge-modal');
          renderKnowledge();
          logActivity(`Добавлена заметка: ${title}`);
          showError('knowledge', '');
        } else {
          showError('knowledge-modal', 'Введите заголовок и содержимое');
        }
      } catch (e) {
        showError('knowledge-modal', 'Не удалось добавить заметку: ' + e.message);
      }
    };

    window.deleteKnowledge = (index) => {
      try {
        const title = knowledge[index].title;
        knowledge.splice(index, 1);
        localStorage.setItem('knowledge', JSON.stringify(knowledge));
        renderKnowledge();
        logActivity(`Удалена заметка: ${title}`);
      } catch (e) {
        showError('knowledge', 'Не удалось удалить заметку: ' + e.message);
      }
    };

    knowledgeSearch.addEventListener('input', renderKnowledge);
    renderKnowledge();
  } catch (e) {
    showError('knowledge', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initKnowledge);