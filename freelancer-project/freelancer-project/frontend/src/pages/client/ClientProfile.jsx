import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { updateUser } from '../../services/userService'

const links = [
  { to: '/client/dashboard', label: 'Dashboard' },
  { to: '/client/projects/new', label: 'Create Project' },
  { to: '/client/projects', label: 'My Projects' },
  { to: '/client/profile', label: 'Profile' },
  { to: '/client/reviews', label: 'Reviews' },
]

export default function ClientProfile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateUser(user.userId, { name })
    setSaved(true)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>My Profile</h2>
        <form className="form-card" onSubmit={handleSubmit}>
          {saved && <div className="alert alert-success">Profile updated!</div>}
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={user?.email} disabled />
          <button className="btn btn-primary" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  )
}
