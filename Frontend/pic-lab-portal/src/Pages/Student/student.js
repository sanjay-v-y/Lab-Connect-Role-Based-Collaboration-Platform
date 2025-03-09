    import React, { useEffect, useState } from "react";
    import Sidebar from "../../Components/Nav/Sidebar.js";
    import { fetchStudentDetails, fetchAllLabs, submitPreferredLabs } from "./api.js";

    import "../../Components/assets/student.css"

    const StudentDashboard = () => {
        const [student, setStudent] = useState(null);
        const [labs, setLabs] = useState([]);
        const [preferredLabs, setPreferredLabs] = useState(["", "", "", "", ""]);
        const [isRegistering, setIsRegistering] = useState(false);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        const [activeDropdown, setActiveDropdown] = useState(null);

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
                } catch (err) {
                    console.error("Error fetching student or lab data:", err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };
        
            fetchData();
        }, []);
        
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
                await submitPreferredLabs(student.id, preferredLabs.map(Number)); // ✅ Only sending preferredLabs
                setStudent({ ...student, preferredLabs }); 
                setIsRegistering(false);
                alert("Lab preferences submitted successfully!");
            } catch (error) {
                console.error("Error submitting preferred labs:", error);
                alert("Failed to submit preferences. Try again later.");
            }
        };

        if (loading) return <p>Loading...</p>;
        if (error) return <p style={{ color: "red" }}>Failed to fetch data. Please try again later.</p>;
        if (!student) return <p>No student data available.</p>;

        return (
            <div className="student-container">
                <Sidebar userRole="student" />
                <div className="student-content">
                    <h1>Welcome, {student.name}!</h1>
                    <p><strong>ID:</strong> {student.id}</p>
                    <p><strong>Email:</strong> {student.email}</p>

                    <h2>Lab Details</h2>
                    {student.status === "APPROVED" ? (
                        <div className="lab-card">
                            <p><strong>Lab ID:</strong> {student.lab.id}</p>
                            <p><strong>Name:</strong> {student.lab.name}</p>
                            <p><strong>Description:</strong> {student.lab.description}</p>
                            <p><strong>Faculty:</strong> {student.lab.faculty}</p>
                            <button type ="button">Request Lab Change</button>
                        </div>
                    ) : (
                        <div>
                            <p>Currently in Process</p>
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
                                                    setActiveDropdown(null); // Close dropdown
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
                </div>
            </div>
        );
    };

    export default StudentDashboard;
