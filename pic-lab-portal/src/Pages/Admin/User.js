import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { fetchFaculties, fetchStudentsList, addFaculty, addStudent, deleteFaculty, deleteStudent,
  fetchIndustrialPartners, addIndustrialPartner, editIndustrialPartner, deleteIndustrialPartner, 
  editFaculty, editStudent } from "./API.js";

import TableComponent from "./TableComp.js";
import "../../Components/assets/user.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Users = () => {
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);
  const [industrialPartners, setIndustrialPartners] = useState([]);

  const [searchFaculty, setSearchFaculty] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [searchIndustrialPartner, setSearchIndustrialPartner] = useState("");

  const [showForm, setShowForm] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    rollNo: "",
    year: "",
    labId: "",
    labName: "",
  });
  const [departmentDropdownVisible, setDepartmentDropdownVisible] = useState(false);
  const [yearDropdownVisible, setYearDropdownVisible] = useState(false);

  const [emailError, setEmailError] = useState("");

    const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadFaculties();
    loadStudents();
    loadIndustrialPartners();
  }, []);

  const studentRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#students" && studentRef.current) {
      studentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDepartmentDropdownVisible(false);
        setYearDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

  const loadIndustrialPartners = async () => {
    try {
      const data = await fetchIndustrialPartners();
      const formattedData = data.map(partner => ({
        ...partner,
        labName: partner.labName ? partner.labName : "N/A",
      }));
      setIndustrialPartners(formattedData);
    } catch (error) {
      console.error("Error loading industrial partners:", error);
    }
  };

  
  const validateEmail = (email) => {
    if (!email) {
      setEmailError(""); 
      return true;
    }
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailError(isValid ? "" : "Invalid Email");
    return isValid;
  };

  const handleEdit = (item, type) => {
    console.log("Editing item:", item); 
    setIsEditing(true);
    setShowForm(type);
    setFormData({
      ...item,
      email: item.email || "", 
    });
  };

  const handleDelete = async (id, type) => {
    const itemName = type.charAt(0).toUpperCase() + type.slice(1);

    try {
      if (type === "faculty") {
        await deleteFaculty(id);
        loadFaculties();
      } else if (type === "student") {
        await deleteStudent(id);
        loadStudents();
      } else if (type === "industrialPartner") {
        await deleteIndustrialPartner(id);
        loadIndustrialPartners();
      }
      showNotification(`🗸 ${itemName} deleted successfully!`);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSubmit = async () => {
    console.log(formData)
    if (!formData.id || !formData.name || (showForm === "industrialPartner" && !formData.email)) {
      alert("ID, Name, and Email are required!");
      return;
    }
    if (!validateEmail(formData.email)) return;

    try {
      if (showForm === "faculty") {
        const facultyData = {
          id: formData.id,
          name: formData.name,
          email: formData.email,
          department: formData.department,
        };
  
        if (isEditing) {
          await editFaculty(formData.id, facultyData);
          showNotification("Faculty updated successfully!");
        } else {
          await addFaculty(facultyData);
          showNotification("New Faculty created successfully!");
        } 
        console.log(facultyData);
        loadFaculties();
      } 
      else if (showForm === "student") {
        const studentData = {
          id: formData.id,
          name: formData.name,
          email: formData.email,
          year: formData.year,
          department: formData.department,
        };
  
        if (isEditing) {
          await editStudent(formData.id, studentData);
          showNotification("Student updated successfully!");
        } else {
          await addStudent(studentData);
          showNotification("New Student created successfully!");
        }
        loadStudents();
      } 
      else if (showForm === "industrialPartner") {
        const industrialPartnerData = {
          id: formData.id,
          name: formData.name,
          email: formData.email,
        };
  
        if (isEditing) {
          await editIndustrialPartner(formData.id, industrialPartnerData);
          showNotification("Industrial Partner updated successfully!");
        } else {
          await addIndustrialPartner(industrialPartnerData);
          showNotification("New Industrial Partner created successfully!");
        }
        loadIndustrialPartners();
      }
      setShowForm(null);
      setIsEditing(false);
      setFormData({ id: "", name: "", email: "", department: "", rollNo: "", year: "", labId: "", labName: "" });
    } catch (error) {
      console.error("Error processing request:", error);
    }
  };

  const showNotification = (message) => {
    console.log("Notification triggered:", message); // ✅ Debugging log
    setNotification(message);
    setTimeout(() => {
      setNotification(null); // Hide after 2 sec
    }, 2000);
  };

  return (
    <div className="user-container">

      {/* Add Faculty or Student Buttons */}
      <div className="add-buttons">
        <button type ="button" onClick={() => setShowForm("faculty")}>Add Faculty</button>
        <button type="button" onClick={() => setShowForm("student")}>Add Student</button>
        <button type="button" onClick={() => setShowForm("industrialPartner")}>Add Industrial Partner</button>
      </div>

      {notification && (
          <div className="popup-notification">
            {notification}
          </div>
        )}

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
          onEdit={(item) => handleEdit(item, "faculty")} onDelete={(id) => handleDelete(id, "faculty")}
          columns={["ID", "Name", "Department"]}
        />
      </div>

      {/* Student Section */}
      <div className="table-section" ref={studentRef}>
        <h2>Students</h2>
        <input
          type="text"
          placeholder="Search Student by ID or Name..."
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
        />
        <TableComponent
          data={students.filter((s) => s.name.includes(searchStudent) || s.id.includes(searchStudent))}
          onEdit={(item) => handleEdit(item, "student")} onDelete={(id) => handleDelete(id, "student")}
          columns={["Roll Number", "Name", "Year", "Department"]}
        />
      </div>

      {/* Industrial Partner Section */}
      <div className="table-section">
        <h2>Industrial Partners</h2>
        <input type="text" placeholder="Search Industrial Partner..." value={searchIndustrialPartner} onChange={(e) => setSearchIndustrialPartner(e.target.value)} />
        <TableComponent 
        data={industrialPartners.filter((p) => p.name.includes(searchIndustrialPartner) || p.id.includes(searchIndustrialPartner))} 
        onEdit={(item) => handleEdit(item, "industrialPartner")} onDelete={(id) => handleDelete(id, "industrialPartner")}
        columns={["ID", "Name", "Associated Lab"]} />
      </div>

      {/* Form Section */}
      {showForm && (
        <>
        {/* Overlay */}
        <div className="form-overlay" onClick={() => setShowForm(null)}></div>

        <div className="form-container">
          <h2>{isEditing ? "Edit" : "Add"} {showForm === "faculty" ? "Faculty" : showForm === "student" ? "Student" : "Industrial Partner"}</h2>

          <input type="text" placeholder="ID" value={formData.id} disabled={isEditing}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })} />

          <input type="text" placeholder="Name" value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

          <div className="email-container">
            <input type="email" placeholder="Email" value={formData.email} 
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); validateEmail(e.target.value); }} />
            <span className="error-text">{emailError}</span>
          </div>

          {/* Department Dropdown */}
          {showForm !== "industrialPartner" && (
            <div className="dropdown-container">
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                readOnly
                onClick={() => setDepartmentDropdownVisible(!departmentDropdownVisible)}
              />
              {departmentDropdownVisible && (
                <ul className="dropdown">
                  {["AE", "MTRS", "ME", "CSE", "IT", "AIDS"].map((dept) => (
                    <li key={dept} onClick={() => {
                      setFormData({ ...formData, department: dept });
                      setDepartmentDropdownVisible(false);
                    }}>
                      {dept}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Year Dropdown */}
          {showForm === "student" && (
            <div className="dropdown-container">
              <input
                type="text"
                placeholder="Year"
                value={formData.year}
                readOnly
                onClick={() => setYearDropdownVisible(!yearDropdownVisible)}
              />
              {yearDropdownVisible && (
                <ul className="dropdown">
                  {[1, 2, 3, 4].map((year) => (
                    <li key={year} onClick={() => {
                      setFormData({ ...formData, year });
                      setYearDropdownVisible(false);
                    }}>
                      {year}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button type="button" onClick={handleSubmit}>{isEditing ? "Update" : "Submit"}</button>
          <button type="button" onClick={() => { setShowForm(null); setIsEditing(false); }}>Cancel</button>
        </div>
        </>
      )}
    </div>
    
  );
};

export default Users;
