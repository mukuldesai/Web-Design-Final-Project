const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: "./server/config/.env" });

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("secretcode"));

// MongoDB connection setup
// MongoDB connection setup
const DB = process.env.MONGO_URI.replace(
  "<Stockify>",
  process.env.MONGO_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1); // Exit process if unable to connect to MongoDB
});

// Routes setup
const authRouter = require("./routes/authRoutes");
const dataRouter = require("./routes/dataRoutes");
const newsRouter = require("./routes/newsRoutes");
const stockRouter = require("./routes/stockRoutes");

app.use("/api/auth", authRouter);
app.use("/api/data", dataRouter);
app.use("/api/news", newsRouter);
app.use("/api/stock", stockRouter);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
