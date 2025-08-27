import React, { useEffect, useState, useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import PaymentGateway from '../Payment/PaymentGateway';
import '../../CSS/AdvisorDeta.css'

const AdvisorDeta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { position } = useContext(UserContext);
  const [advisor, setAdvisor] = useState(null);
  const [allAdvisors, setAllAdvisors] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdvisorData();
  }, [id]);

  const fetchAdvisorData = async () => {
    try {
      setLoading(true);
      const [advisorRes, allAdvisorsRes] = await Promise.all([
        axios.get(`http://localhost:8080/user/advisor/${id}`),
        axios.get('http://localhost:8080/user/fetch-advisor')
      ]);
      
      setAdvisor(advisorRes.data?.data || advisorRes.data);
      setAllAdvisors(allAdvisorsRes.data.info);
    } catch (err) {
      setError('Failed to fetch advisor details');
      console.error('Failed to fetch advisor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelection = (day, time) => {
    setSelectedDate(day);
    setSelectedTime(time);
  };

  const handleBookingSubmit = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handlePaymentSuccess = async ({ transactionId, method }) => {
    const clientId = position._id;
    // const price = advisor.price;
    // const participants = [advisor.email, position.email];

    try {
      // const zoom = await axios.post('http://localhost:8080/user/zoom', {
      //   participants,
      //   date: selectedDate,
      //   time: selectedTime
      // });

      // if (zoom.data.status !== true) {
      //   alert('Failed to create meeting');
      //   return;
      // }

      // const { join_url, meeting_id, start_time } = zoom.data.info;
      // const subject = "Meeting Confirmation - FinAdvise";
      // const text = `
      //   Meeting Details:
      //   - Join Link: ${join_url}
      //   - Meeting ID: ${meeting_id}
      //   - Date & Time: ${start_time}
      //   - Transaction ID: ${transactionId}
      //   - Advisor: ${advisor.fullname}
      // `;

      // await axios.post('http://localhost:8080/user/sendmail', {
      //   participants,
      //   subject,
      //   text
      // });

      const scheduleRes = await axios.post(`http://localhost:8080/advisor/clientbill`, {
        id,
        date: selectedDate,
        time: selectedTime,
        clientId,
        transactionId,
        price: "501",
        method
      });

      if (scheduleRes.data.msg === 'Slot booked') {
        alert('Meeting scheduled successfully!');
        navigate(0);
      }
    } catch (error) {
      console.error(error);
      alert(`Error while scheduling meeting. Transaction ID: ${transactionId}`);
    }
    
    setShowPayment(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'star-filled' : 'star-empty'}>
        ★
      </span>
    ));
  };

  const getAvailableSlots = () => {
    if (!advisor?.schedule) return [];
    return Object.entries(advisor.schedule).filter(([_, times]) => times.length > 0);
  };

  const getRecommendedAdvisors = () => {
    return allAdvisors.filter(
      item => item.experience === advisor?.experience && item._id !== advisor?._id
    );
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading advisor details...</p>
        </div>
      </div>
    );
  }

  if (error || !advisor) {
    return (
      <div className="app-container">
        <div className="error-container">
          <h2>Unable to load advisor details</h2>
          <p>{error || 'Advisor not found'}</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>Advisor Details</h1>
        <div className="header-spacer"></div>
      </header>

      <main className={`main-content ${showPayment ? 'payment-active' : ''}`}>
        <section className="advisor-profile">
          <div className="profile-header">
            <div className="profile-avatar">
              {advisor.fullname.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{advisor.fullname}</h2>
              <div className="rating-container">
                <div className="stars">{renderStars(advisor.rating)}</div>
                <span className="rating-text">({advisor.rating}/5)</span>
              </div>
              <p className="experience">{advisor.experience} years experience</p>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{advisor.clients}</span>
                <span className="stat-label">Clients</span>
              </div>
              <div className="stat">
                <span className="stat-number">₹{advisor.price}</span>
                <span className="stat-label">Per Session</span>
              </div>
            </div>
          </div>
          
          <div className="profile-details">
            <h3>About</h3>
            <p>{advisor.bio}</p>
          </div>
        </section>

        {/* Availability Section */}
        <section className="availability-section">
          <h3>Available Time Slots</h3>
          <div className="slots-container">
            {getAvailableSlots().map(([day, times]) => (
              <div key={day} className="day-slot">
                <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                <div className="time-slots">
                  {times.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelection(day, time)}
                      className={`time-slot ${
                        selectedDate === day && selectedTime === time ? 'selected' : ''
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {selectedDate && selectedTime && (
            <div className="selected-slot">
              <p>Selected: <strong>{selectedDate} at {selectedTime}</strong></p>
            </div>
          )}
          
          <button 
            onClick={handleBookingSubmit}
            className="btn-primary book-session-btn"
            disabled={!selectedDate || !selectedTime}
          >
            Book Session - ₹{advisor.price}
          </button>
        </section>

        <section className="recommendations-section">
          <h3>Similar Advisors</h3>
          <div className="advisors-slider">
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3}
              spaceBetween={30}
              navigation
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: false,
              }}
              modules={[Navigation, EffectCoverflow]}
              className="recommendations-swiper"
            >
              {getRecommendedAdvisors().map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="advisor-card">
                    <div className="card-avatar">
                      {item.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <h4>{item.name}</h4>
                    <p className="card-specialization">{item.qualification}</p>
                    <p className="card-contact">{item.email}</p>
                    <Link to={`/advisorinfo/${item._id}`} className="btn-outline">
                      View Profile
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </main>

      {/* Payment Modal */}
      {showPayment && (
        <div className="payment-overlay">
          <PaymentGateway
            advisor={advisor}
            date={selectedDate}
            time={selectedTime}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handlePaymentCancel}
            price={advisor.price}
          />
        </div>
      )}
    </div>
  );
};

export default AdvisorDeta;