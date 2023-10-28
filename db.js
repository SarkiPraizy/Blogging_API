
const mongoose = require('mongoose');
require('dotenv').config()

console.log(process.env.MONGODB_URL)
const dbURI = 'mongodb://localhost/blogdb';

// Creating a function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

// Creating a function to close the database connection
const closeDatabaseConnection = () => {
  mongoose.connection.close();
  console.log('Disconnected from MongoDB');
};

// Exporting the connection functions and the mongoose instance
module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  mongoose,
};
