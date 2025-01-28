import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSocket from './useSocket';

const BandwidthUsage = ({ deviceId }) => {
  // Declare state for bandwidth
  const [bandwidth, setBandwidth] = useState(null); // Default to null or another value you prefer

  const { bandwidthUsage } = useSocket(deviceId);

  useEffect(() => {
    const fetchBandwidth = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/metrics/${deviceId}`);
        setBandwidth(response.data.bandwidth_usage); // Set bandwidth value
      } catch (error) {
        console.error("Error fetching bandwidth:", error);
      }
    };

    fetchBandwidth();
  }, [deviceId]);

  return (
    <div>
      <h3>Bandwidth Usage</h3>
      <p>{bandwidth !== null ? `${bandwidth.toFixed(2)} Mbps` : 'Loading...'}</p>
    </div>
  );
};

export default BandwidthUsage;
