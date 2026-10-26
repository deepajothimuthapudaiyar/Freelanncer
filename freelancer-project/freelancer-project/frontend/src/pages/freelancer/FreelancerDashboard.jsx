import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import DashboardCard from '../../components/DashboardCard'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { getApplicationsForFreelancer } from '../../services/applicationService'
import { getMyProjects } from '../../services/projectService'
import { getMyProfile } from '../../services/userService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function FreelancerDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [projects, setProjects] = useState([])
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getApplicationsForFreelancer(user.userId),
      getMyProjects(),
      getMyProfile(),
    ]).then(([appRes, projRes, profileRes]) => {
      setApplications(appRes.data)
      setProjects(projRes.data)
      setRating(profileRes.data.averageRating || 0)
    }).finally(() => setLoading(false))
  }, [user])

  const accepted = applications.filter((a) => a.status === 'ACCEPTED').length
  const active = projects.filter((p) => p.status === 'IN_PROGRESS').length
  const completed = projects.filter((p) => p.status === 'COMPLETED').length

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <div className="page-header">
          <h2>Freelancer Dashboard</h2>
          <Link to="/freelancer/browse" className="btn btn-primary">Browse Projects</Link>
        </div>
        {loading ? <Loader /> : (
          <div className="dashboard-cards">
            <DashboardCard title="Applied Projects" value={applications.length} />
            <DashboardCard title="Accepted Projects" value={accepted} accent="accent-blue" />
            <DashboardCard title="Active Projects" value={active} accent="accent-orange" />
            <DashboardCard title="Completed Projects" value={completed} accent="accent-green" />
            <DashboardCard title="Average Rating" value={rating ? `${rating} / 5` : 'N/A'} accent="accent-purple" />
          </div>
        )}
      </div>
    </div>
  )
}
