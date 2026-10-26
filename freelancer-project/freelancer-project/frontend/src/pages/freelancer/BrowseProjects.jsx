import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ProjectCard from '../../components/ProjectCard'
import Loader from '../../components/Loader'
import { getAllProjects } from '../../services/projectService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function BrowseProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    getAllProjects(search, 'OPEN').then((res) => setProjects(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <div className="page-header">
          <h2>Browse Open Projects</h2>
          <form className="search-bar" onSubmit={handleSearch}>
            <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-outline" type="submit">Search</button>
          </form>
        </div>
        {loading ? <Loader /> : (
          <div className="project-grid">
            {projects.length === 0 && <p className="empty-state">No open projects found.</p>}
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} linkPrefix="/freelancer" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
