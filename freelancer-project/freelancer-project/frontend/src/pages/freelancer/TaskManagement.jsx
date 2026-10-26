import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import ProgressBar from '../../components/ProgressBar'
import Loader from '../../components/Loader'
import { getProject } from '../../services/projectService'
import { getTasksForProject, createTask, updateTask, deleteTask, getProgress } from '../../services/taskService'
import { getFilesForProject, uploadFile } from '../../services/fileService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function TaskManagement() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [progress, setProgress] = useState(null)
  const [files, setFiles] = useState([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([
      getProject(id),
      getTasksForProject(id),
      getProgress(id),
      getFilesForProject(id).catch(() => ({ data: [] })),
    ]).then(([projRes, taskRes, progRes, fileRes]) => {
      setProject(projRes.data)
      setTasks(taskRes.data)
      setProgress(progRes.data)
      setFiles(fileRes.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.title) return
    await createTask({ projectId: id, title: newTask.title, description: newTask.description, status: 'TODO' })
    setNewTask({ title: '', description: '' })
    load()
  }

  const handleStatusChange = async (task, status) => {
    await updateTask(task.id, { title: task.title, description: task.description, status })
    load()
  }

  const handleDelete = async (taskId) => {
    await deleteTask(taskId)
    load()
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await uploadFile(id, file)
    load()
  }

  if (loading) return <div className="dashboard-layout"><Sidebar links={links} /><div className="dashboard-content"><Loader /></div></div>
  if (!project) return null

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>Tasks for: {project.title}</h2>
        {progress && (
          <div className="detail-card">
            <h3>Progress ({progress.completedTasks}/{progress.totalTasks} tasks completed)</h3>
            <ProgressBar percentage={progress.progressPercentage} />
          </div>
        )}

        <div className="detail-card">
          <h3>Add Task</h3>
          <form className="form-row" onSubmit={handleAddTask}>
            <input type="text" placeholder="Task title" value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
            <input type="text" placeholder="Description" value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
            <button className="btn btn-primary" type="submit">Add Task</button>
          </form>
        </div>

        <div className="detail-card">
          <h3>Task List</h3>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Description</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {tasks.length === 0 && <tr><td colSpan="4">No tasks yet.</td></tr>}
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td>
                    <select value={t.status} onChange={(e) => handleStatusChange(t, e.target.value)}>
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="detail-card">
          <h3>Submit Completed Files</h3>
          <input type="file" onChange={handleFileUpload} />
          <ul className="file-list">
            {files.map((f) => (
              <li key={f.id}><a href={`http://localhost:8080${f.filePath}`} target="_blank" rel="noreferrer">{f.fileName}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
