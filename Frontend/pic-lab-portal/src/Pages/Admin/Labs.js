import React, { useState, useEffect } from "react";
import { fetchLabs, addLab, modifyLab, deleteLab, fetchStudents, fetchUnassignedFaculties} from "./API.js";
import "../../Components/assets/labs.css";

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]); // Store faculty list
  const [facultyDropdownVisible, setFacultyDropdownVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [labForm, setLabForm] = useState({ id: "", name: "", description: "", photoUrl: "", faculty: "", students: [] });
  const [editLabId, setEditLabId] = useState(null);
  

  // Load labs on component mount
  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      const data = await fetchLabs();
      setLabs(data);
    } catch (error) {
      console.error("Failed to load labs", error);
    }
  };

  const loadStudents = async (labId) => {
    try {
      const data = await fetchStudents(labId);
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students", error);
    }
  };

  const loadFaculties = async () => {
    try {
      const data = await fetchUnassignedFaculties();
      setFaculties([{ id: null, name: "N/A" }, ...data]);
    } catch (error) {
      console.error("Failed to load faculties", error);
    }
  };
  

  const handleChange = (e) => {
    setLabForm({ ...labForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedLab = {
        ...labForm,
        faculty: labForm.faculty ? { id: labForm.faculty } : null, // Wrap faculty ID inside an object
      };
  
      if (editLabId) {
        await modifyLab(editLabId, formattedLab);
      } else {
        await addLab(formattedLab);
      }
  
      setShowForm(false);
      setEditLabId(null);
      loadLabs();
    } catch (error) {
      console.error("Error saving lab", error);
    }
  };
      

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lab?")) {
      try {
        await deleteLab(id);
        loadLabs();
      } catch (error) {
        console.error("Failed to delete lab", error);
      }
    }
  };

  const openAddForm = () => {
    setLabForm({ id: "", name: "", description: "", photoUrl: "", faculty: "", students: [] });
    setEditLabId(null);
    setShowForm(true);
  };

  const openModifyForm = (lab) => {
    setLabForm(lab);
    setEditLabId(lab.id);
    setShowForm(true);
  };

  const openLabDetails = (lab) => {
    setSelectedLab(lab);
    setStudents([]);
  };

  return (
    <div className="labs-container">
      <div className="top-buttons">
        <button className="btn" type="button" onClick={openAddForm}>Add Lab</button>
        <button className="btn" type="button" onClick={loadLabs}>View Labs</button>
      </div>

      {showForm && (
        <form className="lab-form" onSubmit={handleSubmit}>
          <input type="text" name="id" value={labForm.id} onChange={handleChange} placeholder="Lab ID" required />
          <input type="text" name="name" value={labForm.name} onChange={handleChange} placeholder="Lab Name" required />
          <input type="text" name="description" value={labForm.description} onChange={handleChange} placeholder="Description" required />
          <input type="text" name="photoUrl" value={labForm.photoUrl} onChange={handleChange} placeholder="Photo URL" />
          
          <div className="faculty-dropdown-container">
              <input
              type="text"
              name="faculty"
              value={faculties.find(f => f.id === labForm.faculty)?.name || "N/A"}
              placeholder="Select Faculty"
              onFocus={() => {
                loadFaculties();
                setFacultyDropdownVisible(true);
              }}
              readOnly
            />

            {facultyDropdownVisible && (
              <ul className="faculty-dropdown">
                {faculties.map((faculty) => (
                  <li key={faculty.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setLabForm({ ...labForm, faculty: faculty.id });
                        setFacultyDropdownVisible(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setLabForm({ ...labForm, faculty: faculty.id });
                          setFacultyDropdownVisible(false);
                        }
                      }}
                    >
                      {faculty.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit">{editLabId ? "Modify Lab" : "Add Lab"}</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      {!selectedLab ? (
        <table className="labs-table">
          <thead>
            <tr>
              <th>Lab ID</th>
              <th>Lab Name</th>
              <th>Description</th>
              <th>Faculty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {labs.map((lab) => (
    <tr
      key={lab.id}
      onClick={() => openLabDetails(lab)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          openLabDetails(lab);
        }
      }}
      tabIndex="0" // Makes the row focusable
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="button" // Improves accessibility by making it behave like a button
    >
      <td>{lab.id}</td>
      <td>{lab.name}</td>
      <td>{lab.description}</td>
      <td>{lab.faculty || "N/A"}</td>
      <td>
        <button type="button" onClick={(e) => { e.stopPropagation(); openModifyForm(lab); }}>Edit</button>
        <button type= "button" onClick={(e) => { e.stopPropagation(); handleDelete(lab.id); }}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      ) : (
        <div className="lab-details">
          <h2>Lab Details</h2>
          <p><strong>ID:</strong> {selectedLab.id}</p>
          <p><strong>Name:</strong> {selectedLab.name}</p>
          <p><strong>Description:</strong> {selectedLab.description}</p>
          <p><strong>Faculty:</strong> {selectedLab.faculty || "N/A"}</p>
          <button type = "button" onClick={() => loadStudents(selectedLab.id)}>View Students</button>
          <button type ='button' onClick={() => setSelectedLab(null)}>Back</button>

          {students.length > 0 && (
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Labs;
