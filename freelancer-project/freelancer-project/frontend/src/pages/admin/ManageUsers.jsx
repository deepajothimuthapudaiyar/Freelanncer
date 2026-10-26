import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import { getAllUsers, deleteUser } from '../../services/adminService'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/projects', label: 'Manage Projects' },
  { to: '/admin/reports', label: 'Reports' },
]

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    getAllUsers().then((res) => setUsers(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    await deleteUser(id)
    load()
  }

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>Manage Users</h2>
        {loading ? <Loader /> : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role.replace('ROLE_', '')}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
