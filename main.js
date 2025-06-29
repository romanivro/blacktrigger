// Файл: main.js — Сборка со всеми актуальными фиксами и улучшениями

// 📜 Правила дня const rules = [ "Не оправдывайся — объяснение без запроса — слабость.", "Если не приносит ресурс — отсекай.", "Хищник молчит чаще, чем говорит.", "Контроль над собой — контроль над всем.", "Каждое взаимодействие — война за интересы.", "Грубость — фильтр. Кто слаб — отпадёт сам.", "Сначала доминируй, потом дружи.", "Если не давят на тебя — дави ты.", "Ложь — инструмент, не слабость.", "Правильное ≠ выгодное. Выбирай выгоду." ];

function getRule() { const index = Math.floor(Math.random() * rules.length); document.getElementById("rule").textContent = rules[index]; }

// 🧠 Лог function saveLog(entry) { const now = new Date().toLocaleString(); const logs = JSON.parse(localStorage.getItem("activityLog") || "[]"); logs.push({ time: now, entry }); localStorage.setItem("activityLog", JSON.stringify(logs)); }

// 📋 План на день function addTask() { const input = document.getElementById("taskInput"); const value = input.value.trim(); if (value) { const li = document.createElement("li"); li.textContent = "🔹 " + value; li.onclick = () => { li.classList.toggle("done"); saveTasks(); }; document.getElementById("taskList").appendChild(li); input.value = ""; saveTasks(); saveLog("Задача добавлена: " + value); } }

function saveTasks() { const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => ({ text: li.textContent, done: li.classList.contains("done") })); localStorage.setItem("tasks", JSON.stringify(tasks)); }

function loadTasks() { const data = JSON.parse(localStorage.getItem("tasks") || "[]"); data.forEach(task => { const li = document.createElement("li"); li.textContent = task.text; if (task.done) li.classList.add("done"); li.onclick = () => { li.classList.toggle("done"); saveTasks(); }; document.getElementById("taskList").appendChild(li); }); }

// ⏰ Напоминания function addReminder() { const time = document.getElementById("reminderTime").value; const text = document.getElementById("reminderText").value.trim(); if (!time || !text) return;

const reminders = JSON.parse(localStorage.getItem("reminders") || "[]"); reminders.push({ time, text }); localStorage.setItem("reminders", JSON.stringify(reminders)); renderReminders(); document.getElementById("reminderTime").value = ""; document.getElementById("reminderText").value = ""; saveLog("Добавлено напоминание: " + time + " — " + text); }

function renderReminders() { const list = document.getElementById("reminderList"); list.innerHTML = ""; const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");

reminders.forEach((r, i) => { const li = document.createElement("li"); li.textContent = ${r.time} — ${r.text}; const btn = document.createElement("button"); btn.textContent = "❌"; btn.onclick = () => { reminders.splice(i, 1); localStorage.setItem("reminders", JSON.stringify(reminders)); renderReminders(); }; li.appendChild(btn); list.appendChild(li); }); }

// 👥 Окружение function createPersonElement(name, status) { const li = document.createElement("li"); li.innerHTML = ${name} — <span class="${status}">${status.toUpperCase()}</span>; const btn = document.createElement("button"); btn.textContent = "❌"; btn.style.marginLeft = "10px"; btn.onclick = () => { li.remove(); saveLog("Удалён человек: " + name); updatePeopleStorage(); }; li.appendChild(btn); return li; }

function addPerson() { const name = document.getElementById("personName").value.trim(); const status = document.getElementById("personStatus").value; if (name) { const li = createPersonElement(name, status); document.getElementById("peopleList").appendChild(li); document.getElementById("personName").value = ""; saveLog("Добавлен человек: " + name + " (" + status + ")"); updatePeopleStorage(); } }

function updatePeopleStorage() { const items = Array.from(document.querySelectorAll("#peopleList li")).map(li => li.innerHTML); localStorage.setItem("people", JSON.stringify(items)); }

function loadPeople() { const stored = JSON.parse(localStorage.getItem("people") || "[]"); document.getElementById("peopleList").innerHTML = ""; stored.forEach(p => { const temp = document.createElement("div"); temp.innerHTML = p; const name = temp.textContent.split("—")[0].trim(); const statusMatch = p.match(/class="(.*?)"/); const status = statusMatch ? statusMatch[1] : "yellow"; const li = createPersonElement(name, status); document.getElementById("peopleList").appendChild(li); }); }

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("✅ Service Worker зарегистрирован"))
    .catch(err => console.error("❌ Service Worker ошибка:", err));
}

// 🔁 Инициализация при загрузке window.addEventListener("DOMContentLoaded", () => { getRule(); loadTasks(); loadPeople(); renderReminders(); });

