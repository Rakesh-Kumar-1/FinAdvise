import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
import '../../CSS/AdvisorDetails.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CounterContext } from '../Context/UserContext';
import axios from 'axios';


const AdvisorDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { id } = useParams();
  const [advisor, setAdvisor] = useState(null);
  const [all, setAll] = useState({})
  const navigate = useNavigate();
  const {position} = useContext(CounterContext);

  useEffect(() => {
    const fetchAdvisor = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/advisor/${id}`);
        const response = await axios.get('http://localhost:8080/user/fetch-advisor');
        setAll(response.data.data);
        setAdvisor(res.data);
      } catch (err) {
        console.error('Failed to fetch advisor:', err);
      }
    };

    fetchAdvisor();
  }, [id]);

  if (!advisor) return <p>Loading...</p>;

  const handleApply = async() => {
    try{
    const participants = [advisor.email,position.email] 
    console.log("Date-->",date);
    console.log("Date-->",time);
    console.log(participants)
    
    // Example: Send to backend to create zoom link
    
    const zoom = axios.post('http://localhost:8080/user/zoom',{participants,date,time})
    if(zoom.data.message === 'Zoom meeting created successfully'){
      console.log(zoom.data.info.join_url)
      console.log(zoom.data.info.meeting_id)
      console.log(zoom.data.info.start_time)
    } 
    }catch(error){
      console.log(error)
    }
    // Close modal
    setShowModal(false);
    navigate('/payment')
  };

  return (
    <>
      {/* Main meeting wrapper (Advisor details & modal) */}
      <div className="meeting-wrapper">
        <div className={`advisor-content ${showModal ? 'blurred' : ''}`}>
          <div className="advisor-detail-box">
            <h2>{advisor.fullname}</h2>
            <p><strong>Experience:</strong> {advisor.experience}</p>
            <p><strong>Bio:</strong> {advisor.bio}</p>
            <p><strong>Rating:</strong> {advisor.rating}</p>
            <p><strong>Clients:</strong> {advisor.clients}</p>
            <div className="review-stars">
              {"★".repeat(advisor.rating)}{"☆".repeat(5 - advisor.rating)}
            </div>
          </div>

          <button className="schedule-button" onClick={() => setShowModal(true)}>
            Schedule Meeting
          </button>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Select Date and Time</h3>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <div className="modal-buttons">
                <button className="apply-btn" onClick={handleApply}>
                  Apply
                </button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendation section BELOW everything */}
      <div className="slider-wrapper">
        <h2>Recommendation</h2>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={100}
          navigation
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[Navigation, EffectCoverflow]}
          className="advisor-swiper"
        >
          {all
            .filter(item => item.experience === advisor.experience && item._id !== advisor._id)
            .map((item, index) => (
              <SwiperSlide key={index}>
                <div className="advisor-card">
                  <h3>{item.name}</h3>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Specialization:</strong> {item.qualification}</p>
                  <Link className="book-now" to={`/advisorinfo/${item._id}`}>Info</Link>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );

};

export default AdvisorDetails;
