import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import StatusBadge from '../../components/StatusBadge'
import ProgressBar from '../../components/ProgressBar'
import Loader from '../../components/Loader'
import Modal from '../../components/Modal'
import { getProject, updateProject, deleteProject, completeProject } from '../../services/projectService'
import { getApplicationsForProject, acceptApplication, rejectApplication } from '../../services/applicationService'
import { getProgress } from '../../services/taskService'
import { submitReview } from '../../services/reviewService'
import { getFilesForProject, uploadFile } from '../../services/fileService'

const links = [
  { to: '/client/dashboard', label: 'Dashboard' },
  { to: '/client/projects/new', label: 'Create Project' },
  { to: '/client/projects', label: 'My Projects' },
  { to: '/client/profile', label: 'Profile' },
  { to: '/client/reviews', label: 'Reviews' },
]

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [applications, setApplications] = useState([])
  const [progress, setProgress] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReview, setShowReview] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      getProject(id),
      getApplicationsForProject(id).catch(() => ({ data: [] })),
      getFilesForProject(id).catch(() => ({ data: [] })),
    ]).then(([projRes, appRes, fileRes]) => {
      setProject(projRes.data)
      setApplications(appRes.data)
      setFiles(fileRes.data)
      if (projRes.data.status === 'IN_PROGRESS' || projRes.data.status === 'COMPLETED') {
        getProgress(id).then((res) => setProgress(res.data)).catch(() => {})
      }
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleAccept = async (appId) => {
    try {
      await acceptApplication(appId)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept application')
    }
  }

  const handleReject = async (appId) => {
    try {
      await rejectApplication(appId)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject application')
    }
  }

  const handleApprove = async () => {
    try {
      await completeProject(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve project')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return
    await deleteProject(id)
    navigate('/client/projects')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitReview({
        projectId: id,
        reviewedUserId: project.freelancer.id,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment,
      })
      setShowReview(false)
      alert('Review submitted!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review')
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await uploadFile(id, file)
    load()
  }

  if (loading) return (
    <div className="dashboard-layout"><Sidebar links={links} /><div className="dashboard-content"><Loader /></div></div>
  )
  if (!project) return null

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="page-header">
          <h2>{project.title}</h2>
          <StatusBadge status={project.status} />
        </div>
        <div className="detail-card">
          <p>{project.description}</p>
          <div className="project-card-meta">
            <span>Budget: ${project.budget}</span>
            {project.deadline && <span>Deadline: {project.deadline}</span>}
            {project.freelancer && <span>Assigned to: {project.freelancer.name}</span>}
          </div>
          <div className="detail-actions">
            {project.status === 'OPEN' && (
              <>
                <Link className="btn btn-outline btn-sm" to={`/client/projects/${id}/edit`}>Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
              </>
            )}
            {project.status === 'IN_PROGRESS' && progress && progress.progressPercentage === 100 && (
              <button className="btn btn-primary btn-sm" onClick={handleApprove}>Approve & Complete Project</button>
            )}
            {project.status === 'COMPLETED' && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowReview(true)}>Rate Freelancer</button>
            )}
          </div>
        </div>

        {progress && (
          <div className="detail-card">
            <h3>Progress ({progress.completedTasks}/{progress.totalTasks} tasks)</h3>
            <ProgressBar percentage={progress.progressPercentage} />
          </div>
        )}

        <div className="detail-card">
          <h3>Project Files</h3>
          <input type="file" onChange={handleFileUpload} />
          <ul className="file-list">
            {files.map((f) => (
              <li key={f.id}><a href={`http://localhost:8080${f.filePath}`} target="_blank" rel="noreferrer">{f.fileName}</a></li>
            ))}
          </ul>
        </div>

        {project.status === 'OPEN' && (
          <div className="detail-card">
            <h3>Applications ({applications.length})</h3>
            {applications.length === 0 && <p className="empty-state">No applications yet.</p>}
            <table className="data-table">
              <thead>
                <tr><th>Freelancer</th><th>Bid</th><th>Delivery</th><th>Proposal</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id}>
                    <td>{a.freelancer.name}</td>
                    <td>${a.bidAmount}</td>
                    <td>{a.deliveryDays} days</td>
                    <td>{a.proposal}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      {a.status === 'PENDING' && (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => handleAccept(a.id)}>Accept</button>{' '}
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(a.id)}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showReview && (
          <Modal title="Rate Freelancer" onClose={() => setShowReview(false)}>
            <form onSubmit={handleReviewSubmit}>
              <label>Rating (1-5)</label>
              <input type="number" min="1" max="5" value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} required />
              <label>Comment</label>
              <textarea rows="4" value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
              <button className="btn btn-primary" type="submit">Submit Review</button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  )
}
