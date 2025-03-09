import React, { useState, useEffect } from "react";
import { fetchFaculties, fetchStudentsList, addFaculty, addStudent, deleteFaculty, deleteStudent } from "./API.js";
import TableComponent from "./TableComp.js";
import "../../Components/assets/user.css";

const Users = () => {
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchFaculty, setSearchFaculty] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [showForm, setShowForm] = useState(null); // 'faculty' or 'student'
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    rollNo: "",
    year: ""
  });

  useEffect(() => {
    loadFaculties();
    loadStudents();
  }, []);

  const loadFaculties = async () => {
    try {
      const data = await fetchFaculties();
      setFaculties(data);
    } catch (error) {
      console.error("Error loading faculties:", error);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await fetchStudentsList();
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const handleDeleteFaculty = async (id) => {
    await deleteFaculty(id);
    loadFaculties();
  };

  const handleDeleteStudent = async (id) => {
    await deleteStudent(id);
    loadStudents();
  };

  const handleAdd = async () => {
    if (!formData.id || !formData.name || !formData.email || !formData.department) {
        alert("ID, Name, Email, and Department are required!");
        return;
    }

    try {
        if (showForm === "faculty") {
            await addFaculty({
                id: formData.id,
                name: formData.name,
                email: formData.email,
                department: formData.department
            });
            loadFaculties();
        } else if (showForm === "student") {
            await addStudent({
                id: formData.id,
                name: formData.name,
                email: formData.email,
                year: formData.year,
                department: formData.department
            });
            loadStudents();
        }
        setShowForm(null);
        setFormData({ id: "", name: "", email: "", department: "", rollNo: "", year: "" });
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

  return (
    <div className="user-container">
      <h1>Manage Users</h1>

      {/* Faculty Section */}
      <div className="table-section">
        <h2>Faculties</h2>
        <input
          type="text"
          placeholder="Search Faculty by ID or Name..."
          value={searchFaculty}
          onChange={(e) => setSearchFaculty(e.target.value)}
        />
        <TableComponent
          data={faculties.filter((f) => f.name.includes(searchFaculty) || f.id.includes(searchFaculty))}
          onDelete={handleDeleteFaculty}
          columns={["ID", "Name", "Email", "Department"]}
        />
      </div>

      {/* Student Section */}
      <div className="table-section">
        <h2>Students</h2>
        <input
          type="text"
          placeholder="Search Student by ID or Name..."
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
        />
        <TableComponent
          data={students.filter((s) => s.name.includes(searchStudent) || s.id.includes(searchStudent))}
          onDelete={handleDeleteStudent}
          columns={["Roll Number", "Name", "Email", "Year", "Department"]}
        />
      </div>

      {/* Add Faculty or Student Buttons */}
      <div className="add-buttons">
        <button type ="button" onClick={() => setShowForm("faculty")}>Add Faculty</button>
        <button type="button" onClick={() => setShowForm("student")}>Add Student</button>
      </div>

      {/* Form Section */}
      {showForm && (
    <div className="form-container">
        <h2>{showForm === "faculty" ? "Add Faculty" : "Add Student"}</h2>
        
        <input type="text" placeholder="ID" value={formData.id} 
            onChange={(e) => setFormData({ ...formData, id: e.target.value })} />
        
        <input type="text" placeholder="Name" value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        
        <input type="email" placeholder="Email" value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

        <input type="text" placeholder="Department" value={formData.department} 
            onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
        
        {showForm === "student" && (
            
                <input type="text" placeholder="Year" value={formData.year} 
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
            
        )}
        
        <button type="button" onClick={handleAdd}>Submit</button>
        <button type="button" onClick={() => setShowForm(null)}>Cancel</button>
    </div>
)}
    </div>
  );
};

export default Users;
