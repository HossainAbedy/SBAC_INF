import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BranchList() {
    const [branches, setBranches] = useState([]); // Ensure initial state is an array
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
        // console.log("Token:", token);  // Log token to verify

        axios
            .get("http://localhost:5000/api/branches", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // Access branches from the nested response data
                const branchesData = response.data.branches;
                if (Array.isArray(branchesData)) {
                    setBranches(branchesData);
                    console.log("Branches:", branchesData);
                } else {
                    setError("The response from the server is not in the expected format.");
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching branches:", error);
                if (error.response) {
                    console.log("Response data:", error.response.data);
                    console.log("Response status:", error.response.status);
                    console.log("Response headers:", error.response.headers);
                    if (error.response.status === 422) {
                        setError("There was an issue with the request. Please check the token or request format.");
                    } else {
                        setError("Error in fetching branches. Please try again.");
                    }
                } else if (error.request) {
                    console.log("Request data:", error.request);
                    setError("No response received from the server.");
                } else {
                    console.log("Error message:", error.message);
                    setError("Error in fetching branches. Please try again.");
                }
                setLoading(false);
            });
    }, []);

    const handleDelete = (branchId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            setLoading(false);
            return;
        }
        if (window.confirm("Are you sure you want to delete this branch?")) {
            axios
                .delete(`http://localhost:5000/api/branch/${branchId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })  // Full URL for DELETE request
                .then(() => {
                    // Use functional state update to remove the deleted branch
                    setBranches((prevBranches) => prevBranches.filter((branch) => branch.id !== branchId));
                    alert("Branch deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting branch:", error);
                    alert("Failed to delete branch. Please try again.");
                });
        }
    };

    if (loading) return <p>Loading branches...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Branches</h1>
            <button onClick={() => navigate("/add-branch")}>Add Branch</button>
            <button onClick={() => navigate("/device")}>Devices</button>
            <button onClick={() => navigate("/branch_user")}>Branch Users</button>
            <ul>
                {branches.map((branch) => (
                    <li key={branch.id}>
                        <strong>{branch.name}</strong>
                        <div>
                            <button onClick={() => navigate(`/branch/${branch.id}`)}>View Details</button>
                            <button onClick={() => navigate(`/edit-branch/${branch.id}`)}>Edit</button>
                            <button
                                onClick={() => handleDelete(branch.id)}
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

export default BranchList;
