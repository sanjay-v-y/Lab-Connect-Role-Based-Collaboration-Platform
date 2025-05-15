import React, { useEffect, useState } from "react";
import { fetchTopics, fetchLabs, createTopic, updateTopic, fetchStudentDetails, fetchFacultyDetails,fetchIndustryPersonDetails, deleteTopic } from "./api.js";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Nav/Sidebar.js";
import "./discussForum.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const DiscussForum = ({ userRole }) => {
  const [labs, setLabs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [editTopic, setEditTopic] = useState(null);
  const [labId, setLabId] = useState(null); // Store labId

  const [contextTopicId, setContextTopicId] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });


  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

// Fetch labId based on userRole
useEffect(() => {
  const fetchUserLab = async () => {
    try {
      let data;
      if (userType === "student") {
        data = await fetchStudentDetails(userId);
      } else if (userType === "faculty") {
        data = await fetchFacultyDetails(userId);
      } else if (userType === "indsPartner") {
        data = await fetchIndustryPersonDetails(userId);
      }

      console.log(data);

      if (userType === "student" && data.lab) {
        setLabId(data.lab.id);
        fetchTopics(data.lab.id).then((topicsData) => {
          setTopics(topicsData);
          setLoading(false);
        });
      } else if (userType === "faculty" || userType === "indsPartner") {
        const labId = data.labId;
        if (labId) {
          setLabId(labId);
          fetchTopics(labId).then((topicsData) => {
            setTopics(topicsData);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user lab details:", error);
      setLoading(false);
    }
  };

  if (userType !== "admin") {
    fetchUserLab();
  } else {
    fetchLabs()
      .then((data) => {
        setLabs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching labs:", error);
        setLoading(false);
      });
  }
}, [userType, userId]);

useEffect(() => {
  const handleClickOutside = () => {
    setContextTopicId(null);
  };

  window.addEventListener("click", handleClickOutside);
  return () => window.removeEventListener("click", handleClickOutside);
}, []);


  // Fetch topics when lab is selected (admin only)
  const handleLabSelect = (lab) => {
    setSelectedLab(lab);
    setLoading(true);
    fetchTopics(lab.id).then((data) => {
      setTopics(data);
      setLoading(false);
    });
  };

  // Create Topic
  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) return;
    await createTopic({ name: newTopicName, facultyId: userId });
    setShowCreateForm(false);
    setNewTopicName("");
    refreshTopics();
  };

  // Edit Topic
  const handleEditTopic = async () => {
    if (!editTopic.name.trim()) return;
    await updateTopic(editTopic.id, { name: editTopic.name, facultyId: userId });
    setEditTopic(null);
    refreshTopics();
  };

  //Delete topic
  const handleDeleteTopic = async (topicId) => {
    const response = await deleteTopic(userId, topicId);
    if (response) {
      refreshTopics();
    }
  };
  
  const refreshTopics = async () => {
    if (userType === "admin" && selectedLab) {
      const updatedTopics = await fetchTopics(selectedLab.id);
      setTopics(updatedTopics);
    } else if (labId) {
      const updatedTopics = await fetchTopics(labId);
      setTopics(updatedTopics);
    }
  };
  

  return (
    <div className="forum-container">
      <Sidebar userRole={userType} />
      <div className="forum-content">
        <h2 className="forum-title">
          {userType === "admin"
            ? selectedLab
              ? `Topics - ${selectedLab.name}`
              : "Select a Lab"
            : "Discussion Topics"}
        </h2>

        {/* Admin - Show Labs */}
        {userType === "admin" && !selectedLab && (
          <div className="labs-list">
            {labs.map((lab) => (
              <div key={lab.id} className="lab-item" onClick={() => handleLabSelect(lab)}>
                {lab.name}
              </div>
            ))}
          </div>
        )}

        {/* Topics List */}
        {selectedLab || userType !== "admin" ? (
          <>
              {/* Create Topic (Faculty Only) */}
              {userType === "faculty" && (
              <button type="button" className="create-topic-btn" onClick={() => setShowCreateForm(true)}>
                + Create Topic
              </button>
            )}

            {loading ? (
              <p>Loading topics...</p>
            ) : (
              <div className="topics-list">
                {topics.length === 0 ? <p>No topics available.</p> : topics.map((topic) => (
                  <div key={topic.id} className="topic-item"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextTopicId(topic.id);
                    setContextMenuPosition({ x: e.pageX, y: e.pageY });
                  }}
                  >
                    <span
                      onClick={() => navigate(`/discussForum/posts/${topic.id}`)}
                    >
                      {topic.name}
                    </span>

                    {userType==="faculty" && contextTopicId === topic.id && (
                      <div
                        className="context-menu"
                        style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="edit-icon"
                          onClick={() => setEditTopic(topic)}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="delete-icon"
                          onClick={() => handleDeleteTopic(topic.id)}
                        />
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}

        {/* Create Topic Form */}
        {showCreateForm && (
          <div className="overlay">
            <div className="form-container">
              <h3>Create Topic</h3>
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Enter topic name"
              />
              <button type="button" onClick={handleCreateTopic}>Submit</button>
              <button type="button" 
              className="post-cancel-btn" onClick={() => setShowCreateForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Edit Topic Form */}
        {editTopic && (
          <div className="overlay">
            <div className="form-container">
              <h3>Edit Topic</h3>
              <input
                type="text"
                value={editTopic.name}
                onChange={(e) => setEditTopic({ ...editTopic, name: e.target.value })}
              />
              <button type="button" onClick={handleEditTopic}>Save</button>
              <button type="button" className="post-cancel-btn" onClick={() => setEditTopic(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussForum;
