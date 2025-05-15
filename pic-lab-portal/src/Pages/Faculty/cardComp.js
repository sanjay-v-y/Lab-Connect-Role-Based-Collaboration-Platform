import React, { useState } from "react";
import { FaChevronDown, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";
import "../../Components/assets/card.css"; // Import CSS for styling

const CardComp = ({ request, onApprove, onReject, isLabChange }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`request-card ${expanded ? "expanded" : ""}`}>
      {/* Left Side - Expand/Collapse Icon */}
      <div className="toggle-icon" onClick={() => setExpanded(!expanded)}>
        {expanded ? <FaChevronDown /> : <FaChevronRight />}
      </div>

      {/* Center - Main Info */}
      <div className="request-details">
        <p className="student-name">{isLabChange ? request.studentName : request.name}</p>
        {isLabChange && (
          <p className="lab-name">
            <strong>From:</strong> {request.currentLabName} → <strong>To:</strong> {request.desiredLabName}
          </p>
        )}
      </div>

      {/* Right Side - Approve & Reject Buttons */}
      <div className="action-buttons">
        <button className="approve-btn" onClick={() => onApprove(isLabChange ? request.requestId : request.id)}>
          <FaCheck /> Approve
        </button>
        <button className="reject-btn" onClick={() => onReject(isLabChange ? request.requestId : request.id)}>
          <FaTimes /> Reject
        </button>
      </div>

      {isLabChange && (
  <div className="lab-change-flow">
    <span className="lab-from">{request.currentLab}</span>
    <span className="arrow">→</span>
    <span className="lab-to">{request.requestedLab}</span>
  </div>
)}


      {/* Expanded Section - Extra Details */}
      {expanded && (
        <div className="extra-details">
          <p><strong>Email:</strong> {isLabChange ? request.studentId : request.email}</p>
          <p><strong>Year:</strong> {request.year}</p>
          <p><strong>Department:</strong> {request.department}</p>
        </div>
      )}
    </div>
  );
};

export default CardComp;
