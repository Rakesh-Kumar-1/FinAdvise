import React from "react";
import "../../CSS/JoinMeeting.css";
import { BiSolidWebcam } from "react-icons/bi";
import { FaMeetup } from "react-icons/fa";
import { TbMessageReport } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const JoinMeeting = () => {
    const navigate = useNavigate();
    const handleInput = (val) =>{
        if(val === 'create'){
            navigate('/create');
        }
        else if(val === 'join'){
            navigate('/join');
        }
    }
    return (
        <div className="meet-container">
            {/* Header Section */}
            <header className="meet-header">
                <div className="logo">
                    <FaMeetup className="logo-icon" />
                    <span>MeetUP</span>
                </div>
                <div className="header-options">
                    <p>{new Date().toLocaleString()}</p>
                    <TbMessageReport className="icon" />
                    <IoSettings className="icon" />
                    <div className="profile-circle">R</div>
                </div>
            </header>

            {/* Main Content Section */}
            <div className="meet-content">
                {/* Left Side - Text and Buttons */}
                <div className="meet-left">
                    <h1>Video Calls & Meetings for Professionals</h1>
                    <p>Connect, collaborate, and celebrate with MeetUP, your professional video conferencing solution.</p>
                    <div className="meet-actions">
                        <button className="new-meeting" onClick={()=>handleInput('create')}>
                            <BiSolidWebcam className="btn-icon" />Start a Meeting
                        </button>
                        
                        <div className="join-section">
                            <input type="text" placeholder="Enter meeting code or link" />
                            <button className="join-button" onClick={()=>handleInput('join')}>Join</button>
                        </div>
                    </div>
                    <p>Learn more about MeetUP</p>
                </div>

                {/* Right Side - Image and Text */}
                <div className="meet-right">
                    <img src="https://www.pngkit.com/png/full/805-8050584_meeting-logo-png-meeting-icon-png.png" alt="Illustration" />
                    <p>Get a Shareable Meeting Link</p>
                    <span>
                        Click <strong>Start a Meeting</strong> to generate a link that you can share with your colleagues.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default JoinMeeting;
