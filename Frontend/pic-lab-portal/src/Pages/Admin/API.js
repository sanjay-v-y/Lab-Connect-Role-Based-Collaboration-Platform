const BASE_URL = "https://3001-2409-408d-29c-e42d-d79-643a-f089-d997.ngrok-free.app"; // Update with actual ngrok URL

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true", // Fix for ngrok browser redirect issue
};

// Fetch all labs
export const fetchLabs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/pic/labs/get`, {
      headers: defaultHeaders,
    });

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
    const response = await fetch(`${BASE_URL}/pic/labs/${labId}/students`, {
      headers: defaultHeaders,
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
  try {
    const response = await fetch(`${BASE_URL}/pic/labs/update/${labId}`, {
      method: "PUT",
      headers: defaultHeaders,
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
        const response = await fetch(`${BASE_URL}/pic/labs/delete/${id}`, { method: "DELETE" });

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
    const response = await fetch(`${BASE_URL}/pic/faculty`, { headers: defaultHeaders });
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


// Fetch all faculties
export const fetchFaculties = async () => {
  try {
    const response = await fetch(`${BASE_URL}/pic/faculty`, { headers: defaultHeaders });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Process and format the response before returning
    const data = await response.json();
    return data.map(faculty => ({
      id: faculty.id,
      name: faculty.name,
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
    const response = await fetch(`${BASE_URL}/pic/students/get`, { headers: defaultHeaders });
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
  try {
    const response = await fetch(`${BASE_URL}/pic/faculty`, {
      method: "POST",
      headers: defaultHeaders,
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

