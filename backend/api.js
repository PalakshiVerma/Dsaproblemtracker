const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// connect database
connectDB();

// ✅ FIXED CORS (important)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// middleware
app.use(express.json());

// health route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// problem routes
app.use("/problems", require("./routes/problems"));

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
module.exports.handler = serverless(app);