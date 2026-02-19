console.log("JS загружен");

const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getDeadlineStatus(dateString) {
  if (!dateString) return null;

  const today = new Date();
  today.setHours(0,0,0,0);

  const deadline = new Date(dateString);
  deadline.setHours(0,0,0,0);

  if (deadline < today) return "overdue";
  if (deadline.getTime() === today.getTime()) return "today";
  return "future";
}

function createTaskElement(task, index) {
  const li = document.createElement("li");
  li.draggable = true;

  if (task.completed) li.classList.add("completed");

  const textSpan = document.createElement("span");
  textSpan.textContent = task.text;

  if (task.deadline) {
    const deadlineSpan = document.createElement("span");
    deadlineSpan.classList.add("deadline");

    const status = getDeadlineStatus(task.deadline);
    if (status) deadlineSpan.classList.add(status);

    deadlineSpan.textContent = ` (${task.deadline})`;
    textSpan.appendChild(deadlineSpan);
  }

  li.appendChild(textSpan);

  // toggle complete
  li.addEventListener("click", () => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  });

  // delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  });

  li.appendChild(deleteBtn);

  // drag events
  li.addEventListener("dragstart", () => {
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    updateOrder();
  });

  return li;
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    taskList.appendChild(createTaskElement(task, index));
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (!text) return;

  tasks.push({
    text,
    completed: false,
    deadline
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  deadlineInput.value = "";
}

function updateOrder() {
  const newTasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    const text = li.querySelector("span").childNodes[0].textContent;
    const task = tasks.find(t => t.text === text);
    if (task) newTasks.push(task);
  });
  tasks = newTasks;
  saveTasks();
}

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(taskList, e.clientY);
  if (afterElement == null) {
    taskList.appendChild(dragging);
  } else {
    taskList.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll("li:not(.dragging)")];
  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

addTaskBtn.addEventListener("click", addTask);
renderTasks();
