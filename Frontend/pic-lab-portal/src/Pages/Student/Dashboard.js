import React, { useEffect, useState } from "react";
import { fetchAttendancePercentage, fetchOngoingEvent, fetchStudentDetails  } from "./api.js";
import Sidebar from "../../Components/Nav/Sidebar.js";
import "../../Components/assets/studentDash.css";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName"),
    userType: localStorage.getItem("userType"),
    profilePic: localStorage.getItem("profilePic") || "/default-profile.png",
    email:"",
    year: null
  });

  const [attendance, setAttendance] = useState(null);
  const [ongoingEvent, setOngoingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const currentDate = new Date().toISOString().split("T")[0];

      try {
        // Fetch Student Details (to get Email and Year of Study)
        const studentDetails = await fetchStudentDetails(studentData.id);
        if (studentDetails) {
            setStudentData((prevData) => ({
            ...prevData,
            email: studentDetails.email, 
            year: studentDetails.year
            }));

            if (studentDetails.status === "APPROVED") {
              setIsEnrolled(true); 
            }
        }

        if (studentDetails.status === "APPROVED") {
          setIsEnrolled(true);
        
          // ✅ Only fetch these if student is in a lab
          const attendancePercentage = await fetchAttendancePercentage(studentData.id, currentDate);
          setAttendance(
            attendancePercentage !== null && !isNaN(attendancePercentage)
              ? parseFloat(attendancePercentage).toFixed(2)
              : "N/A"
          );
        
          const eventData = await fetchOngoingEvent(studentData.id, currentDate);
          setOngoingEvent(eventData);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentData.id]);

  return (
    <div className="student-dashboard">
      <Sidebar userRole="student"/>
      <div className="welcome-section">
        <img src={studentData.profilePic} alt="Profile" className="student-profile-picture" referrerPolicy="no-referrer"/>
        <div>
          <h2>Welcome, {studentData.name}!</h2>
          <p className="user-type">({studentData.userType})</p>
        </div>
      </div>

      <div className="student-info">
        <p><strong>Student ID:</strong> {studentData.id}</p>
        <p><strong>Email:</strong> {studentData.email}</p>
        <p><strong>Year:</strong> {studentData.year}</p>
      </div>

      {isEnrolled && (
      <div className="event-section">
        <h2>Ongoing Event</h2>
        {loading ? <p>Loading...</p> : ongoingEvent ? (
          <div className="event-card">
            <h4>{ongoingEvent.title}</h4>
            <p><strong>Start Date:</strong> {ongoingEvent.startDate}</p>
            <p><strong>End Date:</strong> {ongoingEvent.endDate}</p>
          </div>
        ) : (
          <p>No ongoing event</p>
        )}
      </div>
      )}

      {isEnrolled && ongoingEvent && (
        <div className="attendance-section">
          <div className="attendance-row">
          <h3>
            Attendance Percentage for{" "}
            <span className="event-name-green">
              {ongoingEvent ? ongoingEvent.title : "N/A"}
            </span>
            :
          </h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <p className={`attendance-value ${
                attendance >= 70 ? "green" : attendance >= 50 ? "yellow" : "red"
              }`}>
                {attendance}%
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
