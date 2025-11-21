import React, {useEffect,useState,useContext,useMemo,useCallback,memo,} from "react";
import "../../CSS/Front.css";
import { Link, useNavigate } from "react-router-dom";
import { IoSend, IoSearchSharp } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { BiUserPlus } from "react-icons/bi";
import { MdOutlineReport } from "react-icons/md";
import axios from "axios";
import { FaMale, FaFemale } from "react-icons/fa";
import { UserContext } from "../Context/UserContext";
import {useDispatch} from 'react-redux'
import {addUser} from '../../redux/slices/UserSlice'
import { GiFarmer } from "react-icons/gi";

// Memoized components
const AdvisorCard = memo(
  ({ advisor, isFollowed, onFollowRequest, getProfilePhotoSrc }) => (
    <div className="advisor-card">
      <div className="card-header">
        <div className="advisor-image-container">
          <img
            src={
              advisor.profilePhoto
                ? getProfilePhotoSrc(advisor.profilePhoto)
                : advisor.image
            }
            alt={advisor.fullname}
            className="advisor-image"
            loading="lazy"
          />
          <div className="rating-badge">
            <span>⭐ {advisor.rating}</span>
          </div>
        </div>
        <button
          className="follow-btn"
          onClick={() => onFollowRequest(advisor._id)}
          title={isFollowed ? "Unfollow" : "Follow"}
          aria-label={isFollowed ? "Unfollow advisor" : "Follow advisor"}
        >
          {isFollowed ? <FcLike size={20} /> : <AiOutlineHeart size={20} />}
        </button>
      </div>

      <div className="card-content">
        <h3 className="advisor-name">{advisor.fullname}</h3>
        <p className="advisor-bio">{advisor.bio}</p>

        <div className="advisor-stats">
          <div className="stat-item">
            <span className="stat-label">Experience</span>
            <span className="stat-value">{advisor.experience}y</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Clients</span>
            <span className="stat-value">{advisor.client}</span>
          </div>
        </div>

        <Link
          className="info-btn"
          to={`/advisorinfo/${advisor._id}`}
          aria-label={`View ${advisor.name}'s profile`}
        >
          <BiUserPlus size={18} />
          View Profile
        </Link>
      </div>
    </div>
  )
);

const NavBar = memo(({ position, navigate, onComplainClick }) => (
  <nav className="navbar">
    <div className="nav-brand">
      <img src="innovation.png" className="logo"/>
    </div>
    <div className="nav-right">
      <button className="nav-link" onClick={() => navigate("/apply")}>
        Apply for Advisor
      </button>
      <button className="nav-link" onClick={() => navigate("/join-meeting")}>
        Join Meeting
      </button>
      <button className="nav-link" onClick={onComplainClick}>
        <MdOutlineReport size={18} />
        Report
      </button>
      <button
        className="nav-link"
        onClick={() =>
          navigate("/chatroom", {
            state: { positionId: position._id, source: "client" },
          })
        }
      >
        ChatRoom
      </button>
      <div className="profile-container" onClick={() => navigate("/setting")}>
        {position?.gender === "m" ? (
          <FaMale className="profile-img" title="User Profile" />
        ) : (
          <FaFemale className="profile-img" title="User Profile" />
        )}
      </div>
    </div>
  </nav>
));


const ComplaintForm = memo(
  ({
    sender,
    setSender,
    subject,
    setSubject,
    description,
    setDescription,
    onSubmit,
    onClose,
  }) => (
    <div className="modal-overlay">
      <form className="complaint-form" onSubmit={onSubmit}>
        <div className="form-header">
          <h2>
            <MdOutlineReport size={24} />
            Submit Complaint
          </h2>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close form"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="form-content">
          <div className="input-group">
            <label htmlFor="sender">Email Address</label>
            <input
              id="sender"
              type="email"
              placeholder="your.email@example.com"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              placeholder="Brief description of the issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Please provide detailed information about your complaint..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
            />
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            <IoSend size={16} />
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  )
);

const Front = () => {
  const navigate = useNavigate();
  const [advisors, setAdvisors] = useState([]);
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [likePage, setLikePage] = useState(false);
  const [showComplainForm, setShowComplainForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { position, setPosition } = useContext(UserContext);
  const [followedIds, setFollowedIds] = useState(new Set());

  const dispatch = useDispatch()
  // Memoized profile photo converter
  const getProfilePhotoSrc = useMemo(() => {
    return (profilePhoto) => {
      if (!profilePhoto || !profilePhoto.data) return "/default-avatar.png";

      try {
        let base64Image;
        if (typeof profilePhoto.data === "string") {
          base64Image = profilePhoto.data;
        } else if (profilePhoto.data.type === "Buffer") {
          base64Image = btoa(String.fromCharCode(...profilePhoto.data.data));
        } else {
          base64Image = profilePhoto.data.toString("base64");
        }

        const contentType = profilePhoto.contentType || "image/jpeg";
        return `data:${contentType};base64,${base64Image}`;
      } catch (error) {
        console.error("Error converting profile photo:", error);
        return "/default-avatar.png";
      }
    };
  }, []);

  // Memoized filtered advisors
  const filteredAdvisors = useMemo(() => {
    if (!search) return advisors;
    return advisors.filter((advisor) =>
      advisor.fullname.toLowerCase().includes(search.toLowerCase())
    );
  }, [advisors, search]);

  // Memoized followed advisors
  const followedAdvisors = useMemo(() => {
    return position?.follows || [];
  }, [position?.follows]);

  const displayedAdvisors = likePage ? followedAdvisors : filteredAdvisors;

  // Optimized callbacks
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleComplainClick = useCallback(() => {
    setShowComplainForm(true);
  }, []);

  const handleCloseComplaintForm = useCallback(() => {
    setShowComplainForm(false);
    setSender("");
    setSubject("");
    setDescription("");
  }, []);

  const followRequest = useCallback(
    async (id) => {
      try {
        const user = position._id;
        const res = await axios.post(
          "https://finadvise-backend.onrender.com/user/followrequest",
          {
            id,
            user,
          }
        );

        if (res.data.status === true) {
          setPosition(res.data.info);
          setFollowedIds((prev) => {
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
        console.error("Follow error:", error);
      }
    },
    [position._id, setPosition]
  );

  const complainForm = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(
          "https://finadvise-backend.onrender.com/user/complainForm",
          {
            sender,
            subject,
            description,
            role: "user",
          }
        );

        if (res.data.message === "Successfull") {
          alert(
            "Complaint submitted successfully! We'll respond within 2-3 business days."
          );
          handleCloseComplaintForm();
        }
      } catch (err) {
        console.error("Complaint submission error:", err);
        alert("Failed to submit complaint. Please try again.");
      }
    },
    [sender, subject, description, handleCloseComplaintForm]
  );
  // Effects
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://finadvise-backend.onrender.com/user/fetch-advisor"
        );
        setAdvisors(response.data.info);
        // console.log(typeof(response.data.info));
        dispatch(addUser(response.data.info));
      } catch (error) {
        console.error("Error fetching advisors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisors();
  }, []);

  useEffect(() => {
    if (position?.follows) {
      setFollowedIds(new Set(position.follows.map((follow) => follow._id)));
    }
  }, [position]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading advisors...</p>
      </div>
    );
  }

  return (
    <div className="front-page">
      <NavBar
        position={position}
        navigate={navigate}
        onComplainClick={handleComplainClick}
        setLikePage={setLikePage}
      />

      <main className="main-content">
        <div className="hero-section">
          <h1>Find Your Perfect Advisor</h1>
          <p>
            Connect with experienced professionals who can guide your journey
          </p>
        </div>

        <div className="search-section">
          <div className="search-container">
            <div className="search-bar">
              <IoSearchSharp className="search-icon" />
              <input
                type="text"
                placeholder="Search advisors by name..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${!likePage ? "active" : ""}`}
                onClick={() => setLikePage(false)}
              >
                All Advisors
              </button>
              <button
                className={`toggle-btn ${likePage ? "active" : ""}`}
                onClick={() => setLikePage(true)}
              >
                Following ({followedAdvisors.length})
              </button>
            </div>
          </div>
        </div>

        <div className="advisor-section">
          {displayedAdvisors.length > 0 ? (
            <div className="advisor-grid">
              {displayedAdvisors.map((advisor, index) => {
                const isFollowed = followedIds.has(advisor._id);
                return (
                  <AdvisorCard
                    key={advisor._id || index}
                    advisor={advisor}
                    isFollowed={isFollowed}
                    onFollowRequest={followRequest}
                    getProfilePhotoSrc={getProfilePhotoSrc}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>
                {likePage
                  ? "No followed advisors yet"
                  : search
                  ? "No advisors found"
                  : "No advisors available"}
              </h3>
              <p>
                {likePage
                  ? "Start following some advisors to see them here"
                  : search
                  ? "Try adjusting your search terms"
                  : "Check back later for new advisors"}
              </p>
            </div>
          )}
        </div>
      </main>

      {showComplainForm && (
        <ComplaintForm
          sender={sender}
          setSender={setSender}
          subject={subject}
          setSubject={setSubject}
          description={description}
          setDescription={setDescription}
          onSubmit={complainForm}
          onClose={handleCloseComplaintForm}
        />
      )}
    </div>
  );
};

export default Front;
