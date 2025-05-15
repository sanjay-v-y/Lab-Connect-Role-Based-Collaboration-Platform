import { BASE_URL } from '../../config.js';

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true", 
};

//Industry Person details
export const fetchIndustryPersonDetails = async (indsPersonId) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/indusPartner/${indsPersonId}`, { headers: defaultHeaders,
      credentials:"include",
     });
    if (!response.ok) throw new Error("Failed to fetch faculty details");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

//Get particular lab details by id
export const fetchLabDetails = async (labId) => {
    try {
        const response = await fetch(`${BASE_URL}/pic/labs/get/${labId}`, { headers: defaultHeaders,
          credentials:"include",
         });
        if (!response.ok) throw new Error("Failed to fetch lab details");
        const labData = await response.json();
        return labData
    } catch (error) {
        console.error("Error fetching lab details:", error);
        return "Unknown Lab";
    }
};

// Fetch number of students in a lab
export const fetchStudentCount = async (labId) => {
    try {
      const response = await fetch(`${BASE_URL}/pic/labs/${labId}/students_count`, { headers: defaultHeaders,
        credentials:"include",
       });
      if (!response.ok) throw new Error("Failed to fetch student count");
      return await response.json(); // Returns a number
    } catch (error) {
      console.error("Error fetching student count:", error);
      return null;
    }
  };

  