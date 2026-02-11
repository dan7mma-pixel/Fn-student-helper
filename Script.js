function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") return;

    const li = document.createElement("li");
    li.textContent = taskText;

    li.addEventListener("click", function () {
        li.classList.toggle("completed");
        updateProgress();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        li.remove();
        updateProgress();
    });

    li.appendChild(deleteBtn);
    document.getElementById("taskList").appendChild(li);

    input.value = "";
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
