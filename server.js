require("dotenv").config();
const connectToMongoDB = require("./db");
const app = require("./app");
const PORT = process.env.PORT;
connectToMongoDB();

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
