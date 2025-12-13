import React, { useState } from "react";
import axios from "axios";
import "../../CSS/Advisor.css";

const Advisor = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    qualification: "",
    linkedIn: "",
    experience: "",
    bio: "",
    photo: null,
    images: [], // store multiple files
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) }); // convert FileList to array
    } else if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append all normal fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "photo") {
        data.append(key, formData[key]);
      }
    });

    if (formData.photo) {
      data.append("photo", formData.photo); // name must match multer field
    }

    // Append multiple images
    formData.images.forEach((file) => {
      data.append("images", file); // same field name for each file
    });

    try {
      const res = await axios.post("https://finadvise-backend.onrender.com/user/verify", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      alert("Submitted successfully");
      console.log(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Submission failed. Check console for more info.");
    }
  };

  return (
    <div className="advisor-body">
      <div className="advisor-page">
        <div className="form-container">
          <h2 className="form-title">Advisor Verification</h2>
          <p className="form-subtitle">
            Please provide your details and upload your certification(s) to get
            verified.
          </p>

          <form className="advisor-form" onSubmit={handleSubmit}>
            <input
              name="fullname"
              type="text"
              placeholder="Full Name"
              required
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
              onChange={handleChange}
            />
            <input
              name="qualification"
              type="text"
              placeholder="Qualification"
              required
              onChange={handleChange}
            />
            <input
              name="linkedIn"
              type="url"
              placeholder="LinkedIn Profile"
              required
              onChange={handleChange}
            />
            <input
              name="experience"
              type="text"
              placeholder="Years of Experience"
              required
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Short Bio"
              rows="3"
              required
              onChange={handleChange}
            />
            <div className="file-upload">
              <label htmlFor="image" className="file-label">
                Upload your photo
              </label>
              <input
              name="photo"
              type="file"
              accept="image/*"
              placeholder="Upload Profile Picture"
              required
              onChange={handleChange}
            />
            </div>
            <div className="file-upload">
              <label htmlFor="image" className="file-label">
                Upload Certificates Upto 4 (Multiple files allowed)
              </label>
              <input
                name="images"
                id="image"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                required
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit for Verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
