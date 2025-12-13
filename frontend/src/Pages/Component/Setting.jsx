import React, { useCallback, useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import "../../CSS/Setting.css"
import axios from "axios";

// Helper component for SVG icons
const Icon = ({ path, className = "icon-svg" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Individual setting item component
const SettingsItem = ({
  icon,
  label,
  value,
  isEditable = false,
  type = "text",
}) => (
  <div className="settings-item">
    <div className="settings-item-label-container">
      <div className="settings-item-icon">{icon}</div>
      <span className="settings-item-label">{label}</span>
    </div>
    <div className="settings-item-value-container">
      {isEditable ? (
        <input
          type={type}
          defaultValue={value}
          className="settings-input"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      ) : (
        <p className="settings-value-text">{value}</p>
      )}
    </div>
  </div>
);

export default function Setting() {
  const { position, setPosition } = useContext(UserContext);

  const [user, setUser] = useState({
    name: position.name,
    gender: position.gender,
    email: position.email,
    phone: position.phone,
    profileImageUrl: "https://placehold.co/128x128/E0E7FF/4F46E5?text=JL",
    advisorsMet: position.totalmet || 15,
  });
  const userPoints = user.advisorsMet * 100;
  const [newPassword, setNewPassword] = useState("");
  const submitPassword = useCallback(async () => {
      try {
        const response = await axios.post(
          "https://finadvise-backend.onrender.com/user/changepassword",
          { newPassword, id: position._id },
          { withCredentials: true }
        );
        if (response.data.message === "Change Password Successfully") {
          alert("Successfully changed password");
          setNewPassword(""); // clear input after success
        } else {
          alert(response.data.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to change password. Try again.");
      }
    }, [newPassword]);

  return (
    <>
      <div className="settings-page">
        <div className="settings-container">
          <h1 className="settings-title">Account Settings</h1>

          <div className="settings-card">
            <div className="settings-card-content">
              {/* --- Profile Header --- */}
              <div className="profile-header">
                <div className="profile-image-container">
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="profile-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/128x128/E0E7FF/4F46E5?text=User";
                    }}
                  />
                  <button className="profile-image-button">
                    <Icon path="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M12 15a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z" />
                  </button>
                </div>
                <div className="profile-info">
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                </div>
              </div>

              {/* --- Personal Information --- */}
              <div className="settings-section">
                <h3 className="settings-section-title">Personal Information</h3>
                <div className="settings-items-container">
                  <SettingsItem
                    icon={
                      <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    }
                    label="Name"
                    value={user.name}
                  />
                  <SettingsItem
                    icon={
                      <Icon path="M15 9.75a3 3 0 11-6 0 3 3 0 016 0z M3 9.75a3 3 0 116 0 3 3 0 01-6 0zM15 15a3 3 0 11-6 0 3 3 0 016 0zM3 15a3 3 0 116 0 3 3 0 01-6 0z" />
                    }
                    label="Gender"
                    value={user.gender}
                  />
                  <SettingsItem
                    icon={
                      <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    }
                    label="Email"
                    value={user.email}
                    type="email"
                  />
                  <SettingsItem
                    icon={
                      <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    }
                    label="Phone"
                    value={user.phone}
                    type="tel"
                  />
                </div>
              </div>

              {/* --- User Statistics --- */}
              <div className="settings-section">
                <h3 className="settings-section-title">Your Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-card advisors">
                    <div className="stat-icon advisors">
                      <Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18 18.72v-2.172c0-.963-.783-1.748-1.748-1.748H14.25M18 18.72l-2.172-2.172m0 0l2.172 2.172" />
                    </div>
                    <div className="stat-info">
                      <p>Advisors Met</p>
                      <p>{user.advisorsMet}</p>
                    </div>
                  </div>
                  <div className="stat-card points">
                    <div className="stat-icon points">
                      <Icon path="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </div>
                    <div className="stat-info">
                      <p>Points Earned</p>
                      <p>{userPoints.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Change Password --- */}
              <div className="settings-section">
                <h3 className="settings-section-title">Change Password</h3>
                <div className="settings-items-container">
                  <div className="settings-item">
                  <Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  <input type="text" className="settings-input" placeholder="New Password" name="newpassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                </div>
              </div>
            </div>

            {/* --- Footer Actions --- */}
            <div className="settings-footer">
              <button type="button" className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" onClick={submitPassword}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
