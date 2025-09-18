import './App.css';
import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit3, Calendar, Search, Moon, Sun } from 'lucide-react';


const TaskManagerApp = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Apprendre React", completed: false, priority: "high", dueDate: "2025-09-20", category: "Développement" },
    { id: 2, text: "Faire les courses", completed: true, priority: "medium", dueDate: "2025-09-18", category: "Personnel" },
    { id: 3, text: "Réunion équipe", completed: false, priority: "high", dueDate: "2025-09-19", category: "Travail" }
  ]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState('Personnel');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const categories = ["Personnel", "Travail", "Développement", "Loisirs"];

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        priority: newPriority,
        dueDate: newDueDate,
        category: newCategory
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setNewDueDate('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editText } : task
    ));
    setEditingId(null);
    setEditText('');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && !task.completed) ||
                         (filter === 'completed' && task.completed);
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isOverdue = (dueDate) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate && dueDate < today;
  };

  const getFilterLabel = (filterType) => {
    switch(filterType) {
      case 'all': return 'Toutes';
      case 'active': return 'Actives';
      case 'completed': return 'Terminées';
      default: return filterType;
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="title">TaskFlow</h1>
            <p className={`subtitle ${darkMode ? 'dark' : 'light'}`}>
              Organisez votre productivité
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        {/* Add Task Form */}
        <div className={`card ${darkMode ? 'dark' : 'light'}`}>
          <form onSubmit={addTask} className="add-form">
            <div className="form-row">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Nouvelle tâche..."
                className={`input flex-1 ${darkMode ? 'dark' : 'light'}`}
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={`select ${darkMode ? 'dark' : 'light'}`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-row">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className={`select ${darkMode ? 'dark' : 'light'}`}
              >
                <option value="low">Priorité Basse</option>
                <option value="medium">Priorité Moyenne</option>
                <option value="high">Priorité Haute</option>
              </select>
              
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className={`input ${darkMode ? 'dark' : 'light'}`}
              />
              
              <button type="submit" className="add-button">
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
            </div>
          </form>
        </div>

        {/* Search and Filters */}
        <div className={`card ${darkMode ? 'dark' : 'light'}`}>
          <div className="form-row">
            <div className="search-container">
              <Search className={`search-icon ${darkMode ? 'dark' : 'light'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className={`input search-input ${darkMode ? 'dark' : 'light'}`}
              />
            </div>
            
            <div className="filters">
              {['all', 'active', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`filter-button ${
                    filter === f ? 'active' : `inactive ${darkMode ? 'dark' : 'light'}`
                  }`}
                >
                  {getFilterLabel(f)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Stats */}
        <div className="stats-grid">
          <div className={`stat-card ${darkMode ? 'dark' : 'light'}`}>
            <div className="stat-number total">{tasks.length}</div>
            <div className={`stat-label ${darkMode ? 'dark' : 'light'}`}>Total</div>
          </div>
          <div className={`stat-card ${darkMode ? 'dark' : 'light'}`}>
            <div className="stat-number completed">{tasks.filter(t => t.completed).length}</div>
            <div className={`stat-label ${darkMode ? 'dark' : 'light'}`}>Terminées</div>
          </div>
          <div className={`stat-card ${darkMode ? 'dark' : 'light'}`}>
            <div className="stat-number pending">{tasks.filter(t => !t.completed).length}</div>
            <div className={`stat-label ${darkMode ? 'dark' : 'light'}`}>En cours</div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`task-item priority-${task.priority} ${darkMode ? 'dark' : 'light'} ${
                task.completed ? 'completed' : ''
              }`}
            >
              <div className="task-content">
                <div className="task-main">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`task-checkbox ${
                      task.completed 
                        ? 'completed' 
                        : `uncompleted ${darkMode ? 'dark' : 'light'}`
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4" />}
                  </button>
                  
                  <div className="task-info">
                    {editingId === task.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => saveEdit(task.id)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                        className={`task-edit-input ${darkMode ? 'dark' : 'light'}`}
                        autoFocus
                      />
                    ) : (
                      <div>
                        <div className={`task-text ${task.completed ? 'completed' : ''}`}>
                          {task.text}
                        </div>
                        <div className="task-meta">
                          <span className={`task-category ${darkMode ? 'dark' : 'light'}`}>
                            {task.category}
                          </span>
                          {task.dueDate && (
                            <span className={`task-date ${
                              isOverdue(task.dueDate) && !task.completed 
                                ? 'overdue' 
                                : darkMode ? 'dark' : 'light'
                            }`}>
                              <Calendar className="w-4 h-4" />
                              {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="task-actions">
                  <button
                    onClick={() => startEdit(task.id, task.text)}
                    className={`task-action ${darkMode ? 'dark' : 'light'}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className={`task-action delete ${darkMode ? 'dark' : 'light'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className={`empty-state ${darkMode ? 'dark' : 'light'}`}>
            <div className="empty-icon">📝</div>
            <p className="empty-text">
              {searchTerm ? 'Aucune tâche trouvée' : 'Aucune tâche pour ce filtre'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagerApp;