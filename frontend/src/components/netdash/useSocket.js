import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useSocket = (deviceId) => {
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [bandwidthUsage, setBandwidthUsage] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.emit('subscribe', { deviceId });

    socket.on('device_status_update', (data) => {
      if (data.device_id === deviceId) {
        setDeviceStatus(data.online_status);
        setBandwidthUsage(data.bandwidth_usage);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [deviceId]);

  return { deviceStatus, bandwidthUsage };
};

export default useSocket;
