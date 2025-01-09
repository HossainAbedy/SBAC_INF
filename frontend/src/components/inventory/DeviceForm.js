import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function DeviceForm() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [device, setDevice] = useState({
        name: "",
        device_type: "",
        device_model: "",
        manufacturer: "",
        serial_number: "",
        ip_address: "",
        online_status: "",
        branch_id: ""
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
            axios.get(`http://127.0.0.1:5000/api/device/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => setDevice(response.data))
                .catch((error) => console.error("Error fetching device data:", error));
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
        setDevice({ ...device, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            setLoading(false);
            return;
        }

        // Convert online_status to boolean
        const updatedDevice = {
            ...device,
            online_status: device.online_status === "1" ? true : false,
        };

        const apiCall = id
            ? axios.put(`http://127.0.0.1:5000/api/device/${id}`, device, {
                headers: { Authorization: `Bearer ${token}` },
            })
            : axios.post("http://127.0.0.1:5000/api/device", device, {
                headers: { Authorization: `Bearer ${token}` },
            });

        apiCall
            .then(() => {
                alert(id ? "Device updated!" : "Device added!");
                navigate("/device");
            })
            .catch((error) => console.error("Error saving device:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{id ? "Edit Device" : "Add Device"}</h1>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={device.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Device Type:
                <input
                    type="text"
                    name="device_type"
                    value={device.device_type}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Device Model:
                <input
                    type="text"
                    name="device_model"
                    value={device.device_model}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Manufacturer:
                <input
                    type="text"
                    name="manufacturer"
                    value={device.manufacturer}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Serial Number:
                <input
                    type="text"
                    name="serial_number"
                    value={device.serial_number}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                IP Address:
                <input
                    type="text"
                    name="ip_address"
                    value={device.ip_address}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Online Status:
                <select
                    name="online_status"
                    value={device.online_status}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="1">Online</option>
                    <option value="0">Offline</option>
                </select>
            </label>

            <label>
                Branch:
                <select
                    name="branch_id"
                    value={device.branch_id}
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

export default DeviceForm;
