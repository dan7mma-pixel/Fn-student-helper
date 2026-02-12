console.log("JS загружен");

document.addEventListener("DOMContentLoaded", function() {

  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const taskCounter = document.getElementById("taskCounter");
  const progressBar = document.getElementById("progressBar");
  const themeToggle = document.getElementById("themeToggle");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let currentFilter = "all";
  let celebrationShown = false;

  /* ===== ТЕМА ===== */

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (themeToggle) themeToggle.textContent = "☀️";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function() {
      document.body.classList.toggle("dark-theme");

      if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
      } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
      }
    });
  }

  /* ===== Сохранение ===== */

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
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
    li.draggable = true;
    if (completed) li.classList.add("completed");

    /* ===== DRAG ===== */

    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      saveTasks();
    });

    /* ===== ТЕКСТ ===== */

    const span = document.createElement("span");
    span.textContent = text;
    span.classList.add("task-text");

    /* ===== РЕДАКТИРОВАНИЕ ===== */

    span.addEventListener("dblclick", function (e) {
      e.stopPropagation();

      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = span.textContent;
      inputEdit.classList.add("edit-input");

      li.replaceChild(inputEdit, span);
      inputEdit.focus();
      inputEdit.select();

      function saveEdit() {
        const newValue = inputEdit.value.trim();
        if (newValue !== "") {
          span.textContent = newValue;
        }
        li.replaceChild(span, inputEdit);
        saveTasks();
      }

      function cancelEdit() {
        li.replaceChild(span, inputEdit);
      }

      inputEdit.addEventListener("keydown", function (e) {
        if (e.key === "Enter") saveEdit();
        if (e.key === "Escape") cancelEdit();
      });

      inputEdit.addEventListener("blur", saveEdit);
    });

    li.appendChild(span);
    li.classList.add("task-appear");

    /* ===== КЛИК — ВЫПОЛНЕНО ===== */

    li.addEventListener("click", function() {
      li.classList.toggle("completed");
      updateProgress();
      saveTasks();
    });

    /* ===== КНОПКИ СОРТИРОВКИ ===== */

    const upBtn = document.createElement("button");
    upBtn.textContent = "↑";
    upBtn.classList.add("move-btn");

    upBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      const prev = li.previousElementSibling;
      if (prev) {
        taskList.insertBefore(li, prev);
        saveTasks();
      }
    });

    const downBtn = document.createElement("button");
    downBtn.textContent = "↓";
    downBtn.classList.add("move-btn");

    downBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      const next = li.nextElementSibling;
      if (next) {
        taskList.insertBefore(next, li);
        saveTasks();
      }
    });

    /* ===== УДАЛЕНИЕ ===== */

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

    /* ===== ДОБАВЛЯЕМ В ЭЛЕМЕНТ ===== */

    li.appendChild(upBtn);
    li.appendChild(downBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  }

  /* ===== DRAG LOGIC ===== */

  taskList.addEventListener("dragover", function (e) {
    e.preventDefault();

    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(taskList, e.clientY);

    if (!dragging) return;

    if (afterElement == null) {
      taskList.appendChild(dragging);
    } else {
      taskList.insertBefore(dragging, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  /* ===== Добавление ===== */

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
    const tasks = taskList.querySelectorAll("li");
    const completed = taskList.querySelectorAll("li.completed");

    const total = tasks.length;
    const done = completed.length;

    taskCounter.textContent = `Задач выполнено: ${done} / ${total}`;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    progressBar.style.width = percent + "%";

    if (percent === 100 && total > 0) {
      progressBar.style.background = "linear-gradient(90deg, #00ff9d, #00c853)";
    } 
    else if (percent >= 70) {
      progressBar.style.background = "linear-gradient(90deg, #00f5ff, #0072ff)";
    } 
    else if (percent >= 30) {
      progressBar.style.background = "linear-gradient(90deg, #ffd200, #ff9800)";
    } 
    else {
      progressBar.style.background = "linear-gradient(90deg, #ff4d4d, #ff0000)";
    }

    if (total > 0 && done === total && !celebrationShown) {
      launchCelebration();
      celebrationShown = true;
    }

    if (done !== total) {
      celebrationShown = false;
    }

    applyFilter();
  }

  /* ===== Фильтр ===== */

  function applyFilter() {
    const tasks = taskList.querySelectorAll("li");

    tasks.forEach(task => {
      const isCompleted = task.classList.contains("completed");

      if (currentFilter === "all") {
        task.style.display = "flex";
      } 
      else if (currentFilter === "active") {
        task.style.display = isCompleted ? "none" : "flex";
      } 
      else if (currentFilter === "completed") {
        task.style.display = isCompleted ? "flex" : "none";
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", function() {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      applyFilter();
    });
  });

  /* ===== События ===== */

  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });

  /* ===== Праздник ===== */

  function launchCelebration() {
    const celebration = document.createElement("div");
    celebration.classList.add("celebration");
    celebration.textContent = "🎉 Все задачи выполнены! Отличная работа!";

    document.body.appendChild(celebration);

    setTimeout(() => {
      celebration.classList.add("celebration-hide");
    }, 1800);

    setTimeout(() => {
      celebration.remove();
    }, 2500);
  }

  loadTasks();
});
