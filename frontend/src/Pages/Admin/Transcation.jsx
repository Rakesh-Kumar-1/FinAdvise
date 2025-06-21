import axios from 'axios';
import '../../CSS/Transcation.css'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Transcation = () => {
    const { name } = useParams();
    const [trans, setTrans] = useState([]);
    useEffect(() => {
        const fetchManager = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/admin/transcation/${name}`);
                setTrans(res.data)
            } catch (err) {
                console.log('Failed to fetch manager', err)
            }
        };
        fetchManager();
    }, [name]);
    return (
        <div className="transcation-page">
            <main>
                <h2>List of Advisors</h2>
                <div className="transcation-grid">
                    {trans.map((item, index) => (
                        <div key={index} className="transcation-card">
                            <h3>{item.name}</h3>
                            <p><strong>Sender:</strong> {item.sender}</p>
                            <p><strong>Receiver:</strong> {item.receiver}</p>
                            <p><strong>Amount:</strong> ₹{item.amount}</p>
                            <p><strong>Date:</strong> {item.date}</p>
                            <p><strong>Account Number:</strong> {item.accountnumber}</p>
                            <p><strong>Transaction ID:</strong> {item.transcation_id}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Transcation