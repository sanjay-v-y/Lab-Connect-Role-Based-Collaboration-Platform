import { BASE_URL } from '../../config.js';

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true", // Fix for ngrok browser redirect issue
};

export const fetchTopics = async (labId) => {
  try {
    const response = await fetch(/* "http://localhost:5000/topic" */`${BASE_URL}/pic/blogs/categories/${labId}`,{
      headers: defaultHeaders,
      credentials:"include",
    });
    if (!response.ok) throw new Error("Failed to fetch topics");
    return response.json();
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
};

export const fetchPosts = async (categoryId) => {
  try {
    const response = await fetch(/* "http://localhost:5000/allPost" */`${BASE_URL}/pic/blogs/posts/category/${categoryId}`,{
      headers: defaultHeaders,
      credentials:"include",
    });
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const fetchComments = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/blogs/comments/post/${postId}`,{
      headers: defaultHeaders,
      credentials:"include",
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text(); // Read response as text first
    if (!text) return []; // Return empty array if no data
    
    return JSON.parse(text); // Convert to JSON
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};


  // ✅ Create a new comment
  export const addComment = async (commentData, userType) => {
    console.log(`${BASE_URL}/pic/blogs/comment/${userType}`);
    try {
      const response = await fetch(`${BASE_URL}/pic/blogs/comment/${userType}`, {
        method: "POST",
        headers: defaultHeaders,
        credentials:"include",
        body: JSON.stringify(commentData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    }
  };
  
  // ✅ Edit a comment
  export const editComment = async (commentId, updatedComment) => {
    console.log(updatedComment)
    try {
      const response = await fetch(/* "http://localhost:5000/testDiscuss" */`${BASE_URL}/pic/blogs/comment/update/${commentId}`, {
        method: "PUT",
        headers: defaultHeaders,
        credentials:"include",
        body: JSON.stringify(updatedComment),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error editing comment:", error);
      return null;
    }
  };
  
  // ✅ Delete a comment
  export const deleteComment = async (userId, commentId, userType) => {
    try {
      const response = await fetch(`${BASE_URL}/pic/blogs/comment/delete/${userId}/${commentId}/${userType}`, {
        method: "DELETE",
        headers: defaultHeaders,
        credentials:"include",
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting comment:", error);
      return false;
    }
  };
  
  // ✅ Create a new post
  export const createPost = async (postData, userType) => {
    try {
      const response = await fetch(`${BASE_URL}/pic/blogs/post/create/${userType}`, {
        method: "POST",
        headers: defaultHeaders,
        credentials:"include",
        body: JSON.stringify(postData),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error creating post:", error);
      return null;
    }
  };

  // ✅ Edit a post
  export const editPost = async (postId, updatedPost) => {
    console.log(updatedPost);
    try {
      const response = await fetch(/* "http://localhost:5000/testDiscuss" */`${BASE_URL}/pic/blogs/post/update/${postId}`, {
        method: "PUT",
        headers: defaultHeaders,
        credentials:"include",
        body: JSON.stringify(updatedPost),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error editing post:", error);
      return null;
    }
  };
  
  // ✅ Delete a post
  export const deletePost = async (userId, postId, userType) => {
    try {
      const response = await fetch(`${BASE_URL}/pic/blogs/post/delete/${userId}/${postId}/${userType}`, {
        method: "DELETE",
        headers: defaultHeaders,
        credentials:"include",
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  };

  // ✅ Delete a topic
  export const deleteTopic = async (userId,topicId) => {
    try {
      const response = await fetch(`${BASE_URL}/pic/blogs/category/delete/${userId}/${topicId}`, {
        method: "DELETE",
        headers: defaultHeaders,
        credentials:"include",
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  };

// Fetch all Labs (Admin only)
export const fetchLabs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/pic/labs/get`,{
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

// Create a new Topic (Faculty Only)
export const createTopic = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/blogs/category/create`, {
      method: "POST",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create topic");
    return await response.json();
  } catch (error) {
    console.error("Error creating topic:", error);
  }
};

// Update an existing Topic (Faculty Only)
export const updateTopic = async (categoryId, data) => {
  try {
    const response = await fetch(`${BASE_URL}/pic/blogs/category/update/${data.facultyId}/${categoryId}`, {
      method: "PUT",
      headers: defaultHeaders,
      credentials:"include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update topic");
    return await response.json();
  } catch (error) {
    console.error("Error updating topic:", error);
  }
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
        return null; // Return null instead of crashing
    }
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


// ✅ Fetch Industry Person details
export const fetchIndustryPersonDetails = async (indsPersonId) => {
  try {
    const response = await fetch(/* `http://localhost:5000/faculty/${facultyId}` */`${BASE_URL}/pic/indusPartner/${indsPersonId}`, { headers: defaultHeaders,
      credentials:"include",

     });
    if (!response.ok) throw new Error("Failed to fetch faculty details");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
