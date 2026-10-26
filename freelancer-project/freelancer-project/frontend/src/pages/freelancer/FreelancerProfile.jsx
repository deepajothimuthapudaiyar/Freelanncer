import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import { getMyProfile, updateMyProfile } from '../../services/userService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function FreelancerProfile() {
  const [form, setForm] = useState({ skills: '', bio: '', portfolio: '' })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getMyProfile().then((res) => setForm({
      skills: res.data.skills || '',
      bio: res.data.bio || '',
      portfolio: res.data.portfolio || '',
    })).finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateMyProfile(form)
    setSaved(true)
  }

  if (loading) return <div className="dashboard-layout"><Sidebar links={links} /><div className="dashboard-content"><Loader /></div></div>

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>My Profile</h2>
        <form className="form-card" onSubmit={handleSubmit}>
          {saved && <div className="alert alert-success">Profile updated!</div>}
          <label>Skills (comma separated)</label>
          <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, Java" />
          <label>Bio</label>
          <textarea name="bio" rows="4" value={form.bio} onChange={handleChange} />
          <label>Portfolio (links or description)</label>
          <textarea name="portfolio" rows="4" value={form.portfolio} onChange={handleChange} />
          <button className="btn btn-primary" type="submit">Save Profile</button>
        </form>
      </div>
    </div>
  )
}
