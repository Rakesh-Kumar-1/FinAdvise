import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/ManagerProfile.css";
import axios from "axios";

const AdvisorCard = ({ advisor, onClick, isInactive }) => (
  <div className={`manager-card ${isInactive ? "inactive" : ""}`}>
    <h3>{advisor.fullname}</h3>
    <p>
      <strong>Email:</strong> {advisor.email}
    </p>
    <p>
      <strong>Department:</strong> {advisor.department}
    </p>
    <p>
      <strong>Experience:</strong> {advisor.experience} years
    </p>
    <button className="info-link" onClick={() => onClick(advisor)}>
      View Info
    </button>
  </div>
);

const AdvisorDetails = ({ advisor}) => (
    <div className="advisor-details-container">
        <div className="advisor-details-card">
            <div className="details-header">
                <img
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${advisor.fullname}`}
                    alt="Avatar"
                    className="details-avatar"
                />
                <div className="details-header-info">
                    <h2>{advisor.fullname}</h2>
                    <p className="details-email">{advisor.email}</p>
                    <span className={`status-pill ${advisor.isActive === false ? 'inactive' : 'active'}`}>
                        {advisor.isActive === false ? 'Inactive' : 'Active'}
                    </span>
                </div>
            </div>
            <div className="details-body">
                <h4>Advisor Information</h4>
                <div className="details-grid">
                    <p><strong>Department:</strong> {advisor.department}</p>
                    <p><strong>Experience:</strong> {advisor.experience} years</p>
                    <p><strong>ID:</strong> {advisor._id}</p>
                    <p><strong>Phone:</strong> {advisor.phone.slice(1) || "N/A"}</p>
                </div>
                <h4>Bio</h4>
                <p className="details-bio">
                    {advisor.bio || "No biography provided. This advisor is dedicated to their field and brings a wealth of experience to the team."}
                </p>
            </div>
        </div>
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
          axios.get("https://finadvise-backend.onrender.com/manager/fetch-active"),
          axios.get("https://finadvise-backend.onrender.com/manager/fetch-inactive"),
        ]);
        setActive(activeRes.data.info);
        setInactive(inactiveRes.data.info);
      } catch (error) {
        console.error("Error fetching advisors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const showDetails = useCallback((advisor) => {
    setSelectedAdvisor(advisor);
    // setShowData(true);
  },[]);

  if (loading) {
    return (
      <div className="manager-container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-container">
      <nav className="manager-navbar">
        <div className="manager-nav-links">
          <button onClick={() => navigate("/advisor-application")}>
            New Advisor
          </button>
          <div className="manager-dropdown">
            <span>Complaints</span>
            <ul className="dropdown-menu">
              <li onClick={() => navigate('/manager/complain/user')}>User</li>
              <li onClick={() => navigate('/manager/complain/advisor')}>Advisor</li>
            </ul>
          </div>
          <button onClick={() => navigate("/manager/transcation")}>
            Transaction Record
          </button>
          <a href="mailto:official@example.com">Email</a>
        </div>
      </nav>

      {selectedAdvisor ? (
        <AdvisorDetails advisor={selectedAdvisor} />
      ) : (
        <>
          <section className="manager-section">
            <h2>Active Advisors</h2>
            <div className="manager-grid">
              {active.map((advisor) => (
                <AdvisorCard
                  key={advisor._id}
                  advisor={advisor}
                  onClick={showDetails}
                />
              ))}
            </div>
          </section>
          <section className="manager-section">
            <h2>Inactive Advisors</h2>
            <div className="manager-grid">
              {inactive.map((advisor) => (
                <AdvisorCard
                  key={advisor._id}
                  advisor={advisor}
                  onClick={showDetails}
                  isInactive
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ManagerProfile;
