import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/ManagerProfile.css';
import axios from 'axios';

const AdvisorCard = ({ advisor, onClick, isInactive }) => (
  <div className={`manager-card ${isInactive ? 'inactive' : ''}`}>
    <h3>{advisor.fullname}</h3>
    <p><strong>Email:</strong> {advisor.email}</p>
    <p><strong>Department:</strong> {advisor.department}</p>
    <p><strong>Experience:</strong> {advisor.experience} years</p>
    <button className='info-link' onClick={() => onClick(advisor)}>View Info</button>
  </div>
);

const ManagerProfile = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState([]);
  const [inactive, setInactive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showData, setShowData] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const [activeRes, inactiveRes] = await Promise.all([
          axios.get('http://localhost:8080/manager/fetch-active'),
          axios.get('http://localhost:8080/manager/fetch-inactive'),
        ]);
        setActive(activeRes.data.data);
        setInactive(inactiveRes.data.data);
      } catch (error) {
        console.error('Error fetching advisors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const showDetails = useCallback((advisor) => {
    setSelectedAdvisor(advisor);
    setShowData(true);
  }, []);

  // Optional sorting (uncomment if needed)
  // const sortedActive = useMemo(() => [...active].sort((a, b) => a.fullname.localeCompare(b.fullname)), [active]);
  // const sortedInactive = useMemo(() => [...inactive].sort((a, b) => a.fullname.localeCompare(b.fullname)), [inactive]);

  return (
    <div className="manager-container">
      <nav className="manager-navbar">
        <div className="manager-nav-links">
          <button onClick={() => navigate('/advisor-application')}>New Advisor</button>

          <div className="manager-dropdown">
            <span>Complain</span>
            <ul className="dropdown-menu">
              <li onClick={() => navigate(`/complain/user`)}>User</li>
              <li onClick={() => navigate(`/complain/advisor`)}>Advisor</li>
            </ul>
          </div>

          <button onClick={() => navigate('/manager/transcation')}>Transaction Record</button>
          <a href="mailto:official@example.com">Email</a>
        </div>
      </nav>

      {loading ? (
        <p>Loading advisors...</p>
      ) : !showData ? (
        <>
          <section className="manager-section">
            <h2>Active Advisors</h2>
            <div className="manager-grid">
              {active.map((advisor) => (
                <AdvisorCard key={advisor._id} advisor={advisor} onClick={showDetails} />
              ))}
            </div>
          </section>

          <section className="manager-section">
            <h2>Inactive Advisors</h2>
            <div className="manager-grid">
              {inactive.map((advisor) => (
                <AdvisorCard key={advisor._id} advisor={advisor} onClick={showDetails} isInactive />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="manager-section">
          <h2>Advisor Details</h2>
          <div className="manager-grid">
            <div key={selectedAdvisor._id} className="manager-card inactive">
              <h3>{selectedAdvisor.fullname}</h3>
              <p><strong>Email:</strong> {selectedAdvisor.email}</p>
              <p><strong>Phone:</strong> {selectedAdvisor.phone}</p>
              <p><strong>LinkedIn:</strong> {selectedAdvisor.linkedIn}</p>
              <p><strong>Experience:</strong> {selectedAdvisor.experience} years</p>
              <p><strong>Bio:</strong> {selectedAdvisor.bio}</p>
              <p><strong>Qualification:</strong> {selectedAdvisor.qualification}</p>
              <p><strong>Rating:</strong> {selectedAdvisor.rating}</p>
              <p><strong>Client:</strong> {selectedAdvisor.client}</p>
              <button onClick={() => setShowData(false)}>Back</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ManagerProfile;