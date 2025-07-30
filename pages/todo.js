import styles from "@/styles/Home.module.css";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newCategory, setNewCategory] = useState("personal");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editCategory, setEditCategory] = useState("personal");

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todoItems");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }

    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save to localStorage whenever todos or darkMode changes
  useEffect(() => {
    localStorage.setItem("todoItems", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        priority: newPriority,
        category: newCategory,
        completed: false,
        createdDate: new Date().toLocaleDateString()
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setNewPriority("medium");
      setNewCategory("personal");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId
          ? { ...todo, text: editText.trim(), priority: editPriority, category: editCategory }
          : todo
      ));
      setEditingId(null);
      setEditText("");
      setEditPriority("medium");
      setEditCategory("personal");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditPriority("medium");
    setEditCategory("personal");
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    if (filter === "high") return todo.priority === "high";
    if (filter === "work") return todo.category === "work";
    if (filter === "personal") return todo.category === "personal";
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    high: todos.filter(t => t.priority === "high" && !t.completed).length
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#dc2626";
      case "medium": return "#d97706";
      case "low": return "#16a34a";
      default: return "#64748b";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "work": return "💼";
      case "personal": return "👤";
      case "shopping": return "🛒";
      case "health": return "🏥";
      default: return "📝";
    }
  };

  return (
    <>
      <Head>
        <title>TodoApp - Stay Organized</title>
        <meta name="description" content="Stay organized and productive with a simple yet powerful todo list application!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable} ${darkMode ? styles.dark : ''}`}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.backButton}>← Back to Apps</Link>
            <h1 className={styles.title}>
              ✅ TodoApp
            </h1>
            <p className={styles.subtitle}>
              Stay organized and productive with your personal task manager
            </p>
            <button
              className={styles.darkModeToggle}
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <main className={styles.main}>
          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.pending}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.high}</span>
              <span className={styles.statLabel}>High Priority</span>
            </div>
          </div>

          {/* Add new todo */}
          <div className={styles.addSection}>
            <h2>Add New Task</h2>
            <div className={styles.todoInputGroup}>
              <input
                type="text"
                placeholder="What do you need to do?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className={styles.select}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={styles.select}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
              </select>
              <button
                onClick={addTodo}
                className={styles.addButton}
                disabled={!newTodo.trim()}
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Filter buttons */}
          <div className={styles.filterSection}>
            <button
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({stats.total})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'pending' ? styles.active : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({stats.pending})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completed})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'high' ? styles.active : ''}`}
              onClick={() => setFilter('high')}
            >
              High Priority ({stats.high})
            </button>
          </div>

          {/* Todos list */}
          <div className={styles.destinationsSection}>
            {filteredTodos.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  {filter === 'all'
                    ? "No tasks yet. Add your first task to get started!"
                    : filter === 'completed'
                    ? "No completed tasks yet. Finish some tasks to see them here!"
                    : filter === 'pending'
                    ? "No pending tasks. Great job staying on top of things!"
                    : "No high priority tasks. You're all caught up!"
                  }
                </p>
              </div>
            ) : (
              <div className={styles.destinationsList}>
                {filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`${styles.todoCard} ${todo.completed ? styles.completed : ''}`}
                  >
                    {editingId === todo.id ? (
                      <div className={styles.editForm}>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={styles.editInput}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        />
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value)}
                          className={styles.editSelect}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className={styles.editSelect}
                        >
                          <option value="personal">Personal</option>
                          <option value="work">Work</option>
                          <option value="shopping">Shopping</option>
                          <option value="health">Health</option>
                        </select>
                        <div className={styles.editActions}>
                          <button onClick={saveEdit} className={styles.saveButton}>
                            ✓
                          </button>
                          <button onClick={cancelEdit} className={styles.cancelButton}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.todoInfo}>
                          <h3 className={styles.todoText} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.completed ? '✅' : '⏳'} {todo.text}
                          </h3>
                          <div className={styles.todoMeta}>
                            <span className={styles.todoPriority} style={{ color: getPriorityColor(todo.priority) }}>
                              {todo.priority.toUpperCase()} PRIORITY
                            </span>
                            <span className={styles.todoCategory}>
                              {getCategoryIcon(todo.category)} {todo.category.toUpperCase()}
                            </span>
                          </div>
                          <p className={styles.todoDate}>Created: {todo.createdDate}</p>
                        </div>
                        <div className={styles.destinationActions}>
                          <button
                            onClick={() => toggleComplete(todo.id)}
                            className={`${styles.actionButton} ${todo.completed ? styles.pendingButton : styles.completeButton}`}
                          >
                            {todo.completed ? 'Mark as Pending' : 'Mark as Complete'}
                          </button>
                          <button
                            onClick={() => startEditing(todo)}
                            className={styles.editButton}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className={styles.deleteButton}
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <footer className={styles.footer}>
          <p>Built with ❤️ for productivity and organization</p>
        </footer>
      </div>
    </>
  );
}
