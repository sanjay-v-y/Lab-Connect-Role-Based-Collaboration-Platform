import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.js';
import Admin from './Pages/Admin/Admin.js';
import Labs from './Pages/Labs.js';
import User from './Pages/User.js';
import Layout from './Components/layout.js'; // Import Layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page without Sidebar */}
        <Route path="/" element={<Home />} />
        
        {/* Routes that use Layout (which includes Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/user" element={<User />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
