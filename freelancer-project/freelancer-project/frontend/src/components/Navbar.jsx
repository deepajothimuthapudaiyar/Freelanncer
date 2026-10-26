import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyNotifications } from '../services/notificationService'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (user) {
      getMyNotifications()
        .then((res) => setUnread(res.data.filter((n) => !n.isRead).length))
        .catch(() => {})
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dashboardPath =
    user?.role === 'ROLE_CLIENT' ? '/client/dashboard' :
    user?.role === 'ROLE_FREELANCER' ? '/freelancer/dashboard' :
    user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/'

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Freelancer<span>Hub</span></Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to={dashboardPath}>Dashboard</Link>
            {user.role !== 'ROLE_ADMIN' && (
              <Link to={`/${user.role === 'ROLE_CLIENT' ? 'client' : 'freelancer'}/notifications`}>
                Notifications {unread > 0 && <span className="badge">{unread}</span>}
              </Link>
            )}
            <span className="navbar-user">{user.name} ({user.role.replace('ROLE_', '')})</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
