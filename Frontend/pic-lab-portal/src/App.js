import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./assets/Pages/Admin/Dashboard";
import StudentDashboard from "./assets/Pages/Student/Dashboard";
import FacultyDashboard from "./assets/Pages/Faculty/Dashboard";
import IndustryPersonDashboard from "./assets/Pages/IndustryPerson/Dashboard";
import Login from "./assets/Pages/Auth/Login";

function Home() {
  return <h1>Golden Wind!</h1>;
}

function App() {
  return (
    <Router>
      <div>
        <h1>Gioronno GIovanni</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/industry/dashboard" element={<IndustryPersonDashboard />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
