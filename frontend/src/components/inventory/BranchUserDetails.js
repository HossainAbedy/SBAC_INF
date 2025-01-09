import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BranchUserDetails() {
    const { id } = useParams();
    const [branch_user, setBranchUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            return;
        }

        axios
            .get(`http://localhost:5000/api/branch_user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const branch_userData = response.data;
                if (branch_userData) {
                    setBranchUser(branch_userData);
                } else {
                    setError("Branch Us erdata not found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching branch user details:", error);
                setError("Error fetching branch user details. Please try again.");
            });
    }, [id]);

    const deleteBranchUser = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this branch user?")) {
            axios
                .delete(`http://localhost:5000/api/branch_user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    alert("Branch User deleted successfully!");
                    navigate("/"); // Redirect after successful deletion
                })
                .catch((error) => {
                    console.error("Error deleting branch user:", error);
                    alert("Failed to delete branch. Please try again.");
                });
        }
    };

    if (!branch_user) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{branch_user.name}</h1>
            <p><strong>Email:</strong> {branch_user.email}</p>
            <p><strong>Employee ID:</strong> {branch_user.emp_id}</p>
            <p>Desgignation: {branch_user.designation}</p>
            <p>Branch Role: {branch_user.branch_role}</p>
            <p>Branch: {branch_user.branch_id}</p>
            <button onClick={() => navigate(`/edit-branch_user/${id}`)}>Edit Branch User</button>
            <button onClick={deleteBranchUser}>Delete Branch User</button>
        </div>
    );
}

export default BranchUserDetails;
