import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';

function NetworkMap({ data }) {
  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [
        ...data.nodes.map((node) => ({ data: node })),
        ...data.edges.map((edge) => ({ data: edge })),
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#0074D9',
            label: 'data(label)',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#FF4136',
          },
        },
      ],
      layout: {
        name: 'grid',
      },
    });
  }, [data]);

  return <div id="cy" style={{ width: '100%', height: '500px' }}></div>;
}

export default NetworkMap;
