import React from 'react'

export default function DashboardCard({ title, value, accent }) {
  return (
    <div className={`dashboard-card ${accent || ''}`}>
      <div className="dashboard-card-value">{value}</div>
      <div className="dashboard-card-title">{title}</div>
    </div>
  )
}
