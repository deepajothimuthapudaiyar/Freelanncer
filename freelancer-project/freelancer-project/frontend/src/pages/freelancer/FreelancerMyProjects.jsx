import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ProjectCard from '../../components/ProjectCard'
import Loader from '../../components/Loader'
import { getMyProjects } from '../../services/projectService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function FreelancerMyProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyProjects().then((res) => setProjects(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>My Assigned Projects</h2>
        {loading ? <Loader /> : (
          <div className="project-grid">
            {projects.length === 0 && <p className="empty-state">No assigned projects yet.</p>}
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} linkPrefix="/freelancer" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
