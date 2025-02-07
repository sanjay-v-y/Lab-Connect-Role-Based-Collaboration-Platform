import React, { useState } from "react";
import { fetchLabs, addLab, modifyLab, deleteLab } from "../API.js";
import "../Components/assets/labs.css"; // Import styles

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [labForm, setLabForm] = useState({ id: "", name: "", incharge: "", students: "" });
  const [editLabId, setEditLabId] = useState(null);

  // Fetch labs data
  const loadLabs = async () => {
    try {
      const data = await fetchLabs();
      setLabs(data);
    } catch (error) {
      console.error("Failed to load labs", error);
    }
  };

  // Handle input changes in the form
  const handleChange = (e) => {
    setLabForm({ ...labForm, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding or modifying a lab
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editLabId) {
        await modifyLab(editLabId, labForm);
      } else {
        await addLab(labForm);
      }
      setShowForm(false);
      setEditLabId(null);
      loadLabs();
    } catch (error) {
      console.error("Error saving lab", error);
    }
  };

  // Handle deleting a lab
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

  // Open the add lab form
  const openAddForm = () => {
    setLabForm({ id: "", name: "", incharge: "", students: "" });
    setEditLabId(null);
    setShowForm(true);
  };

  // Open the modify form
  const openModifyForm = (lab) => {
    setLabForm(lab);
    setEditLabId(lab.id);
    setShowForm(true);
  };

  return (
    <div className="labs-container">
      <div className="top-buttons">
        <button type="button" onClick={openAddForm}>Add Lab</button>
        <button type="button" onClick={loadLabs}>View Labs</button>
      </div>

      {showForm && (
        <form className="lab-form" onSubmit={handleSubmit}>
          <input type="text" name="id" value={labForm.id} onChange={handleChange} placeholder="Lab ID" required />
          <input type="text" name="name" value={labForm.name} onChange={handleChange} placeholder="Lab Name" required />
          <input type="text" name="incharge" value={labForm.incharge} onChange={handleChange} placeholder="Incharge" required />
          <input type="number" name="students" value={labForm.students} onChange={handleChange} placeholder="No. of Students" required />
          <button type="submit">{editLabId ? "Modify Lab" : "Add Lab"}</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <table className="labs-table">
        <thead>
          <tr>
            <th>Lab ID</th>
            <th>Lab Name</th>
            <th>Incharge</th>
            <th>No. of Students</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((lab) => (
            <tr key={lab.id}>
              <td>{lab.id}</td>
              <td>{lab.name}</td>
              <td>{lab.incharge}</td>
              <td>{lab.students}</td>
              <td>
              <button type="button" onClick={() => openModifyForm(lab)}>Modify</button>
              <button type="button" onClick={() => handleDelete(lab.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Labs;
