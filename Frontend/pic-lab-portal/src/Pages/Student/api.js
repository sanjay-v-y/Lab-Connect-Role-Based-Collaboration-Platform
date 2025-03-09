const API_URL = "https://3001-2409-408d-29c-e42d-d79-643a-f089-d997.ngrok-free.app"; // ✅ JSON Server Base URL

const defaultHeaders = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Fix for ngrok browser redirect issue
  };
  

// Fetch student details by ID
export const fetchStudentDetails = async (studentId) => {
    try {
        const response = await fetch(`${API_URL}/pic/students/${studentId}`, {
            headers: defaultHeaders,
          });
        if (!response.ok) throw new Error("Failed to fetch student details");
        return await response.json();
    } catch (error) {
        console.error("Error fetching student details:", error);
        return null; // Return null instead of crashing
    }
};

// Fetch all available labs (for dropdown)
export const fetchAllLabs = async () => {
    try {
        const response = await fetch(`${API_URL}/pic/labs/get`,{
            headers: defaultHeaders
        });
        if (!response.ok) throw new Error("Failed to fetch labs");
        return await response.json();
    } catch (error) {
        console.error("Error fetching labs:", error);
        return []; // Return an empty array instead of crashing
    }
};

// Submit preferred labs selection (JSON Server needs PUT instead of POST)
export const submitPreferredLabs = async (studentId, preferredLabs) => {
    
    console.log(studentId);
    console.log(preferredLabs);
    
    try {
        const response = await fetch(`${API_URL}/pic/students/registerLabs/${studentId}`, { // ✅ Using PUT instead of POST
            method: "POST", // ✅ Use POST instead of PUT
            headers: defaultHeaders,
            body: JSON.stringify(preferredLabs), // ✅ Send data without modifying DB
        });
        if (!response.ok) throw new Error("Failed to submit preferred labs");
        
        const responseText = await response.text(); // Get raw response text
        try {
            return JSON.parse(responseText); // Try to parse JSON
        } catch (error) {
            console.warn("Response is not JSON:", responseText);
            return responseText; // Use plain text if JSON parsing fails
        }

    } catch (error) {
        console.error("Error submitting preferred labs:", error);
        return null;
    }
};
