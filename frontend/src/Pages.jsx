import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ChatbotButton from "./Pages/Component/ChatbotButton";

const Auth = React.lazy(() => import("./Pages/Auth"));
const Front = React.lazy(() => import("./Pages/User/Front"));
const Advisor = React.lazy(() => import("./Pages/User/Advisor"));
const JoinMeeting = React.lazy(() => import("./Pages/User/JoinMeeting"));
const Adminlogin = React.lazy(() => import("./Pages/Admin/Adminlogin"));
const CreateManager = React.lazy(() => import("./Pages/Admin/CreateManager"));
const ManagerProfile = React.lazy(() => import("./Pages/Manager/ManagerProfile"));
const ManagerInfo = React.lazy(() => import("./Pages/Admin/ManagerInfo"));
const Transcation = React.lazy(() => import("./Pages/Admin/Transcation"));
const Complain = React.lazy(() => import("./Pages/Manager/Complain"));
const Advisorfront = React.lazy(() => import("./Pages/Advisor/Advisorfront"));
const AdvisorApprove = React.lazy(() => import("./Pages/Manager/AdvisorApprove"));
const Test = React.lazy(() => import("./Test"));
const Setting = React.lazy(() => import("./Pages/Component/Setting"));
const ChatBot = React.lazy(() => import("./Pages/Component/ChatBot"));
const AdvisorDeta = React.lazy(() => import("./Pages/Component/AdvisorDeta"));
const TranscationRecords = React.lazy(() => import("./Pages/Component/TranscationRecords"));
const Room = React.lazy(() => import("./Pages/Component/Room"));
const TranscationManager = React.lazy(() => import("./Pages/Manager/TranscationManager"));
const Pages = () => {
  return (
    <>
      <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/front" element={<Front />} />
          <Route path="/apply" element={<Advisor />} />
          <Route path="/join-meeting" element={<JoinMeeting />} />
          <Route path="/advisorinfo/:id" element={<AdvisorDeta />} />
          <Route path="/admin" element={<Adminlogin />} />
          <Route path="/create-manager" element={<CreateManager />} />
          <Route path="/manager" element={<ManagerProfile />} />
          <Route path="/managerinfo/:id" element={<ManagerInfo />} />
          <Route path="/transcation/:name" element={<Transcation />} />
          <Route path="manager/complain/:name" element={<Complain />} />
          <Route path="/advisor" element={<Advisorfront />} />
          <Route path="/advisor-application" element={<AdvisorApprove />} />
          <Route path="/test" element={<Test />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/chatroom" element={<Room />} />
          <Route path="/payment/transcation" element={<TranscationRecords />} />
          <Route path="/manager/transcation" element={<TranscationManager />} />
        </Routes>
      </Suspense>
      <ChatbotButton />
    </>
  );
};

export default Pages;
