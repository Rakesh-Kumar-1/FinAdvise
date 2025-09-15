import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { removeUser,deleteUsers } from './redux/slices/UserSlice'

const Test = () => {

  const data = useSelector((state)=>{
    return state.user;
  })
  console.log(data);

  const dispatch = useDispatch();
  const handleDelete = (index) =>{
    dispatch(removeUser(index));
  }
  const deleteall = () =>{
   dispatch(deleteUsers()); 
  }
  return (
    <div>
      {data && data.map((user,index)=>{
        return <li key={index}>
          {user}
          <button onClick={()=>{handleDelete(index)}}>Delete</button>
          </li>
      })}
      <button onClick={deleteall()}>DELETE ALL</button>
    </div>
  )
}

export default Test