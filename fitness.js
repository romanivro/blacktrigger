function initFitness() {
  try {
    const exerciseList = document.getElementById('exercise-list');
    if (!exerciseList) {
      showError('fitness', 'Элемент списка тренировок не найден');
      return;
    }
    let exercises = JSON.parse(localStorage.getItem('exercises') || '[]');

    const renderExercises = () => {
      try {
        exerciseList.innerHTML = '';
        exercises.forEach((exercise, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${exercise.type} (${exercise.result}, ${new Date(exercise.date).toLocaleDateString()})
            <button class="button-medium" onclick="deleteExercise(${index})">❌</button>
          `;
          exerciseList.appendChild(li);
        });
        showError('fitness', '');
      } catch (e) {
        showError('fitness', 'Не удалось отобразить тренировки: ' + e.message);
      }
    };

    window.addExercise = () => {
      try {
        const type = document.getElementById('exercise-type').value.trim();
        const result = parseFloat(document.getElementById('exercise-result').value);
        if (type && !isNaN(result) && result >= 0) {
          exercises.push({ type, result, date: new Date().toISOString() });
          localStorage.setItem('exercises', JSON.stringify(exercises));
          document.getElementById('exercise-type').value = '';
          document.getElementById('exercise-result').value = '';
          renderExercises();
          logActivity(`Добавлена тренировка: ${type} (${result})`);
          showError('fitness', '');
        } else {
          showError('fitness', 'Введите тип тренировки и корректный результат');
        }
      } catch (e) {
        showError('fitness', 'Не удалось добавить тренировку: ' + e.message);
      }
    };

    window.deleteExercise = (index) => {
      try {
        const exercise = exercises[index];
        exercises.splice(index, 1);
        localStorage.setItem('exercises', JSON.stringify(exercises));
        renderExercises();
        logActivity(`Удалена тренировка: ${exercise.type}`);
      } catch (e) {
        showError('fitness', 'Не удалось удалить тренировку: ' + e.message);
      }
    };

    renderExercises();
  } catch (e) {
    showError('fitness', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initFitness);