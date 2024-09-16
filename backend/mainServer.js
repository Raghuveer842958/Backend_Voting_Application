const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = 5000;

// connect database

const db = require("./db");

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

// Define routes
const userRoutes = require("./routes/userRoutes");
app.use(userRoutes);
const candidateRoutes = require("./routes/candidateRoutes");
app.use(candidateRoutes);
const voteRoutes = require("./routes/voteRoutes");
app.use(voteRoutes);

app.get("/", (req, res) => {
  console.log("Welcome in My application!!!");
  res.send("Welcome in My application!!!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
