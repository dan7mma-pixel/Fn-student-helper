document.addEventListener("DOMContentLoaded", function () {

  // ===== ТЁМНАЯ ТЕМА =====
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {

    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      themeToggle.textContent = "☀ Светлая тема";
    }

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark");

      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀ Светлая тема";
      } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Тёмная тема";
      }
    });
  }

  // ===== TO DO =====
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
        deadline: li.dataset.deadline || ""
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

  function createTask(text, completed, deadline) {
    const li = document.createElement("li");

    if (completed) li.classList.add("completed");
    if (deadline) li.dataset.deadline = deadline;

    const textSpan = document.createElement("span");
    textSpan.className = "taskText";
    textSpan.textContent = text;

    li.appendChild(textSpan);

    if (deadline) {
      const dateDiv = document.createElement("div");
      dateDiv.className = "deadline";
      dateDiv.textContent = "До: " + deadline;
      li.appendChild(dateDiv);
    }

    li.addEventListener("click", function () {
      li.classList.toggle("completed");
      saveTasks();
      updateProgress();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", function (e) {
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
    tasks.forEach(task => {
      createTask(task.text, task.completed, task.deadline);
    });
    updateProgress();
  }

  function addTask() {
    const text = taskInput.value.trim();
    const deadline = deadlineInput ? deadlineInput.value : "";

    if (!text) return;

    createTask(text, false, deadline);

    taskInput.value = "";
    if (deadlineInput) deadlineInput.value = "";

    saveTasks();
    updateProgress();
  }

  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", addTask);
  }

  if (taskInput) {
    taskInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addTask();
      }
    });
  }

  loadTasks();

});
