import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { Navigation, EffectCoverflow } from "swiper/modules";
import '../../CSS/AdvisorDeta.css'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import PaymentGateway from '../Payment/PaymentGateway';
import { useNavigate } from 'react-router-dom';

const AdvisorDeta = () => {
//  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [method, setMethod] = useState("");
  // const [slottime, setSlottime] = useState('');
  const { id } = useParams();
  const [advisor, setAdvisor] = useState(null);
  const [all, setAll] = useState({});
  const navigate = useNavigate();

  const { position } = useContext(UserContext);

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

  const slotchange =(day,time) =>{
    setDate(day);
    setTime(time)
  }
  const handleDateTimeSubmit = () => {
    if (!date || !time) {
      alert('Please select both date and time');
      return;
    }
    // setShowModal(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async() => {
    // Store the transaction ID
    const txnId = `TXN${Date.now().toString().slice(-8)}`;
    setTransactionId(txnId);
    const clientId = position._id;
    const price = advisor.price;

    //const participants = [advisor.email, position.email];
    // console.log(participants,transactionId,date,time);

    try {
      // const zoom = await axios.post('http://localhost:8080/user/zoom', {
      //   participants,
      //   date,
      //   time
      // });

      // if (zoom.data.status !== true) {
      //   alert('Failed to create meeting');
      //   return;
      // }

      // const { join_url, meeting_id, start_time } = zoom.data.info;

      // await new Promise(resolve => setTimeout(resolve, 2000));

      // const subject = "Meeting Confirmation - FinAdvise";
      // const text = `
      //   Meeting Details:
      //   - Join Link: ${join_url}
      //   - Meeting ID: ${meeting_id}
      //   - Date & Time: ${start_time}
      //  - Transaction ID: ${transactionId}
      //   - Advisor: ${advisor.fullname}

      //   Thank you for choosing FinAdvise!
      // `;
      // const sendmail = await axios.post('http://localhost:8080/user/sendmail', {
      //   participants,
      //   subject,
      //   text
      // });

      // if (sendmail.data.message === "send mail") {
      //   alert(`Meeting scheduled successfully! Transaction ID: ${txnId}\nConfirmation email sent to both parties.`);
      // } else {
      //   console.log(sendmail.data.message);
      //   alert(`Meeting scheduled successfully! Transaction ID: ${txnId}\nNote: Email sending failed, but meeting is confirmed.`);
      // }
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const new_schedule = await axios.post(`https://localhost:8080/advisor/new_schedule`,{id,date,time,clientId,transactionId,price,method});
      if(new_schedule.data.msg === 'Slot booked'){
        navigate(0);
      }

    } catch (error) {
      console.log(error);
      alert(`Error occurred while scheduling meeting. Transaction ID: ${txnId} - Please contact support.`);
    }

    setShowPayment(false);
    setDate('');
    setTime('');
    // Keep transaction ID for reference
  };

  const handleBackToDateTime = (method) => {
    setMethod(method)
    // setShowPayment(false);
    // // setShowModal(true);
  };

  return (
    <>
      <div className="meeting-wrapper">
        <div className={`advisor-content ${( showPayment) ? 'blurred' : ''}`}>
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

          {/* Slot time and schedule */}
          <div>
            <h2>Advisor Weekly Schedule</h2>
            <ul>
              {Object.entries(advisor.schedule).map(([day, times]) => (
                times.length > 0 ? (
                  <li key={day}>
                    <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                    {times.map((slot, index) => (
                      <button key={index} onClick={()=>slotchange(day,slot)}>  {slot}  </button>
                    ))}
                  </li>
                ) : null
              ))}
            </ul>

          </div>
          <button className="schedule-button" onClick={handleDateTimeSubmit}>
            Schedule Meeting
          </button>
          {/* <button className="schedule-button" onClick={() => setShowModal(true)}>
            Schedule Meeting
          </button> */}
        </div>

        {/* {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Select Date and Time</h3>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <div className="modal-buttons">
                <button className="apply-btn" onClick={handleDateTimeSubmit}>
                  Proceed to Payment
                </button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )} */}

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