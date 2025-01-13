import React, { useState } from 'react';
import "../styles/TaskManager.css"
import { Link } from 'react-router-dom';
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sortOption, setSortOption] = useState('due-date');

  const addTask = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const dueDate = e.target.dueDate.value;
    const priority = e.target.priority.value;

    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      completed: false,
      createdAt: new Date(),
    };

    setTasks([...tasks, newTask]);
    e.target.reset();
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleSort = (e) => {
    const sortBy = e.target.value;
    setSortOption(sortBy);

    const sortedTasks = [...tasks].sort((a, b) => {
      if (sortBy === 'due-date') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorities = ['high', 'medium', 'low'];
        return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
      } else if (sortBy === 'creation') {
        return a.createdAt - b.createdAt;
      }
      return 0;
    });

    setTasks(sortedTasks);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <header>
        <div className="header-container">
          <h1 className="app-name">EditFlow</h1>
          <div className="header-buttons">
            <button>
              <Link to="/" style={{ textDecoration: 'none' }}>Drawing App</Link>
            </button>
            <button>
              <Link to="/imageEditor" style={{ textDecoration: 'none' }}>Image Editor</Link>
            </button>
            <button>
              <Link to="/task" style={{ textDecoration: 'none' }}>Task Manager</Link>
            </button>
            <button>
              <Link to="/text" style={{ textDecoration: 'none' }}>Text Editor</Link>
            </button>
            <button onClick={toggleDarkMode}>
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>
      </header>
      <main className='main-task'>
        <div className="task-manager">
          <h1>Task Manager</h1>

          {/* Add Task Form */}
          <div className="add-task">
            <h2>Add New Task</h2>
            <form id="task-form" onSubmit={addTask}>
              <input type="text" name="title" placeholder="Task Title" required />
              <textarea name="description" placeholder="Task Description" required></textarea>
              <input type="date" name="dueDate" required />
              <select name="priority">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button type="submit">Add Task</button>
            </form>
          </div>

          {/* Sort Tasks */}
          <div className="controls">
            <select value={sortOption} onChange={handleSort}>
              <option value="due-date">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="creation">Sort by Creation</option>
            </select>
          </div>

          {/* Task List */}
          <ul id="task-list">
            {tasks.map(task => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <div className="task-details">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Due: {task.dueDate}</p>
                </div>
                <span className={`task-priority ${task.priority}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <div className="actions">
                  <button onClick={() => toggleComplete(task.id)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default TaskManager;
