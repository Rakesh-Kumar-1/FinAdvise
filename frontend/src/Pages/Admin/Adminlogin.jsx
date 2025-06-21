import React, { useEffect, useState, useCallback } from 'react';
import "../../CSS/Adminlogin.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [label, setLabel] = useState('Manager');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = useCallback(async (type) => {
    try {
      let url = '';
      let newLabel = '';

      switch (type) {
        case 'user':
          url = `http://localhost:8080/admin/complaiall/${'user'}`;
          newLabel = 'User Complain';
          break;
        case 'advisor':
          url = `http://localhost:8080/admin/complainall/${'advisor'}`;
          newLabel = 'Advisor Complain';
          break;
        default:
          url = 'http://localhost:8080/admin/fetch-manager';
          newLabel = 'Manager';
      }

      setLabel(newLabel);
      const response = await axios.get(url);
      setItems(response.data.data);
    } catch (error) {
      console.error(`Error fetching data for ${type}:`, error);
    }
  }, []);

  useEffect(() => {
    fetchData(); // Fetch default manager data on mount
  }, [fetchData]);

  const renderCard = (item, index) => {
    return (
      <div key={index} className="manager-card">
        <h3>{item.name}</h3>
        <p><strong>Email:</strong> {item.email}</p>
        {label === 'Manager' && (
          <>
            <p><strong>Department:</strong> {item.department}</p>
            <p><strong>Experience:</strong> {item.experience} years</p>
          </>
        )}
        {(label === 'User Complain' || label === 'Advisor Complain') && (
          <>
            <p><strong>Subject:</strong> {item.subject}</p>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Status:</strong>{item.status}</p>
          </>
        )}
        <button
          className="book-now"
          onClick={() => {
            setSelectedItem(item);
            setShowModal(true);
          }}
        >
          Info
        </button>
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal || !selectedItem) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Details</h2>
          <p><strong>Name:</strong> {selectedItem.sender}</p>
          <p><strong>Email:</strong> {selectedItem.email}</p>
          {selectedItem.subject && <p><strong>Subject:</strong> {selectedItem.subject}</p>}
          {selectedItem.description && <p><strong>Description:</strong> {selectedItem.description}</p>}
          {/* {selectedItem.experience && <p><strong>Experience:</strong> {selectedItem.experience} years</p>} */}
          {selectedItem.date && <p><strong>Date:</strong> {selectedItem.date}</p>}
          <p><strong>ID:</strong> {selectedItem._id}</p>

          <button onClick={() => setShowModal(false)} className="close-btn">
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`admin-page ${showModal ? 'blurred' : ''}`}>
        <nav className="admin-navbar">
          <div className="admin-nav-right">
            <button className="admin-nav-link" onClick={() => navigate('/create-manager')}>
              Create Manager
            </button>

            <div className="admin-dropdown">
              <span className="admin-menu-title">Complain</span>
              <ul className="admin-dropdown-content">
                <li onClick={() => fetchData('user')}>User</li>
                <li onClick={() => fetchData('advisor')}>Advisor</li>
              </ul>
            </div>

            <div className="admin-dropdown">
              <span className="admin-menu-title">Transaction</span>
            <ul className='admin-dropdown-content'>
              <li onClick={()=>navigate(`/transaction/${'user'}`)}>User</li>
              <li onClick={()=>navigate(`/transaction/${'advisor'}`)}>User</li>
            </ul>
            </div>

            <a className="admin-nav-link" href="mailto:official@example.com">
              Email
            </a>
          </div>
        </nav>

        <main className="manager-list">
          <h2>List of {label}</h2>
          <div className="manager-grid">
            {items.length > 0 ? items.map(renderCard) : <p>No data available</p>}
          </div>
        </main>
      </div>

      {renderModal()}
    </>
  );
};

export default AdminLogin;
