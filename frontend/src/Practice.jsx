import React, { useEffect, useState, useCallback, memo } from "react";
// import { useNavigate } from "react-router-dom"; // Removed to fix router context error
import axios from "axios";

// --- CSS Styles embedded directly into the component ---
const ManagerProfileCSS = () => (
    <style>{`
        /* --- Global Design System --- */
        :root {
          --primary-color: #4f46e5;
          --primary-color-dark: #4338ca;
          --secondary-color: #64748b;
          --text-primary: #1e293b;
          --text-secondary: #475569;
          --bg-primary: #ffffff;
          --bg-secondary: #f1f5f9;
          --border-color: #e2e8f0;
          --success-color: #10b981;
          --danger-color: #ef4444;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --radius-md: 8px;
          --radius-lg: 16px;
          --transition: all 0.3s ease-in-out;
          --font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* --- Base Styles --- */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: var(--font-family);
          line-height: 1.6;
          color: var(--text-primary);
          background-color: var(--bg-secondary);
        }

        /* --- Main Container & Layout --- */
        .manager-container {
          width: 100%;
          min-height: 100vh;
        }

        .main-content {
          padding: 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* --- Navbar --- */
        .manager-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 1rem 2.5rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .nav-logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .manager-nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .manager-nav-links button,
        .manager-nav-links a {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          text-decoration: none;
          transition: var(--transition);
        }

        .manager-nav-links button:hover,
        .manager-nav-links a:hover,
        .manager-dropdown > span:hover {
          color: var(--primary-color);
          background-color: #eef2ff;
        }

        /* Dropdown Menu */
        .manager-dropdown {
          position: relative;
        }
        .manager-dropdown > span {
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .dropdown-menu {
          display: none;
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-primary);
          min-width: 160px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          padding: 0.5rem;
          list-style: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
        }
        .manager-dropdown:hover .dropdown-menu {
          display: block;
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .dropdown-menu li {
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-radius: 6px;
          transition: var(--transition);
          font-weight: 500;
          color: var(--text-secondary);
        }
        .dropdown-menu li:hover {
          background: var(--primary-color);
          color: white;
        }

        /* --- Sections --- */
        .manager-section {
          margin-bottom: 3rem;
        }
        .manager-section h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        /* --- Advisor Card --- */
        .manager-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .manager-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          animation: fadeIn 0.5s ease-out forwards;
        }

        .manager-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-color);
        }

        /* Inactive Card Styles */
        .manager-card.inactive {
          filter: grayscale(80%);
          background-color: #f8fafc;
        }
        .inactive-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: var(--secondary-color);
          color: white;
          padding: 0.25rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 999px;
          text-transform: uppercase;
        }

        /* Card Content */
        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .card-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--bg-secondary);
        }
        .manager-card h3 {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .card-body p {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .card-body p svg {
          flex-shrink: 0;
        }
        .info-link {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          margin-top: 1rem;
          width: 100%;
        }
        .info-link:hover {
          background: var(--primary-color-dark);
        }

        /* --- Advisor Details View --- */
        .advisor-details-container {
          padding: 2rem;
          animation: fadeIn 0.3s ease-out;
        }
        .advisor-details-card {
          max-width: 800px;
          margin: 0 auto;
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 2.5rem;
        }
        .back-button {
          background: none;
          border: none;
          color: var(--primary-color);
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .details-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .details-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid var(--primary-color);
        }
        .details-header-info h2 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }
        .details-email {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .status-pill {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .status-pill.active { background-color: #d1fae5; color: #065f46; }
        .status-pill.inactive { background-color: #e5e7eb; color: #4b5563; }
        .details-body {
          padding-top: 1.5rem;
        }
        .details-body h4 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .details-grid p {
          background: var(--bg-secondary);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }
        .details-bio {
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* --- Loading, Error, and Empty States --- */
        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          gap: 1rem;
          color: var(--text-secondary);
        }
        .spinner {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 4px solid var(--border-color);
          border-top-color: var(--primary-color);
          animation: spin 1s infinite linear;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .error-container p {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 500;
        }
        .empty-state {
          text-align: center;
          padding: 2rem;
          background-color: var(--bg-primary);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          border: 1px dashed var(--border-color);
        }

        /* --- Responsive Design --- */
        @media (max-width: 768px) {
          .main-content, .manager-navbar {
            padding: 1.5rem;
          }
          .manager-nav-links {
            display: none; /* Simple hiding for mobile, could be a hamburger menu */
          }
          .manager-grid {
            grid-template-columns: 1fr;
          }
          .details-grid {
            grid-template-columns: 1fr;
          }
          .details-header {
            flex-direction: column;
            text-align: center;
          }
        }
    `}</style>
);

// --- SVG Icon Components for a cleaner UI ---
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zm6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.558z"/></svg>
);
const DepartmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM2 2h12v10.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V2zm2-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V.5z"/></svg>
);
const ExperienceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098.5 6.255 5 7.735V14h-1a1 1 0 0 0-1 1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1a1 1 0 0 0-1-1h-1v-.265c4.5-1.48 5-6.637 5-7.735a5.002 5.002 0 0 0-3.005-4.901z"/></svg>
);

// --- Memoized AdvisorCard Component for Performance ---
const AdvisorCard = memo(({ advisor, onClick, isInactive }) => (
    <div
        className={`manager-card ${isInactive ? "inactive" : ""}`}
        onClick={() => onClick(advisor)}
    >
        {isInactive && <div className="inactive-badge">Inactive</div>}
        <div className="card-header">
            <img
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${advisor.fullname}`}
                alt="Avatar"
                className="card-avatar"
            />
            <h3>{advisor.fullname}</h3>
        </div>
        <div className="card-body">
            <p><MailIcon /> {advisor.email}</p>
            <p><DepartmentIcon /> {advisor.department}</p>
            <p><ExperienceIcon /> {advisor.experience} years</p>
        </div>
        <button className="info-link">View Info</button>
    </div>
));

// --- Detailed View Component ---
const AdvisorDetails = ({ advisor, onBack }) => (
    <div className="advisor-details-container">
        <div className="advisor-details-card">
            <button className="back-button" onClick={onBack}>
                &larr; Back to Dashboard
            </button>
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
                    <p><strong>Phone:</strong> {advisor.phone || "N/A"}</p>
                </div>
                <h4>Bio</h4>
                <p className="details-bio">
                    {advisor.bio || "No biography provided. This advisor is dedicated to their field and brings a wealth of experience to the team."}
                </p>
            </div>
        </div>
    </div>
);

// --- Main ManagerProfile Component ---
const ManagerProfile = () => {
    // const navigate = useNavigate(); // Removed to fix router context error
    const [activeAdvisors, setActiveAdvisors] = useState([]);
    const [inactiveAdvisors, setInactiveAdvisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    useEffect(() => {
        const fetchAdvisors = async () => {
            setLoading(true);
            setError(null);
            // Mock data for demonstration as backend is not available
            const mockActive = [
                { _id: '1a', fullname: 'Dr. Evelyn Reed', email: 'e.reed@university.edu', department: 'Quantum Physics', experience: 15, isActive: true },
                { _id: '2b', fullname: 'Prof. Samuel Chen', email: 's.chen@university.edu', department: 'Ancient History', experience: 22, isActive: true },
            ];
            const mockInactive = [
                { _id: '3c', fullname: 'Dr. Isabella Rossi', email: 'i.rossi@university.edu', department: 'Marine Biology', experience: 18, isActive: false },
            ];

            try {
                // In a real app, you would use axios here.
                // For this preview, we'll use mock data.
                // const [activeRes, inactiveRes] = await Promise.all([
                //   axios.get("http://localhost:8080/manager/fetch-active"),
                //   axios.get("http://localhost:8080/manager/fetch-inactive"),
                // ]);
                // setActiveAdvisors(activeRes.data.info || []);
                // setInactiveAdvisors(inactiveRes.data.info || []);
                
                // Using mock data after a short delay to simulate loading
                setTimeout(() => {
                    setActiveAdvisors(mockActive);
                    setInactiveAdvisors(mockInactive);
                    setLoading(false);
                }, 1500);

            } catch (err) {
                console.error("Error fetching advisors:", err);
                setError("Failed to load advisor data. Please try again later.");
                setLoading(false);
            }
        };

        fetchAdvisors();
    }, []);

    const handleShowDetails = useCallback((advisor) => {
        setSelectedAdvisor(advisor);
    }, []);

    const handleBack = useCallback(() => {
        setSelectedAdvisor(null);
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading Advisors...</p>
                </div>
            );
        }

        if (error) {
            return <div className="error-container"><p>{error}</p></div>;
        }

        if (selectedAdvisor) {
            return <AdvisorDetails advisor={selectedAdvisor} onBack={handleBack} />;
        }

        return (
            <>
                <section className="manager-section">
                    <h2>Active Advisors</h2>
                    {activeAdvisors.length > 0 ? (
                        <div className="manager-grid">
                            {activeAdvisors.map((advisor) => (
                                <AdvisorCard
                                    key={advisor._id}
                                    advisor={advisor}
                                    onClick={handleShowDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No active advisors found.</p>
                    )}
                </section>
                <section className="manager-section">
                    <h2>Inactive Advisors</h2>
                    {inactiveAdvisors.length > 0 ? (
                        <div className="manager-grid">
                            {inactiveAdvisors.map((advisor) => (
                                <AdvisorCard
                                    key={advisor._id}
                                    advisor={advisor}
                                    onClick={handleShowDetails}
                                    isInactive
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No inactive advisors found.</p>
                    )}
                </section>
            </>
        );
    };

    // Placeholder navigation handler
    const handleNavigate = (path) => {
        console.log(`Would navigate to ${path}`);
        // In a real app with a Router, this would be: navigate(path);
    };

    return (
        <>
            <ManagerProfileCSS />
            <div className="manager-container">
                <nav className="manager-navbar">
                    <div className="nav-logo">Advisor Dashboard</div>
                    <div className="manager-nav-links">
                        <button onClick={() => handleNavigate("/advisor-application")}>New Advisor</button>
                        <div className="manager-dropdown">
                            <span>Complaints</span>
                            <ul className="dropdown-menu">
                                <li onClick={() => handleNavigate(`/complain/user`)}>User</li>
                                <li onClick={() => handleNavigate(`/complain/advisor`)}>Advisor</li>
                            </ul>
                        </div>
                        <button onClick={() => handleNavigate("/manager/transcation")}>Transaction Record</button>
                        <a href="mailto:support@example.com">Email Support</a>
                    </div>
                </nav>
                <main className="main-content">
                    {renderContent()}
                </main>
            </div>
        </>
    );
};

export default ManagerProfile;

