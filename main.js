// main.js — полная логика боевого штаба

// === ПРАВИЛО ДНЯ === const rules = [ "Не оправдывайся — объяснение без запроса — слабость.", "Если не приносит ресурс — отсекай.", "Хищник молчит чаще, чем говорит.", "Контроль над собой — контроль над всем.", "Каждое взаимодействие — война за интересы.", "Грубость — фильтр. Кто слаб — отпадёт сам.", "Сначала доминируй, потом дружи.", "Если не давят на тебя — дави ты.", "Ложь — инструмент, не слабость.", "Правильное \u2260 выгодное. Выбирай выгоду." ];

function getRule() { const index = Math.floor(Math.random() * rules.length); document.getElementById("rule").textContent = rules[index]; saveLog("Новое правило дня: " + rules[index]); }

// === ХРАНИЛИЩЕ === function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

function load(key, fallback = []) { const data = localStorage.getItem(key); return data ? JSON.parse(data) : fallback; }

// === ЛОГ === function saveLog(entry) { const now = new Date().toLocaleString(); const log = load("activityLog"); log.push(${now} — ${entry}); save("activityLog", log); renderLog(); }

function renderLog() { const logList = document.getElementById("logList"); if (!logList) return; const log = load("activityLog").slice(-50).reverse(); logList.innerHTML = ""; log.forEach(item => { const li = document.createElement("li"); li.textContent = item; logList.appendChild(li); }); }

function toggleLog() { const el = document.getElementById("logList"); if (el.style.display === "none") { el.style.display = "block"; renderLog(); } else { el.style.display = "none"; } }

// === ПЛАН === function addTask() { const input = document.getElementById("taskInput"); const value = input.value.trim(); if (!value) return; const tasks = load("tasks"); tasks.push({ text: value, done: false }); save("tasks", tasks); input.value = ""; renderTasks(); saveLog("Добавлена задача: " + value); }

function toggleTask(index) { const tasks = load("tasks"); tasks[index].done = !tasks[index].done; save("tasks", tasks); renderTasks(); saveLog(Задача ${tasks[index].done ? "выполнена" : "отмечена активной"}: ${tasks[index].text}); }

function renderTasks() { const list = document.getElementById("taskList"); const tasks = load("tasks"); list.innerHTML = ""; tasks.forEach((t, i) => { const li = document.createElement("li"); li.textContent = (t.done ? "✅ " : "🔹 ") + t.text; li.style.textDecoration = t.done ? "line-through" : "none"; li.onclick = () => toggleTask(i); list.appendChild(li); }); }

// === НАПОМИНАНИЯ === function addReminder() { const time = document.getElementById("reminderTime").value; const text = document.getElementById("reminderText").value.trim(); if (!time || !text) return; const reminders = load("reminders"); reminders.push({ time, text }); save("reminders", reminders); renderReminders(); saveLog("Добавлено напоминание: " + text); }

function renderReminders() { const list = document.getElementById("reminderList"); const reminders = load("reminders"); list.innerHTML = ""; reminders.forEach((r, i) => { const li = document.createElement("li"); li.textContent = ${r.time} — ${r.text}; const btn = document.createElement("button"); btn.textContent = "❌"; btn.onclick = () => { reminders.splice(i, 1); save("reminders", reminders); renderReminders(); }; li.appendChild(btn); list.appendChild(li); }); }

function scheduleReminders() { const reminders = load("reminders"); reminders.forEach(r => { const [h, m] = r.time.split(":".map(Number)); const now = new Date(); const target = new Date(); target.setHours(h, m, 0, 0); if (target <= now) target.setDate(now.getDate() + 1); setTimeout(() => { alert("🔔 Напоминание: " + r.text); }, target - now); }); }

// Пример: ФИЗО, ОКРУЖЕНИЕ, СТРАТЕГИЯ, АРХЕТИП, СОСТОЯНИЕ будут в следующих частях

// === ИНИЦИАЛИЗАЦИЯ === window.addEventListener("DOMContentLoaded", () => { getRule(); renderTasks(); renderReminders(); renderLog(); scheduleReminders(); });

