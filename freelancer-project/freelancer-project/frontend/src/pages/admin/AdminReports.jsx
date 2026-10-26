import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import { getDashboard, getAllProjects } from '../../services/adminService'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/projects', label: 'Manage Projects' },
  { to: '/admin/reports', label: 'Reports' },
]

export default function AdminReports() {
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboard(), getAllProjects()])
      .then(([statsRes, projRes]) => {
        setStats(statsRes.data)
        setProjects(projRes.data)
      }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="dashboard-layout"><Sidebar links={links} /><div className="dashboard-content"><Loader /></div></div>

  const openCount = projects.filter((p) => p.status === 'OPEN').length
  const inProgressCount = projects.filter((p) => p.status === 'IN_PROGRESS').length
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length
  const cancelledCount = projects.filter((p) => p.status === 'CANCELLED').length
  const total = projects.length || 1

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>Reports</h2>
        <div className="detail-card">
          <h3>Project Status Breakdown</h3>
          <div className="report-bars">
            <div className="report-bar-row"><span>Open</span><div className="report-bar-track"><div className="report-bar-fill" style={{ width: `${(openCount / total) * 100}%`, background: '#3b82f6' }} /></div><span>{openCount}</span></div>
            <div className="report-bar-row"><span>In Progress</span><div className="report-bar-track"><div className="report-bar-fill" style={{ width: `${(inProgressCount / total) * 100}%`, background: '#f59e0b' }} /></div><span>{inProgressCount}</span></div>
            <div className="report-bar-row"><span>Completed</span><div className="report-bar-track"><div className="report-bar-fill" style={{ width: `${(completedCount / total) * 100}%`, background: '#10b981' }} /></div><span>{completedCount}</span></div>
            <div className="report-bar-row"><span>Cancelled</span><div className="report-bar-track"><div className="report-bar-fill" style={{ width: `${(cancelledCount / total) * 100}%`, background: '#ef4444' }} /></div><span>{cancelledCount}</span></div>
          </div>
        </div>
        <div className="dashboard-cards">
          <div className="dashboard-card"><div className="dashboard-card-value">{stats.totalClients}</div><div className="dashboard-card-title">Clients</div></div>
          <div className="dashboard-card"><div className="dashboard-card-value">{stats.totalFreelancers}</div><div className="dashboard-card-title">Freelancers</div></div>
        </div>
      </div>
    </div>
  )
}
