import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function BranchUserForm() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [branch_user, setBranchUser] = useState({
        name: "",
        email: "",
        emp_id: "",
        designation: "",
        branch_role: "",
        branch_id: "",
    });
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            setLoading(false);
            return;
        }
    
        if (id) {
            axios.get(`http://127.0.0.1:5000/api/branch_user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => setBranchUser(response.data))
                .catch((error) => console.error("Error fetching branch user data:", error));
        }
    
        axios.get("http://127.0.0.1:5000/api/branches", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log(response.data); // Debugging: Ensure data is correct
                setBranches(response.data.branches); // Make sure this matches the actual response structure
            })
            .catch((error) => console.error("Error fetching branches:", error));
    }, [id])

    const handleChange = (e) => {
        setBranchUser({ ...branch_user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            setLoading(false);
            return;
        }

        
        const apiCall = id
            ? axios.put(`http://127.0.0.1:5000/api/branch_user/${id}`, branch_user, {
                headers: { Authorization: `Bearer ${token}` },
            })
            : axios.post("http://127.0.0.1:5000/api/branch_user", branch_user, {
                headers: { Authorization: `Bearer ${token}` },
            });

        apiCall
            .then(() => {
                alert(id ? "Branch User updated!" : "Branch User added!");
                navigate("/branch_user");
            })
            .catch((error) => console.error("Error saving Branch User:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{id ? "Edit Branch User" : "Add Branch User"}</h1>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={branch_user.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={branch_user.email}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Employee ID:
                <input
                    type="text"
                    name="emp_id"
                    value={branch_user.emp_id}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Designation:
                <input
                    type="text"
                    name="designation"
                    value={branch_user.designation}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Branch Role:
                <select
                    name="branch_role"
                    value={branch_user.branch_role}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="Division Head">Division Head</option>
                    <option value="Manager">Manager</option>
                    <option value="Operation Manager">Operation Manage</option>
                    <option value="Branch Employee">Branch Employee</option>
                </select>
            </label>

            <label>
                Branch:
                <select
                    name="branch_id"
                    value={branch_user.branch_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Branch</option>
                    {Array.isArray(branches) && branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                    ))}
                </select>
            </label>

            <button type="submit">Save</button>
        </form>
    );
}

export default BranchUserForm;
