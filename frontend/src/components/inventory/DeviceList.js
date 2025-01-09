import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DeviceList() {
    const [devices, setDevices] = useState([]); // Ensure initial state is an array
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
            .get("http://localhost:5000/api/devices", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const devicesData = response.data.devices;  // Directly use `response.data` since it's an array
                if (Array.isArray(devicesData)) {
                    setDevices(devicesData);
                    console.log("devices:", devicesData);
                } else {
                    setError("The response from the server is not in the expected format.");
                    console.log("devices:", devicesData);
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
                        setError("Error in fetching devices. Please try again.");
                    }
                } else if (error.request) {
                    console.log("Request data:", error.request);
                    setError("No response received from the server.");
                } else {
                    console.log("Error message:", error.message);
                    setError("Error in fetching devices. Please try again.");
                }
                setLoading(false);
            });
    }, []);

    const handleDelete = (deviceId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            setLoading(false);
            return;
        }
        if (window.confirm("Are you sure you want to delete this device?")) {
            axios
                .delete(`http://localhost:5000/api/device/${deviceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })  // Full URL for DELETE request
                .then(() => {
                    // Use functional state update to remove the deleted device
                    setDevices((prevDevices) => prevDevices.filter((device) => device.id !== deviceId));
                    alert("Device deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting device:", error);
                    alert("Failed to delete device. Please try again.");
                });
        }
    };

    if (loading) return <p>Loading devices...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Devices</h1>
            <button onClick={() => navigate("/add-device")}>Add Device</button>
            <ul>
                {devices.map((device) => (
                    <li key={device.id}> {/* Using device.id as key for list items */}
                        <strong>{device.name}</strong>
                        <div>
                            <button onClick={() => navigate(`/device/${device.id}`)}>View Details</button>
                            <button onClick={() => navigate(`/edit-device/${device.id}`)}>Edit</button>
                            <button
                                onClick={() => handleDelete(device.id)}
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

export default DeviceList;
