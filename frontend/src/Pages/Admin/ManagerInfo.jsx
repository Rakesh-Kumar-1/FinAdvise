import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const ManagerInfo = () => {
    const [manager,setManager] = useState(null);
    const {id} = useParams();

    useEffect(()=> {
        const fetchManager = async() =>{
            try{
                const res = await axios.get(`http://localhost:8080/admin/managerinfo/${id}`);
                setManager(res.data)
            }catch(err){
                console.log('Failed to fetch manager',err)
            }
        };
        fetchManager();
    },[id]);
  return (
    <div>
        <div className="manager-detail-box">
          <h2>{manager.name}</h2>
          <p><strong>Experience:</strong> {manager.experience}</p>
          <p><strong>Bio:</strong> {manager.bio}</p>
          <p><strong>Rating:</strong> {manager.rating}</p>
          <p><strong>Clients:</strong> {manager.clients}</p>
          <div className="review-stars">
            {"★".repeat(manager.rating)}{"☆".repeat(5 - manager.rating)}
          </div>
        </div>
    </div>
  )
}

export default ManagerInfo