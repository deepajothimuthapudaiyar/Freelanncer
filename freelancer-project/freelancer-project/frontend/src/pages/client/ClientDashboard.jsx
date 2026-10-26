import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import DashboardCard from '../../components/DashboardCard'
import ProjectCard from '../../components/ProjectCard'
import Loader from '../../components/Loader'
import { getClientDashboard } from '../../services/projectService'

const links = [
  { to: '/client/dashboard', label: 'Dashboard' },
  { to: '/client/projects/new', label: 'Create Project' },
  { to: '/client/projects', label: 'My Projects' },
  { to: '/client/profile', label: 'Profile' },
  { to: '/client/reviews', label: 'Reviews' },
]

export default function ClientDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClientDashboard().then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <div className="page-header">
          <h2>Client Dashboard</h2>
          <Link to="/client/projects/new" className="btn btn-primary">+ New Project</Link>
        </div>
        {loading ? <Loader /> : data && (
          <>
            <div className="dashboard-cards">
              <DashboardCard title="Total Projects" value={data.totalProjects} />
              <DashboardCard title="Open Projects" value={data.openProjects} accent="accent-blue" />
              <DashboardCard title="Active Projects" value={data.activeProjects} accent="accent-orange" />
              <DashboardCard title="Completed Projects" value={data.completedProjects} accent="accent-green" />
            </div>
            <h3 className="section-title">Recent Projects</h3>
            <div className="project-grid">
              {data.recentProjects.length === 0 && <p className="empty-state">No projects yet. Create your first project!</p>}
              {data.recentProjects.map((p) => (
                <ProjectCard key={p.id} project={p} linkPrefix="/client" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
