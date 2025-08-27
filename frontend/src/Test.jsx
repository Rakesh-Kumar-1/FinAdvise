import React from 'react'

const Test = () => {
  return (
    <div>Test</div>
  )
}

export default Test

// import axios from 'axios';
// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { FaArrowCircleUp, FaArrowCircleDown, FaEye, FaCheck, FaTimes, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
// import '@react-pdf-viewer/core/lib/styles/index.css';
// // import '../../CSS/AdvisorApprove.css';

// const AdvisorApprove = () => {
//   const [advisors, setAdvisors] = useState([]);
//   const [showIndex, setShowIndex] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState(null);

//   const fetchDisapproved = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get('http://localhost:8080/manager/disapprovelist');
//       setAdvisors(res.data.info || []);
//     } catch (err) {
//       console.error("Error fetching disapproved advisors:", err);
//       alert("Failed to fetch advisors. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDisapproved();
//   }, [fetchDisapproved]);

//   const handleApprove = async (id) => {
//     if (processingId) return; // Prevent multiple clicks
    
//     try {
//       setProcessingId(id);
//       const approve = await axios.post(`http://localhost:8080/manager/approve/${id}`);
//       if (approve.data.message === 'Advisor created successfully') {
//         alert("Advisor approved successfully.");
//         await fetchDisapproved();
//         setShowIndex(null);
//       }
//     } catch (err) {
//       console.error("Approval failed:", err);
//       alert("Failed to approve advisor.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const handleReject = async (id) => {
//     if (processingId) return; // Prevent multiple clicks
    
//     if (!window.confirm("Are you sure you want to reject this advisor?")) {
//       return;
//     }

//     try {
//       setProcessingId(id);
//       const reject = await axios.post(`http://localhost:8080/manager/reject/${id}`);
//       if (reject.data.message === 'Advisor delete successfully') {
//         alert("Advisor rejected.");
//         await fetchDisapproved();
//         setShowIndex(null);
//       }
//     } catch (err) {
//       console.error("Rejection failed:", err);
//       alert("Failed to reject advisor.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const toggleDetails = (index) => {
//     setShowIndex(showIndex === index ? null : index);
//   };

//   // Memoize profile photo conversion to prevent re-rendering issues
//   const getProfilePhotoSrc = useMemo(() => {
//     return (profilePhoto) => {
//       if (!profilePhoto || !profilePhoto.data) return null;
      
//       try {
//         // Handle both Buffer and base64 string data
//         let base64Image;
//         if (typeof profilePhoto.data === 'string') {
//           base64Image = profilePhoto.data;
//         } else if (profilePhoto.data.type === 'Buffer') {
//           base64Image = btoa(String.fromCharCode(...profilePhoto.data.data));
//         } else {
//           base64Image = profilePhoto.data.toString('base64');
//         }
        
//         const contentType = profilePhoto.contentType || 'image/jpeg';
//         return `data:${contentType};base64,${base64Image}`;
//       } catch (error) {
//         console.error("Error converting profile photo:", error);
//         return null;
//       }
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="advisor-approve-container">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <p>Loading advisors...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="advisor-approve-container">
//       <div className="page-header">
//         <h2>Advisors Awaiting Approval</h2>
//         <p className="subtitle">Review and approve advisor applications</p>
//       </div>

//       <div className="advisor-grid">
//         {advisors.length === 0 ? (
//           <div className="no-advisors">
//             <p>✅ No advisors pending approval.</p>
//           </div>
//         ) : (
//           advisors.map((item, index) => (
//             <div key={item._id || index} className="advisor-card">
//               <div className="advisor-header">
//                 <div className="advisor-basic-info">
//                   <div className="index-badge">{index + 1}</div>
//                   <div className="name-section">
//                     <h3 className="advisor-name">{item.fullname}</h3>
//                     <p className="qualification">{item.qualification}</p>
//                   </div>
//                 </div>
                
//                 <div className="timestamp">
//                   <div className="date">
//                     {new Date(item.createdAt).toLocaleDateString('en-GB', {
//                       day: '2-digit',
//                       month: 'short',
//                       year: 'numeric'
//                     })}
//                   </div>
//                   <div className="time">
//                     {new Date(item.createdAt).toLocaleTimeString('en-IN', {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       hour12: true
//                     })}
//                   </div>
//                 </div>

//                 <div className="action-buttons">
//                   <button 
//                     className="toggle-btn"
//                     onClick={() => toggleDetails(index)}
//                     title={showIndex === index ? "Hide Details" : "Show Details"}
//                   >
//                     {showIndex === index ? <FaArrowCircleUp /> : <FaArrowCircleDown />}
//                   </button>
//                   <button 
//                     className="approve-btn"
//                     onClick={() => handleApprove(item._id)}
//                     disabled={processingId === item._id}
//                     title="Approve Advisor"
//                   >
//                     <FaCheck />
//                     {processingId === item._id ? 'Processing...' : 'Approve'}
//                   </button>
//                   <button 
//                     className="reject-btn"
//                     onClick={() => handleReject(item._id)}
//                     disabled={processingId === item._id}
//                     title="Reject Advisor"
//                   >
//                     <FaTimes />
//                     {processingId === item._id ? 'Processing...' : 'Reject'}
//                   </button>
//                 </div>
//               </div>

//               {/* Details Panel */}
//               {showIndex === index && (
//                 <div className="advisor-details">
//                   <div className="details-grid">
//                     {/* Contact Information */}
//                     <div className="detail-section">
//                       <h4>Contact Information</h4>
//                       <div className="contact-info">
//                         <div className="contact-item">
//                           <FaPhone className="icon" />
//                           <span>{item.phone}</span>
//                         </div>
//                         <div className="contact-item">
//                           <FaEnvelope className="icon" />
//                           <span>{item.email}</span>
//                         </div>
//                         <div className="contact-item">
//                           <FaLinkedin className="icon" />
//                           <a href={item.linkedIn} target="_blank" rel="noopener noreferrer">
//                             LinkedIn Profile
//                           </a>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Professional Info */}
//                     <div className="detail-section">
//                       <h4>Professional Information</h4>
//                       <div className="professional-info">
//                         <p><strong>Experience:</strong> {item.experience} years</p>
//                         <p><strong>Bio:</strong> {item.bio}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Profile Photo */}
//                   <div className="detail-section">
//                     <h4>Profile Photo</h4>
//                     <div className="profile-photo-container">
//                       {item.profilePhoto ? (
//                         <img
//                           src={getProfilePhotoSrc(item.profilePhoto)}
//                           alt={`${item.fullname}'s profile`}
//                           className="profile-photo"
//                           onError={(e) => {
//                             console.error("Error loading profile photo");
//                             e.target.src = '/placeholder-avatar.png'; // Add a placeholder
//                           }}
//                         />
//                       ) : (
//                         <div className="no-photo">No profile photo available</div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Certificates */}
//                   <div className="detail-section">
//                     <h4>Certificates ({item.images?.length || 0})</h4>
//                     <div className="certificates-grid">
//                       {item.images?.map((img, i) => (
//                         <div key={i} className="certificate-item">
//                           <div className="certificate-info">
//                             <span className="filename">{img}</span>
//                           </div>
//                           <a
//                             href={`http://localhost:8080/user/certificate/${img}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="view-certificate-btn"
//                           >
//                             View Certificate
//                           </a>
//                         </div>
//                       )) || <p>No certificates uploaded</p>}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdvisorApprove;