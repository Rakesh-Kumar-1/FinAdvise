import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '../../CSS/AdvisorApprove.css';

const AdvisorApprove = () => {
  const [advisors, setAdvisors] = useState([]);
  const [showIndex, setShowIndex] = useState(null);

  const fetchDisapproved = async () => {
    try {
      const res = await axios.get('http://localhost:8080/manager/disapprovelist');
      setAdvisors(res.data.info);
    } catch (err) {
      console.log("Error fetching disapproved advisors:", err);
    }
  };

  useEffect(() => {
    fetchDisapproved();
  }, []);

  const handleApprove = async (id) => {
    try {
      const approve = await axios.post(`http://localhost:8080/manager/approve/${id}`);
      if (approve.data.message === 'Advisor created successfully') {
        alert("Advisor approved successfully.");
        await fetchDisapproved();
        setShowIndex(null);
      }
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve advisor.");
    }
  };

  const handleReject = async (id) => {
    try {
      const reject = await axios.post(`http://localhost:8080/manager/reject/${id}`);
      if (reject.data.message === 'Advisor delete successfully') {
        alert("Advisor rejected.");
        await fetchDisapproved();
        setShowIndex(null);
      }
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject advisor.");
    }
  };

  return (
    <div className="advisor-approve-container">
      <h2>Advisors Awaiting Approval</h2>
      <div className="advisor-grid">
        {advisors.length === 0 ? (
          <p>No advisors pending approval.</p>
        ) : (
          advisors.map((item, index) => (
            <div key={index} className="advisor-card">
              <div className="advisor-header-row">
                <div className="header-cell index">{index + 1}.</div>
                <div className="header-cell name">{item.fullname}</div>
                <div className="header-cell date">
                  {new Date(item.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="header-cell time">
                  {new Date(item.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </div>
                <div className="header-cell buttons">
                  <button onClick={() => setShowIndex(index)}><FaArrowCircleDown /></button>
                  <button onClick={() => setShowIndex(null)}><FaArrowCircleUp /></button>
                  <button className="accept-btn" onClick={() => handleApprove(item._id)}>Approve</button>
                  <button className="reject-btn" onClick={() => handleReject(item._id)}>Reject</button>
                </div>
              </div>

              {/* Conditionally render details */}
              {showIndex === index && (
                <div className={`downdescription downdescription-${index}`}>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Bio:</strong> {item.bio}</p>
                  <p><strong>LinkedIn:</strong> {item.linkedIn}</p>
                  <p><strong>Experience:</strong> {item.experience} years</p>
                  <div>
                    {item.images.map((img, i) => (
                      <div key={i} style={{ marginBottom: '15px' }}>
                        <a href={`http://localhost:8080/files/${img}`} target="_blank" rel="noopener noreferrer">
                          📄 View PDF
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvisorApprove;
