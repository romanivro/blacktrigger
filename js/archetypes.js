const questions = [
  { text: 'Как вы принимаете решения?', options: ['Анализирую данные', 'Слушаю интуицию', 'Советуюсь с другими'] },
  { text: 'В конфликте вы:', options: ['Идёте на компромисс', 'Настаиваете на своём', 'Избегаете'] },
  // Добавить ещё вопросы
];

const archetypes = ['Хищник', 'Стратег', 'Провокатор', 'Оракул', 'Исполнитель', 'Медиатор'];

export function initArchetypes() {
  const questionsDiv = document.getElementById('questions');
  const resultText = document.getElementById('archetype-result');
  let answers = JSON.parse(localStorage.getItem('archetypeAnswers') || '[]');

  const renderQuestions = () => {
    questionsDiv.innerHTML = '';
    questions.forEach((q, index) => {
      const div = document.createElement('div');
      div.innerHTML = `<p>${q.text}</p>`;
      q.options.forEach((option, i) => {
        div.innerHTML += `
          <button onclick="selectAnswer(${index}, ${i})">${option}</button>
        `;
      });
      questionsDiv.appendChild(div);
    });
  };

  window.selectAnswer = (questionIndex, optionIndex) => {
    answers[questionIndex] = optionIndex;
    localStorage.setItem('archetypeAnswers', JSON.stringify(answers));
    logActivity(`Выбран ответ на вопрос ${questionIndex + 1}`);
  };

  window.submitArchetype = () => {
    if (answers.length === questions.length) {
      const archetype = archetypes[Math.floor(Math.random() * archetypes.length)]; // Упрощённая логика
      resultText.textContent = `Ваш архетип: ${archetype}`;
      localStorage.setItem('archetype', archetype);
      logActivity(`Определён архетип: ${archetype}`);
    } else {
      alert('Ответьте на все вопросы');
    }
  };

  window.resetArchetype = () => {
    answers = [];
    localStorage.removeItem('archetypeAnswers');
    localStorage.removeItem('archetype');
    resultText.textContent = '';
    renderQuestions();
    logActivity('Сброшены результаты теста архетипов');
  };

  renderQuestions();
  const savedArchetype = localStorage.getItem('archetype');
  if (savedArchetype) {
    resultText.textContent = `Ваш архетип: ${savedArchetype}`;
  }
}