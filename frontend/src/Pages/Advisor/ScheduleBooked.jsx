import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const ScheduleBooked = ({ id }) => {
  const [list, setList] = useState([]);

  const bookedschedule = async () => {
    try {
      const bookedlist = await axios.get(`http://localhost:8080/advisor/bookdschedule?id=${id}`);
      if (bookedlist.data.status === true) {
        setList(bookedlist.data.info);
      }
    } catch (e) {
      console.error(e);
      alert("Please refresh the page.");
    }
  };

  useEffect(() => {
    if (id) {
      bookedschedule();
    }
  }, [id]);

  return (
    <div className="schedule-table-wrapper">
      {list.length === 0 ? (
        <div>No Schedule is Booked</div>
      ) : (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {list.map((slot, index) => (
              <tr key={index}>
                <td>{slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}</td>
                <td>{slot.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
