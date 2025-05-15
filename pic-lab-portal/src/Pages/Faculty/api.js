import { BASE_URL } from "../../config.js";  // Update with actual ngrok URL

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true", // Fix for ngrok browser redirect issue
};

// ✅ Fetch faculty details
export const fetchFacultyDetails = async (facultyId) => {
  try {
    const response = await fetch(/* `http://localhost:5000/faculty/${facultyId}` */`${BASE_URL}/pic/faculty/${facultyId}`, { headers: defaultHeaders,
      credentials:"include",
     });
    if (!response.ok) throw new Error("Failed to fetch faculty details");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Fetch lab details using labId
export const fetchLabDetails = async (labId) => {
  try {
    const response = await fetch(/* `http://localhost:5000/labs/${labId}` */`${BASE_URL}/pic/labs/get/${labId}`, { headers: defaultHeaders,
      credentials:"include",
     });
    if (!response.ok) throw new Error("Failed to fetch lab details");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Fetch student requests for faculty
export const fetchFacultyRequests = async (facultyId) => {
  try {
    const response = await fetch(/* "http://localhost:5000/requests" */`${BASE_URL}/pic/faculty/requests/${facultyId}`, { headers: defaultHeaders,
      credentials:"include",
     });
    if (!response.ok) throw new Error("Failed to fetch student requests");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// ✅ Fetch students of a lab using labId
export const fetchLabStudents = async (labId) => {
    try {
      const response = await fetch(/* "http://localhost:5000/students" */`${BASE_URL}/pic/labs/${labId}/students`, { headers: defaultHeaders,
        credentials:"include",
       });
      if (!response.ok) throw new Error("Failed to fetch students");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
// ✅ Approve student request
export const approveStudent = async (studentId) => {
  const response = await fetch(`${BASE_URL}/pic/faculty/approve/${studentId}`, {
    method: "POST",
    headers: defaultHeaders,
    credentials:"include",
  });

  const text = await response.text(); // ✅ Read response as text, not JSON
  console.log("Server response:", text);
  return text;
};


// ✅ Reject student request
export const rejectStudent = async (studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/faculty/reject/${studentId}`, {
      method: "POST",
      headers: defaultHeaders,
      credentials:"include",
    });
    if (!response.ok) throw new Error("Failed to reject student");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch Lab Change Requests
export const fetchLabChangeRequests = async (facultyId) => {
  const response = await fetch(/* "http://localhost:5000/changeLab" */`${BASE_URL}/pic/lab-change/faculty/${facultyId}/requests`, { headers: defaultHeaders,
    credentials:"include",
   });
  return response.json();
};

// Approve & Reject Lab Change Requests
export const approveLabChange = async (requestId,facultyId) => {
  return fetch(`${BASE_URL}/pic/lab-change/approve/${requestId}/${facultyId}`, { 
    method: "POST",
    headers: defaultHeaders,
    credentials:"include",
    body: JSON.stringify({}) 
  });
};

export const rejectLabChange = async (requestId) => {
  return fetch(`${BASE_URL}/pic/lab-change/reject/${requestId}`, { 
    method: "POST",
    headers: defaultHeaders,
    credentials:"include",
    body: JSON.stringify({})  
  });
};

// Eligible Attendance
export const fetchEligibleStudents = async (date, facultyId) => {
  const response = await fetch(/* "http://localhost:5000/attendance" */`${BASE_URL}/pic/attendance/eligible/${date}/${facultyId}`,{headers: defaultHeaders,
    credentials:"include",
  });
  console.log(`${BASE_URL}/pic/attendance/eligible/${date}/${facultyId}`)
  if (!response.ok) throw new Error("Failed to fetch students");
  return response.json();
};

export const updateAttendance = async (attendanceData) => {
  console.log(attendanceData)
  const response = await fetch(/* "http://localhost:5000/registerAttendance" */`${BASE_URL}/pic/attendance/update`, {
    method: "PUT",
    headers: defaultHeaders,
    credentials:"include",
    body: JSON.stringify(attendanceData),
  });
  if (!response.ok) throw new Error("Failed to update attendance");
  return response.json();
};

// Students Present for current Day
export const fetchAttendanceCount = async (labId, date) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/attendance/count/${labId}/${date}`,{
      headers:defaultHeaders,
      credentials:"include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch attendance count");
    }
    const data = await response.json();
    console.log(data)
    return data; // This is just a number
  } catch (error) {
    console.error("Error fetching attendance count:", error);
    return 0; // Default value
  }
};

// Fetch all events
export const fetchEvents = async () => {
  const response = await fetch(/* "http://localhost:5000/testing" */`${BASE_URL}/pic/events`,{
    headers: defaultHeaders,
    credentials:"include",
  });
  return response.json();
};

  // Fetch number of students in a lab
  export const fetchStudentCount = async (labId) => {
    try {
      const response = await fetch(`${BASE_URL}/pic/labs/${labId}/students_count`, {
        headers: defaultHeaders,
        credentials: "include",
      });
  
      if (!response.ok) throw new Error("Failed to fetch student count");
  
      const text = await response.text(); // Get raw text
      if (!text) return 0; // If empty, treat as zero
  
      const data = JSON.parse(text); // Otherwise parse normally
      return data;
    } catch (error) {
      console.error("Error fetching student count:", error);
      return 0; // Return 0 instead of null on error too
    }
  };
  
