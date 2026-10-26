import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function ProjectCard({ project, linkPrefix }) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h4>{project.title}</h4>
        <StatusBadge status={project.status} />
      </div>
      <p className="project-card-desc">{project.description?.slice(0, 140)}{project.description?.length > 140 ? '...' : ''}</p>
      <div className="project-card-meta">
        <span>Budget: ${project.budget}</span>
        {project.deadline && <span>Deadline: {project.deadline}</span>}
      </div>
      <Link className="btn btn-outline btn-sm" to={`${linkPrefix || ''}/projects/${project.id}`}>View Details</Link>
    </div>
  )
}
