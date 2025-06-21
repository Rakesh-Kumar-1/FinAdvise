import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '../../CSS/AdvisorApprove.css';

const AdvisorApprove = () => {
  const [advisors, setAdvisors] = useState([]);
  const [visibleDescriptions, setVisibleDescriptions] = useState({});

  useEffect(() => {
    const fetchDisapproved = async () => {
      try {
        const res = await axios.get('http://localhost:8080/manager/disapprovelist');
        setAdvisors(res.data.info);
      } catch (err) {
        console.log("Error fetching disapproved advisors:", err);
      }
    };
    fetchDisapproved();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8080/manager/approve/${id}`);
      alert("Advisor approved successfully.");
      setAdvisors(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve advisor.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:8080/manager/reject/${id}`);
      alert("Advisor rejected.");
      setAdvisors(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject advisor.");
    }
  };

  const toggleDescription = (index) => {
    setVisibleDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
                  <button onClick={() => toggleDescription(index)}>
                    {visibleDescriptions[index] ? <FaArrowCircleUp /> : <FaArrowCircleDown />}
                  </button>
                  <button className="accept-btn" onClick={() => handleApprove(item._id)}>Approve</button>
                  <button className="reject-btn" onClick={() => handleReject(item._id)}>Reject</button>
                </div>
              </div>

              {/* Description Row */}
              {visibleDescriptions[index] && (
                <div className="downdescription">
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Bio:</strong> {item.bio}</p>
                  <p><strong>Experience:</strong> {item.experience} years</p>
                  {item.images?.length > 0 && (
                    <div className="pdf-previews">
                      {item.images.map((img, i) => (
                        <div key={i} style={{ marginTop: '10px', height: '600px' }}>
                          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                            <Viewer fileUrl={`http://localhost:8080/files/${img}`} />
                          </Worker>
                        </div>
                      ))}
                    </div>
                  )}
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
