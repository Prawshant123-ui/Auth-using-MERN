const express = require("express");
const router = express.Router();

const userAuth = require("../middleware/userAuth");
const transporter = require("../config/nodemailer");

const {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyEmail,
  sendResetOtp,
  resetPassword,
  isAuthenticated,
} = require("../controllers/authController");

// Test SMTP endpoint (for debugging - remove in production)
router.get("/test-smtp", async (req, res) => {
  try {
    console.log("Testing SMTP connection...");
    console.log("SMTP_USER:", process.env.SMTP_USER ? "Set" : "Not set");
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Set" : "Not set");
    
    await transporter.verify();
    
    res.status(200).json({
      success: true,
      message: "SMTP connection successful",
      config: {
        host: "smtp-relay.brevo.com",
        port: 587,
        user: process.env.SMTP_USER ? "Configured" : "Not configured",
        pass: process.env.SMTP_PASS ? "Configured" : "Not configured",
      },
    });
  } catch (error) {
    console.error("SMTP Test Error:", error);
    res.status(500).json({
      success: false,
      message: "SMTP connection failed",
      error: {
        message: error.message,
        code: error.code,
        command: error.command,
      },
    });
  }
});


/* =======================
   PUBLIC ROUTES
======================= */

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

/* =======================
   PROTECTED ROUTES
======================= */

router.post("/logout", userAuth, logoutUser);
router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-email", userAuth, verifyEmail);
router.get("/is-auth", userAuth, isAuthenticated);

module.exports = router;
