const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const chatRouter = require("./chat");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error.message);
  });

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./auth"));
app.use("/api/scores", require("./scores"));
app.use("/api/chat", chatRouter);
app.use("/api/caregiver", require("./caregiver"));
app.use("/api/feedback", require("./feedback"));
app.use("/api/admin", require("./admin"));

app.get("/", (req, res) => {
  res.json({
    message: "MindCare AI Backend is running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MindCare AI",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MindCare backend running on https://mindcare-ai-hesy.onrender.com`);
});