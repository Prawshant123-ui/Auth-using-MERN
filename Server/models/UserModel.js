const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Email verification
    verifyOtp: {
      type: String,
      default: null,
    },

    verifyOtpExpiry: {
      type: Date,
      default: null,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    // Password reset
    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports =
  mongoose.models.User || mongoose.model("User", UserSchema);
