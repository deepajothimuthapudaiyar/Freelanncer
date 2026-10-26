import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar({ links }) {
  return (
    <aside className="sidebar">
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}
