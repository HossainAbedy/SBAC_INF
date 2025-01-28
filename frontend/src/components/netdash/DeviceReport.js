import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeviceReport = ({ deviceId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchDeviceLogs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/report/${deviceId}`);
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching device logs:", error);
      }
    };

    fetchDeviceLogs();
  }, [deviceId]);

  return (
    <div>
      <h3>Device Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.timestamp}>
            {log.timestamp}: Status - {log.online_status ? 'Online' : 'Offline'}, Bandwidth - {log.bandwidth_usage.toFixed(2)} Mbps
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceReport;
