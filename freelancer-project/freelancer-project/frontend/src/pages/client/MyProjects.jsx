import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ProjectCard from '../../components/ProjectCard'
import Loader from '../../components/Loader'
import { getMyProjects } from '../../services/projectService'

const links = [
  { to: '/client/dashboard', label: 'Dashboard' },
  { to: '/client/projects/new', label: 'Create Project' },
  { to: '/client/projects', label: 'My Projects' },
  { to: '/client/profile', label: 'Profile' },
  { to: '/client/reviews', label: 'Reviews' },
]

export default function MyProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    getMyProjects().then((res) => setProjects(res.data)).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? projects : projects.filter((p) => p.status === filter)

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <div className="page-header">
          <h2>My Projects</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        {loading ? <Loader /> : (
          <div className="project-grid">
            {filtered.length === 0 && <p className="empty-state">No projects found.</p>}
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} linkPrefix="/client" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
