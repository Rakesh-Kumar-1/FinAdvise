import React, { useEffect } from 'react'
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
        {records != null ? (
          records.map((item, index) => (
            <>
            <p key={index}>{item.transcationId}</p>
            <p>{item.price}</p>
            <p>{item.sender}</p>
            <p>{item.date}</p>
            </>
          ))
        ) : (
          "No records found"
        )}
      </div>

    </div>
  )
}
