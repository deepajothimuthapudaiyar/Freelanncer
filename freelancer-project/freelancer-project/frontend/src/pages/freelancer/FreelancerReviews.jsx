import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { getReviewsForUser } from '../../services/reviewService'

const links = [
  { to: '/freelancer/dashboard', label: 'Dashboard' },
  { to: '/freelancer/browse', label: 'Browse Projects' },
  { to: '/freelancer/applications', label: 'My Applications' },
  { to: '/freelancer/projects', label: 'My Projects' },
  { to: '/freelancer/profile', label: 'Profile' },
  { to: '/freelancer/reviews', label: 'Reviews' },
]

export default function FreelancerReviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReviewsForUser(user.userId).then((res) => setReviews(res.data)).finally(() => setLoading(false))
  }, [user])

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <h2>My Reviews</h2>
        {loading ? <Loader /> : (
          <div className="review-list">
            {reviews.length === 0 && <p className="empty-state">No reviews yet.</p>}
            {reviews.map((r) => (
              <div className="review-card" key={r.id}>
                <div className="review-rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p>{r.comment}</p>
                <span className="review-meta">by {r.reviewer.name} — {new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
