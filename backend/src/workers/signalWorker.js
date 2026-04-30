const { Worker } = require('bullmq');
const redis = require('../config/redis');
const signalService = require('../services/signalService');

const worker = new Worker(
  'signals',
  async (job) => {
    await signalService.processSignal(job.data);
  },
  { 
    connection: redis,
    concurrency: 50 
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed`, err.message);
});

module.exports = worker;