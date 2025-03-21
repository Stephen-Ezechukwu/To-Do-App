document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    };

    // Function to create a task element
    const createTaskElement = (taskText, completed = false) => {
        const li = document.createElement('li');
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        if (completed) {
            taskSpan.style.textDecoration = 'line-through';
        }

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            taskList.removeChild(li);
            removeTaskFromLocalStorage(taskText);
        };

        // Create an edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        
        editButton.onclick = () => {
            // Ensure taskText is defined
            if (!taskText) {
                console.error("Error: taskText is undefined.");
                return;
            }
        
            // Prompt user for new task text
            const newTaskText = prompt('Edit your task:', taskSpan.textContent);
        
            // Validate input (check for empty or duplicate tasks)
            if (!newTaskText || newTaskText.trim() === '') {
                alert('Task cannot be empty.');
                return;
            }
        
            if (newTaskText.trim() === taskText) {
                alert('No changes made.');
                return;
            }
        
            // Ensure li is properly referenced
            if (!li || !li.firstChild) {
                console.error("Error: li element or its text node is missing.");
                return;
            }
        
            // Update the displayed task (use correct text node)
            taskSpan.textContent = newTaskText.trim();
        
            // Update local storage
            updateTaskInLocalStorage(taskText, newTaskText.trim());
        };
        
        

        // Create a complete button
        const completeButton = document.createElement('button');
        completeButton.textContent = completed ? 'Undo' : 'Complete';
        completeButton.onclick = () => {
            if (taskSpan.style.textDecoration === 'line-through') {
                taskSpan.style.textDecoration = 'none';
                completeButton.textContent = 'Complete';
                updateTaskCompletionInLocalStorage(taskText, false);
            } else {
                taskSpan.style.textDecoration = 'line-through';
                completeButton.textContent = 'Undo';
                updateTaskCompletionInLocalStorage(taskText, true);
            }
        };

        li.appendChild(taskSpan);
        li.appendChild(editButton);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    };

    // Function to add a task
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        createTaskElement(taskText);
        saveTaskToLocalStorage(taskText, false);
        taskInput.value = ''; // Clear the input
    };

    // Save task to local storage
    const saveTaskToLocalStorage = (taskText, completed) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: taskText, completed: completed });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Remove task from local storage
    const removeTaskFromLocalStorage = (taskText) => {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Update task in local storage
    const updateTaskInLocalStorage = (oldText, newText) => {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => {
            if (task.text === oldText) {
                return { text: newText, completed: task.completed };
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Update task completion status in local storage
    const updateTaskCompletionInLocalStorage = (taskText, completed) => {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => {
            if (task.text === taskText) {
                return { text: task.text, completed: completed };
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Event listener for the add task button
    addTaskButton.addEventListener('click',addTask);
    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    
     
    loadTasks();

});