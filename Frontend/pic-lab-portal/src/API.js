const BASE_URL = "https://fd56-122-164-83-59.ngrok-free.app/pic/labs"; // Update with actual ngrok URL

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true", // Fix for ngrok browser redirect issue
};

// Fetch all labs
export const fetchLabs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get`, {
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
    const response = await fetch(`${BASE_URL}/get/${labId}`, {
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
    const response = await fetch(`${BASE_URL}/add`, {
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
    const response = await fetch(`${BASE_URL}/modify/${labId}`, {
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
export const deleteLab = async (labId) => {
  try {
    const response = await fetch(`${BASE_URL}/delete/${labId}`, {
      method: "DELETE",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting lab ${labId}:`, error);
    throw error;
  }
};
