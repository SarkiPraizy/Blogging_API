const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

const blogRouter = require("./routes/blogRouter");
const auth_router = require("./routes/authRouter")

const app = express();

app.use(bodyParser.json());
app.use("/", auth_router)
app.use("/blogs", blogRouter)
app.get("/", (req, res) => {
  res.send("welcome to homepage");
});

module.exports = app;
