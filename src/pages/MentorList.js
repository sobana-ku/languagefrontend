import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/MentorList.css';

function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMentors = async () => {
      try {
        const response = await fetch('http://localhost:5009/api/mentors', {
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
          throw new Error('Failed to fetch mentors');
        }

        const data = await response.json();
        setMentors(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMentors();
  }, [navigate]);

  // Get unique languages from mentors safely
  const languages = mentors && mentors.length > 0 
    ? [...new Set(mentors.flatMap(mentor => mentor.languages_spoken || []))]
    : [];

  // Filter mentors based on search and language filter
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      (mentor.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (mentor.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (mentor.languages_spoken || []).some(lang => 
        lang.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesLanguage = 
      filterLanguage === 'all' ||
      (mentor.languages_spoken || []).includes(filterLanguage);

    return matchesSearch && matchesLanguage;
  });

  if (loading) {
    return (
      <div className="mentor-list-page">
        <div className="loading">Loading mentors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mentor-list-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="mentor-list-page">
      <div className="mentor-list-header">
        <h1>Find Your Perfect Mentor</h1>
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by name or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="language-filter"
          >
            <option value="all">All Languages</option>
            {languages.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredMentors.length === 0 ? (
        <div className="no-results">
          <p>No mentors found matching your criteria.</p>
        </div>
      ) : (
        <div className="mentor-grid">
          {filteredMentors.map(mentor => (
           <Link 
           to={`/mentors/${mentor.mentor_id}`} 
           key={mentor.mentor_id}
           className="mentor-card"
         >
              <div className="mentor-info">
                <h3>{mentor.first_name} {mentor.last_name}</h3>
                <p className="languages">
                  {mentor.languages_spoken ? mentor.languages_spoken.join(', ') : 'No languages specified'}
                </p>
                <p className="experience">
                  {mentor.years_of_experience} years of experience
                </p>
                <div className="rating">
                  {mentor.rating?.toFixed(1) || 'No rating'} ({mentor.reviews?.length || 0} reviews)
                </div>
                <p className="hourly-rate">
                  ${mentor.price_per_hour}/hour
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MentorList;