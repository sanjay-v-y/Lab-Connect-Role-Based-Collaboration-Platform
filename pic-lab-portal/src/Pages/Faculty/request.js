import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Nav/Sidebar.js";
import {
  fetchFacultyRequests,
  approveStudent,
  rejectStudent,
  fetchLabChangeRequests,
  approveLabChange,
  rejectLabChange,
} from "./api.js";
import "../../Components/assets/request.css";

const FacultyRequests = () => {
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ✅ Reusable fetch function (used in useEffect + after actions)
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const facultyId = localStorage.getItem("userId");
      if (!facultyId) throw new Error("No faculty ID found");

      const regRequests = await fetchFacultyRequests(facultyId);
      const labChanges = await fetchLabChangeRequests(facultyId);

      setRegistrationRequests(regRequests);
      setChangeRequests(labChanges);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Handlers (cleaned with auto-refresh)
  const handleApproveRegistration = async (studentId) => {
    try {
      await approveStudent(studentId);
      setRegistrationRequests((prev) =>
        prev.filter((req) => req.id !== studentId)
      );
    } catch (err) {
      console.error("Error approving student:", err);
    }
  };  

  const handleRejectRegistration = async (studentId) => {
    try {
      await rejectStudent(studentId);
      setRegistrationRequests((prev) =>
        prev.filter((req) => req.id !== studentId)
      );
    } catch (err) {
      console.error("Error rejecting student:", err);
    }
  };  

  const handleApproveLabChange = async (requestId) => {
    try {
      const facultyId = localStorage.getItem("userId");
      if (!facultyId) throw new Error("No faculty ID");
  
      await approveLabChange(requestId, facultyId);
      setChangeRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId)
      );
    } catch (err) {
      console.error("Error approving lab change:", err);
    }
  };  

  const handleRejectLabChange = async (requestId) => {
    try {
      await rejectLabChange(requestId);
      setChangeRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId)
      );
    } catch (err) {
      console.error("Error rejecting lab change:", err);
    }
  };  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">Something went wrong. Try again later.</p>;

  return (
    <div className="request-container">
      <Sidebar userRole="faculty" />
      <div className="request-content">
        {/* Registration Requests */}
        <RequestSection
          title="Lab Registration Requests"
          requests={registrationRequests}
          noRequestText="No pending registration requests"
          renderRequest={(request) => (
            <RequestCard
              key={request.id}
              name={request.name}
              extraDetails={[
                { label: "Email", value: request.email },
                { label: "Year", value: request.year },
                { label: "Department", value: request.department },
              ]}
              onApprove={() => handleApproveRegistration(request.id)}
              onReject={() => handleRejectRegistration(request.id)}
            />
          )}
        />

        {/* Lab Change Requests */}
        <RequestSection
          title="Lab Change Requests"
          requests={changeRequests}
          noRequestText="No pending lab change requests"
          renderRequest={(request) => (
            <RequestCard
              key={request.requestId}
              name={request.studentName}
              rollNo={request.studentId}
              extraDetails={[
                {
                  label: "",
                  value: (
                    <>
                      <strong>From:</strong> {request.currentLabName} &nbsp;→&nbsp; <strong>To:</strong> {request.desiredLabName}
                    </>
                  ),
                },
              ]}
              onApprove={() => handleApproveLabChange(request.requestId)}
              onReject={() => handleRejectLabChange(request.requestId)}
            />
          )}
        />
      </div>
    </div>
  );
};

// ✅ Reusable section block
const RequestSection = ({ title, requests, noRequestText, renderRequest }) => (
  <div className="request-section">
    <h2 className="request-title">{title}</h2>
    <div className="request-box">
      {requests.length === 0 ? (
        <p className="no-request">{noRequestText}</p>
      ) : (
        requests.map(renderRequest)
      )}
    </div>
  </div>
);

// ✅ Reusable card component
const RequestCard = ({ name, rollNo, extraDetails = [], onApprove, onReject }) => (
  <div className="request-card">
    <div className="request-details">
    <p className="student-name">
        {name}{" "}
        {rollNo && (
          <span className="roll-no">({rollNo})</span>
        )}
      </p>
    </div>

    <div className="action-buttons">
      <button type="button" className="approve-btn" onClick={onApprove}>
        Approve
      </button>
      <button type="button" className="reject-btn" onClick={onReject}>
        Reject
      </button>
    </div>

    <div className="extra-details">
      {extraDetails.map((item, idx) => (
        <p key={idx}>
          {item.label && <strong>{item.label}:</strong>} {item.value}
        </p>
      ))}
    </div>
  </div>
);

export default FacultyRequests;
