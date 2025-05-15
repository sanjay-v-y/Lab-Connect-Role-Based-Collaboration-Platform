import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaFlask, FaCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";
import "../../Components/assets/adminDash.css"; 
import { fetchStudentsList, fetchLabs, fetchEvents, fetchFaculties } from "./API.js";

const Admin = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [labsCount, setLabsCount] = useState(0);
  const [facultiesCount, setFacultiesCount] = useState(0);
  const [ongoingEvents, setOngoingEvents] = useState([]);

  const userName = localStorage.getItem("userName") || "Admin";
  const userType = localStorage.getItem("userType") || "Admin";
  const profilePic = localStorage.getItem("profilePic") || "https://via.placeholder.com/50"; 
  console.log(profilePic)

  const navigate = useNavigate();

  const goToStudents = () => navigate("/users#students");
  const goToFaculties = () => navigate("/users#faculties");
  const goToLabs = () => navigate("/labs");
  const goToEvents = () => navigate("/events");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [students, labs, faculties, events] = await Promise.all([
          fetchStudentsList(),
          fetchLabs(),
          fetchFaculties(),
          fetchEvents()
        ]);
  
        console.log("Raw Events:", events);
  
        // Get current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split("T")[0];
  
        // Filter only ongoing events
        const filteredEvents = events.filter(event => 
          currentDate >= event.startDate && currentDate <= event.endDate
        );
  
        console.log("Ongoing Events:", filteredEvents);
  
        setStudentsCount(students.length);
        setLabsCount(labs.length);
        setFacultiesCount(faculties.length);
        setOngoingEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  function getOrdinalSuffix(n) {
    const suffixes = { 1: "st", 2: "nd", 3: "rd" };
    return suffixes[n] || "th";
  }   

  return (
    <div className="admin-container">
      <main className="main-content">
        <header className="admin-header">
          <h2>Welcome, <span>{userName} ({userType})</span></h2>
          <div className="profile-section">
            <img src={profilePic} alt="Profile" referrerPolicy="no-referrer" style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "contain",
            }} />
            <div className="user-name">{userName}</div>
          </div>
        </header>

        <section className="dashboard-stats">
        <div className="stat-card red" onClick={goToStudents}>
          <p>Total Students</p>
          <div className="stat-content">
            <FaUsers className="stat-icon" />
            <h3>{studentsCount}</h3>
          </div>
        </div>
        
        <div className="stat-card blue" onClick={goToLabs}>
          <p>Total Labs</p>
          <div className="stat-content">
            <FaFlask className="stat-icon" />
            <h3>{labsCount}</h3>
          </div>
        </div>

        <div className="stat-card yellow" onClick={goToFaculties}>
          <p>Total Faculties</p>
          <div className="stat-content">
            <FaChalkboardTeacher className="stat-icon" />
            <h3>{facultiesCount}</h3>
          </div>
        </div>

        <div className="stat-card green" onClick={goToEvents}>
          <p>Ongoing Events</p>
          <div className="stat-content">
            <FaCalendarCheck className="stat-icon" />
            <h3>{ongoingEvents.length}</h3>
          </div>
        </div>
      </section>

      <section className="ongoing-events">
  <h3>Ongoing Events</h3>
  <div className="ongoing-events-container">
    {[1, 2, 3, 4].map(year => (
      <div key={year} className="ongoing-year">
        <h4>{year}{getOrdinalSuffix(year)} Year:</h4>
        <ul>
          {ongoingEvents.filter(event => event.year === year).length > 0 ? (
            ongoingEvents
              .filter(event => event.year === year)
              .map(event => <li key={event.id}>{event.title}</li>)
          ) : (
            <li className="red-text">No ongoing events</li>
          )}
        </ul>
      </div>
    ))}
  </div>
</section>
      </main>
    </div>
  );
};

export default Admin;
