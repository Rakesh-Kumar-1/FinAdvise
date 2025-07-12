import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const ScheduleBooked = (props) => {
    const[list,setList]=useState([]);
    const id = props.id;
    const bookedschedule = async() =>{
        try{
            const bookedlist = await axios.get(`https://localhost:8080/advisor/bookdschedule`,{id});
            if(bookedlist.data.status === true){
                setList(bookedlist.data.info);
            }
        }
        catch(e){
            alert("Refresh this page...");
        }
    }
    useEffect(()=>{
        bookedschedule();
    },[id])
  return (
    <div>
        {list.length==0?(<div>No Schedule is Booked</div>):(
            <table>
                <tr>
                    <th>Day</th>
                    <th>Time</th>
                </tr>
                <tr>
                    {list.map((slot,index)=>(
                        <>
                        <td>{slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}</td>
                        <td>{slot.time}</td>
                        </>
                    ))}
                </tr>
            </table>
        )}
        
    </div>
  )
}
