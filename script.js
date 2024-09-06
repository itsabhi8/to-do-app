// script.js
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDate');
const dueTimeInput = document.getElementById('dueTime');
const reminderInput = document.getElementById('reminder');
const addTodoBtn = document.getElementById('addTodoBtn');
const showCompletedBtn = document.getElementById('showCompletedBtn');
const showCancelledBtn = document.getElementById('showCancelledBtn');
const todoList = document.getElementById('todoList');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listeners
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});
showCompletedBtn.addEventListener('click', () => filterTasks('completed'));
showCancelledBtn.addEventListener('click', () => filterTasks('cancelled'));

function addTodo() {
    const todoText = todoInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;
    const dueTime = dueTimeInput.value;
    const reminder = reminderInput.value.trim();

    if (todoText !== '') {
        const task = {
            text: todoText,
            priority: priority,
            dueDate: dueDate,
            dueTime: dueTime,
            reminder: reminder,
            completed: false,
            cancelled: false
        };

        // Save task to localStorage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTasks();
        clearInputFields();
    }
}

function renderTasks(tasks = null) {
    todoList.innerHTML = '';
    if (!tasks) {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('todo-item', `priority-${task.priority}`);
        if (task.completed) {
            li.classList.add('completed');
        }
        if (task.cancelled) {
            li.classList.add('cancelled');
        }

        const span = document.createElement('span');
        span.textContent = `${task.text} ${task.dueDate ? `(Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}${task.dueTime ? ` at ${task.dueTime}` : ''}${task.reminder ? ` - Reminder: ${task.reminder}` : ''}`;
        span.classList.add('todo-text');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', function () {
            task.completed = !task.completed;
            task.cancelled = false; // Ensure task is not marked as cancelled
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = task.cancelled ? 'Undo Cancel' : 'Cancel';
        cancelBtn.classList.add('cancel-btn');
        cancelBtn.addEventListener('click', function () {
            task.cancelled = !task.cancelled;
            task.completed = false; // Ensure task is not marked as completed
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
            tasks = tasks.filter(t => t !== task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        });

        li.appendChild(completeBtn);
        li.appendChild(cancelBtn);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

function filterTasks(status) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task[status]);
    renderTasks(filteredTasks);
}

function clearInputFields() {
    todoInput.value = '';
    dueDateInput.value = '';
    dueTimeInput.value = '';
    reminderInput.value = '';
}

function loadTasks() {
    renderTasks();
}
