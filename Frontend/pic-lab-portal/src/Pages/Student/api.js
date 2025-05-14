import { BASE_URL } from "../../config.js"; 

const defaultHeaders = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", 
  };
  

// Fetch student details by ID
export const fetchStudentDetails = async (studentId) => {
    try {
        const response = await fetch(/* `http://localhost:5000/students/${studentId}` */`${BASE_URL}/pic/students/${studentId}`, {
            headers: defaultHeaders,
            credentials:"include",
          });
        if (!response.ok) throw new Error("Failed to fetch student details");
        return await response.json();
    } catch (error) {
        console.error("Error fetching student details:", error);
        return null;
    }
};

// Fetch all available labs
export const fetchAllLabs = async () => {
    try {
        const response = await fetch(/* "http://localhost:5000/labs" */`${BASE_URL}/pic/labs/get`,{
            headers: defaultHeaders,
            credentials:"include",
        });
        if (!response.ok) throw new Error("Failed to fetch labs");
        return await response.json();
    } catch (error) {
        console.error("Error fetching labs:", error);
        return []; 
    }
};

// Submit preferred labs selection
export const submitPreferredLabs = async (studentId, preferredLabs) => {
    
    console.log(studentId);
    console.log(preferredLabs);
    
    try {
        const response = await fetch(`${BASE_URL}/pic/students/registerLabs/${studentId}`, { // ✅ Using PUT instead of POST
            method: "POST", 
            headers: defaultHeaders,
            credentials:"include",
            body: JSON.stringify(preferredLabs), 
        });
        if (!response.ok) throw new Error("Failed to submit preferred labs");
        
        const responseText = await response.text(); 
        try {
            return JSON.parse(responseText); 
        } catch (error) {
            console.warn("Response is not JSON:", responseText);
            return responseText; 
        }

    } catch (error) {
        console.error("Error submitting preferred labs:", error);
        return null;
    }
};

// Request Lab Change for a Student
export const requestLabChange = async (studentId, selectedLabId) => {

    console.log(studentId)
    console.log(selectedLabId)

    try {
        const response = await fetch(`${BASE_URL}/pic/lab-change/request/${studentId}/${selectedLabId}`, {
            method: "POST",
            headers: defaultHeaders,
            credentials:"include",
        });

        if (!response.ok) throw new Error("Failed to request lab change");

        return "Lab change request submitted successfully!";
    } catch (error) {
        console.error("Error submitting lab change request:", error);
        return null;
    }
};

// Lab Change Status
export const fetchLabChangeStatus = async (studentId) => {
    try {
        const response = await fetch(/* "http://localhost:5000/labChangeReqDetails" */`${BASE_URL}/pic/lab-change/student-status/${studentId}`,{
            headers: defaultHeaders,

credentials:"include",        });
        if (!response.ok) throw new Error("Failed to fetch lab change status");
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching lab change status:", error);
        return null; 
    }
};

//Get particular lab details by id
export const getLabNameById = async (labId) => {
    try {
        const response = await fetch(`${BASE_URL}/pic/labs/get/${labId}`);
        if (!response.ok) throw new Error("Failed to fetch lab details");
        const labData = await response.json();
        return labData.name; // Return the lab name
    } catch (error) {
        console.error("Error fetching lab details:", error);
        return "Unknown Lab";
    }
};

// Attendance Status
export const fetchAttendanceStatus = async (studentId) => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(/* "http://localhost:5000/attendanceDetails/7376211MC129" */`${BASE_URL}/pic/attendance/status/${studentId}/${today}`,{headers: defaultHeaders,
            credentials:"include",
        }
            
        );
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error("Error fetching attendance status:", error);
        return null;
    }
};

// Fetch Attendance Percentage
export const fetchAttendancePercentage = async (studentId, date) => {
    try {
      const response = await fetch(`${BASE_URL}/pic/attendance/percentage/${studentId}/${date}`,{
        headers: defaultHeaders,
        credentials:"include",
      });
      if (!response.ok) throw new Error("Failed to fetch attendance percentage");
      return await response.json();
    } catch (error) {
      console.error("Error fetching attendance percentage:", error);
      return null;
    }
  };
  
  // Fetch Ongoing Event
  export const fetchOngoingEvent = async (studentId, date) => {
    try {
      const response = await fetch(`${BASE_URL}/pic/events/current/${studentId}/${date}`,{
        headers: defaultHeaders,
        credentials:"include",
      });
      if (!response.ok) throw new Error("No ongoing event found");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching ongoing event:", error);
      return null;
    }
  };