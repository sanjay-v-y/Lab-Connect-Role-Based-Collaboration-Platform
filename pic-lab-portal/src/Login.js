import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./config.js"; 

const defaultHeaders = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Fix for ngrok browser redirect issue
};

export const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogin = async () => {
            try {
                const response = await fetch(/* "http://localhost:5000/userData" *//* `${BASE_URL}/pic/getuser` */
                `${BASE_URL}/login/success`, {
                    method:"GET",
                    headers: defaultHeaders,
                    credentials:"include",
                  }); // Replace with actual API

                console.log(response)
                const data = await response.json();

                console.log(data)

                if (data) {
                    const { userType, id, profilePic, userName } = data;

                    // Store user ID & Type in localStorage
                    localStorage.setItem("userId", id);
                    localStorage.setItem("userType", userType);
                    localStorage.setItem("profilePic", profilePic);
                    localStorage.setItem("userName", userName);

                    // Navigate based on user type
                    console.log(userType);
                    console.log(id);
                    console.log(profilePic);
                    console.log(userName);

                    if (userType === "admin") {
                        navigate("/admin");
                    } else if (userType === "student") {
                        navigate("/student");
                    } else if (userType === "faculty") {
                        navigate("/faculty");
                    } else {
                        navigate("/indsPartner");
                    }
                }
            } catch (error) {
                console.error("Error during login:", error);
            }
        };

        handleLogin();
    }, [navigate]); // Runs when component mounts

    return <h2>Logging in...</h2>; // Optional loading text
};

export default Login;
