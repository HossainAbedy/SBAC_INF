import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Your backend address

function NetDash() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    socket.on('device_status_update', (data) => {
      setDevices(data);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Device Dashboard</h1>
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            {device.name} - {device.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NetDash;
