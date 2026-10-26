import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import StatusBadge from '../../components/StatusBadge'
import Loader from '../../components/Loader'
import { getAllProjects, deleteProject } from '../../services/adminService'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/projects', label: 'Manage Projects' },
  { to: '/admin/reports', label: 'Reports' },
]

export default function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    getAllProjects().then((res) => setProjects(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await deleteProject(id)
    load()
  }

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>Manage Projects</h2>
        {loading ? <Loader /> : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Title</th><th>Client</th><th>Freelancer</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.client?.name}</td>
                  <td>{p.freelancer?.name || '-'}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
