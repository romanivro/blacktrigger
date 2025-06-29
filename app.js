// === 📜 Правило дня ===
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

// === 🧠 Лог ===
function saveLog(entry) {
  const now = new Date().toLocaleString();
  const log = JSON.parse(localStorage.getItem("log") || "[]");
  log.push({ time: now, entry });
  localStorage.setItem("log", JSON.stringify(log));
  renderLog();
}

function renderLog() {
  const logList = document.getElementById("logList");
  if (!logList) return;
  logList.innerHTML = "";
  const log = JSON.parse(localStorage.getItem("log") || "[]").reverse();
  log.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.time} — ${item.entry}`;
    logList.appendChild(li);
  });
}

function toggleLog() {
  const log = document.getElementById("logList");
  if (log.style.display === "none") {
    log.style.display = "block";
    renderLog();
  } else {
    log.style.display = "none";
  }
}

// === 📋 Задачи ===
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (value) {
    const li = document.createElement("li");
    li.textContent = "🔹 " + value;
    li.onclick = () => {
      li.remove();
      saveTaskStorage();
    };
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveLog("Задача добавлена: " + value);
    saveTaskStorage();
  }
}

function saveTaskStorage() {
  const items = Array.from(document.querySelectorAll("#taskList li")).map(li => li.textContent);
  localStorage.setItem("tasks", JSON.stringify(items));
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem("tasks") || "[]");
  data.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    li.onclick = () => {
      li.remove();
      saveTaskStorage();
    };
    document.getElementById("taskList").appendChild(li);
  });
}

// === ⏰ Напоминания ===
function addReminder() {
  const time = document.getElementById("reminderTime").value;
  const text = document.getElementById("reminderText").value.trim();
  if (!time || !text) return;

  const reminder = { time, text };
  const list = JSON.parse(localStorage.getItem("reminders") || "[]");
  list.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(list));
  renderReminders();
  scheduleReminder(reminder);
  saveLog("Добавлено напоминание: " + time + " — " + text);
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  list.innerHTML = "";
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
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
  const [hour, minute] = reminder.time.split(":").map(Number);
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(now.getDate() + 1);
  const delay = target - now;

  setTimeout(() => {
    alert("🔔 Напоминание: " + reminder.text);
    scheduleReminder(reminder); // повтор
  }, delay);
}

function loadReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.forEach(scheduleReminder);
  renderReminders();
}

// === 👥 Окружение ===
function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  if (!name) return;

  const li = document.createElement("li");
  li.innerHTML = `${name} — <span class="${status}">${status.toUpperCase()}</span>`;
  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.style.marginLeft = "10px";
  btn.onclick = () => {
    li.remove();
    updatePeopleStorage();
    saveLog("Удалён: " + name);
  };
  li.appendChild(btn);

  document.getElementById("peopleList").appendChild(li);
  document.getElementById("personName").value = "";
  updatePeopleStorage();
  saveLog("Добавлен: " + name + " (" + status + ")");
}

function updatePeopleStorage() {
  const items = Array.from(document.querySelectorAll("#peopleList li")).map(li => li.innerHTML);
  localStorage.setItem("people", JSON.stringify(items));
}

function loadPeople() {
  const data = JSON.parse(localStorage.getItem("people") || "[]");
  data.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = p;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.style.marginLeft = "10px";
    btn.onclick = () => {
      li.remove();
      updatePeopleStorage();
    };
    li.appendChild(btn);
    document.getElementById("peopleList").appendChild(li);
  });
}

// === 🧠 Архетип ===
const testQuestions = [
  { q: "Как ты решаешь конфликты?", a: { Хищник: 2, Стратег: 1 } },
  { q: "Что важнее: результат или порядок?", a: { Стратег: 2, Исполнитель: 1 } },
  { q: "Ты молчишь или провоцируешь?", a: { Хищник: 1, Провокатор: 2 } },
  { q: "Ты больше слушаешь или говоришь?", a: { Оракул: 2, Провокатор: 1 } },
  { q: "Ты предпочитаешь действовать один?", a: { Хищник: 1, Стратег: 1, Исполнитель: 1 } }
];

let currentQuestion = 0;
let archetypeScores = {};

function startTest() {
  currentQuestion = 0;
  archetypeScores = { Хищник: 0, Стратег: 0, Провокатор: 0, Оракул: 0, Исполнитель: 0 };
  showQuestion();
}

function showQuestion() {
  const quiz = document.getElementById("quiz");
  const result = document.getElementById("result");
  result.innerHTML = "";

  if (currentQuestion >= testQuestions.length) return showResult();

  const q = testQuestions[currentQuestion];
  quiz.innerHTML = `<p>${q.q}</p>`;
  Object.entries(q.a).forEach(([type, score]) => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.onclick = () => {
      archetypeScores[type] += score;
      currentQuestion++;
      showQuestion();
    };
    quiz.appendChild(btn);
  });
}

function showResult() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";
  const max = Object.entries(archetypeScores).sort((a, b) => b[1] - a[1])[0];
  const result = document.getElementById("result");
  result.innerHTML = `<h3>Ты — ${max[0]}</h3><p>${describeArchetype(max[0])}</p>`;
}

function describeArchetype(type) {
  switch (type) {
    case "Хищник": return "Атакующий, решительный, опасный. Действует быстро, редко объясняет.";
    case "Стратег": return "Планирует, просчитывает, управляет на дистанции. Не тратит себя.";
    case "Провокатор": return "Взрывает эмоции, вбрасывает хаос, влияет на динамику окружения.";
    case "Оракул": return "Видит глубже. Управляет знанием. Молчит и наблюдает.";
    case "Исполнитель": return "Стабильный, выносливый, результативный. Делает без лишнего шума.";
    default: return "Наблюдатель вне архетипов.";
  }
}

// === ИНИЦИАЛИЗАЦИЯ ===
window.addEventListener("DOMContentLoaded", () => {
  getRule();
  loadTasks();
  loadPeople();
  loadReminders();
});