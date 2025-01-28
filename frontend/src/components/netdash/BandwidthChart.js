import React from 'react';
import { Line } from 'react-chartjs-2';

function BandwidthChart({ data }) {
  const chartData = {
    labels: data.timestamps,
    datasets: [
      {
        label: 'Bandwidth Usage (Mbps)',
        data: data.usage,
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
}

export default BandwidthChart;
