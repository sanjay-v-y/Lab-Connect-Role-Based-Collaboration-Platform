import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Nav/Sidebar.js";
import { fetchIndustryPersonDetails, fetchLabDetails, fetchStudentCount } from "./api.js";
import "../../Components/assets/indsDash.css";

const IndustryPerson = () => {
  const [industryPersonData, setIndustryPersonData] = useState({
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName"),
    userType: localStorage.getItem("userType"),
    profilePic: localStorage.getItem("profilePic") || "/default-profile.png",
    email:"",
    labName: null,
    labId: null,
  });

  const [labDetails, setLabDetails] = useState(null);
  const [studentCount, setStudentCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Industry Person Details
        const industryDetails = await fetchIndustryPersonDetails(industryPersonData.id);
        if (industryDetails) {
          setIndustryPersonData((prevData) => ({
            ...prevData,
            email:industryDetails.email,
            labName: industryDetails.labName || null,
            labId: industryDetails.labId || null,
            profilePic: industryDetails.profilePic || prevData.profilePic,
          }));

          // Fetch Lab Details if labId exists
          if (industryDetails.labId) {
            const labData = await fetchLabDetails(industryDetails.labId);
            setLabDetails(labData);

            // Fetch No. of Students in Lab
            const count = await fetchStudentCount(industryDetails.labId);
            setStudentCount(count !== null ? count : "N/A");
          }
        }
      } catch (error) {
        console.error("Error fetching industry person dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [industryPersonData.id]);

  return (
    <div className="inds-container">
    <Sidebar userRole="indsPartner" />
    <div className="inds-content">
      <div className="inds-welcome-section">
        <img
          src={industryPersonData.profilePic}
          alt="Profile"
          className="inds-profile-picture"
          referrerPolicy="no-referrer"
        />
        <div>
          <h2>Welcome, {industryPersonData.name}!</h2>
          <p className="inds-user-type">({industryPersonData.userType})</p>
        </div>
      </div>

      <div className="inds-info">
        <p><strong>Industry Person ID:</strong> {industryPersonData.id}</p>
        <p><strong>Email: </strong> {industryPersonData.email}</p>
        <p>
          <strong>Associated Lab:</strong>{" "}
          {loading ? "Loading..." : industryPersonData.labId ? industryPersonData.labName : "Not Assigned to any PIC Lab"}
        </p>
      </div>

      {industryPersonData.labId && labDetails && (
        <div className="inds-lab-card">
          <h3>Associated Lab Details</h3>
          <p><strong>Lab ID:</strong> {labDetails.id}</p>
          <p><strong>Name:</strong> {labDetails.name}</p>
          <p><strong>Description:</strong> {labDetails.description}</p>
          <p><strong>Faculty:</strong> {labDetails.faculty.name}</p>
          <p><strong>No. of Students:</strong> {loading ? "Loading..." : studentCount}</p>
        </div>
      )}
    </div>
  </div>            
  );
};

export default IndustryPerson;
