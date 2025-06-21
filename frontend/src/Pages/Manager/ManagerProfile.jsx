import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSS/ManagerProfile.css';
import axios from 'axios';

const ManagerProfile = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState([]);
  const [inactive, setInactive] = useState([]);

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
    }
  };

  fetchManagers();
}, []);


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

          <button onClick={() => navigate('/transaction-record')}>Transaction Record</button>
          <button onClick={() => navigate('/transactions-advisor')}>Transaction</button>
          <a href="mailto:official@example.com">Email</a>
        </div>
      </nav>

        <>
          <section className="manager-section">
            <h2>Active Advisors</h2>
            <div className="manager-grid">
              {active.map((advisor) => (
                <div key={advisor._id} className="manager-card">
                  <h3>{advisor.fullname}</h3>
                  <p><strong>Email:</strong> {advisor.email}</p>
                  <p><strong>Department:</strong> {advisor.department}</p>
                  <p><strong>Experience:</strong> {advisor.experience} years</p>
                  <Link to={`/advsiorinfo/${advisor._id}`} className="info-link">View Info</Link>
                </div>
              ))}
            </div>
          </section>

          <section className="manager-section">
            <h2>Inactive Advisors</h2>
            <div className="manager-grid">
              {inactive.map((advisor) => (
                <div key={advisor._id} className="manager-card inactive">
                  <h3>{advisor.fullname}</h3>
                  <p><strong>Email:</strong> {advisor.email}</p>
                  <p><strong>Department:</strong> {advisor.department}</p>
                  <p><strong>Experience:</strong> {advisor.experience} years</p>
                  <Link to={`/advisorinfo/${advisor._id}`} className="info-link">View Info</Link>
                </div>
              ))}
            </div>
          </section>
        </>
    </div>
  );
};

export default ManagerProfile;
