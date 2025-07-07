function initArchetype() {
  try {
    const archetypeResult = document.getElementById('archetype-result');
    let archetype = JSON.parse(localStorage.getItem('archetype') || '{}');

    const questions = [
      { text: 'Вы предпочитаете действовать быстро, даже если это рискованно?', scores: { Predator: 2, Strategist: 1 } },
      { text: 'Вы часто манипулируете другими для достижения целей?', scores: { Puppeteer: 2, Manipulator: 1 } },
      { text: 'Вы чувствуете себя комфортно в роли лидера?', scores: { Hero: 2, Strategist: 1 } },
      { text: 'Вы склонны к долгосрочному планированию?', scores: { Strategist: 2, Oracle: 1 } },
      { text: 'Вам легко спровоцировать конфликт для проверки других?', scores: { Provocateur: 2, Manipulator: 1 } },
      { text: 'Вы цените лояльность превыше всего?', scores: { Hero: 2, Mediator: 1 } },
      { text: 'Вы часто предсказываете поведение других?', scores: { Oracle: 2, Strategist: 1 } },
      { text: 'Вам нравится выполнять задачи чётко и по плану?', scores: { Executor: 2, Strategist: 1 } },
      { text: 'Вы любите быть в центре внимания?', scores: { Hero: 2, Provocateur: 1 } },
      { text: 'Вы используете слабости других в своих интересах?', scores: { Puppeteer: 2, Predator: 1 } },
      { text: 'Вы избегаете конфликтов, предпочитая дипломатию?', scores: { Mediator: 2, Oracle: 1 } },
      { text: 'Вы быстро адаптируетесь к новым условиям?', scores: { Predator: 2, Provocateur: 1 } },
      { text: 'Вы тщательно анализируете риски перед действием?', scores: { Strategist: 2, Oracle: 1 } },
      { text: 'Вам нравится контролировать ситуацию полностью?', scores: { Puppeteer: 2, Strategist: 1 } },
      { text: 'Вы вдохновляете других своим примером?', scores: { Hero: 2, Mediator: 1 } },
      { text: 'Вы часто действуете интуитивно?', scores: { Oracle: 2, Predator: 1 } },
      { text: 'Вы предпочитаете чёткие инструкции?', scores: { Executor: 2, Mediator: 1 } },
      { text: 'Вы легко находите общий язык с людьми?', scores: { Mediator: 2, Hero: 1 } },
      { text: 'Вы любите создавать хаос для достижения целей?', scores: { Provocateur: 2, Puppeteer: 1 } },
      { text: 'Вы стремитесь к максимальной эффективности?', scores: { Strategist: 2, Executor: 1 } }
    ];

    const archetypes = {
      Predator: { name: 'Хищник', strengths: 'Быстрота, решительность', weaknesses: 'Импульсивность', tips: 'Фокусируйтесь на долгосрочных целях' },
      Strategist: { name: 'Стратег', strengths: 'Планирование, анализ', weaknesses: 'Медлительность', tips: 'Доверяйте интуиции' },
      Provocateur: { name: 'Провокатор', strengths: 'Управление конфликтами', weaknesses: 'Риск вражды', tips: 'Балансируйте провокации дипломатией' },
      Oracle: { name: 'Оракул', strengths: 'Интуиция, предвидение', weaknesses: 'Отстранённость', tips: 'Действуйте активнее' },
      Executor: { name: 'Исполнитель', strengths: 'Дисциплина, точность', weaknesses: 'Недостаток инициативы', tips: 'Берите на себя больше ответственности' },
      Hero: { name: 'Герой', strengths: 'Лидерство, вдохновение', weaknesses: 'Эгоцентризм', tips: 'Слушайте других' },
      Puppeteer: { name: 'Кукловод', strengths: 'Манипуляция, контроль', weaknesses: 'Доверие', tips: 'Будьте искреннее' },
      Mediator: { name: 'Медиатор', strengths: 'Дипломатия, эмпатия', weaknesses: 'Нерешительность', tips: 'Будьте тверже в решениях' }
    };

    window.openArchetypeModal = () => {
      try {
        openModal('archetype-modal-template', 'archetype-modal');
        const questionsDiv = document.getElementById('archetype-questions');
        const progressDiv = document.getElementById('archetype-progress');
        let currentQuestion = 0;
        let scores = {};

        const renderQuestion = () => {
          questionsDiv.innerHTML = `
            <p>${questions[currentQuestion].text}</p>
            <button class="button-medium" onclick="answerQuestion(true)">Да</button>
            <button class="button-medium" onclick="answerQuestion(false)">Нет</button>
          `;
          progressDiv.textContent = `Вопрос ${currentQuestion + 1}/${questions.length}`;
        };

        window.answerQuestion = (answer) => {
          try {
            const question = questions[currentQuestion];
            if (answer) {
              for (const [type, score] of Object.entries(question.scores)) {
                scores[type] = (scores[type] || 0) + score;
              }
            }
            currentQuestion++;
            if (currentQuestion < questions.length) {
              renderQuestion();
            } else {
              const result = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, Object.keys(scores)[0]);
              archetype = { type: result, details: archetypes[result] };
              localStorage.setItem('archetype', JSON.stringify(archetype));
              closeModal('archetype-modal');
              renderResult();
              logActivity(`Пройден тест архетипа: ${archetypes[result].name}`);
            }
          } catch (e) {
            showError('archetype', 'Ошибка ответа на вопрос: ' + e.message);
          }
        };

        renderQuestion();
      } catch (e) {
        showError('archetype', 'Ошибка открытия теста: ' + e.message);
      }
    };

    const renderResult = () => {
      try {
        if (archetype.type) {
          archetypeResult.innerHTML = `
            <p>Ваш архетип: ${archetypes[archetype.type].name}</p>
            <p><strong>Сильные стороны:</strong> ${archetypes[archetype.type].strengths}</p>
            <p><strong>Слабые стороны:</strong> ${archetypes[archetype.type].weaknesses}</p>
            <p><strong>Рекомендации:</strong> ${archetypes[archetype.type].tips}</p>
          `;
        }
        showError('archetype', '');
      } catch (e) {
        showError('archetype', 'Ошибка отображения результата: ' + e.message);
      }
    };

    renderResult();
  } catch (e) {
    showError('archetype', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initArchetype);