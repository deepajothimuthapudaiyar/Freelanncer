import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { createProject } from '../../services/projectService'

const links = [
  { to: '/client/dashboard', label: 'Dashboard' },
  { to: '/client/projects/new', label: 'Create Project' },
  { to: '/client/projects', label: 'My Projects' },
  { to: '/client/profile', label: 'Profile' },
  { to: '/client/reviews', label: 'Reviews' },
]

export default function CreateProject() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', budget: '', deadline: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createProject({ ...form, budget: parseFloat(form.budget) })
      navigate('/client/projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>Create a New Project</h2>
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  )
}
