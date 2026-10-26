import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import { getProject, updateProject } from '../../services/projectService'

const links = [
  { to: '/client/dashboard', label: 'Dashboard' },
  { to: '/client/projects/new', label: 'Create Project' },
  { to: '/client/projects', label: 'My Projects' },
  { to: '/client/profile', label: 'Profile' },
  { to: '/client/reviews', label: 'Reviews' },
]

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getProject(id).then((res) => setForm({
      title: res.data.title,
      description: res.data.description,
      budget: res.data.budget,
      deadline: res.data.deadline || '',
    }))
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await updateProject(id, { ...form, budget: parseFloat(form.budget) })
      navigate(`/client/projects/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project')
    }
  }

  if (!form) return <div className="dashboard-layout"><Sidebar links={links} /><div className="dashboard-content"><Loader /></div></div>

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>Edit Project</h2>
        <form className="form-card" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <label>Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
          <label>Description</label>
          <textarea name="description" rows="6" value={form.description} onChange={handleChange} required />
          <div className="form-row">
            <div>
              <label>Budget ($)</label>
              <input type="number" name="budget" min="1" step="0.01" value={form.budget} onChange={handleChange} required />
            </div>
            <div>
              <label>Deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  )
}
