const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const progressBar = document.getElementById("progressBar");

/* ===== Сохранение ===== */
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ===== Загрузка ===== */
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTask(task.text, task.completed));
  updateProgress();
}

/* ===== Создание задачи ===== */
function createTask(text, completed = false) {
  const li = document.createElement("li");

  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = text;
  span.classList.add("task-text");

  li.appendChild(span);

  // Анимация появления
  li.classList.add("task-appear");

  // Клик = выполнение
  li.addEventListener("click", function() {
    li.classList.toggle("completed");
    updateProgress();
    saveTasks();
  });

  // Кнопка удаления
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    li.classList.add("task-remove");
    setTimeout(() => {
      li.remove();
      updateProgress();
      saveTasks();
    }, 300);
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

/* ===== Добавление задачи ===== */
function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  createTask(taskText);
  taskInput.value = "";
  updateProgress();
  saveTasks();
}

/* ===== Прогресс ===== */
function updateProgress() {
  const tasks = document.querySelectorAll("#taskList li");
  const completed = document.querySelectorAll("#taskList li.completed");

  const total = tasks.length;
  const done = completed.length;

  taskCounter.textContent = `Задач выполнено: ${done} / ${total}`;

  const percent = total === 0 ? 0 : (done / total) * 100;
  progressBar.style.width = percent + "%";
}

/* ===== События ===== */
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keyup", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

/* ===== Инициализация ===== */
loadTasks();
