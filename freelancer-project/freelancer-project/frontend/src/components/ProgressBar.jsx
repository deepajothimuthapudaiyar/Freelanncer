import React from 'react'

export default function ProgressBar({ percentage }) {
  return (
    <div className="progress-bar-track">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      <span className="progress-bar-label">{percentage}%</span>
    </div>
  )
}
