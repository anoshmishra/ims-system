const { Queue } = require('bullmq');
const redis = require('../config/redis');

const signalQueue = new Queue('signals', {
  connection: redis
});

module.exports = signalQueue;