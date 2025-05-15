import { useEffect, useState } from "react";
import { FaUsers, FaClipboardList, FaUserCheck, FaExchangeAlt } from "react-icons/fa";
import "../../Components/assets/facultyDash.css"; 
import Sidebar from "../../Components/Nav/Sidebar.js";
import { fetchFacultyDetails, fetchLabDetails, fetchStudentCount, fetchAttendanceCount, fetchFacultyRequests, fetchLabChangeRequests, fetchEvents } from "./api.js";

const Faculty = () => {
  const [facultyData, setFacultyData] = useState({});
  const [labData, setLabData] = useState({});
  const [studentsCount, setStudentsCount] = useState(0);
  const [presentStudents, setPresentStudents] = useState(0);
  const [registrationRequests, setRegistrationRequests] = useState(0);
  const [labChangeRequests, setLabChangeRequests] = useState(0);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  
  const userId = localStorage.getItem("userId"); 
  const userName = localStorage.getItem("userName") || "Faculty";
  const userType = localStorage.getItem("userType") || "Faculty";
  const profilePic = localStorage.getItem("profilePic") || "/default-profile.png"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyDetails = await fetchFacultyDetails(userId);
        setFacultyData(facultyDetails);

        if (facultyDetails.labId) {
          const labDetails = await fetchLabDetails(facultyDetails.labId);
          setLabData(labDetails);

          const currentDate = new Date().toISOString().split("T")[0];

          const [students, present, requests, labChanges, events] = await Promise.all([
            fetchStudentCount(facultyDetails.labId),
            fetchAttendanceCount(facultyDetails.labId, currentDate),
            fetchFacultyRequests(userId),
            fetchLabChangeRequests(userId),
            fetchEvents(),
          ]);

          const filteredEvents = events.filter(event => 
            currentDate >= event.startDate && currentDate <= event.endDate
          );

          setStudentsCount(students);
          setPresentStudents(present);
          setRegistrationRequests(requests.length);
          setLabChangeRequests(labChanges.length);
          setOngoingEvents(filteredEvents);
        } else {
          setLabData({ name: "Not Assigned to a Lab", description: "-" });
        }
      } catch (error) {
        console.error("Error fetching faculty dashboard data:", error);
      }
    };
    fetchData();
  }, [userId]);

  function getOrdinalSuffix(n) {
    const suffixes = { 1: "st", 2: "nd", 3: "rd" };
    return suffixes[n] || "th";
  } 

  return (
    <div className="faculty-dash-container">
      <Sidebar userRole="faculty"/>
      <main className="main-dash-content">
        <header className="faculty-dash-header">
          <h2>Welcome, <span>{userName}</span> <span className="user-type-inline">({userType})</span></h2>
          <div className="profile-section">
            <img src={profilePic} alt="Profile" className="profile-img" referrerPolicy="no-referrer" />
            <div className="user-name">{userName}</div>
          </div>
        </header>

        {facultyData.labId && (
          <>
            <section className="faculty-dashboard-stats">
              <div className="stat-card blue">
                <p>Total Students in Lab</p>
                <div className="stat-content">
                  <FaUsers className="stat-icon" />
                  <h3>{studentsCount}</h3>
                </div>
              </div>
              
              <div className="stat-card green">
                <p>Present Students</p>
                <div className="stat-content">
                  <FaUserCheck className="stat-icon" />
                  <h3>{presentStudents}</h3>
                </div>
              </div>

              <div className="stat-card yellow">
                <p>Registration Requests</p>
                <div className="stat-content">
                  <FaClipboardList className="stat-icon" />
                  <h3>{registrationRequests}</h3>
                </div>
              </div>

              <div className="stat-card red">
                <p>Lab Change Requests</p>
                <div className="stat-content">
                  <FaExchangeAlt className="stat-icon" />
                  <h3>{labChangeRequests}</h3>
                </div>
              </div>
            </section>

            <section className="faculty-dash-details">
              <div className="details-dash-container">
                <p><strong>ID:</strong> {facultyData.id || "-"}</p>
                <p><strong>Email:</strong> {facultyData.email || "-"}</p>
                <p><strong>Department:</strong> {facultyData.dept || "-"}</p>
                <p><strong>Associated Lab:</strong> {labData.name || "Not Assigned"}</p>
                <p><strong>Description:</strong> {labData.description || "-"}</p>
              </div>
            </section>

            <section className="ongoing-events">
            <h3 style={{ fontSize: "1.5rem" }}>Ongoing Events</h3>
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
          </>
        )}
      </main>
    </div>
  );
};

export default Faculty;
