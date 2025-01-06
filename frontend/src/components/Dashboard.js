import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loggedInUserRole, setLoggedInUserRole] = useState(""); // Logged-in user's role
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // Fetch users and the logged-in user's role
        axios.get("http://127.0.0.1:5000/users", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then((response) => {
                setUsers(response.data.users);
                setLoggedInUserRole(response.data.loggedInUserRole); // Logged-in user's role
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });

        // Fetch available roles
        axios.get("http://127.0.0.1:5000/roles")
            .then((response) => {
                setRoles(response.data.roles); // Roles array
            })
            .catch((error) => {
                console.error("Error fetching roles:", error);
            });
    }, []);

    // Function to update user role
    const updateUserRole = (userId, newRoleId) => {
        const token = localStorage.getItem('access_token'); // Ensure the token is available
    
        if (!token) {
            alert("Authorization token is missing.");
            return;
        }
    
        axios.post(
            `http://127.0.0.1:5000/users/${userId}/updateRole`,
            { roleId: newRoleId },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
            alert("Role updated successfully!");
            // Update user role in local state
            setUsers(users.map(user =>
                user.id === userId ? { ...user, roleId: newRoleId } : user
            ));
        })
        .catch((error) => {
            // Check if the error has a response (HTTP status)
            if (error.response) {
                console.error("Error response:", error.response.data);
                alert(`Error: ${error.response.data.message || 'Something went wrong'}`);
            } else if (error.request) {
                // No response received
                console.error("Error request:", error.request);
                alert("No response from the server. Please try again later.");
            } else {
                // General error
                console.error("Error message:", error.message);
                alert("An error occurred. Please check the console for details.");
            }
        });
    };

    return (
        <div>
            {/* Add button to navigate to Profile */}
            <button 
                className="btn btn-info mb-3" 
                onClick={() => navigate("/profile")} // Use navigate to go to Profile
            >
                Go to Profile
            </button>

            <h1>Welcome to the Dashboard</h1>
            <p>This page is accessible only to logged-in users.</p>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.roleId}
                                    onChange={(e) => updateUserRole(user.id, parseInt(e.target.value))}
                                    disabled={loggedInUserRole !== "admin"} // Disable for non-admins
                                    className="form-select"
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                {loggedInUserRole === "admin" ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => updateUserRole(user.id, user.roleId)}
                                    >
                                        Save Role
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary" disabled>
                                        Admin Only
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
