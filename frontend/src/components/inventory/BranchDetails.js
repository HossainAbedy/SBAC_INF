import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BranchDetails() {
    const { id } = useParams();
    const [branch, setBranch] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            return;
        }

        axios
            .get(`http://localhost:5000/api/branch/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const branchData = response.data;
                if (branchData) {
                    setBranch(branchData);
                } else {
                    setError("Branch data not found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching branch details:", error);
                setError("Error fetching branch details. Please try again.");
            });
    }, [id]);

    const deleteBranch = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this branch?")) {
            axios
                .delete(`http://localhost:5000/api/branch/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    alert("Branch deleted successfully!");
                    navigate("/"); // Redirect after successful deletion
                })
                .catch((error) => {
                    console.error("Error deleting branch:", error);
                    alert("Failed to delete branch. Please try again.");
                });
        }
    };

    if (!branch) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{branch.name}</h1>
            <p><strong>Branch Code:</strong> {branch.branch_code}</p>
            <p><strong>Address:</strong> {branch.address}</p>

            {/* Devices Section */}
            <div>
                <h2>Devices</h2>
                <ul>
                    {branch.devices && branch.devices.length > 0 ? (
                        branch.devices.map((device) => (
                            <li key={device.id}>
                                <strong>{device.name}</strong> ({device.device_type}) - {device.device_model}
                                <p>IP: {device.ip_address}</p>
                                <p>Manufacturer: {device.manufacturer}</p>
                                <p>Serial Number: {device.serial_number}</p>
                                <p>Status: {device.online_status ? "Online" : "Offline"}</p>
                            </li>
                        ))
                    ) : (
                        <p>No devices found for this branch.</p>
                    )}
                </ul>
            </div>

            {/* Branch Users Section */}
            <div>
                <h2>Branch Users</h2>
                <ul>
                    {branch.branch_users && branch.branch_users.length > 0 ? (
                        branch.branch_users.map((user) => (
                            <li key={user.id}>
                                <strong>{user.name}</strong> ({user.branch_role}) - {user.designation}
                                <p>Email: {user.email}</p>
                                <p>Employee ID: {user.emp_id}</p>
                            </li>
                        ))
                    ) : (
                        <p>No users found for this branch.</p>
                    )}
                </ul>
            </div>

            <button onClick={() => navigate(`/edit-branch/${id}`)}>Edit Branch</button>
            <button onClick={deleteBranch}>Delete Branch</button>
        </div>
    );
}

export default BranchDetails;
