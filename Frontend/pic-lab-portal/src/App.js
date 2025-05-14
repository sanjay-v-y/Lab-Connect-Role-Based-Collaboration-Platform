import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login";
import Home from './Pages/Home.js';
import AdminDashboard from './Pages/Admin/Dashboard.js';
import Labs from './Pages/Admin/Labs.js';
import User from './Pages/Admin/User.js';
import EventPage from "./Pages/Admin/event.js"; 
import Layout from './Components/layout.js'; 

import StudentLabDetails from './Pages/Student/LabDetails.js';
import StudentDashboard from './Pages/Student/Dashboard.js';

import FacultyDashboard from './Pages/Faculty/Dashboard.js';
import ViewStudents from './Pages/Faculty/ViewStudents.js'; 
import Requests from './Pages/Faculty/request.js'; 
import Attendance from './Pages/Faculty/attendance.js'; 

import IndustryPerson from './Pages/Industry person/Dashboard.js';
import DiscussForum from './Pages/DiscussForum/discussForum.js';
import PostPage from './Pages/DiscussForum/post.js'; 

function App() {
  // Prevents localStorage issues when rendering
  const userRole = localStorage.getItem("userType");
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/success" element={<Login />} />
        <Route path="/*" element={<Layout />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="labs" element={<Labs />} />
          <Route path="user" element={<User />} />
          <Route path="events" element={<EventPage />} />

          {/* Student */}
          <Route path="student" element={<StudentDashboard />} /> 
          <Route path="studentLabDetails" element={<StudentLabDetails />} /> 

          {/* Faculty */}
          <Route path="faculty" element={<FacultyDashboard />} />
          <Route path="viewStudents" element={<ViewStudents/>}/>
          <Route path="requests" element={<Requests />} />
          <Route path="attendance" element={<Attendance />} />

          {/* Industry Person */}
          <Route path="indsPartner" element={<IndustryPerson />} />

          {/* Discuss Forum */}
          <Route path="discussForum" element={<DiscussForum userRole={userRole} />} />
          <Route path="discussForum/posts/:categoryId" element={<PostPage userRole={userRole} />} /> 

            
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
