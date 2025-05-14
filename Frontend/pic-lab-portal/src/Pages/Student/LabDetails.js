    import React, { useEffect, useState, useRef } from "react";
    import Sidebar from "../../Components/Nav/Sidebar.js";
    import { fetchStudentDetails, fetchAllLabs, submitPreferredLabs, requestLabChange, getLabNameById, fetchAttendanceStatus, fetchLabChangeStatus } from "./api.js";

    import "../../Components/assets/labDetails.css"

    const StudentDashboard = () => {
        const [student, setStudent] = useState(null);
        const [labs, setLabs] = useState([]);
        const [preferredLabs, setPreferredLabs] = useState(["", "", "", "", ""]);
        const [isRegistering, setIsRegistering] = useState(false);
        const [isRequestingLabChange, setIsRequestingLabChange] = useState(false);
        const [selectedLab, setSelectedLab] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        const [activeDropdown, setActiveDropdown] = useState(null);
        const [labNames, setLabNames] = useState({});
        const [attendance, setAttendance] = useState(null);
        const [labChangeStatus, setLabChangeStatus] = useState(null); // ✅ Holds Lab Change Status
        const formRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
              if (formRef.current && !formRef.current.contains(event.target)) {
                setIsRequestingLabChange(false); // close the form
              }
            };
          
            if (isRequestingLabChange) {
              document.addEventListener("mousedown", handleClickOutside);
            }
          
            return () => {
              document.removeEventListener("mousedown", handleClickOutside);
            };
          }, [isRequestingLabChange]);          

        useEffect(() => {
            console.log("Fetching student details...");
        
            const fetchData = async () => {
                try {
                    const studentId = localStorage.getItem("userId");

                    if (!studentId) {
                        console.error("No student ID found in localStorage");
                        setError(true);
                        return;
                    }

                    const studentData = await fetchStudentDetails(studentId);
                    console.log("Fetched Student Data:", studentData);
        
                    if (!studentData) {
                        setError(true); 
                        return;
                    }
        
                    setStudent(studentData);
        
                    const labsData = await fetchAllLabs();
                    console.log("Fetched Labs Data:", labsData);
                    setLabs(labsData);

                    // ✅ Fetch Lab Change Request Status
                    const labChangeData = await fetchLabChangeStatus(studentId);
                    setLabChangeStatus(labChangeData || null); // If no data, set to null

                } catch (err) {
                    console.error("Error fetching student or lab data:", err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };
        
            fetchData();
        }, []);

        // 2️⃣ Fetch Attendance Data **After** Student Data is Updated
        useEffect(() => {
            const fetchAttendance = async () => {
                if (student?.id && student.status === "APPROVED" && student.preferredLabs.length) {
                    console.log("Fetching attendance for student:", student.id);
                    const attendanceData = await fetchAttendanceStatus(student.id);
                    console.log("Fetched Attendance Data:", attendanceData);
                    setAttendance(attendanceData);
                }
            };

            fetchAttendance();
        }, [student]); // Runs ONLY when `student` updates
        
        // ✅ Render Lab Change Status
        const renderLabChangeStatus = () => {
            if (!labChangeStatus) return null; // No request made, so nothing to show

            const { approvedByCurrentFaculty, approvedByDesiredFaculty, status, currentLabName, desiredLabName } = labChangeStatus;

            const getStatusText = (approved, currentStatus) => {
                if (approved) return "Approved";
                return currentStatus === "PENDING" ? "Pending" : "Rejected";
            };

            return (
                <div className="lab-change-status">
                    <h3>Lab Change Request Status</h3>
                    <p><strong>{currentLabName} Lab :</strong>{" "} 
                        <span className={approvedByCurrentFaculty ? "approved" : status === "PENDING" ? "pending" : "rejected"}>
                            {getStatusText(approvedByCurrentFaculty, status)}
                        </span></p>
                    <p><strong>{desiredLabName} Lab :</strong>{" "} 
                        <span className={approvedByDesiredFaculty ? "approved" : status === "PENDING" ? "pending" : "rejected"}>
                            {getStatusText(approvedByDesiredFaculty, status)}
                        </span></p>
                </div>
            );
        };

        // 3️⃣ Attendance Status Renderer
        const renderAttendanceStatus = () => {
            console.log("Rendering Attendance Status:", attendance);

            if (!attendance) return null;
            
            const { forenoonStatus, afternoonStatus } = attendance;

            let overallStatus;
            if (forenoonStatus && afternoonStatus) overallStatus = "Present (Full Day)";
            else if (forenoonStatus || afternoonStatus) overallStatus = "Present (Half Day)";
            else overallStatus = "Absent";

            return (
                <>
                <h2 className="section-title">Attendance Status</h2>
                <div className="attendance-container">
                    <p className="attendance-date">📅 {new Date().toDateString()}</p>
                    <div className="attendance-card">
                        <p><strong>Overall Status:</strong> <span className={`status ${overallStatus.toLowerCase().replace(/ /g, "-")}`}>{overallStatus}</span></p>
                        <p><strong>Forenoon Attendance:</strong> <span className={`status ${forenoonStatus ? "present" : "absent"}`}>{forenoonStatus ? "Present" : "Absent"}</span></p>
                        <p><strong>Afternoon Attendance:</strong> <span className={`status ${afternoonStatus ? "present" : "absent"}`}>{afternoonStatus ? "Present" : "Absent"}</span></p>
                    </div>
                </div>
                </>
            );
        };
        
        
        const handleLabSelection = (index, selectedLabId) => {
            const updatedPreferredLabs = [...preferredLabs];
            updatedPreferredLabs[index] = selectedLabId;
            setPreferredLabs(updatedPreferredLabs);
        };

        const handleSubmit = async () => {
            if (preferredLabs.includes("")) {
                alert("Please select all 5 preferred labs.");
                return;
            }
            
            try {
                await submitPreferredLabs(student.id, preferredLabs); // ❌ Removed .map(Number)
                setStudent({ ...student, preferredLabs }); 
                setIsRegistering(false);
                alert("Lab preferences submitted successfully!");
            } catch (error) {
                console.error("Error submitting preferred labs:", error);
                alert("Failed to submit preferences. Try again later.");
            }
        };
        

        // Handle Lab Change Request Submission
        const handleLabChangeRequest = async () => {
            if (!selectedLab) {
                alert("Please select a lab before submitting.");
                return;
            }
        
            const responseMessage = await requestLabChange(student.id, selectedLab);
        
            if (responseMessage) {
                alert(responseMessage);
                setIsRequestingLabChange(false);
                setSelectedLab(null);

                // ✅ Fetch and update labChangeStatus immediately
                const updatedStatus = await fetchLabChangeStatus(student.id);
                setLabChangeStatus(updatedStatus || null);

            } else {
                alert("Failed to submit lab change request. Try again later.");
            }
        };


        if (loading) return <p>Loading...</p>;
        if (error) return <p style={{ color: "red" }}>Failed to fetch data. Please try again later.</p>;
        if (!student) return <p>No student data available.</p>;

        // Function to get lab name by ID
        const getLabNameById = (labId) => {
            const lab = labs.find((lab) => lab.id === labId);
            return lab ? lab.name : "Unknown Lab";
        };

        
        // Status card display logic
        const renderStatusCards = () => {
            if (student.status === "APPROVED") {
                return null; // No status cards if the student is approved
            }

            if (student.status === "PENDING" && student.preferredLabs.length > 0) {
                <p>Currently in Process</p>
                const currentIndex = student.currentLabIndex; 
                const preferredLabs = student.preferredLabs;

                let statusCards = [];

                // **Pending Lab Card**
                if (currentIndex < preferredLabs.length) {
                    statusCards.push(
                        <div className="status-card pending-card" key="pending">
                            <p>{getLabNameById(preferredLabs[currentIndex])} register request status - <span className="pending">Pending</span></p>
                        </div>
                    );
                }

                // **Rejected Lab Cards**
                for (let i = 0; i < currentIndex; i++) {
                    statusCards.push(
                        <div className="status-card rejected-card" key={`rejected-${i}`}>
                            <p>{getLabNameById(preferredLabs[i])} register request status - <span className="rejected">Rejected</span></p>
                        </div>
                    );
                }

                // **If currentIndex exceeds preferredLabs length, all are rejected**
                if (currentIndex >= preferredLabs.length) {
                    statusCards = preferredLabs.map((labId, index) => (
                        <div className="status-card rejected-card" key={`rejected-all-${index}`}>
                            <p>{getLabNameById(labId)} register request status - <span className="rejected">Rejected</span></p>
                        </div>
                    ));
                }

                return <div className="status-container">{statusCards}</div>;
            }

            return null;
        };

        return (
            <div className="student-container">
                <Sidebar userRole="student" />
                <div className="student-content">
                    <h2 className="section-title">Lab Details</h2>
                    {student.status === "APPROVED" ? (
                        <div className="lab-card-container">
                            <p><strong>Lab ID:</strong> {student.lab.id}</p>
                            <p><strong>Name:</strong> {student.lab.name}</p>
                            <p><strong>Description:</strong> {student.lab.description}</p>
                            <p><strong>Faculty:</strong> {student.lab.faculty}</p>
                           
                            {!labChangeStatus && (
                                <button type="button" onClick={() => setIsRequestingLabChange(true)}>
                                    Request Lab Change
                                </button>
                            )}

                            
                            {renderLabChangeStatus()}

                            {/* Request Lab Change Form */}
                            {isRequestingLabChange && (
                            <div className="overlay">
                                <div className="lab-change-container" ref={formRef}>
                                <h3>Select a new lab</h3>
                                <div className="lab-selection-container">
                                    <input
                                    type="text"
                                    value={labs.find((lab) => lab.id === selectedLab)?.name || ""}
                                    placeholder="Select a Lab"
                                    onFocus={() => setActiveDropdown(true)}
                                    readOnly
                                    />
                                    {activeDropdown && (
                                    <ul className="lab-dropdown">
                                    {labs
                                    .filter((lab) => lab.id !== student.lab.id) // ✅ Remove the student's current lab
                                    .map((lab) => (
                                        <li key={lab.id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                            setSelectedLab(lab.id);
                                            setActiveDropdown(false);
                                            }}
                                        >
                                            {lab.name}
                                        </button>
                                        </li>
                                    ))}
                                    </ul>
                                    )}
                                </div>
                                <button type="button" className="submit-btn" onClick={handleLabChangeRequest}>
                                    Submit Request
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setIsRequestingLabChange(false)}>
                                    Cancel
                                </button>
                                </div>
                            </div>
                            )}


                        </div>
                    ) : (
                        <div>
                            {student.status === "PENDING" && student.preferredLabs.length > 0 && (
                                <>
                                    <p>Currently in Process</p>
                                    {renderStatusCards()}
                                </>
                                )}
                            {student.preferredLabs.length === 0 && (
                                <button type="button" onClick={() => setIsRegistering(true)}>Register for Labs</button>
                            )}
                            {isRegistering && (
                                <div className="register-container">
                                    <h3>Select Preferred Labs</h3>
                                    {[...Array(5)].map((_, index) => {
                                    const preferenceKey = `preferred-lab-${index}`; 
                                    return (
                                    <div key={`preferred-lab-${preferenceKey}`} className="lab-selection-container">
                                        <label htmlFor={`labPreference-${index}`}>Preferred Lab {index + 1}:</label>
                                        <input
                                        type="text" id={`labPreference-${index}`}
                                        value={
                                            labs.find((lab) => lab.id.toString() === preferredLabs[index])?.name || ""
                                        }
                                        placeholder="Select a Lab"
                                        onFocus={() => setActiveDropdown(index)}
                                        readOnly
                                        />

                                        {activeDropdown === index && (
                                        <ul className="lab-dropdown">
                                            {labs
                                            .filter((lab) => !preferredLabs.includes(lab.id.toString()))
                                            .map((lab) => (
                                                <li key={lab.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                    handleLabSelection(index, lab.id.toString());
                                                    setActiveDropdown(null); 
                                                    }}
                                                >
                                                    {lab.name}
                                                </button>
                                                </li>
                                            ))}
                                        </ul>
                                        )}
                                    </div>
                                    );
                                    })}
                                    <button type="button" className="submit-btn" onClick={handleSubmit}>
                                    Submit Preferences
                                    </button>
                                </div>
                            )}

                        </div>
                    )}
                    <div>
                        {loading ? <p>Loading...</p> : error ? <p>Error loading data.</p> : renderAttendanceStatus()}
                    </div>
                </div>
            </div>
        );
    };

    export default StudentDashboard;
