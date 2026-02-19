document.addEventListener("DOMContentLoaded", function() {

  // ===== Тёмная тема =====
  const themeToggle = document.getElementById("themeToggle");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀ Светлая тема";
  }

  themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "☀ Светлая тема";
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "🌙 Тёмная тема";
    }
  });

  // ===== Tips & Resources =====
  window.showTips = function() {
    const tips = document.getElementById('tips');
    const btn = document.querySelector('#instructions button');
    tips.classList.toggle('show');
    const cards = tips.querySelectorAll('.tip-card');

    cards.forEach((card, i) => {
      if (tips.classList.contains('show')) {
        setTimeout(() => card.classList.add('show'), i * 250);
      } else {
        card.classList.remove('show');
      }
    });

    btn.textContent = tips.classList.contains('show')
      ? 'Скрыть советы'
      : 'Показать советы';
  }

  window.toggleResources = function() {
    const list = document.getElementById('resourceList');
    const btn = document.querySelector('#resources button');
    list.classList.toggle('show');
    const cards = list.querySelectorAll('.resource-card');

    cards.forEach((card, i) => {
      if (list.classList.contains('show')) {
        setTimeout(() => card.classList.add('show'), i * 250);
      } else {
        card.classList.remove('show');
      }
    });

    btn.textContent = list.classList.contains('show')
      ? 'Скрыть ресурсы'
      : 'Показать ресурсы';
  }

  // ===== Reveal Sections =====
  function revealSections() {
    document.querySelectorAll('section').forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.85) {
        section.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', revealSections);
  revealSections();

  // ===== To-Do =====
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const taskCounter = document.getElementById("taskCounter");
  const progressBar = document.getElementById("progressBar");

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
      tasks.push({
        text: li.querySelector(".taskText").textContent,
        completed: li.classList.contains("completed"),
        deadline: li.dataset.deadline || null
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateProgress() {
    const total = taskList.querySelectorAll("li").length;
    const completed = taskList.querySelectorAll("li.completed").length;

    taskCounter.textContent = `Выполнено ${completed} из ${total}`;
    progressBar.style.width =
      total === 0 ? "0%" : (completed / total * 100) + "%";
  }

  function createTaskElement(text, completed, deadline) {
    const li = document.createElement("li");
    if (completed) li.classList.add("completed");
    if (deadline) li.dataset.deadline = deadline;

    const leftDiv = document.createElement("div");

    const span = document.createElement("span");
    span.className = "taskText";
    span.textContent = text;

    leftDiv.appendChild(span);

    if (deadline) {
      const dateSpan = document.createElement("div");
      dateSpan.className = "deadline";
      dateSpan.textContent = "До: " + deadline;

      const today = new Date().toISOString().split("T")[0];
      if (deadline < today) {
        dateSpan.classList.add("overdue");
      }

      leftDiv.appendChild(dateSpan);
    }

    li.appendChild(leftDiv);

    li.addEventListener("click", function() {
      li.classList.toggle("completed");
      saveTasks();
      updateProgress();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      li.remove();
      saveTasks();
      updateProgress();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(t => createTaskElement(t.text, t.completed, t.deadline));
    updateProgress();
  }

  function addTask() {
    const text = taskInput.value.trim();
    const deadline = deadlineInput.value;
    if (!text) return;

    createTaskElement(text, false, deadline);
    taskInput.value = "";
    deadlineInput.value = "";
    saveTasks();
    updateProgress();
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
  });

  loadTasks();
});
