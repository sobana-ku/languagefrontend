import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/MentorDetail.css';

function MentorDetail() {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMentor = async () => {
      try {
        const response = await fetch(`http://localhost:5009/api/mentors/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch mentor details');
        }

        const data = await response.json();
        setMentor(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id, navigate]);

  if (loading) {
    return <div className="mentor-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="mentor-detail-error">Error: {error}</div>;
  }

  if (!mentor) {
    return <div className="mentor-detail-error">Mentor not found</div>;
  }

  return (
    <div className="mentor-detail-container">
      <div className="mentor-detail-card">
        <div className="mentor-header">
          <h1>{mentor.first_name} {mentor.last_name}</h1>
          <button onClick={() => navigate('/mentors')} className="back-button">
            Back to Mentors
          </button>
        </div>

        <div className="mentor-info-section">
          <div className="mentor-basic-info">
            <h2>Languages</h2>
            <p>{mentor.languages_spoken?.join(', ') || 'No languages specified'}</p>

            <h2>Experience</h2>
            <p>{mentor.years_of_experience} years of teaching experience</p>

            <h2>Rate</h2>
            <p>${mentor.price_per_hour}/hour</p>

            <h2>Location</h2>
            <p>{mentor.location}</p>
          </div>

          <div className="mentor-bio">
            <h2>About Me</h2>
            <p>{mentor.bio}</p>
          </div>

          <div className="mentor-certifications">
            <h2>Certifications</h2>
            <ul>
              {mentor.certifications?.map((cert, index) => (
                <li key={index}>{cert}</li>
              )) || <li>No certifications listed</li>}
            </ul>
          </div>

          <div className="mentor-availability">
            <h2>Available Times</h2>
            <ul>
              {mentor.available_times?.map((slot, index) => (
                <li key={index}>
                  {slot.day}: {slot.time_slot}
                </li>
              )) || <li>No availability specified</li>}
            </ul>
          </div>

          <div className="mentor-reviews">
            <h2>Reviews ({mentor.reviews?.length || 0})</h2>
            <div className="overall-rating">
              Overall Rating: {mentor.rating?.toFixed(1) || 'No rating'} / 5
            </div>
            {mentor.reviews?.length > 0 ? (
              <div className="review-list">
                {mentor.reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="reviewer">{review.reviewer}</span>
                      <span className="rating">{review.rating}/5</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorDetail;