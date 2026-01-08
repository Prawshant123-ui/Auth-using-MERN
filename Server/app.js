require("dotenv").config(); // MUST be first

// Handle self-signed certificates for SMTP (development)
// Allow self-signed certs globally for development to fix SMTP certificate issues
// WARNING: Only use in development! For production, use proper certificates.
if (process.env.NODE_ENV !== "production") {
  // Allow self-signed certificates for SMTP in development
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log("ℹ️  Development mode: Self-signed certificates are allowed for SMTP");
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const userAuth = require("./middleware/userAuth");


const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   DATABASE
======================= */

// Connect to database before starting server
connectDB().catch((error) => {
  console.error("Failed to connect to database:", error);
  process.exit(1);
});

/* =======================
   GLOBAL MIDDLEWARE
======================= */

// Trust proxy (important for secure cookies in production)
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =======================
   ROUTES
======================= */

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is working" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

/* =======================
   GLOBAL ERROR HANDLER
======================= */

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* =======================
   SERVER
======================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
