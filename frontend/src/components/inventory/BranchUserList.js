import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BranchUserList() {
    const [branch_users, setBranchUser] = useState([]); // Ensure initial state is an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            setLoading(false);
            return;
        }
        
        axios
            .get("http://localhost:5000/api/branch_users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const branch_userData = response.data.branch_users;  // Directly use `response.data` since it's an array
                if (Array.isArray(branch_userData)) {
                    setBranchUser(branch_userData);
                    console.log("branch_user:", branch_userData);
                } else {
                    setError("The response from the server is not in the expected format.");
                    console.log("branch_user:", branch_userData);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching devices:", error);
                if (error.response) {
                    console.log("Response data:", error.response.data);
                    console.log("Response status:", error.response.status);
                    console.log("Response headers:", error.response.headers);
                    if (error.response.status === 422) {
                        setError("There was an issue with the request. Please check the token or request format.");
                    } else {
                        setError("Error in fetching branch user. Please try again.");
                    }
                } else if (error.request) {
                    console.log("Request data:", error.request);
                    setError("No response received from the server.");
                } else {
                    console.log("Error message:", error.message);
                    setError("Error in fetching branch users. Please try again.");
                }
                setLoading(false);
            });
    }, []);

    const handleDelete = (branch_userId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            setLoading(false);
            return;
        }
        if (window.confirm("Are you sure you want to delete this device?")) {
            axios
                .delete(`http://localhost:5000/api/branch_user/${branch_userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })  // Full URL for DELETE request
                .then(() => {
                    // Use functional state update to remove the deleted device
                    setBranchUser((prevDevices) => prevDevices.filter((branch_user) => branch_user.id !== branch_userId));
                    alert("Branch User deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting Branch User:", error);
                    alert("Failed to delete Branch User. Please try again.");
                });
        }
    };

    if (loading) return <p>Loading Branch User...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Branch Users</h1>
            <button onClick={() => navigate("/add-branch_user")}>Add Branch User</button>
            <ul>
                {branch_users.map((branch_user) => (
                    <li key={branch_user.id}> {/* Using branch_user.id as key for list items */}
                        <strong>{branch_user.name}</strong>
                        <div>
                            <button onClick={() => navigate(`/branch_user/${branch_user.id}`)}>View Details</button>
                            <button onClick={() => navigate(`/edit-branch_user/${branch_user.id}`)}>Edit</button>
                            <button
                                onClick={() => handleDelete(branch_user.id)}
                                style={{ color: "red" }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BranchUserList;
