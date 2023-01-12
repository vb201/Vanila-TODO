const taskInput = document.getElementById("task-name");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const clearAllTasksButton = document.getElementById("clear-all-tasks");
var oldTaskName = "";
var oldTaskChecked = false;

addTaskButton.addEventListener("click", addNewTodo);
clearAllTasksButton.addEventListener("click", clearAllTasks);
taskList.addEventListener("click", taskListClickHandler);

// Call getTasks() when the page loads
getTasks();

function addNewTodo() {
  // Get the task name from the input field
  const taskName = taskInput.value;
  if (taskName === "") {
    return;
  }

  const taskElement = document.createElement("li");
  taskElement.classList.add(
    "list-group-item",
    "d-flex",
    "my-1",
    "justify-content-between",
    "align-items-center"
  );

  taskElement.innerHTML = `
    <div>
      <input
        class="form-check-input"
        type="checkbox"
        id="task-checkbox"
      /> ${taskName}
   </div>
          
    <div class="float-end">
      <i class="bi bi-pen p-1 text-info icon" id="edit-task"></i>
      <i class="bi bi-trash p-1 text-danger icon" id="delete-task"></i>
    </div>
  `;
  taskList.appendChild(taskElement);
  taskInput.value = "";

  // Update the details
  updateDetails();

  // Store the task in local storage
  storeTaskInLocalStorage(taskName);
}

function clearAllTasks() {
  // Clear the task list
  taskList.innerHTML = "";

  // Update the details
  updateDetails();

  // Remove all tasks from local storage
  removeAllTasksFromLocalStorage();
}

function taskListClickHandler(event) {
  if (event.target.id === "delete-task") {
    deleteTask.call(event.target);
  }
  if (event.target.id === "edit-task") {
    editTask.call(event.target);
  }
  if (event.target.id === "save-edit-task") {
    saveEditTask.call(event.target);
  }
  if (event.target.id === "cancel-edit-task") {
    cancelEditTask.call(event.target);
  }
  if (event.target.id === "task-checkbox") {
    const task = event.target.parentElement;
    // Mark task as completed by adding a new class
    task.classList.toggle("task-completed");

    // Update the task status in local storage
    updateTaskStatusInLocalStorage(task.innerText.trim());
  }

  // Update the details
  console.log("updateDetails() called");
  updateDetails();
}

function deleteTask() {
  // Delete the task from the task list
  const task = this.parentElement.parentElement;
  taskList.removeChild(task);

  // Remove the task from local storage
  removeTaskFromLocalStorage(task);
}

function editTask() {
  // Stores the oldTaskName and oldTaskChecked values for cancelEditTask() and saveEditTask()
  const task = this.parentElement.parentElement;

  oldTaskName = task.innerText.trim();
  if (task.querySelector("#task-checkbox").checked) {
    oldTaskChecked = true;
  }

  task.innerHTML = `
    <div class="my-1 input-group">
      <input
        type="text"
        class="form-control"
        id="task-name"
        value=""
      />
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" id="save-edit-task">Save</button>
        <button class="btn btn-light" type="button" id="cancel-edit-task">Cancel</button>
      </div>
    </div>
    `;

  // https://laracasts.com/discuss/channels/laravel/input-not-display-full-string
  task.querySelector("#task-name").value = oldTaskName;
}

function saveEditTask() {
  const task = this.parentElement.parentElement.parentElement;

  const newTask = task.querySelector("#task-name").value;
  task.innerHTML = `
    <div>
      <input
        class="form-check-input"
        type="checkbox"
        id="task-checkbox"
      /> ${newTask}
    </div>
          
    <div class="float-end">
      <i class="bi bi-pen p-1 text-info icon" id="edit-task"></i>
      <i class="bi bi-trash p-1 text-danger icon" id="delete-task"></i>
    </div>
  `;

  // Checking if the task was completed before editing
  // If it was, then check the checkbox and add the task-completed class
  if (oldTaskChecked) {
    task.querySelector("#task-checkbox").checked = true;
    task.classList.add("task-completed");
    checkedFlag = false;
  }

  // Update the task in local storage
  updateTaskInLocalStorage(oldTaskName, newTask);
}

function cancelEditTask() {
  // Restore the old task name and checked status
  const task = this.parentElement.parentElement.parentElement;

  task.innerHTML = `
    <div>
      <input
        class="form-check-input"
        type="checkbox"
        id="task-checkbox"
      /> ${oldTaskName}
    </div>
          
    <div class="float-end">
      <i class="bi bi-pen p-1 text-info icon" id="edit-task"></i>
      <i class="bi bi-trash p-1 text-danger icon" id="delete-task"></i>
    </div>
  `;

  if (oldTaskChecked) {
    task.querySelector("#task-checkbox").checked = true;
    task.classList.add("task-completed");
    checkedFlag = false;
  }
}

function updateDetails() {
  // Update the number of tasks left, completed, all and active tasks
  const tasksLeft = document.getElementById("tasks-left");
  const tasks = document.querySelectorAll("#task-list li");
  let completedTaskCount = 0;

  tasks.forEach((task) => {
    if (task.querySelector("#task-checkbox").checked) {
      completedTaskCount++;
    }
  });

  tasksLeft.innerText = `${tasks.length - completedTaskCount} ${
    tasks.length - completedTaskCount === 1 ? "task" : "tasks"
  } left`;

  // Update the DOM
  const completedTasks = document.getElementById("completed-tasks");
  completedTasks.innerText = completedTaskCount;

  const allTasks = document.getElementById("all-tasks");
  allTasks.innerText = tasks.length;

  const activeTasks = document.getElementById("active-tasks");
  activeTasks.innerText = tasks.length - completedTaskCount;
}

function storeTaskInLocalStorage(taskName) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  let task = {
    name: taskName,
    completed: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add(
      "list-group-item",
      "d-flex",
      "my-1",
      "justify-content-between",
      "align-items-center"
    );

    taskElement.innerHTML = `
      <div>
        <input
          class="form-check-input"
          type="checkbox"
          id="task-checkbox"
        /> ${task.name}
      </div>
            
      <div class="float-end">
        <i class="bi bi-pen p-1 text-info icon" id="edit-task"></i>
        <i class="bi bi-trash p-1 text-danger icon" id="delete-task"></i>
      </div>
    `;

    if (task.completed) {
      taskElement.classList.add("task-completed");
      taskElement.querySelector("#task-checkbox").checked = true;
    }

    taskList.appendChild(taskElement);

    updateDetails();
  });
}

function removeAllTasksFromLocalStorage() {
  localStorage.removeItem("tasks");
}

function removeTaskFromLocalStorage(task) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.forEach((taskItem, index) => {
    if (taskItem.name === task.innerText.trim()) {
      tasks.splice(index, 1);
      return;
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function updateTaskInLocalStorage(oldTask, newTask) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.forEach((taskItem, index) => {
    if (taskItem.name === oldTask) {
      tasks[index].name = newTask;
      return;
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskStatusInLocalStorage(taskName) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.forEach((taskItem, index) => {
    if (taskItem.name === taskName) {
      tasks[index].completed = !tasks[index].completed;
      return;
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}
