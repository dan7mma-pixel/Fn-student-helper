document.addEventListener("DOMContentLoaded", function () {

  // ===== Tips & Resources =====
  const tipsBtn = document.getElementById("tipsBtn");
  const resourcesBtn = document.getElementById("resourcesBtn");

  tipsBtn.addEventListener("click", () => {
    document.getElementById("tips").classList.toggle("show");
  });

  resourcesBtn.addEventListener("click", () => {
    document.getElementById("resourceList").classList.toggle("show");
  });

  // ===== Reveal Sections =====
  function revealSections() {
    document.querySelectorAll("section").forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.85) {
        section.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", revealSections);
  revealSections();

  // ===== To-Do =====
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const taskCounter = document.getElementById("taskCounter");
  const progressBar = document.getElementById("progressBar");

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
      tasks.push({
        text: li.querySelector(".taskText").textContent,
        completed: li.classList.contains("completed")
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateProgress() {
    const tasks = taskList.querySelectorAll("li");
    const total = tasks.length;
    const completed = taskList.querySelectorAll("li.completed").length;

    taskCounter.textContent = `Выполнено ${completed} из ${total}`;
    progressBar.style.width = total === 0 ? "0%" : (completed / total * 100) + "%";
  }

  function createTaskElement(text, completed) {
    const li = document.createElement("li");
    if (completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.className = "taskText";
    span.textContent = text;

    li.appendChild(span);

    li.addEventListener("click", () => {
      li.classList.toggle("completed");
      saveTasks();
      updateProgress();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", e => {
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
    tasks.forEach(t => createTaskElement(t.text, t.completed));
    updateProgress();
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    createTaskElement(text, false);
    taskInput.value = "";
    saveTasks();
    updateProgress();
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
  });

  loadTasks();

  // ===== Calendar =====
  const monthYear = document.getElementById("monthYear");
  const calendarBody = document.querySelector("#calendarTable tbody");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  let currentDate = new Date();

  function renderCalendar(date) {
    calendarBody.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    monthYear.textContent = date.toLocaleString("ru-RU", {
      month: "long",
      year: "numeric"
    });

    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    let row = document.createElement("tr");

    for (let i = 0; i < startDay; i++) {
      row.appendChild(document.createElement("td"));
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      if (row.children.length === 7) {
        calendarBody.appendChild(row);
        row = document.createElement("tr");
      }

      const cell = document.createElement("td");
      cell.textContent = day;

      const today = new Date();
      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        cell.style.backgroundColor = "#4a90e2";
        cell.style.color = "white";
        cell.style.borderRadius = "6px";
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);

});
