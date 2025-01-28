import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSocket from './useSocket';

const DeviceStatus = ({ deviceId }) => {
  // Declare state for device status
  const [deviceStatus, setDeviceStatus] = useState(null); // Default to null or another value you prefer

  const { deviceStatus: socketDeviceStatus } = useSocket(deviceId);

  useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/status/${deviceId}`);
        setDeviceStatus(response.data.online_status); // Set device status value
      } catch (error) {
        console.error("Error fetching device status:", error);
      }
    };

    fetchDeviceStatus();
  }, [deviceId]);

  return (
    <div>
      <h3>Device Status</h3>
      <p>{deviceStatus !== null ? (deviceStatus ? 'Online' : 'Offline') : 'Loading...'}</p>
    </div>
  );
};

export default DeviceStatus;
