import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const TableComponent = ({ data, onEdit, onDelete, isRequestTable, onApprove, onReject }) => {
  if (data.length === 0) return <p>No data available</p>;

  const userType= localStorage.getItem("userType")

  // Determine user type based on data properties
  const isStudent = data[0].hasOwnProperty("year") && data[0].hasOwnProperty("department");
  const isIndustrialPartner = data[0].hasOwnProperty("email") && data[0].hasOwnProperty("labName");
  const isFaculty = data[0].hasOwnProperty("department") && !isStudent;
  const isAdmin = userType==="admin"; // Default fallback (useful for admin panels)

  console.log(data)

  return (
    <table className="table">
      <thead>
        <tr>
        {isStudent ? (
            <>
              <th>Roll No</th>
              <th>Name</th>
              <th>Year</th>
              <th>Department</th>
            </>
          ) : isIndustrialPartner ? (
            <>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Associated Lab</th>
            </>
          ) : (
            <>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
            </>
          )}
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id || item.email}>
            {isStudent ? (
              <>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.year}</td>
                <td>{item.department}</td>
              </>
            ) : isIndustrialPartner ? (
              <>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.labName && item.labId ? item.labName : "N/A"}</td>
              </>
            ) : (
              <>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.department}</td>
              </>
            )}
            
            {(isRequestTable || isAdmin) && (
              <td>
                {isRequestTable ? (
                  <>
                    <button type="button" className="approve-btn" onClick={() => onApprove(item.id)}>✅ Approve</button>
                    <button type="button" className="reject-btn" onClick={() => onReject(item.id)}>❌ Reject</button>
                  </>
                ) : (
                  isAdmin && (
                    <>
                      <FontAwesomeIcon 
                        icon={faEdit} 
                        className="edit-icon"
                        onClick={() => onEdit(item)}
                      />
                      <FontAwesomeIcon 
                        icon={faTrash} 
                        className="delete-icon"
                        onClick={() => onDelete(item.id)}
                      />
                    </>
                  )
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
