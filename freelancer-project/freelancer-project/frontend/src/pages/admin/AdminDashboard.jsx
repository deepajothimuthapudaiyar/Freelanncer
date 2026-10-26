import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import DashboardCard from '../../components/DashboardCard'
import Loader from '../../components/Loader'
import { getDashboard } from '../../services/adminService'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/projects', label: 'Manage Projects' },
  { to: '/admin/reports', label: 'Reports' },
]

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        {loading ? <Loader /> : data && (
          <div className="dashboard-cards">
            <DashboardCard title="Total Users" value={data.totalUsers} />
            <DashboardCard title="Total Clients" value={data.totalClients} accent="accent-blue" />
            <DashboardCard title="Total Freelancers" value={data.totalFreelancers} accent="accent-purple" />
            <DashboardCard title="Total Projects" value={data.totalProjects} />
            <DashboardCard title="Active Projects" value={data.activeProjects} accent="accent-orange" />
            <DashboardCard title="Completed Projects" value={data.completedProjects} accent="accent-green" />
          </div>
        )}
      </div>
    </div>
  )
}
