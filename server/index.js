const port = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require('dotenv');
env.config();
app.use(
  cors({
    origin: "*",
  })
);

const logStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
const errorStream = fs.createWriteStream(path.join(__dirname, "error.txt"), {
  flags: "a",
});

const authroutes = require("./routers/auth");
const taskroutes = require("./routers/task");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const now = new Date();
  const time = `${now.toLocaleTimeString()}`;
  const log = `${req.method} ${req.originalUrl} ${time}`;
  logStream.write(log + "\n");
  next();
});
app.use("/api/auth", authroutes);
app.use("/api/task", taskroutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use((err, req, res, next) => {
  const now = new Date();
  const time = `${now.toLocaleTimeString()}`;
  const error = `${req.method} ${req.originalUrl} ${time}`;
  errorStream.write(error + err.stack + "\n");
  res.status(500).send("Internal Server Error");
});

app.use((req, res, next) => {
  const now = new Date();
  const time = `${now.toLocaleTimeString()}`;
  const error = `${req.method} ${req.originalUrl} ${time}`;
  errorStream.write(error + "\n");
  res.status(404).send("Route Not Found");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected successfully"))
  .catch((e) => console.log(e));

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
