function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.textContent = taskText;

  // Анимация появления
  li.classList.add("task-appear");

  // Клик = выполнение
  li.addEventListener("click", function() {
    li.classList.toggle("completed");
    updateProgress();
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
    }, 300);
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  updateProgress();
}

function updateProgress() {
    const tasks = document.querySelectorAll("#taskList li");
    const completed = document.querySelectorAll("#taskList li.completed");

    const total = tasks.length;
    const done = completed.length;

    document.getElementById("taskCounter").textContent =
        `Задач выполнено: ${done} / ${total}`;

    const percent = total === 0 ? 0 : (done / total) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
}
// Добавление по кнопке
addTaskBtn.addEventListener("click", addTask);

// Добавление по Enter
taskInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});
