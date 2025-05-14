import React, { useState, useEffect } from "react";
import { fetchEligibleStudents, updateAttendance } from "./api.js";
import "../../Components/assets/attendance.css";
import Sidebar from "../../Components/Nav/Sidebar.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [sessionType, setSessionType] = useState("FN"); // Default FN
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyId, setFacultyId] = useState(null); // Store facultyId

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    // Fetch facultyId from localStorage
    const storedFacultyId = localStorage.getItem("userId"); // userId is the facultyId
    if (storedFacultyId) {
      setFacultyId(storedFacultyId);
    } else {
      console.error("Faculty ID not found in localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!facultyId) return; // Prevent fetching if facultyId is not set

      try {
        const date = getTodayDate();
        const data = await fetchEligibleStudents(date, facultyId);
        // Map API data to match the expected structure
        setStudents(
          data.map((item) => ({
            studentId: item.student.id || "", // Extract student ID
            name: item.student.name || "", // Extract student name
            forenoonStatus: item.forenoonStatus ?? false, // Ensure boolean value
            afternoonStatus: item.afternoonStatus ?? false, // Ensure boolean value
          }))
        );
        } catch (error) {
        console.error("Error fetching students:", error);
        }
        };
    fetchStudents();
  }, [facultyId]);

  // Handle attendance update (Present / Absent)
  const updateAttendanceStatus = async (studentId, status) => {
    const updatedStudents = students.map((student) => {
      if (student.studentId === studentId) {
        const updatedAttendance = {
          student: { id: studentId },
          date: getTodayDate(),
          forenoonStatus: sessionType === "FN" ? status : student.forenoonStatus,
          afternoonStatus: sessionType === "AN" ? status : student.afternoonStatus,
        };

        console.log(updatedAttendance);
        updateAttendance(updatedAttendance);

        return {
          ...student,
          forenoonStatus: updatedAttendance.forenoonStatus,
          afternoonStatus: updatedAttendance.afternoonStatus,
        };
      }
      return student;
    });

    setStudents(updatedStudents);
  };

    // Determine the status text dynamically
    const getStatusText = (student) => {
        if (student.forenoonStatus && student.afternoonStatus) return "Present";
        if (student.forenoonStatus || student.afternoonStatus) return "Present (Half-Day)";
        return "Absent";
    };

  return (
    <div className="attendance-page">
      <Sidebar userRole="faculty" />
      <h2 style={{fontSize:"1.7rem"}}>Mark Attendance</h2>

      <div className="top-controls">
        <div className="session-selection-inline">
          <label>Session:</label>
          <select value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
            <option value="FN">Forenoon (FN)</option>
            <option value="AN">Afternoon (AN)</option>
          </select>
        </div>

        <div className="search-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Roll No or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Status</th>
            <th>{sessionType}</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter((student) => {
                const name = student.name ? student.name.toLowerCase() : "";
                const studentId = student.studentId ? student.studentId.toLowerCase() : "";
                return name.includes(searchTerm.toLowerCase()) || studentId.includes(searchTerm.toLowerCase());
            })
            .map((student) => (
              <tr key={student.studentId} className={
                student.forenoonStatus && student.afternoonStatus
                  ? "present-row"
                  : student.forenoonStatus
                  ? "half-present-fn"
                  : student.afternoonStatus
                  ? "half-present-an"
                  : "absent-row"
              }>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{getStatusText(student)}</td>
                <td>
                {/* Conditional Rendering for Present & Absent Buttons */}
                {sessionType === "FN" ? (
                  student.forenoonStatus ? (
                    <button
                      type="button"
                      className="absent-btn"
                      onClick={() => updateAttendanceStatus(student.studentId, false)}
                    >
                      Absent
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="present-btn"
                      onClick={() => updateAttendanceStatus(student.studentId, true)}
                    >
                      Present
                    </button>
                  )
                ) : sessionType === "AN" ? (
                  student.afternoonStatus ? (
                    <button
                      type="button"
                      className="absent-btn"
                      onClick={() => updateAttendanceStatus(student.studentId, false)}
                    >
                      Absent
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="present-btn"
                      onClick={() => updateAttendanceStatus(student.studentId, true)}
                    >
                      Present
                    </button>
                  )
                ) : null}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
