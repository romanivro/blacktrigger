function initNotes() {
  try {
    const noteList = document.getElementById('note-list');
    if (!noteList) {
      showError('notes', 'Элемент списка заметок не найден');
      return;
    }
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');

    const renderNotes = () => {
      try {
        noteList.innerHTML = '';
        notes.forEach((note, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${note.text} (${new Date(note.date).toLocaleDateString()})
            <button class="button-medium" onclick="deleteNote(${index})">❌</button>
          `;
          noteList.appendChild(li);
        });
        showError('notes', '');
      } catch (e) {
        showError('notes', 'Не удалось отобразить заметки: ' + e.message);
      }
    };

    window.addNote = () => {
      try {
        const text = document.getElementById('note-text').value.trim();
        if (text) {
          notes.push({ text, date: new Date().toISOString() });
          localStorage.setItem('notes', JSON.stringify(notes));
          document.getElementById('note-text').value = '';
          renderNotes();
          logActivity(`Добавлена заметка: ${text}`);
          showError('notes', '');
        } else {
          showError('notes', 'Введите заметку');
        }
      } catch (e) {
        showError('notes', 'Не удалось добавить заметку: ' + e.message);
      }
    };

    window.deleteNote = (index) => {
      try {
        const text = notes[index].text;
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        logActivity(`Удалена заметка: ${text}`);
      } catch (e) {
        showError('notes', 'Не удалось удалить заметку: ' + e.message);
      }
    };

    renderNotes();
  } catch (e) {
    showError('notes', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initNotes);