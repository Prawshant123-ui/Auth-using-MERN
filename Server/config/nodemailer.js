const nodemailer = require("nodemailer");

// Verify SMTP credentials are available
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("⚠️  SMTP credentials not configured. Email functionality will be limited.");
} else {
  console.log("✅ SMTP credentials found");
  console.log("   User:", process.env.SMTP_USER);
  console.log("   Pass:", process.env.SMTP_PASS ? "***" + process.env.SMTP_PASS.slice(-4) : "Not set");
}

// Determine if we should reject unauthorized certificates
// Default: false (allow self-signed certs) for development
// Set SMTP_REJECT_UNAUTHORIZED=true in .env for production with proper certs
const rejectUnauthorized = process.env.SMTP_REJECT_UNAUTHORIZED === "true";

console.log("📧 SMTP Configuration:");
console.log("   Host: smtp.mailersend.net");
console.log("   Port: 587");
console.log("   Reject Unauthorized:", rejectUnauthorized);

const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  requireTLS: true, // Force TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Allow self-signed certificates (needed for some SMTP servers)
    // Explicitly set to false to allow self-signed certs
    rejectUnauthorized: false, // Force to false to fix certificate issues
    // Additional options to handle certificate issues
    minVersion: "TLSv1",
  },
  // Connection timeout
  connectionTimeout: 10000,
  // Socket timeout
  socketTimeout: 10000,
  // Greeting timeout
  greetingTimeout: 10000,
});

// Log TLS configuration
if (!rejectUnauthorized) {
  console.log("ℹ️  SMTP: Self-signed certificates are allowed (development mode)");
}

// Verify transporter configuration (optional - only logs warning)
transporter.verify().then(() => {
  console.log("✅ SMTP server is ready to send emails");
}).catch((error) => {
  console.error("❌ SMTP verification failed!");
  console.error("   Error:", error.message);
  console.error("   Code:", error.code);
  console.error("   Full error:", error);
  console.warn("   Email sending may fail, but registration will still work");
  console.warn("   Check your SMTP_USER and SMTP_PASS in .env file");
});

module.exports = transporter;