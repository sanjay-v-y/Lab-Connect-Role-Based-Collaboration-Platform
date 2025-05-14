import React, { useState, useEffect } from "react";
import { fetchLabs, addLab, modifyLab, deleteLab, fetchStudents, fetchUnassignedFaculties, fetchUnassignedIndustryPartners, fetchLabDetails} from "./API.js";
import "../../Components/assets/labs.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]); // Store faculty list
  const [facultyDropdownVisible, setFacultyDropdownVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [labForm, setLabForm] = useState({ id: "", name: "", description: "", photoUrl: "", faculty: "", students: [] });
  const [editLabId, setEditLabId] = useState(null);
  const [industryPartners, setIndustryPartners] = useState([]);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [selectedIndustryPartner, setSelectedIndustryPartner] = useState(""); 
  const [selectedIndustryPartnerName, setSelectedIndustryPartnerName] = useState("N/A");
  const [notification, setNotification] = useState(null);
  
  // Load labs on component mount
  useEffect(() => {
    loadLabs();
  }, []);

  // Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest(".faculty-dropdown-container")) {
      setFacultyDropdownVisible(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

const handleFacultySelect = (faculty) => {
  setLabForm({ ...labForm, faculty: faculty.id });
  setFacultyDropdownVisible(false);
};

const handleIndustryPartnerChange = (id, name) => {
  setSelectedIndustryPartner(id);
  setSelectedIndustryPartnerName(name);
  setShowIndustryDropdown(false);
};


  const loadLabs = async () => {
    try {
      const data = await fetchLabs();
      setLabs(data);
      console.log(data)
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

  const loadIndustryPartners = async (currentPartnerId) => {
    try {
      const data = await fetchUnassignedIndustryPartners();
      // Ensure we don't add duplicate "N/A" values
      const industryList = [...data]; // No need to add another "N/A"

      if (currentPartnerId && !data.some(p => p.id === currentPartnerId)) {
        const currentPartner = labs.find(lab => lab.indsPartner?.id === currentPartnerId)?.indsPartner;
        if (currentPartner) {
          industryList.push(currentPartner); // Include assigned partner if missing
        }
      }

      setIndustryPartners(industryList);
    } catch (error) {
      console.error("Failed to load industry partners", error);
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
        indsPartner: selectedIndustryPartner && selectedIndustryPartner !== "NA" ? { id: selectedIndustryPartner } : null

      };
      console.log(formattedLab)
      if (editLabId) {
        await modifyLab(editLabId, formattedLab);
        showNotification("Lab Modified successfully");
      } else {
        await addLab(formattedLab);
        showNotification("Lab Created successfully");
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
        showNotification("Lab Deleted Successfully");
      } catch (error) {
        console.error("Failed to delete lab", error);
      }
    }
  };

  const openAddForm = () => {
    setLabForm({ id: "", name: "", description: "", photoUrl: "", faculty: "", indsPartner:"", students: [] });
    setSelectedIndustryPartner("");
    setSelectedIndustryPartnerName("N/A");
    setEditLabId(null);
    setShowForm(true);

    
  loadIndustryPartners(); 
  loadFaculties();        
  };

  // edit form
  const openModifyForm = async (lab) => {
    try {
      const labData = await fetchLabDetails(lab.id);
      if (!labData) return;
  
      setLabForm({
        id: labData.id,
        name: labData.name,
        description: labData.description,
        photoUrl: labData.photoUrl || "",
        faculty: labData.faculty ? labData.faculty.id : null, // Store only faculty ID
        indsPartner: labData.indsPartner? labData.indsPartner.id : null
      });

      setSelectedIndustryPartner(labData.indsPartner ? labData.indsPartner.id : "");
      setSelectedIndustryPartnerName(labData.indsPartner ? labData.indsPartner.name : "N/A");
  
      setEditLabId(labData.id);
      setShowForm(true);
      
      loadIndustryPartners(labData.indsPartner?.id);
      // Fetch unassigned faculties
      const facultyList = await fetchUnassignedFaculties();
  
      // Add assigned faculty to the list if missing
      if (labData.faculty && !facultyList.some(f => f.id === labData.faculty.id)) {
        facultyList.unshift(labData.faculty); // Add assigned faculty at the beginning
      }
  
      setFaculties([{ id: null, name: "N/A" }, ...facultyList]); // Update faculties list
    } catch (error) {
      console.error("Error opening modify form:", error);
    }
  };    

  const openLabDetails = (lab) => {
    setSelectedLab(lab);
    setStudents([]);
  };

  const showNotification = (message) => {
    console.log("Notification triggered:", message); // ✅ Debugging log
    setNotification(message);
    setTimeout(() => {
      setNotification(null); // Hide after 2 sec
    }, 2000);
  };

  return (
    <div className="labs-container">
      <div className="top-buttons">
        <button className="btn" type="button" onClick={openAddForm}>Add Lab</button>
      </div>

      {notification && (
          <div className="popup-notification">
            {notification}
          </div>
        )}

      {showForm && (
        <div className="overlay">
          <div className="form-container">
            <h3>{editLabId ? "Modify Lab" : "Add Lab"}</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="labId">Lab ID</label>
              <input type="text" id="labId" name="id" value={labForm.id} onChange={handleChange} placeholder="Lab ID" required />

              <label htmlFor="labName">Lab Name</label>
              <input type="text" id="labName" name="name" value={labForm.name} onChange={handleChange} placeholder="Lab Name" required />

              <label htmlFor="description">Description</label>
              <input type="text" id="description" name="description" value={labForm.description} onChange={handleChange} placeholder="Description" required />

              {/* Faculty Selection */}
              <div className="faculty-dropdown-container">
                <label htmlFor="faculty">Faculty</label>
                <input
                  type="text"
                  id="faculty"
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
                      <li
                        key={faculty.id}
                        onClick={() => {
                          handleFacultySelect(faculty);
                          setFacultyDropdownVisible(false);
                        }}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleFacultySelect(faculty);
                            setFacultyDropdownVisible(false);
                          }
                        }}
                      >
                        {faculty.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Industry Partner Selection */}
              <div className="dropdown-container">
                <label htmlFor="industryPartner">Industry Partner</label>
                <input
                  type="text"
                  id="industryPartner"
                  value={selectedIndustryPartnerName}
                  readOnly
                  placeholder="Select Industry Partner"
                  onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                />
                {showIndustryDropdown && (
                  <ul className="dropdown">
                    {industryPartners.map(partner => (
                      <li key={partner.id} onClick={() => handleIndustryPartnerChange(partner.id, partner.name)}>
                        {partner.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button type="submit" className="submit-btn">{editLabId ? "Modify Lab" : "Add Lab"}</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}


      {!selectedLab ? (
        <table className="labs-table">
          <thead>
            <tr>
              <th>Lab ID</th>
              <th>Lab Name</th>
              <th>Description</th>
              <th>Faculty</th>
              <th>Industry Partner</th>
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
      role="button" 
    >
      <td>{lab.id}</td>
      <td>{lab.name}</td>
      <td>{lab.description}</td>
      <td>{lab.faculty || "N/A"}</td>
      <td>{lab.indsPartner || "N/A"}</td>

      <td>
      <FontAwesomeIcon 
        icon={faEdit} 
        className="edit-icon"
        onClick={(e) => { e.stopPropagation(); openModifyForm(lab); }}
      />

      <FontAwesomeIcon 
        icon={faTrash} 
        className="delete-icon"
        onClick={(e) => { e.stopPropagation(); handleDelete(lab.id); }}
      />
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
          <p><strong>Industry Person:</strong> {selectedLab.indsPartner || "N/A"}</p>

          <button style={{marginTop:"1rem"}} type ='button' onClick={() => setSelectedLab(null)}>Back</button>

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
