import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from './Pages/Auth'
import Front from './Pages/User/Front'
import Advisor from './Pages/User/Advisor'
import JoinMeeting from './Pages/User/JoinMeeting'
import AdvisorDetails from './Pages/Component/AdvisorDetails'
import User_payments from './Pages/Component/User_payments'
import Success from './Pages/Component/Success'
import Adminlogin from './Pages/Admin/Adminlogin'
import CreateManager from './Pages/Admin/Createmanager'
import ManagerProfile from './Pages/Manager/ManagerProfile'
import ManagerInfo from './Pages/Admin/ManagerInfo'
import Transcation from './Pages/Admin/Transcation'
import Complain from './Pages/Manager/Complain'
import Advisorfront from './Pages/Advisor/Advisorfront'
import AdvisorApprove from './Pages/Manager/AdvisorApprove'
import Test from './Test'
// import {SocketProvider} from '../Component/Socket'
// import Room from './Room'
// import { PeerProvider } from '../Component/Peer'
// import LobbyScreen from "../screens/Lobby";
// import RoomPage from "../screens/Room";


const Pages = () => {
  return (
    // <SocketProvider>
    //   <PeerProvider>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/front' element={<Front/>}/>
        <Route path ='/apply' element={<Advisor/>}/>
        <Route path="/join-meeting" element={<JoinMeeting/>} />
        <Route path ="/advisorinfo/:id" element={<AdvisorDetails/>}/>
        <Route path ='/payment' element={<User_payments/>}/>
        <Route path = '/success' element={<Success/>}/>
        <Route path = '/admin' element={<Adminlogin/>}/>
        <Route path='/create-manager' element={<CreateManager/>}/>
        <Route path= '/manager' element={<ManagerProfile/>}/>
        <Route path ="/managerinfo/:id" element={<ManagerInfo/>}/>
        <Route path='/transcation/:name' element={<Transcation/>}/>
        <Route path='/complain/:name' element={<Complain/>}/>
        <Route path='/advisor' element={<Advisorfront/>}/>
        <Route path='/advisor-application' element={<AdvisorApprove/>}/>
        <Route path='/test' element={<Test/>}/>
        {/*
        <Route path='/room/:roomId' element={<Room/>} />
        <Route path="/lobby" element={<join-meeting />} />
        <Route path="/room/:roomId" element={<RoomPage />} /> */}

      </Routes>
    //   </PeerProvider>
    // </SocketProvider>
  )
}

export default Pages;

