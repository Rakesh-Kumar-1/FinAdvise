import axios from 'axios';
import React, { useState } from 'react';
import { IoSend } from "react-icons/io5";
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { ScheduleBooked } from './ScheduleBooked';

const Advisorfront = () => {
    const [showComplainForm, setShowComplainForm] = useState(false);
    const [sender, setSender] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTimes, setSelectedTimes] = useState({});
    const {position,setPosition} = useContext(UserContext);
    const navigate = useNavigate();
    const id = position._id;

    const hours = Array.from({ length: 12 }, (_, i) => `${i + 9}:00 ${i + 9 < 12 ? 'AM' : 'PM'}`);

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const handleTimeToggle = (day, hour) => {
        setSelectedTimes(prev => {
            const currentDayTimes = prev[day] || [];
            const isSelected = currentDayTimes.includes(hour);

            return {
                ...prev,
                [day]: isSelected
                    ? currentDayTimes.filter(t => t !== hour)
                    : [...currentDayTimes, hour],
            };
        });
    };

    const handleSaveAvailability = async() => { 
        try{
            const res = await axios.post('http://localhost:8080/advisor/schedule',{selectedTimes,id})
            if(res.data.message === 'Successfull'){
                setPosition(res.data.info);
                alert('Availability saved successfully!');
            }
            else{
                alert('Fill the schedule again');
            }
        }catch(err){
            console.error(err);
        }
    };

    const complainForm = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/advisor/complainForm', {
                sender,
                subject,
                description,
                role: 'advisor'
            });

            if (res.data.message === 'Successfull') {
                alert('Complain has been raised. It will be resolved within a few days.');
                setShowComplainForm(false);
                setSender('');
                setSubject('');
                setDescription('');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to raise complain.');
        }
    };

    return (
        <div>
            <nav className="admin-navbar">
                <div className="admin-nav-right">
                    <button className="admin-nav-link">Profile</button>

                    <div className="admin-dropdown">
                        <span className="admin-menu-title" onClick={() => setShowComplainForm(true)}>
                            Complain
                        </span>
                    </div>

                    <div className="admin-dropdown">
                        <span className="admin-menu-title" onClick={()=>navigate("/payment/transcation")}>Transaction</span>
                    </div>

                    <a className="admin-nav-link" href="mailto:official@example.com">Email</a>
                </div>
            </nav>

            <section className="advisor-container">
                <div className="profile-pic">
                    <img src="https://via.placeholder.com/150" alt="Profile" />
                </div>

                <div className="weekly-schedule">
                    <p>SELECT DAYS</p>
                    <div className="days">
                        {days.map((day) => (
                            <button
                                key={day}
                                className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                                onClick={() => setSelectedDay(day)}
                            >
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </button>
                        ))}
                    </div>

                    {selectedDay && (
                        <div className="hours">
                            <h4>Select Available Times for {selectedDay}</h4>
                            <div className="hour-grid">
                                {hours.map((hour) => (
                                    <label key={hour} className="hour-slot">
                                        <input
                                            type="checkbox"
                                            checked={selectedTimes[selectedDay]?.includes(hour) || false}
                                            onChange={() => handleTimeToggle(selectedDay, hour)}
                                        />
                                        {hour}
                                    </label>
                                ))}
                            </div>
                            <button className="save-btn" onClick={handleSaveAvailability}>
                                Save Availability
                            </button>
                        </div>
                    )}
                </div>

            </section>

            {showComplainForm && (
                <form className="compose-window" onSubmit={complainForm}>
                    <div className="compose-header">
                        <h2>NEW COMPLAINT</h2>
                        <button type="button" className="close-btn" onClick={() => setShowComplainForm(false)}>×</button>
                    </div>

                    <div className="compose-inputs">
                        <input
                            type="email"
                            placeholder="Sender Email"
                            value={sender}
                            onChange={(e) => setSender(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    <div className="compose-body">
                        <textarea
                            placeholder="Write your complaint..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="compose-footer">
                        <button className="send-btn" type="submit"><IoSend /></button>
                    </div>
                </form>
            )}
            <ScheduleBooked id={position._id}/>
        </div>
    );
};

export default Advisorfront;
