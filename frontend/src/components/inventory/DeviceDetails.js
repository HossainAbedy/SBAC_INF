import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DeviceDetails() {
    const { id } = useParams();
    const [device, setDevice] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            return;
        }

        axios
            .get(`http://localhost:5000/api/device/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const deviceData = response.data;
                if (deviceData) {
                    setDevice(deviceData);
                } else {
                    setError("Device data not found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching device details:", error);
                setError("Error fetching device details. Please try again.");
            });
    }, [id]);

    const deleteDevice = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("No access token found. Please log in.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this device?")) {
            axios
                .delete(`http://localhost:5000/api/device/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    alert("Device deleted successfully!");
                    navigate("/device"); // Redirect after successful deletion
                })
                .catch((error) => {
                    console.error("Error deleting Device:", error);
                    alert("Failed to delete Device. Please try again.");
                });
        }
    };

    if (!device) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{device.name}</h1>
            <p><strong>Type:</strong> {device.device_type}</p>
            <p><strong>Model:</strong> {device.device_model}</p>
            <p>IP: {device.ip_address}</p>
            <p>Manufacturer: {device.manufacturer}</p>
            <p>Serial Number: {device.serial_number}</p>
            <p>Status: {device.online_status ? "Online" : "Offline"}</p>
            <button onClick={() => navigate(`/edit-device/${id}`)}>Edit Device</button>
            <button onClick={deleteDevice}>Delete Device</button>
        </div>
    );
}

export default DeviceDetails;
