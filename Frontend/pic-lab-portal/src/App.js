import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login";
import Home from './Pages/Home.js';
import Admin from './Pages/Admin/Admin.js';
import Labs from './Pages/Admin/Labs.js';
import User from './Pages/Admin/User.js';
import Layout from './Components/layout.js'; // Import Layout

import Student from './Pages/Student/student.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Layout />}>
          <Route path="admin" element={<Admin />} />
          <Route path="labs" element={<Labs />} />
          <Route path="user" element={<User />} />
          <Route path="student" element={<Student />} /> {/* Add Student Route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
