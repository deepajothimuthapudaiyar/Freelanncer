import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { getProject } from '../../services/projectService'
import { applyToProject, getApplicationsForFreelancer } from '../../services/applicationService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function FreelancerProjectDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [showApply, setShowApply] = useState(false)
  const [form, setForm] = useState({ bidAmount: '', deliveryDays: '', proposal: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([
      getProject(id),
      getApplicationsForFreelancer(user.userId),
    ]).then(([projRes, appRes]) => {
      setProject(projRes.data)
      setAlreadyApplied(appRes.data.some((a) => a.project.id === parseInt(id)))
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await applyToProject({
        projectId: id,
        bidAmount: parseFloat(form.bidAmount),
        deliveryDays: parseInt(form.deliveryDays),
        proposal: form.proposal,
      })
      setShowApply(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application')
    }
  }

  if (loading) return <div className="dashboard-layout"><Sidebar links={links} /><div className="dashboard-content"><Loader /></div></div>
  if (!project) return null

  const isOwnProject = project.client.id === user.userId

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <div className="page-header">
          <h2>{project.title}</h2>
          <StatusBadge status={project.status} />
        </div>
        <div className="detail-card">
          <p>{project.description}</p>
          <div className="project-card-meta">
            <span>Budget: ${project.budget}</span>
            {project.deadline && <span>Deadline: {project.deadline}</span>}
            <span>Posted by: {project.client.name}</span>
          </div>
          {project.status === 'OPEN' && !isOwnProject && !alreadyApplied && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowApply(true)}>Apply to this Project</button>
          )}
          {alreadyApplied && <p className="empty-state">You have already applied to this project.</p>}
          {isOwnProject && <p className="empty-state">This is your own project — you cannot apply.</p>}
          {project.status === 'IN_PROGRESS' && project.freelancer && project.freelancer.id === user.userId && (
            <Link className="btn btn-primary btn-sm" to={`/freelancer/projects/${id}/tasks`}>Manage Tasks</Link>
          )}
        </div>

        {showApply && (
          <Modal title="Submit Your Bid" onClose={() => setShowApply(false)}>
            <form onSubmit={handleApply}>
              {error && <div className="alert alert-error">{error}</div>}
              <label>Bid Amount ($)</label>
              <input type="number" min="1" step="0.01" value={form.bidAmount}
                onChange={(e) => setForm({ ...form, bidAmount: e.target.value })} required />
              <label>Expected Delivery Days</label>
              <input type="number" min="1" value={form.deliveryDays}
                onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })} required />
              <label>Proposal</label>
              <textarea rows="5" value={form.proposal}
                onChange={(e) => setForm({ ...form, proposal: e.target.value })} required />
              <button className="btn btn-primary" type="submit">Submit Application</button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  )
}
