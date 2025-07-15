import React, { useEffect, useState, useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import '../../CSS/AdvisorDeta.css'
import { Navigation, EffectCoverflow } from "swiper/modules";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import PaymentGateway from '../Payment/PaymentGateway';

const AdvisorDeta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { position } = useContext(UserContext);

  const [advisor, setAdvisor] = useState(null);
  const [all, setAll] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [method, setMethod] = useState('');

  useEffect(() => {
    const fetchAdvisor = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/advisor/${id}`);
        const response = await axios.get('http://localhost:8080/user/fetch-advisor');
        setAdvisor(res.data?.data || res.data); // Adjust depending on API
        setAll(response.data.data);
      } catch (err) {
        console.error('Failed to fetch advisor:', err);
      }
    };

    fetchAdvisor();
  }, [id]);

  const slotchange = (day, slotTime) => {
    setDate(day);
    setTime(slotTime);
  };

  const handleDateTimeSubmit = () => {
    if (!date || !time) {
      alert('Please select both date and time');
      return;
    }
    setShowPayment(true);
  };

  const handleBackToDateTime = (m) => {
    setMethod(m);
  };

  const handlePaymentSuccess = async (txnId) => {
    setTransactionId(txnId);
    const clientId = position._id;
    const price = advisor.price;
    // const participants = [advisor.email, position.email];

    try {
      // const zoom = await axios.post('http://localhost:8080/user/zoom', {
      //   participants, date, time
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
      //   - Transaction ID: ${txnId}
      //   - Advisor: ${advisor.fullname}
      // `;

      // await axios.post('http://localhost:8080/user/sendmail', {
      //   participants, subject, text
      // });

      const new_schedule = await axios.post(`http://localhost:8080/advisor/new_schedule`, {
        id, date, time, clientId, transactionId: transactionId,price, method});

      if (new_schedule.data.msg === 'Slot booked') {
        alert('Meeting scheduled successfully!');
        navigate(0);
      }

    } catch (error) {
      console.log(error);
      alert(`Error while scheduling meeting. Transaction ID: ${txnId}`);
    }

    setShowPayment(false);
    setDate('');
    setTime('');
  };

  if (!advisor) {
    return <p style={{ padding: '50px', fontSize: '1.2rem' }}>Loading advisor details...</p>;
  }

  return (
    <>
      <div className="meeting-wrapper">
        <div className={`advisor-content ${showPayment ? 'blurred' : ''}`}>
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

          <div>
            <h2>Advisor Weekly Schedule</h2>
            <ul>
              {Object.entries(advisor.schedule).map(([day, times]) =>
                times.length > 0 && (
                  <li key={day}>
                    <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                    {times.map((slot, index) => (
                      <button key={index} onClick={() => slotchange(day, slot)}>
                        {slot}
                      </button>
                    ))}
                  </li>
                )
              )}
            </ul>
          </div>

          <button className="schedule-button" onClick={handleDateTimeSubmit}>
            Schedule Meeting
          </button>
        </div>

        {showPayment && (
          <PaymentGateway
            advisor={advisor}
            date={date}
            time={time}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handleBackToDateTime}
            price={advisor.price}
          />
        )}
      </div>

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

export default AdvisorDeta;
