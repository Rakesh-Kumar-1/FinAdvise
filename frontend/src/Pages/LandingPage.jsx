import axios from 'axios';
import React from 'react'

const LandingPage = () => {
 const gender = async () => {
  // In LandingPage.jsx
  try {
    const name = "Vishwajeet Singh";
    const response = await axios.get(`http://localhost:8080/user/gender/${name}`);
    
    // First, log the whole data object to see its structure
    console.log(response.data); 
    
    // Then you can access the specific property, e.g., response.data.data or whatever it is
    
  } catch (error) {
    console.log(error);
  }
 }

  return (
    <div>
      <button onClick={gender}>Click for gender</button>
    </div>
  )
}

export default LandingPage