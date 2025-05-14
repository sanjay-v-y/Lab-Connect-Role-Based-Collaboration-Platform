import React, { useState, useEffect } from "react";
import { createEvent,fetchEvents, updateEvent, deleteEvent } from "./API.js";

import "../../Components/assets/event.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const EventPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    year: 1, // Default year selection
  });
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [notification, setNotification] = useState(null);

  // Fetch Events on Component Mount
  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const eventData = await fetchEvents();
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Handle Edit Click - Open Edit Mode
  const handleEditClick = (event) => {
    setEditEventId(event.id);
    setEditTitle(event.title);
  };

  // Handle Update Submission
  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty!");
      return;
    }

    const eventToUpdate = events.find(e => e.id === editEventId);
    if (!eventToUpdate) return;

    try {
      const updatedEvent = { 
        id: editEventId, 
        title: editTitle, 
        startDate: eventToUpdate.startDate, 
        endDate: eventToUpdate.endDate, 
        year: eventToUpdate.year 
      };
      
      await updateEvent(updatedEvent);
      setEvents(events.map(e => e.id === editEventId ? updatedEvent : e));
      setEditEventId(null);
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  // Handle Delete Event
  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        setEvents(events.filter(e => e.id !== eventId));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  const { title, startDate, endDate, year } = formData;
  const eventYear = Number.parseInt(year, 10); // Convert year to integer

  // 1️⃣ Check if end date is greater than start date
  if (new Date(endDate) <= new Date(startDate)) {
    alert("End date must be greater than start date!");
    return;
  }

  // 2️⃣ Check for overlapping events in the same year
  const isConflict = events.some(event => (
    event.year === eventYear &&
    ((new Date(startDate) >= new Date(event.startDate) && new Date(startDate) <= new Date(event.endDate)) ||  
    (new Date(endDate) >= new Date(event.startDate) && new Date(endDate) <= new Date(event.endDate)) ||  
    (new Date(startDate) <= new Date(event.startDate) && new Date(endDate) >= new Date(event.endDate)))  
  ));

  if (isConflict) {
    alert(`An event for Year ${eventYear} already exists in this date range!`);
    return;
  }

  // ✅ No conflicts, proceed with event creation
  const eventData = { title, startDate, endDate, year: eventYear };

  try {
    const newEvent = await createEvent(eventData);
    if (newEvent) {
      alert("Event created successfully!");
      setShowForm(false);
      setFormData({ title: "", startDate: "", endDate: "", year: 1 }); // Reset form

      // 🔄 **Re-fetch events to update UI**
      const updatedEvents = await fetchEvents(); 
      setEvents(updatedEvents);

      showNotification("Event created ✅");
    } else {
      alert("Failed to create event.");
    }
  } catch (error) {
    console.error("Error creating event:", error);
    alert("Failed to create event.");
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
    <div className="event-page">
      <button type="button" className="add-event-btn" onClick={() => setShowForm(true)}>Add Event</button>

      {showForm && (
        <div className="overlay">
          <div className="event-form">
            <h3>Create Event</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />

              <label htmlFor="startDate">Start Date:</label>
              <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />

              <label htmlFor="endDate">End Date:</label>
              <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required />

              <label htmlFor="year">Year:</label>
              <select id="year" name="year" value={formData.year} onChange={handleChange}>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>

              <button type="submit" className="submit-btn">Create Event</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

{notification && (
          <div className="popup-notification">
            {notification}
          </div>
        )}

      <table className="event-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>
                {editEventId === event.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  event.title
                )}
              </td>
              <td>{event.startDate}</td>
              <td>{event.endDate}</td>
              <td>{event.year} Year</td>
              <td>
                {editEventId === event.id ? (
                  <button type="button" className="save-btn" onClick={handleUpdate}>Save</button>
                ) : (
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    className="edit-icon"
                    onClick={() => handleEditClick(event)}
                  />
                )}
                <FontAwesomeIcon 
                  icon={faTrash} 
                  className="delete-icon"
                  onClick={() => handleDelete(event.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default EventPage;
