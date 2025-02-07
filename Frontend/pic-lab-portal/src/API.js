const API_URL = "https://0f51-122-164-87-197.ngrok-free.app/pic/labs/summa"; // Replace with your Ngrok URL

// Fetch labs data
// Fetch labs data
export const fetchLabs = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type");
    console.log('Response Content-Type:', contentType);

    // Use optional chaining to check for null or undefined contentType
    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    // Fallback to text if the server sends plain text
    if (contentType?.includes("text/plain")) {
      return await response.text();
    }

    // If response is neither JSON nor plain text, throw an error
    throw new Error(`Unexpected response type: ${contentType}`);

  } catch (error) {
    console.error("Error fetching labs:", error);
    throw error;
  }
};




// Add new lab
export const addLab = async (labData) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(labData),
    });

    if (!response.ok) {
      throw new Error("Failed to add lab");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding lab:", error);
    throw error;
  }
};

// Modify existing lab
export const modifyLab = async (labId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/labs/${labId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to modify lab");
    }

    return await response.json();
  } catch (error) {
    console.error("Error modifying lab:", error);
    throw error;
  }
};

// Delete a lab
export const deleteLab = async (labId) => {
  try {
    const response = await fetch(`${API_URL}/labs/${labId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete lab");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting lab:", error);
    throw error;
  }
};
