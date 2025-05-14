import { BASE_URL } from "../../config.js";  // Update with actual ngrok URL

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
   // Fix for ngrok browser redirect issue
};

// Fetch all labs
export const fetchLabs = async () => {
  try {
    const response = await fetch(/* "http://localhost:5000/labs" */`${BASE_URL}/pic/labs/get`, {
      headers: defaultHeaders,
      credentials:"include",
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching labs:", error);
    throw error;
  }
};

// Fetch students in a lab
export const fetchStudents = async (labId) => {
  try {
    const response = await fetch(/* "http://localhost:5000/students" */`${BASE_URL}/pic/labs/${labId}/students`, {
      headers: defaultHeaders,
      credentials:"include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching students for lab ${labId}:`, error);
    throw error;
  }
};

// Add a new lab
export const addLab = async (labData) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/labs/add`, {
      method: "POST",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(labData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding lab:", error);
    throw error;
  }
};

// Modify an existing lab
export const modifyLab = async (labId, updatedLabData) => {
  console.log(updatedLabData)
  try {
    const response = await fetch(/* "http://localhost:5000/testDiscuss" */`${BASE_URL}/pic/labs/update/${labId}`, {
      method: "PUT",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(updatedLabData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error modifying lab ${labId}:`, error);
    throw error;
  }
};

// Delete a lab
export const deleteLab = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/pic/labs/delete/${id}`, { 
          method: "DELETE",
          credentials:"include"
         });

        if (!response.ok) {
            throw new Error(`Failed to delete lab: ${response.status}`);
        }

        // ✅ Only parse JSON if the response has content
        return response.status !== 204 ? await response.json() : null;
    } catch (error) {
        console.error(`Error deleting lab ${id}:`, error);
        throw error;
    }
};

//Fetch unassigned faculties
export const fetchUnassignedFaculties = async () => {
  try {
    const response = await fetch(`${BASE_URL}/pic/faculty`, { 
      headers: defaultHeaders,
      credentials:"include",
     });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // ✅ Filter only unassigned faculties (labId and labName are null)
    const unassignedFaculties = data.filter(faculty => !faculty.labId && !faculty.labName);
    
    return unassignedFaculties.map(faculty => ({
      id: faculty.id,
      name: faculty.name
    }));
    
  } catch (error) {
    console.error("Error fetching faculties:", error);
    throw error;
  }
};

export const fetchUnassignedIndustryPartners = async () => {
  try {
      const response = await fetch(`${BASE_URL}/pic/indusPartner`,{
        headers:defaultHeaders,
        credentials:"include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();

      return [{ id: "NA", name: "N/A" }, ...data.filter(partner => !partner.labId)];
  } catch (error) {
      console.error("Error fetching industry partners:", error);
      throw error;
  }
};



// Fetch all faculties
export const fetchFaculties = async () => {
  try {
    const response = await fetch(/* "http://localhost:5000/faculty" */`${BASE_URL}/pic/faculty`, { headers: defaultHeaders,
      credentials:"include",
     });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Process and format the response before returning
    const data = await response.json();
    return data.map(faculty => ({
      id: faculty.id,
      name: faculty.name,
      email: faculty.email,
      department: faculty.dept, // Fix 'dept' -> 'department'
      designation: faculty.designation || "N/A", // Handle missing designation
      lab: faculty.labName // Fix 'labName' -> 'lab'
    }));

  } catch (error) {
    console.error("Error fetching faculties:", error);
    throw error;
  }
};

// Fetch all students
export const fetchStudentsList = async () => {
  try {
    const response = await fetch(/* "http://localhost:5000/students" */`${BASE_URL}/pic/students/get`, { headers: defaultHeaders,
      credentials:"include",
     });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// Add a faculty
export const addFaculty = async (facultyData) => {
  console.log(addFaculty);
  try {
    const response = await fetch(`${BASE_URL}/pic/faculty`, {
      method: "POST",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(facultyData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding faculty:", error);
    throw error;
  }
};

// Add a student
export const addStudent = async (studentData) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/students/add`, {
      method: "POST",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

// Delete a faculty
export const deleteFaculty = async (facultyId) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/faculty/${facultyId}`, {
      method: "DELETE",
      headers: defaultHeaders,
      credentials:"include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.status !== 204 ? await response.json() : null; 
  } catch (error) {
    console.error(`Error deleting faculty ${facultyId}:`, error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/students/${studentId}`, {
      method: "DELETE",
      headers: defaultHeaders,
      credentials:"include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.status !== 204 ? await response.json() : null; 
  } catch (error) {
    console.error(`Error deleting student ${studentId}:`, error);
    throw error;
  }
};

//Creating Event
export const createEvent = async (eventData) => {

  console.log(eventData)
  const response = await fetch(/* "http://localhost:5000/testing" */`${BASE_URL}/pic/events`, {
    method: "POST",
    headers: defaultHeaders,
    credentials:"include",
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
};

// Fetch all events
export const fetchEvents = async () => {
  const response = await fetch(/* "http://localhost:5000/testing" */`${BASE_URL}/pic/events`,{
    headers: defaultHeaders,
    credentials:"include",
  });
  return response.json();
};

// Update event title
export const updateEvent = async ({ id, title }) => {
  const response = await fetch(/* "http://localhost:5000/testing/1" */`${BASE_URL}/pic/events`, {
    method: "PUT",
    headers: defaultHeaders,
    credentials:"include",
    body: JSON.stringify({ id, title }),
  });

  if (!response.ok) throw new Error("Failed to update event");
};

// Delete event
export const deleteEvent = async (eventId) => {
  const response = await fetch(/* "http://localhost:5000/testing/1" */`${BASE_URL}/pic/events/${eventId}`, {
    method: "DELETE",
    headers: defaultHeaders,
    credentials:"include",
  });

  if (!response.ok) throw new Error("Failed to delete event");
};

//Lab details
export const fetchLabDetails = async (labId) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/labs/get/${labId}`,{
      headers: defaultHeaders,
      credentials:"include",
    });
    if (!response.ok) throw new Error("Failed to fetch lab details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching lab details:", error);
    return null;
  }
};

//Fetch industrial partner
export const fetchIndustrialPartners = async () => {
  try {
    const response = await fetch(/* "http://localhost:5000/indsPartner" */`${BASE_URL}/pic/indusPartner`,{
      headers: defaultHeaders,
      credentials:"include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching Industrial Partners:", error);
    return [];
  }
};

//add Indsustrila Peartr
export const addIndustrialPartner = async (partnerData) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/indusPartner`, {
      method: "POST",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(partnerData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding Industrial Partner:", error);
  }
};

// edit inds partner
export const editIndustrialPartner = async (id, partnerData) => {
  console.log(partnerData)
  try {
    const response = await fetch(`${BASE_URL}/pic/indusPartner/${id}`, {
      method: "PUT",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(partnerData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error editing Industrial Partner:", error);
  }
};


//delete indsPartner
export const deleteIndustrialPartner = async (id) => {
  try {
    await fetch(`${BASE_URL}/pic/indusPartner/${id}`, { method: "DELETE",
      headers: defaultHeaders,
      credentials:"include",
     });
  } catch (error) {
    console.error("Error deleting Industrial Partner:", error);
  }
};

//edit student
export const editStudent = async (studentId, updatedData) => {
  console.log(updatedData)
  try {
    const response = await fetch(`${BASE_URL}/pic/students/update/${studentId}`, {
      method: "PUT",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(updatedData),
    });

    const text = await response.text(); // Read response as text

    try {
      return JSON.parse(text); // Try parsing as JSON
    } catch (error) {
      return { message: text }; // If parsing fails, return as a string inside an object
    }
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

//edit faculty
export const editFaculty = async (facultyId, updatedData) => {
  console.log(updatedData)
  try {
    const response = await fetch(`${BASE_URL}/pic/faculty/${facultyId}`, {
      method: "PUT",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Failed to update faculty");

    return await response.json();
  } catch (error) {
    console.error("Error updating faculty:", error);
    throw error;
  }
};


