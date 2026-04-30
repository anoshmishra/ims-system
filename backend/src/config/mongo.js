const mongoose = require('mongoose');

const connectMongo = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL;
  
  if (!uri) {
    console.error('CRITICAL: MongoDB URI is undefined. Check your .env and docker-compose.yml');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectMongo;