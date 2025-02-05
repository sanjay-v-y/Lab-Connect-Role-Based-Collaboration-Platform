import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "";
import StudentDashboard from "";
import FacultyDashboard from "rd";
import IndustryPersonDashboard from "";
import Login from "";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="" element={<AdminDashboard />} />
        <Route path="" element={<StudentDashboard />} />
        <Route path="" element={<FacultyDashboard />} />
        <Route path="" element={<IndustryPersonDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
