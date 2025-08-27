import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../CSS/TransactionManager.css';

const TransactionManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/manager/transaction');
      setData(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Transaction Manager</h1>

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : data.length === 0 ? (
        <div className="noRecords">No Records Found</div>
      ) : (
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Payment Method</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.transactionId}</td>
                  <td>{item.amount}</td>
                  <td>{item.senderId}</td>
                  <td>{item.recieverId}</td>
                  <td>{item.payment_method}</td>
                  <td>{item.day} — {item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionManager;
