import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {   fetchPosts, fetchComments, addComment, editComment, deleteComment, createPost, editPost, deletePost } from "./api.js";
import Sidebar from "../../Components/Nav/Sidebar.js";
import "./discussForum.css";
import { Check, X } from "lucide-react"; // ✅ Import icons
import defaultUserIcon from "../../Components/images/userprofilePic.png"

const PostPage = ({ userRole }) => {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [hoveredComment, setHoveredComment] = useState(null);
  const [postOptions, setPostOptions] = useState(null);
  const [commentOptions, setCommentOptions] = useState(null);
  const [commentInputs, setCommentInputs] = useState({}); // ✅ Stores comments separately for each post
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [notification, setNotification] = useState(null);

  // ✅ Get user ID from local storage
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userType = localStorage.getItem("userType");

  // ✅ Fix: Properly fetching posts when categoryId changes
  useEffect(() => {
    setLoading(true);
    fetchPosts(categoryId)
      .then((data) => {
        if (!data || data.length === 0) {
          setPosts([]);  // ✅ Ensure empty state is properly handled
        } else {
          setPosts(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPosts([]);  
      })
      .finally(() => setLoading(false));
  }, [categoryId]);
  

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        fetchComments(post.id)
          .then((data) => {
            setComments((prev) => ({
              ...prev,
              [post.id]: data.length > 0 ? data : [], // ✅ Ensure empty array instead of undefined
            }));
          })
          .catch((error) => {
            console.error(`Error fetching comments for post ${post.id}:`, error);
            setComments((prev) => ({
              ...prev,
              [post.id]: [],
            }));
          });
      });
    }
  }, [posts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".post-dropdown") && !event.target.closest(".post-menu") &&
      !event.target.closest(".comment-dropdown")) {
        setPostOptions(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); 

  useEffect(() => {
    if (postOptions || commentOptions) {
      const timer = setTimeout(() => {
        setPostOptions(null);
        setCommentOptions(null);
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [postOptions, commentOptions]);
  

  const toggleComments = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }

    fetchComments(postId).then((data) => {
      setComments((prev) => ({ ...prev, [postId]: data }));
      setExpandedPost(postId);
    });
  };

  const toggleCommentOptions = (commentId) => {
    setCommentOptions(commentOptions === commentId ? null : commentId);
  };

  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 mins in milliseconds
  const istTime = new Date(now.getTime() + istOffset).toISOString();

  const handleAddComment = async (postId) => {
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
  
    const commentText = commentInputs[postId] || ""; 
    if (!commentText.trim()) return;
  
    const newComment = {
      post: { id: postId },
      content: commentText,
      createdAt: istTime, 
      [userType]: { id: userId },
    };
  
    const response = await addComment(newComment, userType);
    if (response) {
      setCommentInputs((prev) => ({ ...prev, [postId]: "" })); 
      await refreshComments(postId); 
      showNotification("Comment added! ✅"); 
    }
  };
  
  const refreshComments = async (postId) => {
    const updatedComments = await fetchComments(postId);
    setComments((prev) => ({ ...prev, [postId]: updatedComments }));
  };
  

  //Edit Comment
  const handleEditComment = async (commentId, postId) => {
    if (!editingComment.trim()) return;
  
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    const updatedComment = {
      post: { id: Number(postId) }, // Ensure postId is a number
      content: editingComment,
      createdAt: istTime, // Adjust for your timezone, // Current timestamp
      [userType]: { id: userId },
    };
  
    const response = await editComment(commentId, updatedComment);
    if (response) {
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: prevComments[postId].map((comment) =>
          comment.id === commentId ? { ...comment, content: editingComment } : comment
        ),
      }));
      setEditingComment("");
      setEditingCommentId(null);
    }
  };
  


  // ✅ Handle deleting a comment
  const handleDeleteComment = async (commentId, postId) => {
    const userId = localStorage.getItem("userId"); 
    const userType = localStorage.getItem("userType"); // Get userType dynamically
    const success = await deleteComment(userId, commentId, userType);

    if (success) {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
      setCommentOptions(null);
    }
  };

  // ✅ Create Post (Now UserType-Based)
  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim()) return;
  
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
  
    const newPost = {
      category: { id: categoryId },
      title: postTitle,
      content: postContent,
      createdAt: istTime,
      [userType]: { id: userId },
    };
  
    const response = await createPost(newPost, userType);
    if (response) {
      setShowPostForm(false);
      setPostTitle("");
      setPostContent("");
      await refreshPosts(); 
      showNotification("Post added! ✅"); 
    }
  };
  
  const refreshPosts = async () => {
    const updatedPosts = await fetchPosts(categoryId);
    setPosts(updatedPosts);
  };  

  //Edit post
  const handleEditPost = (postId, title = "", content = "") => {
    console.log("Edit Clicked for Post ID:", postId);
    
    setEditingPost(postId);  // ✅ Show edit form
    setPostTitle(title || "");  // ✅ Ensure it's never undefined
    setPostContent(content || "");  // ✅ Ensure it's never undefined
  };

  //Save post
  const handleSavePost = async (postId) => {
    if (!postTitle.trim() || !postContent.trim()) return;
  
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType"); // Get user type dynamically

    const updatedPost = {
      title: postTitle,
      content: postContent,
      createdAt: istTime, // Adjust for your timezone
      [userType]: { id: userId }, // Include industry partner ID
      category: { id: categoryId }, // Include category ID
    };
  
    const response = await editPost(postId, updatedPost); // API call
    if (response) {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, title: postTitle, content: postContent } : p
        )
      );
        
      setEditingPost(null); 
      setPostTitle("");
      setPostContent("");

      showNotification("Post updated successfully! ✅");
    }
  };  

  // ✅ Handle deleting a post
  const handleDeletePost = async (postId) => {
    const userId = localStorage.getItem("userId"); 
    const userType = localStorage.getItem("userType"); // Get userType dynamically
    const response = await deletePost(userId, postId, userType);

    if (response) {
      setPosts(posts.filter((post) => post.id !== postId)); // Remove from UI
    }
  };
  
  // Helper function to format time difference
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);

    // ✅ Convert UTC to local time
    const localCreatedAt = new Date(createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const diffInSeconds = Math.floor((now - localCreatedAt) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const showNotification = (message) => {
    console.log("Notification triggered:", message); // ✅ Debugging log
    setNotification(message);
    setTimeout(() => {
      setNotification(null); // Hide after 2 sec
    }, 2000);
  };

  return (
    <div className="forum-container">
      <Sidebar userRole={userType} />
      <div className="forum-content">
        <h2 className="forum-title">Posts</h2>
        
        {/* ✅ Fixed: "Create Post" Button */}
        {userType !== "admin" && (
          <button type="button" className="create-post-btn" onClick={() => setShowPostForm(true)}>
            + Create Post
          </button>
        )}

        {/* ✅ Fixed: Show "Create Post" Form */}
        {showPostForm && (
          <div className="post-overlay">
            <div className="post-form-container">
              <h3>Create Post</h3>
              <input
                type="text"
                placeholder="Post Title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
              <textarea
                placeholder="Post Content"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <div className="button-group">
                <button type="button" onClick={handleCreatePost}>Submit</button>
                <button type="button" className="post-cancel-btn" onClick={() => setShowPostForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        
        {notification && (
          <div className="popup-notification">
            {notification}
          </div>
        )}

        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="posts-list">
            {posts.length === 0 ? (
              <p>No posts available.</p>
            ) : (
              posts?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">

                  <div className="post-info">  {/* ✅ Wrap meta & title together */}
                      <p className="post-meta">
                      <span 
                          className="profile-pic" 
                          style={{ backgroundImage: defaultUserIcon ? `url(${defaultUserIcon})` : "none" }} 
                        ></span>
                        <strong>{post.authorId === userId ? "You" : `${post.authorName} (${post.authorType})`}</strong>
                        <span className="time-ago">{formatTimeAgo(post.createdAt)}</span>
                      </p>
                      <h3 className="post-title">{post.title}</h3>
                    </div>

                    {(userType=== "faculty" || post.authorId === userId) && (
                        <button type="button"
                        className="post-menu"
                        onClick={() => setPostOptions(post.id === postOptions ? null : post.id)}
                      >
                        ⋮
                        </button>
                    )}
                    {postOptions === post.id && (
                      <div className="post-dropdown">
                        {(userType=== "faculty" || post.authorId === userId) && (
                        <>
                        <button type="button" onClick={() => handleEditPost(post.id, post.title, post.content)}>Edit</button>
                        <button type="button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </>
                        )}
                      </div>
                    )}
                  </div>

                    {/* ✅ Fixed: Editing Post Form */}
                    {editingPost === post.id && (
                      <div className="post-overlay">
                        <div className="post-form-container">
                          <h3>Edit Post</h3>
                          <input
                            type="text"
                            value={postTitle || ""}
                            onChange={(e) => setPostTitle(e.target.value)}
                          />
                          <textarea
                            value={postContent || ""}
                            onChange={(e) => setPostContent(e.target.value)}
                          />
                          <div className="button-group">
                            <button type="button" onClick={() => handleSavePost(post.id)}>Save</button>
                            <button type="button" className="post-cancel-btn" onClick={() => setEditingPost(null)}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    )}
  
                  {/* ✅ Add Comment Section (Placed Above "View Comments") */}
                  {(userType !== "admin") && (
                    <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] ?? ""} // ✅ Separate input for each post
                      onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)} // ✅ Handle Enter Key
                    />
                    <button type ="button" onClick={() => handleAddComment(post.id)}>Add</button>
                    </div>
                  )}
                  
                  {notification && (
                            <div className="popup-notification">
                              {notification}
                            </div>
                  )}

                  {/* ✅ View Comments Section */}
                  <button type ="button" className="view-comments-btn" onClick={() => toggleComments(post.id)}>
                    View Comments
                  </button>
  
                  {expandedPost === post.id && (
                    <div className="comments-section">
                      <div className="comments-list">
                        {comments[post.id]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment) => (
                          <div className="comment-item" key={comment.id}>
                          <span className="comment-user">
                            {comment.authorId === userId ? "You:" : `${comment.authorName} (${comment.authorType}):`}
                          </span>
                        
                          {editingCommentId === comment.id ? (
                            <input
                              type="text"
                              value={editingComment}
                              onChange={(e) => setEditingComment(e.target.value)}
                            />
                          ) : (
                            <span
                              className="comment-text"
                              onClick={() => {
                                if (comment.authorName === userName) {
                                  toggleCommentOptions(comment.id);
                                }
                              }}
                            >
                              {comment.content}
                            </span>
                          )}
                          
                          {/* ✅ Time ago should be at the right end */}
                          <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>

                          {/* Edit and delete Comment Section */}
                          {commentOptions === comment.id && (userType === "faculty" || comment.authorId === userId) && (
                            <div className="comment-dropdown">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingComment(comment.content);
                                  setEditingCommentId(comment.id);
                                  setCommentOptions(null); // Close menu after clicking edit
                                }}
                              >
                                Edit
                              </button>
                              <button type="button" onClick={() => handleDeleteComment(comment.id, post.id)}>
                                Delete
                              </button>
                            </div>
                          )}


                          {editingCommentId === comment.id && (
                            <div className="comment-edit-actions">
                              <div className="comment-edit-actions">
                                <button 
                                  type="button" 
                                  onClick={() => handleEditComment(comment.id, post.id)} 
                                  style={{ background: "white", border: "none", cursor: "pointer" }}
                                >
                                  <Check size={20} color="darkgray" /> {/* ✅ Tick icon */}
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => setEditingCommentId(null)} 
                                  style={{ background: "white", border: "none", cursor: "pointer" }}
                                >
                                  <X size={20} color="darkgray" /> {/* ✅ Cross icon */}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );  
};

export default PostPage;
