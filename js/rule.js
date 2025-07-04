const defaultRules = [
  'Контроль над собой — контроль над всем',
  'Делай сегодня то, что можешь отложить на завтра',
  'Каждый шаг приближает к цели',
  'Будь гибким, но не ломайся',
  'Сила в простоте',
  'Слушай больше, говори меньше',
  'Ошибки — это уроки',
  'Действуй, а не мечтай',
  'Будь готов к переменам',
  'Цени время, оно не возвращается'
];

export function initRule() {
  const ruleText = document.getElementById('rule-text');
  const newRuleInput = document.getElementById('new-rule');
  let rules = JSON.parse(localStorage.getItem('rules') || '[]').concat(defaultRules);
  let currentRuleIndex = 0;

  const displayRule = () => {
    ruleText.textContent = rules[currentRuleIndex];
  };

  window.addRule = () => {
    const newRule = newRuleInput.value.trim();
    if (newRule) {
      rules.push(newRule);
      localStorage.setItem('rules', JSON.stringify(rules));
      newRuleInput.value = '';
      logActivity(`Добавлено правило: ${newRule}`);
    }
  };

  window.nextRule = () => {
    currentRuleIndex = (currentRuleIndex + 1) % rules.length;
    displayRule();
    logActivity('Переключено правило');
  };

  displayRule();
}