import React from "react";

const TableComponent = ({ data, onEdit, onDelete }) => {
  if (data.length === 0) return <p>No data available</p>;

  // Determine if data is for faculty or students
  const isStudent = Object.prototype.hasOwnProperty.call(data[0], "rollNo");

  return (
    <table className="table">
      <thead>
        <tr>
          {isStudent ? (
            <>
              <th>Roll No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Year</th>
              <th>Department</th>
            </>
          ) : (
            <>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
            </>
          )}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {isStudent ? (
              <>
                <td>{item.rollNo}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.year}</td>
                <td>{item.department}</td>
              </>
            ) : (
              <>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.department}</td>
              </>
            )}
            <td>
              <button type="button" className="edit-btn" onClick={() => onEdit(item)}>✏ Edit</button>
              <button type="button" className="delete-btn" onClick={() => onDelete(item.id)}>🗑 Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
