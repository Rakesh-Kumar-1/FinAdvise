import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoCompassOutline } from "react-icons/io5";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import '../../CSS/Complain.css';

const Complain = () => {
  const { name } = useParams();    //user   //advisor
  const [complain, setComplain] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchData = async() => {
      try {
        const complain = await axios.get(
          `http://localhost:8080/manager/complaintype/${name}`
        );
        setComplain(complain.data.info);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [name]);
  
  const removeData = async (index) => {
    console.log(complain);
    try {
      const res = await axios.post(`http://localhost:8080/manager/complain`, {
        feedback,
        name,
        index,
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

return (
    <div className="complain-container">
      <main>
        <h2 className="main-subtitle">List Of {name.toUpperCase()} Complaints</h2>
        <div className="complain-list">
          {complain.map((item, index) => (
            <div key={index} className="complain-card">
              {/* Card Header */}
              <h3>{item.name}</h3>

              {/* Card Content Body */}
              <div className="card-content">
                <p className="complain-detail">
                  <strong>Sender:</strong> {item.sender}
                </p>
                <p className="complain-detail">
                  <strong>Subject:</strong> {item.subject}
                </p>
                <p className="complain-detail">
                  <strong>Description:</strong> {item.description}
                </p>
                <textarea
                  className="feedback-textarea"
                  placeholder={`Provide feedback or resolution details...`}
                />
              </div>

              {/* Card Footer for Actions */}
              <div className="card-footer">
                <button
                  className="solve-button"
                  onClick={() => removeData(index)}
                >
                  <IoCheckmarkDoneCircleOutline size={20} />
                  Mark as Solved
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Complain;
