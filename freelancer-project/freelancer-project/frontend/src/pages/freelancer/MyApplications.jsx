import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import StatusBadge from '../../components/StatusBadge'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { getApplicationsForFreelancer } from '../../services/applicationService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function MyApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getApplicationsForFreelancer(user.userId).then((res) => setApplications(res.data)).finally(() => setLoading(false))
  }, [user])

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>My Applications</h2>
        {loading ? <Loader /> : (
          <table className="data-table">
            <thead>
              <tr><th>Project</th><th>Bid</th><th>Delivery</th><th>Status</th><th>Applied On</th><th></th></tr>
            </thead>
            <tbody>
              {applications.length === 0 && <tr><td colSpan="6">No applications yet.</td></tr>}
              {applications.map((a) => (
                <tr key={a.id}>
                  <td>{a.project.title}</td>
                  <td>${a.bidAmount}</td>
                  <td>{a.deliveryDays} days</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><Link className="btn btn-outline btn-sm" to={`/freelancer/projects/${a.project.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
