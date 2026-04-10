const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// connect database
connectDB().catch(err => console.error("Initial DB connection failed:", err));

app.use(cors());
app.use(express.json());

// Main router for all /api calls
const apiRouter = express.Router();

// health route
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok", environment: "serverless" });
});

// problem routes
apiRouter.use("/problems", require("./routes/problems"));

// Mount the router
// On Netlify, requests are often prefixed or redirected. These mounts cover all cases.
app.use("/.netlify/functions/api", apiRouter);
app.use("/api", apiRouter);
app.use("/", apiRouter); 

module.exports = app;
module.exports.handler = serverless(app);