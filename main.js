// 📁 Файл: main.js — Основная логика, сохраняет всё корректно

// 📜 Правила дня const rules = [ "Не оправдывайся — объяснение без запроса — слабость.", "Если не приносит ресурс — отсекай.", "Хищник молчит чаще, чем говорит.", "Контроль над собой — контроль над всем.", "Каждое взаимодействие — война за интересы.", "Грубость — фильтр. Кто слаб — отпадёт сам.", "Сначала доминируй, потом дружи.", "Если не давят на тебя — дави ты.", "Ложь — инструмент, не слабость.", "Правильное ≠ выгодное. Выбирай выгоду." ];

function getRule() { const index = Math.floor(Math.random() * rules.length); document.getElementById("rule").textContent = rules[index]; }

// 📋 План на день function addTask() { const input = document.getElementById("taskInput"); const value = input.value.trim(); if (value) { const li = document.createElement("li"); li.textContent = "🔹 " + value; li.onclick = () => { li.classList.toggle("done"); saveTasks(); }; document.getElementById("taskList").appendChild(li); input.value = ""; saveTasks(); } }

function saveTasks() { const tasks = Array.from(document.querySelectorAll("#taskList li")) .map(li => ({ text: li.textContent, done: li.classList.contains("done") })); localStorage.setItem("tasks", JSON.stringify(tasks)); }

function loadTasks() { const raw = localStorage.getItem("tasks"); if (!raw) return; const tasks = JSON.parse(raw); tasks.forEach(t => { const li = document.createElement("li"); li.textContent = t.text; if (t.done) li.classList.add("done"); li.onclick = () => { li.classList.toggle("done"); saveTasks(); }; document.getElementById("taskList").appendChild(li); }); }

// 👥 Окружение function createPersonElement(name, status) { const li = document.createElement("li"); li.innerHTML = ${name} — <span class="${status}">${status.toUpperCase()}</span>; const btn = document.createElement("button"); btn.textContent = "❌"; btn.style.marginLeft = "10px"; btn.onclick = () => { li.remove(); updatePeopleStorage(); }; li.appendChild(btn); return li; }

function addPerson() { const name = document.getElementById("personName").value.trim(); const status = document.getElementById("personStatus").value; if (!name) return; const li = createPersonElement(name, status); document.getElementById("peopleList").appendChild(li); document.getElementById("personName").value = ""; updatePeopleStorage(); }

function updatePeopleStorage() { const people = Array.from(document.querySelectorAll("#peopleList li")) .map(li => li.innerHTML); localStorage.setItem("people", JSON.stringify(people)); }

function loadPeople() { const saved = localStorage.getItem("people"); if (!saved) return; const people = JSON.parse(saved); people.forEach(p => { const temp = document.createElement("div"); temp.innerHTML = p; const name = temp.textContent.split("—")[0].trim(); const statusMatch = p.match(/class="(.*?)"/); const status = statusMatch ? statusMatch[1] : "yellow"; const li = createPersonElement(name, status); document.getElementById("peopleList").appendChild(li); }); }

// Инициализация window.addEventListener("DOMContentLoaded", () => { getRule(); loadTasks(); loadPeople(); });

