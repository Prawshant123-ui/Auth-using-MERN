const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const transporter = require("../config/nodemailer");

/* =======================
   HELPERS
======================= */

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
const otpExpiryTime = () => new Date(Date.now() + 15 * 60 * 1000);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const publicUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isAccountVerified: user.isAccountVerified,
});

/* =======================
   AUTH CONTROLLERS
======================= */

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error. Please contact support." 
      });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.error("Database not connected. ReadyState:", mongoose.connection.readyState);
      return res.status(503).json({ 
        success: false, 
        message: "Database connection unavailable. Please try again later." 
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    // Send welcome email (non-blocking - don't fail registration if email fails)
    transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to the Platform",
      text: `Welcome ${name}, your account has been successfully created.`,
    }).catch((emailError) => {
      console.error("Failed to send welcome email:", emailError.message);
      // Don't throw - registration should succeed even if email fails
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { id: user._id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Registration failed. Please try again." 
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: publicUserResponse(user),
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const isAuthenticated = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      userData: publicUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =======================
   EMAIL VERIFICATION
======================= */

const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    const otp = generateOtp();

    user.verifyOtp = otp.toString();
    user.verifyOtpExpiry = otpExpiryTime();
    await user.save();

    console.log(`📧 Sending OTP email to: ${user.email}`);
    console.log(`🔑 Generated OTP: ${otp} (for testing - remove in production)`);

    // Send verification email (non-blocking - don't fail if email fails)
    transporter.sendMail({
      from: `"SkulManage" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Email Verification OTP - SkulManage",
      text: `Hello ${user.name},\n\nYour email verification OTP is: ${otp}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nSkulManage Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Email Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Your email verification OTP is:</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #4F46E5; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in <strong>15 minutes</strong>.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #6B7280; font-size: 12px;">Best regards,<br>SkulManage Team</p>
        </div>
      `,
    }).then((info) => {
      console.log("✅ Verification email sent successfully!");
      console.log("   Message ID:", info.messageId);
      console.log("   Response:", info.response);
      console.log("   To:", user.email);
    }).catch((emailError) => {
      console.error("❌ Failed to send verification email!");
      console.error("   To:", user.email);
      console.error("   Error message:", emailError.message);
      console.error("   Error code:", emailError.code);
      console.error("   Command:", emailError.command);
      console.error("   Response:", emailError.response);
      // Don't throw - OTP is saved, user can request again if needed
      // Log the error but don't fail the request
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error("Send verify OTP error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to send verification OTP" 
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    if (!otp || otp.toString().length !== 6) {
      return res.status(400).json({ success: false, message: "Please enter a valid 6-digit OTP" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.verifyOtp) {
      return res.status(400).json({ 
        success: false, 
        message: "No verification OTP found. Please request a new one." 
      });
    }

    if (user.verifyOtpExpiry < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: "OTP has expired. Please request a new one." 
      });
    }

    if (user.verifyOtp !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Account verified successfully" });

  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Verification failed. Please try again." 
    });
  }
};

/* =======================
   PASSWORD RESET
======================= */

const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOtp();

    user.resetOtp = otp.toString();
    user.resetOtpExpiry = otpExpiryTime();
    await user.save();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is ${otp}`,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (
      !user.resetOtp ||
      user.resetOtp !== otp.toString() ||
      user.resetOtpExpiry < new Date()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =======================
   EXPORTS
======================= */

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  isAuthenticated,
  sendVerifyOtp,
  verifyEmail,
  sendResetOtp,
  resetPassword,
};
