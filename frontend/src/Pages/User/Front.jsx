import React, { useEffect, useState, useContext } from 'react';
import '../../CSS/Front.css';
import { Link, useNavigate } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart } from "react-icons/ai";
import axios from 'axios';
import { UserContext } from '../Context/UserContext';

const Front = () => {
  const navigate = useNavigate();
  const [advisors, setAdvisors] = useState([]);
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);
  const [likePage, setLikePage] = useState(false);
  const [showComplainForm, setShowComplainForm] = useState(false);
  const { position, setPosition } = useContext(UserContext);
  const [followedIds, setFollowedIds] = useState(new Set());

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/fetch-advisor');
        setAdvisors(response.data.data);
      } catch (error) {
        console.error('Error fetching advisors:', error);
      }
    };
    fetchAdvisors();
  }, []);

  useEffect(() => {
    if (position?.follows) {
      setFollowedIds(new Set(position.follows));
    }
  }, [position]);

  const handleComplainClick = () => {
    setShowComplainForm(true);
  };

  const searchList = (e) => {
    const value = e.target.value;
    setSearch(value);
    const newList = advisors.filter((item) =>
      item.fullname.toLowerCase().includes(value.toLowerCase())
    );
    setFilter(newList);
  };

  const followRequest = async (id) => {
    try {
      const user = position._id;
      const res = await axios.post('http://localhost:8080/user/followrequest', { id, user });

      if (res.data.status === true) {
        setPosition(res.data.info); // update context
        setFollowedIds(prev => {
          const updated = new Set(prev);
          if (updated.has(id)) {
            updated.delete(id);
          } else {
            updated.add(id);
          }
          return updated;
        });
      }
    } catch (error) {
      console.log("Follow error:", error);
    }
  };

  const complainForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/user/complainForm', {
        sender,
        subject,
        description,
        role: 'user'
      });

      if (res.data.message === 'Successfull') {
        alert('Complain has been raised. It will be resolved within a few days.');
        setShowComplainForm(false);
        setSender('');
        setSubject('');
        setDescription('');
      }
    } catch (err) {
      console.log(err);
      alert('Failed to raise complain.');
    }
  };

  return (
    <div className="front-page">
      <nav className="navbar">
        <div className="nav-right">
          <span className="nav-link" onClick={() => navigate(0)}>Home</span>
          <span className="advisor-name" onClick={() => navigate('/apply')}>Apply for Advisor</span>
          <span className="nav-link" onClick={() => navigate('/join-meeting')}>Join Meeting</span>
          <span className="nav-link" onClick={handleComplainClick}>Complain</span>
          <span className="nav-link" onClick={() => setLikePage(true)}>
            <img src='' alt='Like' />
          </span>
          <img src={position?.image} alt="User Profile" className="profile-img" onClick={()=> navigate('/setting')}/>
        </div>
      </nav>

      <main className="search-section">
        <div className="search-bar">
          <input type="text" placeholder="🔍 Search advisors by name..." value={search} onChange={searchList} />
        </div>
      </main>

      <main className="advisor-list">
        <div className="advisor-grid">
          {likePage ? (
            position?.follows?.length > 0 ? (
              position.follows.map((item, index) => (
                <div key={index} className="advisor-card">
                  <h3>{item.name}</h3>
                  <p><strong>Image:</strong><img src={item.image} alt={item.fullname} className="advisor-image" /></p>
                  <p><strong>Bio:</strong> {item.bio}</p>
                  <p><strong>Experience:</strong> {item.experience} years</p>
                  <p><strong>Rating:</strong> {item.rating}</p>
                  <p><strong>Clients:</strong> {item.clients}</p>
                  <Link className="book-now" to={`/advisorinfo/${item._id}`}>Info</Link>
                </div>
              ))
            ) : (
              <p>No followed advisors found.</p>
            )
          ) : (
            (search === '' ? advisors : filter).map((item, index) => {
              const isFollowed = followedIds.has(item._id);
              return (
                <div key={index} className="advisor-card">
                  <h3>{item.name}</h3>
                  <p><strong>Image:</strong><img src={item.image} alt={item.fullname} className="advisor-image" /></p>
                  <p><strong>Bio:</strong> {item.bio}</p>
                  <p><strong>Experience:</strong> {item.experience} years</p>
                  <p><strong>Rating:</strong> {item.rating}</p>
                  <p><strong>Clients:</strong> {item.clients}</p>
                  <Link className="book-now" to={`/advisorinfo/${item._id}`}>Info</Link>
                  <button
                    className="follow-btn"
                    onClick={() => followRequest(item._id)}
                    title={isFollowed ? "Unfollow" : "Follow"}
                  >
                    {isFollowed ? <FcLike size={24} /> : <AiOutlineHeart size={24} />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>

      {showComplainForm && (
        <form className="compose-window" onSubmit={complainForm}>
          <div className="compose-header">
            <h2>NEW COMPLAINT</h2>
            <button type="button" className="close-btn" onClick={() => setShowComplainForm(false)}>×</button>
          </div>

          <div className="compose-inputs">
            <input
              type='email'
              placeholder='Sender Email'
              name='sender'
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              required
            />
            <input
              type='text'
              placeholder='Subject'
              name='subject'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="compose-body">
            <textarea
              placeholder='Write your complaint...'
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="compose-footer">
            <button type="submit" className="send-btn"><IoSend /></button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Front;
