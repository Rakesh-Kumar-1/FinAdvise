import React, { useState, useContext } from 'react';
import '../CSS/Auth.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { GiCrystalGrowth } from "react-icons/gi";
import { UserContext } from './Context/UserContext';

const Auth = () => {
  const navigate = useNavigate();
  const { setPosition } = useContext(UserContext);

  const [role, setRole] = useState(0); // 0 = login, 1 = signup
  const [reference, setReference] = useState('');

  const [user, setUser] = useState({
    email: '',
    name: '',
    password: '',
    confirm: '',
    phone: '',
    forgot: '',
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (val) => {
    setRole(val);
    setReference('');
    setUser({
      email: '',
      name: '',
      password: '',
      confirm: '',
      phone: '',
      forgot: '',
    });
  };

  /* ================= LOGIN / SIGNUP ================= */
  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      /* ===== LOGIN ===== */
      if (role === 0) {
        const res = await axios.post(
          "https://finadvise-backend.onrender.com/user/login",
          { email: user.email, password: user.password },
          { withCredentials: true }
        );

        const { info, role: userRole, message } = res.data;

        // Restore user safely
        if (info) {
          setPosition({
            ...info,
            gender: (info.gender ?? 'm') === 'm' ? 'Male' : 'Female'
          });
        }

        localStorage.setItem("role", userRole);

        if (message === "Login Successfully User") {
          navigate("/front", { replace: true });
        } else if (message === "Login Successfully Admin") {
          navigate("/admin", { replace: true });
        } else if (message === "Login Successfully Manager") {
          navigate("/manager", { replace: true });
        } else if (message === "Login Successfully Advisor") {
          navigate("/advisor", { replace: true });
        }
      }

      /* ===== SIGNUP ===== */
      if (role === 1) {
        if (user.password !== user.confirm) {
          return alert("Password not matched");
        }

        const res = await axios.post(
          "https://finadvise-backend.onrender.com/user/register",
          user,
          { withCredentials: true }
        );

        if (res.data.success) {
          navigate("/front", { replace: true });
        } else {
          alert(res.data.message);
        }
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const requestForgotPassword = async () => {
    try {
      const res = await axios.post(
        'https://finadvise-backend.onrender.com/user/forgot-password',
        { email: user.email },
        { withCredentials: true }
      );
      setReference(res.data.info);
    } catch {
      alert("Failed to send forgot password request");
      setReference('');
    }
  };

  const submitForgot = () => {
    if (user.forgot === reference) {
      navigate("/front", { replace: true });
    } else {
      alert("Invalid verification code");
    }
  };

  return (
    <div className="auth-body">
      <div className="login-container">
        <div className="profile-icon">
          <GiCrystalGrowth className="logo" />
        </div>

        {role === 0 ? (
          <form onSubmit={loginSubmit}>
            <input
              type="email"
              className="input-field"
              required
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={onChangeInput}
            />
            <input
              type="password"
              className="input-field"
              required
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={onChangeInput}
            />
            <button type="submit" className="action-button">Login</button>
            <button type="button" className="action-button" onClick={() => handleChange(1)}>
              Signup
            </button>
            <button type="button" className="input-field" onClick={requestForgotPassword}>
              Forgot Password
            </button>
          </form>
        ) : (
          <form onSubmit={loginSubmit}>
            <input type="text" className="input-field" required placeholder="Name" name="name" value={user.name} onChange={onChangeInput} />
            <input type="email" className="input-field" required placeholder="Email" name="email" value={user.email} onChange={onChangeInput} />
            <input type="password" className="input-field" required placeholder="Password" name="password" value={user.password} onChange={onChangeInput} />
            <input type="password" className="input-field" required placeholder="Confirm Password" name="confirm" value={user.confirm} onChange={onChangeInput} />
            <input type="text" className="input-field" required placeholder="Phone" name="phone" value={user.phone} onChange={onChangeInput} />
            <button type="submit" className="action-button">Signup</button>
            <button type="button" className="action-button" onClick={() => handleChange(0)}>
              Login
            </button>
          </form>
        )}

        {reference && (
          <>
            <input
              type="text"
              className="input-field"
              name="forgot"
              placeholder="Enter verification code"
              value={user.forgot}
              onChange={onChangeInput}
            />
            <button type="button" className="action-button" onClick={submitForgot}>
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
