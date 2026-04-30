const simulate = async () => {
  const componentId = 'RDBMS_CLUSTER_01';
  const totalSignals = 100;

  console.log(`Sending ${totalSignals} signals for ${componentId}...`);

  for (let i = 0; i < totalSignals; i++) {
    try {
      await fetch('http://localhost:3000/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component_id: componentId,
          payload: {
            error: 'Connection timeout',
            retry_count: i
          }
        })
      });
    } catch (err) {
      console.error('Request failed:', err.message);
    }
  }

  console.log('Simulation complete.');
};

simulate();