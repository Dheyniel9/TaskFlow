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

export default function TeamFlow() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState("kanban");
  const [selectedProject, setSelectedProject] = useState("all");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    project: "",
    priority: "medium",
    status: "todo",
    dueDate: ""
  });

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("teamTasks");
    const savedProjects = localStorage.getItem("teamProjects");
    const savedMembers = localStorage.getItem("teamMembers");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedMembers) setTeamMembers(JSON.parse(savedMembers));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));

    // Initialize with sample data if empty
    if (!savedProjects) {
      const sampleProjects = [
        { id: "1", name: "Website Redesign", description: "Company website overhaul", color: "#5568AA" },
        { id: "2", name: "Mobile App", description: "iOS and Android app development", color: "#6D55AA" },
        { id: "3", name: "Marketing Campaign", description: "Q4 marketing initiatives", color: "#5592AA" }
      ];
      setProjects(sampleProjects);
      localStorage.setItem("teamProjects", JSON.stringify(sampleProjects));
    }

    if (!savedMembers) {
      const sampleMembers = [
        { id: "1", name: "Alex Johnson", email: "alex@company.com", role: "Frontend Developer", avatar: "👨‍💻" },
        { id: "2", name: "Sarah Chen", email: "sarah@company.com", role: "UI/UX Designer", avatar: "👩‍🎨" },
        { id: "3", name: "Mike Rodriguez", email: "mike@company.com", role: "Backend Developer", avatar: "👨‍💼" },
        { id: "4", name: "Emma Wilson", email: "emma@company.com", role: "Project Manager", avatar: "👩‍💼" }
      ];
      setTeamMembers(sampleMembers);
      localStorage.setItem("teamMembers", JSON.stringify(sampleMembers));
    }

    if (!savedTasks) {
      const sampleTasks = [
        {
          id: "1",
          title: "Design Homepage Layout",
          description: "Create wireframes and mockups for the new homepage",
          assignee: "2",
          project: "1",
          priority: "high",
          status: "inprogress",
          dueDate: "2025-08-15",
          createdDate: new Date().toISOString()
        },
        {
          id: "2",
          title: "Setup Authentication",
          description: "Implement user login and registration system",
          assignee: "3",
          project: "2",
          priority: "high",
          status: "todo",
          dueDate: "2025-08-20",
          createdDate: new Date().toISOString()
        },
        {
          id: "3",
          title: "Content Strategy Planning",
          description: "Develop content calendar for social media",
          assignee: "4",
          project: "3",
          priority: "medium",
          status: "review",
          dueDate: "2025-08-10",
          createdDate: new Date().toISOString()
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem("teamTasks", JSON.stringify(sampleTasks));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("teamTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("teamProjects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        ...newTask,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        project: "",
        priority: "medium",
        status: "todo",
        dueDate: ""
      });
      setShowTaskModal(false);
    }
  };

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedDate: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task =>
    selectedProject === "all" || task.project === selectedProject
  );

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === "todo"),
    inprogress: filteredTasks.filter(task => task.status === "inprogress"),
    review: filteredTasks.filter(task => task.status === "review"),
    done: filteredTasks.filter(task => task.status === "done")
  };

  const getProjectById = (projectId) => projects.find(p => p.id === projectId);
  const getMemberById = (memberId) => teamMembers.find(m => m.id === memberId);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#dc2626";
      case "medium": return "#d97706";
      case "low": return "#16a34a";
      default: return "#5568AA";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo": return "#6c757d";
      case "inprogress": return "#5568AA";
      case "review": return "#6D55AA";
      case "done": return "#5592AA";
      default: return "#6c757d";
    }
  };

  const stats = {
    totalTasks: tasks.length,
    inProgress: tasks.filter(t => t.status === "inprogress").length,
    completed: tasks.filter(t => t.status === "done").length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "done").length
  };

  return (
    <>
      <Head>
        <title>TeamFlow - Team Collaboration Platform</title>
        <meta name="description" content="Professional team collaboration and project management platform for modern teams" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable} ${darkMode ? styles.dark : ''}`}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.backButton}>← Back to Hub</Link>
            <h1 className={styles.title}>
              👥 TeamFlow
            </h1>
            <p className={styles.subtitle}>
              Professional team collaboration and project management platform
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
          {/* Dashboard Stats */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.totalTasks}</span>
              <span className={styles.statLabel}>Total Tasks</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.inProgress}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber} style={{ color: stats.overdue > 0 ? "#dc2626" : "inherit" }}>
                {stats.overdue}
              </span>
              <span className={styles.statLabel}>Overdue</span>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.teamControls}>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.toggleButton} ${activeView === 'kanban' ? styles.active : ''}`}
                onClick={() => setActiveView('kanban')}
              >
                📋 Kanban
              </button>
              <button
                className={`${styles.toggleButton} ${activeView === 'list' ? styles.active : ''}`}
                onClick={() => setActiveView('list')}
              >
                📝 List
              </button>
            </div>

            <div className={styles.projectFilter}>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className={styles.select}
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowTaskModal(true)}
              className={styles.addButton}
            >
              + Add Task
            </button>
          </div>

          {/* Kanban Board */}
          {activeView === 'kanban' && (
            <div className={styles.kanbanBoard}>
              <div className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <h3>📝 To Do ({tasksByStatus.todo.length})</h3>
                </div>
                <div className={styles.taskList}>
                  {tasksByStatus.todo.map(task => (
                    <div key={task.id} className={styles.taskCard}>
                      <div className={styles.taskHeader}>
                        <h4>{task.title}</h4>
                        <div className={styles.taskActions}>
                          <button onClick={() => deleteTask(task.id)} className={styles.deleteBtn}>×</button>
                        </div>
                      </div>
                      <p className={styles.taskDescription}>{task.description}</p>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskPriority} style={{ backgroundColor: getPriorityColor(task.priority) }}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.assignee && (
                          <span className={styles.taskAssignee}>
                            {getMemberById(task.assignee)?.avatar} {getMemberById(task.assignee)?.name}
                          </span>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className={styles.taskDue}>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className={styles.taskStatusButtons}>
                        <button
                          onClick={() => updateTask(task.id, { status: 'inprogress' })}
                          className={styles.statusBtn}
                        >
                          Start →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <h3>🚀 In Progress ({tasksByStatus.inprogress.length})</h3>
                </div>
                <div className={styles.taskList}>
                  {tasksByStatus.inprogress.map(task => (
                    <div key={task.id} className={styles.taskCard}>
                      <div className={styles.taskHeader}>
                        <h4>{task.title}</h4>
                        <div className={styles.taskActions}>
                          <button onClick={() => deleteTask(task.id)} className={styles.deleteBtn}>×</button>
                        </div>
                      </div>
                      <p className={styles.taskDescription}>{task.description}</p>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskPriority} style={{ backgroundColor: getPriorityColor(task.priority) }}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.assignee && (
                          <span className={styles.taskAssignee}>
                            {getMemberById(task.assignee)?.avatar} {getMemberById(task.assignee)?.name}
                          </span>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className={styles.taskDue}>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className={styles.taskStatusButtons}>
                        <button
                          onClick={() => updateTask(task.id, { status: 'todo' })}
                          className={styles.statusBtnSecondary}
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => updateTask(task.id, { status: 'review' })}
                          className={styles.statusBtn}
                        >
                          Review →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <h3>👀 Review ({tasksByStatus.review.length})</h3>
                </div>
                <div className={styles.taskList}>
                  {tasksByStatus.review.map(task => (
                    <div key={task.id} className={styles.taskCard}>
                      <div className={styles.taskHeader}>
                        <h4>{task.title}</h4>
                        <div className={styles.taskActions}>
                          <button onClick={() => deleteTask(task.id)} className={styles.deleteBtn}>×</button>
                        </div>
                      </div>
                      <p className={styles.taskDescription}>{task.description}</p>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskPriority} style={{ backgroundColor: getPriorityColor(task.priority) }}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.assignee && (
                          <span className={styles.taskAssignee}>
                            {getMemberById(task.assignee)?.avatar} {getMemberById(task.assignee)?.name}
                          </span>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className={styles.taskDue}>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className={styles.taskStatusButtons}>
                        <button
                          onClick={() => updateTask(task.id, { status: 'inprogress' })}
                          className={styles.statusBtnSecondary}
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => updateTask(task.id, { status: 'done' })}
                          className={styles.statusBtn}
                        >
                          Done ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <h3>✅ Done ({tasksByStatus.done.length})</h3>
                </div>
                <div className={styles.taskList}>
                  {tasksByStatus.done.map(task => (
                    <div key={task.id} className={`${styles.taskCard} ${styles.completedTask}`}>
                      <div className={styles.taskHeader}>
                        <h4>{task.title}</h4>
                        <div className={styles.taskActions}>
                          <button onClick={() => deleteTask(task.id)} className={styles.deleteBtn}>×</button>
                        </div>
                      </div>
                      <p className={styles.taskDescription}>{task.description}</p>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskPriority} style={{ backgroundColor: getPriorityColor(task.priority) }}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.assignee && (
                          <span className={styles.taskAssignee}>
                            {getMemberById(task.assignee)?.avatar} {getMemberById(task.assignee)?.name}
                          </span>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className={styles.taskDue}>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className={styles.taskStatusButtons}>
                        <button
                          onClick={() => updateTask(task.id, { status: 'review' })}
                          className={styles.statusBtnSecondary}
                        >
                          ← Reopen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* List View */}
          {activeView === 'list' && (
            <div className={styles.listView}>
              <table className={styles.taskTable}>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id}>
                      <td>
                        <div>
                          <strong>{task.title}</strong>
                          <p>{task.description}</p>
                        </div>
                      </td>
                      <td>
                        {task.assignee ? (
                          <span className={styles.memberCell}>
                            {getMemberById(task.assignee)?.avatar} {getMemberById(task.assignee)?.name}
                          </span>
                        ) : (
                          <span>Unassigned</span>
                        )}
                      </td>
                      <td>
                        {task.project ? getProjectById(task.project)?.name : "No Project"}
                      </td>
                      <td>
                        <span className={styles.priorityBadge} style={{ backgroundColor: getPriorityColor(task.priority) }}>
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={styles.statusBadge} style={{ backgroundColor: getStatusColor(task.status) }}>
                          {task.status.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                      </td>
                      <td>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className={styles.deleteTableBtn}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* Add Task Modal */}
        {showTaskModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Add New Task</h2>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className={styles.input}
                />
                <textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className={styles.textarea}
                  rows={3}
                />
                <div className={styles.formRow}>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className={styles.select}
                  >
                    <option value="">Select Assignee</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newTask.project}
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                    className={styles.select}
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formRow}>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className={styles.select}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className={styles.addButton}
                  disabled={!newTask.title.trim()}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className={styles.footer}>
          <p>Built with ❤️ for modern teams and collaboration</p>
        </footer>
      </div>
    </>
  );
}
