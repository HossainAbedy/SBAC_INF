import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function BranchForm() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [branch, setBranch] = useState({
        name: "",
        branch_code: "",
        address: "",
        devices: [],
        branch_users: []
    });

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            setLoading(false);
            return;
        }

        if (id) {
            axios.get(`http://127.0.0.1:5000/api/branch/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => setBranch(response.data))
                .catch((error) => console.error("Error fetching branch data:", error));
        }
    }, [id]);

    const handleChange = (e) => {
        setBranch({ ...branch, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const apiCall = id 
            ? axios.put(`http://127.0.0.1:5000/api/branch/${id}`, branch)
            : axios.post("http://127.0.0.1:5000/api/branch", branch);

        apiCall
            .then(() => {
                alert(id ? "Branch updated!" : "Branch added!");
                navigate("/branch");
            })
            .catch((error) => console.error("Error saving branch:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{id ? "Edit Branch" : "Add Branch"}</h1>
            <label>
                Name:
                <input type="text" name="name" value={branch.name} onChange={handleChange} required />
            </label>
            <label>
                Branch Code:
                <input type="text" name="branch_code" value={branch.branch_code} onChange={handleChange} required />
            </label>
            <label>
                Address:
                <input type="text" name="address" value={branch.address} onChange={handleChange} required />
            </label>
            <button type="submit">Save</button>
        </form>
    );
}

export default BranchForm;
