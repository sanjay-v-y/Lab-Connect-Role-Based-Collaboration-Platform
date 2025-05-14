import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Nav/Sidebar.js";
import { fetchFacultyDetails, fetchLabDetails, fetchLabStudents } from "./api.js";
import TableComponent from "../Admin/TableComp.js";

import "../../Components/assets/viewStudents.css";

const FacultyDashboard = () => {
  const [faculty, setFaculty] = useState(null);
  const [lab, setLab] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyId = localStorage.getItem("userId");
        if (!facultyId) {
          console.error("No faculty ID found in localStorage");
          setError(true);
          return;
        }

        // ✅ Fetch faculty details
        const facultyData = await fetchFacultyDetails(facultyId);
        console.log("Fetched Faculty Data:", facultyData);
        if (!facultyData) {
          setError(true);
          return;
        }

        setFaculty(facultyData);

        // ✅ Fetch lab details only if faculty is assigned
        if (facultyData.labId && facultyData.labName) {
          const labData = await fetchLabDetails(facultyData.labId);
          console.log("Fetched Lab Data:", labData);
          setLab(labData);

        // ✅ Fetch students of the lab
        const studentsData = await fetchLabStudents(facultyData.labId);
        console.log("Fetched Students:", studentsData);

        // ✅ Format student data to ensure `rollNo` exists
        const formattedStudents = studentsData.map(student => ({
        id: student.id, // Ensure rollNo is set, fallback to id if missing
        name: student.name,
        email: student.email,
        year: student.year || "N/A", // Handle missing year
        department: student.department || "N/A", // Handle missing department
        }));

        setStudents(formattedStudents);

        }
      } catch (err) {
        console.error("Error fetching faculty or lab data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Failed to fetch data. Please try again later.</p>;
  if (!faculty) return <p>No faculty data available.</p>;

  localStorage.setItem("userName", faculty.name);

  return (
    <div className="faculty-view-container">
      <Sidebar userRole="faculty" />
      <h1>{lab.name} Students List</h1>
      <div className="faculty-view-content">

        {/* ✅ Show student list only if lab is assigned */}
        {lab && students.length > 0 ? (
          <div className="students-list">
            <h2>Students in Lab</h2>
            <TableComponent data={students} onEdit={() => {}} onDelete={() => {}} />
          </div>
        ) : (
          lab && <p>No students in this lab</p>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
