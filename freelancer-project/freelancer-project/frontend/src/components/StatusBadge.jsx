import React from 'react'

export default function StatusBadge({ status }) {
  const cls = `status-badge status-${(status || '').toLowerCase()}`
  return <span className={cls}>{status?.replace('_', ' ')}</span>
}
