import React, { useState } from 'react';
import '../CSS/Auth.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaMeetup } from "react-icons/fa";
import { useContext } from 'react';
import { UserContext } from './Context/UserContext';

const Auth = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(0);
  const [user, setUser] = useState({
    email: '',
    name: '',
    password: '',
    confirm: '',
    gender: 'male',
  });
  const {setPosition} = useContext(UserContext);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleChange = (val) => {
    setRole(val);
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === 0) {
        const message = await axios.post("http://localhost:8080/user/login", user);
        console.log(message)
        setPosition(message.data.info);
        if(message.data.message === "Login Successfully User"){
          navigate("/front");
        }
        else if(message.data.message === "Login Successfully Admin"){
          navigate("/admin")
        }
        else if(message.data.message === "Login Successfully Manager"){
          navigate("/manager")
        }
        else if(message.data.message === "Login Successfully Advisor"){
          navigate("/advisor")
        }
      }
      if (role === 1) {
        if (user.password === user.confirm) {
          const message = await axios.post('http://localhost:8080/user/register', user);
          if(message.data.success === true){
            navigate("/front");
          }
        } else {
          alert('Password not matched');
        }
      }
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className='auth-body'>
    <div className="login-container">
      <div className="profile-icon">
      <FaMeetup className='logo'/>
      </div>
      {role === 0 ? (
        <form onSubmit={loginSubmit}>
          <input type="text" className="input-field" required placeholder="Email Id or Username" name="email" value={user.email} onChange={onChangeInput} />
          <input type="password" className="input-field" required placeholder="Enter your password" name="password" value={user.password} onChange={onChangeInput} />
          <button type="submit" className="action-button">Submit</button>
          <button type="button" className="action-button" onClick={() => handleChange(1)}>Signup</button>
        </form>
      ) : (
        <form onSubmit={loginSubmit}>
          <input type="text" className="input-field" required placeholder="Enter your Name" name="name" value={user.name} onChange={onChangeInput} />
          <input type="email" className="input-field" required placeholder="Email" name="email" value={user.email} onChange={onChangeInput} />
          <input type="password" className="input-field" required placeholder="Generate your password" name="password" value={user.password} onChange={onChangeInput} />
          <input type="password" className="input-field" required placeholder="Confirm your password" name="confirm" value={user.confirm} onChange={onChangeInput} />
          <button type="submit" className="action-button">Submit</button>
          <button type="button" className="action-button" onClick={() => handleChange(0)}>Login</button>
        </form>
      )}
    </div>
    </div>
  );
};

export default Auth;
