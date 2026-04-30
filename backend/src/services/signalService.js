const Signal = require('../models/Signal');
const { Incident } = require('../models/Incident');
const redis = require('../config/redis');

class SignalService {
  async processSignal(data) {
    const { component_id, payload, timestamp } = data;

    const rawSignal = await Signal.create({
      component_id,
      payload,
      timestamp: timestamp || new Date()
    });

    const debounceKey = `debounce:${component_id}`;
    const activeIncidentId = await redis.get(debounceKey);

    if (activeIncidentId) {
      rawSignal.incident_id = activeIncidentId;
      await rawSignal.save();
    } else {
      const incident = await Incident.create({
        component_id,
        status: 'OPEN',
        start_time: new Date()
      });

      await redis.set(debounceKey, incident.id, 'EX', 10);

      rawSignal.incident_id = incident.id;
      await rawSignal.save();
    }
  }
}

module.exports = new SignalService();