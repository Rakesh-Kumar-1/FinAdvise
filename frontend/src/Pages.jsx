import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from './Pages/Auth'
import Front from './Pages/User/Front'
import Advisor from './Pages/User/Advisor'
import JoinMeeting from './Pages/User/JoinMeeting'
import Adminlogin from './Pages/Admin/Adminlogin'
import CreateManager from './Pages/Admin/Createmanager'
import ManagerProfile from './Pages/Manager/ManagerProfile'
import ManagerInfo from './Pages/Admin/ManagerInfo'
import Transcation from './Pages/Admin/Transcation'
import Complain from './Pages/Manager/Complain'
import Advisorfront from './Pages/Advisor/Advisorfront'
import AdvisorApprove from './Pages/Manager/AdvisorApprove'
import Test from './Test'
import Setting from './Pages/Component/Setting'
import  ChatBot  from './Pages/Component/Chatbot'
import AdvisorDeta from './Pages/Component/AdvisorDeta'
import { TranscationRecords } from './Pages/Component/TranscationRecords'
import ChatbotButton from './Pages/Component/ChatbotButton'


const Pages = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/front' element={<Front/>}/>
        <Route path ='/apply' element={<Advisor/>}/>
        <Route path="/join-meeting" element={<JoinMeeting/>} />
        <Route path ="/advisorinfo/:id" element={<AdvisorDeta/>}/>
        <Route path = '/admin' element={<Adminlogin/>}/>
        <Route path='/create-manager' element={<CreateManager/>}/>
        <Route path= '/manager' element={<ManagerProfile/>}/>
        <Route path ="/managerinfo/:id" element={<ManagerInfo/>}/>
        <Route path='/transcation/:name' element={<Transcation/>}/>
        <Route path='/complain/:name' element={<Complain/>}/>
        <Route path='/advisor' element={<Advisorfront/>}/>
        <Route path='/advisor-application' element={<AdvisorApprove/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/setting' element={<Setting/>}/>
        <Route path='/chatbot' element={<ChatBot/>}/>
        <Route path='/payment/transcation' element={<TranscationRecords/>}/>
      </Routes>
      <ChatbotButton/>
    </>

  )
}

export default Pages;

