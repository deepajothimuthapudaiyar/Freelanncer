import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Find the right freelancer. Hire with confidence.</h1>
        <p>FreelancerHub connects clients with skilled freelancers to get projects done — post work, receive bids, track progress, and pay with confidence.</p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Login</Link>
          </div>
        )}
      </section>
      <section className="features">
        <div className="feature-card">
          <h3>Post Projects</h3>
          <p>Clients describe their project, set a budget and deadline, and receive proposals from freelancers.</p>
        </div>
        <div className="feature-card">
          <h3>Submit Bids</h3>
          <p>Freelancers browse open projects, submit competitive bids with delivery timelines and proposals.</p>
        </div>
        <div className="feature-card">
          <h3>Track Progress</h3>
          <p>Manage tasks, track completion progress, and deliver work — all in one place.</p>
        </div>
        <div className="feature-card">
          <h3>Rate & Review</h3>
          <p>Build reputation with ratings and reviews after every completed project.</p>
        </div>
      </section>
    </div>
  )
}
