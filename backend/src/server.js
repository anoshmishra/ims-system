require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const connectMongo = require('./config/mongo');
const { connectPostgres } = require('./config/postgres');
require('./config/redis');

const signalRoutes = require('./routes/signalRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, 
  message: "Too many requests"
});

let signalCount = 0;

app.use('/api/signals', limiter, (req, res, next) => {
  if (req.method === 'POST') signalCount++;
  next();
}, signalRoutes);

app.use('/api/incidents', incidentRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

setInterval(() => {
  const throughput = signalCount / 5;
  console.log(`[OBSERVABILITY] Throughput: ${throughput} signals/sec | RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
  signalCount = 0;
}, 5000);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    await connectMongo();
    await connectPostgres();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();