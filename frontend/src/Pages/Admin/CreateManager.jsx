import '../../CSS/CreateManager.css'
import React, { useState } from "react";
import axios from "axios";

const CreateManager = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    qualification: "",
    linkedIn: "",
    experience: "",
    bio: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await axios.post("http://localhost:8080/admin/create-manager", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data.message);
      console.log(res.data);
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      alert("Submission failed. Check console for more info.");
    }
  };

  return (
    <div className="manager-body">
        <div className="form-container">
          <h2 className="form-title">Create Manager</h2>
          <p className="form-subtitle">
            Please provide manager details and upload the required documents.
          </p>

          <form className="manager-form" onSubmit={handleSubmit}>
            <input name="fullname" type="text" placeholder="Full Name" required onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
            <input name="phone" type="tel" placeholder="Phone Number" required onChange={handleChange} />
            <input name="qualification" type="text" placeholder="Qualification" required onChange={handleChange} />
            <input name="linkedIn" type="url" placeholder="LinkedIn Profile" required onChange={handleChange} />
            <input name="experience" type="text" placeholder="Years of Experience" required onChange={handleChange} />
            <textarea name="bio" placeholder="Short Bio" rows="3" required onChange={handleChange} />

            <div className="file-upload">
              <label htmlFor="image" className="file-label">
                Upload Document (Only 1 file allowed)
              </label>
              <input name="image" id="image" type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={handleChange} />
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
    </div>
  );
};

export default CreateManager;
