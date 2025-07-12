import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../Context/UserContext'
import axios from 'axios';

export const TranscationRecords = () => {
  const { position } = useContext(UserContext);
  const [records, setRecords] = useState({});
  const id = position._id;

  const fetchDisapproved = async () => {
    try {
      const res = await axios.get('http://localhost:8080/payment/records', id);
      setRecords(res.data.info);
    } catch (err) {
      console.log("Error fetching disapproved advisors:", err);
    }
  };

  useEffect(() => {
    fetchDisapproved();
  }, []);


  return (
    <div>
      <p>{id}</p>
      <div>
  {records && records.length > 0 ? (
    <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Price</th>
          <th>Sender</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {records.map((item, index) => (
          <tr key={index}>
            <td>{item.transcationId}</td>
            <td>{item.price}</td>
            <td>{item.sender}</td>
            <td>{item.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No records found</p>
  )}
</div>


    </div>
  )
}
