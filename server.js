require("dotenv").config();
const { connectToDatabase, closeDatabaseConnection } = require( './db');
const app = require("./app");
const mongoose = require('mongoose');
// const PORT = process.env.PORT;

const PORT = 8000;
const HOSTNAME = '0.0.0.0';

//connect to databse when the application starts
connectToDatabase();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });



//close the databse connection when the application exists
process.on('SIGINT', () => {
  closeDatabaseConnection();
  process.exit();
})

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on port ${PORT}`);
});