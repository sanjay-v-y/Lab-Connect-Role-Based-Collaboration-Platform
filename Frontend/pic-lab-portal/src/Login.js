import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const defaultHeaders = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Fix for ngrok browser redirect issue
};

export const Login = () => {
    const navigate = useNavigate();

    const url = "https://3001-2409-408d-29c-e42d-d79-643a-f089-d997.ngrok-free.app";

    useEffect(() => {
        const handleLogin = async () => {
            try {
                const response = await fetch(`${url}/pic/getuser`, {
                    headers: defaultHeaders,
                  }); // Replace with actual API
                const data = await response.json();

                console.log(data)

                if (data) {
                    const { userType, userId } = data;

                    // Store user ID & Type in localStorage
                    localStorage.setItem("userId", userId);
                    localStorage.setItem("userType", userType);

                    // Navigate based on user type
                    console.log(userType);
                    console.log(userId);
                    if (userType === "admin") {
                        navigate("/admin");
                    } else if (userType === "student") {
                        navigate("/student");
                    } else if (userType === "faculty") {
                        navigate("/faculty");
                    } else {
                        navigate("/industry");
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
