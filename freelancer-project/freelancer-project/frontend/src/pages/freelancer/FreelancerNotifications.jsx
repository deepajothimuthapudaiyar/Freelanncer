import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import { getMyNotifications, markAsRead } from '../../services/notificationService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function FreelancerNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    getMyNotifications().then((res) => setNotifications(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRead = async (id) => {
    await markAsRead(id)
    load()
  }

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>Notifications</h2>
        {loading ? <Loader /> : (
          <ul className="notification-list">
            {notifications.length === 0 && <p className="empty-state">No notifications.</p>}
            {notifications.map((n) => (
              <li key={n.id} className={n.isRead ? 'read' : 'unread'} onClick={() => !n.isRead && handleRead(n.id)}>
                <p>{n.message}</p>
                <span>{new Date(n.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
