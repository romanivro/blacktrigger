export function initFitness() {
  const exerciseType = document.getElementById('exercise-type');
  const exerciseResult = document.getElementById('exercise-result');
  const exerciseList = document.getElementById('exercise-list');
  const fitnessChart = document.getElementById('fitness-chart').getContext('2d');
  let exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
  let chart;

  const renderExercises = () => {
    exerciseList.innerHTML = '';
    exercises.forEach((exercise, index) => {
      const li = document.createElement('li');
      li.innerHTML = `${exercise.type}: ${exercise.result} (${exercise.date}) <button onclick="deleteExercise(${index})">❌</button>`;
      exerciseList.appendChild(li);
    });
    updateChart();
  };

  window.addExercise = () => {
    const type = exerciseType.value.trim();
    const result = parseFloat(exerciseResult.value);
    if (type && !isNaN(result)) {
      exercises.push({ type, result, date: new Date().toISOString() });
      localStorage.setItem('exercises', JSON.stringify(exercises));
      exerciseType.value = '';
      exerciseResult.value = '';
      renderExercises();
      logActivity(`Добавлено упражнение: ${type}, ${result}`);
    }
  };

  window.deleteExercise = (index) => {
    const exerciseType = exercises[index].type;
    exercises.splice(index, 1);
    localStorage.setItem('exercises', JSON.stringify(exercises));
    renderExercises();
    logActivity(`Удалено упражнение: ${exerciseType}`);
  };

  function updateChart() {
    const types = [...new Set(exercises.map(ex => ex.type))];
    const datasets = types.map(type => ({
      label: type,
      data: exercises.filter(ex => ex.type === type).map(ex => ex.result),
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
    }));

    if (chart) chart.destroy();
    chart = new Chart(fitnessChart, {
      type: 'bar',
      data: {
        labels: exercises.map(ex => new Date(ex.date).toLocaleDateString()),
        datasets
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }

  renderExercises();
}