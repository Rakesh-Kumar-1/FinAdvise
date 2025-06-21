import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoCompassOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom'

const Complain = () => {
    const { name } = useParams();
    const [complain, setComplain] = useState([]);
    const [feedback, setFeedback] = useState('');



    useEffect(() => {
        const fetchData = () => {
            try {
                const complain = axios.get(`http://localhost:8080/manager/complaintype/${name}`);
                setComplain(complain.data)
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [name])
    const removeData = async (index) => {
        try {
            const res = await axios.post(`http://localhost:8080/manager/complain`, {
                feedback,
                name,
                index
            });
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="">
            <main>
                <h2>List Of {name.toUpperCase} Complain </h2>
                <div className="">
                    {complain.map((item, index) => (
                        <div key={index} className="">
                            <h3>{item.name}</h3>
                            <p><strong>Sender:</strong> {item.sender}</p>
                            <p><strong>Subject:</strong> {item.subject}</p>
                            <p><strong>Decription:</strong> {item.description}</p>
                            <p><strong>Date:</strong> {item.date}</p>
                            <textarea
                                placeholder={`Give description what ${name} is facing`}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                            <button className='' disabled={feedback.trim() === ''} onClick={() => { removeData(index) }}>Solved</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Complain