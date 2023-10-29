require('dotenv').config()
const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { connectToDatabase, closeDatabaseConnection } = require( './db');

const blogRouter = require("./routes/blogRouter");
const auth_router = require("./routes/authRouter")

const app = express();
const PORT = 8000;
const HOSTNAME = '0.0.0.0';

app.use(bodyParser.json());
app.use("/", auth_router)
app.use("/blogs", blogRouter)
app.get("/", (req, res) => {
  res.send("welcome to homepage");
});

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

//connect to databse when the application starts
connectToDatabase();

// Article schema
const blogSchema = new mongoose.Schema({

  title: String,
  content: String,
  author: String, // You can reference the User model here
  state: { type: String, enum: ['draft', 'published'], default: 'draft' },
  read_count: { type: Number, default: 0 },
  reading_time: { type: Number, default: 0 },
  tags: [String],
  body: String,
  timestamp: { type: Date, default: Date.now },
});

const blog = mongoose.model('blog', blogSchema);


// Create a new blog
app.post('/blog', (req, res) => {
  const newBlog = new blog(req.body);

  newBlog.save((err, blog) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).json(blog);
    }
  });
});

// Retrieve all blogs
app.get('/blog', (req, res) => {
  blog.find({}, (err, blog) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(blog);
    }
  });
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on port ${PORT}`);
});

//close the databse connection when the application exists
process.on('SIGINT', () => {
    closeDatabaseConnection();
    process.exit();
})
