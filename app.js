// ===== 📜 Правила дня =====
const rules = [
  "Не оправдывайся — объяснение без запроса — слабость.",
  "Если не приносит ресурс — отсекай.",
  "Хищник молчит чаще, чем говорит.",
  "Контроль над собой — контроль над всем.",
  "Каждое взаимодействие — война за интересы.",
  "Грубость — фильтр. Кто слаб — отпадёт сам.",
  "Сначала доминируй, потом дружи.",
  "Если не давят на тебя — дави ты.",
  "Ложь — инструмент, не слабость.",
  "Правильное ≠ выгодное. Выбирай выгоду."
];

function getRule() {
  const index = Math.floor(Math.random() * rules.length);
  document.getElementById("rule").textContent = rules[index];
}

// ===== 🧠 Лог =====
function saveLog(entry) {
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]");
  log.push({ time: new Date().toLocaleString(), entry });
  localStorage.setItem("activityLog", JSON.stringify(log));
}

function toggleLog() {
  const logList = document.getElementById("logList");
  if (!logList) return;
  logList.style.display = logList.style.display === "none" ? "block" : "none";
  renderLog();
  updateActivityChart();
}

function renderLog() {
  const logList = document.getElementById("logList");
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]").reverse();
  logList.innerHTML = "";
  log.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.time} — ${item.entry}`;
    logList.appendChild(li);
  });
}

function updateActivityChart() {
  const raw = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const map = {};
  raw.forEach(item => {
    const date = item.time.split(",")[0];
    map[date] = (map[date] || 0) + 1;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);

  if (window.activityChart) window.activityChart.destroy();

  const ctx = document.getElementById("activityChart").getContext("2d");
  window.activityChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Активность", data: values, borderColor: "#0f0", tension: 0.2 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#0f0" }, grid: { color: "#333" } },
        y: { beginAtZero: true, ticks: { color: "#0f0" }, grid: { color: "#333" } }
      }
    }
  });
}

// ===== 📋 Задачи =====
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (!value) return;

  const li = document.createElement("li");
  li.textContent = value;

  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.onclick = () => {
    li.remove();
    saveLog("Удалена задача: " + value);
    saveTasks();
  };
  li.appendChild(btn);
  document.getElementById("taskList").appendChild(li);

  input.value = "";
  saveLog("Добавлена задача: " + value);
  saveTasks();
}

function saveTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => li.textContent.replace("❌", "").trim());
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem("tasks") || "[]");
  data.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task;

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      li.remove();
      saveLog("Удалена задача: " + task);
      saveTasks();
    };
    li.appendChild(btn);
    document.getElementById("taskList").appendChild(li);
  });
}

// ===== ⏰ Напоминания =====
function addReminder() {
  const time = document.getElementById("reminderTime").value;
  const text = document.getElementById("reminderText").value.trim();
  if (!time || !text) return;

  const reminder = { time, text };
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));

  renderReminders();
  scheduleReminder(reminder);
  saveLog("Добавлено напоминание: " + text);
  document.getElementById("reminderTime").value = "";
  document.getElementById("reminderText").value = "";
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  list.innerHTML = "";
  reminders.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${r.time} — ${r.text}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      reminders.splice(i, 1);
      localStorage.setItem("reminders", JSON.stringify(reminders));
      renderReminders();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function scheduleReminder(reminder) {
  const now = new Date();
  const [h, m] = reminder.time.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target < now) target.setDate(target.getDate() + 1);
  const delay = target - now;

  setTimeout(() => {
    alert("🔔 Напоминание: " + reminder.text);
    scheduleReminder(reminder); // повтор завтра
  }, delay);
}

function loadReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.forEach(scheduleReminder);
  renderReminders();
}

// ===== 👥 Окружение =====
function createPersonElement(name, status) {
  const li = document.createElement("li");
  li.innerHTML = `${name} — <span class="${status}">${status.toUpperCase()}</span>`;

  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.onclick = () => {
    li.remove();
    saveLog("Удалён человек: " + name);
    savePeople();
  };

  li.appendChild(btn);
  return li;
}

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  if (!name) return;

  const li = createPersonElement(name, status);
  document.getElementById("peopleList").appendChild(li);
  saveLog("Добавлен человек: " + name + " (" + status + ")");
  document.getElementById("personName").value = "";
  savePeople();
}

function savePeople() {
  const items = Array.from(document.querySelectorAll("#peopleList li")).map(li => li.innerHTML);
  localStorage.setItem("people", JSON.stringify(items));
}

function loadPeople() {
  const people = JSON.parse(localStorage.getItem("people") || "[]");
  people.forEach(p => {
    const temp = document.createElement("div");
    temp.innerHTML = p;
    const name = temp.textContent.split("—")[0].trim();
    const statusMatch = p.match(/class="(.*?)"/);
    const status = statusMatch ? statusMatch[1] : "yellow";
    const li = createPersonElement(name, status);
    document.getElementById("peopleList").appendChild(li);
  });
}

// ===== 🏋️ Физо =====
function addWorkout() {
  const type = document.getElementById("exercise").value.trim();
  const amount = document.getElementById("amount").value.trim();
  if (!type || !amount) return;

  const li = document.createElement("li");
  li.textContent = `🏃 ${type}: ${amount}`;

  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.onclick = () => {
    li.remove();
    saveLog(`Удалено: ${type} — ${amount}`);
    saveWorkouts();
    updateFitChart();
  };
  li.appendChild(btn);

  document.getElementById("fitLog").appendChild(li);
  saveLog(`Добавлено: ${type} — ${amount}`);
  saveWorkouts();
  updateFitChart();
}

function saveWorkouts() {
  const list = Array.from(document.querySelectorAll("#fitLog li")).map(li => li.textContent.replace("❌", "").trim());
  localStorage.setItem("fitLog", JSON.stringify(list));
}

function loadWorkouts() {
  const data = JSON.parse(localStorage.getItem("fitLog") || "[]");
  data.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      li.remove();
      saveLog(`Удалено: ${entry}`);
      saveWorkouts();
      updateFitChart();
    };
    li.appendChild(btn);

    document.getElementById("fitLog").appendChild(li);
  });
  updateFitChart();
}

function updateFitChart() {
  const dataMap = {};
  const items = Array.from(document.querySelectorAll("#fitLog li"));
  items.forEach(item => {
    const [type, value] = item.textContent.replace("🏃 ", "").split(":").map(s => s.trim());
    const num = parseFloat(value);
    if (!isNaN(num)) dataMap[type] = (dataMap[type] || 0) + num;
  });

  const ctx = document.getElementById("fitChart").getContext("2d");
  if (window.fitChart) window.fitChart.destroy();

  window.fitChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(dataMap),
      datasets: [{
        data: Object.values(dataMap),
        backgroundColor: "#0f0"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#0f0" }, grid: { color: "#333" } },
        y: { beginAtZero: true, ticks: { color: "#0f0" }, grid: { color: "#333" } }
      }
    }
  });
}

// ===== Архетип =====
const questions = [
  { q: "Как ты решаешь конфликты?", a: { Хищник: 2, Стратег: 1 } },
  { q: "Что важнее: результат или порядок?", a: { Стратег: 2, Исполнитель: 1 } },
  { q: "Ты молчишь или провоцируешь?", a: { Хищник: 1, Провокатор: 2 } },
  { q: "Ты больше слушаешь или говоришь?", a: { Оракул: 2, Провокатор: 1 } },
  { q: "Ты предпочитаешь действовать один?", a: { Хищник: 1, Стратег: 1, Исполнитель: 1 } }
];

let current = 0;
let score = { Хищник: 0, Стратег: 0, Провокатор: 0, Оракул: 0, Исполнитель: 0 };

function startTest() {
  current = 0;
  score = { Хищник: 0, Стратег: 0, Провокатор: 0, Оракул: 0, Исполнитель: 0 };
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  const quiz = document.getElementById("quiz");
  const result = document.getElementById("result");
  result.innerHTML = "";
  quiz.innerHTML = `<p>${q.q}</p>`;
  Object.entries(q.a).forEach(([type, val]) => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.onclick = () => {
      score[type] += val;
      current++;
      current >= questions.length ? showResult() : showQuestion();
    };
    quiz.appendChild(btn);
  });
}

function showResult() {
  const max = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
  const result = document.getElementById("result");
  result.innerHTML = `<h3>Ты — ${max}</h3><p>${describeArchetype(max)}</p>`;
  document.getElementById("quiz").innerHTML = "";
}

function describeArchetype(type) {
  switch (type) {
    case "Хищник": return "Опасный, молчаливый, прямой.";
    case "Стратег": return "Планирует, просчитывает, управляет.";
    case "Провокатор": return "Играет на слабостях, провоцирует хаос.";
    case "Оракул": return "Видит суть, действует из тени.";
    case "Исполнитель": return "Стабилен, не сбивается, завершает.";
    default: return "Неопределён.";
  }
}

// ===== Загрузка =====
window.addEventListener("DOMContentLoaded", () => {
  getRule();
  loadTasks();
  loadReminders();
  loadPeople();
  loadWorkouts();
  renderLog();
});