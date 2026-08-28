const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    if (process.env.MONGO_DNS_SERVER) {
      dns.setServers(process.env.MONGO_DNS_SERVER.split(',').map((server) => server.trim()));
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;