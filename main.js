// 📜 Правила дня
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

// 📋 План на день
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (value) {
    const li = document.createElement("li");
    li.textContent = "🔹 " + value;
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveLog("Задача добавлена: " + value);
    saveTasks();
  }
}

function saveTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => li.textContent);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) {
    JSON.parse(data).forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      document.getElementById("taskList").appendChild(li);
    });
  }
}

// ⏰ Напоминания
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
  saveLog("Добавлено напоминание: " + time + " — " + text);
  document.getElementById("reminderTime").value = "";
  document.getElementById("reminderText").value = "";
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
    scheduleReminder(reminder);
  }, delay);
}

function loadReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.forEach(scheduleReminder);
  renderReminders();
}

// 👥 Окружение
function createPersonElement(name, status, tags = []) {
  const li = document.createElement("li");
  li.innerHTML = `${name} — <span class="${status}">${status.toUpperCase()}</span>`;

  const meta = document.createElement("small");
  if (tags.length > 0) {
    meta.textContent = " | " + tags.join(", ");
    li.appendChild(meta);
  }

  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.style.marginLeft = "10px";
  btn.onclick = () => {
    li.remove();
    saveLog("Удалён человек: " + name);
    updatePeopleStorage();
  };

  li.appendChild(btn);
  return li;
}

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  const tags = [];
  if (document.getElementById("tagResource").checked) tags.push("💰 Ресурс");
  if (document.getElementById("tagBallast").checked) tags.push("🪨 Балласт");
  if (document.getElementById("tagWeak").checked) tags.push("🧠 Слабый");
  if (document.getElementById("tagReligious").checked) tags.push("✝️ Религиозный");
  if (document.getElementById("tagSmart").checked) tags.push("🧠 Умный");
  if (document.getElementById("tagTricky").checked) tags.push("🦊 Хитрый");

  if (name) {
    const li = createPersonElement(name, status, tags);
    document.getElementById("peopleList").appendChild(li);
    document.getElementById("personName").value = "";
    saveLog("Добавлен человек: " + name + " (" + status + ")");
    updatePeopleStorage();
  }
}

function updatePeopleStorage() {
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

    const tags = [];
    if (p.includes("💰")) tags.push("💰 Ресурс");
    if (p.includes("🪨")) tags.push("🪨 Балласт");
    if (p.includes("🧠 Слабый")) tags.push("🧠 Слабый");
    if (p.includes("✝️")) tags.push("✝️ Религиозный");
    if (p.includes("🧠 Умный")) tags.push("🧠 Умный");
    if (p.includes("🦊")) tags.push("🦊 Хитрый");

    const li = createPersonElement(name, status, tags);
    document.getElementById("peopleList").appendChild(li);
  });
}

// 💰 Финансы
let totalIncome = 0;
let totalExpense = 0;

function addFinance() {
  const income = parseFloat(document.getElementById("income").value) || 0;
  const expense = parseFloat(document.getElementById("expense").value) || 0;

  totalIncome += income;
  totalExpense += expense;

  const balance = totalIncome - totalExpense;
  const percent = totalExpense === 0 ? 100 : Math.round((totalIncome / totalExpense) * 100);

  document.getElementById("financeStats").innerHTML = `
    💵 Доход: ${totalIncome} <br>
    💸 Расход: ${totalExpense} <br>
    📊 Баланс: <span style="color:${balance >= 0 ? '#0f0' : '#f00'}">${balance}</span><br>
    ⚖️ Доход/Расход: <span style="color:${
      percent > 100 ? '#0f0' : percent < 100 ? '#f00' : '#ff0'
    }">${percent}%</span>
  `;

  saveLog(`Финансы обновлены: +${income}, -${expense}`);
  document.getElementById("income").value = "";
  document.getElementById("expense").value = "";
  saveFinance();
}

function saveFinance() {
  localStorage.setItem("finance", JSON.stringify({ income: totalIncome, expense: totalExpense }));
}

function loadFinance() {
  const data = localStorage.getItem("finance");
  if (data) {
    const { income, expense } = JSON.parse(data);
    totalIncome = income;
    totalExpense = expense;
    addFinance(); // перерисовать
  }
}

// 🏋️ Физо
function addWorkout() {
  const exercise = document.getElementById("exercise").value.trim();
  const amount = document.getElementById("amount").value.trim();

  if (exercise && amount) {
    const li = document.createElement("li");
    li.textContent = `🏃 ${exercise}: ${amount}`;
    const del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => {
      li.remove();
      saveLog("Удалено упражнение: " + li.textContent);
      saveWorkouts();
      updateFitChart();
    };
    li.appendChild(del);
    document.getElementById("fitLog").appendChild(li);
    saveLog(`Физо: ${exercise} — ${amount}`);
    document.getElementById("exercise").value = "";
    document.getElementById("amount").value = "";
    saveWorkouts();
    updateFitChart();
  }
}

function saveWorkouts() {
  const entries = Array.from(document.querySelectorAll("#fitLog li")).map(li => li.textContent.replace("❌", "").trim());
  localStorage.setItem("fitLog", JSON.stringify(entries));
}

function loadWorkouts() {
  const data = localStorage.getItem("fitLog");
  if (data) {
    const entries = JSON.parse(data);
    entries.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = entry;
      const btn = document.createElement("button");
      btn.textContent = "❌";
      btn.onclick = () => {
        li.remove();
        saveWorkouts();
        updateFitChart();
      };
      li.appendChild(btn);
      document.getElementById("fitLog").appendChild(li);
    });
  }
  updateFitChart();
}

// 🧠 Архетип
const testQuestions = [
  {
    q: "Как ты решаешь конфликты?",
    a: { Хищник: 2, Стратег: 1 }
  },
  {
    q: "Что важнее: результат или порядок?",
    a: { Стратег: 2, Исполнитель: 1 }
  },
  {
    q: "Ты молчишь или провоцируешь?",
    a: { Хищник: 1, Провокатор: 2 }
  },
  {
    q: "Ты больше слушаешь или говоришь?",
    a: { Оракул: 2, Провокатор: 1 }
  },
  {
    q: "Ты предпочитаешь действовать один?",
    a: { Хищник: 1, Стратег: 1, Исполнитель: 1 }
  }
];

let currentQuestion = 0;
let archetypeScores = {
  Хищник: 0,
  Стратег: 0,
  Провокатор: 0,
  Оракул: 0,
  Исполнитель: 0
};

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
    case "Хищник":
      return "Атакуй первым. Ты — сила. Совет: не вступай в объяснения, используй давление, избегай подчинения.";
    case "Стратег":
      return "Ты — мозг игры. Совет: строй схемы, управляй чужими руками, не трать себя лично.";
    case "Провокатор":
      return "Ты — катализатор хаоса. Совет: не бери на себя, бросай искру и отступай.";
    case "Оракул":
      return "Ты — знание. Совет: молчи больше, чем говори. Пусть другие строят догадки.";
    case "Исполнитель":
      return "Ты — система. Совет: окружай себя архитекторами, а сам будь незыблем.";
    default:
      return "Наблюдатель вне архетипов.";
  }
}

// 🗺️ Карта стратегии
function addGoal() {
  const text = document.getElementById("goalInput").value.trim();
  const type = document.getElementById("goalType").value;
  if (!text) return;

  const li = document.createElement("li");
  li.textContent = `🎯 ${text} [${type}]`;
  li.setAttribute("data-status", "plan");
  li.onclick = () => cycleGoalStatus(li);

  const del = document.createElement("button");
  del.textContent = "❌";
  del.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    saveStrategy();
    saveLog("Цель удалена: " + text);
  };

  li.appendChild(del);
  document.getElementById("strategyList").appendChild(li);
  saveLog("Добавлена цель: " + text + " [" + type + "]");
  document.getElementById("goalInput").value = "";
  saveStrategy();
}

function cycleGoalStatus(li) {
  const statuses = ["plan", "process", "done", "fail"];
  let current = li.getAttribute("data-status") || "plan";
  let index = statuses.indexOf(current);
  let next = statuses[(index + 1) % statuses.length];
  li.setAttribute("data-status", next);
  li.style.opacity = next === "fail" ? 0.5 : 1;
  li.style.textDecoration = next === "done" ? "line-through" : "none";
  saveLog(`Цель обновлена: ${li.textContent} → ${next}`);
  saveStrategy();
}

function saveStrategy() {
  localStorage.setItem("strategy", document.getElementById("strategyList").innerHTML);
}

function loadStrategy() {
  const data = localStorage.getItem("strategy");
  if (data) document.getElementById("strategyList").innerHTML = data;
}

// 📚 Лог действий
function toggleLog() {
  const list = document.getElementById("logList");
  list.style.display = list.style.display === "none" ? "block" : "none";
  renderLog();
  updateActivityChart();
}

function renderLog() {
  const logList = document.getElementById("logList");
  logList.innerHTML = "";
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]").reverse();
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
      datasets: [{
        label: "Активность (действий в день)",
        data: values,
        fill: false,
        borderColor: "#0f0",
        tension: 0.2
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, ticks: { color: "#0f0" }, grid: { color: "#333" } },
        x: { ticks: { color: "#0f0" }, grid: { color: "#333" } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("✅ Service Worker зарегистрирован"))
    .catch(err => console.error("Service Worker ошибка:", err));
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("✅ Service Worker активирован"))
    .catch(err => console.error("Ошибка SW:", err));
}

// 🔁 Старт
window.addEventListener("DOMContentLoaded", () => {
  getRule();
  loadTasks();
  loadPeople();
  loadWorkouts();
  loadFinance();
  loadReminders();
  loadStrategy();
});