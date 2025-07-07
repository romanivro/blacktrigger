function initRuleOfDay() {
  try {
    const ruleText = document.getElementById('rule-text');
    const customRuleInput = document.getElementById('custom-rule');
    if (!ruleText || !customRuleInput) {
      showError('rule', 'Элементы интерфейса не найдены');
      return;
    }
    let currentRule = JSON.parse(localStorage.getItem('currentRule') || '{}');
    let customRules = JSON.parse(localStorage.getItem('customRules') || '[]');
    const defaultRules = [
      'Не оправдывайся — объяснение без запроса = слабость.',
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

    const updateRule = () => {
      try {
        const today = new Date().toDateString();
        if (currentRule.date !== today) {
          const rule = customRules.length > 0 && Math.random() > 0.5
            ? customRules[Math.floor(Math.random() * customRules.length)]
            : defaultRules[Math.floor(Math.random() * defaultRules.length)];
          currentRule = { text: rule, adhered: 0, violated: 0, date: today };
          localStorage.setItem('currentRule', JSON.stringify(currentRule));
        }
        ruleText.textContent = currentRule.text || 'Правило не выбрано';
        showError('rule', '');
      } catch (e) {
        showError('rule', 'Ошибка обновления правила: ' + e.message);
      }
    };

    window.addCustomRule = () => {
      try {
        const rule = customRuleInput.value.trim();
        if (rule) {
          customRules.push(rule);
          localStorage.setItem('customRules', JSON.stringify(customRules));
          customRuleInput.value = '';
          updateRule();
          logActivity(`Добавлено правило: ${rule}`);
          showError('rule', '');
        } else {
          showError('rule', 'Введите правило');
        }
      } catch (e) {
        showError('rule', 'Не удалось добавить правило: ' + e.message);
      }
    };

    window.adhereRule = () => {
      try {
        currentRule.adhered = (currentRule.adhered || 0) + 1;
        localStorage.setItem('currentRule', JSON.stringify(currentRule));
        logActivity(`Правило "${currentRule.text}" соблюдено`);
        showError('rule', '');
      } catch (e) {
        showError('rule', 'Не удалось отметить соблюдение: ' + e.message);
      }
    };

    window.violateRule = () => {
      try {
        currentRule.violated = (currentRule.violated || 0) + 1;
        localStorage.setItem('currentRule', JSON.stringify(currentRule));
        logActivity(`Правило "${currentRule.text}" нарушено`);
        showError('rule', '');
      } catch (e) {
        showError('rule', 'Не удалось отметить нарушение: ' + e.message);
      }
    };

    updateRule();
  } catch (e) {
    showError('rule', 'Ошибка инициализации: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', initRuleOfDay);